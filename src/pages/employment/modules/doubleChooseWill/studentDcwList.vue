<template>
  <div id="dcwList">
    
    <div class="dcwList col-sm-12" v-if="page === 'LIST'">
      <div class="dcwListBox">
        <!-- <div class="back" style="margin-left:0" @click="backToHomePage">
        <i class="el-icon-back"></i>返回
      </div> -->
      <el-button
      style="color:#666;"
      type="text"
      icon="el-icon-back"
      @click="backToHomePage"
    >返回</el-button>
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
      </div>
    </div>
     <student-dcw-detail class="student-dcw-detail" :id="id" :dcw-name="dcwName" @back-to-list="page = 'LIST'" from-list v-if="page != 'LIST'"></student-dcw-detail>
  </div>
   
  
</template>

<script>

import { Dcw } from './types'
import StudentDcwDetail from './studentDcwDetail.vue'

export default {
  components: {
    StudentDcwDetail
  },
  data() {
    return {
      id: null,
      dcwName: null,
      page: 'LIST',
      navList: [{route: '/recruitmentInfoApply',title: "招聘职位"},{route:'/techinList2Index',title: '宣讲会'},{route: '/student/doubleChooseWill/list',title:'双选会'},{route: '/student/onlineJobFair/list',title: '网招会'}],
      curRoute:'/student/doubleChooseWill/list',
      table: {
        url: '/table-data/employment/platform/getDoubleChooseListForStudent?ts=',
        search: {
          ts: +new Date(),
          beginTime: '',
          endTime: ''
        },
        columns: [{
          id: 'name',
          title: "双选会名称",
          className: "text-left",
          width: 150,
          hidden: false,
          search: {
            type: '',
            data: {
              placeholer: '双选会名称',
              autoFocus: false
            }
          }
        }, {
          id: 'areaName',
          title: "双选会地点",
          className: "text-left",
          width: 200,
          hidden: false,
          search: {
            type: '',
            data: {
              placeholer: '双选会地点',
              autoFocus: false
            }
          }
        }, {
          id: 'time',
          title: '双选会时间',
          className: 'text-left',
          width: 240,
          hidden: false,
          hover: false,
          formatter: (record) => {
            return Dcw.fromApi(record).getStartTimeHtml()
          },
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
        }, {
          id: 'participantNum',
          title: '参会企业数量',
          className: 'text-right',
          width: 90,
          hidden: false
        }, {
          id: 'opt',
          title: "操作",
          width: 50,
          hidden: false,
          formatter: (record) => {
            const opts = {
              show: {
                tag: 'a',
                text: '查看',
                callback: (record, index) => {
                  this.showDcw(record.id, record.name)
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
    addBread(item) {
      this.$emit('toSomePage',{path: item.route})
    },
    showDcw(dcwId, dcwName) {
      this.id = dcwId
      this.dcwName = dcwName
      this.page = 'DETAIL'
    },
    backToHomePage() {
      this.$emit('toSomePage', '/index')
    },
    refreshTable() {
      this.table.search.ts = +new Date()
    },
  }
}
</script>

<style lang="less" scoped>
@import url('../../styles/styles.less');
</style>
<style lang="less">
#dcwList {
  position: relative;
  

}
</style>
