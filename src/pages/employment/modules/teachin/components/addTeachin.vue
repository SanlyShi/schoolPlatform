
/**新增双选会模板  */
<template>
  <div id="addTeachin">
    <base-info-edit ref="baseInfoEdit" :placeRule="placeRule" :loginType="loginType"></base-info-edit>

    <!-- 单位信息 -->
    <unit-info-edit ref="unitInfoEdit" :loginType="loginType"></unit-info-edit>

    <!-- 职位信息 -->
    <position-edit ref="positionInfoEdit" :unitList='unitList'></position-edit>

    <!-- 招聘简章 -->
    <div class="sumarry">
      <div class="title clearfix">
        <h1>
          <span>
            <em></em>
            <i>招聘简章</i>
          </span>
        </h1>
      </div>
      <div class="sumarryInput">
        <el-input type="textarea" v-model="sumarry" resize="none" rows="8"></el-input>
      </div>
    </div>
    <div class="submitBtn" >
      <a @click="submit" v-if="loginType.loginType == 'COMPANY'">提交审核</a>
      <a @click="submit" v-if="loginType.isAdmin">提交</a>

    </div>
  </div>
</template>
<script>
  import baseInfoEdit from './baseInfoEdit'
  import unitInfoEdit from './unitInfoEdit'
  import positionEdit from './positionEdit'
  import { getPlaceRules } from '../../../api/placeManage/api'
  import {ScrollTop} from '../../../api/api.js'
  import { sAjax } from '../../../../../assets/utils/utils';
  export default {
    props: ['loginType'],
    data() {
      return {
        placeRule: null,//场地类型 管理员分配或者单位自行分配  
        sumarry:'',//招聘简章
        unitList:[],
      }
    },
    methods: {
      catchPlaceRules() { //获取场地规则
        getPlaceRules('PREACH_MEETING').then(data => {
          if (data.length) {
            this.placeRule = data[0]
            console.log(this.placeRule)
          }
        })
      },
      
      submit() {
        // this.$refs.baseInfoEdit.validate()
        let vali_baseInfo = this.$refs.baseInfoEdit.vali()
        let vali_unitInfo = this.$refs.unitInfoEdit.vali()
        let positionInfo = this.$refs.positionInfoEdit.tableData // 职位列表
        let url
        console.log(positionInfo)
        // if(!vali_baseInfo || !vali_unitInfo) return false
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
            if(this.loginType.loginType == 'COMPANY') {
              url = '/api/employment/preachMeeting/addPreachMeeting'
            }else {
              url = '/api/employment/manage/preachMeeting/addPreachMeeting'
            }
            console.log(obj)
            sAjax({
              url: url,
              type: 'post',
              data: obj,
              success: (info) => {
                if (info.state) {
                  this.$message.success('宣讲会添加成功')
                  this.$emit('backToParent')
                } else {
                  this.$message.error(info.message)
                  this.$emit('backToParent')
                }
              }
            })
          }, 200);
        }
        // else {
        //   this.$message.error('请先将信息填写完整')
        //   ScrollTop(0,50)
        // }
      }
    },
    components: {
      baseInfoEdit,
      unitInfoEdit,
      positionEdit,
      // baseInfo,
      // unitInfo
    },
    created() {
      this.catchPlaceRules()
    }
  }
</script>
<style lang="less" scoped>
#addTeachin {
  background: #fff;
  padding: 30px 0 30px 0;

  & > .statusBar {
    margin-bottom: 30px;
    padding: 0 30px;
    a {
      float: right;
    }
  }
  .sumarry {
    padding: 30px;
    border-top: 1px solid #e7e7e7;
  }
  .submitBtn {
    text-align: center;
  }
  .sumarryInput {
    margin-top: 20px;
  }
}
</style>
<style lang="less">
#addTeachin {
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
}
</style>

