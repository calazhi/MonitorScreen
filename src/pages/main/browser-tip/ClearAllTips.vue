<template>
  <div class="clear-all-wrap" v-show="false">
    <iframe src="" frameborder="0" class="event-iframe-bg"></iframe>
    <div class="clear-all-box">
      <p>确定要解除所有事件吗？</p>
      <div class="btn-box ">
        <button type="button" class="btn cancel">取 消</button>
        <button type="button" class="btn confirm">解 除</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'clear-all-tips',
  data () {
    return {
      // showNoSignalTip: false
    }
  },
  computed: {
  }
}
</script>

<style scoped>
</style>
