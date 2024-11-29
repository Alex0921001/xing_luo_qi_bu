<template>
  <a-modal v-model:open="open" title="日历" width="600px" @ok="handleOk">
    <perpetualCalendar ref="calRef"></perpetualCalendar>
  </a-modal>
</template>

<script setup lang="ts">
import perpetualCalendar from './perpetual-calendar.vue'

const open = ref(false)

const calRef = ref()
const emit = defineEmits(['ok'])
function handleOk() {
  toggle()
  emit('ok', calRef.value.state.selected.ymd)
}
function toggle() {
  open.value = !open.value
}

defineExpose({
  toggle
})
</script>
<style scoped></style>
