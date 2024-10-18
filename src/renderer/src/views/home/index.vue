<template>
  <div class="home">
    <stars class="stars"></stars>
    <background class="bg"></background>
    <div class="auto text" @click="clickNoAuto">
      <span>手动</span>
      <span>排盘</span>
    </div>
    <div class="noauto small-text" @click="clickAuto">
      <span>自动</span>
      <span>排盘</span>
    </div>
    <div class="record small-text" @click="historyRecord">
      <span>历史</span>
      <span>记录</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import background from './background.vue'
import stars from './stars.vue'

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
  // background-image: url('@render/assets/images/bg.png');
  // background-repeat: no-repeat;
  // background-size: 100% 100%;
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
  .auto {
    position: absolute;
    bottom: 20px;
    right: 20px;
    height: 150px;
    width: 150px;
  }
  .noauto {
    position: absolute;
    bottom: 200px;
    right: 20px;
    height: 100px;
    width: 100px;
  }
  .record {
    position: absolute;
    bottom: 20px;
    right: 200px;
    height: 100px;
    width: 100px;
  }
  .text {
    letter-spacing: 5px;
    background-color: #fafcff30;
    border-radius: 50%;
    font-weight: bold;
    color: white;
    cursor: pointer;
    font-size: 30px;
    // font-family: SimSun;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    z-index: 3;
    &:hover {
      background-color: #5496ff;
    }
  }
  .small-text {
    .text;
    font-size: 20px;
  }
}
</style>
