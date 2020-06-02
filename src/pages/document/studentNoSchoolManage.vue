<template>
  <div class="info-set-container">
    <div :id="pageId" class="student-manage-page" v-show="layoutManageJson.route === 'main'">
      <div class="content text-center">
        <v-table :title="tableName" ref="studentTable" :url="url" :method="method" pagesize="10" idField="id" :columns="columns" :order="true" :search="false" :searchParams="definedSearch" :columnsControl="true">
          <div slot="btn-group" class="btn-group pull-right" role="group">
            <button class="btn btn-bgColor-style clearBtnBorder" @click="_showEducationLevelModal" v-if="role === 'school'">{{translate.layoutManage}}</button>
            <button class="btn btn-bgColor-style clearBtnBorder" @click="showSearch()">{{translate.advancedSearch}}</button>
            <button class="btn btn-bgColor-style clearBtnBorder" @click="showExport = true">{{translate.export}}</button>
          </div>
        </v-table>
      </div>
      <v-modal :show="advancedSearch.show" effect="fade" width="580">
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
      <v-modal :show="layoutManageJson.educationLevelShow" effect="fade">
        <div slot="modal-header" class="modal-header">
          <h5 class="modal-title">
            请选择需要配置展示布局的培养层次群体
            <!-- {{ translate.setTip}} -->
          </h5>
        </div>
        <div slot="modal-body" class="modal-body">
          <v-select
            v-model="layoutManageJson.educationLevel"
            placeholder="全部"
            :options="layoutManageJson.educationLevelOptions"
            options-label="label" options-value="value">
            </v-select>
        </div>
        <div slot="modal-footer" class="modal-footer">
          <button type="button" class="btn cancel-btn clearBtnBorder" @click="layoutManageJson.educationLevelShow = false">{{translate.cancel}}</button>
          <button type="button" class="btn submit-btn clearBtnBorder" @click="_setLayout()">{{ translate.startSet}}</button>
        </div>
      </v-modal>
    </div>
    <FormSetManage
      :infoSetting="{
        type: 'STUDENT',
        educationLevel: layoutManageJson.educationLevel,
        tabs: layoutManageJson.infoTypes
      }"
      :student="studentBie"
      @back="_closeFormSetting"
      @submit="_saveFormInfo"
      @addNewFenlei="_newFenlei"
      @remove="_removeFenlei"
      @gotoRoleSet="layoutManageJson.route='joinRoleSet'"
      v-show="layoutManageJson.route === 'formSetManage'"
      v-if="layoutManageJson.route !== 'main'">
    </FormSetManage>
    <JoinRoleSetManage
      :roleSetting="{
        type: 'STUDENT',
        educationLevel: layoutManageJson.educationLevel
      }"
      @back="layoutManageJson.route = 'formSetManage'"
      @submit="_saveRoles"
      v-if="layoutManageJson.route==='joinRoleSet'">
    </JoinRoleSetManage>
    <div class="preview-container"
      v-if="layoutManageJson.preview">
      <preview
        :data="layoutManageJson.layoutsJson[layoutManageJson.curInfoId]&&layoutManageJson.layoutsJson[layoutManageJson.curInfoId].components"
        :defaultData="layoutManageJson.instanceJson[layoutManageJson.curInfoId]"
        :log="layoutManageJson.logsJson[layoutManageJson.curInfoId]"
        :script="layoutManageJson.layoutsJson[layoutManageJson.curInfoId]&&layoutManageJson.layoutsJson[layoutManageJson.curInfoId].property&&layoutManageJson.layoutsJson[layoutManageJson.curInfoId].property.script"
        :previewType="'form'"
        :infoSetting="{
          tabs: layoutManageJson.infoTypes,
          curInfoId: layoutManageJson.curInfoId
        }"
        @tabExchange="_initInfoType"
        @submit="_getInfoValue"
        @submitAll="_submitAll"
        @search="_getInfoTypes(null, $event)"
        @back="layoutManageJson.preview = false"></preview>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { sAjax, translation } from '../../assets/utils/utils.js'
  import formSetManage from '../workflow/formSetManage.vue'
  Vue.component('FormSetManage', formSetManage)
  export default {
    props: {
      data: {
        default: null
      },
      role: {
        default: ''
      },
      xiaostatuszai:{
        default: null
      }
    },
    created: function () {
      var la = localStorage.getItem('lang')
      var that = this
       sAjax({
      url: "/api/payment/sysdicttype?typeName=培养层次",
      dataType: "json",
      type: "get",
      async: false,
      success: function(result) {
        if (result.state) {
          that.educationLevels = result.data;
        }
      }
    });
      if (translation(la)) {
        this.lang = la
      }
      this.definedSearch.type = this.role
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
                id: parent.id,
                title: parent.name,
                edit: false,
                children: []
              }
              parent.childrens.forEach(child => {
                treeItem.children.push({
                  id: child.id,
                  title: child.name,
                  disabled: false,
                  meta: true,
                  data: {
                    typeId: parent.id,
                    fieldType: child.fieldType,
                    fieldId: child.id
                  }
                })
              })
              treeData.push(treeItem)
            })
            that.fieldsToExport = treeData
          }
        }
      })
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
      if (this.layoutManageJson.educationLevelOptions.length === 0) {
        this.$waiting.show()
        sAjax({
          url: '/api/system/dictTypes/1000/dicts',
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.layoutManageJson.educationLevelOptions = data.data
            } else {
              this.$toast(data.message)
            }
          }
        }).always(() => {
          this.$waiting.close()
        })
      }
      this._initColumns()
    },
    data: function () {
      return {
        studentBie:true,
        educationLevels:[],
        columns: [],
        url: '',
        method: 'get',
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
        isSelect: false,
        isClearArray: true,
        isClearSearchData: false,
        lang: 'zh-cn',
        showExport: false,
        fieldsToExport: [],
        exporting: false,
        student: {
          name: '',
        },
        isDisabled: false,
        layoutManageJson: {
          educationLevelOptions: [],
          educationLevelShow: false,
          educationLevel: '',
          infoTypes: [],
          route: 'main',
          layoutsJson: {},
          logsJson: {},
          instanceJson: {},
          preview: false,
          curInfoId: ''
        }
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
        return this.role === 'school'
          ? this.translate.schoolStudentManage
          : this.role === 'college'
            ? this.translate.collegeStudentManage
            : this.translate.myStudentManage
      },
      pageId: function () {
        return `student-manage-page-${this.role}`
      },
      distributary: function () {
        return this.role === 'school' ? 'bySchool' : (this.role === 'college' ? 'byCollege' : 'byTeacher')
      }
    },
    watch: {
      // role: function () {
      //   this.definedSearch.type = this.role
      //   let that = this

      // }
    },
    methods: {
      _closeFormSetting: function () {
        this.layoutManageJson.route = 'main'
        this.$emit('fullScreen', false)
      },
      _resetLayoutManageJson: function () {
        this.layoutManageJson.layoutsJson = {}
        this.layoutManageJson.logsJson = {}
        this.layoutManageJson.instanceJson = {}
        this.layoutManageJson.curInfoId = ''
      },
      _showEducationLevelModal: function () {
        this.layoutManageJson.educationLevelShow = true
      },
      _setLayout: function () {
        // 获取信息类别
        this.layoutManageJson.educationLevelShow = false
        if (this.layoutManageJson.infoTypes.length === 0) {
          this._getInfoTypes(() => {
            this.layoutManageJson.route = 'formSetManage'
            this.$emit('fullScreen', true)
          })
        } else {
          this.layoutManageJson.route = 'formSetManage'
          this.$emit('fullScreen', true)
        }
      },
      _getInfoTypes: function (cb, searchContent) {
        // this.$waiting.show()
        sAjax({
          url: '/api/information/columnTypes/STUDENT',
          type: 'get',
          data: {
            educationLevel: this.layoutManageJson.educationLevel,
            searchContent: searchContent
          },
          success: (data) => {
            if (data.state) {
              if (data.data && data.data.length > 0) {
                this.layoutManageJson.infoTypes = data.data || []
                this.layoutManageJson.infoTypes.forEach((type) => {
                  this.$set(type, 'title', type.text)
                })
                cb&&cb()
              } else {
                this.$toast(this.translate.nullColumnTypesTip)
              }
            } else {
              this.$toast(data.message)
            }
          }
        }).always(() => {
          // this.$waiting.close()
        })
      },
      _newFenlei:function(str){
        //这里处理新增分类操作
          sAjax({
        url: '/api/data/column/infoType',
        dataType: 'json',
        type: 'POST',
        data:{
          title:str,
          type:"student"
        },
        success: function (result) {
           if(result.state){
            that.layoutManageJson.infoTypes.push(result.data)
          }
          else{
             that.$toast(result.message)
          }
          }
        
      })
      },
      _removeFenlei:function(id){
        // 这里处理删除分类操作
           sAjax({
        url: `/api/data/column/infoType/${id}`,
        dataType: 'json',
        type: 'post',
        success: function (result) {
          
          }
        
      })

      },
      _saveFormInfo: function (arr) {
        if (arr.length > 0) {
          this.$waiting.show()
          sAjax({
            url: '/api/information/infoSettings/STUDENT',
            type: 'post',
            data: {
              educationLevel: this.layoutManageJson.educationLevel,
              infoTypes: arr
            },
            success: (data) => {
              if (data.state) {
                this.layoutManageJson.route = 'main'
                this.$toast(this.translate.successTip)
              } else {
                this.$toast(data.message)
              }
            }
          }).always(() => {
            this.$waiting.close()
          })
        } else {
          this.layoutManageJson.route = 'main'
          this.$toast(this.translate.successTip)
        }
      },
      _saveRoles: function (data) {
        sAjax({
          url: '/api/information/player/' + data.type,
          type: 'post',
          data: {
            players: data.players,
            educationLevel: data.educationLevel,
          },
          success: (data) => {
            if (data.state) {
              this.$toast(this.translate.successTip)
              this.layoutManageJson.route = 'formSetManage'
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _initInfoType: function (tab) {
        // 获取布局
        if (!tab) { return }
        if (!(this.layoutManageJson.layoutsJson[tab.id] && this.layoutManageJson.logsJson)) {
          sAjax({
            url: `/api/information/infoSetting/STUDENT/${tab.id}`,
            type: 'get',
            data: {
              userId: this.student.userId,
              distributary: this.distributary
            },
            success: (data) => {
              if (data.state) {
                if (!data.data) {
                  data.data = {
                    components: []
                  }
                }
                data.data.components.forEach((ele) => {
                  Vue.set(ele, 'x', ele.location.left)
                  Vue.set(ele, 'y', ele.location.top)
                  Vue.set(ele, 'w', ele.size.width)
                  Vue.set(ele, 'h', ele.size.height)
                })
                this.$set(this.layoutManageJson.layoutsJson, tab.id, data.data)
                this.layoutManageJson.curInfoId = tab.id

                // 获取操作日志
                sAjax({
                  url: `/api/information/infoInstance/changeLogs/STUDENT/${tab.id}`,
                  type: 'get',
                  data: {
                    userId: this.student.userId
                  },
                  success: (data) => {
                    if (data.state) {
                      this.$set(this.layoutManageJson.logsJson, tab.id, data.data || [])
                      this.layoutManageJson.preview = true
                    } else {
                      this.$toast(data.message)
                    }
                  }
                })
              } else {
                this.$toast(data.message)
              }
            }
          })
        } else {
          this.layoutManageJson.curInfoId = tab.id
        }
      },
      _getInfoValue: function (obj) {
        // 获取当前类型数据
        this.$set(this.layoutManageJson.instanceJson, this.layoutManageJson.curInfoId, obj)
      },
      _submitAll: function () {
        // 提交全部修改记录
        this.$waiting.show()
        var arr = []
        for (var i in this.layoutManageJson.instanceJson) {
          arr.push({ infoId: i, formData: this.layoutManageJson.instanceJson[i].formData })
        }
        sAjax({
          url: `/api/information/infoInstance/STUDENT/${this.distributary}/${this.student.userId}`,
          type: 'post',
          data: {
            typesValue: arr
          },
          success: (data) => {
            if (data.state) {
              this.$toast(this.translate.successTip)
              this.layoutManageJson.instanceJson = {}
              this.layoutManageJson.preview = false
            } else {
              this.$toast(data.message)
            }
          }
        }).always(() => {
          this.$waiting.close()
        })
      },

      _initColumns: function () {
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
            id: 'name',
            title: this.translate.infoFields.name,
            className: 'text-left',
            width: 80,
            hidden: false,
            search: {
              type: 'input',
              data: {
                placeholder: this.translate.namePlaceholder
              }
            },
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
            id: 'educationLevel',
            title: "培养层次",
            className: 'text-left',
            width: 100,
            hidden: false,
            search: {
              type: 'select',
              data: {
                  options: this.educationLevels,
            optionsLabel: "label",
            optionsValue: "value"
              }
            }
          },
          {
            id: 'grade',
            title: this.translate.infoFields.grade,
            className: 'text-left',
            width: 50,
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
            id: 'clazz',
            title: "班级",
            className: 'text-left',
            width: 120,
            hidden: true,
            search: {
              type: 'input',
              data: {
                placeholder: '班级'
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
            width: 80,
            hidden: false
          },
          {
            id: 'originPlace',
            title: this.translate.infoFields.originPlace,
            className: 'text-left',
            width: 120,
            hidden: false,
            search: {
              type: 'input',
              data: {
                placeholder:"生源地"
              }
            },
            formatter: function (record, index) {
              return record.birthPlace
            }
          },
           {
            id: 'idCard',
            title: "身份证号",
            className: 'text-left',
            width: 120,
            hidden: true,
            search: {
              type: 'input',
              data: {
                placeholder:"身份证号"
              }
            }
          },
           {
            id: 'weChat',
            title: "微信号",
            className: 'text-left',
            width: 120,
            hidden: true,
            search: {
              type: 'input',
              data: {
                placeholder: "微信号"
              }
            }
          },
           {
            id: 'qq',
            title: "QQ号",
            className: 'text-left',
            width: 120,
            hidden: true,
            search: {
              type: 'input',
              data: {
                placeholder: "QQ号"
              }
            }
          },
          //  {
          //   id: 'nowStatus',
          //   title: "当前状态",
          //   className: 'text-left',
          //   width: 120,
          //   hidden: true,
          //   search: {
          //     type: 'input',
          //     data: {
          //       placeholder: "学生当前状态"
          //     }
          //   }
          // },
          {
            id: 'opt',
            title: this.translate.opt,
            className: 'text-center',
            width: 120,
            hidden: false,
            formatter: () => {
              var that = this
              return [{
                tag: 'a',
                text: this.translate.show,
                className: 'opt-btn',
                callback: (record, index) => {
                  this._resetLayoutManageJson()
                  this.student = record
                  if (this.layoutManageJson.infoTypes.length > 0) {
                    this._initInfoType(this.layoutManageJson.infoTypes[0])
                  } else {
                    this._getInfoTypes(() => {
                      this._initInfoType(this.layoutManageJson.infoTypes[0])
                    })
                  }
                }
              }]
            }
          }]
           if(this.xiaostatuszai == true){
            this.url = '/table-data/student/manage/manageStudents/' + this.role+'?inSchool=true'
          }
          else if(this.xiaostatuszai == false)(
            this.url = '/table-data/student/manage/manageStudents/' + this.role+'?inSchool=false'
          )
          else{
            this.url = '/table-data/student/manage/manageStudents/' + this.role
          }
        // this.url = '/table-data/student/manage/getMyManageStudents'
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
        this.definedSearch.studentId = this.$refs.studentTable.tableSearchFields.studentId
        this.definedSearch.studentName = this.$refs.studentTable.tableSearchFields.name
        this.definedSearch.college = this.$refs.studentTable.tableSearchFields.college
        this.definedSearch.studentType = this.$refs.studentTable.tableSearchFields.studentType
        this.definedSearch.grade = this.$refs.studentTable.tableSearchFields.grade
        this.definedSearch.phoneNumber = this.$refs.studentTable.tableSearchFields.phoneNumber
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
        let searchOptionsText = '';
        for (let searchOption of this.advancedSearch.searchOptions) {
          if (searchOption.id == obj.value) {
            searchOptionsText = searchOption.name
          }
        }
        if (!searchOptionsText) {
          this.isDisabled = true
        } else {
          this.isDisabled = false
          this.newSearchCondition.searchOptionsText = searchOptionsText
          this.searchParameters.key = obj.value
          this.advancedSearch.searchDefaultOptions = obj.value
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
          this.searchParameters.relation = obj.value
          this.advancedSearch.reqDefaultOptions = obj.value
        }
      },
      relationSelected: function (obj) {
        if (!obj.target.selected) {
          this.isDisabled = true
        } else {
          this.isDisabled = false
          this.newSearchCondition.relationOptionsText = obj.target.selected
          this.searchParameters.type = obj.value
          this.advancedSearch.relationDefaultOptions = obj.value
        }
      },
      valueSelected: function (obj) {
        if (!obj.target.selected) {
          this.isDisabled = true
        } else {
          this.isDisabled = false
          this.newSearchCondition.inputText = obj.target.selected
          this.searchParameters.value = obj.value
          this.advancedSearch.valueDefaultOptions = obj.value
        }
      },
      exportTable: function () {
        let that = this
        if (this.exporting) {
          return
        }

        //这里是处理导出表的字段
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
        this.$waiting.show({
          text: '正在导出...(导出时间跟学生数量相关，请耐心等待)',
          container: 'body'
        })
        this.exporting = true
        this.definedSearch.studentId = this.$refs.studentTable.tableSearchFields.studentId
        this.definedSearch.studentName = this.$refs.studentTable.tableSearchFields.name
        this.definedSearch.college = this.$refs.studentTable.tableSearchFields.college
        this.definedSearch.studentType = this.$refs.studentTable.tableSearchFields.studentType
        this.definedSearch.grade = this.$refs.studentTable.tableSearchFields.grade
        this.definedSearch.phoneNumber = this.$refs.studentTable.tableSearchFields.phoneNumber
        sAjax({
          url: '/api/student/manage/getExportFileName',
          dataType: 'json',
          data: Object.assign({ exportFieldVO: fields }, this.definedSearch),
          type: 'post',
          success: function (data) {
            if (data.state) {
              let triggerDelay = 100
              let removeDelay = 1000
              let downloadUrls = []
              downloadUrls.push(`/downloads/student/manage/downloadExportFile?fileName=${data.data.fileName}`)
              if (data.data.haveImage) {
                downloadUrls.push(`/downloads/student/manage/downloadImageZipFile?key=${data.data.key}`)
              }
              downloadUrls.forEach((item, index) => {
                that._createIFrame(item, index * triggerDelay, removeDelay)
              })
              that.showExport = false
            } else {
              that.$toast(data.message)
            }
            that.exporting = false
          }
        }).always(() => {
          this.$waiting.close()
        })
      },
      _createIFrame: function (url, triggerDelay, removeDelay) {
        setTimeout(function () {
          var frame = $('<iframe style="display: none;" class="multi-download"></iframe>')
          frame.attr('src', url)
          $(document.body).after(frame)
          // setTimeout(function () {
          //   frame.remove()
          // }, removeDelay)
        }, triggerDelay)
      },
      // collegeOptionsSelected: function (obj) {
      //   if (obj.val === '-1') {
      //     this.definedSearch.college = ''
      //   } else {
      //     this.definedSearch.college = obj.val
      //   }
      // },
      // studentTypeOptionsSelected: function (obj) {
      //   if (obj.val === '-1') {
      //     this.definedSearch.studentType = ''
      //   } else {
      //     this.definedSearch.studentType = obj.val
      //   }
      // },
      // gradeOptionsSelected: function (obj) {
      //   if (obj.val === '-1') {
      //     this.definedSearch.grade = ''
      //   } else {
      //     this.definedSearch.grade = obj.val
      //   }
      // }
    }
  }
</script>
<style lang="less">
@import url("../../assets/common.less");

.info-set-container {
  height: 100%;
}
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
    padding-left: 20px;
    font-size: 14px;
    margin-bottom: 20px;
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

  .category .category-title {
    cursor: pointer;
    font-size: 14px;
    margin-bottom: 20px;
  }

  .category .category-title .expand-handler {
    float: right;
  }

  .category .category-table {
    margin-bottom: 20px;
  }
}
</style>
