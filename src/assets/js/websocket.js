import SockJS from 'sockjs-client'
import axios from '@/assets/js/axios-plugin'

const getWsPath = axios.get('/scp-websocketcomponent/websocketinfo/getServiceIpAndPort')
let websocket = null

/**
 * egscuimain 右边主区域
 * egscuigardensecurity 园区安防
 * egscuicarstatistics 车辆统计
 * egscuipersonstatistics 人员统计
 */
// export const loadWebsocket = function (module) {
//   return new Promise((resolve, reject) => {
//     getWsPath.then(path => {
//       let socketUrl = `//${path}/sockjs/${module}/readData`
//       websocket = new SockJS(socketUrl)
//       websocket.onopen = () => {
//         console.info('WebSocket连接开始')
//       }
//       websocket.onmessage = event => {
//         resolve(event.data)
//       }
//       websocket.onclose = () => {
//         console.warn('WebSocket连接关闭...尝试重连')
//         websocket = loadWebsocket(module)
//       }
//       websocket.onerror = () => {
//         console.error('WebSocket连接出错...')
//         reject(new Error('WebSocket连接出错...'))
//       }
//       // console.log('status: ' + websocket.readyState)
//     })
//   })
// }

export const loadWebsocket = function (callback, module) {
  getWsPath.then(path => {
    let socketUrl = `//${path}/sockjs/${module}/readData`
    websocket = new SockJS(socketUrl)
    websocket.onopen = () => {
      console.info('WebSocket连接开始')
    }
    websocket.onmessage = event => {
      callback(event.data)
    }
    websocket.onclose = () => {
      console.warn('WebSocket连接关闭...尝试重连')
      websocket = loadWebsocket(module)
    }
    websocket.onerror = () => {
      console.error('WebSocket连接出错...')
    }
    // console.log('status: ' + websocket.readyState)
  })
}
//
// // 测试发送数据
// export const sendMessage = function () {
//   let testData = {
//     type: 39999,
//     deviceId: '123123123',
//     info: {
//       deviceType: '1',
//       count: '5'
//     },
//     time: Date.now()
//   }
//   websocket.send(JSON.stringify(testData))
// }
