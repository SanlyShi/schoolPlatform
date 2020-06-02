<template>
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
</template>

<script>
import { Ojf } from './types'

export default {
  data() {
    return {
      page: 'LIST',
      table: {
        url: '/table-data/employment/manage/networkMeeting/getNetworkMeetingList?ts=',
        search: {
          ts: +new Date(),
          beginTime: '',
          endTime: ''
        },
        columns: [{
          id: 'name',
          title: "网招会名称",
          className: "text-left",
          width: 100,
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
          id: 'startApplyTime',
          title: '申请开始时间',
          className: 'text-left line-height-normal',
          width: 145,
          hidden: false,
          formatter(record) {
            return `${new Date(record.applyBeginTime).format('yyyy-MM-dd HH:mm')}`
          }
        }, {
          id: 'endApplyTime',
          title: '申请结束时间',
          className: 'text-left line-height-normal',
          width: 145,
          hidden: false,
          formatter(record) {
            return `${new Date(record.applyEndTime).format('yyyy-MM-dd HH:mm')}`
          }
        }, {
          id: 'opt',
          title: "操作",
          width: 120,
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
      this.$emit('to-detail', ojf)
    },
    refreshTable() {
      this.table.search.ts = +new Date()
    },
  }
}
</script>

