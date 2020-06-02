<template>
  <div class="main-content">
    <div id="dcwListManage">
      <div v-show="page === PAGES.LIST">
        <v-table ref="manageListTable" :url="tableUrl" :columns="table.columns" pagesize="15" idField="id" :multiple="false" :order="true" :search="false" v-if="role === 'SCHOOL' || !!collegeCode">
          <div slot="btn-group">
            <el-select v-model="collegeCode" placeholder="请选择学院" v-if="role === 'COLLEGE'" filterable>
              <el-option v-for="college in colleges" :key="'college-' + college.id" :label="college.name" :value="college.id">
              </el-option>
            </el-select>
             <el-button class="pull-right" type="primary" @click="downLoad" style="margin-left: 15px;">导出</el-button>
            <el-button class="pull-right" type="primary" @click="toCreateDcw">新增双选会</el-button>
          </div>
        </v-table>
        <div v-else>
          <div class="college-loader" v-loading="loadingColleges" element-loading-text="加载中">{{ loadingColleges ? '' : '您没有分管的学院' }}</div>
        </div>
      </div>
      <new-dcw @back-to-list="backToList" v-if="page === PAGES.NEW" :college-code="collegeCode"></new-dcw>
      <dcw-detail v-bind="dcw" @back-to-list="backToList" v-if="page === PAGES.DETAIL"></dcw-detail>
    </div>
  </div>
</template>

<script>
  import { Dcw, StandInfo, DcwTypes } from './types'
  import { MessageBox } from 'element-ui'
  import DcwDetail from './dcwDetail.vue'
  import NewDcw from './newDcw.vue'
  import api from '../../api/doubleChooseWill'

  const DcwRoles = {
    SCHOOL: 'SCHOOL',
    COLLEGE: 'COLLEGE'
  }

  export default {
    components: {
      NewDcw,
      DcwDetail,
    },
    data() {
      const PAGES = { LIST: 'LIST', NEW: 'NEW', DETAIL: 'DETAIL' }
      return {
        PAGES,
        page: PAGES.LIST,
        dcw: new Dcw(),
        role: DcwRoles.SCHOOL,
        colleges: [],
        loadingColleges: true,
        collegeCode: '',
        table: {
          url: '/table-data/employment/manage/doubleChoose/getBySearch?ts=',
          search: {
            ts: +new Date(),
            beginTime: '',
            endTime: ''
          },
          columns: []
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
      await this.initTableColumns();
      if (this.role === DcwRoles.COLLEGE) {
        await this.initManagedColleges();
      }
    },
    methods: {
      downLoad() {
        var url = "/downloads/employment/manage/doubleChoose/getDoubleChooseExcel";
        window.location.href = url;
      },
      async initTableColumns() {
        this.table.columns.push(...[
          {
            id: 'name',
            title: "双选会名称",
            className: "text-left",
            width: 120,
            hidden: false,
            search: {
              type: '',
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
            title: '双选会地点',
            className: 'text-left',
            width: 120,
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
            title: '时间',
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
                  this.table.search.beginTime = this.$refs.manageListTable.tableSearchFields['time_start']
                  this.table.search.endTime = this.$refs.manageListTable.tableSearchFields['time_end']
                }
              }
            },
            formatter(record) {
              return `${new Date(record.beginTime).format('yyyy-MM-dd HH:mm')} -<br/> ${new Date(record.endTime).format('yyyy-MM-dd HH:mm')}`
            }
          }
        ])
        if (this.role === DcwRoles.SCHOOL) {
          this.table.columns.push({
            id: 'type',
            title: '所属级别',
            className: 'text-left',
            width: 120,
            hidden: false,
            formatter(record) {
              if (parseInt(record.major) === 0) {
                return '校级'
              }
              return record.majorName
            }
          })
        }
        this.table.columns.push({
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
              },
              publish: {
                tag: 'a',
                text: '发布',
                callback: (record, index) => {
                  const dcw = Dcw.fromApi(record)
                  this.publish(dcw)
                }
              },
              setTop: {
                tag: 'a',
                text: '置顶',
                callback: (record, index) => {
                  const dcw = Dcw.fromApi(record)
                  this.changeTop(dcw)
                }
              },
              downTop: {
                tag: 'a',
                text: '取消置顶',
                callback: (record, index) => {
                  const dcw = Dcw.fromApi(record)
                  this.changeTop(dcw)
                }
              },
              unShelve: {
                tag: 'a',
                text: '下架',
                callback: (record, index) => {
                  const dcw = Dcw.fromApi(record)
                  this.unShelve(dcw)
                }
              },
              shelve: {
                tag: 'a',
                text: '上架',
                callback: (record, index) => {
                  const dcw = Dcw.fromApi(record)
                  this.shelve(dcw)
                }
              },
              standArrange: {
                tag: 'a',
                text: '排展管理',
                callback: (record, index) => {
                  const dcw = Dcw.fromApi(record)
                  this.standArrange(dcw)
                }
              }
            }
            const validOpts = [ opts.show ]

            const canManagePublishAndShelve = dcw.type === DcwTypes.SCHOOL || (dcw.type === DcwTypes.COLLEGE && this.role === DcwRoles.COLLEGE);
            if (canManagePublishAndShelve) {
              if (!dcw.published) {
                validOpts.push(opts.publish)
              } else {
                if (!dcw.unShelved) {
                  validOpts.push(opts.unShelve)
                } else {
                  validOpts.push(opts.shelve)
                }
              }
            }

            if (this.role === DcwRoles.SCHOOL) {
              if (!dcw.top) {
                validOpts.push(opts.setTop)
              } else {
                validOpts.push(opts.downTop)
              }
            }
            return validOpts
          }
        })
      },
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
      toCreateDcw() {
        this.dcw = new Dcw()
        this.page = this.PAGES.NEW
      },
      showDcw(dcw) {
        this.dcw = dcw
        this.page = this.PAGES.DETAIL
      },
      async unShelve(dcw) {
        MessageBox.confirm(`是否要下架${dcw.baseInfo.name}`, null, { type: 'warning' }).then(async () => {
          const result = await api.dcw.unShelve(dcw.id)
          if (result.state) {
            this.$toast('下架成功')
            this.refreshTable()
          } else {
            this.$toast(result.message)
          }
        }).catch(() => {})
      },
      async shelve(dcw) {
        const result = await api.dcw.shelve(dcw.id)
        if (result.state) {
          this.$toast('上架成功')
          this.refreshTable()
        } else {
          this.$toast(result.message)
        }
      },
      async changeTop(dcw) {
        const { state, message } = await api.dcw.changeTop(dcw.id)
        if (state) {
          this.refreshTable()
        } else {
          this.$toast(message)
        }
      },
      async publish(dcw) {
        const { state, message } = await api.dcw.publish(dcw.id)
        if (state) {
          this.$toast('发布成功')
          this.refreshTable()
        } else {
          this.$toast(message)
        }
      },
      standArrange(dcw) {

      },
      backToList() {
        this.page = this.PAGES.LIST
        this.refreshTable()
      },
      refreshTable() {
        this.table.search.ts = +new Date()
      },
    }
  }
</script>

<style lang="less">
@import url('../../styles/styles.less');

.college-loader {
  min-height: 300px;
  height: 300px;
  text-align: center;
  padding-top: 100px;
}

</style>
