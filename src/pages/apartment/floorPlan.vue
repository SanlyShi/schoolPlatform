<template>
  <div id="floor-plan">
    <div v-show="curRouter==='floorPlan'">
      <div class="page-head">
        <label class="head-title">{{data.title}}</label>
      </div>
      <div class="select-container">
        <div class="select-container-scroll">
          <div class="row">
            <div class="col-md-3">
              <div class="form-group">
                <label class="input-label form-label">学院</label>
                <v-select class="btn-block form-select-style" :value="selectSetting.defaultValue.college" :options="selectSetting.options.college" optionsLabel="label" optionsValue="value" @afterSelected="_searchSelected($event, 'college')" search :multiple="true"></v-select>
              </div>
              <div class="form-group">
                <label class="input-label form-label">居住情况</label>
                <v-select class="btn-block form-select-style" :value="selectSetting.defaultValue.resideStatus" :options="selectSetting.options.resideStatus" optionsLabel="label" optionsValue="value" @afterSelected="_searchSelected($event, 'resideStatus')" search :multiple="true"></v-select>
              </div>
              <div class="form-group">
                <label class="input-label form-label">居住人数</label>
                <v-select class="btn-block form-select-style" :value="selectSetting.defaultValue.userCount" :options="selectSetting.options.userCount" optionsLabel="label" optionsValue="value" @afterSelected="_searchSelected($event, 'userCount')" search :multiple="false"></v-select>
              </div>
            </div>
            <div class="col-md-3">
              <div class="form-group">
                <label class="input-label form-label">培养层次</label>
                <v-select class="btn-block form-select-style" :value="selectSetting.defaultValue.educationLevel" :options="selectSetting.options.educationLevel" optionsLabel="label" optionsValue="value" @afterSelected="_searchSelected($event, 'educationLevel')" search :multiple="true"></v-select>
              </div>
              <div class="form-group">
                <label class="input-label form-label">学生批次</label>
                <input type="text" class="form-control form-input-style" v-model="selectSetting.defaultValue.studentBatch" @change="_changeStudentBatch">
              </div>
              <div class="form-group">
                <label class="input-label form-label">添加颜色</label>
                <input type="color" style="padding:4px 56px 4px 19px" class="form-control form-input-style" v-model="selectSetting.defaultValue.color">
              </div>
            </div>
            <div class="col-md-5">
              <div class="form-group">
                <label class="input-label form-label">时间</label>
                <v-datepicker class="btn-block form-datepicker-style" :clearButton="false" :showTime="false" v-model="selectSetting.defaultValue.dateStart" @daySelected="_dateSelected($event, 'dateStart')"></v-datepicker>
                <span class="time-line"></span>
                <v-datepicker class="btn-block form-datepicker-style" :clearButton="false" :showTime="false" v-model="selectSetting.defaultValue.dateEnd" @daySelected="_dateSelected($event, 'dateEnd')"></v-datepicker>
              </div>
              <div class="limit-line-breaks">
                <div class="form-group" style="display: inline-block;">
                  <label class="input-label form-label multiple-label">楼层</label>
                  <v-select class="btn-block form-select-style multiple-select" :value="selectSetting.defaultValue.floor" :options="selectSetting.options.floors" optionsLabel="label" optionsValue="value" @afterSelected="_searchSelected($event, 'floors')" search :multiple="true"></v-select>
                </div>
                <div class="form-group" style="display: inline-block;">
                  <label class="input-label form-label">房间用途</label>
                  <v-select class="btn-block form-select-style" :value="selectSetting.defaultValue.roomUserFor" url="/api/apartment/dicts?typeName=房间用途" optionsLabel="label" optionsValue="value" @afterSelected="_searchSelected($event, 'roomUserFor')" search :multiple="true"></v-select>
                </div>
              </div>
              <div class="form-group clearfix">
                <button type="button" class="btn reset-btn clearBtnBorder" @click="_reset">重置</button>
                <button type="button" class="btn search-btn clearBtnBorder" @click="_search">搜索</button>
                <button type="button" class="btn export-btn clearBtnBorder" @click="_export">导出</button>
              </div>
            </div>

          </div>
        </div>
      </div>
      <div class="tab">
        <div :class="{active:tab.curSelectedTab === item.id}" v-for="(item, index) in tab.tabs" :key="index" @click="changeTab(item)">{{item.title}}</div>
      </div>
      <div class="tab-content">
        <div class="floor-plan-container" v-show="tab.curSelectedTab === 'floorPlan'">
          <div class="select-condition">
            <div class="title">筛选条件：</div>
            <div class="content">
              <div v-for="(item, itemIndex) in selectSetting.condition" :key="itemIndex">
                <span>{{item.label}}</span>
                <span class="color-block" :style="'background:' + item.color"></span>
                <span class="maticon delete-icon-btn" v-html="icons('clear')" @click="deleteCondition(item, itemIndex)" v-if="selectSetting.isMarkerColor">clear</span>
              </div>
            </div>
          </div>
          <div class="list">
            <div class="floor-card" v-for="(floorCell, fcIndex) in floorPlanData.data" :key="fcIndex">
              <div class="floor">{{sectionToChinese(floorCell.floor)}}楼</div>
              <div v-if="floorCell.roomList&&floorCell.roomList.length > 0">
                <div class="floor-detail" v-for="(roomCell, rcIndex) in floorCell.roomList" :key="rcIndex">
                  <div class="info-card">
                    <div class="head" @click="_dormitoryDetailInfo(roomCell)">
                      <div class="room-number">{{roomCell.roomNo}}</div>
                      <div class="staff-number" :title=" item==0?itemIndex + '等'+roomCell.users.length+'人':''" v-show="item===0" v-for="(item, itemIndex) in _getProfessionalNumber(roomCell.users)" :key="itemIndex">{{ item==0?itemIndex + '等':''}}{{roomCell.users.length}}人</div>
                      <div class="bed-situation">{{_getBedNumber(roomCell.maxNumber, roomCell.currentNumber)}}</div>
                    </div>
                    <div class="body">
                      <div class="staff-list">
                        <div class="staff-name" @click="_checkStaffInfo(userCell)" v-for="(userCell, ucIndex) in roomCell.users" :key="ucIndex" @mouseover="_showInfoBlock(roomCell, userCell)" @mouseout="_hideInfoBlock(roomCell)" :title="userCell.name + userCell.grade + userCell.collegeShortName?userCell.collegeShortName:''">
                          {{userCell.name}}{{userCell.grade&&'-'+userCell.grade+'级'}}{{userCell.majorName&&'-'+userCell.majorName}}{{userCell.className&&'-'+userCell.className}}
                        </div>
                      </div>
                      <div class="color-mark-list">
                        <div class="color-mark" :style="'background:' + colorCell" v-for="(colorCell, ccIndex) in roomCell.colors" :key="ccIndex"></div>
                      </div>
                    </div>
                  </div>
                  <div class="extra-info-block" @mouseover="_showInfoBlock(roomCell)" @mouseout="_hideInfoBlock(roomCell)" v-show="roomCell.isShowInfoBlock">
                    <div class="originPlace" v-if="floorPlanData.extraInfo.originPlace" :title="floorPlanData.extraInfo.originPlace">{{floorPlanData.extraInfo.originPlace}}</div>
                    <div v-if="floorPlanData.extraInfo.department" :title="floorPlanData.extraInfo.department">{{floorPlanData.extraInfo.department}}</div>
                    <div>
                      {{floorPlanData.extraInfo.grade+'级'+(floorPlanData.extraInfo.majorName?floorPlanData.extraInfo.majorName:'')+(floorPlanData.extraInfo.className?floorPlanData.extraInfo.className:'')}}
                      </div>
                    <div v-if="floorPlanData.extraInfo.timeTable" :title="floorPlanData.extraInfo.timeTable">{{floorPlanData.extraInfo.timeTable}}</div>
                    <div v-if="floorPlanData.extraInfo.airConditioningTemperature" :title="floorPlanData.extraInfo.airConditioningTemperature+'℃'">{{floorPlanData.extraInfo.airConditioningTemperature}}℃</div>
                  </div>
                </div>
              </div>
              <div v-else>
                暂无数据
              </div>
            </div>
          </div>
        </div>
        <div class="count-container" v-show="tab.curSelectedTab === 'count'">
          <div class="select-condition">
            <div class="title">筛选条件：</div>
            <div class="content">
              <div v-for="(item, itemIndex) in selectSetting.condition" :key="itemIndex">
                <span>{{item.label}}</span>
              </div>
            </div>
          </div>
          <div class="count-list">
            <div class="title">统计图</div>
            <div class="content">
              <div v-for="(cell, cellIndex) in count.pie">
                <div class="title" v-if="cell.title.length > 0">
                  <span>{{cell.index}}、{{cell.title}}</span>
                  <span class="change-chart-status" @click="changePie(cell, cellIndex, 'show')" v-if="!cell.isShowPie">显示饼图</span>
                  <span class="change-chart-status" @click="changePie(cell, cellIndex, 'hide')" v-else>收起饼图</span>
                </div>
                <div class="count-charts" v-if="cell.isShowPie">
                  <div v-for="(item, itemIndex) in cell.data" :key="itemIndex">
                    <c-pieEcharts :countData="item.value"></c-pieEcharts>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="curRouter==='dormitoryDetailInfo'">
      <dormitoryDetailInfo :roomId="curRoomId" :beginTime="selectSetting.defaultValue.dateStart" :endTime="selectSetting.defaultValue.dateEnd" :roomNo="curRoomNo" @back="_backFloorPlan" v-if="curRouter==='dormitoryDetailInfo'"></dormitoryDetailInfo>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { sAjax, translation } from '../../assets/utils/utils.js'
import dormitoryDetailInfo from './dormitoryDetailInfo.vue'
import CpieEcharts from './components/pieEcharts.vue'
import { fail } from 'assert';
Vue.component('c-pieEcharts', CpieEcharts)
Vue.component('dormitoryDetailInfo', dormitoryDetailInfo)
export default {
  inject: {
    windowObj: {
      default: null
    }
  },
  props: {
    data: {
      default: null
    }
  },
  data: function () {
    return {
      curRouter: 'floorPlan',
      selectSetting: {
        defaultValue: {
          college: '',
          educationLevel: '',
          dateStart: '',
          dateEnd: '',
          resideStatus: '',
          studentBatch: '',
          roomUserFor: '',
          floor: '',
          color: '',
          userCount: ''
        },
        defaultLabel: {
          college: [],
          educationLevel: [],
          floors: [],
          resideStatus: [],
          roomUserFor: [],
          userCount: []
        },
        options: {
          college: [],
          educationLevel: [],
          resideStatus: [{ value: 'FULL', label: '住满' }, { value: 'PART', label: '零星空房' }, { value: 'EMPTY', label: '整间空房' }],
          floors: [],
          userCount: []
        },
        searchParameter: {
          college: [],
          educationLevel: [],
          floors: [],
          resideStatus: [],
          roomUserFor: [],
          dateStart: '',
          dateEnd: '',
          studentBatch: '',
          userCount: ''
        },
        conditionWithColor: [],
        condition: [],
        isMarkerColor: false,
        floorNumberArray: [],
        limitationFactor: {
          college: ['resideStatus', 'studentBatch', 'roomUserFor'],
          educationLevel: ['resideStatus', 'studentBatch', 'roomUserFor'],
          resideStatus: ['college', 'educationLevel', 'studentBatch', 'roomUserFor'],
          studentBatch: ['college', 'educationLevel', 'resideStatus', 'roomUserFor'],
          roomUserFor: ['college', 'educationLevel', 'studentBatch', 'resideStatus', 'userCount'],
          userCount: ['roomUserFor']
        },
        fieldName: {
          college: '学院',
          educationLevel: '培养层次',
          dateStart: '时间',
          dateEnd: '时间',
          resideStatus: '居住情况',
          studentBatch: '学生批次',
          roomUserFor: '房间用途',
          userCount: '居住人数'
        }
      },
      tab: {
        curSelectedTab: 'floorPlan',
        tabs: [{ id: 'floorPlan', title: '平面图' }, { id: 'count', title: '统计图' }]
      },
      floorPlanData: {
        data: [],
        allInitData: [],
        extraInfo: {}
      },
      count: {
        curShowPie: 'roomCollege',
        initData: {},
        echartsData: [],
        pie: {
          roomCollege: {
            index: '1',
            title: '',
            isShowPie: true,
            data: []
          },
          roomEducationLevel: {
            index: '2',
            title: '',
            isShowPie: false,
            data: []
          },
          roomUserFor: {
            index: '3',
            title: '',
            isShowPie: false,
            data: []
          },
          roomBatch: {
            index: '4',
            title: '',
            isShowPie: false,
            data: []
          },
          roomReside: {
            index: '5',
            title: '',
            isShowPie: false,
            data: []
          },
          roomCheckIn: {
            index: '6',
            title: '',
            isShowPie: false,
            data: []
          },
          roomRetirement: {
            index: '7',
            title: '',
            isShowPie: false,
            data: []
          }
        }
      },
      chnNumChar: ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"],
      chnUnitChar: ["", "十"],
      curRoomId: '',
      curRoomNo: ''
    }
  },
  computed: {
  },
  created: function () {
    this.init();
  },
  watch: {
    studentWatch: {
      deep: true,
      handler: function (n, o) {

      }
    },
    data(newV, oldV) {
      if (newV.data.buildingId !== oldV.data.buildingId) {
        this.init();
      }
    }
  },
  methods: {
    init() {
      sAjax({
        url: '/api/apartment/plains/selectOptions/' + this.data.data.buildingId,
        type: 'get',
        success: (data) => {
          if (data.state) {
            if (data.data) {
              if (data.data.dicts) {
                data.data.dicts.forEach((ele) => {
                  this.selectSetting.options.educationLevel.push({
                    value: ele.value,
                    label: ele.label
                  })
                })
              }
              if (data.data.units) {
                data.data.units.forEach((ele) => {
                  this.selectSetting.options.college.push({
                    value: ele.code,
                    label: ele.name
                  })
                })
              }
              if (data.data.userNums) {
                data.data.userNums.forEach((ele) => {
                  this.selectSetting.options.userCount.push({
                    value: ele.id,
                    label: ele.title
                  })
                })
              }
            }
          } else {
            this.$toast(data.message)
          }
        }
      })
      this._setSelectData()
      this._getCountData()
    },
    _setSelectData: function () {
      var curFloors = []
      this.selectSetting.options.floors = []
      this.selectSetting.floorNumberArray = []
      for (let i = 0; i < this.data.data.floor; i++) {
        this.selectSetting.options.floors.push({
          value: (i + 1).toString(),
          label: this.sectionToChinese((i + 1)) + '楼'
        })
        this.selectSetting.floorNumberArray.push((i + 1).toString())
      }
      var now = new Date()
      var time = now.getFullYear() + "-" + ((now.getMonth() + 1) < 10 ? "0" : "") + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? "0" : "") + now.getDate()
      this.selectSetting.defaultValue.dateStart = time
      this.selectSetting.defaultValue.dateEnd = time
      this._getFloorOfRooms(this.selectSetting.floorNumberArray, 'init')
    },
    changeTab: function (item) {
      this.tab.curSelectedTab = item.id
    },
    _changeStudentBatch: function () {
      for (var i in this.selectSetting.limitationFactor.studentBatch) {
        var item = this.selectSetting.limitationFactor.studentBatch[i]
        if (this.selectSetting.defaultValue[item]) {
          this.$toast('学生批次不能跟' + this.selectSetting.fieldName[item] + '同时搜索')
          this.selectSetting.defaultValue.studentBatch = ''
        }
      }
    },
    _getBedNumber: function (maxNumber, currentNumber) {
      var bedNumber = ''
      if (maxNumber - currentNumber > 0) {
        bedNumber = maxNumber - currentNumber + '个空床'
      } else {
        bedNumber = '无空床'
      }
      return bedNumber
    },
    _getProfessionalNumber: function (users) {
      var array = []
      var obj = {}
      console.log(users)
      if (users.length > 0) {
        users.forEach((ele) => {
          if (ele.grade) {
            var text = ele.grade + '级' + ele.name?ele.name:'' + ele.college?ele.college:'' + ele.className?ele.className:''
            array.push(text)
          }
        })
      }
      for (var i = 0, l = array.length; i < l; i++) {
        var item = array[i]
        obj[item] = i
      }
      return obj
    },
    _showInfoBlock: function (users, userCell) {
      users.isShowInfoBlock = true
      if (userCell) {
        this.floorPlanData.extraInfo = userCell
      }
    },
    _hideInfoBlock: function (users) {
      users.isShowInfoBlock = false
    },
    _searchSelected: function (obj, type) {
      if (this.selectSetting.defaultValue['college']) {
        if (this.selectSetting.limitationFactor.college.indexOf(type) >= 0) {
          this.$toast(this.selectSetting.fieldName[type] + '不能跟学院同时搜索')
          this.$nextTick(() => {
            this.selectSetting.defaultValue[type] = ''
            return
          })
        }
      }
      if (this.selectSetting.defaultValue['educationLevel']) {
        if (this.selectSetting.limitationFactor.educationLevel.indexOf(type) >= 0) {
          this.$toast(this.selectSetting.fieldName[type] + '不能跟培养层次同时搜索')
          this.$nextTick(() => {
            this.selectSetting.defaultValue[type] = ''
            return
          })
        }
      }
      if (this.selectSetting.defaultValue['resideStatus']) {
        if (this.selectSetting.limitationFactor.resideStatus.indexOf(type) >= 0) {
          this.$toast(this.selectSetting.fieldName[type] + '不能跟居住情况同时搜索')
          this.$nextTick(() => {
            this.selectSetting.defaultValue[type] = ''
            return
          })
        }
      }
      if (this.selectSetting.defaultValue['roomUserFor']) {
        if (this.selectSetting.limitationFactor.roomUserFor.indexOf(type) >= 0) {
          this.$toast(this.selectSetting.fieldName[type] + '不能跟房间用途同时搜索')
          this.$nextTick(() => {
            this.selectSetting.defaultValue[type] = ''
            return
          })
        }
      }
      if (this.selectSetting.defaultValue.studentBatch) {
        if (this.selectSetting.limitationFactor.studentBatch.indexOf(type) >= 0) {
          this.$toast(this.selectSetting.fieldName[type] + '不能跟学生批次同时搜索')
          this.$nextTick(() => {
            this.selectSetting.defaultValue[type] = ''
            return
          })
        }
      }
      if (this.selectSetting.defaultValue['userCount']) {
        if (this.selectSetting.limitationFactor.userCount.indexOf(type) >= 0) {
          this.$toast(this.selectSetting.fieldName[type] + '不能跟居住人数同时搜索')
          this.$nextTick(() => {
            this.selectSetting.defaultValue[type] = ''
            return
          })
        }
      }
      this.selectSetting.defaultValue[type] = obj.value
      this.selectSetting.searchParameter[type] = []
      if (obj.value.length > 0) {
        if (type === 'userCount') {
          this.selectSetting.searchParameter[type] = obj.value
        } else {
          this.selectSetting.searchParameter[type] = obj.value.split(',')
        }
      }
      this.$nextTick(() => {
        this.selectSetting.defaultLabel[type] = []
        if (obj.target.selected.length > 0) {
          if (type === 'userCount') {
            obj.target.selected.split(',').forEach((ele) => {
              this.selectSetting.defaultLabel[type].push('居住人数为' + ele)
            })
          } else {
            this.selectSetting.defaultLabel[type] = obj.target.selected.split(',')
          }
        }
      })

    },
    _dateSelected: function (obj, type) {
      var dateStart = this.selectSetting.defaultValue.dateStart
      var dateEnd = this.selectSetting.defaultValue.dateEnd
      if (type === 'dateStart') {
        if (dateEnd) {
          var timeString = new Date(obj.value).getTime() - new Date(dateEnd).getTime()
          if (timeString > 0) {
            this.$nextTick(() => {
              this.$toast('开始时间要在结束时间之前')
              this.selectSetting.defaultValue.dateStart = ''
            })
            return false
          } else {
            this.selectSetting.defaultValue.dateStart = obj.value
          }
        } else {
          this.selectSetting.defaultValue.dateStart = obj.value
        }
      }
      if (type === 'dateEnd') {
        if (dateStart) {
          var timeString = new Date(obj.value).getTime() - new Date(dateStart).getTime()
          if (timeString < 0) {
            this.$nextTick(() => {
              this.$toast('结束时间要在开始时间之后')
              this.selectSetting.defaultValue.dateEnd = ''
            })
            return false
          } else {
            this.selectSetting.defaultValue.dateEnd = obj.value
          }
        } else {
          this.selectSetting.defaultValue.dateEnd = obj.value
        }
      }
    },
    _reset: function () {
      this.selectSetting.defaultValue = {
        college: '',
        educationLevel: '',
        dateStart: '',
        dateEnd: '',
        resideStatus: '',
        studentBatch: '',
        roomUserFor: '',
        floor: '',
        color: '',
        userCount: ''
      }
      this.selectSetting.defaultLabel = {
        college: [],
        educationLevel: [],
        floors: [],
        resideStatus: [],
        roomUserFor: [],
        userCount: []
      }
      this.selectSetting.searchParameter = {
        college: [],
        educationLevel: [],
        floors: [],
        resideStatus: [],
        roomUserFor: [],
        dateStart: '',
        dateEnd: '',
        studentBatch: '',
        userCount: ''
      }
      this.selectSetting.conditionWithColor = []
      this.selectSetting.condition = []
      this.selectSetting.floorNumberArray = []
      this.selectSetting.isMarkerColor = false
      this.floorPlanData.data = []
      this.floorPlanData.allInitData = []
      this._setSelectData()
      this._getCountData()
    },
    _export: function () {
      var statisticData = ''
      for (var i in this.count.pie) {
        if (this.count.pie[i].title) {
          statisticData += this.count.pie[i].title + ','
        }
      }
      statisticData = statisticData.substring(0, statisticData.length - 1)
      var searchParameter = ''
      for (var i in this.selectSetting.defaultValue) {
        if (i !== 'color') {
          if (this.selectSetting.defaultValue[i]) {
            searchParameter += '&' + i + '=' + this.selectSetting.defaultValue[i]
          }
        }
      }
      var myDate = new Date()
      var nowTime = myDate.getFullYear() + this._getTimeFormat(myDate.getMonth() + 1) + this._getTimeFormat(myDate.getDate())
      window.location.href = '/downloads/apartment/plains/excel/' + this.data.data.buildingId + '?fileName=' + this.data.title + '_' + nowTime + '&statisticData=' + statisticData + searchParameter
    },
    _getTimeFormat: function (time) {
      return time < 10 ? '0' + time : time
    },
    _search: function () {
      if (!this.selectSetting.defaultValue.dateStart) {
        this.$toast('请先选择开始时间')
        return
      }
      if (!this.selectSetting.defaultValue.dateEnd) {
        this.$toast('请先选择结束时间')
        return
      }
      this.selectSetting.searchParameter.studentBatch = this.selectSetting.defaultValue.studentBatch
      if (this.selectSetting.defaultValue.color) {
        this.selectSetting.isMarkerColor = true
      } else {
        this.selectSetting.isMarkerColor = false
      }
      var curFloors = []
      if (this.selectSetting.searchParameter.floors.length > 0) {
        curFloors = this.selectSetting.searchParameter.floors
      } else {
        curFloors = this.selectSetting.floorNumberArray
      }
      this._getSelectCondition()
      this._getFloorOfRooms(curFloors, 'search')
      this._getCountData()
    },
    _getFloorOfRooms: function (floors, type) {
      this._getFormatDate()
      var floorArr = []
      sAjax({
        url: '/api/apartment/plains/' + this.data.data.buildingId,
        type: 'get',
        data: this.selectSetting.searchParameter,
        success: (data) => {
          if (data.state) {
            if (data.data) {
              console.log('data', data)
              //  if (type === 'init') {
              //     this.floorPlanData.allInitData = data.data
              //   } 
              //   var initData = this.selectSetting.isMarkerColor ? this.floorPlanData.allInitData : data.data
              //   for (var i in floorArr) {
              //     if (initData[floorArr[i].floor]) {
              //        floorArr[i].roomList = initData[floorArr[i].floor]
              //        for (var j in floorArr[i].roomList) {
              //          if (!floorArr[i].roomList[j]['isShowInfoBlock']) {
              //            this.$set(floorArr[i].roomList[j], 'isShowInfoBlock', false)
              //          }
              //          if (this.selectSetting.isMarkerColor) {
              //            if (!floorArr[i].roomList[j]['colors']) {
              //               this.$set(floorArr[i].roomList[j], 'colors', [])
              //             }
              //             floorArr[i].roomList[j]['colors'].push(this.selectSetting.defaultValue.color)
              //          }
              //        }
              //     }
              //   }
              // for (var i in floorArr) {
              //   if (data.data[floorArr[i].floor]) {
              //     floorArr[i].roomList = data.data[floorArr[i].floor]
              //     for (var j in floorArr[i].roomList) {
              //       if (!floorArr[i].roomList[j]['isShowInfoBlock']) {
              //         this.$set(floorArr[i].roomList[j], 'isShowInfoBlock', false)
              //       }
              //     }
              //   }
              // }
              // let dataArr = []
              for (let index in data.data) {
                for (let i in data.data[index]) {
                  if (!data.data[index][i].isShowInfoBlock) {
                    data.data[index][i].isShowInfoBlock = false
                  }
                }
                floorArr.push({ floor: index, roomList: data.data[index] })
              }
              // floorArr = dataArr.map((o, index) => {
              //   let a = {};
              //   for (let i in o) {
              //     if (!o[i].isShowInfoBlock) {
              //       o[i].isShowInfoBlock = false
              //     }
              //   }
              //   a.floor = index + 1;
              //   a.roomList = o;
              //   return a;
              // })
              console.log('floorArr', floorArr)
              if (type === 'init') {
                this.floorPlanData.allInitData = floorArr
              }
              if (this.selectSetting.isMarkerColor) {
                for (var i in floorArr) {
                  for (var j in this.floorPlanData.allInitData) {
                    if (floorArr[i].floor === this.floorPlanData.allInitData[j].floor) {
                      if (floorArr[i].roomList.length > 0) {
                        for (var z in floorArr[i].roomList) {
                          for (var k in this.floorPlanData.allInitData[j].roomList) {
                            if (floorArr[i].roomList[z].roomId === this.floorPlanData.allInitData[j].roomList[k].roomId) {
                              if (!this.floorPlanData.allInitData[j].roomList[k]['colors']) {
                                this.$set(this.floorPlanData.allInitData[j].roomList[k], 'colors', [])
                              }
                              this.floorPlanData.allInitData[j].roomList[k]['colors'].push(this.selectSetting.defaultValue.color)
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }

            }
            if (this.selectSetting.isMarkerColor) {
              this.floorPlanData.data = this.floorPlanData.allInitData
            } else {
              this.floorPlanData.data = floorArr
            }
            this.selectSetting.defaultValue.color = ''
          } else {
            this.$toast(data.message)
          }
        }
      })
    },
    _getSelectCondition: function () {
      var cartesianArr = []
      for (var i in this.selectSetting.defaultLabel) {
        if (this.selectSetting.defaultLabel[i].length > 0) {
          cartesianArr.push(this.selectSetting.defaultLabel[i])
        }
      }
      var newCartesianArr = this._multiCartesian(cartesianArr)
      this._getFormatDate()
      var startArr = this.selectSetting.searchParameter.dateStart.split('-')
      var endArr = this.selectSetting.searchParameter.dateEnd.split('-')
      var time = startArr[0] + '年' + startArr[1] + '月' + startArr[2] + '日' + '至' + endArr[0] + '年' + endArr[1] + '月' + endArr[2] + '日'
      this.selectSetting.condition.splice(0, this.selectSetting.condition.length)
      if (newCartesianArr.length === 0) {
        var text = this.selectSetting.searchParameter.studentBatch + time
        this._createCondition(text)
      } else {
        for (var i in newCartesianArr) {
          var text = this.selectSetting.searchParameter.studentBatch + time + newCartesianArr[i]
          this._createCondition(text)
        }
      }
    },
    _getFormatDate: function () {
      this.selectSetting.searchParameter.dateStart = /\d{4}-\d{1,2}-\d{1,2}/g.exec(this.selectSetting.defaultValue.dateStart)[0]
      this.selectSetting.searchParameter.dateEnd = /\d{4}-\d{1,2}-\d{1,2}/g.exec(this.selectSetting.defaultValue.dateEnd)[0]
    },
    _getCountData: function () {
      this._getFormatDate()
      var pieFieldArr = ['roomCollege', 'roomEducationLevel', 'roomUserFor', 'roomBatch']
      var resideJosn = { FULL: '住满', PART: '零星空房', EMPTY: '整间空房' }
      sAjax({
        url: '/api/apartment/plains/statistic/' + this.data.data.buildingId,
        type: 'get',
        data: this.selectSetting.searchParameter,
        success: (data) => {
          if (data.state) {
            this.count.initData = data.data
            var curShowPie = this.count.curShowPie
            for (var i in data.data) {
              var title = ''
              this.count.pie[i].title = ''
              for (var j in data.data[i]) {
                for (var z in data.data[i][j].conditionAndList) {
                  if (pieFieldArr.indexOf(i) >= 0) {
                    title += z + '的有' + data.data[i][j].conditionAndList[z].length + '间，'
                  }
                  if (i === 'roomReside') {
                    title += resideJosn[z] + data.data[i][j].conditionAndList[z].length + '间，分别是' + data.data[i][j].conditionAndList[z].join('、') + '；'
                  }
                  if (i === 'roomCheckIn' || i === 'roomRetirement') {
                    title += z + '共' + data.data[i][j].conditionAndList[z].length + '人，'
                  }
                }
                if (pieFieldArr.indexOf(i) >= 0) {
                  this.count.pie[i].title += '总房间共' + data.data[i][j].count + '间，其中' + title
                }
                if (i === 'roomReside') {
                  this.count.pie[i].title += '总床位共' + data.data[i][j].count + '个，其中' + title
                }
                if (i === 'roomCheckIn' || i === 'roomRetirement') {
                  var typeTitle = i === 'roomCheckIn' ? '入住' : '退宿'
                  this.count.pie[i].title += data.data[i][j].year + typeTitle + '的共' + data.data[i][j].count + '人，其中' + title
                }
                this.count.pie[i].title = this.count.pie[i].title.substring(0, this.count.pie[i].title.length - 1)
              }
            }
            this._showSelectedPie()
          } else {
            this.$toast(data.message)
          }
        }
      })
    },
    changePie: function (cell, cellIndex, type) {
      if (type === 'show') {
        this.count.curShowPie = cellIndex
        for (var i in this.count.pie) {
          this.count.pie[i].isShowPie = false
        }
        cell.isShowPie = true
        this._showSelectedPie()
      } else {
        this.count.curShowPie = ''
        cell.isShowPie = false
      }
    },
    _showSelectedPie: function () {
      var resideJosn = { FULL: '住满', PART: '零星空房', EMPTY: '整间空房' }
      var initPieArr = this.count.initData[this.count.curShowPie]
      var newPieArr = this.count.pie[this.count.curShowPie].data
      newPieArr.splice(0, newPieArr.length)
      for (var i in initPieArr) {
        newPieArr.push({
          index: i,
          value: []
        })
        if (initPieArr[i].conditionAndList) {
          for (var j in initPieArr[i].conditionAndList) {
            newPieArr[i].value.push({
              name: this.count.curShowPie === 'roomReside' ? resideJosn[j] : j,
              value: initPieArr[i].conditionAndList[j].length
            })
          }
        }
      }
    },
    _createCondition: function (text) {
      if (this.selectSetting.isMarkerColor) {
        this.selectSetting.conditionWithColor.push({
          label: text,
          color: this.selectSetting.defaultValue.color
        })
        this.selectSetting.condition = JSON.parse(JSON.stringify(this.selectSetting.conditionWithColor))
      } else {
        this.selectSetting.condition.push({
          label: text,
          color: ''
        })
      }
    },
    deleteCondition: function (item, itemIndex) {
      this.selectSetting.condition.splice(itemIndex, 1)
      this.selectSetting.conditionWithColor.splice(itemIndex, 1)
      for (var i in this.floorPlanData.data) {
        var roomList = this.floorPlanData.data[i].roomList
        if (roomList.length > 0) {
          for (var j in roomList) {
            if (roomList[j].colors) {
              var index = roomList[j].colors.indexOf(item.color)
              if (index >= 0) {
                roomList[j].colors.splice(index, 1)
              }
            }
          }
        }
      }
    },
    _checkStaffInfo: function (record) {
      this.$emit('addBread', {
        route: '/apartment/staffInfo?userId=' + record.userId,
        title: record.name + '的信息',
      })
    },
    _dormitoryDetailInfo: function (room) {
      this.curRouter = 'dormitoryDetailInfo'
      this.curRoomId = room.roomId
      this.curRoomNo = room.roomNo
    },
    _backFloorPlan: function () {
      this.curRouter = 'floorPlan'
    },
    //笛卡尔积 
    _cartesian: function (a, b) {
      var ret = [];
      for (var i = 0; i < a.length; i++) {
        for (var j = 0; j < b.length; j++) {
          ret.push(this._getCombinationStr(a[i], b[j]));
        }
      }
      return ret;
    },
    _getCombinationStr: function (a, b) {
      var ret = a + b
      return ret;
    },
    //多个笛卡尔积 
    _multiCartesian: function (data) {
      var len = data.length;
      if (len == 0)
        return [];
      else if (len == 1)
        return data[0];
      else {
        var r = data[0];
        for (var i = 1; i < len; i++) {
          r = this._cartesian(r, data[i]);
        }
        return r;
      }
    },
    sectionToChinese: function (section) {
      var strIns = '', chnStr = ''
      var unitPos = 0
      var zero = true
      while (section > 0) {
        var v = section % 10
        if (v === 0) {
          if (!zero) {
            zero = true
            chnStr = this.chnNumChar[v] + chnStr
          }
        } else {
          zero = false
          strIns = this.chnNumChar[v]
          strIns += this.chnUnitChar[unitPos]
          chnStr = strIns + chnStr
        }
        unitPos++
        section = Math.floor(section / 10)
      }
      return chnStr
    }
  }
}
</script>
<style lang="less">
#floor-plan {
  width: 1135px;
  height: 100%;
  margin: 0 auto 0;
  background: #fff;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
  position: relative;
  .page-head {
    height: 53px;
    border-bottom: 1px solid #f0f0f0;
    .head-title {
      font-size: 16px;
      color: rgba(0, 0, 0, 0.87);
      padding: 15px 24px;
    }
  }
  .select-container {
    border-bottom: 2px solid #f3f3f3;
    padding: 28px 0 10px 34px;
    .limit-line-breaks {
      width: 478px;
      float: right;
    }
    .form-group {
      float: right;
      .form-label {
        width: 60px;
        font-size: 13px;
        color: #333333;
        text-align: right;
        margin-right: 6px;
      }
      .form-select-style,
      .form-input-style,
      .form-datepicker-style {
        width: 160px;
        &.multiple-select {
          width: 125px;
        }
      }
      .time-line {
        border: 1px solid #5b5b5b;
        width: 10px;
        height: 1px;
        display: inline-block;
        vertical-align: super;
        margin: 0 10px;
      }
    }
    .reset-btn,
    .search-btn {
      font-size: 13px;
      color: #298df7;
      padding: 8px 9px;
      background: #ffffff;
    }
    .export-btn {
      background: #298df7;
      box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
      border-radius: 1px;
      font-size: 13px;
      color: #ffffff;
      padding: 8px 27px;
      margin-left: 10px;
    }
  }
  .tab {
    height: 46px;
    border-bottom: 2px solid #f3f3f3;
    padding: 0 40px;
    div {
      display: inline-block;
      font-size: 14px;
      color: #666666;
      padding: 12px 10px 0;
      margin-right: 42px;
      height: 44px;
      cursor: pointer;
      &.active {
        color: #298df7;
        border-bottom: 2px solid #298df7;
      }
    }
  }
  .tab-content {
    position: absolute;
    top:330px;
    left: 0;
    right: 0;
    bottom: 0;
    .select-condition {
      font-size: 13px;
      color: #666666;
      padding: 16px 40px 0 40px;
      .title {
        display: inline-block;
        vertical-align: top;
        margin-top: 3px;
      }
      .content {
        display: inline-block;
        div {
          margin-bottom: 5px;
          .color-block {
            width: 20px;
            height: 20px;
            display: inline-block;
            vertical-align: bottom;
            margin-left: 5px;
          }
          .delete-icon-btn {
            font-size: 17px;
            background: #e0e0e0;
            color: #ffffff;
            border-radius: 50%;
            margin-left: 15px;
            vertical-align: middle;
            cursor: pointer;
          }
        }
      }
    }
    .floor-plan-container {
      height: 100%;
      padding-bottom: 40px;
      .list {
        height: 100%;
        padding: 0 40px 0px 40px;
        overflow-y: auto;
        &::-webkit-scrollbar {
          /*滚动条整体样式*/
          width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
          height: 1px;
        }
        &::-webkit-scrollbar-thumb {
          /*滚动条里面小方块*/
          border-radius: 10px;
          background: #eceff1;
        }
        &::-webkit-scrollbar-track {
          /*滚动条里面轨道*/
          border-radius: 10px;
          background: none;
        }
        .floor-card {
          border-bottom: 1px solid #f0f0f0;
        }
        .floor {
          font-size: 16px;
          color: #298df7;
          line-height: 40px;
          margin-top: 2px;
        }
        .floor-detail {
          padding-right: 11px;
          padding-bottom: 9px;
          display: inline-block;
          position: relative;
          .info-card {
            width: 120px;
            height: 154px;
            .head {
              width: 120px;
              height: 68px;
              border: 1px solid #d7deed;
              font-size: 14px;
              line-height: 16px;
              overflow-x: hidden;
              overflow-y: scroll;
              &::-webkit-scrollbar {
                display: none;
              }
              &:hover {
                background: #e5e7f8;
                cursor: pointer;
              }
              .room-number {
                color: #298df7;
                margin-bottom: 1px;
                padding: 8px 9px 0 9px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              .staff-number {
                color: #616264;
                margin-bottom: 1px;
                padding: 1px 9px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              .bed-situation {
                color: #a2a2a2;
                padding: 0 9px 5px 9px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
            .body {
              border-bottom: 1px solid #e4e4e4;
              border-left: 1px solid #e4e4e4;
              border-right: 1px solid #e4e4e4;
              width: 120px;
              height: 85px;
              overflow-x: hidden;
              overflow-y: scroll;
              &::-webkit-scrollbar {
                display: none;
              }
              .staff-list {
                width: 100px;
                height: 85px;
                display: inline-block;
                vertical-align: top;
              }
              .color-mark-list {
                width: 14px;
                height: 85px;
                display: inline-block;
                padding-top: 7px;
                .color-mark {
                  border-radius: 50%;
                  width: 10px;
                  height: 10px;
                  background: red;
                  margin-left: 2px;
                  margin-bottom: 12px;
                }
              }
              .staff-name {
                font-size: 13px;
                color: #4e4f54;
                line-height: 16px;
                padding: 3px 10px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                &:hover {
                  background: #e5e7f8;
                  cursor: pointer;
                }
              }
            }
          }
          .extra-info-block {
            background: #298df7;
            border-radius: 3px;
            width: 108px;
            height: 119px;
            position: absolute;
            z-index: 100;
            top: 75px;
            right: -80px;
            padding: 0 4px;
            div {
              font-size: 12px;
              color: #ffffff;
              line-height: 14px;
              padding: 4px 5px;
              &.originPlace {
                font-size: 13px;
                color: #ffffff;
                line-height: 16px;
                border-bottom: 1px solid #ffffff;
                padding: 6px 5px;
              }
            }
          }
        }
      }
    }
    .count-container {
      .count-list {
        padding: 28px 40px;
        .title {
          font-size: 16px;
          color: #333333;
          margin-bottom: 19px;
        }
        .content {
          .title {
            font-size: 14px;
            color: #666666;
            .change-chart-status {
              color: #298df7;
              cursor: pointer;
            }
          }
          .count-charts {
            padding: 0 110px;
            .charts {
              width: 167px;
              height: 167px;
              margin-left: 35px;
              background: red;
            }
          }
        }
      }
    }
  }
}
.clearfix {
  button {
    float: left;
  }
}
</style>
