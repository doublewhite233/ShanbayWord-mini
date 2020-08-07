// components/study-condition/study-condition.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 上下标题只会有一个显示
    showSubTitle: {
      type: Boolean,
      value: true
    },
    titles: {
      type: Array,
      value: ['未知','未知','未知']
    },
    studyNums: {
      type: Array,
      value: ['-','-','-']
    },
    studyNumsSub:{
      type: Array,
      value: ['','','']
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

  }
})
