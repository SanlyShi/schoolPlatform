<template>
  <div id="statistics" class="container-fluid">
    <div class="row text-center">
      <ul id="myTab" class="nav nav-tabs statistics-tab">
        <li :class="{active:isSelect == item.id}" v-for="(item, index) in tabs" :key="index" @click="changeTab(item)">
          <a>{{translate.statisticsList[item.id]}}</a>
        </li>
      </ul>
    </div>
    <div class="content row">
      <div v-show="curRoute === 'dormitoryStatistics'">
        <br/>
        <div class="form-group col-md-3" v-for="(item, index) in dormitoryStatistics.layoutOne" :key="index">
          <label class="input-label">{{item.title}}</label>
          <v-select class="btn-block form-select-style" :multiple="true" :value="dormitoryStatistics.defaultValue[item.id]"  :options="dormitoryStatistics.options[item.id]" options-value="value" options-label="label" @afterSelected="_dormitoryStatisticsDormitoryOptionsSelected($event, item)" search></v-select>
        </div>
        <div class="form-group col-md-3">
          <label class="input-label">{{translate.time}}:</label>
          <v-datepicker class="btn-block form-datepicker-style" :clearButton="false" :showTime="false" v-model="editTime.dormitoryStatisticsTime" @daySelected="_dateSelected($event, 'dormitoryStatisticsTime')"></v-datepicker>
        </div>   
        <div class="form-group col-md-3" v-for="(item, index) in dormitoryStatistics.layoutTwo" :key="index">
          <label class="input-label">{{item.title}}</label>
          <v-select class="btn-block form-select-style" :multiple="true" :value="dormitoryStatistics.defaultValue[item.id]"  :options="dormitoryStatistics.options[item.id]" options-value="value" options-label="label" @afterSelected="_dormitoryStatisticsOptionsSelected($event, item)" search></v-select>
        </div>
        <div class="form-group col-md-3" v-for="(item, index) in dormitoryStatistics.layoutThree" :key="index">
          <label class="input-label">{{item.title}}</label>
          <v-select class="btn-block form-select-style" :multiple="true" :value="dormitoryStatistics.defaultValue[item.id]"  :options="dormitoryStatistics.options[item.id]" options-value="value" options-label="label" @afterSelected="_dormitoryStatisticsOptionsSelected($event, item)" search></v-select>
        </div>
        <div class="form-group col-md-3">
          &nbsp;
        </div>
        <div class="form-group col-md-3" >
          <button type="button" class="btn clearBtnBorder" @click="_dormitoryStatisticsReset">{{translate.reset}}</button>
          <button type="button" class="btn clearBtnBorder" @click="_dormitoryStatisticsSearch">{{translate.search}}</button>
          <button type="button" class="btn clearBtnBorder" @click="_dormitoryStatisticsExport">{{translate.export}}</button>
          <button type="button" class="btn btn-bgColor-style clearBtnBorder" @click="_switchDormitoryDetailedTable" v-if="dormitoryStatisticsFlag === 'switchDormitoryDetailedTable'">{{translate.switchDormitoryDetailedTable}}</button>
          <button type="button" class="btn btn-bgColor-style clearBtnBorder" @click="_switchdormitoryStatisticsTable" v-if="dormitoryStatisticsFlag === 'switchStatisticsTable'">{{translate.switchStatisticsTable}}</button>
        </div>   
        <!-- <hr style="height:3px;border:none;border-top:1px solid #0000FF;" />    -->
        <v-table
          :url="dormitoryStatisticsUrl"
          pagesize="10"
          idField="id"
          :columns="columnsDormitoryStatisticsTable"
          :order="true"
          @columnExchanged="_columnExchanged"
          :key="1"
          ref="dormitoryStatisticsTable"
          v-if="dormitoryStatisticsFlag === 'switchDormitoryDetailedTable'"
          >
        </v-table>
        <v-table
          :url="dormitoryDetailedUrl"
          pagesize="10"
          idField="id"
          :columns="columnsDormitoryDetailedTable"
          :order="true"
          @columnExchanged="_columnExchanged"
          :key="2"
          ref="dormitoryStatisticsTable"
          v-if="dormitoryStatisticsFlag === 'switchStatisticsTable'"
          >
        </v-table>
      </div>
      <div v-show="curRoute === 'peopleStatistics'">
        <br/>
        <div class="form-group col-md-3" v-for="(item, index) in peopleStatistics.layoutOne" :key="index">
          <label class="input-label">{{item.title}}</label>
          <v-select class="btn-block form-select-style" :multiple="true" :value="peopleStatistics.defaultValue[item.id]"  :options="peopleStatistics.options[item.id]" options-value="value" options-label="label" @afterSelected="_peopleStatisticsDormitoryOptionsSelected($event, item)" search></v-select>
        </div>
        <div class="form-group col-md-3">
          <label class="input-label">{{translate.time}}:</label>
          <v-datepicker class="btn-block form-datepicker-style" :clearButton="false" :showTime="false" v-model="editTime.peopleStatisticsTime" @daySelected="_dateSelected($event, 'peopleStatisticsTime')"></v-datepicker>
        </div> 
        <div class="form-group col-md-3" v-for="(item, index) in peopleStatistics.layoutTwo" :key="index">
          <label class="input-label">{{item.title}}</label>
          <v-select class="btn-block form-select-style" :multiple="true" :value="peopleStatistics.defaultValue[item.id]"  :options="peopleStatistics.options[item.id]" options-value="value" options-label="label" @afterSelected="_peopleStatisticsOptionsSelected($event, item)" search></v-select>
        </div>  
        <div class="form-group col-md-3">
          <button type="button" class="btn clearBtnBorder" @click="_peopleStatisticsReset">{{translate.reset}}</button>
          <button type="button" class="btn clearBtnBorder" @click="_peopleStatisticsSearch">{{translate.search}}</button>
          <button type="button" class="btn clearBtnBorder" @click="_peopleStatisticsExport">{{translate.export}}</button>
          <button type="button" class="btn btn-bgColor-style clearBtnBorder" @click="_switchPeopleDetailedTable" v-if="peopleStatisticsFlag === 'switchPeopleDetailedTable'">{{translate.switchPeopleDetailedTable}}</button>
          <button type="button" class="btn btn-bgColor-style clearBtnBorder" @click="_switchPeopleStatisticsTable" v-if="peopleStatisticsFlag === 'switchStatisticsTable'">{{translate.switchStatisticsTable}}</button>
        </div>   
        <v-table
          :url="peopleStatisticsUrl"
          pagesize="10"
          idField="id"
          :columns="columnsPeopleStatisticsTable"
          :order="true"
          @columnExchanged="_columnExchanged"
          :key="3"
          ref="peopleStatisticsTable"
          v-if="peopleStatisticsFlag === 'switchPeopleDetailedTable'">
        </v-table>
        <v-table
          :url="peopleDetailedUrl"
          pagesize="10"
          idField="id"
          :columns="columnsPeopleDetailedTable"
          :order="true"
          @columnExchanged="_columnExchanged"
          :key="4"
          ref="dormitoryStatisticsTable"
          v-if="peopleStatisticsFlag === 'switchStatisticsTable'">
        </v-table>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import $ from 'jquery'
  import { translation, sAjax, createTime } from '../../assets/utils/utils.js'
  export default {
     props: {
       account: {
         default: null
       }
    },
    created: function () {
      var la = localStorage.getItem('lang')
      if (translation(la)) {
        this.lang = la
      }
      sAjax({
        url: '/api/apartment/dicts?typeName=校区',
        type: 'get',
        success: (data) => {
          if (data.state) {
            data.data.forEach((ele) => {
              this.dormitoryStatistics.options.campus.push({
                label: ele.label,
                value: ele.value
              })
              this.peopleStatistics.options.campus.push({
                label: ele.label,
                value: ele.value
              })
            })
          } else {
            this.toast(data.message)
          }
        }
      })
      sAjax({
        url: '/api/apartment/dicts?typeName=房间用途',
        type: 'get',
        success: (data) => {
          if (data.state) {
            data.data.forEach((ele) => {
              this.dormitoryStatistics.options.usedFor.push({
                label: ele.label,
                value: ele.value
              })
            })
          } else {
            this.toast(data.message)
          }
        }
      })
      sAjax({
        url: '/api/apartment/dicts?typeName=卫生间类型',
        type: 'get',
        success: (data) => {
          if (data.state) {
            data.data.forEach((ele) => {
              this.dormitoryStatistics.options.toilet.push({
                label: ele.label,
                value: ele.value
              })
            })
          } else {
            this.toast(data.message)
          }
        }
      })
      sAjax({
        url: '/api/apartment/dicts?typeName=有无阳台',
        type: 'get',
        success: (data) => {
          if (data.state) {
            data.data.forEach((ele) => {
              this.dormitoryStatistics.options.haveBalcony.push({
                label: ele.label,
                value: ele.value
              })
            })
          } else {
            this.toast(data.message)
          }
        }
      })
      sAjax({
        url: '/api/apartment/dicts?typeName=居住情况',
        type: 'get',
        success: (data) => {
          if (data.state) {
            data.data.forEach((ele) => {
              this.dormitoryStatistics.options.livingStatus.push({
                label: ele.label,
                value: ele.value
              })
            })
          } else {
            this.toast(data.message)
          }
        }
      })
      sAjax({
        url: '/api/apartment/dicts?typeName=培养层次',
        type: 'get',
        success: (data) => {
          if (data.state) {
            data.data.forEach((ele) => {
              this.peopleStatistics.options.educationLevel.push({
                label: ele.label,
                value: ele.value
              })
            })
          } else {
            this.toast(data.message)
          }
        }
      })
      sAjax({
        url: '/api/apartment/statistic/getSelectOption',
        type: 'get',
        success: (data) => {
          if (data.state) {
            data.data.forEach((ele) => {
              this.peopleStatistics.options.college.push({
                label: ele.label,
                value: ele.value
              })
            })
          } else {
            this.toast(data.message)
          }
        }
      })
      this._initColumns() 
      this._nowDate()
    },
    data: function () {
      return {
        dormitoryStatistics: {
          layoutOne: [{
            title: '校区:',
            id: 'campus'
          }, {
            title: '园区:',
            id: 'zone'
          }, {
            title: '楼栋:',
            id: 'building'
          }],
          layoutTwo: [{
            title: '房间用途:',
            id: 'usedFor'
          }, {
            title: '卫生间类型:',
            id: 'toilet'
          }, {
            title: '有无阳台:',
            id: 'haveBalcony'
          },
          {
            title: '房型:',
            id: 'maxNumber'
          }],
          layoutThree: [{
            title: '居住情况:',
            id: 'livingStatus'
          }, {
            title: '空床数量:',
            id: 'leftNumber'
          }],
          options: {
            campus: [],
            zone: [],
            building: [],
            usedFor: [],
            toilet: [],
            haveBalcony: [],
            maxNumber:[{label:'1人间',value:'1'},{label:'2人间',value:'2'},{label:'3人间',value:'3'},{label:'4人间',value:'4'},{label:'5人间',value:'5'},{label:'6人间',value:'6'},{label:'7人间',value:'7'},{label:'8人间',value:'8'},{label:'9人间',value:'9'},{label:'10人间',value:'10'},],
            livingStatus: [],
            leftNumber:[{label:'1张空床',value:'1'},{label:'2张空床',value:'2'},{label:'3张空床',value:'3'},{label:'4张空床',value:'4'},{label:'5张空床',value:'5'},{label:'6张空床',value:'6'},{label:'7张空床',value:'7'},{label:'8张空床',value:'8'},{label:'9张空床',value:'9'},{label:'10张空床',value:'10'},]
          },
          defaultValue: {
            campus: '',
            zone: '',
            building: '',
            usedFor: '',
            toilet: '',
            haveBalcony: '',
            maxNumber: '',
            livingStatus: '',
            leftNumber: ''
          }
        },
        peopleStatistics: {
          layoutOne: [{
            title: '校区:',
            id: 'campus'
          }, {
            title: '园区:',
            id: 'zone'
          }, {
            title: '楼栋:',
            id: 'building'
          }],
          layoutTwo: [{
            title: '人员类型:',
            id: 'userType'
          }, {
            title: '培养层次:',
            id: 'educationLevel'
          }, {
            title: '学院:',
            id: 'college'
          }],
          options: {
            campus: [],
            zone: [],
            building: [],
            userType: [{label:'学生',value:'student'},{label:'教师',value:'teacher'},{label:'其他用户',value:'OTHER'}],
            educationLevel: [],
            college: [],
          },
          defaultValue: {
            campus: '',
            zone: '',
            building: '',
            userType: '',
            educationLevel: '',
            college: '',
          }
        },
        dormitoryStatisticsFlag: 'switchDormitoryDetailedTable',
        peopleStatisticsFlag: 'switchPeopleDetailedTable',
        dormitoryStatisticsUrl: '',
        dormitoryDetailedUrl: '',
        peopleStatisticsUrl: '',
        peopleDetailedUrl: '',
        columnsDormitoryStatisticsTable: [],
        columnsDormitoryDetailedTable: [],
        columnsPeopleStatisticsTable: [],
        columnsPeopleDetailedTable: [],
        isSelect: 'dormitoryStatistics',
        isShowPathNav: false,
        tabs: [{ id: 'dormitoryStatistics', label: '房源统计' }, { id: 'peopleStatistics', label: '人员统计' }],
        curRoute: 'dormitoryStatistics',
        searchSelectOptions: {
          operation:[{label:'入住',value:'CHECK_IN'},{label:'退宿',value:'RETIREMENT'},{label:'调宿',value:'ACCOMMODATION'}],
          operatorType:[{label:'管理员',value:'APARTMENT_MANAGER'},{label:'学院',value:'COLLEGE'},{label:'学生',value:'STUDENT'}],
          },
        editTime: {
          dormitoryStatisticsTime: '',
          peopleStatisticsTime: '',
        },
        nowDate: '',
        timeStamp: '',
        lang: 'zh-cn'
      }
    },
    computed: {
      translate: function () {
        return translation(this.lang).statistics
      }
    },
    methods: {
      _dormitoryStatisticsDormitoryOptionsSelected: function (obj, item) {
        this.dormitoryStatistics.defaultValue[item.id] = obj.value
        if(obj.value === ''){}
        else{
          if (item.id === 'campus') {
            var arr = this.dormitoryStatistics.defaultValue.campus.split(',')
            if (arr.length > 1){
              this.dormitoryStatistics.options.zone.splice(0, this.dormitoryStatistics.options.zone.length)
              this.dormitoryStatistics.options.building.splice(0, this.dormitoryStatistics.options.building.length) 
              this.dormitoryStatistics.defaultValue.zone = ''
              this.dormitoryStatistics.defaultValue.building = ''
            }
            else{
              this.$nextTick(() => {
                this._dormitoryStatisticsGetZonesData(this.dormitoryStatistics.defaultValue[item.id])
              })
            }
          } else if (item.id === 'zone') {
              var arr2 = this.dormitoryStatistics.defaultValue.zone.split(',')
              if (arr2.length > 1){
                this.dormitoryStatistics.options.building.splice(0, this.dormitoryStatistics.options.building.length) 
                this.dormitoryStatistics.defaultValue.building = ''
              }
              else{
                this.$nextTick(() => {
                  this._dormitoryStatisticsGetBuildingData(this.dormitoryStatistics.defaultValue[item.id])
                })
              }
            }
        }
      },
      _peopleStatisticsDormitoryOptionsSelected: function (obj, item) {
        this.peopleStatistics.defaultValue[item.id] = obj.value
        if(obj.value === ''){}
        else{
          if (item.id === 'campus') {
            var arr = this.peopleStatistics.defaultValue.campus.split(',')
            if (arr.length > 1){
              this.peopleStatistics.options.zone.splice(0, this.peopleStatistics.options.zone.length)
              this.peopleStatistics.options.building.splice(0, this.peopleStatistics.options.building.length) 
              this.peopleStatistics.defaultValue.zone = ''
              this.peopleStatistics.defaultValue.building = ''
            }
            else{
              this.$nextTick(() => {
                this._peopleStatisticsGetZonesData(this.peopleStatistics.defaultValue[item.id])
              })
            }
          } else if (item.id === 'zone') {
              var arr2 = this.peopleStatistics.defaultValue.zone.split(',')
              if (arr2.length > 1){
                this.peopleStatistics.options.building.splice(0, this.peopleStatistics.options.building.length) 
                this.peopleStatistics.defaultValue.building = ''
              }
              else{
                this.$nextTick(() => {
                  this._peopleStatisticsGetBuildingData(this.peopleStatistics.defaultValue[item.id])
                })
              }
            }
        }
      },
      _dormitoryStatisticsOptionsSelected: function (obj, item) {
        this.dormitoryStatistics.defaultValue[item.id] = obj.value
      },
      _peopleStatisticsOptionsSelected: function (obj, item) {
        this.peopleStatistics.defaultValue[item.id] = obj.value
      },
      _initColumns: function () {
        this.columnsDormitoryStatisticsTable = [
          {
            id: 'campusName',
            title: this.translate.campusName,
            width: 100,
            className: 'text-left',
            hidden: false,
          }, 
          {
            id: 'zoneName',
            title: this.translate.zoneName,
            width: 100,
            className: 'text-left',
            hidden: false,
          },
          {
            id: 'buildingName',
            title: this.translate.buildingName,
            width: 100,
            className: 'text-left',
            hidden: false,
          }, 
          {
            id: 'totRoom',
            title: this.translate.totRoom,
            width: 100,
            className: 'text-left',
            hidden: false,
          }, 
          {
            id: 'totBed',
            title: this.translate.totBed,
            width: 100,
            className: 'text-left',
            hidden: false,
          }, 
          {
            id: 'conditionRoom',
            title: this.translate.conditionRoom,
            width: 150,
            className: 'text-left',
            hidden: false,
            formatter: (record) => {
              if(record.conditionRoom == '-1')
                record.conditionRoom = ''
            }
          }
        ]
        this.columnsDormitoryDetailedTable = [
          {
            id: 'campusName',
            title: this.translate.campusName,
            width: 100,
            className: 'text-left',
            hidden: false,
          }, {
            id: 'zoneName',
            title: this.translate.zoneName,
            width: 100,
            className: 'text-left',
            hidden: false,
          }, {
            id: 'buildingName',
            title: this.translate.buildingName,
            width: 100,
            className: 'text-left',
            hidden: false,
          }, {
            id: 'roomNo',
            title: this.translate.roomNo,
            width: 80,
            className: 'text-left',
            hidden: false,
          }, {
            id: 'usedFor',
            title: this.translate.usedFor,
            width: 100,
            className: 'text-left',
            hidden: false,
          }, {
            id: 'toilet',
            title: this.translate.toilet,
            width: 100,
            className: 'text-left',
            hidden: false,
          }, {
            id: 'haveBalcony',
            title: this.translate.haveBalcony,
            width: 80,
            className: 'text-left',
            hidden: false,
          }, {
            id: 'maxNumber',
            title: this.translate.maxNumber,
            width: 80,
            className: 'text-left',
            hidden: false,
          }, {
            id: 'livingStatus',
            title: this.translate.livingStatus,
            width: 100,
            className: 'text-left',
            hidden: false,
          }, {
            id: 'leftNumber',
            title: this.translate.leftNumber,
            width: 100,
            className: 'text-left',
            hidden: false,
          }, 
        ] 
        this.columnsPeopleStatisticsTable = [
          {
            id: 'campusName',
            title: this.translate.campusName,
            width: 100,
            className: 'text-left',
            hidden: false,
          }, 
          {
            id: 'zoneName',
            title: this.translate.zoneName,
            width: 100,
            className: 'text-left',
            hidden: false,
          },
          {
            id: 'buildingName',
            title: this.translate.buildingName,
            width: 100,
            className: 'text-left',
            hidden: false,
          }, {
            id: 'totUser',
            title: this.translate.totUser,
            width: 100,
            className: 'text-left',
            hidden: false,
          },{
            id: 'conditionUser',
            title: this.translate.conditionUser,
            width: 150,
            className: 'text-left',
            hidden: false,
            formatter: (record) => {
              if(record.conditionUser == '-1')
                record.conditionUser = ''
            }
          }
        ]
        this.columnsPeopleDetailedTable = [
          {
            id: 'campusName',
            title: this.translate.campusName,
            width: 80,
            className: 'text-left',
            hidden: false,
          }, 
          {
            id: 'zoneName',
            title: this.translate.zoneName,
            width: 80,
            className: 'text-left',
            hidden: false,
          },
          {
            id: 'buildingName',
            title: this.translate.buildingName,
            width: 80,
            className: 'text-left',
            hidden: false,
          },
          {
            id: 'roomNo',
            title: this.translate.roomNo,
            width: 50,
            className: 'text-left',
            hidden: false,
          },
          {
            id: 'bedNo',
            title: this.translate.bedNo,
            width: 50,
            className: 'text-left',
            hidden: false,
          },
          {
            id: 'userName',
            title: this.translate.userName,
            width: 50,
            className: 'text-left',
            hidden: false,
          },
          {
            id: 'userType',
            title: this.translate.userType,
            width: 60,
            className: 'text-left',
            hidden: false,
          },
          {
            id: 'userNo',
            title: this.translate.userNo,
            width: 120,
            className: 'text-left',
            hidden: false,
          },
          {
            id: 'sex',
            title: this.translate.sex,
            width: 50,
            className: 'text-left',
            hidden: false,
          },
          {
            id: 'college',
            title: this.translate.college,
            width: 60,
            className: 'text-left',
            hidden: false,
          },
          {
            id: 'educationLevel',
            title: this.translate.educationLevel,
            width: 60,
            className: 'text-left',
            hidden: false,
          },
          {
            id: 'grade',
            title: this.translate.grade,
            width: 50,
            className: 'text-left',
            hidden: false,
          },
          {
            id: 'userCheckInStatus',
            title: this.translate.userCheckInStatus,
            width: 60,
            className: 'text-left',
            hidden: false,
          },
          {
            id: 'inTime',
            title: this.translate.inTime,
            width: 100,
            className: 'text-left',
            hidden: false,
          },
          {
            id: 'outTime',
            title: this.translate.outTime,
            width: 120,
            className: 'text-left',
            hidden: false,
          }
        ]
      },
      changeTab: function (obj) {
        this.isSelect = obj.id
        this.curRoute = obj.id
        this._initColumns()
      },
      _dormitoryStatisticsGetZonesData: function (campusId) {
        sAjax({
          url: '/api/apartment/zones/getByCampuses/' + campusId,
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.dormitoryStatistics.options.zone.splice(0, this.dormitoryStatistics.options.zone.length)
              if (data.data) {
                data.data.forEach((ele) => {
                  this.dormitoryStatistics.options.zone.push({
                    label: ele.name,
                    value: ele.zoneId.toString()
                  })
                })
              }
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _dormitoryStatisticsGetBuildingData: function (zoneId) {
        sAjax({
          url: '/api/apartment/buildings/list/' + zoneId,
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.buildingData = data.data
              this.dormitoryStatistics.options.building.splice(0, this.dormitoryStatistics.options.building.length)
              if (data.data) {
                data.data.forEach((ele) => {
                  this.dormitoryStatistics.options.building.push({
                    label: ele.name,
                    value: ele.buildingId.toString()
                  })
                })
              }
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _peopleStatisticsGetZonesData: function (campusId) {
        sAjax({
          url: '/api/apartment/zones/getByCampuses/' + campusId,
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.peopleStatistics.options.zone.splice(0, this.peopleStatistics.options.zone.length)
              if (data.data) {
                data.data.forEach((ele) => {
                  this.peopleStatistics.options.zone.push({
                    label: ele.name,
                    value: ele.zoneId.toString()
                  })
                })
              }
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _peopleStatisticsGetBuildingData: function (zoneId) {
        sAjax({
          url: '/api/apartment/buildings/list/' + zoneId,
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.buildingData = data.data
              this.peopleStatistics.options.building.splice(0, this.peopleStatistics.options.building.length)
              if (data.data) {
                data.data.forEach((ele) => {
                  this.peopleStatistics.options.building.push({
                    label: ele.name,
                    value: ele.buildingId.toString()
                  })
                })
              }
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _dateSelected: function (obj, cell) {
        if (cell === 'dormitoryStatisticsTime') {
          this.editTime.dormitoryStatisticsTime = obj.value
        }
        if (cell === 'peopleStatisticsTime') {
          this.editTime.peopleStatisticsTime = obj.value
        }
      },
      _dormitoryStatisticsReset: function(){
        this.dormitoryStatistics.defaultValue.campus = ''
        this.dormitoryStatistics.defaultValue.zone = ''
        this.dormitoryStatistics.defaultValue.building = ''
        this.editTime.dormitoryStatisticsTime = this.nowDate
        this.dormitoryStatistics.defaultValue.usedFor = ''
        this.dormitoryStatistics.defaultValue.toilet = ''
        this.dormitoryStatistics.defaultValue.haveBalcony = ''
        this.dormitoryStatistics.defaultValue.maxNumber = ''
        this.dormitoryStatistics.defaultValue.livingStatus = ''
        this.dormitoryStatistics.defaultValue.leftNumber = ''
        this.dormitoryStatistics.options.zone.splice(0, this.dormitoryStatistics.options.zone.length) 
        this.dormitoryStatistics.options.building.splice(0, this.dormitoryStatistics.options.building.length) 
        if(this.dormitoryStatisticsFlag === 'switchDormitoryDetailedTable')
          this.dormitoryStatisticsUrl = '/table-data/apartment/statistic/room/getBuildingWithCondition?' + 'date=' + this.nowDate
        else if(this.dormitoryStatisticsFlag === 'switchStatisticsTable')
          this.dormitoryDetailedUrl = '/table-data/apartment/statistic/room/getWithCondition?' + 'date=' + this.nowDate
      },
      _dormitoryStatisticsSearch: function(){
        if(this.editTime.dormitoryStatisticsTime === ''){
          this.editTime.dormitoryStatisticsTime = this.nowDate
        }//时间必填，默认为当前时间
        else {
          var str = this.editTime.dormitoryStatisticsTime
          str = str.substring(0,10)
          this.editTime.dormitoryStatisticsTime = str
        }
        if(this.dormitoryStatisticsFlag === 'switchDormitoryDetailedTable')
          this.dormitoryStatisticsUrl = '/table-data/apartment/statistic/room/getBuildingWithCondition?' + 'date=' + this.editTime.dormitoryStatisticsTime + '&campusId=' + this.dormitoryStatistics.defaultValue.campus + '&zoneId=' + this.dormitoryStatistics.defaultValue.zone + '&buildingId=' + this.dormitoryStatistics.defaultValue.building + '&usedFor=' + this.dormitoryStatistics.defaultValue.usedFor + '&toilet=' + this.dormitoryStatistics.defaultValue.toilet + '&haveBalcony=' + this.dormitoryStatistics.defaultValue.haveBalcony + '&maxNumber=' + this.dormitoryStatistics.defaultValue.maxNumber + '&leftNumber=' + this.dormitoryStatistics.defaultValue.leftNumber + '&livingStatus=' + this.dormitoryStatistics.defaultValue.livingStatus
        else if(this.dormitoryStatisticsFlag === 'switchStatisticsTable')
          this.dormitoryDetailedUrl = '/table-data/apartment/statistic/room/getWithCondition?' + 'date=' + this.editTime.dormitoryStatisticsTime + '&campusId=' + this.dormitoryStatistics.defaultValue.campus + '&zoneId=' + this.dormitoryStatistics.defaultValue.zone + '&buildingId=' + this.dormitoryStatistics.defaultValue.building + '&usedFor=' + this.dormitoryStatistics.defaultValue.usedFor + '&toilet=' + this.dormitoryStatistics.defaultValue.toilet + '&haveBalcony=' + this.dormitoryStatistics.defaultValue.haveBalcony + '&maxNumber=' + this.dormitoryStatistics.defaultValue.maxNumber + '&leftNumber=' + this.dormitoryStatistics.defaultValue.leftNumber + '&livingStatus=' + this.dormitoryStatistics.defaultValue.livingStatus
      },
      _dormitoryStatisticsExport: function(){
        if(this.editTime.dormitoryStatisticsTime === ''){
          this.editTime.dormitoryStatisticsTime = this.nowDate
        }//时间必填，默认为当前时间
        else {
          var str = this.editTime.dormitoryStatisticsTime
          str = str.substring(0,10)
          this.editTime.dormitoryStatisticsTime = str
        }
        if(this.dormitoryStatisticsFlag === 'switchDormitoryDetailedTable')
          window.location.href = '/downloads/apartment/statistic/room/exportBuilding?' + 'date=' + this.editTime.dormitoryStatisticsTime + '&campusId=' + this.dormitoryStatistics.defaultValue.campus + '&zoneId=' + this.dormitoryStatistics.defaultValue.zone + '&buildingId=' + this.dormitoryStatistics.defaultValue.building + '&usedFor=' + this.dormitoryStatistics.defaultValue.usedFor + '&toilet=' + this.dormitoryStatistics.defaultValue.toilet + '&haveBalcony=' + this.dormitoryStatistics.defaultValue.haveBalcony + '&maxNumber=' + this.dormitoryStatistics.defaultValue.maxNumber + '&leftNumber=' + this.dormitoryStatistics.defaultValue.leftNumber + '&livingStatus=' + this.dormitoryStatistics.defaultValue.livingStatus
        else if(this.dormitoryStatisticsFlag === 'switchStatisticsTable')
          window.location.href = '/downloads/apartment/statistic/room/export?' + 'date=' + this.editTime.dormitoryStatisticsTime + '&campusId=' + this.dormitoryStatistics.defaultValue.campus + '&zoneId=' + this.dormitoryStatistics.defaultValue.zone + '&buildingId=' + this.dormitoryStatistics.defaultValue.building + '&usedFor=' + this.dormitoryStatistics.defaultValue.usedFor + '&toilet=' + this.dormitoryStatistics.defaultValue.toilet + '&haveBalcony=' + this.dormitoryStatistics.defaultValue.haveBalcony + '&maxNumber=' + this.dormitoryStatistics.defaultValue.maxNumber + '&leftNumber=' + this.dormitoryStatistics.defaultValue.leftNumber + '&livingStatus=' + this.dormitoryStatistics.defaultValue.livingStatus
      },
      _peopleStatisticsReset: function(){
        this.peopleStatistics.defaultValue.campus = ''
        this.peopleStatistics.defaultValue.zone = ''
        this.peopleStatistics.defaultValue.building = ''
        this.editTime.peopleStatisticsTime = this.nowDate
        this.peopleStatistics.defaultValue.userType = ''
        this.peopleStatistics.defaultValue.educationLevel = ''
        this.peopleStatistics.defaultValue.college = ''
        this.peopleStatistics.options.zone.splice(0, this.peopleStatistics.options.zone.length) 
        this.peopleStatistics.options.building.splice(0, this.peopleStatistics.options.building.length)
        if(this.peopleStatisticsFlag === 'switchPeopleDetailedTable')
          this.peopleStatisticsUrl = '/table-data/apartment/statistic/user/getBuildingWithCondition?' + 'date=' + this.nowDate
        else if(this.peopleStatisticsFlag === 'switchStatisticsTable')
          this.peopleDetailedUrl = '/table-data/apartment/statistic/user/getWithCondition?' + 'date=' + this.nowDate
      },
      _peopleStatisticsSearch: function(){
        if(this.editTime.peopleStatisticsTime === ''){
          this.editTime.peopleStatisticsTime = this.nowDate
        }//时间必填，默认为当前时间
        else {
          var str = this.editTime.peopleStatisticsTime
          str = str.substring(0,10)
          this.editTime.peopleStatisticsTime = str
        }
        if(this.peopleStatisticsFlag === 'switchPeopleDetailedTable')
          this.peopleStatisticsUrl = '/table-data/apartment/statistic/user/getBuildingWithCondition?' + 'date=' + this.editTime.peopleStatisticsTime + '&campusId=' + this.peopleStatistics.defaultValue.campus + '&zoneId=' + this.peopleStatistics.defaultValue.zone + '&buildingId=' + this.peopleStatistics.defaultValue.building + '&userType=' + this.peopleStatistics.defaultValue.userType + '&educationLevel=' + this.peopleStatistics.defaultValue.educationLevel + '&college=' + this.peopleStatistics.defaultValue.college
        else if(this.peopleStatisticsFlag === 'switchStatisticsTable')
          this.peopleDetailedUrl = '/table-data/apartment/statistic/user/getWithCondition?' + 'date=' + this.editTime.peopleStatisticsTime + '&campusId=' + this.peopleStatistics.defaultValue.campus + '&zoneId=' + this.peopleStatistics.defaultValue.zone + '&buildingId=' + this.peopleStatistics.defaultValue.building + '&userType=' + this.peopleStatistics.defaultValue.userType + '&educationLevel=' + this.peopleStatistics.defaultValue.educationLevel + '&college=' + this.peopleStatistics.defaultValue.college
      },
      _peopleStatisticsExport: function(){
        if(this.editTime.peopleStatisticsTime === ''){
          this.editTime.peopleStatisticsTime = this.nowDate
        }//时间必填，默认为当前时间
        else {
          var str = this.editTime.peopleStatisticsTime
          str = str.substring(0,10)
          this.editTime.peopleStatisticsTime = str
        }
        if(this.peopleStatisticsFlag === 'switchPeopleDetailedTable')
          window.location.href = '/downloads/apartment/statistic/user/exportBuilding?' + 'date=' + this.editTime.peopleStatisticsTime + '&campusId=' + this.peopleStatistics.defaultValue.campus + '&zoneId=' + this.peopleStatistics.defaultValue.zone + '&buildingId=' + this.peopleStatistics.defaultValue.building + '&userType=' + this.peopleStatistics.defaultValue.userType + '&educationLevel=' + this.peopleStatistics.defaultValue.educationLevel + '&college=' + this.peopleStatistics.defaultValue.college
        else if(this.peopleStatisticsFlag === 'switchStatisticsTable')
          window.location.href = '/downloads/apartment/statistic/user/export?' + 'date=' + this.editTime.peopleStatisticsTime + '&campusId=' + this.peopleStatistics.defaultValue.campus + '&zoneId=' + this.peopleStatistics.defaultValue.zone + '&buildingId=' + this.peopleStatistics.defaultValue.building + '&userType=' + this.peopleStatistics.defaultValue.userType + '&educationLevel=' + this.peopleStatistics.defaultValue.educationLevel + '&college=' + this.peopleStatistics.defaultValue.college
      
      },
      _switchdormitoryStatisticsTable: function(){
        this.dormitoryStatisticsFlag = 'switchDormitoryDetailedTable'
        if(this.editTime.dormitoryStatisticsTime === ''){
          this.editTime.dormitoryStatisticsTime = this.nowDate
        }//时间必填，默认为当前时间
        else {
          var str = this.editTime.dormitoryStatisticsTime
          str = str.substring(0,10)
          this.editTime.dormitoryStatisticsTime = str
        }
        this.dormitoryStatisticsUrl = '/table-data/apartment/statistic/room/getBuildingWithCondition?' + 'date=' + this.editTime.dormitoryStatisticsTime + '&campusId=' + this.dormitoryStatistics.defaultValue.campus + '&zoneId=' + this.dormitoryStatistics.defaultValue.zone + '&buildingId=' + this.dormitoryStatistics.defaultValue.building + '&usedFor=' + this.dormitoryStatistics.defaultValue.usedFor + '&toilet=' + this.dormitoryStatistics.defaultValue.toilet + '&haveBalcony=' + this.dormitoryStatistics.defaultValue.haveBalcony + '&maxNumber=' + this.dormitoryStatistics.defaultValue.maxNumber + '&leftNumber=' + this.dormitoryStatistics.defaultValue.leftNumber + '&livingStatus=' + this.dormitoryStatistics.defaultValue.livingStatus
      },
      _switchPeopleDetailedTable: function(){
        this.peopleStatisticsFlag = 'switchStatisticsTable'
        if(this.editTime.peopleStatisticsTime === ''){
          this.editTime.peopleStatisticsTime = this.nowDate
        }//时间必填，默认为当前时间
        else {
          var str = this.editTime.peopleStatisticsTime
          str = str.substring(0,10)
          this.editTime.peopleStatisticsTime = str
        }
        this.peopleDetailedUrl = '/table-data/apartment/statistic/user/getWithCondition?' + 'date=' + this.editTime.peopleStatisticsTime + '&campusId=' + this.peopleStatistics.defaultValue.campus + '&zoneId=' + this.peopleStatistics.defaultValue.zone + '&buildingId=' + this.peopleStatistics.defaultValue.building + '&userType=' + this.peopleStatistics.defaultValue.userType + '&educationLevel=' + this.peopleStatistics.defaultValue.educationLevel + '&college=' + this.peopleStatistics.defaultValue.college
      },
      _switchPeopleStatisticsTable: function(){
        this.peopleStatisticsFlag = 'switchPeopleDetailedTable'
        if(this.editTime.peopleStatisticsTime === ''){
          this.editTime.peopleStatisticsTime = this.nowDate
        }//时间必填，默认为当前时间
        else {
          var str = this.editTime.peopleStatisticsTime
          str = str.substring(0,10)
          this.editTime.peopleStatisticsTime = str
        }
        this.peopleStatisticsUrl = '/table-data/apartment/statistic/user/getBuildingWithCondition?' + 'date=' + this.editTime.peopleStatisticsTime + '&campusId=' + this.peopleStatistics.defaultValue.campus + '&zoneId=' + this.peopleStatistics.defaultValue.zone + '&buildingId=' + this.peopleStatistics.defaultValue.building + '&userType=' + this.peopleStatistics.defaultValue.userType + '&educationLevel=' + this.peopleStatistics.defaultValue.educationLevel + '&college=' + this.peopleStatistics.defaultValue.college
      },
      _switchDormitoryDetailedTable: function(){
        this.dormitoryStatisticsFlag = 'switchStatisticsTable'
        if(this.editTime.dormitoryStatisticsTime === ''){
          this.editTime.dormitoryStatisticsTime = this.nowDate
        }//时间必填，默认为当前时间
        else {
          var str = this.editTime.dormitoryStatisticsTime
          str = str.substring(0,10)
          this.editTime.dormitoryStatisticsTime = str
        }
        this.dormitoryDetailedUrl = '/table-data/apartment/statistic/room/getWithCondition?' + 'date=' + this.editTime.dormitoryStatisticsTime + '&campusId=' + this.dormitoryStatistics.defaultValue.campus + '&zoneId=' + this.dormitoryStatistics.defaultValue.zone + '&buildingId=' + this.dormitoryStatistics.defaultValue.building + '&usedFor=' + this.dormitoryStatistics.defaultValue.usedFor + '&toilet=' + this.dormitoryStatistics.defaultValue.toilet + '&haveBalcony=' + this.dormitoryStatistics.defaultValue.haveBalcony + '&maxNumber=' + this.dormitoryStatistics.defaultValue.maxNumber + '&leftNumber=' + this.dormitoryStatistics.defaultValue.leftNumber + '&livingStatus=' + this.dormitoryStatistics.defaultValue.livingStatus
      },
      _nowDate: function() {
        var date = new Date()
        var seperator = "-"
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var strDate = date.getDate()
        if (month >= 1 && month <= 9) {
          month = "0" + month
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate
        }
        var currentdate = year + seperator + month + seperator + strDate
        this.nowDate = currentdate
        this.editTime.dormitoryStatisticsTime = currentdate
        this.editTime.peopleStatisticsTime = currentdate
        this.dormitoryStatisticsUrl = '/table-data/apartment/statistic/room/getBuildingWithCondition?' + 'date=' + this.nowDate
        this.dormitoryDetailedUrl = '/table-data/apartment/statistic/room/getWithCondition?' + 'date=' + this.nowDate
        this.peopleStatisticsUrl = '/table-data/apartment/statistic/user/getBuildingWithCondition?' + 'date=' + this.nowDate
        this.peopleDetailedUrl = '/table-data/apartment/statistic/user/getWithCondition?' + 'date=' + this.nowDate
      }
    }
  }
</script>
<style lang="less">
@import url("../../assets/common.less");

#statistics {
  .container-fluid{
    box-shadow: none;
  }
  .statistics-tab {
    &#myTab.nav{
      border-bottom:1px solid #d9d9d9;
    }
    li {
      &.active {
        a {
          color: #298df7;
        }
      }
      a {
        color: rgba(0, 0, 0, 0.87);
      }
    }
  }
  .content {
    position: relative;
    background:white;
  }
  .form-group{
    width:25%;
    .input-label{
      width:40%;
      white-space: nowrap;
      text-align: right;
    }
    .v-select,.v-datepicker{
      width:55%;
    }
  }
}
</style>
