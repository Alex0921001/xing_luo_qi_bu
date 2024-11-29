import { createAxiosByinterceptors } from './index'

const api = createAxiosByinterceptors({
  baseURL: 'http://localhost:5173/api'
})

// 获取全部星辰
export const getAllStars = (params: any): Promise<any> => api.post('/settings/star/list', params)

// 获取星辰详情
export const getStarDetail = (Id: string): Promise<any> => api.post('/settings/star/detail', { Id })

// 新增星辰
export const addStar = (data: any): Promise<any> => api.post('/settings/star/add', data)

// 修改星辰
export const updateStar = (data: any): Promise<any> => api.post('/settings/star/update', data)

// 删除星辰
export const deleteStar = (Id: string | number): Promise<any> =>
  api.post('/settings/star/delete', { Id })

// 获取宫位列表
export const getGongsList = (): Promise<any> => api.post('/settings/box/list')

// 获取天干列表
export const getGansList = (): Promise<any> => api.post('/settings/gan/list')

// 获取地支列表
export const getDizhisList = (): Promise<any> => api.post('/settings/dizhi/list')

// 获取四化列表
export const getSihuasList = (): Promise<any> => api.post('/settings/sihua/list')

// 获取四化表内容
export const getSihuaTable = (): Promise<any> => api.post('/settings/sihua/table')

// 更新四化表的内容
export const updateSihuaTable = (data: any): Promise<any> =>
  api.post('/settings/sihua/update', data)
