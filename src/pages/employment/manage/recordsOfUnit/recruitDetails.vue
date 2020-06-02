<template>
    <div id="recruitDetails">
        <div class="details">
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
                        <i>{{details.companyName}}</i>
                    </li>
                    <li>
                        <span>单位性质：</span>
                        <i>{{details.property}}</i>
                    </li>
                    </div>
                    <div>
                    <li>
                        <span>单位规模：</span>
                        <i>{{details.scale}}</i>
                    </li>
                    <li>
                        <span>邮箱：</span>
                        <i>{{details.email}}</i>
                    </li>
                    </div>
                    <div>
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
                        <span>单位地址：</span>
                        <i>{{details.addressDetail}}</i>
                    </li>
                    <li class="box">
                        <span>单位简介：</span>
                        <i v-html="details.summary"></i>
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
        <el-table :data="details.recruitmentPositionList" style="width: 100%;">
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
                <p v-html='details.recruitmentBrief'></p>
              </div>
            </div>
          </div>
        </div>
         <position v-if="showDialog" :showDialog='showDialog' @closeDialog='showDialog = false' :readonly='true' :defaultFormInfo='defaultFormInfo'></position>
    </div>
</template>
<script>
import position from '../../components/position'
import { sAjax } from '../../../../assets/utils/utils';
export default {
    props: ['detailsId'],
    components: {
        position,
    },
  data() {
    return {
        details: {},
        showDialog:false,
        defaultFormInfo:{},
    };
  },
  methods: {
    getRecruitDetails() {
        let url = 'api/employment/recruitment/getRecruitment?recruitmentId=' + this.detailsId
        sAjax({
            url: url,
            type:'get',
            success:(data) => {
                if(data.state) {
                    this.details = data.data
                    this.$emit('closeLoading')
                }
            }
        })
    },
    checkPositionDetails(row) { //职位详情
            this.showDialog = true
            this.defaultFormInfo = row
        },
  },
  created() {
      this.getRecruitDetails()
  },
  

};
</script>
<style scoped lang='less'>
#recruitDetails {
  position: relative;
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
    }
  }
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
  .unitInfo {
    padding: 30px;
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
    margin: 30px 0;
    .el-table {
      .cell {
        padding: 0 30px;
        color: #000;
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