import { request } from "../../utils/net";

Page({
    data: {
        list: [],
        sub_title: "",
        sum_item_price_str: "",
        title: "",
        scene: getApp().globalData.scene,
        table: getApp().globalData.shopName
    },
    onLoad() {
        this.setData({
            table: getApp().globalData.shopName,
            scene: getApp().globalData.scene,
        })
        this.getorder()
        var timer = setInterval(() => {
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
                        sub_title: val.data.sub_title,
                        sum_item_price_str: val.data.sum_item_price_str,
                        title: val.data.title,
                    })
                },
                fail: () => {
                    clearInterval(timer)
                },
            });

        }, 10000)




    },
    onClickButton() {
        wx.navigateTo({
            url: "/pages/square/square",
        })
    }, onUnload() {

    },
    getorder() {
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
                    sub_title: val.data.sub_title,
                    sum_item_price_str: val.data.sum_item_price_str,
                    title: val.data.title,
                })
            },
            fail: () => {

            },
        });

    }
})