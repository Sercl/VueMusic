import {getLyric} from 'api/song'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'

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
  //获取歌词
  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject('no lyric')
        }
      })
    })
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
    //TODO 歌曲临时播放时间
    duration: 32, //musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    //url: `http://isure.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?fromtag=32`
    url: 'http://lmd.wzrcc.cn/songs/SkyeLey%20-%20%E7%94%9F%E6%97%A5%E5%BF%AB%E4%B9%90%E6%AD%8C.mp3'
  })
}
//http://dl.stream.qqmusic.qq.com/C400004Sgjxx15dcO5.m4a?guid=2763302232&vkey=8DBAC8CF4550FB746E257204C28F303930F774D5370BAD0C6D42F9A5BCE9C01F55AF5561C980DA38B9219F20CE016F49FEE335681E2205CD&uin=0&fromtag=66
//http://dl.stream.qqmusic.qq.com/C400000O9EQX3MKTdL.m4a?guid=2763302232&vkey=CF685F5E38D52BD537D8A52158324254F0C7566275B7AAE04D453A137132182C56B8847D228C4444A7A72B3BEAB4988FD3203AFF5C26355E&uin=0&fromtag=66

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
