<template>
  <div id="collect" v-loading='loading'>
    <el-button style="color:#666;" @click="curPageName='list';collectTitle='我的收藏'" v-if="curPageName=='details'" type="text" icon="el-icon-back">返回</el-button>
    <!-- <div class="top" v-if="curPageName!='details2Index'">
      <h1>{{collectTitle}}</h1>
    </div> -->
  
    <Applay-details ref="collectDetails" @showRecruit2Index='showRecruit2Index' @getRouter='getRouter' v-if="curPageName=='details'" @getInfoError='getInfoError' :checkUserInfo="userInfo" :recruitmentInfo="collectedDetails"></Applay-details>
  
    <recruit-index v-bind="$attrs" @toRecruitDetails='toRecruitDetails' @backToCollect='backToCollect' v-if="curPageName=='details2Index'" :recruitIdFromCollect='recruitmentId'></recruit-index>
  
   <div v-show="curPageName=='list'">
      <ul class="collectList" v-if="collectList.length">
        <li @click="toCollectedDetails(item)" class="item" v-for="(item, index) in collectList" :key="index">
          <div class="left">
            <div>
              <span class="job-name">{{item.positionName}}</span>
              <span class="job-price">{{item.salary}}</span>
            </div>
            <div class="job-address">{{item.workplace}}</div>
          </div>
          <div class="right">
            <div class="normal">
              <div class="job-company">{{item.companyName}}</div>
              <div class="job-time">{{item.collectionTime?item.collectionTime.split(' ')[0]:''}}</div>
            </div>
            <div class="hover">
              <img @click.stop.prevent="setCollect(item)" class="like" src="/static/image/employment/like_active.png" alt>
              <span>已收藏</span>
              <el-button class="apply-btn" type="primary" @click.stop.prevent="toApply(item)">申请这个职位</el-button>
            </div>
          </div>
        </li>
      </ul>
      <p class="noResult" v-if="!collectList.length">
        暂无收藏记录！
      </p>
      <div class="paginationBox">
        <el-pagination v-if="collectList.length" background layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="collectListTotal">
        </el-pagination>
      </div>
    </div>
     <!-- 发送简历组件 -->
     <send-resume @addResume='getRouter' @close='closeSendResume' :positionId='curPositionId' v-if="showSendResume"></send-resume>
  </div>
</template>
<script>
import { sAjax } from "../../../assets/utils/utils.js"
import ApplayDetails from '../unit/recruitmentInfoApplyDetail'
import recruitIndex from '../unit/recruit2Index'
import sendResume from '../components/sendResume.vue'
export default {
  props: ["userInfo"],
  data() {
    return {
      curPositionId:'',
      showSendResume:false,
      pageSize: 10,// 显示多少条数据
      collectListTotal: 0,//共有多少条数据
      curPage: 0,//分页器当前页码
      tableData_url: '/table-data/employment/collection/list',
      collectTitle: "我的收藏",// 页面标题
      toDetails: false,// 是否显示详情页
      collectList: [],// 收藏列表
      collectedDetails: "",// 收藏详情
      curPageName:'list',
      recruitmentId:'',
      loading: false,
    }
  },
  components: {
    ApplayDetails,
    recruitIndex,
    sendResume
  },
  created() {
    this.getCollected();
  },
  watch: {
    curPage() {
      this.getCollected();
    }
  },
  methods: {
    getRouter() {
      this.$router.push({name:'employment',params: {toPage:'/schoolResumepx'}})
    },
    closeSendResume() {
       this.showSendResume = false
    },
    toApply(item) {  //发送简历
      this.curPositionId = item.relationId
      this.showSendResume = true
    },
    showRecruit2Index() {
      this.curPageName = 'details2Index'
    },
    getRouter(val) {  //跳转至学生简历
      this.$parent.curRoute = '/schoolResumepx'
      // this.$emit('addBread',val)
    },
    backToCollect() {
      this.curPageName = 'list'
    },
    toRecruitDetails(val) {
      this.toCollectedDetails(val)
    },
    handleCurrentChange(val) { // 切换其他页
      this.curPage = val - 1;
    },
    getCollected() {
      this.loading = true
      sAjax({
        // ?pageSize=' + this.pageSize
        url: this.tableData_url,
        type: 'get',
        data: {
          pageSize: this.pageSize,
          pageIndex: this.curPage
        },
        success: (data) => {
          if (data.state && data.data) {
            this.collectList = data.data;
            this.collectListTotal = data.total;
            this.loading = false
          }else {
            this.collectList  = []
             this.collectListTotal = 0
            this.loading = false
          }
        }
      })
    },
    toCollectedDetails(item) { //跳转到招聘信息详情页
      this.collectTitle = '收藏详情'
      this.curPageName = 'details';
      item.id = item.relationId?item.relationId:item.id;
      this.collectedDetails = item;
      this.recruitmentId = item.recruitmentId
      console.log(this.recruitmentId)
    },
    getInfoError() {
      this.curPageName = 'list'
    },
    setCollect(item) {   //isCollectList: 是否来自收藏列表
      if (!this.userInfo && this.userInfo.type == "STUDENT") {
        this.$message.error('您还未登录或非学生,暂无权限申请职位')
        this.$router.push('/employment/login')
      }
      let url = ''
      let msg = ''
      let errMsg = ''
      url = '/api/employment/collection/cancelCollectByRelationId/' + item.relationId
      sAjax({
        url: url,
        type: 'post',
        success: (data) => {
          if (data.state) {
            this.getCollected()
            this.$message.success('取消收藏成功')
          } else {
            this.$message.error('取消收藏失败')
          }
        }
      })
    },
  }
}
</script>
<style lang="less" scoped>
.left {
  overflow: hidden;
}
.right {
  width: 45%;
  max-width: 50%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  
}
.top {
  h1 {
    margin-top:0;
  }
}
.paginationBox {
  text-align: right;
  margin: 20px 0;
}
.flex(@align,@justify) {
  display: flex;
  align-items: @align;
  justify-content: @justify;
}
.wh(@w,@h) {
  width: @w;
  height: @h;
}
.fs-color(@size,@color) {
  font-size: @size;
  color: @color;
}
#collect {
  margin-left: 20px;
  padding: 20px 0;
}
.noResult {
  text-align: center;
  line-height: 200px;
  font-size: 18px;
  font-weight: bold;
}
.collectList {
  border-radius: 4px;
  background-color: #fff;
  padding: 0;
  .item {
    .flex(center, space-between);
    .wh(100%, 112px);
    .fs-color(18px, #000);
    padding: 0 41px;
    border-bottom: 1px solid rgba(231, 231, 231, 1);
    cursor: pointer;
    .hover {
      display: none;
      .like {
        .wh(24px, 23px);
      }
      .apply-btn {
        margin-left: 30px;
      }
      span {
        vertical-align: middle;
      }
    }
    &:hover {
      background: rgba(231, 231, 231, 1);
      .normal {
        display: none;
      }
      .hover {
        display: block;
        text-align: right;
      }
    }
    .job-price {
      color: #f16b6c;
      padding-left: 30px;
    }
   .job-address {
      margin-top: 22px;
      color: #999;
      font-size: 14px;
      font-weight: bold;
       max-width: 90%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .job-company {
      text-align: right;
    }
    .job-time {
      .fs-color(14px, #999999);
      margin-top: 22px;
      text-align: right;
    }
  }
}
</style>
<style lang="less">
#collect {
  #recruit2Index {
    width: 100%;
  }
  .contentBox  {
  background: #fff!important;
  }
  #sendResume {
    width:100%;
  }
}
</style>
