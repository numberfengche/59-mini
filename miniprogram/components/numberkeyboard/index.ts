// components/numberkeyboard/index.ts
Component({

    /**
     * 组件的属性列表
     */
    properties: {
      showKeyBoard:{
        type:Boolean,
        value:false
      }
    },

    /**
     * 组件的初始数据
     */
    data: {
       num:[
         1,2,3,4,5,6,7,8,9
       ],
       number:"0"
    },

    /**
     * 组件的方法列表
     */
    methods: {
      onOk(){
        if(Number(this.data.number)===0){
          wx.showToast({
            icon:"none",
            title:"请输入就餐人数"
          })
        }else{
          getApp().globalData.counting=Number(this.data.number);
          this.setData({
            showKeyBoard:false
          })
          this.triggerEvent('myevent',Number(this.data.number))
        }
       
      },
      delete(){
        let num = String(this.data.number);
        num = num.slice(0, -1); 
        if(num === "") {
            num = "0";
        }
        this.setData({
            number: String(num) 
        });
      },
      addNum(e:any){
        this.calculate(e)
      },
      addZero(e:any){
        this.calculate(e)
      },
      calculate(e:any){
        const currentNumber =e.currentTarget.dataset.id;
        if(Number(this.data.number + String(currentNumber))>999){
         wx.showToast({
           icon:"none",
           title:"最多999人，已超出人数限制，请联系服务员"
         })
        }else{
          this.setData({
            number: this.data.number === '0' ? String(currentNumber) : this.data.number + String(currentNumber)
        });
        }
      }
    }
})