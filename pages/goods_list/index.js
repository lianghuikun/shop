/**
 * 1.用户上滑 滚动条触底 开始加载下一页数据
 *  1.找到滚动条触底事件
 *  2.判断还有没有下一页数据
 *    1.获取总页数
 *    2.获取当前的页码
 *    3.判断当前的页码是否大于等于总页数，成立则没有下一页
 *    总页数 = Math.ceil(总条数/页容量)
 *          = Math.ceil(23/10)=3
 * 3.假如没有下一页数据 弹出一个提示
 *  1.假如还有下一页数据
 *    1.当前页码++
 *    2.重新发送请求，数据请求回来，需要对数组进行拼接，而不是替换
 */
import { request } from "../../request/index";
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
        value: "销量",
        isActive: false
      }, {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodsList: []
  },
  // 接口要的参数
  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },
  // 总页数
  totalPages: 1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    this.QueryParams.cid = options.cid;
    this.getGoodsList();
  },
  // 获取商品列表数据
  async getGoodsList() {
    const res = await request({ url: "/goods/search", data: this.QueryParams });
    // console.log(res);
    // 获取总条数
    const total = res.total;
    // 计算总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize)
    // console.log(this.totalPages)
    this.setData({
      // goodsList:res.goods
      // 先结构原来的数据goodsList，在解构请求返回的数据goods，然后拼接
      goodsList:[...this.data.goodsList, ...res.goods]
    });
  },
  // 从子组件传递过来的事件
  handleTabsItemChange(e) {
    // console.log(e);
    // 1.获取被点击的标题索引
    const { index } = e.detail;
    // 2.修改源数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3.赋值到data中
    this.setData({
      tabs
    });
  },
  // 页面上滑 滚动条触底事件
  onReachBottom() {
    // console.info('页面触底')
    // 1.判断有没有下一页数据
    if (this.QueryParams.pagenum >= this.totalPages) {
      // 没有下一页数据
      // console.log("没有下一页数据")
      wx.showToast({
        title: '没有下一页数据了'
      });
        
    } else {
      // 有下一页数据
      // console.log("有下一页数据")
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  }
})