<template>
  <a-row :gutter="5">
    <slot />
    <a-col :span="6">
      <a-space>
        <a-button type="link" @click="toggleMore">
          {{ showMore ? '收起' : '更多' }}
        </a-button>
        <a-button type="primary" @click="onSearch">搜索</a-button>
      </a-space>
    </a-col>
  </a-row>

  <transition name="fade">
    <a-row v-if="showMore" :gutter="5">
      <slot name="more" />
    </a-row>
  </transition>
</template>

<script setup>
const showMore = ref(false)

// Toggle "更多" feature
const toggleMore = () => {
  showMore.value = !showMore.value
}

// Search action

const emit = defineEmits(['search'])
const onSearch = () => {
  emit('search')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
