/**单位新增笔面试 */
<template>
  <div id="addInterview">
    <div class="baseInfo">
      <h1 class="clearfix title"><span><em></em><i>基本信息</i></span></h1>
      <div class="baseForm">
        <el-form :model="baseInfo" ref="baseInfoForm" :rules="baseInfoRules"  label-width="150px">
          <el-form-item prop="examinationName" label="笔/面试标题：">
            <el-input v-model="baseInfo.examinationName"></el-input>
          </el-form-item>
          <el-form-item  label="类型：" prop='type'>
             <el-radio-group  v-model="baseInfo.type">
                  <el-radio label="INTERVIEW">面试</el-radio>
                  <el-radio label="WRITTEN">笔试</el-radio>
              </el-radio-group>
          </el-form-item>
          <el-form-item  class="w100"  label="场地类型：" prop="areaType" v-if="placeRule">
              <el-radio-group v-model="baseInfo.areaType" @change='areaTypeChange'>
                  <el-radio label="ADMIN_ASSIGNMENT" v-if="placeRule.allocationScheme == 'ADMIN_ASSIGNMENT'|| (defaultInfo&&defaultInfo.areaType == 'ADMIN_ASSIGNMENT')">管理员分配</el-radio>
                  <el-radio label="COMPANY_CHOOSE" v-if="placeRule.allocationScheme == 'COMPANY_CHOOSE'|| (defaultInfo&&defaultInfo.areaType == 'COMPANY_CHOOSE')">选择可用场地</el-radio>
                  <el-radio label="isContact" v-if="placeRule.isAllow == 1||(defaultInfo&&defaultInfo.isContact == 1)">自行联系</el-radio>
              </el-radio-group>
          </el-form-item>
          <!-- 场地说明 -->
          <div class="areaExplain" v-if="baseInfo.areaType == 'ADMIN_ASSIGNMENT'&&placeRule.areaExplain">
            <el-collapse accordion>
               <el-collapse-item>
                <template slot="title">
                <span class="title"><i class="header-icon el-icon-info"></i><em>笔面试场地说明：</em></span>
                </template>
               <div class="content" v-html="placeRule.areaExplain"></div>
               </el-collapse-item>
            </el-collapse>
          </div>
          <el-form-item label="场地：" v-if="baseInfo.areaType=='isContact'" prop="areaDetail">
             <el-input v-model="baseInfo.areaDetail"></el-input>
          </el-form-item>
          <el-form-item label="场地要求：" class="w100" v-if="baseInfo.areaType=='ADMIN_ASSIGNMENT'">
             <el-input placeholder="请填入场地、时间要求等" type="textarea" rows='4' resize='none' v-model="baseInfo.areaRequirement"></el-input>
          </el-form-item>
          <!-- 场地类别 -->
          <el-form-item label="场地类别" prop='areaCategory'  v-if="baseInfo.areaType=='ADMIN_ASSIGNMENT'">
           <el-select style='width: 100%;' v-model="baseInfo.areaCategory " placeholder="请选择场地类别">
            <el-option
              v-for="item in areaTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          </el-form-item>

          <!-- 选择自行联系或者管理员分配的笔面试时间 -->
          <el-form-item prop="date" class="w100" v-if="baseInfo.areaType == 'isContact'||baseInfo.areaType == 'ADMIN_ASSIGNMENT'">
           <span slot="label">
              <em style="color: #d25050">*</em>笔/面试时间：
            </span>
            <el-date-picker
              v-model="baseInfo.startDate"
              format="yyyy 年 MM 月 dd 日" 
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
             <el-time-picker
                is-range
                 value-format="HH:mm"
                  format="HH:mm"
                v-model="baseInfo.startTime"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围">
              </el-time-picker>
          </el-form-item>
          <!-- 单位选择可用场地的笔面试时间 -->
             <el-form-item class="w100" v-if="baseInfo.areaType=='COMPANY_CHOOSE'">
            <span slot="label">
              <em style="color: #d25050">*</em>笔/面试时间：
            </span>
            <div class="dateBox">
              <!-- <el-input v-model="baseInfo.year"></el-input> -->
              <el-date-picker
                key="rangeDate"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                v-model="baseInfo.year"
                type="date"
                placeholder="选择日期"
                :picker-options="pickerOptions"
                @change="dateChange"
              ></el-date-picker>
                <el-select v-model="baseInfo.timeRange" @change='usableTimesChange' :disabled="!baseInfo.timeOptions.length" placeholder="请选择时间段">
                  <el-option
                    v-for="(item,index) in baseInfo.timeOptions"
                    :key="index"
                    :label="item"
                    :value="item"
                    >
                  </el-option>
                </el-select>
            </div>
          </el-form-item>
          <el-form-item prop="contactPeople" label="单位联系人：">
                <el-input v-model="baseInfo.contactPeople"></el-input>
              </el-form-item>
              <el-form-item prop="contactPhone" label="联系人电话：">
                <el-input v-model="baseInfo.contactPhone"></el-input>
              </el-form-item>
            <el-form-item prop="email" label="邮箱：">
              <el-input v-model="baseInfo.email"></el-input>
            </el-form-item>
        </el-form>
      </div>
    </div>
    
        <!-- 场地信息 -->
    <!-- 场地信息当有选择可用时间段后出现 -->
      <div class="placeinfo" v-if="baseInfo.areaType=='COMPANY_CHOOSE'&&usablePlace.length"> 
        <div class="placeInfoForm">
        <div class="title clearfix">
          <h1>
            <span>
              <em></em>
              <i>场地信息</i>
            </span>
          </h1>
        </div>
        <div class="placeInfoForm">
          <el-form :model="placeForm" :rules="placeFormRule" label-width="170px">
            <el-form-item prop="place" label="场地：" class="w100" v-if='baseInfo.timeRange'>
              <el-radio-group v-model="placeForm.place" >
                <el-radio :label="item.id" v-for="(item,index) in usablePlace" :key="index" @change="placeRadioChange">{{item.name}}</el-radio>
              </el-radio-group>
              <div class="usablePlace" v-if="placeForm.place">
                <em></em>
                <h2>可容纳人数：{{curUsablePlaceInfo.peopleNum}}</h2>
                <h2 :title="curUsablePlaceInfo.description" v-html="'场地说明：' + curUsablePlaceInfo.description"></h2>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
      </div>
      <!-- <div class="unitinfo">
        <div class="title clearfix">
          <h1><span><em></em><i>单位信息</i></span></h1>
        </div>
        <div class="unitForm">
          <el-form :model="unitForm" ref="unitInfoForm" :rules="unitFormRules" label-width="150px">
            <el-form-item prop="contactPeople" label="单位联系人：">
                <el-input v-model="unitForm.contactPeople"></el-input>
              </el-form-item>
              <el-form-item prop="contactPhone" label="联系人电话：">
                <el-input v-model="unitForm.contactPhone"></el-input>
              </el-form-item>
            <el-form-item prop="email" label="邮箱：">
              <el-input v-model="unitForm.email"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div> -->
      <div class="formBtn">
        <a class="publish" @click="toSubmit" v-if="!defaultInfo">提交审核</a>
        <div v-if="defaultInfo">
          <a class="publish" @click="toSubmit" v-if="defaultInfo.status==5||defaultInfo.status == 3">重新提交</a>
          <a class="publish" @click="toSubmit" v-if="defaultInfo.status==1">修改</a>
        </div>
      </div>
  </div>
</template>
<script>
import {getUsableTimeOfPlace, getUsablePlace} from '../../../api/placeManage/api'
import {getUnitInfo} from '../../../api/techin/api'
import { sAjax } from '../../../../../assets/utils/utils';
import {getDate2Useable,date2time,getAreaTypeList} from '../../../api/api'
export default {
  props: ['placeRule','defaultInfo'],
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
      usablePlace: [],//可用的场地列表
      curUsablePlaceInfo:{},//当前选中的可用场地信息
      firstState: true,
      usableDate:[],
      areaTypeList:[],
      pickerOptions: {
          disabledDate: (time) => {
            // console.log(date2time(time))
            return this.usableDate.indexOf(date2time(time))<0
          }
        },//可用日期
       baseInfo: {
        examinationName : '',//笔面试名
        type:'',
        areaType:'',
        startTime:'',
        endTime:'',
        startDate:'',
        place: '',
        areaRequirement:'',
        areaDetail:'',
        year:'',
        timeRange:'',
        timeOptions:[],
        contactPeople:'',
        contactPhone:'',
        email:'',
        areaCategory:''
      },
      unitForm: {
        contactPeople:'',
        contactPhone:'',
        email:'',
      },
      unitFormRules: {
        contactPeople:[{ required: true, message: '请输入联系人', trigger: 'blur' }],
        contactPhone:[{ required: true,validator:checkPhone, message: '请输入正确格式的联系人电话', trigger: 'blur' }],
        email:[{required:true,type:'email',message:'请输入正确格式的邮箱地址',trigger:'blur'}]
      },
      placeForm: {
          place:'',
        },
      baseInfoRules: {
        examinationName : [{required: true,message:'请填写笔/面试标题',trigger:'blur'}],
        type: [{required: true,message:'请选择类型',trigger:'change'}],
        areaType: [{ required: true, message: '请选择场地类型', trigger: 'change' }],
        areaDetail:[{required: true,message:'请填写自行联系的场地名称',trigger:'blur'}],
        contactPeople:[{ required: true, message: '请输入联系人', trigger: 'blur' }],
        contactPhone:[{ required: true,validator:checkPhone, message: '请输入正确格式的联系人电话', trigger: 'blur' }],
        email:[{required:true,type:'email',message:'请输入正确格式的邮箱地址',trigger:'blur'}],
        areaCategory: [{ required: true, message: '请选择场地类别', trigger: 'change' }],
        // type:[{}]
      },
      placeFormRule: {
         place:[{required: true,message:'请选择可用场地',trigger:'change'}],
      },
    }
  },
  methods: {
    areaTypeChange() {
      this.$refs['baseInfoForm'].clearValidate()
    },
    getUsableDate() {
        getDate2Useable().then(data=> {
          if(data.state) {
            if(data.data.length) {
              this.usableDate = data.data
            }else {
              this.usableDate = []
            }
          }
        })
      },
    catchAreaTypeList() {  //获取场地类别
      getAreaTypeList().then(data => {
        if(data.state) {
          this.areaTypeList = data.data
        }
      }) 
    },
    catchUnitInfo() {  //获取单位基本信息
      getUnitInfo().then(info => {
        if(info) {
          this.baseInfo.contactPeople = info.contactPeople
          this.baseInfo.contactPhone = info.contactPhone
          this.baseInfo.email = info.mailAddress
          // this.unitInfo = info
          // this.unitForm.companyId = info.id
          // this.unitForm.contactPeople = info.contactPeople
          // console.log(info)
          // this.unitForm.contactPhone = info.contactPhone
          // this.unitForm.email = info.mailAddress
        }
      })
    },
    dateChange(val) {   //单位选择可用日期回调
      getUsableTimeOfPlace(val).then(data => {
           this.baseInfo.timeRange = ''
           if(!this.firstState) {
             this.placeForm.place = ''
          }
           if(data.length) {
             this.baseInfo.timeOptions = data
           }else {
             
             this.baseInfo.timeOptions = []
           }
           if(this.defaultInfo) {
             let startDate = this.defaultInfo.beginTime.split(' ')[0]
             if(this.defaultInfo.areaUseId&&this.baseInfo.year == startDate) {
                let startTimeStr = this.defaultInfo.beginTime.split(' ')[1]
                let endTimeStr = this.defaultInfo.endTime.split(' ')[1]
                let date = startTimeStr.substring(0,startTimeStr.length-3)+'~'+endTimeStr.substring(0,endTimeStr.length-3)
                
                  if(!this.firstState) {
                     this.baseInfo.timeRange = ''
                    }else {
                      this.baseInfo.timeRange = date
                    }
                    console.log(this.baseInfo.timeRange)
                    if(this.baseInfo.timeOptions.indexOf(date) < 0 ) {
                      this.baseInfo.timeOptions.push(date)
                    }
             }else {
               this.baseInfo.timeRange = ''
             }
                this.firstState = false
           }
      })
    },
    placeRadioChange(val) {  //场地单选框切换回调  val为场地ID 获取当前场地信息
        for(let info of this.usablePlace) {
          if(val == info.id) {
            this.curUsablePlaceInfo = info
          }
        }
        console.log(this.curUsablePlaceInfo)
      },
    usableTimesChange(val) {  //单位选择可用时间段回调
      let times = val.split('~')
        this.usablePlace = []
        this.curUsablePlaceInfo = {}
        this.placeForm.place = ''
        let startTime = this.baseInfo.year + ' ' + times[0] + ':00'
        let endTime = this.baseInfo.year + ' ' + times[1] + ':00'
        getUsablePlace(startTime,endTime).then(data => {   //获取可选场地
            if(data.length) {
              this.usablePlace = data
            }else {
                this.usablePlace = []
            }
            if(this.defaultInfo) {
              if(this.defaultInfo.areaUseId) {
                let begin = this.defaultInfo.beginTime.split(' ')[1]
                let end = this.defaultInfo.endTime.split(' ')[1]
                let range = begin.substring(0,begin.length-3) + '~' + end.substring(0,end.length-3)
                if(range == this.baseInfo.timeRange) {  //
                  // this.usablePlace.push({
                  //   name: this.defaultInfo.areaName,
                  //   id: this.defaultInfo.areaUseId,
                  //   peopleNum:  this.defaultInfo.areaPeopleNum,
                  //   description:  this.defaultInfo.areaDescription,
                  // })
                }
              }
              console.log(this.usablePlace)
            }
        })
    },
    vali() {   //验证基本信息表单规格
         let baseFlag = false
         let unitFlag = false
         this.$refs.baseInfoForm.validate((valid) => {
           if(valid) {
              if(!this.placeRule) return this.$message.error('请先设置场地规则')
              let info = this.baseInfo
              if(this.baseInfo.areaType != 'COMPANY_CHOOSE') {
                  if(!info.startTime || !info.startDate) return this.$message.error('请选择笔面试时间')
              }else {
                if(!info.year || !info.timeRange) return this.$message.error('请选择笔面试时间')
                if(!this.placeForm.place) return this.$message.error('请选择场地')
              }
              baseFlag = valid
           }
           
         })
         return baseFlag
      },
    toSubmit() {  //单位提交笔面试审核
        let flag = this.vali()
        if(flag) {
         
          let baseInfo = this.baseInfo
          baseInfo.areaUseId  = this.placeForm.place
          // let unitInfo = this.unitForm
          if(baseInfo.areaType != 'COMPANY_CHOOSE') { //单位自行联系或者管理员分配
          let timeRange = baseInfo.startTime
          baseInfo.beginTime = baseInfo.startDate + ' ' + timeRange[0] + ':00'
          baseInfo.endTime = baseInfo.startDate + ' ' + timeRange[1] + ':00'
          console.log(baseInfo.startDate + ' ' + timeRange[0])
          if(baseInfo.areaType == 'ADMIN_ASSIGNMENT') {
            baseInfo.areaExplain = this.placeRule.areaExplain
          }
        }
        if(baseInfo.areaType == 'COMPANY_CHOOSE') {  //单位选择现有场地
          let timeRange = this.baseInfo.timeRange.split('~')
          //笔面试开始结束时间
          baseInfo.beginTime = baseInfo.year + ' ' + timeRange[0] + ':00'
          baseInfo.endTime = baseInfo.year + ' ' + timeRange[1] + ':00'
        }
        let obj = Object.assign({}, baseInfo)
        obj.isContact  = baseInfo.areaType == 'isContact'?1:0
          let url
          if(this.defaultInfo) {
            url = '/api/employment/examination/resubmit'
          }else {
            url = '/api/employment/examination/addExamination'
          }
          sAjax({
            url:  url,
            type: 'post',
            data: obj,
            success: (data) => {
              if(data.state) {
                this.$message.success('提交成功')
                this.$emit('backToParent')
              }else {
                this.$message.error(data.message)
              }
            }
          })
        }
    },
    setDefaultInfo() { //处理编辑的信息
      if(this.defaultInfo) {
        let info = this.defaultInfo
        console.log(info)
        this.baseInfo = {  //基本信息
          id: info.id,
          examinationName: info.title,
          type:info.type,
          areaType: info.areaType?info.areaType:'isContact',
          timeRange:'',
          timeOptions:[],
          areaDetail:info.areaDetail,
          contactPeople: info.contactPeople,
          contactPhone: info.contactPhone,
          email: info.email,
          
        }
        if(info.areaType == 'COMPANY_CHOOSE') {
            let startTimeStr = info.beginTime.split(' ')[1]
            let endTimeStr = info.endTime.split(' ')[1]
            this.firstState = true
            this.$set(this.baseInfo,'year',info.beginTime.split(' ')[0])
            this.dateChange(info.beginTime.split(' ')[0])//根据日期获取可用时间段
            this.usableTimesChange(startTimeStr.substring(0,startTimeStr.length-3)+'~'+endTimeStr.substring(0,endTimeStr.length-3))
            this.$set(this.baseInfo,'timeRange',startTimeStr.substring(0,startTimeStr.length-3)+'~'+endTimeStr.substring(0,endTimeStr.length-3))
            
            this.baseInfo.timeOptions.push(this.baseInfo.timeRange)
            this.$set(this.placeForm,'place',info.areaUseId)
            setTimeout(() => {
              this.placeRadioChange(info.areaUseId)
            }, 500);
              this.firstState = true
          
         }else {
            let startTimeStr = info.beginTime.split(' ')[1]
            let endTimeStr = info.endTime.split(' ')[1]
            this.$set(this.baseInfo,'startDate',info.beginTime.split(' ')[0])
            this.$set(this.baseInfo,'startDate',info.beginTime.split(' ')[0])
            this.$set(this.baseInfo,'startTime',[startTimeStr.substring(0,startTimeStr.length-3),endTimeStr.substring(0,endTimeStr.length-3)])
            if(info.areaType == 'ADMIN_ASSIGNMENT') {
                this.$set(this.baseInfo,'areaCategory',info.areaCategory + '')
            }
         }
         if(info.isContact == 1) {
             this.$set(this.baseInfo,'areaType','isContact')
         }
        // this.unitForm = {   //单位信息
        //   contactPeople: info.contactPeople,
        //   contactPhone: info.contactPhone,
        //   email: info.email,
        // }
      }
    }
  },
  created() {
    this.catchUnitInfo()
    this.setDefaultInfo()
    this.getUsableDate()
    this.catchAreaTypeList()
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
      }
  .baseInfo,.placeinfo,.unitinfo {
    padding: 30px;
    .inline {
      display: inline-block;
    }
    .inline.right {
      float: right;
    }
    .tips {
      padding-left: 150px;
      color: #666;
      margin-bottom: 25px;
    }
  }
  .placeinfo,.unitinfo {
   border-top: 1px solid #e7e7e7;
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
  .usablePlace {
    position: relative;
    background:#f6f6f8;
    padding: 20px;
    border-radius: 4px;
    max-width: 60%;
    h2 {
       font-size: 14px;
      color: #666;
      margin-bottom: 12px;
    }
    em {
      position: absolute;
      top: -8px;
      left: 100px;
      width: 0; 
      height: 0;
      border-right:10px solid transparent;
      border-left:10px solid transparent;
      border-bottom:10px solid #f6f6f8;
    }
    
  }
}
</style>
<style lang="less">
.usablePlace {
  h2 {
    p {
      line-height: 25px;
      overflow:hidden; 
      text-overflow:ellipsis;
      display:-webkit-box; 
      -webkit-box-orient:vertical;
      -webkit-line-clamp:5; 
    }
  }
  table {
      td {
        border: 1px solid #999;
        line-height: 20px;
        padding-left: 5px;
      }
    }
}
.baseForm,.placeinfo {
  .el-input__inner {
    .el-input {
      padding: 0!important;
    }
  }
  .el-form-item__label {
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
  .el-form-item.w100 {
    width: 100%!important;
  }
  .el-range-input {
    border:none!important;
  }
  .el-checkbox__label,.el-checkbox__input.is-checked+.el-checkbox__label {
    color: #000;
    font-weight: bold;
  }
  span.el-checkbox__inner {
    width: 16px;
    height: 16px;
    &:after {
      top:2px;
      left: 5px;
    }
  }
}
.unitForm {
  margin-top: 20px;
    .el-form-item {
      width: 40%;
      min-width: 410px;
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
.el-date-picker {
  table {
    td.available {
      span {
        color: #409EFF;
        font-weight: 700;
      }
    }
    td.disabled {
      span {
         color: #C0C4CC!important;
      }
    }
  }
}
.baseForm {
.areaExplain {
  margin-bottom: 22px;
  span.title {
    display: inline-block;
    width: 160px;
    text-align: right;
    font-weight: bold;
    color: #666;
    
  }
    .el-collapse-item__arrow.is-active {
      transform: rotate(90deg)!important;
    }
  .el-collapse {
    border: none;
  }
  .content {
    padding-left: 170px;
    color: #666;
  }
  div.el-collapse-item__header {
    width:220px;
    border: none;
  }
  table {
    td {
      border: 1px solid #666;
    }
  }
}
}
</style>
