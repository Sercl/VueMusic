import {getLyric, getSongsUrl} from 'api/song'
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
    this.filename = `C400${this.mid}.m4a`
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
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: musicData.url
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

export function isValidMusic(musicData) {
  return musicData.songid && musicData.albummid && (!musicData.pay || musicData.pay.payalbumprice === 0)
}

export function processSongsUrl(songs) {
  return getSongsUrl(songs).then((res) => {
    if (res.code === ERR_OK) {
      let urlMid = res.url_mid
      if (urlMid && urlMid.code === ERR_OK) {
        let midUrlInfo = urlMid.data.midurlinfo
        midUrlInfo.forEach((info, index) => {
          let song = songs[index]
          song.url = `http://dl.stream.qqmusic.qq.com/${info.purl}`
        })
      }
    }
    return songs
  })
}
