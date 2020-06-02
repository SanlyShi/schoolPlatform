<template>
  <v-table
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
import { UnitApplyAuditStatus, UnitApplyAuditStatusLabel, UnitApplyAuditStatusLabelBrief, UnitApplyAuditStatusLabelColorType, UnitApplyAuditStatusOptions } from './types/dict'
import { Ojf } from './types'

export default {
  data() {
    return {
      table: {
        url: '/table-data/employment/networkMeeting/getMyNetworkMeetingList?ts=',
        search: {
          ts: +new Date(),
          beginTime: '',
          endTime: ''
        },
        columns: [{
          id: 'name',
          title: "网招会名称",
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
          id: 'beginTime',
          title: "网招会开始时间",
          className: 'text-left',
          width: 145,
          hidden: false
        }, {
          id: 'createTime',
          title: '提交时间',
          className: 'text-left',
          width: 145,
          hidden: false
        }, {
          id: 'status',
          title: "审核状态",
          className: 'text-left',
          width: 80,
          hidden: false,
          hover: false,
          formatter: (record) => {
            const label = UnitApplyAuditStatusLabelBrief[record.status] || UnitApplyAuditStatusLabel[record.status]
            return `<span class="el-tag el-tag--small el-tag--dark el-tag--${UnitApplyAuditStatusLabelColorType[record.status]}">${label}</span>`
          },
          search: {
            type: 'select',
            data: {
              placeholer: '审核状态',
              autoFocus: false,
              optionsLabel: 'text',
              optionsValue: 'id',
              options: UnitApplyAuditStatusOptions
            }
          }
        }, {
          id: 'auditReason',
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
            const opts = {
              show: {
                tag: 'a',
                text: '查看',
                callback: (record, index) => {
                  this.toApplyDetail({ ojfUnitApplyId: record.participantId, ojf: new Ojf({ id: record.id }), auditReason: record.auditReason })
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
