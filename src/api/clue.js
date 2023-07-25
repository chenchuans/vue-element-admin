import request from '@/utils/request'

// 批量添加
export function clueAdd(data) {
  return request({
    url: '/back/clue/add',
    method: 'post',
    data
  })
}

// 批量添加
export function clueAdds(data) {
  return request({
    url: '/back/clue/sadd',
    method: 'post',
    data
  })
}

// 批量删除
export function clueDel(data) {
  return request({
    url: '/back/clue/del',
    method: 'post',
    data
  })
}

// 删除
export function publicDel(data) {
  return request({
    url: '/back/clue/public/del',
    method: 'post',
    data
  })
}

// 编辑
export function clueEdit(data) {
  return request({
    url: '/back/clue/edit',
    method: 'post',
    data
  })
}

// 展示所有
export function clueList(data) {
  return request({
    url: '/back/clue/list',
    method: 'post',
    data
  })
}

// 展示所有收藏
export function collectList(data) {
  return request({
    url: '/back/followup/star/list',
    method: 'post',
    data
  })
}

// 公海下载
export function publicDownload(data) {
  return request({
    url: '/back/clue/public/download',
    method: 'post',
    data
  })
}

// 所有数据下载
export function allDataDownload(data) {
  return request({
    url: '/back/clue/all/download',
    method: 'post',
    data
  })
}

// 展示所有公海
export function publicList(data) {
  return request({
    url: '/back/clue/public/list',
    method: 'post',
    data
  })
}

// 展示所有数据
export function allDataList(data) {
  return request({
    url: '/back/clue/all/list',
    method: 'post',
    data
  })
}

// 展示在库数据列表
export function zaiDataList(data) {
  return request({
    url: '/back/clue/zaiku/list',
    method: 'post',
    data
  })
}

// 在库数据下载
export function zaiDataDownload(data) {
  return request({
    url: '/back/clue/zaiku/download',
    method: 'post',
    data
  })
}

// 转移
export function clueTrans(data) {
  return request({
    url: '/back/clue/trans',
    method: 'post',
    data
  })
}

// 批量公海转移
export function publicTrans(data) {
  return request({
    url: '/back/clue/public/trans',
    method: 'post',
    data
  })
}

// 数据池-所有数据转移
export function allDataTrans(data) {
  return request({
    url: '/back/clue/public/trans',
    method: 'post',
    data
  })
}

// 数据池-负责人下拉列表
export function dataUsers(data) {
  return request({
    url: '/back/clue/users/all',
    method: 'post',
    data
  })
}

// -负责人下拉列表
export function clueUsers(data) {
  return request({
    url: '/back/clue/users',
    method: 'post',
    data
  })
}

// 打开侧弹窗，上报电话
export function phoneAdd(data) {
  return request({
    url: '/back/followup/person/phone/add',
    method: 'post',
    data
  })
}
