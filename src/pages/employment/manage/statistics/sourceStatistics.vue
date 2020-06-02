<template>
    <div id="source">
      <p class="noData" v-if="graduatesTotal == null">暂无统计数据</p>
      <div class="sourceBox" v-else>
        <div class="bg"><img src="/static/image/employment/statisbg1.png" alt=""></div>
        <div class="bgBottom"><img src="/static/image/employment/statisbg.png" alt=""></div>
        <h3 class="schoolName" :title="schoolName+'毕业生就业大数据'">{{schoolName+'毕业生就业大数据'}}</h3>
        <div class="btns">
            <a class="download" @click="download"><i></i><span>导出</span></a>
            <a class="full" @click="changeFull"><i :class="{'isFull':isFull}"></i><span>{{isFull?'退出全屏':'全屏'}}</span></a>
        </div>
        <div class="boxContainer">
            <div class="left" id='left' ref="left">
                <div class="part1">
                    <h1>学院毕业生生源分布</h1>
                    <div class="content">
                         <div class="bar" style="width:100%;display:block" id="chart1_barData">
                                <!-- <v-EchartsBar :optionData="chart1_barData"></v-EchartsBar> -->
                        </div>
                    </div>
                </div>
            </div>
            <div class="right" ref='right' id='right'>
                <div class="part1">
                     <h1>总览</h1>
                    <div class="student">
                        <div class="one">
                            <p>毕业生总人数</p>
                            <h2><span>{{graduatesTotal}}</span> 人</h2>
                        </div>
                        <div class="two">
                            <div class="content">
                                <div class="chartPie1" id='chart2_pieData' style="height:200px;width:100%;display:inline-block">
                                    <!-- <v-PieChart :optionData="chart2_pieData"></v-PieChart> -->
                                    <!-- <v-EchartsBar :optionData="chart1_barData"></v-EchartsBar> -->
                                    
                                </div>
                                <h2 style="text-align: center;">性别分布</h2>
                            </div>
                        </div>
                        <div class="three">
                            <div class="content">
                                <div class="chartPie1" id='chart3_pieData' style="height:200px;width:100%;display:inline-block">
                                    <!-- <v-PieChart :optionData="chart3_pieData"></v-PieChart> -->
                                    <!-- <v-EchartsBar :optionData="chart1_barData"></v-EchartsBar> -->
                                    
                                </div>
                                <h2 style="text-align: center;">培养层次分布</h2>
                            </div>
                        </div>
                        
                    </div> 

                    
                </div>
                <div class="map">
                       <h1>毕业生生源地分布</h1>
                      <div class="four">
                          <div class="content">
                              <div id="chart_example" :style="{width: '100%', height: '400px'}" ref="myEchart"></div>
                            </div>
                        </div>
                    </div>
            </div>
        </div>

</div>
        <v-modal :show="showExport" effect="fade">
        <div slot="modal-header" class="modal-header">
          <h5 class="modal-title">导出</h5>
        </div>
        <div slot="modal-body" class="modal-body">
          <v-tree
            id="resourceTree"
            ref="tree"
            cascade="true"
            :items="fieldsToExport"
            :checkable="true"
            :search="true"
          ></v-tree>
        </div>
        <div slot="modal-footer" class="modal-footer">
          
          <button
            type="button"
            class="btn cancel-btn clearBtnBorder"
            @click="showExport = false"
          >取消</button>
          <button
            type="button"
            class="btn submit-btn clearBtnBorder"
            @click="exportTable"
          >导出</button>
        </div>
      </v-modal>
    </div>
</template>
<script>
import { sAjax } from "../../../../assets/utils/utils";
// let echarts = require('echarts')
import "../../api/china.js" // 引入中国地图数据
export default {
  data() {
    return {
      showExport: false,
      schoolName:'',
      fieldsToExport:[],//导出字段列表
      chart1_barData: {},
      sourceObj: {}, //生源信息对象
      chart2_pieData: { title: "", legendData: [], seriesData: [] },
      chart3_pieData:{},
      graduatesTotal: 0,//毕业人数
      isFull: false,
    };
  },
  methods: {
    getSchooldInfo() {
        let url = '/api/employment/platform/getSchoolInfo'
        sAjax({
            url: url,
            type: 'get',
            success: (data) => {
                if(data.state) {
                    this.schoolName = data.data.name
                }else {
                     this.schoolName = ''
                }
            }
        })
    },
    getSource() {
      let url = "/api/employment/statistics/getGraduateBirthplaceStatistics";
      sAjax({
        url: url,
        type: "get",
        success: data => {
          if (data.state) {
            if (data.data) {
              this.sourceObj = data.data;
              
              this.graduatesTotal = data.data.graduatesTotal
              if(!this.graduatesTotal) {
                return 
              }
              let collegeList = this.sourceObj.unitEducationLevelPart[0];
              let total = this.sourceObj.unitEducationLevelPart[1];
              let benkeArr = this.sourceObj.unitEducationLevelPart[2];
              let shuoshiArr = this.sourceObj.unitEducationLevelPart[3];
              let boshiArr = this.sourceObj.unitEducationLevelPart[4];
              let eduArr = this.sourceObj.educationLevelPart[0]; //培养层次
              let sexPart = this.sourceObj.sexPart;
              let eduOfStudent = this.sourceObj.educationLevelPart[0]
              let provinceGraduatesPart = this.sourceObj.provinceGraduatesPart || []
              let dataAry = [];
              let dataOfStudent = []
              let colorList = ["#A3D0FF", "#54A7FF", "#1A87FB"];
            //   学院人数分布数据
              for (let i = 0; i < collegeList.length; i++) {
                let studentTypeData = [];
                studentTypeData.push(benkeArr[i], shuoshiArr[i], boshiArr[i]);
                dataAry.unshift({
                  name: eduArr[i],
                  type: "bar",
                  // stack: "总量",
                  barGap: '-100%',
                  barWidth : 20,//柱图宽度
                  itemStyle:{
                      normal:{
                          color:colorList[i],
                      }
                  },
                  label: {
                    normal: {
                      show: true,
                      color: '#000',
                      formatter: function(num) {
                        if(num.value == 0) {
                          return ''
                        }
                      }
                      // position: ['50%','50%'],
                    }
                  },
                  data: this.sourceObj.unitEducationLevelPart[i + 2]
                });
              }
          // 毕业生培养层次分布
              for(let i = 0;i<eduOfStudent.length;i++) {
                dataOfStudent.push({
                    value: Number(this.sourceObj.educationLevelPart[1][i]),
                    name: eduOfStudent[i]
                })
              }
              let chart1_barData = this.$echarts.init(document.getElementById("chart1_barData"));
              this.chart1_barData = {
                title: "",
                legend: {
                  // x: 'right',
                  y: "top",
                  right: 50,
                  orient: "horizontal"
                },
                tooltip: {
                  trigger: "item",
                  formatter: function(params) {
                    let index = params.dataIndex;
                    let componentIndex = params.componentIndex;
                    let res =
                      (params.value / total[index] * 100).toFixed(2) + "%";
                    return `${collegeList[index]}-${params.seriesName}:${
                      params.value
                    }</br>${res}`;
                  }
                },
                grid: {
                left: '25%',
                bottom: 30,
                top: 50,
                },
                // itemStyle: {
                //   normal: {
                //     label: {
                //       show: true,
                //       position: top
                //     },
                //   }
                // },
                xAxis: {
                  type: "value",
                  show: true,
                },
                yAxis: {
                  type: "category",
                  data: collegeList,
                  show: true,
                  containLabel: true,
                  inverse: true,
                  scale: true,
                  // axisLabel : {
                  //   formatter: function(value) {
                  //     if(value.length>5) {
                  //       return value.substring(0, 4) + '...';
                  //     }else {
                  //       return value
                  //     }
                  //   }
                  // }
                },

                series: dataAry
              };
              let autoHeight = this.$refs.right.offsetHeight
              chart1_barData.getDom().style.height = autoHeight-150 + "px";
            chart1_barData.resize();//直接加这句即可
            chart1_barData.setOption(this.chart1_barData);

            let chart2_pieData = this.$echarts.init(document.getElementById("chart2_pieData"));
              this.chart2_pieData = {
                title:'',
                tooltip: {
                  trigger: "item",
                  formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series: [
                  {
                    name: "性别分布",
                    type: "pie",
                    radius: "80%",
                    center: ["50%", "50%"],
                    data: [
                      {
                        value: sexPart[1][0],
                        name: "男"
                      },
                      {
                        value: sexPart[1][1],
                        name: "女"
                      }
                    ],
                    itemStyle: {
                      emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: "rgba(0, 0, 0, 0.5)"
                      }
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'inner',
                            formatter: (value) => {
                              return `${value.name}: ${value.percent}%`
                            }
                        }
                    },
                    labelLine: {
                      normal: {
                        show: false,
                      }
                    }
                  }
                ],
                color: ["#FF5A87", "#3AA0FF"]
              };
            chart2_pieData.resize();//直接加这句即可
            chart2_pieData.setOption(this.chart2_pieData);
              
             let chart3_pieData = this.$echarts.init(document.getElementById("chart3_pieData")); 
              this.chart3_pieData = {
                title:'',
                tooltip: {
                  trigger: "item",
                  formatter: "{a} <br/>{b} : {c}({d}%)"
                },
                series: [
                  {
                    name: "培养层次分布",
                    type: "pie",
                    avoidLabelOverlap: false,
                    radius: ['50%', '80%'],
                    center: ["50%", "50%"],
                    data: dataOfStudent,
                    itemStyle: {
                      emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: "rgba(0, 0, 0, 0.5)"
                      }
                    },
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '14',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                  }
                ],
                color: ["#FF3998", "#FFB731","#48B792","#419DFF"]
              };
            chart3_pieData.resize();//直接加这句即可
            chart3_pieData.setOption(this.chart3_pieData);
              
            for(let i = 0;i<provinceGraduatesPart.length;i++) {
              provinceGraduatesPart[i].value = Number(provinceGraduatesPart[i].value)
            }
    let myChart = this.$echarts.init(document.getElementById("chart_example"));
    let option = {
        tooltip: {
            trigger: 'item',
            formatter: (params) => {
              if(params.value) {
                let percent = ((params.value/this.graduatesTotal)*100).toFixed(2)+'%'
                return `${params.name}: ${percent}`
              }else {
                 return `${params.name}暂无毕业生源`
              }
            } 
        },
        toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
        },
      visualMap: {
           type: 'piecewise',
           show: true,
            // min: 0,
            // max: this.graduatesTotal,
            pieces: [
              {gt: 0, lte:  Number((this.graduatesTotal*0.02).toFixed(2)), label: '生源占比<2%'},
              {gt: Number((this.graduatesTotal*0.02).toFixed(2)), lte:  Number((this.graduatesTotal*0.03).toFixed(2)-0.01), label: '生源占比>2%'},
              // {value: Number((this.graduatesTotal*0.02).toFixed(0)),color: '#B3D8FF',label: '生源占比>2%'},
              {gt: Number((this.graduatesTotal*0.03).toFixed(2)), lte:  Number((this.graduatesTotal*0.04).toFixed(2)-0.01), label: '生源占比>3%'},
              // {value: Number((this.graduatesTotal*0.03).toFixed(0)),color: '#8CC5FF',label: '生源占比>3%'},
              {gt: Number((this.graduatesTotal*0.04).toFixed(2)), lte:  Number((this.graduatesTotal*0.25).toFixed(2)-0.01), label: '生源占比>4%'},
              // {value: Number((this.graduatesTotal*0.04).toFixed(0)),color: '#66B1FF',label: '生源占比>4%'},
              {gt: Number((this.graduatesTotal*0.25).toFixed(2)), lte:  this.graduatesTotal, label: '生源占比>25%'},
              // {value: Number((this.graduatesTotal*0.25).toFixed(0)),color: '#409EFF',label: '生源占比>25%'},
              ]
              ,   
            right: 0,
            bottom: 5,
            realtime: false,
            itemWidth: 30,
            calculable: true,
            // formatter: function (value, value2) {
            //     return  value +'-'+ value2; // 范围标签显示内容。
            // },
            inRange: {
                color: ['#D9ECFF','#B3D8FF','#8CC5FF','#66B1FF','#409EFF']
            }
        },
    //   dataRange: {
    //     x: "left",
    //     y: "bottom",
    //     splitList: [
    //       { start: 1, end: 10, color: "#000" },
    //       { start: 11, end: 20, color: "red" },
    //       { start: 20, end: 30, color: "green" }
    //     ]
    //   },
      
      series: [
        {
          type: "map",
          // mapType: 'china'// mapType或者map都可以
          mapType: "china",
          top: 20,
          zoom: 1,
          itemStyle: {
          normal: {//未选中状态
              borderWidth:1,//边框大小
              borderColor:'#D9ECFF',
              areaColor: '#ddd',//背景颜色
              label: {
                  show: false//显示名称
              }
          },
          itemStyle: {

          },
          emphasis: {// 也是选中样式
                    borderWidth:2,
                    borderColor:'#fff',
                    areaColor: '#409EFF',
                    label: {
                        show: true,
                        textStyle: {
                            color: '#000'
                        }
                    }
                 }
      },
          data: provinceGraduatesPart
        }
      ]
    };
    setTimeout(() => {
      myChart.resize();//直接加这句即可
      myChart.setOption(option);
    },300)
            }
          }
        }
      });
    },
    changeFull() {
        this.isFull = !this.isFull
        this.$emit('toPage','/manage/sourceStatistics',undefined, !this.isFull)
        this.getSource();
    },
    download() {
      this.showExport = true
      this.fieldsToExport = [
          {title:'总览',id:'1',checked: false,children:[{title:'毕业生总人数',id:'1.1'},{title:'性别分布',id:'1.2'},{title:'学历分布',id:'1.3'}]},
          {title:'学院毕业生生源分布',id: '2',checked: false},
          {title:'毕业生生源分布',id: '3',checked: false},
        ]
    },
    exportTable() {
        let checkedItems = this.$refs.tree.getChecked();
        let params = []
        let url = ''
        if(checkedItems.length) {
          for(let i=0;i<checkedItems.length;i++) {
            params.push(checkedItems[i].id)
          }
        }else {
          return this.$message.error('请先选择要导出的字段')
        }
        let idList = ['1.1','1.2','1.3']
        for(let i = 0;i<params.length;i++)  {
          if(idList.indexOf(params[i]) >= 0) {
            params.push('1')
            break;
          }
        }
          var data = params.join(',')
          url = "/downloads/employment/statistics/excelOutBirthplace?needPartList=" + data 
        this.showExport = false
        window.location.href = url;
    },
  },
  created() {
    this.getSource();
    this.getSchooldInfo()
  },
  mounted() {
    this.$nextTick(() => {
      let h = this.$refs.right.offsetHeight
      this.$refs.left.style.height = h + 'px'
    })
  },
};
</script>
<style lang="less" scoped>
#source {
  .noData {
    font-size: 24px;
    line-height: 200px;
  }
  position: relative;
  margin-left: 30px;
  padding-top:65px;
  .btns {
        position:absolute;
        right: 30px;
        top: 0.26rem;
        
        a {
        cursor: pointer;
        display: inline-block;
        margin-right: 10px;
        width: 80px;
        height: 32px;
        line-height: 32px;
        background:#EDEFFC;
        border-radius:4px;
        text-align: center;
        i {
            display: inline-block;
            vertical-align: middle;
            background: url('/static/image/employment/download.png') no-repeat;
            width: 16px;
            height: 16px;
            background-size: contain;
            margin-right: 2px;
        }
        span {
            vertical-align: middle;
            color: #298DF7
        }
    }
    .full {
            cursor: pointer;
            i {
                width: 18px;
                height: 18px;
                margin-right: 2px;
                background: url('/static/image/employment/toFull.png') no-repeat;
                background-size: contain;
            }
            i.isFull {
                background: url('/static/image/employment/cancleFull.png') no-repeat;
                 background-size: contain;
            }
        }
    }
  h3.schoolName {
        position: absolute;
        top: 0.12rem;
        margin: 0;
        line-height: 1;
        width: 250px;
        left: 50%;
        margin-left: -125px;
        text-align: center;
        display: inline-block;
        font-size:  0.16rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
  h1,
  h2 {
    margin: 0;
    padding: 0;
    font-size: 14px;
    font-weight: bold;
    line-height: 50px;
  }
  .flex {
    display: flex;
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
  .boxContainer {
    padding-bottom: 20px;
    overflow: hidden;
    & > div {
      display: inline-block;
      float: left;
      margin-top: 15px;
    }
    .left {
      width: 40%;
      background: #fff;
    }
    .right {
      width: 58%;
      .student {
        display: flex;
        &>div {
            width: 33%;
        }
        .one {
            padding: 20px 0 0 0;
            text-align: center;
          margin-top: 50px;
            p {
              font-weight: bold;
              font-size: 18px
            }
            h2 {
                line-height: 100px;
                span {
                    color: #FFB731;
                    font-size: 32px;
                }
            }
        }
      }
      .map {
        background: #fff;
        margin-top: 10px;
        padding: 0 10px 10px;
        margin-left: 10px;
      }
    }
    .part1 {
      background: #fff;
      padding: 0 10px 10px;
      margin-left: 10px;
      height: 100%;
    }
    .content /deep/ .bar {
      background: #fff;
    }
  }
 
}
 @media screen and (min-width:1200px) and (max-width:1500px){
   
    // h3.schoolName  {
    //   top: -15px!important;

}
@media screen and (min-width:1500px) and (max-width:4000px){
   
    #source {
       padding-top: 80px!important;
    }
     #source .btns {
        right: 50px!important;
    }
    h3.schoolName  {
      width: 400px!important;
      margin-left: -200px!important;
    }
    // #statistics .boxContainer {
    //     padding-top: 30px!important;
    // }
}
</style>
