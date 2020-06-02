<template>
  <div id="my-record" class="container-fluid" >
    <div class="row text-center">
      <v-table :url="tableUrl" pagesize="10" idField="id" :columns="columns" :multiple="false" :order="true" :search="false"></v-table>
    </div>
    <!-- 咨询师评分弹窗 -->
    <v-modal :show="showRateCounselor" effect="fade" width="400">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          编辑
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="form-group">
          <label class="form-label two-words-difference-margin">评星</label>
          <div class="stars-group" v-for="(item, index) in stars" :key="index">
            <span @click="changeStar(item)">
               <i class="maticon" :class="record.starNumber > 3?'danger-color':'default-color'" v-html="icons('star')" v-if="item.isSelected">star</i>
               <i class="maticon star-border" v-html="icons('star_border')" v-else>star_border</i>
            </span>
          </div>
        </div>
        <div class="form-group">
          <label class="input-label textarea-label">评价</label>
          <textarea cols="24" rows="5" class="modal-textarea" :disabled="!canEditCounselor" maxlength="300" v-model="record.resultRecord"></textarea>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder"  @click="showRateCounselor = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder"  @click="sumbitEditRecordModal">确定</button>
      </div>
    </v-modal>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { translation, sAjax, createTime, request } from '../../assets/utils/utils.js'
  import starts from '../../mixins/starts.js'
  export default {
    mixins:[starts],
    data: function () {
      return {
        url: '',
        timeStamp: '',
        columns: [],
        tableUrl:'',
        showRateCounselor:false,
        statusLabel: {
          SUCCESS: '预约成功',
          CANCELED: '取消预约',
          CANCELED_BY_ADMIN: '后台取消',
          ING: '进行中',
          FINISHED: '已结束',
          DONE: '已完成',
          ABSENT: '未到',
          ABORT: '排班被取消'
        },
        setting: {
          cancelTip: ''
        },
        lang: 'zh-cn'
      }
    },
    computed: {
      translate: function () {
        return translation(this.lang).employmentUnitManage
      }
    },
    created: function () {
      var la = localStorage.getItem('lang')
      if (translation(la)) {
        this.lang = la
      }
      this._getSetting()
      this.initTable();
    },
    methods: {
      sumbitEditRecordModal: function () {//提交评分
          if(!this.canEditCounselor){
             this.showRateCounselor = false;
             return;
          }
          let params = {
            teacherScore:this.record.starNumber,
            studentEvaluation:this.record.resultRecord,
          }
          let url = 'api/mentality/reservation/' + this.record.id +'/evaluations'
          request(url,params).then(o=>{
              if(o.state){
                this.$toast('评价成功!')
              this.initTable();
              this.showRateCounselor = false;
              }
          })
      },
      initTable(){
        this.timeStamp = createTime();
        this.tableUrl = `/table-data/mentality/reservation/histories?timeStamp=${this.timeStamp}`
        this.columns = [{
        id: 'studentName',
        title: '姓名',
        width: 120,
        className: 'text-left',
        hidden: false,
        formatter: function (record) {
          return record.student ? record.student.name : ''
        }
      }, {
        id: 'studentNo',
        title: '学号',
        width: 120,
        className: 'text-left',
        hidden: false,
        formatter: function (record) {
          return record.student ? record.student.userNo : ''
        }
      }, {
        id: 'teacherName',
        title: '咨询师',
        width: 100,
        className: 'text-left',
        hidden: false,
        search: {
          type: 'input',
          data: {
            placeholer: '',
            autoFocus: true
          }
        },
        formatter: function (record) {
          return record.teacher ? record.teacher.name : ''
        }
      }, {
        id: 'timeQuantum',
        title: '预约时间段',
        width: 80,
        className: 'text-center no-wrap',
        hidden: false,
        formatter: function (record) {
          return record.dayTime && record.dayTime.timeQuantum ? (record.dayTime.dateTime + ' ' + record.dayTime.timeQuantum) : ''
        }
      }, {
        id: 'createTime',
        title: '预约时间',
        width: 80,
        className: 'text-center no-wrap',
        hidden: false,
        // formatter: function (record) {
        //   return record.dayTime && record.dayTime.dateTime ? record.dayTime.dateTime : ''
        // }
      }, {
        id: 'status',
        title: '状态',
        className: 'text-center',
        width: 100,
        search: {
          type: 'select',
          data: {
            options: [
              { value: 'SUCCESS', label: '预约成功' },
              { value: 'CANCELED', label: '取消预约' },
              { value: 'CANCELED_BY_ADMIN', label: '后台取消' },
              { value: 'ING', label: '进行中' },
              { value: 'FINISHED', label: '已结束' },
              { value: 'DONE', label: '已完成' },
              { value: 'ABSENT', label: '未到' },
              { value: 'ABORT', label: '排班被取消' }],
            optionsLabel: 'label',
            optionsValue: 'value'
          }
        },
        hidden: false,
        formatter: (record) => {
          return this.statusLabel[record.status]
        }
      }, {
        id: 'opt',
        title: this.translate.opt,
        className: 'text-left',
        width: 130,
        hidden: false,
        formatter: (recordItem) => {
          var opt = []
          if (['SUCCESS', 'ING'].indexOf(recordItem.status)>=0 && recordItem.canCancelOnTime) {
            opt.push({
              tag: 'a',
              text: '取消预约',
              callback: (record, index) => {
                this._cancelReservition(record)
              }
            })
          }
          if(recordItem.status === 'FINISHED' || recordItem.status === 'DONE'){//已结束,可以进行评价
            if(recordItem.teacherScore){//已经评价过了
              opt.push({
              tag: 'a',
              text: '查看评分',
              callback: (record, index) => {
                this.showCounselor(record,index,)
              }
            })
            }else{
              opt.push({
              tag: 'a',
              text: '给咨询师评分',
              callback: (record, index) => {
                this.rateCounselor(record,index)
              }
            })
            }
          }
          return opt
        }
      }]
      },
      showCounselor(record,index){//查看评分
        this.record= record
        this.record.starNumber = record.teacherScore
        this.stars.forEach((o,index)=>{
          if(index<this.record.starNumber){
            o.isSelected = true;
          }
        })
        this.record.resultRecord = record.studentEvaluation
        this.canEditCounselor = false;
        this.showRateCounselor = true; 
      },
      rateCounselor(record,index){//给咨询师评分
        this.record = record
        this.record.starNumber = 0;
        this.stars.forEach((o,index)=>{
          if(index<this.record.starNumber){
            o.isSelected = true;
          }
        })
        this.record.resultRecord = '';
        this.canEditCounselor = true;
        this.showRateCounselor = true;  
      },
      _getSetting: function () {
        sAjax({
          url: `/api/mentality/config`,
          type:'get',
          success: (data) => {
            if(data.state) {
              this.setting = data.data
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _cancelReservition: function (record) {
        this.$prompt({
          tip: '取消预约原因',
          placeholder: '请在此处输入取消预约的原因',
          warn: this.setting.cancelTip,
          callback: (result) => {
            if (result.type === 'ok') {
              if (!result.text) {
                this.$toast('请输入取消预约原因！')
                return false
              }
              sAjax({
                url: `/api/mentality/reservation/${record.id}/cancel`,
                type: 'post',
                data: {
                  reason: result.text
                },
                success: (data) => {
                  if (data.state) {
                    this.$toast("预约已取消")
                    this.timeStamp = createTime()
                  } else {
                    this.$toast(data.message)
                  }
                }
              })
            }
          }
        })

      }
    }
  }
</script>
<style lang="less">
#my-record {
  .no-wrap {
    white-space: normal;
    line-height: 1.5;
  }
  .stars-group {
  display: inline-block;
  vertical-align: bottom;
  margin-left: 8px;
  span {
    cursor: pointer;
    .star-border {
      color: #999999;
    }
    .default-color {
      color: #f8e717;
    }
    .danger-color {
      color: #ff3d3d;
    }
  }
}
.modal-body{
  .input-label,.form-label{
    width:55px;
    text-align: right;
  }
}
  .textarea-label {
    vertical-align: top;
  }
  .modal-textarea {
    width: 72%;
    resize: none;
    margin-left: 10px;
    padding: 5px;
    border: 1px solid #e0e0e0;
    outline: none;
  }
}
</style>
