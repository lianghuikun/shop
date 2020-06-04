/**
 * 封装微信的api接口：
 *  getSetting
 */
export const getSetting=()=>{
    return new Promise((resolve, reject)=>{
        wx.getSetting({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            }
        });
          
    });
}


/**
 * 封装微信的api接口：
 *  chooseAddress
 */
export const chooseAddress=()=>{
    return new Promise((resolve, reject)=>{
        wx.chooseAddress({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            }
        });
          
    });
}

/**
 * 封装微信的api接口：
 *  openSetting
 */
export const openSetting=()=>{
    return new Promise((resolve, reject)=>{
        wx.openSetting({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            }
        });
          
    });
}