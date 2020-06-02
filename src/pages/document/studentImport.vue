<template>
  <v-import
    v-bind="importParams"
    @backParentPage="importStudents = false"
    v-if="importStudents">
  </v-import>
  <div class="container-fluid image-import-container" v-else-if="importImages">
    <span class="btn-block back" @click="importImages = false"><i class="maticon pull-left" v-html="icons('arrow_back')">arrow_back</i><span class="nav-title">{{translate.back}}</span></span>
    <div class="row param-area">
      <div class="col-md-4">
        <label for="">需要导入的图片信息字段</label>
        <v-select class="btn-block import-select"
          :options="imageParams.imageFieldAOptions"
          :required="true"
          :autoSelect="true"
          options-value="id"
          options-label="title"
          close-on-select
          @afterSelected="_selectField($event, 'A')">
        </v-select>
      </div>
      <div class="col-md-4">
        <label for="">图片文件的命名规则</label>
        <v-select class="btn-block import-select"
          :options="imageParams.imageFieldBOptions"
          :required="true"
          :autoSelect="true"
          options-value="id"
          options-label="title"
          close-on-select
          @afterSelected="_selectField($event, 'B')">
        </v-select>
      </div>
    </div>
    <div class="row param-opt">
      <div class="col-md-4">
        <button class="btn btn-default" v-if="imageParams.fieldAId&&imageParams.fieldBId">
        <input type="file" @change="_upload">
        开始</button>
        <button class="btn btn-default" disabled="disabled" v-else>开始</button>
      </div>
    </div>
  </div>
  <div id="import-student-page" class="container-fluid" v-else>
    <div class="row text-center">
      <v-table  :title="translate.tableNameStu" :url="url" pagesize="10" idField="id" :columns="columns" :multiple="false" :order="true" :search="true">
        <div slot="btn-group" class="btn-group pull-right" role="group">
          <button type="button" class="btn add clearBtnBorder clearBtnBorder" @click="importStudents = true">{{translate.modelImport}}</button>
          <button type="button" class="btn add clearBtnBorder clearBtnBorder" @click="importImages = true">{{translate.imageImport}}</button>
        </div>
      </v-table>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { translation, sAjax } from '../../assets/utils/utils.js'

  export default {
    data: function () {
      return {
        columns: [],
        baseUrl: '/table-data/document/students',
        ts: new Date(),
        modalType: '',
        lang: 'zh-cn',
        importStudents: false,
        importImages: false,
        importParams: {
          parentPageTitle: '',
          downloadTemplateUrl: '/document/students/templates',
          downloadErrorTemplateUrl: '/document/students/errExcel',
          checkTemplateUrl: '/document/students/templates/check',
          templateName: '',
          importBtnType: null
        },
        imageParams: {
          imageFieldAOptions: [
            //   {
            //   id: 'stuNo',
            //   title: '学号'
            // }
          ],
          imageFieldBOptions: [{
            id: '42',
            title: '以学号的方式命名'
          }, {
            id: '608',
            title: '以新生账号的方式命名'
          }],
          fieldAId: '',
          fieldBId: '42'
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
      this.importParams.templateName = this.translate.baseModelStu
      this.importParams.parentPageTitle = this.translate.tableNameStu
      this.importParams.importBtnType = [{
        url: '/document/students/excel',
        method: 'post',
        isShowBtn: true,
        name: this.translate.incrementImport,
        success: (data) => {
          if (data.state) {
           this.ts = new Date()
          }
        }
      }]
      this.columns = [{
        id: 'studentId',
        title: this.translate.infoFields.studentId,
        className: 'text-left',
        hidden: false,
        search: {
          type: 'input',
          data: {
            placeholer: '',
            autoFocus: true
          }
        }
      }, {
        id: 'name',
        title: this.translate.infoFields.name,
        className: 'text-left',
        hidden: false
      }, {
        id: 'college',
        title: this.translate.infoFields.college,
        className: 'text-left',
        hidden: false
      }, {
        id: 'grade',
        title: this.translate.infoFields.grade,
        className: 'text-left',
        hidden: false
      }, {
        id: 'studentType',
        title: this.translate.infoFields.studentType,
        className: 'text-left',
        hidden: false
      }]
      this._initFieldAOptions()
    },
    methods: {
      _selectField: function (obj, field) {
        if (field === 'A') {
          this.imageParams.fieldAId = obj.val
        } else if (field === 'B') {
          this.imageParams.fieldBId = obj.val
        }
      },
      _initFieldAOptions: function () {
        sAjax({
          url: '/api/document/data/types/columns',
          type: 'get',
          data: {
            dataType: 'Image'
          },
          success: (data) => {
            if (data.state) {
              this.imageParams.imageFieldAOptions = data.data
              if (data.data.length) {
                this.imageParams.fieldAId = this.imageParams.imageFieldAOptions[0].id
              }
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _upload: function (evt) {
        var fd = new FormData()
        fd.append('file', evt.target.files[0])
        fd.append('importColumn', this.imageParams.fieldAId)
        fd.append('filenameRule', this.imageParams.fieldBId)
        evt.target.value = ''
        sAjax({
          url: '/upload/document/import/images',
          type: 'post',
          processData: false,
          contentType: false,
          data: fd,
          success: (data) => {
            if (data.state) {
              this.$toast('上传成功')
            } else {
              this.$toast(data.message)
            }
          }
        })
      }
    }
  }
</script>
<style lang="less">
@import url("../../assets/common.less");
.image-import-container {
  padding: 56px 40px 0;
  .back {
    color: rgba(0, 0, 0, 0.54);
    cursor: pointer;
    vertical-align: middle;
    i {
      font-size: 20px;
    }
    .nav-title {
      font-size: 13px;
      line-height: 13px;
      margin: 5px 0 0 8px;
      font-weight: 500;
      vertical-align: middle;
    }
  }
  .param-area,
  .param-opt {
    margin-top: 34px;
  }
  .param-opt {
    button {
      position: relative;
      overflow: hidden;
    }
    input {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
  }
  .import-select {
    background: transparent;
    border: none;
    outline: none;
  }
}
#import-student-page {
  .add {
    background: #ffffff;
    border: none;
  }
  .search-input-group {
    margin: 5px 0 10px 18px;
  }
}
</style>
