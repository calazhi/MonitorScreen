<template>
  <div>
    <div class="hd">值班人员</div>
    <div class="bd">
      <div class="list-box-wrap">
        <carousel height="12.7rem" ref="carousel" @change="pageChange">
          <carousel-item v-for="i in Math.ceil(list.length/size)" :key="'item-'+i">
            <div class="list-box">
              <div class="list-guard-box">
                <div class="list-guard" v-for="j in size" :key="i+'-'+j" v-if="(i-1)*size+j<=list.length" :class="{'fade-in':animation.step01,'offline':list[(i-1)*size+j-1].isOnLine !== 1}">
                  <div class="view" @click="fnInfo(list[(i-1)*size+j-1])">
                    <a href="javascript:;">
                      <img :src="list[(i-1)*size+j-1].facePic || errorImg" alt="" class="pic" :onerror="defaultImg">
                    </a>
                    <p class="txt">
                      <span class="name" :title="list[(i-1)*size+j-1].name">{{list[(i-1)*size+j-1].name}}</span>
                    </p>
                    <p class="task number" v-if="list[(i-1)*size+j-1].taskNum>0" :class="{'flip':animation.step03&&addTaskId===list[(i-1)*size+j-1].userId}">{{list[(i-1)*size+j-1].taskNum}}</p>
                    <p class="add-task" v-if="animation.step02&&addTaskId===list[(i-1)*size+j-1].userId" :class="{'fade-top':animation.step02&&addTaskId===list[(i-1)*size+j-1].userId}">{{addTaskTip}}</p>
                  </div>
                  <button type="button" class="send-btn" @click="fnAssign(list[(i-1)*size+j-1])">{{list[(i-1)*size+j-1].isOnLine !== 1?'离 线':'派 遣'}}</button>
                </div>
              </div>
            </div>
          </carousel-item>
        </carousel>
      </div>
    </div>
    <div class="news-note" v-show="false"><span class="icon-tips"></span>摄像头 002 故障已修复，请小心使用！</div>
  </div>
</template>
<script>
import { getSecurityLists } from '../../api/security-manage.js'
import controller from '@/pages/main/controller.js'

export default {
  name: 'security-list',
  data () {
    return {
      errorImg: require('../../../../../static/images/people.png'),
      defaultImg: 'this.src="' + require('../../../../../static/images/people.png') + '"',
      list: [],
      size: 12,
      curIndex: 0,
      message: [],
      timeHandle: null,
      addTaskId: '',
      addTaskTip: '',
      animation: {
        step01: false,
        step02: false,
        step03: false,
      }
    }
  },
  mounted () {
    this.fnGetSecurityLists()
    controller.register({
      key: 'securityList',
      points: [70022, 70023],
      callback: (info, data) => {
        this.handleMessage(info, data)
      }
    })
    window.setInterval(() => { // 轮询更新一次保安状态
      this.getOffLineState()
    }, 5000)
    // this.$nextTick(() => {
    //   this.fnAnimation({ userId: 'da3aeb1e1e1a4ae184a082b681a73752' })
    // })
  },
  methods: {
    fnAssign (item) {
      if (item.isOnLine === 0) return
      this.$emit('switch', 'assign', item)
    },
    fnInfo (item) {
      this.$store.commit('sendMessage', {
        windowName: 'member_info',
        shown: true,
        data: {
          markerType: 'guarder',
          id: item.userId
        }
      })
    },
    fnGetSecurityLists () {
      getSecurityLists().then(result => {
        this.list = result
        this.$nextTick(() => {
          window.clearTimeout(this.timeHandle)
          this.timeHandle = null
          if (this.message.length > 0) {
            this.updateStatus()
          }
        })
      }).catch(() => {
        window.clearTimeout(this.timeHandle)
        this.timeHandle = null
        if (this.message.length > 0) {
          this.updateStatus()
        }
      })
    },
    handleMessage (info, data) {
      switch (parseInt(data.type)) {
        case 70022:
          this.message.push(info)
          this.updateStatus()
          break
        case 70023:
          break
      }
    },
    updateStatus () {
      if (!this.timeHandle) {
        this.timeHandle = window.setTimeout(() => {
          this.message = []
          this.fnGetSecurityLists()
        }, 100)
      }
    },
    pageChange (index) {
      this.curIndex = index
    },
    getOffLineState () {
      getSecurityLists().then(result => {
        this.list = result
      }).catch(() => {
      })
    },
    fnAnimation (data) {
      this.animation.step01 = true
      this.addTaskId = data.userId
      this.addTaskTip = '新任务+1'
      window.setTimeout(() => {
        this.animation.step02 = true
        this.animation.step03 = true
        window.setTimeout(() => {
          this.animation.step01 = false
          this.animation.step02 = false
          this.animation.step03 = false
          this.list.filter(item => item.userId === data.userId)[0].taskNum = 10
        }, 1000)
      }, 1000)
    }
  }
}
</script>

<style scoped>

</style>
