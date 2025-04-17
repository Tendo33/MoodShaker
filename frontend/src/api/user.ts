import request from '@/utils/request'

export interface UserInfo {
  id: number
  uuid: string
  username: string
  email: string
  phone: string | null
  avatar: string | null
  status: number
  is_superuser: boolean
  join_time: string
  last_login_time: string | null
}

export interface CreateUserDto {
  username: string
  password: string
  email: string
}

export interface UpdateUserDto {
  username: string
  email: string
  phone?: string
}

export interface ResetPasswordDto {
  username: string
  old_password: string
  new_password: string
  confirm_password: string
}

export interface AvatarDto {
  url: string
}

export interface LoginDto {
  username: string
  password: string
  captcha: string
}

export interface LoginResponse {
  token: string
  userInfo: UserInfo
}

// 获取验证码
export function getCaptcha() {
  return request({
    url: '/admin/auth/captcha',
    method: 'get'
  })
}

// 用户登录
export function login(data: LoginDto) {
  return request<LoginResponse>({
    url: '/admin/auth/login',
    method: 'post',
    data
  })
}

// 用户登出
export function logout() {
  return request({
    url: '/admin/auth/logout',
    method: 'post'
  })
}

// 用户注册
export function register(data: CreateUserDto) {
  return request({
    url: '/admin/user/register',
    method: 'post',
    data
  })
}

// 密码重置
export function resetPassword(data: ResetPasswordDto) {
  return request({
    url: '/admin/user/password/reset',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getUserInfo(username: string) {
  return request({
    url: `/admin/user/${username}`,
    method: 'get'
  })
}

// 更新用户信息
export function updateUserInfo(username: string, data: UpdateUserDto) {
  return request({
    url: `/admin/user/${username}`,
    method: 'put',
    data
  })
}

// 更新头像
export function updateAvatar(username: string, data: AvatarDto) {
  return request({
    url: `/admin/user/${username}/avatar`,
    method: 'put',
    data
  })
}

// 获取用户列表
export function getUserList(params: {
  username?: string
  phone?: string
  status?: number
  page?: number
  pageSize?: number
}) {
  return request({
    url: '/admin/user',
    method: 'get',
    params
  })
}

// 删除用户
export function deleteUser(username: string) {
  return request({
    url: `/admin/user/${username}`,
    method: 'delete'
  })
} 