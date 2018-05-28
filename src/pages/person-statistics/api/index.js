import axios from '@/assets/js/axios-plugin'

// 统计来访人数
export const getPersonCount = () => {
  return axios.get('/scp-accesscontrolapp/person/getVisitorCount').then(res => res)
}

// 统计今日出入人次
export const getInOutTotalCount = () => {
  // return axios({
  //   method: 'get',
  //   url: '/test/getInOutTotalCount',
  //   params: data
  // })
  return axios.get('/scp-accesscontrolapp/person/getInOutTotalCount').then(res => res)
}
