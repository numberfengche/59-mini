// import { request } from "../../utils/net";

// // pages/loading/index.ts
// Page({

//     /**
//      * 页面的初始数据
//      */
//     data: {

//     },

//     /**
//      * 生命周期函数--监听页面加载
//      */
//     onLoad(options:any) {
//           console.log(options);
//           getApp().globalData.scene=options.scene
//                request({
//                 url: "/api/yak/desk/info",
//                 data: {
//                     scene:this.options.scene
//                 },
//                 success: ({ data }: any) => {
//                     console.log(data);
//                     getApp().globalData.shopName=data.desk_name;
//                     getApp().globalData.tabelnumber=data.shop_name;
//                     const {trade_id}=data
//                     if(trade_id>0){
//                     wx.navigateTo({
//                         url:"/pages/square/square"
//                     })
//                     }else{
//                         wx.navigateTo({
//                             url:"/pages/deskScan/index"
//                         }) 
//                     }
//                 },
//                 fail: () => {
//                   // this.setData({ loading: false });
//                 },
//               });
//     },

//     /**
//      * 生命周期函数--监听页面初次渲染完成
//      */
//     onReady() {

//     },

//     /**
//      * 生命周期函数--监听页面显示
//      */
//     onShow() {

//     },

//     /**
//      * 生命周期函数--监听页面隐藏
//      */
//     onHide() {

//     },

//     /**
//      * 生命周期函数--监听页面卸载
//      */
//     onUnload() {

//     },

//     /**
//      * 页面相关事件处理函数--监听用户下拉动作
//      */
//     onPullDownRefresh() {

//     },

//     /**
//      * 页面上拉触底事件的处理函数
//      */
//     onReachBottom() {

//     },

//     /**
//      * 用户点击右上角分享
//      */
//     onShareAppMessage() {

//     }
// })

// // index.ts
// 获取应用实例
// const app = getApp<IAppOption>()
import { request } from "../../utils/net";
Page({
    data: {
        motto: 'Hello World',
        avatarUrl: '',
        nickName: '暂无昵称',
        name: getApp().globalData.shopName,
        tabel: getApp().globalData.tabelnumber
    },
    onLoad() {
        this.setData({
            name: getApp().globalData.shopName,
            tabel: getApp().globalData.tabelnumber
        })
    },
    // 点击头像
    onTapAvatar() {
        wx.navigateTo({
            url: '../logs/logs',
        })
    },


    getnum() {
        console.log(getApp().globalData.num);
        const dinners = getApp().globalData.num + 1;
        const scene = getApp().globalData.scene;
        wx.redirectTo({
            url: "/pages/square/square"
        })

        request({
            url: `/api/mall/minic/desk/begin`,
            method: "POST",
            data: {
                dinners,
                scene
            },
            success: (val: any) => {
                console.log(val);
                // const { list } = val.data;
                // this.setData({ goods: list })
            },
            fail: () => {
            },
        });

    },
})