/**
 * 工具 js
 */

function urlSplit(url) {
  if (url.indexOf('?') !== -1) {
    return url.split('?')[0]
  } else {
    return url
  }
}

function delElByIndex(arr, index) {
  for (var i = index, len = arr.length - 1; i < len; i++) arr[i] = arr[i + 1]
  arr.length = len
  return arr
}

function getUrlParam(url, name) {
  var reg = new RegExp("(^|&)" + par + "=([^&]*)(&|$)");
  var result = url.substr(1).match(reg)[2];
  
  if (result && result[2]) {
    return result[2];
  }
  
  return false;
}
function unitFilter(val) {
  if (val) {
    switch(val) {
      case 'DAY':
        return '天'
      case 'MINUTE':
        return '分钟'
      case 'HOUR':
        return '小时'
    }
  }
}

export { urlSplit, delElByIndex, getUrlParam, unitFilter }
