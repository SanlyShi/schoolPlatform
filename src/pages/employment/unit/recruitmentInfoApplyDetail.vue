<!--  -->

<template>
  <div
    class="recruitmentInfoApplyDetail"
    v-loading.fullscreen.lock="sendFileLoading"
    element-loading-text="正在发送简历"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)"
  >
    <div id="recruitmentInfoApplyDetail" v-loading.fullscreen.lock="loading">
    <div class="rec-header-warp">
      <!-- <el-button
        style="color:#666;"
        @click="back"
        type="text"
        icon="el-icon-back" 
      >返回</el-button> -->
      <div class="rec-header">
        <div>
          <div
            class="title"
          >{{recruitmentDetails.positionName}} | {{recruitmentDetails.positionProperty == "PRACTICE"?'实习':'全职'}}</div>
          <div class="price">{{recruitmentDetails.salaryName}}</div>
          <div
            class="other"
          >{{recruitmentDetails.workplaceName}} | {{recruitmentDetails.positionTypeName}}</div>
        </div>
        <div class="custom-btns" v-show="checkUserInfo&&checkUserInfo.type == 'STUDENT'">
          <el-button
            @click="collect(false)"
            class="collect custom"
            plain
            v-if="!recruitmentDetails.isCollect"
          >
            <div class="custom-icon">
              <img class="like" src="/static/image/employment/like.png" alt> 收藏职位
            </div>
          </el-button>
          <el-button
            @click="collect(true)"
            class="collect custom collected"
            plain
            v-if="recruitmentDetails.isCollect"
          >
            <div class="custom-icon">
              <img class="like" src="/static/image/employment/like_active.png" alt> 已收藏
            </div>
          </el-button>
          <el-button @click="apply" class="custom" type="primary">申请职位</el-button>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="left">
        <div class="title">
          <img class="icon" src="/static/image/employment/major.png" alt>
          <h6 class="h">专业要求</h6>
        </div>
        <ul>
          <li><pre>{{recruitmentDetails.majorName?recruitmentDetails.majorName:'暂无专业要求'}}</pre></li>
        </ul>
        <div class="title">
          <img class="icon" src="/static/image/employment/things.png" alt>
          <h6 class="h">岗位职责</h6>
        </div>
        <ul>
          <li><pre>{{recruitmentDetails.positionRemarks?recruitmentDetails.positionRemarks:'暂无岗位职责'}}</pre></li>
        </ul>
        <div class="title">
          <img class="icon" src="/static/image/employment/todo.png" alt>
          <h6 class="h">招聘要求</h6>
        </div>
        <ul>
          <li><pre>{{recruitmentDetails.positionRequire?recruitmentDetails.positionRequire:'暂无招聘要求'}}</pre></li>
        </ul>
        <div class="title">
          <img class="icon" src="/static/image/employment/jianzhang.png" alt>
          <h6 class="h">招聘简章</h6>
        </div>
        <ul>
          <li><pre v-html="recruitmentDetails.recruitmentBrief?recruitmentDetails.recruitmentBrief:'暂无招聘简章'"></pre></li>
        </ul>
      </div>
      <div class="right">
        <!-- <img class="logo" src="/static/image/employment/jiuye.png" alt> -->
        <i class="company"></i>
        <h6 class="company-title">{{recruitmentDetails.companyName}}</h6>
        <div class="title right-item">
          <!-- <img class="icon" src="/static/image/employment/group.png" alt> -->
          <i class="group"></i>
          <span>{{recruitmentDetails.scaleName}}</span>
        </div>
        <div class="right-item">
          联系人：
          <span class="value">{{recruitmentDetails.contactPeople}}</span>
        </div>
        <div class="right-item">
          联系电话：
          <span class="value">{{recruitmentDetails.contactPhone}}</span>
        </div>
        <div class="right-item">
          邮箱：
          <span class="value">{{recruitmentDetails.email}}</span>
        </div>
        <div class="introduction-title right-item">公司简介：</div>
        <div class="introduction" v-html='recruitmentDetails.summary'></div>
        <el-button class="look-more" plain @click="checkMore">查看公司更多职位</el-button>
      </div>
    </div>
  </div>
    <!-- 简历预览 发送组件 -->
      <send-resume @addResume='toAddResume' @close='closeSendResume' :positionId='curPositionId' v-if="showSendResume"></send-resume>
  </div>
</template>

<script>
  import { sAjax } from "../../../assets/utils/utils";
  // import html2Canvas from "html2canvas";
  // import JsPDF from "jspdf";
  import sendResume from '../components/sendResume.vue'
  export default {
    props: ["recruitmentInfo", "checkUserInfo",'recruitFrom','data'],
    components: {
      sendResume
    },
    data() {
      return {
        inheritAttrs: true,
        fileName: "",
        recruitmentDetails: {},
        collectList: [], //收藏列表
        showCollect: false, //是否展示收藏列表
        onApplyPositionModal: false,
        hasResume: false, //是否有简历
        resumenInfo: {}, //简历信息
        resumenName: "",
        curUserInfo: {},
        hasCollect: false, //是否已经收藏了该职位
        showPreview: false,
        resumeData: {}, //根据userId获取的学生简历信息
        sendFileLoading: false,//发送简历时间比较长，需要loading
        recruitType: 'ONLINE',//发送或者预览简历的类型
        loading: true,
        sendPreview: false,
        fromWhere:'',
        curPositionId:'',
        showSendResume: false,
        // recruitFromByParent:'',//招聘来源
      };
    },
    beforeCreate() {
      document.querySelector('body').setAttribute('style', 'background-color:#f6f6f8')
    },
    // beforeDestroy() {
    //   document.querySelector('body').removeAttribute('style')
    // },
    methods: {
      checkMore() {
        // console.log(this.recruitmentInfo.recruitmentId)
        if(this.$parent.collectTitle) { //内页收藏
          this.$emit('showRecruit2Index')
        }else {
          let obj = {
            recruitId: this.recruitmentDetails.recruitmentId,
            positionId: this.recruitmentDetails.id,
            from: this.fromWhere,
          }
          if(this.$attrs.props) {
            obj.rootPath = this.$attrs.props.rootPath
          }
          this.$emit('emitSomePage',obj)
        }
        
      }, 
      getDetails(id,type) {
        // let url = '/api/employment/recruitment/getPositionById?id=' + this.recruitmentInfo.id
        let url 
          if(!this.recruitFrom) this.recruitFrom = 'RECRUITMENT'
          url ="/api/employment/platform/getPositionById?id=" + id + '&type='+ this.recruitFrom
        // }
        
        sAjax({
          url: url,
          type: "get",
          success: data => {
            if (data.state) {
              this.recruitmentDetails = data.data;
              console.log(data.data)
              this.loading = false
              // this.resumenName = data.data.resumeFileName
            } else {
              // this.$message.error("获取职位信息失败,请重新获取");
              this.loading = false
              // this.$emit("getInfoError", "false");
              
            }
          }
        });
        let top = document.body.scrollTop || document.documentElement.scrollTop
        top = 0
      },
      closeSendResume() {
        this.showSendResume = false
      },
      apply() {
        //申请职位
        this.showSendResume = true
      },
      collect(isCollect) {
        //收藏职位
        if (!this.checkUserInfo && this.checkUserInfo.type != "STUDENT") {
          //未登录状态
          this.$message.error("您还未登录或非学生,暂无权限申请职位");
          // this.$router.push('/employment/login')
        } else {
          if (!isCollect) {
            sAjax({
              url: "/api/employment/collection/addCollection",
              type: "post",
              data: { relationId: this.recruitmentDetails.id },
              success: data => {
                if (data.state) {
                  this.$message.success("收藏成功");
                  this.recruitmentDetails.isCollect = true;
                } else {
                  this.$message.error("收藏失败");
                  // this.recruitmentDetails.isCollect = null
                }
              }
            });
          } else {
            sAjax({
              url:
                "/api/employment/collection/cancelCollectByRelationId/" +
                this.recruitmentDetails.id,
              type: 'post',
              success: data => {
                if (data.state) {
                  this.$message.success("取消收藏成功");
                  this.recruitmentDetails.isCollect = false;
                } else {
                  this.$message.error("取消收藏失败");
                }
              }
            });
          }
        }
      },
      toAddResume() {
        // this.passCData()
        this.$emit('getRouter')  //触发收藏页面还有招聘列表父组件的跳转路由事件
        //跳转新增简历
      },
      fileNameChange(event) {
        this.fileName = event.target.files[0].name;
      },
      onApplyPosition() {
      },


    },
    created() {
      console.log(this.$attrs)
      if(this.$attrs.props&&this.$attrs.props.from) {
        this.fromWhere = this.$attrs.props.from
      }else {
        this.fromWhere = 'recruitmentList'
      }
      if(this.$attrs.props&&this.$attrs.props.positionId) {
        this.getDetails(this.$attrs.props.positionId,'fromRecruit2Index')
        this.curPositionId = this.$attrs.props.positionId
      }else {
         this.getDetails(this.recruitmentInfo.id)
         this.curPositionId = this.recruitmentInfo.id
      }
       
    }
  };
</script>
<style lang="less">
.rec-header .collect {
  span {
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      margin-right: 10px;
    }
  }
}
.apply-position .el-dialog__body {
  padding: 10px 20px;
}
.hasResume {
  .dialog-footer {
  display: flex;
  margin-top: 20px;
  .dialog-footer-button {
    width: 152px;
    height: 50px;
    margin: 0 auto;
  }
}
}

.online_cantEdit {
  .top {
    margin-bottom: 30px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    // border:
    .userImg,
    img {
      width: 115px;
      height: 115px;
    }
  }
  .bottom {
    .list {
      margin-bottom: 30px;
      h1 {
        color: #3e92fe;
        font-size: 18px;
        margin-bottom: 23px;
        span {
          color: #666666;
          text-align: left;
        }
      }
    }
  }
  .userInfo {
    position: relative;
    width: 80%;
    padding-left: 30px;
    & > p {
      font-size: 24px;
    }
    .userInfo_details {
      position: absolute;
      bottom: 0;
      & > div {
        line-height: 1;
      }
      span {
        display: inline-block;
      }
      i {
        vertical-align: middle;
        display: inline-block;
      }
      i.sexy {
        width: 17px;
        height: 15px;
        background: url("../../../../static/image/employment/sexy.png")
          no-repeat;
      }
      i.phone {
        width: 12px;
        height: 16px;
        background: url("../../../../static/image/employment/phone.png")
          no-repeat;
      }
      i.age {
        width: 17px;
        height: 15px;
        background: url("../../../../static/image/employment/age.png") no-repeat;
      }
      i.edu {
        width: 16px;
        height: 14px;
        background: url("../../../../static/image/employment/edu.png") no-repeat;
      }
      i.mail {
        width: 16px;
        height: 13px;
        background: url("../../../../static/image/employment/mail.png")
          no-repeat;
      }
      i.address {
        width: 16px;
        height: 17px;
        background: url("../../../../static/image/employment/address.png")
          no-repeat;
      }
      p {
        display: inline-block;
        line-height: 1;
        margin: 0;
        vertical-align: middle;
        span {
          font-size: 16px;
          margin-left: 5px;
          vertical-align: middle;
          color: #6c6c6c;
        }
      }
      em {
        width: 1px;
        height: 15px;
        background: #ddd;
        margin: 0 30px;
        vertical-align: middle;
      }
      div.userInfo_details_bottom {
        margin-top: 15px;
      }
    }
  }
}
.attachment-detail {
  overflow: auto;
}
.hasResume .el-button--default:hover,.hasResume .el-button--default{
  background: #fff;
  border: 1px solid #ddd;
}

// .sendPreview {
//   opacity: 0!important;
// }
.introduction,.main li pre {
  width: 100%;
  img {
    width: 100%;
  }
}
</style>
<style scoped lang="less">
.test-warp {
  background: #fff;
}
.hasResume {
  margin-bottom: 20px;
}
@default-color: #b3b3b3;
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
#recruitmentInfoApplyDetail {
  padding-bottom: 20px;
}
.recruitmentInfoApplyDetail {
  width: 100%;
  font-size: 14px;
  font-weight: 500;
  color: @default-color;
  background-color: #fff;
}
.rec-header-warp {
  width: 100%;
  background: rgba(62, 146, 254, 0.05);
  .rec-header {
    .flex(center, space-between);
    .wh(80%, 176px);
    margin: 0 auto;
    .custom {
      .wh(151px, 50px);
      font-size: 16px;
      .custom-icon {
        .flex(center, center);
      }
      .like {
        display: block;
        .wh(22px, 21px);
      }
    }
    .custom-btns {
      .flex(center, center);
      button {
        background: #3E92FE;
      }
      button.collect  {
        border-color: #3E92FE;
        background: #fff;
        color: #3E92FE;
      }
    }

    .title {
      .fs-color(24px, #000);
    }
    .price {
      margin: 20px 0;
      .fs-color(18px, #f36d6d);
    }
  }
}
.main {
  .flex(flex-start, space-between);
  width: 80%;
  margin: 40px auto 0 auto;
  .title {
    .flex(center, flex-star);
    .icon {
      .wh(22px, 21px);
      margin-right: 10px;
    }
    .h {
      .fs-color(16px, #000);
    }
  }
  .right {
    width: 48%;
  }
  .left {
    padding-right: 20px;
    width: 50%;
    ul {
      padding: 0;
      margin: 0 0 30px 40px;
    }
    li {
      margin: 15px 0;
      list-style-type: none;
      pre {
        display: inline-block;
        background: #fff;
        color: #b3b3b3;
        padding: 0;
        font-size: 14px;
        border: none;
        line-height: 30px;
        font-family:'Helvetica Neue",Helvetica,Arial,sans-serif';
        white-space: pre-wrap; 
        white-space: -moz-pre-wrap; 
        white-space: -pre-wrap; 
        white-space: -o-pre-wrap; 
        word-wrap: break-word; 
      }
    }
  }
  .right {
    .logo {
      .wh(66px, 49px);
    }
    i {
      display: inline-block;
    }
    .company-title {
      .fs-color(16px, #000);
    }
    i.company {
      background: url('/static/image/employment/company_1.png') no-repeat;
      width: 64px;
      height: 64px;
      background-size: contain;
      
    }
    i.group {
      background: url('/static/image/employment/group_1.png') no-repeat;
      width: 24px;
      height: 24px;
      background-size: contain;
      margin-right: 10px;
    }
    .title {
      color: @default-color;
    }
    .introduction {
      width: 305px;
      line-height: 30px;
    }
    .value {
      color: #000;
    }
    .right-item {
      margin: 8px 0;
    }
    .introduction-title {
      margin: 8px 0;
    }
    .look-more {
      .wh(305px, 49px);
      margin-top: 27px;
    }
  }
}
.fileinput-button {
  width: 100%;
  height: 40px;
  margin-bottom: 20px;
  input {
    border: 1px solid #979797;
    width: 100%;
    outline: none;
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
    padding-left: 20px;
    border-radius: 4px;
  }
}

.position-modal-header {
  .flex(center, space-between);
}
.fileinput-button-warp {
  .flex(center, center);
  flex-direction: column;
  .time {
    width: 100%;
    text-align: left;
  }
}
// li {
//   list-style-type: none;
// }
</style>
