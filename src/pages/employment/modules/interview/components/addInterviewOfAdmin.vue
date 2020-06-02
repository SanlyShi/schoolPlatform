/**管理员新增笔面试    审核笔面试 */
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
          <!-- 管理员审核单位才有场地类型 。管理员新增没有类型 -->
          <el-form-item v-if="defaultInfo&&defaultInfo.createType == 'COMPANY'"  class="w100"  label="场地类型：" prop="areaType">
              <el-radio-group v-model="baseInfo.areaType" @change='areaTypeChange' v-if="placeRule">
                  <el-radio label="ADMIN_ASSIGNMENT" v-if="placeRule.allocationScheme == 'ADMIN_ASSIGNMENT'|| (defaultInfo&&defaultInfo.areaType == 'ADMIN_ASSIGNMENT')">管理员分配</el-radio>
                  <el-radio label="COMPANY_CHOOSE" v-if="placeRule.allocationScheme == 'COMPANY_CHOOSE'|| (defaultInfo&&defaultInfo.areaType == 'COMPANY_CHOOSE')">选择可用场地</el-radio>
                  <el-radio label="isContact" v-if="placeRule.isAllow == 1||(defaultInfo&&defaultInfo.isContact == 1)">自行联系</el-radio>
              </el-radio-group>
          </el-form-item>
          <div class="areaExplain" v-if="(defaultInfo&&defaultInfo.createType == 'COMPANY')&&(baseInfo.areaType == 'ADMIN_ASSIGNMENT'&&placeRule.areaExplain)">
            <el-collapse accordion>
               <el-collapse-item>
                <template slot="title">
                <span class="title"><i class="header-icon el-icon-info"></i><em>笔面试场地说明：</em></span>
                </template>
               <div class="content" v-html="placeRule.areaExplain"></div>
               </el-collapse-item>
            </el-collapse>
          </div>
          <!-- 管理员新增选择笔面试时间 -->
          <el-form-item prop="date" class="w100" v-if="baseInfo.areaType != 'COMPANY_CHOOSE' ">
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

          <!-- <el-form-item label="单位联系人：" prop="contactPeople">
              <el-input v-model="baseInfo.contactPeople "></el-input>
            </el-form-item>
            <el-form-item label="电话：" prop="contactPhone">
              <el-input v-model="baseInfo.contactPhone "></el-input>
            </el-form-item>
            <el-form-item label="邮箱：" prop="email">
              <el-input v-model="baseInfo.email "></el-input>
            </el-form-item> -->



          <!-- 管理员审核单位（选择可用场地) 笔面试时间 -->
            <el-form-item class="w100" v-if="baseInfo.areaType=='COMPANY_CHOOSE'">
            <span slot="label">
              <em style="color: #d25050">*</em>笔面试时间：
            </span>
            <div class="dateBox">
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

          <!-- <el-form-item label="笔面试地点：" prop="areaDetail" v-if="baseInfo.areaType=='isContact'">
             <el-input v-model="baseInfo.areaDetail"></el-input>
          </!-->
          
          <el-form-item label="笔面试地点：" prop="areaDetail" v-if="defaultInfo&&baseInfo.areaType == 'isContact' || !defaultInfo">
             <el-input v-model="baseInfo.areaDetail"></el-input>
          </el-form-item>
           <el-form-item label="场地要求：" class="w100" v-if="baseInfo.areaType == 'ADMIN_ASSIGNMENT'">
             <el-input placeholder="请填入场地、时间要求等" type="textarea" rows='4' resize='none' v-model="baseInfo.areaRequirement"></el-input>
          </el-form-item>
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
        </el-form>
      </div>
    </div>

        <!-- 场地信息    管理员审核单位（类型为选择可用场地 -->
    <div class="placeinfo" v-if="baseInfo.areaType=='COMPANY_CHOOSE'"> 
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


    <div class="unitInfo">
      <h1 class="clearfix title"><span><em></em><i>单位信息</i></span></h1>
      <div class="unitForm">
        <el-form :model="unitForm" :rules="unitInfoRules" ref="unitInfoForm" label-width="150px">  
          <div>
            <el-form-item label="单位名称："  prop="companyName">  
            <el-select :disabled='defaultInfo&&defaultInfo.status == "0"' placeholder='请选择或输入公司名称' v-model="unitForm.companyName" filterable  @change='unitChange' style="width: 100%;">
              <el-option v-for="(item,index) in unitList" :key="index" :label='item.companyName' :value='item.id' v-if="unitList.length">
              </el-option>
            </el-select>
          </el-form-item>
         
            <el-form-item label="单位性质："><span>{{unitInfo.propertyName}}</span></el-form-item>
          </div>
          <div>
            <el-form-item label="单位联系人：" prop="companyContactPeople">
              <el-input v-model="unitForm.companyContactPeople "></el-input>
            </el-form-item>
            <el-form-item label="单位规模："><span>{{unitInfo.scaleName}}</span></el-form-item> 
          </div>
          <div>
            <el-form-item label="电话：" prop="companyContactPhone">
              <el-input v-model="unitForm.companyContactPhone "></el-input>
            </el-form-item>
            <el-form-item label="邮箱：" prop="companyEmail">
              <el-input v-model="unitForm.companyEmail "></el-input>
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

      <div class="formBtn" v-if="!defaultInfo">
        <a class="publish" @click="toSubmit" >发布</a>
      </div>

      <div class="formBtn" v-if="defaultInfo">
        <a class="publish" @click="toSubmit"  v-if="defaultInfo.status == 1">修改</a>
        <div v-if="defaultInfo.status == 0">   
          <!-- 待审核按钮 -->
          <a @click="pass">通过</a>
         <a @click="showReason('fail')">不通过</a>
          <a @click="showReason('reject')">驳回重新提交</a>
        </div>
      </div>

       <!-- 审核意见 -->
      <div class="reason btnGroup" v-if="reasonVisible">
        <el-dialog :visible.sync="reasonVisible"  title="审核意见" width="480px">
          <div class="sumarryInput">
            <el-input type="textarea" v-model="reason" resize="none" rows="4"></el-input>
              <a @click="reject" style="margin-top: 20px;">提交</a>
          </div>
        </el-dialog>
      </div>
  </div>
</template>
<script>
import {getUnitInfo} from '../../../api/techin/api'
import {getUnitList,ScrollTop,getDate2Useable,date2time,getAreaTypeList} from '../../../api/api'
import {getUsableTimeOfPlace, getUsablePlace} from '../../../api/placeManage/api'
import {getCompanyInfo} from '../../../api/techin/api'
import { sAjax } from '../../../../../assets/utils/utils'
export default {
  props: ['defaultInfo','placeRule'],
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
      reasonVisible:false,
      reason:'',
      curReasonType:'',//区分当前是驳回或者不通过
      unitInfo:{},
      unitList:[],
      areaTypeList:[],
      usablePlace:[],
      usableDate:[],
      pickerOptions: {
        disabledDate: (time) => {
            // console.log(date2time(time))
            return this.usableDate.indexOf(date2time(time))<0
          }
      },
      curUsablePlaceInfo:{},//当前选中的可用场地信息
      firstState: true,
      baseInfo: {
        examinationName: '',
        type:'',
        areaDetail: '',
        areaRequirement:'',
        areaDescription: '',
        startDate:'',
        startTime:'',
        contactPhone:'',
        contactPeople:'',
        email: '',
        areaType:'',
        year:'',
        timeRange:'',
        timeOptions: [],
        email:'',
        contactPeople:'',
        contactPhone:'',
        areaCategory:'',

      },
      placeForm: {
        place:'',
      },
      placeFormRule:{
         place:[{required: true,trigger:'blur'}],
      },
      baseInfoRules: {
        examinationName: [{required: true,message:'请填写笔/面试标题',trigger:'blur'}],
        type:[{required: true,message:'请选择笔面试类型',trigger:'change'}],
        startDate:[{type:'date',required: true,message:'请选择笔面试时间',trigger:'change'}],
        areaDetail:[{required: true,message:'请填写场地名称',trigger:'blur'}],
        contactPeople:[{required: true,message:'请输入联系人',trigger:'blur'}],
        contactPhone: [{required: true,message:'请输入联系人电话',trigger:'blur'},{validator:checkPhone,message:'请输入正确格式的手机号码',trigger: 'blur'}],
        email: [{required: true,message:'请输入邮箱',trigger:'blur'},{type:'email',message:'请输入正确格式的邮箱',trigger:'blur'}],
        areaType:[{required: true,message:'请选择场地类型',trigger:'change'}],
        areaCategory: [{ required: true, message: '请选择场地类别', trigger: 'change' }],
      },
      unitForm: {
        companyName: '',
        companyContactPeople :'',
        companyContactPhone :'',
        companyEmail  : '',
      },
      unitInfoRules: {
        companyName:[{required: true,message:'请选择单位',trigger:'change'}],
        companyEmail: [{required: true,message:'请输入单位邮箱',trigger:'blur'},{type:'email',message:'请输入正确格式的邮箱',trigger:'blur'}],
        companyContactPhone: [{required: true,message:'请输入单位联系人电话',trigger:'blur'},{validator:checkPhone,message:'请输入正确格式的手机号码',trigger: 'blur'}],
        companyContactPeople: [{required: true,message:'请输入单位联系人',trigger:'blur'}],
        summary:[{required:true,message:'请输入单位简介',trigger:'blur'}]
      }
      
    }
  },
  methods: {
    areaTypeChange() {
      console.log(1)
      this.$refs['baseInfoForm'].clearValidate()
    },
    getUsableDate() {
        getDate2Useable().then(data=> {
          if(data.state) {
            if(data.data.length) {
              this.usableDate = data.data
              if(this.defaultInfo) {
                  if(this.defaultInfo.areaType == 'COMPANY_CHOOSE') {
                    let date = this.defaultInfo.beginTime.split(' ')[0]
                    console.log(date)
                    this.usableDate.push(date)
                  }
              }
            }else {
              this.usableDate = []
            }
          }
        })
      },
    //   catchAreaTypeList() {  //获取场地类别
    //     getAreaTypeList().then(data => {
    //       if(data.state) {
    //         this.areaTypeList = data.data
    //       }
    //     }) 
    // },
    catchUnitList() {  //获取所有单位列表
      getUnitList().then(data => {
        if(data.state) {
          this.unitList = data.data
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
                  this.usablePlace.push({
                    name: this.defaultInfo.areaDetail,
                    id: this.defaultInfo.areaUseId,
                    peopleNum:  this.defaultInfo.areaPeopleNum,
                    description:  this.defaultInfo.areaDescription,
                  })
                }
              }
              console.log(this.usablePlace)
            }
        })
    },
    showReason(type) {
        this.reasonVisible = true
        this.curReasonType = type
        this.reason = ''
      },
      reject() {  //驳回或者不tongg
        if(!this.reason) {
          return this.$message.error('请填写审核意见')
        }
        let url 
        if(this.curReasonType == 'fail') {   //不通过
           url = '/api/employment/audit/repulseExaminationAudit?id='+ this.defaultInfo.id +'&reason='+this.reason
        }else {  //驳回
          url = '/api/employment/audit/rejectExaminationAudit?id='+ this.defaultInfo.id +'&reason='+this.reason
        }
        sAjax({
          url: url,
          type: 'post',
          success:(data) => {
            if(data.state) {
              this.$message.success('操作成功')
              this.$emit('backToParent')
            }else {
              this.$message.error(data.message)
              this.$emit('backToParent')
            }
            this.reasonVisible = false
          }
        }) 
      },
     unitChange(val) {
       getUnitInfo(val).then(info => {
        if(info) {
          this.unitInfo = info
          this.unitForm.companyId = info.id
          this.unitForm.companyContactPeople  = info.contactPeople
          this.unitForm.companyContactPhone  = info.contactPhone
          this.unitForm.companyEmail  = info.mailAddress
          this.baseInfo.contactPeople = info.contactPeople
          this.baseInfo.contactPhone = info.contactPhone
          this.baseInfo.email = info.mailAddress
          this.$refs.unitInfoForm.validate()
          this.$refs.baseInfoForm.validate()
          
        }
      })
    },
    vali() {   //验证基本信息表单规格
         let baseFlag = false
         let unitFlag = false
         
         this.$refs.baseInfoForm.validate((valid) => {
         let info = this.baseInfo
          if(!valid) {
              ScrollTop(0,20)
              return 
            } 
            if(info.areaType == 'COMPANY_CHOOSE'){
              if(!info.year || !info.timeRange) return this.$message.error('请选择笔面试时间')
              if(!this.placeForm.place) return this.$message.error('请选择场地')
            }else {
              if(!info.startTime || !info.startDate) return this.$message.error('请选择笔面试时间')
              if(info.areaDetail == ''&&info.areaType != 'ADMIN_ASSIGNMENT') {
                return this.$message.error('请填写场地')
              }
            }
            
       
           baseFlag = valid
          
         })
         this.$refs.unitInfoForm.validate((valid) => {
           if(valid) {
              unitFlag = valid
           }else {
              ScrollTop(400,20)
           }
          
         })
         return baseFlag&&unitFlag
      },
      pass() {   //管理员审核通过
        let flag = this.vali()
        if(flag) {
          let baseInfo = this.baseInfo
          let unitInfo = this.unitForm
          
          console.log(111)
          if(baseInfo.areaType != 'COMPANY_CHOOSE') { //单位自行联系或者管理员分配
           let timeRange = baseInfo.startTime
            baseInfo.beginTime = baseInfo.startDate + ' ' + timeRange[0] + ':00'
            baseInfo.endTime = baseInfo.startDate + ' ' + timeRange[1] + ':00'
            console.log(baseInfo.startDate + ' ' + timeRange[0])
          }
          if(baseInfo.areaType == 'COMPANY_CHOOSE') {  //单位选择现有场地
              let timeRange = this.baseInfo.timeRange.split('~')
              //宣讲会开始结束时间
              baseInfo.beginTime = baseInfo.year + ' ' + timeRange[0] + ':00'
              baseInfo.endTime = baseInfo.year + ' ' + timeRange[1] + ':00'
              baseInfo.areaUseId = this.placeForm.place
          }
          if(baseInfo.areaType != 'ADMIN_ASSIGNMENT') {
            baseInfo.areaCategory = ''
          }
          let obj = Object.assign({}, baseInfo, unitInfo)
          obj.isContact  = baseInfo.areaType == 'isContact'?1:0
          sAjax({
            url: '/api/employment/audit/agreeExaminationAudit',
            type: 'post',
            data: obj,
            success: (data) => {
              if(data.state) {
                this.$message.success('操作成功')
                this.$emit('backToParent')
              }
            }
          })
        }
      },
      toSubmit() {  //单位提交笔面试审核
        let flag = this.vali()
        if(flag) {
          let baseInfo = this.baseInfo
          if(this.baseInfo.areaType == 'COMPANY_CHOOSE') {
            let timeRange = baseInfo.timeRange.split('~')
            baseInfo.beginTime = baseInfo.year + ' ' + timeRange[0] + ':00'
            baseInfo.endTime = baseInfo.year + ' ' + timeRange[1] + ':00'
            baseInfo.areaUseId = this.placeForm.place
          }else {
            let timeRange = baseInfo.startTime
            baseInfo.beginTime = baseInfo.startDate + ' ' + timeRange[0] + ':00'
            baseInfo.endTime = baseInfo.startDate + ' ' + timeRange[1] + ':00'
          }
          
          console.log(baseInfo)
          let unitInfo = this.unitForm
          let obj = Object.assign({}, baseInfo, unitInfo,)
          obj.isContact  = baseInfo.areaType == 'isContact'?1:0
          
          let url
          
          if(this.defaultInfo) {
            url = '/api/employment/manage/examination/update'
          }else {
            url = '/api/employment/manage/examination/addExamination'
          }
          sAjax({
            url:  url,
            type: 'post',
            data: obj,
            success: (data) => {
              if(data.state) {
                if(this.defaultInfo) {
                  this.$message.success('修改成功')
                }else {
                  this.$message.success('提交成功')
                }
                this.$emit('backToParent')
              }else {
                this.$message.error(data.message)
              }
            }
          })
        }
    },
    setDefault() {
       let info = this.defaultInfo
        console.log(info)
        this.baseInfo = {  //基本信息
          id: info.id,
          examinationName: info.title,
          type:info.type,
          areaType: info.areaType?info.areaType:'isContact',
          timeRange:'',
          timeOptions:[],
          // contactPhone: info.contactPhone,
          // contactPeople: info.contactPeople,
          // email: info.email,
          areaDetail: info.areaDetail,
          areaRequirement: info.areaDescription,
          // areaCategory:'',
        }
        
        this.unitInfo = this.defaultInfo.companyInfo 
        if(info.areaType == 'COMPANY_CHOOSE') {  //单位选择管理员提供的场地
            let startTimeStr = info.beginTime.split(' ')[1]
            let endTimeStr = info.endTime.split(' ')[1]
            this.firstState = true
            this.$set(this.baseInfo,'year',info.beginTime.split(' ')[0])
            this.dateChange(info.beginTime.split(' ')[0])//根据日期获取可用时间段
            this.usableTimesChange(startTimeStr.substring(0,startTimeStr.length-3)+'~'+endTimeStr.substring(0,endTimeStr.length-3))
            this.$set(this.baseInfo,'timeRange',startTimeStr.substring(0,startTimeStr.length-3)+'~'+endTimeStr.substring(0,endTimeStr.length-3))
            
            this.baseInfo.timeOptions.push(this.baseInfo.timeRange)
            this.$set(this.placeForm,'place',info.areaUseId)
            
             this.curUsablePlaceInfo = {
                id:info.areaUseId,
                name: info.areaName,
                peopleNum: info.areaPeopleNum,
                description: info.areaDescription,
              }
              this.firstState = true
         }else {
          let startTimeStr = info.beginTime.split(' ')[1]
          let endTimeStr = info.endTime.split(' ')[1]
          this.$set(this.baseInfo,'startDate',info.beginTime.split(' ')[0])
          this.$set(this.baseInfo,'startTime',[startTimeStr.substring(0,startTimeStr.length-3),endTimeStr.substring(0,endTimeStr.length-3)])
          
         }
         if(info.createType == 'COMPANY') {
            console.log(1)
              getAreaTypeList().then(data => {
                if(data.state) {
                  this.areaTypeList = data.data
                  if(info.areaCategory) {
                      this.$set(this.baseInfo,'areaCategory',info.areaCategory+'')
                    }else {
                      this.$set(this.baseInfo,'areaCategory','')
                    }
                }
              })
          }
         this.unitForm = {
            companyContactPeople: info.companyInfo.contactPeople,
            companyEmail: info.companyInfo.mailAddress,
            companyContactPhone: info.companyInfo.contactPhone,
            companyName:info.companyInfo.companyName,
            companyId : info.companyInfo.id
          }
          console.log(this.unitForm)
          
    }
  },
  created() {
    this.catchUnitList()
    console.log(this.defaultInfo)
    if(this.defaultInfo) {
      this.setDefault()
    }
    this.getUsableDate()
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
  .unitInfo,.placeinfo{
    border-top: 1px solid #e7e7e7;
    border-bottom: none;
  }
  .placeinfo {
    padding: 30px;
    .placeInfoForm {
      margin-top: 30px;
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
    table {
      td {
        border: 1px solid #999;
      }
    }
  }
  }
  .formBtn {
      text-align: center;
      a {
        width: 150px;
        height: 44px;
        line-height: 44px;
        text-align: center;
        border: 1px solid #3e92fe;
        color: #fff;
        font-size: 16px;
        background: #3e92fe;
        margin-right: 20px;
        border-radius: 4px;
        cursor: pointer;
      }
    }
}
</style>
<style lang="less">
#addInterview {
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
}
.usablePlace {
  table {
      td {
        border: 1px solid #999;
        line-height: 20px;
        padding-left: 5px;
      }
    }
}
.baseForm {
  .el-input__inner {
  }
  .el-form-item__label {
    padding-right: 30px;
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
    .w100 .el-range-input {
      border: none!important;
    }
  .el-form-item {
    width: 40%;
    min-width: 500px;
  }
}
.el-form-item.w100 {
    width: 100%!important;
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
    padding-right: 30px;
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
</style>
