/**管理员审核 列表*/

<template>
  <div id="techinAudit">
    <el-button
      style="color:#666;"
      type="text"
      icon="el-icon-back"
      v-if="curStatus != 'list'"
      @click="curStatus = 'list'"
    >返回</el-button>
    <!-- 新增宣讲会组件 -->
    <!-- <add-teachin v-if="curStatus=='edit'" @backToParent='backToParent' :loginType='loginType'></add-teachin> -->

    <!-- 宣讲会详情 -->
    <!-- <techin-details v-if="curStatus == 'details'" :techinDetails='techinDetails' :loginType='loginType'></techin-details> -->

    <!-- 宣讲会列表 -->
    <div class="techinBox">
      <v-table
        :url="tableDataUrl"
        :columns="columns"
        idField="id"
        pagesize="15"
        :multiple="false"
        :order="true"
      >
        <div slot="btn-group" class="pull-right">
          <el-button class="custom-btn" type="primary" >新增宣讲会</el-button>
        </div>
      </v-table>
    </div>
  </div>
</template>
<script>
  import { sAjax } from '../../../../assets/utils/utils';
  export default {
    data() {
      return {
        tableDataUrl: '/table-data/employment/manage/preachMeeting/getPreachMeetingAuditList',
        columns: [],
        curStatus:'list'
      }
    },
    methods: {
    },
    created() {
      this.columns = [{
        id: "companyName",
        title: "单位名称",
        className: "text-left",
        width: 150,
        hidden: false,
        search: {
          type: "input",
          data: {
            placeholer: "",
            autoFocus: false
          }
        }
      },{
        id: "title",
        title: "宣讲会标题",
        className: "text-left",
        width: 150,
        hidden: false,
        search: {
          type: "input",
          data: {
            placeholer: "",
            autoFocus: false
          }
        }
      }, {
        id: "timeSpace",
        title: "时间",
        className: "text-left",
        width: 150,
      }, {
        id: "areaName",
        title: "场地",
        className: "text-left",
        width: 150,
        search: {
          type: "input",
          data: {
            placeholer: "",
            autoFocus: false
          }
        }
      }, {
        id: "createTime",
        title: "提交时间",
        className: "text-left",
        width: 150,
      }, {
        id: "assistantName",
        title: "跟场助理",
        className: "text-left",
        width: 100,
        hidden: false,
      }, {
        id: "assistantPhone",
        title: "助理联系方式",
        className: "text-left",
        width: 100,
        hidden: false,
      }, {
        id: "statusName",
        title: "状态",
        className: "text-left",
        width: 100,
        hidden: false,
      }, {
        id: "statusName",
        title: "审核意见",
        className: "text-left",
        width: 100,
        hidden: false,
      }, {
        id: "opts",
        title: "操作",
        width: 200,
        hidden: false,
        formatter: (record) => {
          return [{
            tag: 'a',
            text: record.status == 0?'审核':'查看',
            callback: (record, index) => {
            }
          }]
        }

      }]
    }
  }
</script>
<style lang="less" scoped>
#techinAudit {
  width: 100%;
    height: 100%;
    padding: 0 20px;
    font-size: 14px;
    background: #f6f6f8;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin-top: 20px;
}
</style>
