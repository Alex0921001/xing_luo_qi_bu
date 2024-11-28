<template>
  <a-layout style="min-height: 100vh">
    <div class="left-sider">
      <div
        v-for="item in siderList"
        :key="item.name"
        class="sider-item"
        :class="{ active: item.name === selectedKeys }"
        @click="handleSkip(item.name)"
      >
        <component :is="item.icon" style="margin-right: 5px"></component>
        <span>{{ item.title }}</span>
      </div>
    </div>
    <div class="logout" @click="logout">
      <HomeOutlined title="返回" />
    </div>
    <div class="content">
      <router-view> </router-view>
    </div>
  </a-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {
  StarOutlined,
  ToolOutlined,
  HomeOutlined,
  RadarChartOutlined,
  BuildOutlined,
  BranchesOutlined
} from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'

const siderList = [
  { name: 'managestars', title: '星系管理', icon: StarOutlined },
  { name: 'managegongs', title: '宫位管理', icon: BuildOutlined },
  { name: 'managegans', title: '天干管理', icon: RadarChartOutlined },
  { name: 'managedizhis', title: '地支管理', icon: BranchesOutlined },
  { name: 'common', title: '通用设置', icon: ToolOutlined }
]

const selectedKeys = ref<string>('') // 默认选中星系管理

const router = useRouter()
const logout = () => {
  router.push('/home')
}

const handleSkip = (key: string) => {
  selectedKeys.value = key // 更新选中状态
  router.push({ name: key }) // 路由跳转
}

const route = useRoute()
onMounted(() => {
  selectedKeys.value = route.name as string // 页面刷新后选中状态更新
})
</script>

<style scoped>
.left-sider {
  width: 150px;
  background-color: #141414;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
}

.sider-item {
  display: flex;
  align-items: center;
  height: 40px;
  padding-left: 10px;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
}

.active {
  background-color: #097aff;
}

.content {
  margin-left: 150px;
  background-color: white;
  height: 100vh;
  padding: 20px;
  text-align: right;
}

.logout {
  font-size: 20px;
  font-weight: bold;
  color: white;
  position: absolute;
  bottom: 10px;
  left: 65px;
  cursor: pointer;
}
</style>
