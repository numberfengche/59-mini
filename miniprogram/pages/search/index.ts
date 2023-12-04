import { request } from "../../utils/net";

// pages/search/index.ts
Page({
    /**
     * 页面的初始数据
     */
    data: {
        value: "",
        list: [],
        listcar: [],
        scene: getApp().globalData.scene,
        num: 0,
        show: false,
        info: "",
        finel: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        this.setData({
            scene: getApp().globalData.scene,
        })
    },
    onOk() {
        const scene = getApp().globalData.scene
        // var url = encodeURI(`/api/yak/desk/item/search?sence=${scene}&keyword=${this.data.value}`)
        request({
            url: "/api/mall/minic/desk/item/search",
            data: {
                scene,
                keyword: encodeURI(this.data.value)
            },
            success: ({ data }: any) => {
                const { list } = data
                console.log(list);
                if (list.length === 0) {
                    this.setData({
                        info: "没有该商品~"
                    })
                }
                this.setData({ list: list });
            },
        });
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },
    onClickButton() {

        var _that = this;
        var list = _that.data.listcar
        console.log(list);
        const listfinel = list.filter((item: any) => item.is_valid !== false)
        console.log(listfinel);
        if (listfinel.length === 0) {
            wx.showToast({
                title: "请核对检查商品~",
                icon: "none"
            })
        }


        wx.navigateTo({
            url: "/pages/payment/index",
            events: {
                acceptDataFromOpenedPage: function (item: any) {
                    console.log(item)
                },
            },
            success: function (res) {
                res.eventChannel.emit('acceptDataFromOpenerPage', { data: listfinel })
            }
        })
    },
    getnum() {
        request({
            url: "/api/mall/minic/desk/cart/list",
            data: {
                scene: this.data.scene
            },
            success: ({ data }: any) => {
                const { list } = data
                console.log(list);
                this.setData({ listcar: list, num: list.length });
            },
        });
    },
    //弹窗
    showsheet() {
        this.setData({
            show: !this.data.show
        })
    },
    click() {
        this.setData({
            show: false
        })
    },
    clear() {
        request({
            url: "/api/mall/minic/desk/cart/clear",
            method: "POST",
            data: {
                scene: this.data.scene
            },
            success: ({ data }: any) => {
                this.getnum();
                //   this.getfoods()
                this.setData({
                    show: false
                })
            },
        });
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.getnum()
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