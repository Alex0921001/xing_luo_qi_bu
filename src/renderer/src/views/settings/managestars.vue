<template>
  <div class="manage-stars">
    <a-form
      layout="inline"
      :model="formState"
      @finish="handleFinish"
      @finish-failed="handleFinishFailed"
    >
      <a-form-item>
        <a-input v-model:value="formState.name" placeholder="名称" allow-clear> </a-input>
      </a-form-item>
      <a-form-item>
        <a-input v-model:value="formState.subType" placeholder="子类" allow-clear> </a-input>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit"> 搜索 </a-button>
      </a-form-item>
    </a-form>
    <div class="mt-5 mb-5 text-left">
      <a-button type="primary" class="mr-3" @click="handleAdd">新增</a-button>
    </div>
    <div class="mt-5 mb-5 show-list">
      <template v-for="item in starsList" :key="item.Id">
        <show-card
          :name="item.name"
          :type="item.subType"
          :sub-name="`经：${item.x} 纬：${item.y}`"
          :color="getColor(item)"
        >
          <template #tool-btn>
            <a
              class="mr-2"
              style="color: #1677ff; display: inline-flex; align-items: center"
              @click="handleEdit(item)"
            >
              <span style="margin-left: 4px; font-size: 12px">编辑</span>
            </a>
            <a
              style="color: #ff4d4f; display: inline-flex; align-items: center"
              @click="handleDelete(item)"
            >
              <span style="margin-left: 4px; font-size: 12px">删除</span>
            </a>
          </template>
        </show-card>
      </template>
    </div>
  </div>
  <AddStar
    ref="addRef"
    :current="current"
    :modal-type="modalType"
    @reload="getAllStarsData"
  ></AddStar>
</template>

<script setup lang="ts">
import { getAllStars, deleteStar } from '@renderer/api/api'
import { reactive, createVNode } from 'vue'
import type { UnwrapRef } from 'vue'
import type { FormProps } from 'ant-design-vue'
import { Modal, message } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import AddStar from './components/add-star.vue'
import ShowCard from '@renderer/components/show-card.vue'
import type { STARITEM } from '@renderer/api/interface'

interface FormState {
  name: string
  subType: string
}
const formState: UnwrapRef<FormState> = reactive({
  name: '',
  subType: ''
})
const handleFinish: FormProps['onFinish'] = () => {
  getAllStarsData()
}
const handleFinishFailed: FormProps['onFinishFailed'] = (errors) => {
  console.log(errors)
}

const getColor = computed(() => {
  return (item: STARITEM) => {
    if (item.subType === '主耀') {
      // 红色
      return '#f5222d'
    } else if (item.subType === '辅耀') {
      // 紫色
      return '#722ed1'
    } else if (item.subType === '煞耀') {
      // 黑色
      return '#000'
    } else {
      // 蓝色
      return '#1890ff'
    }
  }
})

// 星系列表
const starsList = ref<STARITEM[]>([])
const getAllStarsData = async () => {
  const params = { ...formState }
  const res = await getAllStars(params)
  if (res.code === 200) {
    starsList.value = res.data
  }
}

const current = ref<STARITEM | null>(null)
const modalType = ref<'add' | 'edit'>('add')
const addRef = ref()
// 新增
const handleAdd = () => {
  current.value = null
  modalType.value = 'add'
  addRef.value?.toggle()
}
// 编辑
const handleEdit = (row: STARITEM) => {
  current.value = row
  modalType.value = 'edit'
  addRef.value?.toggle()
}
// 删除
const handleDelete = (row: STARITEM) => {
  Modal.confirm({
    title: '删除确认',
    icon: createVNode(ExclamationCircleOutlined),
    content: '你确定要删除吗？',
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      const resp = await deleteStar(row.Id)
      if (resp.code === 200) {
        getAllStarsData()
      } else {
        message.error('删除失败')
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onCancel() {}
  })
}

// 挂载
onMounted(() => {
  getAllStarsData()
})
</script>
<style scoped>
.show-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 5px; /* 你可以根据需要调整这个值 */
}
</style>
