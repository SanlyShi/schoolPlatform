<!-- 权限管理页面  by hfj -->
<template>
  <div id="authManage">
    <!-- <div class="top">
      <h1>系统管理权限</h1>
    </div> -->
    <div class="content">
      <div class="tabs">
        <div class="tabsTitle">
          <a @click="changeType('school')" :class="{'active':curType=='school'}">校级权限</a>
          <a @click="changeType('college')" :class="{'active':curType=='college'}">院级权限</a>
        </div>
        <!-- 校级院级content放在一起 -->
        <div class="tabsContent">
          <!-- <div class="search">
            <span>{{curType=='school'?'学校':'学院'}}</span>
            <el-select></el-select>
          </div> -->
          <!-- <div class="table">
            <v-table :columns="columns" idField="id" :key="1" pagesize=15 ref="liveStaffTable" :order="true" :searchParams="searchParams">
            </v-table>
          </div> -->
          <el-table :data="tableData" style="width: 100%">
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column prop="name" label="角色名" width="180">
            </el-table-column>
            <el-table-column prop="remarks" label="角色说明" width="180">
            </el-table-column>
            <el-table-column label="用户">
              <template slot-scope="scope">
                <el-popover trigger="hover" placement="top">
                  <span style="margin-right:5px;" v-for="(item,index) in scope.row.users" :key="index">{{item.name}}</span>
                  <div slot="reference" class="name-wrapper">
                    <el-tag style="margin-right:5px;" v-for="(item,index) in scope.row.users" :key="index">{{item.name}}</el-tag>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button @click="onSetUser(scope.row)" type="text" size="small">设置用户</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!-- 设置用户弹窗 -->
    <el-dialog title="设置用户" :visible.sync="setUserDialog">
      <el-form :model="setUserFrom" :rules="setUserRules" ref="setUserFromRules" class="unit-manager-form">
        <el-form-item prop="name" style="line-height: 45px;">
          <el-input placeholder="搜索姓名或学工号" v-model="setUserFrom.name" clearable>
              <!-- <detect
              style="display:inline-block;width: 40%;"
              url="/api/payment/likeUserName"
              placeholder="请输入姓名或学工号"
              @afterSelected="consultantSelected"
            ></detect> -->
          </el-input>
        </el-form-item>
      </el-form>
      <div class="add-user">已添加用户</div>
      <el-table :data="addedUsertable">
        <el-table-column prop="name" label="姓名">
        </el-table-column>
        <el-table-column prop="userId" label="学号">
        </el-table-column>
        <el-table-column label="操作" width="50">
          <template slot-scope="scope">
            <el-button @click="onDeleteUser(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button plain @click="setUserDialog = false">取消</el-button>
        <el-button type="primary" :loading="setUserFrom.loading" @click="onSetUserAdd('setUserFromRules')">添加</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { sAjax, createTime } from "../../../assets/utils/utils.js";
export default {
  name: "authManage",
  data() {
    return {
      setUserFrom: {
        name: "",
        loading: false
      },
      setUserRules: {
        name: [
          { required: true, message: "请输入姓名或者学工号", trigger: 'blur' },
        ]
      },
      roleId: "", //  删除用户需要用到
      addedUsertable: "",// 已添加用户列表
      setUserDialog: false,//设置用户弹窗
      studentName: "",// 姓名或者学工号
      curType: "school", //当前选择校级或者院级
      columns: [],
      searchParams: {},
      tableData: [],
    };
  },
  created() {
    this.getRole('SCHOOL', 'tableData')
  },
  methods: {
    // 删除用户
    onDeleteUser(row) {
      if (window.confirm('是否删除')) {
        sAjax({
          url: "/api/employment/role/deleteRole?roleId=" + this.roleId + '&userId=' + row.userId,
          type: 'post',
          success: data => {
            if (data.state) {
              this.$message.success("删除成功");
              this.getUserByRole(this.roleId);
            } else {
              this.$message.error(data.message);
            }
          }
        });
      }
    },
    // 设置用户添加
    onSetUserAdd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.setUserFrom.loading = true;
          sAjax({
            url: "/api/employment/role/addRole?roleId=" + this.roleId + '&name=' + this.setUserFrom.name,
            type: "post",
            success: data => {
              if (data.state) {
                this.$message.success("添加成功");
                this.getUserByRole(this.roleId);
                this.resetForm(formName);
              } else {
                this.$message.error(data.message);
              }
            }
          }).always(() => {
            this.setUserFrom.loading = false;
          });
        } else {
          return false;
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 设置用户
    onSetUser(row) {
      this.roleId = row.roleId;
      this.addedUsertable = [];
      this.getUserByRole(row.roleId)
    },
    // 获取拥有该角色所有职工
    getUserByRole(roleId) {
      sAjax({
        url: "/api/employment/role/getUserByRole?roleId=" + roleId,
        type: "get",
        success: data => {
          if (data.state) {
            this.addedUsertable = data.data;
            this.setUserDialog = true;
          } else {
            this.$message.error(data.message);
          }
        }
      });
    },
    // 获取权限列表
    getRole(type, paramsList) {
      let that = this;
      sAjax({
        url: "/api/employment/role/getRole?level=" + type,
        type: "get",
        success: data => {
          if (data.state) {
            that[paramsList] = data.data;
          } else {
            this.$message.error(data.message);
          }
        }
      });
    },
    // tab切换
    changeType(type) {
      if (this.curType == type) return
      this.curType = type;
      this.tableData = [];
      if (type == 'school') {
        this.getRole('SCHOOL', 'tableData')
      } else {
        this.getRole('COLLEGE', 'tableData')
      }
    },
  },
};
</script>
<style lang="less" scoped>
.add-user {
  color: #999;
  margin: 20px 0;
}
#authManage {
  padding: 20px;
  .content {
    margin-top:0!important;
    .tabs {
      .tabsTitle {
        height: 68px;
        line-height: 68px;
        border-bottom: 1px solid #e7e7e7;
        a {
          display: inline-block;
          width: 136px;
          color: #000;
          font-size: 16px;
          text-align: center;
          cursor: pointer;
          text-decoration: none;
        }
        a.active {
          color: #3e92fe;
          position: relative;
        }
        a.active::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          display: block;
          width: 136px;
          height: 4px;
          background: #3e92fe;
        }
      }
      .tabsContent {
        .search {
          padding: 27px 0 28px 64px;
          & > span {
            padding-right: 15px;
            color: #787878;
          }
        }
      }
    }
  }
}
</style>
