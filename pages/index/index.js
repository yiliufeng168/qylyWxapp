//index.js
//获取应用实例
import drawQrcode from '../../utils/weapp.qrcode.js'

const app = getApp()


Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

  },
  //事件处理函数
  bindViewTap: function () {
    // wx.navigateTo({
    //   url: '../logs/logs'
    // })
    console.log('tap ')
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          wx.request({
            url: app.globalData.baseUrl + '/customer/login/',
            method: "POST",
            data: {
              'code': res.code
            },
            header: app.globalData.myheader,
            success: res => {
              if (res.statusCode === 200) {
                app.globalData.myheader['cookie'] = res.header['Set-Cookie']
                app.globalData.jsonheader['cookie'] = res.header['Set-Cookie']
                console.log(res.header['Set-Cookie'])
                wx.showToast({
                  title: '登陆成功',
                  icon:'success',
                  duration:2000,
                })
              }
            }
          })
        } else {
          console.log("登陆失败！" + res.errMsg)
        }
      }
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  showrecommend: function () {
    console.log("显示推荐商品")
    wx.request({
      url: app.globalData.baseUrl + '/customer/showrecommend/',
      method: "GET",
      //page 显示页面
      //pagecount 每页显示记录数
      data: {
        page: 1,
        pagecount: 2,
      },
      header: app.globalData.myheader,
      success: res => {
        if (res.statusCode === 200) {
          console.log(res.data)
          wx.showModal({
            title:'推荐商品',
            cancelColor: '#000000',
            content:JSON.stringify(res.data)
          })
        }
      }
    })

  },
  showbusiness: function () {
    console.log("显示商家列表")
    wx.request({
      url: app.globalData.baseUrl + '/customer/showbusiness/',
      method: "GET",
      data: {
        type: 0, //显示酒店为0，显示景点为1
        page: 1, //显示的页面
        pagecount: 2, //每页显示的记录数

        //模糊搜索酒店名
        // icontains: "东方", //搜索内容        
        //如果要显示的商家的商品有时间约束：比如居住日期则需设置以下参数，可不填写
        // startdatetime: '2020-10-15 12:00:00', //有效期开始时间 
        // enddatetime: '2020-10-18 12:00:00', //有效期结束时间
      },
      header: app.globalData.myheader,
      success: res => {
        if (res.statusCode === 200) {
          console.log(res.data)
          wx.showModal({
            title:'商家列表',
            cancelColor: '#000000',
            content:JSON.stringify(res.data)
          })
        }
      }
    })
  },
  showgoods: function () {
    wx.request({
      url: app.globalData.baseUrl + "/customer/showgoods/",
      header: app.globalData.myheader,
      method: "GET",
      data: {
        business_id: "3256bbd65e184b2fbfed6efe16f1deac", //必填，酒店ID
        page: 1, //选填，要显示页面(默认1)
        pagecount: 5, //选填，每页显示的记录数（默认10)
        //筛选时间，以下两个参数必须同时出现或不出现
        startdatetime: "2020-10-22T04:20:20", //选填，开始时间
        enddatetime: "2020-10-24T04:20:20" //选填，结束时间
      },
      success: res => {
        console.log(res.data)
        wx.showModal({
          title:'商品列表',
          cancelColor: '#000000',
          content:JSON.stringify(res.data)
        })
      }
    })
  },
  showgoodsdetail: function () {
    console.log("显示商品的发售信息")
    wx.request({
      url: app.globalData.baseUrl + "/customer/showgoodsdetail/",
      header: app.globalData.myheader,
      method: "GET",
      data: {
        goods_id: "f74569ccb2bb46e8b81f32865198ef2f" //必填，商品id
      },
      success: res => {
        console.log(res.data)
        wx.showModal({
          title:'发售信息',
          cancelColor: '#000000',
          content:JSON.stringify(res.data)
        })
      }
    })
  },
  sendorder: function () {
    console.log('发送订单')
    wx.request({
      url: app.globalData.baseUrl + "/customer/tourist/sendorder/",
      header: app.globalData.jsonheader,
      method: "POST",
      data: {
        business: "7d97e567a0b945a19b6156291f0daeb2",
        receiver: "大胖子",
        phone: "17878666666",
        address: "浙江省丽水市莲都区白云街道丽水学院",
        remarks: "身份证",
        order_list: [{
            sell_id: 5,
            count: 1
          },
          {
            sell_id: 6,
            count: 1
          }
        ]
      },
      success: res => {
        console.log(res.data)
        wx.showModal({
          title:'下单结果',
          cancelColor: '#000000',
          content:JSON.stringify(res.data)
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  showorderlist: function () {
    wx.request({
      url: app.globalData.baseUrl + "/customer/tourist/showorderlist/",
      header: app.globalData.myheader,
      method: "GET",
      data: {
        page: 1, //选填，要显示的页面，默认1
        pagecount: 10 //选填，每页显示的记录数，默认10
      },
      success: res => {
        console.log(res.data)
        wx.showModal({
          title:'我的订单',
          cancelColor: '#000000',
          content:JSON.stringify(res.data)
        })
      }
    })
  },
  showorderdetails: function () {
    wx.request({
      url: app.globalData.baseUrl + "/customer/tourist/showorderdetails/",
      header: app.globalData.myheader,
      method: "GET",
      data: {
        orderid: "a30abb9b3c0c4e6e957f1b76844f8ffb" //订单编号
      },
      success: res => {
        console.log(res.data)
        wx.showModal({
          title:'订单中的res详情',
          cancelColor: '#000000',
          content:JSON.stringify(res.data)
        })
      }
    })
  },
  getvcode: function () {
    var res_id = "e442c56493be4228be542c4d9be00b4b";
    wx.request({
      url: app.globalData.baseUrl + "/customer/tourist/getvcode/",
      header: app.globalData.myheader,
      method: "GET",
      data: {
        res_id: res_id
      },
      success: res => {
        if (res.data.status == "OK") {
          drawQrcode({
            width: 200,
            height: 200,
            canvasId: 'myQrcode',
            text: "res_id=" + res_id + "&vcode=" + res.data.vcode,
          })
          wx.showModal({
            title:'由核销员扫码使用',
            cancelColor: '#000000',
            content:JSON.stringify(res.data)
          })
        } else {
          console.log(res.data)
          
        }

      }
    })
  },
  delreserve: function () {
    wx.request({
      url: app.globalData.baseUrl + "/customer/tourist/delreserve/",
      header: app.globalData.myheader,
      method: "GET",
      data: {

      },
      success: res => {
        console.log(res.data)
        wx.showModal({
          title:'删除订单(示例值肯已被删除返回错误结果)',
          cancelColor: '#000000',
          content:JSON.stringify(res.data)
        })
      }
    })
  },
  vlogin: function () {
    wx.request({
      url: app.globalData.baseUrl + "/management/login/",
      header: app.globalData.myheader,
      method: "POST",
      data: {
        username: "xujia05",
        password: "123456"
      },
      success: res => {
        console.log(res.data)
        app.globalData.myheader['cookie'] = res.header['Set-Cookie']
        app.globalData.jsonheader['cookie'] = res.header['Set-Cookie']
        wx.showModal({
          title:'核销员登陆',
          cancelColor: '#000000',
          content:JSON.stringify(res.data)
        })
      }
    })
  },
  vwriteoff: function () {
    wx.scanCode({
      onlyFromCamera: true,
      success: res => {
        wx.request({
          url: app.globalData.baseUrl + "/verification/writeoff/?" + res.result,
          header: app.globalData.myheader,
          method: "GET",
          
          success: res => {
            console.log(res)
            wx.showModal({
              title:'核销商品',
              cancelColor: '#000000',
              content:JSON.stringify(res)
            })
          },
          fail:res=>{
            console.log(res)
          }
          

        })
      }
    })

  },
})