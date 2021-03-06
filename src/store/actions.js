import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {saveSearch, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite} from 'common/js/cache'

/**
 * 当前元素在数组中的索引
 * @param list 数组
 * @param song 索引
 * @return {*|number} 当前数组的索引
 */
function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

/**
 * 选择播放歌曲
 * @param commit 修改state数据的对象
 * @param state state对象
 * @param list 歌曲列表
 * @param index 播放索引
 */
export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list)
  //选择播放时是否已经是随机播放模式
  if (state.mode === playMode.random) {
    //打乱歌曲数组
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    //当前播放歌曲的索引
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
/**
 * 随机播放
 * @param commit
 * @param list
 */
export const randomPlay = function ({commit}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
/**
 * 插入歌曲
 * @param commit
 * @param state
 * @param song 歌曲数据
 */
export const insertSong = function ({commit, state}, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex

  //记录当前正在播放歌曲
  let currentSong = playlist[currentIndex]
  //查找当前列表是是否存在插入歌曲，返回其索引
  let fpIndex = findIndex(playlist, song)
  //在当前播放歌曲后一首插入
  currentIndex++
  playlist.splice(currentIndex, 0, song)
  //是否已经包含插入歌曲
  if (fpIndex > -1) {
    //如果当前插入的序号大于歌曲在列表中的序号
    if (currentIndex > fpIndex) {
      //删除原有歌曲
      playlist.splice(fpIndex, 1)
      //当前播放-1
      currentIndex--
    } else {
      playlist.splice(fpIndex + 1, 1)
    }
  }

  //顺序播放列表中插入位置在当前播放歌曲后一首
  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  //顺序播放列表中歌曲所在位置
  let fsIndex = findIndex(sequenceList, song)
  //插入歌曲
  sequenceList.splice(currentSIndex, 0, song)
  if (fpIndex > -1) {
    //如果当前插入的序号大于歌曲在列表中的序号
    if (currentIndex > fsIndex) {
      //删除原有歌曲
      sequenceList.splice(fpIndex, 1)
      //当前播放-1
    } else {
      sequenceList.splice(fpIndex + 1, 1)
    }
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
/**
 * 保存搜索结果
 * @param commit
 * @param query
 */
export const saveSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}
/**
 * 删除对应搜索历史
 * @param commit
 * @param query
 */
export const deleteSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}
//清空搜索历史记录
export const clearSearchHistory = function ({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}
/**
 * 删除播放列表中的歌曲
 * @param commit
 * @param state
 * @param song 歌曲
 */
export const deleteSong = function ({commit, state}, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  //获取播放列表对应歌曲的index并删除
  let pIndex = findIndex(playlist, song)
  playlist.splice(pIndex, 1)
  //获取顺序列表中对应歌曲的index并删除
  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)
  //如果当前播放歌曲在删除歌曲之前或当前播放歌曲是播放列表末尾
  if (currentIndex > pIndex || currentIndex === playlist.length) {
    currentIndex--
  }
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  const playingState = playlist.length > 0
  commit(types.SET_PLAYING_STATE, playingState)
  // //歌曲列表中是否有歌曲
  // if (!playlist.length) {
  //   //没有则停止播放
  //   commit(types.SET_PLAYING_STATE, false)
  // } else {
  //   commit(types.SET_PLAYING_STATE, true)
  // }
}
//清空歌曲列表
export const deleteSongList = function ({commit}) {
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false)
}
export const savePlayHistory = function ({commit}, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}

export const saveFavoriteList = function ({commit}, song) {
  commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}

export const deleteFavoriteList = function ({commit}, song) {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}

