<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" v-show="songs.length>0" ref="playBtn">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll @scroll="scroll"
            :probe-type="probeType"
            :listen-scroll="listenScroll"
            ref="list"
            :data="songs"
            class="list"
    >
      <div class="song-list-wrapper">
        <song-list :songs="songs"></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import SongList from 'base/song-list/song-list'
  import {prefixStyle} from 'common/js/dom'
  import Loading from 'base/loading/loading'
  //头部保留高度
  const RESERVEN_HEIGHT = 40
  //
  const transform = prefixStyle('transform')
  //
  const backdrop = prefixStyle('backdrop-filter')
  export default {
    name: 'music-list',
    props: {
      //背景图
      bgImage: {
        type: String,
        default: ''
      },
      //歌曲数据
      songs: {
        type: Array,
        default: []
      },
      //标题
      title: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        scrollY: 0
      }
    },
    mounted() {
      this.imageHeight = this.$refs.bgImage.clientHeight
      //偏移距离
      this.minTranslateY = -this.imageHeight + RESERVEN_HEIGHT
      //设置歌曲列表的top属性为bgImg的高度，避免遮挡bgImg
      this.$refs.list.$el.style.top = `${this.imageHeight}px`
    },
    created() {
      this.probeType = 3
      this.listenScroll = true
    },
    computed: {
      bgStyle() {
        return `background-image:url(${this.bgImage})`
      }
    },
    methods: {
      scroll(pos) {
        this.scrollY = pos.y
      },
      back() {
        this.$router.back()
      }
    },
    watch: {
      scrollY(newY) {
        //滚动最大偏移距离
        let tranlateY = Math.max(this.minTranslateY, newY)
        let zIndex = 0
        let scale = 1
        let blur = 0
        console.log(this.$refs.layer.style)
        this.$refs.layer.style[transform] = `translate3d(0,${tranlateY}px,0)`
        const percent = Math.abs(newY / this.imageHeight)
        //下拉时图片跟随放大
        if (newY > 0) {
          scale = 1 + percent
          zIndex = 10
        } else {
          //最大是20模糊
          blur = Math.min(20 * percent, 20)
        }
        this.$refs.filter.style[backdrop] = `blur(${blur}px)`
        //TODO backdrop属性测试
        //this.$refs.filter.style['webkitBackdrop-filter'] = `blur(${blur}px)`
        //是否滚动到顶部
        if (newY < this.minTranslateY) {
          //滚到顶部
          zIndex = 10
          //取消内边距和高度
          this.$refs.bgImage.style.paddingTop = 0
          this.$refs.bgImage.style.height = `${RESERVEN_HEIGHT}px`
          //隐藏随机播放按钮
          this.$refs.playBtn.style.display = 'none'
        } else {
          //没有滚动到顶部恢复内边距和高度
          this.$refs.bgImage.style.paddingTop = '70%'
          this.$refs.bgImage.style.height = 0
          //恢复随机播放按钮
          this.$refs.playBtn.style.display = ''
        }
        this.$refs.bgImage.style.zIndex = zIndex
        this.$refs.bgImage.style[transform] = `scale(${scale})`
        //this.$refs.bgImage.style['webkitTransform'] = `scale(${scale})`
      }
    },
    components: {SongList, Scroll, Loading}
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position fixed
    z-index 100
    top 0
    left 0
    bottom 0
    right 0
    background $color-background
    .back
      position absolute
      top 0
      left 6px
      z-index 50
      .icon-back
        display block
        padding 10px
        font-size $font-size-large-x
        color $color-theme
    .title
      position absolute
      top 0
      left 10%
      z-index 40
      width 80%
      no-wrap()
      text-align center
      line-height 40px
      font-size $font-size-large
      color $color-text
    .bg-image
      position relative
      width 100%
      height 0
      padding-top 70%
      transform-origin top
      background-size cover
      .play-wrapper
        position absolute
        bottom 20px
        z-index 50
        width 100%
        .play
          box-sizing border-box
          width 135px
          padding 7px 0
          margin 0 auto
          text-align center
          border 1px solid $color-theme
          color $color-theme
          border-radius 100px
          font-size 0
          .icon-play
            display inline-block
            vertical-align middle
            margin-right 6px
            font-size $font-size-medium-x
          .text
            display inline-block
            vertical-align middle
            font-size $font-size-small
      .filter
        position absolute
        top 0
        left 0
        width 100%
        height 100%
        background rgba(7, 17, 27, 0.4)
    .bg-layer
      position relative
      height 100%
      background $color-background
    .list
      position fixed
      top 0
      bottom 0
      width 100%
      background $color-background
      .song-list-wrapper
        padding 20px 30px
      .loading-container
        position absolute
        width 100%
        top 50%
        transform translateY(-50%)
</style>
