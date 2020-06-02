<template>
  <div id="checkDetails">
      
    <div v-if="!toEdit&&!isImport">
      <div class="tab">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="男生宿舍" name="1"></el-tab-pane>
          <el-tab-pane label="女生宿舍" name="2"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="row text-center">
        <v-table
          :url="tableUrl"
          pagesize="10"
          idField="id"
          :columns="columns"
          :order="true"
          :search="true"
        >
        <div slot="btn-group" class="btn-group pull-left" role="group">
            <button type="button" @click="back" class="btn btn-bgColor-style clearBtnBorder">返回</button>
          </div>
          <div slot="btn-group" class="btn-group pull-right" role="group">
            <button type="button" @click="downLoad" class="btn btn-bgColor-style clearBtnBorder">导入</button>
            <button type="button" @click="outPut" class="btn btn-bgColor-style clearBtnBorder">导出</button>
            
          </div>
        </v-table>
      </div>
    </div>
    <!-- 编辑详情 -->
    <hygienism-details v-if="toEdit" @back='backToParent' :id="id" :roomId="roomId"></hygienism-details>

    <!-- 导入 -->
    <v-import v-bind="importParams" @backParentPage="backParentPage" v-if="isImport"></v-import>
  </div>
</template>
<script>
import hygienismDetails from "./hygienismDetails";
import { sAjax } from "../../../assets/utils/utils";
export default {
  props: ["batchId"],
  components: {
    hygienismDetails
  },
  data() {
    return {
      isImport: false,
      activeName: "1",
      tableUrl: "",
      columns: [],
      toEdit: false,
      schoolList: [],
      unitList: [],
      buildings: [],
      zoneIds: [],
      campusIds: [],
      zoneNames: [],
      id:'',
      roomId: '',
      disciplinary: [],
      collegeList: [],
      importParams: {
        // parentPageTitle: '添加应检查的宿舍房间号',
        downloadTemplateUrl: "/apartment/sanitaryInspection/template",
        downloadErrorTemplateUrl: "/apartment/sanitaryInspection/errorFile",
        checkTemplateUrl: "/apartment/sanitaryInspection/checkExcel",
        templateName: "批量导入房间信息",
        importBtnType: null
      },
    };
  },
  methods: {
    backParentPage() {
      this.isImport = false
      
    },
    backToParent() {
      this.toEdit = false
    },
    back() {
      this.$emit('back')
    },
    downLoad() {
      
    this.importParams.importBtnType = [
      {
        url: "/apartment/sanitaryInspection/room/addByExcel/" + this.batchId,
        method: "post",
        isShowBtn: true,
        name: "导入检查列表",
        success: data => {
          if(data.state) {
            this.isImport = false
            this.setTableurl()
          }else {
            this.$toast(data.message)
          }
        }
      }
    ];
    this.isImport = true
    },
    outPut() {
      let url = '/downloads/apartment/sanitaryInspection/room/getExcel/' + this.batchId
      window.location.href = url
    },
    setTableurl() {
      this.tableUrl =
        "/table-data/apartment/sanitaryInspection/room/List/" +
        this.batchId +
       
        "?sexList="+ this.activeName
        +"&ts=" +
        new Date().getTime();
    },
    handleClick() {
      this.setTableurl();
    },
    getSchool() {
      let url = "/api/apartment/dicts?typeName=校区";
      sAjax({
        url: url,
        type: "get",
        success: data => {
          if (data.state) {
            this.schoolList = data.data;
            this.getUnit()
            setTimeout(() => {
                this.initColumns()
            },300)
          }
        }
      });
    },
    getDisciplinary() {
      let url = "/api/apartment/dicts?typeName=违规类型";
      sAjax({
        url: url,
        type: "get",
        success: data => {
          if (data.state) {
            this.disciplinary = data.data;
          }
        }
      });
    },
    getCollege() {
      let url = "/api/apartment/unit/list";
      sAjax({
        url: url,
        type: "get",
        success: data => {
          if (data.state) {
            this.collegeList = data.data;
          }
        }
      });
    },
    getUnit() {
      let url = "/api/apartment/unit/list";  
      sAjax({
        url: url,
        type: "get",
        success: data => {
          if (data.state) {
            this.unitList = data.data;
          }
        }
      });
    },
    _getZonesData: function () {
        sAjax({
          url: '/api/apartment/zones/getByCampuses?campusIds=' + this.campusIds,
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.zoneNames.splice(0, this.zoneNames.length)
              if (data.data) {
                data.data.forEach((ele) => {
                  this.zoneNames.push({
                    label: ele.name,
                    value: ele.name
                  })
                })
                setTimeout(() => {
                   this.initColumns()
                }, 200);
              }
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
    _getBuildingsData: function () {
        sAjax({
          url: '/api/apartment/buildings/getWithConditions?campusIds=' + this.campusIds + '&zoneIds=' + this.zoneIds,
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.buildings.splice(0, this.buildings.length)
              if (data.data) {
                data.data.forEach((ele) => {
                  this.buildings.push({
                    label: ele.name,
                    value: ele.buildingId
                  })
                })
              }
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
    initColumns() {
      this.columns = [
        {
          id: "campusNames",
          title: "校区",
          className: "text-left",
          hidden: false,
          search: {
            type: "multiSelect",
            data: {
              options: this.schoolList,
              optionsLabel: "label",
              optionsValue: "label",
              change: (obj) => {
                this.campusIds.splice(0, this.campusIds.length)
                if (obj.value.length > 0) {
                  this.campusIds = obj.value.split(',')
                }
                this._getZonesData()
              }
            }
          },
          formatter: (record) => {
            return record.campusName
          }
        },
        {
          id: "zoneNames",
          title: "园区",
          width: "150px",
          className: "text-left",
          hidden: false,
          search: {
            type: "multiSelect",
            data: {
              options: this.zoneNames,
              optionsLabel: 'label',
              optionsValue: 'value',
              change: (obj) => {
                this.zoneIds.splice(0, this.zoneIds.length)
                if (obj.value.length > 0) {
                  this.zoneIds = obj.value.split(',')
                }
                // this._getBuildingsData()
              }
            }
          },
          formatter: (record) => {
            return record.zoneName
          }
        },
        {
          id: "buildingName",
          title: "楼栋",
          className: "text-left",
          hidden: false,
           search: {
            type: 'input',
          }
        },
        {
          id: "roomName",
          title: "房间号",
          className: "text-left",
          hidden: false,
          search: {
            type: "input"
          }
        },
        {
          id: "statusList",
          title: "检查状态",
          className: "text-left",
          hidden: false,
          search: {
            type: 'multiSelect',
            data: {
              options: [{label:'未检查',value: '0'},{label: '已检查',value: '1'}],
              optionsLabel: "label",
              optionsValue: "value",
            }
          },
          formatter: record => {
            if (record.status == 0) {
              return "未检查";
            }
            if (record.status == 1) {
              return "已检查";
            }
            // if(record.status == 2) {
            //     return "已检查"
            // }
          }
        },
        {
          id: "total",
          title: "卫生检查得分",
          className: "text-left",
          hidden: false,
          search: {
            type: "input"
          },
          sorting: true,
          sortType: '', 
        },
        {
          id: "disciplinary",
          title: "违纪事项",
          className: "text-left over",
          hidden: false,
          search: {
            type: 'multiSelect',
            data: {
              options: this.disciplinary,
              optionsLabel: "label",
              optionsValue: "value",
            }
          },
        },
        {
          id: "colleges",
          title: "学院",
          className: "text-left",
          hidden: false,
          search: {
            type: 'multiSelect',
            data: {
              options: this.collegeList,
              optionsLabel: "name",
              optionsValue: "code",
            }
          },
          formatter: (record) => {
            return record.college
          }
        },
        {
          id: "opt",
          title: "操作",
          className: "text-left",
          width: 60,
          hidden: false,
          formatter: record => {
            return [
              {
                tag: "a",
                text: "查看",
                className: "opt-btn",
                callback: record => {
                  this.id = record.id
                  this.roomId = record.roomId
                  this.toEdit = true;
                }
              }
            ];
          }
        }
      ];
    }
  },
  created() {
    this.setTableurl();
    this.getSchool();
    this.getDisciplinary();
    this.getCollege();
  }
};
</script>
<style lang="less">
#checkDetails {
  .table-container {
     .over {
       max-width: 80%;
     }
  }
    .back {
        a {
            cursor: pointer;
        }
    }
  .tab {
    margin-bottom: 20px;
    margin-right: 0;
    margin-left: 0;
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
  .row {
    margin: 0;
  }
}
</style>