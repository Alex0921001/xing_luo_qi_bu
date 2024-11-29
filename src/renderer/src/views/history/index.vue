<template>
  <div class="history-wrapper">
    <a-tabs v-model:activeKey="activeKey" type="card" @change="changeTab">
      <a-tab-pane key="1" tab="手动案例"></a-tab-pane>
      <a-tab-pane key="2" tab="自动案例"></a-tab-pane>
      <template #rightExtra>
        <a-button type="text" @click="goReturn"><HomeOutlined /></a-button>
      </template>
    </a-tabs>
    <div>
      <a-form :model="formState">
        <SearchForm @search="reload">
          <a-col :span="6">
            <a-form-item>
              <a-input v-model:value="formState.name" placeholder="名称" allow-clear> </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item>
              <a-select v-model:value="formState.sex" placeholder="性别" allow-clear>
                <a-select-option value="男">男</a-select-option>
                <a-select-option value="女">女</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item>
              <a-input v-model:value="formState.tag" placeholder="类别" allow-clear> </a-input>
            </a-form-item>
          </a-col>

          <template #more>
            <a-col :span="6">
              <a-form-item>
                <a-input v-model:value="formState.comment" placeholder="备注" allow-clear>
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item>
                <a-range-picker
                  v-model:value="formState.birthday"
                  style="width: 100%"
                  show-time
                  :placeholder="['阳历生辰起始日期', '阳历生辰终止日期']"
                  allow-clear
                />
              </a-form-item>
            </a-col>
          </template>
        </SearchForm>
      </a-form>
    </div>
    <div class="mb-3">
      <a-button type="primary" @click="handleAdd"> 新增 </a-button>
    </div>
    <EasyTable ref="tableRef" bordered :data-fn="getData" :columns="colunms" size="small">
      <template #operation="{ record }">
        <a-button size="small" title="查看详情" type="text" @click="goDetail(record)"
          ><EyeOutlined
        /></a-button>
        <a-button size="small" title="编辑" type="text" @click="editRecord(record)"
          ><EditOutlined
        /></a-button>
        <a-button size="small" title="删除" type="text" danger @click="deleteRecord(record)"
          ><DeleteOutlined
        /></a-button>
      </template>
    </EasyTable>
  </div>
</template>

<script setup lang="ts">
import EasyTable from '@renderer/components/easy-table.vue'
import { HomeOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import type { UnwrapRef } from 'vue'
import SearchForm from '@renderer/components/search-form.vue'
import type { Dayjs } from 'dayjs'

interface FormState {
  name: string
  sex?: string
  birthday?: [Dayjs, Dayjs]
  tag: string
  comment: string
}
const formState: UnwrapRef<FormState> = reactive({
  name: '',
  sex: undefined,
  birthday: undefined,
  tag: '',
  comment: ''
})

const activeKey = ref('1')

const colunms = ref([
  {
    title: '序',
    dataIndex: 'Id',
    align: 'center',
    width: 50
  },
  {
    title: '名称',
    dataIndex: 'name',
    align: 'center'
  },
  {
    title: '性别',
    dataIndex: 'sex',
    align: 'center',
    width: 100
  },
  {
    title: '生辰',
    dataIndex: 'birthday',
    align: 'center'
  },
  {
    title: '类别',
    dataIndex: 'tag',
    align: 'center',
    width: 100
  },
  {
    title: '备注',
    dataIndex: 'comment'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
    width: 150,
    fixed: 'right'
  }
])

const getData = () => {
  console.log('getData')
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          list: [
            {
              Id: 1,
              name: '案例',
              sex: '男',
              lunar: '2009年1月1日 13:15:30',
              birthday: '2009年1月1日 13:15:30',
              tag: '系统案例',
              comment: '系统案例'
            },
            {
              Id: 1,
              name: '案例',
              sex: '男',
              lunar: '2009年1月1日 13:15:30',
              birthday: '2009年1月1日 13:15:30',
              tag: '系统案例',
              comment: '系统案例'
            }
          ],
          total: 100
        },
        message: 'success'
      })
    }, 1000)
  })
}

const tableRef = ref()
const reload = () => {
  tableRef.value.reload()
}

const changeTab = () => {
  Object.assign(formState, {
    name: '',
    sex: undefined,
    birthday: [],
    tag: '',
    comment: ''
  })
  reload()
}

const router = useRouter()
const goReturn = () => {
  router.go(-1)
}

const handleAdd = () => {
  router.push({ name: activeKey.value === '1' ? 'auto' : 'noauto' })
}

const goDetail = (record: any) => {
  console.log('goDetail', record)
}

const editRecord = (record: any) => {
  console.log('editRecord', record)
}

const deleteRecord = (record: any) => {
  console.log('deleteRecord', record)
}
</script>
<style scoped>
.history-wrapper {
  padding: 10px;
}
</style>
