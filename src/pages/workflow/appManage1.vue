<template>
  <div class="app-page" :class="{
      'container-fluid': ['formSetManage','flowSetManage','joinRoleSet'].indexOf(miniRoutes)<0,
      'layout-manage': role !== 'department'
    }">
    <div id="appManage" class="row" v-show="miniRoutes === 'appManage'">
      <div class="head">
        <h3 class="pull-left">{{translate.appManage}}
          <v-select class="info-value" :options="departmentList" :required="true" v-model="departmentId" options-value="id" options-label="name" close-on-select @afterSelected="_changeDepartment" v-if="role === 'department'&&departmentId">
          </v-select>
        </h3>
        <button class="btn pull-right import-file-btn" @click="_showImportModal">{{translate.import}}</button>
        <button class="btn pull-right" @click="_createApp" v-if="role === 'department'"><i class="maticon pull-left" v-html="icons('create')"></i>{{translate.createApp}}</button>
        <button class="btn pull-right" @click="showTypeModal = true" v-else><i class="maticon pull-left" v-html="icons('playlist_add')"></i>{{translate.createAppType}}</button>
        <input type="text" class="form-control pull-right app-search" placeholder="搜索..." v-model="searchName" v-if="role === 'department'" />
      </div>
      <GeminiScrollbar :scrollX="false" class="body">
        <div class="container-fluid type-group" v-if="role !== 'department'">
          <label class="pull-left type-head">{{translate.hot}}</label>
          <div class="apps-container">
            <div class="app drag" v-for="(app,k) in appList" :key="k" :data-key="k" :data-id="app.id" data-type="total" @dragover="_dragOver" @dragenter="_dragEnter" @click="_editApp(app)" v-if="app.app.name.indexOf(searchName)>=0">
              <div class="active-show"></div>
              <i class="maticon remove-app" @click.stop="_removeApp(appList, k, 'popular')" v-html="icons('cancel')" v-if="role !== 'department'">cancel</i>
              <div class="app-icon-div" :style="{ 'background': app.app.background}">
                <i class="maticon app-icon-style theme-icon-application" :class="app.app.isPublished?'':'disabled'" draggable="" @dragstart="_dragStart" @dragenter="_dragEnter" @dragend="_dragEnd" v-html="icons(app.app.imgPath||'school')" v-if="(!app.app.imgType) || app.app.imgType === '1'">{{app.app.imgPath||'school'}}</i>
                <i class="maticon app-icon-style theme-icon-application" :class="app.app.isPublished?'':'disabled'" draggable="" @dragstart="_dragStart" @dragenter="_dragEnter" @dragend="_dragEnd" v-else-if="app.app.imgType === '2'"> <span class="saasicon-44px" :class="['saasicon-44px-'+ app.app.imgPath]"></span> </i>
              </div>
              <p class="text-center">{{app.app.name}}</p>
            </div>
            <div class="app drag add" data-type="total" @dragover="_dragOver" @dragenter="_dragEnter">
              <div class="active-show" style="left: 0;"></div>
            </div>
          </div>
        </div>
        <div class="bigtype" v-for="(bigtype, bIndex) in typeList" :key="bIndex" v-if="(role === 'department'&&departmentId)||role !== 'department'">
          <div class="bigtype-header">
            <span class="pull-left" style="margin-right: 8px;"><i class="maticon pull-left" v-html="icons('list')">list</i>{{translate[bigtype.bigType]}}</span>
            <span class="pull-right move-icon" :class="{active: bigtype.dragging}" @click="_saveTypeOrder(bigtype)" v-if="role !== 'department'">
              <i class="maticon pull-left" style="margin-right: 0;" v-html="icons('swap_vert')">swap_vert</i>
              {{bigtype.dragging?'完成':'排序'}}
            </span>
          </div>
          <div class="container-fluid type-group" v-for="(type,t) in bigtype.types" :key="t" v-show="!bigtype.dragging" v-if="_containsSearchName(type.appList) || role!=='department'">
            <label class="pull-left type-head" v-if="editType!==type.id">
              {{type.name}}
              <i class="maticon pull-right" @click.stop="_removeAppType(type, t, bigtype)" v-html="icons('cancel')" v-if="role !== 'department'">cancel</i>
              <i class="maticon pull-right" @click="_editAppType(type)" v-html="icons('edit')" v-if="role !== 'department'">edit</i>
            </label>
            <div class="pull-left type-head type-edit" v-else>
              <div class="input-group">
                <input type="text" class="form-control type-name" maxlength="16" placeholder="请输入16字内的应用分类名称" v-model="newAppName" />
                <span class="input-group-addon" @click="editType = ''">{{translate.cancel}}</span>
                <span class="input-group-addon sure" @click="_saveAppType(type, t)">{{translate.sure}}</span>
              </div>
            </div>
            <div class="apps-container">
              <div v-if="type.appList.length === 0" class="app drag" :data-index="t" data-key='0' data-type="type" @dragover="_dragOver" @dragenter="_dragEnter">
                <div class="active-show" style="left: 0;"></div>
              </div>
              <div class="app" :class="{
                  drag: role !== 'department'
                }" v-for="(app,k) in type.appList" :key="k" :data-key="k" data-type="type" :data-index="t" :data-id="app.id" :data-bigtype="bigtype.bigType" :title="app.name" @dragover="_dragOver" @dragenter="_dragEnter" @click="_editApp(app)" v-if="app.name.indexOf(searchName)>=0">
                <div class="active-show"></div>
                <i class="maticon remove-app" @click.stop="_removeApp(type.appList, k)" v-html="icons('cancel')" v-if="role === 'department'">cancel</i>
                <div class="app-icon-div" :style="{ 'background': app.background}">
                  <i class="maticon app-icon-style theme-icon-application" :class="app.isPublished?'':'disabled'" draggable="" @dragstart="_dragStart" @dragenter="_dragEnter" @dragend="_dragEnd" v-html="icons(app.imgPath||'school')" v-if="(!app.imgType) || app.imgType==='1'">{{app.imgPath||'school'}}</i>
                  <i class="maticon app-icon-style theme-icon-application" :class="app.isPublished?'':'disabled'" draggable="" @dragstart="_dragStart" @dragenter="_dragEnter" @dragend="_dragEnd" v-else-if="app.imgType === '2'"> <span class="saasicon-44px" :class="['saasicon-44px-'+ app.imgPath]"></span> </i>
                </div>
                <p class="text-center">{{app.name}}</p>
              </div>
            </div>
          </div>
          <div class="container-fluid type-group dragging-div" :class="{active: moveType.id === dragType.id}" v-for="(moveType, mt) in bigtype.types" :key="mt" v-dragging="{ item: moveType, list: bigtype.types, group: bIndex }" v-show="bigtype.dragging" v-if="role !== 'department'">
            <label class="pull-left type-head">
              {{moveType.name}}
            </label>
          </div>
        </div>
      </GeminiScrollbar>
      <v-modal :show="showAddModal" width="400">
        <div slot="modal-header" class="modal-header">
          <h5 class="modal-title">
            {{translate.createApp}}
          </h5>
        </div>
        <div slot="modal-body" class="modal-body container-fluid creat-app-body" style="max-height:300px;">
          <div class="form-group">
            <input type="text" class="form-control modal-input" v-model="newApp.name" maxlength="25" :placeholder="translate.createAppPlaceholder">
          </div>
          <div class="type-div row">
            <span class="type-span" :class="newApp.settingType === cat.settingType?'active':''" v-for="(cat,cIndex) in appCats" :key="cIndex" @click="newApp.settingType = cat.settingType;">
              <i class="maticon" v-html="icons('done')"></i>
              {{translate[cat.name]}}
            </span>
          </div>
          <div class="type-div row">
            <div class="app-type-text">{{translate.selectAppType}}</div>
            <div class="app-type-content">
              <div v-for="(bigType, bIndex) in typeList" :key="bIndex">
                <p class="type-p" :class="newApp.appTypeId === type.id?'active':''" v-for="(type, tIndex) in bigType.types" :key="tIndex" @click="newApp.appTypeId = type.id;addAppType = type;">
                  <i class="maticon" v-html="icons('done')"></i>
                  {{type.name}}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div slot="modal-footer" class="modal-footer">
          <button type="button" class="btn cancel-btn clearBtnBorder" @click="showAddModal = false">{{translate.cancel}}</button>
          <button type="button" class="btn submit-btn clearBtnBorder" @click="_editApp(null, addAppType)">{{translate.sure}}</button>
        </div>
      </v-modal>
      <v-modal :show="showTypeModal" width="460">
        <div slot="modal-header" class="modal-header">
          <h5 class="modal-title">
            {{translate.createAppType}}
          </h5>
        </div>
        <div slot="modal-body" class="modal-body container-fluid">
          <div class="form-group">
            <input type="text" class="form-control modal-input" v-model="newType.name" maxlength="16" :placeholder="translate.createAppTypePlaceholder">
          </div>
          <div class="type-div row">
            <span class="type-span" :class="newType.userType === type.userType?'active':''" v-for="(type,tIndex) in typeList" :key="tIndex" @click="newType.userType = type.userType">
              <i class="maticon" v-html="icons('done')"></i>
              {{translate[type.bigType]}}
            </span>
          </div>
        </div>
        <div slot="modal-footer" class="modal-footer">
          <button type="button" class="btn cancel-btn clearBtnBorder" @click="showTypeModal = false">{{translate.cancel}}</button>
          <button type="button" class="btn submit-btn clearBtnBorder" @click="_createAppType">{{translate.sure}}</button>
        </div>
      </v-modal>
      <v-modal :show="showImportModal" width="400">
        <div slot="modal-header" class="modal-header">
          <h5 class="modal-title">
            {{translate.importApp}}
          </h5>
        </div>
        <div slot="modal-body" class="modal-body container-fluid creat-app-body" style="max-height:300px;">
          <div class="button-group">
            <button type="button" class="btn clearBtnBorder import-btn">
              <label for="upload-file" class="upload-text" :title="selectFileName">{{selectFileName}}</label>
            </button>
            <input type="file" id="upload-file" class="upload-template" @change="getFile" v-if="clearInputShow">
          </div>
          <div class="type-div row">
            <div class="app-type-text">{{translate.selectAppType}}</div>
            <div class="app-type-content">
              <div v-for="(bigType, bIndex) in typeList" :key="bIndex">
                <p class="type-p" :class="newApp.appTypeId === type.id?'active':''" v-for="(type, tIndex) in bigType.types" :key="tIndex" @click="newApp.appTypeId = type.id;addAppType = type;">
                  <i class="maticon" v-html="icons('done')"></i>
                  {{type.name}}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div slot="modal-footer" class="modal-footer">
          <button type="button" class="btn cancel-btn clearBtnBorder" @click="showImportModal = false">{{translate.cancel}}</button>
          <button type="button" class="btn submit-btn clearBtnBorder" @click="_importApp(addAppType)">{{translate.sure}}</button>
        </div>
      </v-modal>
    </div>
    <app-info class="row" :departmentId="departmentId" :appId="curApp?curApp.id:''" :readonly="(role==='manager')" @setForm="_setForm($event, 'appInfo')" @setFlow="_setFlow" @update="_updateApp" @back="miniRoutes = 'appManage'" v-if="curApp&&miniRoutes==='appInfo'"></app-info>
    <FormEngineInfo class="row" :departmentId="departmentId" :curCheckRoutes="curCheckRoutes" :appId="curApp?curApp.id:''" :readonly="(role==='manager')" @setForm="_setForm($event, 'formEngine')" @setJoinRole="_setJoinRole" @update="_updateApp" @back="miniRoutes = 'appManage'" v-if="curApp&&miniRoutes===curCheckRoutes"></FormEngineInfo>
    <FormSetManage :student="studentBie" :departmentId="departmentId" :appId="curApp?curApp.id:''" :app="curApp" :readonly="(role==='manager')" :initWay="initWay" :formId="modelId" :businessId="businessId" @back="_backToPage(parentPage)" @submit="_saveFormInfo" v-if="miniRoutes==='formSetManage'&&curApp&&curApp.id"></FormSetManage>
    <FlowSetManage :departmentId="departmentId" :userType="appUserType" :appName="appName" :appId="curApp?curApp.id:''" :readonly="(role==='manager')" :flowId="modelId" :businessId="businessId" @back="_backToPage('appInfo')" @submit="_saveFlowInfo" v-if="miniRoutes==='flowSetManage'&&curApp&&curApp.id"></FlowSetManage>
    <JoinRoleSetManage :departmentId="departmentId" :userType="appUserType" :appName="appName" :appId="curApp?curApp.id:''" :readonly="(role==='manager')" :businessId="businessId" @back="_backToPage('formEngine')" @submit="_savePlayers" v-if="miniRoutes==='joinRoleSet'&&curApp&&curApp.id"></JoinRoleSetManage>
  </div>
</template>
<script>
import Vue from 'vue'
import $ from 'jquery'
import { translation, sAjax, createTime } from '../../assets/utils/utils.js'
import appInfo from './appInfo.vue'
import formSetManage from './formSetManage.vue'
import flowSetManage from './flowSetManage.vue'
import formEngineInfo from './formEngineInfo.vue'
import joinRoleSetManage from './joinRoleSetManage.vue'
Vue.component('app-info', appInfo)
Vue.component('FormSetManage', formSetManage)
Vue.component('FlowSetManage', flowSetManage)
Vue.component('FormEngineInfo', formEngineInfo)
Vue.component('JoinRoleSetManage', joinRoleSetManage)
export default {
  props: {
    role: ''
  },
  created: function () {
    // var that = this
    var la = localStorage.getItem('lang')
    if (translation(la)) {
      this.lang = la
    }
    // console.log(this.role)
    this._initDepartmentList()
  },
  data: function () {
    return {
      studentBie: false,
      departmentList: [],
      departmentId: 0,
      appList: [],
      typeList: {
        student: {
          userType: '1',
          bigType: 'student',
          dragging: false,
          types: []
        },
        teacher: {
          userType: '2',
          bigType: 'teacher',
          dragging: false,
          types: []
        },
        freshman: {
          userType: '3',
          bigType: 'freshman',
          dragging: false,
          types: []
        },
        instructor: {
          userType: '4',
          bigType: 'instructor',
          dragging: false,
          types: []
        }
      },
      dragData: {
        name: '',
        icon: ''
      },
      dragType: {},
      appInfo: {
        w: 0,
        h: 0
      },
      newType: {
        name: '',
        userType: ''
      },
      miniRoutes: 'appManage',
      curCheckRoutes: '',
      dragContainer: null,
      dragTarget: null,
      dropTarget: null,
      editType: '',
      newApp: {
        name: '',
        imgPath: 'school',
        imgType: 1,
        remark: '',
        settingType: '',
        appTypeId: '',
        departmentId: '',
        sort: 0
      },
      appCats: [{
        appTypeId: '1',
        settingType: 'WORKFLOW',
        name: 'workflow'
      }, {
        appTypeId: '2',
        settingType: 'LINK',
        name: 'link'
      }, {
        appTypeId: '3',
        settingType: 'FORM',
        name: 'form'
      }],
      newAppName: '',
      curApp: null,
      modelId: '',
      initWay: 'create',
      showTypeModal: false,
      showAddModal: false,
      selectAppType: '1',
      addAppType: '',
      parentPage: '',
      searchName: '',
      businessId: null,
      appName: '',
      showImportModal: false,
      clearInputShow: true,
      selectFileName: '',
      fileData: '',
      formData: null,
      appUserType: '',
      lang: 'zh-cn'
    }
  },
  computed: {
    translate: function () {
      return translation(this.lang).appManage
    }
  },
  mounted: function () {
    this.$dragging.$on('dragged', ({ draged, value }) => {
      this.dragType = draged
    })
  },
  methods: {
    _saveTypeOrder: function (bigtype) {
      bigtype.types.forEach((type, i) => {
        type.sort = i
      })
      if (bigtype.dragging) {
        sAjax({
          url: '/api/app/type/sort',
          type: 'post',
          data: bigtype.types,
          success: (data) => {
            bigtype.dragging = false
            if (data.state) {
              this.$toast('排序成功！')
            } else {
              this.$toast(data.message)
            }
          }
        })
      } else {
        bigtype.dragging = true
      }
    },
    _containsSearchName: function (appList) {
      var con = false
      appList.forEach((t) => {
        if ((t.name && t.name.indexOf(this.searchName) >= 0) || (t.app && t.app.name.indexOf(this.searchName) >= 0)) {
          con = true
        }
      })
      return con
    },
    _updateApp: function (app) {
      this.curApp.name = app.name
      this.curApp.imgPath = app.imgPath
      this.curApp.background = app.background
    },
    _initDepartmentList: function () {
      if (this.role === 'manager') {
        this.departmentId = ''
        this._initPopular()
        this._initTypes('1')
        this._initTypes('2')
        this._initTypes('3')
        this._initTypes('4')
      } else {
        var that = this
        sAjax({
          url: '/api/currentUser/approverDepartment?rule=应用管理',
          type: 'get',
          success: function (data) {
            if (data.state) {
              that.departmentList = data.data
              that.departmentId = data.data[0] ? data.data[0].id : ''
            } else {
              that.$toast(data.message)
            }
          }
        })
      }
    },
    _changeDepartment: function (obj) {
      if (!this.departmentId) {
        return
      }
      this._initTypes('1')
      this._initTypes('2')
      this._initTypes('3')
      this._initTypes('4')
    },
    _initPopular: function () {
      var that = this
      sAjax({
        url: '/api/app/popular',
        type: 'get',
        success: function (data) {
          if (data.state) {
            that.appList = data.data.sort((a,b)=>{
              return a.sort-b.sort
            })
          } else {
            that.$toast(data.message)
          }
        }
      })
    },
    _initTypes: function (userType) {
      var that = this
      var bigT = []
      // 获取应用类型列表
      if (userType === '1') {
        bigT = that.typeList.student
      } else if (userType === '2') {
        bigT = that.typeList.teacher
      } else if (userType === '3') {
        bigT = that.typeList.freshman
      } else if (userType === '4') {
        bigT = that.typeList.instructor
      }
      bigT.types = []
      sAjax({
        url: '/api/app/type',
        type: 'get',
        data: {
          userType: userType
        },
        success: function (data) {
          if (data.state) {
            data.data.forEach((ele, i) => {
              var obj = {}
              for (var k in ele) {
                Vue.set(obj, k, ele[k])
              }
              Vue.set(obj, 'appList', [])
              bigT.types.push(obj)
            })
            bigT.types = that._resort(bigT.types)
            that._initAppList(that.departmentId, userType)
          } else {
            that.$toast(data.message)
          }
        }
      })
    },
    _resort: function (type) {
      var newArr = []
      type.forEach((ele) => {
        if ((ele.sort || 0) >= newArr.length) {
          newArr.splice(newArr.length, 0, ele)
        } else {
          newArr.splice(ele.sort, 0, ele)
        }
      })
      newArr.forEach((ele, index) => {
        ele.sort = index
      })
      return newArr
    },
    _initAppList: function (departmentId, userType) {
      var that = this
      // 获取应用列表
      var bigtype = null
      if (userType === '1') {
        bigtype = that.typeList.student
      } else if (userType === '2') {
        bigtype = that.typeList.teacher
      } else if (userType === '3') {
        bigtype = that.typeList.freshman
      } else if (userType === '4') {
        bigtype = that.typeList.instructor
      }
      sAjax({
        url: '/api/app',
        type: 'get',
        data: {
          departmentId: departmentId,
          userType: userType
        },
        success: function (data) {
          if (data.state) {
            data.data.forEach((app, i) => {
              bigtype.types.forEach((type, tIndex) => {
                if (type.id === app.appType.id) {
                  type.appList.push(app)
                }
              })
            })
          } else {
            that.$toast(data.message)
          }
        }
      })
    },
    _draggable: function () {
      if (this.dropTarget && this.dragTarget && this.role === 'manager') {
        if (this.dragTarget.attr('data-bigtype') && this.dropTarget.attr('data-bigtype') && this.dropTarget.attr('data-bigtype') !== this.dragTarget.attr('data-bigtype')) {
          return false
        }
        // if (this.dropTarget.attr('data-type') !== 'total' && (this.dropTarget.attr('data-index') !== this.dragTarget.attr('data-index'))) {
        //   return 
        // }
        if (this.dropTarget.attr('data-type') !== 'total' && this.dragTarget.attr('data-type') === 'total') {
          return false
        }
        return true
      } else {
        return false
      }
    },
    _dragStart: function (e) {
      this.dragTarget = $(e.target).parents('.app')
      this.dragTarget.addClass('dragging')
      var keyIndex = 0
      var dragType = this.dragTarget.attr('data-type')
      if (dragType === 'total') {
        keyIndex = this.dragTarget.attr('data-key')
        this.dragData = this.appList[keyIndex]
      } else {
        var dragBigtype = this.dragTarget.attr('data-bigtype')
        var typeIndex = this.dragTarget.attr('data-index')
        keyIndex = this.dragTarget.attr('data-key')
        this.dragData = this.typeList[dragBigtype].types[typeIndex].appList[keyIndex]
      }
    },
    _dragEnd: function (e) {
      if (this._draggable()) {
        var oldKey
        var newKey
        var oldIndex
        var newIndex
        var newD
        var dragId = ''
        var bigType = ''
        if (this.dropTarget.attr('data-type') === 'total') {
          oldKey = this.dragTarget.attr('data-key')
          newKey = this.dropTarget.attr('data-key')
          dragId = parseInt(this.dragTarget.attr('data-id'))
          newD = JSON.parse(JSON.stringify(this.dragData))
          if (this.dragTarget.attr('data-type') === 'total') {
            this.appList.splice(oldKey, 1)
            this.appList.splice(newKey, 0, newD)
            this._saveOrder(this, 'popular')
          } else {
            var isIn = false
            this.appList.forEach((ele, i) => {
              if (ele.app.id === dragId) {
                isIn = true
              }
            })
            if (!isIn) {
              this._addPopular((newKey || this.appList.length), (data) => {
                this.appList.splice(newKey, 0, data)
              })
            }
          }
        } else {
          oldKey = parseInt(this.dragTarget.attr('data-key'))
          oldIndex = parseInt(this.dragTarget.attr('data-index'))
          newKey = parseInt(this.dropTarget.attr('data-key'))
          newIndex = parseInt(this.dropTarget.attr('data-index'))
          bigType = this.dragTarget.attr('data-bigtype')
          newD = JSON.parse(JSON.stringify(this.dragData))
          this.typeList[bigType].types[oldIndex].appList.splice(oldKey, 1)
          this.typeList[bigType].types[newIndex].appList.splice(newKey, 0, newD)
          this._saveOrder(this.typeList[bigType].types[oldIndex])
          if (oldIndex !== newIndex) {
            this._saveOrder(this.typeList[bigType].types[newIndex])
          }
        }
      }
      this.dragTarget.removeClass('dragging')
      $('.drag.active').removeClass('active')
      this.dragTarget = null
      this.dropTarget = null
    },
    _dragOver: function (e) {
      if (this._draggable()) {
        e.preventDefault()
      }
    },
    _dragEnter: function (e) {
      if ($(e.target).is('.drag')) {
        this.dropTarget = $(e.target)
      } else {
        this.dropTarget = $(e.target).parents('.drag')
      }
      $('.drag.active').removeClass('active')
      if (this._draggable()) {
        $('.drag.active').removeClass('active')
        this.dropTarget.addClass('active')
      }
    },
    _dragLeave: function (e) {
      this.dropTarget.removeClass('active')
    },
    _saveOrder: function (obj, type) {
      obj.appList.forEach((app, i) => {
        app.sort = i
        if (type !== 'popular') {
          app.appType = {
            id: obj.id,
            name: obj.name,
            sort: obj.sort,
            userType: obj.userType
          }
        }
      })
      var url = ''
      if (type === 'popular') {
        url = '/api/app/popular/sort'
      } else {
        url = '/api/app/sort'
      }
      sAjax({
        url: url,
        type: 'post',
        data: obj.appList,
        success: (data) => {
          if (data.state) {

          } else {
            this.$toast(data.message)
          }
        }
      })
    },
    _editAppType: function (type) {
      this.editType = type.id
      this.newAppName = type.name
    },
    _saveAppType: function (type, index) {
      var that = this
      sAjax({
        url: '/api/app/type/' + type.id,
        type: 'post',
        data: {
          id: type.id,
          name: this.newAppName,
          userType: type.userType,
          sort: type.sort
        },
        success: function (data) {
          if (data.state) {
            that.editType = ''
            type.name = that.newAppName
          } else {
            that.$toast(data.message)
          }
        }
      })
    },
    _removeAppType: function (type, index, bigTypeObj) {
      if (type.appList.length > 0) {
        this.$toast(this.translate.appExistTip)
      } else {
        if (confirm(this.translate.appTypeRemoveConfirm)) {
          this.$waiting.show()
          sAjax({
            url: '/api/app/type/' + type.id + '/delete',
            type: 'post',
            success: (data) => {
              if (data.state) {
                bigTypeObj.types.splice(index, 1)
                this.$toast('', 0, 'check')
              } else {
                this.$toast(data.message)
              }
            }
          }).always(() => {
            this.$waiting.close()
          })
        }
      }
    },
    _createAppType: function () {
      if (this.newType.name === '') {
        this.$toast(this.translate.appAddTip1)
        return
      }
      if (this.newType.userType === '') {
        this.$toast(this.translate.appAddTip2)
        return
      }
      var bigTypeObj = null
      for (var i in this.typeList) {
        if (this.typeList[i].userType === this.newType.userType) {
          bigTypeObj = this.typeList[i]
        }
      }
      this.$waiting.show()
      sAjax({
        url: '/api/app/type',
        type: 'post',
        data: {
          name: this.newType.name,
          userType: this.newType.userType,
          sort: bigTypeObj.types.length
        },
        success: (data) => {
          if (data.state) {
            this.showTypeModal = false
            bigTypeObj.types.push({ id: data.data.id, name: this.newType.name, appList: [], userType: this.newType.userType, sort: 0 })
            this.$toast('', 0, 'check')
          } else {
            this.$toast(data.message)
          }
        }
      }).always(() => {
        this.$waiting.close()
      })
    },
    _removeApp: function (appList, index, type) {
      var url = ''
      if (type) {
        url = '/api/app/popular/' + appList[index].id
      } else {
        url = '/api/app/' + appList[index].id
      }
      if (confirm(this.translate.appRemoveConfirm)) {
        sAjax({
          url: url,
          type: 'post',
          success: (data) => {
            if (data.state) {
              appList.splice(index, 1)
              this._initPopular()
              this.$toast('', 0, 'check')
            } else {
              this.$toast(data.message)
            }
          }
        })
      }
    },
    _editApp: function (app, typeObj) {
      if (this.role !== 'department') {
        return
      }
      // if (this.newApp.settingType === 'LINK') {
      //   this.$toast(this.translate.editTip1)
      //   return
      // }
      if (app) {
        this.$waiting.show()
        this.curApp = app
        this.appName = this.curApp.name
        if (app.appType && app.appType.userType) {
          this.appUserType = app.appType.userType
        }
        if (app.setting.type === 'WORKFLOW') {
          this.miniRoutes = 'appInfo'
        } else if (app.setting.type === 'LINK') {
          this.miniRoutes = 'link'
          this.curCheckRoutes = 'link'
        } else {
          this.miniRoutes = 'formEngine'
          this.curCheckRoutes = 'formEngine'
        }
        this.$waiting.close()
      } else {
        if (this.newApp.name === '' || !this.newApp.settingType || !this.newApp.appTypeId) {
          this.$toast(this.translate.editTip2)
          return
        }
        this.$waiting.show()
        this.appName = this.newApp.name
        this.newApp.departmentId = this.departmentId
        this.newApp.sort = typeObj.appList.length
        this.showAddModal = false
        sAjax({
          url: '/api/app',
          type: 'post',
          data: this.newApp,
          success: (data) => {
            if (data.state) {
              this.appUserType = data.data.appType.userType
              this.curApp = { id: data.data.id, name: data.data.name, imgPath: data.data.imgPath, setting: { type: data.data.setting.type } }
              // 避免弹窗关闭不及时造成页面点击出问题
              setTimeout(() => {
                if (data.data.setting.type === 'WORKFLOW') {
                  this.miniRoutes = 'appInfo'
                } else if (data.data.setting.type === 'LINK') {
                  this.miniRoutes = 'link'
                  this.curCheckRoutes = 'link'
                } else {
                  this.miniRoutes = 'formEngine'
                  this.curCheckRoutes = 'formEngine'
                }
              }, 600);
              typeObj.appList.push(this.curApp)
              this.$toast('', 0, 'check')
              // $(".app-page").animate({ scrollTop: 0 }, 500);
            } else {
              this.$toast(data.message)
            }
          }
        }).always(() => {
          this.$waiting.close()
        })
        this.curApp = null
      }
    },
    _addPopular: function (sort, callback) {
      sAjax({
        url: '/api/app/popular',
        type: 'post',
        data: {
          app: this.dragData,
          sort: sort
        },
        success: (data) => {
          if (data.state) {
            callback(data.data)
          } else {
            this.$toast(this.translate.appAddTip3)
          }
        }
      })
    },
    _saveFormInfo: function (obj) {
      var url = ''
      if (this.businessId) {
        url = '/api/app/' + this.curApp.id + '/publishBusiness/' + this.businessId + '/formSetting'
      } else {
        url = '/api/apps/' + this.curApp.id + '/settings/forms'
      }
      this.$waiting.show()
      sAjax({
        url: url,
        type: 'post',
        data: obj,
        success: (data) => {
          if (data.state) {
            this.$toast(this.translate.saveSuccessTip1, 0, 'check')
            // that.miniRoutes = that.parentPage
            this._backToPage(this.parentPage)
          } else {
            this.$toast(data.message)
          }
        }
      }).always(() => {
        this.$waiting.close()
      })
    },
    _saveFlowInfo: function (obj) {
      var url = ''
      if (this.businessId) {
        url = '/api/app/' + this.curApp.id + '/publishBusiness/' + this.businessId + '/flowSetting'
      } else {
        url = '/api/apps/' + this.curApp.id + '/settings/flows'
      }
      this.$waiting.show()
      sAjax({
        url: url,
        type: 'post',
        data: obj,
        success: (data) => {
          if (data.state) {
            this.$toast(this.translate.saveSuccessTip2, 0, 'check')
            // that.miniRoutes = 'appInfo'
            this._backToPage('appInfo')
          } else {
            this.$toast(data.message)
          }
        }
      }).always(() => {
        this.$waiting.close()
      })
    },
    _savePlayers: function (obj) {
      var url = ''
      if (this.businessId) {
        url = '/api/app/' + this.curApp.id + '/publishBusiness/' + this.businessId + '/playerSetting'
      } else {
        url = '/api/apps/' + this.curApp.id + '/settings/players'
      }
      this.$waiting.show()
      sAjax({
        url: url,
        type: 'post',
        data: obj,
        success: (data) => {
          if (data.state) {
            this.$toast(this.translate.saveSuccessTip3, 0, 'check')
            this._backToPage('formEngine')
          } else {
            this.$toast(data.message)
          }
        }
      }).always(() => {
        this.$waiting.close()
      })
    },
    _setForm: function (obj, parentPage) {
      this.miniRoutes = 'formSetManage'
      this.parentPage = parentPage //'appInfo'
      this.modelId = obj.modelId
      this.initWay = obj.type
      this.businessId = obj.businessId
      this.$emit('fullScreen', true)
    },
    _setFlow: function (obj) {
      this.miniRoutes = 'flowSetManage'
      this.modelId = obj.modelId
      this.businessId = obj.businessId
      this.$emit('fullScreen', true)
    },
    _setJoinRole: function (obj) {
      this.miniRoutes = 'joinRoleSet'
      this.businessId = obj.businessId
      this.$emit('fullScreen', true)
    },
    _backToPage: function (route) {
      this.miniRoutes = route
      this.$emit('fullScreen', false)
    },
    _createApp: function () {
      this.showAddModal = true
      $('.app-type-content').animate({ scrollTop: '0px' }, 100)
      this.newApp.name = ''
      this.newApp.settingType = ''
      this.newApp.appTypeId = ''
    },
    _showImportModal: function () {
      this.showImportModal = true
      $('.app-type-content').animate({ scrollTop: '0px' }, 100)
      this.newApp.appTypeId = ''
      this.selectFileName = this.translate.selectFile
    },
    getFile: function (event) {
      this.formData = new FormData()
      this.fileData = null
      this.fileData = event.target.files[0]
      this.formData.append('file', this.fileData)
      this.clearInputShow = false
      if (this.fileData) { // 如果有文件
        this.selectFileName = this.fileData.name
        this.clearInputShow = true
      }
    },
    _importApp: function (typeObj) {
      if (!this.fileData) {
        return this.$toast('请选择文件')
      }
      if (!this.newApp.appTypeId) {
        this.$toast(this.translate.editTip2)
        return
      }
      this.formData.append('appTypeId', this.newApp.appTypeId)
      this.formData.append('departmentId', this.departmentId)
      this.$waiting.show()
      sAjax({
        url: '/upload/app/import', // 检测上传的文件
        dataType: 'json',
        data: this.formData, // 文件数据
        processData: false, // 不要处理发送的数据
        contentType: false, // 不添加Content请求头
        type: 'post',
        success: (data) => {
          this.showImportModal = false
          if (data.code === '88888') {
            this.curApp = { id: data.data.id, name: data.data.name, imgPath: data.data.imgPath, setting: { type: data.data.setting.type } }
            // 避免弹窗关闭不及时造成页面点击出问题
            setTimeout(() => {
              if (data.data.setting.type === 'WORKFLOW') {
                this.miniRoutes = 'appInfo'
              } else if (data.data.setting.type === 'LINK') {
                this.miniRoutes = 'link'
                this.curCheckRoutes = 'link'
              } else {
                this.miniRoutes = 'formEngine'
                this.curCheckRoutes = 'formEngine'
              }
            }, 600);
            typeObj.appList.push(this.curApp)
            this.$toast('', 0, 'check')
          } else {
            this.$toast(data.message)
          }
        }
      }).always(() => {
        this.$waiting.close()
      })
    }
  },
  beforeDestroy: function () {
    this.$dragging.$off('dragged')
  }
}
</script>
<style lang="less">
.app-page {
  height: 100%;
  overflow: auto;
  &.layout-manage {
    .app-icon-div {
      cursor: move !important;
    }
  }
}
#appManage.row {
  position: relative;
  height: 99%;
  margin: 0 -15px;
  background: #fff;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
  user-select: none;
  overflow: auto;
  .import-btn {
    border-radius: 2px;
    font-size: 13px;
    line-height: 13px;
    padding: 7px 55px;
    width: 163px;
    height: 38px;
    margin: 0 0 10px 102px;
    font-weight: 500;
    background: rgba(63, 81, 181, 0.12);
    color: #298df7;
  }
  .upload-text {
    margin-top: 4px;
    font-weight: 500;
    cursor: pointer;
    width: 163px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .upload-template[type="file"] {
    width: 163px;
    height: 38px;
    margin: 0 auto;
    position: absolute;
    margin: -49px 0 0 102px;
    opacity: 0;
    filter: alpha(opacity=0);
    z-index: 2;
    cursor: pointer;
  }
  .head {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    padding: 0 14px 0 20px;
    border-bottom: 1px solid #e0e0e0;
    h3 {
      margin: 0 6px;
      font-size: 16px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.67);
      line-height: 63px;
      letter-spacing: 2;
      .info-value {
        border: none;
        .dropdown-toggle {
          border: none;
          box-shadow: none;
        }
      }
    }
    .import-file-btn {
      margin-left: 10px;
    }
    button {
      padding: 5px 13px;
      margin-top: 10px;
      font-size: 13px;
      color: #ffffff;
      line-height: 28px;
      background: #298df7;
      box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
      border-radius: 4px;
      i {
        float: left;
        margin-right: 12px;
        font-size: 24px;
        color: #ffffff;
      }
    }
    input.app-search {
      width: 186px;
      height: auto;
      padding: 12px 16px 13px;
      margin-top: 10px;
      margin-right: 12px;
      font-size: 13px;
      line-height: 1;
      color: rgba(0, 0, 0, 0.4);
      background: #f5f5f5;
      border-radius: 4px;
      border: none;
      box-shadow: none;
      outline: none;
    }
    .circle1 {
      display: inline-block;
      padding: 12px;
      margin: -5px -10px -5px auto;
      background: rgba(63, 81, 181, 0.06);
      border-radius: 100px;
      cursor: pointer;
    }
    .circle2 {
      display: inline-block;
      padding: 10px;

      border-radius: 100px;
      i {
        font-size: 24px;
        color: #298df7;
      }
    }
  }

  .body {
    position: absolute;
    left: 0;
    top: 63px;
    bottom: 0px;
    width: 100%;
    height: auto;
    overflow: auto;
  }
  .bigtype {
    padding-bottom: 40px;
    .bigtype-header {
      padding: 20px 26px;
      font-size: 13px;
      color: rgba(0, 0, 0, 0.67);
      line-height: 24px;
      font-weight: 500;
      border-top: 1px solid #e0e0e0;
      overflow: hidden;
      i {
        margin-right: 16px;
        font-size: 24px;
        color: rgba(0, 0, 0, 0.67);
      }
      .move-icon {
        padding: 2px 5px;
        margin-left: 8px;
        border: 1px solid #e0e0e0;
        border-radius: 3px;
        cursor: pointer;
        &.active {
          color: #fff;
          background: #298df7;
          i {
            color: #fff;
          }
        }
      }
    }
  }
  .type-group {
    padding: 20px 26px;
    clear: both;
    overflow: hidden;
    label.type-head {
      font-size: 13px;
      color: rgba(0, 0, 0, 0.36);
      letter-spacing: 0;
      line-height: 18px;
      i {
        margin-left: 5px;
        font-size: 18px;
        color: #bdbdbd;
        cursor: pointer;
        transition: all 0.3s ease-out;
        &:hover {
          color: #ff5252;
        }
      }
    }
    .type-edit {
      width: 208px;
      border-bottom: 2px solid #298df7;
      input.type-name {
        height: auto;
        padding: 0;
        border: 0;
        box-shadow: none;
      }
      span.input-group-addon {
        padding: 6px;
        font-size: 13px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.36);
        letter-spacing: 0;
        line-height: 13px;
        border: 0;
        background: transparent;
        cursor: pointer;
        transition: all 0.3s ease-out;
        &:hover {
          color: #ff5252;
        }
      }
      span.sure {
        &:hover {
          color: #298df7;
        }
      }
    }
    .apps-container {
      padding: 20px 0;
      overflow: hidden;
      clear: both;
      .app {
        position: relative;
        left: 0;
        top: 0;
        z-index: 0;
        display: inline-block;
        width: 110px;
        height: 116px;
        padding: 0 13px;
        opacity: 1;
        border-radius: 0%;
        overflow: hidden;
        transition: all 0.3s ease-out;
        vertical-align: top;
        &:hover {
          i.remove-app,
          .move-app {
            opacity: 1;
          }
        }
        &.dragging {
          // display: none;
          // width: 0;
          // padding: 0;
          opacity: 0.2;
          z-index: 11;
          cursor: move;
          i.remove-app {
            opacity: 0;
          }
        }
        &.active {
          width: 220px;
          .active-show {
            width: 84px;
            height: 119px;
            background: rgba(0, 0, 0, 0.12);
          }
        }

        .add-opts {
          position: absolute;
          left: 0;
          top: 0;
          z-index: 0;
          // opacity: 0;
          width: 100%;
          height: 84px;
          text-align: center;
          background: #fff;
          transform: translateX(-100px);
          transition: all 0.3s ease-out;
          a {
            display: inline-block;
            width: 84px;
            margin: 0 auto 8px;
            font-size: 13px;
            font-weight: 500;
            color: #298df7;
            line-height: 36px;
            text-align: center;
            text-decoration: none;
            background: #e9eaf6;
            border-radius: 2px;
          }
        }
        .app-icon-div {
          width: 66px;
          height: 66px;
          border-radius: 6px;
          margin-bottom: 10px;
          margin-left: 8px;
          box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.08),
            0 3px 3px 0 rgba(0, 0, 0, 0.08);
          transform: translateX(0px);
          transition: all 0.3s ease-out;
          cursor: pointer;
          background-image: linear-gradient(-135deg, #5067d7 0%, #3f53b8 100%);
          i {
            margin: 10px 0 0 11px;
            font-size: 44px;
            background-image: linear-gradient(
              -135deg,
              #ffffff 0%,
              #eeeeee 100%
            );
            background-clip: text;
            -webkit-background-clip: text;
            // -webkit-text-fill-color: transparent;
            text-shadow: 0 0 3px rgba(0, 0, 0, 0.08),
              0 3px 3px rgba(0, 0, 0, 0.08);
          }
        }
        i.app-icon {
          padding: 20px;
          margin-bottom: 8px;
          font-size: 44px;
          letter-spacing: 0;
          line-height: 44px;
          border-radius: 100px;
          background: #f5f5f5;
          opacity: 1;
          transform: translateX(0px);
          transition: all 0.3s ease-out;
          cursor: pointer;
          &:hover {
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.12);
          }
        }
        i.remove-app {
          position: absolute;
          top: 2px;
          right: 6px;
          z-index: 11;
          font-size: 18px;
          color: #bdbdbd;
          opacity: 0;
          transition: all 0.3s ease-out;
          cursor: pointer;
          &:hover {
            color: #ff5252;
          }
        }
        .move-app {
          position: relative;
          float: left;
          left: 32px;
          z-index: 1;
          opacity: 0;
          transition: all 0.3s ease-out;
          cursor: pointer;
          &:active {
            & ~ i.app-icon {
              z-index: 11;
            }
          }
          i {
            position: absolute;
            font-size: 18px;
            color: #bdbdbd;
            &:nth-child(1) {
              transform: rotate(90deg);
            }
            &:nth-child(2) {
              transform: rotate(180deg);
            }
            &:nth-child(3) {
              transform: rotate(270deg);
            }
          }
        }
        p {
          width: 84px;
          margin: 0;
          font-size: 13px;
          color: rgba(0, 0, 0, 0.54);
          letter-spacing: 0;
          line-height: 19px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          text-align: -webkit-center;
          -webkit-box-orient: vertical;
          word-wrap: break-word;
          word-break: break-all;
        }
        .active-show {
          position: absolute;
          right: 13px;
          width: 0;
        }
        &.add {
          i {
            color: #298df7;
            background: #e8eaf6;
          }
          p.add-tip {
            color: #298df7;
          }
          .edit-tip {
            display: none;
            color: rgba(0, 0, 0, 0.54);
            white-space: nowrap;
            font-size: 13px;
            margin-left: -4px;
          }
          // &:hover {
          //   .add-opts {
          //     z-index: 2;
          //     // opacity: 1;
          //     transform: translateX(0px);
          //   }
          //   .app-icon {
          //     transform: translateX(100px);
          //   }
          //   .edit-tip {
          //     display: block !important;
          //   }
          //   .add-tip {
          //     display: none;
          //   }
          // }
        }
      }
    }
    &.dragging-div {
      padding: 5px 26px;
      cursor: move;
      .type-head {
        margin: 0;
      }
      // background: rgba(0, 0, 0, 0.12);
      &.active {
        background: rgba(0, 0, 0, 0.24);
        .type-head {
          color: #fff;
        }
      }
      &:hover {
        background: rgba(0, 0, 0, 0.08);
      }
    }
  }
  .modal-body {
    padding: 11px 15px;
    &.creat-app-body {
      overflow: hidden;
      padding: 11px 0 11px 15px;
    }
    .form-group {
      margin-bottom: 11px;
      input {
        padding-left: 10px;
        padding-right: 10px;
      }
    }
  }
  .modal-input {
    display: inline-block;
    font-size: 13px;
    color: rgba(0, 0, 0, 0.67);
    border: none;
    box-shadow: none;
    outline: none;
  }
  .type-div {
    padding: 4px 0;
    &.row {
      padding: 12px 15px;
      border-top: 1px solid #e0e0e0; // border-bottom: 1px solid #e0e0e0;
    }
    .type-span {
      display: inline-block;
      padding: 6px 16px;
      margin-right: 10px;
      font-size: 13px;
      color: rgba(0, 0, 0, 0.54);
      line-height: 20px;
      background: #eeeeee;
      border-radius: 100px;
      cursor: pointer;
      transition: all 0.3s ease-out;
      i {
        display: none;
        float: left;
        margin-right: 8px;
        font-size: 18px;
        color: rgba(0, 0, 0, 0.54);
      }
      &.active {
        background: #e0e0e0;
        i {
          display: inline-block;
        }
      }
    }
    .app-type-text {
      font-size: 13px;
      color: rgba(0, 0, 0, 0.36);
      line-height: 40px;
      margin-left: 9px;
      margin-top: -12px;
    }
    .app-type-content {
      height: 146px;
      overflow: auto;
      .type-p {
        padding: 11px 10px;
        margin: 0;
        font-size: 13px;
        color: rgba(0, 0, 0, 0.54);
        cursor: pointer;
        i {
          display: none;
          float: left;
          margin-right: 8px;
          font-size: 18px;
          color: rgba(0, 0, 0, 0.54);
        }
        &.active {
          i {
            display: inline-block;
          }
        }
      }
    }
  }
}
</style>
