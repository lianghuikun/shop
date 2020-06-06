/**
 * 一.获取用户的收货地址
 *  1.绑定事件
 *  2.调用小程序内置api获取用户的收货地址
 *  3.获取用户对小程序锁获取的收货地址的权限状态scope
 *    1）假设用户点击获取收货地址的提示框， 点击确定 scope为true,可以直接调用获取收货地址方法
 *    2）加入点击取消则 scope为false，则需要诱导用户自己打开授权设置页面，当用户重新授予获取收货地址权限时获取
 *    3）假设用户从来没调用过收货地址，则scope为undefined，可以直接调用收货地址
 *  4.把获取到的收货地址放入本地存储中
 * 
 * 2.页面加载完毕
 *  1.获取本地存储中的地址数据
 *  2.把数据设置给data中的一个变量
 * 3.全选的实现
 *  1.onshow获取缓存中的购物车数组
 *  2.根据购物车中的商品数据判断，所有都选中，全选才选中
 * 4.总价格和数量
 *  1.都需要商品被选中，才计算
 *  2.获取购物车数组
 *  3.遍历 判断商品是否选中
 * 5.商品的选中功能
 *  1.绑定change事件
 *  2.获取被修改的商品对象
 *  3.商品对象的选中状态 取反
 *  4.重新填充到data中和缓存中
 *  5.重新计算全选 总数量 总价格
 * 6.全选和反选
 *  1.绑定事件
 *  2.获取allchecked
 *  3.直接取反
 *  4.遍历购物车数组，修改购物车数据中的选中的状态
 *  5.重新填充到data和缓存中
 * 7.商品数量的编辑
 *  1.给“+” “-”按钮绑定同一个点击事件，用自定义属性区分
 *  2.传递被点击的商品goods_id
 *  3.获取data中的购物车数组，来获取需要被修改的商品对象
 *  4.直接修改商品对象的数量num
 *  5.把cart数组重新设置到data和缓存中
 * 8.商品删除
 *  1.数量为0，弹框提示是否删除。
 * 9.点击结算
 *  1.判断有没有收货地址信息
 *  2.判断用户有没有选购商品
 *  3.经过以上的验证，跳转到支付页面
 */
import { getSetting, chooseAddress, openSetting, showModal,showToast } from "../../utils/asyncWx.js";

import regeneratorRuntime from "../../lib/runtime/runtime";
Page({
  data: {
    address: {},
    cart: {},
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    // 1.获取缓存中的地址信息
    const address = wx.getStorageSync("address");
    console.log(address);
    // 获取缓存中的购物车数据
    const cart = wx.getStorageSync("cart") || [];
    this.setCart(cart);
    this.setData({
      address
    });

  },
  // 优化后
  // 点击收货地址
  async handleChooseAddress() {
    try {
      // console.log("点击收货地址")
      // 1获取权限状态
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      // 2.判断权限状态
      if (scopeAddress === false) {
        // 3.诱导用户授权,如果未授权，需要授权
        await openSetting();
      }
      // 3.调用获取收货地址
      let address = await chooseAddress();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      //  console.log(address); 
      // 4.存入缓存中
      wx.setStorage({
        key: 'address',
        data: address
      });

    } catch (error) {
      console.log(error);
    }

  },
  // 优化前
  // 点击收货地址
  handleChooseAddress2() {
    // console.log("点击收货地址")
    // 1获取权限状态
    wx.getSetting({
      success: (result) => {
        // 2.获取权限状态
        const scopeAddress = result.authSetting["scope.address"];
        if (scopeAddress === true || scopeAddress === undefined) {
          // 如果时第一打开或者之前授权过，则调用地址
          wx.chooseAddress({
            success: (res) => {
              console.log(res);
            }
          });
        } else {
          // 用户以前拒绝过授予地址访问的权限，则诱导用户授权
          wx.openSetting({
            success: (res) => {
              // 获得授权之后调用收货地址
              wx.chooseAddress({
                success: (result3) => {
                  console.log(result3);
                }
              });

            },
            fail: () => { },
            complete: () => { }
          });

        }
      },
      fail: () => { },
      complete: () => { }
    });


  },
  // 商品的选中
  handleItemChange(e) {
    // 获取被修改的商品的id
    const goods_id = e.currentTarget.dataset.id;
    // console.log(goods_id);
    // 获取购物车数组
    let { cart } = this.data;
    // 找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    // 选中状态取反
    cart[index].checked = !cart[index].checked;
    this.setCart(cart);
  },
  // 设置购物车状态，重新计算全选 总价格 综述来给你
  setCart(cart) {
    // 把购物车重新设置回data和缓存中
    this.setData({
      cart
    });
    wx.setStorageSync("cart", cart);
    // 重新计算总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    let allChecked = true;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    });
    allChecked = cart.length != 0 ? allChecked : false;
    this.setData({
      cart,
      totalNum,
      totalPrice, allChecked
    });
  },
  // 商品的全选功能
  handleItemAllCheck() {
    // 1.获取data中的数据
    let { cart, allChecked } = this.data;
    // 2.修改值
    allChecked = !allChecked;
    // 3.循环修改cart数组中的商品选中状态
    cart.forEach(v => v.checked = allChecked);
    // 4.把修改后的值，填充回data或缓存中
    this.setCart(cart);
  },
  // 商品数量的编辑
  async handleItemNumEdit(e) {
    // 获取商品传递过来的参数
    const { operation, id } = e.currentTarget.dataset;
    // console.log(operation,id)
    // 获取购物车
    let { cart } = this.data;
    const index = cart.findIndex(v => v.goods_id === id);
    // 判断是否执行删除
    if (cart[index].num === 1 && parseInt(operation) === -1) {
      // 弹框提示
      // wx.showModal({
      //   title: '提示',
      //   content: '您是否要删除?',
      //   success: (result) => {
      //     if (result.confirm) {
      //       // 根据索引删除
      //       cart.splice(index,1);
      //       this.setCart(cart);
      //     } else {
      //       console.log("用户点击了取消！");
      //     }
      //   }
      // });
      // 封装之后
      const result = await showModal({ content: "您是否要删除?" });
      if (result.confirm) {
        // 根据索引删除
        cart.splice(index, 1);
        this.setCart(cart);
      }
    } else {
      // 修改
      cart[index].num += parseInt(operation);
      this.setCart(cart);
    }

  },
  // 点击结算
  async handlePay(){
    // 判断收货地址
    const {address} = this.data;
    if (!address.userName){
      await showToast({title:'您还没有选择收货地址'});
      return;
    }
    // 判断用户有没有选购商品
    const {totalNum} = this.data;
    if (totalNum === 0){
      await showToast({title:'您还没有选购商品'});
      return;
    }
    // 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index'
    });
      
  }
})