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
