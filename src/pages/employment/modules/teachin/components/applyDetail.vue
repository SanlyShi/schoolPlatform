<template>
  <div id="applyDetail" :loading='loading'>
    <div class="applyDetail col-sm-12">
      <el-button style="color:#666;" type="text" icon="el-icon-back" @click="back">返回</el-button>
      <div class="" id="details">
        <div class="baseInfo">
          <div class="title clearfix">
            <h1>
              <span>
                <em></em>
                <i>基本信息</i>
              </span>
            </h1>
            <el-button v-if="!techinDetails.isEnroll" type="primary" style="float:right"   @click="_applyClick">报名</el-button>
            <el-button v-else style="float:right"   type="info" plain disabled @click="_applyClick">已报名</el-button>
          </div>
          <ul class="baseInfoList">
            <li>
              <span>宣讲会标题：</span>
              <i>{{techinDetails.title}}</i>
            </li>
            <li>
              <span>所在学校：</span>
              <i>{{techinDetails.schoolName}}</i>
            </li>

            <li>
              <span>宣讲会时间：</span>
              <i>{{techinDetails.beginTime + '~' +techinDetails.endTime}}</i>
            </li>

            <li>
              <span>场地：</span>
              <i>{{techinDetails.areaName||techinDetails.areaDetail}}</i>
            </li>
            <li v-if="techinDetails.areaType == 'ADMIN_ASSIGNMENT'&&techinDetails.createType == 'COMPANY'">
              <span>场地要求：</span>
              <i>{{techinDetails.areaRequirement}}</i>
            </li>
            <li>
              <span>简历接收时间：</span>
              <i v-if="techinDetails.resumeReceiveBeginTime">{{techinDetails.resumeReceiveBeginTime.split(' ')[0] + ' 至 ' +techinDetails.resumeReceiveEndTime.split(' ')[0]}}</i>
            </li>
            <li>
              <span>是否需要现场笔面试：</span>
              <i v-if="techinDetails.needExamination == 1">是</i>
              <i v-else-if="techinDetails.needExamination == 0">否</i>
              <i v-else>未选择</i>
            </li>
          </ul>
        </div>
        <div class="unitInfo">
          <div class="title clearfix">
            <h1>
              <span>
                <em></em>
                <i>单位信息</i>
              </span>
            </h1>
          </div>
          <ul class="baseInfoList unitInfoList">
            <div>
              <li>
                <span>单位名称：</span>
                <i>{{techinDetails.companyName}}</i>
              </li>
              <li>
                <span>单位性质：</span>
                <i>{{techinDetails.property}}</i>
              </li>
            </div>
            <div>
              <li>
                <span>单位规模：</span>
                <i>{{techinDetails.scale}}</i>
              </li>
              <li>
                <span>邮箱：</span>
                <i>{{techinDetails.email}}</i>
              </li>
            </div>
            <div>
              <li>
                <span>单位联系人：</span>
                <i>{{techinDetails.contactPeople}}</i>
              </li>
              <li>
                <span>电话：</span>
                <i>{{techinDetails.contactPhone}}</i>
              </li>
            </div>
            <li>
              <span>单位地址：</span>
              <i>{{techinDetails.addressDetail}}</i>
            </li>
            <li class="box">
              <span>单位简介：</span>
              <i v-html="techinDetails.summary"></i>
            </li>
          </ul>
        </div>
        <!-- //职位列表 -->
        <div class="positionList">
          <div class="title clearfix">
            <h1>
              <span>
                <em></em>
                <i>职位信息</i>
              </span>
            </h1>
          </div>
          <div class="positionTable">
            <el-table :data="techinDetails.recruitmentPositionTableDTOList" style="width: 100%;">
              <el-table-column width="100" type="index" label="#"></el-table-column>
              <el-table-column prop="positionName" label="职位名称"></el-table-column>
              <el-table-column label="职位性质">
                <template slot-scope="scope">
                  <span>{{scope.row.positionProperty=='PRACTICE'?'实习':'全职'}}</span>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click="checkPositionDetails(scope.row)">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <position v-if="showDialog" :showDialog='showDialog' @closeDialog='closeDialog' :readonly='true' :disabledEditPosition='false' :defaultFormInfo='defaultFormInfo'></position>

        <!-- 招聘简章 -->
        <div class="summary">
          <div class="title">
            <h1 class="clearfix">
              <span>
                <em></em>
                <i>招聘简章</i>
              </span>
            </h1>
            <div class="content">
              <span>{{techinDetails.recruitmentBrief}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import { getMeetingInfo2Index } from "../../../api/techin/api";
import position from "../../../components/position";
  import { request } from '../../../../../assets/utils/utils';
export default {
  props: {
      id:''
  },
  components: {
    position
  },
  data() {
    return {
      techinDetails: {},
      showDialog: false,
      disabledEditPosition: true,
      defaultFormInfo: {},
      loading: false,
      navList: [{ route: '/recruitmentInfoApply', title: "招聘职位" }, { route: '/techinList2Index', title: '宣讲会' }, { route: '/student/doubleChooseWill/list', title: '双选会' }, { route: '/student/onlineJobFair/list', title: '网招会' }],
      curRoute: '/techinList2Index',
    };
  },
  computed: {},
  watch: {
    "props.id": function (val) {
      this.getDetails();
    }
  },
  methods: {
    _applyClick() {
      request(`/api/employment/preachMeeting/enrollPreachMeeting?preachMeetingId=${this.techinDetails.id}`, {}, 'post').then(data => {
        if (data.state) {
          this.$toast("报名成功");
        } else {
          this.$toast(data.message);
        }
      })
    },
    addBread(item) {
      this.$emit('toSomePage', { path: item.route })
    },
    getDetails() {
      this.loading = true;
      getMeetingInfo2Index(this.id).then(data => {
        if (data.state) {
          this.techinDetails = data.data;
          this.$nextTick(() => {
            this.loading = false;
          });
        } else {
          this.loading = false;
        }
      });
    },
    back() {
        this.$emit('back-to-list')
    //   if (this.props.from == "index") {
    //     this.$emit("toSomePage", "/index");
    //   } 
    //   else {
    //     this.$emit("toSomePage", "/student/doubleChooseWill/myApply");
    //   }
    },
    closeDialog() {
      this.showDialog = false;
    },
    checkPositionDetails(row) {
      this.showDialog = true;
      this.defaultFormInfo = row;
    }
  },
  created() {
    this.getDetails();
  }
};
</script>
<style lang="less" scoped>
#applyDetail {
  position: relative;
  // overflow: hidden;
  #details {
    background: #fff;
    padding: 30px 20px;
  }
  em,
  span,
  i,
  a {
    display: inline-block;
    vertical-align: middle;
    font-style: normal;
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
  .title {
    h1 {
      color: #000;
      font-size: 16px;
      & > span {
        float: left;
        em {
          background: #3e92fe;
          border-radius: 8px;
          width: 6px;
          height: 22px;
          margin-right: 8px;
        }
        i {
          color: #000;
          font-weight: bold;
        }
      }
      & > a {
        float: right;

        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        i {
          background: url("/static/image/employment/edit.png") no-repeat;
          width: 16px;
          height: 16px;
          margin-right: 10px;
          background-size: contain;
        }
      }
    }
  }
  .baseInfo,
  .unitInfo {
    padding: 0 30px;
    .baseInfoList {
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
  }
  .summary,
  .unitInfo,
  .positionList {
    padding: 30px;
    border-top: 1px solid #e7e7e7;
    .title {
      padding: 0;
    }
    .content {
      font-weight: bold;
      margin-top: 30px;
      padding-left: 20px;
    }
  }
  .sumarryInput {
    margin-top: 20px;
  }
  .box {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
  }
}
</style>
<style lang="less">
#applyDetail .el-form .el-form-item input,
#applyDetail .el-form .el-form-item textarea {
  border: 1px solid #979797;
}
#applyDetail {
}
</style>
