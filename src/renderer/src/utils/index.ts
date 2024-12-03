import { Lunar } from 'lunar-typescript'
import { GANS, DIZHIS, GONGS, WUXINGJU } from '@renderer/enums'
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

// 找出对应天干地支
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
// 找出顺数生月，逆数生时的点位
export const handleMingGongIndex = (month: number, time: number) => {
  const index = (month + 15 - time) % 12 || 12
  return index
}
// 找出月份对应的宫位信息
export const handleGongsList = (startIndex: number, type: string = '命') => {
  const list: any[] = []
  GONGS.filter((gong) => gong.subType === type).forEach((item, index) => {
    const params = {
      gongId: item.Id,
      diZhiId: (startIndex + 12 - index) % 12 || 12
    }
    list.push(params)
  })
  // 根据ganId升序
  return list.sort((a, b) => a.diZhiId - b.diZhiId)
}

// 阳性天干：甲、丙、戊、庚、壬；分别是4、6、8、0、2等结尾的年份。如2008年，就是戊年。也说是说，年数的最后一个是偶数的，就是阳年。
// 阴性天干：乙、丁、己、辛、癸。分别是5、7、9、1、3等结尾的年份。年数的最后一个数字是奇数的，就是阴年。
export const getYingYangYear = (year: number) => {
  const isYing = year % 2
  if (isYing) {
    return '阴'
  } else {
    return '阳'
  }
}

// 计算五行局
// 从天干位置开始，两两重合，以三为限排地支，排到第三次就返回原地，最终排到当年地支为止，就是当年的纳音五行。
export const getWuxingju = (ganId: number, diZhiId: number) => {
  // 将WUXINGJU组成环形结构，找出ganId所有在的集合，以及其后继两个集合数据
  const ganList = WUXINGJU.filter((item) => item.ganIds.includes(ganId))
  const nextGanList = WUXINGJU.filter((item) => item.ganIds.includes((ganId + 2) % 10 || 10))
  const nextNextGanList = WUXINGJU.filter((item) => item.ganIds.includes((ganId + 4) % 10 || 10))
  const ganListAll = [...ganList, ...nextGanList, ...nextNextGanList]
  // diZhiId / 2 向上取整
  let diZhiIndex = Math.ceil(diZhiId / 2)
  // %3
  diZhiIndex = diZhiIndex % 3 || 3
  const data = ganListAll[diZhiIndex - 1]
  return data
}
