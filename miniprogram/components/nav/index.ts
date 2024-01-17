// components/nav/index.ts
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        name: { type: String, value: "" },
        white:{type: Boolean, value: false}
    },

    /**
     * 组件的初始数据
     */
    data: {
        navBarHeight: getApp().globalData.navBarHeight,//导航栏高度
        top: wx.getMenuButtonBoundingClientRect().top,
    },

    /**
     * 组件的方法列表
     */
    methods: {
        back() {
            wx.navigateBack({ delta: 1 });
        },
        goorder(){
            wx.navigateTo({
                url:"/pages/order/order"
            })
        },
        gosearch(){
            wx.navigateTo({
                url:"/pages/search/index"
            })
        }
    }
})
