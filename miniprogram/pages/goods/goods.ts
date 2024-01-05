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
    navList:[
     {
      category_id:0,
      category_name:"畅饮系列"
     },
     {
      category_id:1,
      category_name:"原浆精酿"
     },
     {
      category_id:2,
      category_name:"进口风味"
     }
     ,{
      category_id:3,
      category_name:"国产风味"
     },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})