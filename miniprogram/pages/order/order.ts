import { request } from "../../utils/net";

// pages/order/order.ts
Page({

    /**
     * 页面的初始数据
     */
    data: {
        scene: getApp().globalData.scene,
        list:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        this.setData({
            scene: getApp().globalData.scene,
        })
        request({
            url: `/api/mall/minic/desk/trade/menu`,
            data: {
                scene: this.data.scene
            },
            success: (val: any) => {
                console.log(val);
                // const { list } = val.data;
                this.setData({
                    list: val.data.batch_list,
                })
            },
            fail: () => {
            },
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
// this.setData
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