<template>
  <div class="auto-manage">
    <div class="tool">
      <div title="返回" @click="handleCancel"><RollbackOutlined /></div>
      <div title="保存" @click="handleOk"><SaveOutlined /></div>
      <div title="关注"><StarOutlined /></div>
      <div title="预览"><EyeOutlined /></div>
      <div title="设置"><SettingOutlined /></div>
    </div>
    <div class="main">
      <div class="content">content</div>
      <div class="footer">footer</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  SettingOutlined,
  StarOutlined,
  RollbackOutlined,
  SaveOutlined,
  EyeOutlined
} from '@ant-design/icons-vue'
const router = useRouter()
const handleCancel = () => {
  router.go(-1)
}
const handleOk = () => {
  console.log('保存')
}
</script>
<style scoped>
.auto-manage {
  width: 100%;
  height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  .tool {
    position: absolute;
    background-color: #fff;
    margin-bottom: 5px;
    top: 50%;
    left: 5px;
    transform: translateY(-50%);
    div {
      height: 60px;
      width: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      font-size: 20px;
      &:hover {
        color: #1890ff;
      }
    }
  }

  .main {
    .content {
      width: 600px;
      height: 600px;
      background-color: #fff;
    }
    .footer {
      width: 600px;
      height: 60px;
      border-top: 1px solid #dbdbdb;
      background-color: #fff;
    }
  }
}
</style>
