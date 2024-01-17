import { request } from "../../../utils/net";

// components/cartList/cart/index.ts
Component({

    /**
     * 组件的属性列表
     */
    properties: {
      item:{
        type:Object,
        value:{}
      }
    },
    observers: {
      'item': function (val) {
          this.setData({
            num:val.cart_num?val.cart_num:0
          })
      },
  },
    /**
     * 组件的初始数据
     */
    data: {
      num:0
    },

    /**
     * 组件的方法列表
     */
    methods: {
      add(){
        this.setData({num:this.data.num+1})
        this.changeCart(1)
      },
      reduce(){
        if(this.data.num>0){
          this.setData({num:this.data.num-1})
          this.changeCart(-1);
        }
      },
      changeCart(num:number){
        request({
          url: "/api/beer/minic/order/cart/modify",
          method: "POST",
          data: {
            scene: getApp().globalData.scene,
            item_id: this.properties.item.item_id,
            action:num
          },
          success: ({ data }: any) => {
            console.log(data);
            if(num>0){
              wx.showToast({
                title:"添加成功",
                icon:"none"
              })
            }else{
              wx.showToast({
                title:"修改成功",
                icon:"none"
              })
            }
          },
        });
      }
    }
})