<template>
  <div class="studentDirection">
    <div v-if="!isSuccess" class="container-fluid studentDirection-page ">
      <div class="row title">
        <span>优秀意向生登记</span>
        <span>请勿重复提交登记，确保联系电话填写无误。</span>
      </div>
      <div class="body">
        <el-form ref="stuInfo" :inline="true" :rules="rules" label-position="right" :model="studentInfo" label-width="100px">
          <el-row>
            <el-col class="row-item" :span="8">
              <el-form-item label="姓名:" prop="studentName">
                <el-input class="w220" v-model="studentInfo.studentName" placeholder="请输入真实姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col class="row-item" :span="8">
              <el-form-item label="联系方式:" prop="phone">
                <el-input class="w220" maxlength="12" v-model="studentInfo.phone" placeholder="请输入手机或固定电话"></el-input>
              </el-form-item>
            </el-col>
            <el-col class="row-item" :span="8">
              <el-form-item label="科类:" prop="subject">
                <el-select class="w220" placeholder="请选择科类" v-model="studentInfo.subject">
                  <el-option v-for="(item, index) in subjectArr" :key="index" :label="item.label" :value="item.type"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col class="row-item" :span="8">
              <el-form-item label="高考成绩:" prop="entranceResult">
                <el-input class="w220" maxlength="3" v-model.number="studentInfo.entranceResult" placeholder="请输入高考成绩"></el-input>
              </el-form-item>
            </el-col>
            <el-col class="row-item" :span="8">
              <el-form-item label="省份:" prop="areaIdx">
                <el-select class="w220" placeholder="请选择省份" v-model="studentInfo.areaIdx" @change="changeProvince">
                  <el-option v-for="(item, index) in areaArr" :key="index" :label="item.label" :value="index"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col class="row-item" :span="8">
              <el-form-item label="所在城市:" prop="cityIdx">
                <el-select class="w220" placeholder="请选择所在城市" v-model="studentInfo.cityIdx" @change="changeCity">
                  <el-option v-for="(item, index) in cityList" :key="index" :label="item.label" :value="index"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col class="row-item" :span="8">
              <el-form-item label="高考排名:" prop="entranceEvaluate">
                <el-input class="w220" v-model.number="studentInfo.entranceEvaluate" placeholder="请输入高考排名"></el-input>
              </el-form-item>
            </el-col>
            <el-col class="row-item" :span="8">
              <el-form-item label="中学:" prop="schoolIdx">
                <el-select class="w220" placeholder="请选择中学" v-model="studentInfo.schoolIdx">
                  <el-option v-for="(item, index) in schoolArr" :key="index" :label="item" :value="index"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item style="margin-left:30px;" v-if="studentInfo.schoolIdx==(schoolArr.length-1)" prop="middleSchool">
                <el-input v-model="studentInfo.middleSchool" placeholder="请输入中学"></el-input>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="8" v-if="studentInfo.schoolIdx==(schoolArr.length-1)">
              <el-form-item prop="middleSchool">
                <el-input v-model="studentInfo.middleSchool" placeholder="请输入中学"></el-input>
              </el-form-item>
            </el-col> -->
          </el-row>
          <el-row>
            <div class="check-box-title ml28">意向专业：
              <span>（可多选）</span>
            </div>
          </el-row>
          <el-row>
            <el-checkbox-group class="checkbox" v-model="studentInfo.mindMajor">
              <el-col v-for="(item, index) in majorArr" :key="index" :span="8">
                <el-checkbox :label="item"></el-checkbox>
              </el-col>
            </el-checkbox-group>
          </el-row>
          <el-row>
            <div class="check-box-title ml13 mt10">非意向专业：
              <span>（可多选）</span>
            </div>
          </el-row>
          <el-row>
            <el-checkbox-group class="checkbox" v-model="studentInfo.unwillingMajor">
              <el-col v-for="(item, index) in majorArr" :key="index" :span="8">
                <el-checkbox :label="item"></el-checkbox>
              </el-col>
            </el-checkbox-group>
          </el-row>
          <el-row type="flex" justify="center">
            <el-button class="submit-btn mt10" type="primary" @click="submit">提交</el-button>
          </el-row>
        </el-form>
      </div>
    </div>
    <div v-else class="container-fluid studentDirection-page success">
      <img src="../../assets/img/enroll_success.png" alt="">
      <h5>信息登记成功</h5>
      <p>稍后将会有负责老师与你联系，请保持电话通畅，中国药科大学期待你的加入</p>
    </div>
  </div>
</template>

<script>
import {
  sAjax
} from "../../assets/utils/utils.js";
export default {
  data() {
    const validateAcquaintance = (rule, value, callback) => {
      value = Number(value)
      if (typeof value === 'number' && !isNaN(value)) {
        if (value < 1) {
          callback(new Error('排名不能小于1'))
        } else {
          callback()
        }
      } else {
        callback(new Error('必须输入数字'))
      }
    }
    var validateEmptyIpt = (rule, value, callback) => {
      // console.log(rule)
      if (this.studentInfo.schoolIdx==(this.schoolArr.length-1) && value === '') {
        callback(new Error('必填'));
      } else {
        callback();
      }
    }
    var validateNum = (rule, value, callback) => {
      let reg = /^[0-9]\d*$/
      if(!reg.test(value)) {
        callback(new Error('联系方式必须填数字'))
      } else {
        callback()
      }
    }
    return {
      isSuccess: false,
      studentInfo: {  
        studentName: '',    //  姓名	 
        phone: '',          //  电话
        subject: '',        //  科类
        entranceResult: '', //  高考成绩
        studentLand: '',    //	生源地
        entranceEvaluate: '', //  高考排名
        middleSchool: '',    // 中学
        schoolIdx: null,
        mindMajor: [],       //	意向专业
        unwillingMajor: [],  //	不想去的专业
        areaIdx: null,
        cityIdx: null,
      },
      rules: {
        studentName: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' },
          { min: 2, max: 7, message: '长度在 2 到 7 个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系方式', trigger: 'blur' },
          // { type: 'number', message: '联系方式必须填数字' }
          { validator: validateNum, trigger: ['blur', 'change'] },
        ],
        subject: [
          { required: true, message: '请选择科类', trigger: 'change' },
        ],
        entranceResult: [
          { required: true, message: '请输入高考成绩', trigger: 'blur' },
          { type: 'number', message: '高考成绩必须填数字' },
        ],
        areaIdx: [
          { required: true, message: '请选择省份', trigger: 'change' },
        ],
        cityIdx: [
          // { required: true, message: '请选择所在城市', trigger: 'change' },
        ],
        entranceEvaluate: [
          { required: true, message: '请输入高考排名', trigger: 'blur' },
          { type: 'number', message: '高考排名必须填数字' },
          { validator: validateAcquaintance, trigger: ['blur', 'change'] }
        ],
        schoolIdx: [
          { required: true, message: '请选择中学', trigger: 'blur' },
        ],
        middleSchool: [
          { validator: validateEmptyIpt, trigger: ['blur', 'change']  }
        ]
      },
      subjectArr: [{
        type: 0,
        label: '理工'
      }, {
        type: 1,
        label: '文史'
      }, {
        type: 2,
        label: '综合改革'
      },
      ],
      areaArr: [],
      cityList: [],
      schoolArr: [],
      majorArr: [],
    }
  },
  created() {
    this.initMajor()
    this.initArea()
  },
  mounted() {
  },
  methods: {
    changeProvince() {
      let code = this.areaArr[this.studentInfo.areaIdx].value
      if(code == '320000') {
        this.rules.cityIdx.push({ required: true, message: '请选择所在城市', trigger: 'change' })
      } else {
        this.rules.cityIdx = []
      }
      this.initCity(code)
      this.initSchool(code, '')
    },
    changeCity() {
      this.initSchool(this.areaArr[this.studentInfo.areaIdx].value, this.cityList[this.studentInfo.cityIdx].value)
    },
    initArea() {
      sAjax({
        url: "/api/archives/permissions/getProvinceList",
        dataType: "json",
        type: "GET",
        success: (result) => {
          if (result.state) {
            this.areaArr = result.data
          }
          else {
            this.$toast(result.message)
          }
        }
      })
    },
    initCity(value) {
      sAjax({
        url: `/api/archives/permissions/getProvinceSecond?value=${value}`,
        dataType: "json",
        type: "GET",
        success: (result) => {
          if (result.state) {
            this.cityList = result.data
            this.studentInfo.cityIdx = null
          }
          else {
            this.$toast(result.message)
          }

        }
      })
    },
    initMajor() {
      this.$waiting.show();
      sAjax({
        url: "/api/archives/intention/major",
        dataType: "json",
        type: "GET",
        success: (result) => {
          this.$waiting.close();
          if (result.state) {
            this.majorArr = result.data
          }
          else {
            this.$toast(result.message)
          }

        }
      })
    },
    initSchool(provinceValue, countryCode) {
      sAjax({
        url: `/api/archives/getSchool?provinceValue=${provinceValue}&countryCode=${countryCode}`,
        dataType: "json",
        type: "GET",
        success: (result) => {
          // console.log(result)
          if (result.state) {
            this.schoolArr = result.data
            this.studentInfo.schoolIdx = null
          }
          else {
            this.$toast(result.message)
          }
          this.schoolArr.push('其他')
        }
      })
    },
    submit() {
      this.$refs['stuInfo'].validate((valid) => {
        if (valid) {
          // 所在城市要去掉市
          let city = ''
          if(this.studentInfo.cityIdx !== null) {
            city = this.cityList[this.studentInfo.cityIdx].label
            if(city.indexOf('市') > -1) {
              let idx = city.indexOf('市')
              city = city.substr(0, city.length -1)
            }
          }

          let options = {
            recommendMode: '',  //  推荐方式   
            studentName: this.studentInfo.studentName,    //  姓名	 
            phone: this.studentInfo.phone,          //  电话
            subject: this.subjectArr[this.studentInfo.subject].label,        //  科类
            entranceResult: this.studentInfo.entranceResult, //  高考成绩
            province: this.areaArr[this.studentInfo.areaIdx].label, // 省
            studentLand: city,    //	生源地
            entranceEvaluate: this.studentInfo.entranceEvaluate, //  高考排名
            middleSchool:this.studentInfo.schoolIdx==(this.schoolArr.length-1)?this.studentInfo.middleSchool : this.schoolArr[this.studentInfo.schoolIdx],    // 中学
            mindMajor: this.studentInfo.mindMajor.join(','),       //	意向专业
            unwillingMajor: this.studentInfo.unwillingMajor.join(','),  //	不想去的专业
          }
          // 参数带在url后面，进行拼接
          let params = ''
          for (let k in options) {
            params += `${k}=${options[k]}&`
          }
          params = params.substr(0, params.length-1)

          sAjax({
            url: `/api/archives/intention/register?${params}`,
            // data: options,
            dataType: "json",
            type: "POST",
            success: (result) => {
              // console.log(result)
              if (result.state) {
                this.isSuccess = true;
              }
              else {
                this.$alert(result.message, '', {
                  confirmButtonText: '确定',
                  callback: action => {
                  }
                });
              }
            }
          })
        } else {
          this.$toast("请填写正确的信息！")
        }
      });
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../assets/newCommon.less";
.studentDirection {
  position: absolute;
  overflow: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

.studentDirection-page {
  min-height: 100%;
  background: #fff !important;
  overflow: auto;
  min-width: 1300px;
  padding: 50px 120px;
  .title {
    margin-bottom: 20px;
  }
  .title span {
    display: inline-block;
    &:first-child {
      font-weight: bold;
      font-size: 18px;
      color: #222222;
      border-bottom: solid 3px rgb(148, 198, 251);
    }
    &:nth-child(2) {
      font-size: 12px;
      color: #999;
      margin-left: 10px;
    }
  }
  .row .title {
    display: inline-block;
    width: 70px;
    text-align: right;
    font-size: 14px;
    color: #353637;
    letter-spacing: -0.33px;
    margin-left: 10px;
  }
  .w220 {
    width: 220px;
  }
  .body {
    .row-item {
      display: inline-block;
      line-height: 3;
    }
    .check-box-title {
      font-size: 14px;
      color: #666;
      font-weight: bold;
      span {
        font-weight: normal;
        color: #999;
      }
    }
    .ml28 {
      margin-left: 28px;
    }
    .ml13 {
      margin-left: 13px;
    }
    .mt10 {
      margin-top: 10px;
    }
    .checkbox {
      margin-left: 108px;
      .el-checkbox {
        padding: 8px 0;
      }
    }
    .submit-btn {
      background: #2a8ef8;
      border-radius: 4px;
      width: 210px;
      height: 32px;
      line-height: 0;
      font-size: 14px;
      color: #ffffff;
      text-align: center;
    }
  }
}
.success {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  h5 {
    font-size: 16px;
    color: #333;
  }
  p {
    font-size: 14px;
    color: #999;
  }
}
</style>
