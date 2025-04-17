import request from '@/utils/request'

// 获取验证码
export const getCaptcha = () => {
  return request({
    url: '/api/v1/auth/captcha',
    method: 'get',
    responseType: 'blob'  // 使用 blob 类型接收图片数据
  })
} 