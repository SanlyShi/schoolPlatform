/**单位新增笔面试 */
<template>
  <div id="addInterview">
    <div class="baseInfo">
      <h1 class="clearfix title"><span><em></em><i>基本信息</i></span></h1>
      <div class="baseForm">
        <el-form :model="baseInfo" ref="baseForm" :rules="baseInfoRules"  label-width="150px">
          <el-form-item prop="title" label="笔/面试标题：">
            <el-input v-model="baseInfo.title"></el-input>
          </el-form-item>
          <el-form-item  label="类型：" prop='type'>
             <el-radio-group  v-model="baseInfo.type">
                  <el-radio :label="3">面试</el-radio>
                  <el-radio :label="6">笔试</el-radio>
              </el-radio-group>
          </el-form-item>
          <el-form-item  label="场地类型：">
              <el-radio-group v-model="baseInfo.placeType" @change="placeTypeChange">
                  <el-radio :label="3">选择可用场地</el-radio>
                  <el-radio :label="6">自行联系</el-radio>
              </el-radio-group>
          </el-form-item>
          <el-form-item prop="date" label="笔/面试时间：" class="w100">
            <el-date-picker
              v-model="baseInfo.date"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
             <el-time-picker
                is-range
                value-format="hh:mm"
                format="hh:mm"
                v-model="baseInfo.time"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围">
              </el-time-picker>
          </el-form-item>

          <!-- 这部分内容只有在单位自行选择可用场地出现 -->
          <div class="bySelf"  v-if="!choiceBySelf">
            <el-form-item label="笔/面试场地：" style="margin-bottom: 5px">
              <el-input v-model="baseInfo.place"></el-input>
            </el-form-item>
            <span class="tips">若已自行联系场地，请填写详细的场地信息。若未联系，可填写场地要求，等待管理员分配</span>
            <el-form-item label="场地要求：" class="w100">
              <el-input type="textarea" rows='4' resize='none' v-model="baseInfo.demand"></el-input>
              
            </el-form-item>
            <div style="margin-bottom:15px;" class="clearfix">
            <el-form-item label="单位联系人：" class="inline" prop="concat">
              <el-input v-model="baseInfo.concat"></el-input>
            </el-form-item>
            <el-form-item label="电话：" class="inline right" prop="phone">
              <el-input v-model="baseInfo.phone"></el-input>
            </el-form-item>
          </div>
          <el-form-item label="邮箱：" prop="email">
            <el-input v-model="baseInfo.email"></el-input>
          </el-form-item>
          </div>
        </el-form>
      </div>
    </div>

        <!-- 场地信息 -->
    <div class="placeinfo" v-if="choiceBySelf">
      <h1 class="clearfix title"><span><em></em><i>场地信息</i></span></h1>
      <div class="placeForm">
        <el-form :model="placeInfo" ref="placeForm" :rules="placeInfoRules" label-width="150px">
          <el-form-item prop="place" label='场地：'>
              <el-checkbox-group v-model="placeInfo.place">
                <el-checkbox v-for="(item,index) in placeOptions" :label="item"  :key="index">{{item}}</el-checkbox>
              </el-checkbox-group>
          </el-form-item>
          <div style="margin-bottom:15px;" class="clearfix">
            <el-form-item label="单位联系人：" class="inline" prop="concat">
              <el-input v-model="placeInfo.concat"></el-input>
            </el-form-item>
            <el-form-item label="电话：" class="inline right" prop="phone">
              <el-input v-model="placeInfo.phone"></el-input>
            </el-form-item>
          </div>
          <el-form-item label="邮箱：" prop="email">
            <el-input v-model="placeInfo.email"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>

      <div class="formBtn">
        <a class="publish">保存</a>
      </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      choiceBySelf:true,//是否单位自己选择可用场地
      placeOptions:['教学楼1','教学楼2','教学楼3'],
       baseInfo: {
        title: '',
        type:3,
        placeType:3,
        date:'',
        startTime:'',
        endTime:'',
        time:'',
        place: '',
        concat:'',
        phone:'',
        eamil:'',
        demand:'',
      },
      placeInfo: {
        place: [],
        concat:'',
        phone:'',
        email:''
      },
      baseInfoRules: {
        title: [{required: true,message:'请填写笔/面试标题',trigger:'blur'}],
        type: [{required: true,message:'请选择类型',trigger:'change'}],
        // type:[{}]
      },
      placeInfoRules: {
        place: [{required: true,message:'请填写笔/面试标题',trigger:'blur'}],
        phone: [{required: true,message:'请填写电话',trigger:'blur'}],
        email: [{required: true,message:'请选择场地',trigger:'blur'},{type:'email',message:'请输入正确格式的邮箱',trigger:'blur'}],
        concat: [{required: true,message:'请填写联系人',trigger:'change'}],
      },
    }
  },
  methods: {
    placeTypeChange(val) {
      this.choiceBySelf = !this.choiceBySelf
    }
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
  .baseInfo,.placeinfo {
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
  .placeinfo {
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
}
</style>
<style lang="less">
.baseForm,.placeinfo {
  .el-input__inner {
    .el-input {
      padding: 0!important;
    }
  }
  .el-form-item__label {
    margin: 0;
    padding-right: 30px;
  }
  .el-radio-group {
    &>label {
      margin-right: 50px;
      min-width: 120px;
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
    width: 100%;
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

</style>
