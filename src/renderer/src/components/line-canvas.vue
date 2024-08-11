<template>
  <div class="line-canvas">
    <canvas ref="canvasRef" width="300" height="250"></canvas>
  </div>
</template>
<script lang="ts" setup>
import { watch, ref } from 'vue'

interface Item {
  Id: number
  fixedNumber: string
  stars: { Id: number; type: string; name: string; subType?: string }[]
  boxName: string
  tenYearsName: string
  everyYearName: string
  ganName: string
}

type Props = {
  currentClickBox: Item | null
}
const props = defineProps<Props>()

watch(
  () => props.currentClickBox,
  (val) => {
    if (val) handleCanvas()
    else clearCanvas()
  },
  { deep: true }
)

const canvasRef = ref<HTMLCanvasElement | null>()

function handleCanvas() {
  const canvas = canvasRef.value
  if (canvas) {
    const ctx = canvas.getContext('2d')
    if (ctx) {
      // 清空画布

      clearCanvas()
      // 设置虚线样式
      ctx.setLineDash([5, 3])

      // 开始绘制路径
      ctx.beginPath()

      const id = props.currentClickBox!.Id
      if ([1, 5, 9].includes(id)) {
        ctx.moveTo(225, 250) // 第一个顶点
        ctx.lineTo(0, 62.5) // 第二个顶点
        ctx.lineTo(300, 0) // 第三个顶点
        ctx.closePath() // 闭合路径
        if (id === 1) {
          ctx.moveTo(225, 250)
          ctx.lineTo(75, 0)
        } else if (id === 5) {
          ctx.moveTo(0, 62.5)
          ctx.lineTo(300, 187.5)
        } else {
          ctx.moveTo(0, 250)
          ctx.lineTo(300, 0)
        }
      } else if ([2, 6, 10].includes(id)) {
        ctx.moveTo(75, 250) // 第一个顶点
        ctx.lineTo(0, 0) // 第二个顶点
        ctx.lineTo(300, 62.5) // 第三个顶点
        ctx.closePath() // 闭合路径
        if (id === 2) {
          ctx.moveTo(75, 250)
          ctx.lineTo(225, 0)
        } else if (id === 6) {
          ctx.moveTo(0, 0)
          ctx.lineTo(300, 250)
        } else {
          ctx.moveTo(300, 62.5)
          ctx.lineTo(0, 187.5)
        }
      } else if ([3, 7, 11].includes(id)) {
        ctx.moveTo(0, 250) // 第一个顶点
        ctx.lineTo(75, 0) // 第二个顶点
        ctx.lineTo(300, 187.5) // 第三个顶点
        ctx.closePath() // 闭合路径
        if (id === 3) {
          ctx.moveTo(0, 250)
          ctx.lineTo(300, 0)
        } else if (id === 7) {
          ctx.moveTo(75, 0)
          ctx.lineTo(225, 250)
        } else {
          ctx.moveTo(300, 187.5)
          ctx.lineTo(0, 62.5)
        }
      } else {
        ctx.moveTo(0, 187.5) // 第一个顶点
        ctx.lineTo(225, 0) // 第二个顶点
        ctx.lineTo(300, 250) // 第三个顶点
        ctx.closePath() // 闭合路径
        if (id === 4) {
          ctx.moveTo(0, 187.5)
          ctx.lineTo(300, 62.5)
        } else if (id === 8) {
          ctx.moveTo(225, 0)
          ctx.lineTo(75, 250)
        } else {
          ctx.moveTo(300, 250)
          ctx.lineTo(0, 0)
        }
      }

      // 设置线条颜色
      ctx.strokeStyle = '#c5c5c5'

      // 绘制路径
      ctx.stroke()
    }
  }
}

const clearCanvas = () => {
  const canvas = canvasRef.value
  if (canvas) {
    const ctx = canvas.getContext('2d')
    if (ctx) {
      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }
}
</script>
