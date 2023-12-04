import {
    PageBehavior,
    PData,
    PMethods,
} from "../../../behaviors/classification-list";
import { request, requestPromise } from "../../../utils/net";
Component<PData, any, PMethods>({
    behaviors: [PageBehavior],
    /**
     * 组件的属性列表
     */
    properties: {
        classify:{
            type: String, value: undefined
        }
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
        changeTab(val: any) {
            console.log(val.detail.name);
            const classify= val.detail.name.toString()
            this.setData({
                classify
            })
            setTimeout(() => {
                this.refresh();
            }, 200);
        },
        loadMore() {
            this.loadData(this.getlist())
        },
        getlist() {
            return () => {
                return new Promise((resolve) => {
                  resolve(requestPromise({
                    url: `/api/mini/trade/search`,
                    method:"GET",
                    data: {
                        page_no: this.data.page,
                        page_size: this.data.pageSize,
                        state: Number(this.data.classify)
                    },
                }));
                });
              };
        },
        refresh() {
            this.reloadData(this.getlist());
        },
    },
    lifetimes: {
        attached: function () {
            // this.selectComponent("#tabs").resize();
            // this.refresh();
            // this.setData({
            //     active:
            // })
            // console.log(this.data.dataList);
        },
    },
})
