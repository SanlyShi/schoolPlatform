<template>
  <div class="employment-affair">
    <div class="affair-header">
      <span>
        <i class="el-icon-tickets"></i>
      </span>
      <span>{{ affairType }}</span>
    </div>
    <div class="affair-content">
      <el-row>
        <el-col :span="6" v-for="(item, index) in rows" v-bind:key="index">
          <div class="affair-item" v-if="!item.forSearch">
            <div class="affair-icon" style="cursor:pointer" @click="goToApp(item.appId)">
              <!-- <i
                class="icon"
                v-html="icons('list')">
              </i> -->
              <i class="icon" :title="item.imgPath" v-html="icons(item.imgPath)" v-if="item.imgType !== '2'">{{item.imgPath}}</i>
              <i class="icon app-icon-style theme-icon-application" v-else-if="item.imgType === '2'">
                <span class="saasicon-44px" :class="['saasicon-44px-'+ item.imgPath]"></span>
              </i>
            </div>
            <div class="affair-name" :title="item.name">{{item.name}}</div>
          </div>

          <div class="affair-item" v-else>
            <div class="affair-icon" style="cursor:pointer" @click="showSearch">
              <i class="icon searchIcon"></i>
            </div>
            <div class="affair-name" :title="item.name">{{item.name}}</div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 档案查询弹窗 -->
    <el-dialog  title="档案查询"
      :visible.sync="dialogVisible"
      :close-on-click-modal='false'
      :show-close='false'
      width="40%">
        <el-form ref="searchForm" :model="searchForm" label-width="120px" :rules="rule"  v-if="!hasResult">
          <el-form-item label="姓名：" prop="name">
            <el-input placeholder="请输入姓名" v-model="searchForm.name"></el-input>
          </el-form-item>
          <el-form-item label="身份证号：" prop="code">
            <el-input placeholder="请输入身份证号" v-model="searchForm.code"></el-input>
          </el-form-item>
        </el-form>
        <div class="result" v-else>
          <el-form ref="resultForm"  label-width="140px">
            <el-form-item label="学号：">
              <span>{{result.studentId}}</span>
            </el-form-item>
            <el-form-item label="姓名：">
              <span>{{result.name}}</span>
            </el-form-item>
            <el-form-item label="专业：">
              <span>{{result.major}}</span>
            </el-form-item>
            <el-form-item label="档案转寄单位名称：">
              <span>{{result.fileForwardingUnitName}}</span>
            </el-form-item>
            <el-form-item label="档案转寄单位地址：">
             <span>{{result.fileForwardingUnitAddress}}</span>
            </el-form-item>
            <el-form-item label="档案寄出日期：">
              <span>{{result.sendingFilesDate}}</span>
            </el-form-item>
            <el-form-item label="快递单号/机要号：">
              <span>{{result.courierNumber}}</span>
            </el-form-item>
            <el-form-item label="物流信息：">
              <span>如果要查询物流信息,<a href="http://www.ems.com.cn/ems/logistics/search" target="_blank">，请点击这里</a></span>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancle" v-show="!hasResult">取 消</el-button>
          <el-button type="primary" @click="submit" :loading="submitLoading" v-show="!hasResult">确 定</el-button>
          <el-button type="primary" v-show="hasResult" @click="dialogVisible = false;hasResult = false">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
import { getIcons } from "../../../assets/utils/utils.js";
import { sAjax } from '../../../assets/utils/utils.js'
import { getLoginType } from '../api/api.js'
export default {
  name: 'employmentAffair',
  data() {
    let checkIdCard = (rule, value, callback) => {
       let reg = (/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/ || /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/)
       if(!reg.test(value)) {
         return callback(new Error("请输入正确格式的身份证"));
       }
       callback();
    }
    return {
      submitLoading: false,
      allApp: [],
      rows: [],
      dialogVisible: false,
      hasResult: false,
      rule: {
        name:  [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        code:  [{required: true,message: '请输入身份证号',trigger: 'blur'},{validator: checkIdCard,trigger: 'blur' }]
      },
      searchForm: {
        name: '',
        code: '',
      },
      result: null
    }
  },
  props: {
    affairType: {
      type: String,
      default: '事务类型'
    },
    applicationList: {
      type: Array,
      default: () => {
        return [{
          name: '应用名称'
        }, {
          name: '应用名称'
        }, {
          name: '应用名称'
        }, {
          name: '应用名称'
        }, {
          name: '应用名称'
        }];
      }
    }
  },
  created() {
    sAjax({
      url: '/api/employment/platform/search',
      dataType: 'json',
      type: 'get',
      async: false,
      success: (data) => {
        if (data.state) {
          // this.appArr = []
          //   console.log()
          this.allApp = data.data
          // data.data.forEach((item, index) => {
          //   let o = {}
          //   o.name = item.name
          //   o.id = item.id
          //   this.appArr.push(o)
          // })
        }
      }
    })
    this.refreshRows()

  },
  computed: {
    host: function () {
      return window.location.host;
    }
  },
  methods: {
    cancle(){
      this.dialogVisible = false
      this.hasResult = false
      this.submitLoading = false
      this.searchForm = {
        name: '',
        code: '',
      }
      this.$refs.searchForm.clearValidate()
    },
    submit() {
      
      let {name,code} = this.searchForm
      this.$refs['searchForm'].validate((valid) => {
        if(valid) {
          this.submitLoading = true
          let url = '/api/employment/studentFile/getFile'
          sAjax({
            url: url,
            dataType: 'json',
            type: 'post',
            data: {
              idCardNo: code,
              name: name
            },
            success: (data) => {
              if(data.state) {
                this.submitLoading = false
                this.result = data.data
                this.hasResult = true
              }else {
                this.result = null
                this.submitLoading = false
                this.$message({
                  type: 'error',
                  message: data.message
                })
              }
            }
          })
        }
      })
      
    },
    showSearch() {
      this.searchForm = {
        name: '',
        code: ''
      }
      this.dialogVisible = true
    },
    goToApp(id) {

      if (sessionStorage.getItem('schoolId')) {
        let url = `http://${this.host}/${sessionStorage.getItem('schoolId')}/app/${id}`
        getLoginType().then((data) => {
          if(data.state) {
            if(data.data.loginType != 'COMPANY') {
               window.location.href = url
            }else {
              this.$toast('暂无权限')
            }
          }
        })
        
       
      }
    },
    refreshRows() {
      sAjax({
        url: '/api/employment/platform/getAppList',
        dataType: 'json',
        type: 'get',
        async: false,
        success: (data) => {
          if (data.state) {
            this.rows = []
            data.data.forEach((item, index) => {

              let o = {}
              //   console.log("this.appApp",this.allApp)
              this.allApp.forEach((i, d) => {
                if (item.appId == i.id) {
                  // console.log(i)
                  o.name = i.name
                  o.imgPath = i.imgPath
                  o.imgType = i.imgType
                }
              })
              o.appId = item.appId
              o.id = item.id

              this.rows.push(o)
             
              // let o = {}
              // o.name = item.name
              // o.id = item.id
              // this.appArr.push(o)
            })
            this.rows.unshift({
               forSearch: true,
               name: '档案查询',
             })
          }else {
             this.rows = [{
               forSearch: true,
               name: '档案查询',
             }]
          }
        }
      })
    },
  }
}
</script>
<style lang="less">
.affair-header {
  height: 40px;
  font-size: 18px;
  font-weight: 500;
  span {
    vertical-align: middle;
  }
}
.affair-content {
  .el-col {
    margin-top: 10px;
  }
}

.affair-item {
  text-align: center;
  margin: auto;
}
.affair-icon {
  width: 61px;
  height: 58px;
  color: #ffffff;
  background: #94c3ff;
  border-radius: 4px;
  margin: auto;
  .icon {
    font-family: "MaterialIcons";
    font-style: normal;
    font-size: 44px;
    -webkit-font-smoothing: antialiased;
  }
  i.searchIcon {
    background: url('../../../../static/image/employment/forSearch88.png') no-repeat;
    display: inline-block;
    width: 44px;
    height: 44px;
    background-size: contain; 
    margin-top: 7px;
  }
}

.affair-name {
  height: 30px;
  line-height: 30px;
  // width: 110px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
}
</style>
