<template>
  <div class="app-statistics-page">
    <div class="tab-div">
          <div class="tab" :class="curTab==='manStatistics'?'active':''"  title="岗位人员统计"
          @click="_check('manStatistics')" >
            岗位人员统计
          </div>
          <div class="tab" :class="curTab==='jinStatistics'?'active':''"  title="单位薪酬统计"
          @click="_check('jinStatistics')" >
            单位薪酬统计
          </div>
          <div class="tab" :class="curTab==='numberStatistics'?'active':''" title="单位岗位统计"
            @click="_check('numberStatistics')" >
            单位岗位统计
          </div>
          <div class="tab" :class="curTab==='moneyStatistics'?'active':''"  title="人员薪酬统计"
           @click="_check('moneyStatistics')" >
            人员薪酬统计
          </div>
      </div>
    <div class="middle">
            <man-Statistics v-if="curTab == 'manStatistics' "></man-Statistics>
            <jin-Statistics v-if="curTab == 'jinStatistics' "></jin-Statistics>
            <money-Statistics v-if="curTab == 'moneyStatistics' "></money-Statistics>
            <number-Statistics v-if="curTab == 'numberStatistics' "></number-Statistics>
      </div>
  </div>
</template>
<script>
import  {sAjax}  from "../../assets/utils/utils.js";
import  manStatistics from "./manStatistics.vue"
import  jinStatistics from "./jinStatistics.vue"
import  moneyStatistics from "./moneyStatistics.vue"
import  numberStatistics from "./numberStatistics.vue"
export default {
  components:{
    "man-Statistics":manStatistics,
    "jin-Statistics":jinStatistics,
    "money-Statistics":moneyStatistics,
    "number-Statistics":numberStatistics
  },
  data() {
    return {
      curTab:"manStatistics"
     
      }
    ;
  },
  created() {
    if(sessionStorage.getItem('curTab')){
      this.curTab = sessionStorage.getItem('curTab')
    }

  },
   methods:{
     _check(o){
       this.curTab = o
       sessionStorage.curTab = o
     }
  }
  }
;
</script>
<style lang="less"  scoped>
.app-statistics-page{
  height: 100%;
  overflow-y: auto;
  background:white;
    .tab-div {
      position: relative;
      height: 40px;
      // margin: 17px 0px 0;
      background:white;
      white-space: nowrap;
      .apply-container{
        position: absolute;
        right: 0;
      }
      .tab-list{
        position: relative;
        .gm-scroll-view{
          padding-right: 200px;
        }
      }
      .tab {
        display: inline-block;
        // max-width: 200px;
        width: 150px;
        padding: 0 20px;
        font-size: 13px;
        color: rgba(0, 0, 0, 0.54);
        line-height: 40px;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        border-bottom: 2px solid transparent;
        cursor: pointer;
        transition: all 0.2s ease-out;
        vertical-align: top;
        &.tab-node {
          line-height: 20px;
          p {
            margin: 0;
            text-align: left;
          }
        }
        &:hover,
        &.active {
          color: #298df7;
          border-bottom: 2px solid #298df7;
          
          height: 40px;
        }
        margin-right: -4px;
      }
      
      .apply-entry {
        display: block;
        float: right;
        width: 56px;
        height: 56px;
        margin: 12px 20px;
        background: #298df7;
        box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.12),
          0 8px 8px 0 rgba(0, 0, 0, 0.12);
        border-radius: 100px;
        text-align: center;
        line-height: 56px;
        color: #fff;
        cursor: pointer;
        transition: all 0.2s ease-out;
        &:hover {
          background: #7fc8f3;
        }
      }
      .tab-group {
        display: inline-block;
      }
    }
    .middle{
      // overflow-x: hidden;
      // overflow:scroll 
    }

}
</style>



