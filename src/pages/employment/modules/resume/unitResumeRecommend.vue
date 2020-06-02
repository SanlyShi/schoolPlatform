<template>
  <div class="main-content">
    <v-table ref="table" :url="tableUrl" :columns="table.columns" pagesize="20" idField="id" :multiple="false" :order="true" :search="false">
      <div slot="btn-group" class="pull-right">
        <el-button type="primary" @click="toExport">批量导出</el-button>
      </div>
    </v-table>
    <preview-resume :user-id="resumePreview.userId" v-if="resumePreview.show" @close="resumePreview.show = false"></preview-resume>
  </div>
</template>

<script>
  import { MessageBox } from 'element-ui'
  import { ResumeType } from './types/dict'
  import { getDict } from '../../api/api'
  import PreviewResume from '../../components/previewResume.vue'

  export default {
    components: {
      PreviewResume
    },
    data() {
      return {
        table: {
          url: '/table-data/employment/resume/getResumeRecommendList?ts=',
          search: {
            ts: +new Date(),
            majors: [],
            educationLevels: []
          },
          columns: []
        },
        resumePreview: {
          show: false,
          userId: null
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
      await Promise.all([
        this.initMajors(),
        this.initEducationLevels()
      ])
      await this.initTableColumns()
    },
    methods: {
      async initMajors() {
        const { state, message, data } = await getDict('专业')
        if (state) {
          this.table.search.majors = data.map(item => {
            return {
              id: item.value,
              text: item.label
            }
          })
        } else {
          this.$toast(message)
        }
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
      async initTableColumns() {
        this.table.columns = [
            {
              id: 'positionName',
              title: '职位',
              className: "text-left",
              width: 100,
              hidden: false,
              search: {
                type: '',
                data: {
                  placeholer: '职位',
                  autoFocus: false
                }
              }
            }, {
              id: 'name',
              title: "姓名",
              className: "text-left",
              width: 100,
              hidden: false,
              search: {
                type: '',
                data: {
                  placeholer: '姓名',
                  autoFocus: false
                }
              }
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
              id: 'major',
              title: '专业',
              className: 'text-left',
              width: 100,
              hidden: false,
              formatter: (record) => {
                return record.majorName
              },
              search: {
                type: 'select',
                data: {
                  placeholer: '专业',
                  autoFocus: false,
                  optionsLabel: 'text',
                  optionsValue: 'id',
                  options: this.table.search.majors
                }
              }
            }
            , {
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
      async showResume(record) {
        if (record.type === ResumeType.FILE) {
          let reg = /<[^>]+>|&[^>]/g // 匹配是否含有html标签
          if (reg.test(record.name)) {
            // 名字里面有标签,转义掉
            record.name = `<xmp>${record.name}</xmp>`
          }
          this.$preview({
            name: record.name + '的简历',
            url: '/downloads/storage/files/'+ record.resumeFile,
            type: 'pdf'
          })
        } else {
          this.resumePreview.userId = record.userId
          this.resumePreview.show = true
        }
      },
      toExport() {
        window.location.href = `/downloads/employment/resume/excelOutResumeRecommend?${this.searchQuerystring}`
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
