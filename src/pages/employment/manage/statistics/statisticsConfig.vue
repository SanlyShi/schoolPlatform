<template>

    <div id="statisticsConfig">
        <div class="config" v-loading='configLoading'>
            <h1>就业统计配置</h1>
            <el-col :span='12'>
                <el-form class="appForm" ref="configForm" :model="configModel" :rules='configRules'  label-width="100px">
                    <el-form-item prop='app' label='配置应用'>
                        <el-select v-model="configModel.app" @change="appChange($event,'workList')">
                            <el-option v-for='(item,index) of appList' :key="index" :label='item.name' :value='item.id'>{{item.name}}</el-option>
                        </el-select>
                    </el-form-item>
                     <el-form-item prop='work' label='配置业务期'>
                        <el-select v-model="configModel.work" >
                            <el-option v-for='(item,index) of workList' :key="index" :label='item.name' :value='item.id'>{{item.name}}</el-option>
                        </el-select>
                    </el-form-item>
                </el-form>        
            </el-col>
            <el-col :span='12'>
               <el-form ref="configForm_copy" :model="configModel_copy" :rules='configRules_copy' label-width="100px"> 
                    <el-form-item prop='app' label='配置应用'>
                        <el-select v-model="configModel_copy.app" @change="appChange($event,'workList_copy')">
                            <el-option v-for='(item,index) of appList' :key="index" :label='item.name' :value='item.id'>{{item.name}}</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop='work' label='配置业务期'>
                        <el-select v-model="configModel_copy.work">
                            <el-option v-for='(item,index) of workList_copy' :key="index" :label='item.name' :value='item.id'>{{item.name}}</el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
        </div>
        <div class="formList" v-loading='loading'>
            <el-col :span='12'>
                <div class="left">
                    <h1>生源统计对应表单</h1>
                    <el-form :model="fieldListModel" label-width="100px" ref='fieldForm' :rules='rules'>
                        <el-form-item :prop="'select_' + index"  v-for="(item,index) in fieldList" :key="index" :label='fieldList[index].chineseName'>
                            <el-select ref='select' v-model="fieldListModel['select_' + index]" @change='saveTitle($event,item)'> 
                                <el-option v-for="(obj,i) of fieldListOptions" :key="i" :label='obj.label' :value='obj.name+"/" + obj.label'></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
              </el-col>
              <el-col :span='12'>
                <div class="right">
                <h1>就业率统计对应表单</h1>
                    <el-form :model="fieldListModel_emp" label-width="100px" :rules='rules_emp' ref="fieldForm_copy">
                        <el-form-item :prop="'select_' + index" v-for="(item,index) in fieldList_emp" :key="index" :label='fieldList_emp[index].chineseName'>
                            <el-select v-model="fieldListModel_emp['select_' + index]"> 
                                <el-option v-for="(obj,i) of fieldListOptions_emp" :key="i" :label='obj.label' :value='obj.name+ "/" + obj.label'></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
             </el-col>
        </div>
        <div class="btnGroup">
            <el-button plain  @click="cancle">取消</el-button>
            <el-button type="primary" @click="save">保存</el-button>
        </div>
    </div>
</template>
<script>
import { sAjax } from "../../../../assets/utils/utils";
export default {
  data() {
    return {
      loading: false,
      configModel: {
        app: "",
        work: ""
      },
      configModel_copy: {
        app: "",
        work: ""
      },
      configRules: {
        app: [{required: true,message: '请选择配置应用',trigger: 'change'}],
        work: [{required: true,message: '请选择配置业务期',trigger: 'change'}]
      },
      configRules_copy: {
        app: [{required: true,message: '请选择配置应用',trigger: 'change'}],
        work: [{required: true,message: '请选择配置业务期',trigger: 'change'}]
      },
      rules: {
      },
      rules_emp: {
      },
      appList: [],
      workList: [],
      workList_copy: [],
      fieldList: [],
      fieldList_emp: [],
      fieldListOptions: [],
      fieldListOptions_emp: [],
      fieldListModel: {
      },
      fieldListModel_emp: {},
      defaultSetting: null,
      isDefault: true,
      configLoading: false,
      fitConditon: false,//满足4个下拉框都有值
    };
  },
  watch: {
    configModel: {
      handler(val,oldVal) {
        this.fieldListOptions = [];
        // for(let k in this.fieldListModel) {
        //   this.fieldListModel[k] = ''
        // }

        if (val.app && val.work) {
          if(this.configModel_copy.app&&this.configModel_copy.work) {
                      this.fitConditon = true
                      // this.isDefault = true
                      if(!this.isDefault) {
                        this.setData()
                      }
                    }
            this.fieldListOptions = [];
            let url = `/api/app/${val.app}/publishBusiness/${
              val.work
            }/formSetting`;
            sAjax({
              url: url,
              type: "get",
              success: data => {
                if (data.state) {
                  if (data.data && data.data.components.length) {
                    let list = data.data.components;

                    for (let i= 0;i<list.length;i++) {
                      this.fieldListOptions.push({
                        label: list[i].title,
                        name: list[i].name
                      });
                    }
                    console.log(1111)
                    
                  }
                }
              }
            });
          
        }
      },
      deep: true
    },

    configModel_copy: {
      handler(val) {
        
        this.fieldListOptions_emp = [];
        // for(let k in this.fieldListModel_emp) {
        //   this.fieldListModel_emp[k] = ''
        // }
        if (val.app && val.work) {
          if(this.configModel.app&&this.configModel.work) {
            this.fitConditon = true
            // this.isDefault = true
            if(!this.isDefault) {
              this.setData()
            }
            
          }
            let url = `/api/app/${val.app}/publishBusiness/${
              val.work
            }/formSetting`;
            sAjax({
              url: url,
              type: "get",
              success: data => {
                if (data.state) {
                  if (data.data && data.data.components.length) {
                    let list = data.data.components;
                    for (let i = 0;i< list.length;i++) {
                      this.fieldListOptions_emp.push({
                        label: list[i].title,
                        name: list[i].name
                      });
                      // this.$set(this.fieldListModel_emp,'select_'+i,'')
                      // this.$set(this.rules_emp,'select_'+i,[{required: true, message: '请输入任意项', trigger: 'change'}])
                    }
                  }
                }
              }
            });
          
        }
      },
      deep: true
    }
  },
  methods: {
    cancle() {
      this.isDefault = true
      this.workList = []
      this.workList_copy = []
      this.configModel = {
        app: "",
        work: ""
      },
      this.configModel_copy =  {
        app: "",
        work: ""
      },
      this.setData()
    },
    setData() {  //满足4个应用都选中的情况下调用
      let url = '/api/employment/statistics/getConfigInfo'
      let data
      this.configLoading = true
      this.loading = true
      if(!this.isDefault) {
       data = {
          graduateAppId: this.configModel.app,
          graduateBusinessId: this.configModel.work,
          employmentAppId: this.configModel_copy.app,
          employmentBusinessId: this.configModel_copy.work,
          isDefault: false
        }
      }else {
         data  = {
          isDefault: true
        }
      }
      sAjax({
        url: url,
        type: 'get',
        data: data,
        success: (info) => {
          if(info.state) {
            this.defaultSetting = info.data
            if(!this.defaultSetting) {
              this.configLoading = false
              this.loading = false
              return
            }
            if((this.defaultSetting&&this.isDefault) || this.fitConditon) {
               let defaultObj = this.defaultSetting
                this.appChange(defaultObj.graduateAppId,'workList')
                this.appChange(defaultObj.employmentAppId,'workList_copy')
              
              
              if(this.isDefault) {
                this.configModel = {
                  app: defaultObj.graduateAppId,
                  work: defaultObj.graduateBusinessId,
                }
                this.configModel_copy = {
                  app: defaultObj.employmentAppId,
                  work: defaultObj.employmentBusinessId
                }
              }
              let options = []
              let options_emp = []
              let list = defaultObj.statisticsFiledMatchingList
              let GRADUATENUM = 0
              let EMPNUM = 0
                setTimeout(() => {
                  for(let i = 0;i<list.length;i++) {
                    if(list[i].fieldType == 'GRADUATE') {
                      this.$set(this.fieldListModel,'select_'+ GRADUATENUM,list[i].formFieldName + "/" + list[i].formFieldTitle)
                      GRADUATENUM++
                    }else {
                      this.$set(this.fieldListModel_emp,'select_'+EMPNUM,list[i].formFieldName + "/" + list[i].formFieldTitle)
                      EMPNUM++
                    }
                  }
                  console.log(222222)
                  this.isDefault = false
                  this.fitConditon = false
                  this.configLoading = false
                  this.loading = false
                },1000)
              
            }else {
              this.configLoading = false
              this.loading = false
            }
          }
        }
      })
    },
    saveTitle() {

    },
    save() {
        let configForm_valid
        let configForm_copy_valid
        let fieldForm_valid
        let fieldForm_copy_valid
        let configForm =  this.$refs['configForm'].validate(valid => {
            configForm_valid = valid
        })
        let configForm_copy =  this.$refs['configForm_copy'].validate((valid) => {
            configForm_copy_valid = valid
        })
        let fieldForm =  this.$refs['fieldForm'].validate(valid => {
            fieldForm_valid = valid
        })
        let fieldForm_copy =  this.$refs['fieldForm_copy'].validate(valid => {
            fieldForm_copy_valid = valid
        })
        if(configForm_valid&&configForm_copy_valid&&fieldForm_valid&&fieldForm_copy_valid) {
          
          // console.log(this.configModel)
          // console.log(this.configModel_copy)
          var list = []
          var obj = {
            graduateAppId: this.configModel.app,
            graduateBusinessId: this.configModel.work,
            employmentAppId: this.configModel_copy.app,
            employmentBusinessId: this.configModel_copy.work,
          }
          for(let i = 0;i< this.fieldList.length;i++) {
            var model = this.fieldListModel['select_' + i].split('/')
            list.push({
              formFieldName: model[0],
              formFieldTitle: model[1],
              statisticsField: this.fieldList[i].englishName,
              fieldType: 'GRADUATE'
            })
          }
          for(let i = 0;i< this.fieldList_emp.length;i++) {
            var model_emp = this.fieldListModel_emp['select_' + i].split('/')
            list.push({
              formFieldName: model_emp[0],
              formFieldTitle: model_emp[1],
              statisticsField: this.fieldList_emp[i].englishName,
              fieldType: 'EMPLOYMENT'
            })
          }
          obj.statisticsFiledMatchingList = list
          let url = '/api/employment/statistics/addConfig'
          sAjax({
            url: url,
            type: 'post',
            data: obj,
            success: (info) => {
              if(info.state) {
                this.$message.success("添加成功")
              }else {
                this.$message.error("添加失败")
              }
            }
          })
        }
      },
    getAppList() {
      let url =
        "/api/app/search?category=ALL&typeId=&userType=&keyword=&capital=";
      sAjax({
        url: url,
        type: "get",
        success: data => {
          if (data.state) {
            this.appList = data.data;
          } else {
            this.appList = [];
          }
        }
      });
    },
    appChange(id, name) {
      if (!id) return;
      let url = "/api/app/" + id + "/business";
      this[name] = [];
      if (name == "workList_copy") {
        if(!this.isDefault&&!this.fitConditon) {
          this.configModel_copy.work = ""
        }
          
        // this.fieldListModel_emp = {}
        this.$refs['fieldForm_copy'].resetFields()
        this.$refs['fieldForm_copy'].clearValidate()
      } else {
        if(!this.isDefault&&!this.fitConditon) {
          this.configModel.work = ""
        }
          
        // this.fieldListModel = {}
        this.$refs['fieldForm'].resetFields()
        this.$refs['fieldForm'].clearValidate()
      }
      sAjax({
        url: url,
        type: "get",
        success: data => {
          if (data.state) {
            if (data.data.length) {
              let list = data.data;
              for (let i = 0; i < list.length; i++) {
                this[name].push({
                  name: list[i].business.name,
                  id: list[i].business.id
                });
              }
            }
          }
        }
      });
    },
    getForm() {
        this.loading = true
      let url =
        "/api/employment/statistics/getStatisticsNeedFieldList?statisticsTypeEnum=GRADUATE";
        let url_emp =  "/api/employment/statistics/getStatisticsNeedFieldList?statisticsTypeEnum=EMPLOYMENT";
      sAjax({
        url: url,
        type: "get",
        success: data => {
          if (data.state) {
            this.fieldList = data.data;
            if(this.fieldList.length) {
                for(let i = 0;i<this.fieldList.length;i++){
                    this.$set(this.fieldListModel,'select_'+i,'')
                    this.$set(this.rules,'select_'+i,[{required: true, message: '请输入任意项', trigger: 'change'}])
                }
            }
            
          } else {
            this.fieldList = [];
          }
        }
      });
      sAjax({
        url: url_emp,
        type: "get",
        success: data => {
          if (data.state) {
            this.fieldList_emp = data.data;
            if(this.fieldList_emp.length) {
                for(let i = 0;i<this.fieldList_emp.length;i++){
                    this.$set(this.fieldListModel_emp,'select_'+i,'')
                    this.$set(this.rules_emp,'select_'+i,[{required: true, message: '请输入任意项', trigger: 'change'}])
                }
            }
          } else {
            this.fieldList_emp = [];
          }
          this.loading = false
        }
      });
    }
  },
  created() {
    this.getAppList();
    this.getForm();
    this.setData();
  }
};
</script>
<style lang="less" scoped>
.btnGroup {
    text-align: center;
    margin-top: 30px;
}
#statisticsConfig {
  margin-left: 20px;
  margin-top:20px;
  background: #fff;
  padding: 20px;
}

.config,
.formList {
  overflow: hidden;
  .left,.right {
    margin: 20px 0;
  }
  h1 {
    font-size: 16px;
    margin-top: 0;
  }
  ul {
    padding: 0;
    margin: 0;
    display: inline-block;
    float: left;
  }
  li {
    list-style: none;
    line-height: 40px;
    margin-bottom: 25px;
  }
}
.formList {
    min-height: 300px;
  li {
    span {
      display: inline-block;
      width: 100px;
      text-align: right;
      padding-right: 12px;
      font-weight: bold;
      color: #606266;
    }
  }
}
</style>
<style lang="less">
#statisticsConfig {
  .config,
  .formList {
    .el-select {
      width: 100%;
      max-width: 350px;
    }
    .el-form {
      margin-top: 20px;
    }
  }
}
</style>
