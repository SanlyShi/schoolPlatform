<template>
  <div>
    <v-table ref="table" :url="tableUrl" :columns="table.columns" pagesize="20" idField="id" :multiple="false" :order="true" :search="false">
      <div slot="btn-group" class="pull-right">
        <el-button type="primary" size="small" @click="toExport">导出</el-button>
      </div>
    </v-table>
  </div>
</template>

<script>

  export default {
    components: {
    },
    data() {
      return {
        table: {
          url: '/table-data/employment/manage/resume/getResumeSendSituationList?ts=',
          search: {
            ts: +new Date()
          },
          columns: [{
            id: 'companyName',
            title: "单位名称",
            className: "text-left",
            width: 200,
            hidden: false,
            search: {
              type: '',
              data: {
                placeholer: '单位名称',
                autoFocus: false
              }
            }
          }, {
            id: 'receiveResumeCount',
            title: "接受简历数",
            className: "text-right",
            width: 80,
            hidden: false,
          }, {
            id: 'sendResumePeopleCount',
            title: "投递简历人数",
            className: "text-right",
            width: 90,
            hidden: false,
          }]
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
    },
    methods: {
      toExport() {
        window.location.href = `/downloads/employment/manage/resume/excelOutResumeSendSituation?${this.searchQuerystring}`
      },
      refreshTable() {
        this.table.search.ts = +new Date()
      },
    }
  }
</script>
