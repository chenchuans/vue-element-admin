import request from '@/utils/request'

// 用户登录
export function login(data) {
  return request({
    url: '/front/user/login',
    method: 'post',
    data
  })
}

// 添加用户
export function userAdd(data) {
  return request({
    url: '/back/user/add',
    method: 'post',
    data
  })
}

// 删除用户
export function userDel(data) {
  return request({
    url: '/back/user/del',
    method: 'post',
    data
  })
}

// 编辑用户
export function userUpdate(data) {
  return request({
    url: '/back/user/update',
    method: 'post',
    data
  })
}

// 获取用户列表
export function userList(data) {
  return request({
    url: '/back/user/list',
    method: 'post',
    data
  })
}

// -------------------------部门管理---------------------------------------
// 新增部门
export function deptAdd(data) {
  return request({
    url: '/back/dept/add',
    method: 'post',
    data
  })
}

// 删除部门
export function deptDel(data) {
  return request({
    url: '/back/dept/del',
    method: 'post',
    data
  })
}

// 更新部门
export function deptUpdate(data) {
  return request({
    url: '/back/dept/update',
    method: 'post',
    data
  })
}

// 根据父部门获取部门信息，0为总公司
export function deptList(data) {
  return request({
    url: '/back/dept/list',
    method: 'post',
    data
  })
}

// 修改部门主管
export function editDeptAdmin(data) {
  return request({
    url: '/back/dept/admin/add',
    method: 'post',
    data
  })
}

// 添加部门人员关系
export function addDeptStaff(data) {
  return request({
    url: '/back/dept/user/add',
    method: 'post',
    data
  })
}

// 删除部门人员关系
export function delDeptStaff(data) {
  return request({
    url: '/back/dept/user/del',
    method: 'post',
    data
  })
}

// 获取当前部门下人员
export function listDeptStaff(data) {
  return request({
    url: '/back/dept/user/list',
    method: 'post',
    data
  })
}
// -------------------------部门管理---------------------------------------
