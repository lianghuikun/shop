/**
 *  1.点 + 触发tap点击事件
 *    1）调用小程序内置点选择图片的api
 *    2）获取图片的路径数组
 *    3）把图片路径存储到data的变量中
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true
      },
      {
        id: 1,
        value: "商品/商家投诉",
        isActive: false
      }
    ],
    // 被选中的图片路径数组
    chooseImgs: []
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
  // 选择图片
  handleChooseImg() {
    wx.chooseImage({
      // 同时选中的图片的数量
      count: 9,
      // 图片的格式， 原图，压缩
      sizeType: ['original', 'compressed'],
      // 图片来源，相册，照相机
      sourceType: ['album', 'camera'],
      success: (result) => {
        // console.log(result);
        this.setData({
          // 图片数组进行拼接
          chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
        });
      },
      fail: () => { },
      complete: () => { }
    });

  },
  // 点击自定义图片组件
  handleRemoveImg(e) {
    // 获取被点击的组件的索引
    const {index} = e.currentTarget.dataset;
    // console.log(index);
    // 获取图片数组
    let {chooseImgs} = this.data;
    // 删除元素
    chooseImgs.splice(index, 1);
    this.setData({
      chooseImgs
    });
  }
})