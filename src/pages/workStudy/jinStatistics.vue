<template>
  <div id="jinstatistics-page"  class="container-fluid" >
  <!-- 岗位金额 -->
     <p class="title" style="text-align:right;color:rgb(158,158,158);padding-right:15px">  以下数据统计截止至：{{Time}}</p>
    <div class="row row-top " style="height:80px !important">
      <div  slot="btn-group" role="group" >
        <div class="form-group pull-left " >
          <label>时间</label>
          <v-datepicker-area ref="datepicker" dateFormat="yyyy-MM" class="btn-block time-picker  time-item" @startSelected="selectStartTime" @endSelected="selectEndTime"></v-datepicker-area>
        </div>
        <div class="btn-group pull-left" style="margin-left:30px">
          <button type="button" class="btn"  @click="reset">重置</button>
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
  data() {
    return {
      barData: "",
       startTime:"",
      endTime:"",
      barData: "",
      Time:"",
      needData:{
        xAxisData:[],
        seriesYingfaData:[],
        seriesShifaData:[],
        seriesQitaData:[]
      }
    };
  },
  created() {
    this.setOptionsData()
  },
   methods:{
     daochu(){
        window.location.href = "/downloads/pwps/statistics/downLoadMount?startTime="+this.startTime+"&endTime="+this.endTime
    },
    selectStartTime(o){
      // console.log(o)
      this.startTime =(o.value.substring(0,10)).substring(0,4)+(o.value.substring(0,10)).substring(5,7)
      if(this.endTime){
        this.setOptionsData()
      }
    },
    selectEndTime(o){
      // console.log(o)
      this.endTime =(o.value.substring(0,10)).substring(0,4)+(o.value.substring(0,10)).substring(5,7)
      if(this.startTime){
        this.setOptionsData()
      }
    },
    reset(){
      this.$refreshBread(this.data) 
   },
   setOptionsData(){
      let that = this
      let url = "/api/pwps/statistics/mount?startTime="+this.startTime+"&endTime="+this.endTime
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
          that.toast("统计数据获取失败!")
        }
      }
    });
   },
   jiexiDataBingXuanRan(data){
     this.needData = {
        xAxisData:[],
        seriesYingfaData:[],
        seriesShifaData:[]
      }
      if(data.length == 0){
         this.needData = {
        xAxisData:[],
        seriesYingfaData:[],
        seriesShifaData:[]
      }
      }
      else{
         data.forEach((item,index)=> {
            this.needData.xAxisData.push(item.unitName)
            this.needData.seriesYingfaData.push(item.totalPayMount )
            this.needData.seriesShifaData.push(item.realPayMount)
            this.Time = item.updateTime
         });
      }
        
         this.barData = {
      title: "",
      legend: {
         data:['应发金额', '实发金额'],
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
            name: "金额",
            axisLabel: {
              formatter: "{value} 元"
            }
      },
      seriesData: [
        {
          name: "应发金额",
          data:this.needData.seriesYingfaData,
          // barWidth:35
          type:'bar'
        },
        {
          name: "实发金额",
          data:this.needData.seriesShifaData,
          // barWidth:35
          type:'bar'
        }
      ]
    };
   }
  }
};
</script>
<style lang="less"  scoped>
#jinstatistics-page {
  overflow: auto;
  position: relative
}

#jinstatistics-page {
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
      // position: absolute;
      margin-top: 15px;
       width: 100%;
    .table-item {
      height: 600px;
      width: 100%;
    //   position: absolute
    }
  }
}
</style>



