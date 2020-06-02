<template>
  <v-table
    ref="table"
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
import { Dcw } from './types'

export default {
  data() {
    return {
      page: 'LIST',
      table: {
        url: '/table-data/employment/doubleChoose/getDoubleChooseAuditList?ts=',
        search: {
          ts: +new Date(),
          beginTime: '',
          endTime: ''
        },
        columns: [{
          id: 'doubleChooseName',
          title: "双选会名称",
          className: 'text-left',
          width: 150,
          hidden: false,
          search: {
            type: 'input',
            data: {
              placeholer: '',
              autoFocus: false
            }
          },
          formatter: (record) => {
            const dcw = Dcw.fromApi(record)
            return dcw.getNameHtmlWithStatus()
          }
        }, {
          id: 'areaName',
          title: "双选会地点",
          className: 'text-left',
          width: 150,
          hidden: false,
          search: {
            type: 'input',
            data: {
              placeholer: '',
              autoFocus: false
            }
          }
        }, {
          id: 'time',
          title: '双选会时间',
          className: 'text-left line-height-normal',
          width: 145,
          hidden: false,
          hover: false,
          search: {
            type: 'datetime',
            data: {
              placeholder: '双选会',
              dateFormat: 'yyyy-MM-dd hh:ii',
              change: ({ value, target }) => {
                this.table.search.beginTime = this.$refs.table.tableSearchFields['time_start']
                this.table.search.endTime = this.$refs.table.tableSearchFields['time_end']
              }
            }

          },
          formatter(record) {
            return `${new Date(record.beginTime).format('yyyy-MM-dd HH:mm')} ~<br/> ${new Date(record.endTime).format('yyyy-MM-dd HH:mm')}`
          }
        }, {
          id: 'applyTime',
          title: '申请时间',
          className: 'text-left line-height-normal',
          width: 145,
          hidden: false,
          hover: false,
          formatter(record) {
            return `${new Date(record.applyBeginTime).format('yyyy-MM-dd HH:mm')} ~<br/> ${new Date(record.applyEndTime).format('yyyy-MM-dd HH:mm')}`
          }
        }, {
          id: 'opt',
          title: "操作",
          width: 120,
          hidden: false,
          formatter: (record) => {
            const dcw = Dcw.fromApi(record)
            const opts = {
              show: {
                tag: 'a',
                text: '查看',
                callback: (record, index) => {
                  const dcw = Dcw.fromApi(record)
                  this.showDcw(dcw)
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
    showDcw(dcw) {
      this.$emit('to-detail', dcw)
    },
    refreshTable() {
      this.table.search.ts = +new Date()
    },
  }
}
</script>

