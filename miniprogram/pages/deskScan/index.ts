import { request } from "../../utils/net";

Page({
  data: {
    navBarHeight: getApp().globalData.navBarHeight,//导航栏高度
    top: wx.getMenuButtonBoundingClientRect().top,
    select: true,
    active: 0,
    navList: [],
    swiggerList: [],
    goodsList: [],
    showGetPhoneMenu: false,
    showDeskTypeMenu: false,
    showNumSheet: false,
    showKeyBoard: false,
    passport: "",
    scene: "",
    is_vip: false,
    is_chang: false,//是否畅饮
    trade_id: "",//订单号
    scrollPos: 0,
    topPos: [],
    scrolling: false, // 是否正在滚动
    showBag:false,
    showPriceSheet:false,
    cartList:[],//购物车列表
    category_list:[]//左侧数量
  },
  onLoad(options: any) {
    console.log(options);
    const { scene } = options;
    getApp().globalData.scene = scene,
    console.log(scene);
    this.setData({ scene: scene,showBag:false })
    this.getMenu(scene);
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
          this.setData({
            showBag:true
          })
          getApp().globalData.token = data.token.token,
         setTimeout(() => {
          this.getCartNum(this.data.scene)
         }, 100);
            this.deskInformation();
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
        getApp().globalData.token = data.token.token
        this.setData({
          showBag:true
        })
        setTimeout(() => {
          this.getCartNum(this.data.scene)
         }, 100);
        this.deskInformation();
      },
    });
  },
//购物车交互
changeCart(){
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
        this.setData({
          cartList:data.list,
          category_list:data.category_list,
        })
      },
    });
  },
  activeNav(e: any) {
    var index = e.currentTarget.dataset.index
    console.log("item" + index);
    this.setData({
      active: index,
      scrolling: true,
      selectId: "item" + index
    })
  },
  //开台
  onclick() {
    // 
    if(this.data.is_vip){
      this.setData({
        select: true,
        showDeskTypeMenu: false,
        showNumSheet: true,
      })
    }else{
      this.setData({
        select: true,
        showPriceSheet:true,
        showDeskTypeMenu: false,
      })
    }
    
  },
  onclick_select() {
    this.setData({
      select: false,
      showDeskTypeMenu: false
    })
    this.deskBegin(0);
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
        }
        this.setData({
          is_chang: data.is_chang,
          is_vip: data.is_vip
        })
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
        // if (data.trade_id === 0) {
        //   this.setData({
        //     showDeskTypeMenu: true
        //   })
        // }
        this.getCartNum(this.data.scene);
        this.setData({
          is_chang: data.is_chang,
          is_vip: data.is_vip
        })
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
  bigen() {
    this.setData({
      showNumSheet: false,
    })
    this.deskBegin(getApp().globalData.counting)
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
    console.log(topPos);

    let index = topPos.findIndex((value, i, array) => {
      return scrollTop < value
    });
    console.log(index);
    this.setData({
      active: index === -1 ? topPos.length - 1 : index - 1
    });
  },
  handleScrollLower: function (e: any) {
    this.setData({
      scrolling: false
    });
  },
  closeSheet(){
   console.log("我在执行");
   this.setData({
    showPriceSheet:false,
  })
  },
    //关闭会员弹窗
    closePriceSheet(){
      this.setData({
        showPriceSheet:false,
        showDeskTypeMenu:true
      })
    },
  //分享
  onShareAppMessage() {

  },

})