<template>
  <div id='ojfList'  v-if="page === 'LIST'">
    <div class="ojfList container col-sm-12">
      <el-button
      style="color:#666;"
      type="text"
      icon="el-icon-back"
      @click="backToHomePage"
    >返回</el-button>
    <v-table
      :url="tableUrl"
      :columns="table.columns"
      idField="id"
      pagesize="20"
      :multiple="false"
      :search="false"
      :order="true"
    >
    </v-table>
    </div>
  </div>
  <student-ojf-detail :id="ojf && ojf.id" @back-to-list="page = 'LIST'" from-list v-else></student-ojf-detail>
</template>

<script>

import { Ojf } from './types'
import StudentOjfDetail from './studentOjfDetail.vue'

export default {
  components: {
    StudentOjfDetail
  },
  data() {
    return {
      ojf: null,
      page: 'LIST',
      table: {
        url: '/table-data/employment/platform/getNetworkMeetingList?ts=',
        search: {
          ts: +new Date(),
          beginTime: '',
          endTime: ''
        },
        columns: [{
          id: 'name',
          title: "网招会名称",
          className: "text-left",
          width: 150,
          hidden: false,
          search: {
            type: '',
            data: {
              placeholer: '网招会名称',
              autoFocus: false
            }
          },
          formatter: (record) => {
            const ojf = Ojf.fromApi(record)
            return ojf.getNameHtmlWithStatus()
          }
        }, {
          id: 'startTime',
          title: '网招会开始时间',
          className: 'text-left',
          width: 140,
          hidden: false,
          formatter: (record) => {
            return new Date(record.beginTime).format('yyyy-MM-dd HH:mm')
          }
        }, {
          id: 'endTime',
          title: '网招会结束时间',
          className: 'text-left',
          width: 140,
          hidden: false,
          formatter: (record) => {
            return new Date(record.endTime).format('yyyy-MM-dd HH:mm')
          }
        }, {
          id: 'opt',
          title: "操作",
          width: 50,
          hidden: false,
          formatter: (record) => {
            const opts = {
              show: {
                tag: 'a',
                text: '查看',
                callback: (record, index) => {
                  this.showOjf(Ojf.fromApi(record))
                }
              }
            }
            return [ opts.show ]
          }
        }],
      },
      currentDcw: null
    }
  },
  computed: {
    tableUrl() {
      return `${this.table.url}&beginTime=${this.table.search.beginTime || ''}&endTime=${this.table.search.endTime || ''}&ts=${this.table.search.ts}`
    }
  },
  methods: {
    showOjf(ojf) {
      this.ojf = ojf
      this.page = 'DETAIL'
    },
    backToHomePage() {
      this.$emit('toSomePage', '/index')
    },
    refreshTable() {
      this.table.search.ts = +new Date()
    },
  }
}
</script>

<style lang="less" scoped>
@import url('../../styles/styles.less');
</style>
<style lang="less">
#ojfList {
  position: relative;
}
</style>

