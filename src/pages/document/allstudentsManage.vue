<template>
  <div class="app-students-page">
    <div class="tab-div">
          <div class="tab" :class="curTab==='zaixiao'?'active':''"  title="在校生信息"
          @click="_check('zaixiao')" >
           在校生信息
          </div>
          <div class="tab" :class="curTab==='buzaixiao'?'active':''"  title="非在校生信息"
          @click="_check('buzaixiao')" >
            非在校生信息
          </div>
      </div>
    <div class="middle">
            <zaixiao-Manage :xiaostatuszai="zai"   :role="role" v-if="curTab == 'zaixiao' "></zaixiao-Manage>
            <buzaixiao-Manage :xiaostatuszai="buzai"  :role="role" v-if="curTab == 'buzaixiao' "></buzaixiao-Manage>
      </div>
  </div>
</template>
<script>
import  {sAjax}  from "../../assets/utils/utils.js";
import  zaixiaoManage from "./studentManage.vue"
import  buzaixiaoManage from "./studentNoSchoolManage.vue"
export default {
  components:{
    "zaixiao-Manage":zaixiaoManage,
    "buzaixiao-Manage":buzaixiaoManage
  },
  data() {
    return {
      curTab:"zaixiao",
      role:"school",
      zai:true,
      buzai:false
      }
    ;
  },
  created() {
    if(sessionStorage.getItem('curTabxiao')){
      this.curTab = sessionStorage.getItem('curTabxiao')
    }

  },
   methods:{
     _check(o){
       this.curTab = o
       sessionStorage.curTabxiao = o
     }
  }
  }
;
</script>
<style lang="less"  scoped>
.app-students-page{
    .tab-div {
      position: relative;
      height: 40px;
     margin: 17px 0px 0;
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



