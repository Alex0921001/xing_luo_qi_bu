<template>
  <div class="paipan">
    <div class="paipan">
      <div class="context">
        <div>
          <unitItem
            v-bind="item_info[6]"
            :sheng-nian-gan="shengNianGan"
            :current-click-box="currentClickBox"
            :dui-gong="item_info[12]"
            @on-click="handleClickBox"
          ></unitItem>
          <unitItem
            v-bind="item_info[7]"
            :sheng-nian-gan="shengNianGan"
            :current-click-box="currentClickBox"
            :dui-gong="item_info[1]"
            @on-click="handleClickBox"
          ></unitItem>
          <unitItem
            v-bind="item_info[8]"
            :sheng-nian-gan="shengNianGan"
            :current-click-box="currentClickBox"
            :dui-gong="item_info[2]"
            @on-click="handleClickBox"
          ></unitItem>
          <unitItem
            v-bind="item_info[9]"
            :sheng-nian-gan="shengNianGan"
            :current-click-box="currentClickBox"
            :dui-gong="item_info[3]"
            @on-click="handleClickBox"
          ></unitItem>
        </div>
        <div class="flex justify-between">
          <unitItem
            v-bind="item_info[5]"
            :sheng-nian-gan="shengNianGan"
            :current-click-box="currentClickBox"
            :dui-gong="item_info[11]"
            @on-click="handleClickBox"
          ></unitItem>
          <unitItem
            v-bind="item_info[10]"
            :sheng-nian-gan="shengNianGan"
            :current-click-box="currentClickBox"
            :dui-gong="item_info[4]"
            @on-click="handleClickBox"
          ></unitItem>
        </div>
        <div class="flex justify-between">
          <unitItem
            v-bind="item_info[4]"
            :sheng-nian-gan="shengNianGan"
            :current-click-box="currentClickBox"
            :dui-gong="item_info[10]"
            @on-click="handleClickBox"
          ></unitItem>
          <unitItem
            v-bind="item_info[11]"
            :sheng-nian-gan="shengNianGan"
            :current-click-box="currentClickBox"
            :dui-gong="item_info[5]"
            @on-click="handleClickBox"
          ></unitItem>
        </div>
        <div>
          <unitItem
            v-bind="item_info[3]"
            :sheng-nian-gan="shengNianGan"
            :current-click-box="currentClickBox"
            :dui-gong="item_info[9]"
            @on-click="handleClickBox"
          ></unitItem>
          <unitItem
            v-bind="item_info[2]"
            :sheng-nian-gan="shengNianGan"
            :current-click-box="currentClickBox"
            :dui-gong="item_info[8]"
            @on-click="handleClickBox"
          ></unitItem>
          <unitItem
            v-bind="item_info[1]"
            :sheng-nian-gan="shengNianGan"
            :current-click-box="currentClickBox"
            :dui-gong="item_info[7]"
            @on-click="handleClickBox"
          ></unitItem>
          <unitItem
            v-bind="item_info[12]"
            :sheng-nian-gan="shengNianGan"
            :current-click-box="currentClickBox"
            :dui-gong="item_info[6]"
            @on-click="handleClickBox"
          ></unitItem>
        </div>
        <div class="info">
          <a-row :gutter="16" class="mb-5">
            <a-col :span="12"
              ><b>{{ formStore.$state.name }}</b>
              <template v-if="formStore.$state.tag">({{ formStore.$state.tag }})</template>
            </a-col>
            <a-col :span="12"
              ><b>{{
                getYingYang +
                formStore.$state.sex +
                ' ' +
                getWuxing?.wuxing +
                getWuxing?.numberText +
                '局'
              }}</b></a-col
            >
          </a-row>
          <a-row :gutter="16" class="mb-3">
            <a-col :span="24">
              阳历：{{
                formStore.$state.birthday +
                ' ' +
                dayjs(formStore.$state.birthtime!).format('HH:mm:ss')
              }}</a-col
            >
          </a-row>
          <a-row :gutter="16" class="mb-3">
            <a-col :span="24"> 农历：{{ getLunar }}</a-col>
          </a-row>
          <a-row v-if="formStore.$state.address" :gutter="16" class="mb-3">
            <a-col :span="24"> {{ formStore.$state.address }}</a-col>
          </a-row>
        </div>
        <div class="line"><lineCanvas :current-click-box="currentClickBox"></lineCanvas></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import unitItem from '@renderer/components/unit-item.vue'
import lineCanvas from '@renderer/components/line-canvas.vue'
import {
  getWuHuDun,
  handleGanList,
  handleGongsList,
  handleMingGongIndex,
  getYingYangYear,
  getWuxingju,
  getZiWeiIndex,
  setBeiDouStar,
  setNanDouStar,
  setZuofuStar,
  setWenChangStar
} from '@renderer/utils'
import { useFormStore } from '@renderer/store/add-auto'
import { GANS, GONGS, DIZHIS, XINGS, ZiWeiMapTianFu } from '@renderer/enums'
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
  yearText: number
  ageText: number
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
    ganName: '',
    yearText: 0,
    ageText: 0
  },
  {
    Id: 1,
    fixedNumber: '子',
    stars: [],
    boxName: '',
    tenYearsName: '',
    everyYearName: '',
    ganName: '',
    yearText: 0,
    ageText: 0
  },
  {
    Id: 2,
    fixedNumber: '丑',
    stars: [],
    boxName: '',
    tenYearsName: '',
    everyYearName: '',
    ganName: '',
    yearText: 0,
    ageText: 0
  },
  {
    Id: 3,
    fixedNumber: '寅',
    stars: [],
    boxName: '',
    tenYearsName: '',
    everyYearName: '',
    ganName: '',
    yearText: 0,
    ageText: 0
  },
  {
    Id: 4,
    fixedNumber: '卯',
    stars: [],
    boxName: '',
    tenYearsName: '',
    everyYearName: '',
    ganName: '',
    yearText: 0,
    ageText: 0
  },
  {
    Id: 5,
    fixedNumber: '辰',
    stars: [],
    boxName: '',
    tenYearsName: '',
    everyYearName: '',
    ganName: '',
    yearText: 0,
    ageText: 0
  },
  {
    Id: 6,
    fixedNumber: '巳',
    stars: [],
    boxName: '',
    tenYearsName: '',
    everyYearName: '',
    ganName: '',
    yearText: 0,
    ageText: 0
  },
  {
    Id: 7,
    fixedNumber: '午',
    stars: [],
    boxName: '',
    tenYearsName: '',
    everyYearName: '',
    ganName: '',
    yearText: 0,
    ageText: 0
  },
  {
    Id: 8,
    fixedNumber: '未',
    stars: [],
    boxName: '',
    tenYearsName: '',
    everyYearName: '',
    ganName: '',
    yearText: 0,
    ageText: 0
  },
  {
    Id: 9,
    fixedNumber: '申',
    stars: [],
    boxName: '',
    tenYearsName: '',
    everyYearName: '',
    ganName: '',
    yearText: 0,
    ageText: 0
  },
  {
    Id: 10,
    fixedNumber: '酉',
    stars: [],
    boxName: '',
    tenYearsName: '',
    everyYearName: '',
    ganName: '',
    yearText: 0,
    ageText: 0
  },
  {
    Id: 11,
    fixedNumber: '戌',
    stars: [],
    boxName: '',
    tenYearsName: '',
    everyYearName: '',
    ganName: '',
    yearText: 0,
    ageText: 0
  },
  {
    Id: 12,
    fixedNumber: '亥',
    stars: [],
    boxName: '',
    tenYearsName: '',
    everyYearName: '',
    ganName: '',
    yearText: 0,
    ageText: 0
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

watch(getWuxing, (newValue) => {
  if (newValue) {
    handleSetStars()
  }
})
// 获取农历生辰
const getLunar = computed(() => {
  const d = Lunar.fromDate(new Date(formStore.$state.birthday))
  let t = dayjs(formStore.$state.birthtime!).format('YYYY-MM-DD HH:mm:ss')
  t = Lunar.fromDate(new Date(t)).getTimeZhi()
  return (
    d.getYearInChinese() +
    '年' +
    d.getMonthInChinese() +
    '月' +
    d.getDayInChinese() +
    '日' +
    ' ' +
    t +
    '时'
  )
})
// 点击内容回调
const currentClickBox = ref<Item | null>(null)
const handleClickBox = (item: Item) => {
  if (currentClickBox.value && currentClickBox.value.Id === item.Id) {
    currentClickBox.value = null
  } else {
    currentClickBox.value = item
  }
}
// 设置来因宫
const shengNianGan = ref(0)
const handleSetLaiIn = () => {
  const d = Lunar.fromDate(new Date(formStore.$state.birthday))
  const gan = d.getYearGan()
  shengNianGan.value = GANS.findIndex((it) => it.name === gan) + 1
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

// 设置星辰内容
const handleSetStars = () => {
  const diZhiId = getZiWeiIndex(formStore.$state.birthday, getWuxing.value?.number)

  // 安置北斗星
  const list = setBeiDouStar(1, diZhiId)

  // 安置南斗星
  const tianFuIndex = ZiWeiMapTianFu[diZhiId]
  const list2 = setNanDouStar(7, tianFuIndex!)
  list.push(...list2)

  // 安置左辅右弼
  const list3 = setZuofuStar(formStore.$state.birthday)
  list.push(...list3)

  // 安置文昌文曲
  const list4 = setWenChangStar(formStore.$state.birthtime)
  list.push(...list4)
  list.forEach((item) => {
    const starId = item.starId
    const star = XINGS.find((xing) => xing.Id === starId)
    if (star) {
      item_info.value[item.diZhiId].stars.push(star)
    }
  })
}

// 设置大限内容
const setTenYears = (list: { gongId: number; diZhiId: number }[]) => {
  list.forEach((item) => {
    const boxName = GONGS.find((gong) => gong.Id === item.gongId)?.name
    item_info.value[item.diZhiId].tenYearsName = boxName || ''
  })
}
// 清理大限
const clearTenYears = () => {
  item_info.value.map((item) => {
    item.tenYearsName = ''
  })
}
// 设置流年内容
const setEveryYear = (list: { gongId: number; diZhiId: number }[]) => {
  list.forEach((item) => {
    const boxName = GONGS.find((gong) => gong.Id === item.gongId)?.name
    item_info.value[item.diZhiId].everyYearName = boxName || ''
  })
}
// 清理流年
const clearEveryYear = () => {
  item_info.value.map((item) => {
    item.everyYearName = ''
  })
}
// 设置大限每年显示
const setTenYearsText = (list: { gongId: number; yearText: number; ageText: number }[]) => {
  list.forEach((item) => {
    const box = item_info.value.find((box) => box.Id === item.gongId)
    if (box) {
      box.yearText = item.yearText
      box.ageText = item.ageText
    }
  })
}
// 清理大限每年显示
const clearYearText = () => {
  item_info.value.map((item) => {
    item.yearText = 0
    item.ageText = 0
  })
}
onMounted(() => {
  handleSetGans()
  handleSetGongs()
  handleSetLaiIn()
  EventBus.on('update-ten-years', setTenYears)
  EventBus.on('clear-ten-years', clearTenYears)
  EventBus.on('update-every-year', setEveryYear)
  EventBus.on('clear-every-year', clearEveryYear)
  EventBus.on('update-years-text', setTenYearsText)
  EventBus.on('clear-years-text', clearYearText)
})
</script>
<style scoped>
.paipan {
  min-width: 650px;
  height: 100%;
  display: flex;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
  position: relative;
  flex-direction: column; /* 让子元素纵向排列 */
  .context {
    background-color: white;
    max-height: 500px;
    min-width: 500px;
    position: relative;
    flex-grow: 1; /* 让 context 部分填满剩余空间 */
    .line {
      position: absolute;
      top: 125px;
      left: 150px;
    }
    .info {
      position: absolute;
      top: 125px;
      left: 150px;
      padding: 25px;
      height: 250px;
      width: 300px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
}
</style>
