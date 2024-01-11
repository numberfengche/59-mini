import { request } from "./net"

export const formatTime = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  )
}


export const formatDate = (date:Date) => {
    var year = date.getFullYear();
    var month =(date.getMonth() + 1).toString();
    var day = (date.getDate()).toString();
    if (month.length == 1) {
        month = "0" + month;
    }
    if (day.length == 1) {
        day = "0" + day;
    }
    return year +"-"+ month +"-"+  day;
}

const formatNumber = (n: number) => {
  const s = n.toString()
  return s[1] ? s : '0' + s
}
// import { request } from "@@/exports";


export const formatRichText=(html:any)=>{
    console.log(html);
    let newContent= html.replace(/<img[^>]*>/gi,function(match:any,capture:any){
        match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
        match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
        match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
        return match;
    });
    newContent = newContent.replace(/style="[^"]+"/gi,function(match:any,capture:any){
        match = match
        .replace(/<p>/gi, '<p class="p_class">')
        .replace(/width:[^;]+;/gi, 'max-width:100%;')
        .replace(/width:[^;]+;/gi, 'max-width:100%;');
        return match;
    });
    newContent = newContent.replace(/<br[^>]*\/>/gi, "");
    newContent = newContent.replace(/<a>/gi, '<a class="p_class "');
    newContent = newContent.replace(/<li>/gi, '<li class="p_class "');
    newContent = newContent.replace(/\<p/gi, '<p class="p_class "');
    newContent = newContent.replace(/\<span/gi, '<span class="p_class "');
    newContent = newContent.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;margin-top:0;margin-bottom:0;"');
    return newContent;
  }
  export const filterKeys = (json: any | Array<any>) => {
    let result: any = false;
    if (Array.isArray(json)) {
      result = json.filter((item) => item !== "" && item !== null && item !== undefined);
    } else if (json instanceof Object) {
      result = {};
  
      for (const key in json) {
        if (json[key] !== "" && json[key] !== null && json[key] !== undefined) {
          // if (Array.isArray(json[key]) && json[key].length > 0) {
          result[key] = json[key];
          // }
        }
      }
    }
    return result;
  };

  // 登录，获取token
export const login = (globalData?: {  token: string; }) => {
    const _globalData = globalData || getApp().globalData;
  
    return new Promise<{ token: string }>((resolve, reject) => {
      // const token = wx.getStorageSync("token");
      const token = getApp().globalData.token;
  
      if (token) {
        resolve({ token });
      } else {
        const domain =getApp().globalData.domain;
        const accountInfo = wx.getAccountInfoSync();
        const appid = accountInfo.miniProgram.appId;
        console.log(accountInfo.miniProgram.appId)
        wx.login({
          success: (res) => {
            wx.request({
              url: `${domain}/api/mall/minic/user/login`,
              method: "POST",
              data: { code: res.code ,authorizer_app_id:appid},
              success: ({ data: { data } }: { data: { data: { token: string;} } }) => {
                getApp().globalData.token = data.token;
                resolve(data);
              },
            });
          },
          fail: () => {
            // reject({ token: "", is_bind_phone: false, is_saved_profile: false });
            reject();
          },
        });
      }
    });
  };



  // 支付
export const payment = (
  vip_type: number,
  onSuccess?: Function,
  onFail?: Function,
  onComplete?: Function
) => {
  request({
    url: "/api/beer/minic/vip/open",
    method: "POST",
    data: { vip_type: vip_type },
    success: ({ data }: any) => {
      console.log(data);
      
      wx.requestPayment({
        timeStamp:data.pay_params.timestamp.toString(),
        nonceStr:data.pay_params.nonce,
        package:data.pay_params.package,
        signType:data.pay_params.sign_type,
        paySign:data.pay_params.pay_sign,
        success: function (res) {
          onSuccess && onSuccess(res);
          // wx.showToast({ title: "支付成功", icon: "none", duration: 2000 });
          // wx.redirectTo({
          //   url: "/pages/status/paysuccess/index",
          // });
          //2秒后主动查询支付状态,避免异步通知慢
          setTimeout(() => {
            request({
              url: "/api/beer/minic/vip/result",
              data: { log_id: data.log_id },
              // showMessage: false,
              success:({data}:any)=>{
                console.log(data);
              }
            });
          }, 2000);
        },
        fail: function (res) {
          console.log(res);
          onFail && onFail(res);
          wx.showToast({ title: "支付失败", icon: "none", duration: 2000 });
        },
        complete: function (res) {
          onComplete && onComplete(res);
          // wx.showToast({ title: "", icon: "none", duration: 2000 });
        },
      });
    },
    fail: (res: any) => {
      onFail && onFail(res);
    },
  });
};