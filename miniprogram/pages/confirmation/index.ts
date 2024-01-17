import { request } from "../../utils/net";

// pages/confirmation/index.ts
Page({

    /**
     * 页面的初始数据
     */
    data: {
      navBarHeight: getApp().globalData.navBarHeight,//导航栏高度
      top: wx.getMenuButtonBoundingClientRect().top,
      scene: getApp().globalData.scene,
      order:{} as any,
      remark:"",
      pay_params:{}as any,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
     console.log(this.data.scene);
     console.log(getApp().globalData.scene);
     this.setData({
      scene: getApp().globalData.scene,
     })
     this.preview(getApp().globalData.scene)
    },
    
    /**
     * 订单预览
     */
    preview(scene:String) {
      request({
        url: "/api/beer/minic/order/batch/preview",
        method: "POST",
        data: {
          scene: scene,
        },
        success: ({ data }: any) => {
          console.log(data);
          this.setData
          ({
            order:data
          })
        },
      });
    },
    getvalue(e: any) {
      console.log(e.detail.value);
      this.setData({
          remark: e.detail.value
      })
  },
    /**
     * 下单
     */
    pay() {
      var _this=this;
      request({
        url: "/api/beer/minic/order/batch/create",
        method: "POST",
        data: {
          scene: this.data.scene,
          price_total:this.data.order.price_total,
          remark:this.data.remark,
          item_list:this.data.order.create_item_list
        },
        success: ({ data }: any) => {
          console.log(data);

          wx.requestPayment({
            timeStamp: data.pay_params.timestamp.toString(),
            nonceStr: data.pay_params.nonce,
            package: data.pay_params.package,
            signType: data.pay_params.sign_type,
            paySign: data.pay_params.pay_sign,
            success: function (res) {
              var timer = setInterval(() => {
                request({
                    url: `/api/beer/minic/order/batch/result`,
                    data: { batch_id: data.batch_id,scene: _this.data.scene, },
                    success: ({ data }: any) => {
                        console.log(data);
                        if (data.result === 1) {
                          clearInterval(timer)
                          wx.navigateTo({
                            url:`/pages/order/index?scene=${_this.data.scene}`
                          })
                          wx.showToast({
                            icon:"none",
                            title:data.message
                          })
                          clearInterval(timer)
                        }else{
                          wx.showToast({
                            icon:"none",
                            title:data.message
                          })
                        }
                    },
                    fail: () => {
                    },
                });
            }, 500)
            },
            fail: function (res) {
              console.log(res);
              // onFail && onFail(res);
              wx.showToast({ title: "支付失败", icon: "none", duration: 2000 });
            },
            complete: function (res) {
              // onComplete && onComplete(res);
              // wx.showToast({ title: "", icon: "none", duration: 2000 });
            },
          });

          this.setData({
            pay_params:data
          })
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