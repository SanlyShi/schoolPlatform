

<template>
  <div id="placeDeatils">
    <div class="title clearfix">
      <h1><span><em></em><i>场地基本信息</i></span><a @click="changEdit" v-show="curPlaceId"><i></i><em >编辑</em></a></h1>
    </div>
    <div class="placeInfo">
      <el-form ref="placeInfo" :model="placeInfo" :rules="placeInfo_rule" label-width="150px">
        <el-form-item label="场地名称：" prop="name" >
          <el-input  v-if="isEdit" v-model="placeInfo.name" style="width: 280px;"></el-input>
          <span v-else class="input_disabled">{{curPlaceInfo.name}}</span>
        </el-form-item>
        <el-form-item label="可容纳人数：" prop='peopleNum'>
           <!-- <el-input  v-if="isEdit" type="number" v-model="placeInfo.peopleNum" style="width: 280px;"></el-input> -->
          <slot v-if="isEdit"><el-input v-model="placeInfo.peopleNum" style="width: 280px;"></el-input><i>人</i></slot>
          <span v-else class="input_disabled">{{curPlaceInfo.peopleNum  || 0 }}人</span>
        </el-form-item>
        <el-form-item label="场地说明：" style="width: 100%;">
          <u-editor style="padding-left: 40px;" ref="description" v-if="isEdit" v-model='placeInfo.description' @change="getIntroduction"></u-editor>
          <span v-else class="input_disabled" v-html="curPlaceInfo.description"></span>
        </el-form-item>
        <el-form-item style="width: 100%;">
          <span slot='label'><em style="color: #d25050">*</em>可用时间：</span>
          <a class="addRange" v-if="isEdit" @click="addTimeRange">添加时段</a>
           <div class="dateBox" v-if="isEdit" v-for="(item,index) in placeInfo.timeRangeObj" :key="index">
             <el-date-picker :picker-options="pickerOptions" @change='dateChange' format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" v-model="item.year" type="date" placeholder="选择日期"></el-date-picker>
              <el-time-picker
                is-range
                @change='timeRangeChange'
                value-format="HH:mm"
                format="HH:mm"
                v-model="item.timeRange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围">
              </el-time-picker>
              <span class="delete" @click="deteleRange(index)"><i></i></span>
           </div>
           <div class="freeTime">
             <ul :class="{'isEdit': isEdit}">
               <li v-for="time in curPlaceInfo.freeTime" :id="time.id" :class="{'isEdit': isEdit}" :key="time.id">
                 <span>{{time.date}}</span>
                 <i>{{time.startTime + ' ~ ' +time.endTime}}</i>
                 <em v-if="time.status == 'FREE'" class="delete deteleRange_data"  @click="deteleRange_data(time.id)"><i></i></em>
               </li>
             </ul>
           </div>
           <!-- <p class="errMsg" v-show="errMsg">请选择可用时间段</p> -->
          <!-- <v-datepicker v-model="placeInfo.time" format="yyyy-MM-dd hh:ii:ss"></v-datepicker> -->
        </el-form-item>
      </el-form>
      <div class="formBtn" v-show="isEdit">
        <a class="cancle" @click="cancleEdit">取消</a>
        <a class="add" @click="placeSubmit" v-html="curPlaceId?'保存':'添加'"></a>
      </div>
    </div>
  </div>
</template>
<script>
import { sAjax } from '../../../../../assets/utils/utils';
export default {
  props:['curPlaceId'],//父组件传递的当前场地信息 

  data() {
    var checkNumber = (rule, value, callback) => {
      if(value) {
        if (!isNaN(value)&&value >= 1) {
          callback();
        } else {
          return callback(new Error("人数不可小于1"));
        }
      }
        
    };
    return {  
      isEdit: false,//是否是编辑状态
      errMsg: false,//时间段选择状态
      curPlaceInfo:{},
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
          
        },
      },
      placeInfo: {
        name: '',
        peopleNum: '',
        description: '',
        time:'',
        timeRangeObj:[]
      },
      placeInfo_rule: {
        name: [{required: true,message: '请输入场地名称'}],
        //timeRangeObj: [{type:'array',required: true,message: '请选择可用时间段',trigger:'change'}]
       peopleNum: [ {validator: checkNumber, trigger: "blur" }]
      },
      // timeRangeObj: [],//添加时段
      startTime:'',
      endTime: '',

    }
  },
  methods: {
    changEdit() {
      this.isEdit = !this.isEdit
      this.placeInfo = {
        name: this.curPlaceInfo.name,
        peopleNum: this.curPlaceInfo.peopleNum,
        description: this.curPlaceInfo.description,
        timeRangeObj:[],
      }
      this.$nextTick(() => {   //切换编辑状态 清除验证结果
        this.$refs['placeInfo'].clearValidate()
      })
    },
    getIntroduction(value) {     //富文本回调
      this.placeInfo.description = value
    },
    timeRangeChange(val) { //时段改变回调
      // console.log(val)
    },
    dateChange(val) {  //日期改变回调 
      console.log(val)
    },
    addTimeRange() {  //添加时段
      this.placeInfo.timeRangeObj.push({
        year: '',
        timeRange: ''
      })
    },
    deteleRange(index) {//删除时间控件
      this.placeInfo.timeRangeObj.splice(index,1)
    },
    deteleRange_data(id) {  //删除可用时间数据
      let url = '/api/employment/area/deleteUseTimeById?id=' + id
      sAjax({
        url:url,
        type: 'post',
        success: (data) => {
          if(data.state) {
            this.getPlaceInfo()
            this.$message.success('删除成功')
          }else {
            this.message.error(data.message)
          }
        }
      })
    },
    placeSubmit() { //修改场地信息表单提交
      this.$refs['placeInfo'].validate((valid) => {
          if (valid) {
            console.log(this.placeInfo)
            let list = this.placeInfo.timeRangeObj
            let tiemArray = []//新增的时间段与原来现有的时间段的集合
            let trueTime = true
            let url = ''
            let methods = ''
            let msg = ''
            if(this.curPlaceId == '') {
              if(!list.length) {
                return this.$message.error('请添加时段')
              }
            }else {
              if(!list.length && !this.curPlaceInfo.freeTime.length) {
                return this.$message.error('请添加时段')
              }
            }
            //是否是空时间段
            list.map((val) => {
              for(let k in val) {
                if(!val[k]) {
                  trueTime = false
                  return this.$message.error('请选择可用时间段')
                }
              }
            })
            if(!trueTime) return 
            if(list.length) {  //新增时间段，没有ID，
              for(let time of list) {
                tiemArray.push({
                  beginTime: time.year + ' ' + time.timeRange[0] + ':00',
                  endTime: time.year + ' ' + time.timeRange[1] + ':00',
                })
              }
            }
            
            if(this.curPlaceId) {  //通过是否有场地Id来区分是新增还是详情
              url = '/api/employment/area/updateArea'
              methods = 'post'
              msg = '修改场地信息成功'
              let oldList = this.curPlaceInfo.freeTime
              if(oldList.length) {  //原有的时间段，有ID
                  for(let time of oldList) {
                    tiemArray.push({
                      id: time.id,
                      beginTime: time.date + ' ' + time.startTime,
                      endTime: time.date + ' ' +time.endTime,
                      status: time.status
                    })
                  }
              }
            }else {
              url = '/api/employment/area/addArea'
              methods = 'post'
              msg = '新增场地成功'
            }
            let data = {
              id: this.curPlaceId,
              name: this.placeInfo.name,
              peopleNum:this.placeInfo.peopleNum,
              description: this.placeInfo.description,
              areaUseVOList: tiemArray
            }
            sAjax({
              url: url,
              type: methods,
              data: data,
              success: (info) => {
                if(info.state) {
                  this.placeInfo.timeRangeObj = []
                  this.$message.success(msg)
                  if(this.curPlaceId) {   //修改信息的回调
                     this.getPlaceInfo()
                  }else {
                    this.$emit('getError')  //退回上一页 ，新增场地没有ID获取不到信息
                  }
                }else {
                  // this.$emit('getError', info.message)
                  this.$message.error(info.message)
                }
              }
            })

          } else {
            //  this.errMsg = false 
          }
        });
    },
      getPlaceInfo() {
        if(!this.curPlaceId){  //新增场地
           this.isEdit = true   //新增场地默认是编辑页面
           return 
        }

        //获取场地详情
        let url = '/api/employment/area/getArea?id='+ this.curPlaceId
        sAjax({
          url: url,
          type: 'get',
          success: (data) => {
            if(data.state) {
              this.curPlaceInfo = data.data
              this.curPlaceInfo.freeTime = []
              if(this.curPlaceInfo.areaUseVOList.length) {
                for(let time of this.curPlaceInfo.areaUseVOList) {
                  let date = time.beginTime.split(' ')[0]
                  let startTime = time.beginTime.split(' ')[1]
                  let endTime = time.endTime.split(' ')[1]
                  let id = time.id
                  let status = time.status
                  this.curPlaceInfo.freeTime.push({ 
                      date: date,
                      startTime: startTime,
                      endTime: endTime,
                      id:id,
                      status: status
                  })
                }
              }
            }else {
               this.$emit('getError','获取场地信息失败,请重试')
            }
          }
        })
    },
    cancleEdit() {  //取消编辑
      this.$nextTick(() => {   //切换编辑状态 清除验证结果
          this.$refs['placeInfo'].clearValidate()
          this.isEdit = false
       })
       if(!this.curPlaceId) {
         this.$emit('getError')
       }
    }
  },
  
  mounted() {
    this.getPlaceInfo()
  }
}
</script>
<style lang="less" scoped>
  #placeDeatils {
    background: #fff;
    padding: 30px 34px 30px 26px;
    em,span,i,a {display: inline-block;vertical-align: middle;}
    h1,h2,h3{margin: 0;}
    .title {
      padding: 0 30px;
      h1 {
        color: #000;
        font-size: 16px;
      
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
    }
    .placeInfo {
      margin-top: 30px;
    }
    .dateBox {
      margin-bottom: 20px;
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
      a.cancle {
        border: 1px solid #979797;
        background: #fff;
        color: #999;
        margin-right: 45px;
      }
    }
    .errMsg {color:#F56C6C;font-size:12px;line-height: 1;padding-left: 40px;margin-top:-10px;}
    .delete{
      width: 16px;
      height: 16px;
      border-radius: 100%;
      background: #c8c8c8;
      line-height: 1;
      text-align: center;
      cursor: pointer;
      margin-left: 15px;
      i {
        background: url('/static/image/employment/close.png') no-repeat;
        width: 9px;
        height: 9px;
        background-size: contain;
      }
    }
    .deteleRange_data {
      float: right;
      margin-top: 16px;
      margin-right: 10px;
      display: none;
    }
    .freeTime {
      ul {
        margin: 0;
        padding: 0;
      }
      ul.isEdit {
        margin-left: 40px;
      }
      li {
        list-style: none;
        display: inline-block;
        color: #000;
        // font-weight: bold;
        width: 40%;
        min-width: 280px;
        height: 48px;
        line-height: 48px;
        padding-left: 30px;
        margin-bottom: 16px;
        margin-right: 20px;
        border-radius: 4px;
       
        i {
          color: #000;
        }
      }
      li.isEdit {
        background: #f5f9ff;
        cursor: pointer;
        em.deteleRange_data {
          display: block;
        }
      }
    }
  }
  
</style>
<style lang='less'>
.placeInfo {
  form {
    label,i {
      color: #666;
    }
    i {
      padding-left: 5px;
    }
    span.input_disabled {
      color: #000;
      margin-left: 30px;
    }
    .el-input,.el-form-item__error,.dateBox{
      padding-left: 40px;
      padding-top: 0;
    }
    a.addRange {
      margin-left: 40px;
      margin-bottom: 25px;
      background: #3e92fe;
      color: #fff;
      width: 140px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      border-radius: 4px;
      cursor: pointer;
    }
    textarea[name='editorValue'] {
      display: none;
    }
    .edui-editor-iframeholder {
      border: 1px solid #dcdfe6;
      border-top: 0;
      border-bottom: 0;
    }
    .el-range-input {
      border:none!important;
    }
    .el-form-item__label{
      line-height: 45px;
    }
  }
  .el-date-editor--date {padding-left: 0!important;}
  .el-date-editor .el-range-separator {width: 50px;}
  .input_disabled {
    td {
      border: 1px solid #999;
      padding-left: 12px;
    }
  }
}
</style>
