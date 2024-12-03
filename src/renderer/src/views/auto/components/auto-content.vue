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
        <div class="line"><lineCanvas :current-click-box="currentClickBox"></lineCanvas></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import unitItem from '@renderer/components/unit-item.vue'
import lineCanvas from '@renderer/components/line-canvas.vue'
import { getWuHuDun, handleGanList, handleGongsList } from '@renderer/utils'
import { useFormStore } from '@renderer/store/add-auto'
import { GANS, GONGS } from '@renderer/enums'
import { Lunar } from 'lunar-typescript'

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
const shengNianGan = ref(0)

// 点击内容回调
const currentClickBox = ref<Item | null>(null)
const handleClickBox = (item: Item) => {
  if (currentClickBox.value && currentClickBox.value.Id === item.Id) {
    currentClickBox.value = null
  } else {
    currentClickBox.value = item
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
  const date = formStore.$state.birthday
  const d = Lunar.fromDate(new Date(date))
  const month = d.getMonth()
  const list = handleGongsList(month)
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
  }
}
</style>
