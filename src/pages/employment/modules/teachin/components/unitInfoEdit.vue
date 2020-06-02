<template>
  <div id="unitInfo">
    <div class="title clearfix">
      <h1><span><em></em><i>单位信息</i></span></h1>
    </div>
    <div class="unitForm">
      <el-form :model="unitForm" ref="unitInfoForm" :rules="unitFormRules" label-width="150px">
        <div class="inline">
          <!-- 如果是单位新增宣讲会 单位名称默认 -->
          <el-form-item label="单位名称：" v-if="loginType.loginType == 'COMPANY'">  
            <span>{{unitInfo.companyName}}</span>
          </el-form-item>
          <!-- 管理员单位默认下拉框选择 -->
          <el-form-item label="单位名称：" prop="companyName" v-else>  
            <el-select  :disabled='status == "0"' placeholder='请选择或输入公司名称' v-model="unitForm.companyName" filterable  @change='unitChange' style="width: 100%;">
              <el-option v-for="(item,index) in unitList" :key="index" :label='item.companyName' :value='item.id'>

              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item  label="单位性质：">
             <span>{{unitInfo.propertyName}}</span>
          </el-form-item>
        </div>
        <div class="inline">
          <el-form-item label="单位联系人：" prop="contactPeople">
            <el-input v-model="unitForm.contactPeople"></el-input>
          </el-form-item>
          <el-form-item label="单位规模：">
            <span>{{unitInfo.scaleName}}</span>
          </el-form-item>
        </div>
        <div class="inline">
          <el-form-item label="电话：" prop="contactPhone"> 
             <el-input v-model="unitForm.contactPhone"></el-input>
          </el-form-item>
           <el-form-item label="邮箱：" prop="email"> 
             <el-input v-model="unitForm.email"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="单位地址：" class="w100">
          <span>{{unitInfo.addressDetail}}</span>
        </el-form-item>
        <el-form-item label="单位简介：" class="w100">
           <span v-html="unitInfo.summary"></span>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import {getUnitInfo} from '../../../api/techin/api'
import {getUnitList,ScrollTop} from '../../../api/api'
export default {
  props:['loginType','defaultInfo'],
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的手机号"));
        }
      }
    };
   
    return {
      
      unitForm: {
        companyName:'',
        contactPeople:'',//单位联系人
        email:'',//邮箱
        contactPhone:'',//电话
      },
      unitList:[],
      status:'',//审核状态
      unitInfo: {},//公司基本信息
      unitFormRules: {
        companyName:[{required: true,message:'请选择公司',trigger:'change'}],
        email:[{required: true,message:'请输入邮箱',trigger:'blur'},{type:'email',message:'请输入正确格式的邮箱',trigger:'blur'}],
        contactPhone: [{required: true,message:'请输入联系人电话',trigger:'blur'},{validator:checkPhone,message:'请输入正确格式的手机号码',trigger: 'blur'}],
        contactPeople: [{required: true,message:'请输入联系人',trigger:'blur'}]
      }
    }
  },
  methods: {
    catchUnitInfo() {  //获取单位基本信息
      getUnitInfo().then(info => {
        if(info) {
          this.unitInfo = info
          this.unitForm.companyId = info.id
          this.unitForm.contactPeople = info.contactPeople
          console.log(info.contactPeople)
          this.unitForm.contactPhone = info.contactPhone
          this.unitForm.email = info.mailAddress
        }
      })
    },
    catchUnitList() {  //获取所有单位列表
      getUnitList().then(data => {
        if(data.state) {
            this.unitList = data.data
        }
      })
    },
    unitChange(val) {
       getUnitInfo(val).then(info => {
        window.sessionStorage.setItem('addPosition_unitId',info.id)
        if(info) {
          this.unitInfo = info
          this.unitForm.companyId = info.id
          this.unitForm.contactPeople = info.contactPeople
          this.unitForm.contactPhone = info.contactPhone
          this.unitForm.email = info.mailAddress
          this.$refs.unitInfoForm.validate()
        }
      })
    },
    vali() {   //验证基本信息表单规格
         let flag = false
         this.$refs.unitInfoForm.validate((valid) => {
           if(valid) {
             flag = valid
           }else {
             ScrollTop(300,20)
           }
         })
         return flag
      },
      setDefaultInfo() {
        console.log(this.defaultInfo)
        this.unitInfo = this.defaultInfo
        this.unitInfo.scaleName = this.defaultInfo.scale
        this.unitInfo.propertyName = this.defaultInfo.property
        let info = this.defaultInfo
        if(this.defaultInfo) {
          this.status = this.defaultInfo.status
          this.unitForm = {
            contactPeople: info.contactPeople,
            email: info.email,
            contactPhone: info.contactPhone
          }
          if(this.loginType.loginType == 'COMPANY') {
           this.unitForm.companyName = info.companyName 
          }else {
            this.unitForm.companyName = info.companyName 
            this.unitForm.companyId = info.id
            
          }
        }
      }
  },
  created() {
    console.log(this.loginType.loginType)
    if(this.loginType.loginType == 'COMPANY') {
      this.catchUnitInfo()
    }else {
      this.catchUnitList()
    }
    if(this.defaultInfo) {
      this.setDefaultInfo()
    }
    
    
  }
}
</script>
<style lang="less" scoped>
#unitInfo {
  padding: 30px;
  border-top: 1px solid #e7e7e7;
      .w100 {
        width: 100%!important;
      }
}
</style>
<style lang="less">
.unitForm {
  margin-top: 20px;
  .inline {
    .el-form-item {
      display: inline-block;
      width: 40%;
      min-width: 400px;
    }
  }
  .el-form-item__label {
    padding-right: 30px;
  }
  .edui-editor-iframeholder {
    border: 1px solid #dcdfe6;
    border-top: 0;
    border-bottom: 0;
  }
}
</style>

