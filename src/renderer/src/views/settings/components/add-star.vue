<template>
  <div class="add-star">
    <a-modal v-model:open="open" :title="title" ok-text="确定" cancel-text="取消" @ok="handleOk">
      <a-form
        ref="formRef"
        class="mt-5"
        :model="formData"
        name="basic"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 21 }"
        autocomplete="off"
      >
        <a-form-item label="名称" name="name" :rules="[{ required: true, message: '请输入名称' }]">
          <a-input
            v-model:value="formData.name"
            placeholder="请输入名称"
            allow-clear
            :disabled="disabled"
          />
        </a-form-item>
        <a-form-item label="类型" name="type" :rules="[{ required: true, message: '请输入类型' }]">
          <a-input v-model:value="formData.type" placeholder="请输入类型" allow-clear disabled />
        </a-form-item>
        <a-form-item label="子类" name="subType">
          <a-select
            v-model:value="formData.subType"
            style="width: 100%"
            placeholder="请输入子类"
            allow-clear
            :disabled="disabled"
          >
            <a-select-option v-for="item in StarsCategroy" :key="item.value" :value="item.value">{{
              item.label
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="经度" name="x">
          <a-input v-model:value="formData.x" placeholder="请输入经度" allow-clear />
        </a-form-item>
        <a-form-item label="纬度" name="y">
          <a-input v-model:value="formData.y" placeholder="请输入纬度" allow-clear />
        </a-form-item>
        <a-form-item label="描述" name="comment">
          <a-textarea
            v-model:value="formData.comment"
            :rows="4"
            placeholder="请输入描述"
            allow-clear
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import type { STARITEM } from '@renderer/api/interface'
import { addStar, updateStar } from '@renderer/api/api'
import { message } from 'ant-design-vue'
import { StarsCategroy } from '@renderer/enums'

interface Props {
  current: STARITEM | null
  modalType: 'add' | 'edit'
}
const props = defineProps<Props>()

// 开关
const open = ref<boolean>(false)
const toggle = () => {
  open.value = !open.value
}

const title = computed(() => {
  return props.modalType === 'edit' ? '编辑星系' : '新增星系'
})

const disabled = computed(() => {
  return props.modalType === 'edit' && props.current && props.current?.Id <= 18
})
const formData = reactive<Partial<STARITEM>>({
  Id: 0,
  name: '',
  type: '星',
  subType: undefined,
  x: '',
  y: '',
  comment: ''
})

const formRef = ref()
watch(
  () => open.value,
  (val) => {
    nextTick(() => {
      formRef.value.resetFields()
      if (val) {
        if (props.modalType === 'edit') {
          if (!props.current) return
          formData.Id = props.current.Id
          formData.name = props.current.name
          formData.type = props.current.type
          formData.subType = props.current.subType
          formData.x = props.current.x
          formData.y = props.current.y
          formData.comment = props.current.comment
        } else {
          formData.Id = 0
          formData.name = ''
          formData.type = '星'
          formData.subType = undefined
          formData.x = ''
          formData.y = ''
          formData.comment = ''
        }
      }
    })
  }
)

// 确定
const emit = defineEmits(['reload'])
const handleOk = async () => {
  const valid = await formRef.value.validate()
  if (!valid) return
  let resp
  if (props.modalType === 'add') {
    resp = await addStar(formData)
  } else {
    resp = await updateStar(formData)
  }

  if (resp.code === 200) {
    toggle()
    emit('reload')
    message.success('操作成功')
  } else {
    message.error('操作失败')
  }
}

defineExpose({
  toggle
})
</script>
