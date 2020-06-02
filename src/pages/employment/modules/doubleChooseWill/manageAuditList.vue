<template>
  <div class="main-content">
    <div v-show="page === 'LIST'">
      <v-table ref="manageAuditTable" :url="tableUrl" :columns="table.columns" pagesize="20" idField="id" :multiple="false" :order="true" :search="false" v-if="role === 'SCHOOL' || !!collegeCode">
        <div slot="btn-group">
          <el-select v-model="collegeCode" placeholder="请选择学院" v-if="role === 'COLLEGE'" filterable>
            <el-option v-for="college in colleges" :key="'college-' + college.id" :label="college.name" :value="college.id">
            </el-option>
          </el-select>
        </div>
      </v-table>
      <div v-else>
        <div class="college-loader" v-loading="loadingColleges" element-loading-text="加载中">{{ loadingColleges ? '' : '您没有分管的学院' }}</div>
      </div>
    </div>
    <unit-apply-detail :id="dcw.id" :dcw-name="dcw.baseInfo.name" :unit-apply-info-id="unitApplyInfoId" :audit-status="auditStatus" @back-to-list="backToList" v-if="page === 'DETAIL'" is-manager></unit-apply-detail>
  </div>
</template>

<script>
  import { Dcw, StandInfo } from './types'
  import { UnitApplyAuditStatus, UnitApplyAuditStatusLabel, UnitApplyAuditStatusOptions, UnitApplyAuditStatusLabelColorType } from './types/dict'
  import { MessageBox } from 'element-ui'
  import UnitApplyDetail from './unitApplyDetail.vue'
  import api from '../../api/doubleChooseWill'

  const DcwRoles = {
    SCHOOL: 'SCHOOL',
    COLLEGE: 'COLLEGE'
  }

  export default {
    components: {
      UnitApplyDetail
    },
    data() {
      return {
        page: 'LIST',
        dcw: new Dcw(),
        role: DcwRoles.SCHOOL,
        colleges: [],
        loadingColleges: true,
        collegeCode: '',
        unitApplyInfoId: null,
        auditStatus: null,
        table: {
          url: '/table-data/employment/audit/getDoubleChooseAuditBySearch?ts=',
          search: {
            ts: +new Date(),
            beginTime: '',
            endTime: ''
          },
          columns: [
            {
              id: 'companyName',
              title: "单位名称",
              className: "text-left",
              width: 100,
              hidden: false,
              search: {
                type: '',
                data: {
                  placeholer: '',
                  autoFocus: false
                }
              }
            }, {
              id: 'doubleChooseName',
              title: "双选会名称",
              className: "text-left",
              width: 100,
              hidden: false,
              search: {
                type: '',
                data: {
                  placeholer: '',
                  autoFocus: false
                }
              }
            }, {
              id: 'time',
              title: '双选会时间',
              className: 'text-left line-height-normal',
              width: 165,
              hidden: false,
              hover: false,
              formatter(record) {
                return `${new Date(record.beginTime).format('yyyy-MM-dd HH:mm')} -<br/> ${new Date(record.endTime).format('yyyy-MM-dd HH:mm')}`
              }
            }, {
              id: 'applyTime',
              title: '单位报名时间',
              className: 'text-left line-height-normal',
              width: 145,
              hidden: false,
              hover: false,
              formatter(record) {
                return `${new Date(record.applyBeginTime).format('yyyy-MM-dd HH:mm')} -<br/> ${new Date(record.applyEndTime).format('yyyy-MM-dd HH:mm')}`
              }
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
              width: 90,
              hidden: false,
              hover: false,
              formatter: (record) => {
                return `<span class="el-tag el-tag--small el-tag--dark el-tag--${UnitApplyAuditStatusLabelColorType[record.status]}">${UnitApplyAuditStatusLabel[record.status]}</span>`
              },
              search: {
                type: 'select',
                data: {
                  placeholer: '审核状态',
                  autoFocus: false,
                  optionsLabel: 'text',
                  optionsValue: 'id',
                  options: UnitApplyAuditStatusOptions.filter(option => ![UnitApplyAuditStatus.COUNTERMAND.toString(), UnitApplyAuditStatus.DISABLED.toString()].includes(option.id)),
                }
              }
            }, {
              id: 'reason',
              title: "审核意见",
              className: 'text-left',
              width: 100,
              hidden: false,
              formatter: (record) => {
                return record.reason || ''
              },
            }, {
              id: 'opt',
              title: "操作",
              width: 120,
              hidden: false,
              formatter: (record) => {
                const opts = {
                  show: {
                    tag: 'a',
                    text: record.status === UnitApplyAuditStatus.AUDITING ? '审核' : '查看',
                    callback: (record, index) => {
                      const dcw = new Dcw()
                      dcw.id = record.doubleChooseId
                      dcw.baseInfo.name = record.doubleChooseName
                      this.toApplyDetail({ unitApplyInfoId: record.id, dcw, auditStatus: parseInt(record.status) })
                    }
                  }
                }
                return [ opts.show ]
              }
            }
          ]
        }
      }
    },
    computed: {
      tableUrl() {
        return `${this.table.url}&major=${this.collegeCode}&beginTime=${this.table.search.beginTime || ''}&endTime=${this.table.search.endTime || ''}&ts=${this.table.search.ts}`;
      }
    },
    async created() {
      this.role = this.$attrs.data && this.$attrs.data.data && this.$attrs.data.data.role || DcwRoles.SCHOOL;
      if (this.role === DcwRoles.COLLEGE) {
        await this.initManagedColleges()
      }
    },
    methods: {
      async initManagedColleges() {
        const result = await api.dcw.getManagedColleges()
        if (result.state) {
          this.colleges = result.data.map(college => ({ id: college.collegeCode, name: college.collegeName }))
          this.loadingColleges = false
          this.collegeCode = this.colleges[0] && this.colleges[0].id
        } else {
          this.$toast(result.message)
        }
      },
      toApplyDetail({ unitApplyInfoId, dcw, auditStatus }) {
        this.dcw = dcw
        this.unitApplyInfoId = unitApplyInfoId
        this.auditStatus = auditStatus
        this.page = 'DETAIL'
      },
      backToList() {
        this.page = 'LIST'
        this.refreshTable()
      },
      refreshTable() {
        this.table.search.ts = +new Date()
      },
    }
  }
</script>

<style lang="less">
@import url("../../styles/styles.less");
.main-content {
  .el-tag--dark.el-tag--success {
    background-color: #66c23b;
    border-color: #66c23b;
  }
  .el-tag--dark.el-tag--danger {
    background-color: #f46d6c;
    border-color: #f46d6c;
  }
  .el-tag--dark.el-tag--warning {
    background-color: #e7a23c;
    border-color: #e7a23c;
  }
}

.college-loader {
  min-height: 300px;
  height: 300px;
  text-align: center;
  padding-top: 100px;
}
</style>

