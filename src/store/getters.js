//播放器
export const singer = state => state.singer

export const playing = state => state.playing

export const fullScreen = state => state.fullScreen

export const playlist = state => state.playlist

export const sequenceList = state => state.sequenceList

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex

/**
 * 当前播放歌曲数据
 * @param state
 * @returns {*|{}}
 */
export const currentSong = (state) => {
  return state.playlist[state.currentIndex] || {}
}

//歌单列表
export const disc = state => state.disc

//排行榜
export const topList = state => state.topList
