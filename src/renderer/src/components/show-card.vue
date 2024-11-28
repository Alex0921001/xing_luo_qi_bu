<template>
  <div class="show-card">
    <div v-if="props.type" class="type" :style="{ backgroundColor: props.color }">
      {{ props.type }}
    </div>
    <div v-if="props.name" class="name">{{ props.name }}</div>
    <div v-if="props.subName" class="sub-name">{{ props.subName }}</div>
    <div class="tool-btn">
      <slot name="tool-btn"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  name: string
  subName: string
  type: string
  color: string
}
const props = defineProps<Props>()
</script>
<style scoped>
.show-card {
  width: 100px;
  height: 100px;
  position: relative;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  overflow: hidden;
  .type {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 20px;
    line-height: 20px;
    text-align: center;
    font-size: 12px;
    color: #fff;
  }
  .name {
    position: absolute;
    top: 20px;
    left: 0;
    width: 100%;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 15px;
    color: #333;
    font-weight: bold;
  }
  .sub-name {
    position: absolute;
    top: 50px;
    left: 0;
    width: 100%;
    height: 20px;
    line-height: 20px;
    text-align: center;
    font-size: 10px;
    color: #666;
  }
  .tool-btn {
    border-top: 1px solid #ccc;
    position: absolute;
    bottom: 0;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
    height: 25px;
  }
}
</style>
