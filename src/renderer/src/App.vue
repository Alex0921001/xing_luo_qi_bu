<template>
  <div class="app-wrapper">
    <userHeader />
    <div class="flex justify-between app-content">
      <div class="drag"><dragger></dragger></div>
      <div class="edit"><richEdit></richEdit></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import userHeader from './components/header.vue'
import richEdit from './views/rich-edit.vue'
import dragger from './views/dragger.vue'
</script>
<style scoped>
.app-wrapper {
  background-color: #dde3e9;
  min-height: 100vh;
  .app-content {
    margin: 10px;
    min-height: calc(100vh - 70px);
    border-radius: 5px;
    overflow: auto;
    .drag {
      min-width: 700px;
      max-width: 700px;
      background-color: #fff;
      border-right: 1px solid #f0f0f0;
    }

    .edit {
      width: 100%;
      background-color: #fff;
    }
  }
}
</style>
