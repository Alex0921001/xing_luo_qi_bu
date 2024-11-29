<template>
  <div class="history-wrapper">
    <a-card hoverable style="width: 600px">
      <template #title>
        <LeftOutlined style="color: #1890ff" @click="goReturn" /> 自动排盘
      </template>
      <a-form
        :model="formState"
        name="basic"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 18 }"
        autocomplete="off"
        @finish="onFinish"
      >
        <a-form-item label="姓名" name="name" :rules="[{ required: true, message: '请输入姓名' }]">
          <a-input
            v-model:value="formState.name"
            placeholder="请输入姓名"
            :maxlength="20"
            show-count
            allow-clear
          />
        </a-form-item>

        <a-form-item
          label="出生日"
          name="birthday"
          :rules="[{ required: true, message: '请输入出生日' }]"
        >
          <div @click="clickBirthday">
            <a-input v-model:value="formState.birthday" placeholder="请选择出生日" readonly />
          </div>
        </a-form-item>
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
        <a-form-item label="出生地" name="address">
          <a-input v-model:value="formState.address" placeholder="请选择出生地" readonly />
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 11, span: 13 }">
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

const router = useRouter()
const goReturn = () => {
  router.go(-1)
}

interface FormState {
  name: string // 姓名
  birthday: string // 出生日期
  birthtime: string // 出生时间
  address: string // 地址
}

const formState = reactive<FormState>({
  name: '',
  birthday: '',
  birthtime: '',
  address: ''
})
const onFinish = (values: any) => {
  console.log('Success:', values)
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
