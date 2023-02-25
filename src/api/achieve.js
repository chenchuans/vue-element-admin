import request from '@/utils/request'

// 获取业绩管理筛选条件
export function getAchieveInfo(data) {
  return request({
    url: '/back/rank/info',
    method: 'post',
    data
  })
}

// 获取业绩管理列表
export function listAchieve(data) {
  return request({
    url: '/back/rank/list',
    method: 'post',
    data
  })
}

// 修改业绩
export function updateAchieve(data) {
  return request({
    url: '/back/rank/update',
    method: 'post',
    data
  })
}

// 今日业绩
export function todayRank(data) {
  return request({
    url: '/back/rank/rank/today',
    method: 'post',
    data
  })
}

// 业绩排行
export function rankList(data) {
  return request({
    url: '/back/rank/rank',
    method: 'post',
    data
  })
}

// 业绩排行
export function rankDetailList(data) {
  return request({
    url: '/back/rank/rank/detail',
    method: 'post',
    data
  })
}

// 业绩明细下载
export function rankDetailDownload(data) {
  return request({
    url: '/back/rank/rank/detail/download',
    method: 'post',
    data
  })
}

// 业绩详情下载
export function rankDownload(data) {
  return request({
    url: '/back/rank/rank/download',
    method: 'post',
    data
  })
}
