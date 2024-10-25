import { createAxiosByinterceptors } from './index'

const api = createAxiosByinterceptors({
  baseURL: '/api'
})

// 测试接口
export const appList = (params: any): Promise<any> => api.get('/user/get', { params })
