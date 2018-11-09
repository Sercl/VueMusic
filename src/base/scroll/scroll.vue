<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'

  export default {
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      data: {
        type: Array,
        default: null
      }
    },
    data() {
      return {}
    },
    component: {},
    mounted() {
      //初始化列表
      setTimeout(() => {
        this._initScroll()
      }, 20)
    },
    methods: {
      _initScroll() {
        //初始化scroll
        //如果没有渲染wrapper则直接返回，不然容易报错4.10  5：40
        if (!this.$refs.wrapper) {
          return
        }
        //初始化BScroll列表滑动，参数1：dom，参数2：
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
        })
      },
      enable() {
        //如果为真则执行
        this.scroll && this.scroll.enable()
      },
      disable() {
        this.scroll && this.scroll.disable()
      },
      refresh() {
        //重新计算
        this.scroll && this.scroll.refresh()
      }
    },
    watch: {
      data() {
        //data如果有变化则进行重新计算
        setTimeout(() => {
          this.refresh()
        }, 20)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
