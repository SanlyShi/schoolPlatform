/**宣讲会新增（编辑） 管理员、单位共用 */
<template>
  <div id="baseInfo">
    <div class="baseInfo">
      <div class="title clearfix">
        <h1>
          <span>
            <em></em>
            <i>基本信息</i>
          </span>
        </h1>
      </div>

      <!-- 单位新增宣讲会基本信息表单 或者管理员编辑宣讲会 -->
     
      <div class="baseInfoForm" v-if="loginType.loginType=='COMPANY' || defaultInfo">
        <el-form :model="baseInfo" :rules="baseInfoRules" ref="baseInfoForm" label-width="170px">
          <el-form-item prop="title" label="宣讲会标题：">
            <el-input v-model="baseInfo.title" ></el-input>
          </el-form-item>
          <el-form-item label="所在学校：">
            <el-input v-model="baseInfo.schoolName" ></el-input>
          </el-form-item>
          <template v-if="placeRule">
            <el-form-item label="场地类型：" prop="areaType" class="w100" v-if="defaultInfo&&defaultInfo.createType == 'COMPANY'|| (!defaultInfo&&loginType.loginType=='COMPANY')">
            <el-radio-group v-model="baseInfo.areaType" @change="areaTypeChange">
              <!-- 管理员提供场地 -->
              <el-radio label="COMPANY_CHOOSE" v-if="placeRule.allocationScheme=='COMPANY_CHOOSE' || (defaultInfo&&defaultInfo.areaType == 'COMPANY_CHOOSE')">选择可用场地</el-radio>
              <!-- 管理员吧不提供场地 根据管理员是否允许单位自行联系-->
              <el-radio label="isAllow" v-if="placeRule.isAllow == 1||baseInfo.areaType == 'isAllow'">自行联系</el-radio>
              <!-- v-if="placeRule.allocationScheme == 'ADMIN_ASSIGNMENT'&&placeRule.isAllow == 1" -->
              
              <el-radio label="ADMIN_ASSIGNMENT" v-if="placeRule.allocationScheme == 'ADMIN_ASSIGNMENT'|| (defaultInfo&&defaultInfo.areaType == 'ADMIN_ASSIGNMENT')" >管理员分配场地</el-radio>
            </el-radio-group>
          </el-form-item>
          </template>
          
          <div class="areaExplain" v-if="baseInfo.areaType == 'ADMIN_ASSIGNMENT' || (defaultInfo&&defaultInfo.areaExplain)">
            <el-collapse accordion>
               <el-collapse-item>
                <template slot="title">
                <span class="title"><i class="header-icon el-icon-info"></i><em>宣讲会场地说明：</em></span>
                </template>
               <div class="content" v-html="placeRule.areaExplain"></div>
               </el-collapse-item>
            </el-collapse>
          </div>
          <el-form-item label="场地：" prop="areaDetail" v-if="baseInfo.areaType == 'isAllow' || (defaultInfo&&defaultInfo.createType != 'COMPANY')">
             <el-input v-model="baseInfo.areaDetail"></el-input>
          </el-form-item>
          <el-form-item label="场地要求：" class="w100" v-if="(baseInfo.areaType=='ADMIN_ASSIGNMENT'&&loginType.loginType =='COMPANY') ||((defaultInfo&&defaultInfo.createType == 'COMPANY')&&baseInfo.areaType=='ADMIN_ASSIGNMENT')">
             <el-input placeholder="请填入场地、时间要求等" type="textarea" rows='4' resize='none' v-model="baseInfo.areaRequirement"></el-input>
          </el-form-item>
         <!-- 场地类别 -->
          <el-form-item label="场地类别" prop='areaCategory' v-if="(baseInfo.areaType=='ADMIN_ASSIGNMENT'&&loginType.loginType =='COMPANY') ||((defaultInfo&&defaultInfo.createType == 'COMPANY')&&baseInfo.areaType=='ADMIN_ASSIGNMENT')">
            <el-select style='width: 100%;' v-model="baseInfo.areaCategory " placeholder="请选择场地类别">
              <el-option
                v-for="item in areaTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="reciveTime" label='简历接收时间：' v-if="baseInfo.areaType!='COMPANY_CHOOSE'">
              <!-- <span slot="label">
              <em style="color: #d25050">*</em>简历接收时间：
              </span> -->
              <el-date-picker
                v-model="baseInfo.reciveTime"
                type="daterange"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
          </el-form-item>
          
          <el-form-item class="w100" v-if="baseInfo.areaType=='COMPANY_CHOOSE'">
            <span slot="label">
              <em style="color: #d25050">*</em>宣讲会时间：
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
                @change="dateChange"
                :picker-options="pickerOptions"
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
            <!-- 自行联系的宣讲会时间 -->
             <el-form-item class="w100" v-if="baseInfo.areaType=='ADMIN_ASSIGNMENT'||baseInfo.areaType=='isAllow'">
              <span slot="label">
                <em style="color: #d25050">*</em>宣讲会时间：
              </span>
              <div class="selfcontact">
                <el-date-picker  format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" v-model="baseInfo.startDate" type="date" placeholder="选择日期"></el-date-picker>
                <el-time-picker
                  is-range
                  value-format="HH:mm"
                  format="HH:mm"
                  v-model="baseInfo.startTime"
                  @change="contactDataChange"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="选择时间范围">
                </el-time-picker>
              </div>
            </el-form-item>
          <!-- <el-form-item label="是否需要笔面试：" v-if="baseInfo.areaType!='COMPANY_CHOOSE'">
            <el-radio-group v-model="baseInfo.needExamination" >
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item> -->
        </el-form>
      </div>

        <!-- 管理员基本信息表单  只有管理员新增宣讲会才会走这边-->
        <div class="baseInfoForm" v-if="loginType.loginType!='COMPANY'&&!defaultInfo">
        <el-form :model="baseInfo"  ref="baseInfoForm" :rules="baseInfoRules" label-width="170px">
          <el-form-item prop="title" label="宣讲会标题：">
            <el-input v-model="baseInfo.title" ></el-input>
          </el-form-item>
          <el-form-item label="所在学校：">
            <el-input v-model="baseInfo.schoolName" ></el-input>
          </el-form-item>
          <el-form-item class="w100">
              <span slot="label">
                <em style="color: #d25050">*</em>宣讲会时间：
              </span>
              <div class="selfcontact">
                <el-date-picker format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" v-model="baseInfo.startDate" type="date"  placeholder="选择日期"></el-date-picker>
                <el-time-picker
                  is-range
                  value-format="HH:mm"
                  format="HH:mm"
                  v-model="baseInfo.startTime"
                  @change="contactDataChange"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="选择时间范围">
                </el-time-picker>
              </div>
            </el-form-item>
          <el-form-item label="场地：" prop="areaDetail">
             <el-input v-model="baseInfo.areaDetail"></el-input>
          </el-form-item>
          <el-form-item prop="reciveTime" label='简历接收时间：'>
              <!-- <span slot="label">
              <em style="color: #d25050">*</em>简历接收时间：
              </span> -->
              <el-date-picker
                v-model="baseInfo.reciveTime"
                type="daterange"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
          </el-form-item>
          <!-- <el-form-item label="是否需要笔面试：">
            <el-radio-group v-model="baseInfo.needExamination" >
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item> -->
        </el-form>
      </div>


    </div>
      <!-- //场地信息表单 -->
      <!-- 场地信息当有选择可用时间段后出现 -->
      <div class="placeInfo" v-if="baseInfo.areaType=='COMPANY_CHOOSE'"> 
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
                <h2 v-html="'场地说明：' + curUsablePlaceInfo.description"></h2>
              </div>
            </el-form-item>
            <el-form-item prop="reciveTime" label='简历接收时间：'>
              <!-- <span slot="label">
              <em style="color: #d25050">*</em>简历接收时间：
              </span> -->
              <el-date-picker
                v-model="placeForm.reciveTime"
                type="daterange"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <!-- <el-form-item label="是否需要现场笔面试：">
              <el-radio-group v-model="placeForm.needExamination" >
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item> -->
          </el-form>
        </div>
      </div>
      </div>
  </div>
</template>
<script>
  import {getUsableTimeOfPlace, getUsablePlace,getUsableDate} from '../../../api/placeManage/api'
  import {getSchool,ScrollTop,getDate2Useable,date2time,getAreaTypeList} from '../../../api/api'
  export default {
    // placeRule:场地规则对象 isAllow: 1允许自行单位自行选择
    //editStatus 是否是管理员审核
    props: ['isEdit', 'placeRule','loginType','defaultInfo','editStatus'],
    data() {
      return {
        firstState: true,
        areaTypeList:[],
        usablePlace:[],//可选场地列表\
        curUsablePlaceInfo: {},//当前选中的场地信息
        usableDate:[],//
        pickerOptions: {
          disabledDate: (time) => {
            // console.log(date2time(time))
            return this.usableDate.indexOf(date2time(time))<0
          }
        },//可用日期
        date:'',
        
        baseInfo: {
          title: '',//标题
          schoolName: '',//学校名称
          areaType: '',//场地分配类型   （单位根据已有的选择或者管理员分配
          areaRequirement:'',//场地要求
          areaDetail:'',
          date:'',
          year: '',
          timeRange: '',
          startDate:'',
          startTime:'',
          needExamination: '',//是否需要笔面试
          reciveTime:'',
          timeOptions:[],//可选时间段
          beginTime:'',//宣讲会开始时间
          endTime:'',//宣讲会结束时间
          areaCategory: '',
        },
        baseInfoRules: {
          title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
          areaType: [{ required: true, message: '请选择场地类型', trigger: 'change' }],
          areaDetail: [{ required: true, message: '请填写场地名称', trigger: 'blur' }],
          //year:[{ required: true, message: '请选择宣讲会时间', trigger: 'change' }],
          reciveTime:[{ required: true, message: '请选择简历接收时间', trigger: 'change' }],
          areaCategory: [{ required: true, message: '请选择场地类别', trigger: 'change' }],
        },
        placeForm: {
          place:'',
          reciveTime:'',//简历接收时间
          needExamination:'',//是否需要现场笔面试
        },
        placeFormRule: {
          place:[{required: true,message:'请选择可用场地',trigger:'blur'}],
          //reciveTime:[{ required: true, message: '请选择简历接收时间', trigger: 'change' }]
        }
      }
    },
    
    methods: {
      areaTypeChange() {
        this.$refs['baseInfoForm'].clearValidate()
      },
      catchAreaTypeList() {  //获取场地类别
        getAreaTypeList().then(data => {
          if(data.state) {
            this.areaTypeList = data.data
          }
        }) 
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
              // this.pickerOptions = {
                // disabledDate(time) {
                    // return data.data.indexOf(date2time(time)) < 0
                  // }
              // }
            }else {
              this.usableDate = []
            }
          }
        })
      },
      clickDate(vm) {
        console.log(vm)
        this.$emit('pick', new Date())
      },
      vali() {   //验证基本信息表单规格
         let flag = false
         this.$refs.baseInfoForm.validate((valid) => {
           let info = this.baseInfo
            console.log(info)
            if(this.loginType.loginType !='COMPANY') {//管理员debugger
            
              if(info.areaType == 'isAllow' || info.areaType == '') {
                if(!info.startTime||!info.startDate) return this.$message.error('请选择宣讲会时间')
                if(!info.reciveTime) return this.$message.error('请选择简历接收时间')
              }
               if(info.areaType == 'COMPANY_CHOOSE') {
                if(!this.placeForm.place) return this.$message.error('请选择场地')
              }
            }else {   //单位
              if(!this.placeRule) return this.$message.error("请先添加场地规则")
              if(info.areaType == 'isAllow') {
                  if(!info.startTime||!info.startDate) return this.$message.error('请选择宣讲会时间')
                  if(!info.reciveTime) return this.$message.error('请选择简历接收时间')
                }
                if(info.areaType == 'COMPANY_CHOOSE') {
                  if(!info.timeRange||!info.year) return this.$message.error('请选择宣讲会时间')
                  if(!this.placeForm.reciveTime) return this.$message.error('请选择简历接收时间')
                  if(!this.placeForm.place) return this.$message.error('请选择场地')
                }
            }
           flag = valid
           if(!flag) {
             ScrollTop(0,20)
           }
         })
         return flag
      },
      toSubmit() {  //触发提交事件
      // return new Promise((resolve,reject) => {
        let info = this.baseInfo
        // }
        info.selfContact = info.areaType == 'isAllow'?1:0

        // 可能会有问题   to do。。。。。。。。。。。。。。。。。。
        if(info.areaType != 'COMPANY_CHOOSE') { //单位自行联系或者管理员分配
          let reciveTime = info.reciveTime
          let timeRange = info.startTime
          info.resumeReceiveBeginTime = reciveTime[0] + ' 00:00:00'
          info.resumeReceiveEndTime = reciveTime[1] + ' 00:00:00'
       
          info.beginTime = info.startDate + ' ' + timeRange[0] + ':00'
          info.endTime = info.startDate + ' ' + timeRange[1] + ':00'
          info.addressDetail = ''
          console.log(info.startDate + ' ' + timeRange[0])
          if(info.areaType == 'ADMIN_ASSIGNMENT') {
            info.areaExplain = this.placeRule.areaExplain
          }
        }
        if(info.areaType == 'COMPANY_CHOOSE') {  //单位选择现有场地
          let reciveTime = this.placeForm.reciveTime
          let timeRange = this.baseInfo.timeRange.split('~')
          //简历接收时间
          info.resumeReceiveBeginTime = reciveTime[0] + ' 00:00:00'
          info.resumeReceiveEndTime = reciveTime[1] + ' 00:00:00'
          //宣讲会开始结束时间
          info.beginTime = info.year + ' ' + timeRange[0] + ':00'
          info.endTime = info.year + ' ' + timeRange[1] + ':00'
          // 是否需要笔面试
          // info.needExamination =  this.placeForm.needExamination?1:0
          info.areaUseId = this.placeForm.place
        }
        // if(info.areaType != 'isAllow') {
        //     info.areaDetail = ''
        //   }
        if(info.areaType != 'ADMIN_ASSIGNMENT') {
          info.areaCategory = ''
        }
        console.log(info)
      // })
        
      },
      placeTypeChange(val) { //场地类型radio回调
      },
      dateChange(val) {  //日期回调函数  宣讲会时间 （选择可用场地
        getUsableTimeOfPlace(val).then(data => {
          //设置可选日期
          if(val) {
            let cur
          }
         
          this.baseInfo.timeRange = ''
          if(!this.firstState) {
             this.placeForm.place = ''
          }
          //  this.placeForm.place = ''
           if(data.length) {
             this.baseInfo.timeOptions = data
           }else {
             this.baseInfo.timeRange = ''
             this.baseInfo.timeOptions = []
           }
           if(this.defaultInfo) {
             let startDate = this.defaultInfo.beginTime.split(' ')[0]
             if(this.defaultInfo.areaUseId&&this.baseInfo.year == startDate) {
                let startTimeStr = this.defaultInfo.beginTime.split(' ')[1]
                let endTimeStr = this.defaultInfo.endTime.split(' ')[1]
                let date = startTimeStr.substring(0,startTimeStr.length-3)+'~'+endTimeStr.substring(0,endTimeStr.length-3)
                // if(this.baseInfo.timeRange  == range) {
                  if(!this.firstState) {
                     this.baseInfo.timeRange = ''
                    }else {
                      this.baseInfo.timeRange = date
                    }
                    if(this.baseInfo.timeOptions.indexOf(date) < 0 ) {
                      this.baseInfo.timeOptions.push(date)
                    }
                  
                // }
             }else {
               this.baseInfo.timeRange = ''
             }
                this.firstState = false
           }
        })
        
      },
      contactDataChange(val) { //日期回调函数  宣讲会时间 （自行联系
        console.log(val)
      },
      usableTimesChange(val) {   //可用时间段选择回调
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
                    name: this.defaultInfo.areaName,
                    id: this.defaultInfo.areaUseId,
                    peopleNum:  this.defaultInfo.areaPeopleNum,
                    description:  this.defaultInfo.areaDescription,
                  })
                }
                
              }
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

     // 设置学校默认名字
      catchSchool() {
        getSchool().then(data=> {
          if(data.state) {
            this.baseInfo.schoolName = data.data.name
          }
        })
      },
      setDefaultInfo() {   //如果是管理查看待审核的宣讲会，直接是编辑状态
        if(this.defaultInfo) {   //管理员编辑已通过审核的宣讲会
          let info = this.defaultInfo
          console.log(info)
          // this.placeRule.allocationScheme = info.areaType
          // this.placeRule.isAllow =  info.isAllow
          this.baseInfo = {
              id: info.id,
              title: info.title,
              schoolName: info.schoolName,
              areaType: info.areaType?info.areaType:'isAllow',
              areaRequirement:info.areaRequirement,
              areaDetail:info.areaDetail,
              addressDetail:info.addressDetail,
              timeRange: '',
              // startDate:'',
              areaExplain: info.areaExplain,
              // startTime:'',
              // needExamination: info.needExamination,
              // reciveTime:'',
              timeOptions:[],//可选时间段
              // beginTime:'',//宣讲会开始时间
              // endTime:'',//宣讲会结束时间
            }
           // this.baseInfo.reciveTime = [info.resumeReceiveBeginTime.split(' ')[0],info.resumeReceiveEndTime.split(' ')[0]]
            if(info.areaType == 'isAllow' || info.areaType != 'COMPANY_CHOOSE') {  //管理员分配或者自行联系
              let startTimeStr = info.beginTime.split(' ')[1]
              let endTimeStr = info.endTime.split(' ')[1]
              this.$set(this.baseInfo,'startDate',info.beginTime.split(' ')[0])
              this.$set(this.baseInfo,'startTime',[startTimeStr.substring(0,startTimeStr.length-3),endTimeStr.substring(0,endTimeStr.length-3)])
              console.log(this.baseInfo.startTime)
              this.$set(this.baseInfo,'reciveTime',[info.resumeReceiveBeginTime.split(' ')[0],info.resumeReceiveEndTime.split(' ')[0]])
              // this.$set(this.baseInfo,'needExamination',info.needExamination+'')
              
              // this.baseInfo.startTime = 
              if(info.createType == 'COMPANY') {
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
            }
            if(info.areaType == 'COMPANY_CHOOSE') {
              let startTimeStr = info.beginTime.split(' ')[1]
              let endTimeStr = info.endTime.split(' ')[1]
              this.firstState = true
              this.$set(this.baseInfo,'year',info.beginTime.split(' ')[0])
              this.dateChange(info.beginTime.split(' ')[0])//根据日期获取可用时间段
              this.usableTimesChange(startTimeStr.substring(0,startTimeStr.length-3)+'~'+endTimeStr.substring(0,endTimeStr.length-3))
              // this.$set(this.baseInfo,'timeRange','01:00~03:00')
             
              // setTimeout(() => {
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
              // },20)
              
              this.$set(this.placeForm,'reciveTime',[info.resumeReceiveBeginTime.split(' ')[0],info.resumeReceiveEndTime.split(' ')[0]])
              // this.$set(this.placeForm,'needExamination',info.needExamination+'')
            }
           

        }
      }
    },
    created() {
      console.log(this.placeRule)
      this.catchSchool()
      this.setDefaultInfo()
      this.getUsableDate()
      if(this.loginType.loginType == 'COMPANY') {
        this.catchAreaTypeList()
      }
    }
  }
</script>
<style lang="less" scoped>
#baseInfo {
  margin-bottom: 30px;
 
  .baseInfo {
    padding: 0 30px;
  }
  .placeInfo {
    padding: 30px;
    border-top: 1px solid #e7e7e7;
    .placeInfoForm {
      margin-top: 30px;
    }
  }
  .baseInfoForm {
    margin-top: 30px;
  }
   .w100 {
      width: 100%;
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
</style>
<style lang="less">
.usablePlace {
  table {
      td {
        border: 1px solid #999;
        line-height: 20px;
        padding-left: 5px;
      }
    }
}
.baseInfo,.placeInfo {
  .el-form {
    .el-form-item {
      width: 40%;
      min-width: 500px;
      .el-form-item__label {
        padding-right: 30px;
      }
      label {
        color: #666;
      }
    }
    .el-radio-group {
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
      .el-radio__input.is-checked + .el-radio__label,
      .el-radio__label {
        color: #000;
        font-weight: bold;
      }
    }
    .el-range-input {
      border: none !important;
    }
    .el-range-separator {
      width: 50px;
    }
  }
  .el-date-editor--daterange {
    width: 100%!important;
    border: 1px solid #979797;
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
