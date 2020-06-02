<template>
  <div id="accommodation-resources" class="container-fluid">
    <div class="row text-center" v-show="!importPage">
      <v-table
        :title="translate.tableName"
        :url="`${url}?timeStamp=${timeStamp}`"
        pagesize="10"
        idField="id"
        :columns="columns"
        :multiple="false"
        :order="true"
        :search="false"
        :searchParams="defineSearch">
        <div slot="btn-group" class="btn-group pull-right" role="group">
          <button type="button" class="btn add clearBtnBorder"  @click="showAddTypeModal = true">{{translate.add}}</button>
        </div>
      </v-table>
    </div>
    <v-import v-bind="importParams" @backParentPage="importPage = false" v-show="importPage"></v-import>
    <v-modal :show="showAddTypeModal" effect="fade" width="400">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">选择新增类型</h5>
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
    <v-modal :show="showAddModal" effect="fade" width="486">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">{{modalType}}</h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="form-group">
          <label class="input-label modal-label">{{translate.campus}}</label>
          <v-select
            class="btn-block form-select-style"
            :value="accommodationResources.campus"
            :options="campusData"
            options-value="value"
            options-label="label"
            @afterSelected="campusSelected"
            search
            close-on-select>
          </v-select>
        </div>
        <div class="form-group">
          <label class="input-label modal-label">{{translate.park}}</label>
          <v-select
            class="btn-block form-select-style"
            :value="accommodationResources.park"
            :options="parkData"
            options-value="zoneId"
            options-label="name"
            @afterSelected="parkSelected"
            search
            close-on-select
            v-if="!isShowCustomize">
          </v-select>
          <input type="text" class="form-control search-input form-input-style" v-model="customizeParkName" v-else>
          <button type="button" class="btn check-btn clearBtnBorder" @click="changePark">{{customizeText}}</button>
        </div>
        <div class="form-group">
          <label class="input-label modal-label">{{translate.building}}</label>
          <input type="text" class="form-control search-input form-input-style" v-model="accommodationResources.building">
        </div>
        <div class="form-group">
          <label class="input-label modal-label">{{translate.buildingProperty}}</label>
          <v-select
            class="btn-block form-select-style"
            :value="accommodationResources.buildingProperty"
            :options="buildingPropertyData"
            options-value="id"
            options-label="text"
            @afterSelected="buildingPropertySelected"
            search
            close-on-select>
          </v-select>
        </div>
         <div class="form-group">
          <label class="input-label modal-label">楼栋编号</label>
          <input type="text" class="form-control search-input form-input-style" v-model="accommodationResources.code">
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder"  @click="showAddModal = false">{{translate.cancel}}</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="submit">{{translate.confirm}}</button>
      </div>
    </v-modal>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { translation, sAjax, createTime } from '../../assets/utils/utils.js'

  export default {
    data: function () {
      return {
        url: '/table-data/apartment/buildings/getTableWithConditions',
        timeStamp: '',
        columns: [],
        importPage: false,
        importParams: {
          parentPageTitle: '住宿资源管理列表',
          downloadTemplateUrl: '/apartment/buildings/batch/template',
          downloadErrorTemplateUrl: '/apartment/buildings/batch/error',
          checkTemplateUrl: '/apartment/buildings/batch/excel',
          templateName: '批量新增模板',
          importBtnType: null
        },
        accommodationResources: {
          campus: '',
          park: '',
          building: '',
          buildingProperty: '',
          code: ''
        },
        modalType: '',
        showAddModal: false,
        showAddTypeModal: false,
        buildingPropertyData: [{ id: '1', text: '男生楼栋' }, { id: '2', text: '女生楼栋' }, { id: '3', text: '混合楼栋' }],
        parkData: [],
        campusData: [],
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
        addBuilding: {
          buildingId: '',
          name: '',
          gender: '',
          code: '',
          zone: {
            name: '',
            campusName: ''
          }
        },
        addTypeData: [{ value: 'single', label: '单个新增' }, { value: 'batch', label: '批量新增' }],
        addType: 'single',
        selectOptions: {
          usedFor: [],
          toilet: [],
          haveBalcony: [],
          extraLongBed: [],
          furnitureType: []
        },
        isShowCustomize: false,
        customizeText: '自定义园区',
        customizeParkName: '',
        lang: 'zh-cn'
      }
    },
    computed: {
      translate: function () {
        return translation(this.lang).accommodationResources
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
            this.campusData = data.data || []
          } else {
            this.$toast(data.message)
          }
        }
      })
      this._getZonesData([])
      this._getSelectOptions()
      this.columns = [{
        id: 'campus',
        title: this.translate.campus,
        className: 'text-left',
        width: 100,
        hidden: false,
        search: {
          type: 'multiSelect',
          data: {
            url: '/api/apartment/dicts?typeName=校区',
            optionsLabel: 'label',
            optionsValue: 'value',
            change: (obj) => {
              if (obj.value.length > 0) {
                this.defineSearch.campusIds = obj.value.split(',')
              } else {
                this.defineSearch.campusIds = []
              }
              this._getZonesData(this.defineSearch.campusIds)
            }
          }
        },
        formatter: (record) => {
          return record.zone && record.zone.campusName
        }
      }, {
        id: 'park',
        title: this.translate.park,
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
              } else {
                this.defineSearch.zoneIds = []
              }
            }
          }
        },
        formatter: (record) => {
          return record.zone && record.zone.name
        }
      }, {
        id: 'buildingName',
        title: this.translate.building,
        className: 'text-left',
        width: 100,
        hidden: false,
        search: {
          type: 'input',
          data: {
            placeholer: '',
            autoFocus: true
          }
        },
        formatter: (record) => {
          return record.name
        }
      }, {
        id: 'buildingProperty',
        title: this.translate.buildingProperty,
        className: 'text-left',
        width: 100,
        hidden: false,
        search: {
          type: 'multiSelect',
          data: {
            options: this.buildingPropertyData,
            optionsLabel: 'text',
            optionsValue: 'id',
            change: (obj) => {
              if (obj.value.length > 0) {
                this.defineSearch.genders = obj.value.split(',')
              } else {
                this.defineSearch.genders = []
              }
            }
          }
        },
        formatter: (record) => {
          var gender = ''
          this.buildingPropertyData.forEach((ele) => {
            if (record.gender === parseInt(ele.id)) {
              gender = ele.text
            }
          })
          return gender
        }
      }, {
        id: 'code',
        title: '楼栋编号',
        className: 'text-left',
        width: 100,
        hidden: false
      }, {
        id: 'floor',
        title: this.translate.numberOfLayers,
        className: 'text-left',
        width: 100,
        hidden: false
      }, {
        id: 'roomPerFloor',
        title: this.translate.numberOfRooms,
        className: 'text-left',
        width: 100,
        hidden: false
      }, {
        id: 'opt',
        title: this.translate.opt,
        className: 'text-center',
        hidden: false,
        formatter: (recordItem) => {
          return [{
            tag: 'a',
            text: this.translate.edit,
            className: 'opt-btn',
            callback: (record, index) => {
              this.showAddModal = true
              this.modalType = this.translate.edit

              this.accommodationResources = {
                campus: record.zone.campusId,
                park: record.zone.zoneId,
                building: record.name,
                buildingProperty: record.gender.toString(),
                code: record.code
              }
              var mark = false
              this.parkData.forEach((ele)=>{
                if (record.zone.zoneId.toString() === ele.zoneId) {
                  mark = true
                }
              })
              this.isShowCustomize = mark ? false : true
              if (this.isShowCustomize) {
                this.customizeText = '选择园区'
                this.customizeParkName = record.zone.name
              }
              this.addBuilding = {
                buildingId: record.buildingId,
                name: record.name,
                gender: record.gender.toString(),
                code: record.code,
                zone: {
                  name: record.zone.name,
                  campusName: record.zone.campusName
                }
              }
            }
          }, {
            tag: 'a',
            text: this.translate.delete,
            className: 'opt-btn',
            callback: (record, index) => {
              if (confirm('确定删除吗？')) {
                sAjax({
                  url: '/api/apartment/buildings/deleteBuilding/' + record.buildingId,
                  type: 'post',
                  success: (data) => {
                    if (data.state) {
                      this._refreshTable()
                      this.$toast('删除成功！')
                    } else {
                      this.toast(data.message)
                    }
                  }
                })
              }
            }
          }, {
            tag: 'a',
            text: this.translate.roomsList,
            className: 'opt-btn',
            callback: (record, index) => {
              this.$emit('addBread', {
                route: '/apartment/roomList?buildingId=' + record.buildingId,
                title: record.zone.campusName + record.zone.name + '-房间列表',
                data: {
                  selectOptions: this.selectOptions,
                  buildingId: record.buildingId,
                  floor: record.floor
                }
              })
            }
          }, {
            tag: 'a',
            text: this.translate.floorPlan,
            className: 'opt-btn',
            callback: (record, index) => {
              this.$emit('addBread', {
                route: `/apartment/floorPlan?buildingId=${record.buildingId}`,
                title: record.zone.campusName + record.zone.name +record.name+ '-平面图',
                data: {
                  buildingId: record.buildingId,
                  floor: record.floor
                }
              })
            }
          }]
        }
      }]
    },
    methods: {
      changePark: function () {
        this.isShowCustomize = !this.isShowCustomize
        this.customizeText = !this.isShowCustomize ? '自定义园区' : '选择园区'
        this.accommodationResources.park = ''
        this.customizeParkName = ''
      },
      _selectAddType: function (opt) {
        this.addType = opt.value
      },
      _sumbitTypeModal: function () {
        if (this.addType === 'single') {
          this.showAddModal = true
          this.modalType = this.translate.add
          this.accommodationResources = {
            campus: '',
            park: '',
            building: '',
            buildingProperty: '',
            code: ''
          }
        } else {
          this.importPage = true
          this.importParams.parentPageTitle = this.translate.tableName
          this.importParams.importBtnType = [{
            url: '/apartment/buildings/batch',
            method: 'post',
            isShowBtn: true,
            name: this.translate.overlayImport,
            success: (data) => {
              if (data.state) {
                this._refreshTable()
              }
            }
          }]
        }
        this.showAddTypeModal = false
      },
      submit: function () {
        if (this.modalType === this.translate.add) {
          this._add()
        } else if (this.modalType === this.translate.edit) {
          this._edit()
        }
      },
      _parameterJudgment: function () {
        var flag = false
        if (!this.accommodationResources.campus) {
          this.$toast('请选择校区')
          return flag = true
        }
        if (!this.accommodationResources.park && !this.customizeParkName) {
          this.$toast('请选择园区')
          return flag = true
        }
        if (!this.accommodationResources.building) {
          this.$toast('请输入楼栋名称')
          return flag = true
        }
        if (!this.accommodationResources.buildingProperty) {
          this.$toast('请选择楼栋属性')
          return flag = true
        }
        if (!this.accommodationResources.code) {
          this.$toast('请输入楼栋编号')
          return flag = true
        }
        return flag
      },
      _add: function () {
        if (this._parameterJudgment()) {
          return
        }
        this.addBuilding.name = this.accommodationResources.building
        this.addBuilding.code = this.accommodationResources.code
        if (this.isShowCustomize) {
          this.addBuilding.zone.name = this.customizeParkName 
        }
        sAjax({
          url: '/api/apartment/buildings/addBuilding',
          type: 'post',
          data: this.addBuilding,
          success: (data) => {
            if (data.state) {
              this.showAddModal = false
              this._refreshTable()
              this.$toast('添加成功！')
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _edit: function () {
        if (this._parameterJudgment()) {
          return
        }
        this.addBuilding.name = this.accommodationResources.building
        this.addBuilding.code = this.accommodationResources.code
        sAjax({
          url: '/api/apartment/buildings/updateBuilding',
          type: 'post',
          data: this.addBuilding,
          success: (data) => {
            if (data.state) {
              this.showAddModal = false
              this._refreshTable()
              this.$toast('编辑成功！')
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      buildingPropertySelected: function (obj) {
        this.accommodationResources.buildingProperty = obj.value
        this.addBuilding.gender = obj.value
      },
      campusSelected: function (obj) {
        this.accommodationResources.campus = obj.value
        var campusIds = []
        if (obj.value.length > 0) {
          campusIds = obj.value.split(',')
        }
        this.$nextTick(() => {
          this.addBuilding.zone.campusName = obj.target.selected
        })
        this._getZonesData(campusIds)

      },
      changeCode: function () {
        var pattern = /^\+?[0-9][0-9]*$/
        if (!pattern.test(this.accommodationResources.code)) {
          this.$toast('楼栋编号必须为正整数')
          this.accommodationResources.code = ''
          return
        }
      },
      _getZonesData: function (campusIds) {
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
      parkSelected: function (obj) {
        this.accommodationResources.park = obj.value
        this.parkData.forEach((ele) => {
          if (obj.value === ele.zoneId) {
            this.addBuilding.zone.name = ele.name
          }
        })
      },
      _refreshTable: function () {
        this.timeStamp = createTime()
      },
      _getSelectOptions: function () {
        sAjax({
          url: '/api/apartment/dicts?typeName=房间用途',
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.selectOptions.usedFor = data.data
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
              this.selectOptions.toilet = data.data
            } else {
              this.toast(data.message)
            }
          }
        })
        sAjax({
          url: '/api/apartment/dicts?typeName=家具类型',
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.selectOptions.furnitureType = data.data
            } else {
              this.toast(data.message)
            }
          }
        })
        sAjax({
          url: '/api/apartment/dicts?typeName=是否加长床',
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.selectOptions.extraLongBed = data.data
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
              this.selectOptions.haveBalcony = data.data
            } else {
              this.toast(data.message)
            }
          }
        })
      }
    }
  }
</script>
<style lang="less">
@import url("../../assets/common.less");
#accommodation-resources {
  .add {
    background: #ffffff;
    border: none;
  }
  .modal-label {
    width: 60px;
    text-align: right;
    margin-right: 5px;
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
