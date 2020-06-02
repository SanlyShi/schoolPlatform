<template>
  <v-import
    v-bind="importParams"
    @backParentPage="importTeachers = false"
    v-if="importTeachers">
  </v-import>
  <div id="import-teacher-page" class="container-fluid" v-else>
    <div class="row text-center">
      <v-table  :title="translate.tableName" :url="url" pagesize="10" idField="id" :columns="columns" :order="true" :search="true">
        <div slot="btn-group" class="btn-group pull-right" role="group">
          <button type="button" class="btn add clearBtnBorder" @click="importTeachers = true">{{translate.modelImport}}</button>
        </div>
      </v-table>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { translation } from '../../assets/utils/utils.js'
  export default {
    data: function () {
      return {
        columns: [],
        baseUrl: '/table-data/document/teachers',
        ts: new Date(),
        definedSearch: {
          tid: '',
          name: ''
        },
        modalType: '',
        lang: 'zh-cn',
        importTeachers: false,
        importParams: {
          parentPageTitle: '',
          downloadTemplateUrl: '/document/teachers/templates',
          downloadErrorTemplateUrl: '/document/teachers/errExcel',
          checkTemplateUrl: '/document/teachers/templates/check',
          importBtnType: null,
          templateName: ''
        }
      }
    },
    computed: {
      translate: function () {
        return translation(this.lang).infoManage
      },
      url: function () {
        return `${this.baseUrl}?ts=${this.ts}`
      }
    },
    created: function () {
      var la = localStorage.getItem('lang')
      if (translation(la)) {
        this.lang = la
      }
      this.importParams.templateName = this.translate.baseModel
      this.importParams.parentPageTitle = this.translate.tableName
      this.importParams.importBtnType = [{
        url: '/document/teachers/excel',
        name: this.translate.overrideImport,
        method: 'post',
        isShowBtn: true,
        success: (data) => {
          if (data.state) {
           this.ts = new Date()
          }
        }
      }]
      this.columns = [{
        id: 'tid',
        title: this.translate.teacherFields.teacherId,
        className: 'text-left',
        hidden: false,
        search: {
          type: 'input',
          data:{
            autoFocus: true
          }
        },
        formatter: function (record, index) {
          return record.teacherId
        }
      }, {
        id: 'name',
        title: this.translate.teacherFields.name,
        className: 'text-left',
        hidden: false,
        search: {
          type: 'input'
        }
      }]
    },
    methods: {
    }
  }
</script>
<style lang="less" scoped>
@import url("../../assets/common.less");

#import-teacher-page {
  .add {
    background: #ffffff;
    border: none;
  }
  .search-input-group {
    margin: 5px 0 10px 25px;
  }
}
</style>
