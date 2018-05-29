<template>
  <div>
    <div class="patrol-report-box" v-show="true">
      <div class="ico-btn-group">
        <!--<a class="ico turn-off" @click="confirmBox"></a>-->
        <a class="ico exit-full" @click="handleClose"></a>
      </div>

      <div class="hd">巡更报事</div>
      <div class="detail-info-box" v-if="!isShowDone">
        <div class="left-box">
          <div class="view">
            <img v-if='imgPlayShow' :src="warnData.eventBody.scenePic[0]" class="pic" :onerror="errorTip">
            <video @click="playVideo" v-if='!imgPlayShow' :src="warnData.eventBody.sceneVideo" width="100%" height="100%" type="video/ogg" aria-label="Close" class="video-play"></video>
          </div>
        </div>
        <div class="right-box">
          <ul>
            <!--<li class="accident">
              <div :native="false" :style="getHeightStyle(60)" viewClass="abnormal-event" :noresize="false" class="img-scrollbox">
                <div>
                  <span class="name">事&nbsp;件：</span>
                  {{warnData.eventBody.eventContent}}
                </div>
              </div>
            </li>-->
            <li class="first-li-normal">
              <!--<p><span class="name">事&nbsp;件：</span>{{warnData.eventBody.eventContent}}</p>-->
              <div :native="false" :style="getHeightStyle(60)" viewClass="abnormal-event" :noresize="false" class="img-scrollbox">
                <div>
                  <span class="name">事&nbsp;件：</span>
                  {{warnData.eventBody.eventContent}}
                </div>
              </div>
              <p><span class="name">时&nbsp;间：</span><span class="number">{{formatDate(warnData.eventHeader.occurTime,'YYYY-MM-DD hh:mm:ss')}}</span></p>
              <p><span class="name">地&nbsp;点：</span>{{warnData.eventBody.address}}</p>
            </li>
            <li>
              <p><span class="name">状&nbsp;态：</span>{{eventStatus}}</p>
            </li>
            <li v-if="!checkedInfo.checkedSecurity.length">
              <span class="name" v-show="!dealWarnInfo">推荐保安：</span>
              <span class="name" v-show="dealWarnInfo">保&nbsp;安：</span>
              <span v-if="checkedInfo.recommedSecurity.length">{{checkedInfo.recommedSecurity[0].name}}</span>
              <span v-else>无</span>
              <a class="icon-send " v-if="checkedInfo.recommedSecurity.length" @click="choseDispathGuard" v-show="!dealWarnInfo" href="javascript:;"></a>
            </li>
            <li v-if="checkedInfo.checkedSecurity.length>0">
              <span class="name" v-show="!dealWarnInfo">推荐保安：</span>
              <span class="name" v-show="dealWarnInfo">保&nbsp;安：</span>
              <span>
              <span v-for="(item,index) in checkedInfo.checkedSecurity" :key="index">{{item}} </span>
            </span>
            </li>
          </ul>
          <div class="btn-box">
            <button type="button" class="btn cancel" @click="openForcibleDismissPop">解除警报</button>
            <button type="button" class="btn confirm" @click="dispatchGuard" :class="{ 'disabled': !checkedInfo.recommedSecurity.length}">派遣保安</button>
            <!--<button type="button" class="btn confirm" @click="dispatchGuard" v-show="!dealWarnInfo">派遣保安</button>-->
            <!--<button type="button" class="btn doing" v-show="dealWarnInfo">处 理 中</button>-->
          </div>
        </div>
      </div>
      <!--解除警报-->
      <div class="detail-info-box" v-else-if="checkedInfo.imgInit">
        <div class="left-box">
          <div class="view">
            <img :src="checkedInfo.doneData&&checkedInfo.doneData.finishPicArr&&checkedInfo.doneData.finishPicArr.length&&checkedInfo.doneData.finishPicArr[0]" alt="" class="pic" :onerror="errorTip">
          </div>
          <button type="button" class="btn confirm" @click="dismissWarn">解除警报</button>
        </div>
        <ul class="right-box">
          <li class="first-li-normal">
            <span class="name">状&nbsp;态：</span>处理完成</li>
          <li>
            <span class="name">保&nbsp;安：</span>
            <span class="people" v-if="checkedInfo.doneData&&!checkedInfo.doneData.assistPerson">{{checkedInfo.doneData.joinPerson}}</span>
            <span class="people" v-else>{{checkedInfo.doneData&&checkedInfo.doneData.joinPerson}},{{checkedInfo.doneData&&checkedInfo.doneData.assistPerson}}</span>
          </li>
          <li class="result">
            <span class="name">处理结果：</span>{{checkedInfo.doneData&&checkedInfo.doneData.handleDetail}}</li>
        </ul>
      </div>

    <!--解除该窗口全部预警的弹窗  ### 先注释保留改功能 ###-->
      <!--<div class="clear-confirm-box" v-show="isConfirm">-->
      <!--<iframe frameborder="0 " class="iframe-box "></iframe>-->
        <!--<div class="bg"></div>-->
        <!--<div class="con">-->
          <!--<p class="title">确定要解除该窗口的所有报警吗？</p>-->
          <!--<div class="btn-box">-->
            <!--<button type="button" class="btn cancel" @click="cancleDismiss">取 消</button>-->
            <!--<button type="button" class="btn confirm" @click="mulDismissWarn">解 除</button>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->

      <!--强制解除该窗口预警的弹窗-->
      <div class="clear-confirm-box " v-show="showForcibleDismissPop">
        <iframe frameborder="0 " class="iframe-box "></iframe>
        <div class="bg "></div>
        <div class="con ">
          <p class="title ">确定要解除该报警吗？</p>
          <div class="btn-box ">
            <button type="button" class="btn cancel " @click="closeForcibleDismissPop">取 消</button>
            <button type="button" class="btn confirm " @click="forceDismissWarn">解 除</button>
          </div>
        </div>
      </div>

    </div>
    <div class="note-wrap" v-show="toast.show">
      <iframe frameborder="0" class="iframe-box"></iframe>
      <transition name="fade" mode="out-in">
        <div class="note-pop">{{toast.msg}}</div>
      </transition>
    </div>
  </div>
</template>

<script>
import PerfectScrollbar from 'perfect-scrollbar'
import 'perfect-scrollbar/css/perfect-scrollbar.css'
import { patrolSecuritys } from '@/pages/main/api/park-warning'
import formatDate from '@/assets/js/utils/format-date.js'
export default {
  props: {
    warnData: Object,
    checkedInfo: Object,
    ocxbgColor: Number,
    errorImg: String,
    defaultImg: String
  },
  components: {
  },
  data () {
    return {
      dealWarnInfo: false,
      isConfirm: false,
      isShowDone: false,
      imgPlayShow: false,
      clearDom: null,
      patrolScrollbar: null,
      toast: {
        show: false,
        msg: ''
      },
      isDispatch: true,
      videoPlayDom: null,
      errorTip: 'this.src="' + require('../../../../../../static/images/failure-warning.png') + '"',
      showForcibleDismissPop: false, // 是否显示解除该预警的弹窗showForcibleDismissPop
    }
  },
  computed: {
    // 预警事件的当前处理状态
    eventStatus () {
      switch (this.warnData.eventHeader.eventStatus) {
        case '1':
          return '派遣中'
        case '2':
          return '处理中'
        case '3':
          return '已完成'
        case '4':
          return '已解除'
        case '98':
          return '手动解除'
        case '99':
          return '待处理'
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (!this.isShowDone) {
        this.gainPicAndvideo()
        this.$nextTick(() => {
          this.patrolScrollbar = new PerfectScrollbar(this.$el.querySelector('.img-scrollbox'))
          this.$el.querySelector('.img-scrollbox').scrollTop = 0
          this.patrolScrollbar.update()
          if (this.warnData.eventBody.sceneVideo) {
            this.videoPlayDom = this.$el.querySelector('.video-play')
          }
        })
      }
      this.clearDom = this.$el.querySelector('.clear-confirm-box')
      this.$parent.$parent.$el.appendChild(this.clearDom)
    })
  },
  methods: {
    formatDate,
    popError (msg) {
      this.toast = {
        show: true,
        msg: msg
      }
      setTimeout(() => {
        this.toast.show = false
      }, 1000)
    },
    /*
     * 关闭预警窗口
    */
    handleClose () {
      this.$emit('closeWarnEvent')
    },
    /*
    * 预警窗口隐藏时关闭MP4视频
   */
    isVideoPlay () {
      if (this.videoPlayDom && this.warnData.eventBody.sceneVideo) {
        this.videoPlayDom.pause()
      }
    },
    /*
   * 预警窗口显示时打开MP4视频
  */
    isContinuePlay () {
      if (this.videoPlayDom && this.warnData.eventBody.sceneVideo) {
        this.videoPlayDom.play()
      }
    },
    // 选择派遣人员
    choseDispathGuard () {
      if (!this.checkedInfo.recommedSecurity.length) return
      this.$emit('choseDispathGuard') // 显示选择派遣保安页面
    },
    // 派遣保安
    dispatchGuard () {
      // 选择派遣保安页面派遣后
      let userIds = []
      userIds = [this.checkedInfo.recommedSecurity[0].userId]
      if (this.isDispatch) {
        this.isDispatch = false
        patrolSecuritys({
          userIds: userIds,
          eventId: this.warnData.eventHeader.eventId,
          picUrl: this.warnData.eventBody.scenePic && this.warnData.eventBody.scenePic instanceof Array ? this.warnData.eventBody.scenePic.join(',') : '',
          eventType: this.warnData.eventHeader.eventType,
          eventAddr: this.warnData.eventBody.address,
          videoUrl: this.warnData.eventBody.sceneVideo || '',
          eventTypeDetail: this.warnData.eventBody.eventContent
        }).then(res => {
          this.isDispatch = true
          console.log(res)
        }, rs => {
          this.isDispatch = true
          if ('message' in rs) {
            this.popError(rs.message)
          } else {
            this.popError(rs)
          }
        }).catch(err => {
          console.log(err)
          this.isDispatch = true
        })
      }
    },
    // 弹出确认框
    confirmBox () {
      this.isConfirm = true
    },
    // 取消批量解除
    cancleDismiss () {
      this.isConfirm = false
    },
    // 批量解除处理已完成预警
    mulDismissWarn () {
      this.$emit('mulDismissWarn')
    },
    // 解除单条警报
    dismissWarn () {
      this.$emit('mulDismissWarn', {eventId: this.warnData.eventHeader.eventId, forcible: false})
    },
    // 强制解除当前预警
    forceDismissWarn () {
      console.log('强制解除当前预警')
      this.$emit('mulDismissWarn', {eventId: this.warnData.eventHeader.eventId, forcible: true})
    },
    // 内容滚动条
    getHeightStyle (h = 0) {
      return { height: (this.mainContainHeight - h) + 'px' }
    },
    // 初始化页面数据
    init () {
      if (this.warnData.eventHeader.eventStatus === '99') {
        this.dealWarnInfo = false
        this.isShowDone = false
      } else {
        if (this.warnData.eventHeader.eventStatus === '1') { // 事件已派遣保安
          this.dealWarnInfo = true
          this.isShowDone = false
        }
        if (this.warnData.eventHeader.eventStatus === '3') { // 事件已完成
          this.isShowDone = true
          this.dealWarnInfo = false
        }
      }
    },
    // 判断图片 和 視頻
    gainPicAndvideo () {
      if (this.warnData.eventBody.scenePic instanceof Array && this.warnData.eventBody.scenePic.length > 0 && this.warnData.eventBody.sceneVideo === undefined) {
        this.imgPlayShow = true
      } else if (this.warnData.eventBody.sceneVideo) {
        this.imgPlayShow = false
      }
      if (this.warnData.eventBody.sceneVideo === undefined && this.warnData.eventBody.scenePic.length === 0) {
        this.imgPlayShow = true
      }
    },
    // 打开强制解除当前预警的弹窗
    openForcibleDismissPop () {
      this.showForcibleDismissPop = true
    },
    // 关闭强制解除弹窗
    closeForcibleDismissPop () {
      this.showForcibleDismissPop = false
    },
    // todo 缺一个播放图标
    playVideo () {
      if (this.videoPlayDom.paused) {
        this.videoPlayDom.play()
      } else {
        this.videoPlayDom.pause()
      }
    }
  },
  watch: {
    warnData (warnData) {
      this.$nextTick(() => {
        // this.isImgError = false
        this.isDispatch = true
        this.imgPlayShow = true
        this.patrolScrollbar = null
        this.init()
        if (warnData.eventHeader.eventStatus !== '3') {
          this.gainPicAndvideo()
          this.$nextTick(() => {
            this.patrolScrollbar = new PerfectScrollbar(this.$el.querySelector('.img-scrollbox'))
            this.$el.querySelector('.img-scrollbox').scrollTop = 0
            this.patrolScrollbar.update()
            if (warnData.eventBody.sceneVideo) {
              this.videoPlayDom = this.$el.querySelector('.video-play')
            }
            // if (this.videoPlayDom && warnData.eventBody.sceneVideo) {
            //   this.videoPlayDom.play()
            // } else if (this.videoPlayDom && !warnData.eventBody.sceneVideo) {
            //   this.videoPlayDom.pause()
            // }
          })
        }
      })
    }
  },
  beforeDestroy () {
    this.clearDom.parentNode.removeChild(this.clearDom)
    this.clearDom = null
    if (this.warnData.eventBody.sceneVideo && this.videoPlayDom) {
      this.videoPlayDom.pause()
    }
  }
}
</script>

<style scoped>
.img-scrollbox {
  /* width: 100%; */
  height: 100%;
  margin-right: 6px\0;
  position: relative;
  margin-right: -12px;
  padding-right: 7px;
}
.right-box .accident .name .img-scrollbox .ps__rail-y {
  width: 0 !important;
}
</style>
