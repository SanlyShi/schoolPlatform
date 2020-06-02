<!--  -->
<template>
  <div class="test-warp" >
    <!-- <div class="v-nav-toggle left-toggle" >
      <v-list id="nav-tree" class="nav-tree" ref="tree" :iconView="false" @addBread='addBread' :items="navList" :curRoute="curRoute"></v-list>
    </div> -->
    <div class="recruitmentInfoApply col-sm-12" v-loading='showRecruit' >
      <div class="titleBtn">
            <el-button style="color:#666;" type="text" icon="el-icon-back" @click="back">返回</el-button>
            <a v-show="!toDetails" class="toPositionList" @click="toPositionList"><i></i><span>切换至招聘信息</span></a>
        </div>
      <!-- <div class="rec-title">
        <div class="title">招聘信息</div>
        <div class="collect" v-show="checkUserInfo&&checkUserInfo.type == 'STUDENT'" @click="getCollected">我的收藏</div>
      </div> -->
      <!-- 筛选条件 -->
      <Applay-details @getRouter='getRouter' v-if="toDetails" @emitSomePage='emitSomePage' @getInfoError='getInfoError' :checkUserInfo="checkUserInfo" :scrollTop='scrollTop' :id="recruitmentInfo.id" :recruitFrom='recruitFrom' :recruitmentInfo="recruitmentInfo" v-bind="$attrs"></Applay-details>
      <div v-show="!toDetails">
        <div class="rec-filtrate">
          <div class="rec-filtrate-input">
            <el-input class="search" placeholder="请输入要搜索的职位或公司" v-model="searchValue" clearable></el-input>
            <el-button class="search-btn" type="primary" icon="el-icon-search" @click="onSearch"></el-button>
          </div>
          <div class="rec-filtrate-item">
            <div class="title">职位性质:</div>
            <div class="radio-item">
              <el-radio-group v-model="nature" @change="natureChange">
                <el-radio label="FULL_TIME">全职</el-radio>
                <el-radio label="PRACTICE">实习</el-radio>
              </el-radio-group>

              <!-- <input v-model="nature" type="radio" name="nature" id="full" value="full">
              <label for="full">全职</label> -->
            </div>
            <div class="radio-item">
              <!-- <input v-model="nature" type="radio" name="nature" id="intern" value="intern">
              <label for="intern">实习</label> -->
            </div>
          </div>
          <div class="rec-filtrate-item seeMore">
            <div class="title">行业分类:</div>
            <el-checkbox-group :class="{'isFlex':showMoreType}" v-model="classificationChecked" :max="3" @change="typeChange">
              <el-checkbox v-for="city in classificationList_slice" :title="city.lebel" :label="city.value" :value="city.label" :key="city.value"><span :title='city.label'>{{city.label}}</span></el-checkbox>
            </el-checkbox-group>
            <div class="checkMore">
              <el-button :icon="showMoreType?'el-icon-arrow-up':'el-icon-arrow-down'" @click="checkMore">{{showMoreType?'收起':'展开更多类型'}}</el-button>
            </div>
          </div>
          <!-- <div class="rec-filtrate-item">
            <div class="title">地区:</div>
            <linkage @getData="getlinkAgeData"></linkage>
          </div> -->
          <div class="rec-filtrate-item">
            <div class="title">发布时间:</div>
            <div class="radio-item">
              <el-radio-group v-model="sendTime" @change="timeChange">
                <el-radio label="0">不限</el-radio>
                <!-- <el-radio label="newest">最新</el-radio> -->
                <el-radio label="1">选择时间段</el-radio>

              </el-radio-group>
              <div class="time" style="display: inline-block;margin-left: 10px;">
                <el-date-picker :disabled='sendTime!="1"' @change='timeRangeChange' format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" v-model="timeRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
              </div>
              <!-- <input v-model="sendTime" type="radio" name="time" id="unlimited" value="unlimited">
              <label for="unlimited">不限</label> -->

            </div>
            <div class="radio-item">
              <!-- <input v-model="sendTime" type="radio" name="time" id="newest" value="newest">
              <label for="newest">最新</label> -->
            </div>
          </div>
        </div>
        <!-- 招聘信息列表 -->
        <div class="recruitmentInfoList" >
          <ul v-if='recruitmentList.length'>
            <li @click="toApplayDetails(item)"  :class='["item"]' v-for="(item, index) in recruitmentList" :key="index">
              <div class="left">
                <div>
                  <span class="job-name">{{item.positionName}}</span>
                  <span class="job-price">{{item.salary}}</span>
                </div>
                <div class="job-address">{{item.workplace == 'null'?'暂无地址信息':item.workplace}}</div>
              </div>
              <div class="right">
                <div class="normal" :class="{'hideInfo': checkUserInfo&&checkUserInfo.type=='STUDENT'}">
                  <div class="job-company">{{item.companyName}}</div>
                  <div class="job-time">{{item.issueTime}}</div>
                </div>
                <div :class="{'hover': checkUserInfo&&checkUserInfo.type=='STUDENT'}" v-show="checkUserInfo&&checkUserInfo.type=='STUDENT'">
                  <img @click.stop.prevent="setCollect(item,false)" v-show='!item.isCollect' class="like" src="/static/image/employment/like.png" alt>
                  <img @click.stop.prevent="setCollect(item,false)" v-show='item.isCollect' class="like" src="/static/image/employment/like_active.png" alt>
                  <span :class="{'active':item.isCollect}" @click.stop.prevent="setCollect(item,false)">{{item.isCollect?'已收藏':'收藏职位'}}</span>
                  <el-button class="apply-btn" type="primary" @click.stop.prevent='apply(item)'>申请职位</el-button>
                </div>
              </div>
            </li>
          </ul>
          <p class="noResult" v-if="!recruitmentList.length">
            暂无招聘信息！
          </p>
        </div>

        <!-- 分页器 -->
        <div class="paginationBox">
          <el-pagination v-if="recruitmentList.length" background layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="15" :total="total">
          </el-pagination>
        </div>

      </div>
    </div>
    <!-- 收藏列表 -->
    <el-dialog class="apply-position" :show-close="false" :visible.sync="showCollect" width="60%" title="收藏列表">
      <ul class="recruitmentInfoList">
        <li class="item" v-for="(item, index) in collectList" :key="index">
          <div class="left">
            <div>
              <span class="job-name">{{item.positionName}}</span>
              <span class="job-price">{{item.salary}}</span>
            </div>
            <div class="job-address">{{item.workplace}}</div>
          </div>
          <div class="right">
            <div class="normal">
              <div class="job-company"><span>{{item.companyName}}</span><i>{{item.issueTime}}</i></div>
              <!-- <div class="job-time"></div> -->
            </div>
            <div class="hover">
              <em @click="setCollect(item,true)">
                <img class="like" src="/static/image/employment/like_active.png" alt>
                <span style="font-style: normal">取消收藏</span>
              </em>
              <el-button class="apply-btn" type="primary">申请这个职位</el-button>
            </div>
          </div>
        </li>
      </ul>
    </el-dialog>

    <!-- 发送简历组件 -->
     <send-resume @addResume='getRouter' @close='closeSendResume' :positionId='curPositionId' v-if="showSendResume"></send-resume>
  </div>
</template>

<script>
import { sAjax } from '../../../assets/utils/utils.js'
import ApplayDetails from './recruitmentInfoApplyDetail'
import linkage from "./linkage";
import sendResume from '../components/sendResume.vue'
export default {
  // props:['recruitId'],
  data() {
    return {
      navList: [{route: '/recruitmentInfoApply',title: "招聘职位"},{route:'/techinList2Index',title: '宣讲会'},{route: '/student/doubleChooseWill/list',title:'双选会'},{route: '/student/onlineJobFair/list',title: '网招会'}],
      curRoute:'/recruitmentInfoApply',
      showSendResume:false,
      curPositionId:'',
      toDetails: false,//是否跳转到招聘详情页
      searchValue: '',
      nature: '', //性质
      sendTime: "", // 发布时间
      timeRange: '',//时间范围
      regionList: [], // 城市地区数据
      recruitmentInfo: {},//传递给招聘职位信息详情的对象
      classificationChecked: [],
      showCollect: false,
      collectList: [],//收藏列表
      showRecruit: true,//招聘列表loading
      classificationList: [],
      classificationList_select: [],//选择的类型
      classificationList_slice: [],//显示不完整类型（未展开
      recruitmentList: [],
      checkUserInfo: null,
      total: 0,//分页器总数
      curPage: 0,//分页器当前页码
      showMoreType: false,
      dataObj: {},//接口参数
      scrollTop:0,//滚动条位置
      recruitFrom:'',
      // pageSize:0,
    };
  },
   beforeCreate() {
    document.querySelector('body').setAttribute('style', 'background-color:#f6f6f8')
  },
  
  methods: {
    toPositionList() {
        this.$emit("toSomePage", {
            path: "/recruitList2Index"
        });
    },
    addBread(item) {
      console.log(item)
      this.$emit('toSomePage',{path: item.route})
    },
     closeSendResume() {
      this.showSendResume = false
    },
    apply(item) {
      this.curPositionId = item.id
      this.showSendResume = true
    },
    emitSomePage(val) {
      console.log(val)
      this.$emit('toSomePage', { path: '/recruit2Index',props: { recruitId: val.recruitId,curTab:'recruitment',positionId:val.positionId,from: val.from,rootPath: val.rootPath}})
    },
    onSearch() {
      // this.ScrollTop(300, 200)
      let url = `/api/employment/platform/getPositionListBySearch?pageSize=15&pageIndex=${this.curPage}`
      
      this.dataObj.keyWord = this.searchValue
      if (this.nature) this.dataObj.positionProperty = this.nature
      sAjax({
        url: url,
        type: 'post',
        data: this.dataObj,
        success: (data) => {
          if (data && data.state) {
            if (data.data && data.data.content && Array.isArray(data.data.content)) {
              this.recruitmentList = []
              this.total = data.data.totalElements
              data.data.content.forEach((info) => {
                 let issueTime = '';
                if(info.issueTime) {
                  issueTime += '发布于';
                  issueTime += info.issueTime.split(' ')[0]
                }
                this.recruitmentList.push({
                  id: info.id,
                  positionName: info.positionName,
                  workplace: info.workplace,
                  companyName: info.companyName,
                  issueTime: issueTime,
                  salary: info.salary,
                  isCollect: info.isCollect,
                  type: info.type
                })
              });
            }
            this.showRecruit = false
          } else {
            this.$message.error('获取招聘列表失败')
            this.showRecruit = false
          }
          this.showRecruit = false
        }
      });
    },
    keyupSubmit() {
      document.onkeydown = e => {
        let _key = window.event.keyCode;
        if (_key === 13) {
          this.onSearch()
        }
      }
    },
    back() {
      console.log(this.$attrs.props)
      // if(!this.$attrs.props) {
      //   this.$emit("toSomePage", "/index");
      //   return 
      // }
      if(this.$attrs.props&&this.$attrs.props.from == 'recruit2Index') {
        this.$emit('toSomePage', { path: '/recruit2Index',props: { recruitId: this.$attrs.props.recruitId,rootPath: this.$attrs.props.rootPath}})
      }else {
         if(this.$attrs.props&&this.$attrs.props.rootPath == 'index') { 
             this.$emit("toSomePage", "/index");
         }else if(this.scrollTop != 0&&this.toDetails){
          this.toDetails=false
          this.ScrollTop(this.scrollTop,200)
          this.scrollTop = 0
         }else {
           this.$emit("toSomePage", "/index");
         }
        
      }
     
    },
    ScrollTop(number = 0, time) {
      if (!time) {
        document.body.scrollTop = document.documentElement.scrollTop = number;
        return number;
      }
      const spacingTime = 20; // 设置循环的间隔时间  值越小消耗性能越高
      let spacingInex = time / spacingTime; // 计算循环的次数
      let nowTop = document.body.scrollTop + document.documentElement.scrollTop; // 获取当前滚动条位置
      let everTop = (number - nowTop) / spacingInex; // 计算每次滑动的距离
      let scrollTimer = setInterval(() => {
        if (spacingInex > 0) {
          spacingInex--;
          this.ScrollTop(nowTop += everTop);
        } else {
          clearInterval(scrollTimer); // 清除计时器
        }
      }, spacingTime)
    },
    //   获取地区数据
    getlinkAgeData(val) {
      this.regionList = val;
    },
    handleCurrentChange(val) {
      this.curPage = val-1
      this.onSearch()
    },
    toApplayDetails(item) { //跳转到招聘信息详情页
      this.scrollTop = document.body.scrollTop || document.documentElement.scrollTop
      this.toDetails = true
      this.recruitmentInfo = item
      this.recruitFrom = item.type
      },
      getCollected() {
        this.$router.push({name:'employment',params: {toPage:'/student/collect'}})
      },
      timeRangeChange(val) {
        if(val) {
         this.dataObj.issueTimeStatus = '1'
         this.dataObj.startTime = val[0] + ' 00:00:00'
         this.dataObj.endTime = val[1] + ' 00:00:00'
       }else {
         this.dataObj.issueTimeStatus = '0'
         delete this.dataObj.startTime
         delete this.dataObj.endTime
       }
       this.onSearch()
      },
      timeChange(val) { //筛选条件 发布时间
        if(val == '0') {  //不限
          this.timeRange = ''
          this.dataObj.issueTimeStatus = '0'
          delete this.dataObj.startTime
          delete this.dataObj.endTime
          this.onSearch()
        }
    },
    natureChange(val) {  //筛选条件 （全职或者实习
      this.onSearch()
    },
    typeChange(val) { //筛选条件 （职业类型 
      if (val.length) {
        // this.classificationList_select = val
        this.dataObj.positionTypes = val
      } else {
        delete this.dataObj.positionTypes
      }
      this.onSearch()
    },
    isToday(time) {
      let today = new Date();
      let theDay = new Date(time);
      if (today.getFullYear() === theDay.getFullYear()
        && today.getMonth() === theDay.getMonth()
        && today.getDate() === theDay.getDate()) {
        return true;
      }
      return false;
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
    setCollect(item, fromCollectList) {   //isCollectList: 是否来自收藏列表
      if (!this.checkUserInfo && this.checkUserInfo.type != "STUDENT") {
        this.$message.error('您还未登录或非学生,暂无权限申请职位')
        this.$router.push('/employment/login')
      }
      let url = ''
      let msg = ''
      let errMsg = ''
      if (item.isCollect) {  //已经是收藏状态 调用取消收藏 
        if (!fromCollectList) {
          url = '/api/employment/collection/cancelCollectByRelationId/' + item.id
        } else {
          url = '/api/employment/collection/cancelCollectByRelationId/' + item.relationId
        }
        sAjax({
          url: url,
          type: 'post',
          success: (data) => {
            if (data.state) {
              if (!fromCollectList) {
                this.onSearch()
              } else {
                this.getCollected()
              }
              this.$message.success('取消收藏成功')
            } else {
              this.$message.error('取消收藏失败')
            }
          }
        })
      } else {
        sAjax({
          url: '/api/employment/collection/addCollection',
          type: 'post',
          data: { relationId: item.id },
          success: (data) => {
            if (data.state) {
              if (!fromCollectList) {
                this.onSearch()
              } else {
                this.getCollected()
              }
              this.$message.success('收藏成功')
            } else {
              this.$message.error('收藏失败')
            }
          }
        })
      }
    },

    getInfoError() {
      this.toDetails = false
    },
    getRouter() {
      this.$router.push({name:'employment',params: {toPage:'/schoolResumepx'}})
    },
    getPositionTypes() { //职业类型字典
      let url = '/api/employment/system/findDictByTypeName?typeName=单位行业'
      sAjax({
        url: url,
        type: 'get',
        success: (data) => {
          if (data.state) {
            this.classificationList = data.data
            this.classificationList_slice = data.data.slice(0, 5)
          }
        }
      })
    },
    checkMore() {  //展开更多分类
      if (!this.showMoreType) {   //已经展开的状态
        this.classificationList_slice = JSON.parse(JSON.stringify(this.classificationList))
        this.showMoreType = true

      } else {
        this.classificationList_slice = JSON.parse(JSON.stringify(this.classificationList)).slice(0, 5)
        this.showMoreType = false
      }
    },
  },
  components: { linkage, ApplayDetails,sendResume },
  created() {
     console.log(this.$attrs)
    if(this.$attrs&&this.$attrs.props&&this.$attrs.props.positionId) {
     this.toDetails = true
     this.recruitType = 'RECRUITMENT'
    }
    this._checkLogin()
    this.onSearch();
    this.keyupSubmit()
    this.getPositionTypes()
  },
};
</script>
<style lang="less">

.isFlex {
  -prefix-box-flex: 1;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -moz-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
}
.recruitmentInfoApply {
  ul {
    padding: 0;
    margin: 0;
    li {
      padding: 0;
      margin: 0;
    }
  }
}
.seeMore {
  position: relative;
  .checkMore {
    position: absolute;
    right: -100px;
    top: 0;
  }
}
.rec-filtrate .rec-filtrate-input {
  .search {
    .el-input__inner {
      height: 100%;
      border-radius: 4px 0 0 4px;
    }
  }
  button {
    border-radius: 0 4px 4px 0;
  }
}
.rec-filtrate-item {
  .radio-item {
    label {
      font-size: 14px;
      padding-left: 10px;
      cursor: pointer;
    }
  }
  .el-checkbox__inner {
    width: 18px;
    height: 18px;
    border-color: #979797;
    border-radius: 4px;
  }
  .el-checkbox__inner::after {
    left: 5px;
    width: 5px;
    height: 10px;
  }
  .el-range-separator {
    width: 8%;
  }
}
.rec-filtrate-item.seeMore {
  .el-checkbox-group .el-checkbox .el-checkbox__label {
    display: inline !important;
  }
}
</style>
<style scoped lang="less">
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
.titleBtn {
   .flex(center, space-between);
}
.toPositionList {
    display: inline-block;
    cursor: pointer;
    float: right;
    color: #666;
    i {
        display: inline-block;
        background: url('/static/image/employment/change.png') no-repeat;
        width: 32px;
        height: 32px;
        background-size: contain;
        vertical-align: middle;
    }
    span {
      vertical-align: middle;
    }
  &:hover {
    text-decoration: none;
    color: #666;
  }
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
.test-warp {
  background: #f6f6f8;
}
.rec-title {
  .flex(center, space-between);
  .wh(100%, 60px);
  padding: 0 20px;
  line-height: 60px;
  font-weight: 500;
  background: #fff;
  border-radius: 4px 0px 4px 4px;
  .title {
    .fs-color(18px, rgba(0, 0, 0, 1));
  }
  .collect {
    .fs-color(16px, rgba(62, 146, 254, 1));
    cursor: pointer;
  }
}
.rec-filtrate {
  padding: 30px;
  background-color: #fff;
  box-sizing: border-box;
  .rec-filtrate-input {
    height: 50px;
    margin: 0 auto 20px auto;
    .flex(center, center);
    .search {
      .wh(836px, 100%);
    }
    .search-btn {
      .wh(111px, 100%);
      font-size: 30px;
    }
  }
  .rec-filtrate-item {
    padding: 10px 0;

    .title {
      width: 100px;
      text-align: right;
      padding-right: 20px;
      .fs-color(16px, #000);
    }
    .radio-item {
      display: inline-block;
      margin-right: 20px;
      cursor: pointer;
    }
  }
  .rec-filtrate-item:not(.seeMore) {
    .flex(center, flex-star);
  }
  .rec-filtrate-item.seeMore {
    margin-right: 100px;
    .flex("", flex-star);
    .el-checkbox {
      width: 200px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      text-align: left;
      margin-bottom: 10px;
    }
    .el-checkbox-group {
      margin-left: 10px;
      -prefix-box-flex: 1;
      -webkit-box-flex: 1;
      -webkit-flex: 1;
      -moz-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
    }
  }
}
.recruitmentInfoList {
  margin-top: 19px;
  min-height: 300px;
  background: #fff;
  ul {
  }
  .noResult {
    text-align: center;
    line-height: 200px;
    font-size: 18px;
    font-weight: bold;
  }
  .item {
    .flex(center, space-between);
    .wh(100%, 112px);
    .fs-color(18px, #000);
    padding: 0 41px;
    background: #fff;
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
    }
    &:hover {
      background: #f3f3f3;
      // span {
      //   display: inline-block;
      //   vertical-align: middle;
      //   color: #999;
      // }
      // .normal {
      //   display: none;
      // }
      .hover {
        display: block;
        text-align: right;
        span {
          vertical-align: middle;
        }
        span.active {
          color: #3E92FE;
        }
      }
      .hideInfo {
        display: none;
      }
      button {
        padding: 0;
        width: 150px;
        height: 50px;
        font-size: 16px;
      }
    }
    .job-price {
      color: #f16b6c;
      padding-left: 30px;
    }
    .job-name {
      font-size: 18px;
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
.test-warp {
  .v-nav-toggle {
    width: 230px;
    position: relative;
    left: 125px;
    top: 20px;
    .v-list {
      box-shadow: none;
      border-radius: 4px;
      .list-group {
        padding: 0;
        border-radius: 5px !important;
      }
    }
    li.curActive_child {
      background: rgb(78, 152, 248);
      border-radius: 0;
      span {
        color: #fff;
      }
    }
    .v-list .list-group-item {
      border-radius: 5px !important;
      margin: 2px;
    }
    .v-list .list-group-item a:hover {
      background: rgb(78, 152, 248);
      border-radius: 5px !important;
      span {
        color: #fff;
      }
    }
  }
}
.paginationBox {
  text-align: right;
  margin: 20px 0;
}
.rec-filtrate {
  .el-radio__input,
  .el-radio__inner {
    width: 16px;
    height: 16px;
  }
  .el-radio__input.is-checked .el-radio__inner {
    background: #fff;
    border-color: #3e92fe;
  }
  .el-radio__inner::after {
    background: #3e92fe;
    width: 10px;
    height: 10px;
  }
}
</style>
