<template>
  <a-modal
    v-model:open="open"
    title="地图"
    width="100%"
    ok-text="确定"
    wrap-class-name="full-modal"
    style="top: 10px; left: 0"
    @ok="handleOk"
  >
    <div id="map-view"></div>
  </a-modal>
</template>
<script lang="ts" setup>
import AMapLoader from '@amap/amap-jsapi-loader'

interface Props {
  lng?: number
  lat?: number
}
const props = defineProps<Props>()

const open = ref<boolean>(false)

window._AMapSecurityConfig = {
  securityJsCode: 'f725eef8da6b5213c79bd379de33bfcd'
}

const toggle = () => {
  open.value = !open.value
}

const emit = defineEmits(['ok'])
const handleOk = () => {
  open.value = false
  emit('ok', currentLocation)
}

let mapInstance = reactive<any>(null)
let AMap: any
watch(open, async (val) => {
  if (val) {
    await nextTick()
    AMapLoader.load({
      key: '5dba7cd59b2fe68f0d6640fc1f3f7000', // 申请好的Web端开发者Key，首次调用 load 时必填
      version: '2.0', // 指定要加载的 JS API 的版本，缺省时默认为 1.4.15
      plugins: ['AMap.Geocoder'] // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    })
      .then((AM: any) => {
        // 初始化地图
        AMap = AM
        mapInstance = new AMap.Map('map-view', {
          zoom: 10, //设置地图的缩放级别
          viewMode: '2D' //设置地图模式
        })

        mapInstance.setMapStyle('amap://styles/normal')
        if (props.lng && props.lat) {
          creatMarker(props.lng, props.lat)
        }
        mapInstance.on('click', function (ev) {
          //触发事件的地理坐标，AMap.LngLat 类型
          const { lng, lat } = ev.lnglat
          creatMarker(lng, lat)
        })
      })
      .catch((e) => {
        console.log(e)
      })
  }
})

const currentLocation = reactive({
  lng: 0,
  lat: 0,
  address: ''
})
const creatMarker = async (lng: number, lat: number) => {
  mapInstance.clearMap()

  // 创建点标记
  const marker = new AMap.Marker({
    icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
    position: new AMap.LngLat(lng, lat),
    offset: new AMap.Pixel(-10, -30)
  })

  // 创建信息窗口
  const infoWindow = new AMap.InfoWindow({
    offset: new AMap.Pixel(0, -30) // 相对于标记偏移
  })

  // 获取点击位置的地理位置或建筑信息
  const geocoder = new AMap.Geocoder()

  geocoder.getAddress([lng, lat], (status, result) => {
    if (status === 'complete' && result.info === 'OK') {
      const address = result.regeocode.formattedAddress // 获取格式化地址
      const markerContent = `<div style="text-align:center;">位置: ${address}</div>`
      infoWindow.setContent(markerContent) // 设置信息窗口内容
      infoWindow.open(mapInstance, marker.getPosition()) // 打开信息窗口
      currentLocation.lng = lng
      currentLocation.lat = lat
      currentLocation.address = address
    } else {
      console.log('获取位置信息失败', result)
    }
  })

  // 将标记添加到地图上
  mapInstance.add(marker)
}

defineExpose({
  toggle
})
</script>
<style lang="less" scoped>
#map-view {
  width: 100%;
  height: calc(100vh - 150px);
}

.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }
  .ant-modal-body {
    flex: 1;
  }
}
</style>
