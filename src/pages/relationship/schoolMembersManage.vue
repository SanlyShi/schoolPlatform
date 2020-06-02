<template>
  <div id="classMembersManage-page" class="container-fluid">
    <div class="row text-center">
      <v-table ref="studentTable" :title="translate.tableName" :url="url" pagesize="10" idField="id" :columns="columns" :multiple="true" :order="true"  :search="true">
        <div slot="btn-group" class="btn-group pull-right" role="group">
          <button type="button" class="btn btn-bgColor-style clearBtnBorder" @click="classes()">{{translate.classes}}</button>
        </div>
      </v-table>
    </div>

    <!-- 模态框（Modal） -->
    <v-modal :show="showClassesModal" effect="fade" width="400">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          {{translate.classes}}
      </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <label class="modal-text text-center">{{selectedText}}</label>
        <div class="form-group single-add-group">
         <label>{{translate.classFullName}}:</label>
         <v-select class="btn-block search-select" :options="classNameOptions" options-value="id" options-label="text" @afterSelected="classNameSelected" search close-on-select></v-select>
       </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showClassesModal = false">{{translate.cancel}}</button>
        <button type="button" class="btn submit-btn clearBtnBorder" :class="{disabled: isDisabled}" @click="sure(isDisabled)">{{translate.sure}}</button>
      </div>
    </v-modal>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { sAjax, translation } from '../../assets/utils/utils.js'
  export default {
    created: function () {
      var la = localStorage.getItem('lang')
      var that = this
      if (translation(la)) {
        this.lang = la
      }
      sAjax({
        url: '/api/relClass/school/getPeopleManageSelectOptions',
        dataType: 'json',
        type: 'get',
        success: function (data) {
          if (data.state) {
            var result = data.data
            that.collegeOptions = result.colleges || []
            that.gradeOptions = result.grades || []
            that.classesOptions = result.haveClass || []
            that._initColumns()
          } else {
            that.$toast(data.message)
          }
        }
      })
      sAjax({
        url: '/api/system/dicts?dictType=培养层次',
        dataType: 'json',
        type: 'get',
        success: (result) => {
          if (result.state) {
           this.educationLevelOptions = result.data || []
          }
        }
      })
      sAjax({
        url: '/api/relClass/getMyCreateClass',
        dataType: 'json',
        type: 'get',
        success: function (data) {
          if (data.state) {
            that.classNameOptions = data.data || []
          } else {
            that.$toast(data.message)
          }
        }
      })

    },
    data: function () {
      return {
        columns: [],
        url: '/table-data/relClass/school/peopleManage',
        showClassesModal: false,
        classMembersManage: {},
        collegeOptions: [],
        gradeOptions: [],
        classesOptions: [],
        classNameOptions: [],
        educationLevelOptions: [],
        defaultOptions: '-1',
        selectedText: '',
        studentUserIds: [],
        isDisabled: true,
        classId: '',
        lang: 'zh-cn'
      }
    },
    computed: {
      translate: function () {
        return translation(this.lang).classMembersManage
      }
    },
    methods: {
      _initColumns: function () {
        this.columns = [
          {
            id: 'studentId',
            title: this.translate.studentId,
            className: 'text-left',
            width: 100,
            hidden: false,
            search: {
              type: 'input',
              data: {
                autoFocus: true,
                placeholder: this.translate.studentIdPlaceholder
              }
            }
          },
          {
            id: 'name',
            title: this.translate.name,
            className: 'text-left',
            width: 70,
            hidden: false
          },
          {
            id: 'college',
            title: this.translate.college,
            className: 'text-left',
            width: 120,
            hidden: false,
            search: {
              type: 'multiSelect',
              data: {
                options: this.collegeOptions,
                optionsLabel: 'text',
                optionsValue: 'id'
              }
            }
          },
          {
            id: 'grade',
            title: this.translate.grade,
            className: 'text-left',
            width: 50,
            hidden: false,
            search: {
              type: 'multiSelect',
              data: {
                options: this.gradeOptions,
                optionsLabel: 'text',
                optionsValue: 'id'
              }
            }
          },
          {
            id: 'instructor',
            title: this.translate.instructor,
            className: 'text-left',
            width: 120,
            hidden: false,
            search: {
              type: 'input',
              data: {
                placeholder: this.translate.instructorPlaceholder
              }
            }
          },
          {
            id: 'classFullName',
            title: this.translate.classFullName,
            className: 'text-left',
            width: 120,
            hidden: false,
            search: {
              type: 'input',
              data: {
                placeholder: this.translate.classNamePlaceholder
              }
            }
          },
          {
            id: 'educationLevel',
            title: '培养层次',
            className: 'text-left',
            width: 120,
            hidden: false,
            search: {
              type: 'multiSelect',
              data: {
                options: this.educationLevelOptions,
                optionsLabel: 'label',
                optionsValue: 'value'
              }
            }
          },
          {
            id: 'haveClass',
            title: this.translate.classes + this.translate.situation,
            className: 'text-left',
            width: 120,
            hidden: false,
            search: {
              type: 'select',
              data: {
                options: this.classesOptions,
                optionsLabel: 'text',
                optionsValue: 'id'
              }
            },
            formatter: function (record, index) {
              return record.strHaveClass
            }
          }]
      },
      classes: function () {
        var len = this.$refs.studentTable.checkedRecords.length
        if (len === 0) {
          this.$toast(this.translate.notSelectedText)
        } else {
          this.selectedText = this.translate.selectedText + len + this.translate.namesStudent + ',' + this.translate.writeClassName
          this.showClassesModal = true
        }
      },
      sure: function (isDisabled) {
        if (isDisabled) {
          return false
        }
        var that = this
        var selectedData = this.$refs.studentTable.checkedRecords
        this.studentUserIds.splice(0, this.studentUserIds.length)
        selectedData.forEach((item, index) => {
          this.studentUserIds.push(item.studentUserId)
        })
        sAjax({
          url: '/api/relClass/updateStudents/' + this.classId,
          dataType: 'json',
          data: {
            studentUserIds: this.studentUserIds
          },
          type: 'post',
          success: function (data) {
            if (data.state) {
              that.url = '/table-data/relClass/school/peopleManage?timestamp=' + new Date().getTime()
              that.$toast(that.translate.submitSuccessTip)
              that.showClassesModal = false
            } else {
              that.$toast(that.translate.submitFailedTip + ':' + data.message)
            }
          }
        })
      },
      classNameSelected: function (obj) {
        this.classId = obj.val
        if (this.classId) {
          this.isDisabled = false
        } else {
          this.isDisabled = true
        }
      }
    }
  }
</script>
<style lang="less">
@import url("../../assets/common.less");

#classMembersManage-page {
  .modal-text {
    margin-bottom: 20px;
  }
  .studentId-input {
    width: 200px;
    display: inline-block;
    margin-left: 18px;
  }
  .single-add-group .search-select {
    width: 60%;
    margin-left: 18px;
  }
  .single-add-group .dropdown-menu {
    position: fixed;
    top: auto;
    left: auto;
  }
}
</style>
