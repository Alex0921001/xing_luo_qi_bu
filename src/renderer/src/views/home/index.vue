<template>
  <div class="home">
    <stars class="stars"></stars>
    <background class="bg"></background>
    <div class="search">
      <a-input v-model:value="searchValue" placeholder="请输入搜索内容">
        <template #suffix>
          <SearchOutlined style="font-size: 20px" />
        </template>
      </a-input>
    </div>
    <div class="entry-items">
      <div class="entry small-text" @click="clickNoAuto">
        <i
          class="iconfont icon-xlqbshoudong"
          style="font-size: 26px; color: white"
          title="手动排盘"
        ></i>
      </div>
      <div class="entry small-text" @click="clickAuto">
        <GatewayOutlined style="font-size: 30px" title="自动排盘" />
      </div>
      <div class="entry small-text" @click="historyRecord">
        <FileTextOutlined style="font-size: 30px" title="历史记录" />
      </div>
      <div class="entry small-text" @click="historyRecord">
        <SettingOutlined style="font-size: 30px" title="设置" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="Home">
import {
  SearchOutlined,
  SettingOutlined,
  FileTextOutlined,
  AppstoreAddOutlined,
  GatewayOutlined
} from '@ant-design/icons-vue'
import background from './background.vue'
import stars from './stars.vue'

const searchValue = ref('')

const router = useRouter()
const clickAuto = () => {
  console.log('clickAuto')
}
const clickNoAuto = () => {
  router.push('/noauto')
}
const historyRecord = () => {
  console.log('historyRecord')
}
</script>
<style scoped lang="less">
.home {
  position: relative;
  height: 100vh;
  background-color: black;
  touch-action: none;
  .search {
    position: absolute;
    top: 40px;
    left: 50%;
    transform: translateX(-50%);
    width: 400px;
    letter-spacing: 1px;
    z-index: 4;
    ::v-deep(.ant-input-affix-wrapper) {
      background-color: #fafcff30;
      border: none;
      color: white;
      height: 50px;
      border-radius: 30px;
      padding: 0 20px;
      input {
        background-color: transparent;
        border: none;
        color: white;
        height: 50px;
        border-radius: 30px;
        &::placeholder {
          color: rgba(255, 255, 255, 0.5); // 设置 placeholder 的颜色
        }
      }
    }
  }
  .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
  }
  .stars {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  .entry-items {
    position: absolute;
    bottom: 20px;
    right: 20px;
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-start;
    align-items: center;
    column-gap: 10px;
    .entry {
      height: 60px;
      width: 60px;
      z-index: 3;
    }
  }
  .text {
    // letter-spacing: 5px;
    background-color: #fafcff30;
    border-radius: 50%;
    font-weight: bold;
    color: white;
    cursor: pointer;
    font-size: 30px;
    font-family: SimSun;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    z-index: 3;
    &:hover {
      // background-color: #5496ff;
      transform: scale(1.3);
    }
  }
  .small-text {
    .text;
    font-size: 20px;
  }
}
</style>
