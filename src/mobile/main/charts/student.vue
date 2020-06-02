<template>
    <div id='studentChart'>
        <div class="backIcon" @click="$emit('backToParent')">
            <i class="maticon back-icon" v-html="icons('navigate_before')" ></i>
        </div>
        <div class="topInfo">
            <div class="info">
                <div class="left">
                    <i></i>
                    <p>
                        <span>在校学生</span>
                        <em>{{new Date().toLocaleDateString().replace(/\//g,'.')}}</em>
                    </p>
                </div>
                <div class="right">
                    <span>{{allCount.toFixed(0).toString().replace(/(\d)(?=(?:\d{3})+$)/g,"$1,")}}</span> 人
                </div>
            </div>
        </div>

        <div class="charts">
            <div class="eduLevel">
                <h1><i></i><span>培养层次</span></h1>
                <div class="content">
                    <div id="eduBar" ref="eduBar" style="height: 5rem;"></div>
                </div>
            </div>

            <div class="eduLevel">
                <h1><i></i><span>年级</span></h1>
                <div class="content">
                    <div id="grade" ref="grade" style="height: 5rem;"></div>
                </div>
            </div>

            <div class="college">
                <h1><i></i><span>学院</span></h1>
                <div class="content">
                    <div id="college" ref="college"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
// import echarts from 'echarts'
import { request } from "../../../assets/utils/utils.js";
export default {
    props: ['allCount'],
    data() {
        return {
            educationCount: [],
            educationName:[],
            gradeCount: [],
            gradeName: [],
            collegeCount: [],
            collegeName: [],
        }
    },
    methods: {
        getData() {
            let url = '/api/document/statistic/getStudentStatistic'
            request(url,{},'post').then(data => {
                if(data.state) {
                    if(data.data&&data.data.educationLevel.length) {
                        // 培养层次
                        let eduList = data.data.educationLevel
                        for(let i = 0;i<eduList.length;i++) {
                            const {name,count} = eduList[i]
                            this.educationCount.push(count)
                            this.educationName.push(name)
                        }
                    }
                    if(data.data&&data.data.grade.length) {
                        // 年级
                        let gradeList = data.data.grade
                        for(let i = 0;i<gradeList.length;i++) {
                            const {name,count} = gradeList[i]
                            this.gradeCount.push(count)
                            this.gradeName.push(name)
                        }
                    }
                    if(data.data&&data.data.college.length) {
                        // 学院
                        let collegeList = data.data.college
                        for(let i = 0;i<collegeList.length;i++) {
                            const {name,count} = collegeList[i]
                            this.collegeCount.push(count)
                            this.collegeName.push(name)
                        }
                    }
                    this.initCharts()
                }
            })
        },
        initCharts() {
            let eduBar = this.$echarts.init(document.getElementById("eduBar"));
            let grade = this.$echarts.init(document.getElementById("grade"));
            let college = this.$echarts.init(document.getElementById("college"));
            let option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            
                        type: 'shadow'       
                    }
                },
                xAxis: {
                    type: 'category',
                    data: this.educationName,
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
                    data: this.educationCount,
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
            let optionGrade = {
                tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                 xAxis: {
                    type: 'category',
                    data: this.gradeName,
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
                    data: this.gradeCount,
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
                                color: '#EA5455'
                                },
                                {
                                offset: 1,
                                color: '#FEB692'
                                }
                            ]
                            )
                        }
                    }
                }]
            }
            grade.resize();//直接加这句即可
            grade.setOption(optionGrade);
            let optionCollege = {
                xAxis: {
                    type: 'value',
                    
                    axisLabel : {
                        color: '#606266',
                        margin: 12,
                        show: false
                    },
                    axisLine: {
                        show:false
                    },
                    axisTick:{
                        show:false
                    },
                    splitLine: {
                        lineStyle: {
                            type: 'dashed'
                        }
                    }
                },
                yAxis: {
                    axisLine: {
                        show:false
                    },
                    axisTick:{
                        show:false
                    },
                    
                    type: 'category',
                    data: this.collegeName,
                    axisLabel : {
                        color: '#909399',
                        formatter:function(val){
                        var strs = val.split(''); //字符串数组
                        var str = ''
                        for(var i = 0, s; s = strs[i++];) { //遍历字符串数组
                            str += s;
                            if(!(i % 5)) str += '\n'; //按需要求余
                        }
                        return str
                        }
                    },
                    
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: 80,
                    bottom: 30,
                    top: 30,
                },
                series: [{
                    data: this.collegeCount,
                    type: 'bar',
                    barWidth: 16,
                    label: {
                        show: true,
                        position: 'right',
                        distance: 10,
                        verticalAlign: 'middle',
                            textStyle: { // 数值样式
                            color: '#606266',
                            fontSize: 12
                        }
                    },
                    itemStyle: {
                        normal: {
                            barBorderRadius: [0, 3, 3, 0],
                            color: new this.$echarts.graphic.LinearGradient(
                            0, 0, 1,0,//渐变色在下面修改，这里是透明度
                            [{
                                offset: 0,
                                color: '#97ABFF'
                                },
                                {
                                offset: 1,
                                color: '#123597'
                                }
                            ]
                            )
                        }
                    }
                }]
            };
            let itemLength = this.collegeName.length
            let autoHeight = itemLength * 32 + itemLength * 30
            college.getDom().style.height = autoHeight + "px";
            college.resize();//直接加这句即可
            college.setOption(optionCollege);
        }
    },
    created() {
        
        this.$nextTick(() => {
            this.getData()
        })
        
    },
}
</script>
<style lang="less">
    #studentChart {
        .topInfo {
            margin: 0.32rem;
            padding-bottom: 0;
            height: 2.9333rem;
            margin-bottom: 0;
            box-shadow:0px 3px 8px 0px rgba(129,193,254,0.36);
            border-radius:8px;
            background: url('../../../../mobile_static/image/pic_stu_b@2x.png') no-repeat;
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
                    background: url('../../../../mobile_static/image/icon_stu_a@2x.png') no-repeat;
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
            height: 1.1733rem;
            line-height: 1.1733rem;
            display: flex;
            align-items: center;
            padding-top: .1rem;
            background: #fff;
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
            background: #F9F9F9;
            padding: 0.32rem;
            padding-bottom: 0;
            & > div {
                width: 100%;
                height: 6rem;
                background: #fff;
                margin-bottom: 0.32rem;
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