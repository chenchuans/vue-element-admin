/**
 * @param {string} da
 * @returns {String}
 */
export function getNowFormatDate(da) {
  var date = new Date(da)
  var seperator1 = '-'
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var strDate = date.getDate()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate
  return currentdate
}

// 获取当前时间
export function getCurrentTime(da) {
  // 创建对象
  const date = new Date(da)
  // 获取年份
  const y = date.getFullYear()
  // 获取月份  返回0-11
  let m = date.getMonth() + 1
  // 获取日
  let d = date.getDate()
  // 获取星期几  返回0-6   (0=星期天)
  // let w = date.getDay();
  // 星期几
  // let ww = ' 星期' + '日一二三四五六'.charAt(date.getDay());
  // 时
  let h = date.getHours()
  // 分
  let minute = date.getMinutes()
  // 秒
  let s = date.getSeconds()
  // 毫秒
  let sss = date.getMilliseconds()

  if (m < 10) {
    m = '0' + m
  }
  if (d < 10) {
    d = '0' + d
  }
  if (h < 10) {
    h = '0' + h
  }
  if (minute < 10) {
    minute = '0' + minute
  }
  if (s < 10) {
    s = '0' + s
  }
  if (sss < 10) {
    sss = '00' + sss
  } else if (sss < 100) {
    sss = '0' + sss
  }
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + s
}

/**
 * @param {number} date
 * @returns {Array}
 */
// 设置每个页面时间选择器的间隔天数，目前默认7天，只有转化跟进下是30天
export function defaultStartEndDate(date = 7) {
  const end = new Date()
  const start = new Date()
  start.setTime(start.getTime() - 3600 * 1000 * 24 * date)
  return [start, end]
}

/**
 * @param {fileStream} Arraybuffer
 * @param {string} filename
 * @returns {undefined}
 */
export function download(fileStream, filename = '业绩') {
  const blob = new Blob([fileStream], {
    // type值如后台设置，前端可省略，具体type值可参考https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  })
  const downloadElement = document.createElement('a') // 创建a标签
  const href = window.URL.createObjectURL(blob) // 创建DOMString
  // 设置文件名字
  downloadElement.style.display = 'none' // 隐藏a标签
  downloadElement.href = href // 赋值a标签的href
  downloadElement.download = filename // 下载后文件名
  document.body.appendChild(downloadElement) // 插入a标签
  downloadElement.click() // 点击下载
  document.body.removeChild(downloadElement) // 下载完成移除元素
  window.URL.revokeObjectURL(href) // 释放掉blob对象
}
