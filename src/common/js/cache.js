import storage from 'good-storage'

//搜索记录key
const SEARCH_KEY = '__search__'
//最大存储记录
const SEARCH_MAX_LENGTH = 15
//播放记录key
const PLAY_KEY = '__play__'
//最大存储长度
const PLAY_MAX_LENGTH = 200

/**
 * 倒叙插入元素到数组
 * @param arr 本地缓存数组
 * @param val 搜索记录对象
 * @param compare 是否记录已经存在 函数
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

function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

/**
 * 存储本地搜索记录
 * @param query 搜索记录
 * @return {*|*|*}
 */
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

export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}

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
