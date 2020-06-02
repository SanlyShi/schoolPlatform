<template>
  <div id="statistics">
    <p class="noData" v-if="this.dataListOfEmploy==null&&this.dataListOfSign == null">暂无统计数据</p>
    <div class="statisticsBox" v-else>
    <div class="bg"><img src="/static/image/employment/statisbg1.png" alt=""></div>
    <div class="bgBottom"><img src="/static/image/employment/statisbg.png" alt=""></div>
    <!-- <div class="chart1" style="height:300px;width:49%;display:inline-block">
                                    <v-PieChart :optionData="difficultRatio"></v-PieChart>
                                </div> -->
    <h3 class="schoolName" :title="schoolName+'毕业生就业大数据'">{{schoolName+'毕业生就业大数据'}}</h3>
    <div class="btns">
      <a class="download" @click="showExportModel"><i></i><span>导出</span></a>
      <a class="full" @click="changeFull"><i :class="{'isFull':isFull}"></i><span>{{isFull?'退出全屏':'全屏'}}</span></a>
    </div>

    <div class="boxContainer">
      <div class="part1" ref="part1">
        <h1><span>就业统计 (学院维度)</span><a @click="changeDataList" style=""><i></i><span>{{curDataList=='employ'?'签约率':'就业率'}}</span></a></h1>
        <div class="list" ref="ulBox">
          <h2></h2>
          <ul ref="ulList">
            <li class="title">
              <el-col :span='5' style="padding-left: 10px;">名次</el-col>
              <el-col :span='12'>学院</el-col>
              <el-col :span='7'>{{curDataList=='employ'?'就业率':'签约率'}}</el-col>
            </li>
            <li v-for="(item,index) in dataList" :key="index">
              <el-col :span='5' style="text-align: center;">{{index+1}}</el-col>
              <el-col :span='13' :title="item.name" class="collegeName">{{item.name}}</el-col>
              <el-col :span='6'>{{item.value}}</el-col>
            </li>
          </ul>
        </div>
      </div>
      <div class="part" v-loading='loading' ref='part2'>

        <div class="part2" style="width: 49%;">
          <div class="chart1" style="height: 100%;">
            <h1>就业统计 (校级维度)</h1>
            <div class="content" style="display: flex;">
              <div class="left">
                <h1 v-if="chart1_obj">
                  <p>已就业人数</p><span>{{chart1_obj.employedTotal}}</span>人
                </h1>
                <h2>全校就业率</h2>
                <div class="chartPie1" style="height: 150px;width:100%;display:inline-block" id="chart_example">
                  <!-- <v-PieChart :optionData="chart1_pieData"></v-PieChart> -->
                  <!-- <div id="chart_example" :style="{width: '100%', height: '400px'}" ref="myEchart"></div> -->
                </div>
              </div>

              <div class="right">
                <h1 v-if="chart1_obj">
                  <p>已签约人数</p><span>{{chart1_obj.signedTotal}}</span>人
                </h1>
                <h2>全校签约率</h2>
                <div class="chartPie1" style="height:150px;width:100%;display:inline-block" id="chart2_pieData">
                  <!-- <v-PieChart :optionData="chart2_pieData"></v-PieChart> -->
                </div>
              </div>
              <div style="clear: both;"></div>
            </div>
          </div>
        </div>
        <div class="part3" style="width: 49%;">
          <div class="chart1" style="height: 100%;">
            <h1>就业统计 (校级维度)</h1>
            <div class="content teacher">
              <div class="bar" style="height:200px;width:100%;display:inline-block" id="chart3_barData">
                <!-- <h2>
                                  <p><i></i><span>签约率</span></p>
                                  <p class="employmentPercent"><i></i><span>就业率</span></p>
                              </h2> -->
                <!-- <v-EchartsBar :tooltipOptions='tooltipOptions' :optionData="item" v-for="(item,index) in barList" :key="index"></v-EchartsBar> -->

              </div>
            </div>
            <!-- <div class="content teacher">
                          <div class="bar" style="height:200px;width:100%;display:inline-block" id="chart3_barData">
                          </div>
                      </div> -->
          </div>
        </div>
        <!-- <el-col :lg="12" :md='24'> -->
        <div :class="['bottom']" :style="!isFull?styleObj:''">
          <div class="chart1" style="height:100%;">
            <div class="title">
              <h1>就业统计 (专业维度)</h1>
              <div class="majorSelect">
                <el-select v-model="selectMajor" @change="marjorTypeChange">
                  <el-option v-for="(item,index) in collegeList" :key="index" :label='item.label' :value='item.label'></el-option>
                </el-select>
              </div>
            </div>
            <div class="content">
              <div class="bar" id="chart4_barData" style="width:100%;display:inline-block">
                <!-- <v-EchartsBar :tooltipOptions='tooltipOptions' :optionData="item" v-for="(item,index) in majorBarList" :key="index"></v-EchartsBar> -->
                <!-- <h2 v-if="majorBarList.length">
                                        <p><i></i><span>签约率</span></p>
                                        <p class="employmentPercent"><i></i><span>就业率</span></p>
                                    </h2> -->

              </div>
            </div>
          </div>
        </div>

        <div class="bottom h100" :style="!isFull?styleObj:''">
          <div class="chart1" style="height: 100%;" ref='chart1' id='chart1'>
            <div class="title">
              <h1>签约就业类型分布</h1>
              <div class="majorSelect">
                <el-select v-model="selectMajor_pie" @change="majorSelect_pie">
                  <el-option v-for="(item,index) in marjorType" :key="index" :label='item.label' :value='item.label'></el-option>
                </el-select>
              </div>
            </div>
            <div class="content">
              <div class="bar" style="height:200px;width:100%;display:inline-block" id="chart5_pieData">
                <!-- <v-EchartsBar :optionData="charts_typeData"></v-EchartsBar> -->
              </div>
              <div class="bar" style="height:200px;width:100%;display:block" id="chart6_barData">
                <!-- <v-EchartsBar :optionData="typeBar_data"></v-EchartsBar> -->
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
</div>

    <!-- 导出筛选 -->
    <v-modal :show="showExport" effect="fade">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">导出</h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <v-tree id="resourceTree" ref="tree1" cascade="true" :items="fieldsToExport" :checkable="true"></v-tree>
      </div>
      <div slot="modal-footer" class="modal-footer">

        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showExport = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="exportTable">导出</button>
      </div>
    </v-modal>

  </div>
</template>
<script>
import { sAjax } from "../../../../assets/utils/utils";

export default {
  data() {
    return {
      showExport: false,
      fieldsToExport: [
        { title: '全部', id: '1', checked: true },
        { title: '就业统计(校级维度)', id: '2', checked: true },
        { title: '就业统计(学院维度)', id: '3', checked: true },
        { title: '就业统计(专业维度) ', id: '4', checked: true },
      ],
      styleObj: {
        width: '98%'
      },
      schoolName: '',
      isFull: false,
      dataList: [],
      dataListOfSign: [],
      dataListOfEmploy: [],
      curDataList: 'employ',//当前展示就业率 'sign'签约率
      chart1_obj: null,
      chart1_pieData: { title: '', legendData: [], seriesData: [] },
      chart2_pieData: { title: '', legendData: [], seriesData: [] },
      chart3_barData: {},
      charts_typeData: {},
      chart4_barData: {},
      typeBar_data: {},
      loading: false,
      barList: [],
      majorBarList: [],
      tooltipOptions: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      marjorType: [],
      collegeList: [],
      selectMajor: '',
      selectMajorValue: '',
      selectMajor_pie: '',
    }
  },
  methods: {
    getChartData() {
      this.loading = true
      let url = "/api/employment/statistics/getGraduateEmployStatistics";
      sAjax({
        url: url,
        type: "get",
        success: data => {
          if (data.state) {
            if (data.data) {
              let info = data.data;
              this.dataList = info.unitEmployedPart
              //   console.log(this.dataList)
              this.dataListOfEmploy = info.unitEmployedPart
              this.dataListOfSign = info.unitSignedPart
              if(!this.dataListOfEmploy&&!this.dataListOfSign) {
                 this.loading = false
                return 
              }
              this.chart1_obj = {
                employedTotal: info.employedTotal, //就业人数
                signedTotal: info.signedTotal, //已签约人数
                employedProbability: info.employedProbability, //就业率
                signedProbability: info.signedProbability, //签约率
                studentTotal: info.studentTotal,//学生总数,
                teacherTrainingTotal: info.teacherTrainingTotal,//师范生总人数
                unTeacherTrainingTotal: info.unTeacherTrainingTotal,//非师范生总人数
                totalNum: [info.teacherTrainingTotal, info.unTeacherTrainingTotal, info.undergraduateTotal, info.masterTotal, info.doctorTotal],
                // total_un_Num: []
              };
              this.bar1_obj = {

              };
              if (info.employStudentTypeProbabilityPart && info.employEducationLevelProbabilityPart) {
                this.bar1_obj = {
                  employStudentTypeProbabilityPart: info.employStudentTypeProbabilityPart[0].concat(info.employEducationLevelProbabilityPart[0]),
                  employStudenTotal_sign: info.employStudentTypeProbabilityPart[1].concat(info.employEducationLevelProbabilityPart[1]),
                  employStudenTotal_employ: info.employStudentTypeProbabilityPart[2].concat(info.employEducationLevelProbabilityPart[2]),
                  qianyueshu: [
                    info.employStudentTypeProbabilityPart[1][0],
                    info.employStudentTypeProbabilityPart[1][1],
                    info.employEducationLevelProbabilityPart[1][0],
                    info.employEducationLevelProbabilityPart[1][1],
                    info.employEducationLevelProbabilityPart[1][2]
                  ],
                  feishifanshengNum: info.employStudentTypeProbabilityPart[2],//数组[就业人数,签约人数]
                  jiuyerenshu: [
                    info.employStudentTypeProbabilityPart[2][0],
                    info.employStudentTypeProbabilityPart[2][1],
                    info.employEducationLevelProbabilityPart[2][0],
                    info.employEducationLevelProbabilityPart[2][1],
                    info.employEducationLevelProbabilityPart[2][2]
                  ]
                };
              } else {
                this.bar1_obj = {}
              }
              let arr = []
              //   console.log(this.chart1_obj.totalNum)
              //   console.log(this.bar1_obj.qianyuerenshu)
              let myChart = this.$echarts.init(document.getElementById("chart_example"));
              setTimeout(() => {


                this.chart1_pieData = {
                  title: "",
                  tooltip: {
                    trigger: 'item',
                    // "{a} <br/>{b} : {c} ({d}%)"
                    formatter: function (params) {
                      return `${params.name}: ${Math.round(params.value * 100)}%`
                    }

                  },
                  grid: {
                    bottom: '3%',
                    containLabel: true
                  },
                  series: [
                    {
                      name: "就业情况",
                      type: "liquidFill",
                      avoidLabelOverlap: false,
                      radius: '80%',
                      center: ['50%', '45%'],
                      backgroundStyle: { color: '#fff', borderColor: '#1daaeb', borderWidth: 2, },//球状的背景颜色
                      // radius: ['50%','80%'],
                      // center: ['50%','45%'],
                      data: [
                        {
                          value: (this.chart1_obj.employedTotal / this.chart1_obj.studentTotal),
                          // value: 0.5,
                          name: "就业人数",
                          itemStyle: {
                            color: '#419DFF'
                          }
                        },
                        {
                          //   value: 0.5,
                          value: (this.chart1_obj.studentTotal - this.chart1_obj.employedTotal) / this.chart1_obj.studentTotal,
                          name: "未就业人数",
                          itemStyle: {
                            color: '#B3D8FF'
                          }

                        }
                      ],

                      itemStyle: { color: "#fff" },//波线的阴影
                      backgroundStyle: { color: '#fff' },//球状的背景颜色
                      label: {
                        normal: {
                          textStyle: {
                            fontSize: 12
                          }
                        },
                        // show: true, //不能对水波图设置事件
                      },
                    }
                  ],
                  color: ["#5A77FF", "#CED9FB"]
                };
                myChart.resize();//直接加这句即可
                myChart.setOption(this.chart1_pieData);

                let chart2_pieData = this.$echarts.init(document.getElementById("chart2_pieData"));
                this.chart2_pieData = {
                  title: "",
                  tooltip: {
                    trigger: 'item',
                    // "{a} <br/>{b} : {c} ({d}%)"
                    formatter: function (params) {
                      return `${params.name}: ${Math.round(params.value * 100)}%`
                    }

                  },
                  visualMap: {
                    show: false,
                    min: 80,
                    max: 600,
                    inRange: {
                      colorLightness: [0, 1]
                    }
                  },
                  grid: {
                    bottom: '3%',
                    containLabel: true
                  },
                  series: [
                    {
                      name: "就业情况",
                      type: "liquidFill",
                      avoidLabelOverlap: false,
                      radius: '80%',
                      center: ['50%', '45%'],
                      backgroundStyle: { color: '#fff', borderColor: '#1daaeb', borderWidth: 2, },
                      data: [
                        {
                          value: this.chart1_obj.signedTotal / this.chart1_obj.studentTotal,
                          name: "签约人数",
                          itemStyle: {
                            color: '#419DFF'
                          }
                        },
                        {
                          value: (this.chart1_obj.studentTotal - this.chart1_obj.signedTotal) / this.chart1_obj.studentTotal,
                          name: "未签约人数",
                          itemStyle: {
                            color: '#B3D8FF'
                          }
                        }
                      ],
                      itemStyle: { color: "#fff" },//波线的阴影
                      backgroundStyle: { color: '#fff' },//球状的背景颜色
                      label: {
                        normal: {
                          textStyle: {
                            fontSize: 12
                          }
                        },
                        // show: true, //不能对水波图设置事件
                      },
                    }
                  ],
                  // color: ["#765AFF", "#B4B8FF"]
                };
                chart2_pieData.resize();//直接加这句即可
                chart2_pieData.setOption(this.chart2_pieData);
              }, 800)
              //   console.log(this.chart1_pieData)


              let chart3_barData = this.$echarts.init(document.getElementById("chart3_barData"));
              let valueList = []
              let valueList_2 = []
              for (let i = 0; i < this.bar1_obj.employStudenTotal_sign.length; i++) {
                let value = Number(this.bar1_obj.employStudenTotal_sign[i])
                valueList.push((value / this.chart1_obj.totalNum[i]).toFixed(2))
              }
              for (let i = 0; i < this.bar1_obj.employStudenTotal_employ.length; i++) {
                let value = Number(this.bar1_obj.employStudenTotal_employ[i])
                valueList_2.push((value / this.chart1_obj.totalNum[i]).toFixed(2))
              }
              // console.log(valueList_2)
              this.chart3_barData = {
                title: "",
                tooltip: {
                  trigger: 'item',
                  formatter: (params) => {
                    let num = params.value
                    let total
                    let res
                    let allTotal = []
                    // if(params.dataIndex == 0 || params.dataIndex == 1) {
                    //     total = this.chart1_obj.totalNum[0]
                    //     res = ((params.value/total)*100).toFixed(2)+'%'
                    //     return `${params.seriesName}: ${res}<br/>`
                    // }else { 

                    total = this.chart1_obj.totalNum[params.dataIndex]
                    // res = ((params.value/total)*100).toFixed(2)+'%'

                    return `${this.bar1_obj.employStudentTypeProbabilityPart[params.dataIndex]}${params.seriesName}: ${params.value * 100}%<br/>`
                    // }

                  }
                },
                grid: {
                  left: '10%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true
                },
                legend: {
                  // x: 'right',
                  y: "top",
                  right: 30,
                  orient: "vertical"
                },
                xAxis: {
                  data: this.bar1_obj.employStudentTypeProbabilityPart,
                  type: 'category',
                  show: true
                },
                yAxis: {
                  type: "value",
                  show: true,

                  min: 0,
                  max: 1
                  // min: 0,
                },
                series: [
                  {
                    type: "bar",
                    name: '签约率',
                    barWidth: 20,//柱图宽度
                    // stack: '签约率',
                    //  barGap: '-100%',
                    label: {
                      normal: {
                        show: true,
                        position: 'right'
                      }
                    },
                    data: valueList,
                    itemStyle: {
                      color: '#419DFF',
                    }
                  },
                  {
                    type: "bar",
                    name: '就业率',
                    barWidth: 20,//柱图宽度
                    // stack: '签约率',
                    label: {
                      normal: {
                        show: true,
                        position: 'right'
                      }
                    },
                    barGap: '-100%',
                    data: valueList_2,
                    itemStyle: {
                      color: '#CED9FB'
                    },

                  },
                ]
              }
              chart3_barData.resize();//直接加这句即可
              chart3_barData.setOption(this.chart3_barData);
              this.loading = false
              this.barList = []
              // this.setBar2Select(info.employMajorProbabilityPart[0],info.employMajorProbabilityPart[1],info.employMajorProbabilityPart[2],info.employMajorProbabilityPart[3])
              // this.setTypePie(info.employTypePart[0],info.employTypePart[1])
              setTimeout(() => {
                this.loading = false
              }, 100)
            }



          } else {
            this.loading = false
            this.chart1_obj = null;
          }
          //   console.log(data);
        }
      });
    },
    setBar2Select(marjorList, total, qianyuelv, jiuyelv) {  //设置专业签约率、就业率
      // let majorList = info.employMajorProbabilityPart[0] //专业列表
      let majorBarList = {}
      let grid = {}
      if (window.innerWidth > 1500) {
        grid = {
          left: '10%',
          bottom: 20,
          top: 45
        }
      } else {
        grid = {
          left: '20%',
          bottom: 20,
          top: 45
        }
      }
      let chart4_barData = this.$echarts.init(document.getElementById("chart4_barData"));
      let width = 0
      let valueList_1 = []
      let valueList_2 = []
      for (let i = 0; i < qianyuelv.length; i++) {
        let value = Number(qianyuelv[i])
        valueList_1.push((value / total[i]).toFixed(2))
      }
      for (let i = 0; i < jiuyelv.length; i++) {
        let value = Number(jiuyelv[i])
        valueList_2.push((value / total[i]).toFixed(2))
      }
      //   console.log(valueList_1, valueList_2)
      majorBarList = {
        title: "",
        tooltip: {
          trigger: 'item',
          formatter: (params) => {
            let num = params.value
            let index = params.dataIndex
            // let total = info.employMajorProbabilityPart[1][i]
            // let res = ((params.value/total[index])*100).toFixed(2)+'%'
            return ` ${params.value * 100}人<br/>${params.seriesName}:${params.value * 100}%`
          }
        },
        xAxis: {
          type: 'value',
          show: true,
          min: 0,
          max: 1
        },
        grid: grid,
        legend: {
          y: "top",
          top: 3,
          right: 30,
          orient: "horizontal"
        },
        yAxis: {
          type: "category",
          show: true,
          data: marjorList,
        },

        series: [
          {
            type: "bar",
            name: '签约率',
            barWidth: 20,//柱图宽度
            // stack: '签约率',
            label: {
              normal: {
                show: true,
                position: 'right'
              }
            },
            barGap: '-100%',
            data: valueList_1,
            itemStyle: {
              color: '#419DFF',
            }
          },
          {
            type: "bar",
            name: '就业率',
            barWidth: 20,//柱图宽度
            // stack: '签约率',
            label: {
              normal: {
                show: true,
                position: 'right'
              }
            },
            data: valueList_2,
            itemStyle: {
              color: '#CED9FB'
            },

          },
        ]      }
      //   console.log(majorBarList)
      let autoHeight = marjorList.length * 40 + marjorList.length * 30
      //   console.log(autoHeight)
      chart4_barData.getDom().style.height = autoHeight + "px";
      chart4_barData.resize();//直接加这句即可
      chart4_barData.setOption(majorBarList);

    },
    setTypePie(typeList, dataList) {   //签约就业类型分部
      let dataArr = []

      for (let i = 0; i < typeList.length; i++) {
        dataArr.push({
          name: typeList[i] + dataList[i],
          value: dataList[i]
        })
      }
      let chart5_pieData = this.$echarts.init(document.getElementById("chart5_pieData"));
      let chart6_barData = this.$echarts.init(document.getElementById("chart6_barData"));
      this.charts_typeData = {
        title: "",
        // tooltip: {
        //   trigger: 'item',
        //   formatter: "{a} <br/>{b} : {c} ({d}%)"
        // },
        // legend: {
        //   // x: 'right',
        //   y: "top",
        //   right: 30,
        //   orient: "vertical"
        // },
        series: [
          {
            name: "就业情况",
            type: "pie",
            radius: "80%",
            center: ['35%', '53%'],
            data: dataArr,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            },
            label: {
              normal: {
                // position: "inner"
                show: true,
                position: 'right'
              },
              textStyle: {
                fontSize: 10
              }
            },
            labelLine: {
              normal: {
                show: true
              }
            }
            // labelLine: {
            //   normal: {
            //     show: true,
            //     lineStyle: {
            //       color: 'rgba(255, 255, 255, 0.3)'
            //     },
            //   }
            // }
          }
        ],
        color: ["#FE6899", "#B4B8FF", "#419DFF", "#69D8C1", "#FFC963"]
      };
      //   console.log("charts_typeDatadasdsadasdadas", this.charts_typeData)
      //   let autoHeight = this.$refs.chart1.offsetHeight
      // chart5_pieData.getDom().style.height = autoHeight/2 + "px";
      chart5_pieData.resize();//直接加这句即可
      chart5_pieData.setOption(this.charts_typeData);
      this.typeBar_data = {
        title: "",
        xAxis: {
          type: 'category',
          data: typeList,
          show: true
        },
        yAxis: {
          type: 'value',
          show: true
        },
        grid: {
          left: '10%',
          bottom: 30,
          top: 15,
        },
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c}"
        },
        series: [
          {
            name: '就业情况',
            type: "bar",
            barWidth: 20,
            data: dataArr,
            itemStyle: {
              emphasis: {
                shadowBlur: 2,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              },
              normal: {
                color: function (params) {
                  let colorList = ["#FE6899", "#B4B8FF", "#419DFF", "#69D8C1", "#FFC963"]
                  return colorList[params.dataIndex]
                }
              }
            },
            label: {
              normal: {
                show: true,
                position: 'right'
              }
            }
            // label: {
            //   normal: {
            //     textStyle: {
            //       color: 'rgba(255, 255, 255, 0.3)'
            //     }
            //   }
            // },
          }
        ]
      }
      // chart6_barData.getDom().style.height = (autoHeight-40)/2 + "px";
      chart6_barData.resize();//直接加这句即可
      chart6_barData.setOption(this.typeBar_data);
    },
    getMajor() {
      let url = `/api/system/major/getMajorByCollegeCodeS?collegeCodeS=${this.selectMajorValue}`
      // let url = '/api/employment/system/findDictByTypeName?typeName=专业'
      sAjax({
        url: url,
        type: 'get',
        success: (data) => {
          if (data.state) {
            if (data.data.length) {
              this.marjorType = data.data
              this.selectMajor_pie = data.data[0].label
              this.majorSelect_pie(this.selectMajor_pie)
            } else {
              this.marjorType = []
              this.selectMajor_pie = ''
            }

          }
        }

      })
    },
    getUnitList() {
      let url = '/api/employment/system/getUnitList'
      sAjax({
        url: url,
        type: 'get',
        success: (data) => {
          if (data.state) {
            if (data.data.length) {
              this.selectMajor = data.data[0].label
              this.selectMajorValue = data.data[0].value
              this.collegeList = data.data
              this.marjorTypeChange(this.selectMajor)
            } else {
              this.collegeList = []
              this.selectMajor = ''
              this.selectMajorValue = ''
            }

          }
        }

      })
    },

    // marjorTypeChange(val) {
    //     let url = '/api/employment/statistics/getEmployStatisticsProbabilityByMajor?major='+val
    //     sAjax({
    //         url: url,
    //         type: 'get',
    //         success: (data) => {
    //             if(data.state) {
    //                 let info = data.data
    //                 if(info) {
    //                     this.setBar2Select(info[0],info[1],info[2],info[3])
    //                 }else {
    //                     this.majorBarList = []
    //                     this.$message.info(val+'暂无数据')
    //                 }

    //             }
    //         }
    //     })
    // },
    marjorTypeChange(val) {
      let obj = this.collegeList.find(item => item.label == val)
      this.selectMajorValue = obj.value
      this.getMajor()
      let url = '/api/employment/statistics/getEmployStatisticsProbabilityByUnit?unit=' + val
      sAjax({
        url: url,
        type: 'get',
        success: (data) => {
          if (data.state) {
            let info = data.data
            if (info) {
              this.setBar2Select(info[0], info[1], info[2], info[3])
            } else {
              this.setBar2Select([], [], [], [])
              this.$message.info(val + '暂无数据')
            }

          }
        }
      })
    },
    majorSelect_pie(val) {
      let url = '/api/employment/statistics/getEmployStatisticsCountByMajor?major=' + val
      sAjax({
        url: url,
        type: 'get',
        success: (data) => {
          if (data.state) {
            let info = data.data
            if (info) {
              this.setTypePie(info.employTypePart[0], info.employTypePart[1])
            } else {
              // this.majorBarList = []
              this.setTypePie([], [])
              this.$message.info(val + '暂无数据')
            }

          }
        }
      })
    },
    changeDataList() {
      if (this.curDataList == 'sign') {
        this.curDataList = 'employ'
        this.dataList = this.dataListOfEmploy
      } else {
        this.curDataList = 'sign'
        this.dataList = this.dataListOfSign
      }
    },
    showExportModel() {
      this.showExport = true
    },
    exportTable() {
      let checkedItems = this.$refs.tree1.getChecked();
      let params = []
      let url = ''
      if (checkedItems.length) {
        for (let i = 0; i < checkedItems.length; i++) {
          params.push(checkedItems[i].id)
        }
      }
      var data = params.join(',')
      url = `/downloads/employment/statistics/excelOutEmploymentSituation?needPartList=${data}`
      window.location.href = url;
    },
    getSchooldInfo() {
      let url = '/api/employment/platform/getSchoolInfo'
      sAjax({
        url: url,
        type: 'get',
        success: (data) => {
          if (data.state) {
            this.schoolName = data.data.name
          } else {
            this.schoolName = ''
          }
        }
      })
    },
    changeFull() {
      this.isFull = !this.isFull
      this.$emit('toPage', '/manage/statistics', undefined, !this.isFull)
      this.getChartData();
    }
  },

  created() {


  },
  mounted() {
    setTimeout(() => {
      this.getChartData();
    }, 100)
    this.$nextTick(() => {

      this.getSchooldInfo();
      // this.getMajor(); 
      this.getUnitList()
      let h = this.$refs.part2.offsetHeight
      //   this.$refs.part1.style.height = h+ 100 + 'px'
    })
  }
};
</script>
<style lang="less" scoped>
#statistics {
  .noData {
    font-size: 24px;
    line-height: 200px;
  }
  padding-top: 65px;
  .part {
    .content {
      margin-top: 0;
    }
  }
  .btns {
    position: absolute;
    right: 30px;
    top: 0.26rem;
    a {
      cursor: pointer;
      display: inline-block;
      margin-right: 10px;
      width: 80px;
      height: 32px;
      line-height: 32px;
      background: #edeffc;
      border-radius: 4px;
      text-align: center;
      i {
        display: inline-block;
        vertical-align: middle;
        background: url("/static/image/employment/download.png") no-repeat;
        width: 16px;
        height: 16px;
        background-size: contain;
        margin-right: 2px;
      }
      span {
        vertical-align: middle;
        color: #298df7;
      }
    }
    .full {
      cursor: pointer;
      i {
        width: 18px;
        height: 18px;
        margin-right: 2px;
        background: url("/static/image/employment/toFull.png") no-repeat;
        background-size: contain;
      }
      i.isFull {
        background: url("/static/image/employment/cancleFull.png") no-repeat;
        background-size: contain;
      }
    }
  }

  .boxContainer {
    display: flex;
    padding: 20px 0;
    overflow: hidden;
  }
  position: relative;
  margin-left: 30px;
  .flex {
    display: flex;
  }
  h3.schoolName {
    position: absolute;
    top: 0.15rem;
    margin: 0;
    line-height: 1;
    width: 200px;
    left: 50%;
    margin-left: -100px;
    text-align: center;
    display: inline-block;
    font-size: 0.16rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .bg {
    position: absolute;
    top: 0;
    left: -10px;
    img {
      width: 100%;
    }

    // background: url('/static/image/employment/statisbg1.png') no-repeat;
  }
  .bgBottom {
    position: absolute;
    bottom: 0;
    left: -15px;
    img {
      width: 100%;
    }
  }

  .part1 {
    background: #fff;
    width: 230px;
    //   overflow-x: hidden;
    left: 0;
    top: 20px;
    h1 {
      padding: 0 10px;
      line-height: 50px;
      position: relative;
      a {
        position: absolute;
        z-index: 10;
        right: 10px;
        cursor: pointer;

        i {
          width: 20px;
          height: 20px;
          background: url("/static/image/employment/change.png") no-repeat;
          background-size: contain;
        }
        span {
          vertical-align: middle;
          color: #298df7;
        }
      }
    }
    .list {
      width: 230px;
      position: relative;
      overflow: hidden;
      height: 100%;
      ul {
        position: absolute;
        overflow-y: scroll;
        top: 0;
        width: 100%;
        left: 18px;
        padding: 0 10px 0 0;
      }
      li {
        overflow: hidden;
        width: 100%;
        line-height: 48px;
        border-bottom: 1px solid #f2f3f7;
        .collegeName {
          max-width: 58%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      li.title {
        background: #f2f3f7;
        border-bottom: none;
      }
    }
  }
  h1,
  h2 {
    margin: 0;
    padding: 0;
    font-size: 14px;
    font-weight: bold;
  }
  ul {
    margin: 0;
  }
  li {
    list-style: none;
  }
  .part {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    & > div {
      display: inline-block;
      h1 {
        line-height: 50px;
      }
    }
    .bottom {
      display: block;
      margin-top: 10px;
      width: 49%;
      h1 {
        float: left;
      }
      .majorSelect {
        float: right;
        line-height: 50px;
      }
    }

    .part2,
    .part3,
    .bottom {
      .chart1 {
        background: #fff;
        padding: 0 10px 10px;
        margin-left: 10px;
        .title {
          overflow: hidden;
        }
        // height: 100%;
        .left {
          float: left;
          text-align: center;
          width: 50%;
          & > h2 {
            margin: 20px 0 10px 0;
          }
        }
        .right {
          float: right;
          width: 50%;
          text-align: center;
          & > h2 {
            margin: 20px 0 10px 0;
          }
        }
        h1 {
          & > span {
            color: #ffb731;
            font-size: 24px;
          }
          & > p {
            line-height: 1;
            margin: 0;
          }
        }
      }
    }
  }
}
.bar {
  position: relative;
  margin-top: 20px;
  h2 {
    position: absolute;
    right: 0;
    display: flex;
    z-index: 10;
    font-weight: normal;
    font-size: 12px;
    font-weight: normal;
    p {
      margin-right: 10px;
      i {
        background: #419dff;
        border-radius: 3px;
        vertical-align: middle;
        height: 10px;
        width: 20px;
        margin-right: 5px;
      }
    }
    p.employmentPercent {
      i {
        background: #ced9fb;
      }
    }
  }
}

@media screen and (min-width: 1200px) and (max-width: 1500px) {
  .bottom.isFullBottom {
    width: 98%;
  }
  #statistics {
    .left {
      margin-left: 10px;
    }
    .teacher {
      width: 100%;
    }
  }
  // #statistics .bg {
  //     top: -25px!important;
  // }
  #statistics .boxContainer {
  }
  // h3.schoolName  {
  //   top: -15px!important;
  // }
}
@media screen and (min-width: 1500px) and (max-width: 4000px) {
  .bottom {
    width: 49%;
  }
  #statistics {
    // .teacher {
    //     width: 50%;
    //     display: inline-block;
    // }
  }
  // #statistics .bg {
  //     top: -65px!important;
  // }
  #statistics .boxContainer {
    padding-top: 30px !important;
  }
  #statistics .btns {
    right: 50px !important;
  }
  h3.schoolName {
    //   top: -40px!important;
    width: 400px !important;
    margin-left: -200px !important;
  }
}
.content /deep/ .bar {
  background: #fff;
  .chart {
    display: inline-block;
    width: 19%;
  }
}
.bottom .content /deep/ .bar {
  background: #fff;
  .chart {
    display: inline-block;
    width: 80%;
    height: 50px;
  }
  h2 {
    justify-content: center;
    position: static;
    margin-top: 30px !important;
  }
}
.bottom.h100 .content /deep/ .bar {
  .chart {
    display: inline-block;
    width: 100%;
    height: 100%;
  }
}
.bottom .content #chart4_barData /deep/ div:first-child {
  width: 100% !important;
}
</style>
