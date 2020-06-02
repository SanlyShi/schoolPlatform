<template>
  <div class="main-content">
    <v-table ref="table" :url="tableUrl" :columns="table.columns" pagesize="20" idField="id" :multiple="false" :order="true" :search="false">
      <div slot="btn-group" class="pull-right">
        <el-button type="primary" @click="toExport">批量导出</el-button>
      </div>
    </v-table>
  </div>
</template>

<script>
  import { MessageBox } from 'element-ui'
  import { getDict } from '../../api/api'

  export default {
    components: {
    },
    data() {
      return {
        table: {
          url: '/table-data/employment/resume/getReceiveResumeRecordList?ts=',
          search: {
            ts: +new Date(),
            colleges: [],
            educationLevels: [],
            completeStatusList: [{ id: '1', text: '已完成' }, { id: '0', text: '未完成' }]
          },
          columns: []
        }
      }
    },
    computed: {
      tableUrl() {
        return `${this.table.url}&ts=${this.table.search.ts}`;
      },
      searchQuerystring() {
        if (!this.$refs.tableSearchFields) {
          return ''
        }
        let querystrings = []
        for (let field in this.$refs.tableSearchFields) {
          querystrings.push(`${field}=${this.$refs.tableSearchFields[field]}`)
        }
        return querystrings.join('&')
      }
    },
    async created() {
      this.initTable()
      await this.initEducationLevels()
    },
    methods: {
      async initTable() {
        this.table.columns = [
            {
              id: 'positionName',
              title: "职位",
              className: "text-left",
              width: 200,
              hidden: false,
              search: {
                type: '',
                data: {
                  placeholer: '职位',
                  autoFocus: false
                }
              }
            }, {
              id: 'studentName',
              title: "投递者姓名",
              className: "text-left",
              width: 100,
              hidden: false,
            }, {
              id: 'educationLevel',
              title: '学历',
              className: 'text-left',
              width: 100,
              hidden: false,
              formatter: (record) => {
                return record.educationLevelName
              },
              search: {
                type: 'select',
                data: {
                  placeholer: '学历',
                  autoFocus: false,
                  optionsLabel: 'text',
                  optionsValue: 'id',
                  options: this.table.search.educationLevels
                }
              }
            }, {
              id: 'sendTimeFormat',
              title: "投递者时间",
              className: "text-left",
              width: 145,
              hidden: false,
            }, {
              id: 'opt',
              title: "操作",
              width: 60,
              hidden: false,
              formatter: (record) => {
                const opts = {
                  showResume: {
                    tag: 'a',
                    text: '查看简历',
                    callback: (record, index) => {
                      this.showResume(record)
                    }
                  }
                }
                return [opts.showResume]
              }
            }
          ]
      },
      async initEducationLevels() {
        const { state, message, data } = await getDict('培养层次')
        if (state) {
          this.table.search.educationLevels = data.map(item => {
            return {
              id: item.value,
              text: item.label
            }
          })
        } else {
          this.$toast(message)
        }
      },
      async showResume(record) {
        let reg = /<[^>]+>|&[^>]/g // 匹配是否含有html标签
        if (reg.test(record.resumeName)) {
          // 名字里面有标签,转义掉
          record.resumeName = `<xmp>${record.resumeName}</xmp>`
        }
        this.$preview({
          name: record.resumeName,
          url: '/downloads/storage/files/'+ record.resumeFile,
          type: 'pdf'
        })
      },
      toExport() {
        window.location.href = `/downloads/employment/resume/excelOutReceiveResumeRecord?${this.searchQuerystring}`
      },
      refreshTable() {
        this.table.search.ts = +new Date()
      },
    }
  }
</script>

<style lang="less">
@import url('../../styles/styles.less');
</style>
