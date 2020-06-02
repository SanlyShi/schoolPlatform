/**管理员新增笔面试     默认是管理员分配场地 */
<template>
  <div id="addInterview">
    <div class="baseInfo">
      <h1 class="clearfix title"><span><em></em><i>基本信息</i></span><a>操作日志</a></h1>
      <div class="baseForm">
        <el-form :model="baseInfo" ref="baseForm" :rules="baseInfoRules"  label-width="150px">
          <el-form-item prop="title" label="笔/面试标题：">
            <el-input v-model="baseInfo.title"></el-input>
          </el-form-item>
          <el-form-item prop="type" label="类型：">
              <el-radio-group v-model="baseInfo.type">
                  <el-radio :label="3">笔试</el-radio>
                  <el-radio :label="6">面试</el-radio>
              </el-radio-group>
          </el-form-item>
          <el-form-item prop="date" label="笔/面试时间：">
            <v-datepicker class="datePicker" format="yyyy-MM-dd"  :clearButton="false" v-model="baseInfo.date">

            </v-datepicker>
          </el-form-item>
          <el-form-item prop="place" label="笔/面试地点：">
            <el-input v-model="baseInfo.place"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="unitInfo">
      <h1 class="clearfix title"><span><em></em><i>单位信息</i></span></h1>
      <div class="unitForm">
        <el-form :model="unitInfo" :rules="unitInfoRules" label-width="150px" ref="unitInfo">  
          <div>
            <el-form-item label="单位名称：">
              <el-input v-model="unitInfo.name"></el-input>
            </el-form-item>
            <el-form-item label="单位性质："><span></span></el-form-item>
          </div>
          <div>
            <el-form-item label="单位联系人：">
              <el-input v-model="unitInfo.phone"></el-input>
            </el-form-item>
            <el-form-item label="单位规模："><span></span></el-form-item> 
          </div>
          <div>
            <el-form-item label="电话：">
              <el-input v-model="unitInfo.phone"></el-input>
            </el-form-item>
            <el-form-item label="邮箱：" prop="mail">
              <el-input v-model="unitInfo.mail"></el-input>
            </el-form-item>
          </div>
          <div class="w100"> 
              <el-form-item label="单位地址：">
              <span>福建省厦门市</span>
            </el-form-item>
          </div>
          <div class="w100">
            <el-form-item label="单位简介：" prop='summary'>
              <span>福建省厦门市</span>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>

      <div class="formBtn">
        <a class="publish">发布</a>
      </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      baseInfo: {
        title: '',
        type:'',
        date:'',
        place: '',
      },
      baseInfoRules: {
        title: [{required: true,message:'请填写笔/面试标题',trigger:'blur'}],
        // type:[{}]
      },
      unitInfo: {
        name: '',
        concat:'',
        phone:'',
        mail:'',
      },
      unitInfoRules: {
        mail: [{required: true,message:'请输入单位邮箱',trigger:'blur'},{type:'email',message:'请输入正确格式的邮箱',trigger:'blur'}],
        summary:[{required:true,message:'请输入单位简介',trigger:'blur'}]
      }
      
    }
  }
}
</script>
<style lang="less" scoped>
#addInterview {
  background: #fff;
  padding-bottom: 50px;
  em,span,i,a {display: inline-block;vertical-align: middle;}
  h1,h2,h3,p{margin: 0;}
  h1.title {
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
        &>a {
          float: right;
          color: #3e92fe;
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
          i {
            background: url('/static/image/employment/edit.png') no-repeat;
            width: 16px;
            height: 16px;
            margin-right: 10px;
            background-size: contain;
          }
        }
      }
  .baseInfo,.unitInfo {
    border-bottom: 1px solid #e7e7e7;
    padding: 30px;
  }
  .unitInfo {
    border: none;
  }
  .formBtn {
      text-align: center;
      a {
        width: 150px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        border: 1px solid #3e92fe;
        color: #fff;
        font-size: 16px;
        background: #3e92fe;
        border-radius: 4px;
        cursor: pointer;
      }
    }
}
</style>
<style lang="less">
.baseForm {
  .el-input__inner {
  }
  .el-form-item__label {
    margin: 0;
    padding-right: 30px;
  }
  .el-radio-group {
    &>label {
      margin-right: 50px;
    }
      .el-radio__input.is-checked .el-radio__inner {
        background: #fff;
        &:after {
          width: 10px;
          height: 10px;
          background: #3e92fe;
        }
      }
      .el-radio__inner {
        width: 16px;
        height: 16px;
      }
      .el-radio__input.is-checked+.el-radio__label,.el-radio__label  {
        color: #000;
        font-weight: bold;
      }
    }
    .datePicker {
      height: 40px;
      .form-control {
        height: 40px;
        line-height: 40px;
        padding: 0 15px;
        border: 1px solid #979797;
        &:hover {
          border: 1px solid #979797;
        }
      }
      
      .v-datepicker-icon {
        top: 4px;
      }
    }
  .el-form-item {
    width: 40%;
    min-width: 500px;
  }
}
.unitForm {
  .el-form-item {
    display: inline-block;
    width: 40%;
    min-width: 410px;
    .el-input__inner {
     
    }
  }
  .el-form-item__label {
    margin: 0;
    padding-right: 30px;
  }
  .w100 {
    .el-form-item {
      width: 100%;
    }
  }
}
</style>
