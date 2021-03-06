import storage from 'good-storage'

//搜索记录key
const SEARCH_KEY = '__search__'
//最大存储记录
const SEARCH_MAX_LENGTH = 15
//播放记录key
const PLAY_KEY = '__play__'
//最大存储长度
const PLAY_MAX_LENGTH = 200

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LENGTH = 200

/**
 * 倒叙插入元素到数组
 * @param arr 本地缓存数组
 * @param val 插入对象
 * @param compare 插入条件函数
 * @param maxLen 最大长度
 */
function insertArray(arr, val, compare, maxLen) {
  //在本地缓存中是否有相同的
  const index = arr.findIndex(compare)
  //如果在数组中第一个则不操作
  if (index === 0) {
    return
  }
  //如果在数组中不是第一个则删除
  if (index > 0) {
    arr.splice(index, 1)
  }
  //向数组头部添加元素
  arr.unshift(val)
  //如果数组元素大于最大存储数量则删除末尾元素
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

/**
 * 删除数组中元素
 * @param arr
 * @param compare 删除条件函数
 */
function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

////////////////搜索历史////////////////////////
//存储本地搜索记录
export function saveSearch(query) {
  //获取‘搜索’本地缓存
  let searches = storage.get(SEARCH_KEY, [])
  //插入搜索记录到本地缓存数组
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)
  //设置缓存
  storage.set(SEARCH_KEY, searches)
  //返回完整数组
  return searches
}
//加载初始的本地缓存数据
export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}
//删除搜索记录
export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}
//清空搜索记录
export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}

////////////////播放历史////////////////////////
export function savePlay(song) {
  let songs = storage.get(PLAY_KEY, [])
  insertArray(songs, song, (item) => {
    return item.id === song.id
  }, PLAY_MAX_LENGTH)
  storage.set(PLAY_KEY, songs)
  return songs
}

export function loadPlay() {
  return storage.get(PLAY_KEY, [])
}

////////////////喜欢歌曲////////////////////////
export function saveFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, FAVORITE_MAX_LENGTH)
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function deleteFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, (item) => {
    return song.id === item.id
  })
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function loadFavorite() {
  return storage.get(FAVORITE_KEY, [])
}
