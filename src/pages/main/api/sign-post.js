import axios from '@/assets/js/axios-plugin'

// 代码提交部署时使用/scp-mapapp作上下文
const contextPath = '/scp-guidepostcomponent'
// 调试用上下文字段为空
// const contextPath = ''
/**
 * @description 获取摄像头Id
 * @param {obj} data
 */
export const getCameraId = data => {
  return axios({
    method: 'get',
    url: contextPath + '/cameraSignPostId/queryForList',
    params: data
  })
}

/**
 * @description 获取分组列表
 * @param {obj} data
 */
export const getSignPostGroup = data => {
  return axios({
    method: 'post',
    url: contextPath + '/screenProtect/queryDeviceScreenGroup',
    data
  })
}

/**
 * @description 获取图片列表
 * @param {obj} data
 */
export const getDeviceScreenImage = data => {
  return axios({
    method: 'post',
    url: contextPath + '/screenProtect/queryDeviceScreenImage',
    data
  })
}

/**
 * @description 更新屏幕信息
 * @param {obj} data
 */
export const updateDeviceScreen = data => {
  return axios({
    method: 'post',
    url: contextPath + '/screenProtect/updateDeviceScreenSet',
    data
  })
}

// SignPost.vue的日志标签
export const LOG_TAG = '[SignPost] '
