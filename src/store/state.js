import {playMode} from 'common/js/config'
import {loadSearch} from 'common/js/cache'

const state = {
  //歌手数据
  singer: {},
  //播放状态
  playing: false,
  //是否全屏
  fullScreen: false,
  //播放列表
  playlist: [],
  //顺序列表
  sequenceList: [],
  //默认播放模式
  mode: playMode.sequence,
  //当前播放歌曲索引
  currentIndex: -1,
  //推荐歌单数据
  disc: {},
  //排行榜歌曲列表
  topList: {},
  //搜索历史记录
  searchHistory: loadSearch(),
  //播放历史
  playHistory: [],
  //喜欢歌曲
  favoriteList: []
}

export default state
