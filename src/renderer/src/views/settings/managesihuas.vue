<template>
  <div>
    <vxe-table
      ref="tableRef"
      border
      show-overflow
      keep-source
      :loading="loading"
      :data="tableData"
      :edit-config="editConfig"
      :row-config="{ isCurrent: true, isHover: true }"
    >
      <vxe-column field="name" title="天干" :width="60" align="center"></vxe-column>
      <vxe-column field="moneyId" title="禄" :edit-render="{}" align="center">
        <template #default="{ row }">
          <span>{{ row.moneyName }}</span>
        </template>
        <template #edit="{ row }">
          <vxe-select v-model="row.moneyId" transfer>
            <vxe-option
              v-for="item in starsList"
              :key="item.Id"
              :value="item.Id"
              :label="item.name"
            ></vxe-option>
          </vxe-select>
        </template>
      </vxe-column>
      <vxe-column field="powerId" title="权" :edit-render="{}" align="center">
        <template #default="{ row }">
          <span>{{ row.powerName }}</span>
        </template>
        <template #edit="{ row }">
          <vxe-select v-model="row.powerId" transfer>
            <vxe-option
              v-for="item in starsList"
              :key="item.Id"
              :value="item.Id"
              :label="item.name"
            ></vxe-option>
          </vxe-select>
        </template>
      </vxe-column>
      <vxe-column field="cultureId" title="科" :edit-render="{}" align="center">
        <template #default="{ row }">
          <span>{{ row.cultureName }}</span>
        </template>
        <template #edit="{ row }">
          <vxe-select v-model="row.cultureId" transfer>
            <vxe-option
              v-for="item in starsList"
              :key="item.Id"
              :value="item.Id"
              :label="item.name"
            ></vxe-option>
          </vxe-select>
        </template>
      </vxe-column>
      <vxe-column field="dangerId" title="忌" :edit-render="{}" align="center">
        <template #default="{ row }">
          <span>{{ row.dangerName }}</span>
        </template>
        <template #edit="{ row }">
          <vxe-select v-model="row.dangerId" transfer>
            <vxe-option
              v-for="item in starsList"
              :key="item.Id"
              :value="item.Id"
              :label="item.name"
            ></vxe-option>
          </vxe-select>
        </template>
      </vxe-column>

      <!-- <vxe-column title="操作" width="160" align="center">
        <template #default="{ row }">
          <template v-if="hasEditStatus(row)">
            <vxe-button @click="saveRowEvent(row)">保存</vxe-button>
            <vxe-button @click="cancelRowEvent(row)">取消</vxe-button>
          </template>
          <template v-else>
            <vxe-button @click="editRowEvent(row)">编辑</vxe-button>
          </template>
        </template>
      </vxe-column> -->
    </vxe-table>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
// import { VxeUI, VxeTablePropTypes, VxeTableInstance } from 'vxe-table'
// import { getAllStars, getSihuaTable, updateSihuaTable } from '@renderer/api/api'
import { VxeTablePropTypes, VxeTableInstance } from 'vxe-table'
import { getAllStars, getSihuaTable } from '@renderer/api/api'
import type { STARITEM, SIHUATABLEITEM } from '@renderer/api/interface'

const tableRef = ref<VxeTableInstance<GanItem>>()

const editConfig = ref<VxeTablePropTypes.EditConfig>({
  trigger: 'manual',
  mode: 'row',
  autoClear: false,
  showStatus: true
})

const loading = ref(false)
const tableData = ref<GanItem[]>([])

// const editRowEvent = async (row: GanItem) => {
//   const $table = tableRef.value
//   if ($table) {
//     await $table.setEditRow(row)
//   }
// }

// const hasEditStatus = (row: GanItem) => {
//   const $table = tableRef.value
//   if ($table) {
//     return $table.isEditByRow(row)
//   }

//   return false
// }

// // 保存编辑
// const saveRowEvent = async (row: GanItem) => {
//   const $table = tableRef.value
//   if ($table) {
//     await $table.clearEdit()

//     const resp = await updateSihuaTable(row)
//     if (resp.code == 200) {
//       getInitData()
//       // 重新加载行
//       await $table.reloadRow(row, {})
//       VxeUI.modal.message({ content: '修改成功', status: 'success' })
//     } else {
//       cancelRowEvent(row)
//     }
//   }
// }

// // 取消编辑
// const cancelRowEvent = async (row: GanItem) => {
//   const $table = tableRef.value
//   if ($table) {
//     await $table.clearEdit()
//     // 还原数据
//     await $table.revertData(row)
//   }
// }

// 星系列表
const starsList = ref<STARITEM[]>([])
const getAllStarsData = async () => {
  const res = await getAllStars({})
  if (res.code === 200) {
    starsList.value = res.data
  }
}

// 天干列表
const GansList = ref<GanItem[]>([])
const getAllSihuaTableData = async () => {
  const res = await getSihuaTable()
  if (res.code === 200) {
    GansList.value = handleGanData(res.data)
    tableData.value = GansList.value
  }
}

type GanItem = {
  Id: number
  name: string
  moneyId: number
  moneyName: string
  powerId: number
  powerName: string
  cultureId: number
  cultureName: string
  dangerId: number
  dangerName: string
}
const handleGanData = (data: SIHUATABLEITEM[]) => {
  const gans: GanItem[] = []

  data.forEach((item) => {
    const existingGan = gans.find((gan) => gan.Id === item.ganId) // 查找是否已存在相同的 ganId
    if (!existingGan) {
      // 如果不存在相同的 ganId，创建新项
      const newGan: GanItem = {
        Id: item.ganId,
        name: item.ganName,
        moneyId: 0,
        moneyName: '',
        powerId: 0,
        powerName: '',
        cultureId: 0,
        cultureName: '',
        dangerId: 0,
        dangerName: ''
      }
      if (item.xiangId === 1) {
        newGan.moneyId = item.starId
        newGan.moneyName = item.starName
      } else if (item.xiangId === 2) {
        newGan.powerId = item.starId
        newGan.powerName = item.starName
      } else if (item.xiangId === 3) {
        newGan.cultureId = item.starId
        newGan.cultureName = item.starName
      } else if (item.xiangId === 4) {
        newGan.dangerId = item.starId
        newGan.dangerName = item.starName
      }
      gans.push(newGan)
    } else {
      // 如果存在相同的 ganId，根据 xiangId 修改相应字段
      if (item.xiangId === 1) {
        existingGan.moneyId = item.starId
        existingGan.moneyName = item.starName
      } else if (item.xiangId === 2) {
        existingGan.powerId = item.starId
        existingGan.powerName = item.starName
      } else if (item.xiangId === 3) {
        existingGan.cultureId = item.starId
        existingGan.cultureName = item.starName
      } else if (item.xiangId === 4) {
        existingGan.dangerId = item.starId
        existingGan.dangerName = item.starName
      }
    }
  })
  return gans
}

// 获取初始化数据
const getInitData = async () => {
  loading.value = true
  await getAllStarsData()
  await getAllSihuaTableData()
  loading.value = false
}

onMounted(() => {
  getInitData()
})
</script>
