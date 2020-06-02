<template>
  <div id="pageId" class="student-manage-page">
    <div class="content text-center">
      <v-table  :title="tableName" ref="studentTable" :url="url" :method="method" pagesize="10" idField="id" :columns="columns" :order="true" :search="true">
        <div slot="btn-group" class="btn-group pull-right" role="group">
          <button type="button" class="btn btn-bgColor-style clearBtnBorder" @click="showSearch()">{{translate.advancedSearch}}</button>
          <button v-if="false" type="button" class="btn btn-bgColor-style clearBtnBorder" @click="reset()">{{translate.reset}}</button>
          <button type="button" class="btn btn-bgColor-style clearBtnBorder" @click="showExport = true">{{translate.export}}</button>
        </div>
      </v-table>
      <div v-show="showWaiting" class="page-waiting">
        <div class="spinner">
          <div class="spinner-container container1">
            <div class="circle1"></div>
            <div class="circle2"></div>
            <div class="circle3"></div>
            <div class="circle4"></div>
          </div>
          <div class="spinner-container container2">
            <div class="circle1"></div>
            <div class="circle2"></div>
            <div class="circle3"></div>
            <div class="circle4"></div>
          </div>
          <div class="spinner-container container3">
            <div class="circle1"></div>
            <div class="circle2"></div>
            <div class="circle3"></div>
            <div class="circle4"></div>
          </div>
        </div>
        <div class="waiting-text">正在导出...</div>
      </div>
    </div>
    <v-modal :show="advancedSearch.show" effect="fade" width="560">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          {{translate.advancedSearch}}
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="form-group" v-for="(col,k) in newSearchArray" :key="k">
          <label class="searchOptionsText">{{col.searchOptionsText}}</label>
          <label class="requirementOptionsText">{{col.requirementOptionsText}}</label>
          <label class="inputText">{{col.inputText}}</label>
          <label class="relationOptionsText">{{col.relationOptionsText}}</label>
          <button type="button" class="btn deleteBtn clearBtnBorder" @click="deleteSearch(k)">{{translate.remove}}</button>
        </div>
        <div class="form-group advancedSearch-group" v-if="advancedSearch.show">
          <v-select :options="advancedSearch.searchOptions" :value="advancedSearch.searchDefaultOptions" optionsLabel="name" optionsValue="id"  :search="true" @afterSelected="searchOptionsSelected"></v-select>
          <v-select :options="advancedSearch.requirementOptions" :value="advancedSearch.reqDefaultOptions" optionsLabel="name" optionsValue="id"  :search="true" @afterSelected="requirementSelected"></v-select>
          <v-select :options="advancedSearch.valueOptions" v-if="isSelect" :value="advancedSearch.valueDefaultOptions" optionsLabel="text" optionsValue="id"  :search="true"  @afterSelected="valueSelected"></v-select>
          <input type="text" class="value-input" v-else v-model="advancedSearch.inputText">
          <v-select :options="advancedSearch.relationOptions" :value="advancedSearch.relationDefaultOptions" optionsLabel="name" optionsValue="id"  :search="true"  @afterSelected="relationSelected"></v-select>
          <button type="button" class="btn addBtn clearBtnBorder" @click="addSearchOptions()">{{translate.addNew}}</button>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="advancedSearch.show = false">{{translate.cancel}}</button>
        <button type="button" class="btn submit-btn clearBtnBorder" :class="{disabled: isDisabled}" @click="submitSet(isDisabled)">{{translate.search}}</button>
      </div>
    </v-modal>
    <v-modal :show="showExport" effect="fade">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          {{translate.export}}
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <v-tree id="resourceTree" ref="tree" cascade="true" :items="fieldsToExport" :checkable="true" :search="false"></v-tree>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showExport = false">{{translate.cancel}}</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="exportTable">{{ exportStatus }}</button>
      </div>
    </v-modal>
    <v-modal :show="showDetail" effect="fade">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          {{ student.name }}
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div v-for="(category, i) in student.categories" :key="i" class="category">
          <p class="text-muted category-title">{{ category.title }}</p>
          <ul class="category-list">
            <li v-for="(field, j) in category.fields" :key="j">
              <span class="field-name">{{ field.name }}</span>
              <span class="field-value">{{ field.value || fieldDefaultText }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showDetail = false">{{translate.back}}</button>
      </div>
    </v-modal>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { sAjax, translation } from '../../assets/utils/utils.js'
  export default {
    props: {
      role: ''
    },
    created: function () {
      var la = localStorage.getItem('lang')
      var that = this
      if (translation(la)) {
        this.lang = la
      }
      this.type = this.role
      this.definedSearch.type = this.type
      sAjax({
        url: '/api/student/manage/getAdvancedSearchOptions',
        dataType: 'json',
        type: 'get',
        success: function (result) {
          var data = result.data
          if (result.state) {
            that.newSearchData = data
            var typesData = data['studentId']['types'] || []
            var optionsData = data['studentId']['options'] || []
            var newDic = null
            for (var k in optionsData) {
              newDic = {}
              newDic.id = k
              newDic.name = optionsData[k]
              that.advancedSearch.requirementOptions.push(newDic)
            }
            for (var f in typesData) {
              newDic = {}
              newDic.id = f
              newDic.name = typesData[f]
              that.advancedSearch.relationOptions.push(newDic)
            }
            for (var c in data) {
              for (var i in data[c]) {
                var dic = {}
                if (i === 'key') {
                  dic.id = data[c][i]
                  dic.name = data[c]['keyName']
                  that.advancedSearch.searchOptions.push(dic)
                }
              }
            }
            if (data['studentId']['dicts']) {
              that.advancedSearch.valueOptions = data['studentId']['dicts']
            }
          }
        }
      })
      sAjax({
        url: '/api/student/manage/getTree',
        dataType: 'json',
        type: 'get',
        success: function (result) {
          let data = result.data
          if (result.state) {
            let treeData = []
            data.forEach(parent => {
              let treeItem = {
                id: parent.parentId,
                title: parent.parentName,
                edit: false,
                children: []
              }
              parent.childrens.forEach(child => {
                treeItem.children.push({
                  id: child.parentId,
                  title: child.parentName,
                  disabled: false,
                  meta: true,
                  data: {
                    tableName: parent.parentId,
                    fieldType: child.fieldType,
                    fieldName: child.parentId,
                    dictType: child.dictType
                  }
                })
              })
              treeData.push(treeItem)
            })
            that.fieldsToExport = treeData
          }
        }
      })
      this._initColumns()
    },
    data: function () {
      return {
        columns: [],
        url: '/table-data/student/manage/getMyManageStudents',
        method: 'get',
        showAdvancedSearchModal: false,
        showWaiting: false,
        definedSearch: {
          searchDTOS: [],
          type: '',
          studentId: '',
          studentName: '',
          college: '',
          studentType: '',
          grade: '',
          phoneNumber: '',
          isAdvancedSearch: false
        },
        type: '',
        normalSearchOptions: {
          gradeOptions: [],
          studentTypeOptions: [],
          collegeOptions: []
        },
        advancedSearch: {
          show: false,
          searchOptions: [],
          relationOptions: [],
          requirementOptions: [],
          valueOptions: [],
          inputText: '',
          defaultOptions: '1',
          searchDefaultOptions: 'studentId',
          reqDefaultOptions: 'eq',
          relationDefaultOptions: 'and',
          valueDefaultOptions: ''
        },
        selectedList: [],
        setInstructorText: '',
        instructorId: {
          single: '',
          transferIn: '',
          transferOut: ''
        },
        studentUserIds: [],
        newSearchCondition: {
          searchOptionsText: '学号',
          requirementOptionsText: '等于',
          inputText: '',
          relationOptionsText: '并且'
        },
        newSearchArray: [],
        newSearchData: [],
        searchParameters: {
          key: 'studentId',
          relation: 'eq',
          value: '',
          tableName: '',
          type: 'and'
        },
        searchDots: [],
        checkResult: '',
        isExist: {
          outInstructor: false,
          inInstructor: false
        },
        isSelect: false,
        isFirstAdd: true,
        isClearArray: true,
        isClearSearchData: false,
        isSelected: false,
        emptySearch: true,
        selecteds: [],
        lang: 'zh-cn',
        showExport: false,
        fieldsToExport: [],
        exporting: false,
        showDetail: false,
        student: {
          name: '',
          categories: []
        },
        fieldDefaultText: '',
        isDisabled: false
      }
    },
    computed: {
      translate: function () {
        return translation(this.lang).infoManage
      },
      exportStatus: function () {
        return this.exporting ? '导出中' : this.translate.export
      },
      tableName: function () {
        return this.type === 'school'
          ? this.translate.schoolStudentManage
          : this.type === 'college'
            ? this.translate.collegeStudentManage
            : this.translate.myStudentManage
      },
      pageId: function () {
        return `student-manage-page-${this.type}`
      }
    },
    watch: {
      type: function () {
        this.definedSearch.type = this.type
        let that = this
        sAjax({
          url: `/api/student/manage/getSelectOptions?type=${this.definedSearch.type}`,
          dataType: 'json',
          type: 'get',
          success: function (result) {
            var data = result.data
            if (result.state) {
              that.normalSearchOptions.collegeOptions = data['colleges'] || []
              that.normalSearchOptions.gradeOptions = data['grade'] || []
              that.normalSearchOptions.studentTypeOptions = data['studentType'] || []
              that._initColumns()
            }
          }
        })
      }
    },
    methods: {
      _initColumns: function () {
        var that = this
        this.columns = [
        {
          id: 'studentId',
          title: this.translate.infoFields.studentId,
          className: 'text-left',
          width: 120,
          hidden: false,
          search: {
            type: 'input',
            data: {
              placeholder: this.translate.studentIdPlaceholder
            }
          }
        },
        {
          id: 'studentName',
          title: this.translate.infoFields.name,
          className: 'text-left',
          width: 120,
          hidden: false,
          search: {
            type: 'input',
            data: {
              placeholder: this.translate.namePlaceholder
            }
          },
          formatter: function (record, index) {
            return record.name
          }
        },
        {
          id: 'college',
          title: this.translate.infoFields.collegeName,
          className: 'text-left',
          width: 120,
          hidden: false,
          search: {
            type: 'select',
            data: {
              options: this.normalSearchOptions.collegeOptions,
              optionsLabel: 'text',
              optionsValue: 'id',
              placeholder: ''
            }
          }
        },
        {
          id: 'studentType',
          title: this.translate.infoFields.studentType,
          className: 'text-left',
          width: 120,
          hidden: false,
          search: {
            type: 'select',
            data: {
              options: this.normalSearchOptions.studentTypeOptions,
              optionsLabel: 'text',
              optionsValue: 'id',
              placeholder: ''
            }
          }
        },
        {
          id: 'grade',
          title: this.translate.infoFields.grade,
          className: 'text-center',
          width: 120,
          hidden: false,
          search: {
            type: 'select',
            data: {
              options: this.normalSearchOptions.gradeOptions,
              optionsLabel: 'text',
              optionsValue: 'id',
              placeholder: ''
            }
          }
        },
        {
          id: 'phoneNumber',
          title: this.translate.infoFields.phoneNumber,
          className: 'text-center',
          width: 120,
          hidden: false,
          search: {
            type: 'input',
            data: {
              placeholder: this.translate.phoneNumber
            }
          },
          formatter: function (record, index) {
            return record.phone
          }
        },
        {
          id: 'instructor',
          title: this.translate.infoFields.instructor,
          className: 'text-left',
          width: 120,
          hidden: false
        },
        {
          id: 'birthPlace',
          title: this.translate.infoFields.originPlace,
          className: 'text-left',
          hidden: false
        },
        {
          id: 'opt',
          title: this.translate.opt,
          className: 'text-center',
          width: 120,
          hidden: false,
          formatter: function () {
            return [{
              tag: 'a',
              text: that.translate.show,
              className: 'opt-btn',
              callback: function (record, index) {
                sAjax({
                  url: `/api/student/manage/getMyManageStudent/${record.userId}`,
                  dataType: 'json',
                  type: 'get',
                  success: function (result) {
                    var data = result.data
                    if (result.state) {
                      that.student.name = data.name
                      let category = {
                        title: that.translate.stuBaseInfo,
                        fields: []
                      }
                      for (let key in data) {
                        if (['userId', 'portrait'].includes(key)) {
                          continue
                        }
                        category.fields.push({
                          name: that.translate.infoFields[key],
                          value: data[key]
                        })
                      }
                      that.student.categories = [category]
                      that.showDetail = true
                    }
                  }
                })
              }
            }]
          }
        }]
      },
      showSearch: function () {
        this.advancedSearch.show = true
        if (this.isClearSearchData) {
          this.searchDots.splice(0, this.searchDots.length)
          this.newSearchArray.splice(0, this.newSearchArray.length)
        }
        this.searchParameters = {
          key: 'studentId',
          relation: 'eq',
          value: '',
          type: 'and'
        }
        this.advancedSearch.inputText = ''
        this.searchParameters.tableName = this.newSearchData['studentId']['tableName']
        this.newSearchCondition = {
          searchOptionsText: '学号',
          requirementOptionsText: '等于',
          inputText: '',
          relationOptionsText: '并且'
        }
        this.isSelect = false
      },
      addSearchOptions: function () {
        if (this.isSelect === false) {
          this.newSearchCondition.inputText = this.advancedSearch.inputText
          this.searchParameters.value = this.advancedSearch.inputText
        }
        if (this.isClearArray) {
          this.searchDots.splice(0, this.searchDots.length)
        }
        this.isClearArray = false
        var searchData = JSON.parse(JSON.stringify(this.newSearchCondition))
        this.newSearchArray.push(searchData)
        var searchData1 = JSON.parse(JSON.stringify(this.searchParameters))
        this.searchDots.push(searchData1)
      },
      submitSet: function (isDisabled) {
        if (isDisabled) {
          return false
        }
        // if (this.emptySearch) {
        //   return this.$toast('请设置搜索条件')
        // }
        // if (this.isFirstAdd) {
        //   if (this.isSelect === false) {
        //     this.searchParameters.value = this.advancedSearch.inputText
        //   } else {
        //     if (!this.isSelected) {
        //       this.searchParameters.value = this.advancedSearch.valueOptions[0]['id']
        //     }
        //   }
        //   var searchData = JSON.parse(JSON.stringify(this.searchParameters))
        //   this.searchDots.push(searchData)
        // }
        if (this.isSelect === false) {
          this.searchParameters.value = this.advancedSearch.inputText
        }
        this.searchDots.push(this.searchParameters)
        this.url = '/table-data/student/manage/advancedSearch'
        this.definedSearch.searchDTOS = JSON.parse(JSON.stringify(this.searchDots))
        this.method = 'post'
        this.definedSearch.isAdvancedSearch = true
        this.advancedSearch.show = false
        this.isClearSearchData = true
      },
      deleteSearch: function (index) {
        this.newSearchArray.splice(index, 1)
        this.searchDots.splice(index, 1)
        if (this.searchDots.length === 0) {
          this.isClearArray = true
          var searchData = JSON.parse(JSON.stringify(this.searchParameters))
          this.searchDots.push(searchData)
        }
      },
      searchOptionsSelected: function (obj) {
        if (!obj.target.selected) {
          this.isDisabled = true
        } else {
          this.isDisabled = false
          this.newSearchCondition.searchOptionsText = obj.target.selected
          this.searchParameters.key = obj.val
          var newObj = this.newSearchData[obj.val]
          var newDic = null
          this.advancedSearch.requirementOptions.splice(0, this.advancedSearch.requirementOptions.length)
          this.advancedSearch.relationOptions.splice(0, this.advancedSearch.relationOptions.length)
          this.searchParameters.tableName = newObj['tableName']
          for (var k in newObj['options']) {
            newDic = {}
            newDic.id = k
            newDic.name = newObj['options'][k]
            this.advancedSearch.requirementOptions.push(newDic)
          }
          for (var j in newObj['types']) {
            newDic = {}
            newDic.id = j
            newDic.name = newObj['types'][j]
            this.advancedSearch.relationOptions.push(newDic)
          }
          this.isSelect = newObj['select']
          if (newObj['dicts']) {
            this.advancedSearch.valueOptions = newObj['dicts']
            if (this.advancedSearch.valueOptions) {
              this.advancedSearch.valueDefaultOptions = this.advancedSearch.valueOptions[0]['id']
              this.newSearchCondition.inputText = this.advancedSearch.valueOptions[0]['text']
              this.searchParameters.value = this.advancedSearch.valueOptions[0]['id']
            }
          }
        }
      },
      requirementSelected: function (obj) {
        if (!obj.target.selected) {
          this.isDisabled = true
        } else {
          this.isDisabled = false
          this.newSearchCondition.requirementOptionsText = obj.target.selected
          this.searchParameters.relation = obj.val
        }
      },
      relationSelected: function (obj) {
        if (!obj.target.selected) {
          this.isDisabled = true
        } else {
          this.isDisabled = false
          this.newSearchCondition.relationOptionsText = obj.target.selected
          this.searchParameters.type = obj.val
        }
      },
      valueSelected: function (obj) {
        if (!obj.target.selected) {
          this.isDisabled = true
        } else {
          this.isDisabled = false
          this.isSelected = true
          this.newSearchCondition.inputText = obj.target.selected
          this.searchParameters.value = obj.val
        }

      },
      reset: function () {
        this.emptySearch = true
        this.isClearSearchData = true
        this.isClearArray = true
        this.isFirstAdd = true
        this.isSelect = false
        this.isSelected = false
        this.definedSearch.isAdvancedSearch = false
        this.searchDots = []
        this.url = '/table-data/student/manage/getMyManageStudents?timestamp=' + new Date().getTime()
        this.method = 'get'
      },
      exportTable: function () {
        let that = this
        if (this.exporting) {
          return
        }
        let checkedItems = this.$refs.tree.getChecked()
        let fields = []
        checkedItems.forEach(item => {
          if (!item.meta) {
            return
          }
          if (!item.checked) {
            return
          }
          fields.push(item.data)
        })

        if (!fields.length) {
          return that.$toast('请勾选至少一个字段')
        }
        this.exporting = true
        that.showWaiting = true
        sAjax({
          url: '/api/student/manage/getExportFileName',
          dataType: 'json',
          data: Object.assign({ exportFieldVO: fields }, this.definedSearch),
          type: 'post',
          success: function (data) {
            that.showWaiting = false
            if (data.state) {
              window.location.href = `/downloads/student/manage/downloadExportFile?fileName=${data.data}`
              that.showExport = false
            } else {
              that.$toast(data.message)
            }
            that.exporting = false
          }
        })
      },
      collegeOptionsSelected: function (obj) {
        if (obj.val === '-1') {
          this.definedSearch.college = ''
        } else {
          this.definedSearch.college = obj.val
        }
      },
      studentTypeOptionsSelected: function (obj) {
        if (obj.val === '-1') {
          this.definedSearch.studentType = ''
        } else {
          this.definedSearch.studentType = obj.val
        }
      },
      gradeOptionsSelected: function (obj) {
        if (obj.val === '-1') {
          this.definedSearch.grade = ''
        } else {
          this.definedSearch.grade = obj.val
        }
      }
    }
  }
</script>
<style lang="less">
@import url("../../assets/common.less");

.student-manage-page {
  .instructor-text {
    margin-bottom: 20px;
  }
  .modal-text {
    margin: 0 0 10px -35px;
  }
  .modal-body {
    max-height: 400px;
  }
  .transfer-text {
    margin-top: 20px;
    color: red;
  }
  .transferIn {
    margin-top: 20px;
  }
  .value-input {
    height: 35px;
    padding-top: 0;
    margin-top: 14px;
    width: 30%;
  }
  .advancedSearch-group .dropdown-menu {
    position: fixed;
    top: auto;
    left: auto;
  }
  .searchOptionsText,
  .requirementOptionsText,
  .relationOptionsText {
    width: 65px;
    text-align: center;
    padding: 6px 0;
    border: 1px solid #eeeeee;
  }
  .inputText {
    width: 136px;
    height: 34px;
    vertical-align: middle;
    margin-top: 3px;
    margin-left: 3px;
    padding: 6px 2px;
    border: 1px solid #eeeeee;
  }
  .deleteBtn {
    color: white;
    background: red;
    border-radius: 100px;
    padding: 3px 12px;
  }
  .addBtn {
    color: white;
    background: #298df7;
    border-radius: 100px;
    padding: 3px 12px;
  }
  .category-list {
    list-style: none;
    padding-left: 0;
    font-size: 14px;
    li {
      margin-bottom: 10px;
    }
    .field-name {
      font-weight: 500;
      min-width: 160px;
      display: inline-block;
    }
    .field-value {
      color: #666;
    }
  }
  .page-waiting {
    background-color: rgba(0, 0, 0, 0.3);
    position: fixed;
    z-index: 9000;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    opacity: 1;
  }
  .spinner {
    margin: 20px 0 0 50px;
    width: 50px;
    height: 50px;
    left: 50%;
    top: 40%;
    position: relative;
  }
  .waiting-text {
    margin-left: 154px;
    top: 43%;
    position: relative;
    font-weight: 500;
    font-size: 14px;
  }
  .container1 > div,
  .container2 > div,
  .container3 > div {
    width: 6px;
    height: 6px;
    background-color: #298df7;
    border-radius: 100%;
    position: absolute;
    -webkit-animation: bouncedelay 1.2s infinite ease-in-out;
    animation: bouncedelay 1.2s infinite ease-in-out;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
  }

  .spinner .spinner-container {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .container2 {
    -webkit-transform: rotateZ(45deg);
    transform: rotateZ(45deg);
  }

  .container3 {
    -webkit-transform: rotateZ(90deg);
    transform: rotateZ(90deg);
  }

  .circle1 {
    top: 0;
    left: 0;
  }
  .circle2 {
    top: 0;
    right: 0;
  }
  .circle3 {
    right: 0;
    bottom: 0;
  }
  .circle4 {
    left: 0;
    bottom: 0;
  }

  .container2 .circle1 {
    -webkit-animation-delay: -1.1s;
    animation-delay: -1.1s;
  }

  .container3 .circle1 {
    -webkit-animation-delay: -1s;
    animation-delay: -1s;
  }

  .container1 .circle2 {
    -webkit-animation-delay: -0.9s;
    animation-delay: -0.9s;
  }

  .container2 .circle2 {
    -webkit-animation-delay: -0.8s;
    animation-delay: -0.8s;
  }

  .container3 .circle2 {
    -webkit-animation-delay: -0.7s;
    animation-delay: -0.7s;
  }

  .container1 .circle3 {
    -webkit-animation-delay: -0.6s;
    animation-delay: -0.6s;
  }

  .container2 .circle3 {
    -webkit-animation-delay: -0.5s;
    animation-delay: -0.5s;
  }

  .container3 .circle3 {
    -webkit-animation-delay: -0.4s;
    animation-delay: -0.4s;
  }

  .container1 .circle4 {
    -webkit-animation-delay: -0.3s;
    animation-delay: -0.3s;
  }

  .container2 .circle4 {
    -webkit-animation-delay: -0.2s;
    animation-delay: -0.2s;
  }

  .container3 .circle4 {
    -webkit-animation-delay: -0.1s;
    animation-delay: -0.1s;
  }

  @-webkit-keyframes bouncedelay {
    0%,
    80%,
    100% {
      -webkit-transform: scale(0);
    }
    40% {
      -webkit-transform: scale(1);
    }
  }

  @keyframes bouncedelay {
    0%,
    80%,
    100% {
      transform: scale(0);
      -webkit-transform: scale(0);
    }
    40% {
      transform: scale(1);
      -webkit-transform: scale(1);
    }
  }
}
</style>
