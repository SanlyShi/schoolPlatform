<template>
  <div>
    <v-table ref="table" :url="tableUrl" :columns="table.columns" pagesize="20" idField="id" :multiple="false" :order="true" :search="false">
      <div slot="btn-group" class="pull-right">
        <el-button type="primary" size="small" @click="toExport">导出</el-button>
      </div>
    </v-table>
    <preview-resume :user-id="resumePreview.userId" v-if="resumePreview.show" @close="resumePreview.show = false"></preview-resume>
  </div>
</template>

<script>
  import { MessageBox } from 'element-ui'
  import { ResumeCompleteStatus, ResumeCompleteStatusLabel, ResumeType } from './types/dict'
  import api from '../../api/resume'
  import { getColleges } from '../../api/api'
  import PreviewResume from '../../components/previewResume.vue'

  export default {
    components: {
      PreviewResume
    },
    data() {
      return {
        table: {
          url: '/table-data/employment/manage/resume/getResumeCompleteSituationList?ts=',
          search: {
            ts: +new Date(),
            colleges: [],
            completeStatusList: [{ id: '1', text: '已完成' }, { id: '0', text: '未完成' }],
            grades: []
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
        return `${this.table.url}&beginTime=${this.table.search.beginTime || ''}&endTime=${this.table.search.endTime || ''}&ts=${this.table.search.ts}`;
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
      await this.initColleges()
      await this.initGrades()
      this.initTableColumns()
    },
    methods: {
      async initColleges() {
        const { state, message, data } = await getColleges()
        if (state) {
          this.table.search.colleges = data.map(college => {
            return {
              id: college.code,
              text: college.name
            }
          })
        } else {
          this.$toast(message)
        }
      },
      async initGrades() {
        const { state, message, data } = await api.getResumeCompleteGradeList()
        if (state) {
          this.table.search.grades = data.map(grade => {
            return {
              id: grade,
              text: grade
            }
          })
        } else {
          this.$toast(message)
        }
      },
      async initTableColumns() {
        this.table.columns = [
            {
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
              id: 'college',
              title: '学院',
              className: 'text-left',
              width: 100,
              hidden: false,
              formatter: (record) => {
                return record.collegeName
              },
              search: {
                type: 'select',
                data: {
                  placeholer: '学院',
                  autoFocus: false,
                  optionsLabel: 'text',
                  optionsValue: 'id',
                  options: this.table.search.colleges
                }
              }
            }, {
              id: 'grade',
              title: '年级',
              className: 'text-left',
              width: 70,
              hidden: false,
              search: {
                type: 'select',
                data: {
                  optionsLabel: 'text',
                  optionsValue: 'id',
                  options: this.table.search.grades
                }
              }
            }, {
              id: 'completeStat',
              title: '简历完成情况',
              className: 'text-left',
              width: 120,
              hidden: false,
              formatter: (record) => {
                return ResumeCompleteStatusLabel[record.isComplete]
              },
              search: {
                type: 'select',
                data: {
                  placeholer: '简历完成情况',
                  autoFocus: false,
                  optionsLabel: 'text',
                  optionsValue: 'id',
                  options: this.table.search.completeStatusList
                }
              }
            }, {
              id: 'sendTime',
              title: '简历投递次数',
              className: 'text-right',
              width: 120,
              hidden: false
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
                if (record.isComplete == ResumeCompleteStatus.INCOMPLETED) {
                  return []
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
        window.location.href = `/downloads/employment/manage/resume/excelOutResumeCompleteSituation?${this.searchQuerystring}`
      },
      refreshTable() {
        this.table.search.ts = +new Date()
      },
    }
  }
</script>
