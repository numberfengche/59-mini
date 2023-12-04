// // index.ts
// // 获取应用实例
// // const app = getApp<IAppOption>()

import { request } from "../../utils/net";

// Page({
//     data: {
//         motto: 'Hello World',
//         avatarUrl: '',
//         nickName: '暂无昵称'
//     },

//     // 点击头像
//     onTapAvatar() {
//         wx.navigateTo({
//             url: '../logs/logs',
//         })
//     },

//     // 点击选择头像
//     onChooseavatar(r: any) {
//         console.log("index::选择头像", r.detail.avatarUrl)
//         this.setData({
//             avatarUrl: r.detail.avatarUrl
//         })
//     },

//     // 点击跳转详情
//     onTapProduct() {
//         console.log("index::跳转详情")
//         wx.navigateTo({
//             url: "/pages/product/pruduct?product_id=3600742488832390379&product_group_id=22&company_name=丰芽科技&user_name=王美丽同学&phone=18908009119&wechat=Wepp223322",
//         })
//     },

//     getnum() {
//         console.log(getApp().globalData.num );
//         wx.navigateTo({
//             url:"/pages/square/square"
//         })
//     },

//     onLoad(options: any) {

//         // wx.navigateTo({url:`/pages/productShare/index?scene=65`})
//         // return


//         // // wx.showToast({ title: "来啦，老铁", icon: "success", duration: 4000 })
//         // console.log("index::onLoad", options)
//         // this.setData({
//         //     scene: JSON.stringify(options)
//         // })
//     }
// })

// pages/detailshop/detailshop.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    goodslist:[],
    isgoods:false,
    searchInformation: {
      page: 1,
      page_size: 20,
    },
    isRefresh:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.setData({
        searchInformation: {
          ...this.data.searchInformation,
          page: 1,
        },
        list: [],
        goodslist: [],
        isgoods:false,
        loading: true,
        cardLoading:false
      });
      this.getList();
  },
  getGoods(){
    request({
      url: "/api/mini/goods/search",
      method: "GET",
      data: this.data.searchInformation,
      success: ({ data:{ list } }: any) => {
        console.log(list);
        this.setData({
          goodslist: this.data.goodslist.concat(list),
        })
      },
      fail: () => {
      },
    });
  },
  
  
  
  bindDownLoad() {
    if(this.data.isRefresh){
      return;
    }else{
      this.setData({
        searchInformation: {
          ...this.data.searchInformation,
          page: this.data.searchInformation.page + 1,
        },
        // isRefresh: false,
      });
    
    this.getList();
  }},
  
  getList(){
    request({
       url: `/api/mall/minic/index/shop`,
       method: "GET",
       data: this.data.searchInformation,
       success: ({ data:{ list } }: any) => {
         console.log(list);
         if (list.length > 0) {
          this.setData({
            isRefresh: false,
            list: this.data.list.concat(list),
             loading: false,
             cardLoading:false
          });
        } else  {
          this.setData({
            isRefresh: true,
          });
            // wx.showToast({
            //   title: '没有更多',
            //   icon:'error',
            //   duration: 2000
            // })
        }
  
  
  
        //  this.setData({
        //   list:data.list
        //  })
       },
       fail: () => {
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
  click() {
  wx.showToast({
      title:"请扫描店内二维码",
      icon:"none"
  })
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
