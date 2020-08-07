// pages/profile/childComps/function-list/function-list.js
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
    bindShowModal() {
      wx.showModal({
        cancelColor: '#aaa',
        cancelText: '我知道了',
        confirmColor: '#44cc99',
        confirmText: '前往下载',
        content: '在客服会话中回复“1”，下载扇贝单词（英语版）APP',
        showCancel: true,
        title: '下载APP',
        success: (result) => {},
        fail: (res) => {},
        complete: (res) => {},
      })
    }
  }
})
