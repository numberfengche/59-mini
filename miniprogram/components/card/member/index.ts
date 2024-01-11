import { request } from "../../../utils/net";

// components/card/member/index.ts
Component({

    /**
     * 组件的属性列表
     */
    properties: {
      item: { type: Object, value: {} },
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
  this.setData({
    num:this.data.num+1
  })
  this.changeCart(1)
},
reduce(){
  if(this.data.num>0){
    this.setData({
      num:this.data.num-1
    })
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
      this.triggerEvent('myevent');
    },
  });
}
// 
    }
})