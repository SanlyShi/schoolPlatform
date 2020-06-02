<template>
  <div id="hygienism">
    <!-- <div class="tab">
            <el-tabs v-model="activeName" type="card" @tab-click='handleClick'>
                <el-tab-pane label="男生宿舍" name="man"></el-tab-pane>
                <el-tab-pane label="女生宿舍" name="female"></el-tab-pane>
            </el-tabs>
    </div>-->
    <!-- <div class="row text-center" >
             <v-table  :url="tableUrl" multiple='true' pagesize="10" idField="id" :columns="columns" :order="true"  :search="true">
             </v-table>
    </div>-->
    <div class="tableList" v-if="!toDetails">
      <v-table
        :url="tableUrl"
        :columnsControl="true"
        pagesize="10"
        idField="id"
        :columns="columns"
        :order="true"
        :search="false"
      >
        <div slot="btn-group" class="btn-group pull-right" role="group">
          <button
            type="button"
            @click="addNewBatch"
            class="btn btn-bgColor-style clearBtnBorder"
          >新建批次</button>
          <button type="button" class="btn btn-bgColor-style clearBtnBorder" @click="downLoad">导出</button>
        </div>
      </v-table>
    </div>
    <div class="dialog">
      <v-modal :show="showBatchModal" effect="fade" width="700">
        <div slot="modal-header" class="modal-header">
          <h5 class="modal-title">{{batchInfo.id?'编辑批次':'新建批次'}}</h5>
        </div>
        <div slot="modal-body" class="modal-body">
          <div class="form">
            <el-form :model="batchInfo" ref="ruleForm" label-width="120px">
              <el-form-item label="批次名称:">
                <el-input v-model="batchInfo.name"></el-input>
              </el-form-item>
              <div class="flex">
                <el-form-item label="检查时间:">
                  <el-date-picker
                    v-model="batchInfo.inspectTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="date"
                    placeholder="选择日期"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item class="right" label="操作截止时间:">
                  <el-date-picker
                    v-model="batchInfo.endTime"
                    value-format="yyyy-MM-dd 23:59:59"
                    type="date"
                    placeholder="选择日期"
                  ></el-date-picker>
                </el-form-item>
              </div>
              <el-form-item label="检查维度:">
                <el-select v-model="batchInfo.dimension" @change="selectDimension">
                  <el-option
                    v-for="item in [{label:'按学院选择',id:0},{label:'按楼栋选择',id:1},{label:'自定义导入',id:2}]"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="选择校区:"
                v-if="batchInfo.dimension !== ''&&batchInfo.dimension != 2"
              >
                <el-select @change="selectSchool" v-model="batchInfo.campusId">
                  <el-option
                    v-for="item in schoolList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <div class="choiceArea" v-if="batchInfo.dimension !== ''&&batchInfo.dimension != 2">
                <el-form-item label="选择区域:" style="width: 80%;" v-if="batchInfo.dimension === 0">
                  <el-select v-model="batchInfo.region" multiple>
                    <el-option
                      v-for="item in areaList"
                      :key="item.collegeId"
                      :label="item.name"
                      :value="item.collegeId"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="选择区域:" style="width: 80%;" v-if="batchInfo.dimension === 1">
                  <el-select v-model="batchInfo.region" multiple>
                    <el-option
                      v-for="item in areaList"
                      :key="item.building_id"
                      :label="item.name"
                      :value="item.building_id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="检查比例:">
                  <el-input @blur="setProportion" v-model.number="batchInfo.proportion">
                    <template slot="append">%</template>
                  </el-input>
                </el-form-item>
              </div>
              <div class="choiceArea" v-if="batchInfo.dimension == 2">
                <el-form-item label>
                  <v-import v-bind="importParams" :needBack="false" :needUpload="false"></v-import>
                </el-form-item>
              </div>
              <el-form-item label="添加检查员:">
                <el-select
                  v-model="batchInfo.inspectorsStr"
                  filterable
                  clearable
                  multiple
                  remote
                  @change="selectChange"
                  :remote-method="remoteMethod"
                  :loading="loading"
                  popper-class="selectList"
                  placeholder="请输入学工名称或者学工号"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.userNo"
                    :label="item.name"
                    :value="item.userId"
                  >{{item.name + ` (${item.userNo})`}}</el-option>
                </el-select>
              </el-form-item>
              <el-form-item label='已添加的检查员:' v-show="batchInfo.id">
                <el-tag style="margin-right:10px;" v-for="(item,index) in addUsers" closable @close="deleteUser(item,index)" :key="index">
                  {{item.name}}
                </el-tag>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div slot="modal-footer" class="modal-footer">
          <button type="button" class="btn submit-btn clearBtnBorder" @click="submit">确定</button>
          <button type="button" class="btn cancel-btn clearBtnBorder" @click="cancle">取消</button>
        </div>
      </v-modal>
    </div>
    <check-details v-if="toDetails" @back='back' :batchId="curBatchId"></check-details>
  </div>
</template>
<script>
import { sAjax } from "../../assets/utils/utils";
import checkDetails from "./components/checkDetails";
export default {
  components: {
    checkDetails
  },
  data() {
    return {
      importParams: {
        // parentPageTitle: '添加应检查的宿舍房间号',
        downloadTemplateUrl: "/apartment/sanitaryInspection/template",
        downloadErrorTemplateUrl: "/apartment/sanitaryInspection/errorFile",
        checkTemplateUrl: "/apartment/sanitaryInspection/checkExcel",
        templateName: "批量导入房间信息",
        importBtnType: [
      {
        url: "/apartment/sanitaryInspection/checkExcel",
        method: "post",
        isShowBtn: true,
        name: "导入检查列表",
        success: data => {
          if (data.code == "88888") {
            this.dataKey = data.data.dataKey;
          }
        }
      }
    ]
      },
      curBatchId: "",
      toDetails: false,
      activeName: "man",
      tableUrl: "/table-data/apartment/sanitaryInspection/batchList",
      columns: [],
      showBatchModal: false,
      schoolList: [],
      areaList: [], //区域列表 //楼栋或者学院
      batchInfo: {
        name: "",
        inspectTime: "", //检查时间
        endTime: "", //截止时间
        dimension: "", //维度
        campusId: "", //校区ID （选择楼栋或者学院方式才有）
        region: [], //区域集合（选择楼栋或者学院方式才有）
        proportion: "", //比例
        inspectorsStr: [] //操作人
        // dataKey: '',//选择自定义导入才有
      },
      options: [],
      inspector: "",
      curInspectorObj: {},
      dataKey: "",
      addUsers: [],
    };
  },
  methods: {
    back() {
      this.toDetails = false
    },
    downLoad() {
      let url = '/downloads/apartment/sanitaryInspection/getExcel'
      window.location.href = url
    },
    setProportion() {
      let value = Number(this.batchInfo.proportion);
      if (value < 0 || !value) return (this.batchInfo.proportion = 0);
      if (value > 100) return (this.batchInfo.proportion = 100);
      //   return this.batchInfo.proportion =
    },
    deleteUser(index,item) {
      this.addUsers.splice(index,1)
    },
    selectChange(v) {
      console.log(v)
    },
    submit() {
      let obj = this.batchInfo;
      let region = obj.region;
      let url;
      let keepGo = true;
      if (obj.name == "") return this.$toast("请输入批次名称");
      if (obj.inspectTime == "") return this.$toast("请选择检查时间");
      if (obj.endTime == "") return this.$toast("请选择操作截止时间");
      if (obj.dimension === "") return this.$toast("请选择检查维度");

      if (obj.dimension != 2) {
        if (obj.campusId == "") return this.$toast("请选择校区");
        if (!obj.region.length) return this.$toast("请选择区域");
        if (obj.proportion === "") return this.$toast("请输入检查比例");
      }
      if (!obj.inspectorsStr.length&&!this.addUsers.length) return this.$toast("请添加检查员");

      let inspectTime = obj.inspectTime
      let endTime = obj.endTime
      var mydate = new Date();
      var str = "" + mydate.getFullYear() + "-";
      str += mydate.getMonth() + 1 + "-";
      str += mydate.getDate();
      
      var tady = str.replace("-", "/").replace("-", "/");
      var end = endTime.replace("-", "/").replace("-", "/");
      var start = inspectTime.replace("-", "/").replace("-", "/");
      if (new Date(start).getTime() - new Date(tady).getTime() < 86400000) {
        return this.$toast("检查时间应只可“明天”以上的时间");
      }
      if (new Date(end).getTime() < new Date(start).getTime()) {
        return this.$toast("截止时间不得小于检查时间");
      }
      if (obj.dimension == 2) {
        if (this.dataKey == ""&&!obj.id) {
          this.$confirm("尚未上传宿舍信息, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              if (obj.id) {
                url = "/api/apartment/sanitaryInspection/update";
                for(let i = 0;i<this.addUsers.length;i++) {
                  if(obj.inspectorsStr.indexOf(this.addUsers[i].userId) < 0) {
                    obj.inspectorsStr.push(this.addUsers[i].userId)
                  }
                  
                }
              } else {
                url = "/api/apartment/sanitaryInspection/add";
              }
              
              let dataInfo = {
                name: obj.name,
                inspectTime: obj.inspectTime,
                dimension: obj.dimension,
                endTime: obj.endTime,
                campusId: obj.campusId,
                regions: obj.region.join(","),
                proportion: Number(obj.proportion) / 100,
                inspectorsStr: obj.inspectorsStr.join(","),
                dataKey: this.dataKey
              };
              if (obj.id) dataInfo.id = obj.id;
              sAjax({
                url: url,
                type: "post",
                data: dataInfo,
                success: data => {
                  if (data.state) {
                    this.$toast("保存成功");
                    this.tableUrl =
                      "/table-data/apartment/sanitaryInspection/batchList?ts=" +
                      new Date().getTime();
                    this.resetForm();
                    this.showBatchModal = false;
                  } else {
                    this.$toast(data.message);
                  }
                },
              });
            })
            .catch(() => {});
        }else {
          if (obj.id) {
                url = "/api/apartment/sanitaryInspection/update";
                for(let i = 0;i<this.addUsers.length;i++) {
                  if(obj.inspectorsStr.indexOf(this.addUsers[i].userId) < 0) {
                    obj.inspectorsStr.push(this.addUsers[i].userId)
                  }
                  
                }
              } else {
                url = "/api/apartment/sanitaryInspection/add";
              }
              
              let dataInfo = {
                name: obj.name,
                inspectTime: obj.inspectTime,
                dimension: obj.dimension,
                endTime: obj.endTime,
                campusId: obj.campusId,
                regions: obj.region.join(","),
                proportion: Number(obj.proportion) / 100,
                inspectorsStr: obj.inspectorsStr.join(","),
                dataKey: this.dataKey
              };
              if (obj.id) dataInfo.id = obj.id;
              sAjax({
                url: url,
                type: "post",
                data: dataInfo,
                success: data => {
                  if (data.state) {
                    this.$toast("保存成功");
                    this.tableUrl =
                      "/table-data/apartment/sanitaryInspection/batchList?ts=" +
                      new Date().getTime();
                    this.resetForm();
                    this.showBatchModal = false;
                  } else {
                    this.$toast(data.message);
                  }
                },
              });
        }
      } else {
        if (obj.id) {
          url = "/api/apartment/sanitaryInspection/update";
          for(let i = 0;i<this.addUsers.length;i++) {
              if(obj.inspectorsStr.indexOf(this.addUsers[i].userId) < 0) {
                    obj.inspectorsStr.push(this.addUsers[i].userId)
                  }
            }
        } else {
          url = "/api/apartment/sanitaryInspection/add";
        }
        let dataInfo = {
          name: obj.name,
          inspectTime: obj.inspectTime,
          dimension: obj.dimension,
          endTime: obj.endTime,
          campusId: obj.campusId,
          regions: obj.region.join(","),
          proportion: Number(obj.proportion) / 100,
          inspectorsStr: obj.inspectorsStr.join(","),
          dataKey: this.dataKey
        };
        if (obj.id) dataInfo.id = obj.id;
        sAjax({
          url: url,
          type: "post",
          data: dataInfo,
          success: data => {
            if (data.state) {
              this.$toast("保存成功");
              this.tableUrl =
                "/table-data/apartment/sanitaryInspection/batchList?ts=" +
                new Date().getTime();
              this.resetForm();
              this.showBatchModal = false;
            } else {
              this.$toast(data.message);
            }
          }
        });
      }
    },
    
    resetForm() {
      this.batchInfo = {
        name: "",
        inspectTime: "", //检查时间
        endTime: "", //截止时间
        dimension: "", //维度
        campusId: "", //校区ID （选择楼栋或者学院方式才有）
        region: [], //区域集合（选择楼栋或者学院方式才有）
        proportion: "", //比例
        inspectorsStr: [] //操作人
        // dataKey: '',//选择自定义导入才有
      };
      this.addUsers = []
      this.options = [];
      // this.inspector = ''
      this.curInspectorObj = {};
      this.areaList = [];
    },
    getSchoolList() {
      sAjax({
        url: "/api/apartment/dicts?typeName=校区",
        type: "get",
        success: data => {
          if (data.state) {
            this.schoolList = data.data;
          }
        }
      });
    },
    selectDimension(value) {
      this.batchInfo.campusId = "";
      this.batchInfo.region = [];
      this.areaList = [];
      console.log(value);
      if (value == 2) {
         
      }
    },
    selectSchool(value) {
      this.$set(this.batchInfo,'region',[])
      if (this.batchInfo.dimension == 1) {
        //按楼栋
        let url =
          "/api/apartment/sanitaryInspection/getBuildings/" +
          this.batchInfo.campusId;
        sAjax({
          url: url,
          type: "get",
          success: data => {
            if (data.state) {
              this.areaList = data.data;
              // if(this.areaList.length) {
              //   for(let i = 0;i<this.areaList.length;i++) {
              //     this.areaList[i].
              //   }
              // }
            }
          }
        });
      } else if (this.batchInfo.dimension == 0) {
        //按学院
        let url =
          "/api/apartment/sanitaryInspection/getColleges/" +
          this.batchInfo.campusId;
        sAjax({
          url: url,
          type: "get",
          success: data => {
            if (data.state) {
              this.areaList = data.data;
            }
          }
        });
      }
      
    },

    remoteMethod(query) {
      console.log(query);
      if (query !== "") {
        this.loading = true;
        let url = "/api/apartment/users/searchResults?keyword=" + query;
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
    addNewBatch() {
      this.addUsers = []
      this.showBatchModal = true;

    },
    cancle() {
      this.showBatchModal = false;
      this.resetForm();
    }
  },
  created() {
    this.getSchoolList();
    this.columns = [
      {
        id: "name",
        title: "批次名称",
        className: "text-left",
        width: 200,
        hidden: false,
        search: {
          type: "input"
        }
      },
      {
        id: "inspectTimeForSeaRch",
        title: "检查时间",
        width: "150px",
        className: "text-left",
        hidden: false,
        formatter: record => {
          let time = record.inspectTime;
          if (time) {
            return time.split(" ")[0];
          } else {
            return "";
          }
        },
        search: {
          type: "input"
        }
      },
      {
        id: "endTimeForSeaRch",
        title: "操作截止时间",
        className: "text-left",
        hidden: false,
        formatter: record => {
          let time = record.endTime;
          if (time) {
            return time.split(" ")[0];
          } else {
            return "";
          }
        },
        search: {
          type: "input"
        }
      },
      {
        id: "inspectStatus",
        title: "检查情况",
        className: "text-left",
        hidden: false
      },
      {
        id: "inspectorsStr",
        title: "检查员",
        className: "text-left",
        hidden: true,
        search: {
          type: "input"
        },
        formatter: (record) => {
          return record.inspectorNames
        }
      },
      {
        id: "dimensions",
        title: "检查方式",
        className: "text-left",
        hidden: true,
        formatter: record => {
          if (record.dimension == 0) {
            return "按学院随机";
          }
          if (record.dimension == 1) {
            return "按楼栋随机";
          }
          if (record.dimension == 2) {
            return "自定义导入";
          }
        },
        search: {
          type: "multiSelect",
          data: {
            options: [
              { code: 0, label: "按学院随机" },
              { code: 1, label: "按楼栋随机" },
              { code: 2, label: "自定义导入" }
            ],
            optionsLabel: "label",
            optionsValue: "code"
          }
        }
      },
      {
        id: "proportion",
        title: "检查比例",
        className: "text-left",
        hidden: true,
        formatter: record => {
          if (record.proportion == 0) {
            return 0;
          } else {
            return record.proportion * 100 + "%";
          }
        },
        search: {
          type: "input",
          // data: {
          //   change: v => {
          //     this.searchParams.proportion = Number(v.value)/100
          //     console.log(this.tableUrl)
          //   }
          // }
        }
      },
      {
        id: "inspectStatusList",
        title: "状态",
        className: "text-left",
        hidden: false,
        formatter: record => {
          return record.statusName;
          // if(record.inspectStatus== 0 ){
          //     return '未开始'
          // }
          // if(record.inspectStatus== 1 ){
          //     return '正在进行'
          // }
          // if(record.inspectStatus== 2 ){
          //     return '已结束'
          // }
        },
        search: {
          type: "multiSelect",
          data: {
            options: [
              { code: 0, label: "未开始" },
              { code: 1, label: "正在进行" },
              { code: 2, label: "已结束" }
            ],
            optionsLabel: "label",
            optionsValue: "code"
          }
        }
      },
      {
        id: "creatorName",
        title: "创建者",
        className: "text-left",
        hidden: true,
        search: {
          type: "input"
        }
      },
      {
        id: "opt",
        title: "操作",
        className: "text-left",
        width: 200,
        hidden: false,
        formatter: record => {
          return [
            {
              tag: "a",
              text: "查看",
              className: "opt-btn",
              callback: record => {
                this.curBatchId = record.id;
                this.toDetails = true;
              }
            },
            {
              tag: "a",
              text: "编辑",
              className: "opt-btn",
              callback: record => {
                // let endTime = record.endTime.split(" ")[0];
                // var mydate = new Date();
                // var str = "" + mydate.getFullYear() + "-";
                // str += mydate.getMonth() + 1 + "-";
                // str += mydate.getDate();
                // var tady = str.replace("-", "/").replace("-", "/");
                // var end = endTime.replace("-", "/").replace("-", "/");
                // if (new Date(end).getTime() < new Date(tady).getTime()) {
                //   return this.$toast("该批次已开始，不可编辑！");
                // }
                if(record.status == 1){
                  return this.$toast("该批次已开始，不可编辑！");
                }
                if(record.status == 2){
                  return this.$toast("该批次已结束，不可编辑！");
                }
                this.addUsers = [];
                this.batchInfo.dimension = record.dimension;
                this.batchInfo.campusId = record.campusId + "";
                // this.batchInfo.region = []
                this.selectSchool();
                sAjax({
                  url: '/api/apartment/sanitaryInspection/' + record.id,
                  type: 'get',
                  success: (data) => {
                    if(data.state) {
                      let info = data.data
                      this.batchInfo = {
                        //dimension: record.dimension,
                        id: info.id,
                        name: info.name,
                        inspectTime: info.inspectTime, //检查时间
                        endTime: info.endTime, //截止时间
                        dimension: info.dimension, //维度
                        campusId: info.campusId + "", //校区ID （选择楼栋或者学院方式才有）
                        region: [],//区域集合（选择楼栋或者学院方式才有）
                        proportion: info.proportion, //比例
                        inspectorsStr: [],//操作人
                        dataKey: info.dataKey,//选择自定义导入才有
                      };
                      this.addUsers = data.data.inspectorsUser
                      if(info.region) {
                        let region = info.region.split(",")
                        this.batchInfo.region = region
                      }
                      
                      let regionList = []
                      
                      // this.$nextTick(() => {
                      //     for(let i = 0;i<region.length;i++) {
                      //       this.batchInfo.region.push(Number(region[i]))
                      //     }
                      //   this.$set(this.batchInfo,'inspectorsStr',[])
                      // })
                      
                      this.showBatchModal = true;
                    }

                  }
                })
              }
            },
            {
              tag: "a",
              text: "关闭批次",
              className: "opt-btn",
              callback: record => {
                if(record.status == 2){
                  return this.$toast("该批次已结束，不可关闭！");
                }
                this.$confirm("是否关闭该批次?", "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                })
                  .then(() => {
                    let url =
                      "/api/apartment/sanitaryInspection/close/" + record.id;
                    sAjax({
                      url: url,
                      type: "post",
                      success: data => {
                        if (data.state) {
                          this.tableUrl =
                            "/table-data/apartment/sanitaryInspection/batchList?ts=" +
                            new Date().getTime();
                          this.$toast("已关闭");
                        }
                      }
                    });
                  })
                  .catch(() => {
                    this.$message({
                      type: "info",
                      message: "已取消关闭"
                    });
                  });
              }
            },
            {
              tag: "a",
              text: "删除",
              className: "opt-btn",
              callback: record => {
                // let endTime = record.endTime.split(" ")[0];
                // var mydate = new Date();
                // var str = "" + mydate.getFullYear() + "-";
                // str += mydate.getMonth() + 1 + "-";
                // str += mydate.getDate();
                // var tady = str.replace("-", "/").replace("-", "/");
                // var end = endTime.replace("-", "/").replace("-", "/");
                // if (new Date(end).getTime() < new Date(tady).getTime()) {
                //   return this.$toast("该批次已开始，不可删除！");
                // }
                if(record.status == 1){
                  return this.$toast("该批次已开始，不可删除！");
                }
                if(record.status == 2){
                  return this.$toast("该批次已结束，不可删除！");
                }
                this.$confirm("是否删除该批次?", "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                })
                  .then(() => {
                    let url =
                      "/api/apartment/sanitaryInspection/delete/" + record.id;
                    sAjax({
                      url: url,
                      type: "post",
                      success: data => {
                        if (data.state) {
                          this.tableUrl =
                            "/table-data/apartment/sanitaryInspection/batchList?ts=" +
                            new Date().getTime();
                          this.$toast("已删除");
                        }
                      }
                    });
                  })
                  .catch(() => {
                    this.$message({
                      type: "info",
                      message: "已取消关闭"
                    });
                  });
              }
            }
          ];
        }
      }
    ];
    // this.importParams.checkTemplateUrl =
    //   "/apartment/sanitaryInspection/checkExcel";
    // this.importParams.importBtnType = [
    //   {
    //     url: "/apartment/sanitaryInspection/checkExcel",
    //     method: "post",
    //     isShowBtn: true,
    //     name: "导入检查列表",
    //     success: data => {
    //       if (data.code == "88888") {
    //         debugger
    //         this.dataKey = data.data.dataKey;
    //       }
    //     }
    //   }
    // ];
  }
};
</script>
<style lang="less">
#hygienism {
  .tab {
    margin-right: -15px;
    margin-left: -15px;
    margin-bottom: 20px;
    .el-tabs__header {
      margin: 0;
      border-bottom: none;
    }
    .el-tabs--card > .el-tabs__header .el-tabs__nav {
      background: #fff;
    }
    .el-tabs__item.is-active {
      color: #298df7;
    }
  }
  .flex {
    display: flex;
    .el-form-item {
      display: inline-block;
      width: auto;
      .el-date-editor.el-input {
        width: auto;
      }
      
    }
  }
}
.modal-body {
  .el-form {
    // .el-form-item {
    //     height: 32px;
    // }
    // .el-input__inner {
    //     height: 32px;
    //     line-height: 32px;
    // }
    .el-select {
      width: 100%;
    }
    .choiceArea {
      display: flex;
      #batchSet-page {
        padding: 0;
        .page-title,
        .page-text-prompt {
          display: none;
        }
      }
      .back-btn {
        display: none;
      }
    }
  }
}
</style>