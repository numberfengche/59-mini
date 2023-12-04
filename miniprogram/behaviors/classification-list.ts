export type PData =
    | {
        page: number; //页码
        pageSize: number; //每页数据
        dataList: any[]; //数据列表
        refreshing: boolean; //刷新数据中
        loading: boolean; //请求数据中
        noMoreData: boolean; //没有更多数据
        classify: number//分类
        break: boolean; //终止请求
    }
    | WechatMiniprogram.Component.DataOption;

export type PMethods =
    | {
        refresh: Function;
        loadData: Function;
        clear: Function;
    }
    | WechatMiniprogram.Component.MethodOption
    | any;

export interface IDataResult {
    list: [];
}

// 分页行为 ，使用方式可以参考 package_merchants/pages/rank/rank-list/index.ts
export const PageBehavior = Behavior<PData, any, any>({
    data: {
        page: 1, //页码
        pageSize: 15, //每页数据
        dataList: [], //数据列表
        refreshing: false, //刷新数据中
        loading: false, //请求数据中
        noMoreData: false, //没有更多数据
        classify: 0,//分类
        break: false
    },
    methods: {
        //刷新数据
        async reloadData(fn: () => Promise<IDataResult>) {
            this.setData(
                {
                    page: 1,
                    refreshing: true,
                    noMoreData: false,
                    break: false
                },
                () => {
                    this.loadData(fn);
                }
            );
        },

        //加载数据
        async loadData(f1: () => Promise<IDataResult>) {
            // if(this.data.break){

            //  return 
            // }
            if (this.data.break || this._isLocked()) {
                console.log("中断请求");
                return;
            }
            this._lock();
            f1()
                .then((res: IDataResult) => {
                    console.log(res, 1231231);
                    if (!res || res.list == undefined) {
                        return;
                    }
                    const { list } = res;
                    const newPage = list.length > 0 ? this.data.page + 1 : this.data.page;
                    const newList = this.data.page == 1 ? list : [...this.data.dataList, ...list];
                    const noMoreData = list.length === 0;
                    if (
                        this.data.noMoreData == false &&
                        noMoreData == true &&
                        this.data.page > 1
                    ) {
                        this.setData({
                            break: true
                        })
                        this.onNoMoreData();
                    }

                    this.setData({
                        dataList: newList,
                        page: newPage,
                        noMoreData: noMoreData,
                    });
                })
                .catch((e) => {
                    console.log("错误", e);
                })
                .finally(() => {
                    this.setData({
                        refreshing: false,
                    });
                    this._unlock();
                });
        },

        _lock() {
            this.setData({
                loading: true,
            });
        },

        _unlock() {
            this.setData({
                loading: false,
            });
        },

        _isLocked() {
            return this.data.loading == true;
        },

        //当没有更多数据时触发,可以在组件中覆盖为自己的处理方式
        onNoMoreData() {
            wx.showToast({ title: "没有更多数据了", icon: "none" });
        },
    },
});
