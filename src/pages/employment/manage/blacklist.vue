<!-- 黑名单 -->
<template>
  <div class="blacklist">
    <!-- <div class="title">黑名单管理</div> -->
    <v-table ref="blackListManagerTable" :url="tableData_url" :columns="columns" pagesize="15" idField="id" :multiple="false" :order="true" :search="false">
      <div slot="btn-group" class="pull-right">
        <el-button class="export-btn" type="primary" @click="exportStat">导出</el-button>
      </div>
    </v-table>
  </div>
</template>

<script>
import { sAjax, createTime } from "../../../assets/utils/utils.js";
export default {
  data() {
    return {
      columns: [],
      tableData_url: "/table-data/employment/blackList/getBySearch"
    };
  },
  created() {
    this.initColumns();
  },
  methods: {
    //导出
    exportStat() {
      let table = this.$refs.blackListManagerTable.tableSearchFields;
      var url = "/downloads/employment/blackList/getBlackListRecordExcel";
      window.location.href = url;
    },
    initColumns() {
      this.columns = [
        {
          id: "companyName",
          title: "单位名称",
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
          title: "移入黑名单时间",
          hidden: false,
          width: 130
        },
        {
          id: "operatorName",
          title: "操作人",
          hidden: false,
          width: 130
        },
        {
          id: "reason",
          title: "原因",
          hidden: false,
          width: 130
        },
        {
          id: "opts",
          title: "操作",
          width: 80,
          hidden: false,
          options: [
            {
              tag: "a",
              text: "移除",
              callback: (record, index) => {
                if (window.confirm("是否将用户移出黑名单?")) {
                  sAjax({
                    url: "/api/employment/blackList/moveOutCompany",
                    type: 'post',
                    data: {
                      companyId: record.companyId,
                      userId: record.userId,
                    },
                    success: data => {
                      if (data.state) {
                        this.tableData_url =
                          "/table-data/employment/blackList/getBySearch?timestamp=" +
                          createTime();
                        this.$message.success("移出黑名单成功");
                      } else {
                        this.$message.error(data.message);
                      }
                    }
                  });
                }
              }
            }
          ]
        }
      ];
    },
  }
};
</script>
<style scoped lang="less">
.blacklist{
  padding:20px;
  box-sizing: border-box;
}
.title {
  display: flex;
  align-items: center;
  width: 100%;
  height: 60px;
  margin-bottom: 20px;
  padding: 0 20px;
  font-size: 18px;
  font-weight: 500;
  color: rgba(0, 0, 0, 1);
  line-height: 60px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
}
.export-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 139px;
  height: 44px;
  margin-right: 20px;
  .icon {
    margin-right: 5px;
  }
}
</style>
