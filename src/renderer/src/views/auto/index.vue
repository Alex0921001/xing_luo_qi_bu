<template>
  <div class="history-wrapper">
    <a-card hoverable style="width: 800px">
      <template #title>
        <LeftOutlined style="color: #1890ff" @click="goReturn" /> 自动排盘
      </template>
      <a-form
        :model="formState"
        name="basic"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
        autocomplete="off"
        @finish="onFinish"
      >
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="姓名"
              name="name"
              :rules="[{ required: true, message: '请输入姓名' }]"
            >
              <a-input
                v-model:value="formState.name"
                placeholder="请输入姓名"
                :maxlength="20"
                show-count
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="性别" name="name">
              <a-radio-group v-model:value="formState.sex">
                <a-radio value="男">男</a-radio>
                <a-radio value="女">女</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="出生日"
              name="birthday"
              :rules="[{ required: true, message: '请输入出生日' }]"
            >
              <div @click="clickBirthday">
                <a-input v-model:value="formState.birthday" placeholder="请选择出生日" readonly />
              </div>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="出生时"
              name="birthtime"
              :rules="[{ required: true, message: '请输入出生时' }]"
            >
              <a-date-picker
                v-model:value="formState.birthtime"
                style="width: 100%"
                placeholder="请选择出生时"
                picker="time"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="标签" name="tag">
              <a-input v-model:value="formState.tag" placeholder="请输入标签" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="出生地"
              name="address"
              :label-col="{ span: 3 }"
              :wrapper-col="{ span: 21 }"
            >
              <a-input v-model:value="formState.address" placeholder="请选择出生地" readonly />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="备注"
              name="commnet"
              :label-col="{ span: 3 }"
              :wrapper-col="{ span: 21 }"
            >
              <a-textarea v-model:value="formState.commnet" placeholder="请输入备注" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item :wrapper-col="24" class="text-center">
          <a-button class="mr-2" @click="goReturn">取消</a-button>
          <a-button class="mr-2" @click="setInitForm">重置</a-button>
          <a-button type="primary" html-type="submit">生成</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
  <CalendarModal ref="calendarRef" @ok="handleBirthday"></CalendarModal>
</template>

<script setup lang="ts">
import { LeftOutlined } from '@ant-design/icons-vue'
import CalendarModal from '@renderer/components/calendar-modal.vue'
import { useFormStore } from '@renderer/store/add-auto' // 引入创建的 store

interface FormState {
  name: string // 姓名
  birthday: string // 出生日期
  birthtime: string // 出生时间
  address: string // 地址
  sex: string // 性别
  tag: string // 标签
  commnet: string // 备注
}
const formStore = useFormStore() // 创建 store 实例
const formState = reactive<FormState>({
  name: formStore.name,
  birthday: formStore.birthday,
  birthtime: formStore.birthtime,
  address: formStore.address,
  sex: formStore.sex,
  tag: formStore.tag,
  commnet: formStore.commnet
})
const router = useRouter()
const goReturn = () => {
  router.go(-1)
}
const setInitForm = () => {
  const initFormData = {
    name: '',
    birthday: '',
    birthtime: '',
    address: '',
    sex: '男',
    tag: '',
    commnet: ''
  }
  Object.assign(formState, { ...initFormData })
  formStore.setFormState({
    ...initFormData
  })
}

const onFinish = () => {
  // 保存表单信息到 store
  formStore.setFormState({
    name: formState.name,
    birthday: formState.birthday,
    birthtime: formState.birthtime,
    address: formState.address,
    sex: formState.sex,
    tag: formState.tag,
    commnet: formState.commnet
  })
  router.push({
    name: 'automanage'
  })
}

const calendarRef = ref()
const handleBirthday = (val: string) => {
  formState.birthday = val
}
const clickBirthday = () => {
  calendarRef.value.toggle()
}
</script>
<style scoped>
.history-wrapper {
  width: 100%;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
