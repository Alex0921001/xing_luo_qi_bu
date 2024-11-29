<template>
  <a-table
    v-bind="$attrs"
    :data-source="dataSource"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
  >
    <template v-for="column in props.columns" :key="column.dataIndex">
      <a-table-column v-bind="column">
        <template #default="{ record }">
          <!-- 使用 v-slot 来获取 record -->
          <!-- 如果存在自定义插槽，则使用它 -->
          <template v-if="$slots[column.dataIndex]">
            <slot :name="column.dataIndex" :record="record" />
          </template>
          <!-- 否则使用默认值展示 -->
          <template v-else>
            {{ record[column.dataIndex] }}
          </template>
        </template>
      </a-table-column>
    </template>
  </a-table>
</template>

<script setup lang="ts" name="EasyTable">
import { ref, watch, defineProps, withDefaults } from 'vue'
import { TablePaginationConfig } from 'ant-design-vue/es/table/interface'
import { message } from 'ant-design-vue'

interface Column {
  title: string
  dataIndex: string
}

const props = withDefaults(
  defineProps<{
    columns: Column[]
    dataFn: any
    initialPage?: number
    pageSize?: number
  }>(),
  {
    initialPage: 1,
    pageSize: 10
  }
)

const dataSource = ref<any[]>([])
const loading = ref(false)
const pagination = ref<TablePaginationConfig>({
  current: props.initialPage,
  pageSize: props.pageSize,
  total: 0,
  hideOnSinglePage: true,
  size: 'default',
  showTotal: (total: number) => `共 ${total} 条`,
  showSizeChanger: false
})

// 从后端获取数据
const fetchData = async () => {
  loading.value = true
  try {
    const params = {
      pageIndex: pagination.value.current,
      pageSize: pagination.value.pageSize
    }
    const resp = await props.dataFn({ ...params })
    if (resp.code === 200) {
      dataSource.value = resp.data.list
      pagination.value.total = resp.data.total
    } else {
      message.error(resp.message)
    }
  } catch (error) {
    console.error('Fetch data error:', error)
  } finally {
    loading.value = false
  }
}

// 处理表格改变（分页、排序等）
const handleTableChange = (newPagination: TablePaginationConfig) => {
  if (newPagination.current !== pagination.value.current) {
    // 页码更新
    pagination.value.current = newPagination.current // 更新页面索引
    fetchData() // 当页码变化时调用 fetchData
  } else if (newPagination.pageSize !== pagination.value.pageSize) {
    // 页数更新
    pagination.value.pageSize = newPagination.pageSize // 更新每页显示数量
    pagination.value.current = props.initialPage // 将页码重置为默认值
    fetchData() // 调用 fetchData 以获取新的数据
  }
}

// 初始数据和初始页监听
watch(
  () => [pagination.value.current, pagination.value.pageSize],
  () => {
    fetchData()
  }
)

// 设置初始数据
fetchData()

const reload = () => {
  fetchData()
}

defineExpose({
  reload
})
</script>

<style scoped>
/* 添加样式 */
</style>
