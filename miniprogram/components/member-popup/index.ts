import { request } from "../../utils/net";
// import { payment } from "../../utils/util";
// components/member-popup/index.ts
Component({

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    list: [],
    price_select: {},
    select_id: 1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    selsect(e: any) {
      console.log(e.currentTarget.dataset.type);
      const price = this.data.list.find((item: any) => item.vip_type === e.currentTarget.dataset.type)
      console.log(price);

      this.setData({
        price_select: price,
        select_id: e.currentTarget.dataset.type
      })
    },
    getprice() {
      request({
        url: "/api/beer/minic/vip/types",
        success: ({ data }: any) => {
          console.log(data);
          this.setData({
            list: data.list,
            price_select: data.list[0]
          })
        },
      });
    },
    checkpayment() {
      this.payment(this.data.select_id)
    },
    payment(
      vip_type: number,
    ) {
      var _this = this
      request({
        url: "/api/beer/minic/vip/open",
        method: "POST",
        data: { vip_type: vip_type },
        success: ({ data }: any) => {
          wx.requestPayment({
            timeStamp: data.pay_params.timestamp.toString(),
            nonceStr: data.pay_params.nonce,
            package: data.pay_params.package,
            signType: data.pay_params.sign_type,
            paySign: data.pay_params.pay_sign,
            success: function (res) {
              var timer = setInterval(() => {
                request({
                    url: `/api/beer/minic/vip/result`,
                    data: { log_id: data.log_id },
                    success: ({ data }: any) => {
                        console.log(data);
                        if (data.result === 1) {
                          clearInterval(timer)
                          wx.showToast({
                            icon:"none",
                            title:data.message
                          })
                          _this.triggerEvent('myevent')
                        }else{
                          clearInterval(timer)
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
        },
        fail: (res: any) => {
          // onFail && onFail(res);
        },
      });
    }

  },
  lifetimes: {
    ready: function () {
      this.getprice()
    },
  }
})