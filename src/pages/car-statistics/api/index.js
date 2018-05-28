import axios from '@/assets/js/axios-plugin'

// 车位统计查询所有数据（不包括固定车位）
export const queryAllParkseatsCounts = () => {
  return axios.get('/scp-parkinglotapp/carStatistics/queryAllParkseatsCounts')
}

// 获取当前系统时间
export const queryCurrentTime = () => {
  return axios.get('/scp-parkinglotapp/common/queryCurrentTime')
}

// export const getParkinglot = () => {
//   return axios.get('/scp-parkinglotapp/parkingLotMonitor/getParkinglot')
// }
