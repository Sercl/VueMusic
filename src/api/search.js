import {commonParams, proxyUrl} from './config'
import axios from 'axios'

const debug = process.env.NODE_ENV !== 'production'

//搜索热门歌曲
export function getHotKey() {
  //const url = '/api/getHotKey'
  const url = debug ? '/api/getHotKey' : proxyUrl + 'getHotKey'
  const data = Object.assign({}, commonParams, {
    format: 'json',
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'h5',
    needNewCode: 1
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

/**
 * 搜索歌曲
 * @param query 搜索对象
 * @param page  页数
 * @param zhida 是否需要歌手数据
 */
export function search(query, page, zhida, perpage) {
  const url = debug ? '/api/search' : proxyUrl + 'search'
  const data = Object.assign({}, commonParams, {
    format: 'json',
    w: query,
    p: page,
    catZhida: zhida ? 1 : 0,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage,
    n: perpage,
    remoteplace: 'txt.mqq.all',
    uid: 0,
    needNewCode: 1,
    platform: 'h5'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
