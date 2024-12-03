import { Lunar } from 'lunar-typescript'
import { GANS, DIZHIS } from '@renderer/enums'
// 五虎遁月决
// 甲己之年丙作首
// 乙庚之年戊作首
// 丙辛之年庚作首
// 丁壬之年壬作首
// 戊癸之年甲作首
export const getWuHuDun = (date: string) => {
  const d = Lunar.fromDate(new Date(date))
  const yearGan = d.getYearGan()
  switch (yearGan) {
    case '甲':
      return '丙'
    case '乙':
      return '戊'
    case '丙':
      return '庚'
    case '丁':
      return '壬'
    case '戊':
      return '甲'
    case '己':
      return '丙'
    case '庚':
      return '戊'
    case '辛':
      return '庚'
    case '壬':
      return '壬'
    case '癸':
      return '甲'
    default:
      return ''
  }
}

export const handleGanList = (ganId: number, diZhiId: number) => {
  if (diZhiId == 1 || diZhiId == 2) {
    const gap = diZhiId
    const currentGanId = ganId + (gap % 10)
    const list = handleGanList(currentGanId, 3)
    return list
  } else {
    const beforeGanId = GANS.filter((gan) => gan.Id < ganId)
    const afterGanId = GANS.filter((gan) => gan.Id >= ganId)
    const sortGan = [...afterGanId, ...beforeGanId]

    const dizhiList = DIZHIS.filter((diZhi) => diZhi.Id != 1 && diZhi.Id != 2)
    const beforeDiZhiId = dizhiList.filter((diZhi) => diZhi.Id < diZhiId)
    const afterDiZhiId = dizhiList.filter((diZhi) => diZhi.Id >= diZhiId)
    const sortDiZhi = [...afterDiZhiId, ...beforeDiZhiId]

    const list: any[] = []
    sortGan.map((item, index) => {
      const params = {
        ganId: item.Id,
        diZhiId: sortDiZhi[index].Id
      }
      list.push(params)
    })

    // 拷贝 list 中 diZhiId 为 3 和 4 的项，添加到 list 的末尾
    const copyItems = list.filter((item) => item.diZhiId === 3 || item.diZhiId === 4)
    const copiedList = copyItems.map((item) => ({ ...item, diZhiId: item.diZhiId === 3 ? 1 : 2 }))

    list.push(...copiedList) // 将拷贝的项添加到 list 的末尾

    // 根据ganId升序
    return list.sort((a, b) => a.diZhiId - b.diZhiId)
  }
}
