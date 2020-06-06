/**
 * 1.页面加载的时候
 *  1.从缓存中获取购物车数据，渲染到页面中
 * 2.微信支付
 *  1.企业帐号才可以微信支付
 *  2.企业账号的小程序后台中必须给开发者添加上白名单
 *    一个appid可以同时绑定多个开发者
 * 3.支付按钮
 *  1.先判断缓存中有没有token
 *  2.没有则跳转到授权页
 */
import { getSetting, chooseAddress, openSetting, showModal,showToast } from "../../utils/asyncWx.js";
import regeneratorRuntime from "../../lib/runtime/runtime";
Page({
  data: {
    address: {},
    cart: {},
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    // 1.获取缓存中的地址信息
    const address = wx.getStorageSync("address");
    // console.log(address);
    // 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || [];
    // 过滤后的购物车数组
    cart = cart.filter(v=>v.checked);
    this.setData({ address});

    // 重新计算总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    let allChecked = true;
    cart.forEach(v => {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
    });
    this.setData({
      cart,
      totalNum,
      totalPrice
    });
  },
  // 点击支付
  handleOrderPay(){
    // 1.判断缓存中有没有token
    const token = wx.getStorageSync("token");
    // 2.判断
    if (!token) {
      // 未授权，跳转到授权页面
      wx.navigateTo({
        url: '/pages/auth/index'
      });
    }
    console.log('已经存在token');
  }
})