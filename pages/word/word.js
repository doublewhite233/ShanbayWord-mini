// pages/word/word.js
import request,{baseURL} from '../../service/network'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    audiopath: '',
    successBtn: '我认识',
    failBtn: '提示一下',
    newnum: 0,
    reviewnum: 0,
    word: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      newnum: options.newnum,
      reviewnum: options.reviewnum,
      word: options.word
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
  bindplayaudio() {
    this.setData({
      audiopath: 'http://media.shanbay.com/audio/us/'+this.data.word.trim()+'.mp3'
    })
    this.audioCtx = wx.createAudioContext('myAudio')
    this.audioCtx.play()
  },
  bindSuccess() {
    console.log('aaaa')
  },
  bindFail() {
    if (this.data.failBtn === '提示一下') {
      this.setData ({
        successBtn: '想起来了',
        failBtn: '没想起来'
      })
    }
  }
})