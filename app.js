//app.js
import request,{baseURL} from './service/network'

const TOKEN = 'token'
App({
  globalData: {
    userInfo: null,
    token: '',
    ShanbayInfo: {}
  },
  onLaunch: function () {
    this.getShanbayInfo()
    const token = wx.getStorageSync(TOKEN)
    if (token && token.length !== 0) {
      this.checkToken(token)
    }else {
      this.login()
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 登录是否失效
          wx.checkSession({
            success: (res) => {},
            fail: (res) => {
              // 登录失效，重新登陆
              this.login()
            }
          })

          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  checkToken(token){
    request({
      url: baseURL + '/auth',
      header: {
        token
      }
    }).then(res => {
      if (!res.data.errCode) {
        this.globalData.token = token
      }else {
        this.login()
      }
    })
  },
  // 登录
  login() {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        const code = res.code
        request ({
          url: baseURL + '/login',
          data: {
            code: code
          }
        }).then(res => {
          console.log(res)
          const token = res.data.token
          // 将token保存到globalData中
          this.globalData.token = token
          // 本地存储
          wx.setStorageSync(TOKEN, token)
        }).catch(err => {
          console.log(err)
        })
      }
    })
  },
  getShanbayInfo() {
    const token = wx.getStorageSync(TOKEN)
    request({
      url: baseURL + '/userinfo',
      header: {
        token
      }
    }).then(res => {
      console.log(res)
      this.globalData.ShanbayInfo = res.data[0]
    })
  }
})