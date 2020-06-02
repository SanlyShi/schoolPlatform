<template>
    <div id='techinDetails'>
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
          <i>{{techinDetails.areaDetail?techinDetails.areaDetail:'管理员分配场地'}}</i>
        </li>
        <li v-if="techinDetails.areaType == 'ADMIN_ASSIGNMENT'&&techinDetails.createType == 'COMPANY'">
          <span>场地要求：</span>
          <i>{{techinDetails.areaRequirement}}</i>
        </li>
        <li v-if="techinDetails.areaCategoryName">
          <span>场地类别：</span>
          <i>{{techinDetails.areaCategoryName}}</i>
        </li>
        <li>
          <span>简历接收时间：</span>
          <i v-if="techinDetails.resumeReceiveBeginTime">{{techinDetails.resumeReceiveBeginTime.split(' ')[0] + ' 至 ' +techinDetails.resumeReceiveEndTime.split(' ')[0]}}</i>
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
          <p v-html='techinDetails.recruitmentBrief'></p>
        </div>
      </div>
    </div>


    <position v-if="showDialog"   :showDialog='showDialog' @closeDialog='showDialog = false' :readonly='true' :defaultFormInfo='defaultFormInfo'></position>
    </div>

</template>
<script>
import {getMeetingInfo} from '../../api/techin/api.js'
import position from '../../components/position'
export default {
    props: ['detailsId'],
    components: {
        position,
    },
    data() {
        return {
            techinDetails: {},
            defaultFormInfo:{},
            showDialog:false,
        }
    },
    methods: {
        checkPositionDetails(row) { //职位详情
            this.showDialog = true
            this.defaultFormInfo = row
        },
        getTechinDetails() {
            getMeetingInfo(this.detailsId).then(data => {
                if(data.state) {
                    this.techinDetails = data.data
                    this.$nextTick(() => {
                      this.$emit('closeLoading')
                    })
                }else {
                    this.$message({
                        type: 'error',
                        message: data.message
                    });
                    this.$emit('closeLoading')
                }
            })
        },
    },
    created() {
        this.getTechinDetails()
    }
    
}
</script>
<style scoped lang='less'>
    #techinDetails {
  position:relative;
  background: #fff;
  padding: 30px 0 30px 0;
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
  & .statusBar {
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
          background: url('/static/image/employment/edit.png') no-repeat;
          width: 16px;
          height: 16px;
          margin-right: 5px;
           background-size: contain;
        }
      }
    }
  }
  .summary,.unitInfo  {
    padding: 30px;
    border-top: 1px solid #e7e7e7;
    .content {
      font-weight: bold;
    }
  }
  .sumarryInput {
    margin-top: 20px;
  }
 
}
</style>
<style lang="less">
.positionList {
  padding: 30px 0;
  border-top: 1px solid #e7e7e7;
  .title {
    padding: 0 30px;
  }
    .positionTable {
      margin:30px 0;
      .el-table {
        .cell {
          padding: 0 30px;
          color:#000;
          font-weight: bold;
        }
      }
    }
    .el-table td, .el-table th.is-leaf {
      border-bottom:none;
    }
    .el-table__row {
      td {
        border-top:1px solid #EBEEF5;
      }
    }
  }
</style>