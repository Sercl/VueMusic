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

