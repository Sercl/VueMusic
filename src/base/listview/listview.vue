<template>
  <scroll class="listview"
          :data="data"
          ref="listview"
          :listenScroll="listenScroll"
          :probeType="probeType"
          @scroll="scroll"
  >
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)"
              v-for="item in group.items"
              class="list-group-item"
          >
            <img class="avatar" v-lazy="item.avatar"/>
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart"
         @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item, index) in shortcutList"
            class="item"
            :data-index="index"
            :class="{'current': currentIndex === index}"
        >
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import {getData} from 'common/js/dom'
  import Loading from 'base/loading/loading'
  //列表标记的高度
  const ANCHOR_HEIGHT = 18
  //title的高度
  const TITLE_HEIGHT = 30
  export default {
    created() {
      this.touch = {}
      this.listenScroll = true
      this.probeType = 3
      this.listHeight = []
    },
    name: '',
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        //scroll的Y坐标
        scrollY: -1,
        //当前显示的index
        currentIndex: 0,
        //title的偏移量
        diff: -1
      }
    },
    components: {Scroll, Loading},
    computed: {
      //取title的第一个字符,热门取热，取首字母
      shortcutList() {
        return this.data.map((group) => {
          return group.title.substr(0, 1)
        })
      },
      fixedTitle() {
        if (this.scrollY > 0) {
          return ''
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    methods: {
      selectItem(item) {
        this.$emit('select', item)
      },
      onShortcutTouchStart(e) {
        //获取点击的索引
        let anchorIndex = getData(e.target, 'index')
        let firstTouch = e.touches[0]
        //存储第一次点击y1
        this.touch.y1 = firstTouch.pageY
        //存储index
        this.touch.anchorIndex = anchorIndex
        this._scrollTo(anchorIndex)
      },
      onShortcutTouchMove(e) {
        let firstTouch = e.touches[0]
        //存储滑动时的位置y2
        this.touch.y2 = firstTouch.pageY
        //计算滑动开始到当前位置是有几个元素
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
        //计算滑动时当前的元素对应的index
        let anchorIndex = parseInt(this.touch.anchorIndex) + delta
        this._scrollTo(anchorIndex)
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      _scrollTo(index) {
        //console.log(index)
        //如果没有index则不进行操作
        if (!index && index !== 0) {
          return
        }
        //滑动时最上方index会无限减小，最下方会无限增大
        if (index < 0) {
          index = 0
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length
        }
        this.scrollY = -this.listHeight[index]
        //第二个参数为动画时间
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      },
      //计算每个list元素高度
      _calculateHeight() {
        this.listHeight = []
        //获取list元素集合
        const list = this.$refs.listGroup
        let height = 0
        //第一个元素为0，比列表元素多一个
        this.listHeight.push(height)
        //获取每个list元素的高度
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      scrollY(newY) {
        const listHeight = this.listHeight
        //当滚动到顶部以上时，newY>0
        if (newY > 0) {
          this.currentIndex = 0
          return
        }
        //在中间部分滚动，
        for (let i = 0; i < listHeight.length - 1; i++) {
          //下限
          let height1 = listHeight[i]
          //上限
          let height2 = listHeight[i + 1]
          // console.log(listHeight)
          // console.log(newY)
          //newY初始是负值，转正值计算
          //在一个区间内则是对应的i
          if (-newY >= height1 && -newY < height2) {
            this.currentIndex = i
            this.diff = height2 + newY
            return
          }
        }
        //当滚动到底部且-newY>最后一个元素，因数组元素比listDom元素要多一个所以-2
        this.currentIndex = listHeight.length - 2
      },
      diff(newVal) {
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
      }
    }

  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)


</style>
