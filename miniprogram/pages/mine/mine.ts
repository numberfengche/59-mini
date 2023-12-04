// pages/mine/mine.ts
import { request } from "../../utils/net";

Page({
    /**
     * 页面的初始数据
     */
    data: {
        navBarHeight: getApp().globalData.navBarHeight,//导航栏高度
        top: wx.getMenuButtonBoundingClientRect().top,
        showLogin: getApp().globalData.showLogin,
        avatar: getApp().globalData.avatar,
        name: getApp().globalData.name,
        phone: "",
        calendar: {} as any
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
      this.setData({
        phone:getApp().globalData.phone
      })
      this.getpoints()
        getApp().watch('phone', this.watchBack);
    },
    watchBack: function (name: any, value: any) {
        if (name === 'phone') {
            this.setData({
                phone: getApp().globalData.phone,
            });
            this.getpoints()
            this.onLoad()
        }
    },
    login() {
        this.setData({
            showLogin: true
        })
        getApp().globalData.showLogin = true;
        console.log(getApp().globalData.showLogin);
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    goOrder(e:any) {
        console.log(e.currentTarget.dataset.id);
        
  wx.navigateTo({
      url:`/pages/order/order?id=${e.currentTarget.dataset.id}`
  })
    },
    //跳转
    goaddress(){
        wx.navigateTo({ url: `/pages/address/index` })
    },
    //rili
    getpoints() {
        request({
            url: "/api/mini/points/calendar",
            success: ({ data }: any) => {
                console.log(data);
                this.setData({ calendar: data })
            },
            fail: () => {
            },
        });
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },
    signIn() {
        request({
            url: "/api/mini/points/check-in",
            method: "POST",
            // data: this.data.searchInformation,
            success: ({ data }: any) => {
                this.getpoints()
            },
            fail: () => {
                // this.setData({ loading: false });
            },
        });
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






