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
    <div>
      <a-table
        :data-source="starsList"
        :columns="columns"
        bordered
        size="small"
        :pagination="false"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'position'">
            <span>经度：{{ record.x }} 纬度：{{ record.y }}</span>
          </template>
          <template v-if="column.dataIndex === 'operation'">
            <a
              class="mr-2"
              style="color: #1677ff; display: inline-flex; align-items: center"
              @click="handleEdit(record)"
            >
              <EditOutlined />
              <span style="margin-left: 4px">编辑</span>
            </a>
            <a
              style="color: #ff4d4f; display: inline-flex; align-items: center"
              @click="handleDelete(record)"
            >
              <DeleteOutlined />
              <span style="margin-left: 4px">删除</span>
            </a>
          </template>
        </template>
      </a-table>
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
import { ExclamationCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import AddStar from './components/add-star.vue'
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

// 表格列
const columns = ref([
  {
    title: '序号',
    dataIndex: 'Id',
    key: 'Id',
    align: 'center',
    width: 60
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    align: 'center'
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    align: 'center'
  },
  {
    title: '子类',
    dataIndex: 'subType',
    key: 'subType',
    align: 'center'
  },
  {
    title: '位置',
    dataIndex: 'position',
    key: 'position',
    minWidth: 200,
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    minWidth: 150,
    align: 'center'
  }
])

// 星系列表
const starsList = ref([])
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
<style scoped></style>
