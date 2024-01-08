import { request } from "../../utils/net";

// pages/goods/goods.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navBarHeight: getApp().globalData.navBarHeight,//导航栏高度
    top: wx.getMenuButtonBoundingClientRect().top,
    select: true,
    active: 0,
    navList:[],
    swiggerList:[],
    goodsList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options:any) {
 console.log(options);
 const {scene }=options;
 console.log(scene);
 
 this.getMenu(scene);
//  this.getCartNum(scene);
  },

   //获取菜品信息
  getMenu(scene:string){
   request({
      url: "/api/beer/minic/order/menu",
      data: {scene},
      success: ({data}:any) => {
        console.log(data);
        console.log(data.category_list.slice(0,1),);
        
        this.setData({
          navList:data.category_list,
          swiggerList:data.category_list.slice(0,1),
          goodsList:data.category_list.slice(1),
        })
      },
    });
  },
  getCartNum(scene:string){

  },
  activeNav(e: any) {
    var index = e.currentTarget.dataset.index
    console.log("item" + index);
    this.setData({
        active: index,
        selectId: "item" + index
    })
},
  onclick() {
    this.setData({
      select: true
    })
  },
  onclick_select() {
    this.setData({
      select: false
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
   
  


  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },
   
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },
  getPhoneNumber(e: any) {
    console.log(e.detail.code);
    console.log(e);
    // this.setData({ loading: true });
    // request({
    //   url: "/api/mp/user/save-phone",
    //   method: "POST",
    //   data: { code: e.detail.code },
    //   success: () => {
    //     this.setData({ loading: false });
    //     wx.reLaunch({ url: "/pages/profile/index" });
    //     // wx.showToast({
    //     //   title: "登录成功",
    //     //   icon: "success",
    //     //   success: () => {
    //     //     wx.reLaunch({ url: "pages/profile/index" });
    //     //   },
    //     //   fail: () => {
    //     //     this.setData({ loading: false });
    //     //   },
    //     // });
    //   },
    // });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})