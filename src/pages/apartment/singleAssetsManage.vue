<template>

  <div id="singleAssets">
    <div class="back-parent-page" >
        <button type="button" class="btn back-btn clearBtnBorder" @click="_backParentPage">
          <i class="maticon back-icon-btn" v-html="icons('arrow_back')">arrow_back</i><span class="nav-title">返回公寓资产管理</span>
        </button>
      </div>
      <v-table 
        :columns="columns"
        idField="id"
        :key="1"
        ref="liveStaffTable"
        :order="true"
        :search="false"
        pagesize=15
        :url="tableData_url"
        :searchParams='tableSearch'
        >
        <div slot="btn-group" role="group">
          <div class="btn-group pull-right">
            <button type="button" class="btn add clearBtnBorder" @click="addAssets">新增</button>
            <button type="button" class="btn add clearBtnBorder" @click="exportStat">导出</button>
        </div>
      </div>
    </v-table>
    <!-- 编辑模态框 -->
    <v-modal :show="showModal" effect="fade" width="350">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
            {{isEdit=='add'?'新增':'编辑'}}
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="modal-select form-group">
           <label for="singleAdd_select" class="partyName" >楼层</label>
           <v-select v-model='editInfo.floor' :options='floorList' optionsLabel='name' optionsValue='code' @afterSelected="afterSelectedFloor($event)"></v-select>
        </div>
        <div class="modal-select form-group">
           <label for="singleAdd_select" class="partyName">房间号</label>
           <v-select  :value='editInfo.roomNo' :options='roomNo' optionsLabel='roomName' optionsValue='roomName' @afterSelected="afterSelectedRoom($event)"></v-select>
        </div>
        <div class="form-group">
              <label class="edit-class-text">资产种类</label>
              <input v-model="editInfo.assetsType" type="text" class="form-control modal-form-style name-input">
        </div>
        <div class="form-group">
              <label class="edit-class-text">数量</label>
              <input v-model="editInfo.assetsNumber"  type="text" class="form-control modal-form-style name-input">
        </div>
         <div class="modal-select form-group">
           <label for="singleAdd_select" class="partyName">资产状态</label>
           <v-select v-model="assetsState_selected_value" :value='assetsState_selected_value' :options='assetsState' optionsLabel='name' optionsValue='code' @afterSelected="afterSelectedState($event)"></v-select>
        </div>
         <div class="modal-select form-group">
           <label for="note" class="partyName" style="vertical-align: top">备注</label>
           <textarea v-model="editInfo.note" style="width:180px;" name="note" id="note" cols="20" rows="8" maxlength="300"></textarea>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="selectSingle_cancle">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="submit">确定</button>
      </div>
    </v-modal>
  </div>
</template>
<script>
import { sAjax } from '../../assets/utils/utils';
export default {
  props: ['assetsInfo'],
  data() {
    return {
      tableData_url: '',
      showModal: false,//编辑模态框
      tableSearch: {
        floor:'',
        roomNo:'',
        assetsType:'',
        assetsState:'',
      },
      editInfo: {
        floor: '',
        roomNo: '',
        assetsState: '',
        assetsType: '',
        assetsNumber: 0,
        note: '',
        buildingId:''
      },//编辑对象信息
      floorList: [], //楼层下拉
      assetsState: [],//资产状态下拉
      roomNo: [],//房间号下拉框
      isEdit: '',//是否是编辑状态 ("edit":编辑状态，"add":新增，""：初始状态)
      editFloorModel:'',
      assetsState_selected_value: '',
    }
  },
  methods: {
    getFloor() { //获取楼层下拉跟资产状态
      let url = '/api/apartment/assets/'+ this.assetsInfo.buildingId +'/getApartmentBuildingOptions'
      sAjax({
        type: 'get',
        url: url,
        success: (data) => {
          if(data.state) {
            this.floorList = data.data.option.floor
            this.assetsState = data.data.option.assetsState
            this.$set(this.columns[0].search.data,'options',data.data.option.floor)
            this.$set(this.columns[4].search.data,'options',data.data.option.assetsState)
          }
        }
      })
    },
    getRoomNo(floor) {
      let url = '/api/apartment/assets/'+ this.assetsInfo.buildingId +'/getApartmentAssetsRoomOptions?floor=' + floor 
      sAjax({
        type: 'get',
        url: url,
        success: (data) => {
          if(data.state) {
            if(this.isEdit == '') {
              this.$set(this.columns[1].search.data,'options',data.data)
            }else {
              this.roomNo = data.data
            }
            
          }
        }
      })
    },
    selectSingle_cancle() {
      this.showModal = false
    },
    afterSelectedFloor(e) {
      if(e.value != this.editFloorModel) {
        // this.roomNo = []
        this.editInfo.roomNo = ''
        this.editFloorModel = ''
        this.getRoomNo(e.value)
      }
    },
    afterSelectedState(e) {
      this.editInfo.assetsState = e.value
    },
    afterSelectedRoom(e) {
      this.editInfo.roomNo = e.value
    },
    addAssets() {
      this.showModal = true
      this.assetsState_selected_value = ''
      this.isEdit = 'add'
      this.editInfo = {}
    },
    submit() {
      console.log(this.editInfo)
      if(!this.editInfo.floor) return this.$toast('请选择楼层')
      if(!this.editInfo.roomNo) return this.$toast('请选择房间号')
      if(!this.editInfo.assetsType) return this.$toast('请输入资产种类')
      if(!this.editInfo.assetsNumber) return this.$toast('请输入数量')
      if(!this.editInfo.assetsState) return this.$toast('请选择资产状态')

      if(this.isEdit == 'edit') {
        var url = '/api/apartment/assets/updateRoomAssets'
      }else {
        var url = '/api/apartment/assets/addRoomAssets'
        this.editInfo.buildingId = this.assetsInfo.buildingId
      }
      
      sAjax({
        type: 'post',
        url: url,
        data: this.editInfo,
        success: (data) => {
          if(data.state) {
            this.tableData_url ='/table-data/apartment/assets/getApartmentBuilding?buildingId=' + this.assetsInfo.buildingId + '&timeStamp=' + new Date().getTime()
            this.isEdit = ''
            this.showModal = false
            if(this.isEdit) {
              return this.$toast('编辑成功')
            }else {
              return this.$toast('新增成功')
            }
          }else {
            this.$toast(data.message)
          }
        }
      })
    },
    _backParentPage: function () {
      this.$emit('backToPage')
    },
    exportStat() { //导出
       let table = this.$refs.liveStaffTable.tableSearchFields
       let url = '/downloads/apartment/assets/getApartmentBuildingExcel?buildingId='+this.assetsInfo.buildingId+'&floor='+table.floor+'&roomNo='+table.roomNo+'&assetsType='+table.assetsType+'&campusName='+this.assetsInfo.campusName+'&zoneName='+this.assetsInfo.zoneName+'&name='+this.assetsInfo.name
       window.location.href = url
   }
  },
  created() {
    this.getFloor()
    this.tableData_url ='/table-data/apartment/assets/getApartmentBuilding?buildingId=' + this.assetsInfo.buildingId
    this.columns = [{
        id: 'floor',
        title: '楼层',
        width: 100,
        className: 'text-left',
        hidden: false,
        search: {
            type: 'select',
            data: {
              // url: '/api/apartment/assets/'+ this.assetsInfo.buildingId +'/getApartmentBuildingOptions',
              options: this.floorList,
              optionsLabel: 'name',
              optionsValue: 'code',
              change: (obj) => {
                this.roomNo = []
                this.getRoomNo(obj.value)
              },
            }
          }
    },{
        id: 'roomNo',
        title: '房间号',
        width: 150,
        className: 'text-left',
        hidden: false,
      
        // disabled:true,
        search: {
           
           type: 'multiSelect',
            data: {
              options: this.roomNo,
              optionsLabel: 'roomName',
              optionsValue: 'roomName',
              change: function (obj) {
              }
            }
            
          }
    },{
        id: 'assetsType',
        title: '资产种类',
        width: 150,
        className: 'text-left',
        hidden: false,
        search: {
            type: 'text',
            data: {
              autoFocus: false
            }
          }
    },{
        id: 'assetsNumber',
        title: '数量',
        width: 150,
        className: 'text-left',
        hidden: false,
    },{
        id: 'assetsState',
        title: '资产状态',
        width: 150,
        className: 'text-left',
        hidden: false,
        search: {
          type: 'select',
          data: {
            options: this.assetsState,
            optionsLabel: 'name',
            optionsValue: 'code',
          }
        }
    },{
        id: 'note',
        title: '备注',
        width: 150,
        className: 'text-left',
        hidden: false,
    },{
        id: 'records',
        title: '操作记录',
        width: 250,
        className: 'text-left',
        hidden: false,
    },{
        id: 'opt',
        className: 'text-left',
        width: 150,
        title: '操作',
        hidden: false,
        formatter: () => {
          return [{
            tag: 'a',
            text: '编辑',
            className: 'opt-btn',
            callback: (record, index) => {
                this.showModal = true
                this.isEdit = 'edit'
                this.editInfo = {
                  floor: record.floor,
                  roomNo: record.roomNo,
                  assetsType: record.assetsType,
                  assetsNumber: Number(record.assetsNumber),
                  note: record.note,
                  assetsId: record.assetsId,
                  buildingId: record.buildingId
                }
                this.editFloorModel = record.floor
                this.getRoomNo(this.editInfo.floor);
                this.assetsState.map((val) => {  //设置编辑状态默认值
                  if(val.name == record.assetsState) {
                    this.assetsState_selected_value = val.code
                    this.editInfo.assetsState = val.code
                  }
                })
                
              }
          },{
            tag: 'a',
            text: '删除',
            className: 'opt-btn',
            callback: (record, index) => {
                if (window.confirm('确认要删除吗?删除后数据无法恢复')) {
                    let url = '/api/apartment/assets/'+ record.assetsId +'/deleteRoomAssets'
                    sAjax({
                      url: url,
                      type: 'post',
                      success: (data) => {
                        if(data.state) {
                          this.tableData_url ='/table-data/apartment/assets/getApartmentBuilding?buildingId=' + this.assetsInfo.buildingId + '&timeStamp=' + new Date().getTime()
                          this.$toast('删除成功');
                        }
                      }
                    })
                  }
              }
          }]
        }
    }
    ]
  },
  mounted() {
    
  }
}
</script>
<style lang="less" scoped>
  #singleAssets {
    .modal-body {
      label {
        min-width: 70px;
        text-align: right;
        padding-right:6px;
      }
      .modal-form-style {
        margin-left: 0;
      }
      .v-select {
        width: 180px;
      }
    }
    table .btn-group .clearBtnBorder {
      background: #fff;
    }
  }
  .back-parent-page {
    button {
      background: transparent;
    }
    span {vertical-align: text-top;}
    i {vertical-align: middle;margin-right: 5px;}
  }
</style>


