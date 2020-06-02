<template>
  <div class="row">
    <div class="back-parent-page">
      <button
        type="button"
        class="btn back-btn clearBtnBorder box_flex align_center"
        @click="_backParentPage"
      >
        <i class="maticon back-icon-btn" v-html="icons('arrow_back')">arrow_back</i>
        <span class="nav-title">{{selectItem.parentPageTitle}}</span>
      </button>
    </div>
    <v-table
      ref="positionTable"
      :title="selectItem.positionTitle"
      :url="positionUrl+timestamp"
      pagesize="10"
      idField="id"
      :columns="positionColumns"
      :multiple="false"
      :order="true"
      :search="false"
    >
      <div slot="btn-group" class="btn-group pull-right" role="group">
        <button
          type="button"
          class="btn batch-add-btn btn-bgColor-style clearBtnBorder"
          @click="quickAddRecord()"
        >{{translate.batch}}{{translate.add}}{{translate.position}}</button>
        <button
          type="button"
          class="btn add-organization btn-bgColor-style clearBtnBorder"
          @click="_showAddPositionModal"
        >
          <i class="maticon pull-left" style="font-size:20px;" v-html="icons('add')">add</i>
          {{translate.add}}{{translate.position}}
        </button>
      </div>
    </v-table>
    <v-modal :show="showAddPositionModal" effect="fade" width="446" class="organization-modal">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">{{positionModalType}}{{translate.position}}{{translate.info}}</h5>
      </div>
      <div slot="modal-body" class="modal-body position-info-body">
        <div class="form-group">
          <v-select
            :options="orgDepartmentList"
            options-value="id"
            options-label="text"
            close-on-select
            justify
            v-model="orgDepartmentId"
          ></v-select>
        </div>
        <div class="form-group">
          <input
            type="text"
            class="form-control search-input organization-input"
            :placeholder="translate.enter + translate.position"
            v-model="positionName"
          >
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button
          type="button"
          class="btn cancel-btn clearBtnBorder"
          @click="showAddPositionModal = false"
        >{{translate.cancel}}</button>
        <button
          type="button"
          class="btn submit-btn clearBtnBorder"
          @click="_changePosition"
        >{{translate.confirm}}</button>
      </div>
    </v-modal>
    <div class="importPageClass" v-show="curRoute === 'importPage'">
      <v-import v-bind="importParams" @backParentPage="curRoute = 'allStaff'"></v-import>
    </div>
  </div>
</template>
<script>
import { sAjax, request, translation } from "../../assets/utils/utils.js";
import importTable from "../../mixins/import.js";

export default {
  mixins: [importTable],
  data() {
    return {
      positionBaseUrl: `/table-data/sc/organizationTitle/page/${
        this.selectItem.organizationId
      }`,
      positionUrl: `/table-data/sc/organizationTitle/page/${
        this.selectItem.organizationId
      }`,
      positionColumns: [],
      lang: "zh-cn",
      organizationId: this.selectItem.organizationId,
      positionModalType: "",
      orgDepartmentList: [],
      orgDepartmentId: "",
      positionName: "",
      showAddPositionModal: false,
      timestamp: "?timestamp=''"
    };
  },
  mounted() {
    this.getOrgDepartmentList();
    this.importParams = {
      parentPageTitle: "",
      downloadTemplateUrl: "/sc/organizationTitle/BatchImportTitleTemplate",
      downloadErrorTemplateUrl: "/sc/organizationTitle/excels/errorExcels",
      checkTemplateUrl: `/sc/organizationTitle/excel/${this.organizationId}`,
      templateName: "批量导入职务模板",
      importBtnType: [
        {
          url: "/sc/organizationTitle/import",
          method: "post",
          isShowBtn: true,
          name: "增量导入",
          success: data => {
            this.positionUrl =
              this.positionUrl + "?timestamp=" + new Date().getTime();
            this.curRoute = "allStaff";
          }
        }
      ]
    };
  },
  computed: {
    translate: function() {
      return translation(this.lang).organizationManage;
    }
  },
  methods: {
    ablePosition(record) {
      //禁用职务或者解禁
      let url = `api/sc/organizationTitle/forbidden/${record.titleId}`;
      if (record.isForbidden) {
        url = `api/sc/organizationTitle/unForbidden/${record.titleId}`;
      }
      request(url, {}, "post").then(o => {
        console.log("o", o);
        if (o.state) {
          this.timestamp = "?timestamp=" + new Date().getTime();
        }
      });
    },
    _changePosition: function() {
      if (!this.positionName) {
        this.$toast("职务不能为空");
        return false;
      }
      if (!this.orgDepartmentId) {
        this.$toast("组织部门不能为空");
        return false;
      }
      let url = `/api/sc/organizationTitle`;
      let params = {
        titleName: this.positionName,
        organizationId: this.organizationId,
        orgDepartmentId: this.orgDepartmentId
      };
      if (this.positionId) {
        url = `/api/sc/organizationTitle/${this.positionId}`;
        request(url, params, "post").then(o => {
          if (o.state) {
            this.showAddPositionModal = false;
            this.positionUrl =
              this.positionUrl + "?timestamp=" + new Date().getTime();
          }
        });
      } else {
        request(url, params).then(o => {
          if (o.state) {
            this.showAddPositionModal = false;
            this.positionUrl =
              this.positionUrl + "?timestamp=" + new Date().getTime();
          }
        });
      }
    },
    getOrgDepartmentList() {
      let url = `api/sc/orgDepartment/options/allOrgDepartment/${
        this.organizationId
      }`;
    let that = this;
      request(url).then(o => {
        if (o.state) {
          this.orgDepartmentList = o.data;
          this.positionColumns = [
      {
        id: "titleName",
        title: this.translate.position,
        className: "text-left",
        hidden: false,
        search: {
          type: "input",
          data: {
            placeholder: ""
          }
        }
      },
      {
        id: "orgDepartmentIds",
        title: "组织部门",
        className: "text-left",
        hidden: false,
        search: {
          type: "multiSelect",
          data: {
            options: that.orgDepartmentList,
            optionsLabel: "text",
            optionsValue: "id"
          }
        },
        formatter(record){
            return record.orgDepartmentName
        }
      },
      {
        id: "opt",
        title: this.translate.opt,
        className: "text-center",
        width: "230px",
        hidden: false,
        formatter: function(obj) {
          return [
            {
              tag: "a",
              text: that.translate.edit,
              className: "opt-btn",
              callback: function(record, index) {
                that.showAddPositionModal = true;
                that.positionModalType = that.translate.edit;
                that.orgDepartmentId = record.orgDepartmentId;
                that.positionName = record.titleName;
                that.positionId = record.titleId;
              }
            },
            {
              tag: "a",
              text: obj.isForbidden ? "启用" : "禁用",
              className: "opt-btn",
              callback: function(record, index) {
                that.ablePosition(record);
              }
            }
          ];
        }
      }
    ];
        }
      });
    },
    _backParentPage() {
      this.$parent.pageSign = "organizationList";
      this.$parent.showPosition = false;
    },
    _showAddPositionModal() {
      this.showAddPositionModal = true;
      this.positionModalType = this.translate.add;
      this.positionId = "";
      this.orgDepartmentId = "";
      this.positionName = "";
    }
  },
  props: {
    selectItem: {
      default: {}
    }
  }
};
</script>
