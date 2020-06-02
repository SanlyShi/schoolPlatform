<template>
  <div>
      <v-table ref="manageListTable" :url="tableUrl" :columns="table.columns" pagesize="20" idField="id" :multiple="false" :order="true" :search="false">
      </v-table>
  </div>
</template>

<script>
  import { MessageBox } from 'element-ui'
  import api from '../../api/onlineJobFair'
  import { Ojf } from './types'
  import { UnitApplyAuditStatus, UnitApplyAuditStatusLabel, UnitApplyAuditStatusLabelBrief, UnitApplyAuditStatusLabelColorType, UnitApplyAuditStatusOptions } from './types/dict'
  export default {
    data() {
      return {
        page: 'LIST',
        ojf: new Ojf(),
        table: {
          url: '/table-data/employment/manage/networkMeeting/getNetworkMeetingAuditList?ts=',
          search: {
            ts: +new Date(),
          },
          columns: [
            {
              id: 'companyName',
              title: "单位名称",
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
              title: "开始时间",
              className: 'text-left',
              width: 145,
              hidden: false,
            }, {
              id: 'endTime',
              title: "结束时间",
              className: 'text-left',
              width: 145,
              hidden: false,
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
                  options: UnitApplyAuditStatusOptions.filter(option => ![UnitApplyAuditStatus.COUNTERMAND.toString()].includes(option.id)),
                }
              }
            }, {
              id: 'auditReason',
              title: "审核意见",
              className: 'text-left',
              width: 100,
              hidden: false,
              formatter: (record) => {
                return record.auditReason || ''
              },
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
                      this.toApplyDetail({ ojfUnitApplyId: record.participantId, ojf: new Ojf({ id: record.id }) })
                    }
                  }
                }
                return [opts.show]
              }
            }
          ]
        }
      }
    },
    computed: {
      tableUrl() {
        return `${this.table.url}&ts=${this.table.search.ts}`;
      }
    },
    methods: {
      backToList({ created } = {}) {
        if (created) {
          this.refreshTable()
        }
        this.page = this.PAGES.LIST
      },
      async toApplyDetail(options) {
        this.$emit('to-apply-detail', Object.assign({}, options, { from: 'LIST' }))
      },
      refreshTable() {
        this.table.search.ts = +new Date()
      },
    }
  }
</script>
