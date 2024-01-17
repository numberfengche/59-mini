import { request } from "../../utils/net";

// pages/detail/index.ts
Page({

    /**
     * 页面的初始数据
     */
    data: {
      navBarHeight: getApp().globalData.navBarHeight,//导航栏高度
      info:{} as any,
      scene:""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad({scene}) {
     console.log(scene);
     this.setData({
       scene:scene
     })
     request({
      url: "/api/beer/minic/order/trade/detail",
      data: {
        scene: scene
      },
      success: ({ data }: any) => {
        console.log(data);
        this.setData({
          info:data
        })
      }
    });
    },
    gohome(){
     wx.navigateTo({
       url:`/pages/deskScan/index?scene=${this.data.scene}`
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})