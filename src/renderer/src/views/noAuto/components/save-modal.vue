<template>
  <a-modal v-model:open="open" :title="title" @ok="handleOk">
    <a-form ref="formRef" :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="姓名" name="name" :rules="[{ required: true, message: '请输入姓名' }]">
        <a-input
          v-model:value="formState.name"
          placeholder="请输入姓名"
          :maxlength="20"
          show-count
          allow-clear
        />
      </a-form-item>
      <a-form-item label="性别" name="name">
        <a-radio-group v-model:value="formState.sex">
          <a-radio value="男">男</a-radio>
          <a-radio value="女">女</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="标签" name="tag">
        <a-input
          v-model:value="formState.tag"
          placeholder="请输入标签，选择右边快速填入"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="备注" name="comment">
        <a-textarea v-model:value="formState.comment" placeholder="请输入备注" :rows="6" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { addNoAuto, updateNoAuto } from '@renderer/api/api'
import { message } from 'ant-design-vue'
interface Props {
  modalType: 'add' | 'edit'
  currentItem: FormState
  shengNianGan: number
}
const props = defineProps<Props>()
const title = computed(() => {
  return props.modalType === 'add' ? '新增' : '编辑'
})
const open = ref(false)
function toggle() {
  open.value = !open.value
}

interface FormState {
  Id?: number
  name: string
  sex: '男' | '女'
  tag: string
  comment: string
  settings: string
  shengniangan?: number
}
const formState = reactive<FormState>({
  Id: undefined,
  name: '',
  sex: '男',
  tag: '',
  comment: '',
  settings: '',
  shengniangan: props.shengNianGan
})

watch(
  () => props.currentItem,
  async (val) => {
    await nextTick()
    Object.assign(formState, {
      ...val
    })
  },
  {
    immediate: true,
    deep: true
  }
)
watch(
  () => props.shengNianGan,
  async (val) => {
    formState.shengniangan = val
  },
  {
    immediate: true
  }
)

const labelCol = { span: 4 }
const wrapperCol = { span: 20 }
const formRef = ref()
async function handleOk() {
  const flag = await formRef.value.validate()
  if (flag) {
    let resp: any
    if (props.modalType === 'add') {
      resp = await addNoAuto(formState)
    } else {
      resp = await updateNoAuto(formState)
    }
    if (resp.code === 200) {
      toggle()
      message.success('保存成功')
    }
  }
}

defineExpose({
  toggle
})
</script>
<style scoped></style>
