<template>
  <div id="dormitory-detail-info">
    <div class="">
      <div class="dormitory-page-head">
        <i class="maticon back-icon-btn pull-left" @click="_back" v-html="icons('navigate_before')">navigate_before</i>
      </div>
      <div class="dormitory-page-content">
        <div class="room-number">房间号：{{roomNo}}</div>
        <div class="room-table">
          <div class="room-table-head">
            <div class="row">
              <div class="head-tr creat-col-md-2">床位</div>
              <div class="head-tr creat-col-md-4">居住人信息</div>
              <div class="head-tr creat-col-md-2">状态</div>
              <div class="head-tr creat-col-md-2" style="border-right: 0 solid">历史记录</div>
            </div>
          </div>
          <div class="room-table-content" :style="'height:' + scrollHeight + 'px'">
            <GeminiScrollbar :scrollX="false" :style="'height:' + scrollHeight + 'px'">
              <div class="row" v-for="(cell, cellIndex) in dormitoryData" :key="cellIndex" v-if="cell.bedAccommodations.length > 0">
                <div class="content-td creat-col-md-2">{{cell.bed.bedNo}}</div>
                <div class="content-td creat-col-md-4">
                  <div class="resident-info" :class="(ucIndex+1)%2===0 || cell.bedAccommodations.length ===1 ?'prepared':''" v-for="(userCell, ucIndex) in cell.bedAccommodations" :key="ucIndex" v-if="userCell.status === '已入住'">
                    <div class="field-container">
                      <div class="field-name">姓名：</div>
                      <div class="field-name">学号：</div>
                      <div class="field-name">学院：</div>
                      <div class="field-name">年级：</div>
                      <div class="field-name">入住时间：</div>
                      <div class="field-name">预计退宿时间：</div>
                    </div>
                    <div class="field-container">
                      <div class="field-content">{{userCell.userName || '-'}}</div>
                      <div class="field-content">{{userCell.userNo || '-'}}</div>
                      <div class="field-content">{{userCell.college || '-'}}</div>
                      <div class="field-content">{{userCell.degree || '-'}}</div>
                      <div class="field-content">{{userCell.inDate || '-'}}</div>
                      <div class="field-content">{{userCell.outDate || '-'}}</div>
                    </div>
                  </div>
                  <div class="resident-info" :class="(ucIndex+1)%2===0 || cell.bedAccommodations.length ===1 ?'prepared':''" v-else>
                    <div class="field-container">
                      <div class="field-name">姓名：</div>
                      <div class="field-name">学号：</div>
                      <div class="field-name">学院：</div>
                      <div class="field-name">年级：</div>
                      <div class="field-name">预计入住时间：</div>
                      <div class="field-name">预计退宿时间：</div>
                    </div>
                    <div class="field-container">
                      <div class="field-content">{{userCell.userName || '-'}}</div>
                      <div class="field-content">{{userCell.userNo || '-'}}</div>
                      <div class="field-content">{{userCell.college || '-'}}</div>
                      <div class="field-content">{{userCell.degree || '-'}}</div>
                      <div class="field-content">{{userCell.inDate || '-'}}</div>
                      <div class="field-content">{{userCell.outDate || '-'}}</div>
                    </div>
                  </div>
                </div>
                <div class="content-td creat-col-md-2">
                  <div class="reside-tatus" :class="(scIndex+1)%2===0 || cell.bedAccommodations.length ===1 ?'prepared':''" v-for="(statusCell, scIndex) in cell.bedAccommodations" :key="scIndex" v-if="statusCell.status === '已入住'">{{statusCell.status}}</div>
                  <div class="reside-tatus" :class="(scIndex+1)%2===0 || cell.bedAccommodations.length ===1?'prepared':''" v-else>{{statusCell.status}}</div>
                </div>
                <div class="content-td creat-col-md-2 check-record" @click="checkRecord(cell.bed.bedId)">
                  <div>查看</div>
                </div>
              </div>
              <div class="row" v-else>
                <div class="content-td creat-col-md-2 empty-bed-style">{{cell.bed.bedNo}}</div>
                <div class="content-td creat-col-md-4 empty-bed-style">空床位</div>
                <div class="content-td creat-col-md-2 empty-bed-style">&nbsp;</div>
                <div class="content-td creat-col-md-2 check-record" @click="checkRecord(cell.bed.bedId)">
                  <div>查看</div>
                </div>
              </div>
            </GeminiScrollbar>  
          </div>
        </div>
      </div>
    </div>
    <v-modal :show="showRecordModal" effect="fade" width="700">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">历史记录</h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <v-table  idField="id" :columns="historyRecordColumns" :rows="historyRecord" :order="true" :paginationShow="false">
        </v-table>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showRecordModal = false">取消</button>
      </div>
    </v-modal>
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
      roomId: {
        default: null
      },
      beginTime: {
        default: null
      },
      endTime: {
        default: null
      },
      roomNo: {
        default: null
      }
    },
    data: function () {
      return {
        dormitoryData: [],
        scrollHeight: null,
        showRecordModal: false,
        historyRecordColumns: [],
        historyRecord: []
      }
    },
    created: function () {
      this.beginTime = /\d{4}-\d{1,2}-\d{1,2}/g.exec(this.beginTime)[0]
      this.endTime = /\d{4}-\d{1,2}-\d{1,2}/g.exec(this.endTime)[0]
      sAjax({
        url: '/api/apartment/rooms/getRoomArranges/' + this.roomId + '?beginTime=' + this.beginTime + '&endTime=' + this.endTime,
        dataType: 'json',
        type: 'get',
        success: (data) => {
          if (data.state) {
            if (data.data) {
              data.data.forEach((ele) => {
                this.dormitoryData = data.data
              })
            }
          } else {
            this.$toast(data.message)
          }
        }
      })
      this.historyRecordColumns = [{
        id: 'userNo',
        title: '学号',
        className: 'text-left',
        hidden: false
      }, {
        id: 'userName',
        title: '姓名',
        className: 'text-left',
        hidden: false
      }, {
        id: 'operationType',
        title: '类型',
        className: 'text-left',
        hidden: false
      }, {
        id: 'changeDate',
        title: '时间',
        className: 'text-left',
        hidden: false
      }]
    },
    computed: {
    },
    watch: {
      windowObj: {
        deep: true,
        handler: function (val) {
          this.scrollHeight = $("#dormitory-detail-info").outerHeight() - $(".dormitory-page-head").outerHeight() - 65 - $(".room-table-head").outerHeight()
          console.log(this.scrollHeight)
        }
      }
    },
    methods: {
      _back: function () {
        this.$emit('back')
      },
      checkRecord: function (bedId) {
        sAjax({
        url: '/api/apartment/beds/getBedHistory/' + bedId,
        dataType: 'json',
        type: 'get',
        success: (data) => {
          if (data.state) {
            if (data.data) {
              this.historyRecord = data.data
              this.showRecordModal = true
            }
          } else {
            this.$toast(data.message)
          }
        }
      })
      }
    },
     mounted: function () {
      this.scrollHeight = $("#floor-plan").outerHeight() - $(".dormitory-page-head").outerHeight() - 65 - $(".room-table-head").outerHeight()
    }
  }
</script>
<style lang="less">
#dormitory-detail-info {
  .dormitory-page-head {
    height: 53px;
    border-bottom: 1px solid#F0F0F0;
    padding-left: 15px;
    .back-icon-btn {
      padding: 10px;
      font-size: 30px;
      color: #919191;
      cursor: pointer;
    }
  }
  .dormitory-page-content {
    .room-number {
      font-size: 18px;
      color: rgba(16,16,16,0.87);
      padding: 25px 0 15px 35px;
    }
    .room-table {
       margin: 0 35px;
      .room-table-head {
        text-align: center;
        border: 1px solid #D9D9D9;
        font-size: 0;
        .row {
          margin: 0;
          .head-tr {
            font-size: 19px;
            color: #298df7;
            letter-spacing: 0.71px;
            line-height: 40px;
            border-right: 1px solid #D9D9D9;
            padding: 5px 0;
            display: inline-block;
            &.creat-col-md-2 {
              width: 20%;
            }
            &.creat-col-md-4 {
              width: 40%;
            }
          }
        }
      }
      .room-table-content {
        text-align: center;
        border-top: 0 solid;
        font-size: 0;
        .row {
          margin: 0;
          border: 1px solid #D9D9D9;
          border-top: 0;
          .content-td {
            font-size: 15px;
            line-height: 25px;
            color: #555555;
            padding: 0;
            display: inline-block;
            vertical-align: middle;
             &.creat-col-md-2 {
              width: 20%;
            }
            &.creat-col-md-4 {
              width: 40%;
            }
            &.empty-bed-style {
              border-right: 1px solid #D9D9D9;
              padding: 15px 0;
            }
            &.check-record {
              cursor: pointer;
            }
            .resident-info {
              text-align: center;
              border: 1px solid #D9D9D9;
              border-top: 0;
              &.prepared{
                border-bottom: 0 solid #D9D9D9;
              }
              .field-container {
                display: inline-block;
                .field-content {
                  text-align: left;
                }
              }
              padding: 10px 0;
              div {
                .field-name {
                  // width: 120px;
                  text-align: right;
                  // display: inline-block;
                }
              }
            }
            .reside-tatus {
              height: 171px;
              padding-top: 70px;
              border-bottom: 1px solid #D9D9D9;
              border-right: 1px solid #D9D9D9;
              &.prepared{
                border-bottom: 0 solid #D9D9D9;
              }
            }
          }
        }
      }

    }
  }
}
</style>


