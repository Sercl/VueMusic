/**
 * 返回min到max之间的随机数（包含min和max）
 * @param min
 * @param max
 * @return {number}
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * 打乱数组
 * @param arr
 * @return {*}
 */
export function shuffle(arr) {
  //深拷贝，不影响原本的数组
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

/**
 * 节流函数
 * @param func 函数
 * @param delay 延时时间
 */
export function debounce(func, delay) {
  let timer
  return function (...args) {
    //是否已经在执行
    if (timer) {
      //清楚计时器
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
