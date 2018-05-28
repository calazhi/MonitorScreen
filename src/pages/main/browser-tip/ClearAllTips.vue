<template>
  <div class="clear-all-wrap" @showCleanWarn="openClearWarnTip" v-show="showClearWarnTip">
    <iframe src="" frameborder="0" class="event-iframe-bg"></iframe>
    <div class="clear-all-box">
      <p>确定要解除所有事件吗？</p>
      <div class="btn-box ">
        <button type="button" class="btn cancel" @click="closeClearWarnTip">取 消</button>
        <button type="button" class="btn confirm" @click="clearAllWarn">解 除</button>
      </div>
    </div>
  </div>
</template>

<script>
import { deleteWarningEvent, deteleCruiseEvent } from '@/pages/main/api/delete-event'
export default {
  name: 'clear-all-tips',
  data () {
    return {
      showClearWarnTip: false
    }
  },
  computed: {
  },
  mounted () {
    this.$root.Bus.$on('showCleanWarn', () => {
      this.openClearWarnTip()
    })
  },
  methods: {
    // 打开弹窗
    openClearWarnTip: function () {
      console.log('emit触发打开清除故障弹窗')
      this.showClearWarnTip = true
    },
    // 关闭弹窗
    closeClearWarnTip: function () {
      this.showClearWarnTip = false
    },
    // 解除预警
    clearAllWarn: function () {
      console.log('解除所有事件')
      // 清除预警事件
      deleteWarningEvent().then(res => {
        // console.log('清除预警事件res', res)
      })
      // 清除巡更事件
      deteleCruiseEvent().then(res => {
        // console.log('清除巡更事件res', res)
      })
      this.showClearWarnTip = false
    }
  }
}
</script>

<style scoped>
</style>
