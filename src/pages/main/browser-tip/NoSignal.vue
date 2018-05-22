<template>
  <div class="no-signal-wrap" v-show="showNoSignalTip">
    <iframe src="" frameborder="0" class="signal-iframe-bg"></iframe>
    <div class="no-signal-box">
      <img class="no-signal" src="../../../../static/images/no-signal.png" alt="">
      <p>信号迷失，我正在努力呼唤它回家~</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'no-signal',
  data () {
    return {
      // showNoSignalTip: false
    }
  },
  computed: {
    ...mapState({
      showNoSignalTip: state => state.is_network_outage
    })
  }
}
</script>

<style scoped>
</style>
