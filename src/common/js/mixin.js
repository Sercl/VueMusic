import {mapGetters, mapActions, mapMutations} from 'vuex'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted() {
    this.handlePlaylist(this.playlist)
  },
  activated() {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    //如果组件调用时，内部没有handlePlaylist覆盖当前的方法则会触发异常
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist method;组件中必须包含handlePlaylist方法')
    }
  }
}
export const playerMixin = {
  computed: {
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'playlist',
      'mode'
    ]),
    //播放模式的css样式
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    }
  },
  methods: {
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    }),
    //改变播放模式
    changeMode() {
      //0-2范围
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        //打乱歌曲数组
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    //重新计算当前歌曲在新列表中的索引，防止切换模式时切换当前播放歌曲
    resetCurrentIndex(list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    }
  }
}
export const searchMixin = {
  data() {
    return {
      query: '',
      refreshDelay: 100
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ]),
    //添加搜索内容
    addQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    //保存搜索结果
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
    //取消输入框交掉
    blurInput() {
      this.$refs.searchBox.blur()
    },
    //改变搜索内容
    onQueryChange(query) {
      this.query = query
    }
  }
}
