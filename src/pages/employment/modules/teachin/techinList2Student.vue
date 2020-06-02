<template>
  <div id="techinList2Student" >
    <!-- <div class="v-nav-toggle left-toggle" >
      <v-list id="nav-tree" class="nav-tree" ref="tree" :iconView="false" @addBread='addBread' :items="navList" :curRoute="curRoute"></v-list>
    </div> -->
    <div class="techinList col-sm-12 container">
       <el-button
      style="color:#666;"
      type="text"
      icon="el-icon-back"
      @click="back"
    >返回</el-button>
    <div class="techinList2Student">
      <v-table ref="techinList2Student" :search="false" :url='tableDataUrl' :order='true' :columns="columns" pagesize="15" idField="id">
      </v-table>
    </div>
    <techin-details :loginType='loginType' :techinDetails='techinDetails' @backToParent='backToParent' v-if="curStatus == 'details'"></techin-details>
    </div>
   
  </div>  
</template>
<script>
import {getLoginType ,getMeetingInfo} from '../../api/techin/api'
import techinDetails from './components/techinDetails'
import { sAjax } from '../../../../assets/utils/utils';
export default {
  data() {
    return {
      tableDataUrl: '/table-data/employment/platform/getPreachMeetingListForStudent',
      columns:[],
      loginType: {},
      curStatus:'list',
      techinDetails:{},
      tableData: [],
      // navList: [{route: '/recruitmentInfoApply',title: "招聘职位"},{route:'/techinList2Index',title: '宣讲会'},{route: '/student/doubleChooseWill/list',title:'双选会'},{route: '/student/onlineJobFair/list',title: '网招会'}],
      // curRoute:'/techinList2Index',
    }
  },
  components: {
    techinDetails
  },
  methods: {
    addBread(item) {
      this.$emit('toSomePage',{path: item.route})
    },
    back() {   //返回父页面
      this.$emit('toSomePage', '/index')
    },
  },
  created() {
    this.columns = [{
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
          },{
            id: "companyName",
            title: "单位名称",
            className: "text-left",
            width: 130,
            hidden: false,
            search: {
              type: "input",
              data: {
                placeholer: "",
                autoFocus: false
              }
            }
          },{
            id: "timeSpace",
            title: "宣讲会时间",
            className: "text-left",
            width: 200,
            hidden: false,
          },{
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
          },{
            id: "opts",
            title: "操作",
            width: 50,
            hidden: false,
            formatter: (record) => {
              return [{
                tag: "a",
                text: "查看",
                callback: (record, index) => {
                  this.$emit('toSomePage', { path: '/student/techin/detail', props: { id: record.id,curTab: 'careerTalk'}});
                }
              }]
            }}]
  }
}
</script>
<style lang="less" scoped>
// .techinList {
//   margin: auto;
//   position: absolute;
//   top: 20px;
//   left: 360px;
//   right: 125px;
//   width: auto;
//   min-width: 800px;
//   font-size: 14px;
//   font-weight: 500;
// }
</style>
<style lang="less">
#techinList2Student {
  position: relative;
  // .v-nav-toggle {
  //   width: 230px;
  //   position: relative;
  //   left: 125px;
  //   top: 20px;
  //   .v-list {
  //     box-shadow: none;
  //     border-radius: 4px;
  //     .list-group {
  //       padding: 0;
  //       border-radius: 5px !important;
  //     }
  //   }
  //   li.curActive_child {
  //     background: rgb(78, 152, 248);
  //     border-radius: 0;
  //     span {
  //       color: #fff;
  //     }
  //   }
  //   .v-list .list-group-item {
  //     border-radius: 5px !important;
  //     margin: 2px;
  //   }
  //   .v-list .list-group-item a:hover {
  //     background: rgb(78, 152, 248);
  //     border-radius: 5px !important;
  //     span {
  //       color: #fff;
  //     }
  //   }
  // }
}
</style>



