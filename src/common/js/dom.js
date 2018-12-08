/**
 * 添加class
 * @param el dom元素
 * @param className css名称
 */
export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

/**
 * 检测是否存在css
 * @param el dom元素
 * @param className css名称
 * @returns {boolean}
 */
export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

/**
 *获取dom元素中data-属性值
 * @param el dom元素
 * @param name 属性名称
 * @param val 属性值
 * @returns {*}
 */
export function getData(el, name, val) {
  const prefix = 'data-'
  name = prefix + name
  //有val值则设置属性名称和值，无则获取name属性的值
  if (val) {
    return el.setAttribute(name, val)
  } else {
    return el.getAttribute(name)
  }
}
//获取所有支持的css属性
let elementStyle = document.createElement('div').style

let vendor = (() => {
  //定义浏览器支持
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }
  //遍历返回浏览器支持属性值
  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }

  return false
})()

/**
 * 浏览器兼容css
 * @param style css属性名
 * @returns {*} 返回兼容属性
 */
export function prefixStyle(style) {
  if (vendor === false) {
    return false
  }
  //标准浏览器
  if (vendor === 'standard') {
    return style
  }
  console.log(vendor + style.charAt(0).toUpperCase() + style.substr(1))
  //其他标准浏览器  浏览器前缀+首字母大写
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}

