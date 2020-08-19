// pages/choosebook/childComps/type-bar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    title: '四级',
    chooseIndex: 0,
    showmoreFlag: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindClickItem(event) {
      if (event.currentTarget.dataset.index != this.data.chooseIndex){
        this.setData ({
          chooseIndex: event.currentTarget.dataset.index,
          title: this.properties.type[event.currentTarget.dataset.index].typename,
          showmoreFlag: !this.data.showmoreFlag
        })
        this.triggerEvent('indexChanged',this.data.chooseIndex,{})
      }
    },
    bindShow() {
      this.setData ({
        showmoreFlag: !this.data.showmoreFlag
      })
    }
  }
})
