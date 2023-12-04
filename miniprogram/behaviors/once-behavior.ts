export type OnceMethods =
  | {
      once: Function;
    }
  | WechatMiniprogram.Component.MethodOption
  | any;

// 同步单次请求， 避免重复点击、重复请求
export const OnceBehavior = Behavior<any, any, any>({
  data: {
    fetching: {},
  },
  methods: {
    once(name: string, f: () => Promise<any>) {
      if (this._isOnceLocked(name)) {
        return;
      }

      this._onceLock(name);

      f().finally(() => {
        this._onceUnlock(name);
      });
    },

    _onceLock(name: string) {
      this.setData({
        fetching: {
          ...this.data.fetching,
          [name]: true,
        },
      });
    },

    _onceUnlock(name: string) {
      this.setData({
        fetching: {
          ...this.data.fetching,
          [name]: false,
        },
      });
    },

    _isOnceLocked(name: string) {
      return this.data.fetching[name] == true;
    },
  },
});
