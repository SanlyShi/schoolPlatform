<template>
    <div id="recruit2Index"  v-loading='loading'> 
        <div class="top_back">
            <el-button
                style="color:#666;"
                @click="back"
                type="text"
                icon="el-icon-back" 
               
            >返回</el-button>
        </div>
        <div class="details">
            <div class="top">
                <h2><p>{{recuritDetails.title}}</p><span>{{'在招职位' + recruitmentPositionList.length + '个'}} </span></h2>
            </div>
            <div class="content">
                <div class="contentBox clearfix" style="overflow: inherit;">
                    <!-- <h3><span class="title1">公司详情</span><span>招聘职位</span></h3> -->
                     
                    <div class="contentContainer clearfix">
                    <div class="left">
                        <el-tabs v-model="activeName">
                       <el-tab-pane label="公司详情" name="first">
                         <div class="part">
                        <div class="title">
                            <h1><span><em></em><i>单位简介</i></span></h1>
                        </div>
                        <div class="detais">
                          <div ref="recruitmentSumarry" :class="['instruction',recruitmentSumarryMore?'hideMore':'']" v-html="recuritDetails.summary"></div>
                          <a class="showMore" @click="showMore('sumarry')" v-show="showMoreIcon_sumarry"><span>{{recruitmentSumarryMore?'展开':'收起'}}</span><i></i></a>
                        </div>
                    </div>  
                    <div class="part">
                       <div class="title">
                            <h1><span><em></em><i>招聘简章</i></span></h1>
                        </div>
                        <div class="detais">
                          <div id='recruitmentBrief' ref='recruitmentBrief' :class="['instruction',recruitmentBriefMore?'hideMore':'']" v-html="recuritDetails.recruitmentBrief"></div>
                          <a class="showMore" @click="showMore('brief')" v-show="showMoreIcon_brief"><span>{{recruitmentBriefMore?'展开':'收起'}}</span><i></i></a>
                        </div>
                    </div>
                       </el-tab-pane>
                       <el-tab-pane label="招聘职位" name="second">
                          <div class="part">
                       <div class="title">
                            <h1><span><em></em><i>在招职位</i></span></h1>
                        </div>
                        <div class="detais position">
                          <ul>
                            <li class="box" @click="toRecruitDetails(position.id,position)" v-if="recuritDetails.recruitmentPositionList&&recuritDetails.recruitmentPositionList.length" v-for="(position,index) in recuritDetails.recruitmentPositionList" :key="index">
                              <h1>
                                <p class="name">{{position.positionName}}</p>
                                <span class="address">{{position.workplaceName?position.workplaceName:'暂无详细工作地点'}}</span>
                                
                              </h1>
                              <!-- <h1 :class="[noneCollect?'noneCollect':'']"> -->
                              <h1 style="text-align: right;">
                                <p class="salary">{{position.salaryName?position.salaryName:'暂无详细薪资待遇'}}</p>
                                <span class="date">{{position.issueTime?position.issueTime:'暂无发布日期'}}</span>
                              </h1>
                              <!-- <h1 :class="['collectBox',showCollect?'showCollect':'']">
                                <a><img src="/static/image/employment/like.png" >{{'收藏职位'}}</a>
                                <a><img src="/static/image/employment/like_active.png" >{{'已收藏'}}</a>
                                <a class="apply">申请职位</a>
                              </h1> -->
                            </li>
                          </ul>
                        </div>
                    </div> 
                       </el-tab-pane>
                     </el-tabs>
                    
                    </div>

                    <div class="right">
                      <div class="rightBox">
                        <div class="right-title baseInfo">
                          <h1><span>基本信息</span></h1>
                          <p><i  class="peopleIcon"></i><em :title="recuritDetails.scale">{{recuritDetails.scale}}</em></p>
                          <p><i  class="addressIcon"></i><em :title="recuritDetails.addressDetail">{{recuritDetails.addressDetail}}</em></p>
                        </div>
                      </div>
                      <div class="rightBox">
                        <div class="right-title contact">
                          <h1><span>联系方式</span></h1>
                          <p><i class="contactIcon"></i><em :title="recuritDetails.contactPeople">{{recuritDetails.contactPeople}}</em></p>
                          <p><i class="phoneIcon"></i><em :title="recuritDetails.contactPhone">{{recuritDetails.contactPhone?recuritDetails.contactPhone:'暂无联系人电话'}}</em></p>
                          <p><i class="mailIcon"></i><em :title="recuritDetails.email">{{recuritDetails.email}}</em></p>
                        </div>
                      </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { sAjax } from "../../../assets/utils/utils";
export default {
  props: ["recruitIdFromInfo", "recruitIdFromCollect"], //招聘职位详情查看更多职位
  data() {
    return {
      recuritDetails: {},
      recruitmentPositionList: [],
      recruitmentBriefMore: false, //招聘简章展开查看更多
      showMoreIcon_brief: false,
      recruitmentSumarryMore: false,
      showMoreIcon_sumarry: false,
      loading: true,
      propsId: "",
      noneCollect: false, //hover是否展示收藏  仅有学生
      showCollect: false,
      activeName: "second"
    };
  },
  methods: {
    getRecruitDetails(id) {
      let url = "/api/employment/platform/getRecruitment?recruitmentId=" + id;
      sAjax({
        url: url,
        type: "get",
        success: data => {
          if (data.state) {
            this.recuritDetails = data.data;
            this.recruitmentPositionList = data.data.recruitmentPositionList;
            this.$nextTick(() => {
              let height1 = this.$refs.recruitmentBrief.offsetHeight;
              let height2 = this.$refs.recruitmentSumarry.offsetHeight;
              if (height1 > 120) {
                this.showMoreIcon_brief = true;
                this.recruitmentBriefMore = true;
              } else {
                this.showMoreIcon_brief = false;
                this.recruitmentBriefMore = false;
              }
              if (height2 > 120) {
                this.showMoreIcon_sumarry = true;
                this.recruitmentSumarryMore = true;
              } else {
                this.showMoreIcon_sumarry = false;
                this.recruitmentSumarryMore = false;
              }
              this.loading = false;
            });
          } else {
            this.loading = false;
            this.$message.error("error");
          }
        }
      });
    },
    showMore(type) {
      //展开查看更多
      if (type == "sumarry") {
        this.recruitmentSumarryMore = !this.recruitmentSumarryMore;
      } else {
        this.recruitmentBriefMore = !this.recruitmentBriefMore;
      }
    },
    back() {
      // if(this.$attrs.props.from =='index') {
      if (this.$attrs.data && this.$attrs.data.route == "/student/collect") {
        //内页收藏
        this.$emit("backToCollect");
      } else {
        //首页招聘信息
       
        if (this.$attrs.props && this.$attrs.props.from == "index") {
          this.$emit("toSomePage", "/index");
        }else if(this.$attrs.props && this.$attrs.props.from == "recruitList") {
           this.$emit("toSomePage", "/recruitList2Index");
        }else {
          //返回职位详情
          if (
            this.$attrs.props &&
            !this.$attrs.props.positionId &&
            this.$attrs.props.rootPath
          ) {
            this.$emit("toSomePage", this.$attrs.props.rootPath=='index'?'/index':'/recruitList2Index' );
          } else {
            this.$emit("toSomePage", {
              path: "/recruitmentInfoApply",
              props: {
                positionId: this.$attrs.props.positionId,
                recruitId: this.$attrs.props.recruitId,
                from: this.$attrs.props.from,
                rootPath: this.$attrs.props.rootPath
              }
            });
          }
        }
        // if(this.$attrs&&this.$attrs.curTabName == "recruitment") {

        // }
      }
    },
    toRecruitDetails(id, positionInfo = {}) {
      if (this.$attrs.data && this.$attrs.data.route == "/student/collect") {
        //内页收藏
        this.$emit("toRecruitDetails", positionInfo);
      } else {
        this.$emit("toSomePage", {
          path: "/recruitmentInfoApply",
          props: {
            positionId: id,
            from: "recruit2Index",
            recruitId: this.propsId,
            rootPath: this.$attrs.props.rootPath
          }
        });
      }
    }
  },
  created() {
    // if(this.recruitIdFromInfo) {
    //   this.getRecruitDetails(this.recruitIdFromInfo.recruitmentId)
    // }else {
    // console.log(this.$attrs)
    if (this.$attrs.props) {
      this.propsId = this.$attrs.props.recruitId;
    } else {
      this.propsId = this.recruitIdFromCollect;
    }
    // console.log(this.propsId)
    this.getRecruitDetails(this.propsId);
    if (this.$attrs.userInfo && this.$attrs.userInfo.type == "STUDENT") {
      this.noneCollect = true;
      this.showCollect = true;
    }
    // }
    // console.log(this.$attrs)
  }
};
</script>
<style lang="less" scoped>
#recruit2Index {
  font-size: 14px;
  color: #606266;
  padding: 0 15px;
  i,
  em,
  a,
  span {
    display: inline-block;
    font-style: normal;
  }
  p,
  h1,
  h2,
  h3,
  ul {
    margin: 0;
    padding: 0;
    font-size: 14px;
  }
  li {
    list-style: none;
  }
  h1 {
    margin-top: 20px;
    margin-bottom: 10px;
  }
  .details {
    .top {
      height: 100px;
      background: #fff;
      border-radius: 4px;
      h2 {
        line-height: 1;
        padding: 20px;
        font-size: 22px;
        p {
          color: #298df7;
          line-height: 1;
          margin-bottom: 10px;
        }
        span {
          font-size: 14px;
        }
      }
    }
  }
  .content {
    background: #fff;
    border-radius: 4px;
    margin-top: 20px;
    .box {
      display: flex;
      display: -webkit-box;
      display: -ms-flexbox;
      justify-content: space-between;
      -webkit-box-pack: justify;
      -ms-flex-pack: justify;
     h1 {

     }
    }
    .position {
      .name {
        color: #303133;
        font-size: 18px;
      }
      .salary {
        color: #f16b6c;
        font-size: 18px;
      }
      .address {
        color: #909399;
      }
      .date {
        color: #c0c4cc;
      }
      li {
        border: 1px solid #d9d9d9;
        border-radius: 2px;
        height: 90px;
        padding: 0 15px;
        margin-bottom: 20px;
        cursor: pointer;
        h1 {
          margin: 20px 0 0 0;
          line-height: 1;
          p {
            margin-bottom: 15px;
          }
        }
      }
      .collectBox {
        display: none;
      }
      .showCollect {
      }
      li:hover {
        background: #f3f3f3;
        .noneCollect {
          display: none;
        }
        .collectBox {
          display: block;
        }
        .showCollect {
          display: block;
        }
      }
    }
    .contentBox {
      padding: 20px;
      width: 100%;
      .contentContainer {
        position: relative;
        padding-bottom: 20px;
      }
      .part {
        padding: 0 20px 0 0;
      }
      & > h3 {
        font-size: 18px;
        margin: 0;
        .title1 {
          color: #298df7;
          position: relative;
          margin-right: 44px;
          &:after {
            content: "";
            position: absolute;
            top: -2px;
            right: -22px;
            display: block;
            width: 1px;
            height: 25px;
            background: #e5e5e5;
          }
        }
      }
    }
    .detais {
      position: relative;
    }
    .instruction {
      line-height: 25px;
      max-width: 100%;
      min-height: 120px;
    }
    a.showMore {
      color: #909399;
      position: absolute;
      bottom: -20px;
      right: -30px;
      cursor: pointer;
      span {
        vertical-align: middle;
      }
      i {
        background: url("/static/image/employment/button@2x.png") no-repeat;
        width: 21px;
        height: 19px;
        background-size: contain;
        vertical-align: middle;
      }
    }
    .instruction.hideMore {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 5;
      height: 120px;
    }
    .title {
      h1 {
        color: #000;
        font-size: 16px;
        margin-bottom: 30px;
        & > span {
          em {
            background: #3e92fe;
            border-radius: 8px;
            width: 6px;
            height: 22px;
            margin-right: 8px;
            vertical-align: middle;
          }
          i {
            color: #000;
            font-weight: bold;
            vertical-align: middle;
          }
        }
      }
    }
    .left {
      float: left;
      width: 100%;
      padding-right: 300px;
    }
    .right {
      width: 260px;
      position: absolute;
      height: 100%;
      border-left: #eeeeee;
      box-shadow: -8px 0 4px -4px #eee;
      right: 0;
      top: 0;
      padding-left: 16px;
      .right-title {
        h1 {
          font-size: 14px;
          margin: 0;
          margin-bottom: 30px;
          span {
            position: relative;
            display: block;
            color: #000;
            font-size: 16px;
            &:after {
              content: "";
              display: block;
              position: absolute;
              height: 1px;
              width: 125px;
              background: #e5e5e5;
              top: 50%;
              right: 0;
            }
          }
        }
        p {
          line-height: 1;
          margin-bottom: 30px;
          padding-left: 5px;
        }
        i {
          margin-right: 20px;
          width: 22px;
          height: 22px;
          vertical-align: middle;
        }
        em {
          vertical-align: middle;
          max-width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        i.peopleIcon {
          background: url("/static/image/employment/icon_people@2x.png")
            no-repeat;
          width: 16px;
          height: 12px;
          background-size: contain;
        }
        i.addressIcon {
          background: url("/static/image/employment/icon-city@2x.png") no-repeat;
          background-size: contain;
        }
        i.contactIcon {
          background: url("/static/image/employment/icon-contcat@2x.png")
            no-repeat;
          background-size: contain;
        }
        i.phoneIcon {
          background: url("/static/image/employment/icon-phone@2x.png")
            no-repeat;
          background-size: contain;
        }
        i.mailIcon {
          background: url("/static/image/employment/icon-mail@2x.png") no-repeat;
          background-size: contain;
        }
      }
      .rightBox {
        margin-bottom: 100px;
      }
    }
  }
}
</style>
<style lang="less">
.left {
  .el-tabs__content {
    min-height: 400px;
    overflow: inherit;
    .el-tab-pane {
      max-height: 380px;
      overflow-y: auto;
    }
  }
  .el-tabs__item {
    color: #298df7;
    text-align: center;
    width: 100px;
    padding: 0;
  }
  .el-tabs__item.is-active {
    background: #298df7;
    color: #fff;
    border-radius: 4px 4px 0 0;
  }
  .el-tabs__active-bar {
    display: none;
  }
  .instruction {
    table {
      width: 100%;
    }
  }
}
</style>

