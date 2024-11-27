import { createAxiosByinterceptors } from './index'

const api = createAxiosByinterceptors({
  baseURL: '/api'
})

// 测试接口
export const appList = (params: any): Promise<any> => api.get('/noauto/about', { params })

// 获取全部星辰
export const getAllStars = (params: any): Promise<any> => api.get('/settings/star/list', { params })

// 获取星辰详情
export const getStarDetail = (id: string): Promise<any> => api.get('/settings/star/detail' + id)

// 新增星辰
export const addStar = (data: any): Promise<any> => api.post('/settings/star/add', data)

// 修改星辰
export const updateStar = (data: any): Promise<any> => api.post('/settings/star/update', data)

// 删除星辰
export const deleteStar = (id: string | number): Promise<any> =>
  api.post('/settings/star/delete', { id })
