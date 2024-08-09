<template>
  <div
    class="wrapper"
    @drop="handleDrop"
    @dragover="handleDragOver"
    :draggable="false"
    @click="clickBox"
    :style="{
      background: getWrapperBackGroundColor
    }"
  >
    <!-- 星 -->
    <div class="stars">
      <template v-for="it in stars">
        <div @dblclick="handleDeleteClick(it.name, 1)">
          <span
            :style="{
              color: getColor(it),
              backgroundColor: getBackGroundColor(it.Id),
              fontSize: getStarsFontSize
            }"
          >
            {{ it.fullName }}
          </span>
          <span
            v-if="getShengNianSiHua(it.Id)"
            class="sihua"
            :style="{ backgroundColor: getSiHuaColor(getShengNianSiHua(it.Id)) }"
          >
            {{ getShengNianSiHua(it.Id) }}
          </span>
        </div>
      </template>
    </div>
    <!-- 大限 -->
    <div class="ten-years" @dblclick="handleDeleteClick(props.tenYearsName, 3)">
      {{ props.tenYearsName }}
    </div>
    <!-- 流年 -->
    <div class="every-year" @dblclick="handleDeleteClick(props.everyYearName, 4)">
      {{ props.everyYearName }}
    </div>
    <!-- 来因 -->
    <div
      class="lai-yin"
      v-if="
        props.ganName &&
        SHENGNIANGANNAME[props.shengNianGan] &&
        props.ganName === SHENGNIANGANNAME[props.shengNianGan] &&
        props.Id !== 1 &&
        props.Id !== 2
      "
    >
      来因
    </div>
    <!-- 自化 -->
    <template v-for="item in ziHua_clone">
      <template v-for="sub in item">
        <span class="zi-hua" :style="getZiHuaStyle(sub)" v-show="sub.show">
          <ArrowUpOutlined />
        </span>
      </template>
    </template>
    <div class="info">
      <!-- 天干 -->
      <div class="number" @dblclick="handleDeleteClick(props.ganName, 5)">
        {{ props.ganName || ' ' }}
      </div>
      <!-- 原局 -->
      <div class="name font-bold" @dblclick="handleDeleteClick(props.boxName, 2)">
        {{ props.boxName }}
      </div>
      <!-- 地支 -->
      <div class="fixed-number">{{ props.fixedNumber }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { SIHUA, ALL_ZIHUA } from '../enums'
import { ArrowUpOutlined } from '@ant-design/icons-vue'

type Props = {
  Id: number
  fixedNumber: string
  boxName: string
  tenYearsName: string
  everyYearName: string
  ganName: string
  shengNianGan: number
  currentClickBox: Item | null
  stars: {
    Id: number
    type: string
    name: string
    subType?: string
    fullName?: string
  }[]
  duiGong: Item
}
interface Item {
  Id: number
  fixedNumber: string
  stars: { Id: number; type: string; name: string; subType?: string }[]
  boxName: string
  tenYearsName: string
  everyYearName: string
  ganName: string
}
const props = defineProps<Props>()

const emit = defineEmits(['dropBox', 'onDelete', 'onClick'])
const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  emit('dropBox', props.Id)
}
const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
}
// 选择颜色
const getColor = (it: any) => {
  if (props.currentClickBox && props.currentClickBox.ganName) {
    const ganName = props.currentClickBox.ganName
    const ganIndex = SHENGNIANGANNAME.findIndex((item) => item === ganName)
    const siHuaXing = SIHUA[ganIndex]
    if (siHuaXing && it.Id) {
      const index = siHuaXing.findIndex((item) => item === it.Id)
      const siHua = _SIHUANAME[index]
      if (siHua) return 'white'
    }
  }
  if (it.subType === '北' || it.subType === '南') {
    return '#ff0000'
  } else if (it.subType === '辅') {
    return '#800080'
  } else if (it.subType === '煞') {
    return '#000'
  } else if (it.subType === '命') {
    return '#ff0000'
  } else if (it.subType === '限') {
    return '#83C146'
  } else {
    return '#097AFF'
  }
}
// 四化星颜色
const getSiHuaColor = (it: string) => {
  return it === '禄' ? '#83C146' : it === '权' ? '#800080' : it === '科' ? '#097AFF' : '#ff0000'
}
// 四化星
const _SIHUANAME = ['禄', '权', '科', '忌']
const getShengNianSiHua = computed(() => {
  return function (Id: number) {
    if (props.shengNianGan) {
      const siHuaXing = SIHUA[props.shengNianGan]
      if (siHuaXing && Id) {
        const index = siHuaXing.findIndex((it) => it === Id)
        return _SIHUANAME[index]
      }
    }
    return ''
  }
})
const SHENGNIANGANNAME = ['', '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']

const getBackGroundColor = computed(() => {
  return function (Id: number) {
    let siHua = ''
    if (props.currentClickBox && props.currentClickBox.ganName) {
      const ganName = props.currentClickBox.ganName
      const ganIndex = SHENGNIANGANNAME.findIndex((it) => it === ganName)
      const siHuaXing = SIHUA[ganIndex]
      if (siHuaXing && Id) {
        const index = siHuaXing.findIndex((it) => it === Id)
        siHua = _SIHUANAME[index]
      }
    }
    return siHua && getSiHuaColor(siHua)
  }
})

const getWrapperBackGroundColor = computed(() => {
  if (props.currentClickBox && props.currentClickBox.Id === props.Id) {
    return '#f0f0f0'
  } else {
    return 'white'
  }
})

// 星字体大小
const getStarsFontSize = computed(() => {
  const length = props.stars.length
  if (length <= 8) {
    return '16px'
  } else {
    return '12px'
  }
})
// 删除 type 1: 星 2: 原局 3: 大限 4: 流年
const handleDeleteClick = (name: string, type: number) => {
  emit('onDelete', name, type, props.Id)
}

// 点击盒子
const clickBox = () => {
  emit('onClick', props)
}

const getZiHuaStyle = (sub: any) => {
  return {
    top: sub.top,
    bottom: sub.bottom,
    left: sub.left,
    right: sub.right,
    color: sub.color,
    transform: `rotate(${sub.rotate}deg)`
  }
}

interface ZiHua {
  top: string
  bottom: string
  left: string
  right: string
  color: string
  rotate: number
  show: boolean
}
const ziHua_clone = ref<ZiHua[][]>([
  [
    {
      top: '0px',
      bottom: 'auto',
      left: '0px',
      right: 'auto',
      color: 'red',
      rotate: 0,
      show: false
    }
  ]
])

const watchArr = computed(() => {
  return [props.ganName, props.stars, props.duiGong.stars, props.duiGong.ganName]
})

watch(
  watchArr,
  () => {
    ziHua_clone.value = JSON.parse(JSON.stringify(ALL_ZIHUA))
    if (props.ganName) {
      handleSetZiHua()
    }
  },
  {
    deep: true
  }
)

// 获取自化星
function getZihuaXing(ganIndex: number) {
  const siHuaXing = SIHUA[ganIndex]
  let zihuaXings: any[] = []
  if (siHuaXing) {
    siHuaXing.forEach((it, index) => {
      const star = props.stars.find((star) => star.Id === it)
      if (star) {
        zihuaXings.push({
          ...star,
          index
        })
      }
    })
  }

  return zihuaXings
}

// 获取对宫自化星
function getDuiZihuaXing(ganIndex: number) {
  const siHuaXing = SIHUA[ganIndex]
  let duiZihuaXings: any[] = []
  if (siHuaXing) {
    siHuaXing.forEach((it, index) => {
      const star = props.duiGong.stars.find((star) => star.Id === it)
      if (star) {
        duiZihuaXings.push({
          ...star,
          index
        })
      }
    })
  }

  return duiZihuaXings
}

function handleSetZiHua() {
  const ganIndex = SHENGNIANGANNAME.findIndex((it) => it === props.ganName)
  let zihuaXings: any[] = getZihuaXing(ganIndex)
  let duiZiHuaXings: any[] = getDuiZihuaXing(ganIndex)
  const zihuaFunc = (benIndex: number, duiIndex: number, rotate: number) => {
    ziHua_clone.value.map((item, index) => {
      // 本宫
      if (index === benIndex) {
        for (let i = 0; i < zihuaXings.length; i++) {
          if (item[i]) {
            item[i].show = true
            item[i].rotate = rotate
            item[i].color = getSiHuaColor(_SIHUANAME[zihuaXings[i].index])
          }
        }
      }

      // 对宫
      if (index === duiIndex) {
        for (let i = 0; i < duiZiHuaXings.length; i++) {
          if (item[i]) {
            item[i].show = true
            item[i].rotate = rotate + 180
            item[i].color = getSiHuaColor(_SIHUANAME[duiZiHuaXings[i].index])
          }
        }
      }
      return item
    })
  }

  const arr = [
    [5, 1, 135],
    [5, 1, -135],
    [6, 2, -135],
    [7, 3, -135],
    [7, 3, -45],
    [0, 4, -45],
    [1, 5, -45],
    [1, 5, 45],
    [2, 6, 45],
    [3, 7, 45],
    [3, 7, 135],
    [4, 0, 135]
  ]

  zihuaFunc(arr[props.Id - 1][0], arr[props.Id - 1][1], arr[props.Id - 1][2])
}
</script>
<style lang="less" scoped>
.wrapper {
  background-color: white;
  height: 125px;
  width: 150px;
  outline: 1px solid rgb(179, 179, 179);
  display: inline-block;
  position: relative;
  .stars {
    height: 90px;
    writing-mode: vertical-lr;
    text-align: left;
    padding-top: 2px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    .sihua {
      color: white;
      border-radius: 3px;
      margin: 2px 0;
      padding-top: 2px;
    }
  }
  .ten-years {
    width: 100%;
    display: inline-block;
    text-align: center;
    position: absolute;
    height: 20px;
    font-size: 15px;
    color: #83c146;
    bottom: 35px;
    cursor: pointer;
  }
  .every-year {
    display: inline-block;
    text-align: center;
    position: absolute;
    writing-mode: vertical-lr;
    text-align: left;
    bottom: 35px;
    font-size: 13px;
    color: #097aff;
    cursor: pointer;
  }
  .lai-yin {
    display: inline-block;
    text-align: center;
    position: absolute;
    writing-mode: vertical-lr;
    bottom: 40px;
    right: 10px;
    font-size: 13px;
    color: white;
    background-color: #ff0000;
    padding: 2px 0px;
    font-weight: bold;
    border-radius: 3px;
  }
  .zi-hua {
    position: absolute;
    z-index: 10;
  }
  .info {
    border-top: 1px solid rgb(179, 179, 179);
    line-height: 35px;
    height: 35px;
    .number {
      width: 35px;
      border-right: 1px solid rgb(179, 179, 179);
      display: inline-block;
      text-align: center;
      cursor: pointer;
    }
    .fixed-number {
      width: 35px;
      border-left: 1px solid rgb(179, 179, 179);
      display: inline-block;
      text-align: center;
      cursor: pointer;
    }
    .name {
      width: 80px;
      display: inline-block;
      text-align: center;
      cursor: pointer;
    }
  }
}
</style>
