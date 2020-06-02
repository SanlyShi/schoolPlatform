
/**笔面试详情  */
<template>
  <div id="details">
    <div class="statusBar box">
      <p>
        <span :class="{'default':status==0,'error':status==2||status==5}">{{statusName}}</span>
      </p>
      <h3>
        <a @click="showLog = !showLog">操作日志</a>
        <div class="pull-right" v-if="loginType.loginType == 'COMPANY'">
          <a v-if="status==5 || status==3 || status==1" @click="edit"><i></i><em>{{editStatus?'取消编辑':'编辑'}}</em></a>
        </div>
        <div class="pull-right" v-if="loginType.loginType !='COMPANY'">
          <a v-if="status == 1 ||status == 0 " @click="edit"><i></i><em>{{editStatus?'取消编辑':'编辑'}}</em></a>
        </div>
        <!-- <a @click="editForAdmin" v-if="(loginType.loginType == 'COMPANY'&&status=='5') || (loginType.isAdmin&&status!='1')"><i></i><em>编辑</em></a> -->

      </h3>
    </div>

    <!-- 笔面试详情信息  -->
   <div v-if="!editStatus">
    <div class="baseInfo">
      <div class="title clearfix">
        <h1>
          <span>
            <em></em>
            <i>基本信息</i>
          </span>
        </h1>
      </div>
      <ul class="baseInfoList">
        <li>
          <span>笔/面试标题：</span>
          <i>{{details.title}}</i>
        </li>
        <li>
        <li>
          <span>类型：</span>
          <i>{{details.type == 'WRITTEN'?'笔试':'面试'}}</i>
        </li>

        <li>
          <span>笔试面试时间：</span>
          <i>{{details.beginTime + '~' +details.endTime}}</i>
        </li>
        <li>
          <span>笔试面试场地：</span>
          <!-- <i>{{details.areaType == "COMPANY_CHOOSE"?details.areaName:details.areaDetail}}</i> -->
          <i>{{details.areaDetail?details.areaDetail:'管理员分配场地'}}</i>
          
        </li>
        <li v-if="details.areaCategoryName">
          <span>场地类别：</span>
          <i>{{details.areaCategoryName}}</i>
        </li>
        <li class="areaExplain" v-if="details.areaType == 'ADMIN_ASSIGNMENT'">
          <el-collapse accordion>
               <el-collapse-item>
                <template slot="title">
                <span class="title"><em>笔面试场地说明：</em></span>
                </template>
               <div class="content" v-html="details.areaExplain"></div>
               </el-collapse-item>
            </el-collapse>
        </li>
        <li v-if="details.areaDescription">
          <span>场地要求：</span>
          <i v-html="details.areaDescription"></i>
        </li>
        <div class="box" v-if="details.createType == 'COMPANY'">
          <li>
            <span>单位联系人：</span>
            <i>{{details.contactPeople}}</i>
          </li>
          <li>
            <span>电话：</span>
            <i>{{details.contactPhone}}</i>
          </li>
        </div>
        <li>
          <span>邮箱：</span>
          <i>{{details.email}}</i>
        </li>
      </ul>
    </div>

    <!-- 管理员查看笔面试详情 -->  
    <div class="unitInfo" v-if="loginType.loginType != 'COMPANY'">
      <div class="title ">
        <h1 class="clearfix">
          <span>
            <em></em>
            <i>单位信息</i>
          </span>
        </h1>
        <ul class="baseInfoList unitInfoList">
        <div>
          <li>
            <span>单位名称：</span>
            <i>{{companyInfo.companyName}}</i>
          </li>
          <li>
            <span>单位性质：</span>
            <i>{{companyInfo.propertyName}}</i>
          </li>
        </div>
        <div>
          <li>
            <span>单位规模：</span>
            <i>{{companyInfo.scaleName}}</i>
          </li>
          <li>
            <span>邮箱：</span>
            <i>{{companyInfo.mailAddress}}</i>
          </li>
        </div>
        <div>
          <li>
            <span>单位联系人：</span>
            <i>{{companyInfo.contactPeople}}</i>
          </li>
          <li>
            <span>电话：</span>
            <i>{{companyInfo.contactPhone}}</i>
          </li>
        </div>
        <li>
          <span>单位地址：</span>
          <i>{{companyInfo.addressDetail}}</i>
        </li>
        <li class="box">
          <span>单位简介：</span>
          <i v-html="companyInfo.summary"></i>
        </li>
      </ul>
      </div>
    </div>
   </div>


    





    <!-- 编辑笔面试 -->
    <div v-if="editStatus&&loginType.loginType == 'COMPANY'">
      <edit-interview-of-unit :placeRule='placeRule' @backToParent="backToParent" :defaultInfo='details'></edit-interview-of-unit>
    </div>

    <div v-if="editStatus&&loginType.isAdmin">
      <edit-interview-of-admin :placeRule='placeRule' @backToParent="backToParent" :defaultInfo='details'></edit-interview-of-admin>
    </div>

    

    <div class="btnGroup" v-if="loginType.loginType == 'COMPANY'">
      <a class="reCall default" @click="recall" v-if="status == 0">撤回</a>
      <!-- <a class="submit default" v-if="(status == 5&&editStatus) || (status == 3&&editStatus)">重新提交</a> -->
    </div>

    <!-- 管理员 -->
    <div class="btnGroup" v-if="loginType.isAdmin">
        
    </div>

    <!-- 操纵日志 -->
    <div id="timeline" :class="{'show':showLog}">
      <oplog :dataUrl='dataUrl'></oplog>
    </div>
  </div>
</template>
<script>
  import { interviewDetails2Unit, reCallInterview,getInterInfo2Admin } from '../../../api/interview/api'
  import editInterviewOfUnit from './addInterviewOfUnit'
  import editInterviewOfAdmin from './addInterviewOfAdmin'
  import oplog from '../../../components/oplog'
  export default {
    props: ['loginType', 'interviewId','placeRule'],
    components: {
      oplog,
      editInterviewOfUnit,
      editInterviewOfAdmin
    },
    // computed: {
    //   dataUrl: function () {
    //     return '/api/employment/manage/examination/getOperationDetailList?id=' + this.interviewId
    //   },
    // },
      data() {
        return {
          details:{},
          status: '',//笔面试状态码
          editStatus: false,
          statusName: '',
          showLog: false,
          companyInfo:{},//单位信息
          dataUrl:'',
        }
      },
      methods: {
        catchDetails() {  //笔面试详情信息
          // 区分单位和管理员
          if(this.loginType.loginType == 'COMPANY') {
              interviewDetails2Unit(this.interviewId).then(data => {
                if(data.state) {
                  this.details = data.data
                  this.companyInfo = data.data.companyInfo
                  console.log(this.details)
                  this.status = this.details.status
                  this.statusName = this.details.statusName
                }
              })
          }else {
            getInterInfo2Admin(this.interviewId).then(data => {
              if(data.state) {
                this.details = data.data
                this.companyInfo = data.data.companyInfo
                console.log(this.details)
                this.status = this.details.status
                this.statusName = this.details.statusName
              }
            })
          }
          this.dataUrl =  '/api/employment/manage/examination/getOperationDetailList?id=' + this.interviewId + '&time=' + new Date().getTime()
          
        },
        recall() {
          this.$confirm('撤回会释放占用的场地,是否继续撤回?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            reCallInterview(this.details.id).then(data => {
              if (data.state) {
                this.$message.success('撤回成功')
                this.details.status = 3
                this.statusName = '已撤回'
                this.status = 3
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消撤回'
            }); 
          });
          
        },
         edit() { //管理员状态下编辑宣讲会
          this.editStatus = !this.editStatus
        },
        backToParent() {
          this.$emit('backToParent')
        }
      },
      created() {
        this.catchDetails()
        console.log(this.details)
      }
    }
</script>
<style lang="less" scoped>
#details {
  position: relative;
  background: #fff;
  padding: 30px 0;
  overflow: hidden;
  em,
  span,
  i,
  a {
    display: inline-block;
    vertical-align: middle;
  }
  a {
    color: #3e92fe;
    font-weight: bold;
    cursor: pointer;
  }
  h1,
  h2,
  h3 {
    margin: 0;
  }
  
  .baseInfo,
  .unitInfo {
    padding: 0 30px;
    .baseInfoList,.unitInfoList {
      padding: 0;
      margin: 30px 0;
      li {
        list-style: none;
        margin-bottom: 24px;
        span {
          color: #666;
          font-weight: bold;
          min-width: 130px;
          margin-right: 28px;
          text-align: right;
        }
        i {
          color: #000;
          font-weight: bold;
        }
      }
    }
    .unitInfoList {
      div {
        li {
          width: 40%;
          display: inline-block;
        }
      }
    }
    
    .box {
      li {
        width: 40%;
      }
    }
  }
  .unitInfo {
    padding: 30px;
    border-top: 1px solid #e7e7e7;
  }
  .btnGroup {
    a.default {
      color: #fff;
    }
  }
  .statusBar {
    margin-bottom: 30px;
    padding: 0 30px;
    justify-content: space-between;
    span {
      color: #666;
      font-weight: bold;
    }
    span.error {
      color: #f56c6c;
    }
    span.default {
      color: #3e92fe;
    }
    h3 {
      float: right;
      display: inline-block;
      a {
        font-size: 14px;
        margin-right: 10px;
        i {
          background: url("/static/image/employment/edit.png") no-repeat;
          width: 16px;
          height: 16px;
          margin-right: 5px;
           background-size: contain;
        }
      }
    }
  }
  .usablePlace {
    position: relative;
    background: #f6f6f8;
    padding: 20px;
    border-radius: 4px;
    max-width: 60%;
    h2 {
      font-size: 14px;
      color: #666;
      margin-bottom: 12px;
    }
    em {
      position: absolute;
      top: -8px;
      left: 100px;
      width: 0;
      height: 0;
      border-right: 10px solid transparent;
      border-left: 10px solid transparent;
      border-bottom: 10px solid #f6f6f8;
    }
  }
   #timeline {
   position: absolute;
    right: -345px;
    z-index: 99;
    top: 80px;
    width: 340px;
    height: 100%;
    -o-transition-duration: .5s;
    -webkit-transition-duration: .5s;
    -moz-transition-duration: .5s;
 }
  #timeline.show {
    right: 0;
  } 
}
</style>
<style lang="less">
#timeline {
  .timeline {
  height:100%;
 &> ul {
   max-height:90%;
   overflow-y:auto;
   width:345px;
   padding: 5px;
   li {
     .el-timeline-item__node--normal {
       width: 16px;
       height: 16px;
       background: #3e92fe;
       left: -3px;
     }
   }
 }
 .el-timeline-item__content {
   width: 280px;
 }
}
}
.baseInfo {
.areaExplain {
  margin-bottom: 22px;
  span.title {
    display: inline-block;
    text-align: right;
    font-weight: bold;
    color: #666;
    
  }
  .el-collapse-item__arrow.is-active {
    transform: rotate(90deg)!important;
  }
  .el-collapse {
    border: none;
  }
  .content {
    padding-left: 170px;
    color: #666;
  }
  div.el-collapse-item__header {
    width:220px;
    border: none;
  }
  table {
    td {
      border: 1px solid #666;
    }
  }
}
}
</style>


