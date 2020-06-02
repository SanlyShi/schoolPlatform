/**管理员 笔面试table页*/
<template>
  <div id="interview">
    <div class="interviewTable" v-show="false">
      <v-table  ref="unitsManagerTable" :url="tableData_url" :columns="columns" pagesize="15" idField="id">
        <div slot="btn-group" class="pull-right">
          <el-button class="custom-btn" type="primary">新增笔试面试</el-button>
        </div>
      </v-table>
    </div>
    <!-- 新增笔试面试 -->
    <add-interview></add-interview>
     <!-- 笔面试详情组件 -->
      <!-- <interview-info></interview-info> -->
  </div>
</template>
<script>
import interviewInfo from './components/interviewInfo.vue'
import addInterview from './components/addInterviewOfUnit.vue'
export default {
  data() {
    return {
       tableData_url: "/table-data/employment/audit/getRecruitmentAuditBySearch",
       columns:[]
    }
  },
  components: {
    interviewInfo,
    addInterview
  },
  created() {
    this.columns = [
      {
        id: "title",
        title: "招聘信息标题",
        className: "text-left",
        width: 130,
        hidden: false,
        search: {
          type: "input",
          data: {
            placeholer: "",
            autoFocus: false
          }
        }
      },
      {
        id: "companyName",
        title: "单位",
        className: "text-left",
        width: 130,
        hidden: false,
        search: {
          type: "input",
          data: {
            placeholer: "",
            autoFocus: false
          }
        }
      },
      {
        id: "createTime",
        title: "提交时间",
        className: "text-left",
        width: 130,
        hidden: false,
      },
      {
        id: "status",
        title: "状态",
        width: 150,
        className: "text-left",
        hidden: false,
      },
      {
        id: "opts",
        title: "操作",
        width: 80,
        hidden: false,
        options: [
          {
            tag: "a",
            text: "查看",
            callback: (record, index) => {
            }
          }
        ]
      }
    ];
  }
}
</script>
<style lang="less" scoped>
 #interview {
    width: 100%;
    height: 100%;
    padding: 0 20px;
    font-size: 14px;
    background: #f6f6f8;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin-top: 20px;
    em,span,i,a {display: inline-block;vertical-align: middle;}
    h1,h2,h3,label,p{margin: 0;}
 }
</style>
