<template>
  <div>
    <router-view #="{ Component }">
      <component :is="Component" :key="route.name" />
    </router-view>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'

defineOptions({ name: 'Layout' })
const route = useRoute()
</script>
