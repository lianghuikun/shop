// 用es6的promise来优化 wx-request
// 同时发送异步代码的次数
let ajaxTimes = 0;
export const request=(params)=>{
    // 如果url带有 /my/ 则自动带上请求头header
    let header = {...params.header};
    if (params.url.includes("/my/")) {
        // 拼接header，带上token
        header["Authorization"]= wx.getStorageInfoSync("token");
    }
    ajaxTimes++;
    // 显示加载中效果
    wx.showLoading({
        title: "加载中",
        mask: true,// 魔态
    });
    // 定义公共的url
    const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1";
    // resolve成功时的回调函数，reject失败时的回调函数
    return new Promise((resolve, reject)=> {
      wx.request({
        ...params,
        header:header,
        url:baseUrl + params.url,
        success:(result)=>{
            // resolve(result);
            resolve(result.data.message);
        },
        fail:(error)=>{
            reject(error);
        },
        complete:()=>{
            ajaxTimes--;
            if (ajaxTimes ===0) {
                // 关闭加载中
                wx.hideLoading();
            }
        }
       });
    })
}