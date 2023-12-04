import { request } from "../../utils/net";

// pages/payment/index.ts
Page({

    /**
     * 页面的初始数据
     */
    data: {
        source: [],
        remark: "",
        tabel: "",
        num: getApp().globalData.num
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        this.setData({
            tabel: getApp().globalData.tabelnumber,
            num: getApp().globalData.num
        })
        var _this = this
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.on('acceptDataFromOpenerPage', function (data) {
            console.log(data);
            const dataInfo = data.data
            _this.setData({
                source: dataInfo
            });
        })
    },
    getvalue(e: any) {
        console.log(e.detail.value);
        this.setData({
            remark: e.detail.value
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
    back() {
        wx.navigateTo({
            url: "/pages/square/square",
        })
    },
    checkOrder() {
        const list = this.data.source
        const item_list = list.map((item: any) => {
            return {
                item_id: item.item_id,
                num: item.cart_num
            }
        })
        console.log(item_list);
        request({
            url: "/api/mall/minic/desk/trade/create",
            method: "POST",
            data: {
                scene: getApp().globalData.scene,
                remark: this.data.remark,
                item_list
            },
            success: ({ data }: any) => {
                console.log(data);
                wx.navigateTo({
                    url: "/pages/check/index"
                })
                // this.getnum();
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