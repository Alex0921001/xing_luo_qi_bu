<template>
  <div class="ziwei">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="宫 垣">
        <div class="content">
          <div class="filter">
            <a-radio-group v-model:value="filterGongType" button-style="solid">
              <a-radio-button value="命">原局</a-radio-button>
              <a-radio-button value="限">大限</a-radio-button>
              <a-radio-button value="年">流年</a-radio-button>
            </a-radio-group>
          </div>
          <div class="items">
            <div
              v-for="it in filterGongs"
              :key="it.Id"
              class="item"
              :type="it.type"
              draggable="true"
              @dragstart="dragstart(it)"
              :style="{ color: getColor(it), backgroundColor: getBackgroundColor(it) }"
            >
              {{ it.name }}
            </div>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="星 辰">
        <div class="content">
          <div class="filter">
            <a-radio-group v-model:value="filterStarsType" button-style="solid">
              <a-radio-button :value="''">全部</a-radio-button>
              <a-radio-button value="北">北斗</a-radio-button>
              <a-radio-button value="南">南斗</a-radio-button>
              <a-radio-button value="辅">辅星</a-radio-button>
              <a-radio-button value="煞">煞星</a-radio-button>
              <a-radio-button value="杂">杂耀</a-radio-button>
            </a-radio-group>
          </div>

          <div class="items">
            <div
              v-for="it in filterXings"
              :key="it.Id"
              class="item"
              :type="it.type"
              draggable="true"
              @dragstart="dragstart(it)"
              :style="{ color: getColor(it), backgroundColor: getBackgroundColor(it) }"
            >
              {{ it.name }}
            </div>
          </div>
        </div></a-tab-pane
      >
      <a-tab-pane key="3" tab="籍 干">
        <div class="content">
          <div class="items">
            <div
              v-for="it in filterGans"
              :key="it.Id"
              class="item"
              draggable="true"
              @dragstart="dragstart(it)"
              :style="{ color: getColor(it), backgroundColor: getBackgroundColor(it) }"
            >
              {{ it.name }}
            </div>
          </div>
        </div></a-tab-pane
      >
      <a-tab-pane key="4" tab="来 因">
        <div class="content">
          <div class="filter">
            <a-radio-group v-model:value="shengNianGan" button-style="solid">
              <a-radio-button :value="0">无</a-radio-button>
              <a-radio-button :value="1">甲</a-radio-button>
              <a-radio-button :value="2">乙</a-radio-button>
              <a-radio-button :value="3">丙</a-radio-button>
              <a-radio-button :value="4">丁</a-radio-button>
              <a-radio-button :value="5">戊</a-radio-button>
              <a-radio-button :value="6">己</a-radio-button>
              <a-radio-button :value="7">庚</a-radio-button>
              <a-radio-button :value="8">辛</a-radio-button>
              <a-radio-button :value="9">壬</a-radio-button>
              <a-radio-button :value="10">癸</a-radio-button>
            </a-radio-group>
          </div>
        </div>
      </a-tab-pane>
      <template #rightExtra>
        <a-input
          v-if="activeKey === '1'"
          v-model:value="filterGongText"
          placeholder="搜索宫职"
          style="width: 200px; margin-right: 10px"
          allow-clear
        ></a-input>
        <a-input
          v-else-if="activeKey === '2'"
          v-model:value="filterStarText"
          placeholder="搜索星辰"
          style="width: 200px; margin-right: 10px"
          allow-clear
        ></a-input>
      </template>
    </a-tabs>

    <div class="paipan">
      <div class="context">
        <div>
          <unitItem
            v-bind="item_info[6]"
            :shengNianGan="shengNianGan"
            :currentClickBox="currentClickBox"
            :duiGong="item_info[12]"
            @dropBox="dropBox"
            @onDelete="handleDelete"
            @onClick="handleClickBox"
          ></unitItem>
          <unitItem
            v-bind="item_info[7]"
            :shengNianGan="shengNianGan"
            :currentClickBox="currentClickBox"
            :duiGong="item_info[1]"
            @dropBox="dropBox"
            @onDelete="handleDelete"
            @onClick="handleClickBox"
          ></unitItem>
          <unitItem
            v-bind="item_info[8]"
            :shengNianGan="shengNianGan"
            :currentClickBox="currentClickBox"
            :duiGong="item_info[2]"
            @dropBox="dropBox"
            @onDelete="handleDelete"
            @onClick="handleClickBox"
          ></unitItem>
          <unitItem
            v-bind="item_info[9]"
            :shengNianGan="shengNianGan"
            :currentClickBox="currentClickBox"
            :duiGong="item_info[3]"
            @dropBox="dropBox"
            @onDelete="handleDelete"
            @onClick="handleClickBox"
          ></unitItem>
        </div>
        <div class="flex justify-between">
          <unitItem
            v-bind="item_info[5]"
            :shengNianGan="shengNianGan"
            :currentClickBox="currentClickBox"
            :duiGong="item_info[11]"
            @dropBox="dropBox"
            @onDelete="handleDelete"
            @onClick="handleClickBox"
          ></unitItem>
          <unitItem
            v-bind="item_info[10]"
            :shengNianGan="shengNianGan"
            :currentClickBox="currentClickBox"
            :duiGong="item_info[4]"
            @dropBox="dropBox"
            @onDelete="handleDelete"
            @onClick="handleClickBox"
          ></unitItem>
        </div>
        <div class="flex justify-between">
          <unitItem
            v-bind="item_info[4]"
            :shengNianGan="shengNianGan"
            :currentClickBox="currentClickBox"
            :duiGong="item_info[10]"
            @dropBox="dropBox"
            @onDelete="handleDelete"
            @onClick="handleClickBox"
          ></unitItem>
          <unitItem
            v-bind="item_info[11]"
            :shengNianGan="shengNianGan"
            :currentClickBox="currentClickBox"
            :duiGong="item_info[5]"
            @dropBox="dropBox"
            @onDelete="handleDelete"
            @onClick="handleClickBox"
          ></unitItem>
        </div>
        <div>
          <unitItem
            v-bind="item_info[3]"
            :shengNianGan="shengNianGan"
            :currentClickBox="currentClickBox"
            :duiGong="item_info[9]"
            @dropBox="dropBox"
            @onDelete="handleDelete"
            @onClick="handleClickBox"
          ></unitItem>
          <unitItem
            v-bind="item_info[2]"
            :shengNianGan="shengNianGan"
            :currentClickBox="currentClickBox"
            :duiGong="item_info[8]"
            @dropBox="dropBox"
            @onDelete="handleDelete"
            @onClick="handleClickBox"
          ></unitItem>
          <unitItem
            v-bind="item_info[1]"
            :shengNianGan="shengNianGan"
            :currentClickBox="currentClickBox"
            :duiGong="item_info[7]"
            @dropBox="dropBox"
            @onDelete="handleDelete"
            @onClick="handleClickBox"
          ></unitItem>
          <unitItem
            v-bind="item_info[12]"
            :shengNianGan="shengNianGan"
            :currentClickBox="currentClickBox"
            :duiGong="item_info[6]"
            @dropBox="dropBox"
            @onDelete="handleDelete"
            @onClick="handleClickBox"
          ></unitItem>
        </div>
      </div>
    </div>

    <div class="foot-tools">
      <div v-if="activeKey === '1'">
        <a-button @click="handleSet('gong')" style="margin-left: 10px" type="primary"
          >排宫</a-button
        >
        <a-button @click="handleClear('gong')" style="margin-left: 10px">清宫</a-button>
      </div>
      <div v-if="activeKey === '2'">
        <a-button @click="handleSet('star')" style="margin-left: 10px" type="primary"
          >布星</a-button
        >
        <a-button @click="handleClear('star')" style="margin-left: 10px">清星</a-button>
      </div>
      <div v-if="activeKey === '3'">
        <a-button @click="handleSet('gan')" style="margin-left: 10px" type="primary">列干</a-button>
        <a-button @click="handleClear('gan')" style="margin-left: 10px">清干</a-button>
      </div>
      <a-button @click="handleClear()" danger style="margin-left: 10px">清空</a-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import unitItem from '../components/unit-item.vue'
import { ref, reactive } from 'vue'
import { GONGS, XINGS, GANS } from '../enums'
import { computed } from 'vue'
import { message } from 'ant-design-vue'

const gongs = ref(GONGS)
const xings = ref(XINGS)
const gans = ref(GANS)

const activeKey = ref('1')
const filterStarsType = ref('北')
const filterStarText = ref('')
const filterGongType = ref('命')
const filterGongText = ref('')
const shengNianGan = ref(0)

interface Item {
  Id: number
  fixedNumber: string
  stars: { Id: number; type: string; name: string; subType?: string }[]
  boxName: string
  tenYearsName: string
  everyYearName: string
  ganName: string
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

const filterXings = computed(() => {
  return xings.value
    .filter((it) => {
      return !item_info.value.some((item) => {
        return item.stars.some((star) => star.Id === it.Id)
      })
    })
    .filter((star) => {
      return filterStarsType.value === '' || star.subType === filterStarsType.value
    })
    .filter((star) => {
      return filterStarText.value === '' || star.fullName.includes(filterStarText.value)
    })
})

const filterGongs = computed(() => {
  return gongs.value
    .filter((it) => {
      return !item_info.value.some((item) => {
        return (
          item.boxName === it.fullName ||
          item.everyYearName === it.fullName ||
          item.tenYearsName === it.fullName
        )
      })
    })
    .filter((it) => {
      return filterGongType.value === '' || it.subType === filterGongType.value
    })
    .filter((it) => {
      return filterGongText.value === '' || it.fullName.includes(filterGongText.value)
    })
})
const filterGans = computed(() => {
  return gans.value.filter((it) => {
    return !item_info.value.some((item) => {
      return item.ganName === it.name
    })
  })
})

// 当前拖拽内容
interface CurrentItem {
  Id: number
  type: string
  name: string
  subType?: string
  fullName?: string
}
const current = reactive<CurrentItem>({
  Id: 0,
  type: '',
  name: '',
  subType: '',
  fullName: ''
})
const dragstart = (currentItem: CurrentItem) => {
  current.Id = currentItem.Id
  current.type = currentItem.type
  current.name = currentItem.name
  current.subType = currentItem.subType
  current.fullName = currentItem.fullName
}
const dropBox = (Id: number) => {
  if (current.type === 'box') {
    if (current.subType === '命') {
      item_info.value[Id].boxName = current.fullName!
    } else if (current.subType === '限') {
      item_info.value[Id].tenYearsName = current.fullName!
    } else {
      item_info.value[Id].everyYearName = current.fullName!
    }
  } else if (current.type === 'star') {
    const stars = item_info.value[Id].stars
    if (stars.some((it) => it.Id === current.Id)) {
      return
    }
    item_info.value[Id].stars.push(JSON.parse(JSON.stringify(current)))
    item_info.value[Id].stars = item_info.value[Id].stars.sort((a, b) => a.Id - b.Id)
  } else {
    item_info.value[Id].ganName = current.name!
  }
}

// 清空 0: 全部 1: 原局 2: 大限 3: 流年 4: 星
const handleClear = (type?: string) => {
  item_info.value.forEach((it) => {
    if (!type) {
      it.stars = []
      it.boxName = ''
      it.everyYearName = ''
      it.tenYearsName = ''
      it.ganName = ''
      shengNianGan.value = 0
    } else if (type === 'gong') {
      if (filterGongType.value === '命') {
        it.boxName = ''
      } else if (filterGongType.value === '限') {
        it.tenYearsName = ''
      } else {
        it.everyYearName = ''
      }
    } else if (type === 'star') {
      it.stars = []
    } else if (type === 'gan') {
      it.ganName = ''
    }
  })
}
// 颜色选择
const getColor = (it: any) => {
  if (it.subType === '北' || it.subType === '南') {
    return '#ff0000'
  } else if (it.subType === '辅') {
    return '#800080'
  } else if (it.subType === '煞') {
    return '#000000'
  } else if (it.subType === '命') {
    return '#ff0000'
  } else if (it.subType === '限') {
    return '#83C146'
  } else {
    return '#097AFF'
  }
}
// 颜色选择
const getBackgroundColor = (it: any) => {
  if (it.subType === '北' || it.subType === '南') {
    return '#e79f9f'
  } else if (it.subType === '辅') {
    return '#cf9fcf'
  } else if (it.subType === '煞') {
    return '#9f9f9f'
  } else if (it.subType === '命') {
    return '#e79f9f'
  } else if (it.subType === '限') {
    return '#d0e8b9'
  } else {
    return '#a2cdff'
  }
}

// 删除选择 type 1: 星 2: 原局 3: 大限 4: 流年
const handleDelete = (name: string, type: number, Id: number) => {
  if (type === 1) {
    item_info.value[Id].stars = item_info.value[Id].stars.filter((it) => it.name !== name)
  } else if (type === 2) {
    item_info.value[Id].boxName = ''
  } else if (type === 3) {
    item_info.value[Id].tenYearsName = ''
  } else if (type === 4) {
    item_info.value[Id].everyYearName = ''
  } else if (type === 5) {
    item_info.value[Id].ganName = ''
  }
}

// 宫职分布
const handleSetGongs = () => {
  // 获取当前公职顺序
  const _GongsSort = gongs.value.filter((item, index) => {
    return item.subType === filterGongType.value
  })
  // 获取当前填写的宫职
  const _Gongs = item_info.value.filter((item) => {
    if (filterGongType.value === '命') {
      return item.boxName
    } else if (filterGongType.value === '限') {
      return item.tenYearsName
    } else {
      return item.everyYearName
    }
  })
  // 判断宫位是否之填写了一个
  if (_Gongs.length) {
    if (_Gongs.length > 1) return message.error('请保持当前类别宫位有且仅有一个置于命盘之上')
  } else {
    return message.error('请保持当前类别宫位有且仅有一个置于命盘之上')
  }

  const _gong = _Gongs[0]
  const _gongName =
    filterGongType.value === '命'
      ? _gong.boxName
      : filterGongType.value === '限'
        ? _gong.tenYearsName
        : _gong.everyYearName
  const gongIndex = _GongsSort.findIndex((item) => item.fullName === _gongName) // 当前宫位在当前类别的位置
  const firstGongIndex = _gong.Id + gongIndex + 12 // 命宫的位置
  for (let i = 0; i < 12; i++) {
    const currentNum = (firstGongIndex - i) % 12
    const currentStar = _GongsSort[i]
    if (currentNum === 0) {
      if (filterGongType.value === '命') item_info.value[12].boxName = currentStar.fullName
      else if (filterGongType.value === '限')
        item_info.value[12].tenYearsName = currentStar.fullName
      else item_info.value[12].everyYearName = currentStar.fullName
    } else {
      if (filterGongType.value === '命') item_info.value[currentNum].boxName = currentStar.fullName
      else if (filterGongType.value === '限')
        item_info.value[currentNum].tenYearsName = currentStar.fullName
      else item_info.value[currentNum].everyYearName = currentStar.fullName
    }
  }
}
// 北斗
const NorthStars = computed(() => {
  return xings.value.filter((item) => item.subType === '北')
})
// 南斗
const SouthStar = computed(() => {
  return xings.value.filter((item) => item.subType === '南')
})
// 南北都转换
const ZiWeiMapTianFu = [, 5, 4, 3, 2, 1, 12, 11, 10, 9, 8, 7, 6]
// 布星
const handleSetStars = () => {
  // 获取当前填写的星辰
  const _Stars: CurrentItem[] = []
  item_info.value
    .filter((item) => item.stars.length)
    .map((item) => {
      _Stars.push(...item.stars)
    })
  // 判断星辰是否只填写了一个
  if (_Stars.length) {
    if (_Stars.length > 1) return message.error('请保持当前南/北斗有且仅有一个置于命盘之上')
    else {
      const currentStar = _Stars[0]
      const currentBox = item_info.value.find((item) => {
        return item.stars.some((it) => it.Id === currentStar.Id)
      })
      if (NorthStars.value.some((item) => item.Id === currentStar.Id)) {
        const firstIndex = handleNorthStars(currentStar, currentBox!.Id) // 北斗星排布
        const tianFuIndex = ZiWeiMapTianFu[firstIndex]
        handleSouthStars(
          { Id: 7, type: 'star', name: '天府', subType: '南', fullName: '天府' },
          tianFuIndex!
        ) // 南斗星排布
      } else if (SouthStar.value.some((item) => item.Id === currentStar.Id)) {
        const firstIndex = handleSouthStars(currentStar, currentBox!.Id) // 南斗星排布
        const ziWeiIndex = ZiWeiMapTianFu[firstIndex]
        handleNorthStars(
          { Id: 1, type: 'star', name: '紫微', subType: '北', fullName: '紫微' },
          ziWeiIndex!
        ) // 北斗星排布
      } else {
        return message.error('请保持当前南/北斗有且仅有一个置1于命盘之上')
      }
    }
  } else {
    return message.error('请保持当前南/北斗有且仅有一个置于命盘之上')
  }
}

// 排布北斗星
const handleNorthStars = (star: CurrentItem, position: number) => {
  const _NorthStarSort = [1, 2, , 3, 4, 5, , , 6]
  const currentStarIndex = _NorthStarSort.findIndex((item) => item === star.Id)
  const firstStarIndex = position + 12 + currentStarIndex //紫薇星的位置
  for (let i = 0; i < 9; i++) {
    if (_NorthStarSort[i]) {
      const currentNum = (firstStarIndex - i) % 12
      const star = NorthStars.value.find((item) => item.Id === _NorthStarSort[i])
      if (currentNum === 0) {
        if (item_info.value[12].stars.some((it) => it.Id === star!.Id)) continue
        item_info.value[12].stars.push({ ...star! })
        item_info.value[12].stars = item_info.value[12].stars.sort((a, b) => a.Id - b.Id)
      } else {
        if (item_info.value[currentNum].stars.some((it) => it.Id === star!.Id)) continue
        item_info.value[currentNum].stars.push({ ...star! })
        item_info.value[currentNum].stars = item_info.value[currentNum].stars.sort(
          (a, b) => a.Id - b.Id
        )
      }
    }
  }
  return firstStarIndex % 12 || 12
}
// 排布南斗星
const handleSouthStars = (star: CurrentItem, position: number) => {
  const _SouthStarSort = [7, 8, 9, 10, 11, 12, 13, , , , 14]
  const currentStarIndex = _SouthStarSort.findIndex((item) => item === star.Id)
  const firstStarIndex = position + 12 - currentStarIndex //天府星的位置
  for (let i = 0; i < 14; i++) {
    if (_SouthStarSort[i]) {
      const currentNum = (firstStarIndex + i) % 12
      const star = SouthStar.value.find((item) => item.Id === _SouthStarSort[i])
      if (currentNum === 0) {
        if (item_info.value[12].stars.some((it) => it.Id === star!.Id)) continue
        item_info.value[12].stars.push({ ...star! })
        item_info.value[12].stars = item_info.value[12].stars.sort((a, b) => a.Id - b.Id)
      } else {
        if (item_info.value[currentNum].stars.some((it) => it.Id === star!.Id)) continue
        item_info.value[currentNum].stars.push({ ...star! })
        item_info.value[currentNum].stars = item_info.value[currentNum].stars.sort(
          (a, b) => a.Id - b.Id
        )
      }
    }
  }
  return firstStarIndex % 12 || 12
}

// 排布干支
const handleGans = () => {
  const _GansSort = gans.value
  const _Gans = item_info.value.filter((item) => item.ganName)
  if (_Gans.length) {
    if (_Gans.length > 1) return message.error('请保持宫干有且仅有一个置于命盘之上')
  } else {
    return message.error('请保持宫干有且仅有一个置于命盘之上')
  }
  const _gan = _Gans[0]
  if (_gan.Id <= 2) {
    let currentGanIndex = _GansSort.findIndex((item) => item.name === _gan.ganName)
    if (_gan.Id === 2) {
      currentGanIndex = (currentGanIndex + 10 - 1) % 10
    }
    for (let i = 3; i < 13; i++) {
      const distance = i - 3
      const currentNum = (currentGanIndex + distance) % 10
      item_info.value[i].ganName = _GansSort[currentNum].name
    }
    item_info.value[1].ganName = item_info.value[3].ganName
    item_info.value[2].ganName = item_info.value[4].ganName
  } else {
    const currentGanIndex = _GansSort.findIndex((item) => item.name === _gan.ganName)
    for (let i = _gan.Id; i < 13; i++) {
      const distance = i - _gan.Id
      const currentNum = (currentGanIndex + distance) % 10

      item_info.value[i].ganName = _GansSort[currentNum].name
    }

    for (let i = 3; i < _gan.Id; i++) {
      const distance = _gan.Id - i
      const currentNum = (currentGanIndex - distance + 10) % 10

      item_info.value[i].ganName = _GansSort[currentNum].name
    }

    item_info.value[1].ganName = item_info.value[3].ganName
    item_info.value[2].ganName = item_info.value[4].ganName
  }
}

// 布局
const handleSet = (type: string) => {
  if (type === 'star') return handleSetStars()
  if (type === 'gong') return handleSetGongs()
  if (type === 'gan') return handleGans()
}

const currentClickBox = ref<Item | null>(null)
const handleClickBox = (item: Item) => {
  if (currentClickBox.value && currentClickBox.value.Id === item.Id) {
    currentClickBox.value = null
  } else {
    currentClickBox.value = item
  }
}
</script>
<style lang="less" scoped>
.ziwei {
  position: relative;
  height: 100%;
  :deep(.ant-tabs-nav-wrap) {
    padding: 0 10px;
  }
  .paipan {
    height: 550px;
    display: flex;
    justify-content: center;
    align-items: center;
    .context {
      max-height: 500px;
      min-width: 500px;
    }
  }
  .content {
    min-height: 50px;
    line-height: 50px;
    margin-top: -5px;
    padding: 0 10px;
    .filter {
      height: 30px;
      line-height: 30px;
      margin-bottom: 10px;
    }
    .items {
      width: 100%;
      display: inline-block;
      background-color: #c5c5c5;
      padding: 5px;
      border-radius: 5px;
      min-height: 62px;
      .item {
        display: inline-block;
        padding: 0 2px;
        margin: 3px;
        height: 45px;
        min-width: 45px;
        line-height: 45px;
        border-radius: 5px;
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        background-color: white;
        cursor: move;
        &:hover {
          box-shadow: 2px 2px 3px #888888;
          color: #000 !important;
        }
      }
    }
  }
  .foot-tools {
    border-top: 1px solid #f0f0f0;
    position: absolute;
    width: 100%;
    height: 50px;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: right;
    padding: 0 10px;
    background-color: #fff;
  }
}
</style>
