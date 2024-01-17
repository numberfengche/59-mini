import { request } from "../../utils/net";

// pages/detail/index.ts
Page({

    /**
     * 页面的初始数据
     */
    data: {
      navBarHeight: getApp().globalData.navBarHeight,//导航栏高度
      info:{} as any,
      scene:""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad({scene}) {
     console.log(scene);
     this.setData({
       scene:scene
     })
     request({
      url: "/api/beer/minic/order/trade/detail",
      data: {
        scene: scene
      },
      success: ({ data }: any) => {
        console.log(data);
        this.setData({
          info:data
        })
      }
    });
    },
    cancel(){
      request({
        url: "/api/beer/minic/order/batch/cancel",
        method:"POST",
        data: {
          scene: this.data.scene
        },
        success: ({ data }: any) => {
          console.log(data);
          wx.navigateTo({
            url:`/pages/deskScan/index?scene=${this.data.scene}`
          })
        }
      });
    },
    pay_now(e:any) {
   console.log(e.currentTarget.dataset);
   const{id}=e.currentTarget.dataset;
   var _this=this;
   request({
    url: "/api/beer/minic/order/batch/pay",
    method:"POST",
    data: {
      scene: this.data.scene,
      batch_id:id
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
                data: { batch_id:id,scene: _this.data.scene, },
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
    }
  });
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
      request({
        url: "/api/beer/minic/order/trade/detail",
        data: {
          scene: this.data.scene
        },
        success: ({ data }: any) => {
          console.log(data);
          this.setData({
            info:data
          })
        }
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