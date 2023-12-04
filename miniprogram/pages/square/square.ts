import { request } from "../../utils/net";

Page({
    data: {
        active: 0,
        navList: [],
        goods: [],
        num: 0,
        scene: getApp().globalData.scene,
        list: [],//购物车
        show: false,
        selectId: "",
        heightArr: [],
        distance: 0,
        name: getApp().globalData.shopName,

        finel: false
    },
    onLoad: function () {
        this.setData({
            scene: getApp().globalData.scene,
            name: getApp().globalData.shopName
        })
        // ,selectId:"item" + data.list[0].category_id
    },
    click() {
        this.setData({
            show: false
        })
    },
    onShow() {
        this.getnum()
        this.getfoods()
    },
    // 切换
    activeNav(e: any) {
        var index = e.currentTarget.dataset.index
        console.log("item" + index);

        this.setData({
            active: index,
            selectId: "item" + index
        })
        // request({
        //     url: `/api/yak/desk/item/search?scene=${this.data.scene}&category_id=${index}`,
        //     success: ({ data }: any) => {
        //         const { list } = data;
        //         this.setData({ goods: list })
        //     },
        //     fail: () => {
        //     },
        // });



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
                this.setData({ list: list, num: list.length });
            },
        });
    },
    //弹窗
    showsheet() {
        this.setData({
            show: !this.data.show
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
                this.getfoods()
                this.setData({
                    show: false
                })
            },
        });
    },
    //所有菜品
    getfoods() {
        request({
            url: "/api/mall/minic/desk/item/total",
            data: {
                scene: this.data.scene
            },
            success: ({ data }: any) => {
                console.log(data);
                this.setData({
                    navList: data.list, active: data.list[0].category_id
                });
                // this.getnum();
            },
        });
    },
    // selectHeight() {
    //     var list = [] as any
    //     var height = 0;
    //     const query = wx.createSelectorQuery();
    //     query.selectAll('.subtitle').boundingClientRect()
    //     query.exec((res) => {
    //       res[0].forEach((item:any) => {
    //         height += item.height;
    //         list.push(height)
    //       })
    //       this.data.heightArr = list
    //     })
    //   },
    //   watchScroll(e:any) {
    //     let scrollTop = e.detail.scrollTop; //获取距离顶部的距离
    //     let active = this.data.active as any;
    //     if (scrollTop >= this.data.distance) {
    //       if (active + 1 < this.data.heightArr.length && scrollTop >= this.data.heightArr[active]) {
    //         this.setData({
    //           active: active + 1
    //         })
    //       }
    //     } else {
    //       if (active - 1 >= 0 && scrollTop < this.data.heightArr[active - 1]) {
    //         this.setData({
    //           active: active - 1
    //         })
    //       }
    //     }
    //     this.data.distance = scrollTop;
    //   },
    onClickButton() {

        var _that = this;
        var list = _that.data.list
        console.log(list);
        const listfinel = list.filter((item: any) => item.is_valid !== false)
        console.log(listfinel);
        if (listfinel.length === 0) {
            wx.showToast({
                title: "请核对检查商品~",
                icon: "none"
            })
        } else {
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
        }

    }
})