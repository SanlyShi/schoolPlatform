<template>
  <div class="psychological-student-info">
    <div class="info-container">
      <div class="submit-info col-md-12">
          <span class="title-tip">完善个人信息</span>
          <div class="info-item">
            <span class="item-title">联系方式:</span>
            <div class="info-options form-group">
              <input type="text" class="form-control" :class="formatError.contact?'error':''" v-model="formFields.contact" @change="checkContact">
            </div>
          </div>
          <div class="info-item">
            <span class="item-title">邮箱:</span>
            <div class="info-options form-group">
              <input type="text" class="form-control"  :class="formatError.email?'error':''" placeholder="请输入邮箱" v-model="formFields.email" @change="checkEmail">
            </div>
          </div>
          <div class="info-item">
            <span class="item-title">现今一起生活的家庭成员:</span>
            <div class="info-options">
              <span class="" v-for="(opt, i) in pageOptions.familyMembers" :key="i" @click="_setValue('familyMembers', opt)">
                <i class="maticon" :class="formFields['familyMembers'] && formFields['familyMembers'].indexOf(opt.key)>=0?'active':''"  v-html="icons(formFields['familyMembers'] && formFields['familyMembers'].indexOf(opt.key)>=0?'check_box':'check_box_outline_blank')"></i>{{opt.value}}
              </span>
            </div>
          </div>
          <div class="info-item">
            <span class="item-title">父母婚姻状况:</span>
            <div class="info-options">
              <span class="" v-for="(opt, i) in pageOptions.parentsMarriageSituation" :key="i" @click="_setValue('parentsMarriageSituation', opt)">
                <i class="maticon" :class="formFields['parentsMarriageSituation'] === opt.key?'active':''" v-html="icons(formFields['parentsMarriageSituation'] === opt.key?'radio_button_checked':'radio_button_unchecked')"></i>{{opt.value}}
              </span>
            </div>
          </div>
          <div class="info-item">
            <span class="item-title">家庭精神病史:</span>
            <div class="info-options">
              <span class="" v-for="(opt, i) in pageOptions.psychiatricHistory" :key="i" @click="_setValue('psychiatricHistory', opt)">
                <i class="maticon" :class="formFields['psychiatricHistory'] === opt.key?'active':''" v-html="icons(formFields['psychiatricHistory'] === opt.key?'radio_button_checked':'radio_button_unchecked')"></i>{{opt.value}}
              </span>
            </div>
          </div>
          <div class="info-item">
            <span class="item-title">是否服用药物(必填):</span>
            <div class="info-options">
              <span class="" v-for="(opt, i) in pageOptions.takeMedicine" :key="i" @click="_setValue('takeMedicine', opt)">
                <i class="maticon" :class="formFields['takeMedicine'] === opt.key?'active':''" v-html="icons(formFields['takeMedicine'] === opt.key?'radio_button_checked':'radio_button_unchecked')"></i>{{opt.value}}
              </span>
            </div>
          </div>
          <div class="info-item">
            <span class="item-title">是否有咨询经历(必填):</span>
            <div class="info-options">
              <span class="" v-for="(opt, i) in pageOptions.hasConsultingExperience" :key="i" @click="_setValue('hasConsultingExperience', opt)">
                <i class="maticon" :class="formFields['hasConsultingExperience'] === opt.key?'active':''" v-html="icons(formFields['hasConsultingExperience'] === opt.key?'radio_button_checked':'radio_button_unchecked')"></i>{{opt.value}}
              </span>
            </div>
          </div>
          <div class="info-item" v-if="hasExperience">
                <span class="item-title">咨询时间(选填):</span>
                <div class="info-options">
                  <v-datepicker :defaultValue="formFields.consultingDate" @daySelected="consultationDateSelected"></v-datepicker>
                </div>
              </div>
                <div class="info-item" v-if="hasExperience">
                <span class="item-title">咨询地点(选填):</span>
                <div class="info-options">
                  <textarea v-model="formFields.consultingAddress" rows="3" placeholder="最多输入不得超过100字..."></textarea>
                </div>
              </div>
                <div class="info-item" v-if="hasExperience">
                <span class="item-title">咨询主题(必填):</span>
                <div class="info-options">
                  <textarea v-model="formFields.consultingMainContent" rows="3" placeholder="最多输入不得超过100字..."></textarea>
                </div>
              </div>
                <div class="info-item">
                <span class="item-title">是否有精神科就医经历(必填):</span>
                <div class="info-options">
                  <span
                    class
                    v-for="(opt, i) in pageOptions.hasPsychiatricHistory"
                    :key="i"
                    @click="_setValue('hasPsychiatricHistory', opt)"
                  >
                    <i class="maticon" :class="formFields['hasPsychiatricHistory'] === opt.key?'active':''" v-html="icons(formFields['hasPsychiatricHistory'] === opt.key?'radio_button_checked':'radio_button_unchecked')" ></i> {{opt.value}}
                  </span>
                </div>
              </div>
                <div class="info-item" v-if="hasPsychiatricHistory">
                <span class="item-title">最近一次门诊时间(选填):</span>
                <div class="info-options">
                  <v-datepicker :defaultValue="formFields.localConsultingHours" @daySelected="consultingHoursSelected"></v-datepicker>
                </div>
              </div>
                <div class="info-item" v-if="hasPsychiatricHistory">
                <span class="item-title">医院(选填):</span>
                <div class="info-options">
                  <textarea v-model="formFields.hospital" rows="3" placeholder="最多输入不得超过100字..."></textarea>
                </div>
              </div>
                <div class="info-item" v-if="hasPsychiatricHistory">
                <span class="item-title">医生姓名(选填):</span>
                <div class="info-options">
                  <textarea v-model="formFields.doctor" rows="3" placeholder="最多输入不得超过50字..."></textarea>
                </div>
              </div>
               <div class="info-item" v-if="hasPsychiatricHistory">
                <span class="item-title">服用药物(选填):</span>
                <div class="info-options">
                  <textarea v-model="formFields.drug" rows="3" placeholder="最多输入不得超过100字..."></textarea>
                </div>
              </div>
          <div class="info-item">
            <span class="item-title">备注:</span>
            <div class="info-options">
              <textarea v-model="formFields.remark" rows="3" placeholder="最多输入不得超过200字..."></textarea>
            </div>
          </div>
          <div class="divide-line"></div>
          <div class="info-footer">
            <button class="agree" @click="_submit">保存</button>
          </div>
        </div>
    </div>
        
  </div>
</template>
<script>
  import { sAjax } from '../../assets/utils/utils';
  export default {
    props: {
      data: {
        default: null
      }
    },
    data: function () {
      return {
        hasExperience:false,
        hasPsychiatricHistory:false,
        formFields: {},
        pageOptions: {
          familyMembers: [],
          parentsMarriageSituation: [{
            key: '在婚',
            value: '在婚'
          }, {
            key: '再婚',
            value: '再婚'
          }, {
            key: '离异',
            value: '离异'
          }, {
            key: '丧偶',
            value: '丧偶'
          }],
          psychiatricHistory: [{
            key: true,
            value: '有'
          }, {
            key: false,
            value: '无'
          }],
          takeMedicine: [{
            key: true,
            value: '是'
          }, {
            key: false,
            value: '否'
          }],
          hasConsultingExperience: [{
            key: true,
            value: '是'
          }, {
            key: false,
            value: '否'
          }],
          hasPsychiatricHistory: [{
            key: true,
            value: '是'
          }, {
            key: false,
            value: '否'
          }]
        },
        formatError: {
          email: false,
          contact: false
        }
      }
    },
    methods: {
      consultationDateSelected(data){
          this.formFields.consultingDate = data.value.substring(0,10)
      },
      consultingHoursSelected(data){
        this.formFields.localConsultingHours = data.value.substring(0,10)
      },
      _submit: function () {
        if(this.formFields.remark.length>220){
          this.$toast("备注输入不得超过200字！")
          return
        }
        sAjax({
          url: '/api/mentality/reservation/myStudentInfo',
          type: 'post',
          data: this.formFields,
          success: (data) => {
            if (data.state) {
              this.$toast('保存成功')
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _init: function () {
        sAjax({
          url: '/api/mentality/reservation/myStudentInfo',
          type: 'get',
          success: (data) => {
            if (data.state) {
              if (data.data) {
                for (var i in data.data) {
                  this.$set(this.formFields, i, data.data[i])
                   this.hasExperience = this.formFields.hasConsultingExperience
                    if(this.formFields.hasPsychiatricHistory){
                      this.hasPsychiatricHistory = this.formFields.hasPsychiatricHistory
                    }
                    else{
                      this.hasPsychiatricHistory = false
                      this.formFields.hasPsychiatricHistory = false
                    }
                }
              }
            } else {
              this.$toast('个人信息初始失败：' + data.message)
            }
          }
        })
      },
      checkContact: function () {
        var re = /^1[3456789]\d{9}$/
        if (re.test(this.formFields.contact)) {
          this.formatError.contact = false
        } else {
          this.$toast('联系方式格式不正确')
          this.formatError.contact = true
          return
        }
      },
      checkEmail: function () {
        var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
        if (re.test(this.formFields.email)) {
          this.formatError.email = false
        } else {
          this.$toast('邮箱格式不正确')
          this.formatError.email = true
          return
        }
      },
      _setValue: function (field, opt) {
        if(field === "hasPsychiatricHistory" ){
          if(opt.value == '是'){
            this.hasPsychiatricHistory = true
          }
          else{
            this.hasPsychiatricHistory = false
          }
        }
            if(field === "hasConsultingExperience" ){
          if(opt.value == '是'){
            this.hasExperience = true
          }
          else{
            this.hasExperience = false
          }
        }
        if (field === 'familyMembers') {
          if (!this.formFields[field]) {
            this.$set(this.formFields, field, [])
          }
       
          var index = this.formFields[field].indexOf(opt.key)
          if (index >= 0) {
            this.formFields[field].splice(index, 1)
          } else {
            this.formFields[field].push(opt.key)
          }
        } else {
          this.$set(this.formFields, field, opt.key)
        }
      },
      _getFamilyMembers: function () {
        sAjax({
          url: '/api/system/dicts?dictType=家庭成员类型',
          type: 'get',
          success: (data) => {
            if (data.state) {
              data.data.forEach((ele) => {
                ele.key = ele.value
                ele.value = ele.label
              })
              this.pageOptions.familyMembers = data.data
            }
          }
        })
      },
    },
    created: function () {
      this._init()
      this._getFamilyMembers()
    }
  }
</script>
<style lang="less">
.psychological-student-info {
  height: 100%;
  .info-container {
    overflow-y:auto ;
    min-width: 768px;
    height: 100%;
    padding: 24px 50px;
    background: #fff;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
  }
  .info-container::-webkit-scrollbar{
    display: none;
  }
  .submit-info {
    position: relative;
    padding: 20px 24px;

    .divide-line {
      margin: 13px -26px 19px;
    }
    .info-item {
      margin-bottom: 12px;
      overflow: hidden;
      .item-title {
        display: block;
        float: left;
        width: 185px;
        margin-right: 10px;
        font-size: 14px;
        font-weight: bold;
        color: #333333;
        letter-spacing: 0;
        text-align: right;
        line-height: 28px;
      }
      .info-options {
        float: left;
        width: 360px;
        span {
          display: inline-block;
          margin-left: 8px;
          margin-bottom: 12px;
          font-size: 14px;
          color: #555555;
          letter-spacing: 0.6px;
          text-align: left;
          line-height: 24px;
          cursor: pointer;
          i {
            float: left;
            margin-right: 2px;
            font-size: 22px;
            color: #d9d9d9;
          }
        }
      }
      input,
      textarea {
        border: 1px solid #d9d9d9;
        border-radius: 3px;
        width: 100%;
        padding: 3px 8px;
        resize: none;
        outline: none;
        &.error {
          border: 1px solid red;
        }
      }
      input {
        width: 60%;
        padding: 5px 8px;
      }
    }
    .info-footer {
      span {
        margin-right: 32px;
        font-size: 14px;
        color: #298df7;
        letter-spacing: 0;
        text-align: right;
        cursor: pointer;
      }
      button {
      }
    }
    .title-tip {
      display: block;
      margin-bottom: 10px;
      font-size: 14px;
      font-weight: bold;
      color: #298df7;
      letter-spacing: 1px;
      text-align: left;
    }
  }
  .agree {
    width: 110px;
    height: 40px;
    margin-top: 24px;
    margin-left: 50px;
    color: #fff;
    font-size: 16px;
    line-height: 40px;
    border: none;
    outline: none;
    box-shadow: 0 0 2 0 rgba(0, 0, 0, 0.12), 0 2 2 0 rgba(0, 0, 0, 0.12);
    border-radius: 3px;
    background: #298df7;
    &:hover {
      background: rgb(121, 137, 230);
    }
  }
}
</style>
