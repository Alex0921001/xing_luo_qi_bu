<template>
  <div class="app-wrapper">
    <div class="app-content">
      <div class="drag"><dragger></dragger></div>
      <div class="edit"><richEdit></richEdit></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import richEdit from './views/rich-edit.vue'
import dragger from './views/dragger.vue'
</script>
<style scoped>
.app-wrapper {
  background-color: #dde3e9;
  min-height: 100vh;
  overflow: hidden;
  .app-content {
    display: flex;
    min-height: 100vh;
    border-radius: 5px;
    overflow: auto;
    .drag {
      min-width: 900px;
      background-color: #fff;
      border-right: 1px solid #c5c5c5;
    }

    .edit {
      width: 100%;
      background-color: #fff;
    }
  }
}
</style>
