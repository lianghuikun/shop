// 引入 用来发送请求的方法
import { request } from "../../request/index"

Page({
  data: {
    // 轮播图数组
    swiperList: [],
    // 导航数组
    catesList: [],
    // 楼层数据
    floorList: []
  },
  // 页面开始加载就会触发
  onLoad: function (options) {
    this.getSwiperList();
    this.getCatesList();
    this.getFloorList();
  },
  // 获取轮播图数据
  getSwiperList() {
    // 1.发送异步请求获取轮播图数据
    // var reqTask = wx.request({
    //   url: "https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata",
    //   success: (result) => {
    //     this.setData({
    //       swiperList:result.data.message
    //     });
    //   }
    // });
    // 用es6的promise来优化
    request({ url: "https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata" })
      .then(result => {
        this.setData({
          swiperList: result.data.message
        });
      })
  },
  // 获取分类导航数据
  getCatesList() {
    request({ url: "https://api-hmugo-web.itheima.net/api/public/v1/home/catitems" })
      .then(result => {
        this.setData({
          catesList: result.data.message
        });
      })
  },
  // 获取分类导航数据
  getFloorList() {
    request({ url: "https://api-hmugo-web.itheima.net/api/public/v1/home/floordata" })
      .then(result => {
        this.setData({
          floorList: result.data.message
        });
      })
  }
});
