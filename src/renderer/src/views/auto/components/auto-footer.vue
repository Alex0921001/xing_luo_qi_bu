<template>
  <div class="auto-footer">
    <div class="line">
      <div>大限</div>
      <div
        v-for="item in daxianList"
        :key="item.index"
        :class="{
          active: currentDaxian.index === item.index
        }"
        @click="clickDaxian(item)"
      >
        {{ item.startAge }}-{{ item.endAge }}
      </div>
    </div>
    <div v-if="yearList.length" class="line">
      <div>流年</div>
      <div
        v-for="item in yearList"
        :key="item"
        :class="{
          active: currentYear === item
        }"
        @click="clickYear(item)"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  getWuHuDun,
  handleGanList,
  handleGongsList,
  handleMingGongIndex,
  getYingYangYear,
  getWuxingju
} from '@renderer/utils'
import { useFormStore } from '@renderer/store/add-auto'
import { GANS, GONGS, DIZHIS } from '@renderer/enums'
import { Lunar } from 'lunar-typescript'
import dayjs from 'dayjs'
import { EventBus } from '@renderer/utils/event-bus'

const formStore = useFormStore()
interface Item {
  Id: number
  fixedNumber: string
  stars: Star[]
  boxName: string
  tenYearsName: string
  everyYearName: string
  ganName: string
}
interface Star {
  Id: number
  type: string
  name: string
  subType?: string
}
const item_info = ref<Item[]>([
  {
    Id: 0,
    fixedNumber: '空',
    stars: [],
    boxName: '',
    tenYearsName: '',
    everyYearName: '',
    ganName: ''
  },
  {
    Id: 1,
    fixedNumber: '子',
    stars: [],
    boxName: '',
    tenYearsName: '',
    everyYearName: '',
    ganName: ''
  },
  {
    Id: 2,
    fixedNumber: '丑',
    stars: [],
    boxName: '',
    tenYearsName: '',
    everyYearName: '',
    ganName: ''
  },
  {
    Id: 3,
    fixedNumber: '寅',
    stars: [],
    boxName: '',
    tenYearsName: '',
    everyYearName: '',
    ganName: ''
  },
  {
    Id: 4,
    fixedNumber: '卯',
    stars: [],
    boxName: '',
    tenYearsName: '',
    everyYearName: '',
    ganName: ''
  },
  {
    Id: 5,
    fixedNumber: '辰',
    stars: [],
    boxName: '',
    tenYearsName: '',
    everyYearName: '',
    ganName: ''
  },
  {
    Id: 6,
    fixedNumber: '巳',
    stars: [],
    boxName: '',
    tenYearsName: '',
    everyYearName: '',
    ganName: ''
  },
  {
    Id: 7,
    fixedNumber: '午',
    stars: [],
    boxName: '',
    tenYearsName: '',
    everyYearName: '',
    ganName: ''
  },
  {
    Id: 8,
    fixedNumber: '未',
    stars: [],
    boxName: '',
    tenYearsName: '',
    everyYearName: '',
    ganName: ''
  },
  {
    Id: 9,
    fixedNumber: '申',
    stars: [],
    boxName: '',
    tenYearsName: '',
    everyYearName: '',
    ganName: ''
  },
  {
    Id: 10,
    fixedNumber: '酉',
    stars: [],
    boxName: '',
    tenYearsName: '',
    everyYearName: '',
    ganName: ''
  },
  {
    Id: 11,
    fixedNumber: '戌',
    stars: [],
    boxName: '',
    tenYearsName: '',
    everyYearName: '',
    ganName: ''
  },
  {
    Id: 12,
    fixedNumber: '亥',
    stars: [],
    boxName: '',
    tenYearsName: '',
    everyYearName: '',
    ganName: ''
  }
])

// 获取阴阳年
const getYingYang = computed(() => {
  const d = Lunar.fromDate(new Date(formStore.$state.birthday))
  return getYingYangYear(Number(d.getYear()))
})
// 获取五行局
const getWuxing = computed(() => {
  const data = item_info.value.find((it) => it.boxName === '命宫')
  if (data) {
    const gan = GANS.find((it) => it.name === data.ganName)
    if (gan) {
      const wuxing = getWuxingju(gan.Id, data.Id)
      if (wuxing) {
        return wuxing
      }
    }
  }
  return undefined
})

const daxianList = ref<any[]>([])
watch(
  () => getWuxing.value,
  (val) => {
    if (val) {
      daxianList.value = []
      const startAge = val.number
      for (let i = 0; i < 10; i++) {
        const startAgeIndex = startAge + i * 10
        const endAge = startAge + (i + 1) * 10 - 1
        const daxian = {
          startAge: startAgeIndex,
          endAge,
          index: i + 1
        }
        daxianList.value.push(daxian)
      }
    }
  }
)

const currentDaxian = reactive({
  startAge: 0,
  endAge: 0,
  index: 0
})
const yearList = ref<number[]>([])
const clickDaxian = (item: any) => {
  currentYear.value = 0
  EventBus.emit('clear-every-year')
  if (item.index === currentDaxian.index) {
    currentDaxian.startAge = 0
    currentDaxian.endAge = 0
    currentDaxian.index = 0
    yearList.value = []
    EventBus.emit('clear-ten-years')
    EventBus.emit('clear-years-text')

    return
  }
  currentDaxian.startAge = item.startAge
  currentDaxian.endAge = item.endAge
  currentDaxian.index = item.index
  // 填充流年内容
  yearList.value = []
  const d = Lunar.fromDate(new Date(formStore.$state.birthday))
  for (let i = currentDaxian.startAge; i <= currentDaxian.endAge; i++) {
    yearList.value.push(Number(d.getYear() + i - 1))
  }

  setYearTextList()

  // 设置大限内容
  let list: any[] = []
  const mingGong = item_info.value.find((it) => it.boxName === '命宫')
  if (mingGong) {
    if (
      (getYingYang.value === '阳' && formStore.$state.sex === '男') ||
      (getYingYang.value === '阴' && formStore.$state.sex === '女')
    ) {
      const startIndex = (mingGong?.Id + 12 + currentDaxian.index - 1) % 12 || 12
      list = handleGongsList(startIndex, '限')
    } else {
      const startIndex = (mingGong?.Id + 12 - currentDaxian.index + 1) % 12 || 12
      list = handleGongsList(startIndex, '限')
    }
    EventBus.emit('update-ten-years', list)
  }
}

// 设置大限每年年度预览
const setYearTextList = () => {
  const yearAndAgeList: any[] = []
  yearList.value.forEach((year) => {
    const d = Lunar.fromDate(new Date(year + '-05-05'))
    const diZhiId = DIZHIS.find((it) => it.name === d.getYearZhi())?.Id || 0
    const gong = item_info.value.find((it) => it.Id === diZhiId)
    const yearText = year
    const birthday = dayjs(formStore.$state.birthday).format('YYYY')
    const ageText = year - Number(birthday) + 1
    const params = {
      gongId: gong?.Id || 0,
      yearText,
      ageText
    }
    yearAndAgeList.push(params)
  })
  EventBus.emit('clear-years-text')
  EventBus.emit('update-years-text', yearAndAgeList)
}

// 设置流年内容
const currentYear = ref(0)
const clickYear = (item: any) => {
  if (item === currentYear.value) {
    currentYear.value = 0
    EventBus.emit('clear-every-year')
    setYearTextList()
    return
  } else {
    EventBus.emit('clear-years-text')
    currentYear.value = item
    const d = Lunar.fromDate(new Date(item + '-05-05'))
    const diZhiId = DIZHIS.find((it) => it.name === d.getYearZhi())?.Id || 0
    const gong = item_info.value.find((it) => it.Id === diZhiId)
    const startIndex = gong?.Id || 0
    const list = handleGongsList(startIndex, '年')
    EventBus.emit('update-every-year', list)
  }
}

// 设置天干内容
const handleSetGans = () => {
  const data = getWuHuDun(formStore.$state.birthday)
  const currentGan = GANS.find((gan) => gan.name === data)
  if (currentGan) {
    const list = handleGanList(currentGan.Id, 3)
    list.forEach((item) => {
      const ganName = GANS.find((gan) => gan.Id === item.ganId)?.name
      item_info.value[item.diZhiId].ganName = ganName || ''
    })
  }
}

// 设置宫位内容
const handleSetGongs = () => {
  const birthday = formStore.$state.birthday
  const birthTime = formStore.$state.birthtime
  const d = Lunar.fromDate(new Date(birthday))
  const month = d.getMonth()
  const time = Lunar.fromDate(
    new Date(dayjs(birthTime)!.format('YYYY-MM-DD HH:mm:ss'))
  ).getTimeZhi()
  const timeIndex = DIZHIS.find((item) => item.name === time)?.Id || 0
  const index = handleMingGongIndex(month, timeIndex)
  const list = handleGongsList(index)
  list.forEach((item) => {
    const boxName = GONGS.find((gong) => gong.Id === item.gongId)?.name
    item_info.value[item.diZhiId].boxName = boxName || ''
  })
}

onMounted(() => {
  handleSetGans()
  handleSetGongs()
})
</script>
<style scoped>
.auto-footer {
  .line {
    display: flex;
    align-items: center;
    div {
      cursor: pointer;
      width: 80px;
      height: 30px;
      border: 1px solid #ccc;
      text-align: center;
      line-height: 30px;
      background-color: #f5f5f5;
      font-size: 12px;
      margin: 1px;
      &:hover {
        background-color: #f5f5f5;
      }
    }
    .active {
      background-color: #cecece !important;
    }
  }
}
</style>
