import { request } from "../../utils/net";

// pages/index/index.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navBarHeight: getApp().globalData.navBarHeight,//导航栏高度
    top: wx.getMenuButtonBoundingClientRect().top,
    islogin: false,
    showGetPhoneMenu: false,
    passport: "",
    is_vip: false,
    showPriceSheet:false,
    info: {},
    money: {},
    list: [] as any,
    cursor: 0,
    imageList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    const token = getApp().globalData.token;
    const vip_expire_time = getApp().globalData.vip_expire_time;
    if (token) {
      let currentDate = new Date();
      let expireDate = new Date(vip_expire_time);
      let isExpired = currentDate > expireDate;
      if (isExpired) {
        this.wxlogin()
      } else {
        console.log("token未过期");
        this.setData({
          islogin: true,
        })
        this.getsession()
        this.discount()
      }
    }
    else {
      this.setData({
        islogin: false,
      })
    }
  },

  //静默
  wxlogin() {
    wx.login({
      success: (res: any) => {
        console.log(res);
        this.silentLogin(res.code);
      },
      fail: () => {
      },
    });
  },
  getsession() {
    request({
      url: "/api/beer/minic/session",
      success: ({ data, code }: any) => {
        console.log(code);
        if (code === 0) {
          this.setData({
            info: data
          })
          this.getList();
        } else {
          this.wxlogin()
        }
      },
    });
  },
  discount() {
    request({
      url: "/api/beer/minic/vip/discount",
      success: ({ data, code }: any) => {
        if (code === 0) {
          this.setData({
            money: data
          })
        }
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
            showBag: true,
            islogin: true,
          })
          wx.setStorageSync('token', data.token.token)
          getApp().globalData.token = data.token.token
          this.getsession()
          this.discount()
        }
      },
      fail: () => {

      }
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
        this.setData({
          islogin: true,
        })
        wx.setStorageSync('token', data.token.token)
        getApp().globalData.token = data.token.token
        this.getsession()
        this.discount()
      },
    });
  },
  logout() {
    request({
      url: "/api/beer/minic/logout",
      method: "POST",
      success: ({ data }: any) => {
        wx.setStorageSync('token', '');
        wx.setStorageSync('vip_expire_time', '')
        wx.showToast({
          title: "退出成功",
          icon: "none"
        })
        this.setData({
          islogin: false
        })
      },
    });
  },
  getList() {
    request({
      url: "/api/beer/minic/trade/list",
      data: {
        cursor: this.data.cursor
      },
      success: ({ data }: any) => {
        console.log(data);
        if (data.list.length > 0) {
          this.setData({
            list: [...this.data.list, ...data.list],
            cursor: data.cursor
          })
        }
      }
    });

  },
  openMember() {
     this.setData({
      showPriceSheet:true
     })
  },
  closeSheet(){
    this.setData({
      showPriceSheet:false
     })
     this.getsession();
  },
  closePriceSheet() {
    this.setData({
      showPriceSheet:false
     })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  godetail(e:any) {
     console.log(e.currentTarget.dataset.id);
     const{id}=e.currentTarget.dataset
     wx.navigateTo({
       url:`/pages/detail/index?trade_id=${id}`
     })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})