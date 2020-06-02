<template>
  <div id="appChart">
    <div class="chartPart" v-show="!showDetails">

    
    <div class="backIcon" @click="$emit('backToParent')">
      <i class="maticon back-icon" v-html="icons('navigate_before')"></i>
    </div>
    <div class="topInfo">
      <div class="left">
        <span>
          {{ServiceCount}}
          <i>个</i>
        </span>
        <p>已启用服务</p>
      </div>
      <div class="middle"></div>
      <div class="right">
        <span>
          {{disableSerice}}
          <i>个</i>
        </span>
        <p>未启用服务</p>
      </div>
    </div>

    <div class="charts">
      <div class="audit">
        <h1>
          <p class="left">
            <i></i>
            <span>审批流程服务</span>
          </p>
          <p class="right" @click="toDetails('flow')">
            <span>查看更多</span>
            <em></em>
          </p>
        </h1>
        <div class="title">
            <span>审批流程服务数</span>
            <span v-if="workFlowStatistic">{{workFlowStatistic.countWorkFlowApp+'个'}}</span>
        </div>
        <div class="content" id='parent' style="text-align: center;">
          <!-- <canvas id="auditing" width="200" height="200" style="width: 180;"/> -->
         
          <div id="complete" ref="completePie" style="height: 7rem;"></div>
     
        </div>
        <div class="bottom topInfo">
            <div class="left">
                <span v-if="workFlowStatistic">
                {{workFlowStatistic.countComplete}}
                </span>
                <p>审批完成</p>
            </div>
            <div class="middle"></div>
            <div class="right">
                <span v-if="workFlowStatistic">
                {{workFlowStatistic.countAudit}}
                </span>
                <p>正在审批</p>
            </div>
        </div>
      </div> 
    <div class="formService audit">
        <h1>
          <p class="left">
            <i></i>
            <span>表单服务</span>
          </p>
          <p class="right" @click="toDetails('form')">
            <span>查看更多</span>
            <em></em>
          </p>
        </h1>
        <div class="title">
            <span>表单服务数</span>
            <span v-if="formStatistic">{{formStatistic.countFormApp+'个'}}</span>
        </div>
        <div class="formApp">
          <div class="formBg">

          </div>
          <div class="formInfo">
            <span>完成表单填写</span>
            <p v-if="formStatistic"><i>{{formStatistic.countSaveForm.toFixed(0).toString().replace(/(\d)(?=(?:\d{3})+$)/g,"$1,")}}</i><em>人次</em></p>
          </div>
        </div>
    </div>
      <div class="eduLevel">
        <h1>
          <i></i>
          <span>已启用服务</span>
        </h1>
        <div class="content">
          <div id="service" ref="eduBar" style="height: 10rem;"></div>
        </div>
      </div>

      <div class="eduLevel">
        <h1>
          <i></i>
          <span>最受欢迎服务top5</span>
        </h1>
        <div class="content">
          <div id="grade" ref="grade" style="height: 7rem;"></div>
        </div>
      </div>
    </div>
    </div>
    <flow-details :detailsType='detailsType' v-if="showDetails" @backToParent='showDetails = false'></flow-details>
  </div>
</template>
<script>
// import echarts from 'echarts'
import { request } from "../../../assets/utils/utils.js";
import flowDetails from './flowDetails'
export default {
  // props: ['chartData'],
  components: {
    flowDetails
  },
  data() {
    
    return {
      countEnable: 0, //启用服务总数
      enableAndDisable: [], //启用与未启用
      enableStatistic: [], //饼图数据
      topCollectName: [], //
      topCollectCount: [],
      ServiceCount: 0,
      disableSerice: 0,
      canvas: '',
      speed: 0,
      animation: null,//动画定时器
      workFlowStatistic: null,//审批服务对象
      formStatistic: null,//表单服务对象
      completionRate: 0,//完成率
      showDetails: false,
      detailsType: '',
    };
  },
  methods: {
    toDetails(type) {
      this.detailsType = type
      this.showDetails = true
    },
   
    
    
    getData() {
      let url = "/api/document/statistic/getAppStatistic";
      request(url, {}, "post").then(data => {
        if (data.state) {
          this.countEnable = data.data.countEnable;
          if (data.data && data.data.enableAndDisable.length) {
            this.enableAndDisable = data.data.enableAndDisable;
            this.ServiceCount = data.data.enableAndDisable[0].count;
            this.disableSerice = data.data.enableAndDisable[1].count;
            this.workFlowStatistic = data.data.workFlowStatistic
            this.formStatistic = data.data.formStatistic
            let {countComplete,countWorkFlowApp} = this.workFlowStatistic
             this.completionRate = ((countComplete / (countWorkFlowApp+countComplete)).toFixed(4))*100
          }
          if (data.data && data.data.enableStatistic.length) {
            this.enableStatistic = data.data.enableStatistic;
            this.enableStatistic = this.enableStatistic.map(v => {
              return {
                value: v.count,
                name: v.name
              };
            });
           
          }
          if (data.data && data.data.topCollectStatistic.length) {
            let topCollect = data.data.topCollectStatistic;
            for (let i = 0; i < topCollect.length; i++) {
              const { name, count } = topCollect[i];
              this.topCollectName.push(name);
              this.topCollectCount.push(count);
            }
          }
           
           
          this.initCharts();
        }
      });
    },
    initCharts() {
      let eduBar = this.$echarts.init(document.getElementById("service"));
      let grade = this.$echarts.init(document.getElementById("grade"));
      let completePie = this.$echarts.init(document.getElementById("complete"));
      let completeOption = {
        grid: {
          left: 10,
          top: 50
        },
        graphic: [{ //环形图中间添加文字
            type: 'text', //通过不同top值可以设置上下显示
            left: 'center',
            top: '40%',
            style: {
                text: '完成率',
                textAlign: 'center',
                fill: '#303133', //文字的颜色
                width: 30,
                height: 40,
                fontSize: 14,
                fontFamily: "Microsoft YaHei"
            }
        },{ //环形图中间添加文字
            type: 'text', //通过不同top值可以设置上下显示
            left: 'center',
            top: '50%',
            style: {
                text: this.completionRate + '%',
                textAlign: 'center',
                fill: '#3081FE', //文字的颜色
                width: 30,
                height: 30,
                fontSize: 18,
                fontFamily: "Microsoft YaHei"
            }
        }],
        series: [
          {
            name: "已启用的服务",
            type: "pie",
            radius: ['50%','65%'],
            center: ["50%", "50%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "20",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [this.completionRate,100-this.completionRate],
            itemStyle: {
              normal: {
                color: (params) => {
                  var colorList = [{c1:'#4D79F6',c2: '#80DCF4'},{c2:'#F6DA5D',c1: '#F6BE29'},{c2: '#9E28FA',c1: '#7D32FF'},{c2: '#FF7E91',c1: '#FB256E'}];
                   if(params.dataIndex == 1) {
                     return '#F2F7FF'
                   }else {
                     return new this.$echarts.graphic.LinearGradient(1, 0, 0, 0, [{ 
                                offset: 0,
                                color: colorList[params.dataIndex].c1
                            }, {
                                offset: 1,
                                color: colorList[params.dataIndex].c2
                            }])  
                   }
                   
                }
              }
            }
          }
        ]
      }
      completePie.resize(); //直接加这句即可
      completePie.setOption(completeOption);
      let option = {
        // color: ['#3398DB',"#000","#1f2d3d","#409EFF"],
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          data: this.enableStatistic,
          orient: "horizontal",
          itemWidth: 10,
          itemHeight: 10,
          bottom: 20,
          itemGap: -5,
          left: 65,
          textStyle: {
            color: "#606266",
            fontSize: 14
          },
          formatter: name => {
            let total = 0;
            let target;
            for (let i = 0, l = this.enableStatistic.length; i < l; i++) {
              if (this.enableStatistic[i].name == name) {
                target = this.enableStatistic[i].value;
              }
            }
            let arr = [
              "{a|" + name + "}",
              "{b|" + ((target / this.countEnable) * 100).toFixed(2) + "%}"
            ];
            return arr.join("\n");
          },
          textStyle: {
            rich: {
              a: {
                fontSize: 16,
                verticalAlign: "top",
                align: "center",
                padding: [0, 60, 28, 0]
              },
              b: {
                fontSize: 14,
                align: "left",
                padding: [0, 15, 0, 0],
                lineHeight: 25
              }
            }
          }
        },
        grid: {
          left: 10,
          top: 20
        },
        series: [
          {
            name: "已启用的服务",
            type: "pie",
            radius: ['30%', '40%'],
            center: ["50%", "30%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "20",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: this.enableStatistic,
            itemStyle: {
              normal: {
                color: (params) => {
                  var colorList = [{c1:'#4D79F6',c2: '#80DCF4'},{c2:'#F6DA5D',c1: '#F6BE29'},{c2: '#9E28FA',c1: '#7D32FF'},{c2: '#FF7E91',c1: '#FB256E'}];
                   return new this.$echarts.graphic.LinearGradient(1, 0, 0, 0, [{ 
                                    offset: 0,
                                    color: colorList[params.dataIndex].c1
                                }, {
                                    offset: 1,
                                    color: colorList[params.dataIndex].c2
                                }])  
                }
              }
            }
          }
        ]
      };
      if (this.enableStatistic.length > 2) {
        eduBar.getDom().style.height = 9 + "rem";
      } else {
        eduBar.getDom().style.height = 7+ "rem";
      }

      eduBar.resize(); //直接加这句即可
      eduBar.setOption(option);
      let optionGrade = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        xAxis: {
          type: "category",
          data: this.topCollectName,
          axisLabel: {
            color: "#606266",
            margin: 15,
            fontSize: 12,
            interval: 0,
            formatter: function(val) {
              var strs = val.split(""); //字符串数组
              var str = "";
              for (var i = 0, s; (s = strs[i++]); ) {
                //遍历字符串数组
                str += s;
                if (!(i % 4)) str += "\n"; //按需要求余
              }
              return str;
            }
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          type: "value",
          axisLabel: {
            color: "#909399"
          },
          splitLine: {
            lineStyle: {
              type: "dashed"
            }
          }
          // max: function(value) {
          //     return value + 20
          // }
        },
        grid: {
          left: 30,
          bottom: 70,
          top: 30
        },
        series: [
          {
            data: this.topCollectCount,
            type: "bar",
            barWidth: 16,
            barCategoryGap:'40',
            label: {
              show: true,
              position: "top",
              distance: 10,
              verticalAlign: "middle",
              textStyle: {
                // 数值样式
                color: "#606266",
                fontSize: 12
              }
            },
            itemStyle: {
              normal: {
                barBorderRadius: [3, 3, 0, 0],
                color: new this.$echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1, //渐变色在下面修改，这里是透明度
                  [
                    {
                      offset: 0,
                      color: "#EA5455"
                    },
                    {
                      offset: 1,
                      color: "#FEB692"
                    }
                  ]
                )
              }
            }
          }
        ]
      };
      grade.resize(); //直接加这句即可
      grade.setOption(optionGrade);
    },
    backToParent() {
      
    }
  },
  created() {
      clearInterval(this.animation);
    this.$nextTick(() => {
      // this.getFlow()
      this.getData();
    });
  }
};
</script>
<style lang="less">
#appChart {
  .topInfo {
    position: relative;
    margin: 0.32rem;
    padding-bottom: 0;
    height: 2.9333rem;
    margin-bottom: 0;
    box-shadow: 0px 3px 8px 0px rgba(129, 193, 254, 0.36);
    border-radius: 8px;
    background: url("../../../../mobile_static/image/pic_app_b@2x.png")
      no-repeat;
    background-size: contain;
    display: flex;
    color: #fff;
    i {
      font-style: normal;
      font-weight: normal;
    }
    .right {
      text-align: center;
      font-size: 12px;
      flex: 1;
      span {
        display: inline-block;
        margin-top: 0.7733rem;
        font-size: 0.5867rem;
        font-weight: bold;
        margin-bottom: 0.2667rem;
        i {
          font-size: 12px;
        }
      }
      p {
        margin: 0;
        line-height: 1;
        font-size: 0.4533rem;
      }
    }
    .middle {
      position: absolute;
      width: 1px;
      height: 1rem;
      background: #fff;
      left: 50%;
      top: 50%;
      margin-top: -0.5rem;
      opacity: 0.6;
    }
    .left {
      flex: 1;
      text-align: center;

      span {
        display: inline-block;
        margin-top: 0.7733rem;
        font-size: 0.5867rem;
        margin-bottom: 0.2667rem;
        font-weight: bold;
        i {
          font-size: 12px;
        }
      }
      p {
        margin: 0;
        line-height: 1;
        font-size: 0.4533rem;
      }
    }
  }
  .topInfo.bottom {
      margin: 0 0.6667rem;
      background: #fff;
      color: #303133;
      height: auto;
      box-shadow: initial;
      .left,.right {
          font-size:16px;
          padding-bottom: 0.5867rem;
          span {
            margin-top: 0;
            line-height: 1;
          }
          p {
              color: #909399;
              font-size: 12px;
          }
      }
      .middle {
          background: #DCDFE6;
          height: 0.8667rem;
          top: 0.1333rem;
          margin-top: 0;
      }
  }
  .backIcon {
    background: #fff;
    height: 1.1733rem;
    line-height: 1.1733rem;
    display: flex;
    align-items: center;
    padding-top: 0.1rem;
    .back-icon {
      color: #000;
      margin-left: 5px;
      font-size: 0.7rem;
      display: inline-block;
      position: initial;
      line-height: 1;
    }
  }
  .charts {
    background: #f4f4f4;
    padding: 0.32rem;
    padding-bottom: 0;
    & > div {
      width: 100%;
      height: auto;
      background: #fff;
      margin-bottom: 0.32rem;
      border-radius: 0.2133rem;
      box-shadow: 0px 5px 8px 0px rgba(220, 223, 230, 0.3);
      h1 {
        margin: 0;
        padding: 0;
        font-size: 0.4267rem;
        padding-top: 0.32rem;
        color: #303133;
        span {
          // font-size: 16px;
          display: inline-block;
          vertical-align: middle;
          font-weight: bold;
        }
        i {
          display: inline-block;
          vertical-align: middle;
          width: 0.1067rem;
          margin-right: 0.4267rem;
          height: 0.5067rem;
          background: rgba(77, 121, 246, 1);
          box-shadow: 1px 1px 2px 0px rgba(77, 121, 246, 0.2);
        }
      }
    }
    div.audit {
        .title {
            font-size: 14px;
            color:#303133;
            display: flex;
            justify-content: space-between;
            margin: 5px 0.2667rem 0 0.24rem;
            padding: 0 0.6133rem;
            height: 1.1733rem;
            border-radius: 0.1333rem;
            line-height: 1.1733rem;
            background: #F6F6F8;
        }
      h1 {
        display: flex;
        justify-content: space-between;
        align-items: center;
        p.right {
          font-size: 0.3467rem;
          color: rgb(144, 147, 153);
          font-weight: normal;
          margin-right: 0.2667rem;
          span {
            display: inline-block;
            vertical-align: middle;
            font-weight: normal;
          }
          em {
            vertical-align: middle;
            display: inline-block;
            width: 0.32rem;
            height: 0.32rem;
            background: url("../../../../mobile_static/image/icon_more_a@2x.png")
              no-repeat;
            background-size: contain;
          }
        }
      }
    }
    .formService {
      .formApp {
        margin: 0.6667rem 0 0.4267rem 0.5867rem;
        display: flex;
        .formBg {
          background: url("../../../../mobile_static/image/pic_form@2x.png") no-repeat;
          background-size: contain;
          width: 2.6667rem;
          height: 2.16rem;
          margin-bottom: 0.4267rem;
          margin-right: 1.6rem;
        }
        .formInfo { 
          span {
            letter-spacing: 2px;
            color: #909399;
            line-height: 1;
            margin: 0.3733rem 0 0.1333rem 0;
            display: inline-block;
          }
          p {
            color: #3081FE;
            font-size: 0.4533rem;
            i {
              letter-spacing: 2px;
              font-style: normal;
              display: inline-block;
              line-height: 1;
              font-weight: bold;
              margin-right: 3px;
            }
            em {
              font-style: normal;
              font-size: 12px;
            }
          }
        }
      }
    }
  }
}
</style>