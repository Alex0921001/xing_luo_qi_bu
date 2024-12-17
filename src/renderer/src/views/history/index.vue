<template>
  <div class="history-wrapper">
    <a-tabs v-model:activeKey="activeKey" type="card" @change="changeTab">
      <a-tab-pane key="1" tab="自动案例"></a-tab-pane>
      <a-tab-pane key="2" tab="手动案例"></a-tab-pane>
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
            <a-col v-if="activeKey === '1'" :span="12">
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
      <template #birthday="{ record }">
        <span
          >{{ dayjs(record.birthday).format('YYYY-MM-DD') }}
          {{ dayjs(record.birthtime).format('HH:mm:ss') }}</span
        >
        （<span>{{ getLunar(record) }}</span
        >）
      </template>
      <template #operation="{ record }">
        <a-button
          v-if="activeKey === '1'"
          size="small"
          title="查看详情"
          type="text"
          @click="goDetail(record)"
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
import {
  HomeOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons-vue'
import type { UnwrapRef } from 'vue'
import SearchForm from '@renderer/components/search-form.vue'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { getAutoList, deleteAuto, getNoAutoList, deleteNoAuto } from '@renderer/api/api'
import { Lunar } from 'lunar-typescript'
import { Modal, message } from 'ant-design-vue'
import { createVNode } from 'vue'
import { useFormStore } from '@renderer/store/add-auto'

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

const colunms = computed(() => {
  if (activeKey.value === '1') {
    return [
      {
        title: '名称',
        dataIndex: 'name',
        align: 'center',
        width: 70
      },
      {
        title: '性别',
        dataIndex: 'sex',
        align: 'center',
        width: 50
      },
      {
        title: '生辰',
        dataIndex: 'birthday',
        align: 'center'
      },
      {
        title: '地址',
        dataIndex: 'address',
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
        dataIndex: 'comment',
        width: 150
      },
      {
        title: '操作',
        dataIndex: 'operation',
        align: 'center',
        width: 150,
        fixed: 'right'
      }
    ]
  } else {
    return [
      {
        title: '名称',
        dataIndex: 'name',
        align: 'center',
        width: 70
      },
      {
        title: '性别',
        dataIndex: 'sex',
        align: 'center',
        width: 50
      },
      {
        title: '类别',
        dataIndex: 'tag',
        align: 'center',
        width: 100
      },
      {
        title: '备注',
        dataIndex: 'comment',
        width: 150
      },
      {
        title: '操作',
        dataIndex: 'operation',
        align: 'center',
        width: 80,
        fixed: 'right'
      }
    ]
  }
})

const getLunar = computed(() => {
  return (record: any) => {
    const d = Lunar.fromDate(
      new Date(
        dayjs(record.birthday).format('YYYY-MM-DD') +
          ' ' +
          dayjs(record.birthtime).format('HH:mm:ss')
      )
    )

    return d + ' ' + d.getTimeZhi() + '时'
  }
})
const getData = async (params: any) => {
  const options = {
    ...params,
    ...formState
  }
  if (activeKey.value === '1') {
    const resp = await getAutoList(options)
    return resp
  } else {
    const resp = await getNoAutoList(options)
    return resp
  }
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
  formStore.setFormState({
    ...record
  })
  router.push({ name: 'automanage', query: { id: record.Id } })
}

const formStore = useFormStore()
const editRecord = (record: any) => {
  if (activeKey.value === '1') {
    formStore.setFormState({
      ...record
    })
    router.push({ name: 'auto', query: { id: record.Id } })
  } else {
    router.push({ name: 'noauto', query: { id: record.Id } })
  }
}

const deleteRecord = (record: any) => {
  Modal.confirm({
    title: '再次确认',
    icon: createVNode(ExclamationCircleOutlined),
    content: '是否要删除选中案例？',
    onOk: async () => {
      let resp: any
      if (activeKey.value === '1') {
        resp = await deleteAuto(record.Id)
      } else {
        resp = await deleteNoAuto(record.Id)
      }
      if (resp.code === 200) {
        reload()
        message.success('删除成功')
      } else {
        message.error('删除失败')
      }
    }
  })
}

onActivated(() => {
  reload()
})
</script>
<style scoped>
.history-wrapper {
  padding: 10px;
}
</style>
