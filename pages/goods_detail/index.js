import { request } from "../../request/index";
import regeneratorRuntime from "../../lib/runtime/runtime";
/**
 * 点击加入购物车
 *  1.先绑定点击事件
 *  2.获取缓存中的购物车数据，数组格式
 *  3.先判断当前的商品是否已经存在于购车里
 *  4.如果已存在，修改商品数据，数量+1，重新填充购物车数组
 *  5.不存在购物车中，直接给购物车数组添加一个新元素，重新填充缓存
 *  6.弹出提示
 * 
 * 商品收藏：
 *  1页面onshow的时候，加载缓存中的商品收藏数据
 *  2.判断当前商品是否被收藏，是则更改图标
 *  3.点击商品收藏按钮
 *    1）判断该商品是否存在缓存数组中，已存在，把该商品删除
 *    2）如果不存在，则存入缓存中
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{},
    // 商品是否被收藏过
    isCollect:false
  },
  // 商品对象
  GoodsInfo:{},
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let pages =  getCurrentPages();
    let currentPage = pages[pages.length-1];
    let options = currentPage.options;  
    // console.log(options);
    const { goods_id } = options;
    this.getGoodsDetail(goods_id)

 
  },
  // 获取商品详情
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({ url: "/goods/detail", data: { goods_id } });
    // console.log(res);
    this.GoodsInfo = goodsObj;

    // 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect")||[];
    // 判断当前商品是否被收藏了
    let isCollect = collect.some(v=>v.goods_id===this.GoodsInfo.goods_id);
    


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
        pics:goodsObj.pics,
        isCollect
      }
    });
  },
  // 点击轮播图放大预览
  handlePreviewImage(e){
    // console.log('预览保存')
    // 1.现构建要预览的图片数组
    const urls = this.GoodsInfo.pics.map(v=>v.pics_mid);
    // 2.接收传递过来的图片url
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls
    });
      
  },
  // 加入购物车点击事件
  handleCartAdd(){
    // 1.获取缓存中的购物车数组,如果缓存中没有则为[]
    let cart=wx.getStorageSync("cart") || [];
    // 2.判断商品对象是否存在于购物车数组中
    let index=cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    if (index === -1) {
      // 3.不存在，则是第一次添加
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo);
    } else {
      // 4.已存在，则数量+1
      cart[index].num++;
    }
    // 5.把购物车添加回缓存中
    wx.setStorageSync("cart", cart);
    // 6.弹框提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      // true 防止用户手抖，疯狂点击, true 1.5s之后才可以继续点击
      mask: true
    });
  },
  // 点击商品收藏图标
  handleCollect(){
    let isCollect = false;
    // 1.获取缓存中的商品收藏数组
    let collect=wx.getStorageSync("collect")||[];
    // 2.判断该商品是否被收藏过
    let index = collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    // 3.当index不为-1，则已收藏过
    if (index !== -1) {
      // 已收藏过，则取消,根据索引删除一个
      collect.splice(index,1);
      isCollect = false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true
      });
        
    } else {
      collect.push(this.GoodsInfo);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      });
    }
    // 4.存入缓存中
    wx.setStorageSync("collect", collect);
    // 5.修改data中的属性
   this.setData({
    isCollect
   });
      
  }
})