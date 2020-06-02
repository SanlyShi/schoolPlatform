/**管理员 笔面试table页*/
<template>
  <div id="interview" class="contentBox">
    <el-button style="color:#666;" type="text" icon="el-icon-back" v-if="curStatus != 'list'" @click="curStatus = 'list'">返回</el-button>
    <!-- 笔面试列表 -->
    <div class="interviewTable" v-if="curStatus == 'list'">
      <v-table 
        :url="tableDataUrl" 
        :columns="columns" 
        pagesize="15" 
        idField="id"
        :multiple="showMultiple"
        :order='true'
        :search="false"
        ref='interviewList'
        :columnsControl="true"
        @afterChecked="_tableChecked">
        <div slot="btn-group" class="pull-left" >
          <el-button v-if="tableCheckedListAll" class="operability-hint" type="text">已选择{{tableCheckedListAll}}项,其中可操作的有{{tableCheckedList.length}}项</el-button>
        </div>
        <div slot="btn-group" class="pull-right">
          <el-button class="custom-btn" type="primary" @click="batchAssistant" v-if="showMultiple">批量设置跟场助理</el-button>
          <el-button @click="createExam" class="custom-btn" type="primary">新增笔面试</el-button>
          
        </div>
      </v-table>
    </div>

    <!-- 设置跟场助理 -->
    <div class="setAssistant">
      <el-dialog :visible.sync="dialogVisible" width="480px" :before-close="beforCancle">
        <div class="form">
          <el-form ref="assistant" :model="assistant" :rules="assistantRules" label-width="50px">
            <el-form-item prop="name">
              <i slot="label" class="nameIcon"></i>
              <el-input v-model="assistant.name" placeholder="请输入跟场助理姓名"></el-input>
            </el-form-item>
            <el-form-item prop="phone">
              <i slot="label" class="phoneIcon"></i>
              <el-input v-model="assistant.phone" placeholder="请输入跟场助理电话"></el-input>
            </el-form-item>
            <div class="btnGroup">
              <a @click="cancle">取 消</a>
              <a @click="submit">确 定</a>
            </div>
          </el-form>
        </div>
      </el-dialog>
    </div>

    <!-- 新增笔面试  for 单位-->
    <add-interview-unit v-if="curStatus == 'edit'&&loginType.loginType == 'COMPANY'" @backToParent="backToParent" :loginType='loginType' :placeRule='placeRule'></add-interview-unit>

    <!-- 新增笔面试 （审核） for 管理员-->
    <add-interview-admin v-if="curStatus == 'edit'&&loginType.isAdmin" :placeRule='placeRule' :defaultInfo='defaultInfo' @backToParent="backToParent"  :loginType='loginType'></add-interview-admin>

    <!-- 笔面试详情 -->
    <interview-detail v-if="curStatus == 'details'" :loginType='loginType' :placeRule='placeRule' @backToParent="backToParent" :interviewId='interviewId'></interview-detail>
  </div>
</template>
<script>
import interviewDetail from "./components/interviewDetails.vue";
import addInterviewUnit from "./components/addInterviewOfUnit.vue"; //单位新增笔面试
import addInterviewAdmin from "./components/addInterviewOfAdmin.vue"; //管理员新增笔面试
import { getLoginType, checkOverStep, checkUnitDisabled } from "../../api/api";
import { reCallInterview } from "../../api/interview/api";
import { getInterInfo2Admin, assistant } from "../../api/interview/api";
import { getPlaceRules } from "../../api/placeManage/api";
import { sAjax } from "../../../../assets/utils/utils";
export default {
  props: ["data"],
  data() {
    let checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的手机号"));
        }
      }
    };
    return {
      columns: [],
      tableDataUrl: "",
      showMultiple: true, //是否展示多选框
      tableCheckedListAll: "",
      tableCheckedList: [],
      dialogVisible: false, //跟场助理弹窗
      addAssignType: "single", //添加跟场助理方式为单个或者批量
      loginType: {}, //登录类型
      placeRule: {}, //场地规则
      details: "", //笔面试详情
      defaultInfo: {}, //
      interviewId: "", //当前查看的笔面试ID
      curStatus: "list", //当前页面展示内容，（list/details/edit
      assistant: {
        name: "",
        phone: ""
      },
      assistantRules: {
        name: [
          { required: true, message: "请输入跟场助理名字", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "请输入跟场助理手机号", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" }
        ]
      },
      curId: "" //当前宣讲会详情ID
    };
  },
  components: {
    interviewDetail,
    addInterviewUnit,
    addInterviewAdmin
  },
  methods: {
    _tableChecked(arr) {
      let checkedArr = [];
      console.log(arr);
      arr.forEach(item => {
        checkedArr.push(item.id);
      });
      this.tableCheckedListAll = arr.length;
      this.tableCheckedList = checkedArr;
    },
    cancle() {
      this.$refs["assistant"].resetFields();
      this.$refs["assistant"].clearValidate();
      this.dialogVisible = false;
    },

    submit() {
      //设置助理
      this.$refs["assistant"].validate(valid => {
        if (valid) {
          let ids = [];
          if (this.addAssignType == "single") {
            ids.push(this.curId);
          } else {
            ids = this.tableCheckedList;
          }
          assistant(ids, this.assistant.name, this.assistant.phone).then(
            data => {
              if (data.state) {
                this.$message.success("跟场助理设置成功!");
                this.tableCheckedListAll = "";
                this.tableCheckedList = [];
                this.setTableUrl(this.loginType.loginType);
              } else {
                this.tableCheckedListAll = "";
                this.tableCheckedList = [];
                this.$message.error(data.message);
              }
              this.dialogVisible = false;
            }
          );
        }
      });
    },
    batchAssistant() {
      //批量设置跟场助理
      if (!this.tableCheckedListAll) {
        return this.$message.error("请先勾选单位");
      }
      this.assistant = {
        name: "",
        phone: ""
      };
      this.addAssignType = "list";
      this.dialogVisible = true;
    },
    createExam() {
      //新增笔面试
      if (this.loginType.loginType == "COMPANY") {
        checkOverStep("EXAMINATION").then(data => {
          if (data.state) {
            checkUnitDisabled().then(info => {
              if (info.state) {
                if (info.data != 1) {
                  //未停用
                  this.curStatus = "edit";
                  this.defaultInfo = null;
                } else {
                  this.$message({
                    type: 'error',
                    message: '该单位已被停用'
                  })
                 
                }
              }
            });
          } else {
            this.$message({
              tyep: 'error',
              message: data.message
            });
          }
        });
      } else {
        this.curStatus = "edit";
        this.defaultInfo = null;
      }
    },
    catchLoginType() {
      getLoginType().then(data => {
        this.loginType = data.data;
        this.setTableUrl(this.loginType.loginType);
        console.log(this.loginType.loginType)
        this.setColumns(this.loginType.loginType);
        // this.setTableUrl(data.loginType)
      });
    },
    setColumns(type) {
      if (type == "COMPANY") {
        this.showMultiple = false;
        this.columns = [
          {
            id: "title",
            title: "笔试面试名称",
            className: "text-left",
            width: 130,
            hidden: false,
            search: {
              type: "input",
              data: {
                placeholer: "",
                autoFocus: false
              }
            },
            formatter: record => {
              return record.name;
            }
          },
          {
            id: "timeSpace",
            title: "时间",
            className: "text-left line-height-normal",
            width: 150,
            hidden: false,
            search: {
              type: "datetime",
              data: {
                dateFormat: "yyyy-MM-dd hh:ii",
                placeholder: "笔面试",
                change: ({ value, target }) => {
                  this.tableDataUrl = `/table-data/employment/examination/getList?timeStamp=${new Date().getTime()}&beginTime=${
                    this.$refs.interviewList.tableSearchFields[
                      "timeSpace_start"
                    ]
                  }&endTime=${
                    this.$refs.interviewList.tableSearchFields["timeSpace_end"]
                  }`;
                }
              }
            },
            // formatter(record) {
            //   return `${new Date(record.beginTime).format(
            //     "yyyy-MM-dd HH:mm"
            //   )} -<br/> ${new Date(record.endTime).format("yyyy-MM-dd HH:mm")}`;
            // }
          },
          {
            id: "areaName",
            title: "场地",
            className: "text-left",
            width: 130,
            hidden: false
          },
          {
            id: "auditTime",
            title: "提交时间",
            className: "text-left",
            width: 130,
            hidden: false
          },
          {
            id: "status",
            title: "审核状态",
            className: "text-left",
            width: 100,
            search: {
              type: "select",
              data: {
                optionsLabel: "label",
                optionsValue: "value",
                options: [
                  { label: "待审核", value: 0 },
                  { label: "已通过", value: 1 },
                  { label: "未通过", value: 2 },
                  { label: "已撤回", value: 3 },
                  { label: "已下架", value: 4 },
                  { label: "已驳回", value: 5 }
                ],
                placeholer: "",
                autoFocus: false
              }
            },
            formatter: record => {
              return record.statusName;
            }
          },
          {
            id: "reason",
            title: "审核意见",
            className: "text-left",
            width: 130,
            hidden: false,
            formatter: record => {
              if (!record.reason) {
                return "-";
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
                  text: "查看",
                  callback: (record, index) => {
                    this.interviewId = record.id;
                    this.curStatus = "details";
                  }
                },
                {
                  tag: "a",
                  text: "撤回",
                  className: record.status == "0" ? "" : "none",
                  callback: (record, index) => {
                    reCallInterview(record.id).then(data => {
                      if (data.state) {
                        this.$message.success("撤回成功");
                        this.setTableUrl(this.loginType.loginType);
                      } else {
                        this.$message.error(data.message);
                      }
                    });
                  }
                }
              ];
            }
          }
        ];
      } else {
        if (this.data.title == "笔/面试管理") {
          this.columns = [
            {
              id: "title",
              title: "笔面试名称",
              className: "text-left",
              width: 150,
              hidden: false,
              search: {
                type: "input",
                data: {
                  placeholer: "",
                  autoFocus: false
                }
              },
              formatter: record => {
                return record.name;
              }
            },
            {
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
            },
            {
              id: "timeSpace",
              title: "时间",
              className: "text-left line-height-normal",
              width: 150,
              hidden: false,
              search: {
                type: "datetime",
                data: {
                  dateFormat: "yyyy-MM-dd hh:ii",
                  placeholder: "笔面试",
                  change: ({ value, target }) => {
                    this.tableDataUrl = `/table-data/employment/manage/examination/getExaminationBySearch?timeStamp=${new Date().getTime()}&beginTime=${
                      this.$refs.interviewList.tableSearchFields[
                        "timeSpace_start"
                      ]
                    }&endTime=${
                      this.$refs.interviewList.tableSearchFields[
                        "timeSpace_end"
                      ]
                    }`;
                  }
                }
              },
              // formatter(record) {
              //   return `${new Date(record.beginTime).format(
              //     "yyyy-MM-dd HH:mm"
              //   )} -<br/> ${new Date(record.endTime).format(
              //     "yyyy-MM-dd HH:mm"
              //   )}`;
              // }
            },
            {
              id: "areaName",
              title: "场地",
              className: "text-left",
              width: 180,
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
              id: "allocationScheme",
              title: "场地分配方式",
              className: "text-left",
              width: 100,
              hidden: false
            },
            {
              id: "assistantName",
              title: "跟场助理",
              className: "text-left",
              width: 100,
              hidden: false,
              formatter: record => {
                if (!record.assistantName) {
                  return "-";
                }
              }
            },
            {
              id: "assistantPhone",
              title: "助理联系方式",
              className: "text-left",
              width: 100,
              hidden: false
            },
            {
              id: "opts",
              title: "操作",
              width: 200,
              hidden: false,
              formatter: record => {
                return [
                  {
                    tag: "a",
                    text: "查看",
                    callback: (record, index) => {
                      this.tableCheckedListAll = "";
                      this.tableCheckedList = [];
                      this.interviewId = record.id;
                      this.curStatus = "details";
                    }
                  },
                  {
                    tag: "a",
                    text: "跟场助理",
                    callback: (record, index) => {
                      this.curId = record.id;
                      this.assistant.name = record.assistantName;
                      this.assistant.phone = record.assistantPhone;
                      this.addAssignType = "single";
                      this.dialogVisible = true;
                    }
                  },
                  {
                    tag: "a",
                    text: record.status == 1 ? "下架" : "重新上架",
                    callback: (record, index) => {
                      let text = record.status == 1 ? "下架" : "重新上架";
                      this.$confirm("是否执行" + text + "操作", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                      })
                        .then(() => {
                          sAjax({
                            url:
                              "/api/employment/audit/soldOutExaminationAudit?id=" +
                              record.id,
                            type: 'post',
                            success: data => {
                              if (data.state) {
                                this.$message.success(text + "成功！");
                                this.setTableUrl(this.loginType.loginType);
                              } else {
                                this.$message.error(data.message);
                                this.setTableUrl(this.loginType.loginType);
                              }
                            }
                          });
                        })
                        .catch(() => {
                          this.$message({
                            type: "info",
                            message: "已取消"
                          });
                        });
                    }
                  }
                ];
              }
            }
          ];
        } else {
          this.showMultiple = false;
          this.columns = [
            {
              id: "companyName",
              title: "单位名称",
              className: "text-left",
              width: 120,
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
              id: "name",
              title: "笔面试标题",
              className: "text-left",
              width: 120,
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
              id: "timeSpace",
              title: "时间",
              className: "text-left line-height-normal",
              width: 150,
              hidden: false,
              search: {
                type: "datetime",
                data: {
                  dateFormat: "yyyy-MM-dd hh:ii",
                  placeholder: "笔面试",
                  change: ({ value, target }) => {
                    this.tableDataUrl = `/table-data/employment/audit/getExaminationAuditBySearch?timeStamp=${new Date().getTime()}&beginTime=${
                      this.$refs.interviewList.tableSearchFields[
                        "timeSpace_start"
                      ]
                    }&endTime=${
                      this.$refs.interviewList.tableSearchFields[
                        "timeSpace_end"
                      ]
                    }`;
                  }
                }
              },
              // formatter(record) {
              //   return `${new Date(record.beginTime).format(
              //     "yyyy-MM-dd HH:mm"
              //   )} -<br/> ${new Date(record.endTime).format(
              //     "yyyy-MM-dd HH:mm"
              //   )}`;
              // }
            },
            {
              id: "areaName",
              title: "场地",
              className: "text-left",
              width: 100,
              search: {
                type: "input",
                data: {
                  placeholer: "",
                  autoFocus: false
                }
              }
            },
            {
              id: "contactPeople",
              title: "联系人",
              className: "text-left",
              width: 100
            },
            {
              id: "contactPhone",
              title: "联系电话",
              className: "text-left",
              width: 100
            },
            {
              id: "auditTime",
              title: "提交时间",
              className: "text-left",
              width: 150
            },
            {
              id: "status",
              title: "审核状态",
              className: "text-left",
              width: 100,
              search: {
                type: "select",
                data: {
                  optionsLabel: "label",
                  optionsValue: "value",
                  options: [
                    { label: "待审核", value: 0 },
                    { label: "已通过", value: 1 },
                    { label: "未通过", value: 2 },
                    { label: "驳回", value: 5 }
                  ],
                  placeholer: "",
                  autoFocus: false
                }
              },
              formatter: record => {
                return record.statusName;
              }
            },
            {
              id: "reason",
              title: "审核意见",
              className: "text-left",
              width: 100,
              hidden: false,
              formatter: record => {
                if (!record.reason) {
                  return " - ";
                }
              }
            },
            {
              id: "opts",
              title: "操作",
              width: 50,
              hidden: false,
              formatter: record => {
                return [
                  {
                    tag: "a",
                    text: "查看",
                    className: record.status == 0 ? "none" : "",
                    callback: (record, index) => {
                      this.interviewId = record.id;
                      this.curStatus = "details";
                    }
                  },
                  {
                    tag: "a",
                    text: "审核",
                    className: record.status == 0 ? "" : "none",
                    callback: (record, index) => {
                      getInterInfo2Admin(record.id).then(data => {
                        if (data.state) {
                          this.defaultInfo = data.data;
                          console.log(this.defaultInfo);
                          this.curStatus = "edit";
                        }
                      });
                    }
                  }
                ];
              }
            }
          ];
        }
      }
    },
    setTableUrl(loginType) {
      if (loginType == "COMPANY") {
        this.tableDataUrl =
          "/table-data/employment/examination/getList?timeStamp=" +
          new Date().getTime();
      } else {
        if (this.data.title == "笔/面试管理") {
          //管理员 笔面试管理列表
          this.tableDataUrl =
            "/table-data/employment/manage/examination/getExaminationBySearch?timeStamp=" +
            new Date().getTime();
        } else {
          this.tableDataUrl =
            "/table-data/employment/audit/getExaminationAuditBySearch?timeStamp=" +
            new Date().getTime();
        }
      }
    },
    backToParent() {
      // 触发返回事件
      this.curStatus = "list";
    },
    catchPlaceRules() {
      //获取笔面试场地规则
      getPlaceRules("EXAMINATION").then(data => {
        if (data) {
          this.placeRule = data[0];
          console.log(this.placeRule);
        }
      });
    }
  },
  created() {
    this.catchLoginType();
    this.catchPlaceRules();
  }
};
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
  em,
  span,
  i,
  a {
    display: inline-block;
    vertical-align: middle;
  }
  h1,
  h2,
  h3,
  p {
    margin: 0;
  }
}
</style>
<style lang="less">
#interview {
  .custom-btn {
    height: 44px;
    line-height: 44px;
    padding: 0 20px;
    margin-right: 20px;
    float: right;
  }
  .title {
    h1 {
      color: #000;
      font-size: 16px;
      & > span {
        float: left;
        em {
          background: #3e92fe;
          border-radius: 8px;
          width: 6px;
          height: 22px;
          margin-right: 8px;
        }
        i {
          color: #000;
          font-weight: bold;
        }
      }
      & > a {
        float: right;

        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        i {
          background: url("/static/image/employment/edit.png") no-repeat;
          width: 16px;
          height: 16px;
          margin-right: 10px;
          background-size: contain;
        }
      }
    }
  }
  .btnGroup {
    text-align: center;
    padding-bottom: 30px;
    a {
      width: 150px;
      height: 150px;
      height: 44px;
      margin-right: 20px;
      line-height: 44px;
      border-radius: 4px;
      text-align: center;
      color: #fff;
      background: #3e92fe;
      border: 1px solid #3e92fe;
      cursor: pointer;
    }
  }
}
.setAssistant {
  .el-dialog__body {
    padding: 30px 0;
  }
  .el-form {
    padding: 0 70px;
    label {
      text-align: left;
      i.nameIcon {
        width: 16px;
        height: 18px;
        background: url("/static/image/employment/account.png") no-repeat;
      }
      i.phoneIcon {
        width: 16px;
        height: 18px;
        background: url("/static/image/employment/phoneIcon.png") no-repeat;
      }
    }
    .btnGroup {
      margin-top: 60px;
      a {
        width: 150px;
        height: 150px;
        height: 44px;
        line-height: 44px;
        border-radius: 4px;
        text-align: center;
        color: #999;
        background: #fff;
        border: 1px solid #999;
        cursor: pointer;
      }
      a:last-child {
        color: #fff;
        background: #3e92fe;
        border: 1px solid #3e92fe;
        float: right;
      }
    }
  }
}
</style>
<style lang="less">
.column-opts {
  .opt-btn.none {
    display: none;
  }
}
.interviewTable {
  .line-height-normal {
    line-height: normal;
  }
  .operability-hint {
    color: #000;
  }
}
</style>

