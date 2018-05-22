<template>
<div>
  <browser-guide></browser-guide>
  <no-signal></no-signal>
  <clear-all-tips></clear-all-tips>
</div>
</template>

<script>
import browserGuide from './browser-guide'
import NoSignal from './NoSignal.vue'
import ClearAllTips from './ClearAllTips.vue'
// import { mapState } from 'vuex'
export default {
  name: 'browser-tip',
  components: {
    browserGuide,
    NoSignal,
    ClearAllTips
  },
  data () {
    return {
    }
  },
  computed: {
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style>

</style>
