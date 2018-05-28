<template>
  <div class="item-box people-box">
    <div class="hd">人员信息</div>
    <!--人员信息-->
    <a class="close" href="javascript:void(0);" @click="closeDevice">╳</a>
    <div class="detail-info-box" v-show="isInit">
      <div class="left-box center">
        <div class="view">
          <img :src="imgSrc || errorImg" alt="" class="pic" :onerror="defaultImg">
        </div>
      </div>
      <!-- 保安信息 -->
      <ul class="right-box" v-if='securityShowInfo === "guarder"'>
        <li class="first-li"><span class="name">保安-</span>{{revealData.name}}</li>
        <li class="second-li">
          <p><span class="name">电&nbsp;话：</span><span class="number">{{revealDatas[0]}}&nbsp;{{revealDatas[1]}}&nbsp;{{revealDatas[2]}}</span></p>
          <p><span class="name">入职时间：</span><span class="number">{{revealData.hiredate}}</span></p>
          <p><span class="name">巡更设备：</span>{{revealData.deviceName}}</p>
          <p><span class="name">当前任务：</span><span class="number">{{revealData.taskNum || 0}}</span>个</p>
          <p><span class="name">完成任务：</span><span class="number">{{revealData.finishedNum || 0}}</span>个</p>
        </li>
      </ul>
      <!-- 事件派遣保安后，点击保安名字弹出信息 -->
      <ul class="right-box" v-show="false">
        <li class="first-li"><span class="name">保安-</span>{{revealData.name}}</li>
        <li><span class="name">电&nbsp;话：</span><span class="number">{{revealDatas[0]}}&nbsp;{{revealDatas[1]}}&nbsp;{{revealDatas[2]}}</span></li>
        <li><span class="name">当前位置：</span><span class="number">1</span>号岗</li>
        <li class="today-task">
          <span class="name">今日任务：</span>
          <ul>
            <li>
              <span class="state ">未处理</span>
              <span  class="time">20:00:23</span>
              <span class="con">设备故障</span>
            </li>
            <li>
              <span class="state doing">处理中</span>
              <span  class="time">20:00:23</span>
              <span class="con">设备故障</span>
            </li>
            <li>
              <span class="state done">已完成</span>
              <span  class="time">20:00:23</span>
              <span class="con">设备故障</span>
            </li>
          </ul>
        </li>
      </ul>
      <!-- 业主信息 -->
      <ul class="right-box" v-if='securityShowInfo === "households"'>
        <li class="first-li"><span class="name">住户-</span>{{revealData.name}}</li>
        <li class="second-li">
          <p><span class="name">电&nbsp;话：</span><span class="number">{{revealDatas[0]}}&nbsp;{{revealDatas[1]}}&nbsp;{{revealDatas[2]}}</span></p>
          <p><span class="name">住&nbsp;址：</span>{{revealData.ownerAddress}}</p>
          <p><span class="name">登记时间：</span><span class="number">{{revealData.registerTime}}</span></p>
          <p>
            <span class="name">车牌号：</span>
            <span v-if="!revealData.carInfoDtoList">无</span>
            <span class="car number" v-for="(item,index) in revealData.carInfoDtoList" :key="index" v-else>{{item.carNum+'('+(item.carportType || '无')+')'}}</span>
          </p>
          <!--  {{revealData.carPlate || '无'}} -->
          <p><span class="name">人员类型：</span>{{revealData.humanType}}</p>
        </li>
      </ul>
      <!-- 访客信息 -->
      <ul class="right-box" v-if='securityShowInfo === "visitor"'>
        <li class="first-li"><span class="name ">访客-</span>{{revealData.name || '无'}}</li>
        <li class="second-li">
          <p><span class="name">电&nbsp;话：</span><span class="number">{{revealDatas[0]}}&nbsp;{{revealDatas[1]}}&nbsp;{{revealDatas[2]}}</span></p>
          <p><span class="name">来访地点：</span>{{revealData.visitorResourceName || '无'}}</p>
          <p><span class="name">最近来访：</span><span class="number">{{revealData.recentAccessTime || '无'}}</span></p>
          <p><span class="name">来访次数：</span>{{revealData.accessNum || 1}}次</p>
          <p><span class="name">车牌号：</span><span class="number">{{revealData.carPlate || '无'}}</span></p>
        </li>
      </ul>
      <!-- 重点人员 -->
      <ul class="right-box" v-if='securityShowInfo === "danger"'>
        <li class="first-li"><span class="name">重点人员-</span> {{revealData.name}}</li>
        <li class="second-li">
          <p><span class="name">电&nbsp;话：</span><span class="number">{{revealDatas[0]}}&nbsp;{{revealDatas[1]}}&nbsp;{{revealDatas[2]}}</span></p>
          <p><span class="name">入园时间：</span><span class="number">{{revealData.recentAccessTime}}</span></p>
          <p><span class="name">入园位置：</span>{{info.resourceName}}</p>
          <p><span class="name">来访次数：</span><span class="number">{{revealData.accessNum||1}}</span>次</p>
          <p><span class="name">类&nbsp;型：</span>{{revealData.focusOnPersonnel}}</p>
        </li>
      </ul>
      <!-- 未登记信息 -->
      <ul class="right-box" v-if='securityShowInfo === "stranger"'>
        <li class="first-li"><span class="name">未登记</span></li>
        <li class="second-li">
          <p><span class="name">电&nbsp;话：</span>无</p>
          <p><span class="name">入园时间：</span><span class="number">{{revealData.recentAccessTime}}</span></p>
          <p><span class="name">入园位置：</span>{{revealData.resourceName}}</p>
          <p><span class="name">来访次数：</span><span class="number">1</span>次</p>
          <p><span class="name">车牌号：</span>无</p>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import store from '@/pages/main/store'
import { formatDate } from '@/assets/js/utils'
// import mutationTypes from '@/pages/main/store/mutation-types'
import { getPersonnelCardMsg, getSecrityPeopleMsg } from '@/pages/main/api/park-warning'
import { mapState } from 'vuex'
export default {
  name: 'member-info',
  props: {
    info: Object
  },
  data () {
    return {
      securityShowInfo: '',
      isInit: false,
      imgSrc: '',
      errorImg: require('../../../../static/images/people.png'),
      defaultImg: 'this.src="' + require('../../../../static/images/people.png') + '"',
      revealDatas: ['', '', ''],
      revealData: {},
      optionalField: ['unknow', 'households', 'visitor', 'danger', 'stranger']
    }
  },
  mounted () {
  },
  watch: {
    memberInfo (info) {
      if (info.markerType === 'guarder') { // 判断是否为保安
        this.securityShowInfo = 'guarder'
        this.getSecrityPeopleMsg(info)
      } else {
        if (info.markerType) { // 判断是地图点击出来的人员信息，把信息转化为统一格式
          console.log(info.info)
          let personMsg = info.info
          if (typeof personMsg.eventBody === 'string') { // 数据结构统一
            personMsg.eventBody = JSON.parse(personMsg.eventBody)
          }
          info = {
            cameraCode: personMsg.eventBody.deviceId,
            eventType: personMsg.eventBody.eventType,
            faceDatabaseId: personMsg.eventBody.faceLibId,
            facePicId: personMsg.eventBody.faceImgId,
            facePicUrl: personMsg.eventBody.facePic,
            captureTime: personMsg.eventHeader.occurTime,
            resourceName: personMsg.eventBody.address,
            userType: personMsg.eventHeader.userType
          }
        }
        this.getPersonnelCardMsg(info)
      }
    }
  },
  computed: {
    ...mapState({
      memberInfo: state => state.member_info.data
    })
  },
  methods: {
    // 获取业主、访客、未登记、重点人员接口数据
    getPersonnelCardMsg (info) {
      console.log(info)
      this.isInit = true
      this.securityShowInfo = this.optionalField[parseInt(info.userType)]
      if (info.userType === '3' || info.userType === '4') { // 未登记、重点人员图片直接获取抓拍图片
        this.imgSrc = info.facePicUrl
      }
      if (info.userType === '4') { // 未登记的话不需要经过接口
        this.revealData = {
          recentAccessTime: formatDate(Number(info.captureTime), 'YYYY-MM-DD hh:mm'),
          resourceName: info.resourceName
        }
      } else {
        let params = {
          'facePicId': info.facePicId || '',
          'faceDatabaseId': info.faceDatabaseId || '',
          'cameraCode': info.cameraCode || ''
        }
        getPersonnelCardMsg(params).then(res => { // 接口获取详情数据
          if (info.userType === '3') {
            this.revealData = {
              name: res.name,
              accessNum: res.accessNum,
              recentAccessTime: formatDate(Number(info.captureTime), 'YYYY-MM-DD hh:mm'),
              resourceName: info.resourceName,
              focusOnPersonnel: res.focusOnPersonnel
            }
          } else {
            if (info.userType === '1') { // 业主和访客为登记时的图片
              this.imgSrc = res.registerFacePic
            }
            if (info.userType === '2') {
              this.imgSrc = res.visitorRegisterFacePic || info.facePicUrl
              res.recentAccessTime = info.captureTime
            }
            this.revealData = res
            this.revealData.recentAccessTime = formatDate(Number(this.revealData.recentAccessTime), 'YYYY-MM-DD hh:mm')
            if (this.revealData.registerTime) { // 业主登记时间
              this.revealData.registerTime = formatDate(Number(this.revealData.registerTime), 'YYYY-MM-DD')
            }
            // this.revealData.carInfoDtoList = this.revealData.carInfoDtoList || [{ carNum: '无' }]
          }
          this.revealDatas = this.Mobile1(res.phone || '无') // 电话号码转化
        }).catch(() => {
          this.isInit = true
        })
      }
    },
    // 获取保安数据
    getSecrityPeopleMsg (info) {
      let params = {
        userId: info.id
      }
      if (!params.userId) {
        return
      }
      getSecrityPeopleMsg(params).then(res => {
        this.isInit = true
        this.imgSrc = res.facePic
        this.revealData = res
        this.revealData.hiredate = formatDate(res.hiredate, 'YYYY-MM-DD')
        this.revealDatas = this.Mobile1(res.phone || '无')
        console.log(res)
      }).catch(() => {
        this.isInit = true
      })
    },
    // 手机号添加空格  // 152 0791 0505
    Mobile1 (Xtext) {
      if (Xtext && Xtext.length > 5) {
        let str = []
        str.push(Xtext.substring(0, 3))
        str.push(Xtext.substring(3, 7))
        str.push(Xtext.substring(7, 11))
        return str
      } else {
        return '无'
      }
    },
    // 返回按钮
    closeDevice () {
      this.isInit = false
      // store.commit(mutationTypes.SHOW_MEMBER_INFO, { shown: false })
      store.commit('sendMessage', {
        windowName: 'member_info',
        shown: false
      })
    }
  }
}
</script>
<style scoped>

</style>
