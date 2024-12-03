<template>
  <a-modal v-model:open="open" title="日历" width="600px" @ok="handleOk">
    <perpetualCalendar ref="calRef"></perpetualCalendar>
  </a-modal>
</template>

<script setup lang="ts">
import perpetualCalendar from './perpetual-calendar.vue'
import dayjs from 'dayjs'
import { Solar } from 'lunar-typescript'

interface Props {
  dateTime: string
}
const props = defineProps<Props>()

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

watch(
  open,
  async (val) => {
    if (props.dateTime) {
      if (!val) return
      await nextTick()
      const d = dayjs(props.dateTime)
      calRef.value.state.year = d.year()
      calRef.value.state.month = d.month() + 1
      const now = Solar.fromDate(new Date(props.dateTime))
      calRef.value.state.selected = calRef.value.buildDay(now)
    }
  },
  {
    immediate: true
  }
)

defineExpose({
  toggle
})
</script>
<style scoped></style>
