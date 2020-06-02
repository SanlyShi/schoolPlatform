<template>
  <div class="info-set-container">
    <div class="examinationRank-page">
      <div class="tab-div">
        <div class="tab" :class="!hadCheck ? 'active' : ''" title="未审核" @click="setHadCheck(false)">未审核</div>
        <div class="tab" :class="hadCheck ? 'active' : ''" title="已审核" @click="setHadCheck(true)">已审核</div>
      </div>
      <div class="content text-center">
        <v-table title="审核列表" ref="studentTable" :url="url+checkStatus+timestamp" pagesize="15" idField="id" :columns="columns" :order="true" :multiple="checkStatus.indexOf('false')!==-1" @afterChecked="afterChecked" :search="false" >
          <div slot="btn-group" class="btn-group pull-right" role="group">
            <button class="btn btn-bgColor-style clearBtnBorder" @click="_agree(true)">
              通过
            </button>
            <button class="btn btn-bgColor-style clearBtnBorder" @click="_agree(false)">
              驳回
            </button>
          </div>
        </v-table>
      </div>
      <v-modal :show="showReasonModal" width="374">
        <div slot="modal-header" class="modal-header">
          <h5 class="modal-title">驳回理由</h5>
        </div>
        <div slot="modal-body" class="modal-body">
          <div class="form-wrap box_flex align_center">
            <div class="form-group box_flex column">
              <div class="label require"><span>驳回理由:</span></div>
              <v-textarea v-model="note" :lineHeight="22" placeholder="请输入驳回理由" :rows="6" :maxLength="255"></v-textarea>
            </div>
          </div>
        </div>
        <div slot="modal-footer" class="modal-footer">
          <button type="button" class="btn cancel-btn clearBtnBorder" @click="showReasonModal = false">取消</button>
          <button type="button" class="btn submit-btn clearBtnBorder" @click="_submit('NO')">确定</button>
        </div>
      </v-modal>
    </div>
  </div>
</template>
<script>
import { request } from '../../assets/utils/utils';
export default {
  data: function () {
    return {
      hadCheck: false,
      checkStatus: '?checkStatus=false',
      showReasonModal: false,
      note: '',
      timestamp:'&timestamp=',
      columns: [
        {
          id: "studentNo",
          title: "考生号",
          className: "text-left",
          width: 180,
          hidden: false,
          search: {
            type: "input",
          }
        }, {
          id: "name",
          title: "姓名",
          className: "text-left",
          width: 120,
          hidden: false,
        }, {
          id: "adviceNoteNo",
          title: "通知书单号",
          className: "text-left",
          width: 180,
          hidden: false,
          search: {
            type: "input",
          }
        }, {
          id: "submitTime",
          title: "提交时间",
          className: "text-left",
          width: 180,
          hidden: false,
        },{
          id: "operateName",
          title: "操作人",
          className: "text-left",
          width: 180,
          hidden: true,
        },{
          id: "status",
          title: "状态",
          className: "text-left",
          width: 180,
          hidden: true,
          search: {
            type: "select",
            data: {
              options: [{text:'通过',id:'OK'},{text:'驳回',id:'NO'}],
              optionsLabel: "text",
              optionsValue: "id",
              placeholder: ""
            }
          },
          formatter(record){
            return record.status=='NO'?'驳回':'通过'
          }
        },{
          id: "note",
          title: "说明",
          className: "text-left",
          width: 180,
          hidden: true,
        },{
          id: "submitTime",
          title: "审核时间",
          className: "text-left",
          width: 180,
          hidden: true,
        }
        ],
      url: '/table-data/archives/query/checkList'
    }
  },
  watch: {
    hadCheck(newVal) {
      if (newVal) {
        this.columns.forEach((o,index)=>{
          if(index>=4){
            o.hidden = false
          }
        })
        this.checkStatus = '?checkStatus=true'
      } else {
        this.columns.forEach((o,index)=>{
          if(index>=4){
            o.hidden = true
          }
        })
        this.checkStatus = '?checkStatus=false'
      }
    }
  },
  methods: {
    afterChecked(rows) {
      this.checkRows = rows;
    },
    setHadCheck(bool) {
      this.hadCheck = bool
    },
    _agree(bool) {
      if (!this.checkRows.length) {
        this.$toast('请先选择学生')
        return
      }
      if (bool) {
        this._submit('OK')
      } else {
        this.showReasonModal = true
      }
    },
    _submit(status) {
      let url = 'api/archives/query/updateCheckList'
      let updateId = ''
      let updateEnrollId = ''
      let idArr = this.checkRows.map(o => {
        updateId += o.id + ','
        updateEnrollId += o.enrollId + ','
        return o.id
      });
      let enrollIdArr = this.checkRows.map(o => {
        return o.enrollId
      });
      let params = {
        status: status,
        updateId: idArr,
        updateEnrollId:enrollIdArr,// updateEnrollId.substr(0, updateEnrollId.length - 1),
        note: this.note
      }
      request(url, params, 'post').then(o => {
        if(o.state){
        this.timestamp = "&timestamp=" + new Date().getTime();
        this.$toast('操作成功!')
        }
      })
      this.showReasonModal = false
    }
  }
}
</script>
<style lang="less" scoped>
.form-wrap {
  width: 100%;
  flex-wrap: wrap;
  .form-group {
    margin-right: 20px;
    .label {
      width: 180px;
      font-size: 14px;
      color: #666;
      text-align: left;
      padding-left: 0px;
      padding-right: 12px;
    }
    .v-textarea {
      width: 334px;
      height: 150px;
      border-radius: 5px;
      margin-top: 5px;
      padding: 5px;
      font-size: 13px;
    }
    .v-select,
    .form-control,
    .v-datepicker,
    .ditection {
      width: 200px;
    }
  }
}
.tab-div {
  position: relative;
  height: 40px;
  margin: 10px 0px 0;
  background: white;
  white-space: nowrap;
  border-bottom: 1px solid #f0f0f0;
  .apply-container {
    position: absolute;
    right: 0;
  }
  .tab-list {
    position: relative;
    .gm-scroll-view {
      padding-right: 200px;
    }
  }
  .tab {
    display: inline-block;
    // max-width: 200px;
    width: 150px;
    padding: 0 20px;
    font-size: 13px;
    color: rgba(0, 0, 0, 0.54);
    line-height: 40px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    transition: all 0.2s ease-out;
    vertical-align: top;
    &.tab-node {
      line-height: 20px;
      p {
        margin: 0;
        text-align: left;
      }
    }
    &:hover,
    &.active {
      color: #298df7;
      border-bottom: 2px solid #298df7;

      height: 40px;
    }
    margin-right: -4px;
  }
}
</style>

