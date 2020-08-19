// pages/choosebook/choosebook.js
import request,{baseURL} from '../../service/network'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: {},
    currentIndex: 0,
    booklist: {},
    currentBookInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    request({
      url: baseURL + '/booktype'
    }).then(res => {
      this.setData({
        type: res.data
      })
      request({
        url: baseURL + '/showbook',
        data: {
          currentIndex: this.data.currentIndex + 1
        }
      }).then(res => {
        this.setData({
          booklist: res.data
        })
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
  bindIndexChanged(event) {
    this.setData({
      currentIndex: event.detail
    }),
    request({
      url: baseURL + '/showbook',
      data: {
        currentIndex: this.data.currentIndex + 1
      }
    }).then(res => {
      this.setData({
        booklist: res.data
      })
    })
  },
  bindNavToGoal(event) {
    this.setData({
      currentBookInfo: event.currentTarget.dataset.bookinfo
    })
    wx.navigateTo({
      url: '/pages/goal/goal?bookname='+ this.data.currentBookInfo.bookname + "&imgurl=" + this.data.currentBookInfo.imgURL
       + "&count=" + this.data.currentBookInfo.count,
    })
  }
})