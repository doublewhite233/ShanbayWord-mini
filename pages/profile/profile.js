// pages/profile/profile.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userId: '点击登录',
    userAvatar: '/assets/profile/avatar.png',
    loginDisable: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo != null){
      this.setData ({
        userId: app.globalData.userInfo.nickName,
        userAvatar: app.globalData.userInfo.avatarUrl,
        loginDisable: true
      })
    }
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
    return {
      title: '扇贝单词极速版',
      path: '/pages/home/home'
    }
  },
  bindGetUserInfo (e) {
    this.setData({
      userId: e.detail.userInfo.nickName,
      userAvatar: e.detail.userInfo.avatarUrl,
      loginDisable: true
    })
  }
})