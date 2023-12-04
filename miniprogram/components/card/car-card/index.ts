import { request } from "../../../utils/net";

Component({
    properties: {
        item: { type: Object, value: {} },
    },
    observers: {
        'item': function (val) {
            console.log(val);
            this.setData({ source: val,value:val.cart_num });
        },

    },

    data: {
        source: {} as any,
        value: 0,
        list:[],
        num:0,
        scene: getApp().globalData.scene
    },

    lifetimes: {
        attached: function () {
            this.setData({
                scene: getApp().globalData.scene
            })
            // 在组件实例进入页面节点树时执行
        },
    },

    methods: {
        onchange(e: any) {
            console.log(e.detail);
            this.setData({
                value: e.detail
            })
        },
        //加
        onStepperChange() {
            request({
                url: "/api/mall/minic/desk/cart/add",
                method: "POST",
                data: {
                    action: 1,
                    scene:this.data.scene,
                    item_id: this.data.source.item_id
                },
                success: ({ data }: any) => {
                    var myEventDetail = {} // detail对象，提供给事件监听函数
                    var myEventOption = {} // 触发事件的选项
                    this.triggerEvent('myevent', myEventDetail, myEventOption)
                    this.triggerEvent('myevn', myEventDetail, myEventOption)
                },
            });
        },
        //减
        onminus() {
            request({
                url: "/api/mall/minic/desk/cart/add",
                method: "POST",
                data: {
                    action: -1,
                    scene:this.data.scene,
                    item_id: this.data.source.item_id
                },
                success: ({ data }: any) => {
                    // const { list } = data
                    // console.log(data);
                    var myEventDetail = {} // detail对象，提供给事件监听函数
                    var myEventOption = {} // 触发事件的选项
                    this.triggerEvent('myevent', myEventDetail, myEventOption)
                    this.triggerEvent('myevn', myEventDetail, myEventOption)
                    // this.getnum()
                    // this.setData({ list: list,show:false});
                },
            });
        },
        //购物车
    },
});
