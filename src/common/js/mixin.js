import {mapGetters} from 'vuex'

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
