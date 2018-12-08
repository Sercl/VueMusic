export default class Song {
  /**
   *
   * @param id 歌曲Id
   * @param mid 歌曲Mid
   * @param singer 歌手信息
   * @param name 歌手名称
   * @param album 专辑名称
   * @param duration 歌曲长度
   * @param image 歌曲图片
   * @param url 歌曲url
   */
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
}

/**
 * 格式化歌曲数据
 * @param musicData 歌曲数据
 * @returns {Song} 歌曲实例
 */
export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://isure.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?fromtag=32`
  })
}

/**
 * 处理歌手数据
 * @param singer 歌手数据
 * @returns {string} 多个歌手用‘/’连接
 */
function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}
