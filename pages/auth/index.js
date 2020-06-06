import { login } from "../../utils/asyncWx.js";
import { request } from "../../request/index.js"
import regeneratorRuntime from "../../lib/runtime/runtime";

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  async handleGetUserInfo(e) {

    try {
      // 1.获取用户信息
      const { encryptedData, rawData, iv, signature } = e.detail;
      // 2.获取小程序登陆成功后的code
      // wx.login({
      //   timeout:10000,
      //   success: (result) => {
      //     const {code} = result;
      //   }
      // });
      const { code } = await login();
      // console.log(code);
      const loginParams = { encryptedData, rawData, iv, signature, code };
      // 3.发送请求获取用户的token
      // TODO 没有企业帐号获取到的是空
      // console.log(token);
      // const { token } = await request({ url: "/users/wxlogin", data: loginParams, method: "post" });
      // 先写死一个字符串
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo";
      // 把token存入到缓存中，同时跳转到上一个页面
      wx.setStorageSync("token", token);
      wx.navigateBack({
        delta: 1 // 1表示上1层，2表示上2层
      });
    } catch (error) {
      console.log(error);
    }


  }
})