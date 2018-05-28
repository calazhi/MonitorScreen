<template>
  <div class="left-wrap left1-wrap">
    <!-- 园区安防 star -->
    <div class="item-box community-security">
      <div class="hd">园区安防</div>

      <div class="bd">
        <div class="left-info">
          <div class="total-box">
            <p class="number">9</p>
            <div class="info">
              <p class="white">待处理</p>
              <p>园区预警</p>
            </div>
          </div>
          <div class="security-item-box">
            <div class="security-item">
              <em class="number">3</em>
              <p>周界越界</p>
            </div>
            <div class="security-item">
              <em class="number">0</em>
              <p>人员落水</p>
            </div>
          </div>
          <div class="security-item-box">
            <div class="security-item">
              <em class="number">0</em>
              <p>重点人员</p>
            </div>
            <div class="security-item">
              <em class="number">1</em>
              <p>人员徘徊</p>
            </div>
          </div>
          <div class="security-item-box">
            <div class="security-item">
              <em class="number">3</em>
              <p>巡更报事</p>
            </div>
            <div class="security-item">
              <em class="number">2</em>
              <p>车辆违停</p>
            </div>
          </div>
        </div>

        <div class="right-info">
          <div class="done-box">
            <p class="number">7</p>
            <div class="info">
              <p class="white">今日已处理</p>
              <p>园区预警</p>
            </div>
          </div>
          <div class="chart-box">
            <div class="chart-wrap">
              <div class="chartCount" id="chart"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 园区安防 end -->

  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'app',
  data () {
    return {
    }
  },
  mounted () {
    this.initEchart()
  },
  methods: {
    // 画车次统计曲线图
    initEchart: function () {
      var per = screen.width / 1920
      var option = {
        tooltip: {
          trigger: 'axis'
          // formatter: '{c}'
        },
        // color: ['#5E90FF'],
        grid: {
          left: '20' * per * 2.8,
          top: '10%',
          right: '20' * per * 2.8,
          bottom: '20' * per * 2.8,
        },
        xAxis: {
          // show: false,
          type: 'category',
          boundaryGap: false,
          data: ['周界越界', '人员落水', '重点人员', '人员徘徊', '巡更报事', '车辆违停'],
          axisLabel: {
            fontSize: '20' * per,
            color: '#858096',
            fontFamily: 'thiely1h',
            margin: '20' * per
          },
          axisPointer: {
            snap: true,
            lineStyle: {
              color: '#004E52',
              opacity: 0,
              width: 0
            },
            handle: {
              show: false
            }
          }
          // splitLine: {
          //   show: false
          // },
          // 是否显示坐标轴轴线
          // axisLine: {
          //   show: true
          // },
          // 是否显示刻度标签
          // axisLabel: {
          //   show: true
          // },
          // show: true
        },
        yAxis: {
          type: 'value',
          // axisTick: {alignWithLabel: true},
          axisTick: false,
          axisLabel: {
            fontSize: '20' * per,
            color: '#858096',
            fontFamily: 'thiely1h',
            align: 'left',
            margin: '20' * per * 2.8
          },
          minInterval: 1, // 保证显示整数
          splitLine: { show: true }, //  网格线
          data: ['0', '100', '200', '300']
        },
        series: [
          {
            type: 'bar',
            barWidth: '10%',
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    {offset: 0, color: '#40f0ff'},
                    {offset: 1, color: '#6099ff'}
                  ]
                )
              },
              emphasis: {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    {offset: 0, color: '#2378f7'},
                    {offset: 1, color: '#83bff6'}
                  ]
                )
              }
            },
            data: [3, 0, 0, 1, 2, 1]
          }
        ]
      }
      echarts.init(document.getElementById('chart')).setOption(option)
    },
    // 画车次统计曲线图
    initEchart1: function () {
      var per = screen.width / 1920
      var option = {
        tooltip: {
          trigger: 'axis'
          // formatter: '{c}'
        },
        // color: ['#5E90FF'],
        grid: {
          left: '20' * per * 2.8,
          top: '10%',
          right: '15',
          bottom: '10%'
        },
        xAxis: {
          // show: false,
          type: 'category',
          boundaryGap: false,
          data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          axisLabel: {
            fontSize: '20' * per,
            color: '#858096',
            fontFamily: 'thiely1h',
            margin: 10
          },
          axisPointer: {
            snap: true,
            lineStyle: {
              color: '#004E52',
              opacity: 0,
              width: 0
            },
            handle: {
              show: false
            }
          }
          // splitLine: {
          //   show: false
          // },
          // 是否显示坐标轴轴线
          // axisLine: {
          //   show: true
          // },
          // 是否显示刻度标签
          // axisLabel: {
          //   show: true
          // },
          // show: true
        },
        yAxis: {
          type: 'value',
          // axisTick: {alignWithLabel: true},
          axisTick: false,
          axisLabel: {
            fontSize: '20' * per,
            color: '#858096',
            fontFamily: 'thiely1h',
            align: 'left',
            margin: '20' * per * 2.8
          },
          minInterval: 1, // 保证显示整数
          splitLine: { show: false }, //  网格线
          data: ['0', '100', '200', '300']
        },
        series: [
          {
            name: '进',
            smooth: true,
            type: 'line',
            symbol: 'none',
            itemStyle: {
              normal: {
                color: '#975ef0',
                areaStyle: {
                  // 区域图，纵向渐变填充
                  color: '#27144C'
                }
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#27144C'
                }, {
                  offset: 1,
                  color: '#1D1955'
                }])
              }
            },
            // data: this.inArray
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
          },
          {
            name: '出',
            smooth: true,
            type: 'line',
            symbol: 'none',
            itemStyle: {
              normal: {
                color: '#00b0ff',
                areaStyle: {
                  // 区域图，纵向渐变填充
                  color: '#083965'
                }
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#083965'
                }, {
                  offset: 1,
                  color: '#1D1955'
                }])
              }
            },
            // data: this.outArray
            data: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
          }
        ]
      }
      echarts.init(document.getElementById('chart')).setOption(option)
    }
  }
}
</script>

<style scoped>
/*-- 园区安防 star --*/
.community-security .bd {
  display: flex;
  justify-content: space-between;
  padding: 6.3rem 4.1rem 0;
  color: rgba(255, 255, 255, .3);
  font-size: 2rem;
  line-height: 1.3;
}

.community-security .number,
.community-security .white {
  color: #fff;
}

.community-security .left-info {
  position: relative;
  width: 26rem;
  text-align: center;
}

.community-security .total-box {
  display: flex;
  align-items: center;
  height: 12rem;
  border-radius: .4rem;
  border: .1rem solid #312367;
  padding: 0 3rem;
}

.community-security .total-box .number,
.community-security .done-box .number {
  position: relative;
  top: -.5rem;
  font-size: 6.4rem;
  line-height: 5.2rem;
}

.community-security .total-box .info,
.community-security .done-box .info {
  text-align: left;
}

.community-security .total-box .number + .info,
.community-security .done-box .number + .info {
  margin-left: 1.8rem;
}

.community-security .security-item-box{
  display: flex;
  justify-content: center;
  align-items: center;
}

.community-security .security-item {
  position: relative;
  margin-top: .3rem;
  flex: 1 1 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-image: url('/static/images/security-item-bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height: 9rem;
}

.community-security .security-item:before {
  content: '';
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 2.1rem;
  height: .1rem;
  background-color: rgba(66, 51, 212, .3);
  transform: translateX(-50%);
}

.community-security .security-item + .security-item {
  margin-left: .3rem;
}

.community-security .security-item .number {
  font-size: 2.4rem;
  line-height: 2.7rem;
  margin-bottom: 1.3rem;
}

.community-security .right-info {
  position: relative;
  width: 56rem;
}

.community-security .done-box {
  display: flex;
  align-items: center;
  height: 12rem;
  border-radius: .4rem;
  border: .1rem solid #312367;
  margin-bottom: .3rem;
  padding-left: 4.1rem;
}

.community-security .chart-box {
  border-radius: .4rem;
  border: .1rem solid #312367;
  background-color: #1c133e;
}

.community-security .chartCount {
  font-weight: 300;
  height: 25.5rem;
  margin: 1rem 4.1rem;
}
/*-- 园区安防 end --*/
</style>
