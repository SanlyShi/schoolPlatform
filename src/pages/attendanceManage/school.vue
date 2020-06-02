<template>
  <div v-if="curRoute === 'allStaff'" class="container-fluid">
    <div class="row text-center">
      <v-table :url="tableUrl" pagesize="10" :search="false" idField="id" :order="true" :columns="columns">
        <div slot="btn-group" role="group">
          <div class="btn-group pull-left">
            <v-select v-model="yearValue" :options="yearOptions" required='true' optionsLabel="label" optionsValue="value" @afterSelected="changeYear"></v-select>
            <v-select v-model="curbatchId" :options="termsOptions" required='true' style="margin-left:15px;" optionsLabel="label" optionsValue="value" @afterSelected="changeTerm"></v-select>
          </div>
          <div class="btn-group pull-right" v-if="!isAgent">
            <button type="button" class="btn btn-bgColor-style clearBtnBorder" @click="showAddModal=true">新建考勤课程</button>
            <button type="button" @click="batchAddPerson" class="btn btn-bgColor-style clearBtnBorder">批量导入人员名单</button>
          </div>
        </div>
      </v-table>
    </div>

    <!-- 模态框（Modal） -->
    <v-modal :show="showAddModal" effect="fade" width="420">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          新增考勤课程
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <button type="button" class="btn submit-btn clearBtnBorder" @click="addCourse()" style="width:380px;text-align:center">单条增加</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="batchAddCourse()" style="width:380px;text-align:center;margin-top:20px;">批量导入</button>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showAddModal = false">取消</button>
        <!-- <button type="button" class="btn submit-btn clearBtnBorder">保存</button> -->
      </div>
    </v-modal>
    <v-modal :show="showAddOrEditModal" effect="fade" width="420">
      <div slot="modal-header" class="modal-header">
        <h5 v-if="!isEdit" class="modal-title">
          新增
        </h5>
        <h5 v-else class="modal-title">
          编辑
        </h5>
      </div>
      <div slot="modal-body" class="modal-body form-wrap">
        <div class="form-group box_flex align_center">
          <div class="label require"><span>考勤课程:</span></div>
          <input type="text" class="form-control search-input" v-model="addParams['courseName']">
        </div>
        <div class="form-group box_flex align_center">
          <div class="label require"><span>课程类别:</span></div>
          <v-select :options="coursesTypeList" options-value="value" options-label="label" close-on-select justify v-model="addParams['courseType']"></v-select>
        </div>
        <div class="form-group box_flex align_center">
          <div class="label require"><span>任课教师:</span></div>
          <detect url='api/ca/users/searchResults' :searchVal="getSearchVal()" :placeholder="请输入学号或者姓名" @afterSelected="afterDetect"></detect>
        </div>
        <div class="bar"></div>
        <div class="class_wrap">
          <div style="text-align:right">
            <!-- <button type="button" class="btn submit-btn clearBtnBorder" @click="addClass()">新建课程班级</button> -->
            <div class="add new_icon" @click="addClass()"></div>
          </div>
          <div class="form-group box_flex align_center" v-for="(item,index) in addParams['classes']" :key="index">
            <div class="label require"><span>课程班级名称:</span></div>
            <input type="text" class="form-control search-input" v-model="item.className">
            <div @click="deleteClass(index)" v-if="index>0"  class="action delete box_flex flex_center"></div>
          </div>
        </div>

      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showAddOrEditModal = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="saveAddOrEdit()">保存</button>
      </div>
    </v-modal>
  </div>
  <div v-else-if="curRoute === 'classList'">

    <a type="button" class="box_flex align_center back_wrap" @click="curRoute='allStaff'">
      <!--返回教师列表-->
      <i class="maticon back-icon-btn" v-html="icons('arrow_back')">arrow_back</i><span class="nav-title">返回</span>
    </a>
    <div class="tab-div">
      <div class="tab" v-for="(tab, index) in tabList" :key="index" :class="courseClassId===tab.id? 'active' : ''" :title="tab.className" @click="courseClassId=tab.id">{{tab.className}}</div>
    </div>
    <v-table :url="classUrl+courseClassId+timestamp" :title="courseName" pagesize="10" idField="id" :order="true" :columns="classColumns">
      <div slot="btn-group" role="group">
        <div v-if="!isAgent" class="btn-group pull-right">
          <button type="button" @click="setPower" class="btn btn-bgColor-style clearBtnBorder">代理授权</button>
          <button type="button" @click="toAddSign" class="btn btn-bgColor-style clearBtnBorder">新建签到</button>
        </div>
      </div>
    </v-table>
    <sign-info-modal title="新增签到" :signInfo="newSignModal" :i18n="i18n" @confirm="addSign"></sign-info-modal>
  </div>
  <div v-else-if="curRoute === 'agent'" class="agent_wrap">
    <!-- <button type="button" class="btn back-btn clearBtnBorder" style="color:#666" @click="curRoute='classList'">
      <i class="maticon back-icon-btn" style="top:6px;" v-html="icons('arrow_back')">arrow_back</i><span class="nav-title">返回</span>
    </button> -->
    <a type="button" @click="curRoute='classList'" class="box_flex align_center back_wrap">
      <i class="maticon back-icon-btn" v-html="icons('arrow_back')">arrow_back</i><span class="nav-title">返回</span>
    </a>
    <div class="form-wrap">
      <div v-for="(item,index) in agentList" class="agent_row" :key="index">
        <div class="title">
          代理授权
        </div>
        <div class="box_flex agent_item">
          <div class="form-group">
            <div class="label"><span>代理权分配方式:</span></div>
            <v-select :options="agentTypeList" options-value="value" options-label="label" required=true @change="val=>{onSelectAgentType(val,index)}" close-on-select justify v-model="item['agentType']"></v-select>
          </div>
          <div class="form-group">
            <div class="label require"><span>角色设置:</span></div>
            <div v-if="item.agentType!=='USER'" class="box_flex flex_wrap">
              <div v-for="(role,rIndex) in roleOptions[item.agentType]" :key="rIndex">
                <checkbox :name="role.label" v-model="item.agentRoles[role.value]"></checkbox>
              </div>
            </div>
            <div v-else class="box_flex flex_wrap user_wrap">
              <div v-for="(user,uIndex) in item.agentUsers" class="user_item" :key="uIndex">
                {{user.name}}
              </div>
              <div @click="addAgentUser(item)" class="action add box_flex flex_center"></div>
              <div v-if="item.agentUsers.length" @click="deleteAgentUser(item)" class="action delete box_flex flex_center"></div>
            </div>
          </div>
        </div>
        <div v-if="index===agentList.length-1">
          <div @click="addAgent()" class="action add box_flex flex_center"></div>
          <div v-if="agentList.length>1" @click="deleteAgent(index)" class="action delete box_flex flex_center"></div>
        </div>
      </div>
    </div>
    <div class="box_flex flex_center" style="padding:20px;">
      <button class="btn cancel-btn" @click="curRoute='classList'" style="margin-right:80px">取消</button>
      <button class="btn submit-btn" @click="saveAgent()">保存</button>
    </div>

    <v-modal :show="showAddAgentUser" effect="fade" width="420">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          新增授权人员
        </h5>
      </div>
      <div slot="modal-body" class="modal-body form-wrap" style="overflow: inherit;">
        <detect url='api/ca/users/searchResults' :placeholder="请输入学号或者姓名" @afterSelected="afterSelectAgentUser"></detect>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showAddAgentUser = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="saveAddAgentUser()">确定</button>
      </div>
    </v-modal>
  </div>
  <div v-else-if="curRoute === 'signInfo'">
    <sign-info v-bind="signInfo" @back="curRoute='classList'" :key="signInfo.sign.id"></sign-info>
  </div>
  <div v-else-if="curRoute === 'personList'">
    <personlist @back="curRoute='allStaff'" :courseName="courseName" :tabList="tabList"></personlist>
  </div>
  <div class="importPageClass" v-else>
    <v-import v-bind="importParams" @backParentPage="curRoute = 'allStaff'"></v-import>
  </div>
</template>

<script>
import Vue from 'vue'
import importTable from "../../mixins/import.js";
import { request, translation } from '../../assets/utils/utils.js'
import SignInfoModal from '../../modules/iSignIn/signInfoModal'
import checkbox from '../../components/VCheckbox'
import SignInfo from '../../modules/iSignIn/signInfo'
import personlist from '../../modules/iSignIn/personlist'
export default {
  mixins: [importTable],
  components: {
    SignInfoModal, checkbox, SignInfo, personlist
  },
  created: function () {
    if (this.$route.query.isPerson) {//个人课程管理
      this.isPerson = true;
      this.url = '/table-data/ca/courses/page/person'
    }
    if (this.$route.query.isAgent) {//个人课程管理
      this.isAgent = true;
      this.url = '/table-data/ca/courses/page/agent'
    }
    this.timestamp = "?timestamp=" + new Date().getTime();

    this.getYearList()
    this.getCourserTypeList()
  },
  computed: {
    i18n: function () {
      return translation(this.lang).iSign
    },
    tableUrl(){
      if(!this.curbatchId){
        return ''
      }
      return this.url+this.timestamp+'&batchId='+this.curbatchId
    }
  },
  data: function () {
    return {
      url: '/table-data/ca/courses/page/school',
      classUrl: '/table-data/ca/signIn/page/',
      columns: [],
      courseClassId: '',
      courseId: '',
      courseName: '',
      lang: 'zh-cn',
      classColumns: [],
      curbatchId: '',
      yearValue: '',
      isPerson: false,
      isAgent: false,
      yearOptions: [],
      termsOptions: [],
      timestamp: "?timestamp=",
      isEdit: false,
      coursesTypeList: [],
      addUserData: null,
      addUserItem: null,
      showAddAgentUser: false,
      requireOptions: [
        { value: 'courseName', label: '考勤课程' },
        { value: 'courseType', label: '课程类别' },
        { value: 'teacherUserId', label: '任课教师' }
      ],
      addParams: {
        courseName: '',
        courseType: '',
        classes: [{ className: '' }]
      },
      showAddOrEditModal: false,
      newSignModal: {
        show: false,
        name: null,
        startTime: '',
        endTime: '',
        signWays: {
          qrcode: 'qrcode',
          location: 'location'
        },
        isSignOut: false,
        needOut: true,
        signWay: 'qrcode',
        useDynamicCode: false,
        scanQrcodeWithLocation: false,
        locations: [],
        qrcodeLocations: [],
        activeLocationIndex: 0,
        project: null,
        projectId: null,
        maxLength: 20,
        dateFormat: 'yyyy-MM-dd hh:ii:ss',
      },
      agentList: [{
        agentType: 'SCHOOL',
        agentRoles: {},
        agentUsers: [],
      }],
      roleOptions: {
        SCHOOL: [],
        COLLEGE: [],
        INSTRUCTOR: [],
        CLASS: [],
        USER: [],
      },
      signInfo: {
        project: null,
        sign: null,
        userType: 'MANAGE'   // MANAGE PROXY
      },
      agentTypeList: [
        { label: '全校统一分配', value: 'SCHOOL' },
        { label: '以学院关系分配', value: 'COLLEGE' },
        { label: '以带生关系分配', value: 'INSTRUCTOR' },
        { label: '以班级关系分配', value: 'CLASS' },
        { label: '自定义分配', value: 'USER' }],
      showAddModal: false
    }
  },
  watch: {
    yearValue(newVal) {
      this.termsOptions = this.yearOptions.filter(o => {
        return o.value === newVal
      })[0].terms
      this.curbatchId = this.termsOptions[0].value
    }
  },
  methods: {
    onSelectAgentType(val, index) {
      let hasNum = 0
      this.agentList.forEach(o => {
        if (o.agentType === val.value) {
          hasNum += 1
        }
      })
      if (hasNum === 2) {
        this.agentList = JSON.parse(JSON.stringify(this.oldAgentList))
        this.$toast('该代理分配方式已被占用，请重新选择！')
      } else {
        this.oldAgentList = JSON.parse(JSON.stringify(this.agentList))
      }
    },
    addAgentUser(item) {
      this.addUserData = null
      this.addUserItem = item
      this.showAddAgentUser = true
    },
    saveAddAgentUser() {
      if (this.addUserData) {
        if (this.addUserItem.agentUsers.map(o => {
          return o.userId
        }).indexOf(this.addUserData) === -1) {
          this.addUserItem.agentUsers.push(this.addUserData)
          this.showAddAgentUser = false
        } else {
          this.$toast("授权人员已存在!")
        }
      } else {
        this.$toast("请选择授权人员!")
      }
    },
    afterSelectAgentUser(o) {
      this.addUserData = o;
    },
    deleteAgentUser(item) {
      item.agentUsers.splice(item.agentUsers.length - 1, 1)
    },
    saveAgent() {
      let params = JSON.parse(JSON.stringify(this.agentList))
      params.map(o => {
        let agentRoles = []
        if (o.agentType !== 'USER') {
          for (var i in o.agentRoles) {
            if (o.agentRoles[i]) {
              agentRoles.push({ roleId: i })
            }
          }
        }
        o.agentRoles = agentRoles
        return o;
      })
      let url = `api/ca/agents/setting/${this.courseClassId}`
      request(url, params, 'post').then(o => {
        if (o.state) {
          this.$toast('操作成功!');

        } else {
          this.$toast(o.message)
        }
      })
    },
    setPower() {//代理授权
      this.curRoute = 'agent'
      let url = `api/ca/agents/setting/${this.courseClassId}`
      request(url).then(o => {
        this.agentList = o.data
        this.agentList.map(a => {
          if (a.agentRoles.length) {
            let agentRoles = {}
            a.agentRoles.forEach(b => {
              agentRoles[b.roleId] = true
            })
            a.agentRoles = agentRoles
          }
          return a
        })
        if (this.agentList.length == 0) {
          // this.agentList.push({
          //   agentType: 'SCHOOL',
          //   agentRoles: {},
          //   agentUsers: [],
          // })
          // this.agentList.push({
          //   agentType: 'INSTRUCTOR',
          //   agentRoles: {},
          //   agentUsers: [],
          // })
          this.addAgent()
          this.addAgent()
        }
      })
      this.getRoleOptions()
    },
    addAgent() {
      let isFirst = true
      let hadAgentTypeList = this.agentList.map(a => { return a.agentType })
      this.agentTypeList.forEach(o => {
        if (hadAgentTypeList.indexOf(o.value) === -1) {
          if (isFirst) {
            this.agentList.push({
              agentType: o.value,
              agentRoles: {},
              agentUsers: [],
            })
            isFirst = false
          }
        }
      })
      if (isFirst) {
        this.$toast('没有更多分配方式了!')
      }

      this.oldAgentList = JSON.parse(JSON.stringify(this.agentList))
    },
    deleteAgent(index) {
      this.agentList.splice(index, 1)
      this.oldAgentList = JSON.parse(JSON.stringify(this.agentList))
    },
    getRoleOptions() {
      let url = 'api/ca/system/classCommittee'
      request(url).then(o => {
        this.roleOptions['CLASS'] = o.data
      })
      let url2 = 'api/ca/system/roles/SCHOOL'
      request(url2).then(o => {
        this.roleOptions['SCHOOL'] = o.data
      })
      let url3 = 'api/ca/system/roles/COLLEGE'
      request(url3).then(o => {
        this.roleOptions['COLLEGE'] = o.data
      })
    },
    addSign(o) {
      let params = JSON.parse(JSON.stringify(o))

      params.signInName = params.name
      params.signInTimeStart = params.startTime
      params.signInTimeEnd = params.endTime
      params.dynamicCode = params.useDynamicCode
      params.isLocation = params.scanQrcodeWithLocation
      params.ranges = params.qrcodeLocations.map(o => {
        return {
          longitude: o.lng,
          latitude: o.lat,
          distance: o.radius,
          address: o.address
        }
      })
      let url = 'api/ca/signIn/' + this.courseClassId
      request(url, params).then(o => {
        if (o.state) {
          this.newSignModal.show = false;
          this.timestamp = "?timestamp=" + new Date().getTime();
          this.$toast('操作成功!')
        } else {
          this.$toast(o.message)
        }
      })

    },
    toAddSign: function (project) {
      this.newSignModal = {
        show: true,
        name: null,
        signWays: {
          qrcode: 'qrcode',
          location: 'location'
        },
        isSignOut: false,
        needOut: true,
        signWay: 'qrcode',
        useDynamicCode: false,
        scanQrcodeWithLocation: false,
        locations: [],
        qrcodeLocations: [],
        activeLocationIndex: 0,
        project: null,
        projectId: null,
        maxLength: 20,
        dateFormat: 'yyyy-MM-dd hh:ii:ss'
      };
    },
    batchAddCourse() {
      if (this.isPerson) {//如果是个人
        this.importParams = {
          parentPageTitle: "",
          downloadTemplateUrl: `/ca/courses/personal/batch/template`,
          downloadErrorTemplateUrl: `/ca/courses/batch/error`,
          checkTemplateUrl: `/ca/courses/personal/batch/excel/${this.curbatchId}`,
          templateName: "批量导入模板",
          importBtnType: [
            {
              url: `/ca/courses/batch/update`,
              method: 'post',
              isShowBtn: true,
              name: "增量导入",
              success: data => {
                this.timestamp = "?timestamp=" + new Date().getTime();
                this.curRoute = "allStaff";
              }
            }
          ]
        };
      } else {//是学校
        this.importParams = {
          parentPageTitle: "",
          downloadTemplateUrl: `/ca/courses/school/batch/template`,
          downloadErrorTemplateUrl: `/ca/courses/batch/error`,
          checkTemplateUrl: `/ca/courses/batch/excel/${this.curbatchId}`,
          templateName: "批量导入模板",
          importBtnType: [
            {
              url: `/ca/courses/batch/update`,
              method: 'post',
              isShowBtn: true,
              name: "增量导入",
              success: data => {
                this.timestamp = "?timestamp=" + new Date().getTime();
                this.curRoute = "allStaff";
              }
            }
          ]
        };
      }

      this.quickAddRecord()
    },
    batchAddPerson() {//
      if (this.isPerson) {
        this.importParams = {
          parentPageTitle: "",
          downloadTemplateUrl: `/ca/courses/personal/batch/person/template`,
          downloadErrorTemplateUrl: `/ca/courses/batch/error`,
          checkTemplateUrl: `/ca/courses/batch/person/excel/${this.curbatchId}`,
          templateName: "批量导入模板",
          importBtnType: [
            {
              url: `/ca/courses/batch/person/update`,
              method: 'post',
              isShowBtn: true,
              name: "增量导入",
              success: data => {
                this.timestamp = "?timestamp=" + new Date().getTime();
                this.curRoute = "allStaff";
              }
            }
          ]
        };
      } else {
        this.importParams = {
          parentPageTitle: "",
          downloadTemplateUrl: `/ca/courses/school/batch/person/template`,
          downloadErrorTemplateUrl: `/ca/courses/batch/error`,
          checkTemplateUrl: `/ca/courses/batch/person/excel/${this.curbatchId}`,
          templateName: "批量导入模板",
          importBtnType: [
            {
              url: `/ca/courses/batch/person/update`,
              method: 'post',
              isShowBtn: true,
              name: "增量导入",
              success: data => {
                this.timestamp = "?timestamp=" + new Date().getTime();
                this.curRoute = "allStaff";
              }
            }
          ]
        };
      }

      this.quickAddRecord()
    },
    getSearchVal() {
      if (this.addParams.userName) {
        return this.addParams['userName'] + '(' + this.addParams['userNo'] + ')'
      } else {
        return ''
      }
    },
    saveAddOrEdit() {
      for (let i in this.requireOptions) {
        if (!this.addParams[this.requireOptions[i].value]) {
          this.$toast(this.requireOptions[i].label + '不能为空!')
          return
        }
      }
      for (let i in this.addParams.classes) {
        if (!this.addParams.classes[i].className) {
          this.$toast('课程班级名称不能为空!')
          return
        }
      }
      let url = 'api/ca/courses'
      if (this.isPerson) {
        url = 'api/ca/courses/personal'
      }
      let requestType = 'post'
      if (this.isEdit) {
        url = `api/ca/courses/${this.addParams.id}`
        requestType = 'post'
        if (this.isPerson) {
          url = `api/ca/courses/personal/${this.addParams.id}`
        }
      }
      if (!this.addParams.batchId) {
        this.addParams.batchId = this.curbatchId
      }
      request(url, this.addParams, requestType).then(o => {
        if (o.state) {
          this.$toast('操作成功!')
          this.showAddOrEditModal = false
          this.timestamp = "?timestamp=" + new Date().getTime();
        } else {
          this.$toast(o.message)
        }
      })
    },
    deleteClass(index) {
      this.addParams.classes.splice(index, 1)
    },
    addClass() {
      this.addParams.classes.push({
        className: ''
      })
    },
    addCourse() {//
      this.addParams = {
        courseName: '',
        courseType: '',
        classes: [{ className: '' }]
      };
      this.isEdit = false
      this.showAddModal = false
      this.showAddOrEditModal = true
    },
    getCourserTypeList() {
      let url = 'api/ca/dict?typeName=课程类别'
      request(url).then(o => {
        if (o.state) {
          this.coursesTypeList = o.data
          this.initTable()
        }
      })
    },
    afterDetect(obj) {
      this.addParams.userName = obj.name
      this.addParams.userNo = obj.userNo
      this.addParams.teacherUserId = obj.userId
    },
    initTable() {
      let that = this
      this.classColumns = [
        {
          id: "signInName",
          title: "名称",
          className: "text-left",
          hidden: false,
          search: {
            type: "input",
            data: {
              placeholder: ""
            }
          }
        }, {
          id: "signInTimeStart",
          title: "签到开始时间",
          className: "text-left",
          hidden: false,
          search: {
            type: "search",
            data: {
              dateFormat: 'yyyy-mm-dd hh:ii',
            }
          }
        }, {
          id: "signInTimeEnd",
          title: "签到结束时间",
          className: "text-left",
          hidden: false,
          search: {
            type: "search",
            data: {
              dateFormat: 'yyyy-mm-dd hh:ii',
            }
          }
        }, {
          id: "signOutTimeStart",
          title: "签退开始时间",
          className: "text-left",
          hidden: false,
          search: {
            type: "search",
            data: {
              dateFormat: 'yyyy-mm-dd hh:ii',
            }
          },
          formatter(record) {
            if (record.isSignOut) {
              return record.signOutTimeStart
            } else {
              return ' '
            }
          }
        }, {
          id: "signOutTimeEnd",
          title: "签退结束时间",
          className: "text-left",
          hidden: false,
          search: {
            type: "search",
            data: {
              dateFormat: 'yyyy-mm-dd hh:ii',
            }
          },
          formatter(record) {
            if (record.isSignOut) {
              return record.signOutTimeEnd
            } else {
              return ' '
            }
          }
        }, {
          id: "opt",
          title: "操作",
          className: "text-center",
          width: "230px",
          formatter: function (obj) {
            if (that.isAgent) {
              return [
                {
                  tag: "a",
                  text: '查看',
                  className: "opt-btn",
                  callback: function (record, index) {
                    that.newSignModal.isAgent = true
                    that.showSignDetail(record)
                  }
                }]
            }
            return [
              {
                tag: "a",
                text: '查看',
                className: "opt-btn",
                callback: function (record, index) {
                  that.showSignDetail(record)
                }
              }, {
                tag: "a",
                text: '删除',
                className: "opt-btn",
                callback: function (record, index) {
                  if (!confirm('是否删除签到?')) {
                    return
                  }
                  let url = `api/ca/signIn/delete/${record.id}`
                  request(url, {}, 'post').then(o => {
                    if (o.state) {
                      that.timestamp = "?timestamp=" + new Date().getTime()
                      that.$toast('操作成功')
                    } else {
                      that.$toast(o.message)
                    }
                  })
                }
              }]
          }
        }
      ]
      this.columns = [
        {
          id: "courseName",
          title: "课程名称",
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
          id: "courseType",
          title: '课程类别',
          className: "text-left",
          hidden: false,
          search: {
            type: "select",
            data: {
              optionsLabel: 'label',
              optionsValue: 'value',
              options: that.coursesTypeList
            }
          },
          formatter(record) {
            return record.courseTypeName
          }
        },
        {
          id: "userNo",
          title: "任课教师学工号",
          className: "text-left",
          hidden: false,
          search: {
            type: "input",
            data: {
              placeholder: ""
            }
          }
        }, {
          id: "userName",
          title: "任课教师姓名",
          className: "text-left",
          hidden: false,
          search: {
            type: "input",
            data: {
              placeholder: ""
            }
          }
        }, {
          id: "className",
          title: "课程班级",
          className: "text-left",
          hidden: false,
          search: {
            type: "input",
            data: {
              placeholder: ""
            }
          },
          formatter(record) {
            let str = record.classes.map(o => {
              return o.className
            }).join(',')
            return str
          }
        }, {
          id: "opt",
          title: "操作",
          className: "text-center",
          width: "230px",
          formatter: function (obj) {
            if (that.isAgent) {
              return [
                {
                  tag: "a",
                  text: '查看',
                  className: "opt-btn",
                  callback: function (record, index) {
                    that.showDetail(record, 'classList')
                  }
                }]
            }
            return [
              {
                tag: "a",
                text: '查看',
                className: "opt-btn",
                callback: function (record, index) {
                  that.showDetail(record, 'classList')
                }
              },
              {
                tag: "a",
                text: '人员名单',
                className: "opt-btn",
                callback: function (record, index) {
                  that.showDetail(record, 'personList')
                }
              },
              {
                tag: "a",
                text: '编辑',
                className: "opt-btn",
                callback: function (record, index) {
                  that.editCourse(record)
                }
              },
              {
                tag: "a",
                text: '删除',
                className: "opt-btn",
                callback(record, index) {
                  that.deleteCourse(record)
                }
              },
            ];
          }
        }]
    },
    showDetail(obj, route) {
      this.courseId = obj.id
      this.courseName = obj.courseName
      let url = 'api/ca/person/classes/' + this.courseId
      if (this.isAgent) {
        let url = 'api/ca/courses/agent/classes/' + this.courseId
      }
      request(url).then(o => {
        this.tabList = o.data
        if (this.tabList.length) {
          this.courseClassId = this.tabList[0].id
          this.curRoute = route
        } else {
          $toast('没有课程班级你想看什么?')
        }
      })
    },
    editCourse(obj) {
      this.addParams = JSON.parse(JSON.stringify(obj))
      this.isEdit = true;
      this.showAddOrEditModal = true;
    },
    showSignDetail(record) {
      let url = 'api/ca/signIn/' + record.id
      let that = this
      request(url).then(o => {
        let params = o.data
        that.newSignModal.id = params.id
        that.newSignModal.name = params.signInName
        that.newSignModal.startTime = params.signInTimeStart
        that.newSignModal.endTime = params.signInTimeEnd
        that.newSignModal.signOutTimeStart = params.signOutTimeStart
        that.newSignModal.signOutTimeEnd = params.signOutTimeEnd
        that.newSignModal.useDynamicCode = params.dynamicCode
        that.newSignModal.isSignOut = params.isSignOut
        that.newSignModal.scanQrcodeWithLocation = params.isLocation
        if (params.ranges) {
          that.newSignModal.qrcodeLocations = params.ranges.map(o => {
            return {
              lng: o.longitude,
              lat: o.latitude,
              radius: o.distance,
              address: o.address,
              showMap: false,
              init: true
            }
          })
        }
        that.signInfo.sign = that.newSignModal
        that.curRoute = 'signInfo'
      })
    },
    deleteCourse(obj) {
      let url = `api/ca/courses/delete/${obj.id}`
      if (this.isPerson) {
        url = `api/ca/courses/personal/delete/${obj.id}`
      }
      if (!confirm('确定删除该课程吗？删除后数据将无法恢复')) {
        return
      }
      request(url, {}, 'post').then(o => {
        if (o.state) {
          this.$toast('操作成功!')
          this.timestamp = "?timestamp=" + new Date().getTime();
        } else {
          this.$toast(o.message)
        }
      })
    },
    getYearList() {
      let url = 'api/ca/courses/options/schoolYears'
      request(url).then(o => {
        if (o.state) {
          this.yearOptions = o.data
          o.data.forEach(a=>{
            a.terms.forEach(b=>{
              if(new Date(b.dateEnd)>new Date()&&new Date()>new Date(b.dateStart)){
                this.yearValue = a.value
                this.curbatchId = b.value
              }
            })
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped >
.form-wrap {
  width: 100%;
  flex-wrap: wrap;
  .form-group {
    margin-right: 20px;
    .label {
      width: 140px;
      font-size: 14px;
      color: #666;
      text-align: right;
      padding-left: 12px;
      padding-right: 12px;
    }
    .v-select,
    .form-control,
    .v-datepicker,
    .ditection {
      width: 200px;
      &.long-input {
        width: 600px;
      }
    }
  }
}
.bar {
  width: 100%;
  height: 1px;
  background: #edecf1;
}
.my_delete {
  width: 22px;
  height: 22px;
  position: absolute;
  right: -8px;
  top: 5px;
  background: red;
  color: white;
  border-radius: 50%;
  line-height: 15px;
  cursor: pointer;
  font-size: 40px;
  text-align: center;
}
.class_wrap {
  padding-top: 20px;
  .form-group {
    margin-top: 20px;
    position: relative;
  }
}
.tab-div {
  position: relative;
  height: 50px;
  margin: 0px 0px 0;
  background: white;
  white-space: nowrap;
  border-bottom: 1px solid #f0f0f0;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12);
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
    line-height: 50px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    border-bottom: 2px solid transparent;
    cursor: pointer;
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

      height: 50px;
    }
    margin-right: -4px;
  }
}
.class_wrap{
  .action {
      width: 25px;
      height: 25px;
      line-height: 25px;
      border-radius: 50%;
      cursor: pointer;
      color: white;
      position: absolute;
      font-size: 30px;
    &.delete {
      right: 60px;
      background-image: url("../../assets/img/icon_content_delete.png");
      background-size: 25px 25px;
      right: -16px;
      top: 2px;
    }
    }
    
}
.agent_wrap {
  background: white;
  min-height: 888px;
  height: 100%;
  overflow: auto;
  padding: 20px;
  .agent_row {
    width: 100%;
    border: 1px solid #f5f5f5;
    padding-right: 130px;
    position: relative;
    .title {
      background: white;
      padding: 10px;
      width: 100%;
      font-weight: bold;
      font-size: 15px;
    }
    .agent_item {
      min-height: 121px;
      padding: 10px;
      background: #f5f5f5;
      .label {
        display: block;
        padding: 0;
        margin-bottom: 10px;
        text-align: left;
      }
    }
    .user_wrap {
      .action {
        position: unset;
        margin: 5px;
      }
    }
    .action {
      width: 25px;
      height: 25px;
      line-height: 25px;
      border-radius: 50%;
      cursor: pointer;
      color: white;
      position: absolute;
      top: 52px;
      font-size: 30px;
    }
    .add {
      right: 100px;
      background-image: url("../../assets/img/icon_content_add.png");
      background-size: 25px 25px;
    }
    .delete {
      right: 60px;
      background-image: url("../../assets/img/icon_content_delete.png");
      background-size: 25px 25px;
    }
    .user_item {
      height: 34px;
      line-height: 34px;
      border-radius: 5px;
      background: #4091ff;
      margin-left: 10px;
      padding: 0 10px;
      color: white;
    }
  }
}
</style>
