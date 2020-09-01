// pages/home/childComps/wordlist-book/wordlist-book.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    bookName: {
      type: String,
      value: "没有正在学习的单词书"
    },
    bgImgUrl: {
      type: String,
      value: "/assets/home/no-book.png"
    },
    count: {
      type: Number
    },
    unlearnCount: {
      type: Number
    },
    showBtn: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    finishPercent: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
