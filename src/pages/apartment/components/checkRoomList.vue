<template>

    <div id="checkRoomList">
        <div class="tableData" v-show='!importPage'>
            <v-table
            :url='tableUrl'
            pagesize="10"
            idField="id"
            :columns="studentColumns"
            :multiple="true"
            :order="true"
            :search="false"
            >
            <div slot="btn-group" class="btn-group pull-right" role="group">
              <button type="button" class="btn add clearBtnBorder" @click="showAddHouse = true">新增房源</button>
              <button type="button" class="btn add clearBtnBorder" @click="showReturn = true">收回房源</button>
            </div>
            </v-table>
        </div>

          <!-- 收回房源 -->
        <v-modal :show="showReturn" effect="fade" width="446">
          <div slot="modal-header" class="modal-header">
            <h5 class="modal-title">收回房源</h5>
          </div>
          <div slot="modal-body" class="modal-body">
            <div class="form-group student-search" style="height: 100px;line-height: 100px;text-align: center">
              <div class="buttonGroup">
                <button style="margin-right: 100px;" type="button" class="btn submit-btn clearBtnBorder" @click="returnAll">全部回收</button>
                <button type="button" class="btn submit-btn clearBtnBorder" @click="returnUnabsorbed ">收回未分配</button>
              </div>
            </div>
          </div>
          <div slot="modal-footer" class="modal-footer">
            <button
              type="button"
              class="btn cancel-btn clearBtnBorder"
              @click="showReturn = false"
            >取消</button>
            <!-- <button type="button" class="btn submit-btn clearBtnBorder">确定</button> -->
          </div>
      </v-modal>

       <!-- 新增房源 -->
        <v-modal :show="showAddHouse" effect="fade" width="446">
          <div slot="modal-header" class="modal-header">
            <h5 class="modal-title">新增房源</h5>
          </div>
          <div slot="modal-body" class="modal-body">
            <div class="form-group student-search" style="height: 100px;line-height: 100px;text-align: center">
              <div class="buttonGroup">
                <button style="margin-right: 100px;" type="button" class="btn submit-btn clearBtnBorder" @click="addSingle">单个新增</button>
                <button type="button" class="btn submit-btn clearBtnBorder" @click="addAll ">批量新增</button>
              </div>
            </div>
          </div>
          <div slot="modal-footer" class="modal-footer">
            <button
              type="button"
              class="btn cancel-btn clearBtnBorder"
              @click="showAddHouse = false"
            >取消</button>
            <!-- <button type="button" class="btn submit-btn clearBtnBorder">确定</button> -->
          </div>
      </v-modal>
      <!-- 新增房源-单个新增 -->
      <v-modal :show="allocation.showAllocationMoal" effect="fade" width="340">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          分配
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="form-group" v-for="(item, index) in allocation.layout" :key="index">
          <label class="input-label allocation-modal-label">{{item.title}}</label>
          <v-select class="btn-block form-select-style" :value="allocation.defaultValue[item.id]"  :options="allocation.options[item.id]" options-value="value" options-label="label" @afterSelected="_allocationSelected($event, item)" search close-on-select></v-select>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder"  @click="allocation.showAllocationMoal = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder"  @click="_submitAllocation">确定</button>
      </div>
    </v-modal>

    <!-- 批量新增房源 -->
    <v-import v-bind="importParams" @backParentPage="back" v-show="importPage"></v-import>
    </div>
</template>
<script>
import { sAjax } from '../../../assets/utils/utils';
export default {
  
    props: ['batchId'],
    data() {
        return {
            tableUrl:'',
            studentColumns: [],
            showReturn: false,
            showAddHouse: false,
            allocation: {
          showAllocationMoal: false,
          layout: [{
            title: '校区',
            id: 'campus'
          }, {
            title: '园区',
            id: 'zone'
          }, {
            title: '楼栋',
            id: 'building'
          }, {
            title: '宿舍',
            id: 'dormitory'
          }, {
            title: '床位',
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
        searchSelectOptions: {
          campusIds: [],
          zoneIds: []
        },
        defineSearch: {
          campusIds: [],
          zoneIds: [],
          buildingNames: [],
          genders: []
        },
        importPage: false,
        importParams: {
          parentPageTitle: '房源列表',
          downloadTemplateUrl: '/apartment/checkInManage/collegeAllocation/batchHousingAllot/template/' + this.batchId,
          downloadErrorTemplateUrl: '/apartment/checkInManage/collegeAllocation/batchHousingAllot/error/info',
          checkTemplateUrl: '/apartment/checkInManage/collegeAllocation/batchHousingAllot/excel/' + this.batchId,
          templateName: '批量新增模板',
          importBtnType: [{
              name: '覆盖导入',
              url: '/apartment/checkInManage/collegeAllocation/batchHousingAllot/batch/create',
              method: 'post',
              isShowBtn: true,
              success: (data) => {
                if (data.state) {
                 this.tableUrl = '/table-data/apartment/beds/bedList?batchId=' + this.batchId+'&timeSamp='+new Date().getTime()
                }
              }
            }],
          // importBtnType: [{isShowBtn: true,name: '覆盖导入'}]
        }
        }
    },
    methods: {
      back() {
        this.importPage = false
        this.$emit('showBack',true)
      },
      returnAll() {
        let url = '/api/apartment/checkInManage/collegeAllocation/removeAllHousingList?id='+this.batchId
        sAjax({
          url: url,
          type: 'post',
          success: (data) => {
            if(data.state) {
              this.$toast('全部回收成功')
              this.tableUrl = this.tableUrl = '/table-data/apartment/beds/bedList?batchId=' + this.batchId+'&timeSamp='+new Date().getTime()
              this.showReturn = false
              setTimeout(() => {
                 window.location.href = `/downloads/apartment/checkInManage/collegeAllocation/removeExcel?id=${this.batchId}&dataKey=${data.data}`
              })
            }else {
              this.$toast(data.message)
            }
          }
        })
      },
      returnUnabsorbed() {
        let url = `/api/apartment/checkInManage/collegeAllocation/removeHousingList?id=${this.batchId}`
        sAjax({
          url: url,
          type: 'post',
          success: (data) => {
            if(data.state) {
              this.$toast('收回成功')
              this.tableUrl = this.tableUrl = '/table-data/apartment/beds/bedList?batchId=' + this.batchId+'&timeSamp='+new Date().getTime()
              this.showReturn = false
              setTimeout(() => {
                 window.location.href = `/downloads/apartment/checkInManage/collegeAllocation/removeExcel?id=${this.batchId}&dataKey=${data.data}`
              })
             
            }else {
              this.$toast(data.message)
            }
          }
        })
       
        
      },
      addAll() {
        this.showAddHouse = false
        this.importPage = true
        this.$emit('hideBackIcon',false)
      },
      addSingle() {
        this.showAddHouse = false
        this.allocation.showAllocationMoal = true
        // this.urlParameter.userNo = record.studentId
        // this.isAllocated = record.isAllot

        this.allocation.defaultValue = {
          campus: '',
          zone: '',
          building: '',
          dormitory: '',
          bed: ''
        }
      },
      _allocationVerify: function () {
        var success = true
        this.allocation.layout.forEach((item)=>{
          if(success && (!this.allocation.defaultValue[item.id])) {
            this.$toast(`${item.title}不能为空`)
            success = false
          }
        })
        return success
      },
      _submitAllocation: function () {
        if (!this._allocationVerify()) {
          return
        }
        console.log(this.allocation)
        let url = '/api/apartment/rooms/addForCollege?batchId='+this.batchId+'&bedId='+this.allocation.defaultValue.bed
        sAjax({
          url: url,
          type: 'post',
          success: (data) => {
            if(data.state) {
              this.$toast('添加成功')
              this.tableUrl = '/table-data/apartment/beds/bedList?batchId=' + this.batchId+'&timeSamp='+new Date().getTime()
              this.allocation.showAllocationMoal = false
            }else {
              this.$toast(data.message)
            }
          }
        })
        
      },
      _allocationSelected: function (obj, item) {
        this.allocation.defaultValue[item.id] = obj.value
        if (this.allocation.defaultValue[item.id]) {
          if (item.id === 'campus') {
            this._getZonesData(this.allocation.defaultValue[item.id])
          } else if (item.id === 'zone') {
            this._getBuildingData(this.allocation.defaultValue[item.id])
          } else if (item.id === 'building') {
            this._getDormitoryData(this.allocation.defaultValue[item.id])
          } else if (item.id === 'dormitory') {
            this._getBedData(this.allocation.defaultValue[item.id])
          } 
        }
      },
      _getZonesData: function (campusId) {
        sAjax({
          url: '/api/apartment/zones/getByCampuses/' + campusId,
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.allocation.options.zone.splice(0, this.allocation.options.zone.length)
              if (data.data) {
                data.data.forEach((ele) => {
                  this.allocation.options.zone.push({
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
              this.allocation.options.building.splice(0, this.allocation.options.building.length)
              if (data.data) {
                data.data.forEach((ele) => {
                  this.allocation.options.building.push({
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
          url: '/api/apartment/rooms/canDistributionRoomList?buildingId=' + buildingId,
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.allocation.options.dormitory.splice(0, this.allocation.options.dormitory.length)
              if (data.data) {
                data.data.forEach((ele) => {
                  this.allocation.options.dormitory.push({
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
              this.allocation.options.bed.splice(0, this.allocation.options.bed.length)
              if (data.data) {
                data.data.forEach((ele) => {
                  this.allocation.options.bed.push({
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
      getZonesData: function (campusIds) {
        sAjax({
          url: '/api/apartment/zones/getByCampuses?campusIds=' + campusIds,
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.parkData = data.data || []
              this.searchSelectOptions.zoneIds.splice(0, this.searchSelectOptions.zoneIds.length)
              if (data.data) {
                data.data.forEach((ele) => {
                  this.searchSelectOptions.zoneIds.push({
                    label: ele.name,
                    value: ele.zoneId
                  })
                })
              }
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
    },
    created() {
      this.getZonesData([])
      sAjax({
        url: '/api/apartment/dicts?typeName=校区',
        type: 'get',
        success: (data) => {
          if (data.state) {
            data.data.forEach((ele) => {
              this.allocation.options.campus.push({
                label: ele.label,
                value: ele.value
              })
            })
          } else {
            this.toast(data.message)
          }
        }
      })
        this.tableUrl = '/table-data/apartment/beds/bedList?batchId=' + this.batchId
        this.studentColumns = [{
        id: 'campusName',
        title: '校区',
        className: 'text-left',
        hidden: false,
        width: 100,
        search: {
          type: 'multiSelect',
          data: {
            url: '/api/apartment/dicts?typeName=校区',
            optionsLabel: 'label',
            optionsValue: 'value',
            change: (obj) => {
              let list = []
              if (obj.value.length > 0) {
                list = obj.value.split(',')
                this.tableUrl = '/table-data/apartment/beds/bedList?batchId=' + this.batchId+'&campusIds=' + list
              } else {
                list = []
                this.tableUrl = '/table-data/apartment/beds/bedList?batchId=' + this.batchId
              }
              this.getZonesData(list)
              
            }
          }
        }
      }, {
        id: 'zoneName',
        title: '园区',
        className: 'text-left',
        width: 120,
        hidden: false,
        search: {
          type: 'multiSelect',
          data: {
            options: this.searchSelectOptions.zoneIds,
            optionsLabel: 'label',
            optionsValue: 'value',
            change: (obj) => {
              if (obj.value.length > 0) {
                this.defineSearch.zoneIds = obj.value.split(',')
                this.tableUrl = '/table-data/apartment/beds/bedList?batchId=' + this.batchId+ '&zoneIds='+this.defineSearch.zoneIds
              } else {
                this.defineSearch.zoneIds = []
                this.tableUrl = '/table-data/apartment/beds/bedList?batchId=' + this.batchId
              }
            }
          }
        },
      }, {
        id: 'buildingValue',
        title: '楼栋',
        className: 'text-left',
        hidden: false,
        width: 120,
        search: {
          type: 'input',
          data: {
            placeholer: '',
            autoFocus: false
          }
        },
        formatter: (record) => {
          return record.buildingName
        }
      }, {
        id: 'roomName',
        title: '房间号',
        className: 'text-left',
        hidden: false,
        width: 100,
      }, {
        id: 'canDistribution',
        title: '是否分配',
        className: 'text-left',
        hidden: false,
        width: 100,
        formatter: (record) => {
          return record.canDistribution==1?'未分配':'已分配'
        }
      }, {
        id: 'bedNo',
        title: '床位号',
        className: 'text-left',
        width: 100,
        hidden: false
      },{
         id: 'opt',
        title: '操作',
        className: 'text-left',
        hidden: false,
        width: 100,
        formatter: (recordItem) => {
          return [{
            tag: 'a',
            text: '删除',
            className: 'opt-btn',
            callback: (record, index) => {
              if(record.canDistribution==1) { //未分配、可删除
                  if(confirm('确定删除吗？')) {
                    let url = '/api/apartment/checkInManage/collegeAllocation/removeHousing?id='+record.collegeAllocationHousingId
                    sAjax({
                      url: url,
                      type: 'post',
                      success: (data) => {
                        if(data.state) {
                          this.$toast('删除成功')
                          this.tableUrl = '/table-data/apartment/beds/bedList?batchId=' + this.batchId+'timesamp='+new Date().getTime()
                        }else {
                           this.$toast(data.message)
                        }
                      }
                    })
                  }
              }else {
                this.$toast('房源已分配，无法删除')
              }
            }
          }]}
      }]
    },
}
</script>
<style lang="less" scoped>

</style>
