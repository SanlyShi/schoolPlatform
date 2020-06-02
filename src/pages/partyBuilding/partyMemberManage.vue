<template>
  <div v-if="!showDetailStatus" id="party-member-manage" class="container-fluid">
    <div class="back-parent-page">
      <button type="button" class="btn back-btn clearBtnBorder box_flex align_center" @click="_backParentPage">
        <i class="maticon back-icon-btn" v-html="icons('arrow_back')">arrow_back</i>
        <span class="nav-title">{{selectItem.parentPageTitle}}</span>
      </button>
    </div>
    <v-table :columns="columns" ref="table" :url="tableData_url+selectItem.organizationId+timestamp" :columnsControl="true" pagesize="10" :order="true" :search="false">
      <div slot="btn-group" role="group">
        <div class="btn-group pull-left set">
          <div class="batch-options" v-if="tableCheckedList.length > 0">
            <span class="pull-left">已选择{{tableCheckedList.length}}项，其中可操作的有{{tableCheckedList.length}}项</span>
            <div class="pull-left">
              <button type="button" class="btn btn-bgColor-style clearBtnBorder resetBtn" @click="setParty = true;selectedParty = ''"><span>设置所属党组织</span></button>
            </div>
          </div>
        </div>
        <div class="btn-group pull-right">
          <button type="button" class="btn batch-add-btn btn-bgColor-style clearBtnBorder" @click="addMember()">新增成员</button>
          <button type="button" class="btn batch-add-btn btn-bgColor-style clearBtnBorder" @click="quickAddRecord">批量新增</button>
          <button type="button" class="btn batch-add-btn btn-bgColor-style clearBtnBorder" @click="exportStat">导出</button>
        </div>
      </div>
    </v-table>

    <!-- 设置所属党组织模态框 -->
    <v-modal :show="addMemberStatus" id="infoModal" effect="fade" width="400">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">新增成员</h5>
      </div>
      <div slot="modal-body" class="modal-body setParty box_flex align_center" style="overflow: inherit;">
        <label class="partyName" style="margin-right:5px;">姓名</label>
        <detect url='api/document/students/searchResults' placeholder="输入姓名或者学号" @afterSelected="obj=>{afterDetect(obj)}"></detect>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="addMemberStatus = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="submitAdd">确定</button>
      </div>
    </v-modal>
    <div class="importPageClass" v-show="curRoute === 'importPage'">
      <v-import v-bind="importParams" @backParentPage="curRoute = 'allStaff'"></v-import>
    </div>
  </div>
  <div v-else class="detail_wrap">
    <label class="back pull-left" style="padding:0" @click="showDetailStatus = false">
      <i class="maticon pull-left" v-html="icons('arrow_back')">arrow_back</i>
      <span>返回</span>
    </label>
    <div style="margin-top:40px;" class="form-wrap box_flex align_center input_wrap flex_wrap">
      <div slot="modal-body" class="modal-body canEdit">
        <h1>基本信息</h1>
        <div class="col-md-3">
          <div class="form-group">
            <label class="input-label title-label">姓名:</label>
            <label class="input-label modal-label">{{userInfo.name}}</label>
          </div>
          <div class="form-group">
            <label class="input-label title-label">年级:</label>
            <label class="input-label modal-label">{{userInfo.grade}}</label>
          </div>
          <div class="form-group">
            <label class="input-label title-label">培养层次:</label>
            <label class="input-label modal-label">{{userInfo.educationLevel}}</label>
          </div>
        </div>
        <div class="col-md-3">
          <div class="form-group">
            <label class="input-label title-label">学号:</label>
            <label class="input-label modal-label">{{userInfo.studentId}}</label>
          </div>
          <div class="form-group">
            <label class="input-label title-label">班级:</label>
            <label class="input-label modal-label">{{userInfo.className}}</label>
          </div>
          <div class="form-group">
            <label class="input-label title-label">生源地:</label>
            <label class="input-label modal-label">{{userInfo.originPlace}}</label>
          </div>
        </div>
        <div class="col-md-3">
          <div class="form-group">
            <label class="input-label title-label">性别:</label>
            <label class="input-label modal-label">{{userInfo.sex}}</label>
          </div>
          <div class="form-group">
            <label class="input-label title-label">学院:</label>
            <label class="input-label modal-label">{{userInfo.college}}</label>
          </div>
          <div class="form-group">
            <label class="input-label title-label">出生日期:</label>
            <label class="input-label modal-label">{{userInfo.birthday}}</label>
          </div>
        </div>
        <div class="col-md-3">
          <div class="form-group">
            <label class="input-label title-label">民族:</label>
            <label class="input-label modal-label">{{userInfo.nation}}</label>
          </div>
          <div class="form-group">
            <label class="input-label title-label">专业:</label>
            <label class="input-label modal-label">{{userInfo.major}}</label>
          </div>
        </div>
      </div>
    </div>
    <div slot="modal-body" class="modal-body canEdit">
      <div class="editCt">
        <h1>入党信息</h1>
        <div class="col-md-3">
          <div class="form-group">
            <label class="input-label title-label">政治面貌:</label>
            <label class="input-label modal-label">{{userInfo.politicalStatus}}</label>
          </div>
          <div class="form-group">
            <label class="edit-class-text">申请入党时间:</label>
            <label class="input-label modal-label">{{userInfo.studentPartyBuildInfo.applyTime}}</label>
          </div>
        </div>
        <div class="col-md-3">
          <div class="form-group">
            <label class="input-label title-label">培养发展阶段:</label>
            <label class="input-label modal-label">{{userInfo.trainingAndDevelopmentStage}}</label>
          </div>
          <div class="form-group">
            <label class="edit-class-text">入党时间:</label>
            <label class="input-label modal-label">{{userInfo.studentPartyBuildInfo.joinTime}}</label>
          </div>
        </div>
        <div class="col-md-3">
          <div class="form-group">
            <label class="input-label title-label">发展入党的党组织:</label>
            <label class="input-label modal-label">{{userInfo.studentPartyBuildInfo.recommendPartyOrganizations}}</label>
          </div>
          <div class="form-group">
            <label class="edit-class-text">转正时间:</label>
            <label class="input-label modal-label">{{userInfo.studentPartyBuildInfo.correctionTime}}</label>
          </div>
        </div>
        <div class="col-md-3">
          <div class="form-group">
            <label class="input-label title-label">所属党组织:</label>
            <label class="input-label modal-label">{{userInfo.partyBuildOrganization.name}}</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { sAjax, request, createTime } from '../../assets/utils/utils';
import importTable from "../../mixins/import.js";
export default {
  mixins: [importTable],
  data() {
    return {
      columns: [],
      gradeOptions: [],
      timestamp: "?timestamp=",
      tableData_url: '/table-data/partyBuild/users/page/users/',
      showInfoModal: false,
      isCheck: false,
      organizationName_options: [],//所属党组织列表
      organizationPosition_options: [],//党支部书记列表
      collegeId: '',
      grade: '',
      politicalStatus: '',
      organizationName_value: '',
      organizationPosition: '',
      organizationName: '',
      userInfo: {
        partyBuildOrganization: {},
        studentPartyBuildInfo: {},
      },//用户信息
      seleteFace_list: [],//政治面貌下拉列表
      editInfo: {
        politicalStatus: '',
        studentPartyBuildInfo: {
          joinTime: '',
          correctionTime: '',
          recommendPartyOrganizations: '',
        },
        partyBuildOrganization: {
          id: ''
        }

      },//编辑用户信息
      selectList: [],//党组织列表Options
      selectModel: '',
      recommendPartyOrganizations_model: '',
      seleteFace: '',//面貌中文说明
      seleteFace_id: '',
      tableCheckedList: [],
      setParty: false,
      selectedParty: '',
      showDetailStatus: false,
      checkRows: [],
      addMemberStatus: false,
      addParams: {
        userNo: '',// 学号
        userId: '',// 用户id
      },
    }
  },
  props: {
    selectItem: {
      default: {}
    }
  },
  methods: {
    _backParentPage() {
      this.$parent.showMember = false;
    },
    afterChecked(rows) {
      this.checkRows = rows;
    },
    afterDetect(obj) {
      this.addParams.userId = obj.userId
    },
    getGrade() {   //生成年级列表（前后5年）
      let year = new Date().getFullYear()
      for (let i = year - 5; i < year + 5; i++) {
        this.gradeOptions.push({
          id: i + '',
          name: i + ''
        })
      }
    },
    getFace() {
      sAjax({
        type: 'get',
        url: '/api/system/dicts?dictType=政治面貌',
        success: (data) => {
          if (data.state) {
            this.seleteFace_list = data.data
            data.data.map((value) => {
              if (value.label == this.seleteFace) {
                this.seleteFace_id = value.value
              }
            })
          }
        }
      })
    },
    getPositionOptions() {
      let url = '/api/partyMember/personInChargePositionOptions'
      sAjax({
        url: url,
        type: 'get',
        success: (data) => {
          if (data.state) {
            data.data.organizationName.map((val) => {
              this.organizationName_options.push(val)
            })
            data.data.organizationPosition.map((val) => {
              this.organizationPosition_options.push(val)
            })
          }
        }
      })
    },
    partySelect(e) { //党组织下拉回调
      this.editInfo.partyBuildOrganization.id = e.value
    },
    faceSelect(e) { //政治面貌下拉回调
      this.seleteFace_id = e.value
    },
    exportStat() {
      let url = `/downloads/partyBuild/users/excels?organizationId=${this.selectItem.organizationId}`
      let tableSearchFields = this.$refs.table.tableSearchFields
      for (var i in tableSearchFields) {
        url = url + '&' + i + '=' + tableSearchFields[i]
      }
      window.location.href = url
    },
    createTimeSelected_in(d) {
      this.editInfo.studentPartyBuildInfo.joinTime = d.value
    },
    createTimeSelected_office(d) {
      this.editInfo.studentPartyBuildInfo.correctionTime = d.value
      // this.editClass.createTime = d.value
    },
    _tableChecked: function (recordArr) {
      this.tableCheckedList = recordArr
    },
    selectParty(e) {
    },
    submitAdd() {
      let url = 'api/partyBuild/users'
      let params = {
        userId: this.addParams.userId,
        organizationId: this.selectItem.organizationId
      }
      request(url, params).then(o => {
        if (o.state) {
          this.$toast('操作成功!')
          this.addMemberStatus = false;
          this.timestamp = "?timestamp=" + new Date().getTime();
        }
      })
    },
    addMember(record) {
      if (!record) {
        this.addMemberStatus = true
      } else {
        this.getMemberDetail(record.userId)
      }
      // this.showDetailStatus = true
    },
    getMemberDetail(userId) {
      let url = `api/document/students/baseStatusOrganizationInfo/${userId}`
      request(url).then(o => {
        if (o.state) {
          this.userInfo = o.data
          this.showDetailStatus = true
        }
      })
    },
    deleteMember(record) {
      console.log('record')
      if (confirm('确认移除成员?')) {
        let url = `api/partyBuild/users/${record.userId}/${this.selectItem.organizationId}`
        request(url, {}, 'post').then(o => {
          if (o.state) {
            this.timestamp = "?timestamp=" + new Date().getTime();
            this.$toast('操作成功')
          }
        })
      }
    }
  },

  created() {
    this.importParams = {
      parentPageTitle: "",
      downloadTemplateUrl: `/partyBuild/users/excel/template`,
      downloadErrorTemplateUrl: `/partyBuild/users/excels/errorExcels`,
      checkTemplateUrl: `/partyBuild/users/excel/${this.selectItem.organizationId}`,
      templateName: "批量导入模板",
      importBtnType: [
        {
          url: `/partyBuild/users/import/`,
          method: "post",
          isShowBtn: true,
          name: "增量导入",
          success: data => {
            this.timestamp = "?timestamp=" + new Date().getTime();
            this.curRoute = "allStaff";
          }
        }
      ]
    };
    // this.getPositionOptions();
    let year = new Date().getFullYear()
    let years = []
    for (var i = 0; i < 10; i++) {
      let a = year - i
      years.push({
        label: a + '',
        value: a + ''
      })
    }
    console.log(years)
    let that = this
    this.columns = [{ title: "学号", id: "userNo", className: "text-left", width: 100, search: { type: "input", data: { placeholder: "" } }, hidden: false },
    { title: "姓名", id: "name", className: "text-left", width: 100, search: { type: "input", data: { placeholder: "" } }, hidden: false },
    {      title: "学院名称", id: "college", className: "text-left", width: 100, search: {
        type: "select",
        data: {
          url: '/api/partyBuild/organizations/manage/college/options',
          optionsLabel: 'text',
          optionsValue: 'id',
          placeholder: ""
        }
      }, hidden: false    },
    {      title: "培养层次", id: "educationLevel", className: "text-left", width: 100, search: {
        type: "select",
        data: {
          url: '/api/system/dicts?dictType=培养层次',
          optionsLabel: 'label',
          optionsValue: 'value',
          placeholder: ""
        },
      }, hidden: false    },
    {      title: "年级", id: "grade", className: "text-left", width: 100, search: {
        type: "select",
        data: {
          options: years,
          optionsLabel: 'label',
          optionsValue: 'value',
          placeholder: ""
        },
      }, hidden: false    },
    { title: "班级", id: "className", className: "text-left", width: 100, search: { type: "input", data: { placeholder: "" } }, hidden: false },
    {      title: "当前状态", id: "schoolStatus", className: "text-left", width: 100, search: {
        type: "select",
        data: {
          url: '/api/system/dicts?dictType=在校状态',
          optionsLabel: 'label',
          optionsValue: 'value',
          placeholder: ""
        },
      }, hidden: false    },
    {      title: "政治面貌", id: "politicalStatus", className: "text-left", width: 140, search: {
        type: "select",
        data: {
          url: '/api/system/dicts?dictType=政治面貌',
          optionsLabel: 'label',
          optionsValue: 'value',
          placeholder: ""
        },
      }, hidden: false    },
    {      title: "培养发展阶段", id: "trainingAndDevelopmentStage", className: "text-left", width: 140, search: {
        type: "select",
        data: {
          url: '/api/system/dicts?dictType=培养发展阶段',
          optionsLabel: 'label',
          optionsValue: 'value',
          placeholder: ""
        },
      }, hidden: true    },
    { title: "所属党组织", id: "name", className: "text-left", width: 140, search: { type: "input", data: { placeholder: "" } }, hidden: true, formatter: function (record) { return record.partyBuildOrganization.name } },
    { title: "专业", id: "major", className: "text-left", width: 140, search: { type: "input", data: { placeholder: "" } }, hidden: true },
    {      title: "民族", id: "nation", className: "text-left", width: 70, search: {
        type: "select",
        data: {
          url: '/api/system/dicts?dictType=民族',
          optionsLabel: 'label',
          optionsValue: 'value',
          placeholder: ""
        },
      }, hidden: true    },
    {      title: "性别", id: "sex", className: "text-left", width: 70, search: {
        type: "select",
        data: {
          url: '/api/system/dicts?dictType=性别',
          optionsLabel: 'label',
          optionsValue: 'value',
          placeholder: ""
        },
      }, hidden: true    },
    { title: "出生日期", id: "birthday", className: "text-left", width: 140, hidden: true },
    { title: "生源地", id: "originPlace", className: "text-left", width: 140, search: { type: "input", data: { placeholder: "" } }, hidden: true },
    {
      id: "opt",
      title: "操作",
      className: "text-center",
      width: "260px",
      hidden: false,
      formatter: function (obj) {
        return [
          {
            tag: "a",
            text: '查看',
            className: "opt-btn",
            callback: function (record, index) {
              that.addMember(record);
            }
          },
          {
            tag: "a",
            text: '移除',
            className: "opt-btn",
            callback: function (record, index) {
              that.deleteMember(record);
            }
          },
        ];
      }
    }]
  },
  mounted() {
    this.getGrade();
  }
}
</script>
<style lang="less" scoped>
.detail_wrap {
  .modal-body {
    width: 100%;
  }
  .form-group {
    .input-label {
      display: block;
      &.modal-label {
        padding: 5px;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        height: 32px;
        background-color: #f0f0f0;
      }
    }
  }
}
.modal-body.canEdit {
  padding: 0 0 20px 0;
  border-bottom: 1px solid #ddd;
  & h1,
  & h2 {
    color: #000;
    font-size: 16px;
    padding: 15px;
    margin: 0;
  }
  .partyInfo {
    margin-bottom: 30px;
    span {
      padding-right: 10px;
    }
  }
}
.setParty {
  padding: 30px;
  .v-select {
    margin-left: 15px;
    width: 200px;
  }
}
.set .pull-left > button {
  padding: 0;
  vertical-align: top;
  margin-left: 15px;
}
.modal-content .modal-footer {
  border: none;
}
// .editModal {
//   h1 {
//     font-size: 16px;
//     margin: 0 0 10px 0;
//   }
// }
</style>
<style lang="less">
.modal-body.canEdit {
  .editCt {
    .modal-form-style {
      margin: 0;
    }
  }
  .v-datepicker {
    width: 140px;
    display: inline-block;
    vertical-align: middle;
  }

  .form-group .name-input {
    width: 140px !important;
  }
  .v-select {
    min-width: 140px;
    margin-right: 30px;
  }
}
</style>


