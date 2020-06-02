<template>
  <div id="contentStudent" class="container">
    <el-button style="color:#666;" type="text"  icon="el-icon-back" @click="back" >返回</el-button>
    <div class="contentStudent">
      <v-table ref="contentStudent" :search="false" :url='tableDataUrl' :order='true' :columns="columns" pagesize="15" idField="id">
      </v-table>
    </div>
    <content-details :loginType='loginType' :contentDetails='contentDetails' @backToParent='backToParent' v-if="curStatus == 'details'"></content-details>
  </div>  
</template>
<script>
import {getLoginType ,getMeetingInfo} from '../../api/techin/api'
import contentDetails from './components/contentDetails'
import { sAjax } from '../../../../assets/utils/utils';
export default {
  props:{
    parentId:"",
    props:""
  },
  data() {
    return {
      tableDataUrl: '/table-data/cms/platform/getHomeModuleMoreList?systemId=298164f6766b42c990dc2a05f02c1d41&parentId='+this.props.parentId,
      columns:[],
      loginType: {},
      curStatus:'list',
      contentDetails:{},
      tableData: [],
      titleS:''
    }
  },
  components: {
    // contentDetails
  },
  methods: {
    back() {   //返回父页面
      this.$emit('toSomePage', '/index')
    },
  },
  created() {
    this.titleS = sessionStorage.getItem('titleS')
    this.columns = [{
            id: "title",
            title: "标题",
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
            id: "releaseTime",
            title: "发布时间",
            className: "text-left",
            width: 130,
            hidden: false,
          },{
            id: "opts",
            title: "操作",
            width: 80,
            hidden: false,
            formatter: (record) => {
              return [{
                tag: "a",
                text: "查看",
                callback: (record, index) => {
                  sessionStorage.setItem("nowListId",this.props.parentId)
                  this.$emit('toSomePage', { path: '/student/content/detail', props: { id: record.id,curTab: 'careerTalk'}});
                }
              }]
            }}]
  }
}
</script>
<style lang="less" scoped>
</style>


