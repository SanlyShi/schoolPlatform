/**宣讲会详情 */
<template>
  <div class="container">
    <el-button style="color:#666;" type="text" icon="el-icon-back" @click="back">返回</el-button>
    <div id="contentDetails">
      <p class="title">{{contentInfo.title}}</p>
      <p class="time">发布时间：{{contentInfo.releaseTime}}<span style="padding-left:15px">点击次数：{{contentInfo.clickTimes}}</span> </p>
      <!-- <p class="view"></p> -->
      <p class="content" v-html="contentInfo.content"></p>
    </div>
  </div>
</template>
<script>
import baseInfoDetails from '../../teachin/components/baseInfoDetails'
import position from '../../../components/position'
import oplog from '../../../components/oplog'
import addTeachin from '../../teachin/components/addTeachin'
import baseInfoEdit from '../../teachin/components/baseInfoEdit'
import unitInfoEdit from '../../teachin/components/unitInfoEdit'
import positionEdit from '../../teachin/components/positionEdit'
import { getPlaceRules } from '../../../api/placeManage/api'
import { reCallMeeting } from '../../../api/techin/api'
import { getLogInfo } from '../../../api/api'
import { sAjax } from '../../../../../assets/utils/utils';
export default {
  props: {
    props: ""
  },
  data() {
    return {
      contentInfo: "",
      placeRule: {},//场地类型 管理员分配或者单位自行分配  默认数组
      disabledEditPosition: true,//是否能修改职位信息(只有管理员可修改，单位只能查看)
      showDialog: false,//显示职位信息dialog
      defaultFormInfo: {},//默认的职位详情对象
      editStatus: false,//是否是管理员的编辑状态
      status: '',
      statusName: '',
      showLog: false,//是否展示操作日志
      sumarry: '',
      dataUrl: '',
    }
  },
  computed: {
  },
  methods: {
    back() {
      if (this.props.from == 'index') {
        this.$emit('toSomePage', '/index')
      } else {
        if (sessionStorage.getItem('nowListId')) {
          this.$emit('toSomePage', { path: '/contentManageIndex', props: { curTab: 'careerTalk', parentId: sessionStorage.getItem('nowListId') } });
        }
      }
    },
    revise() {//修改
      let vali_baseInfo = this.$refs.baseInfoEdit.vali()
      let vali_unitInfo = this.$refs.unitInfoEdit.vali()
      let positionInfo = this.$refs.positionInfoEdit.tableData // 职位列表
      let url
      if (this.loginType.loginType == 'COMPANY') {
        url = '/api/employment/preachMeeting/updatePreachMeeting'
      } else {
        url = '/api/employment/manage/preachMeeting/updatePreachMeeting'
      }
      if (vali_baseInfo && vali_unitInfo) {  //子组件验证通过
        this.$refs.baseInfoEdit.toSubmit()
        setTimeout(() => {
          let baseInfo = this.$refs.baseInfoEdit.baseInfo
          let unitInfo = this.$refs.unitInfoEdit.unitForm
          let positionInfo = this.$refs.positionInfoEdit.tableData // 职位列表
          console.log(baseInfo)

          let obj = Object.assign({}, baseInfo, unitInfo)
          if (positionInfo) {
            obj.recruitmentPositionVOList = positionInfo
          }
          obj.recruitmentBrief = this.sumarry
          console.log(obj)
          sAjax({
            url: url,
            type: 'post',
            data: obj,
            success: (info) => {
              if (info.state) {
                if (this.loginType.loginType == 'COMPANY') {
                  this.$message.success('提交成功')
                } else {
                  this.$message.success('修改成功')
                }
                this.$emit('backToParent')
              } else {
                this.$message.error(info.message)
                this.$emit('backToParent')
              }
            }
          })
        }, 200);
      }
    },
    catchPlaceRules() {
      getPlaceRules('PREACH_MEETING').then(data => {
        if (data.length) {
          this.placeRule = data[0]
          console.log(this.placeRule)
          this.status = this.contentDetails.status
          this.statusName = this.contentDetails.statusName
        }
      })
    },
    closeDialog() {
      this.showDialog = false
    },
    checkPositionDetails(row) { //职位详情
      this.showDialog = true
      this.defaultFormInfo = row

    },
    editPositionDetails(row) { //删除职位详情（只有管理员可以删除

    },
    editForAdmin() { //管理员状态下编辑宣讲会
      this.editStatus = !this.editStatus
      this.sumarry = this.contentDetails.recruitmentBrief
      console.log(this.sumarry)
    },
    reCall() {
    },
    showOpLog() {  //
      this.showLog = !this.showLog
    }
  },
  components: {
    baseInfoDetails,
    position,
    oplog,
    addTeachin,
    baseInfoEdit,
    unitInfoEdit,
    positionEdit,
  },
  created() {
    sAjax({
      url: "/api/cms/platform/getModuleDetail?id=" + this.props.id,
      type: "get",
      success: data => {
        this.contentInfo = data.data
      }
    });
  }
}
</script>
<style lang="less" scoped>
#contentDetails {
  min-height: 500px;
  .title {
    text-align: center;
    // font-size: 18px;
    font-weight: 500;
    font-size: 24px;
    color: rgba(48, 49, 51, 1);
  }
  .time {
    text-align: center;
    // font-size: 12px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(144, 147, 153, 1);
  }
  .view {
    text-align: right;
    // font-size: 12px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(144, 147, 153, 1);
    padding-right: 9px;
    padding: 0 200px;
  }
  .content {
    padding: 0 200px;
    font-weight: 400;
    color: rgba(48, 49, 51, 1);
    font-size: 14px;
  }
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
          background: url("/static/image/employment/edit.png") no-repeat;
          width: 16px;
          height: 16px;
          margin-right: 5px;
          background-size: contain;
        }
      }
    }
  }
  .summary,
  .unitInfo {
    padding: 30px;
    border-top: 1px solid #e7e7e7;
    .content {
      font-weight: bold;
    }
  }
  .sumarryInput {
    margin-top: 20px;
  }
  .btnGroup {
    text-align: center;
    margin-top: 50px;
    a {
      width: 150px;
      height: 44px;
      line-height: 44px;
      text-align: center;
      border-radius: 4px;
      background: #fff;
      color: #999;
      font-weight: bold;
      margin-right: 30px;
    }
    a.reCall {
      border: 1px solid #979797;
    }
    a.submit {
      background: #3e92fe;
      color: #fff;
    }
  }
  #timeline {
    position: absolute;
    right: -345px;
    z-index: 99;
    top: 80px;
    width: 340px;
    height: 100%;
    -o-transition-duration: 0.5s;
    -webkit-transition-duration: 0.5s;
    -moz-transition-duration: 0.5s;
  }
  #timeline.show {
    right: 0;
  }
}
</style>
<style lang="less">
#contentDetails {
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
}
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
}
.timeline {
  height: 100%;
  & > ul {
    max-height: 90%;
    overflow-y: auto;
    width: 345px;
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
</style>

