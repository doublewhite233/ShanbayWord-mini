// pages/mybooks/childComps/book-item/book-item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: '未知'
    },
    imgURL: {
      type: String,
      value: '未知'
    },
    wordnum: {
      type: Number,
      value: 0
    },
    bookid: {
      type: Number,
      value: 0
    }
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
    bindDelBook() {
      this.triggerEvent('delbook',{bookid: this.properties.bookid})
    },
    bindLearnBook() {
      this.triggerEvent('learnbook',{bookid: this.properties.bookid})
    }
  }
})
