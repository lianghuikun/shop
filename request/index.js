// 用es6的promise来优化 wx-request
export const request=(params)=>{
    // resolve成功时的回调函数，reject失败时的回调函数
    return new Promise((resolve, reject)=> {
      wx.request({
        ...params,
        success:(result)=>{
            resolve(result);
        },
        fail:(error)=>{
            reject(error);
        }
       });
    })
}