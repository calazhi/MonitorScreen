<template>
  <div class="item-box item-warning device-info-warning">
    <div v-if="!showSelectGuards">
      <a class="close" href="javascript:;" @click="closeDeviceBox">╳</a>
      <div class="hd">设备故障</div>
      <div class="detail-info-box" v-show="true">
        <div :class="['left-box', {center:eventStatus === 1 || eventStatus === 2 || eventStatus === 3 || eventStatus === 4}]">
          <div class="view">
            <!--<div class="note">视频无画面</div>文字弹层提示-->
            <img :src="imgUrl" alt="" class="pic" v-if="isShowImg">
            <single-screen :videoplayData="videoplayData" :ocxbgColor="ocxbgColor" v-if="!isShowImg && videoplayData.deviceID"></single-screen>
          </div>
          <div class="note" v-show="eventStatus === 99">{{operateResult}}</div>
          <!--推荐保安为空，事件ID不存在，设备位置为空时，派遣按钮均不可点击-->
          <button type="button" class="btn confirm" @click="sendSecurityGuarde()" v-show="eventStatus === 99" :class="{ 'disabled': !recommedSecurity.length || !eventId || eventId === '' || !deviceData.orgName || deviceData.orgName === ''}">派遣人员维修</button>
          <!-- <button type="button" class="btn open" v-show="eventStatus === 3">故障解除</button> -->
        </div>
        <ul class="right-box">
          <li>
            <span class="name"></span>{{deviceData.deviceName}}</li>
          <li>
            <span class="name">位&nbsp;置：</span>{{deviceData.orgName}}</li>
          <li>
            <span class="name">故障时间：</span>{{occurTime}}</li>
          <li>
            <span class="name">状&nbsp;态：</span>
            <!-- <span class="tag">网络异常</span>
            <span class="tag">电源断开</span> -->
            <span class="tag" v-show="eventStatus === 99">待处理</span>
            <span class="tag" v-show="eventStatus === 1">派遣中</span>
            <span class="tag" v-show="eventStatus === 2">处理中</span>
            <span class="tag" v-show="eventStatus === 3">已完成</span>
            <span class="tag" v-show="eventStatus === 4">已解除</span>
          </li>
          <!-- <li class="situation" v-show="eventStatus === 99">
            <span class="name">可能原因：</span><br> 1.检查设备电源是否正常连接；
            <br> 2.检查设备网络是否畅通；
            <br> 3.联系维修人员。
          </li>
          <li class="situation" v-show="eventStatus === 1 || eventStatus === 3">
            <span class="name">处理状态：</span>
            <p v-show="eventStatus === 1"> 已派遣工作人员前去查看现场。</p>
            <span v-show="eventStatus === 3"> 已处理</span>
          </li>
          <li class="situation" v-show="eventStatus === 3">
            <span class="name">处理结果：</span><br> 当前故障维修人员已处理完毕
          </li> -->
          <li>
            <span class="name" v-show="eventStatus === 99">推荐保安：</span>
            <span class="name" v-show="eventStatus === 1 || eventStatus === 2 || eventStatus === 3 || eventStatus === 4">保&nbsp;安：</span>
            <span v-if="eventStatus === 99 && recommedSecurity.length > 0">
              <!-- <span v-for="(item,index) in recommedSecurity" :key="index">{{item.name}} </span> -->
              <span>{{recommedSecurity[0].name}} </span>
            </span>
            <span v-else-if="eventStatus !== 99 && checkedSecurity.length > 0">
              <span v-for="(item,index) in checkedSecurity" :key="index">{{item}} </span>
            </span>
            <span v-else>无</span>
            <a class="icon-send" v-if="recommedSecurity.length > 0" @click="choseDispathGuard " v-show="eventStatus === 99 || eventStatus === 1 || eventStatus === 2" href="javascript:;"></a>
          </li>
          <!-- <li v-if="checkedSecurity.length > 0">
            <span class="name" v-show="eventStatus === 99">推荐保安：</span>
            <span class="name" v-show="eventStatus !== 99">保&nbsp;安：</span>
            <span>
              <span v-for="(item,index) in checkedSecurity" :key="index">{{item.name}} </span>
            </span>
          </li> -->
        </ul>
      </div>
    </div>
    <select-guards v-if="showSelectGuards" @cancleSelectGuards="cancleSelectGuards" :securityList="recommedSecurity" :warnData="eventData"></select-guards>
  </div>
</template>

<script>
import store from '@/pages/main/store'
import controller from '../controller'
// import mutationTypes from '@/pages/main/store/mutation-types'
import { getSecurityDistanceList, hasPatrolSecuritys, patrolSecuritys, queryBrakeDeviceInfo, queryDeviceInfoByCode, getEventInfo } from '@/pages/main/api/gate-device'
import { getCameraInfoData, getCallElevatorData, getelectronFenceData } from '@/pages/main/api/park-warning'
import { getBroadcastdialog } from '@/pages/main/api/broad-cast'
import { getCameraId } from '@/pages/main/api/sign-post'
import { getDeviceByCameraData } from '@/pages/main/api/video-preview.js'
import formatDate from '@/assets/js/utils/format-date.js'
import imgCameraOffline from '../../../../static/images/camera-offline.png'
import lockImg from '../map-viewer/assets/images/u1826.png'
import closeDeviceCard from '@/pages/main/device-info/mixin/close-device-card'
import selectGuards from '../hk-packages/park-warning/src/components/SelectGuards'
export default {
  name: 'device-warn',
  mixins: [closeDeviceCard],
  data () {
    return {
      deviceData: {},
      latitude: '',
      longitude: '',
      userIds: [],
      eventId: '',
      occurTime: undefined, // 事件发生时间
      eventType: '',
      deviceId: '',
      operateResult: '',
      videoplayData: {}, // 视频参数
      isShowImg: false, // 显示默认图片或视频控件
      imgUrl: '', // 图片信息
      eventStatus: 0, // 设备故障事件处理状态：99-未处理；1-派遣中；2-处理中；3-已完成；4：监控大屏解除预警
      ocxbgColor: 2, // 1-红色；2-黄色；3-蓝色
      recommedSecurity: [], // 推荐保安列表
      showSelectGuards: false, // 是否切换到保安列表
      checkedSecurity: [], // 已派遣保安列表
      eventData: {} // 异常事件数据
    }
  },
  props: {
    deviceMsg: {
      require: true
    }
  },
  components: {
    selectGuards
  },
  mounted () {
    // 监听事件状态
    controller.register({
      key: 'device-event-status',
      points: [90010, 100003],
      callback: this.handleMessage
    })
    console.log('mounted DeviceInfoWaring deviceMsg = ' + JSON.stringify(this.deviceMsg))
    // 显示设备异常信息
    this.showExceptionDevice()
  },
  methods: {
    /**
     * 查询设备详情
     */
    queryDeviceInfo () {
      if (this.deviceId !== '') {
        let that = this
        if (this.deviceMsg.markerType === 'control' || this.deviceMsg.markerType === 'gates') { // 门禁、人行道闸
          queryDeviceInfoByCode(this.deviceId).then(res => {
            if (res) {
              that.deviceData = res
              let videoParam = res.videoMediaVo
              that.videoplayData = {}
              if (videoParam) {
                console.log('Brake videoParam=' + JSON.stringify(videoParam))
                that.videoplayData.deviceID = videoParam.deviceId
                that.videoplayData.parentID = videoParam.parentId
                that.videoplayData.mediaIP = videoParam.mediaIP
                that.videoplayData.mediaPort = videoParam.mediaPort
              }
            }
          }).catch(err => {
            console.error('----->查询门禁/人行道闸设备信息异常err' + JSON.stringify(err))
          })
        } else if (this.deviceMsg.markerType === 'brake') { // 车闸
          queryBrakeDeviceInfo(this.deviceId).then(res => {
            if (res) {
              that.deviceData = res
              let videoParam = res.inOutCarVideoVo
              that.videoplayData = {}
              if (videoParam) {
                console.log('Brake videoParam=' + JSON.stringify(videoParam))
                that.videoplayData.deviceID = videoParam.deviceId
                that.videoplayData.parentID = videoParam.parentId
                that.videoplayData.mediaIP = videoParam.mediaIP
                that.videoplayData.mediaPort = videoParam.mediaPort
              }
            }
          }).catch(err => {
            console.error('----->查询车闸设备信息异常err' + JSON.stringify(err))
          })
        } else if (this.deviceMsg.markerType === 'lock') { // 地锁
          this.deviceData.deviceName = this.deviceMsg.markerName
          this.deviceData.orgName = '车位' + this.deviceMsg.partSeatCode
          this.imgUrl = lockImg
          this.isShowImg = true
          console.log('----->地锁设备信息deviceData=' + JSON.stringify(this.deviceData))
        } else if (this.deviceMsg.markerType === 'camera') { // 摄像机
          getCameraInfoData({ 'cameraCode': this.deviceId }).then(res => {
            that.deviceData = res
            that.videoplayData = {
              deviceID: res.deviceID,
              parentID: res.parentID,
              mediaIP: res.mediaIP,
              mediaPort: Number(res.mediaPort)
            }
          }).catch(err => {
            console.error('----->查询摄像机camera设备信息异常err' + JSON.stringify(err))
          })
        } else if (this.deviceMsg.markerType === 'elevator') { // 电梯
          getCallElevatorData({ deviceId: this.deviceId }).then(res => {
            that.deviceData = res
            // OCX四个参数
            if (res.cameras.length > 0) {
              that.videoplayData = {
                deviceID: res.cameras[0].deviceId,
                parentID: res.cameras[0].parentId,
                mediaIP: res.cameras[0].cameraIp,
                mediaPort: Number(res.cameras[0].cameraPort)
              }
            }
          }).catch(err => {
            console.error('----->查询电梯设备信息异常err = ' + JSON.stringify(err))
          })
        } else if (this.deviceMsg.markerType === 'broadcast') { // 广播
          getBroadcastdialog({ deviceId: this.deviceId }).then(res => {
            that.deviceData.deviceName = res.deviceName
            that.deviceData.orgName = res.installAddress
            that.imgUrl = imgCameraOffline
            that.isShowImg = true
          }).catch(err => {
            console.error('----->查询广播broadcast设备信息异常err' + JSON.stringify(err))
          })
        } else if (this.deviceMsg.markerType === 'signpost') { // 电子指路牌
          // 根据设备id和地址id，获取电子指路牌对应的摄像头id
          let signPostId = that.deviceMsg.info.cellid + that.deviceMsg.info.addrid
          getCameraId({ signPostId: signPostId }).then(res => {
            that.deviceData.deviceName = '智能指路牌'
            that.deviceData.orgName = '主出入口'
            if (res[0] && res[0].cameraId) {
              that.loadOcx(res[0].cameraId)
            } else {
              console.warn('[DeviceInfoWarning] 获取电子指路牌摄像头id no cameraId')
            }
          }).catch(err => {
            console.warn('[DeviceInfoWarning] 获取电子指路牌摄像头id /cameraSignPostId/queryForList failed')
            console.warn(err)
          })
        } else if (this.deviceMsg.markerType === 'fence') { // 电子围栏
          getelectronFenceData({ 'deviceCode': this.deviceId }).then(res => {
            that.deviceData = res
            that.videoplayData = {
              deviceID: res.cameras[0].deviceID,
              parentID: res.cameras[0].parentID,
              mediaIP: res.cameras[0].mediaIP,
              mediaPort: res.cameras[0].mediaPort
            }
          }).catch(err => {
            console.error('----->查询电子围栏fence设备信息异常err = ' + JSON.stringify(err))
          })
        }
      } else {
        console.warn('----->设备ID为空，无法获取设备信息')
        this.deviceData.deviceName = this.deviceMsg.markerName
      }
    },
    /**
     * 加载 电子指路牌对应 摄像头的数据 Ocx
     */
    loadOcx: function (cameraId) {
      var that = this
      getDeviceByCameraData({ cameraCode: cameraId }).then(res => {
        that.videoplayData = {
          deviceID: res.deviceID,
          parentID: res.parentID,
          mediaIP: res.mediaIP,
          mediaPort: res.mediaPort
        }
        console.log(that.videoplayData)
      }).catch(err => {
        console.warn('[DeviceInfoWarning] 获取电子指路牌摄像头数据 getDeviceByCameraData failed')
        console.log(err)
      })
    },
    /**
     * 获取推荐保安列表
     */
    getRecommendSecurityGuardes () {
      getSecurityDistanceList({ longitude: this.longitude, latitude: this.latitude }).then(res => {
        console.log('getRecommendSecurityGuardes 查询到推荐保安的个数count =' + res.length)
        if (res && res.length > 0) {
          // res.map(item => {
          //   this.userIds.push(item.userId)
          // })
          this.userIds.push(res[0].userId)
          this.recommedSecurity = res
        } else {
          console.warn('--------->未查询到推荐保安...')
        }
      }).catch(err => {
        console.error('--------->查询推荐保安异常...' + JSON.stringify(err))
      })
    },
    /**
     * 事件是处理中/已完成状态时查询派遣的保安
     */
    getDispatchedSecurityGuards () {
      hasPatrolSecuritys({ eventId: this.eventId }).then(res => {
        console.log('getDispatchedSecurityGuards 查询到已派遣保安个数count =' + res.length)
        this.checkedSecurity = res
      }).catch(err => {
        console.error('--------->查询已派遣的保安异常...' + JSON.stringify(err))
      })
    },
    /**
     * 获取设备故障事件信息
     */
    getEventInfo () {
      let that = this
      getEventInfo(this.deviceId, this.eventType).then(res => {
        console.log('获取到事件信息res = ' + JSON.stringify(res))
        if (res && res.eventHeader) {
          that.eventId = res.eventHeader.eventId
          that.eventStatus = Number(res.eventHeader.eventStatus) // 查询到的事件可能是已派遣处理中的事件
          that.occurTime = formatDate(res.eventHeader.occurTime, 'YYYY-MM-DD hh:mm:ss')
          that.eventData = res
          if (that.eventStatus === 99 || that.eventStatus === 1 || that.eventStatus === 2) { // 事件是未派遣、派遣中、处理中时都获取推荐保安列表
            this.getRecommendSecurityGuardes()
          }
          if (that.eventStatus !== 99) { // 事件是派遣中、处理中、已处理时都查询派遣的保安
            this.getDispatchedSecurityGuards()
            // TODO：过滤推荐保安中已派遣的保安--与后台确认是否已经过滤掉
          }
          if (that.eventStatus === 3 || that.eventStatus === 4) { // 事件是已处理、已解除状态时5s后自动关闭设备故障卡片
            setTimeout(() => {
              this.$nextTick(() => {
                this.closeDialog()
              })
            }, 5000)
          }
        } else {
          console.warn('----->未查询到设备异常事件...')
          that.eventStatus = 99 // 未查询到异常事件时将eventStatus设置为99，否则派遣一些信息展示不出来，影响显示效果
        }
      }).catch(err => {
        console.error('------>查询设备异常事件信息出错...' + JSON.stringify(err))
        that.eventStatus = 99 // 查询事件异常时时将eventStatus设置为99，否则派遣一些信息展示不出来，影响显示效果
      })
    },
    /**
     * 派遣保安
     */
    sendSecurityGuarde () {
      // if (this.userIds.length < 1) { // 点击派遣时，如果人员为空则再次尝试获取推荐保安
      //   this.getRecommendSecurityGuardes()
      //   if (this.userIds.length < 1) { // 再次尝试获取推荐保安仍没有
      //     this.operateResult = '没有可派遣的人员，请稍后重试'
      //     setTimeout(() => {
      //       this.$nextTick(() => {
      //         this.operateResult = ''
      //       })
      //     }, 2000)
      //     return
      //   }
      // }
      if (this.eventId && this.eventId !== '' && this.deviceData.orgName !== '') {
        let that = this
        if (this.deviceMsg.markerType === 'lock') {
          this.eventType = '100003'
        } else {
          this.eventType = '90010'
        }
        patrolSecuritys({
          userIds: this.userIds,
          eventId: this.eventId,
          eventTypeDetail: '设备故障',
          eventType: this.eventType,
          eventAddr: this.deviceData.orgName
        }).then(res => {
          console.log(res)
          this.operateResult = '派遣保安成功'
          setTimeout(() => {
            this.$nextTick(() => {
              this.operateResult = ''
            })
          }, 2000)
        }).catch(err => {
          this.operateResult = '派遣保安失败'
          console.error('--------->派遣保安失败err=' + JSON.stringify(err))
          setTimeout(() => {
            that.$nextTick(() => {
              that.operateResult = ''
            })
          }, 2000)
        })
      } else {
        console.warn('----->推荐人员ID为空或异常事件ID为空,或者派遣地址为空，无法派遣')
        this.operateResult = '派遣保安失败'
        setTimeout(() => {
          this.$nextTick(() => {
            this.operateResult = ''
          })
        }, 2000)
      }
    },
    /**
     * 关闭设备故障卡片
     */
    closeDialog () {
      // store.commit(mutationTypes.SHOW_DEVICE_INFO, { shown: false })
      store.commit('sendMessage', {
        windowName: 'device_info',
        shown: false
      })
    },
    /**
     * 处理派遣维修人员后上报的设备故障事件状态
     */
    handleMessage (info) {
      var infoObj = JSON.parse(info)
      console.log('DeviceInfoWaring handleMessage info.eventHeader.eventId = ' + (infoObj.eventHeader.eventId) + ', info.eventHeader.eventStatus = ' + (infoObj.eventHeader.eventStatus))
      console.log('DeviceInfoWaring handleMessage this.eventId = ' + this.eventId)
      if (info && infoObj.eventHeader && infoObj.eventHeader.eventId === this.eventId) {
        this.eventStatus = Number(infoObj.eventHeader.eventStatus)
      }
    },
    /**
     * 显示异常设备信息
     */
    showExceptionDevice () {
      this.initData()
      if (this.deviceMsg !== '' && this.deviceMsg !== undefined) {
        this.latitude = this.deviceMsg.latitude
        this.longitude = this.deviceMsg.longitude
        if (this.latitude === '' || this.latitude === null) {
          this.latitude = 22.996586
        }
        if (this.longitude === '' || this.longitude === null) {
          this.longitude = 113.704359
        }
        this.deviceId = this.deviceMsg.deviceId
        if (this.deviceMsg.markerType === 'lock') {
          this.eventType = '100003'
        } else {
          this.eventType = '90010'
        }
        // this.getRecommendSecurityGuardes()
        this.queryDeviceInfo()
        this.getEventInfo()
      }
    },
    /**
     * 初始化
     */
    initData: function () {
      this.deviceData = {}
      this.latitude = ''
      this.longitude = ''
      this.userIds = []
      this.eventId = ''
      this.eventType = ''
      this.deviceId = ''
      this.operateResult = ''
      this.videoplayData = {}
      this.isShowImg = false
      this.imgUrl = ''
      this.eventStatus = 0
      this.occurTime = undefined // 事件发生时间
      this.recommedSecurity = [] // 推荐保安列表
      this.showSelectGuards = false // 是否切换到保安列表
      this.checkedSecurity = [] // 已派遣保安列表
      this.eventData = {} // 异常事件数据
    },
    /**
     * 轮播carousel切换
     */
    pageChange (index) {
      // this.setWarnData(index)
    },
    /**
     * 选择派遣人员
     */
    choseDispathGuard () {
      if (!this.recommedSecurity.length) return
      this.showSelectGuards = true // 显示选择派遣保安页面
    },
    /**
     * 取消选择派遣保安
     */
    cancleSelectGuards () {
      this.showSelectGuards = false // 关闭选择派遣保安页面
    }
  },
  watch: {
    deviceMsg: function (val, oldVal) {
      console.log('watch DeviceInfoWaring deviceMsg = ' + JSON.stringify(this.deviceMsg))
      this.showExceptionDevice()
    },
    eventStatus (eventStatus) {
      if (eventStatus === 3 || eventStatus === 4) {
        console.log('watch DeviceInfoWaring eventStatus = ' + JSON.stringify(this.eventStatus) + ', 自动关闭异常窗口')
        // this.closeDeviceBox()
      }
    }
  }
}
</script>

<style scoped>

</style>
