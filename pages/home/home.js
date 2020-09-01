// pages/home/home.js
import request,{baseURL} from '../../service/network'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: "快开始今天的学习吧",
    btnMessage: "去选单词书",
    studyInfo: {},
    existFlag: false,
    newnum: 0,
    reviewnum: 0,
    unlearnnum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    request({
      url: baseURL + '/getstudyinfo',
      header: {
        token: app.globalData.token
      }
    }).then(res => {
      this.setData({
        studyInfo: res.data[0]
      })
      if (this.data.studyInfo !== undefined) {
        this.setData({
          existFlag: true,
          btnMessage: "开始学习"
        })
      }
      if (this.data.studyInfo.unlearnnum < this.data.studyInfo.newnum){
        this.setData({
          newnum: this.data.studyInfo.unlearnnum
        })
      }else {
        this.setData({
          newnum: this.data.studyInfo.newnum
        })
      }
      if (this.data.studyInfo.count - this.data.studyInfo.unlearnnum < this.data.studyInfo.reviewnum) {
        this.setData({
          reviewnum: this.data.studyInfo.count - this.data.studyInfo.unlearnnum
        })
      }else {
        this.setData({
          reviewnum: this.data.studyInfo.reviewnum
        })
      }
      this.setData({
        unlearnnum: this.data.newnum + this.data.reviewnum
      })
      console.log(this.data.studyInfo)
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    return {
      title: '扇贝单词极速版',
      path: '/pages/home/home'
    }
  },
  bindStart() {
    if (app.globalData.userInfo == null) {
      wx.showToast({
        title: '您还未登录哟',
        icon: 'none',
        mask: true,
        complete: (res) => {}
      })
    }
    if (app.globalData.ShanbayInfo.booknum == 0) {
      wx.navigateTo({
        url: '/pages/choosebook/choosebook',
      })
    }
    else {
      request({
        url: baseURL + '/getstudyword',
        header: {
          token: app.globalData.token
        }
      }).then(res => {
        console.log(res)
        let word = res.data[0].word
        wx.navigateTo({
          url: '/pages/word/word?newnum='+this.data.newnum+'&reviewnum='+this.data.reviewnum+'&word='+word,
        })
      })
    }
  }
})