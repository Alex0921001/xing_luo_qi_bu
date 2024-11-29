<template>
  <div>
    <router-view #="{ Component }">
      <keep-alive>
        <component :is="Component" v-if="route.meta.keepAlive" :key="route.name" />
      </keep-alive>
      <component :is="Component" v-if="!route.meta.keepAlive" :key="route.name" />
    </router-view>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
defineOptions({ name: 'Layout' })

const route = useRoute()
</script>
