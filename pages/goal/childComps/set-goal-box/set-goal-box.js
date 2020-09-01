// pages/goal/childComps/set-goal-box/set-goal-box.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    datalist: {
      type: Object,
      value: {}
    },
    wordnum: {
      type: Number,
      value: 1
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    Yposition: 0,
    scrollY: 0,
    nowScroll: 0,
    listLen: 0,
    eachHeight: 42.2,
    currentIndex: 1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindStart(e) {
     this.setData({
       Yposition: e.changedTouches[0].pageY,
       scrollY: this.data.nowScroll,
       listLen: this.properties.datalist.length
     })
    },
    bindMove(e) {
      let scroll = e.changedTouches[0].pageY - this.data.Yposition
      this.setData({
        scrollY: scroll + this.data.nowScroll
      })
    },
    bindEnd(e) {
      let scroll = e.changedTouches[0].pageY - this.data.Yposition
      this.setData({
        nowScroll: scroll+ this.data.nowScroll
      })
      if (this.data.nowScroll >= 0) {
        this.setData({
          nowScroll: 0,
          scrollY: 0,
          currentIndex: 1
        })
      }
      else if (this.data.nowScroll <= -((this.data.listLen-1)*this.data.eachHeight)) {
        this.setData({
          nowScroll: -((this.data.listLen-1)*this.data.eachHeight),
          scrollY: -((this.data.listLen-1)*this.data.eachHeight),
          currentIndex: this.data.listLen
        })
      }
      else {
        let temp = Math.floor((-this.data.nowScroll+10)/this.data.eachHeight) + 1
        this.setData({
          nowScroll: -((temp-1)*this.data.eachHeight),
          scrollY: -((temp-1)*this.data.eachHeight),
          currentIndex: temp
        })
      }
    },
    bindSetGoal() {
      this.triggerEvent('setgoal',{currentIndex:this.data.currentIndex})
    }
  }
})
