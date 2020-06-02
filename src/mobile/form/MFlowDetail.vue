<template>
  <div id="flowDetail">
    <view-box>
      <x-header class="studentInfo-header">
        <i slot="overwrite-left" class="maticon back-icon" v-html="icons('navigate_before')" @click="_back">navigate_before</i>
        <div class="overwrite-title-demo" slot="overwrite-title">
          <div class="apply-title">{{data.title}}</div>
          <!-- <div class="stu-type">{{businessName}}</div> -->
          <popup-radio title="" class="stu-type" :options="data.businessList" v-model="curBusinessId" @on-hide="selectHeaderTab"></popup-radio>
          <div class="guide_icon box_flex" @click="getGuide()">
            <img :src="require('../../../mobile_static/image/icon_guide@2x.png')" alt="">
            指南
          </div>
        </div>
      </x-header>
      <m-advanced-search v-if="isSelect!=='guide'" :curBusinessId="curBusinessId" :curCountNodeId="nodeId" @search="onAdvancedSearch"></m-advanced-search>
      <div class="search-tabbar box_flex">
        <!-- <div class="search-tabbar-item" :class="{active:isSelect==='guide'}" @click="_switchTab('guide')">指南</div> -->
        <div class="search-tabbar-item flex_shrink" v-for="tab in tabs" :key="tab.key" :class="{active:tab.key===currentTabIdx}" @click="currentTabIdx = tab.key">{{tab.value}}
          <img class="index_img" :src="require('../../../mobile_static/image/selected@2x.png')" alt="">
        </div>
        <!-- <popup-radio title="" class="search-tabbar-item" @on-show="selectTab" :class="{active:isSelect!=='guide'}" :options="tabs" v-model="currentTabIdx"></popup-radio> -->
      </div>
       <div v-if="currentTabIdx!=='copyToMe'&&currentTabIdx!=='myApplies'" class="search-tabbar box_flex type_tab box_between">
        <div class="search-tabbar-item" v-for="type in tabTypes" :key="type.key" :class="{active:type.key===tabType}" @click="tabType = type.key">{{type.value}}</div>
      </div> 
      <div class="flowDetail-content" :style="{top:currentTabIdx==='copyToMe'||currentTabIdx==='myApplies'?'150px':'190px'}">
        <!-- <div class="guide-container" v-if="isSelect === 'guide'">
          <div class="guide">
            <div class=guide-title>办理指南</div>
            <div class="guide-content" v-html="guide"></div>
            <div>
              <v-table class="mytable" v-for="(table,index) in guideTables" :key="index" :heightAuto="true" :rows="table.rows" :title="table.title" :paginationShow="false" pagesize="10" idField="id" :columns="table.columns" :multiple="false" :order="false" :search="null"></v-table>
            </div>
          </div>
          <div class="apply-btn">
            <x-button class="button" :text="applyText" @click.native="_apply" type="default" :class="{
            'disabled': !(curBusiness.canApplyOnTime&&curBusiness.canApplyOnAuthority)
          }"></x-button>
          </div>
        </div> -->
        <!-- <div> -->
          <div class="info-list">
            <m-table v-if="tableUrl" :url='tableUrl' :pageParams="advancedInfo" ref="tableRef" @onLoad=onLoadTable @clickRow=clickRow :columns=tableColumn></m-table>
          </div>
          <div class="bottom-info-num">
            <span>共</span>
            <span class="highlight">{{tableDataTotal || 0}}</span>
            <span>条信息</span>
          </div>
          <div class="apply-btn" v-if="currentTabIdx==='myApplies'">
            <x-button class="button" :text="applyText" @click.native="_apply" type="default" :class="{
            'disabled': !(curBusiness.canApplyOnTime&&curBusiness.canApplyOnAuthority)
          }"></x-button>
          </div>
        <!-- </div> -->
      </div>
    </view-box>
    <!-- <popup v-model="showGuide" is-transparent=true >
      <div class="guide">
        <div class=guide-title>办理指南</div>
        <div class="guide-content" v-html="guide"></div>
        <div>
          <v-table class="mytable" v-for="(table,index) in guideTables" :key="index" :heightAuto="true" :rows="table.rows" :title="table.title" :paginationShow="false" pagesize="10" idField="id" :columns="table.columns" :multiple="false" :order="false" :search="null"></v-table>
        </div>
      </div>
    </popup> -->
    <v-modal :show="showGuide" :large="true" class="guide_modal" :backdrop="true" @onHide="hideGuide()" effect="fade" width="320">
      <div slot="modal-body" class="modal-body">
        <div class="guide">
        <div class='guide-title'>操作指南
          <img class="index_img" :src="require('../../../mobile_static/image/selected@2x.png')" alt="">
        </div>
        <div class="guide-content" v-html="guide"></div>
        <div>
          <v-table class="mytable" v-for="(table,index) in guideTables" :key="index" :heightAuto="true" :rows="table.rows" :title="table.title" :paginationShow="false" pagesize="10" idField="id" :columns="table.columns" :multiple="false" :order="false" :search="null"></v-table>
        </div>
      </div>
      </div>
    </v-modal>
  </div>
</template>
<script>
import Vue from 'vue'
import { sAjax, translation,request } from '../../assets/utils/utils.js'
import MList from '../components/MList.vue'
import MTable from '../components/MTable.vue'
import MAdvancedSearch from '../components/MAdvancedSearch.vue'
export default {
  props: {
    data: {
      default: ''
    },
    update: {
      default: false
    }
  },
  data: function () {
    return {
      guideTables: [],
      businessName: '',
      showGuide:false,
      initDataOfChart: null,
      guide: null,
      businessTimeList: null,
      isSelect: false,
      myApplyList: [],
      resultMessageJson: {
        overtime: '申请在{{node}}节点超时',
        rescissory: '申请者取消申请',
        disable: '业务期停用，表单废弃',
        success: '申请已通过',
        fail: '申请在{{node}}节点不通过',
        end: '已结束',
        submit: '待{{node}}节点审核',
        proxySubmit: '待{{node}}节点审核',
        agree: '待{{node}}节点审核',
        reject: '申请被驳回至{{node}}节点',
        countermand: '申请被撤回至{{node}}节点',
      },

      // 2.4.0相关 数据,晚点考虑要不要抽出来放mixins
      // 熊得，你早干啥去啦
      tableDataTotal: 0,
      curBusinessId: this.data.businessList[0].key,
      curBusiness: {},
      nodeId: '',
      tabType:'0',
      tabTypes:[{key:'0',value:'全部'},{key:'1',value:'未审核'},{key:'2',value:'已通过'},{key:'3',value:'其他'}],
      tabs: [],
      tableUrl: '',
      tableColumn: [],
      permissionInfo: {
        list: [],
        value: '',
      },
      collegeInfo: {
        list: [],
        value: [],
      },

      advancedInfo: {},
      currentTabIdx: 'copyToMe',
      stuInfoList: [],
    }
  },
  components: {
    MList,
    MAdvancedSearch,
    MTable
  },
  computed: {
    applyText: function () {
      if (this.curBusiness && !this.curBusiness.canApplyOnTime) {
        return '当前时间不可申请'
      }
      if (this.curBusiness && !this.curBusiness.canApplyOnAuthority) {
        return '您无申请权限'
      }
      return '申请'
    }
  },
  watch: {
    update: function (val) {
      if (val) {
        this._getMyApplyData()
      }
    },
    tabType(){
      this._getMyApplyData()
    },
    currentTabIdx() {
      this._getMyApplyData()
      // this.isSelect = false
    }
  },
  created: function () {
    var that = this
    // this.curBusiness = JSON.parse(JSON.stringify(this.data.curBusiness))
    sAjax({
      url: '/api/apps/' + this.data.data.appId + '/settings/flows',
      type: 'get',
      success: function (data) {
        if (data.state) {
          if (data.data) {
            if (data.data.chart && data.data.chart.nodes && data.data.chart.nodes.length > 0) {
              that.initDataOfChart = {}
              data.data.chart.nodes.forEach((ele, i) => {
                Vue.set(that.initDataOfChart, ele.id, ele)
              })
            }
          }
        } else {
          that._toast(data.message)
        }
      }
    })
    // this.getGuide()
    this.formatTab()
    // this.initGuideTable(this.curBusiness)
  },
  methods: {
    hideGuide(){
      this.showGuide=false
    },
    initGuideTable(data) {
      this.guideTables = []
      if(data.appQuotaList) {
        data.appQuotaList.forEach(table => {
          let columns = table.conditions.map(o => {
            return {
              id: o.toLowerCase() == 'educationlevel' ? 'educationLevel' : o.toLowerCase(),
              title: this.getColumnTitle(o),
              className: 'text-left',
              hidden: false
            }
          })
          columns.push({
            id: 'finalResult',
            title: "最终结果",
            className: 'text-left',
            hidden: false,
            needTotal: true,
          })
          this.guideTables.push({
            title: table.nodeName,
            columns,
            rows: table.appQuotaCollectVO,
          })
        })
      }
      
    },
    getColumnTitle(condition) {
      switch (condition) {
        case 'COLLEGE':
          return '学院';
        case 'EDUCATIONLEVEL':
          return '培养层次';
        case 'GRADE':
          return '年级';
          case 'MAJOR':
          return '专业';
          case 'DEPARTMENT':
          return '系别';
      }
    },
    _apply: function () {
      if (!(this.curBusiness.canApplyOnTime && this.curBusiness.canApplyOnAuthority)) return
      let url = `/api/business/apply/limit/test/apply/${this.curBusinessId}`
      request(url).then(o=>{
        if (!o.data.satisfied) {
          this.$toast(o.data.message);
        } else {
          this.$emit('addBread', {
            route: '/form/MFormLayout?appId=' + this.data.data.appId + '&nodeId=owner',
            title: '',
            businessList: [this.curBusiness]
          })
        }
      })
      
    },
    _back: function () {
      this.$emit('removeBread', this.data)
    },
    _clickApplyDetail: function (obj) {
       let params = {
         applicant:obj.applicant,
         appId:obj.appId,
         instanceId:obj.id,
         nodeId:obj.currentNode.id,
       }
      this.$emit('addBread', {
        route: '/form/MFormLayout',
        data:params,
        businessList: [this.curBusiness],
        title: ''
      })
    },
    _getFlowStatus: function (record) {
      var msg = ''
      if (record.status.toLowerCase() === 'pending') {
        msg = this.resultMessageJson[record.lastAction] ? this.resultMessageJson[record.lastAction].replace('{{node}}', record.currentNode.name) : ''
      } else if (record.status.toLowerCase() === 'end') {
        msg = this.resultMessageJson[record.result.toLowerCase()] ? this.resultMessageJson[record.result.toLowerCase()].replace('{{node}}', record.currentNode.name) : ''
      }
      return msg
    },
    _toast: function (msg) {
      this.$vux.toast.show({
        text: msg,
        position: 'bottom',
        type: 'text'
      })
    },
    // 2.4.0相关 方法,晚点考虑要不要抽出来放mixins
    onLoadTable(tableData) {
      this.tableDataTotal = tableData.total
    },
    getGuide() {
      let that = this;
      sAjax({
        url: '/api/app/' + this.data.data.appId + '/business/' + this.curBusinessId,
        type: 'get',
        success: function (data) {
          if (data.state) {
            that.guide = data.data.business.guide
            that.showGuide = true
          } else {
            that._toast(data.message)
          }
        }
      })
    },
    _getMyApplyData: function () {
      // this.getGuide()
      let timeStamp = Date.parse(new Date())
      switch (this.currentTabIdx) {
        case 'myApplies':
          // 为了方面使用,还原了PC端的写法,有需要再说吧
          // 你真机智呀
          this.tableColumn = [
            {
              id: "createTime",
              title: "发起时间",
            },
            {
              id: "state",
              title: "状态",
              formatter: (record) => {
                var msg = "";
                if (record.status.toLowerCase() === "pending") {
                  msg = this.resultMessageJson[record.lastAction]
                    ? this.resultMessageJson[record.lastAction].replace(
                      "{{node}}",
                      record.currentNode.name
                    )
                    : "";
                } else if (record.status.toLowerCase() === "end") {
                  msg = this.resultMessageJson[record.result.toLowerCase()]
                    ? this.resultMessageJson[record.result.toLowerCase()].replace(
                      "{{node}}",
                      record.currentNode.name
                    )
                    : "";
                }
                return msg;
              }
            }
          ]
          this.tableUrl = '/table-data/processEngine/myProcessInstances?businessId=' + this.curBusinessId+'&timeStamp='+timeStamp
          this.nodeId = ''
          break;
        case 'copyToMe':
          // 为了方面使用,还原了PC端的写法,有需要再说吧
          this.initNormalTable()
          this.tableUrl = `/table-data/processEngine/business/${this.curBusinessId}/carbonCopies?timeStamp=${timeStamp}`
          this.nodeId = ''
          break;
        default:
          this.initNormalTable()
          this.nodeId = this.currentTabIdx
          this.tableUrl = `/table-data/processEngine/business/${this.curBusinessId}/nodes/${this.nodeId}/tasks/done/pages?type=${this.tabType}&timeStamp=${timeStamp}`
          break
      }
    },
    onAdvancedSearch(info) {
      this.advancedInfo = info
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
    initNormalTable() {
      this.tableColumn = [
        {
          id: 'name',
          title: '姓名',//title是没用的,为了方面代码阅读就留着吧
          formatter(obj) {
            return obj.applicant.name
          }
        },
        {
          id: 'userNo',
          title: '学号',
          formatter(obj) {
            return obj.applicant.userNo
          }
        },
        {
          id: 'collegeName',
          title: '学院',
          formatter(obj) {
            return obj.applicant.collegeName
          }
        },
        {
          id: 'educationLevel',
          title: '培养层次',
          formatter(obj) {
            return obj.applicant.educationLevel
            // switch (obj.applicant.educationLevel) {
            //   case '1':
            //     return '博士';
            //   case '2':
            //     return '硕士';
            //   case '3':
            //     return '本科';
            //   case '4':
            //     return '专科';
            //   case '5':
            //     return '其他';
            //   case '6':
            //     return '预科';
            //   default:
            //     return '其他'
            // }
          }
        }
      ]
    },
    selectTab() {
      this._getMyApplyData()
      // this.formatTab()
      this.isSelect = false
    },
    selectHeaderTab() {
      this._getMyApplyData()
      this.formatTab()
    },
    formatTab() {
      let curBusiness
      this.tabs = []

      this.data.businessList.forEach(o => {
        if (o.key === this.curBusinessId) {
          curBusiness = o
          this.initGuideTable(o)
        }
      })
      this.curBusiness = curBusiness
      this.currentTabIdx = 'copyToMe'
      if (curBusiness.canApplyOnAuthority) {
        this.tabs.push({ 'key': 'myApplies', 'value': '我的申请' })
        this.currentTabIdx = 'myApplies'
      }
      this.tabs.push({ 'key': 'copyToMe', 'value': '抄送给我' })
      if (curBusiness.proxyAuthority) {
        this.tabs.push({ 'key': 'myProxy', 'value': '我的代发' })
      }
      this.getBusinessplayerAndNodes(this.curBusinessId, (data) => {
        this.curBusiness.nodeList = data.nodeList
        this.curBusiness.nodeList.forEach(node => {
          this.tabs.push({ 'key': node.id, 'value': node.name })
        })
        if (!this.curBusiness.canApplyOnAuthority) {
          this.currentTabIdx = this.tabs[this.tabs.length - 1].key
        }   
        this.selectTab()
      })
    },
    _switchTab(index) {
      this.isSelect = index
    },
    _toast: function (msg) {
      this.$vux.toast.show({
        text: msg,
        position: 'bottom',
        type: 'text'
      })
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
    _back() {
      this.data.isUpdateLastPage = true
      this.$emit('removeBread', this.data)
      // this.$emit('_refresh')
    }
  }
}
</script>
<style lang="less">
#flowDetail {
  .flowDetail-header {
    
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
    }
  }
  .index_img{
    width: 0.5867rem;
    height: 0.3467rem;
    position: absolute;
    left: 50%;
    margin-left: -0.29335rem;
  }
  .guide {
      background: white;
      border-radius: 4px;
      width: 95%;
      margin: 0 auto;
      height: 400px;

      .mytable{
      .table-title-container{
        padding-left: 3px !important
      }
    }
      .guide-title {
        width:100%;
        text-align: center;
        font-size: 0.5067rem;
        color:#303133;
        font-weight: bold;
        position: relative;
        .index_img{
          top:0.6333rem;
          // left: calc(50% - .3rem);
        }
      }
      .guide-content,
      .business-time {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.54);
        line-height: 19px;
        margin: 0px 16px 16px 16px;
        font-weight: bold;
      }
      .guide-content {
        img {
          max-width: 100%;
        }
        table tbody tr td p {
          margin-left: 0 !important;
          width: 300px !important;
        }
        @media screen and (width: 320px) {
          table tbody tr td {
            width: 300px !important;
          }
          table tbody tr td p {
            margin-left: 0 !important;
            width: 280px !important;
          }
        }
        @media screen and (width: 350px) {
          table tbody tr td {
            width: 330px !important;
          }
          table tbody tr td p {
            margin-left: 0 !important;
            width: 310px !important;
          }
        }
        @media screen and (width: 375px) {
          table tbody tr td {
            width: 355px !important;
          }
          table tbody tr td p {
            margin-left: 0 !important;
            width: 350px !important;
          }
        }
        @media screen and (width: 384px) {
          table tbody tr td {
            width: 364px !important;
          }
          table tbody tr td p {
            margin-left: 0 !important;
            width: 350px !important;
          }
        }
        @media screen and (width: 412px) {
          table tbody tr td {
            width: 382px !important;
          }
          table tbody tr td p {
            margin-left: 0 !important;
            width: 370px !important;
          }
        }
        @media screen and (width: 414px) {
          table tbody tr td {
            width: 382px !important;
          }
          table tbody tr td p {
            margin-left: 0 !important;
            width: 370px !important;
          }
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
  .flowDetail-content {
    position: absolute;
    top: 150px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    background: #ffffff;
    .apply-btn {
      height: 56px;
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      padding: 0 8px;
      background: #ffffff;
      .button {
        background: #298df7;
        border-radius: 4px;
        height: 48px;
        font-size: 16px;
        color: #ffffff;
        &.disabled {
          border: none;
          background: #ccc;
        }
      }
    }
    
    .apply-list-nodata {
      text-align: center;
      margin-top: 30px;
    }
    .apply-list-group {
      .weui-cells {
        &:before {
          border-top: 0px solid #ffffff;
        }
        &:after {
          border-bottom: 0px solid #ffffff;
        }
        .apply-list-cell {
          padding: 6px 15px 9px;
          &:before {
            left: 16px;
            right: 16px;
          }
          .weui-cell__hd {
            margin-left: 1px;
          }
          p {
            margin-top: 10px;
            margin-bottom: -6px;
          }
          .vux-label {
            color: rgba(0, 0, 0, 0.77);
            font-size: 13px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            width: 60%;
          }

          .vux-label-desc {
            font-size: 10px;
            color: rgba(0, 0, 0, 0.32);
            display: inline-block;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            width: 60%;
          }
          @media screen and (max-width: 320px) {
            .vux-label,
            .vux-label-desc {
              width: 50%;
            }
          }
          &:before {
            border-bottom: 0px solid #ffffff;
          }
        }
      }
    }
  }
}
#flowDetail {
  background-color: #efeff3 !important;
  .guide_icon{
    position: absolute;
    right: 0;
    top: 0;
    padding:0.2133rem 0.4rem 0 0;
    color:#303133;
    font-size: 0.3733rem;
    img{
      width: 0.5867rem;
      height: 0.5867rem;
    }
  }
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
    padding: 0.2667rem 0.4rem;
    background: #fff;
    overflow-x: auto;
    align-items: center;
    .search-tabbar-item {
      text-align: center;
      color: #606266;
      height: 24px;
      font-size: 14px;
      font-weight: 500;
    }
    .vux-cell-primary {
      display: none;
    }
    .active {
      color: #303133;
      font-weight: bold;
    }
    .weui-cell:before {
      border-top: none;
    }
    &.type_tab{
       .search-tabbar-item {
        color: #606266;
        padding: 0 0.5333rem;
        height: 0.7467rem;
        line-height: 0.7467rem;
        border-radius:0.1067rem;
        margin-right: 0;
        background: #F7F9FA;
        &.active {
          background:linear-gradient(163deg,rgba(81,207,255,1) 0%,rgba(40,161,255,1) 100%);
           color: #FFFFFF;
           font-weight: normal;
        }
      }
      }
    .search-tabbar-item {
      display: flex;
      margin-right: 0.6667rem;
      justify-content: center;
      position: relative;
      .index_img{
        top:0.5067rem;
        display: none;
      }
      &.active {
        .index_img{
             display: block;
           }
        .weui-cell__ft {
          .vux-cell-value {
            color: #303133;
          }
        }
        &.weui-cell_access .weui-cell__ft:after {
          border-color: #298df7;
        }
      }
    }
  }
  .info-list {
    // padding-bottom: 40px;
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
  .weui-cell_access .weui-cell__ft:after {
    color: rgba(0, 0, 0, 0.54);
    -webkit-transform: matrix(0.71, 0.71, 0.71, -0.71, 0, 0) !important;
    transform: matrix(0.71, 0.71, 0.71, -0.71, 0, 0) !important;
  }
}
.guide_modal{
  background: rgba(0,0,0,0.35);
}

</style>
