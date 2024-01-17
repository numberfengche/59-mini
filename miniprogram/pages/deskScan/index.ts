import { request } from "../../utils/net";
Page({
  data: {
    navBarHeight: getApp().globalData.navBarHeight,//导航栏高度
    top: wx.getMenuButtonBoundingClientRect().top,
    select: true,
    active: 0,
    navList: [],
    swiggerList: [],
    goodsList: [] as any,
    showGetPhoneMenu: false,
    showDeskTypeMenu: false,
    showNumSheet: false,
    showKeyBoard: false,
    showCartSheet: false,//cart
    passport: "",
    scene: "",
    is_vip: false,
    is_chang: false,//是否畅饮
    trade_id: "",//订单号
    scrollPos: 0,
    topPos: [],
    scrolling: false, // 是否正在滚动
    showBag: false,
    showPriceSheet: false,
    countOfMember: 0,//畅饮人数
    cartList: [],//购物车列表
    cartTotal: 0,
    leftTotal: {},
    isTopVipMenu:false,
    isinit:false,
    is_unpaid:false,//待处理订单
    unpaidda_dialog:false
  },
  onLoad(options: any) {
    console.log(options);
    const { scene } = options;
    getApp().globalData.scene = scene,
      this.setData({ scene: scene, showBag: false })
    this.getMenu(scene);
    const token = getApp().globalData.token;
    const vip_expire_time = getApp().globalData.vip_expire_time;
    // 检查VIP是否过期
    if (token) {
      let currentDate = new Date();
      let expireDate = new Date(vip_expire_time);
      let isExpired = currentDate > expireDate;
      if (isExpired) {
        console.log("已过期");
        this.wxlogin()
      } else {
        console.log("未过期");
        this.getsession()
      }
    } 
    // else {
    //   this.wxlogin()
    // }
  },
  //静默
  wxlogin() {
    this.setData({
      showBag: false
    })
    wx.login({
      success: (res: any) => {
        console.log(res);
        this.silentLogin(res.code);
      },
      fail: () => {
      },
    });
  },
  //手动登录
  manuallogin() {
    wx.login({
      success: (res: any) => {
        console.log(res);
        this.silentLogin(res.code);
      },
      fail: () => {
      },
    });
  },
  //静默登录
  silentLogin(code: string) {
    request({
      url: "/api/beer/minic/user/login/silent",
      method: "POST",
      showMessage: false,
      data: { code },
      success: ({ data }: any) => {
        if (!data.has_token) {
          this.setData({
            showGetPhoneMenu: true,
            passport: data.passport,
          })
        } else {
          //已登录
          this.setData({
            showBag: true
          })
          wx.setStorageSync('token', data.token.token)
          wx.setStorageSync('vip_expire_time', data.expire_at)
          getApp().globalData.token = data.token.token,
            //登录后检查用户身份
            this.getsession()
        }
        console.log(data);
      },
      fail: () => {

      }
    });
  },
  //关闭弹窗
  setMenu() {
    this.setData({
      showGetPhoneMenu: false
    })
  },
  //手机号登录
  phoneLogin(code: string) {
    request({
      url: "/api/beer/minic/user/login/mobile",
      method: "POST",
      data: {
        passport: this.data.passport,
        code: code
      },
      success: ({ data }: any) => {
        wx.setStorageSync('token', data.token.token)
        wx.setStorageSync('vip_expire_time', data.expire_at)
        getApp().globalData.token = data.token.token
        this.setData({
          showBag: true
        })
        //登录后检查用户身份
        this.getsession()
      },
    });
  },
  //购物车交互
  changeCart() {
    console.log("执行");
    this.getCartNum(this.data.scene)
  },
  //获取菜品信息
  getMenu(scene: string) {
    request({
      url: "/api/beer/minic/order/menu",
      data: { scene },
      success: ({ data }: any) => {
        this.setData({
          navList: data.category_list,
          swiggerList: data.category_list.slice(0, 1),
          goodsList: data.category_list.slice(1),
        })
      },
    });
  },
  //购物车列表
  getCartNum(scene: string) {
    request({
      url: "/api/beer/minic/order/cart/list",
      data: {
        scene: scene
      },
      success: ({ data }: any) => {
        console.log(data);
        let dict = data.category_list;
        let arr = this.data.navList as any;
        arr = arr.map((item: any) => {
          if (dict[item.category_id]) {
            return { ...item, num: dict[item.category_id] }
          } else {
            const { num, ...rest } = item;
            return rest;
          }
        });
        console.log(this.data.swiggerList,
          this.data.goodsList);
        console.log(data.list);
        // 列表数量
        let arr1 = data.list;//左侧小标
        let arr2 = this.data.goodsList;//商品数
        let arr3 = this.data.swiggerList;//畅饮数
        arr3.forEach((obj2: any) => {
          obj2.item_list.forEach((item2: any) => {
            let found = false;
            arr1.forEach((obj1: any) => {
              if (obj1.item_id === item2.item_id) {
                found = true;
                item2.cart_num = obj1.cart_num;
              }
            })
            if (!found) item2.cart_num = 0;
          });
        });
        arr2.forEach((obj2: any) => {
          obj2.item_list.forEach((item2: any) => {
            let found = false;
            arr1.forEach((obj1: any) => {
              if (obj1.item_id === item2.item_id) {
                found = true;
                item2.cart_num = obj1.cart_num;
              }
            })
            if (!found) item2.cart_num = 0;
          });
        });
        console.log(arr3);
        console.log(arr2);
        this.setData({
          cartList: data.list,
          goodsList: arr2,
          swiggerList: arr3,
          navList: arr,
          cartTotal: data.total_cart_num,
          leftTotal: data.category_list,
        })
      },
    });
  },
  //左侧类目
  activeNav(e: any) {
    var index = e.currentTarget.dataset.index
    console.log("item" + index);
    this.setData({
      active: index,
      scrolling: true,
      selectId: "item" + index
    })
  },
  //畅饮开台
  onclick() {
    if (this.data.is_vip) {
      this.setData({
        select: true,
        showDeskTypeMenu: false,
        showNumSheet: true,
      })
    } else {
      this.setData({
        select: true,
        isTopVipMenu:false,
        showPriceSheet: true,
        showDeskTypeMenu: false,
      })
    }

  },
  //单点开台
  onclick_select() {
    this.setData({
      select: false,
      showDeskTypeMenu: false
    })
    this.deskBegin(0);
  },
  //会话信息
  getsession() {
    request({
      url: "/api/beer/minic/session",
      success: ({ data, code }: any) => {
        console.log(code);
        if (code === 0) {
          this.setData({
            is_vip: data.is_vip,
            showBag: true
          })
         
          //检查桌台信息
          this.deskInformation();
        } else {
          this.wxlogin()
        }
      },
    });
  },
  //桌台信息
  deskInformation() {
    request({
      url: "/api/beer/minic/order/trade/simple",
      data: {
        scene: this.data.scene
      },
      success: ({ data }: any) => {
        console.log(data);
        if (data.trade_id === 0) {
          this.setData({
            showDeskTypeMenu: true
          })
        } else {
          this.getCartNum(this.data.scene);
        }
         //未处理订单        
        if(data.is_unpaid){
          this.setData({
            unpaidda_dialog:true,
          })
        }else{
          this.setData({
            unpaidda_dialog:false,
          })
        }
      },
    });
  },
  //自填人数开台
  buffetdeskBegin(e: any) {
    this.deskBegin(e.detail)
  },
  //开台
  deskBegin(chang_count: number) {
    request({
      url: "/api/beer/minic/order/trade/create",
      method: "POST",
      data: {
        scene: this.data.scene,
        chang_count: chang_count
      },
      success: ({ data }: any) => {
        console.log(data);
        this.setData({
          countOfMember:chang_count
        })
        this.getCartNum(this.data.scene);
      },
    });
  },
  //获取手机号
  getPhoneNumber(e: any) {
    console.log(e.detail.code);
    console.log(e);
    this.setData({ showGetPhoneMenu: false });
    if (e.detail.code) {
      this.phoneLogin(e.detail.code)
    } else {
      this.setData({
        showGetPhoneMenu: true
      })
    }
  },
  //关闭人数弹窗
  colseSheet() {
    this.setData({
      showNumSheet: false,
      showKeyBoard: true,
    })
  },
  //选人数点餐
  bigen() {
    this.setData({
      showNumSheet: false,
    })
    this.deskBegin(getApp().globalData.counting)
  },
  onShow(){
    if(this.data.isinit){
      // this.getCartNum(this.data.scene);
      this.deskInformation()
    }
  },
  onReady() {
    let _this = this;
    wx.nextTick(() => {
      _this.getEachCategoryPosition();
    });
  },
  getEachCategoryPosition: function () {
    let _this = this;
    const query = wx.createSelectorQuery();
    query.selectAll('.subtitle').boundingClientRect(function (rects: any) {
      let topPos = rects.map((item: any, index: any) => {
        console.log(item);
        if (index === 0) {
          return 0;
        } else {
          let top = 0;
          for (let i = 0; i < index; i++) {
            top += rects[i].height;
          }
          return top;
        }
      });
      _this.setData({
        topPos: topPos
      });
    }).exec();
  },
  //滑动
  handleScroll: function (e: any) {
    if (this.data.scrolling) {
      return;
    }
    let scrollTop = e.detail.scrollTop;
    let { topPos } = this.data;
    let index = topPos.findIndex((value, i, array) => {
      return scrollTop < value
    });
    this.setData({
      active: index === -1 ? topPos.length - 1 : index - 1
    });
  },
  handleScrollLower: function (e: any) {
    this.setData({
      scrolling: false
    });
  },
  //会员购买弹窗关闭
  closeSheet() {
    if(this.data.isTopVipMenu){
      this.setData({
        showPriceSheet: false,
      })
    }else{
      this.setData({
        showPriceSheet: false,
        showNumSheet: true,
      })
    }
  },
  //关闭会员弹窗
  closePriceSheet() {
    if(this.data.isTopVipMenu){
      this.setData({
        showPriceSheet: false,
      })
    }else{
      this.setData({
        showPriceSheet: false,
        showDeskTypeMenu: true,
      })
    }
  },
  //关闭购物车
  closeCartSheet() {
    this.setData({
      showCartSheet: false
    })
  },
  //打开cart
  openBag() {
    this.setData({
      showCartSheet: true
    })
  },
  //开通会员
  openmember(){
   this.setData({
    isTopVipMenu:true,
     showPriceSheet:true
   })
  },
  //清空购物车
  clear(){
    request({
      url: "/api/beer/minic/order/cart/clear",
      method: "POST",
      data: {
        scene: this.data.scene,
      },
      success: ({ data }: any) => {
        console.log(data);
        this.getCartNum(this.data.scene);
      },
    });
  },
  //创建订单
  creatOrder(){
      if(this.data.cartList.length===0){
         wx.showToast({
           title:"请先选择菜品",
           icon:"none"
         })
      }else{
        wx.navigateTo({
          url:"/pages/confirmation/index"
        })
        this.setData({
          isinit:true
        })
      }
  },
  gosearch(){
    wx.navigateTo({
      url:"/pages/search/index"
    })
    this.setData({
      isinit:true
    })
  },
  //分享
  onShareAppMessage() {

  },
  //查看订单
  gorder(){
    wx.redirectTo({
      url:`/pages/order_pay/index?scene=${this.data.scene}`
    })
  },
  //取消订单
  cancel(){
    // request({
    //   url: "/api/beer/minic/order/cart/clear",
    //   method: "POST",
    //   data: {
    //     scene: this.data.scene,
    //   },
    //   success: ({ data }: any) => {
    //     console.log(data);
    //     this.getCartNum(this.data.scene);
    //   },
    // });
  },
  //查看订单
  goIndex(){
    wx.navigateTo({
      url:"/pages/index/index"
    })
  }
})