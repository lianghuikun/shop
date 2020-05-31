// 用es6的promise来优化 wx-request
export const request=(params)=>{
    // 定义公共的url
    const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1";
    // resolve成功时的回调函数，reject失败时的回调函数
    return new Promise((resolve, reject)=> {
      wx.request({
        ...params,
        url:baseUrl + params.url,
        success:(result)=>{
            // resolve(result);
            resolve(result.data.message);
        },
        fail:(error)=>{
            reject(error);
        }
       });
    })
}