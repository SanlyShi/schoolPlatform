
<template>
  <div id="placeDeatils">
    <div class="title clearfix">
      <h1><span><em></em><i>场地基本信息</i></span><a @click="changEdit"><i></i><em>编辑</em></a></h1>
    </div>
    <div class="placeInfo">
      <el-form ref="placeInfo" :model="placeInfo" :rules="placeInfo_rule" label-width="110px">
        <el-form-item label="场地名称：" prop="name" >
          <el-input  v-if="isEdit" v-model="placeInfo.name" style="width: 280px;"></el-input>
          <span v-else class="input_disabled">{{placeInfo_disabled.name}}</span>
        </el-form-item>
        <el-form-item label="可容纳人数：" prop="number" >
          <slot v-if="isEdit"><el-input type="number" v-model="placeInfo.number" style="width: 200px;"></el-input><i>人</i></slot>
          <span v-else class="input_disabled">{{placeInfo_disabled.number}}</span>
        </el-form-item>
        <el-form-item label="场地说明：" prop="text">
          <u-editor style="padding-left: 40px;" ref="description" v-if="isEdit" v-model='placeInfo.text' @change="getIntroduction"></u-editor>
          <span v-else class="input_disabled">{{placeInfo_disabled.text}}</span>
        </el-form-item>
        <el-form-item >
          <span slot='label'><em style="color: #d25050">*</em>可用时间：</span>
          <a class="addRange" v-if="isEdit" @click="addTimeRange">添加时段</a>
           <div class="dateBox" v-if="isEdit" v-for="(item,index) of placeInfo.timeRangeObj">
             <el-date-picker @change='dateChange' format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" v-model="item.year" type="date" placeholder="选择日期"></el-date-picker>
              <el-time-picker
                is-range
                @change='timeRangeChange'
                value-format="hh:mm"
                format="hh:mm"
                v-model="item.timeRange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围">
              </el-time-picker>
              <span class="delete" @click="deteleRange(index)"><i></i></span>
           </div>
           <!-- <p class="errMsg" v-show="errMsg">请选择可用时间段</p> -->
          <!-- <v-datepicker v-model="placeInfo.time" format="yyyy-MM-dd hh:ii:ss"></v-datepicker> -->
        </el-form-item>
      </el-form>
      <div class="formBtn" v-show="isEdit">
        <a class="cancle">取消</a>
        <a class="add" @click="placeSubmit">添加</a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {  
      isEdit: false,//是否是编辑状态
      errMsg: false,//时间段选择状态
      placeInfo: {
        name: '',
        number: '',
        text: '',
        time:'',
        timeRangeObj:[]
      },
      placeInfo_rule: {
        name: [{required: true,message: '请输入场地名称'}],
        //timeRangeObj: [{type:'array',required: true,message: '请选择可用时间段',trigger:'change'}]
        // number: [],
      },
      placeInfo_disabled: {
        name: '三家村广场',
        number: '12312313',
        text: '啊是的撒旦撒旦撒',
        time:''
      },
      // timeRangeObj: [],//添加时段
      startTime:'',
      endTime: '',

    }
  },
  methods: {
    changEdit() {
      this.isEdit = !this.isEdit
      this.$nextTick(() => {   //切换编辑状态 清除验证结果
        this.$refs['placeInfo'].clearValidate()
      })
    },
    getIntroduction(value) {     //富文本回调
      this.formInfo.text = value
    },
    timeRangeChange(val) { //时段改变回调
      console.log(val)
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
    deteleRange(index) {
      console.log(index)
      this.placeInfo.timeRangeObj.splice(index,1)
      console.log(this.placeInfo.timeRangeObj)
    },
    placeSubmit() { //表单提交
      this.$refs['placeInfo'].validate((valid) => {
          if (valid) {
            let list = this.placeInfo.timeRangeObj
            if(!list.length) return this.$message.error('请添加时段')
            //是否是空时间段
            list.map((val) => {
              for(let k in val) {
                if(!val[k]) {
                  return this.$message.error('请选择可用时间段')
                }
              }
            })
            //do sth

          } else {
            //  this.errMsg = false 
          }
        });
    },
  },
  mounted() {
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
      .el-form-item {
        margin-bottom: 10px;
      }
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
    span.delete{
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
      font-weight: bold;
      margin-left: 30px;
    }
    .el-input,.el-form-item__error,.dateBox{
      padding-left: 40px;
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
  }
  .el-date-editor--date {padding-left: 0!important;}
  .el-date-editor .el-range-separator {width: 50px;}
  .editor-page {
    border: none!important;
  }
}
</style>
