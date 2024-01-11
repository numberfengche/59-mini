import { request } from "../../utils/net";

// components/radio/radio.ts
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
      list:[
        {key:0,name:"1"},
        {key:1,name:"2"},
        {key:2,name:"3"},
        {key:3,name:"4"},
        {key:4,name:"5"},
        {key:5,name:"6"},
        {key:6,name:"7"},
        {key:7,name:"8"},
        {key:8,name:"9"},
        {key:9,name:"其他"},
      ],
      select_type:0,
      show:false,
      value:1
    },

    /**
     * 组件的方法列表
     */
    methods: {
        changeNum(e:any){
            console.log(e.target.dataset.id);
            console.log(e.target.dataset.num);
            if(e.target.dataset.id===9){
                this.triggerEvent('myevent')
            }else{
              console.log(e.target.dataset.id);
                this.setData({
                    select_type:e.target.dataset.id
                })
                getApp().globalData.counting=e.target.dataset.id+1
            }
           
        },
        bindKeyInput: function (e:any) {
            console.log(e.detail.value);
            let price=e.detail.value;
              price = parseFloat(price);
                console.log(price);
                if(price>0){
                    this.setData({
                        value: price
                    })
                }
           
          },
          onClose(){
            this.setData({
                show:false
            })
          },
          onConfirm(){
              console.log(this.data.value);
              getApp().globalData.num = this.data.value
              const dinners = this.data.value;
              const scene = getApp().globalData.scene;
              wx.navigateTo({
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
              
              
          }

    }
})
