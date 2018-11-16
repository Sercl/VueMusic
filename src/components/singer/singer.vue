<template>
  <div class="singer">
    歌手页面
  </div>
</template>

<script type="text/ecmascript-6">
  import {getSingerList} from '../../api/singer'
  import {ERR_OK} from '../../api/config'
  import Singer from 'common/js/singer'

  const HOT_NAME = '热门'
  const HOT_SINGER_LEN = 10
  export default {
    data() {
      return {
        singers: []
      }
    },
    created() {
      this._getSingerList()
    },
    methods: {
      //获取歌手列表
      _getSingerList() {
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            this.singers = res.data.list
            console.log(this._normalizeSinger(this.singers))
          }
        })
      },
      //规范化数据
      _normalizeSinger(list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        list.forEach((item, index) => {
          //忽略多余的数据,取前十条数据作为热门
          if (index < HOT_SINGER_LEN) {
            //push到歌手数据到hot.items
            map.hot.items.push(new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            }))
          }
          //根据Findex获取歌手
          const key = item.Findex
          //如果map内部没有已经有对应的findex对象则新建一个对象
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          //给这个对象的items数组push个对象
          map[key].items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        })
        //为了得到有序列表，处理map
        let hot = []
        let ret = []
        for (let key in map) {
          let val = map[key]
          //title是否字母
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }
        //ret排序
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        //返回两个数组连接
        return hot.concat(ret)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
