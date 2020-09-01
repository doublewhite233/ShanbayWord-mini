// pages/goal/goal.js
import request,{baseURL} from '../../service/network'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookid: 1,
    bookName: '',
    imgURL: '',
    count: 1,
    datalist: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      bookName: options.bookname,
      imgURL: options.imgurl,
      count: options.count,
      bookid: options.bookid
    }),
    this. getDatalist()
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
  getDatalist() {
    request ({
      url: baseURL + '/goaldata'
    }).then ( res => {
      this.setData({
        datalist: res.data
      })
    })
  },
  bindSetGoal(e) {
    let currentIndex = e.detail.currentIndex
    request({
      url: baseURL + '/addbook',
      header: {
        token: app.globalData.token
      },
      data: {
        goalIndex: currentIndex,
        bookid: this.data.bookid
      }
    }).then(res => {
      app.getShanbayInfo(),
      wx.navigateTo({
        url: '../mybooks/mybooks',
      })
    })
  }
})