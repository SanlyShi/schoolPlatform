<template>
    <div id='teacherChart'>
        <div class="backIcon" @click="$emit('backToParent')">
            <i class="maticon back-icon" v-html="icons('navigate_before')" ></i>
        </div>

        <div class="topInfo">
            <div class="info">
                <div class="left">
                    <i></i>
                    <p>
                        <span>教职工</span>
                        <em>{{new Date().toLocaleDateString().replace(/\//g,'.')}}</em>
                    </p>
                </div>
                <div class="right">
                    <span>{{countAll.toFixed(0).toString().replace(/(\d)(?=(?:\d{3})+$)/g,"$1,")}}</span> 人
                </div>
            </div>
        </div>
        <div class="charts">
            <div class="eduLevel">
                <h1><i></i><span>教职工信息</span></h1>
                <div class="content" >
                    <div id="eduBar" ref="eduBar" style="height: 5rem;"></div>
                    <!-- <div style="height: 5rem;" v-else>暂无数据</div> -->
                </div>
            </div>
        </div>
        <div class="bottom">
            <span></span><i></i><span></span>
        </div>
    </div>
</template>
<script>
import { request } from "../../../assets/utils/utils.js";
export default {
    // props: ['chartData'],
    data() {
        return {
            countAll: 0,
            countClassLeader: 0, //班主任
            countInstructor: 0, //导师
            countOther: 0,
            countTutor: 0, //辅导员
            dataList: [],//图表数据
            titleList: [],//图表X轴
        }
    },
    methods: {
        getData() {
            let url = '/api/document/statistic/getTeacherStatistic'
            request(url,{},'post').then(data => {
                if(data.state) {
                    if(!data.data) return this.$toast('暂无数据')
                    const {countAll,countClassLeader,countInstructor,countOther,countTutor} = data.data
                    this.countAll = countAll
                    this.countClassLeader = countClassLeader
                    this.countInstructor = countInstructor
                    this.countOther = countOther
                    this.countTutor = countTutor
                    this.titleList = ['辅导员','导师','班主任','其他']
                    this.dataList = [this.countInstructor,this.countTutor,this.countClassLeader,this.countOther]
                    this.initCharts()
                }
            })
        },
        initCharts() {
            let eduBar = this.$echarts.init(document.getElementById("eduBar"));
            let option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            
                        type: 'shadow'       
                    }
                },
                xAxis: {
                    type: 'category',
                    data: this.titleList,
                    axisLabel : {
                        color: '#606266',
                        margin: 12,
                    },
                    axisLine: {
                        show:false
                    },
                    axisTick:{
                        show:false
                    },
                },
                yAxis: {
                    axisLine: {
                        show:false
                    },
                    axisTick:{
                        show:false
                    },
                    type: 'value',
                    axisLabel : {
                        color: '#909399',
                    },
                    splitLine: {
                        lineStyle: {
                            type: 'dashed'
                        }
                    }
                    // max: function(value) {
                    //     return value + 20
                    // }
                },
                grid: {
                    left: 50,
                    bottom: 30,
                    top: 30,
                },
                series: [{
                    data: this.dataList,
                    type: 'bar',
                    barWidth: 16,
                    label: {
                        show: true,
                        position: 'top',
                        distance: 10,
                        verticalAlign: 'middle',
                            textStyle: { // 数值样式
                            color: '#606266',
                            fontSize: 12
                        }
                    },
                    itemStyle: {
                        normal: {
                            barBorderRadius: [3, 3, 0, 0],
                            color: new this.$echarts.graphic.LinearGradient(
                            0, 0, 0, 1,//渐变色在下面修改，这里是透明度
                            [{
                                offset: 0,
                                color: '#1D6FA3'
                                },
                                {
                                offset: 1,
                                color: '#5FC7F5'
                                }
                            ]
                            )
                        }
                    }
                }]
            };
            eduBar.resize();//直接加这句即可
            eduBar.setOption(option);
        }
    },
    created() {
        this.getData()
    },
}
</script>
<style lang="less">
    #teacherChart {
      .bottom {
          display: flex;
          justify-content: center;
          align-items: center;

          span,i {
              display: inline-block;
          }
          span {
              width: 1.8667rem;
              height: 1px;
              background: rgb(220,223,230);
          }
          i {
              width: 3px;
              height: 3px;
              border-radius: 50%;
              background: rgb(220,223,230);
              margin: 0 0.2667rem;
              
          }
      }
        .topInfo {
            margin: 0.32rem;
            padding-bottom: 0;
            height: 2.9333rem;
            margin-bottom: 0;
            box-shadow:0px 3px 8px 0px rgba(129,193,254,0.36);
            border-radius:8px;
            background: url('../../../../mobile_static/image/pic_teacher_bg@2x.png') no-repeat;
            background-size: contain;
            .info {
                display: flex;
                justify-content: space-between;
                align-items: center;
                // height: 1.8667rem;
                padding: 0.5867rem 0.36rem 0 0.3333rem;
                .right {
                    color: #fff;
                    font-size: 12px;
                    span {
                     font-size: 0.5867rem;
                    }
                }
                .left {
                    display: flex;
                    align-items: center;
                    i {
                    display: inline-block;
                    width: 1.8667rem;
                    height: 1.8667rem;
                    background: url('../../../../mobile_static/image/icon_teacher_a@2x.png') no-repeat;
                    background-size: contain;
                }
                p {
                    margin: 0;
                    margin-top: -3px;
                    color: #fff;
                    span {
                        display: block;
                        line-height: 0.64rem;
                        font-size: 0.4533rem;
                        font-weight: bold;
                    }
                    em {
                        font-style: normal;
                        font-size: 12px;
                        opacity: 0.6;
                    }
                }
                }
                
            }
            
        }
        .backIcon {
            background: #fff;
            height: 1.1733rem;
            line-height: 1.1733rem;
            display: flex;
            align-items: center;
            padding-top: .1rem;
            margin-bottom: 0.32rem;
           .back-icon{
                color: #000;
                margin-left: 5px;
                font-size: 0.7rem;
                display: inline-block;
                position: initial;
                line-height: 1;
            }
        }
        .charts {
            box-shadow:0px 5px 8px 0px rgba(220,223,230,0.3);
            border-radius:0.2133rem;
           padding: 0.32rem;
            padding-bottom: 0;
            & > div {
                width: 100%;
                height: 6rem;
                background: #fff;
                margin-bottom: 0.5333rem;
                border-radius:0.2133rem;
                box-shadow:0px 5px 8px 0px rgba(220,223,230,0.3);
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
                        background:rgba(77,121,246,1);
                        box-shadow:1px 1px 2px 0px rgba(77,121,246,0.2);
                    }
                }
            }
            &>div.college {
                height: auto;
            }
        }
    }
</style>