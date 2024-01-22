import { request } from "../../../utils/net";

// components/card/swigger/index.ts
Component({

    /**
     * 组件的属性列表
     */
    properties: {
      item: { type: Object, value: {} },
      num: { type: Number, value: 0 },
      showBag:{type: Boolean, value: false}
    },
    observers: {
      'item': function (val) {
          console.log(val);
          this.setData({
            number: val.item_list[0].cart_num
          })
      },
      // 'num': function (val) {
      //   console.log(val);
      //   this.setData({
      //     number:val
      //   })
      // },
  },
    /**
     * 组件的初始数据
     */
    data: {
      number:0,
      islogin:false
    },

    /**
     * 组件的方法列表
     */
    methods: {
      add(){
        this.changeCart(1)
      },
      reduce(){
        if(this.properties.item.item_list[0].cart_num>1){
          this.changeCart(-1)
        }
      },
      changeCart(num:number){
        request({
          url: "/api/beer/minic/order/cart/modify",
          method: "POST",
          showMessage:false,
          data: {
            scene: getApp().globalData.scene,
            item_id: this.properties.item.item_list[0].item_id,
            action:num
          },
          success: ({ data,code,msg }: any) => {
            console.log(code);
            if(code===0){
              if(num>0){
                this.setData({
                  number:this.data.number+1
                })
              }else{
                this.setData({
                  number:this.data.number-1
                })
              }
              this.triggerEvent('myevent');
            }else{
              wx.showToast({
                title:msg,
                icon:"none"
              })
            }
          },
          fail:()=>{
            if(this.data.showBag){
              wx.showToast({
                title:"您当前的饮酒模式为单点，若想改为畅饮，请联系服务人员",
                icon:"none",
                duration:2000
              })
            }else{
              wx.showToast({
                title:"请先登录",
                icon:"none",
              })
            }
            
          }
        });
      }
    },
})