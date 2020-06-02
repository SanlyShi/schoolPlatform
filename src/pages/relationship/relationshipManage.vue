<template>
  <div :id="pageId" class="relationship-page container-fluid" v-if="isParentPage">
    <div class="row text-center">
      <v-table ref="studentTable" :title="tableCheckedList.length > 0 ? '':translate.tableName" :method="method" :url="url" pagesize="10" idField="id" :columns="columns" :multiple="true" :order="true" :searchParams="definedSearch" :search="true" @afterChecked="_tableChecked">
        <div slot="btn-group" role="group">
          <div class="btn-group pull-left">
            <div class="batch-options" v-if="tableCheckedList.length > 0">
              <span class="pull-left">已选择{{tableCheckedList.length}}项，其中可操作的有{{tableCheckedList.length}}项</span>
              <div class="pull-left">
                <button type="button" style="margin-left:10px;" class="btn btn-bgColor-style clearBtnBorder resetBtn" @click="selcetOptStyle('reset')">{{translate.reset}}{{(role=='school'||role=='college')?translate.instructor:'导师'}}<span>{{(role=='school'||role=='college')?translate.resetHoverText:'勾选学生后点击<重置>可将导师置为空'}}</span></button>
                <button type="button" class="btn btn-bgColor-style clearBtnBorder" @click="selcetOptStyle('set')">{{translate.set}}{{(role=='school'||role=='college')?translate.instructor:'导师'}}</button>
              </div>
            </div>
          </div>
          <div class="btn-group pull-right">
            <button type="button" class="btn btn-bgColor-style clearBtnBorder" v-if='role == "school" || role == "college"' @click="showSearch()">{{translate.advancedSearch}}</button>
            <button type="button" class="btn btn-bgColor-style clearBtnBorder" @click="batchTransfer()">{{translate.batch}}{{translate.transfer}}</button>
            <button type="button" class="btn btn-bgColor-style clearBtnBorder" @click="batchSet()">{{translate.batch}}{{translate.set}}</button>
            <button type="button" class="btn btn-bgColor-style clearBtnBorder" @click="exportTable()">{{translate.export}}</button>
          </div>
        </div>
        <div slot="table-search">
          <div class="input-group search-group pull-left col-md-3 col-md-offset-1">
            <span class="input-group-addon search-name" id="basic-relationship-isSet">{{translate.isSet}}</span>
            <v-select class="btn-block search-select" :value="defaultOptions" :options="isSetOptions" options-value="id" options-label="text" @afterSelected="isSetOptionsSelected" search></v-select>
          </div>
        </div>
      </v-table>
    </div>

    <!-- 模态框（Modal） -->
    <v-modal :show="showAdvancedSearchModal" effect="fade" width="580">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          {{translate.advancedSearch}}
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="form-group" v-for="(col,k) in newSearchArray" :key="k">
          <label class="add-search-text">{{col.searchOptionsText}}</label>
          <label class="add-search-text">{{col.requirementOptionsText}}</label>
          <label class="inputText">{{col.inputText}}</label>
          <label class="add-search-text">{{col.relationOptionsText}}</label>
          <button type="button" class="btn deleteBtn clearBtnBorder" @click="deleteSearch(k)">{{translate.delete}}</button>
        </div>
        <div class="form-group advancedSearch-group" v-if="showAdvancedSearchModal">
          <v-select :options="searchOptions" :value="searchDefaultOptions" optionsLabel="name" optionsValue="id" :search="true" @afterSelected="searchOptionsSelected"></v-select>
          <v-select :options="requirementOptions" :value="reqDefaultOptions" optionsLabel="name" optionsValue="id" :search="true" @afterSelected="requirementSelected"></v-select>
          <v-select :options="valueOptions" v-if="isSelect" :value="valueDefaultOptions" optionsLabel="text" optionsValue="id" :search="true" @afterSelected="valueSelected"></v-select>
          <input type="text" class="value-input" v-else v-model="advancedSearch.inputText">
          <v-select :options="relationOptions" :value="relationDefaultOptions" optionsLabel="name" optionsValue="id" :search="true" @afterSelected="relationSelected"></v-select>
          <button type="button" class="btn addBtn clearBtnBorder" @click="addSearchOptions()">{{translate.addNew}}</button>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="clearSet();showAdvancedSearchModal = false">{{translate.cancel}}</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="clearSet()">清空</button>
        <button type="button" class="btn submit-btn clearBtnBorder"  @click="submitSet(isDisabled.advancedSearch)">{{translate.search}}</button>
      </div>
    </v-modal>
    <v-modal :show="showAddTypeModal" effect="fade" width="400">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">设置{{(role=='school'||role=='college')?translate.instructor:'导师'}}类型</h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="info-item">
          <div class="info-options">
            <span class v-for="(opt, i) in addTypeData" :key="i" @click="_selectAddType(opt)">
              <i class="maticon" :class="addType === opt.value?'active':''" v-html="icons(addType === opt.value?'radio_button_checked':'radio_button_unchecked')"></i>
              {{opt.label}}
            </span>
          </div>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showAddTypeModal = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="_sumbitTypeModal">确定</button>
      </div>
    </v-modal>
    <v-modal :show="showSetInstructorModal" effect="fade" width="460">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          {{translate.set}}专职{{translate.instructor}}
        </h5>
      </div>
      <div slot="modal-body" class="modal-body" style="overflow:visible">
        <div class="instructor-text text-center">{{setInstructorText}}</div>
        <div class="form-group">
          <label>{{translate.teacherAndStudentId}}</label>
          <detect v-if="showSetInstructorModal" style="display:inline-block;vertical-align: middle;margin-left: 18px;" ref="searchVal"  url="/api/relClass/getUserSimpleInfo"  keyword="nameOrNo" :placeholder="请输入学工号或者姓名" @afterSelected="afterSelectAddPersonZhuan"></detect>
          <!-- <input type="text" class="form-control search-input modal-input" v-model="NewRelationship.instructorId">
          <button type="button" class="btn check-btn clearBtnBorder" @click="checkInstructor">{{translate.check}}</button> -->
        </div>
        <!-- <div class="check-result" :style="{color: redColor}">{{errorMessage.setInstructor}}</div> -->
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showSetInstructorModal = false">{{translate.cancel}}</button>
        <button type="button" class="btn submit-btn clearBtnBorder"  @click="setSingInstructor()">{{translate.submit}}</button>
      </div>
    </v-modal>
    <!-- //设置导师 -->
    <v-modal :show="showSetTutorModal" effect="fade" width="500">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          {{translate.set}}{{(role=='school'||role=='college')?translate.instructor:'导师'}}
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="instructor-text text-center">{{setInstructorText}}</div>
        <div class="form-group">
          <label>员工号</label>
          <input type="text" class="form-control search-input modal-input" v-model="NewRelationship.instructorId">
          <button type="button" class="btn check-btn clearBtnBorder" @click="checkTutor">{{translate.check}}</button>
        </div>
        <div class="check-result" :style="{color: redColor}">{{errorMessage.setInstructor}}</div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showSetTutorModal = false">{{translate.cancel}}</button>
        <button type="button" class="btn submit-btn clearBtnBorder" :class="{disabled: isDisabled.setInstructor}" @click="setSingInstructor(isDisabled.setInstructor)">{{translate.submit}}</button>
      </div>
    </v-modal>
    <v-modal :show="showPluralismModal" effect="fade" width="460">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          {{translate.set}}兼职{{translate.instructor}}
        </h5>
      </div>
      <div slot="modal-body" class="modal-body" style="overflow:visible">
        <div class="instructor-text text-center">{{setInstructorText}}</div>
        <div class="form-group">
          <label>{{translate.teacherAndStudentId}}</label>
           <detect v-if="showPluralismModal" style="display:inline-block;vertical-align: middle;margin-left: 18px;" ref="searchVal"  url="/api/relClass/getUserSimpleInfo" keyword="nameOrNo"  :placeholder="请输入学工号或者姓名" @afterSelected="afterSelectAddPersonJian"></detect>
          <!-- <input type="text" class="form-control search-input modal-input" v-model="NewRelationship.instructorId">
          <button type="button" class="btn check-btn clearBtnBorder" @click="checkInstructor">{{translate.check}}</button> -->
        </div>
        <!-- <div class="check-result" :style="{color: redColor}">{{errorMessage.setInstructor}}</div> -->
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showPluralismModal = false">{{translate.cancel}}</button>
        <button type="button" class="btn submit-btn clearBtnBorder"  @click="setPluralismInstructor()">{{translate.submit}}</button>
      </div>
    </v-modal>
    <v-modal :show="showBatchTransferModal" effect="fade" width="450">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          {{translate.instructorBatchSet}}
        </h5>
      </div>
      <div slot="modal-body" class="modal-body" style="overflow:visible">
        <div class="transferOut">
          <div class="modal-text text-center">{{translate.transferOutText}}</div>
          <div class="form-group">
            <label>{{translate.teacherAndStudentId}}</label>
            <detect v-if="showBatchTransferModal" style="display:inline-block;vertical-align: middle;margin-left: 18px;" ref="searchVal"   url="/api/relClass/getUserSimpleInfo" keyword="nameOrNo" :placeholder="请输入学号或者姓名" @afterSelected="afterSelectAddPersonOut"></detect>
            <!-- <input type="text" class="form-control modal-input search-input" v-model="NewRelationship.outInstructor">
            <button type="button" class="btn check-btn clearBtnBorder" @click="checkOutInstructor">{{translate.check}}</button> -->
          </div>
          <!-- <div class="check-result" :style="{color: transferOutColor}">{{errorMessage.outInstructor}}</div> -->
        </div>
        <div class="transferIn">
          <div class="modal-text text-center">{{translate.transferInText}}</div>
          <div class="form-group">
            <label>{{translate.teacherAndStudentId}}</label>
             <detect v-if="showBatchTransferModal" style="display:inline-block;vertical-align: middle;margin-left: 18px;" ref="searchVal"   url="/api/relClass/getUserSimpleInfo" keyword="nameOrNo" :placeholder="请输入学号或者姓名" @afterSelected="afterSelectAddPersonIn"></detect>
            <!-- <input type="text" class="form-control modal-input search-input" v-model="NewRelationship.inInstructor">
            <button type="button" class="btn check-btn clearBtnBorder" @click="checkInInstructor">{{translate.check}}</button> -->
          </div>
          <!-- <div class="check-result" :style="{color: transferInColor}">{{errorMessage.inInstructor}}</div> -->
        </div>
        <div class="transfer-text text-center">{{translate.transferText}}</div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showBatchTransferModal = false">{{translate.cancel}}</button>
        <button type="button" class="btn submit-btn clearBtnBorder"  @click="submitTransfer()">{{translate.submit}}</button>
      </div>
    </v-modal>
    <!-- //导师批量转移 -->
    <v-modal :show="showTutoeBatchTransferModal" effect="fade" width="450">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          {{(role=='school'||role=='college')?translate.instructor:'导师'}}带生关系批量设置
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="transferOut">
          <div class="modal-text text-center">转出的{{(role=='school'||role=='college')?translate.instructor:'导师'}}员工号</div>
          <div class="form-group">
            <label>员工号</label>
            <input type="text" class="form-control modal-input search-input" v-model="NewRelationship.outInstructor">
            <button type="button" class="btn check-btn clearBtnBorder" @click="checkOutTutor">{{translate.check}}</button>
          </div>
          <div class="check-result" :style="{color: transferOutColor}">{{errorMessage.outInstructor}}</div>
        </div>
        <div class="transferIn">
          <div class="modal-text text-center">转入的{{(role=='school'||role=='college')?translate.instructor:'导师'}}员工号</div>
          <div class="form-group">
            <label>员工号</label>
            <input type="text" class="form-control modal-input search-input" v-model="NewRelationship.inInstructor">
            <button type="button" class="btn check-btn clearBtnBorder" @click="checkInTutor">{{translate.check}}</button>
          </div>
          <div class="check-result" :style="{color: transferInColor}">{{errorMessage.inInstructor}}</div>
        </div>
        <div class="transfer-text text-center">设置成功后转出{{(role=='school'||role=='college')?translate.instructor:'导师'}}分管的所有学生将全部转至转入{{(role=='school'||role=='college')?translate.instructor:'导师'}}下</div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showTutoeBatchTransferModal = false">{{translate.cancel}}</button>
        <button type="button" class="btn submit-btn clearBtnBorder" :class="{disabled: isDisabled.batchTransfer}" @click="submitTransfer(isDisabled.batchTransfer)">{{translate.submit}}</button>
      </div>
    </v-modal>
  </div>
  <v-import v-bind="importParams" :checkTemplateUrl="checkTemplateUrl" @backParentPage="backParentPage" v-else></v-import>
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
    if (translation(la)) {
      this.lang = la
    }
    if (this.role === 'college') {
      this.definedSearch.isCollege = true
    } else if (this.role === 'school') {
      this.definedSearch.isCollege = false
    }
    else if (this.role === 'collegeInstructor') {
      this.definedSearch.queryType = 1
      this.url = '/table-data/tutor/getStudentAndTutor'
    }
    else if (this.role === 'schoolInstructor') {
      this.definedSearch.queryType = 0
      // console.log(this.definedSearch)
      this.url = '/table-data/tutor/getStudentAndTutor'
    }
    sAjax({
      url: '/api/relationship/getAdvancedSearchOptions',
      dataType: 'json',
      type: 'get',
      success: (result) => {
        var data = result.data
        if (result.state) {
          this.newSearchData = data
          var typesData = data['studentId']['types']
          var optionsData = data['studentId']['options']
          var newDic = null
          for (var k in optionsData) {
            newDic = {}
            newDic.id = k
            newDic.name = optionsData[k]
            this.requirementOptions.push(newDic)
          }
          for (var f in typesData) {
            newDic = {}
            newDic.id = f
            newDic.name = typesData[f]
            this.relationOptions.push(newDic)
          }
          for (var c in data) {
            for (var i in data[c]) {
              var dic = {}
              if (i === 'key') {
                dic.id = data[c][i]
                dic.name = data[c]['keyName']
                this.searchOptions.push(dic)
              }
            }
          }
          if (data['studentId']['dicts']) {
            this.valueOptions = data['studentId']['dicts']
          }
        }
      }
    })
    sAjax({
      url: `/api/relationship/getSelectOptions?isCollege=${this.definedSearch.isCollege}`,
      dataType: 'json',
      type: 'get',
      success: (result) => {
        var data = result.data
        if (result.state) {
          // this.collegeOptions = data['colleges'] || []
          data['colleges'].forEach((ele) => {
            this.collegeOptions.push(ele)
          })
          data['departments'].forEach((ele) => {
            this.departmentOptions.push(ele)
          })
          data['grades'].forEach((ele) => {
            this.gradeOptions.push(ele)
          })
          data['isDistributions'].forEach((ele) => {
            this.isSetOptions.push(ele)
          })
          data['instructors'].forEach((ele) => {
            this.instructorOptions.push(ele)
          })
          // this.departmentOptions = data['departments'] || []
          // this.gradeOptions = data['grades'] || []
          // this.isSetOptions = data['isDistributions'] || []
          // this.instructorOptions = data['instructors'] || []
        }
      }
    })
    //  导师分流下拉框获取
    let type
    if (this.role == 'collegeInstructor') {
      type = 1
    }
    else if (this.role == 'schoolInstructor') {
      type = 0
    }
    if (type == 0 || type == 1) {
      sAjax({
        url: `/api/tutor/getSelectOptions?selectType=${type}`,
        dataType: 'json',
        type: 'get',
        success: (result) => {
          var data = result.data
          if (result.state) {
            // this.collegeOptions = data['colleges'] || []
            data['colleges'].forEach((ele) => {
              this.collegeTutorOptions.push(ele)
            })
            if (data['departments']) {
              data['departments'].forEach((ele) => {
                this.departmentTutorOptions.push(ele)
              })
            }
            data['grades'].forEach((ele) => {
              this.gradeTutorOptions.push(ele)
            })
            data['tutor'].forEach((ele) => {
              this.tutorOptions.push(ele)
            })
            data['educationLevel'].forEach((ele) => {
              this.educationLevelTutorOptions.push(ele)
            })
            // this.departmentOptions = data['departments'] || []
            // this.gradeOptions = data['grades'] || []
            // this.isSetOptions = data['isDistributions'] || []
            // this.instructorOptions = data['instructors'] || []
          }
        }
      })
    }

    sAjax({
      url: '/api/system/dicts?dictType=培养层次',
      dataType: 'json',
      type: 'get',
      async: false,
      success: (result) => {
        if (result.state) {
          this.educationLevelOptions = result.data || []
        }
      }
    })
    sAjax({
      url: '/api/system/dicts?dictType=专业',
      dataType: 'json',
      type: 'get',
      async: false,
      success: (result) => {
        if (result.state) {
          this.majorOptions = result.data || []
        }
      }
    })
    this._initColumns()
    if (this.role == 'school' || this.role == 'college') {
      sAjax({
        url: '/api/relationship/getTempleteFileName/relStudent',
        dataType: 'json',
        type: 'get',
        success: (result) => {
          if (result.state) {
            this.importParams.templateName = result.data
          }
        }
      })
      this.importParams.parentPageTitle = this.translate.tableName

      this.importParams.importBtnType = [{
        name: this.translate.overriteImport,
        url: '/relationship/setStudentsInstructor',
        method: 'post',
        isShowBtn: true,
        success: (data) => {
          if (data.state && (this.role == 'colloge' || this.role == 'school')) {
            this.url = '/table-data/relationship/relationStudents?timestamp=' + new Date().getTime()
          }
        }
      }]
    }
    else {
      //  console.log("进入导师下载模板")
      this.importParams.templateName = `${(this.role == 'school' || this.role == 'college') ? this.translate.instructor : '导师'}带生关系模板.xlsx`
      this.importParams.downloadTemplateUrl = "/tutor/excelDownload"
      this.importParams.downloadErrorTemplateUrl = "/tutor/excelInput/error"
      this.importParams.parentPageTitle = this.translate.tableName
      this.importParams.importBtnType = [{
        name: this.translate.overriteImport,
        url: '/tutor/inputExcelIfsuccess',
        method: 'post',
        isShowBtn: true,
        success: (data) => {
          if (data.state && (this.role == 'collegeInstructor' || this.role == 'schoolInstructor')) {
            this.url = this.url + '?timestamp=' + new Date().getTime()
          }
        }
      }]
    }
  },
  data: function () {
    return {
      showSetTutorModal: false,
      collegeTutorOptions: [],
      departmentTutorOptions: [],
      gradeTutorOptions: [],
      tutorOptions: [],
      educationLevelTutorOptions: [],
      columns: [],
      url: '/table-data/relationship/relationStudents',
      importBtnType: [],
      importParams: {
        parentPageTitle: '',
        downloadTemplateUrl: '/relationship/downloadTemplete',
        downloadErrorTemplateUrl: '/relationship/downloadErrorExcel',
        templateName: '',
        importBtnType: null
      },
      showSetInstructorModal: false,
      showBatchTransferModal: false,
      showTutoeBatchTransferModal: false,
      showAdvancedSearchModal: false,
      isDisabled: {
        setInstructor: true,
        batchTransfer: true,
        advancedSearch: false,
      },
      NewRelationship: {},
      definedSearch: {
        searchDTOS: [],
        studentId: '',
        studentName: '',
        college: '',
        department: '',
        major: '',
        educationLevel: '',
        grade: '',
        isDistribution: '',
        instructorNo: '',
        isCollege: true,
        queryType: 0,
        isAdvancedSearch: false
      },
      isAdvancedSearch: false,
      method: 'get',
      instructorOptions: [],
      gradeOptions: [],
      educationLevelOptions: [],
      departmentOptions: [],
      isSetOptions: [],
      collegeOptions: [],
      majorOptions: [],
      searchOptions: [],
      relationOptions: [],
      requirementOptions: [],
      valueOptions: [],
      defaultOptions: '-1',
      searchDefaultOptions: 'studentId',
      reqDefaultOptions: 'eq',
      relationDefaultOptions: 'and',
      valueDefaultOptions: '',
      selectedList: [],
      setInstructorText: '',
      errorMessage: {
        setInstructor: '',
        inInstructor: '',
        outInstructor: ''
      },
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
      advancedSearch: {
        inputText: ''
      },
      newSearchData: [],
      searchParameters: {
        key: 'studentId',
        relation: 'eq',
        value: '',
        tableName: '',
        type: 'and'
      },
      searchDots: [],
      isExist: {
        outInstructor: false,
        inInstructor: false
      },
      isSelect: false,
      isClearArray: true,
      isClearSearchData: false,
      tableCheckedList: [],
      isParentPage: true,
      redColor: '',
      transferOutColor: '',
      transferInColor: '',
      showAddTypeModal: false,
      showPluralismModal: false,
      addType: '',
      curInstructorOpt: '',
      lang: 'zh-cn'
    }
  },
  computed: {
    translate: function () {
      return translation(this.lang).relationshipManage
    },
    addTypeData() {
      let instructor = (this.role == 'school' || this.role == 'college') ? '辅导员' : '导师'
      return [{ value: 'soleDuty', label: `专职${instructor}` }, { value: 'pluralism', label: `兼职${instructor}` }]
    },
    checkTemplateUrl: function () {
      if (this.role == "school" || this.role == "college") {
        return `/relationship/uploadExcel/${this.definedSearch.isCollege}`
      }
      else {
        return `/tutor/check/${this.definedSearch.isCollege}`
      }

    },
    pageId: function () {
      return `relationship-page-${this.role}`
    }
  },
  methods: {
    afterSelectAddPersonZhuan(o){
      this.instructorId.single = o.userId
    },
    afterSelectAddPersonOut(o){
      this.instructorId.transferOut = o.userId
    },
    afterSelectAddPersonIn(o){
      this.instructorId.transferIn = o.userId
    },
    afterSelectAddPersonJian(o){
      this.instructorId.single = o.userId
    },
    getMajorByCollege(code) {
      if (code[0] !== "") {
        sAjax({
          url: '/api/system/major/getMajorByCollegeCodeS',
          dataType: 'json',
          type: 'get',
          data: {collegeCodeS:code},
          async: false,
          success: (result) => {
            if (result.state) {
              this.columns[4].search.data.options = result.data || []
            }
          }
        })
      } else {
        this.columns[4].search.data.options = this.majorOptions
      }
    },
    _tableChecked: function (recordArr) {
      this.tableCheckedList = recordArr
    },
    _initColumns: function () {
      if (this.role == 'school' || this.role == 'college') {
        this.columns = [
          {
            id: 'studentId',
            title: this.translate.studentId,
            className: 'text-left',
            hidden: false,
            width: 120,
            search: {
              type: 'input',
              data: {
                autoFocus: true,
                placeholder: this.translate.studentIdPlaceholder
              }
            }
          },
          {
            id: 'studentName',
            title: this.translate.name,
            className: 'text-left',
            hidden: false,
            width: 120,
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
            title: this.translate.college,
            className: 'text-left',
            hidden: false,
            width: 120,
            search: {
              type: 'multiSelect',
              data: {
                options: this.collegeOptions,
                optionsLabel: 'text',
                optionsValue: 'id',
                change: (record) => {
                  this.getMajorByCollege(record.value.split(','))
                }
              }
            }
          },
          {
            id: 'department',
            title: this.translate.department,
            className: 'text-left',
            hidden: false,
            width: 120,
            search: {
              type: 'multiSelect',
              data: {
                options: this.departmentOptions,
                optionsLabel: 'text',
                optionsValue: 'id'
              }
            }
          },
          {
            id: 'major',
            title: this.translate.major,
            className: 'text-left',
            hidden: false,
            width: 120,
            search: {
              type: 'multiSelect',
              data: {
                options: this.majorOptions,
                optionsLabel: 'label',
                optionsValue: 'value'
              }
            }
          },
          {
            id: 'educationLevel',
            title: '培养层次',
            className: 'text-left',
            hidden: false,
            width: 120,
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
            id: 'grade',
            title: this.translate.grade,
            className: 'text-center',
            hidden: false,
            width: 120,
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
            id: 'instructorNo',
            title: '专职辅导员',
            className: 'text-left',
            hidden: false,
            width: 120,
            search: {
              type: 'multiSelect',
              data: {
                options: this.instructorOptions,
                optionsLabel: 'text',
                optionsValue: 'id'
              }
            },
            formatter: function (record, index) {
              return record.instructor
            }
          },
          {
            id: 'partTimeInstructor',
            title: '兼职辅导员',
            className: 'text-left',
            hidden: false,
            width: 120,
          },
          {
            id: 'classFullName',
            title: '班级',
            className: 'text-center',
            hidden: false,
            width: 120,
            search: {
              type: 'input',
              data: {
                placeholder: "班级"
              }
            }
          },
          {
            id: 'changeLog',
            title: this.translate.optRecord,
            className: 'text-left',
            hidden: false,
            width: 120,
          }]
      }
      else {
        this.columns = [
          {
            id: 'studentId',
            title: this.translate.studentId,
            className: 'text-left',
            hidden: false,
            width: 120,
            search: {
              type: 'input',
              data: {
                autoFocus: true,
                placeholder: this.translate.studentIdPlaceholder
              }
            }
          },
          {
            id: 'userName',
            title: this.translate.name,
            className: 'text-left',
            hidden: false,
            width: 120,
            search: {
              type: 'input',
              data: {
                placeholder: this.translate.namePlaceholder
              }
            },
            formatter: function (record, index) {
              return record.studentName
            }
          },
          {
            id: 'college',
            title: this.translate.college,
            className: 'text-left',
            hidden: false,
            width: 120,
            search: {
              type: 'multiSelect',
              data: {
                options: this.collegeTutorOptions,
                optionsLabel: 'text',
                optionsValue: 'id',
                change: (record) => {
                  this.getMajorByCollege(record.value.split(','))
                }
              }
            },
            formatter: function (record, index) {
              return record.collegeName
            }
          },
          {
            id: 'department',
            title: this.translate.department,
            className: 'text-left',
            hidden: false,
            width: 120,
            search: {
              type: 'multiSelect',
              data: {
                options: this.departmentTutorOptions,
                optionsLabel: 'text',
                optionsValue: 'id'
              }
            }
          },
          {
            id: 'major',
            title: this.translate.major,
            className: 'text-left',
            hidden: false,
            width: 120,
            search: {
              type: 'multiSelect',
              data: {
                options: this.majorOptions,
                optionsLabel: 'label',
                optionsValue: 'value'
              }
            }
          },
          {
            id: 'educationLever',
            title: '培养层次',
            className: 'text-left',
            hidden: false,
            width: 120,
            search: {
              type: 'multiSelect',
              data: {
                options: this.educationLevelTutorOptions,
                optionsLabel: 'text',
                optionsValue: 'id'
              }
            }
          },
          {
            id: 'grade',
            title: this.translate.grade,
            className: 'text-center',
            hidden: false,
            width: 120,
            search: {
              type: 'multiSelect',
              data: {
                options: this.gradeTutorOptions,
                optionsLabel: 'text',
                optionsValue: 'id'
              }
            }
          },
          {
            id: 'tutorId',
            title: '导师',
            className: 'text-left',
            hidden: false,
            width: 120,
            search: {
              type: 'multiSelect',
              data: {
                options: this.tutorOptions,
                optionsLabel: 'text',
                optionsValue: 'id'
              }
            },
            formatter: function (record, index) {
              return record.tutorName
            }
          }
        ]
      }
    },
    showSearch: function () {
      this.showAdvancedSearchModal = true
      // // this.searchDots = []
      // if (this.isClearSearchData) {
      //   this.searchDots.splice(0, this.searchDots.length)
      //   this.newSearchArray.splice(0, this.newSearchArray.length)
      // }
      // this.searchParameters = {
      //   key: 'studentId',
      //   relation: 'eq',
      //   value: '',
      //   type: 'and'
      // }
      // this.advancedSearch.inputText = ''
      // this.searchParameters.tableName = this.newSearchData['studentId']['tableName']
      // this.newSearchCondition = {
      //   searchOptionsText: '学号',
      //   requirementOptionsText: '等于',
      //   inputText: '',
      //   relationOptionsText: '并且'
      // }
      // this.isSelect = false
    },
    addSearchOptions: function () {
      if (this.isSelect === false) {
        this.newSearchCondition.inputText = this.advancedSearch.inputText
        this.searchParameters.value = this.advancedSearch.inputText
        this.advancedSearch.inputText = ""
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
    //高级搜索
    clearSet() {
      this.searchParameters = {
        key: '',
        relation: 'eq',
        value: '',
        tableName: '',
        type: 'and'
      }
      this.searchDots = []
      this.searchDefaultOptions = ''
      this.advancedSearch.inputText = ''
      this.valueDefaultOptions = ''
      this.newSearchArray = []
    },
    submitSet: function (isDisabled) {
      // if (isDisabled) {
      //   return false
      // }
      if (this.isSelect === false) {
        this.searchParameters.value = this.advancedSearch.inputText
      }
      this.definedSearch.studentId = this.$refs.studentTable.tableSearchFields.studentId
      this.definedSearch.studentName = this.$refs.studentTable.tableSearchFields.name
      this.definedSearch.college = this.$refs.studentTable.tableSearchFields.college
      this.definedSearch.educationLevel = this.$refs.studentTable.tableSearchFields.educationLevel
      this.definedSearch.grade = this.$refs.studentTable.tableSearchFields.grade
      this.definedSearch.department = this.$refs.studentTable.tableSearchFields.department
      this.definedSearch.instructorNo = this.$refs.studentTable.tableSearchFields.instructorNo
      this.definedSearch.major = this.$refs.studentTable.tableSearchFields.major
      if (this.searchParameters.key) {
        this.searchDots.push(this.searchParameters)
      }
      if(this.searchDots.length){
        this.definedSearch.isAdvancedSearch = true
        this.method = 'post'
         this.url = '/table-data/relationship/advancedSearch'
      }else{                                
        this.definedSearch.isAdvancedSearch = false
        this.method = 'get'
         this.url = '/table-data/relationship/relationStudents'
      }
      this.definedSearch.searchDTOS = JSON.parse(JSON.stringify(this.searchDots))
      this.searchDots = []
      
      this.showAdvancedSearchModal = false
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
        this.isDisabled.advancedSearch = true
      } else {
        this.isDisabled.advancedSearch = false
        this.newSearchCondition.searchOptionsText = obj.target.selected
        this.searchParameters.key = obj.val
        this.searchDefaultOptions = obj.value
        var newObj = this.newSearchData[obj.val]
        var newDic = null
        this.requirementOptions.splice(0, this.requirementOptions.length)
        this.relationOptions.splice(0, this.relationOptions.length)
        this.searchParameters.tableName = newObj['tableName']
        for (var k in newObj['options']) {
          newDic = {}
          newDic.id = k
          newDic.name = newObj['options'][k]
          this.requirementOptions.push(newDic)
        }
        for (var f in newObj['types']) {
          newDic = {}
          newDic.id = f
          newDic.name = newObj['types'][f]
          this.relationOptions.push(newDic)
        }
        this.isSelect = newObj['select']
        if (newObj['dicts']) {
          this.valueOptions = newObj['dicts']
          if (this.valueOptions) {
            this.valueDefaultOptions = this.valueOptions[0]['id']
            this.newSearchCondition.inputText = this.valueOptions[0]['text']
            this.searchParameters.value = this.valueOptions[0]['id']
          }
        }
      }

    },
    requirementSelected: function (obj) {
      if (!obj.target.selected) {
        this.isDisabled.advancedSearch = true
      } else {
        this.isDisabled.advancedSearch = false
        this.newSearchCondition.requirementOptionsText = obj.target.selected
        this.searchParameters.relation = obj.value
        this.reqDefaultOptions = obj.value
      }

    },
    relationSelected: function (obj) {
      if (!obj.target.selected) {
        this.isDisabled.advancedSearch = true
      } else {
        this.isDisabled.advancedSearch = false
        this.newSearchCondition.relationOptionsText = obj.target.selected
        this.searchParameters.type = obj.value
        this.relationDefaultOptions = obj.value
      }

    },
    valueSelected: function (obj) {
      if (!obj.target.selected) {
        this.isDisabled.advancedSearch = true
      } else {
        this.isDisabled.advancedSearch = false
        this.newSearchCondition.inputText = obj.target.selected
        this.searchParameters.value = obj.value
        this.valueDefaultOptions = obj.value
      }

    },
    reset: function () {
      // console.log(this.tableCheckedList)
      this.studentUserIds.splice(0, this.studentUserIds.length)
      if (this.role === 'college' || this.role === 'school') {
        this.tableCheckedList.forEach((item, index) => {
          this.studentUserIds.push(item.studentUserId)
        })
      }
      else {
        this.tableCheckedList.forEach((item, index) => {
          this.studentUserIds.push(item.userId)
        })
      }
      if (this.tableCheckedList.length === 0) {
        this.$toast(this.translate.notSelectedText)
      } else {
        var resetText = this.translate.selectedText + ' ' + this.tableCheckedList.length + ' ' + this.translate.namesStudent + ','
        var resetUrl = ''
        var resetMethod = ''
        if (this.addType === 'soleDuty') {
          if (this.role === 'college' || this.role === 'school') {
            resetText += '确定重置他们专职辅导员吗?'
          } else {
            resetText += '确定重置他们专职导师吗?'
          }

          resetUrl = '/api/relationship/reSetInstructorNo'
          resetMethod = 'post'
        } else {
          if (this.role === 'college' || this.role === 'school') {
            resetText += '确定重置他们兼职辅导员吗?'
          } else {
            resetText += '确定重置他们兼职导师吗?'
          }
          resetUrl = '/api/part-time/instructor/reset'
          resetMethod = 'post'
        }
        if (confirm(resetText)) {
          if (this.role == 'school' || this.role == 'college') {
            sAjax({
              url: resetUrl,
              dataType: 'json',
              data: {
                studentUserIds: this.studentUserIds
              },
              type: resetMethod,
              success: (data) => {
                if (data.state) {
                  this.url =
                    '/table-data/relationship/relationStudents?timestamp=' + new Date().getTime()
                  this.$toast(this.translate.submitSuccessTip)
                  this.studentUserIds.splice(0, this.studentUserIds.length)
                  this.tableCheckedList = []
                } else {
                  this.$toast(this.translate.submitFailedTip + ':' + data.message)
                }
              }
            })
          }
          //重置导师
          else {
            resetUrl = '/api/tutor/refresh'

            let arrNew = ''
            this.studentUserIds.forEach((item, index) => {
              if (index < this.studentUserIds.length - 1) {
                arrNew += (item + ",")
              }
              else {
                arrNew += item
              }
            })

            sAjax({
              url: resetUrl + '?userIds=' + arrNew,
              dataType: 'json',
              type: 'post',
              success: (data) => {
                if (data.state) {
                  this.url =
                    this.url + '?timestamp=' + new Date().getTime()
                  this.$toast(this.translate.submitSuccessTip)
                  this.studentUserIds.splice(0, this.studentUserIds.length)
                  this.tableCheckedList = []
                } else {
                  this.$toast(this.translate.submitFailedTip + ':' + data.message)
                }
              }
            })
          }

        }
      }
    },
    selcetOptStyle: function (type) {
      if (this.role == 'college' || this.role == 'school') {
        this.showAddTypeModal = true
        this.addType = ''
        this.curInstructorOpt = type
      }
      else {
        // this.showSetTutorModal = true
        // this.addType = ''
        // this.curInstructorOpt = type
        if (type === 'set') {
          this.errorMessage.setInstructor = ''
          this.NewRelationship.instructorId = ''
          this.isDisabled.setInstructor = true
          this.studentUserIds.splice(0, this.studentUserIds.length)
          // console.log(this.tableCheckedList)
          this.tableCheckedList.forEach((item, index) => {
            this.studentUserIds.push(item.userId)
          })
          // console.log(this.studentUserIds)
          if (this.tableCheckedList.length === 0) {
            this.setInstructorText = this.translate.notSelectedText
          } else {
            this.setInstructorText = this.translate.selectedText + ' ' + this.tableCheckedList.length + ' ' + this.translate.namesStudent + ',' + '请在下方输入导师员工号'
          }
          // if (this.addType === 'soleDuty') {
          this.showSetTutorModal = true
          // } else {
          //   this.showPluralismModal = true
          // }
        } else {
          this.reset()
        }
      }

    },
    checkInstructor: function () {
      if (!this.NewRelationship.instructorId) {
        this.redColor = 'red'
        this.errorMessage.setInstructor = this.translate.enterStudentId
        return false
      }
      sAjax({
        url: '/api/relationship/checkUserId/' + this.NewRelationship.instructorId,
        dataType: 'json',
        type: 'get',
        success: (data) => {
          if (data.state) {
            this.redColor = 'black'
            this.errorMessage.setInstructor = data.data.name + ' ' + data.data.id
            this.instructorId.single = data.data.userId
            if (this.tableCheckedList.length === 0) {
              this.isDisabled.setInstructor = true
            } else {
              this.isDisabled.setInstructor = false
            }
          } else {
            this.redColor = 'red'
            this.errorMessage.setInstructor = data.message
            this.isDisabled.setInstructor = true
          }
        }
      })
    },
    checkTutor() {
      if (!this.NewRelationship.instructorId) {
        this.redColor = 'red'
        this.errorMessage.setInstructor = this.translate.enterStudentId
        return false
      }
      sAjax({
        url: '/api/tutor/check?userNo=' + this.NewRelationship.instructorId,
        dataType: 'json',
        type: 'get',
        success: (data) => {
          if (data.state) {
            this.redColor = 'black'
            this.errorMessage.setInstructor = data.data.tutorName
            this.instructorId.single = data.data.userNo
            if (this.tableCheckedList.length === 0) {
              this.isDisabled.setInstructor = true
            } else {
              this.isDisabled.setInstructor = false
            }
          } else {
            this.redColor = 'red'
            this.errorMessage.setInstructor = data.message
            this.isDisabled.setInstructor = true
          }
        }
      })
    },
    _selectAddType: function (opt) {
      this.addType = opt.value
    },
    _sumbitTypeModal: function () {
      // console.log("提交时候的",this.studentUserIds)
      if (this.curInstructorOpt === 'set') {
        this.errorMessage.setInstructor = ''
        this.NewRelationship.instructorId = ''
        this.isDisabled.setInstructor = true
        this.studentUserIds.splice(0, this.studentUserIds.length)
        this.tableCheckedList.forEach((item, index) => {
          this.studentUserIds.push(item.studentUserId)
        })
        if (this.tableCheckedList.length === 0) {
          this.setInstructorText = this.translate.notSelectedText
        } else {
          this.setInstructorText = this.translate.selectedText + ' ' + this.tableCheckedList.length + ' ' + this.translate.namesStudent + ',' + this.translate.setSelectedText
        }
        if (this.addType === 'soleDuty') {
          this.showSetInstructorModal = true
          this.instructorId.single = ''
        } else {
          this.showPluralismModal = true
          this.instructorId.single = ''
        }
      } else {
        this.reset()
      }

      this.showAddTypeModal = false
    },
    setPluralismInstructor: function () {
      if (!this.instructorId.single) {
        this.$toast('请正确填写信息！')
        return false
      }
      sAjax({
        url: '/api/part-time/instructor',
        dataType: 'json',
        type: 'post',
        data: {
          studentUserIds: this.studentUserIds,
          teacherUserId: this.instructorId.single
        },
        success: (data) => {
          if (data.state) {
            this.url =
              '/table-data/relationship/relationStudents?timestamp=' + new Date().getTime()
            this.showPluralismModal = false
            this.studentUserIds.splice(0, this.studentUserIds.length)
            this.tableCheckedList = []
            this.$toast(this.translate.submitSuccessTip)
          } else {
            this.$toast(this.translate.submitFailedTip + ':' + data.message)
          }
        }
      })
    },
    setSingInstructor: function () {
      if (!this.instructorId.single) {
        this.$toast('请正确输入信息！')
        return false
      }
      if (this.role == 'school' || this.role == 'college') {
        sAjax({
          url: '/api/relationship/setInstructor',
          dataType: 'json',
          data: {
            studentUserIds: this.studentUserIds,
            teacherUserId: this.instructorId.single
          },
          type: 'post',
          success: (data) => {
            if (data.state) {
              this.url =
                '/table-data/relationship/relationStudents?timestamp=' + new Date().getTime()
              this.showSetTutorModal = false
              this.studentUserIds.splice(0, this.studentUserIds.length)
              this.tableCheckedList = []
              this.$toast(this.translate.submitSuccessTip)
              this.showSetInstructorModal = false
            } else {
              this.$toast(this.translate.submitFailedTip + ':' + data.message)
            }
          }
        })
      }
      //设置导师
      else {
        let arrNew = ''
        this.studentUserIds.forEach((item, index) => {
          if (index < this.studentUserIds.length - 1) {
            arrNew += (item + ",")
          }
          else {
            arrNew += item
          }
        })

        sAjax({
          url: `/api/tutor/tutorSetting?userIdList=${arrNew}&tutorNo=${this.instructorId.single}`,
          dataType: 'json',
          type: 'post',
          success: (data) => {
            if (data.state) {
              this.url =
                this.url + '?timestamp=' + new Date().getTime()
              this.showSetTutorModal = false
              this.studentUserIds.splice(0, this.studentUserIds.length)
              this.tableCheckedList = []
              this.$toast(this.translate.submitSuccessTip)
            } else {
              this.$toast(this.translate.submitFailedTip + ':' + data.message)
            }
          }
        })
      }
    },
    batchTransfer: function () {
      this.errorMessage.outInstructor = ''
      this.NewRelationship.outInstructor = ''
      this.errorMessage.inInstructor = ''
      this.NewRelationship.inInstructor = ''
      this.isDisabled.batchTransfer = true
      if (this.role == 'school' || this.role == 'college') {
        this.instructorId.transferIn = ''
        this.instructorId.transferOut = ''
        this.showBatchTransferModal = true
      }
      else {
        this.showTutoeBatchTransferModal = true
      }

    },
    batchSet: function () {
      this.isParentPage = false
    },
    backParentPage: function () {
      this.isParentPage = true
    },
    checkOutInstructor: function () {
      if (!this.NewRelationship.outInstructor) {
        this.transferOutColor = 'red'
        this.errorMessage.outInstructor = this.translate.enterStudentId
        return false
      }
      sAjax({
        url: '/api/relationship/checkUserIdAndCount/' + this.NewRelationship.outInstructor,
        dataType: 'json',
        type: 'get',
        success: (data) => {
          if (data.state) {
            this.transferOutColor = 'black'
            this.errorMessage.outInstructor = data.data.name + ' ' + data.data.id + ' ' + this.translate.transferResultText + data.data.count + this.translate.namesStudent
            this.instructorId.transferOut = data.data.userId
            this.isExist.outInstructor = true
            if (this.isExist.inInstructor) {
              this.isDisabled.batchTransfer = false
            }
          } else {
            this.transferOutColor = 'red'
            this.isExist.outInstructor = false
            this.errorMessage.outInstructor = data.message
            this.isDisabled.batchTransfer = true
          }
        }
      })
    },
    checkInInstructor: function () {
      if (!this.NewRelationship.inInstructor) {
        this.transferInColor = 'red'
        this.errorMessage.inInstructor = this.translate.enterStudentId
        return false
      }
      sAjax({
        url: '/api/relationship/checkUserIdAndCount/' + this.NewRelationship.inInstructor,
        dataType: 'json',
        type: 'get',
        success: (data) => {
          if (data.state) {
            this.transferInColor = 'black'
            this.errorMessage.inInstructor = data.data.name + ' ' + data.data.id + ' ' + this.translate.transferResultText + data.data.count + this.translate.namesStudent
            this.instructorId.transferIn = data.data.userId
            this.isExist.inInstructor = true
            if (this.isExist.outInstructor) {
              this.isDisabled.batchTransfer = false
            }
          } else {
            this.transferInColor = 'red'
            this.isExist.inInstructor = false
            this.errorMessage.inInstructor = data.message
            this.isDisabled.batchTransfer = true
          }
        }
      })
    },
    checkOutTutor: function () {
      if (!this.NewRelationship.outInstructor) {
        this.transferOutColor = 'red'
        this.errorMessage.outInstructor = this.translate.enterStudentId
        return false
      }
      sAjax({
        url: '/api/tutor/check?userNo=' + this.NewRelationship.outInstructor,
        dataType: 'json',
        type: 'get',
        success: (data) => {
          if (data.state) {
            this.transferOutColor = 'black'
            this.errorMessage.outInstructor = data.data.tutorName
            this.instructorId.transferOut = data.data.userNo
            this.isExist.outInstructor = true
            if (this.isExist.inInstructor) {
              this.isDisabled.batchTransfer = false
            }
          } else {
            this.transferOutColor = 'red'
            this.isExist.outInstructor = false
            this.errorMessage.outInstructor = data.message
            this.isDisabled.batchTransfer = true
          }
        }
      })
    },
    checkInTutor: function () {
      if (!this.NewRelationship.inInstructor) {
        this.transferInColor = 'red'
        this.errorMessage.inInstructor = this.translate.enterStudentId
        return false
      }
      sAjax({
        url: '/api/tutor/check?userNo=' + this.NewRelationship.inInstructor,
        dataType: 'json',
        type: 'get',
        success: (data) => {
          if (data.state) {
            this.transferInColor = 'black'
            this.errorMessage.inInstructor = data.data.tutorName
            this.instructorId.transferIn = data.data.userNo
            this.isExist.inInstructor = true
            if (this.isExist.outInstructor) {
              this.isDisabled.batchTransfer = false
            }
          } else {
            this.transferInColor = 'red'
            this.isExist.inInstructor = false
            this.errorMessage.inInstructor = data.message
            this.isDisabled.batchTransfer = true
          }
        }
      })
    },
    submitTransfer: function () {
      if (!this.instructorId.transferIn || !this.instructorId.transferOut) {
        this.$toast('请正确填写转移信息！')
        return false
      }
      if (this.role == 'college' || this.role == 'school') {
        sAjax({
          url: '/api/relationship/changeInstructorToAnotherOne',
          dataType: 'json',
          data: {
            oldInstructorNo: this.instructorId.transferOut,
            newInstructorNo: this.instructorId.transferIn
          },
          type: 'post',
          success: (data) => {
            if (data.state) {
              this.url =
                '/table-data/relationship/relationStudents?timestamp=' + new Date().getTime()
              this.showBatchTransferModal = false
              this.$toast(this.translate.submitSuccessTip)
            } else {
              this.$toast(this.translate.submitFailedTip + ':' + data.message)
            }
          }
        })
      }
      else {
        sAjax({
          url: '/api/tutor/tutorBySetting?tutorNo=' + this.instructorId.transferOut + '&tutorNoCopy=' + this.instructorId.transferIn,
          dataType: 'json',
          type: 'post',
          success: (data) => {
            if (data.state) {
              this.url =
                this.url + '?timestamp=' + new Date().getTime()
              this.showTutoeBatchTransferModal = false
              this.$toast(this.translate.submitSuccessTip)
            } else {
              this.$toast(this.translate.submitFailedTip + ':' + data.message)
            }
          }
        })
      }
    },
    exportTable: function () {
      console.error(this.role)
      if (this.role == "school" || this.role == "college") {
        this.$waiting.show()
        this.definedSearch.studentId = this.$refs.studentTable.tableSearchFields.studentId
        this.definedSearch.studentName = this.$refs.studentTable.tableSearchFields.name
        this.definedSearch.college = this.$refs.studentTable.tableSearchFields.college
        this.definedSearch.educationLevel = this.$refs.studentTable.tableSearchFields.educationLevel
        this.definedSearch.grade = this.$refs.studentTable.tableSearchFields.grade
        this.definedSearch.department = this.$refs.studentTable.tableSearchFields.department
        this.definedSearch.instructorNo = this.$refs.studentTable.tableSearchFields.instructorNo
        this.definedSearch.major = this.$refs.studentTable.tableSearchFields.major
        console.log(this.$refs.studentTable.tableSearchFields)
        let strObj = {}
        strObj.studentId = this.definedSearch.studentId
        strObj.studentName = this.definedSearch.studentName
        strObj.isCollege = this.definedSearch.isCollege
        strObj.isAdvancedSearch = this.definedSearch.isAdvancedSearch
        strObj.searchDTOS = this.definedSearch.searchDTOS
        sAjax({
          url: '/api/relationship/downloadRelationshipStudents' + "?college=" + this.definedSearch.college + "&department="
            + this.definedSearch.department + "&educationLevel=" + this.definedSearch.educationLevel + "&grade="
            + this.definedSearch.grade + "&instructorNo=" + this.definedSearch.instructorNo + "&major=" + this.definedSearch.major,
          dataType: 'json',
          data: strObj,
          type: 'post',
          success: (data) => {
            if (data.state) {
              window.location.href = '/downloads/relationship/downloadExportFile?fileName=' + data.data
            } else {
              this.$toast(data.message)
            }
          }
        }).always(() => {
          this.$waiting.close()
        })
      }
      else if (this.role == "collegeInstructor") {
        window.location.href = "/downloads/tutor/downLoadStudentByCollege?fileName=全院研究生信息&pageIndex=1&pageSize=50000"
      }
      else if (this.role == "schoolInstructor") {
        window.location.href = "/downloads/tutor/downLoadStudent?fileName=全校研究生信息&pageIndex=1&pageSize=50000"
      }
    },
    isSetOptionsSelected: function (obj) {
      if (obj.val === '-1') {
        this.definedSearch.isDistribution = ''
      } else {
        this.definedSearch.isDistribution = obj.val
      }
    }
  }
}
</script>
<style lang="less">
@import url("../../assets/common.less");

.relationship-page {
  .resetBtn {
    position: relative;
    z-index: 2;
  }
  .resetBtn:hover {
    z-index: 3;
    background: none;
  }
  .resetBtn span {
    display: none;
  }
  .resetBtn:hover span {
    display: block;
    position: absolute;
    top: -30px;
    left: 9px;
    font-size: 13px;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.12), 0 4px 4px 0 rgba(0, 0, 0, 0.12);
    border-radius: 5px;
    background: #ffffff;
    padding: 5px 10px;
    color: black;
  }
  .modal-input {
    width: 220px;
    display: inline-block;
    margin-left: 18px;
  }
  .instructor-text {
    margin-bottom: 20px;
  }
  .modal-text {
    margin: 0 0 10px -35px;
  }
  .check-result {
    margin-left: 63px;
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
  .add-search-text {
    text-align: center;
    padding: 6px 10px;
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
    margin-left: 10px;
    padding: 3px 12px;
  }
  .addBtn {
    color: white;
    background: #298df7;
    border-radius: 100px;
    margin-left: 10px;
    padding: 3px 12px;
  }
  .batch-options {
    width: 500px;
    transition: all 0.1s ease;
    span {
      line-height: 32px;
    }
    &.active {
      top: 0;
    }
  }
  .info-item {
    margin-top: 12px;
    overflow: hidden;
    .item-title {
      display: block;
      float: left;
      width: 57px;
      margin-right: 10px;
      font-size: 14px;
      font-weight: bold;
      color: #151515;
      letter-spacing: 0;
      text-align: right;
      line-height: 24px;
    }
    .info-options {
      display: inline-block;
      &.disabled-click {
        span {
          cursor: not-allowed;
        }
      }
      span {
        display: inline-block;
        margin-left: 1px;
        margin-right: 20px;
        margin-bottom: 17px;
        font-size: 14px;
        color: #555555;
        letter-spacing: 0.6px;
        text-align: left;
        line-height: 24px;
        cursor: pointer;
        i {
          float: left;
          margin-right: 2px;
          font-size: 22px;
          color: #d9d9d9;
          &.active {
            color: #298df7;
          }
        }
      }
    }
  }
}
</style>
