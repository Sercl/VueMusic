import {playMode} from '../common/js/config'

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
  currentIndex: -1
}

export default state
