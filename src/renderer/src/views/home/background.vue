<template>
  <div class="background"></div>
</template>

<script setup ts>
import { onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { XINGS } from '@render/enums'

// 创建场景
const scene = new THREE.Scene()

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 0, 14)
camera.lookAt(0, 0, 0)

// 创建渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setClearColor(0x000000, 0)

// 创建半透明球体
const sphereGeometry = new THREE.SphereGeometry(4.85, 16, 16)
const sphereMaterial = new THREE.ShaderMaterial({
  uniforms: {
    color: { value: new THREE.Color(0x000000) },
    opacity: { value: 0.8 }
  },
  vertexShader: `
    varying vec3 vNormal;
    void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 color;
    uniform float opacity;
    varying vec3 vNormal;
    void main() {
        float alpha = opacity * smoothstep(0.5, 1.0, vNormal.z);
        gl_FragColor = vec4(color, alpha);
    }
  `,
  transparent: true,
  side: THREE.FrontSide,
  depthWrite: false
})

const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
scene.add(sphere)

// 创建小球体和标签数组
const smallBallGeometry = new THREE.SphereGeometry(0.15, 16, 16)
const smallBalls = []
const labelSprites = []

const radius = 5
const numPoints = XINGS.length
const goldenRatio = (1 + Math.sqrt(5)) / 2
const maxWidth = 160
const textSpeed = 0.002

// 创建射线投射器
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

function createTextTexture(text, parameters = {}) {
  const {
    fontSize = 24,
    fontFace = 'PingFang SC, Microsoft YaHei, Noto Sans, Arial, sans-serif',
    textColor = 'white',
    backgroundColor = 'rgba(0,0,0,0)',
    maxWidth = 160
  } = parameters

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  context.font = `${fontSize}px ${fontFace}`

  const textMetrics = context.measureText(text)
  const textWidth = Math.ceil(textMetrics.width)
  const textHeight = fontSize * 1.2

  const needMarquee = textWidth > maxWidth

  let canvasWidth = maxWidth
  if (needMarquee) {
    canvasWidth = textWidth + 60
  }

  canvas.width = canvasWidth
  canvas.height = textHeight
  context.font = `${fontSize}px ${fontFace}`
  context.clearRect(0, 0, canvas.width, canvas.height)

  context.fillStyle = backgroundColor
  context.fillRect(0, 0, canvas.width, canvas.height)

  context.fillStyle = textColor
  context.textAlign = needMarquee ? 'left' : 'center'
  context.textBaseline = 'middle'

  if (needMarquee) {
    context.fillText(text, 0, canvas.height / 2)
  } else {
    context.fillText(text, maxWidth / 2, canvas.height / 2)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true

  if (needMarquee) {
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    texture.repeat.x = maxWidth / canvas.width
  } else {
    texture.wrapS = THREE.ClampToEdgeWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
  }

  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.generateMipmaps = false
  return { texture, needMarquee, HWRate: textHeight / maxWidth }
}

for (let i = 0; i < numPoints; i++) {
  const y = 1 - (i / (numPoints - 1)) * 2
  const radiusAtY = Math.sqrt(1 - y * y)

  const theta = (2 * Math.PI * i) / goldenRatio

  const x = Math.cos(theta) * radiusAtY
  const z = Math.sin(theta) * radiusAtY
  const smallBallMaterial = new THREE.MeshBasicMaterial({
    color: getColor(XINGS[i]),
    depthWrite: true,
    depthTest: true,
    side: THREE.FrontSide
  })
  const smallBall = new THREE.Mesh(smallBallGeometry, smallBallMaterial)
  smallBall.position.set(x * radius, y * radius, z * radius)
  sphere.add(smallBall)
  smallBalls.push(smallBall)

  const labelText = XINGS[i].name
  const { texture, needMarquee, HWRate } = createTextTexture(labelText, {
    fontSize: 30,
    fontFace: 'PingFang SC, Microsoft YaHei, Noto Sans, Arial, sans-serif',
    textColor: '#bbbbbb',
    maxWidth: maxWidth
  })

  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: true,
    depthTest: true,
    blending: THREE.NormalBlending
  })

  const sprite = new THREE.Sprite(spriteMaterial)
  sprite.scale.set(1, HWRate, 1)
  labelSprites.push({ sprite, smallBall, texture, needMarquee, labelText })
  scene.add(sprite)
}

// 添加灯光
const light = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(light)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

// 定义自动旋转速度和轴
const autoRotationSpeed = 0.0005
const autoRotationAxis = new THREE.Vector3(0, 1, 0).normalize()
const currentAngularVelocity = autoRotationAxis.clone().multiplyScalar(autoRotationSpeed)

let isDragging = false
let previousMousePosition = { x: 0, y: 0 }
let lastDragDelta = { x: 0, y: 0 }

const decayRate = 0.92
const increaseRate = 1.02

// 鼠标事件处理
const onMouseDown = (event) => {
  isDragging = true
  previousMousePosition = {
    x: event.clientX,
    y: event.clientY
  }
}

const onMouseMove = (event) => {
  if (isDragging) {
    const deltaX = event.clientX - previousMousePosition.x
    const deltaY = event.clientY - previousMousePosition.y

    lastDragDelta = { x: deltaX, y: deltaY }

    const rotationFactor = 0.005

    const angleY = deltaX * rotationFactor
    const angleX = deltaY * rotationFactor

    const quaternionY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angleY)
    const quaternionX = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), angleX)

    const deltaQuat = new THREE.Quaternion().multiplyQuaternions(quaternionY, quaternionX)

    sphere.quaternion.multiplyQuaternions(deltaQuat, sphere.quaternion)

    const dragRotationAxis = new THREE.Vector3(deltaY, deltaX, 0).normalize()
    const dragRotationSpeed = Math.sqrt(deltaX * deltaX + deltaY * deltaY) * rotationFactor

    if (dragRotationAxis.length() > 0) {
      currentAngularVelocity.copy(dragRotationAxis).multiplyScalar(dragRotationSpeed)
    }

    previousMousePosition = {
      x: event.clientX,
      y: event.clientY
    }
  }
}

const onMouseUp = () => {
  if (isDragging) {
    isDragging = false

    const deltaX = lastDragDelta.x
    const deltaY = lastDragDelta.y

    if (deltaX !== 0 || deltaY !== 0) {
      const newAxis = new THREE.Vector3(deltaY, deltaX, 0).normalize()
      if (newAxis.length() > 0) {
        autoRotationAxis.copy(newAxis)
      }

      const dragSpeed = currentAngularVelocity.length()
      if (dragSpeed > autoRotationSpeed) {
        // 维持当前旋转速度
      } else {
        currentAngularVelocity.copy(autoRotationAxis).multiplyScalar(autoRotationSpeed)
      }
    }
  }
}

// 触摸事件处理
const onTouchStart = (event) => {
  isDragging = true
  const touch = event.touches[0]
  previousMousePosition = {
    x: touch.clientX,
    y: touch.clientY
  }
}

const onTouchMove = (event) => {
  event.preventDefault()
  if (isDragging) {
    const touch = event.touches[0]
    const deltaX = touch.clientX - previousMousePosition.x
    const deltaY = touch.clientY - previousMousePosition.y

    lastDragDelta = { x: deltaX, y: deltaY }

    const rotationFactor = 0.002

    const angleY = deltaX * rotationFactor
    const angleX = deltaY * rotationFactor

    const quaternionY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angleY)
    const quaternionX = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), angleX)

    const deltaQuat = new THREE.Quaternion().multiplyQuaternions(quaternionY, quaternionX)

    sphere.quaternion.multiplyQuaternions(deltaQuat, sphere.quaternion)

    const dragRotationAxis = new THREE.Vector3(deltaY, deltaX, 0).normalize()
    const dragRotationSpeed = Math.sqrt(deltaX * deltaX + deltaY * deltaY) * rotationFactor

    if (dragRotationAxis.length() > 0) {
      currentAngularVelocity.copy(dragRotationAxis).multiplyScalar(dragRotationSpeed)
    }

    previousMousePosition = {
      x: touch.clientX,
      y: touch.clientY
    }
  }
}

const onTouchEnd = (event) => {
  if (isDragging) {
    isDragging = false

    const deltaX = lastDragDelta.x
    const deltaY = lastDragDelta.y

    if (deltaX !== 0 || deltaY !== 0) {
      const newAxis = new THREE.Vector3(deltaY, deltaX, 0).normalize()
      if (newAxis.length() > 0) {
        autoRotationAxis.copy(newAxis)
      }

      const dragSpeed = currentAngularVelocity.length()
      if (dragSpeed > autoRotationSpeed) {
        // 维持当前旋转速度
      } else {
        currentAngularVelocity.copy(autoRotationAxis).multiplyScalar(autoRotationSpeed)
      }
    }
  }

  // 检查点击事件
  if (event.changedTouches.length > 0) {
    const touch = event.changedTouches[0]
    mouse.x = (touch.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1
    checkIntersection()
  }
}

function onMouseClick(event) {
  event.preventDefault()
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
  // console.log(event.clientX, mouse.x, mouse.y)

  checkIntersection()
}

function checkIntersection() {
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(smallBalls)

  if (intersects.length > 0) {
    const intersectedBall = intersects[0].object
    const index = smallBalls.indexOf(intersectedBall)
    if (index !== -1) {
      const labelInfo = labelSprites[index]
      showLabelInfo(labelInfo)
    }
  }
}

function showLabelInfo(labelInfo) {
  console.log(`点击的小球标签：${labelInfo.labelText}`)
}

// 动画循环
function animate() {
  requestAnimationFrame(animate)

  if (!isDragging) {
    const deltaQuat = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        currentAngularVelocity.x,
        currentAngularVelocity.y,
        currentAngularVelocity.z,
        'XYZ'
      )
    )
    sphere.quaternion.multiplyQuaternions(deltaQuat, sphere.quaternion)

    const currentSpeed = currentAngularVelocity.length()

    if (currentSpeed > autoRotationSpeed) {
      currentAngularVelocity.multiplyScalar(decayRate)

      if (currentAngularVelocity.length() < autoRotationSpeed) {
        currentAngularVelocity.copy(autoRotationAxis).multiplyScalar(autoRotationSpeed)
      }
    } else if (currentSpeed < autoRotationSpeed) {
      currentAngularVelocity.multiplyScalar(increaseRate)

      if (currentAngularVelocity.length() > autoRotationSpeed) {
        currentAngularVelocity.copy(autoRotationAxis).multiplyScalar(autoRotationSpeed)
      }
    } else {
      currentAngularVelocity.copy(autoRotationAxis).multiplyScalar(autoRotationSpeed)
    }
  }

  // 更新标签的位置和跑马灯效果
  labelSprites.forEach(({ sprite, smallBall, texture, needMarquee }) => {
    smallBall.updateMatrixWorld()
    const smallBallWorldPos = new THREE.Vector3()
    smallBall.getWorldPosition(smallBallWorldPos)

    const upOffset = new THREE.Vector3(0, 0.3, 0)

    sprite.position.copy(smallBallWorldPos).add(upOffset)

    if (needMarquee) {
      texture.offset.x += textSpeed

      if (texture.offset.x > 1) {
        texture.offset.x = 0
      }
    }
  })

  renderer.render(scene, camera)
}

animate()

// 颜色选择
function getColor(it) {
  if (it.subType === '北' || it.subType === '南') {
    return '#ff0000'
  } else if (it.subType === '辅') {
    return '#800080'
  } else if (it.subType === '煞') {
    return '#fff'
  } else {
    return '#097AFF'
  }
}

onMounted(() => {
  const background = document.querySelector('.background')
  background.appendChild(renderer.domElement)

  // 事件监听
  window.addEventListener('mousedown', onMouseDown)
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
  window.addEventListener('touchstart', onTouchStart)
  window.addEventListener('touchmove', onTouchMove)
  window.addEventListener('touchend', onTouchEnd)
  document.addEventListener('gesturestart', function (e) {
    e.preventDefault()
  })

  // 添加点击事件监听
  window.addEventListener('click', onMouseClick)

  // 处理窗口大小调整
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })
})

onUnmounted(() => {
  // 事件监听
  window.removeEventListener('mousedown', onMouseDown)
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
  window.removeEventListener('touchstart', onTouchStart)
  window.removeEventListener('touchmove', onTouchMove)
  window.removeEventListener('touchend', onTouchEnd)
  document.removeEventListener('gesturestart', () => {})

  // 添加点击事件监听
  window.removeEventListener('click', onMouseClick)

  // 处理窗口大小调整
  window.removeEventListener('resize', () => {})
})
</script>
<style scoped>
canvas {
  display: block;
}
</style>
