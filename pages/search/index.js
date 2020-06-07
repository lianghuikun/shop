/**
 * 1.给输入框绑定事件
 *  1）获取到输入框的值
 *  2）合法性判断
 *  3）检验通过，把输入框的值发送到后台
 *  4）将返回的数据打印到页面上
 * 2.防抖,通过定时器实现
 *  1）定义全局的定时器id
 *  防抖一般放在输入框，防止重复发送
 *  节流，一般用在页面下拉和上拉
 */
import { request } from "../../request/index.js"
import regeneratorRuntime from "../../lib/runtime/runtime";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:[],
    // 取消按钮是否显示
    isFocus:false,
    // 输入框的值
    inValue:""
  },
  TimeId:-1,
  // 监听输入框
  handleInput(e){
    // console.log(e);
    // 1.获取输入框的值
    const {value} = e.detail;
    // 2.检验合法性
    if (!value.trim()) {
      this.setData({
        isFocus:false,
        goods:[]
      });
      // 不合法
      return;
    }
    this.setData({
      isFocus:true
    });
    clearTimeout(this.TimeId);
    // 用定时器，1秒后执行
    this.TimeId=setTimeout(()=>{
          // 3.准备发送请求获取数据
      this.qsearch(value);
    }, 1000);
  },
  // 发送请求
  async qsearch(query) {
    const res = await request({url:"/goods/qsearch",data:{query}});
    // console.log(res);
    this.setData({
      goods:res
    });
  }
  ,
  // 点击取消按钮
  handleCancel(){
    this.setData({
      inValue:"",
      isFocus:false,
      goods:[]
    });
  }
})