<template>
  <div id="room-list" :class="'room-list'+data.data.buildingId">
    <div v-if="curRouter==='list'">
      <div class="head">
        <label class="head-title">{{data.title}}</label>
      </div>
      <div class="content">
        <div id="content-head" :class="'content-head'+data.data.buildingId">
          <div class="form-group" >
            <label class="input-label modal-label">楼层</label>
            <v-select class="btn-block form-select-style" :value="floor.defaultValue"  :options="floor.options" optionsLabel="text" optionsValue="id" @afterSelected="floorSelected" search  :multiple="true"></v-select>
          </div>
          <button type="button" class="btn import-btn clearBtnBorder pull-right" @click="curRouter = 'importPage'">导入房间信息</button>
          <button type="button" class="btn import-btn clearBtnBorder pull-right" @click="downLoad">导出房间信息</button>
        </div>
        <div class="content-table" :style="'height:' + scrollHeight + 'px'">
          <div class="table-head">
            <div class="check-opt" v-if="isEdit">
              <span @click="changeCheckState">
                <i class="maticon " v-html="icons('check_box_outline_blank')" v-if="checkedRecords.length===0">check_box_outline_blank</i>
                <i class="maticon " v-html="icons('check_box')" v-else-if="checkedRecords.length===oldTableData.length">check_box</i>
                <i class="maticon " v-html="icons('indeterminate_check_box')" v-else>indeterminate_check_box</i>
              </span>
            </div>
            <div class="table-th" :style="'width:' + column.width + 'px'" v-for="(column, index) in columns" :key="index">
              {{column.title}}
            </div>
          </div>
          <!-- <GeminiScrollbar :style="'height:' + scrollHeight - 200 + 'px'"> -->
          <div :style="'max-height:' + scrollHeight + 'px'">
            <div v-for="(item, itemIndex) in tableData" :key="itemIndex" >
              <div class="floor">{{sectionToChinese(item.floor)}}楼</div>
              <div class="table-content"  v-for="(row, rowIndex) in item.roomData" :key="rowIndex">
                <div class="check-opt" v-if="isEdit">
                  <span @click="rowSelect(row)">
                    <i class="maticon " v-html="icons('check_box_outline_blank')" v-if="!row.checked">check_box_outline_blank</i>
                    <i class="maticon " v-html="icons('check_box')" v-else>check_box</i>
                  </span>
                </div>
                <div class="table-td" :style="'width:' + column.width + 'px'" v-for="(column, index) in columns" :key="index" v-if="column.edit&&!column.isEdit">
                  {{(column.formatter&&column.formatter(row))||row[column.id]}}
                </div>
                <div class="table-td" :style="'width:' + column.width + 'px'" v-else-if="column.edit&&column.isEdit">
                  <v-select class="btn-block table-select-style"
                    required
                    :url="(column.edit.data&&column.edit.data.url)||''"
                    :options="(column.edit.data&&column.edit.data.options)||[]"
                    :value="newVal[row[idField]]&&newVal[row[idField]][column.id]"
                    :options-value="(column.edit.data&&column.edit.data.optionsValue)||'id'"
                    :options-label="(column.edit.data&&column.edit.data.optionsLabel)||'name'"
                    search close-on-select
                    :updateFirstIn="item.updateFirstIn"
                    @afterSelected="_afterSelect($event, column, row)"
                    v-if="column.edit.type === 'select'">
                  </v-select>
                  <input type="text" class="table-input-style" :class="column.id === 'area'?'short-input':'long-input'" :disabled="column.id=='canDistribution'&&row.canUpdate == '0'" v-model="(column.formatter&&column.formatter(row))||row[column.id]" @change="_save(column, row)" v-else />
                  
                </div>
                <div class="table-td" :style="'width:' + column.width + 'px'" v-else>{{(column.formatter&&column.formatter(row))||row[column.id]}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="footer">
        <div v-if="!isEdit">
          <button type="button" class="btn footer-edit-btn clearBtnBorder" @click="editRoomList">编辑</button>
        </div>
        <div v-else>
          <button type="button" class="btn footer-save-btn clearBtnBorder" @click="saveRoomList">保存</button>
          <button type="button" class="btn footer-cancel-btn clearBtnBorder" @click="cancelEdit">取消</button>
        </div>
      </div>
    </div>
    <v-import
      v-bind="importParams"
      @backParentPage="curRouter = 'list'"
      v-else>
    </v-import>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { sAjax, translation } from '../../assets/utils/utils.js'
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
        floor: {
          defaultValue: '1',
          options: []
        },
        floors: [],
        columns: [],
        oldTableData: [],
        tableData: [],
        storageTableData: [],//用于取消编辑初始化数据
        idField: 'roomId',
        newVal: {},
        isEdit: false,
        genderData: [{value: '0', label: '未设置'}, {value: '1', label: '男生宿舍'}, {value: '2', label: '女生宿舍'}],
        curRouter: 'list',
        importParams: {
          parentPageTitle: '房间列表',
          downloadTemplateUrl: '/apartment/rooms/batch/template',
          downloadErrorTemplateUrl: '/apartment/rooms/batch/error',
          checkTemplateUrl: '',
          templateName: '批量导入房间信息',
          importBtnType: null
        },
        chnNumChar: ["零","一","二","三","四","五","六","七","八","九"],
        chnUnitChar: ["","十"],
        scrollHeight: null,
        selectOptions: {},
        modifyRoomList: [],
        emitSelect: false,
      }
    },
    watch: {
      windowObj: {
        deep: true,
        handler: function (val) {
          this.scrollHeight = $(".room-list" + this.data.data.buildingId).outerHeight() - $(".head").outerHeight() - $(".content-head" + this.data.data.buildingId).outerHeight() - $(".footer").outerHeight() - $('.table-head').outerHeight()
          console.log(this.scrollHeight)
        }
      }
    },
    computed: {
       checkedRecords: function () {
        var arr = []
        this.oldTableData.forEach((ele) => {
          if (ele.checked) {
            arr.push(ele)
          }
        })
        return arr
      },
    },
     mounted: function () {
      this.scrollHeight = $(".room-list" + this.data.data.buildingId).outerHeight() - $(".head").outerHeight() - $(".content-head" + this.data.data.buildingId).outerHeight() - $(".footer").outerHeight() - $('.table-head').outerHeight()
    },
    created: function () {
      this.getFloorsNumber()
      this.selectOptions = this.data.data.selectOptions
      this.columns = [{
          id: 'roomNo',
          title: '房间号',
          width: 48
        }, {
          id: 'gender',
          title: '房间属性',
          isEdit: false,
          width: 100,
          edit: {
            type: 'select',
            data: {
              options: this.genderData,
              optionsLabel: 'label',
              optionsValue: 'value'
            }
          },
          formatter: (record) => {
            var gender = ''
            this.genderData.forEach((ele) => {
              if (record.gender === parseInt(ele.value)) {
                gender = ele.label
              }
            })
            return gender
          }
        }, {
          id: 'usedFor',
          title: '房间用途',
          isEdit: false,
          width: 100,
          edit: {
            type: 'select',
            data: {
              options: this.selectOptions.usedFor,
              optionsLabel: 'label',
              optionsValue: 'value',
            },
          }
        }, {
          id:'canDistribution',
          title: '是否可分配',
          isEdit: false,
          width: 100,
          edit: {
            type: 'input',
          },
          formatter: (result) => {
            if(result.canDistribution){
              return '可分配'
            }else {
              return '不可分配'
            }
          }
        },{
          id: 'maxNumber',
          title: '房型（人/间)',
          isEdit: false,
          width: 100,
          edit: {
            type: 'input'
          }
        }, {
          id: 'price',
          title: '住宿费（元/年）',
          isEdit: false,
          width: 100,
          edit: {
            type: 'input'
          }
        }, {
          id: 'toilet',
          title: '卫生间类型',
          isEdit: false,
          width: 100,
          edit: {
            type: 'select',
            data: {
              options: this.selectOptions.toilet,
              optionsLabel: 'label',
              optionsValue: 'value'
            }
          }
        }, {
          id: 'area',
          title: '大小（m²）',
          isEdit: false,
          width: 74,
          edit: {
            type: 'input'
          }
        }, {
          id: 'furnitureType',
          title: '家具类型',
          isEdit: false,
          width: 100,
          edit: {
            type: 'select',
            data: {
              options: this.selectOptions.furnitureType,
              optionsLabel: 'label',
              optionsValue: 'value'
            }
          }
        }, {
          id: 'extraLongBed',
          title: '是否加长床',
          isEdit: false,
          width: 100,
          edit: {
            type: 'select',
            data: {
              options: this.selectOptions.extraLongBed,
              optionsLabel: 'label',
              optionsValue: 'value'
            }
          }
        }, {
          id: 'haveBalcony',
          title: '有无阳台',
          isEdit: false,
          width: 84,
          edit: {
            type: 'select',
            data: {
              options: this.selectOptions.haveBalcony,
              optionsLabel: 'label',
              optionsValue: 'value'
            }
          }
        }]
        this.importParams.checkTemplateUrl = '/apartment/rooms/batch/excel?buildingId=' + this.data.data.buildingId
        this.importParams.importBtnType = [{
          url: '/apartment/rooms/batch',
          method: 'post',
          isShowBtn: true,
          name: '覆盖导入',
          success: (data) => {
            if (data.state) {
              this.getFloorsNumber()
            }
          }
        }]
    },
    methods: {
      downLoad() {
        let url = '/downloads/apartment/beds/excel?buildingId='+ this.data.data.buildingId
        window.location.href = url
      },
      getFloorsNumber: function () {
        sAjax({
          url: '/api/apartment/buildings/floor/' + this.data.data.buildingId,
          type: 'get',
          success: (data) => {
            if (data.state) {
              for (let i = 0; i < data.data; i++) {
                this.floor.options.push({
                  id: (i + 1).toString(),
                  text: this.sectionToChinese((i + 1)) + '楼'
                })
              }
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      editRoomList: function () {
        this.isEdit = true
        let list = []
        for(let i = 0;i<this.tableData.length;i++) {
        list = list.concat(this.tableData[i].roomData)
        }
        console.log(list)
        this.columns.forEach((ele,index) =>{
          if (ele.edit) {
            ele.isEdit = true
          }
        })
        for(let x = 0;x< this.tableData.length;x++) {
          setTimeout(() => {
            this.tableData[x].updateInFirst = true
          },20)
        }
      },
      saveRoomList: function () {
        sAjax({
          url: '/api/apartment/rooms/batch/updateRooms',
          type: 'post',
          data: this.modifyRoomList,
          success: (data) => {
            if (data.state) {
              this.isEdit = false
              this.columns.forEach((ele) =>{
                if (ele.edit) {
                  ele.isEdit = false
                }
              })
              this.floorSelected({val: this.floor.defaultValue,value: this.floor.defaultValue})
              this.$toast('编辑成功！')
            } else {
              this.$toast(data.message)
            }
          }
        })
        
      },
      cancelEdit: function () {
        this.tableData = JSON.parse(JSON.stringify(this.storageTableData))
        console.log(this.storageTableData)
        this.isEdit = false
        this.columns.forEach((ele) =>{
          if (ele.edit) {
            ele.isEdit = false
          }
        })
      },
      floorSelected: function (obj) {
        console.log(obj)
        this.floor.defaultValue = obj.value
        this.floors = []
        this.floors = obj.value.split(',')
        this.floors = this.floors.sort(this.sortNumber)
        this.tableData = []
        for (var i in this.floors) {
          this.tableData.push({
            floor: this.floors[i],
            roomData: [],
          })
        }
         sAjax({
          url: '/api/apartment/rooms/getByFloors?buildingId=' + this.data.data.buildingId + '&floors=' + this.floors,
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.oldTableData = data.data
              var fieldArr = ['usedFor', 'toilet', 'furnitureType', 'extraLongBed', 'haveBalcony']
              this.oldTableData.forEach((row) => {
                this.columns.forEach((column) => {
                  if (column.edit) {
                    if (!this.newVal[row[this.idField]]) {
                      this.$set(this.newVal, row[this.idField], {})
                    }
                    if (fieldArr.indexOf(column.id) >= 0) {
                      this.$set(this.newVal[row[this.idField]], column.id, this._getDefaultValue(column.id,row[column.id]))
                    } else {
                      this.$set(this.newVal[row[this.idField]], column.id, row[column.id])
                    }
                    
                  }
                })
              })
              for (var i in this.tableData) {
                for (var j in data.data) {
                  if (this.tableData[i].floor === data.data[j].floor.toString()) {
                    this.tableData[i].roomData.push(data.data[j])
                  }
                }
                for(let x = 0;x<this.tableData[i].roomData.length;x++) {
                  this.tableData[i].roomData[x].updateFirstIn = false
                }
              }
              console.log(this.tableData)
              this.storageTableData = JSON.parse(JSON.stringify(this.tableData))
            } else {
              this.toast(data.message)
            }
           }
        })
        
      },
      sortNumber: function (a, b) {
        return a - b
      },
      _getDefaultValue: function (columnId,name) {
        var defaultValue = ''
        this.selectOptions[columnId].forEach((ele) => {
          if (name === ele.label) {
            defaultValue = ele.value 
          }
        })
        return defaultValue
      },
      changeCheckState: function () {
        var checkStatus = this.checkedRecords.length === 0
        this.oldTableData.forEach((ele) => {
          this.$set(ele, 'checked', checkStatus)
        })
      },
      rowSelect: function (obj) {
        this.$set(obj, 'checked', !obj.checked)
      },
      _afterSelect: function (obj, column, row) {
        if (!this.newVal[row[this.idField]]) {
          this.$set(this.newVal, row[this.idField], {})
        }
        this.$set(this.newVal[row[this.idField]], column.id, obj.value)
        if (this.checkedRecords.length > 0) {
          if (column.id === 'gender') {
            this.checkedRecords.forEach((ele) => {
              ele.gender = parseInt(obj.value)
              this.newVal[ele.roomId].gender = obj.value
            })
            row.gender = parseInt(obj.value)
            
          } else {
            var text = ''
            this.selectOptions[column.id].forEach((ele) => {
              if (obj.value === ele.value) {
                text = ele.label
              }
            })
            this.checkedRecords.forEach((ele) => {
              ele[column.id] = text
              this.newVal[ele.roomId][column.id] = obj.value
            })
          }
          this.modifyRoomList = this.checkedRecords
        } else {
          if (column.id === 'gender') {
            row[column.id] = parseInt(obj.value)
          } else {
            this.selectOptions[column.id].forEach((ele) => {
              if (obj.value === ele.value) {
                row[column.id] = ele.label
              }
            })
          }
          if (this.modifyRoomList.length === 0) {
            this.modifyRoomList.push(row)
          } else {
            var flag = false
            this.modifyRoomList.forEach((ele) => {
              if (row.roomId === ele.roomId) {
                flag  = true
                ele[column.id] = row[column.id]
              }
            })
            if (!flag) {
              this.modifyRoomList.push(row)
            }
          }

            if(column.title == '房间用途') {
              if(row.updateFirstIn) {
                let url = '/api/apartment/rooms/dictForCanDistribution?dictValue=' + row.usedFor
                sAjax({
                  url: url,
                  type:"get",
                  success: (data) => {
                    if(data.state) {
                      if(data.data) {
                        row.canDistribution = 1
                      }else {
                         row.canDistribution = 0
                      }
                    }
                  }
                })
              }else {
                row.updateFirstIn = true
              }
          }
          console.log(row)
        }
       
      },
      _save: function (column, row) {
        if (this.checkedRecords.length > 0) {
           this.checkedRecords.forEach((ele) => {
              ele[column.id] = row[column.id]
          })
        } else {
          if (this.modifyRoomList.length === 0) {
            this.modifyRoomList.push(row)
          } else {
            var flag = false
            this.modifyRoomList.forEach((ele) => {
              if (row.roomId === ele.roomId) {
                flag  = true
                ele[column.id] = row[column.id]
              }
            })
            if (!flag) {
              this.modifyRoomList.push(row)
            }
          }
        }
      },
      sectionToChinese: function (section) {
        var strIns = '', chnStr = ''
        var unitPos = 0
        var zero = true
        while(section > 0){
          var v = section % 10
          if(v === 0){
            if(!zero){
              zero = true
              chnStr = this.chnNumChar[v] + chnStr
            }
          }else{
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
<style lang="less" scoped>
#room-list {
  height: 100%;
  width: 1200px;
  margin: 0 auto 0;
  background: #fff;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
  position: relative;
  .head {
    height: 53px;
    border-bottom: 1px solid #F0F0F0;
    .head-title {
      font-size: 16px;
      color: rgba(0,0,0,0.87);
      padding: 15px 24px;
    }
  }
  .content {
    #content-head {
      padding: 11px 24px 0;
      border-bottom: 1px solid #F0F0F0;
      label {
        margin-right: 7px;
      }
      .form-select-style {
        width: 80px;
      }
      .form-group {
        display: inline-block;
      }
      .import-btn {
        background: #298df7;
        box-shadow: 0 0 2px 0 rgba(0,0,0,0.12), 0 2px 2px 0 rgba(0,0,0,0.12);
        border-radius: 3px;
        font-size: 13px;
        color: #FFFFFF;
      }
    }
    .content-table {
      width: 100%;
      height: 400px;
      white-space: nowrap;
      overflow-y: auto;
      .floor {
        font-size: 16px;
        color: #298df7;
        margin-left: 25px;
        line-height: 40px;
      }
      .check-opt {
        display: inline-block;
        // margin: 0 33px 0 9px;
        i {
          vertical-align: bottom;
          color: #979797;
          border-radius: 3px;
          cursor: pointer;
        }
      }
      .table-head {
        border-bottom: 1px solid #F0F0F0;
        padding: 6px 0 6px 24px;
        .table-th {
          display: inline-block;
          font-size: 14px;
          line-height: 40px;
          color: #333333;
          text-align: center;
          margin-left: 20px;
          // width: 9%;
          // min-width: 110px;
        }
      }
      .table-content {
        padding: 6px 0 6px 24px;
        .table-td {
          display: inline-block;
          font-size: 13px;
          color: rgba(0,0,0,0.68);
          line-height: 40px;
          margin-left: 20px;
          text-align: center;
          .table-select-style {
            display: inline-block;
            width: 96px;
            .form-control.dropdown-toggle {
              box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
              border-radius: 3px;
            }
          }
          .table-input-style {
            border: 1px solid #d9d9d9;
            border-radius: 3px;
            padding-left: 16px;
            &.short-input {
              width: 65px;
            }
            &.long-input {
              width: 96px;
            }
            height: 34px;
            vertical-align: bottom;
            font-size: 14px;
            display: inline-block;
            &:focus {
              box-shadow: none;
              outline: none;
              border-color: #d9d9d9;
            }
          }
        }
      }
    }
  }
  .footer {
    height: 73px;
    border-top: 1px solid  #F0F0F0;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    padding-top: 15px;
    .footer-edit-btn, .footer-save-btn {
      background: #298df7;
      box-shadow: 0 0 2px 0 rgba(0,0,0,0.12), 0 2px 2px 0 rgba(0,0,0,0.12);
      border-radius: 3px;
      font-size: 16px;
      color: #FFFFFF;
      padding: 10px 36px;
    }
    .footer-cancel-btn {
      background: transparent;
      font-size: 16px;
      color: #298df7;
      padding: 10px 36px;
    }
  }
}
</style>
