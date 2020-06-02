<template>
    <div id="layout">
      <div id="unitInfo" >
      <div class="top">
        <h1 class="clearfix"><span>单位信息</span><a>审核记录</a></h1>
       
      </div>
      <h3>最近修改时间</h3>
      <div class="content ">
        <h2 class="clearfix"><p><span>普通股单位</span><em>{{'(信息未完善)'}}</em><i>{{'审核已通过'}}</i></p><a><i></i><span>编辑</span></a></h2>
        <div class="formGroup">
          <el-form disabled :inline='true' :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
            <el-form-item  label="单位名称" prop="name">
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="统一社会信用代码" prop="code">
              <el-input v-model="ruleForm.code"></el-input>
            </el-form-item>
            <el-form-item label="单位所在地" prop="address">
              <el-input v-model="ruleForm.address"></el-input>
            </el-form-item>
            <el-form-item label="所属行业" prop="business ">
              <el-input v-model="ruleForm.business"></el-input>
            </el-form-item>
            <el-form-item label="单位规模" prop="size">
              <el-input v-model="ruleForm.size"></el-input>
            </el-form-item>
            <el-form-item label="单位性质" prop="type">
              <el-input v-model="ruleForm.type"></el-input>
            </el-form-item>
            <el-form-item label="单位标签" prop="tag">
              <el-input v-model="ruleForm.tag"></el-input>
            </el-form-item>
            <el-form-item label="联系人" prop="concat">
              <el-input v-model="ruleForm.concat"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="ruleForm.phone"></el-input>
            </el-form-item>
            <el-form-item label="单位电话" prop="telephone">
              <el-input v-model="ruleForm.telephone"></el-input>
            </el-form-item>
            <el-form-item label="单位传真" prop="fax">
              <el-input v-model="ruleForm.fax"></el-input>
            </el-form-item>
            <el-form-item label="单位邮编" prop="Postcodes">
              <el-input v-model="ruleForm.Postcodes"></el-input>
            </el-form-item>
            <el-form-item label="单位网址" prop="url">
              <el-input v-model="ruleForm.url"></el-input>
            </el-form-item>
            <el-form-item label="单位介绍" prop="Introduce" class="Introduce">
              <el-input type="textarea" v-model="ruleForm.Introduce"></el-input>
            </el-form-item>
            <el-form-item label="发票抬头" prop="bill">
              <el-input v-model="ruleForm.bill"></el-input>
            </el-form-item>
            <el-form-item label="纳税人识别码" prop="userCode">
              <el-input v-model="ruleForm.userCode"></el-input>
            </el-form-item>
            <el-form-item label="公司法人代表" prop="corporation">
              <el-input v-model="ruleForm.corporation"></el-input>
            </el-form-item>
            <el-form-item label="注册资金" prop="money" class="money">
              <el-input v-model="ruleForm.money">
                <template slot="append">万</template>
              </el-input>
            </el-form-item>
             <el-form-item label="单位成立日期" prop="date">
               <el-date-picker
                  v-model="value1"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="营业执照" prop="license">
              <el-input v-model="ruleForm.license"></el-input>
            </el-form-item>
            <el-form-item label="营业执照到期时间" prop="overDate">
               <el-date-picker
                  v-model="value2"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
                <el-checkbox v-model="checked">长期</el-checkbox>
            </el-form-item>
          </el-form>
          <el-button type="primary">保存并提交</el-button>
        </div>
      </div>
    </div>
    </div>
</template>
<script>
export default {
  name:'unitInfo',
  data() {
    return {
      value1: '',//单位成立日期
      value2: '',//营业执照到期时间
       checked: true,
       ruleForm: {
          name: '',
          code: '',
          address: '',
          business: '',
          size: '',
          type: '',
          tag: '',
          concat: '',
          phone: '',
          telephone: '',
          fax: '',
          Postcodes: '',
          url: '',
          Introduce: '',
          bill: '',
          userCode: '',
          corporation: '',
          money: '',
          date: '',
          license: '',
        },
        rules: {
          name: [{ required: true, message: '请输入活动名称', trigger: 'blur' },],
          code: [{ required: true, message: '请输入活动名称', trigger: 'blur' },],
          address: [{ required: true, message: '请输入活动名称', trigger: 'blur' },],
          business: [{ required: true, message: '请输入活动名称', trigger: 'blur' },],
          size: [{ required: true, message: '请输入活动名称', trigger: 'blur' },],
          type: [{ required: true, message: '请输入活动名称', trigger: 'blur' },],
          tag: [{ required: true, message: '请输入活动名称', trigger: 'blur' },],
          concat: [{ required: true, message: '请输入活动名称', trigger: 'blur' },],
          phone: [{ required: true, message: '请输入活动名称', trigger: 'blur' },],
          telephone: [{ required: true, message: '请输入活动名称', trigger: 'blur' },],
          fax: [{ required: true, message: '请输入活动名称', trigger: 'blur' },],
          Postcodes: [{ required: true, message: '请输入活动名称', trigger: 'blur' },],
          url: [{ required: true, message: '请输入活动名称', trigger: 'blur' },],
          Introduce: [{ required: true, message: '请输入活动名称', trigger: 'blur' },],
          bill: [{ required: true, message: '请输入活动名称', trigger: 'blur' },],
          userCode: [{ required: true, message: '请输入活动名称', trigger: 'blur' },],
          corporation: [{ required: true, message: '请输入活动名称', trigger: 'blur' },],
          money: [{ required: true, message: '请输入活动名称', trigger: 'blur' },],
          date: [{ required: true, message: '请输入活动名称', trigger: 'blur' },],
          license: [{ required: true, message: '请输入活动名称', trigger: 'blur' },],
        }
    }
  },
  created() {
    
  },
  methods: {
   
  }
}
</script>
<style lang="less" scoped>

#unitInfo {
  color: #000;
  font-size: 18px;
  font-weight:500;
  a {color: #3E92FE;font-size: 16px;}
  // .top {
  //     h1 {
  //       height: 60px;
  //       line-height: 60px;
  //       padding: 0 20px;
  //       span {
  //         float: left;
  //       }
  //       a {
  //         float: right;
  //       }
  //     }
  //     &>p {
  //       color: #979797;
  //       font-size: 14px;
  //       margin: 20px 0 10px 0;
  //       font-weight: bold;
  //     }
  // }
  .content {
    background: #fff;
    padding: 0 20px;
    h2 {
      height: 57px;
      line-height: 57px;
      padding: 0 20px;
      p {
        float: left;
        em {
          color: #979797;
          font-size: 12px;
          padding: 0 10px 0 15px;
        }
        i {
          color: #43A719;
          font-size: 14px;
        }
      }
      a {
        float: right;
        i {
          // background: url('../../../static/image/employment/')
        }
      }
    }
  }
  .formGroup {
    background: #F5F9FF;
  }
}
</style>
<style lang="less">

// @import url('../../assets/newCommon.less');
//  body {
//   background: #F6F6F8;
// }
.formGroup {
  text-align: center;
  .el-form {
    padding-top: 30px;
    .el-input {
        width: 525px;
      .el-input__inner{
      }
    }
    label {
      color: #979797;
    }
  }
  .el-form--inline .el-form-item {
    display: block;
  }
  .Introduce {
    textarea {
      width: 525px;
    }
  }
}
</style>
