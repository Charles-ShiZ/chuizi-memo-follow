/*
 * @Author: Liu LongBin
 * @Date: 2020-01-16 16:28:09
 * @Last Modified by: Liu LongBin
 * @Last Modified time: 2020-01-16 16:34:35
 */

/**
 *
 * @param {string} dateStr 需要被处理的时间字符串
 */
function dateFormat(dateStr) {
  const dt = new Date(dateStr)

  const y = dt.getFullYear()
  const m = padZero(dt.getMonth() + 1)
  const d = padZero(dt.getDate())

  const hh = padZero(dt.getHours())
  const mm = padZero(dt.getMinutes())
  const ss = padZero(dt.getSeconds())

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
}

/**
 *
 * @param {number} n 需要补零的值
 */
function padZero(n) {
  return n > 9 ? n : '0' + n
}

module.exports = {
  dateFormat
}
