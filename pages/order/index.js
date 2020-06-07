/**
 * 1.页面打开的时候调用onshow
 * 2.点击不同改标题也需要重新获取和渲染页面
 */
import { request } from "../../request/index.js"
import regeneratorRuntime from "../../lib/runtime/runtime";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "待付款",
        isActive: false
      }, {
        id: 2,
        value: "待发货",
        isActive: false
      }, {
        id: 3,
        value: "退款/退货",
        isActive: false
      }
    ],
    orders: [
      {
        "order_id": 428,
        "user_id": 23,
        "order_number": "HMDD20190802000000000428",
        "order_price": 13999,
        "order_pay": "0",
        "is_send": "否",
        "trade_no": "",
        "order_fapiao_title": "个人",
        "order_fapiao_company": "",
        "order_fapiao_content": "",
        "consignee_addr": "广东省广州市海珠区新港中路397号",
        "pay_status": "1",
        "create_time": "2020-06-07",
        "update_time": 1564731518,
        "order_detail": null,
        "goods": [
          {
            "id": 717,
            "order_id": 428,
            "goods_id": 43986,
            "goods_price": 13999,
            "goods_number": 1,
            "goods_total_price": 13999,
            "goods_name": "海信(Hisense)LED55MU9600X3DUC 55英寸 4K超高清量子点电视 ULED画质 VIDAA系统",
            "goods_small_logo": "http://image5.suning.cn/uimg/b2c/newcatentries/0000000000-000000000160455569_1_400x400.jpg"
          }
        ]
      }]

  },
  // 从子组件传递过来的事件
  handleTabsItemChange(e) {
    // console.log(e);
    // 1.获取被点击的标题索引
    const { index } = e.detail;
    this.changeTitleByIndex(index);
    this.getOrders(parseInt(index) + 1);
  },
  // 根据索引来激活选中标题
  changeTitleByIndex(index) {
    // console.log(e);
    // 1.获取被点击的标题索引
    // const { index } = e.detail;
    // 2.修改源数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3.赋值到data中
    this.setData({
      tabs
    });
  },
  onShow(options) {
    const token = wx.getStorageSync("token");
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index'
      });
      return;
    }
    // onLoad可以直接获取url传递的参数，而onshow不行
    // 1.获取当前小程序的页面栈，当前数组中所以最大的就是当前页面
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    const { type } = currentPage.options;
    // console.log(currentPage.options);   
    this.getOrders(type);
    // 根据type判断页面标题哪个被激活选中
    this.changeTitleByIndex(parseInt(type) - 1);


  },
  // 获取订单列表的方法
  async getOrders(type) {
    // TODO 这里订单接口返回空，因为token无效
    const res = await request({ url: "/my/orders/all", data: { type } });
    // console.log(res);
    // this.setData({
    //   orders:res.orders
    // });
  }

})