<template>
  <div class="employment-info">

    <!-- 查看更多按钮 -->
    <div class="info-more" @click="getMoreInfo">
      <span>查看更多</span>
      <i></i>
    </div>
    <el-tabs v-model="curTab" @tab-click="getEmploymentInfo">

      <!-- 招聘信息 -->
      <el-tab-pane label="招聘信息" name="recruitment">
        <div class="loading" v-if="loading.recruitmentList">
          <img src="../../../../static/image/employment/loading.gif" alt="">
        </div>
        <div v-else-if="recruitmentList.length === 0">
          暂无招聘信息
        </div>
        <el-row
          v-for="(info, index) in recruitmentList"
          v-bind:key="index"
          gutter="20"
          @click.native="getInfoDetail(info.id)"
          v-else>
          <el-col :span="14">
            <div class="info-title">{{info.title?info.title:'暂无公司名称'}}</div>
          </el-col>
          <el-col :span="6">
            <div class="info-title">{{info.corp}}</div>
          </el-col>
          <el-col :span="4">
            <div class="info-corp"><i>{{info.publish}}</i></div>
          </el-col>
        </el-row>
      </el-tab-pane>

      <!-- 宣讲会 -->
      <el-tab-pane label="宣讲会" name="careerTalk">
        <div class="loading" v-if="loading.careerTalkList">
          <img src="../../../../static/image/employment/loading.gif" alt="">
        </div>
        <div v-else-if="careerTalkList.length === 0">
          暂无宣讲会
        </div>
        <el-row
          v-for="(info, index) in careerTalkList"
          v-bind:key="index"
          gutter="20"
          @click.native="getTechinDetail(info.id)"
          v-else>
          <el-col :span="14">
            <div class="info-title">{{info.title?info.title:'暂无公司名称'}}</div>
          </el-col>
          <el-col :span="6">
            <div class="info-title">{{info.corp}}</div>
          </el-col>
          <el-col :span="4">
            <div class="info-corp"><i>{{info.publish}}</i></div>
          </el-col>
        </el-row>
      </el-tab-pane>

      <!-- 双选会 -->
      <el-tab-pane label="双选会" name="jobFairOnsite">
        <div class="loading" v-if="loading.jobFairOnsiteList">
          <img src="../../../../static/image/employment/loading.gif" alt="">
        </div>
        <div v-else-if="jobFairOnsiteList.length === 0">
          暂无双选会
        </div>
        <el-row
          v-for="(info, index) in jobFairOnsiteList"
          v-bind:key="index"
          gutter="20"
          @click.native="toDcwDetail(info.id, info.title)"
          v-else>
          <el-col :span="20">
            <div class="info-title">{{info.title}}</div>
          </el-col>
          <el-col :span="4">
            <div class="info-corp"><i>{{info.publish}}</i></div>
          </el-col>
        </el-row>
      </el-tab-pane>

      <!-- 网招会 -->
      <el-tab-pane label="网招会" name="jobFairOnline">
        <div class="loading" v-if="loading.jobFairOnlineList">
          <img src="../../../../static/image/employment/loading.gif" alt="">
        </div>
        <div v-else-if="jobFairOnlineList.length === 0">
          暂无网招会
        </div>
        <el-row
          v-for="(info, index) in jobFairOnlineList"
          v-bind:key="index"
          gutter="20"
          @click.native="toOjfDetail(info.id)"
          v-else>
          <el-col :span="20">
            <div class="info-title">{{info.title}}</div>
          </el-col>
          <el-col :span="4">
            <div class="info-corp"><i>{{info.publish}}</i></div>
          </el-col>
        </el-row>
      </el-tab-pane>

      <!-- 笔试面试 -->

    </el-tabs>
  </div>
</template>
<script>
  import { sAjax } from "../../../assets/utils/utils.js";
  import { getLoginType } from '../api/api'
  export default {
    name: 'employmentInfo',
    inheritAttrs: true,
    props: ['content','userInfo',],
    data() {
      return {
        curTab: 'recruitment', // 当前显示tab
        recruitmentList: [], // 招聘信息列表
        careerTalkList: [], // 宣讲会列表
        jobFairOnsiteList: [], // 双选会列表
        jobFairOnlineList: [], // 网招会列表
        loading: {
          recruitmentList: true,
          careerTalkList: true,
          jobFairOnsiteList: true,
          jobFairOnlineList: true
        },
        testList: [], // 笔试面试列表
        checkUserInfo:null,//登录信息
        loginType:null,//登录类型
      }
    },
    methods: {
      /**
       * @description 切换tab
       */
      getEmploymentInfo(tab) {
        this.curTab = tab.name;
        this.getRecruitmentList(tab.name)
      },
      /**
       * @description 获取招聘信息列表
       */
      getRecruitmentList(name) {
        let url = ''
        let dataName = ''
        switch(name) {
        case 'recruitment':
          url ='/api/employment/platform/recruitmentList'
          dataName = 'recruitmentList'
          break;
        case 'careerTalk':
          url= '/api/employment/platform/getPreachMeetingListForStudent'
          dataName = 'careerTalkList'
          break;
        case 'jobFairOnsite':
          url= '/api/employment/platform/getDoubleChooseListForStudent'
          dataName = 'jobFairOnsiteList'
          break;
        case 'jobFairOnline':
          url= '/api/employment/platform/getNetworkMeetingList'
          dataName = 'jobFairOnlineList'
          break;
        case 'examination':

          break;
        default:
          break;
        }
        if(url == '') return
        // if(this[dataName].length) return
        sAjax({
          url: url,
          type: name=='recruitment'?'post':'get',
          data: {
            pageIndex: 0,
            pageSize: 7
          },
          success: (data) => {
            if(data.state) {
              this[dataName] = [];
              // console.log(this[dataName])
              if(data.data && data.data.content && Array.isArray(data.data.content)) {
                switch(name) {
                  case 'recruitment':
                    data.data.content.slice(0,7).forEach((info) => {
                      this[dataName].push({
                        id: info.id,
                        title: info.title,
                        corp: info.companyName,
                        publish: info.issueTime?info.issueTime.split(' ')[0].replace(/-/g, '.'):'暂无发布时间'
                      });
                    });
                    break;
                  case 'careerTalk':
                    data.data.content.forEach((info) => {
                      this[dataName].push({
                        id: info.id,
                        title: info.title,
                        corp: info.companyName,
                        publish: info.beginTime?info.beginTime.split(' ')[0].replace(/-/g, '.'):'暂无时间'
                      });
                    });
                    break;
                  case 'jobFairOnsite':
                    this[dataName] = data.data.content.map(item => {
                      return {
                        id: item.id,
                        title: item.name,
                        publish: item.beginTime ? item.beginTime.split(' ')[0].replace(/-/g, '.') : '暂无时间'
                      }
                    })
                    break;
                  case 'jobFairOnline':
                    this[dataName] = data.data.content.map(item => {
                      return {
                        id: item.id,
                        title: item.name,
                        publish: item.beginTime ? item.beginTime.split(' ')[0].replace(/-/g, '.') : '暂无时间'
                      }
                    })
                    break;
                  case 'examination':

                    break;
                  default:
                    break;
                }
                this.loading[dataName] = false
              }
            }
            else {
              // 获取失败
            }

          }
        })
      },

      /**
       * @description 获取宣讲会列表
       */
      getCareerTalkList() {},

      /**
       * @description 获取双选会列表
       */
      getjobFairOnsiteList() {},

      /**
       * @description 获取网招会列表
       */
      getjobFairOnlineList() {},

      /**
       * @description 获取笔试面试列表
       */
      getTestList() {},

      /**
       * @description 获取此类型的更多信息，查看当前tab对应类型的信息
       */
      getMoreInfo() {
        switch(this.curTab) {
        case 'recruitment':
          this.$emit('toSomePage', {path:'/recruitList2Index',recruitId:null,props: {curTab: 'recruitment',id: null,}});
          break;
        case 'careerTalk':
          console.log("in the click ")
           this.$emit('toSomePage', {path: '/techinList2Index',props: {curTab: 'careerTalk'}});
          break;
        case 'jobFairOnsite':
          this.$emit('toSomePage', { path: '/student/doubleChooseWill/list', props: { curTab: 'jobFairOnsite' }});
          break;
        case 'jobFairOnline':
          this.$emit('toSomePage', { path: '/student/onlineJobFair/list', props: { curTab: 'jobFairOnline' }});
          break;
        case 'examination':
        // this.$router.push({name:'employment',params: {toPage:'/techin/techinList'}})
          break;
        default:
          break;
        }
      },
      catchLoginType() {
        getLoginType().then(data => {
          if(data.state) {
            this.loginType = data.data
            // console.log(this.loginType)
          }else {
            this.loginType = {}
          }
        })
      },
       _checkLogin() {
          //获取登录后的用户信息
          sAjax({
            url: "/login/check",
            type: "get",
            success: data => {
              if (data.state) {
                this.checkUserInfo = data.data;
              } else {
                this.checkUserInfo = null
              }

            }
          });
        },
      /**
       * @description 获取某信息的详情
       */
      getInfoDetail(id) {
         this.$emit('toSomePage', { path: '/recruit2Index',props: { recruitId: id,curTab:'recruitment',from:'index',rootPath:'index'}});
      },
      getTechinDetail(id) {
        this.$emit('toSomePage', { path: '/student/techin/detail', props: { id: id,curTab: 'careerTalk',from:'index'}});
      },
      toOjfDetail(id) {
        this.$emit('toSomePage', { path: '/student/onlineJobFair/detail', props: { id, curTab: 'jobFairOnline' }});
      },
      toDcwDetail(id, name) {
        this.$emit('toSomePage', { path: '/student/doubleChooseWill/detail', props: { id, name ,curTab: 'jobFairOnsite'}});
      }
    },
    created() {
      this.catchLoginType()
      if(this.$attrs.curTabName&&this.$attrs.curTabName != '') {
        this.curTab = this.$attrs.curTabName
        this.getRecruitmentList( this.curTab);
      }else {
        this.getRecruitmentList('recruitment');
      }
    }
  }
</script>

<style lang="less" scoped>
  .employment-info {
    position: relative;
  }
  .loading {
    text-align: center;
    margin-top: 100px;
  }
  .info-more {
    position: absolute;
    top: 4px;
    right: 0;
    z-index: 5;
    padding: 6px;
    color: #606266;
    &:hover {
      cursor: pointer;
      color: #333333;
    }
    span {
      vertical-align: middle;
      display: inline-block;
    }
   i {
     background: url('/static/image/employment/rightArrow.svg') no-repeat;
     width: 16px;
     height: 16px;
     display: inline-block;
     vertical-align: text-bottom;
     background-size: contain;
   }
  }

  .el-row {
    margin-bottom: 17px;
    font-size: 14px;
    color: #999999;
    cursor: pointer;
    &:last-child {
      margin-bottom: 0;
    }
    &:hover {
      color: #333333;
    }
  }
  .info-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .info-corp {
    text-align: right;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    span {
      padding-right: 32px;
    }
    i {
      font-style: normal;
    }
  }
  .info-publish {
    text-align: right;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
<style lang="less">
.employment-info {
  .el-tabs__content {
    min-height: 240px;
  }

}


</style>

