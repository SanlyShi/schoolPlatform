<template>
    <div id="interviewDetails" :class="[detailsForSearch?'container':'']">
        <!-- <div class="top_back">
            <el-button
                style="color:#666;"
                @click="back"
                type="text"
                icon="el-icon-back" 
               
            >返回</el-button>
        </div> -->
        <div class="details">
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
                        <i v-if="details.beginTime">{{details.beginTime + '~' +details.endTime}}</i>
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
                        <li v-if="details.areaRequirement">
                        <span>场地要求：</span>
                        <i>{{details.areaRequirement}}</i>
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

            <div class="unitInfo">
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
                            <i>{{companyInfo.scale}}</i>
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
    </div>
</template>
<script>
import {getInterInfo2Admin} from '../../api/interview/api.js'
export default {
  props: ['detailsId','props'],
  data() {
    return {
        inheritAttrs:true,
        details: {},
        companyInfo: {},
        detailsForSearch: false,
    };
  },
  methods: {
      back() {
          this.$emit('toSomePage', '/index')
      },
      getDetails() {
          let id 
          if(this.detailsId) {
              id = this.detailsId
          }else {
              id = this.props.id
              this.detailsForSearch = true
          }
          getInterInfo2Admin(id).then(data => {
            if(data.state) {
                this.details = data.data
                this.companyInfo = data.data.companyInfo
                this.$nextTick(() => {
                    this.$emit('closeLoading')
                })
            }else {
                this.$message.error(data.message)
            }
          })
      }
  },
  created() {
      this.getDetails()
  },
};
</script>
<style lang="less" scoped>
#interviewDetails {
    span,i,em {display: inline-block;font-style: normal;}
    .details {
        background: #fff;
    }
    .baseInfo,
  .unitInfo {
    padding: 0 30px;
    .title h1{
        color: #000;
        font-size: 16px;
        margin-bottom: 30px;
        &>span {
          float: left;
          em {
            background:#3e92fe;
            border-radius:8px;
            width:6px;
            height:22px;
            margin-right: 8px;
          }
          i {
            color: #000;
            font-weight: bold;
          }
        }
      }
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
}
</style>
