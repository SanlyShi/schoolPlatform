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
  ></v-table>
</template>

<script>
import { UnitApplyAuditStatus, UnitApplyAuditStatusLabel, UnitApplyAuditStatusOptions, UnitApplyAuditStatusLabelColorType } from './types/dict'
import { Dcw } from './types'

export default {
  data() {
    return {
      table: {
        url: '/table-data/employment/doubleChoose/getMyDoubleChooseAuditList?ts=',
        search: {
          ts: +new Date(),
          beginTime: '',
          endTime: ''
        },
        columns: [{
          id: 'doubleChooseName',
          title: "双选会名称",
          className: 'text-left',
          width: 130,
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
          width: 130,
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
          id: 'boothName',
          title: "展位号",
          className: 'text-left',
          width: 100,
          hidden: false,
          formatter: (record) => {
            if (record.boothPOS && record.boothPOS.length) {
              return record.boothPOS.map(booth => booth.name).join(' ')
            }
            if (record.boothChoose == 0) {
              return '等待校方分配'
            }
            return ' '
          }
        }, {
          id: 'auditTime',
          title: "提交时间",
          className: 'text-left',
          width: 140,
          hidden: false,
        }, {
          id: 'status',
          title: "审核状态",
          className: 'text-left',
          width: 90,
          hidden: false,
          hover: false,
          formatter: (record) => {
            return `<span class="el-tag el-tag--small el-tag--dark el-tag--${UnitApplyAuditStatusLabelColorType[record.auditStatus]}">${UnitApplyAuditStatusLabel[record.auditStatus]}</span>`
          },
          search: {
            type: 'select',
            data: {
              placeholer: '审核状态',
              autoFocus: false,
              optionsLabel: 'text',
              optionsValue: 'id',
              options: UnitApplyAuditStatusOptions.filter(option => ![UnitApplyAuditStatus.DISABLED.toString()].includes(option.id)),
            }
          }
        }, {
          id: 'reason',
          title: "审核意见",
          className: 'text-left',
          width: 100,
          hidden: false
        }, {
          id: 'opt',
          title: "操作",
          width: 100,
          hidden: false,
          formatter: (record) => {
            const dcw = Dcw.fromApi(record)
            const opts = {
              show: {
                tag: 'a',
                text: '查看',
                callback: (record, index) => {
                  const dcw = new Dcw()
                  dcw.id = record.doubleChooseId
                  dcw.baseInfo.name = record.name
                  dcw.applied = !!record.isApplied
                  this.toApplyDetail({
                    dcw,
                    unitApplyInfoId: record.id,
                    auditStatus: parseInt(record.auditStatus)
                  })
                }
              }
            }
            return [ opts.show ]
          }
        }],
      },
    }
  },
  computed: {
    tableUrl() {
      return `${this.table.url}&beginTime=${this.table.search.beginTime || ''}&endTime=${this.table.search.endTime || ''}&ts=${this.table.search.ts}`
    }
  },
  methods: {
    toApplyDetail(options) {
      this.$emit('to-apply-detail', options)
    },
    refreshTable() {
      this.table.search.ts = +new Date()
    },
  }
}
</script>
