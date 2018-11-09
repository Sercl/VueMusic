<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>

      </slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item,index) in dots"
            :class="{active:currentPageIndex === index}"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import {addClass} from 'common/js/dom'

  export default {
    props: {
      //是否循环
      loop: {
        type: Boolean,
        default: true
      },
      //是否自动切换
      autoPlay: {
        type: Boolean,
        default: true
      },
      //自动切换时长
      interval: {
        type: Number,
        default: 2000
      }

    },
    data() {
      return {
        dots: [],
        children: [],
        // 当前页数
        currentPageIndex: 0
      }
    },
    mounted() {
      setTimeout(() => {
        //计算宽度
        this._setSliderWidth()
        //初始化dots
        this._initDots()
        //初始化轮播
        this._initSlider()
        //是否开启自动轮播
        if (this.autoPlay) {
          this._play()
        }
      }, 20)
      //当窗口变化时候调用
      window.addEventListener('resize', () => {
        if (!this.slider) {
          return
        }
        //设置宽度，传参，如果重新调整大小则宽度不用*2
        this._setSliderWidth(true)
        //重新计算slider
        this.slider.refresh()
      })
    },
    destroyed() {
      //销毁时清除计时器
      clearTimeout(this.timer)
    },
    component: {BScroll},
    methods: {
      //设置宽度，传参不计算*2
      _setSliderWidth(isResize) {
        //获取sliderGroup的dom元素集合
        this.children = this.$refs.sliderGroup.children
        let width = 0
        //宽度设置为sliderWidth的宽度为slider内部宽度
        let sliderWidth = this.$refs.slider.clientWidth
        //遍历元素
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i]
          //给每一个元素添加一个class
          addClass(child, 'slider-item')
          //设置元素宽度
          child.style.width = sliderWidth + 'px'
          width += sliderWidth
        }
        //如果自动循环和无窗口变化则
        if (this.loop && !isResize) {
          width += 2 * sliderWidth
        }
        //设置宽度为width
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      _initDots() {
        //初始化dots，有几个轮播图则设置几个
        this.dots = new Array(this.children.length)
      },
      _initSlider() {
        //初始化BScroll，参数1：外层dom元素集合；参数2：设置属性
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: true,
          snapLoop: this.loop,
          snapThreshold: 0.3,
          snapSpeed: 400
        })
        //监听滚动停止
        this.slider.on('scrollEnd', () => {
          //新的页
          let pageIndex = this.slider.getCurrentPage().pageX
          if (this.loop) {
            //如果自动循环则-1
            pageIndex -= 1
          }
          //当前页
          this.currentPageIndex = pageIndex
          //如果自动轮播
          if (this.autoPlay) {
            //清楚计时器，防止手动滑动时自动跳转
            clearTimeout(this.timer)
            //调用下一页
            this._play()
          }
        })
      },
      //切换下一页
      _play() {
        let pageIndex = this.currentPageIndex + 1
        if (this.loop) {
          pageIndex += 1
        }
        //切换到指定页
        this.timer = setTimeout(() => {
          this.slider.goToPage(pageIndex, 0, 400)
        }, this.interval)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
