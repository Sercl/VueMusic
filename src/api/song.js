import {commonParams, proxyUrl} from './config'
import axios from 'axios'
import {getUid} from 'common/js/uid'

const debug = process.env.NODE_ENV !== 'production'

export function getLyric(mid) {
  const url = debug ? '/api/lyric' : proxyUrl + 'lyric'
  //const url = '/api/lyric'
  const data = Object.assign({}, commonParams, {
    songmid: mid,
    pcachetime: +new Date(),
    platform: 'yqq',
    nostUin: 0,
    needNewCode: 0,
    g_tk: 67232076,
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
export function getSongsUrl(songs) {
  const url = debug ? '/api/getPurlUrl' : proxyUrl + 'getPurlUrl'

  let mids = []
  let types = []

  songs.forEach((song) => {
    mids.push(song.mid)
    types.push(0)
  })

  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    uin: 0
  })

  return axios.post(url, {
    comm: data,
    url_mid: genUrlMid(mids, types)
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

function genUrlMid(mids, types) {
  const guid = getUid()
  return {
    module: 'vkey.GetVkeyServer',
    method: 'CgiGetVkey',
    param: {
      guid,
      songmid: mids,
      songtype: types,
      uin: '0',
      loginflag: 0,
      platform: '23'
    }
  }
}
