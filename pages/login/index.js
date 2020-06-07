// pages/login/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
   
  },
  handleGetUserInfo(e){
    const {userInfo} = e.detail;
    // 获取用户中心数据后存入缓存
    wx.setStorageSync("userInfo", userInfo);
    // 从登陆页面跳转回到上层的个人中心页面
    wx.navigateBack({
      delta: 1
    });
  }
})