<template>
  <div id="college-batch-list">
    <div class="row text-center" v-show="curPage === 'batchList'">
      <v-table title="学院老师分配入住" :url="url" pagesize="10" idField="index" :columns="columns" :multiple="false" :order="true" :search="false">
        <!-- <div slot="btn-group" class="pull-right" @click="batchRecord = {id: 13, college: '', department: '',expectCheckInTime: '2018-10-10',expectRetirementTime:'2020-12-12' }; curPage = 'allocationPage'">
          <button class="btn">测试</button>
        </div> -->
      </v-table>
    </div>
    <allocatedDormitory v-if="curPage === 'allocationPage'" :data="batchRecord" @back="_back"></allocatedDormitory>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { translation, sAjax, createTime } from '../../assets/utils/utils.js'
  import allocatedDormitory from './collegeAllocatedDormitory.vue'
  Vue.component('allocatedDormitory', allocatedDormitory)
  export default {
    data: function () {
      return {
        curPage: 'batchList',
        url: '/table-data/apartment/checkIn/teacherAllocation/batchList',
        columns: [],
        batchRecord: '',
        statusJson: {
          WAIT_START: '未开始',
          APPLYING: '正在进行',
          END: '已结束'
        },
        statusOptions: [{value: 'WAIT_START', label: '未开始'}, {value: 'APPLYING', label: '正在进行'}, {value: 'END', label: '已结束'}]
      }
    },
    created: function () {
      this.columns = [{
        id: 'batchName',
        title: '批次名称',
        className: 'text-left',
        hidden: false,
        width: 120,
        search: {
          type: 'input',
          data: {
            placeholer: '',
            autoFocus: false
          }
        }
      }, {
        id: 'college',
        title: '学院',
        width: 120,
        className: 'text-left',
        hidden: false,
        formatter: (record) => {
          return record.collegeName
        }
      }, {
        id: 'department',
        title: '系别',
        width: 120,
        className: 'text-left',
        hidden: false,
        formatter: (record) => {
          return record.departmentName
        }
      }, {
        id: 'applytime',
        title: '学院分配时间',
        className: 'text-left',
        hidden: false,
        width: 120,
        formatter: (record) => { 
          return (record.collegeAllocateTimeStart||'') + '至' + (record.collegeAllocateTimeEnd||'')
        }
      }, {
        id: 'count',
        title: '学院分配',
        width: 80,
        className: 'text-center',
        hidden: false
      }, {
        id: 'status',
        title: '状态',
        width: 80,
        className: 'text-left',
        hidden: false,
        search: {
          type: 'select',
          data: {
            options: this.statusOptions,
            optionsLabel: 'label',
            optionsValue: 'value',
          }
        },
        formatter: (record) => { 
          return this.statusJson[record.status]
        }
      }, {
        id: 'opt',
        title: '操作',
        className: 'text-left',
        width: 50,
        hidden: false,
        formatter: (recordItem) => {
          return [{
            tag: 'a',
            text: '分配',
            className: 'opt-btn',
            callback: (record, index) => {
              this.curPage = 'allocationPage'
              this.batchRecord = record
            }
          }]
        }
      }]
    },
    methods: {
      _back: function () {
        this.curPage = 'batchList'
      }
    }
  }
</script>
<style lang="less">
#college-batch-list {
  width: 100%;
  height: 100%;
}
</style>


