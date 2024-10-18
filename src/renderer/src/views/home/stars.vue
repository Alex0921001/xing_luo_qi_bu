<template>
  <canvas id="canvas"></canvas>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'

class Star {
  constructor(x, y, brightness, type) {
    this.x = x
    this.y = y
    this.brightness = brightness
    this.alpha = 1
    this.fade = Math.random() * 0.05 + 0.01
    this.type = type
    this.size = type === 'cross' ? 2 : 1 // 根据类型设置大小
  }

  draw() {
    ctx.beginPath()
    if (this.type === 'cross') {
      ctx.strokeStyle = `rgba(255, 255, 255, ${this.alpha})`
      ctx.lineWidth = 1 // 设置线条粗细
      ctx.moveTo(this.x, this.y - 1 * this.size)
      ctx.lineTo(this.x, this.y + 1 * this.size)
      ctx.moveTo(this.x - 1 * this.size, this.y)
      ctx.lineTo(this.x + 1 * this.size, this.y)
      ctx.stroke()
    } else {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  update() {
    this.brightness += Math.random() * 0.1 - 0.05
    this.brightness = Math.min(Math.max(this.brightness, 0), 1)

    this.alpha += this.fade
    if (this.alpha > 1 || this.alpha < 0) {
      this.fade = -this.fade
    }
  }
}

const stars = []
const numStars = 200

function createStars() {
  for (let i = 0; i < numStars; i++) {
    const type = Math.random() > 0.5 ? 'cross' : 'particle'
    stars.push(
      new Star(Math.random() * canvas.width, Math.random() * canvas.height, Math.random(), type)
    )
  }
}

function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  for (let i = 0; i < stars.length; i++) {
    stars[i].update()
    stars[i].draw()
  }
  requestAnimationFrame(animateStars)
}

let shootingStar = null

function createShootingStar() {
  const startX = Math.random() * canvas.width * 0.5 // 从左侧开始
  const startY = 0 // 从顶部开始
  const speed = 4 + Math.random() * 6
  const angle = Math.PI / 6 + (Math.random() * Math.PI) / 2 // 修改划过的角度范围

  // 增加长度、宽度和颜色属性
  shootingStar = {
    x: startX,
    y: startY,
    speed,
    angle,
    length: 80 + Math.random() * 40,
    thickness: 1 + Math.random() * 2,
    color: 'rgba(255, 255, 255, 1)'
  }
}

function animateShootingStar() {
  if (!shootingStar) {
    if (Math.random() < 0.01) {
      createShootingStar()
    }
  } else {
    const { x, y, speed, angle, length, thickness, color } = shootingStar
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(angle)

    const gradient = ctx.createLinearGradient(length, 0, 0, 0)
    gradient.addColorStop(0, color)
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

    ctx.strokeStyle = gradient
    ctx.lineWidth = thickness
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(length, 0)
    ctx.stroke()

    ctx.restore()

    shootingStar.x += speed * Math.cos(angle)
    shootingStar.y += speed * Math.sin(angle)

    if (shootingStar.x > canvas.width || shootingStar.y > canvas.height) {
      shootingStar = null
    }
  }
  requestAnimationFrame(animateShootingStar)
}

let ctx = reactive()
let canvas = reactive()

onMounted(() => {
  canvas = document.getElementById('canvas')
  ctx = canvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  createStars()
  animateStars()
  animateShootingStar()
})
</script>
<style scoped></style>
