// pages/profile/childComps/choose-bar/choose-bar.js
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindNavToMybooks() {
      if (app.globalData.ShanbayInfo.booknum !== 0){
        wx.navigateTo({
          url: '/pages/mybooks/mybooks'
        })
    }else {
      wx.navigateTo({
        url: '/pages/choosebook/choosebook',
      })
    }
    },
    bindNavToNewword() {
      wx.navigateTo({
        url: '/pages/newword/newword',
      })
    },
    bindNavToWordnotes() {
      wx.navigateTo({
        url: '/pages/wordnotes/wordnotes',
      })
    }
  }
})
