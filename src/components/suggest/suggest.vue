<template>
  <scroll class="suggest"
          :pullup="pullup"
          :data="result"
          @scrollToEnd="searchMore"
          ref="suggest"
          @beforeScroll="listScroll"
          :beforeScroll="beforeScroll"
  >
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="item in result">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import {search} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {createSong, isValidMusic, processSongsUrl} from 'common/js/song'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import Singer from 'common/js/singer'
  import {mapMutations, mapActions} from 'vuex'
  import NoResult from 'base/no-result/no-result'

  //歌手类型
  const TYPE_SINGER = 'singer'
  //每页返回个数
  const perpage = 20
  export default {
    name: 'suggest',
    props: {
      query: {
        type: String,
        default: ''
      },
      //是否允许搜索歌手
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        page: 1,
        result: [],
        //是否开启上拉刷新
        pullup: true,
        //是否无更多数据标志位
        hasMore: true,
        beforeScroll: true
      }
    },
    components: {Scroll, Loading, NoResult},
    methods: {
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ]),
      refresh() {
        this.$refs.suggest.refresh()
      },
      listScroll() {
        this.$emit('listScroll')
      },
      selectItem(item) {
        //是否是歌手类型搜索结果
        if (item.type === TYPE_SINGER) {
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          //跳转歌手页
          this.$router.push({
            path: `/search/${singer.id}`
          })
          this.setSinger(singer)
        } else {
          //在播放列表中添加歌曲
          this.insertSong(item)
        }
        this.$emit('select', item)
      },
      search() {
        //重置scroll位置
        this.page = 1
        this.$refs.suggest.scrollTo(0, 0)
        this.hasMore = true
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
            this._genResult(res.data).then((result) => {
              this.result = result
            })
            //this.result = this._genResult(res.data)
            this._checkMore(res.data)
          }
        })
      },
      //搜索更多
      searchMore() {
        if (!this.hasMore) {
          return
        }
        this.page++
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
            this._genResult(res.data).then((result) => {
              this.result = this.result.concat(result)
            })
            //this.result = this.result.concat(this._genResult(res.data))
            this._checkMore(res.data)
          }
        })
      },
      //判断是否无更多数据
      _checkMore(data) {
        const song = data.song
        if (!song.list.length || (song.curnum + (song.curpage - 1) * perpage) >= song.totalnum) {
          this.hasMore = false
        }
      },
      _genResult(data) {
        let ret = []
        if (data.zhida && data.zhida.singerid && this.page === 1) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        return processSongsUrl(this._normalizeSongs(data.song.list)).then((songs) => {
          ret = ret.concat(songs)
          return ret
        })
        // if (data.song) {
        //   ret = ret.concat(this._normalizeSongs(data.song.list))
        // }
        // return ret
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          if (isValidMusic(musicData)) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },

      getIconCls(item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      getDisplayName(item) {
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.name}-${item.singer}`
        }
      }
    },
    watch: {
      query(newQuery) {
        if (!newQuery) {
          return
        }
        this.search(newQuery)
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden

    .suggest-list
      padding: 0 30px

      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px

      .icon
        flex: 0 0 30px
        width: 30px

        [class^="icon-"]
          font-size: 14px
          color: $color-text-d

      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden

        .text
          no-wrap()

    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
