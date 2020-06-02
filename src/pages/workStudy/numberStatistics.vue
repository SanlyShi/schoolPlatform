<template>
  <div  id="numberstatistics-page" class="container-fluid" >
  <!-- 岗位数量 -->
    <p class="title" style="text-align:right;color:rgb(158,158,158)">  以下数据统计截止至：{{Time}}</p>
    <div class="row row-top " style="height:80px !important">
      <div slot="btn-group" role="group">
        <div class="form-group pull-left ">
            <label>时间</label>
            <v-datepicker-area ref="datepicker" dateFormat="yyyy-MM" class="btn-block time-picker  time-item" @startSelected="selectStartTime" @endSelected="selectEndTime"></v-datepicker-area>
        </div>
        <div class="btn-group pull-left" style="margin-left:30px">
            <button type="button" class="btn" @click="reset">重置</button>
        </div>
        <div class="btn-group pull-left" style="margin-left:5px">
            <button type="button" class="btn" @click="daochu">导出</button>
        </div>
      </div>
    </div>
    <div class="row content">
      <div class="table-item">
           <v-EchartsBar :optionData="barData"></v-EchartsBar>
      </div>
    </div>
  </div>
</template>
<script>
import  {sAjax}  from "../../assets/utils/utils.js";
export default {
  props:{
    data:""
  },
  data() {
    return {
      startTime:"",
      endTime:"",
      barData: "",
      Time:"",
      stations:[],
      needData:{
        xAxisData:[],
        seriesLinshiData:[],
        seriesGudingData:[],
        seriesQitaData:[],
        seriesjianzhifudaoyuanData:[],
        seriesjiaqiData:[]
      }
    };
  },
  created() {
    var that  =this
      // 岗位类型下拉数据
    //  sAjax({
    //   url: "/api/system/dicts?dictType=岗位类型",
    //   dataType: "json",
    //   async: false,
    //   type: "get",
    //   success: (result)=>{
    //     if(result.state){
    //       result.data.forEach((item)=>{
    //         that.stations.push(item.label)
    //       })
    //     }
    //     else{
    //       that.toast("岗位类型数据请求失败！")
    //     }
    //   }
    // });
    this.setOptionsData()
  },
  methods:{
    daochu(){
      // console.log("/downloads/pwps/statistics/downloadExcelToPosition?startTime="+this.startTime+"&endTime="+this.endTime)
        window.location.href = "/downloads/pwps/statistics/downloadExcelToPosition?startTime="+this.startTime+"&endTime="+this.endTime
    },
    selectStartTime(o){
      // this.startTime =o.value.substring(0,10)
      this.startTime =(o.value.substring(0,10)).substring(0,4)+(o.value.substring(0,10)).substring(5,7)
      if(this.endTime){
        this.setOptionsData()
      }
    },
    selectEndTime(o){
      this.endTime =(o.value.substring(0,10)).substring(0,4)+(o.value.substring(0,10)).substring(5,7)
      // this.endTime =o.value.substring(0,10)
      if(this.startTime){
        this.setOptionsData()
      }
    },
    reset(){
      this.$refreshBread(this.data) 
   },
   setOptionsData(){
      let that = this
      let url = "/api/pwps/statistics/position?startTime="+this.startTime+"&endTime="+this.endTime
       sAjax({
      url: url,
      dataType: "json",
      type: "get",
      success: (result)=>{
        if(result.state){
           if(result.data.length == 0){
            that.toast("没有符合条件的数据!")
          }
          that.jiexiDataBingXuanRan(result.data)
        }
        else{
          that.toast("统计数据获取失败！")
        }
      }
    });
   },
   jiexiDataBingXuanRan(data){
     this.needData = {
        xAxisData:[],
        seriesLinshiData:[],
        seriesGudingData:[],
        seriesQitaData:[],
        seriesjianzhifudaoyuanData:[],
        seriesjiaqiData:[]
      };
       if(data.length == 0){
           this.needData = {
        xAxisData:[],
        seriesLinshiData:[],
        seriesGudingData:[],
        seriesQitaData:[],
        seriesjianzhifudaoyuanData:[],
        seriesjiaqiData:[]
      };
      }
      else{
 data.forEach((item,index)=> {
            this.needData.xAxisData.push(item.unitName)

            this.needData.seriesQitaData.push(item.map["其它岗位"])
            this.needData.seriesGudingData.push(item.map["固定岗位"])
            this.needData.seriesLinshiData.push(item.map["临时岗位"])
            this.needData.seriesjiaqiData.push(item.map["假期岗位"])
            this.needData.seriesjianzhifudaoyuanData.push(item.map["兼职辅导员"])

            this.Time = item.updateTime
         });
      }
      
        //  console.log(this.needData.xAxisData)
         this.barData = {
      title: "",
      legend: {
         data:['固定岗位','临时岗位','假期岗位','兼职辅导员','其他岗位'],
         top:'top'
     },
      xAxis:{
          data: this.needData.xAxisData,
          "type":"category",
    	"axisLabel":{
    		interval: 0
      },
         axisLabel: {
            rotate: -45,
            formatter: function(params) {
                var newStr = "";
                var n = params.length;
                var a = 12;
                if (n > a) {
                  newStr = params.substring(0, 12) + "...";
                } else {
                  newStr = params;
                }
                return newStr;
              }
         }
      },
      yAxis:{
        type: 'value',
        show:true,
            name: "数量",
            axisLabel: {
              formatter: "{value} 个"
            }
      },
      seriesData: [
        {
          name: "临时岗位",
          data:this.needData.seriesLinshiData,
          // barWidth:20,
               type:'bar',
        },
        {
          name: "固定岗位",
          data:this.needData.seriesGudingData,
          // barWidth:20
               type:'bar',
        },
        {
          name: "假期岗位",
          data: this.needData.seriesjiaqiData,
          // barWidth:20
               type:'bar',
        },
        {
          name: "兼职辅导员",
          data: this.needData.seriesjianzhifudaoyuanData,
          // barWidth:20
               type:'bar',
        },
        {
          name: "其他岗位",
          data: this.needData.seriesQitaData,
          // barWidth:20
               type:'bar',
        }
      ]
    };
   },
   shuzuquchong(array){
    var temp = []; 
    for(var i = 0; i < array.length; i++){
        if(temp.indexOf(array[i]) == -1){
            temp.push(array[i]);
        }
    }
    return temp;
}
  }
};
</script>
<style lang="less"  scoped>
#numberstatistics-page {
  overflow: auto;
}
#numberstatistics-page {
  .title {
    min-width: 360px;
    white-space: nowrap;
    margin-left: -15px
  }
  .time-item{
      display: inline-block;
      width: 200px;
      margin-left: 15px
  }
  .left {
    margin-left: 25px;
  }
  .row-top {
    margin-top: 20px;
    min-width: 800px;
  }
  .content {
      margin-top: 35px;
    .table-item {
      height: 600px;
      width: 100%;
    }
  }
}
</style>



