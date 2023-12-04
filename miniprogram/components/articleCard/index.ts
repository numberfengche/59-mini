import { request } from "../../utils/net";
Component({
    /**
     * 组件的属性列表
     */
    
    properties: {
        source:{} as any,
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        ontransmit(e:any){
console.log(e.currentTarget.dataset.id);
request({
    url: "/api/mini/article/interact",
    method:'POST',
    data: {type:2,article_id:e.currentTarget.dataset.id},
    success: ({ data }: any) => {
        console.log(data);
    },
    fail: () => {
      this.setData({  cardLoading:true });
      // this.setData({ loading: false });
    },
  });
        },
        onlike(e:any){
          request({
            url: "/api/mini/article/interact",
            method:'POST',
            data: {type:1,article_id:e.currentTarget.dataset.id},
            success: ({ data }: any) => {
                console.log(data);
            },
            fail: () => {
              this.setData({  cardLoading:true });
              // this.setData({ loading: false });
            },
          });
        },
        goDetail(e:any){
            
            const type =e.currentTarget.dataset.id
            console.log(type);
            wx.navigateTo({ url: `/pages/detail/detail?article_id=${type}` })
        }
    }
})
