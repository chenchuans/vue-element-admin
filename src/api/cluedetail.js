import request from '@/utils/request'
// /common/upload  上传文件

// 添加收藏
export function addCollect(data) {
  return request({
    url: '/back/followup/star/add',
    method: 'post',
    data
  })
}

// 取消收藏
export function cancelCollect(data) {
  return request({
    url: '/back/followup/star/del',
    method: 'post',
    data
  })
}

// 展示操作记录
export function opList(data) {
  return request({
    url: '/back/followup/op/list',
    method: 'post',
    data
  })
}

// 跟进记录列表
export function followupList(data) {
  return request({
    url: '/back/followup/list',
    method: 'post',
    data
  })
}

// 跟进记录增加
export function followupAdd(data) {
  return request({
    url: '/back/followup/add',
    method: 'post',
    data
  })
}

// 跟进记录编辑
export function followupEdit(data) {
  return request({
    url: '/back/followup/edit',
    method: 'post',
    data
  })
}

// 跟进记录删除
export function followupDel(data) {
  return request({
    url: '/back/followup/del',
    method: 'post',
    data
  })
}

// 文件列表
export function fileList(data) {
  return request({
    url: '/back/followup/file/list',
    method: 'post',
    data
  })
}

// 文件删除
export function fileDel(data) {
  return request({
    url: '/back/followup/file/del',
    method: 'post',
    data
  })
}

// 文件添加
export function fileAdd(data) {
  return request({
    url: '/back/followup/file/add',
    method: 'post',
    data
  })
}

// 文件重命名
export function fileRename(data) {
  return request({
    url: '/back/followup/file/rename',
    method: 'post',
    data
  })
}
