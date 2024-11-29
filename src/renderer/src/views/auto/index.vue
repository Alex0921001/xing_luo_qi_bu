<template>
  <div class="history-wrapper">
    <a-button type="text" @click="goReturn"><HomeOutlined /></a-button>
  </div>
</template>

<script setup lang="ts">
import { HomeOutlined } from '@ant-design/icons-vue'
const router = useRouter()
const goReturn = () => {
  router.go(-1)
}
</script>
<style scoped></style>
