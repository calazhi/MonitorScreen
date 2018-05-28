import axios from '@/assets/js/axios-plugin'
// let contextPath = '/scp-videointercomapp'
// let contextPath = ''
// export const getTestUserList = () => {
//   return axios.get('/test/mockData')
// }

/**
 * 门禁&道闸远程开门
 */
export const accessControlOpenDoor = (deviceId, parentId, gatewayId) => {
  let params = 'deviceCode=' + deviceId + '&parentId=' + parentId + '&gatewayId=' + gatewayId
  return axios.get('/scp-accesscontrolapp/openRemote/remoteOpenOption?' + params)
}

/**
 * 车闸远程开闸
 */
export const remoteControlBrake = (deviceId, parentId) => {
  let params = 'deviceCode=' + deviceId + '&parentId=' + parentId
  return axios.get('/scp-parkinglotapp/openBrake/remoteOpenBrake?' + params)
}

/**
 * 查询门禁设备信息
 */
export const queryDeviceInfoByCode = (deviceId) => {
  let params = 'deviceCode=' + deviceId
  return axios.get('/scp-accesscontrolapp/openRemote/queryDeviceInfoByCode?' + params)
}

/**
 * 查询车场设备信息
 */
export const queryBrakeDeviceInfo = (deviceId) => {
  let params = 'deviceCode=' + deviceId
  return axios.get('/scp-parkinglotapp/openBrake/queryDeviceInfoByCode?' + params)
}

// 派遣保安推荐列表
export const getSecurityDistanceList = (params) => {
  return axios.get('/scp-patrolapp/patrolSendUser/listSecurityDistance', { params: params })
}

// 派遣保安
export const patrolSecuritys = (params) => {
  console.log(params)
  return axios.post('/scp-patrolapp/patrolSendUser/screenSendUser', params)
}

// 获取事件id
export const getEventInfo = (deviceId, eventType) => {
  return axios.get('/scp-businesscommonapp/businessCommon/getUpDateReport?deviceId=' + deviceId + '&eventType=' + eventType)
}

// 根据事件查询已派遣保安
export const hasPatrolSecuritys = (params) => {
  return axios.get('/scp-patrolapp/patrolMessage/listMessageUser', { params: params })
}
