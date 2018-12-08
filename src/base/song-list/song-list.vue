<template>
  <div class="song-list">
    <ul>
      <li v-for="song in songs" class="item">
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'song-list',
    props: {
      songs: {
        type: Array,
        default: []
      }
    },
    data() {
      return {}
    },
    methods: {
      getDesc(song) {
        return `${song.singer} 。${song.album}`
      }
    },
    components: {}
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .song-list
    .item
      display flex
      align-items center
      box-sizing border-box
      height 64px
      font-size $font-size-medium
      .content
        flex 1
        line-height 20px
        overflow hidden
        .name
          no-wrap()
          color $color-text
        .desc
          no-wrap()
          margin-top 4px
          color $color-text-d
</style>
