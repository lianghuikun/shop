import { request } from "../../request/index";
import regeneratorRuntime from "../../lib/runtime/runtime";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧的菜单数据
    leftMenuList: [],
    // 右边的商品数据
    rightContent: [],
    // 被点击的左侧的菜单
    currentIndex: 0,
    // 右侧内容的滚动条距离顶部的距离
    scrollTop: 0
  },
  // 接口的返回数据
  Cates: [],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /**
     * 1.先判断本地缓存中有没有旧的数据
     *  格式：{time:Date.now(),data:[..]} {time:当前时间,data:json数组}
     * 2.没有旧数据，则发送新请求
     * 3.有旧数据同时旧数据没过期，则使用旧的数据
     */
    // this.getCates();
    // 1.获取本地中的数据
    const Cates = wx.getStorageSync("cates");
    // 2.判断
    if (!Cates) {
      // 不存在，发送请求获取数据
      this.getCates();
    } else {
      // 有旧的数据，暂时顶一个一个过期时间，10s，验证过了，再改为10分钟
      if (Date.now - Cates.time > 1000 * 10) {
        // 旧的数据过期了
        this.getCates();
      } else {
        // 可以使用旧的数据
        console.log("可以使用旧的数据")
        this.Cates = Cates.data;
        // 构造左侧的大菜单数据
        let leftMenuList = this.Cates.map(v => v.cat_name);
        // 构造右侧的商品数据
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        });
      }
    }
  },
  // 获取分类数据
  // getCates() {
  //   request({
  //     // url: "https://api-hmugo-web.itheima.net/api/public/v1/categories"
  //     url: "/categories"
  //   })
  //     .then(res => {
  //       // console.log(res)
  //       this.Cates = res.data.message;
  //       // 把接口数据放入本地存储
  //       wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
  //       // 构造左侧的大菜单数据
  //       let leftMenuList = this.Cates.map(v => v.cat_name);

  //       // 构造右侧的商品数据
  //       let rightContent = this.Cates[0].children;
  //       this.setData({
  //         leftMenuList,
  //         rightContent
  //       });
  //     })

  // },
  // es7获取分类
  async getCates() {
    // 1.使用es7的async await来发送异步请求
    const res = await request({ url: "/categories" });
    // this.Cates = res.data.message;
    this.Cates = res;
    // 把接口数据放入本地存储
    wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
    // 构造左侧的大菜单数据
    let leftMenuList = this.Cates.map(v => v.cat_name);
    // 构造右侧的商品数据
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    });
  },


  // 左侧菜单的点击事件
  handleItemTap(e) {
    /**
     * 1.获取被点击的标题身上的索引
     * 2.给data中的 currentIndex 赋值
     * 3.根据不同的索引渲染不同的商品内容
     */
    const { index } = e.currentTarget.dataset;
    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent,
      // 重新设置右侧内容的scroll-view距离顶部的距离
      scrollTop: 0
    });
  }
})