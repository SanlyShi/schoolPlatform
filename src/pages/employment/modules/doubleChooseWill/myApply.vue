<template>
  <div id="apply">

    <div class="apply col-sm-12" v-if="page === 'LIST'">
      <div class="applyBox">
        <!-- <div class="back" style="margin-left:0" @click="backToHomePage">
        <i class="el-icon-back"></i>返回
      </div> -->
        <!-- <el-button style="color:#666;" type="text" icon="el-icon-back" @click="backToHomePage">返回</el-button> -->
        <v-table ref="table" :url="tableUrl" :columns="table.columns" idField="id" pagesize="20" :multiple="false" :search="false" :order="true">
        </v-table>
      </div>
    </div>
    <apply-detail class="apply-detail" :id="id" @back-to-list="page = 'LIST'"  v-if="page != 'LIST'"></apply-detail>
  </div>

</template>

<script>

import { Dcw } from './types'
import ApplyDetail from '../../../../pages/employment/modules/teachin/components/applyDetail'
import { request } from '../../../../assets/utils/utils';
export default {
  components: {
    ApplyDetail
  },
  data() {
    return {
      id: null,
      dcwName: null,
      page: 'LIST',
      navList: [{ route: '/recruitmentInfoApply', title: "招聘职位" }, { route: '/techinList2Index', title: '宣讲会' }, { route: '/student/doubleChooseWill/list', title: '双选会' }, { route: '/student/onlineJobFair/list', title: '网招会' }],
      curRoute: '/student/doubleChooseWill/list',
      table: {
        url: '/table-data/employment/preachMeeting/getMyEnrollList?ts=',
        search: {
          ts: +new Date(),
          beginTime: '',
          endTime: ''
        },
        columns: [{
          id: "title",
          title: "宣讲会标题",
          className: "text-left",
          width: 150,
          hidden: false,
          search: {
            type: "input",
            data: {
              placeholer: "",
              autoFocus: false
            }
          }
        }, {
          id: "timeSpace",
          title: "宣讲会时间",
          className: "text-left",
          width: 200,
          hidden: false,
        }, {
          id: "areaName",
          title: "宣讲会场地",
          className: "text-left",
          width: 100,
          hidden: false,
          search: {
            type: "input",
            data: {
              placeholer: "",
              autoFocus: false
            }
          }
        }, {
          id: "opts",
          title: "操作",
        //   className: 'text-center',
          width: 180,
          hidden: false,
          formatter: (record) => {
            let look = {
              tag: "a",
              text: "查看",
              callback: (record, index) => {
                  this.id = record.preachMeetingId
                  this.page = "Detail"
                  
                // this.$emit('toSomePage', { path: '/student/applyDetail', props: { id: record.preachMeetingId, curTab: 'careerTalk',from:'/student/doubleChooseWill/myApply'} });
              }
            }
            let cancel = {
              tag: "a",
              text: "取消报名",
              callback: (record, index) => {
                request(`/api/employment/preachMeeting/cancelEnroll?preachMeetingId=${record.preachMeetingId}`, {}, 'post').then(data => {
                  if (data.state) {
                    //   this.tableUrl = this.tableUrl +'&timeStamp='+new Date().getTime()
                    this.table.search.ts = new Date().getTime()
                    this.$toast("取消成功");
                  } else {
                    this.$toast(data.message);
                  }
                })
              }
            }
            let hasEnd = {
              tag: "a",
              text: "活动已结束"
            }
            let hasDown = {
              tag: "a",
              text: "活动已下架"
            }
            let arr = []
            arr.push(look)
            if (record.status == 'COMMON') {
              arr.push(cancel)
            }
            if (record.status == 'UNDERCARRIAGE') {
              arr.push(hasDown)
            }
            if (record.status == 'END') {
              arr.push(hasEnd)
            }
            return arr
          }        }],
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
      this.$emit('toSomePage', { path: item.route })
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
@import url("../../styles/styles.less");
</style>
<style lang="less">
#apply {
  position: relative;
}
</style>
