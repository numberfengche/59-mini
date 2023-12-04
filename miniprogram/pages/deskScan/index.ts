
import { request } from "../../utils/net";

// pages/loading/index.ts
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options:any) {
          console.log(options);
          getApp().globalData.scene=options.scene
               request({
                url: "/api/mall/minic/desk/info",
                data: {
                    scene:this.options.scene
                },
                success: ({ data }: any) => {
                    console.log(12312313123);
                    
                    console.log(data);
                    getApp().globalData.shopName=data.desk_name;
                    getApp().globalData.tabelnumber=data.shop_name;
                    const {trade_id}=data
                    if(trade_id>0){
                    wx.redirectTo({
                        url:"/pages/square/square"
                    })
                    }else{
                        wx.redirectTo({
                            url:"/pages/loading/index"
                        }) 
                    }
                },
                fail: () => {
                    console.log(1231231);
                    
                  // this.setData({ loading: false });
                },
              });
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