import { request } from "../../request/index";
import regeneratorRuntime from "../../lib/runtime/runtime";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    const { goods_id } = options;
    this.getGoodsDetail(goods_id)
  },
  // 获取商品详情
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({ url: "/goods/detail", data: { goods_id } });
    // console.log(res);
    this.setData({
      goodsObj:{
        goods_name:goodsObj.goods_name,
        goods_price:goodsObj.goods_price,
        // goods_introduce:goodsObj.goods_introduce,
        // iphone部分收集，不识别webp格式图片
        // 最好找到后台工程师，让后台修改
        // 前端临时修改，要确保后台存在 1.webp  =》1.jpg 
        // 全部替换（不推荐)
        goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics:goodsObj.pics
      }
    });
  },

})