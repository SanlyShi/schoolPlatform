<template>
  <div v-if="!isImport" class="salary-grant-check">
    <div class="tab-div">
        <div
          class="tab"
          :class="!isJobView ? 'active' : ''"
          title="人员视图"
          @click="changeView"
        >人员视图</div>
        <div
          class="tab"
          :class="isJobView ? 'active' : ''"
          title="岗位视图"
          @click="changeView"
        >岗位视图</div>
    </div>
    <div>
      <v-table
        key="salary"
        title="薪酬发放管理"
        ref="gruntTable"
        :url="salaryGrantManageUrl"
        pagesize="10"
        idField="id"
        :order="true"
        :multiple="false"
        :search="false"
        :columnsControl="isJobView?false:true"
        :columns="salaryGrantManageColumns"
      >
        <div slot="btn-group" role="group">
          <div class="btn-group pull-right">
            <button
              type="button"
              class="btn btn-bgColor-style clearBtnBorder"
              v-if="!isJobView"
              @click="importGrantResult"
            >发放结果导入</button>
            <button
              type="button"
              class="btn btn-bgColor-style clearBtnBorder"
              v-if="!isJobView"
              @click="showSalaryExport"
            >导出</button>
            <!-- <button
              type="button"
              class="btn btn-bgColor-style clearBtnBorder"
              @click="changeView"
            >{{viewText}}</button> -->
          </div>
        </div>
      </v-table>
      <v-modal :show="salaryPeopleExport.show" effect="fade" width="400" key="xxx">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">导出——字段选择</h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <ul class="list-group">
          <li
            :key="index"
            class="list-group-item field-item"
            v-for="(field, index) in salaryPeopleExport.fields"
            :class="field.selected ? 'active' : ''"
            @click="field.selected = !field.selected"
          >
            <i
              class="maticon"
              v-html="icons('check_box_outline_blank')"
              v-if="!field.selected"
            >check_box_outline_blank</i>
            <i class="maticon" v-html="icons('check_box')" v-else>check_box</i>
            <span>{{field.text}}</span>
          </li>
        </ul>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button
          type="button"
          class="btn cancel-btn clearBtnBorder"
          @click="salaryPeopleExport.show = false"
        >取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="_exportSalary">导出</button>
      </div>
    </v-modal>
    </div>
  </div>
  <v-import
    v-bind="importParams"
    @backParentPage="isImport = false"
    :downloadTemplateUrl="downloadUrl"
    :checkTemplateUrl="checkTemplateUrl"
    :isNeedModal="isNeedModal"
    :modalname="'选择学年'"
    v-else-if="isImport"
  >
    <div slot="modal">
      <div class="form-group">
        <label class="college-text">学年</label>
        <v-select
          class="btn-block search-select"
          :value="importModalSchoolYearDefault"
          :options="schoolYearData"
          optionsLabel="name"
          optionsValue="id"
          @afterSelected="importModalSchoolYearSelected"
          search
          close-on-select
        ></v-select>
      </div>
    </div>
  </v-import>
</template>
<script>
  import { sAjax, createTime } from '../../assets/utils/utils';
  export default {
    data: function () {
      return {
        viewText: "岗位视图",
        isSalaryGrantManage: false,
        salaryGrantManageUrl: '/table-data/pwps/salaries/page/byUser',
        jobViewUrl: '/table-data/pwps/salaries/page/byPosition',
        peopleViewUrl: '/table-data/pwps/salaries/page/byUser',
        downloadUrl: '/pwps/users/template/grantResult',
        checkTemplateUrl: '/pwps/users/salary/grantResults/excel',
        salaryGrantManageColumns: [],
        isNeedModal: '',
        importParams: {
          parentPageTitle: '',
          downloadErrorTemplateUrl: '',
          templateName: '',
          importBtnType: null
        },
        salaryPeopleExport: {
          show: false,
          fields: [
            { id: 'schoolYear', text: '学年', selected: true },
            { id: 'month', text: '月份', selected: true },
            { id: 'unitId', text: '单位名称', selected: true },
            { id: 'positionName', text: '岗位名称', selected: true },
            { id: 'positionType', text: '岗位类型', selected: false },
            { id: 'rewardStandard', text: '薪酬标准(元/小时)', selected: false },
            { id: 'salaryCapMonth', text: '薪酬上限', selected: false },
            { id: 'name', text: '姓名', selected: true },
            { id: 'userNo', text: '学号', selected: true },
            { id: 'collegeName', text: '学院', selected: false },
            { id: 'educationLevel', text: '培养层次', selected: false },
            { id: 'idCardNo', text: '身份证号', selected: false },
            { id: 'contact', text: '手机', selected: false },
            { id: 'isDifficultyStudent', text: '是否困难生', selected: false },
            { id: 'nation', text: '民族', selected: false },
            { id: 'sex', text: '性别', selected: false },
            { id: 'manHour', text: '工时', selected: false },
            { id: 'totalPayMount', text: '应发金额', selected: true },
            { id: 'realPayMount', text: '实发金额', selected: true },
            { id: 'isGrant', text: '发放状态', selected: true },
            { id: 'remark', text: '备注', selected: true }
          ]
        },
        isJobView: false,
        isImport: false,
        positionTypeData: [],
        timeStamp: '',
      }
    },
    methods: {
      changeView: function () {
        this.isJobView = !this.isJobView
        if (this.isJobView) {
          this.viewText = '人员视图'
          this.salaryGrantManageColumns = this.jobViewColumns
          this.salaryGrantManageUrl = this.jobViewUrl
        } else {
          this.viewText = '岗位视图'
          this.salaryGrantManageColumns = this.peopleViewColumns
          this.salaryGrantManageUrl = this.peopleViewUrl
        }
      },
      importGrantResult: function () {
        this.isImport = true
        this.isNeedModal = false
        this.importParams = {
          parentPageTitle: '薪酬发放管理列表',
          downloadErrorTemplateUrl: '/pwps/users/excel/error/grantResult',
          templateName: '薪酬发放结果导入',
          needData: "薪酬发放结果导入(包含当前页面数据)"
        },
          this.importParams.importBtnType = [{
            url: '/pwps/users/salary/grantResults',
            method: 'post',
            isShowBtn: true,
            name: '覆盖导入',
            success: (data) => {
              if (data.state) {
                this.salaryGrantManageUrl = '/table-data/pwps/salaries/page/byUser?timestamp=' + createTime()
              }
            }
          }]
      },
      showSalaryExport: function () {
        this.salaryPeopleExport.show = true
      },
      _exportSalary: function () {
        var searchData = this.$refs.gruntTable.tableSearchFields
        var searchText = ''
        for (var i in searchData) {
          if (!searchData[i]) {
            searchText += '&' + i + '=' + ''
          } else {
            searchText += '&' + i + '=' + searchData[i]
          }
        }
        const selectedFieldIds = [];
        for (const field of this.salaryPeopleExport.fields) {
          if (field.selected) {
            selectedFieldIds.push(field.id);
          }
        }
        searchText += `&exportFields=${selectedFieldIds.join(',')}`
        window.location.href = '/downloads/pwps/salaries/excel?detail=true&isImport=true&fileName=薪酬发放' + searchText
      },
    },
    created: function () {
      sAjax({
        url: '/api/system/dicts',
        dataType: 'json',
        type: 'get',
        data: {
          dictType: '岗位类型'
        },
        success: (data) => {
          if (data.state) {
            this.positionTypeData = data.data
          } else {
            this.$toast(data.message)
          }
        }
      })
      this.jobViewColumns = [{
        id: 'schoolYear',
        title: '学年',
        className: 'text-left',
        hidden: false,
        width: 110,
        search: {
          type: 'select',
          data: {
            url: '/api/pwps/positions/all/schoolYears',
            optionsLabel: 'name',
            optionsValue: 'id'
          }
        },
        formatter: function (record) {
          return record.position && record.position.schoolYear && record.position.schoolYear.name
        }
      }, {
        id: 'month',
        title: '月份',
        className: 'text-left',
        width: 70,
        hidden: false,
        search: {
          type: 'input',
          data: {
            placeholer: '',
            autoFocus: true
          }
        }
      }, {
        id: 'unitId',
        title: '单位名称',
        className: 'text-left',
        width: 130,
        hidden: false,
        formatter: function (record) {
          return record.position && record.position.unit && record.position.unit.name
        },
        search: {
          type: 'select',
          data: {
            url: '/api/pwps/units/all',
            optionsLabel: 'name',
            optionsValue: 'id'
          }
        }
      }, {
        id: 'positionName',
        title: '岗位名称',
        className: 'text-left',
        width: 150,
        hidden: false,
        formatter: function (record) {
          return record.position && record.position.positionName
        },
        search: {
          type: 'input',
          data: {
            placeholer: '',
            autoFocus: true
          }
        }
      }, {
        id: 'positionType',
        title: '岗位类型',
        className: 'text-left',
        width: 100,
        hidden: false,
        formatter: (record) => {
          if (record.position) {
            var label = ''
            this.positionTypeData.forEach((ele, index) => {
              if (ele.value === record.position.positionType) {
                label = ele.label
              }
            })
            return label
          }
        },
        search: {
          type: 'select',
          data: {
            url: '/api/system/dicts?dictType=岗位类型',
            optionsLabel: 'label',
            optionsValue: 'value'
          }
        }
      }, {
        id: 'grantCount',
        title: '发放人数',
        className: 'text-left',
        width: 80,
        hidden: false
      },{
        id: 'totalWork',
        title: '岗位总工时上限',
        className: 'text-left',
        width: 100,
        hidden: false,
        formatter: (record) => {
          return record.position.totalWork
        }
      },{
        id: 'realWork',
        title: '岗位实际总工时',
        className: 'text-left',
        width: 100,
        hidden: false,
        formatter: (record) => {
          if(record.position.totalWork&&Number(record.position.realWork)>Number(record.position.totalWork)) {
            return `<span style="color: red">${record.position.realWork}</span>`
          } else {
            return record.position.realWork
          }
        }
      },  {
        id: 'totalPayMount',
        title: '应发放薪酬',
        className: 'text-left',
        width: 90,
        hidden: false
      }, {
        id: 'realPayMount',
        title: '实际发放薪酬',
        className: 'text-left',
        width: 90,
        hidden: false
      }]
      this.peopleViewColumns = [{
        id: 'schoolYear',
        title: '学年',
        className: 'text-left',
        hidden: false,
        width: 110,
        search: {
          type: 'select',
          data: {
            url: '/api/pwps/positions/all/schoolYears',
            optionsLabel: 'name',
            optionsValue: 'id'
          }
        },
        formatter: function (record) {
          return record.position && record.position.schoolYear && record.position.schoolYear.name
        }
      }, {
        id: 'month',
        title: '月份',
        className: 'text-left',
        width: 80,
        hidden: false,
        search: {
          type: 'input'
        }
      }, {
        id: 'unitId',
        title: '单位名称',
        className: 'text-left',
        width: 120,
        hidden: false,
        formatter: function (record) {
          return record.position && record.position.unit && record.position.unit.name
        },
        search: {
          type: 'select',
          data: {
            url: '/api/pwps/units/all',
            optionsLabel: 'name',
            optionsValue: 'id'
          }
        }
      }, {
        id: 'positionName',
        title: '岗位名称',
        className: 'text-left',
        width: 120,
        hidden: false,
        formatter: function (record) {
          return record.position && record.position.positionName
        },
        search: {
          type: 'input',
          data: {
            placeholer: '',
            autoFocus: true
          }
        }
      }, {
        id: 'positionType',
        title: '岗位类型',
        className: 'text-left',
        width: 100,
        hidden: true,
        formatter: (record) => {
          if (record.position) {
            var label = ''
            this.positionTypeData.forEach((ele, index) => {
              if (ele.value === record.position.positionType) {
                label = ele.label
              }
            })
            return label
          }

        },
        search: {
          type: 'select',
          data: {
            url: '/api/system/dicts?dictType=岗位类型',
            optionsLabel: 'label',
            optionsValue: 'value'
          }
        }
      }, {
        id: 'rewardStandard',
        title: '薪酬标准(元/小时)',
        className: 'text-right',
        width: 120,
        hidden: true,
        formatter: function (record) {
          return record.position && record.position.rewardStandard
        }
      }, {
        id: 'salaryCapMonth',
        title: '薪酬上限',
        className: 'text-right',
        width: 80,
        hidden: true,
        formatter: function (record) {
          return record.position && record.position.salaryCapMonth
        }
      }, {
        id: 'name',
        title: '姓名',
        className: 'text-left',
        width: 100,
        hidden: false,
        formatter: function (record) {
          return record.user && record.user.name
        },
        search: {
          type: 'input',
          data: {
            placeholer: '',
            autoFocus: true
          }
        }
      }, {
        id: 'userNo',
        title: '学号',
        className: 'text-left',
        width: 130,
        hidden: false,
        formatter: function (record) {
          return record.user && record.user.userNo
        },
        search: {
          type: 'input',
          data: {
            placeholer: '',
            autoFocus: true
          }
        }
      }, {
        id: 'collegeName',
        title: '学院',
        className: 'text-left',
        width: 80,
        hidden: false,
        formatter: function (record) {
          return record.userDetail && record.userDetail.collegeName
        }
      }, {
        id: 'educationLevel',
        title: '培养层次',
        className: 'text-left',
        width: 80,
        hidden: false,
        formatter: function (record) {
          return record.userDetail && record.userDetail.educationLevelLabel
        }
      }, {
        id: 'idCardNo',
        title: '身份证号',
        className: 'text-left',
        width: 150,
        hidden: true,
        formatter: function (record) {
          return record.userDetail && record.userDetail.idCardNo
        }
      }, {
        id: 'contact',
        title: '联系方式',
        className: 'text-left',
        width: 120,
        hidden: true,
        formatter: function (record) {
          return record.userDetail && record.userDetail.contact
        }
      }, {
        id: 'isDifficultyStudent',
        title: '是否困难生',
        className: 'text-left',
        width: 100,
        hidden: true,
        formatter: function (record) {
          return record.userDetail && (record.userDetail.isDifficultyStudent ? '是' : '否')
        }
      }, {
        id: 'nation',
        title: '民族',
        className: 'text-left',
        width: 80,
        hidden: true,
        formatter: function (record) {
          return record.userDetail && record.userDetail.nationLabel
        }
      }, {
        id: 'sex',
        title: '性别',
        className: 'text-left',
        width: 40,
        hidden: true,
        formatter: function (record) {
          return record.userDetail && record.userDetail.sexLabel
        }
      }, {
        id: 'manHour',
        title: '工时',
        className: 'text-left',
        width: 60,
        hidden: true
      }, {
        id: 'totalPayMount',
        title: '应发金额',
        className: 'text-left',
        width: 80,
        hidden: false
      }, {
        id: 'realPayMount',
        title: '实发金额',
        width: 80,
        className: 'text-right',
        hidden: false
      }, {
        id: 'isGrant',
        title: '发放状态',
        className: 'text-left',
        width: 100,
        hidden: false,
        search: {
          type: 'select',
          data: {
            options: [{ value: true, label: '已发放' }, { value: false, label: '未发放' }],
            optionsLabel: 'label',
            optionsValue: 'value'
          }
        },
        formatter: function (record) {
          return record.isGrant ? '已发放' : '未发放'
        }
      }, {
        id: 'remark',
        title: '备注',
        width: 80,
        className: 'text-left',
        hidden: true
      }]
      this.salaryGrantManageColumns = this.peopleViewColumns
    }
  }
</script>
<style lang="less">
@import url("../../assets/common.less");
.salary-grant-check {
  .tab-div {
    position: relative;
    height: 40px;
    padding-right: 15px;
    background: white;
    white-space: nowrap;
    border-bottom: 1px solid #f0f0f0;
    .apply-container {
      position: absolute;
      right: 0;
    }
    .tab-list {
      position: relative;
      .gm-scroll-view {
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
  }
  .btn {
    border: none;
    box-shadow: none;
    outline: none;
    background: transparent;
  }
  .blue {
    // color: #fff;
    // background: #298df7;
  }
  .orangered {
    // color: #fff;
    // background: orangered;
  }
  .green {
    // color: #fff;
    // background: rgb(91, 204, 91);
  }
  .modal-body {
    .field-item {
      border: 0;
      i {
        color: rgba(0, 0, 0, 0.54);
        vertical-align: middle;
      }
      span {
        vertical-align: middle;
      }
      &.active {
        color: rgba(0, 0, 0, 0.54);
        background-color: #fff;
        i {
          color: #298df7;
        }
      }
    }
    padding: 0 12px;
    .table-container {
      box-shadow: none;
    }
  }
  .field-list {
    padding: 10px 0;
    user-select: none;
    .field-item {
      display: inline-block;
      margin: 5px 10px;
      color: #999;
      cursor: pointer;
      span {
        display: inline-block;
        margin-left: 4px;
        line-height: 26px;
      }
      &.active {
        color: #303133;
      }
    }
  }
  .table-options-container {
    position: relative;
    overflow: hidden;
  }
  .unpass-modal-textarea {
    width: 100%;
    resize: none;
    margin-top: 10px;
    padding: 5px;
    border: 0 solid #e0e0e0;
    outline: none;
  }
  .batch-options {
    position: absolute;
    left: 0;
    top: -40px;
    transition: all 0.1s ease;
    span {
      line-height: 32px;
    }
    &.active {
      top: 0;
    }
  }
}
</style>

