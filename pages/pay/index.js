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
import { request, requestPayment } from "../../request/index.js"
import { getSetting, chooseAddress, openSetting, showModal, showToast } from "../../utils/asyncWx.js";
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
    cart = cart.filter(v => v.checked);
    this.setData({ address });

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
  async handleOrderPay() {
    try {
      // 1.判断缓存中有没有token
      const token = wx.getStorageSync("token");
      // 2.判断
      if (!token) {
        // 未授权，跳转到授权页面
        wx.navigateTo({
          url: '/pages/auth/index'
        });
      }
      // 3.创建订单
      // 3.1 请求头
      // const header = { Authorization: token };
      // 3.2 准备请求体参数
      const order_price = this.data.totalPrice;
      const consignee_addr = this.data.address.all;
      const cart = this.data.cart;
      let goods = [];
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_num: v.num,
        goods_price: v.goods_price
      }));
      const orderParams = { order_price, consignee_addr, orderParams };
      // 4.准备发送请求，创建订单
      // const { order_number } = await request({ url: "/my/orders/create", method: "post", data: orderParams, header: header });
      const { order_number } = await request({ url: "/my/orders/create", method: "post", data: orderParams });

      // console.log(order_number);
      // 5.发起预支付的接口
      // const pay = await request({ url: "/my/orders/req_unifiedorder", method: "post", data: { order_number }, header: header });
      const pay = await request({ url: "/my/orders/req_unifiedorder", method: "post", data: { order_number } });

      // 6.发起微信支付
      await requestPayment(pay);
      // 7.查询订单状态 /my/orders/chkOrder
      // const res = await request({ url: "/my/orders/chkOrder", method: "post", data: { order_number }, header: header });
      const res = await request({ url: "/my/orders/chkOrder", method: "post", data: { order_number }});
      console.log(res);
      // 8.手动删除已支付的商品
      let newCart = wx.getStorageSync("cart");
      newCart = newCart.filter(v=>!v.checked);
      wx.setStorageSync("cart", newCart);
      await showToast({ title: "支付成功" });
      // 8.支付成功，跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/index'
      });
        
    } catch (error) {
      console.log(error);
      await showToast({ title: "支付失败" });
    }
  }
})


