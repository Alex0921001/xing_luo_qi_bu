<template>
  <a-config-provider :locale="zhCN">
    <router-view #="{ Component }">
      <component :is="Component" />
    </router-view>
  </a-config-provider>
</template>
<script>
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('en')
export default {
  data() {
    return {
      zhCN
    }
  }
}
</script>
