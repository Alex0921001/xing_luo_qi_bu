<template>
  <div class="manage-Gans">
    <div class="mt-5 mb-5 show-list">
      <template v-for="item in GansList" :key="item.Id">
        <show-card :name="item.name" :type="item.type" :sub-name="item.fullName" :color="getColor">
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
import { getGansList } from '@renderer/api/api'
import ShowCard from '@renderer/components/show-card.vue'
import type { GANITEM } from '@renderer/api/interface'

const getColor = computed(() => {
  return '#f5222d'
})

// 天干列表
const GansList = ref<GANITEM[]>([])
const getAllGansData = async () => {
  const res = await getGansList()
  if (res.code === 200) {
    GansList.value = res.data
  }
}

// 挂载
onMounted(() => {
  getAllGansData()
})
</script>
<style scoped>
.show-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 5px; /* 你可以根据需要调整这个值 */
}
</style>
