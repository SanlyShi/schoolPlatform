<template>

    <div id="authOfCollege">
        
        <div class="authTable">
            <v-table 
                :order='true' 
                :columns="columns" 
                pagesize="15" 
                :search="false"
                idField="id"
                ref='authOfSchool'
                :rows='tableData'
            >
            <div slot="btn-group" class="pull-left">
                <div class="collegeSelect">
                    <el-select v-model="curCollege" @change="collegeChange">
                        <el-option 
                        v-for="item in collegeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>
            </v-table>
       </div>

       <!-- 设置用户模态框 -->
       <v-modal :show="showEditModal" effect="fade" width="442">
        <div slot="modal-header" class="modal-header">
            编辑
        </div>
        <div slot="modal-body" class="modal-body" >
            <div class="modal-search-user">
            <!-- <detect url="/api/mentality/teachers/searchResults" placeholder="请输入学工号或者姓名" @afterSelected="editConsultantAfterSelected" v-if="showEditModal"></detect> -->
             <el-select
                v-model="value"
                filterable
                remote
                :remote-method="remoteMethod"
                :loading="loading"
                @change='userSelect'
                popper-class='selectList'
                placeholder='请输入学工名称或者学工号'
             >
                <el-option
                    v-for="item in options"
                    :key="item.userNo"
                    :title='item.userNo'
                    :value="item">
                    {{item.name + ` (${item.userNo})`}}
                </el-option>
             </el-select>
            </div>
            <div class="consultant-name-list">
            <div class="consultant-name">
                <!-- <i class="maticon" v-html="icons('clear')">clear</i> -->
                <el-tag
                    v-for="(item, index) in consultantArr" 
                    :key="index" 
                    closable
                    effect="dark"
                    type='plain'
                    :disable-transitions="false"
                    @close="deleteConsultant(item,index)">
                    {{item.name}}
                </el-tag>
            </div>
            </div>
        </div>
        <div slot="modal-footer" class="modal-footer">
            <el-button type="button" class="btn cancel-btn clearBtnBorder"  @click="cancle">取消</el-button>
            <el-button type="button" class="btn submit-btn clearBtnBorder" @click="sumbitEditConsultant">确定</el-button>
        </div>
    </v-modal>
    </div>
</template>
<script>
import { sAjax } from "../../../assets/utils/utils";
export default {
  data() {
    return {
      collegeList: [],
      tableData: [],
      columns: [],
      curCollege: "",
      curRoleId: "",
      tableDataUrl: "",
      showEditModal: false,
      consultantArr: [],
      options: [],
      value: ""
    };
  },
  computed: {},
  methods: {
    userSelect(v) {
      console.log(v);
      this.value = v.name + "(" + v.userNo + ")";
      let userIdList = [];
      if (this.consultantArr.length) {
        for (let item of this.consultantArr) {
          userIdList.push(item.userId);
        }
        if (userIdList.indexOf(v.userId) >= 0) {
          //已存在在待添加列表
          return false;
        } else {
          this.consultantArr.push(v);
        }
      } else {
        this.consultantArr.push(v);
      }
      console.log(this.consultantArr);
    },
    remoteMethod(query) {
      console.log(query);
      if (query !== "") {
        this.loading = true;
        let url =
          "/api/employment/role/getUserList?value=" +
          query +
          "&roleId=" +
          this.curRoleId +
          "&collegeCode=" +
          this.curCollege;
        sAjax({
          url: url,
          type: "get",
          success: data => {
            if (data.state) {
              this.options = data.data;
              this.loading = false;
            } else {
              this.options = [];
              this.loading = false;
            }
          }
        });
      } else {
        this.options = [];
      }
    },
    cancle() {
      this.showEditModal = false;
      this.value = "";
      this.options = [];
      this.consultantArr = [];
    },
    collegeChange() {
      this.setTable(this.curCollege);
    },
    setTable(code) {
      let url =
        "/api/employment/role/getRole?level=COLLEGE&collegeCode=" + code;
      this.tableData = [];
      sAjax({
        url: url,
        type: "get",
        success: data => {
          if (data.state) {
            this.tableData = data.data;
          } else {
            this.tableData = [];
          }
        }
      });
    },
    getCollegeList() {
      let url = "/api/employment/system/getUnitList";
      sAjax({
        url: url,
        type: "get",
        success: data => {
          if (data.state) {
            this.collegeList = data.data;
            this.curCollege = this.collegeList[0].value;
            this.setTable(this.curCollege);
            // this.tableDataUrl = ''
          } else {
            this.collegeList = [];
          }
        }
      });
    },

    deleteConsultant: function(data, index) {
      if (data.old) {
        this.$confirm("是否删除该用户", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.consultantArr.forEach((ele, index) => {
              if (ele.userId === data.userId) {
                let url =
                  "/api/employment/role/deleteRole?roleId=" +
                  this.curRoleId +
                  "&userId=" +
                  data.userId +
                  "&collegeCode=" +
                  this.curCollege;
                sAjax({
                  url: url,
                  type: 'post',
                  success: info => {
                    if (info.state) {
                      this.setTable(this.curCollege);
                      this.consultantArr.splice(index, 1);
                      this.$toast("删除成功");
                    } else {
                      this.$toast(data.message);
                    }
                  }
                });
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else {
        this.consultantArr.splice(index, 1);
      }
    },
    sumbitEditConsultant: function() {
      if (!this.consultantArr.length) {
        return false;
      }
      let userIdList = [];
      let consultantArr = this.consultantArr;
      for (let item of consultantArr) {
        if (!item.old) {
          userIdList.push(item.userId);
        }
      }
      console.log(userIdList);
      sAjax({
        url: "/api/employment/role/addRole",
        dataType: "json",
        type: "post",
        data: {
          roleId: this.curRoleId,
          collegeCode: this.curCollege,
          userIds: userIdList
        },
        success: data => {
          if (data.state) {
            this.$toast("添加成功");
            this.setTable(this.curCollege);
            this.value = ''
            this.showEditModal = false;
          } else {
            this.$toast(data.message);
          }
        }
      });
    }
  },
  created() {
    this.getCollegeList();
    this.columns = [
      {
        id: "name",
        title: "角色名称",
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
      },
      {
        id: "remarks",
        title: "角色说明",
        className: "text-left",
        width: 150,
        hidden: false
      },
      {
        id: "users",
        title: "用户",
        className: "text-left",
        width: 150,
        hidden: false,
        formatter: record => {
          let arr = [];
          if (record.users.length) {
            for (let user of record.users) {
              arr.push(user.name);
            }
            return arr.join(",");
          } else {
            return "暂无用户";
          }
        }
      },
      {
        id: "opts",
        title: "操作",
        width: 80,
        hidden: false,
        formatter: record => {
          return [
            {
              tag: "a",
              text: "设置用户",
              callback: (record, index) => {
                this.curRoleId = record.roleId;
                if (record.users.length) {
                  for (let item of record.users) {
                    item.old = true;
                  }
                }
                this.consultantArr = [].concat(record.users);
                console.log(this.consultantArr);
                this.showEditModal = true;
              }
            }
          ];
        }
      }
    ];
  }
};
</script>
<style lang="less" scoped>
#authOfCollege {
  padding: 20px;
  .error-message {
    font-size: 13px;
    color: #ff5252;
    line-height: 13px;
    margin: 8px 0 0 50px;
  }
}
</style>
<style lang="less">
#authOfCollege {
  .modal {
    .modal-header {
      background: #298ef8;
      color: white;
      border-radius: 5px 5px 0 0;
      padding: 21px 25px;
      .modal-title {
        font-weight: normal;
        font-size: 14px;
        line-height: 0;
        background: #298ef8;
        color: white;
        padding: 0;
      }
    }
  }
  .modal-content {
    border-top: 0;
  }
  .modal-body {
    min-height: 100px;
    .consultant-name {
      margin-top: 20px;
      .el-tag {
        margin-right: 10px;
        margin-bottom: 10px;
      }
    }
    .el-select {
      width: 60%;
    }
  }
}
.selectList {
  .el-select-dropdown__item.selected {
    color: #606266;
    font-weight: 500;
  }
}
</style>

