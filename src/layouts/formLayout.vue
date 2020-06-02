<template>
  <div class="container-fluid form-preview-container">
    <x-header v-if="appSettingType==='FORM' && !mformlayoutIn" class="studentInfo-header">
      <i slot="overwrite-left" class="maticon back-icon" v-html="icons('navigate_before')" @click="_back">navigate_before</i>
      <div class="overwrite-title-demo" slot="overwrite-title">
        <div class="apply-title">{{previewObj.formData?previewObj.formData.name:''}}</div>
        <popup-radio title="" class="stu-type" :options="routeInfo.businessList" v-model="businessId" @on-hide="selectHeaderTab"></popup-radio>
      </div>
    </x-header>
    <div v-else class="header" :class="appSettingType === 'WORKFLOW'?'setBoxShadow':''" >
      <i class="pull-left maticon back" @click="_back" v-html="icons('arrow_back')" v-if="!mformlayoutIn">arrow_back</i>
      <i class="pull-left maticon back"   v-if="mformlayoutIn">&nbsp;&nbsp;</i>
      <div class="pull-left" v-if="appSettingType === 'WORKFLOW'">
        <h4 class="title" :style="`width:${getTitleWidth}px;`">{{previewObj.formData?previewObj.formData.name:''}}</h4>
        <p class="desc" :style="`width:${getTitleWidth}px;`">{{businessName}}</p>
      </div>
      <div class="pull-left" v-else-if="infoSetting">
        <h4 class="title" :style="`width:${getTitleWidth-10}px;margin:0;`">个人信息</h4>
      </div>
    </div>
    <div class="mobile-form-search" v-if="infoSetting">
      <v-select class="types-select" v-model="layoutManageJson.curInfoId" :options="layoutManageJson.infoTypes" dropdown-class="types-dropdown" options-value="id" options-label="title" :min-search="999" close-on-select @afterSelected="_afterSelectTab">
      </v-select>
      <div class="pull-right search-area text-center" @click="searchFieldShow = true">
        <div style="display: inline-block;">
          <i class="maticon pull-left" v-html="icons('search')"></i>
          <span style="margin-left: 4px;">{{searchContent || '输入关键词'}}</span>
        </div>
        <i class="maticon pull-right cancel" v-html="icons('cancel')" @click.stop="_clearSearch" v-if="searchContent"></i>
      </div>
      <div class="divide text-center pull-right">
        <span></span>
      </div>
    </div>
    <div class="workflowPreview-content" v-if="appSettingType === 'WORKFLOW'">
      <!-- <preview :appid="appId" :data="previewObj.formData.components" :title="previewObj.formData.name" :script="previewObj.formData.property.script" :authorities="previewObj.authorities" :defaultData="previewObj.recordData" :fileServer="uploadFile" :log="previewObj.log" @submit="_submit" v-if="previewShow"></preview> -->
      <preview :appid="appId" :data="previewObj.formData.components" :title="previewObj.formData.name" :script="previewObj.formData.property.script" :authorities="previewObj.authorities" :defaultData="previewObj.recordData" :fileServer="uploadFile" :log="previewObj.log" @submit="_submitForForm" :previewType="'form'" v-if="!routeInfo.data.nodeId&&previewShow"></preview>
      <preview :appid="appId" :data="previewObj.formData.components" :title="previewObj.formData.name" :script="previewObj.formData.property.script" :authorities="previewObj.authorities" :defaultData="previewObj.recordData" :fileServer="uploadFile" :log="previewObj.log" @submit="_submit" v-else-if="previewShow"></preview>
    </div>
    <div class="personal-info-preview" v-else-if="infoSetting">
      <preview :appid="appId" ref="infoForm" :data="layoutManageJson.layoutsJson[layoutManageJson.curInfoId]&&layoutManageJson.layoutsJson[layoutManageJson.curInfoId].components" :defaultData="layoutManageJson.instanceJson[layoutManageJson.curInfoId]" :log="layoutManageJson.logsJson[layoutManageJson.curInfoId]" :script="layoutManageJson.layoutsJson[layoutManageJson.curInfoId]&&layoutManageJson.layoutsJson[layoutManageJson.curInfoId].property&&layoutManageJson.layoutsJson[layoutManageJson.curInfoId].property.script" :previewType="'form'" :infoSetting="{
          tabs: layoutManageJson.infoTypes,
          curInfoId: layoutManageJson.curInfoId
        }" @submit="_getInfoValue" @submitAll="_submitAll" @search="_getInfoTypes(null, $event)" v-if="layoutManageJson.preview">
      </preview>
    </div>
    <div v-else>
      <m-advanced-search v-if="isSelect!=='guide'&&businessId&&currentTabIdx!=='myForm'" :curBusinessId="businessId" ref="searchRef" :curCountNodeId="nodeId" @search="onAdvancedSearch"></m-advanced-search>
      <div class="search-tabbar" v-if="!mformlayoutIn">
        <div class="search-tabbar-item" :class="{active:isSelect==='guide'}" @click="_switchTab('guide')">指南</div>
        <popup-radio v-if="tabs.length>0" title="" class="search-tabbar-item" @on-show="selectTab" :class="{active:isSelect!=='guide'}" :options="tabs" v-model="currentTabIdx"></popup-radio>
      </div>

      <!-- <div class="form-nav" v-if="canApplyOnAuthority">
        <div class="form-tab" v-for="(item,i) in tabs" :key="i" :class="{active:isSelect == item.id}" @click="changeTab(item.id)">
          {{item.name}}
        </div>
      </div> -->
      <div>
        <div class="guide-content" v-if="isSelect === 'guide' && !mformlayoutIn">
          <div class="guide-info">
            <div class="guide-title">
              办理指南
            </div>
            <div class="guide-content-detail" v-html="guideConent"></div>
            <!-- <div class="business-time">
              <div v-for="(item,i) in businessTime" :key="i">
                <p>{{item.playerName}}</p>
                <p>
                  <span>开始时间：</span>
                  <span>{{ item.startDate  || '未设置'}}</span>
                </p>
                <p>
                  <span>结束时间：</span>
                  <span>{{ item.endDate || '未设置'}}</span>
                </p>
              </div>
            </div> -->
          </div>
        </div>
        <div class="formPreview-content" v-else-if="currentTabIdx==='myForm'">
          <div v-if="!multiForm">
            <!-- <preview :appid="appId" ref="getBackData" :data="previewObj.formData.components" :title="previewObj.formData.name" :backArrowControl="false" :script="previewObj.formData.property.script" :defaultData="previewObj.recordData" :fileServer="uploadFile" :log="previewObj.log" :saveBtnControl="saveBtnControl" previewType="form" :isDemoData="isDemoData" @goToPayment="_goToPayment" @submit="_save" v-if="previewShow"></preview> -->
            <preview :appid="appId" ref="getBackData" :data="previewObj.formData.components" :title="previewObj.formData.name" :backArrowControl="false" :script="previewObj.formData.property.script" :defaultData="previewObj.recordData" :fileServer="uploadFile" :log="previewObj.log" :saveBtnContrl="saveBtnControl" :previewType="'form'" :isDemoData="isDemoData" @goToPayment="_goToPayment" @submit="_save" v-if="previewShow"></preview>
          </div>
          <div v-else>
            <div class="my-forms-container" v-if="!showPlayerForm">
              <div class="my-forms-list">
                <div class="my-forms-box" v-for="(com, index) in myFormsData" :key="index" @click="checkMyForm(com)">
                  <div class="time">
                    发起时间
                    <p>{{com.createTime}}</p>
                  </div>
                  <div class="my-forms-check pull-right">
                    <i class="glyphicon glyphicon-menu-right week-after-icon"></i>
                  </div>
                </div>
              </div>
              <div class="footer">
                <button class="add-new" @click="_addForm">新增</button>
              </div>
            </div>
            <div v-else>
              <preview :appid="appId" :data="previewObj.formData.components" :title="previewObj.formData.name" :backArrowControl="false" :script="previewObj.formData.property.script" :defaultData="previewObj.recordData" :fileServer="uploadFile" :log="previewObj.log" :saveBtnContrl="saveBtnControl" :previewType="'form'" :isDemoData="isDemoData" @goToPayment="_goToPayment" @submit="_save" @back="backToP"></preview>
            </div>
          </div>
        </div>
        <div v-else class="formPreview-content">
          <div class="info-list">
            <m-table :url='tableUrl' :pageParams="advancedInfo" ref="tableRef" @clickRow=clickRow @onLoad=onLoadTable :columns=tableColumn></m-table>
          </div>
          <div class="bottom-info-num">
            <span>共</span>
            <span class="highlight">{{tableDataTotal || 0}}</span>
            <span>条信息</span>
          </div>
        </div>
      </div>
    </div>
    <div class="search-field-container" v-if="searchFieldShow">
      <div class="header">
        <i class="pull-left maticon back" style="width:58px;" @click="_closeSearch" v-html="icons('arrow_back')" v-if="!mformlayoutIn">arrow_back</i>
        <i class="pull-left maticon back"   v-if="mformlayoutIn">&nbsp;&nbsp;</i>
        <span class="pull-right search-btn">搜索</span>
        <div class="pull-left input-group" :style="`width:${getTitleWidth - 70}px;`">
          <span class="input-group-addon"><i class="maticon" v-html="icons('search')"></i></span>
          <input class="form-control" type="text" placeholder="请输入关键字" v-model="searchContent" v-focus @change="_searchField()">
        </div>
      </div>
      <div class="search-list">
        <div class="search-list-item" v-for="(item, i) in searchFields" :key="i" @click="_showField(item)">
          <div class="item-content pull-left">
            <label>{{item.title}}</label>
            <p>来自：{{item.typeTitle}}</p>
          </div>
          <span class="arrow pull-right"><i class="maticon" v-html="icons('expand_more')"></i></span>
        </div>

      </div>
      <div class="text-center" style="line-height: 3;color: #929292;" v-if="searchFields.length === 0">
        无记录
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import $ from 'jquery'
import { sAjax, translation,request } from '../assets/utils/utils.js'
import MAdvancedSearch from '../mobile/components/MAdvancedSearch.vue'
import MTable from '../mobile/components/MTable.vue'
export default {
  props: {
    appId: {
      default: null
    },
    routeInfo: {
      default: ''
    },
    infoSetting: {
      default: null
    },
    mformlayoutIn: {
      default: false
    },
  },
  created: function () {
    var that = this
    //演示数据

    if (this.routeInfo && this.routeInfo.type && this.routeInfo.type.typeTitle) {
      if (this.routeInfo.type.typeTitle.indexOf('在线缴费') >= 0) {
        this.isDemoData = true
      }
    }
    if (this.infoSetting) {

    } else if (this.routeInfo) {
      this.appId = this.routeInfo.data.appId
      this.instanceId = this.routeInfo.data.instanceId
      this.nodeId = this.routeInfo.data.nodeId
      this.isOldMobileFlog = false
      this.initNormalTable()
    } else {
      this.appId = this.GetQueryString('appId')
      this.instanceId = this.GetQueryString('instanceId') || ''
      this.nodeId = this.GetQueryString('nodeId')
      this.isOldMobileFlog = true
    }
   
    if (!this.infoSetting && !this.mformlayoutIn) {
      this.getBuessNow()
    } 
    else if(this.mformlayoutIn){
    }
    else {
      this._resetLayoutManageJson()
      this.layoutManageJson.userId = this.infoSetting.userId
      this.layoutManageJson.infomationType = this.infoSetting.type
      if (this.layoutManageJson.infoTypes.length > 0) {
        this._initInfoType(this.layoutManageJson.infoTypes[0])
      } else {
        this._getInfoTypes(() => {
          this._initInfoType(this.layoutManageJson.infoTypes[0])
        })
      }
      
    }
     if(this.mformlayoutIn) {
         const {appid,businessId} = this.$route.params
         const {instanceId,playerId} = this.$route.query
         let playerIds = playerId
         if(!playerIds) {
           if (this.routeInfo.players.length > 0) {
             //用最后面的
             playerIds = this.routeInfo.players[parseInt(this.routeInfo.players.length-1)].id
           } else {
             //不给看
             this.playerIds = ''
           }
         }
        this.appId = appid
        this.instanceId = instanceId
        this.isOldMobileFlog = false
        this.playerId = playerIds
        this.nodeId = playerIds
        this.businessId = businessId
        this.appSettingType = 'FORM'
        this.checkOtherForm()
      }
  },
  data() {
    return {
      keepData: {},//表单暂存数据
      previewShow: false,
      searchFieldShow: false,
      searchFields: [],
      searchContent: '',
      instanceId: '',
      businessId: '',
      nodeId: '',
      businessName: '',
      doNotClosePreview: ['countermand', 'carbonCopy'],
      needAdviceAuthority: ['reject', 'agree', 'disagree', 'carbonCopy', 'transfer'],
      previewObj: {
        formData: null,
        authorities: null,
        recordData: [],
        log: null
      },
      relationShip: {
        'input': 'stringValue',
        'image': 'stringValue',
        'signature': 'stringValue',
        'select': 'stringValue',
        'radio': 'stringValue',
        'checkbox': 'listValue',
        'number': 'floatValue',
        'address': 'addressValue',
        'datetime': 'dateValue',
        'attachment': 'attachmentValue',
        'table': 'tableValue'
      },
      appSettingType: '',
      saveBtnControl: true,
      playerId: '',
      canApplyOnAuthority: false,
      tabs: [],
      isSelect: 'guide',
      guideConent: '',
      businessTime: [],
      isOldMobileFlog: false,
      tableDataTotal: 0,
      layoutManageJson: {
        infoTypes: [],
        layoutsJson: {},
        logsJson: {},
        instanceJson: {},
        preview: false,
        curInfoId: '',
        distributary: 'owner',
        infomationType: '',
        userId: ''
      },
      isDemoData: null,//演示数据
      backThisPage: false,
      paymentData: [{
        title: '学费缴交',//演示数据
        code: 11001
      }, {
        title: '住宿费缴交',
        code: 11002
      }, {
        title: '团费缴交',
        code: 11003
      }, {
        title: '党费缴交',
        code: 11004
      }, {
        title: 'Student Payment',
        code: 11005
      }, {
        title: '四级报名费缴交',
        code: 11006
      }, {
        title: '六级报名费缴交',
        code: 11006
      }, {
        title: '重修考试费缴交',
        code: 11007
      }, {
        title: '考试费用缴交',
        code: 11008
      }, {
        title: '电费缴交',
        code: 11009
      }],
      multiForm: false,
      showPlayerForm: false,
      myFormsData: [],
      checkFormType: 'check',

      //下面是2.4的新属性
      isSelect: '',
      currentTabIdx: 'myForm',
      tableColumn: [],
      advancedInfo: {},
      tableUrl: ''

    }
  },
  computed: {
    getTitleWidth: function () {
      return $(document).width() - 70
    }
  },
  watch: {
    currentTabIdx(newVal) {
      if (newVal !== 'myForm') {
        this.nodeId = newVal
        this._getMyApplyData()
        
      } else {
        this.nodeId = ''
      }
    },
    businessId(newVal){
      if(!this.mformlayoutIn){
        if(this.nodeId){
        this.getQuoList()
      }else{//我的表单 刷新数据
        let that = this
        this.previewShow = false
        this._apply()
      }
      }
    }
  },
  methods: {
    backToP(){
        showPlayerForm = false
    },
    onLoadTable(tableData) {
      this.tableDataTotal = tableData.total
    },
    getBuessNow() {
      let that = this;
      if (this.routeInfo.businessList && this.routeInfo.businessList.length > 0) {
        this.initBusinessNow(this.routeInfo.businessList)
        return
      }
      sAjax({
        url: '/api/app/' + this.appId + '/business/now?getDetail=false',
        type: 'get',
        success: function (data) {
          if (data.state) {
            that.initBusinessNow(data.data)
          } else {
            that.$toast(data.message)
          }
        }
      })
    },
    initBusinessNow (data) { 
      let that = this
      that.appSettingType = data[0].appSettingType
      that.canApplyOnAuthority = data[0].canApplyOnAuthority
      that.businessId = that.GetQueryString('businessId') || data[0].business.id
      that.multiForm = data[0].multiForm
      if (that.appSettingType !== "WORKFLOW" && that.routeInfo.businessList && !that.mformlayoutIn) {
        that.formatTab()
      }
      if (that.instanceId && that.instanceId !== 'undefined') {
        that._getLog(that.instanceId, (data) => {
          that.previewObj.log = data || null
        })
        that._getAuthorityData(that.instanceId, (data) => {
          that.previewObj.authorities = data || []
        })
        if (!that.mformlayoutIn) {
            that._getFormLayout(that.businessId, that.nodeId, (data) => {
            that.previewObj.formData = data
            that.previewObj.formData.components.forEach((ele) => {
              Vue.set(ele, 'x', ele.location.left)
              Vue.set(ele, 'y', ele.location.top)
              Vue.set(ele, 'w', ele.size.width)
              Vue.set(ele, 'h', ele.size.height)
            })
            that._getInitData(that.instanceId, (data) => {
              that.previewObj.recordData = data
              that.previewShow = true
            })
          })
        }
      } else {
        that.guideConent = data[0].business.guide
        if(that.appSettingType == "WORKFLOW") {
          that._apply()
        }
        
      }
    },
    onAdvancedSearch(info) {
      this.advancedInfo = info
      //过滤掉高级搜索加的列
      this.tableColumn = this.tableColumn.filter(column => {
        return column.id !== 'advancedColumn'
      })
      if (this.$refs.searchRef) {
        this.$refs.searchRef.advancedSearch.searchItems.forEach(o => {
          this.tableColumn.push({
            id: 'advancedColumn',
            formatter(obj) {
              return obj.formData[o.table]
            }
          })
        })
      }
    },
    clickRow(o) {
      this._clickApplyDetail(o.row)
    },
    _clickApplyDetail: function (obj) {
      this.appId = obj.appId
      this.instanceId = obj.id
      this.isOldMobileFlog = false
      // this.appSettingType = 'WORKFLOW'
      let that = this
      this.checkOtherForm()
    },
    selectTab() {
      this._getMyApplyData()
      this.isSelect = false
      // if(this.currentTabIdx == 'myForm') {
      //   this._apply()
      // }
    },
    selectHeaderTab() {
     if(!this.mformlayoutIn){
        this.formatTab()
      this._getMyApplyData()
     }
    },
    _getMyApplyData: function () {
      this.tableUrl = `/table-data/formEngine/business/${this.businessId}/formInstances?playerId=${this.nodeId}`
    },
    _switchTab(index) {
      this.isSelect = index
    },
    formatTab() {
      // let curBusiness
      let that = this
      this.tabs = []
      this.routeInfo.businessList.forEach(o => {
        if (o.key === this.businessId) {
          this.curBusiness = o
          if(this.nodeId) {
              this._getFormLayout(this.businessId, this.nodeId, (data) => {
                this.previewObj.formData = data
                this.previewObj.formData.components.forEach((ele) => {
                  Vue.set(ele, 'x', ele.location.left)
                  Vue.set(ele, 'y', ele.location.top)
                  Vue.set(ele, 'w', ele.size.width)
                  Vue.set(ele, 'h', ele.size.height)
                })

                this._getInitMyFormData(this.businessId, (data) => {
                this.previewObj.recordData = data
                this.previewShow = true
                if (this.previewObj.recordData) {
                  this._getMyFormLog(this.previewObj.recordData.id, this.playerId, this.businessId, (data) => {
                    this.previewObj.log = data || null
                  })
                }
              })
            })
          }
        }
      })

      if(this.curBusiness.canApplyOnAuthority) {
        this.tabs.push({ 'key': 'myForm', 'value': '我的表单' })
        // this._apply()
        this.currentTabIdx = 'myForm'
      }
      this.getBusinessplayerAndNodes(this.businessId, (data) => {
        this.curBusiness.players = data.players || []
        this.curBusiness.players.forEach(player => {
          this.tabs.push({ 'key': player.id, 'value': player.name })
        })
        if(this.tabs.length>0) {
          this.currentTabIdx = this.tabs[0].key
        }
      })
      if (!this.curBusiness.canApplyOnAuthority && this.tabs.length > 0) {
        this.currentTabIdx = this.tabs[this.tabs.length - 1].key
      }
      
    },
    getBusinessplayerAndNodes(businessId, callback) {
      let that = this
      sAjax({
        // 根据表单ID获取初始数据
        url: `/api/app/${businessId}/business/playerAndNodes`,
        type: "get",
        success: function (data) {
          if (data.state) {
            callback(data.data);
          } else {
            that.$toast(data.message);
          }
        }
      });
    },
    initNormalTable() {
      this.tableColumn = [
        {
          id: 'name',
          title: '姓名',//title是没用的,为了方面代码阅读就留着吧
          formatter(obj) {
            return obj.owner.name
          }
        },
        {
          id: 'userNo',
          title: '学号',
          formatter(obj) {
            return obj.owner.userNo
          }
        },
        {
          id: 'collegeName',
          title: '学院',
          formatter(obj) {
            return obj.owner.collegeName
          }
        },
        {
          id: 'educationLevel',
          title: '培养层次',
          formatter(obj) {
            return obj.owner.educationLevel
          }
        }
      ]
    },





    // 上面都是2.4的新方法

    _addForm: function () {
      this.checkFormType = 'add'
      var nId = 'owner'
      this.instanceId = ''
      this._getFormLayout(this.businessId, nId, (data) => {
        this.previewObj.formData = data
        this.previewObj.formData.components.forEach((ele) => {
          // 将formData中location和size的属性提到外层，即直接作为ele的属性，动态设置属性采用Vue.set不采用赋值
          Vue.set(ele, 'x', ele.location.left)
          Vue.set(ele, 'y', ele.location.top)
          Vue.set(ele, 'w', ele.size.width)
          Vue.set(ele, 'h', ele.size.height)
        })
        this.showPlayerForm = true
        this.previewObj.recordData = null
      })
    },
    checkOtherForm() {
      this.checkFormType = 'check'
      this._getFormLayout(this.businessId, this.nodeId, (data) => {
        this.previewObj.formData = data
        this.previewObj.formData.components.forEach((ele) => {
          // 将formData中location和size的属性提到外层，即直接作为ele的属性，动态设置属性采用Vue.set不采用赋值
          Vue.set(ele, 'x', ele.location.left)
          Vue.set(ele, 'y', ele.location.top)
          Vue.set(ele, 'w', ele.size.width)
          Vue.set(ele, 'h', ele.size.height)
        })

        this._getInitOtherDataCheck(this.instanceId, (data) => {
          this.previewObj.recordData = data
          this.showPlayerForm = true
          this.previewShow = true
          if (this.previewObj.recordData) {
            this._getMyFormLog(this.instanceId, this.nodeId, this.businessId, (data) => {
              this.previewObj.log = data || null
              this.appSettingType = 'WORKFLOW'
              this.backThisPage = true
            })
          }
        })
      })
    },
    checkMyForm: function (com) {
      this.checkFormType = 'check'
      var nId = 'owner'
      this.instanceId = com.id
      this._getFormLayout(this.businessId, nId, (data) => {
        this.previewObj.formData = data
        this.previewObj.formData.components.forEach((ele) => {
          // 将formData中location和size的属性提到外层，即直接作为ele的属性，动态设置属性采用Vue.set不采用赋值
          Vue.set(ele, 'x', ele.location.left)
          Vue.set(ele, 'y', ele.location.top)
          Vue.set(ele, 'w', ele.size.width)
          Vue.set(ele, 'h', ele.size.height)
        })
        this._getInitDataCheck(com.id, (data) => {
          this.previewObj.recordData = data
          this.showPlayerForm = true
          if (this.previewObj.recordData) {
            this._getMyFormLog(com.id, 'owner', this.businessId, (data) => {
              this.previewObj.log = data || null
            })
          }
        })
      })
    },
    _getInitOtherDataCheck: function (instanceId, callback) {
      var that = this
      sAjax({
        // 根据表单ID获取初始数据
        url: `/api/formEngine/formInstance/${instanceId}?playerId=${this.nodeId}`,
        type: "get",
        success: function (data) {
          // if (!data.data.editable) {
          //   that.saveBtnContrl = false;
          // }
          if (data.state) {
            callback(data.data);
          } else {
            that.$toast(data.message);
          }
        }
      });
    },
    _getInitDataCheck: function (instanceId, callback) {
      var that = this
      sAjax({
        // 根据表单ID获取初始数据
        url: `/api/formEngine/formInstance/${instanceId}`,
        type: "get",
        data: {
          playerId: 'owner'
        },
        success: function (data) {
          // if (!data.data.editable) {
          //   that.saveBtnContrl = false;
          // }
          if (data.state) {
            callback(data.data);
          } else {
            that.$toast(data.message);
          }
        }
      });
    },
    _goToPayment: function () {
      //演示数据
      this.paymentData.forEach((ele, index) => {
        if (this.routeInfo.type.childName.indexOf(ele.title) >= 0) {
          window.location.href = '/aggregation/payment/ccb/check?code=' + ele.code
        }
      })
    },
    GetQueryString: function (name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]); return null;
    },
    _getLog: function (instanceId, callback) {
      sAjax({
        url: '/api/processEngine/processInstances/' + instanceId + '/handleLogs',
        type: 'get',
        success: (data) => {
          if (data.state) {
            callback(data.data)
          } else {
            this.$toast(data.message)
          }
        }
      })
    },
    _getInitData: function (instanceId, callback) {
      let that = this
      sAjax({
        url: '/api/processEngine/processInstances/' + instanceId,
        type: 'get',
        success: (data) => {
          if (data.state) {
            callback(data.data)
          } else {
            that.$toast(data.message)
          }
        }
      })
    },
    _getInitCache: function (businessId, callback) {
      sAjax({
        url: '/api/processEngine/business/' + businessId + '/formData/caches',
        type: 'get',
        success: (data) => {
          if (data.state) {
            callback(data.data)
          } else {
            this.$toast(data.message)
          }
        }
      })
    },
    _getInitMyFormData: function (businessId, callback) {
      var that = this;
      sAjax({
        // 根据表单ID获取初始数据
        url: '/api/formEngine/business/' + businessId + '/myFormInstance',
        type: "get",
        success: function (data) {
          if (data.state) {
            that.saveBtnControl = true;
            if (!(data.data && data.data.editable)) {
              that.saveBtnControl = false;
            }
            callback(data.data);
          } else {
            that.$toast(data.message);
          }
        }
      });
    },
    _getMyFormLog: function (instanceId, playerId, businessId, callback) {
      sAjax({
        url: `/api/formEngine/formInstances/${instanceId}/changeLogs?playerId=${playerId}&businessId=${businessId}`,
        type: 'get',
        success: (data) => {
          if (data.state) {
            callback(data.data)
          } else {
            this.$toast(data.message)
          }
        }
      })
    },
    _getMyFormsData: function () {
      sAjax({
        url: `/api/formEngine/business/${this.businessId}/multi/myFormInstances`,
        type: 'get',
        success: (data) => {
          if (data.state) {
            this.myFormsData = data.data.content
          } else {
            this.$toast(data.message)
          }
        }
      })
    },
    _apply: function () {
      var nId = ''
      if (this.appSettingType === 'WORKFLOW'&&this.routeInfo.data.nodeId) {
        this.previewObj.authorities = null
      } else if (this.appSettingType === 'FORM' || (this.appSettingType === 'WORKFLOW'&&!this.routeInfo.data.nodeId)) {
        this.playerId = 'owner'
        nId = 'owner'
        this._getBusinessTime()
        if (!this.curBusiness.canApplyOnAuthority) {
          this.saveBtnControl = false
          // this.$toast('您无权申请此表单')
          this._getFormLayout(this.businessId, nId, (data) => {
            this.previewObj.formData = data
          })
          return
        }
        if (this.multiForm) {
          this._getMyFormsData()
        }
      }

      this._getFormLayout(this.businessId, nId, (data) => {
        this.previewObj.formData = data
        this.previewObj.formData.components.forEach((ele) => {
          // 将formData中location和size的属性提到外层，即直接作为ele的属性，动态设置属性采用Vue.set不采用赋值
          Vue.set(ele, 'x', ele.location.left)
          Vue.set(ele, 'y', ele.location.top)
          Vue.set(ele, 'w', ele.size.width)
          Vue.set(ele, 'h', ele.size.height)
        })
        if (this.appSettingType === 'WORKFLOW'&&this.routeInfo.data.nodeId) {
          this._getInitCache(this.businessId, (data) => {
            this.previewObj.recordData = data
            this.previewObj.recordData && (this.previewObj.recordData.id = '') //清空id， 避免提交的时候提交该id导致出错
            this.previewShow = true
          })
        } else if (this.appSettingType === 'FORM' || (this.appSettingType === 'WORKFLOW'&&!this.routeInfo.data.nodeId)) {
          if (this.curBusiness.canApplyOnAuthority) {
            if (this.multiForm) {
              return
            }
            this._getInitMyFormData(this.businessId, (data) => {
              this.previewObj.recordData = data
              this.previewShow = true
              if (this.previewObj.recordData) {
                this._getMyFormLog(this.previewObj.recordData.id, this.playerId, this.businessId, (data) => {
                  this.previewObj.log = data || null
                })
              }
            })
          }
        }
      })

    },
    _getBusinessTime: function () {
      var that = this
      sAjax({
        url: `/api/app/business/${this.businessId}/players/time`,
        type: 'get',
        success: function (data) {
          if (data.state) {
            that.businessTime = data.data
          } else {
            that.$toast(data.message)
          }
        }
      })
    },
    _getAuthorityData: function (instanceId, callback) {
      sAjax({
        url: '/api/processEngine/processInstances/' + instanceId + '/operations',
        type: 'get',
        success: (data) => {
          if (data.state) {
            callback(data.data)
          } else {
            this.$toast(data.message)
          }
        }
      })
    },
    _getFormLayout: function (businessId, nodeId, callback) {
      var that = this
      var url = ''
      if (this.appSettingType === 'WORKFLOW'&&this.routeInfo.data.nodeId) {
        nodeId = nodeId == 'owner' ? "" : nodeId
        url += '/api/processEngine/business/' + businessId + '/formRenderData?nodeId=' + nodeId
      } else if (this.appSettingType === 'FORM'||(this.appSettingType === 'WORKFLOW'&&!this.routeInfo.data.nodeId)) {
        if (this.multiForm) {
          url += '/api/formEngine/business/' + businessId + '/formRenderData?playerId=owner&withData=true'
        } else {
          url += '/api/formEngine/business/' + businessId + '/formRenderData?playerId=' + nodeId
        }
      }
      sAjax({
        url: url,
        type: 'get',
        success: function (data) {
          if (data.state) {
            callback(data.data)
          } else {
            that.$toast(data.message)
          }
        }
      })
      sAjax({
        url: '/api/app/' + this.appId + '/business/' + this.businessId,
        type: 'get',
        success: function (data) {
          if (data.state) {
            that.businessName = data.data.business.name
          } else {
            that.$toast(data.message)
          }
        }
      })
    },
    _submit: function (obj) {
      if (this.needAdviceAuthority.indexOf(obj.type) >= 0) {
        this.$prompt({
          tip: '确认' + obj.title + '?',
          placeholder: '请输入批复意见',
          callback: (res) => {
            if (res.type === 'ok') {
              this._submitAction(obj, res.text)
            }
          }
        })
      } else if (obj.type === 'cancel') {
        this.$vux.confirm.show({
          content: '确认要放弃本申请吗？放弃后申请作废',
          onConfirm: () => {
            this._submitAction(obj)
          }
        })
      } else {

        this.$vux.confirm.show({
          content: "确认" + obj.title + '?',
          onConfirm: () => {
            this._submitAction(obj)
          }
        })
      }
    },
    // 提交
    _submitForForm: function (obj) {
      if(this.mformlayoutIn){
         const {playerId} = this.$route.query
         let playerIds = playerId
         if(!playerIds){
           if(this.routeInfo.players.length > 0){
             playerIds = this.routeInfo.players[parseInt(this.routeInfo.players.length-1)].id
           }else{
             playerIds = ''
           }
         }
         this.playerId = playerIds
         this.currentTabIdx = this.playerId 
      }
      if (obj.previewformType === "childerPage") {
        let url;
        var parms = {};
        var method = "";
        if (obj.type === "submit") {
       
            url = `/api/formEngine/formInstance/${this.previewObj.recordData.id}`;
            parms = {
              // formData为来自子组件的dataArr,存放的是表单控件内容
              formData: obj.formData,
              playerId: this.currentTabIdx
            };
            method = "post";
          
        }
        sAjax({
          url: url,
          type: method,
          data: parms,
          success: data => {
            if (data.state) {
              this.instanceId = data.data.id;
            } else {
              this.$toast(data.message);
            }
          }
        });
      } else {
         this.$vux.confirm.show({
          content: "确认保存?",
          onConfirm: () => {
              // 提交保存
            let url;
            if (obj.type === "submit") {
              url = `/api/formEngine/formInstance/${this.previewObj.recordData.id}`;
            }
            // this.$waiting.show();
            let formData = obj.formData.map(o => {
                if (o.name.indexOf("map") > -1) {
                  delete o.value.locationValue.target;
                }
                return o;
            });
            sAjax({
              url: url,
              type: 'post',
              data: {
                // formData为来自子组件的dataArr,存放的是表单控件内容
                formData: formData,
                playerId: this.currentTabIdx
              },
              success: data => {
                if (data.state) {
                  this.preview = false;
                  if (obj.type === "submit") {
                    this.$toast("保存成功");
                    if(!this.mformlayoutIn){
                      setTimeout(() => {
                      this._back()
                    }, 800);
                    }
                  } else {
                  }
                } else {
                  this.$toast(data.message);
                }
              }
            }).always(() => {
              // this.$waiting.close();
            });
          }
        })
      }
    },
    _submitAction: function (obj, msg) {
      var that = this
      var url = ''
      let params = {
          id: this.previewObj.recordData ? this.previewObj.recordData.id : '',
          formData: obj.formData,
          variable: {
            appId: this.appId,
            businessId: this.businessId
          }
        }
      if (obj.type === 'submit') {
        url = '/api/processEngine/processInstances'
      } else if (obj.type === 'transfer' || obj.type === 'carbonCopy') {
        let newParams = {
          runtimeProcessInstancePO:params,
          appNodeQuotaTableList:this.appNodeQuotaTableList||[],
          conditions:this.conditions||[],
        }
        params = newParams
        url = '/api/processEngine/update/processInstances?action=' + obj.type + '&userId=' + obj.userId
      } else if (obj.type === 'save') {
        url = '/api/processEngine/business/' + this.businessId + '/formData/caches'
      } else {
        params.applicant = this.routeInfo.data.applicant
        let newParams = {
          runtimeProcessInstancePO:params,
          appNodeQuotaTableList:this.appNodeQuotaTableList||[],
          conditions:this.conditions||[],
        }
        params = newParams
        url = '/api/processEngine/update/processInstances?action=' + obj.type + (msg ? ('&message=' + msg) : '')
      }
      sAjax({
        url: url,
        type: 'post',
        data: params,
        success: function (data) {
          if (data.state) {
            if (obj.type === 'submit') {
              that.$toast('提交申请成功')
              if (that.isOldMobileFlog) {
                window.location.href = '/mobile/affairList'
              } else {
                that._back()
                // that.$emit('jumpAffariList')
              }

            } else if (that.doNotClosePreview.indexOf(obj.type) >= 0) {
              that.$toast('申请已' + obj.title)
              that._getAuthorityData(that.instanceId, (res) => {
                that.authorities = res || []
              })
            } else {
              that.$toast('申请已' + obj.title)
              that._back()
              // if (that.isOldMobileFlog) {
              //   window.history.go(-1)
              // } else {
              //   that.$emit('jumpAffariList')
              // }
            }
          } else {
            that.$toast(data.message)
          }
        }
      })
    },
    getQuoList(){
      let url = `api/app/quota/${this.appId}/${this.nodeId}/getNodeQuotaTable?businessId=${this.businessId}`
      request(url).then(o => {
        if (o.data.exitQuota) {
          this.appNodeQuotaTableList = o.data.appNodeQuotaTableList
          this.conditions = o.data.conditions
        } 
      })
    },
    _save: function (obj) {
      if (!this.saveBtnControl) {
        alert('没有权限?')
        return
      }
      
      this.$vux.confirm.show({
        content: '是否保存?',
        onConfirm: () => {
          let url
          var parms = {}
          var method = ''
          if (obj.type === "submit") {
            if (this.checkFormType === 'add') {
              url = '/api/formEngine/formInstances'
              parms = {
                id: this.instanceId,
                formData: obj.formData,
                variable: {
                  appId: this.appId,
                  businessId: this.businessId
                }
              }
              method = 'post'
            } else {
              url = `/api/formEngine/formInstance/${this.previewObj.recordData.id}`;
              let formData = obj.formData.map(o => {
                if (o.name.indexOf("map") > -1) {
                  delete o.value.locationValue.target;
                }
                return o;
              });
              parms = {
                // formData为来自子组件的dataArr,存放的是表单控件内容
                formData: formData,
                playerId: this.playerId
              }
              method = 'post'
            }
          }
          let that = this;
          sAjax({
            url: url,
            type: method,
            data: parms,
            success: function (data) {
              if (data.state) {
                that.preview = false;
                if (obj.type === "submit") {
                  if (that.multiForm) {
                    that._getMyFormsData()
                    that.showPlayerForm = false
                  }
                  that.$toast("保存成功");
                } else {
                }
              } else {
                that.$toast(data.message);
              }
            }
          });
        }
      })
    },
    _back: function () {
      if (this.$refs.getBackData && this.$refs.getBackData.modelName == '必填项表单') {
        let data = this.$refs.getBackData.formData
        if (this.$refs.getBackData.isKeep) {  //已点击保存
          window.sessionStorage.removeItem('keepData')
          if (this.backThisPage) {
            this.backThisPage = false
            this.appSettingType = 'FORM'
            return
          }
          if (this.isOldMobileFlog) {
            window.history.go(-1)
          } else {
            this.$emit('back')
          }
          return
        }
        for (var k in data) {
          // if (data[k]) {
          if (k.indexOf('table') >= 0 || k.indexOf('checkbox') >= 0) {
            if (k.indexOf('table') >= 0 && data[k].length) {
              var size = Object.keys(data[k][0]).length
            } else {
              var size = 0
            }
            if ((data[k].length && k.indexOf('checkbox') >= 0) || size > 2) {
              this.$vux.confirm.show({
                content: '您的编辑尚未保存,返回后无法保存数据,是否保存数据?',
                onConfirm: () => {
                  this.keepData = data
                  window.sessionStorage.setItem('keepData', JSON.stringify(data))
                  if (this.isOldMobileFlog) {
                    window.history.go(-1)
                  } else {
                    this.$emit('back')
                  }
                  return

                },
                onCancel: () => {
                  if (this.isOldMobileFlog) {
                    window.history.go(-1)
                  } else {
                    this.$emit('back')
                  }
                  window.sessionStorage.removeItem('keepData')
                  return

                }
              })
            }
          } else {
            if (data[k]) {
              this.$vux.confirm.show({
                content: '您的编辑尚未保存,返回后无法保存数据,是否保存数据?',
                onConfirm: () => {
                  this.keepData = data
                  window.sessionStorage.setItem('keepData', JSON.stringify(data))
                  if (this.isOldMobileFlog) {
                    window.history.go(-1)
                  } else {
                    this.$emit('back')
                  }
                  return

                },
                onCancel: () => {
                  if (this.isOldMobileFlog) {
                    window.history.go(-1)
                  } else {
                    this.$emit('back')
                  }
                  window.sessionStorage.removeItem('keepData')
                  return

                }
              })
            }
          }
          if (this.isOldMobileFlog) {
            window.history.go(-1)
          } else {
            this.$emit('back')
          }
          // }
        }
      } else {
        if (this.backThisPage) {
          this.backThisPage = false
          this.appSettingType = 'FORM'
          return
        }
        if (this.isOldMobileFlog) {
          window.history.go(-1)
        } else {
          this.$emit('back')
        }
      }
    },
    changeTab: function (obj) {
      this.isSelect = obj
      if (obj === 'myForm') {
        this._apply()
      } else {
        this.previewShow = false
      }
    },
    // 查看个人信息需要用到的
    _resetLayoutManageJson: function () {
      this.layoutManageJson.layoutsJson = {}
      this.layoutManageJson.logsJson = {}
      this.layoutManageJson.instanceJson = {}
      this.layoutManageJson.curInfoId = ''
    },
    _getInfoTypes: function (cb) {
      sAjax({
        url: `/api/information/columnTypes/${this.layoutManageJson.infomationType}`,
        type: 'get',
        success: (data) => {
          if (data.state) {
            if (data.data && data.data.length > 0) {
              this.layoutManageJson.infoTypes = data.data || []
              this.layoutManageJson.infoTypes.forEach((type) => {
                this.$set(type, 'title', type.text)
              })
              cb && cb()
            } else {
              this.$toast('信息类型为空，不可查看')
            }
          } else {
            this.$toast(data.message)
          }
        }
      })
    },
    _initInfoType: function (tab) {
      // 获取布局
      if (!tab) { return }
      if (!(this.layoutManageJson.layoutsJson[tab.id] && this.layoutManageJson.logsJson[tab.id])) {
        this.$waiting.show({
          container: '.preview-container'
        })
        sAjax({
          url: `/api/information/infoSetting/${this.layoutManageJson.infomationType}/${tab.id}`,
          type: 'get',
          data: {
            userId: this.layoutManageJson.userId,
            distributary: this.layoutManageJson.distributary
          },
          success: (data) => {
            if (data.state) {
              if (!data.data) {
                data.data = []
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
                url: `/api/information/infoInstance/changeLogs/${this.layoutManageJson.infomationType}/${tab.id}`,
                type: 'get',
                data: {
                  userId: this.layoutManageJson.userId
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
        }).always(() => {
          this.$waiting.close()
        })
      } else {
        this.layoutManageJson.curInfoId = tab.id
        this.$nextTick(() => {
          this.layoutManageJson.preview = true
        })
      }
    },
    _getInfoValue: function (obj) {
      // 获取当前类型数据
      this.$set(this.layoutManageJson.instanceJson, this.layoutManageJson.curInfoId, obj)
    },
    _submitAll: function () {
      // 提交全部修改记录
      var arr = []
      for (var i in this.layoutManageJson.instanceJson) {
        arr.push({ infoId: i, formData: this.layoutManageJson.instanceJson[i].formData })
      }
      if (arr.length === 0) {
        this.$toast('暂无需保存记录')
        return
      }
      this.$waiting.show()
      sAjax({
        url: `/api/information/infoInstance/${this.layoutManageJson.infomationType}/${this.layoutManageJson.distributary}/${this.layoutManageJson.userId}`,
        type: 'post',
        data: {
          typesValue: arr
        },
        success: (data) => {
          if (data.state) {
            this.$toast('保存成功')
            this.layoutManageJson.instanceJson = {}
            // this.layoutManageJson.preview = false

          } else {
            this.$toast(data.message)
          }
        }
      }).always(() => {
        this.$waiting.close()
      })
    },
    _afterSelectTab: function (obj) {
      var ctab = null
      this.layoutManageJson.infoTypes.forEach((tab) => {
        if (obj.value === tab.id) {
          ctab = tab
        }
      })
      if (ctab) {
        this._initInfoType(ctab)
      }
    },
    _searchField: function () {
      sAjax({
        url: `/api/information/fields/${this.layoutManageJson.infomationType}`,
        type: 'get',
        data: {
          userId: this.layoutManageJson.userId,
          keyword: this.searchContent,
          distributary: 'owner'
        },
        success: (data) => {
          this.searchFields = []
          if (data.state) {
            if (data.data.length > 0) {
              // data.data.forEach((ele) => {
              //   ele.components && ele.components.forEach((com) => {
              //     var item = {}
              //     item.infoTypeTitle = ele.name
              //     item.title = com.title
              //     item.name = com.name
              //   })
              // })
              data.data.forEach((type) => {
                type.fields && type.fields.forEach((ele) => {
                  var field = {}
                  field.typeId = type.typeId
                  field.typeTitle = type.name
                  field.id = ele.tableName || ele.name
                  field.title = ele.title
                  this.searchFields.push(field)
                })
              })
            }
          }
        }
      })
    },
    _closeSearch: function () {
      this.searchFieldShow = false
    },
    _clearSearch: function () {
      this.searchContent = ''
      this.$refs.infoForm.searchContent = ''
      this.$refs.infoForm.highLightWigt = ''
    },
    _showField: function (field) {
      this.layoutManageJson.curInfoId = field.typeId
      this._initInfoType({
        id: field.typeId
      })
      // this.$refs.infoForm.searchContent = this.searchContent
      this.$refs.infoForm.highLightWigt = field.id
      this.searchFieldShow = false
    }
  },
  components: {
    MAdvancedSearch,
    MTable
  }
}
</script>

<style lang="less">
@import url("../assets/common.less");
.form-preview-container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  padding-top: 20px;
  background: #f5f5f5;
  padding: 0;
  .my-forms-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #fff;
    .my-forms-list {
      position: absolute;
      top: 120px;
      left: 0;
      bottom: 0;
      width: 100%;
      padding-bottom: 100px;
      overflow: auto;
    }
    .my-forms-box {
      border-bottom: 1px solid #e0e0e0;
      padding: 15px 16px 10px 16px;
      .time {
        display: inline-block;
      }
      .my-forms-check {
        margin-top: 10px;
        display: inline-block;
      }
    }
    .footer {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 60px;
      padding: 10px;
      .add-new {
        width: 100%;
        line-height: 40px;
        color: #fff;
        box-shadow: none;
        outline: none;
        box-shadow: none;
        border: none;
        background: #298df7;
        border-radius: 3px;
      }
    }
  }
  .header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    width: 100%;
    display: flex;
    align-items: center;
    height: 57px;
    background: #ffffff;
    border-bottom: 1px solid #e7e7e7;
    &.setBoxShadow {
      box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.08), 0 4px 4px 0 rgba(0, 0, 0, 0.08);
    }

    i.back {
      padding: 0 15px;
      font-size: 24px;
      color: rgba(0, 0, 0, 0.54);
    }
    .title {
      font-weight: 500;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.67);
      margin: 12px 0 5px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .desc {
      font-size: 10px;
      color: rgba(0, 0, 0, 0.36);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .mobile-form-search {
    position: fixed;
    top: 56px;
    left: 0;
    width: 100%;
    height: 38px;
    border-bottom: 1px solid #e7e7e7;
    background: #fff;
    .v-select div.form-control.dropdown-toggle {
      height: 37px;
      border: none;
    }
    .types-select {
      width: 40%;
    }
    .divide {
      width: 1%;
      margin-top: 10px;
      span {
        display: inline-block;
        width: 1px;
        height: 14px;
        background: #dadada;
      }
    }
    div.search-area {
      position: relative;
      width: 57%;
      height: 37px;
      i,
      span {
        color: #b5b5b5;
        line-height: 38px;
      }
      .cancel {
        position: absolute;
        right: 4px;
        top: 0px;
        padding: 8px;
        font-size: 20px;
        color: #b5b5b5;
        line-height: 1;
      }
    }
  }
  .form-nav {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    width: 100%;
    height: 56px;
    background: #ffffff;
    margin-top: 56px;
    box-shadow: 0 0 0px 0 rgba(0, 0, 0, 0.18), 0 4px 4px 0 rgba(0, 0, 0, 0.18);
    .form-tab {
      width: 50%;
      height: 56px;
      display: inline-block;
      font-size: 13px;
      color: rgba(0, 0, 0, 0.54);
      text-align: center;
      padding-top: 20px;
      cursor: pointer;
      &.active {
        font-weight: 500;
        color: rgba(0, 0, 0, 0.67);
        border-bottom: 2px solid rgba(0, 0, 0, 0.67);
        cursor: default;
      }
    }
  }
  .formPreview-content {
    position: absolute;
    top: 151px;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .workflowPreview-content {
    margin-top: 56px;
  }
  .personal-info-preview {
    position: absolute;
    top: 94px;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
    .form-preview-content {
      padding-top: 0 !important;
    }
  }
  .marginTop-123 {
    margin-top: 123px;
  }
  .marginTop-67 {
    margin-top: 67px;
  }
  .guide-content {
    .guide-info {
      background: #eeeeee;
      border-radius: 4px;
      margin: 12px 8px 20px;
    }

    .guide-title {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.67);
      margin-left: 16px;
      padding: 15px 0;
    }

    .guide-content-detail {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.54);
      margin: 9px 16px 0 16px;
      p img {
        max-width: 100%;
      }
    }

    .business-time {
      margin-top: 16px;
      padding-bottom: 10px;
    }

    .business-time div {
      margin-top: 5px;
    }

    .business-time div p {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.54);
      margin-left: 16px;
      margin-bottom: 0;
    }
  }
  .search-field-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    background: #fafafa;
    -webkit-overflow-scrolling: touch;
    .header {
      border-bottom: none;
      .input-group {
        margin: 11px 12px;
        background: #fafafa;
        border-radius: 3px;
      }
      .input-group-addon,
      .form-control {
        background: transparent;
        border: none;
        box-shadow: none;
      }
      .input-group-addon {
        padding: 0 6px;
      }
      .form-control {
        padding: 6px 0;
        background: transparent;
        border: none;
      }
      .search-btn {
        padding: 0 15px;
        font-size: 14px;
        color: #465aa2;
        line-height: 55px;
      }
    }
    .search-list {
      // position: absolute;
      // top: 56px;
      // left: 0;
      // right: 0;
      // bottom: 0;
      padding: 56px 0 0 12px;
      background: #fff;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      .search-list-item {
        height: 52px;
        overflow: hidden;
        border-bottom: 1px solid #e7e7e7;
        .item-content {
          label {
            margin-top: 5px;
            font-size: 14px;
            color: #454649;
            font-weight: 500;
          }
          p {
            margin: 0;
            font-size: 12px;
            color: #888888;
          }
        }
        .arrow {
          display: inline-block;
          width: 24px;
          height: 24px;
          margin: 10px 12px;
          transform: rotate(-90deg);
          i {
            color: #929292;
          }
        }
      }
    }
  }
}
.types-dropdown {
  .dropdown-menu {
    height: 195px;
    left: 0px;
    top: 92px;
    width: 100%;
    box-shadow: none;
    border-radius: 0;
    border: none;
    li.dropdown-items {
      padding: 13px 10px !important;
      color: #666666;
      border-bottom: 1px solid #e7e7e7;
      label {
        font-size: 14px;
        font-weight: 500;
      }
      &.active {
        color: #465aa2;
      }
    }
  }
  .bottom-cover {
    background: rgba(0, 0, 0, 0.25);
  }
}
.form-preview-container {
  background-color: white;
  .studentInfo-header {
    background: #ffffff;
    height: 56px;
    z-index: 100;
    padding: 0;
    .vux-header-title-area {
      height: 56px;
      margin: 0 64px;
      .apply-title {
        font-size: 16px;
        font-weight: bold;
        color: rgba(0, 0, 0, 0.67);
        line-height: 16px;
        margin: 10px 0 3px 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .business-title {
        font-size: 10px;
        color: rgba(0, 0, 0, 0.36);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .stu-type {
        width: 112px;
        padding-left: 0;
        padding-top: 4px;
      }
      .weui-cell:before {
        border-top: none !important;
      }
      .weui-cell_access .weui-cell__ft:after {
        color: rgba(0, 0, 0, 0.54);
        -webkit-transform: matrix(0.71, 0.71, 0.71, -0.71, 0, 0) !important;
        transform: matrix(0.71, 0.71, 0.71, -0.71, 0, 0) !important;
      }
    }
  }
  .search-tabbar {
    width: 100%;
    display: flex;
    padding: 10px 0;
    background: #fff;
    align-items: center;
    .search-tabbar-item {
      flex: 1;
      text-align: center;
      color: #333;
      height: 24px;
      font-size: 14px;
      font-weight: 500;
      &:first-child {
        border-right: 1px solid rgba(222, 224, 229, 0.5);
      }
    }
    .vux-cell-primary {
      display: none;
    }
    .active {
      color: #298df7;
    }
    .weui-cell:before {
      border-top: none;
    }
    .search-tabbar-item {
      display: flex;
      justify-content: center;
      &.active {
        .weui-cell__ft {
          .vux-cell-value {
            color: #298df7;
          }
        }
        &.weui-cell_access .weui-cell__ft:after {
          border-color: #298df7;
        }
      }
    }
  }
  .info-list {
    padding-bottom: 40px;
  }
  .bottom-info-num {
    width: 100%;
    position: fixed;
    bottom: 0;
    background: #fff;
    height: 20px;
    line-height: 20px;
    text-align: center;
    font-size: 11px;
    color: #909399;
    font-weight: 400;
    .highlight {
      color: #606266;
    }
  }
  .weui-cells_radio .weui-check:checked + .weui-icon-checked:before {
    color: "#298DF7";
  }
  .preview-page.mobile-view .form-preview-content {
    padding-top: 5px;
  }
  .weui-cell_access .weui-cell__ft:after {
    color: rgba(0, 0, 0, 0.54);
    -webkit-transform: matrix(0.71, 0.71, 0.71, -0.71, 0, 0) !important;
    transform: matrix(0.71, 0.71, 0.71, -0.71, 0, 0) !important;
  }
}
</style>
