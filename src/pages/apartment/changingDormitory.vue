<template>
  <div id="changingDormitory-page" class="container-fluid" >
    <div class="row text-center" v-show="!importPage">
      <v-table :title="translate.tableName"  :url="`${url}?timeStamp=${timeStamp}`" pagesize="10" idField="id" :columns="columns" :order="true"  :search="true">
      </v-table>
    </div>
    <v-modal :show="showSingleChangingDormitoryModal" effect="fade" width="1000">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          {{translate.singleChangingDormitory}}
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="form-group">
          <label class="input-label">{{translate.currentStudentName}}: </label>
          <label class="class-name-text">{{studentInfo.name}}</label>
        </div>
        <div class="form-group">
          <label class="input-label">{{translate.dormitory}}: </label>
          <label class="class-name-text">{{studentInfo.dormitory}}</label>
        </div>
        <div class="form-group">
          <label class="input-label">{{translate.userCheckInStatus}}: </label>
          <label class="class-name-text">{{studentInfo.userCheckInStatus}}</label>
        </div>
        <div class="row">
          <div class="col-md-4">
            <label class="input-label">{{translate.relCheckInTime}}: </label>
            <label class="class-name-text">{{studentInfo.relCheckInTime}}</label>
          </div>
          <div class="col-md-8">
            <label class="input-label">{{translate.expectRetirementTime}}: </label>
            <label class="class-name-text">{{studentInfo.expectRetirementTime}}</label>
          </div>
        </div>
        <div class="form-group col-md-4" v-for="(item, index) in singleChangingDormitory.layoutOne" :key="index">
          <label class="input-label">{{item.title}}</label>
          <v-select class="btn-block form-select-style" :value="singleChangingDormitory.defaultValue[item.id]"  :options="singleChangingDormitory.options[item.id]" options-value="value" options-label="label" @afterSelected="_optionsSelected($event, item)" search close-on-select></v-select>
        </div>
        <div class="form-group col-md-4" v-for="(item, index) in singleChangingDormitory.layoutTwo" :key="index">
          <label class="input-label">{{item.title}}</label>
          <v-select class="btn-block form-select-style" :value="singleChangingDormitory.defaultValue[item.id]"  :options="singleChangingDormitory.options[item.id]" options-value="value" options-label="label" @afterSelected="_optionsSelected($event, item)" search close-on-select></v-select>
        </div>
        <div class="col-md-4">
          <button type="button" class="checkFloorPlanBtn btn-bgColor-style clearBtnBorder" @click="_showCheckFloorPlan">{{translate.checkFloorPlan}}</button>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder"  @click="showSingleChangingDormitoryModal = false">{{translate.cancel}}</button>
        <button type="button" class="btn submit-btn clearBtnBorder"  @click="_singleChangingDormitory">{{translate.changingDormitory}}</button>
      </div>
    </v-modal>
    <v-modal :show="showDoubleChangingDormitoryModal" effect="fade" width="800">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          {{translate.doubleChangingDormitory}}
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="form-group">
          <label class="input-label">{{translate.currentStudentName}}: </label>
          <label class="class-name-text">{{studentInfo.name}}</label>
        </div>
        <div class="form-group">
          <label class="input-label">{{translate.dormitory}}: </label>
          <label class="class-name-text">{{studentInfo.dormitory}}</label>
        </div>
        <div class="form-group">
          <label class="input-label">{{translate.userCheckInStatus}}: </label>
          <label class="class-name-text">{{studentInfo.userCheckInStatus}}</label>
        </div>
        <div class="row">
          <div class="col-md-4">
            <label class="input-label">{{translate.relCheckInTime}}: </label>
            <label class="class-name-text">{{studentInfo.relCheckInTime}}</label>
          </div>
          <div class="col-md-8">
            <label class="input-label">{{translate.expectRetirementTime}}: </label>
            <label class="class-name-text">{{studentInfo.expectRetirementTime}}</label>
          </div>
        </div>
        <div class="modal-search-user">
          <detect url="/api/apartment/users/searchResults" placeholder="请输入互调学生学号或姓名" v-model="changingStudentInfo.studentId" @afterSelected="studentIdSelected" v-if="isShowSearch"></detect>
          <div v-else>
            <div class="user-info pull-left">{{this.changingStudentInfo.name}}</div>  
            <i class="maticon pull-left" v-html="icons('edit')" @click="changeUserSearch">edit</i>
          </div>
        </div>
        <br/>
        <br/>
        <div class="form-group">
          <label class="input-label">{{translate.dormitory}}: </label>
          <label class="class-name-text">{{changingStudentInfo.dormitory}}</label>
        </div>
        <div class="form-group">
          <label class="input-label">{{translate.userCheckInStatus}}: </label>
          <label class="class-name-text">{{changingStudentInfo.userCheckInStatus}}</label>
        </div>
        <div class="row">
          <div class="col-md-4">
            <label class="input-label">{{translate.relCheckInTime}}: </label>
            <label class="class-name-text">{{changingStudentInfo.relCheckInTime}}</label>
          </div>
          <div class="col-md-8">
            <label class="input-label">{{translate.expectRetirementTime}}: </label>
            <label class="class-name-text">{{changingStudentInfo.expectRetirementTime}}</label>
          </div>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="_cancelEditDoubleChangingDormitory">{{translate.cancel}}</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="_doubleChangingDormitory">{{translate.changingDormitory}}</button>
      </div>
    </v-modal>
  </div>
</template>

<script>
  import { sAjax, translation, createTime} from '../../assets/utils/utils.js'
  export default {
    created: function () {
      var la = localStorage.getItem('lang')
      var that = this
      if (translation(la)) {
        this.lang = la
      }
      sAjax({
        url: '/api/apartment/dicts?typeName=校区',
        type: 'get',
        success: (data) => {
          if (data.state) {
            data.data.forEach((ele) => {
              this.singleChangingDormitory.options.campus.push({
                label: ele.label,
                value: ele.value
              })
            })
            this._initColumns()
          } else {
            this.toast(data.message)
          }
        }
      })
    },
    data: function () {
      return {
        columns: [],
        url: '/table-data/apartment/changes/uses/page',
        dormitory: {
          campusName:'',
          zoneName:'',
          floor:''
        },
        studentInfo: {
          userId: '',
          name: '',
          studentId: '',
          dormitory: '',
          userCheckInStatus: '',
          relCheckInTime: '',
          expectRetirementTime: ''
        },
        changingStudentInfo: {
          userId: '',
          studentId: '',
          name: '',
          dormitory: '',
          userCheckInStatus: '',
          relCheckInTime: '',
          expectRetirementTime: ''
        },
        changingDormitory: {},
        options: {
          educationLevel: [],
          grade: [{ name: '2018', value: '2018' }, { name: '2017', value: '2017' }, { name: '2016', value: '2016' }, { name: '2015', value: '2015' }, { name: '2014', value: '2014' }, { name: '2013', value: '2013' }, { name: '2012', value: '2012' }, { name: '2011', value: '2011' }, { name: '2010', value: '2010' }, { name: '2009', value: '2009' }, { name: '2008', value: '2008' }],
        },
        singleChangingDormitory: {
          layoutOne: [{
            title: '校区:',
            id: 'campus'
          }, {
            title: '园区:',
            id: 'zone'
          }, {
            title: '宿舍楼:',
            id: 'building'
          }],
          layoutTwo: [{
            title: '房号:',
            id: 'dormitory'
          }, {
            title: '床位:',
            id: 'bed'
          }],
          options: {
            campus: [],
            zone: [],
            building: [],
            dormitory: [],
            bed: []
          },
          defaultValue: {
            campus: '',
            zone: '',
            building: '',
            dormitory: '',
            bed: ''
          }
        },
        showSingleChangingDormitoryModal: false,
        showDoubleChangingDormitoryModal: false,
        isShowSearch: true,
        timeStamp: null,
        buildingData: [],
        lang: 'zh-cn'
      }
    },
    computed: {
      translate: function () {
        return translation(this.lang).changingDormitory
      }
    },
    methods: {
      _initColumns: function () {
        this.columns = [
          {
            id: 'name',
            title: this.translate.name,
            className: 'text-left', 
            hidden: false,
            search: {
              type: 'input',
              data: {
                autoFocus: true,
                placeholder: this.translate.namePlaceholder
              }
            }
          },
          
          {
            id: 'userNo',
            title: this.translate.studentId,
            className: 'text-left',
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
            id: 'account',
            title: this.translate.account,
            className: 'text-left',
            hidden: false,
            width: 150,
            search: {
              type: 'input',
              data: {
                autoFocus: true,
                placeholder: this.translate.accountIdPlaceholder
              }
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
                url: '/api/apartment/unit/list',
                optionsLabel: 'name',
                optionsValue: 'code'
              }
            }
          },

          {
            id: 'educationLevel',
            title: this.translate.educationLevel,
            className: 'text-left',
            hidden: false,
            width: 120,
            search: {
              type: 'multiSelect',
              data: {
                url: '/api/apartment/dicts?typeName=培养层次' ,
                optionsLabel: 'label',
                optionsValue: 'value'
              }
            }
          },

          {
            id: 'grade',
            title: this.translate.grade,
            className: 'text-left',
            hidden: false,
            width: 80,
            search: {
              type: 'multiSelect',
              data: {
                options: this.options.grade,
                optionsLabel: 'name',
                optionsValue: 'value'
              }
            }
          },

          {
            id: 'apartment',
            title: this.translate.dormitory,
            className: 'text-left',
            hidden: false,
          },

          {
            id: 'opt',
            title: this.translate.opt,
            className: 'text-left',
            hidden: false,
            formatter: (record) =>  {
              return [{
                tag: 'a',
                text: this.translate.singleChangingDormitory,
                className: 'opt-btn',
                callback:(record, index) => {
                  this.showSingleChangingDormitoryModal = true
                  this.singleChangingDormitory.options.zone.splice(0, this.singleChangingDormitory.options.zone.length) 
                  this.singleChangingDormitory.options.building.splice(0, this.singleChangingDormitory.options.building.length) 
                  this.singleChangingDormitory.options.dormitory.splice(0, this.singleChangingDormitory.options.dormitory.length) 
                  this.singleChangingDormitory.options.bed.splice(0, this.singleChangingDormitory.options.bed.length)
                  this.studentInfo.name = ''
                  this.studentInfo.userId = ''
                  this.studentInfo.expectRetirementTime = ''
                  this.studentInfo.relCheckInTime = ''
                  this.studentInfo.dormitory = ''
                  this.singleChangingDormitory.defaultValue.campus = ''
                  this.singleChangingDormitory.defaultValue.zone = ''
                  this.singleChangingDormitory.defaultValue.building = ''
                  this.singleChangingDormitory.defaultValue.dormitory = ''
                  this.singleChangingDormitory.defaultValue.bed = '' 
                  sAjax({
                    url: '/api/apartment/users/apartmentInfos/' + record.userNo,
                    dataType: 'json',
                    type: 'get',
                    success: (data) => {
                      if (data.state) {
                        var result = data.data
                        this.studentInfo.name = result.name
                        this.studentInfo.userId = result.userId
                        this.studentInfo.expectRetirementTime = result.expectRetirementTime
                        this.studentInfo.relCheckInTime = result.relCheckInTime
                        this.studentInfo.dormitory = result.apartment
                        var checkInStatus = {
                          WAIT_CHECK_IN: '未入住',
                          CHECK_IN: '入住',
                          RETIREMENT: '退宿',
                          ACCOMMODATION: '调宿'
                        }
                        this.studentInfo.userCheckInStatus = checkInStatus[result.userCheckInStatus]
                      } else {
                        this.toast(data.message)
                      }
                    }
                  })
                }
              },{
                tag: 'a',
                text: this.translate.doubleChangingDormitory,
                className: 'opt-btn',
                callback:(record, index) => {
                  this.showDoubleChangingDormitoryModal = true
                  this.isShowSearch = true
                  this.studentInfo.name = ''
                  this.studentInfo.userId = ''
                  this.studentInfo.expectRetirementTime = ''
                  this.studentInfo.relCheckInTime = ''
                  this.studentInfo.dormitory = ''
                  this.changingStudentInfo.userId = ''
                  this.changingStudentInfo.name = ''
                  this.changingStudentInfo.studentId = ''
                  this.changingStudentInfo.dormitory = ''
                  this.changingStudentInfo.userCheckInStatus = ''
                  this.changingStudentInfo.relCheckInTime = ''
                  this.changingStudentInfo.expectRetirementTime = ''
                  sAjax({
                    url: '/api/apartment/users/apartmentInfos/' + record.userNo,
                    dataType: 'json',
                    type: 'get',
                    success: (data) => {
                      if (data.state) {
                        var result = data.data
                        this.studentInfo.name = result.name
                        this.studentInfo.userId = result.userId
                        this.studentInfo.expectRetirementTime = result.expectRetirementTime
                        this.studentInfo.relCheckInTime = result.relCheckInTime
                        this.studentInfo.dormitory = result.apartment
                        var checkInStatus = {
                          WAIT_CHECK_IN: '未入住',
                          CHECK_IN: '入住',
                          RETIREMENT: '退宿',
                          ACCOMMODATION: '调宿'
                        }
                        this.studentInfo.userCheckInStatus = checkInStatus[result.userCheckInStatus]
                      } else {
                        this.toast(data.message)
                      }
                    }
                  })
                }
              }]
            }
          }
        ]
      },
      _doubleChangingDormitory: function(){
        if (confirm(this.translate.changingDormitoryConfirmTip)){
          sAjax({
            url: '/api/apartment/changes/double/' + this.studentInfo.userId + '/' + this.changingStudentInfo.userId,
            dataType: 'json',
            type: 'post',
            success: (data) => {
              if (data.state) {
                this.timeStamp = createTime()
                this.showDoubleChangingDormitoryModal = false
                this.$toast('调宿成功！')
              } else {
                this.$toast('调宿失败！请输入互调学生学号或姓名！')
              }
            }
          })
        }
      },
      _cancelEditDoubleChangingDormitory: function(){
        this.showDoubleChangingDormitoryModal = false
      },
      _showCheckFloorPlan: function(){
        if (!this._floorPlanVerify()) {
          return
        } 
        this.$emit('addBread', {
          route: '/apartment/floorPlan',
          title: this.dormitory.campusName + this.dormitory.zoneName+this.dormitory.name + '-平面图',
          reflash:true,
          data: {
            buildingId: this.singleChangingDormitory.defaultValue.building,
            floor: 10
            // floor: this.dormitory.floor
            //测试数据floor均为0
          }
        })
      },
      studentIdSelected: function (data) {
        this.changingStudentInfo.studentId = data.userId
        this.changingStudentInfo.name = data.name + ' (' + data.userNo + ')'
        sAjax({
          url: '/api/apartment/users/apartmentInfos/' + data.userNo,
          dataType: 'json',
          type: 'get',
          success: (data) => {
            if (data.state) {
              var result = data.data
              this.changingStudentInfo.userId = result.userId
              this.changingStudentInfo.expectRetirementTime = result.expectRetirementTime
              this.changingStudentInfo.relCheckInTime = result.relCheckInTime
              this.changingStudentInfo.dormitory = result.apartment
              var checkInStatus = {
                WAIT_CHECK_IN: '未入住',
                CHECK_IN: '已入住',
                RETIREMENT: '退宿',
                ACCOMMODATION: '调宿'
              }
              this.changingStudentInfo.userCheckInStatus = checkInStatus[result.userCheckInStatus]
            } else {
              this.$toast('未能查询到该生住宿信息！')
            }
          }
        })
        this.isShowSearch = false
      },
      changeUserSearch: function () {
        this.isShowSearch = true
        this.changingStudentInfo.userId = ''
        this.changingStudentInfo.name = ''
        this.changingStudentInfo.studentId = ''
        this.changingStudentInfo.dormitory = ''
        this.changingStudentInfo.userCheckInStatus = ''
        this.changingStudentInfo.relCheckInTime = ''
        this.changingStudentInfo.expectRetirementTime = ''
      },
      _optionsSelected: function (obj, item) {
        this.singleChangingDormitory.defaultValue[item.id] = obj.value
        if(obj.value === ''){}
        else{
          if (item.id === 'campus') {
            this.$nextTick(() => {
              this.dormitory.campusName = obj.target.selected
              this._getZonesData(this.singleChangingDormitory.defaultValue[item.id])
            })
          } else if (item.id === 'zone') {
            this.dormitory.name = ''
            this.singleChangingDormitory.defaultValue['building'] = ''
            this.$nextTick(() => {
            this.dormitory.zoneName = obj.target.selected
            this._getBuildingData(this.singleChangingDormitory.defaultValue[item.id])
            })
          } else if (item.id === 'building') {
            this.buildingData.forEach((ele) =>{
              if(obj.value === ele.buildingId.toString()) {
                this.dormitory.floor = ele.floor
                this.dormitory.name = ele.name
              }
            })
            this._getDormitoryData(this.singleChangingDormitory.defaultValue[item.id])
          } else if (item.id === 'dormitory') {
            this._getBedData(this.singleChangingDormitory.defaultValue[item.id])
          }
        }
      },
      _singleChangingDormitory: function () {
        if (!this._dormitoryVerify()) {
          return
        } 
        if (confirm(this.translate.changingDormitoryConfirmTip)){
          sAjax({
            url: '/api/apartment/changes/single/' + this.studentInfo.userId,
            dataType: 'json',
            type: 'post',
            data : {
              campus: this.singleChangingDormitory.defaultValue.campus,
              zoneId: this.singleChangingDormitory.defaultValue.zone,
              buildingId: this.singleChangingDormitory.defaultValue.building,
              roomId: this.singleChangingDormitory.defaultValue.dormitory,
              bedId: this.singleChangingDormitory.defaultValue.bed
            },
            success: (data) => {
              if (data.state) {
                this.timeStamp = createTime()
                this.showSingleChangingDormitoryModal = false
                this.$toast('调宿成功！')
              } else {
                this.toast(data.message)
              }
            }
          })
        }
      },
      _dormitoryVerify: function () {
        var success = true
        this.singleChangingDormitory.layoutOne.forEach((item)=>{
          if(success && (!this.singleChangingDormitory.defaultValue[item.id])) {
            this.$toast(`${item.title}不能为空`)
            success = false
          }
        })
        this.singleChangingDormitory.layoutTwo.forEach((item)=>{
          if(success && (!this.singleChangingDormitory.defaultValue[item.id])) {
            this.$toast(`${item.title}不能为空`)
            success = false
          }
        })
        return success
      },
      _floorPlanVerify: function () {
        var success = true
        this.singleChangingDormitory.layoutOne.forEach((item)=>{
          if(success && (!this.singleChangingDormitory.defaultValue[item.id])) {
            this.$toast(`${item.title}不能为空`)
            success = false
          }
        })
        return success
      },
      _getZonesData: function (campusId) {
        sAjax({
          url: '/api/apartment/zones/getByCampuses/' + campusId,
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.singleChangingDormitory.options.zone.splice(0, this.singleChangingDormitory.options.zone.length)
              if (data.data) {
                data.data.forEach((ele) => {
                  this.singleChangingDormitory.options.zone.push({
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
      _getBuildingData: function (zoneId) {
        sAjax({
          url: '/api/apartment/buildings/list/' + zoneId,
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.buildingData = data.data
              this.singleChangingDormitory.options.building.splice(0, this.singleChangingDormitory.options.building.length)
              if (data.data) {
                data.data.forEach((ele) => {
                  this.singleChangingDormitory.options.building.push({
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
      _getDormitoryData: function (buildingId) {
        sAjax({
          url: '/api/apartment/rooms/list/' + buildingId,
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.singleChangingDormitory.options.dormitory.splice(0, this.singleChangingDormitory.options.dormitory.length)
              if (data.data) {
                data.data.forEach((ele) => {
                  this.singleChangingDormitory.options.dormitory.push({
                    label: ele.roomNo,
                    value: ele.roomId
                  })
                })
              }
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _getBedData: function (roomId) {
        sAjax({
          url: '/api/apartment/beds/getBedsByRooms/' + roomId,
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.singleChangingDormitory.options.bed.splice(0, this.singleChangingDormitory.options.bed.length)
              if (data.data) {
                data.data.forEach((ele) => {
                  this.singleChangingDormitory.options.bed.push({
                    label: ele.bedNo.toString(),
                    value: ele.bedId
                  })
                })
              }
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
    }
  }
</script>

<style lang="less">
@import url("../../assets/common.less");
#changingDormitory-page {
  .checkFloorPlanBtn {
    background-color: #0000FF;
    border: none;
    color: white;
    padding: 5px 60px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin-left: 50px;
    cursor: pointer;
  }
}
</style>
