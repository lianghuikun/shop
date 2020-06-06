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
 */   
import {getSetting, chooseAddress,openSetting} from "../../utils/asyncWx.js";

import regeneratorRuntime from "../../lib/runtime/runtime";
Page({
  data:{
    address:{},
    cart:{}
  },
  onShow(){
    // 1.获取缓存中的地址信息
    const address = wx.getStorageSync("address");
    console.log(address);
    // 获取缓存中的购物车数据
    const cart = wx.getStorageSync("cart");
    this.setData({
      address,
      cart
    });
      
  },
  // 优化后
  // 点击收货地址
  async handleChooseAddress(){
    try {
    // console.log("点击收货地址")
    // 1获取权限状态
    const res1 = await getSetting();
    const scopeAddress = res1.authSetting["scope.address"];
    // 2.判断权限状态
    if (scopeAddress===false){
      // 3.诱导用户授权,如果未授权，需要授权
      await openSetting();
    }
     // 3.调用获取收货地址
     let address = await chooseAddress();
     address.all = address.provinceName+address.cityName+address.countyName+address.detailInfo;
    //  console.log(address); 
    // 4.存入缓存中
     wx.setStorage({
       key: 'address',
       data: address
     });
       
    } catch(error) {
      console.log(error);
    }
    
  },
  // 优化前
  // 点击收货地址
  handleChooseAddress2(){
    // console.log("点击收货地址")
    // 1获取权限状态
    wx.getSetting({
      success: (result) => {
        // 2.获取权限状态
        const scopeAddress = result.authSetting["scope.address"];
        if (scopeAddress===true||scopeAddress===undefined){
          // 如果时第一打开或者之前授权过，则调用地址
          wx.chooseAddress({
            success: (res) => {
              console.log(res);
            }
          });
        }else {
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
            fail: () => {},
            complete: () => {}
          });
            
        }
      },
      fail: () => {},
      complete: () => {}
    });
      
      
  }
})