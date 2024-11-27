<template>
  <div class="manage-stars">
    <a-form
      layout="inline"
      :model="formState"
      @finish="handleFinish"
      @finish-failed="handleFinishFailed"
    >
      <a-form-item>
        <a-input v-model:value="formState.name" placeholder="名称"> </a-input>
      </a-form-item>
      <a-form-item>
        <a-input v-model:value="formState.type" placeholder="类型"> </a-input>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit"> 搜索 </a-button>
      </a-form-item>
    </a-form>
    <div class="mt-5 mb-5 text-left">
      <a-button type="primary" class="mr-2" @click="handleAdd">新增</a-button>
    </div>
    <div>
      <a-table :data-source="starsList" :columns="columns" bordered>
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'operation'">
            <a-button type="text" @click="handleDelete(record)">编辑</a-button>
            <a-button type="text" @click="handleEdit(record)">删除</a-button>
          </template>
        </template>
      </a-table>
    </div>
  </div>
  <AddStar ref="addRef" :current="current" :modal-type="modalType"></AddStar>
</template>

<script setup lang="ts">
import { getAllStars, deleteStar } from '@renderer/api/api'
import { reactive, createVNode } from 'vue'
import type { UnwrapRef } from 'vue'
import type { FormProps } from 'ant-design-vue'
import { Modal, message } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import AddStar from './components/add-star.vue'
import type { STARITEM } from '@renderer/api/interface'

interface FormState {
  name: string
  type: string
}
const formState: UnwrapRef<FormState> = reactive({
  name: '',
  type: ''
})
const handleFinish: FormProps['onFinish'] = (values) => {
  console.log(values, formState)
}
const handleFinishFailed: FormProps['onFinishFailed'] = (errors) => {
  console.log(errors)
}

// 表格列
const columns = ref([
  {
    title: '序号',
    dataIndex: 'Id',
    key: 'Id'
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type'
  },
  {
    title: '子类',
    dataIndex: 'subType',
    key: 'subType'
  },
  {
    title: '经度',
    dataIndex: 'x',
    key: 'x'
  },
  {
    title: '纬度',
    dataIndex: 'y',
    key: 'y'
  },
  // {
  //   title: '描述',
  //   dataIndex: 'comment',
  //   key: 'comment'
  // },
  {
    title: '操作',
    key: 'action'
  }
])

// 星系列表
const starsList = ref([])
const getAllStarsData = async () => {
  const params = {}
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

// getAllStarsData()
</script>
<style scoped></style>
