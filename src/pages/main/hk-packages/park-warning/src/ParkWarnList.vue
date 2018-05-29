<template>
  <div>
    <div class="ico-btn-group">
      <!--<a class="ico turn-off" @click="confirmBox"></a>-->
      <a class="ico exit-full" @click="handleClose"></a>
    </div>

    <div class="hd">{{warnData.eventBody.eventDescription}}</div>
    <div class="detail-info-box" v-if="!isShowDone">
      <div class="left-box">
        <!-- 调单路视频组件 -->
        <div class="view-box">
          <div class="view iframe-view" v-show="showCapture">
            <iframe frameborder="0 " class="iframe-box "></iframe>
            <img :src="warnData.eventBody.scenePic&&warnData.eventBody.scenePic[0] || errorImg" :onerror="defaultImg" alt=" " class="pic ">
          </div>
          <div class="view">
            <single-screen :videoplayData="videoplayData" :ocxbgColor="ocxbgColor"></single-screen>
          </div>
        </div>
        <div class="tabs-box">
          <div class="tabs-btn-wrap">
            <button class="tabs-btn" :class="{active: showCapture}" @click="toggleToCapture"><span class="icon-snapshot"></span>抓拍</button>
          </div>
          <div class="tabs-btn-wrap">
            <button class="tabs-btn" :class="{active: !showCapture}" @click="toggleToVideo"><span class="icon-video"></span>实时监控</button>
          </div>
        </div>
      </div>

      <div class="right-box">
        <ul>
          <!--<li class="pic-box"><img :src="warnData.eventBody.scenePic&&warnData.eventBody.scenePic[0] || errorImg" :onerror="defaultImg" alt=" " class="pic "></li>-->
          <li class="first-li-normal">
            <p><span class="name">事&nbsp;件：</span>{{warnData.eventBody.eventContent}}</p>
            <p><span class="name">时&nbsp;间：</span><span class="number">{{formatDate(warnData.eventHeader.occurTime,'YYYY-MM-DD hh:mm:ss')}}</span></p>
            <p><span class="name">地&nbsp;点：</span>{{warnData.eventBody.address}}</p>
          </li>
          <li>
            <p><span class="name">状&nbsp;态：</span>{{eventStatus}}</p>
          </li>
          <!--无保安可派遣时-->
          <li v-if="!checkedInfo.checkedSecurity.length">
            <span class="name" v-show="!dealWarnInfo">推荐保安：</span>
            <span class="name" v-show="dealWarnInfo">保&nbsp;安：</span>
            <span v-if="checkedInfo.recommedSecurity.length">{{checkedInfo.recommedSecurity[0].name}} {{ (warnData.eventHeader.eventType==='25020' || warnData.eventHeader.eventType==='25019'||warnData.eventHeader.eventType==='91001') && checkedInfo.recommedSecurity[1] && checkedInfo.recommedSecurity[1].name || ''}}</span>
            <span v-else>无</span>
            <a class="icon-send" v-if="checkedInfo.recommedSecurity.length" @click="choseDispathGuard " v-show="!dealWarnInfo" href="javascript:;"></a>
          </li>
          <!--有保安可派遣时-->
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
          <!--<button type="button" class="btn confirm" @click="dispatchGuard" v-show="!dealWarnInfo" :class="{ 'disabled': !checkedInfo.recommedSecurity.length}">派遣保安</button>-->
          <!--派遣添加类.doing-->
          <!--<button type="button" class="btn doing disabled" v-show="dealWarnInfo">处 理 中</button>-->
        </div>
      </div>
    </div>

    <!--解除警报 处理完成时的状态-->
    <div class="detail-info-box" v-else-if="checkedInfo.imgInit">
      <div class="left-box">
        <div class="view">
          <img :src="checkedInfo.doneData&&checkedInfo.doneData.finishPicArr&&checkedInfo.doneData.finishPicArr.length&&checkedInfo.doneData.finishPicArr[0]" :onerror="errorTip" alt="" class="pic">
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
        <li class="result ">
          <span class="name ">处理结果：</span>{{checkedInfo.doneData&&checkedInfo.doneData.handleDetail}}</li>
      </ul>
    </div>

    <!--解除该窗口全部预警的弹窗  ### 先注释保留改功能 ###-->
    <!--<div class="clear-confirm-box " v-show="isConfirm ">-->
      <!--<iframe frameborder="0 " class="iframe-box "></iframe>-->
      <!--<div class="bg "></div>-->
      <!--<div class="con ">-->
        <!--<p class="title ">确定要解除该窗口的所有报警吗？</p>-->
        <!--<div class="btn-box ">-->
          <!--<button type="button " class="btn cancel " @click="cancleDismiss ">取 消</button>-->
          <!--<button type="button " class="btn confirm " @click="mulDismissWarn ">解 除</button>-->
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

    <div class="note-wrap" v-show="toast.show">
      <iframe frameborder="0" class="iframe-box"></iframe>
      <transition name="fade" mode="out-in">
        <div class="note-pop">{{toast.msg}}</div>
      </transition>
    </div>

    <div class="news-note" v-if="false"><span class="icon-warning"></span>派遣失败，请重新派遣其他保安！</div>
    <div class="news-note" v-if="false"><span class="icon-news"></span>收到1条新的预警 - 越界预警！</div>
  </div>
</template>
<script>
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
  data () {
    return {
      dealWarnInfo: false,
      isConfirm: false,
      isShowDone: false,
      videoplayData: {
        deviceID: this.warnData.eventBody.deviceId,
        parentID: this.warnData.eventBody.parentID,
        mediaIP: this.warnData.eventBody.mediaIp,
        mediaPort: Number(this.warnData.eventBody.mediaPort)
      },
      clearDom: null,
      toast: {
        show: false,
        msg: ''
      },
      isDispatch: true,
      errorTip: 'this.src="' + require('../../../../../../static/images/failure-warning.png') + '"',
      showForcibleDismissPop: false, // 是否显示解除该预警的弹窗showForcibleDismissPop
      showCapture: false // 是否显示抓拍图片
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
    /**
    * @description 预警弹窗关闭
    */
    handleClose () {
      this.$emit('closeWarnEvent')
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
      // 落水越界预警系统推荐派遣两名保安
      if (this.warnData.eventHeader.eventType === '25020' || this.warnData.eventHeader.eventType === '25019' || this.warnData.eventHeader.eventType === '91001') {
        userIds = [this.checkedInfo.recommedSecurity[0].userId, this.checkedInfo.recommedSecurity[1] ? this.checkedInfo.recommedSecurity[1].userId : '']
      } else {
        userIds = [this.checkedInfo.recommedSecurity[0].userId]
      }
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
          this.isDispatch = true
          console.log(err)
        })
      }
    },
    // 弹出确认框(批量解除的弹窗)
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
    // 初始化页面数据
    init () {
      let eventStatus = this.warnData.eventHeader.eventStatus // 当前事件状态
      if (eventStatus === '99') { // 未派遣
        this.dealWarnInfo = false
        this.isShowDone = false
      } else {
        if (eventStatus === '1') { // 事件已派遣保安
          this.dealWarnInfo = true
          this.isShowDone = false
        }
        if (eventStatus === '3') { // 事件已完成
          this.isShowDone = true
          this.dealWarnInfo = false
        }
      }
    },
    // 强制解除当前预警
    // forceDeleteWarn () {
    //   forceDeleteWarning({eventId: this.warnData.eventHeader.eventId}).then(res => {
    //     console.log('解除预警成功', res)
    //     this.closeDismissPop()
    //   }).catch(err => {
    //     // this.closeDismissPop()
    //     console.log(err)
    //   })
    // },
    // 打开强制解除当前预警的弹窗
    openForcibleDismissPop () {
      this.showForcibleDismissPop = true
    },
    // 关闭强制解除弹窗
    closeForcibleDismissPop () {
      this.showForcibleDismissPop = false
    },
    // 切换显示抓拍图
    toggleToCapture () {
      this.showCapture = true
    },
    // 切换显示实时监控
    toggleToVideo () {
      this.showCapture = false
    }
  },
  watch: {
    warnData (warnData) {
      this.videoplayData = {
        deviceID: warnData.eventBody.deviceId,
        parentID: warnData.eventBody.parentID,
        mediaIP: warnData.eventBody.mediaIp,
        mediaPort: Number(warnData.eventBody.mediaPort)
      }
      this.init()
      this.isDispatch = true
    }
  },
  beforeDestroy () {
    this.clearDom.parentNode.removeChild(this.clearDom)
    this.clearDom = null
  }
}
</script>

<style scoped>
</style>
