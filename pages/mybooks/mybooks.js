// pages/mybooks/mybooks.js
import request,{baseURL} from '../../service/network'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mybookinfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    request({
      url: baseURL + '/getmybook',
      header: {
        token: app.globalData.token
      }
    }).then(res => {
      this.setData ({
        mybookinfo: res.data
      })
    })
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
  onShareAppMessage: function () {

  },
  bindNavToGoal() {
    let learnbook = {}
    for(let i in this.data.mybookinfo) {
      if (this.data.mybookinfo[i].islearn === 1){
        learnbook = this.data.mybookinfo[i]
      }
    }
    wx.navigateTo({
      url: '/pages/goal/goal?bookname='+ learnbook.bookname + "&imgurl=" + learnbook.imgURL
      + "&count=" + learnbook.count + "&bookid=" + learnbook.bookid,
    })
  },
  bindNavToChooseBook() {
    wx.navigateTo({
      url: '../choosebook/choosebook',
    })
  },
  bindDelBook(e) {
    request({
      url: baseURL + '/delbook',
      header: {
        token: app.globalData.token
      },
      data: {
        bookid: e.detail.bookid
      }
    }).then(res => {
      this.onLoad()
    })
  },
  bindLearnBook(e){
    request({
      url: baseURL + '/changelearn',
      header: {
        token: app.globalData.token
      },
      data: {
        bookid: e.detail.bookid
      }
    }).then(res => {
      this.onLoad()
    })
  }
})