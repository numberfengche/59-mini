import { request } from "../../utils/net";
// pages/search/index.ts
Page({

    /**
     * 页面的初始数据
     */
    data: {
      main_height: 0,
      navBarHeight: getApp().globalData.navBarHeight,//导航栏高度
      searchHistory: wx.getStorageSync("history") || [],
      hasSearched: false,
      loading: false,
      keyword: "",
      keyword_temp: "",
      goods_list: [] as any[],
      scene: getApp().globalData.scene,
      
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
      this.setData({
        scene: getApp().globalData.scene,

      })
    },

    deleteHistory() {
      wx.setStorageSync("history", []);
      this.setData({ searchHistory: [] });
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onSearchInput(e: any) {
      this.setData({ keyword_temp: e.detail });
    },
    onSearch(e: any) {
      let keyword = "";
      console.log(e);
      
      if (e.type === "tap") {
        keyword = this.data.keyword_temp;
      } else if (e.type === "search") {
        keyword = e.detail;
      }
       console.log(keyword);
       
      if (keyword) {
        const searchHistory = wx.getStorageSync("history") || [];
        const _history = [...new Set([...searchHistory, keyword])];
        wx.setStorageSync("history", _history);
        this.setData({ searchHistory: _history });
      }
  
      this.setData({ keyword, page:1,goods_list:[] }, () => {
        this.getApiList();
      });
    },

    getApiList() {
      const { keyword } = this.data;
      let { goods_list } = this.data;
      if (keyword === "") {
        wx.showToast({
          title:"请输入搜索词",
          icon:"none"
        });
        this.setData({ goods_list: [] });
      } else {
        this.setData({ loading: true });
        request({
          url: "/api/beer/minic/order/search",
          method: "GET",
          data: {
            keywords:keyword,
            scene:this.data.scene
          },
          success: ({ code, data: { item_list } }: any) => {
            console.log(item_list);
            this.setData({ goods_list:item_list, loading: false,  hasSearched: true })
          },
          fail: () => {
            this.setData({ loading: false });
          },
        });
      }
    },

    onClear() {
      this.setData({ goods_list: [], hasSearched: false, loading: false, page_no: 1, keyword: "", keyword_temp: "" });
    },

    onClickHistory(e: any) {
      const { keyword } = e.currentTarget.dataset;
      this.setData({ keyword, goods_list:[] }, () => {
        this.getApiList();
      });
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