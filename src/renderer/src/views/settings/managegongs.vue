<template>
  <div class="manage-Gongs">
    <div class="mt-5 mb-5 show-list">
      <template v-for="item in GongsList" :key="item.Id">
        <show-card
          :name="item.name"
          :type="item.subType"
          :sub-name="item.fullName"
          :color="getColor(item)"
        >
          <template #tool-btn>
            <a style="color: #1677ff; display: inline-flex; align-items: center">
              <span style="margin-left: 4px; font-size: 12px">预览</span>
            </a>
            <!-- <a
              class="mr-2"
              style="color: #1677ff; display: inline-flex; align-items: center"
              @click="handleEdit(item)"
            >
              <span style="margin-left: 4px; font-size: 12px"><EditOutlined />编辑</span>
            </a> -->
          </template>
        </show-card>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getGongsList } from '@renderer/api/api'
import ShowCard from '@renderer/components/show-card.vue'
import type { BOXITEM } from '@renderer/api/interface'

const getColor = computed(() => {
  return (item: BOXITEM) => {
    if (item.subType === '命') {
      // 红色
      return '#f5222d'
    } else if (item.subType === '限') {
      // 紫色
      return '#722ed1'
    } else {
      // 蓝色
      return '#1890ff'
    }
  }
})

// 宫位列表
const GongsList = ref<BOXITEM[]>([])
const getAllGongsData = async () => {
  const res = await getGongsList()
  if (res.code === 200) {
    GongsList.value = res.data
  }
}

// 挂载
onMounted(() => {
  getAllGongsData()
})
</script>
<style scoped>
.show-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 5px; /* 你可以根据需要调整这个值 */
}
</style>
