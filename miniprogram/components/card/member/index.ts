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
},
reduce(){
  if(this.data.num>0){
    this.setData({
      num:this.data.num-1
    })
  }
}
    }
})