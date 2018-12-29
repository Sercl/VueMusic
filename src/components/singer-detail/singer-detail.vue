<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import {getSingerDetail} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import {createSong, isValidMusic, processSongsUrl} from '../../common/js/song'
  import MusicList from 'components/music-list/music-list'

  export default {
    name: 'singer-detail',
    data() {
      return {
        songs: []
      }
    },
    computed: {
      ...mapGetters([
        'singer'
      ]),
      title() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.avatar
      }
    },
    created() {
      this._getDetail()
    },
    methods: {
      _getDetail() {
        if (!this.singer.id) {
          this.$router.push('/singer')
        }
        getSingerDetail(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            processSongsUrl(this._normalizeSongs(res.data.list)).then((songs) => {
              this.songs = songs
            })
            //this.songs = this._normalizeSongs(res.data.list)
            //console.log(this.songs)
          }
        })
      },
      /**
       * 格式化歌曲数据
       * @param list 歌曲列表
       * @private
       */
      _normalizeSongs(list) {
        let ret = []
        list.forEach((item) => {
          //获取列表中每个歌曲里的musicData属性
          let {musicData} = item
          //存在songid和albummid则push到ret中
          if (isValidMusic(musicData)) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    },
    components: {MusicList}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
