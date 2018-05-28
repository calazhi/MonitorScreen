import axios from '@/assets/js/axios-plugin'

/**
 * @description 清除预警事件
 */
export const deleteWarningEvent = data => {
  return axios({
    method: 'get',
    url: '/scp-businesscommonapp/businessCommon/batchReleaseEvent',
  })
}

/**
 * @description 清除巡更事件
 */
export const deteleCruiseEvent = data => {
  return axios({
    method: 'post',
    url: '/scp-patrolapp/patrolMessage/updateAllStatus',
  })
}
