<template>
  <div class="advisory-reservation-page">
    <GeminiScrollbar :scrollX="false">
      <div class="container-fluid">
        <div class="reservation-container" v-if="(!curCounselor) &&(!curClass)">
          <div class="container-fluid">
            <div class="row" v-if="firstTime === null">
              <div class="protocol-content" v-html="protocol.content"></div>
              <div class="protocol-footer">
                <div class="check-box-options">
                  <span @click="selectIsRead">
                    <i class="maticon active" v-html="icons('check_box')" v-if="isRead">check_box</i>
                    <i
                      class="maticon"
                      v-html="icons('check_box_outline_blank')"
                      v-else
                    >check_box_outline_blank</i>
                  </span>
                  <span class="icon-title">我已阅读咨询须知内容并同意以上内容</span>
                </div>
                <button
                  class="pull-right agree next-step"
                  :class="isRead?'':'disabled-click'"
                  @click="_go"
                >下一步</button>
              </div>
            </div>
            <div class="row" v-else>
              <div class="search-container">
                <div class="search-part">
                  <i class="maticon pull-left" v-html="icons('search')"></i>
                  <input type="text" placeholder="输入咨询师姓名或咨询类型" v-model="searchNameOrType">
                </div>
              </div>
            </div>
          </div>
          <div class="divide-line" v-if="firstTime !== null"></div>
          <div class="container-fluid" v-if="firstTime !== null">
            <div class="row campus-area advice">
              <!-- <el-radio v-model="adviceType" label="offline">线下咨询</el-radio> -->
              <div style="display: inline-block">
                <span class="adviceType area pull-left" @click="adviceType = 'offline'">
                
                <i   
                  class="maticon pull-left"
                  v-html="icons(adviceType === 'offline'?'radio_button_checked':'radio_button_unchecked')"></i>
                线下预约：
              </span>
              <label class="pull-left"></label>
              <div class="area-list pull-left" v-show="adviceType == 'offline'">
                <span
                  class="area"
                  v-for="(area,aIndex) in areas"
                  :key="aIndex"
                  @click="curAreaValue = area.value"
                >
                  <i
                    class="maticon pull-left"
                    v-html="icons(curAreaValue === area.value?'radio_button_checked':'radio_button_unchecked')"
                  ></i>
                  {{area.label}}
                </span>
              </div>
              </div>
              
              <div style="margin-top:20px;" v-if="counselors_online.length">
                <span class="adviceType area" @click="adviceType = 'online'">
                
                <i   
                  class="maticon pull-left"
                  v-html="icons(adviceType === 'online'?'radio_button_checked':'radio_button_unchecked')"></i>
                网上预约：
              </span>
              </div>
              <div class="selectDate">
                <label class="form-label pull-right" style="margin-bottom:0;margin-left: 24px;margin-right: 12px;">预约时间</label>
              <div class="pull-right" style="transform: translateY(-5px);">
                <v-datepicker
                  class="btn-block time-picker"
                  :clearButton="true"
                  :showTime="false"
                  format="yyyy-MM-dd"
                  @daySelected="reserveDateSelected"
                ></v-datepicker>
              </div>
              </div>
              
            </div>

            <!-- 线下预约 -->
            <div class="row counselors-area" v-if="adviceType == 'offline'">
              <div
                class="col-md-4"
                v-for="(counselor,cIndex) in counselors"
                :key="cIndex"
                v-if="(reserveDate ? !!counselor.classes.find(item => item.dateTime === reserveDate) : true) && ((counselor.teacherBaseInfo.name&&counselor.teacherBaseInfo.name.indexOf(searchNameOrType)>=0) || (counselor.synopsis&&counselor.synopsis.indexOf(searchNameOrType)>=0))&&counselor.classes.length"
              >
                <div class="counselor" v-if="counselor.classes.length">
                  <div class="counselor-top">
                    <div class="pic">
                      <!-- <i
                        class="maticon"
                        :style="{
                        fontSize: '64px',
                        marginTop: '14px'
                      }"
                        v-html="icons('person')"
                        v-if="!counselor.portrait"
                      ></i> -->
                      <img
                        :src="counselor.teacherBaseInfo.sex == '女'?picGirl:picBoy"
                        :style="{
                        width: '100%',
                        height: '100%'
                      }"
                        v-if="!counselor.portrait"
                      >
                      <img
                        :src="imageUrlPrefix + counselor.portrait"
                        :style="{
                        width: '100%',
                        height: '100%'
                      }"
                        v-else
                      >
                    </div>
                    <div class="info">
                      <label class="name">
                        {{counselor.teacherBaseInfo.name}}
                        <span class="sex">{{counselor.teacherBaseInfo.sex}}</span>
                      </label>
                      <div class="line"></div>
                      <p class="desc">
                        <span v-html="counselor.synopsis || '暂无简介'"></span>
                      </p>
                    </div>
                  </div>
                  <div class="counselor-bottom">
                    <div
                      class="bottom-item col-sm-4"
                      @click="_checkCounselor(counselor, day)"
                      v-for="(day, dIndex) in counselor.days"
                      :key="dIndex"
                      v-if="reserveDate ? day.dateTime === reserveDate : true"
                    >
                      <div
                        class="bottom-item-content"
                        :class="{
                          full: day.isFull
                        }"
                      >
                        {{_formatDate(day.dateTime)}} 周{{dayOfWeek[day.dayOfWeek]}}
                        <!-- <span class="full-tip" v-if="day.isFull">满</span> -->
                        <div class="line" v-if="dIndex%3 === 0"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="text-center"
                style="margin-top: 50px;"
                v-if="counselors.length === 0"
              >{{loading?'排班信息加载中...':'暂无排班信息'}}</div>
            </div>

            <!-- 网上预约 -->
            <div class="row counselors-area" v-else>
              <div
                class="col-md-4"
                v-for="(counselor,cIndex) in counselors_online"
                :key="cIndex"
                v-if="(reserveDate ? !!counselor.classes.find(item => item.dateTime === reserveDate) : true) && ((counselor.teacherBaseInfo.name&&counselor.teacherBaseInfo.name.indexOf(searchNameOrType)>=0) || (counselor.synopsis&&counselor.synopsis.indexOf(searchNameOrType)>=0))&&counselor.classes.length"
              >
              
              <div>
                <div class="counselor">
                  <div class="counselor-top">
                    <div class="pic">
                      <!-- <i
                        class="maticon"
                        :style="{
                        fontSize: '64px',
                        marginTop: '14px'
                      }"
                        v-html="icons('person')"
                        v-if="!counselor.portrait"
                      ></i> -->
                      <img
                        :src="counselor.teacherBaseInfo.sex == '女'?picGirl:picBoy"
                        :style="{
                        width: '100%',
                        height: '100%'
                      }"
                        v-if="!counselor.portrait"
                      >
                      <img
                        :src="imageUrlPrefix + counselor.portrait"
                        :style="{
                        width: '100%',
                        height: '100%'
                      }"
                        v-else
                      >
                    </div>
                    <div class="info">
                      <label class="name">
                        {{counselor.teacherBaseInfo.name}}
                        <span class="sex">{{counselor.teacherBaseInfo.sex}}</span>
                      </label>
                      <div class="line"></div>
                      <p class="desc">
                        <span v-html="counselor.synopsis || '暂无简介'"></span>
                      </p>
                    </div>
                  </div>
                  <div class="counselor-bottom">
                    <div
                      class="bottom-item col-sm-4"
                      @click="_checkCounselor(counselor, day)"
                      v-for="(day, dIndex) in counselor.days"
                      :key="dIndex"
                      v-if="reserveDate ? day.dateTime === reserveDate : true"
                    >
                      <div
                        class="bottom-item-content"
                        :class="{
                          full: day.isFull
                        }"
                      >
                        {{_formatDate(day.dateTime)}} 周{{dayOfWeek[day.dayOfWeek]}}
                        <!-- <span class="full-tip" v-if="day.isFull">满</span> -->
                        <div class="line" v-if="dIndex%3 === 0"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </div>
              <div
                class="text-center"
                style="margin-top: 50px;"
                v-if="counselors_online.length === 0"
              >{{loading?'排班信息加载中...':'暂无排班信息'}}</div>
            </div>

          </div>
        </div>
        <div class="reservation-container" v-if="curCounselor && (!curClass)">
          <div class="row reservation-header">
            <span class="back" @click="curCounselor = null;">
              <i class="maticon pull-left" v-html="icons('navigate_before')"></i>返回
            </span>
          </div>
          <div class="divide-line"></div>
          <div class="reservation-days">
            <div class="days-header">
              <strong>({{curCounselor.days[0].dateTime}} — {{ curCounselor.days[curCounselor.days.length-1].dateTime }})&nbsp;&nbsp;&nbsp;&nbsp;排班表</strong>
              <span class="page-control pull-right">
                <i
                  class="maticon span-block pre"
                  v-html="icons('navigate_before')"
                  @click="_prePage()"
                ></i>
                <i class="maticon span-block" v-html="icons('date_range')" @click="_selectDate"></i>
                <i
                  class="maticon span-block rotate next"
                  v-html="icons('navigate_before')"
                  @click="_nextPage()"
                ></i>
              </span>
              <!-- <span class="week span-block pull-right">周</span> -->
            </div>
            <div class="teacher-container">
              <div class="teacher-pic">
                <!-- <i
                  class="maticon"
                  :style="{
                  fontSize: '80px',
                  marginTop: '14px'
                }"
                  v-html="icons('person')"
                  v-if="!curCounselor.portrait"
                ></i> -->
                <img
                   :src="curCounselor.teacherBaseInfo.sex == '女'?picGirl:picBoy"
                  :style="{
                  width: '100%',
                  height: '100%'
                }"
                 v-if="!curCounselor.portrait"
                >
                <img
                  :src="imageUrlPrefix + curCounselor.portrait"
                  :style="{
                  width: '100%',
                  height: '100%'
                }"
                  v-else
                >
              </div>
              <div class="teacher-info">
                <p class="name-p">
                  <span class="teacher-name">{{curCounselor.teacherBaseInfo.name}}</span>
                  <span class="teacher-sex">{{curCounselor.teacherBaseInfo.sex}}</span>
                </p>
                <p class="teacher-desc">
                  <span v-html="curCounselor.synopsis || '暂无简介'"></span>
                </p>
              </div>
            </div>
            <table-date-time ref="tableDateAndTime"
            class="reservation-table"
            :data="classData"
            :curDate="curDay.dateTime"
            :times="times"
            :formatter="_formatterCell"
            @dayLoaded="_getPage"
            @cellClick="_selectClass"
            v-if="curCounselor"></table-date-time>
          </div>
        </div>
        <div class="reservation-container" v-if="curClass">
          <div class="row reservation-header">
            <span class="reservation-sure-title">确认预约</span>
          </div>
          <div class="divide-line"></div>
          <div class="row reservation-submit">
            <div class="teacher-container col-lg-6">
              <span class="title-tip">预约信息</span>
              <div class="teacher-pic">
                <img
                  :src="curCounselor.teacherBaseInfo.sex=='女'?picGirl:picBoy"
                  :style="{
                  width: '100%',
                  height: '100%'
                }"
                   v-if="!curCounselor.portrait"
                >
                <!-- <i
                  class="maticon"
                  :style="{
                  fontSize: '80px',
                  marginTop: '14px'
                }"
                  v-html="icons('person')"
                  v-if="!curCounselor.portrait"
                ></i> -->
                <img
                  :src="imageUrlPrefix + curCounselor.portrait"
                  :style="{
                  width: '100%',
                  height: '100%'
                }"
                  v-else
                >
              </div>
              <div class="teacher-info">
                <p class>咨询师：
                  <span class="teacher-name">{{curCounselor.teacherBaseInfo.name}}</span>
                  <span class="teacher-sex">{{curCounselor.teacherBaseInfo.sex}}</span>
                </p>
                <p class="teacher-desc">
                  <span v-html="curCounselor.synopsis || '暂无简介'"></span>
                </p>
                <p class>预约日期：
                  <span
                    class="teacher-name"
                  >{{curClass.dateTime}}&nbsp;&nbsp;&nbsp;&nbsp;{{curClass.timeQuantum}}</span>
                </p>
              </div>
              <div class="attention">
                <p>请仔细核对预约信息，确认信息无误后请按提交预约。
                  <br>您可以在
                  <span style="color: red;">“我的预约”</span> 里查询自己的预约记录，或者取消预约。
                </p>
              </div>
            </div>
            <div class="submit-info col-lg-6">
              <span class="title-tip">完善个人信息</span>
              <div class="info-item">
                <span class="item-title">联系方式(必填):</span>
                <div class="info-options">
                  <input
                    type="text"
                    :class="formatError.contact?'error':''"
                    v-model="formFields.contact"
                    @change="checkContact"
                  >
                </div>
              </div>
              <div class="info-item">
                <span class="item-title">邮箱(必填):</span>
                <div class="info-options">
                  <input
                    type="text"
                    :class="formatError.email?'error':''"
                    v-model="formFields.email"
                    @change="checkEmail"
                  >
                </div>
              </div>
              <div class="info-item">
                <span class="item-title">现今一起生活的家庭成员:</span>
                <div class="info-options">
                  <span
                    class
                    v-for="(opt, i) in pageOptions.familyMembers"
                    :key="i"
                    @click="_setValue('familyMembers', opt)"
                  >
                    <i
                      class="maticon"
                      v-html="icons(formFields['familyMembers'] && formFields['familyMembers'].indexOf(opt.key)>=0?'check_box':'check_box_outline_blank')"
                    ></i>
                    {{opt.value}}
                  </span>
                </div>
              </div>
              <div class="info-item">
                <span class="item-title">父母婚姻状况:</span>
                <div class="info-options">
                  <span
                    class
                    v-for="(opt, i) in pageOptions.parentsMarriageSituation"
                    :key="i"
                    @click="_setValue('parentsMarriageSituation', opt)"
                  >
                    <i
                      class="maticon"
                      v-html="icons(formFields['parentsMarriageSituation'] === opt.key?'radio_button_checked':'radio_button_unchecked')"
                    ></i>
                    {{opt.value}}
                  </span>
                </div>
              </div>
              <div class="info-item">
                <span class="item-title">家庭精神病史:</span>
                <div class="info-options">
                  <span
                    class
                    v-for="(opt, i) in pageOptions.psychiatricHistory"
                    :key="i"
                    @click="_setValue('psychiatricHistory', opt)"
                  >
                    <i
                      class="maticon"
                      v-html="icons(formFields['psychiatricHistory'] === opt.key?'radio_button_checked':'radio_button_unchecked')"
                    ></i>
                    {{opt.value}}
                  </span>
                </div>
              </div>
              <div class="info-item">
                <span class="item-title">是否服用药物(必填):</span>
                <div class="info-options">
                  <span
                    class
                    v-for="(opt, i) in pageOptions.takeMedicine"
                    :key="i"
                    @click="_setValue('takeMedicine', opt)"
                  >
                    <i
                      class="maticon"
                      v-html="icons(formFields['takeMedicine'] === opt.key?'radio_button_checked':'radio_button_unchecked')"
                    ></i>
                    {{opt.value}}
                  </span>
                </div>
              </div>
              <div class="info-item">
                <span class="item-title">是否有咨询经历(必填):</span>
                <div class="info-options">
                  <span
                    class
                    v-for="(opt, i) in pageOptions.hasConsultingExperience"
                    :key="i"
                    @click="_setValue('hasConsultingExperience', opt)"
                  >
                    <i
                      class="maticon"
                      v-html="icons(formFields['hasConsultingExperience'] === opt.key?'radio_button_checked':'radio_button_unchecked')"
                    ></i>
                    {{opt.value}}
                  </span>
                </div>
              </div>
                <div class="info-item" v-if="hasExperience">
                <span class="item-title">咨询时间(选填):</span>
                <div class="info-options">
                  <v-datepicker @daySelected="consultationDateSelected"></v-datepicker>
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
                    <i
                      class="maticon"
                      v-html="icons(formFields['hasPsychiatricHistory'] === opt.key?'radio_button_checked':'radio_button_unchecked')"
                    ></i>
                    {{opt.value}}
                  </span>
                </div>
              </div>
                <div class="info-item" v-if="hasPsychiatricHistory">
                <span class="item-title">最近一次门诊时间(选填):</span>
                <div class="info-options">
                  <v-datepicker @daySelected="consultingHoursSelected"></v-datepicker>
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
                <span class="item-title">咨询问题(必填):</span>
                <div class="info-options">
                  <textarea v-model="formFields.content" rows="3" placeholder="最多输入不得超过200字..."></textarea>
                </div>
              </div>
              <div class="info-item">
                <span class="item-title">备注:</span>
                <div class="info-options">
                  <textarea v-model="formFields.remark" rows="3" placeholder="最多输入不得超过200字..."></textarea>
                </div>
              </div>
              <div class="divide-line"></div>
              <div class="info-footer text-center">
                <span class="back" @click="_back">返回上一页</span>
                <button class="agree" @click="_submit">确认预约</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GeminiScrollbar>
    <!-- <v-modal :show="firstTimeShow" effect="fade" width="390">
      <div slot="modal-body" class="modal-body protocol-body">
        <div class="protocol-question-container text-center">
          <label>您是否首次预约？</label>
        </div>
        <div class="protocol-button-list">
          <button class="btn protocol-btn" @click="_go(true)">是</button>
          <button class="btn protocol-btn" style="margin-left: 21px;" @click="_go(false)">否</button>
        </div>
      </div>
    </v-modal> -->
  </div>
</template>
<script>
  import Vue from 'vue';
  import { sAjax } from '../../assets/utils/utils';
  import tableDateTime from './components/dateAndTimeTable.vue';
  Vue.component('table-date-time', tableDateTime)
  export default {
    props: {
      data: {
        default: null
      }
    },
    data: function () {
      return {
        adviceType: 'offline',
        picGirl: '../../../static/image/picGirl.jpeg',
        picBoy: '../../../static/image/picBoy.jpeg',
        hasExperience:false,
        hasPsychiatricHistory:false,
        loading: true,
        searchNameOrType: '',
        dayOfWeek: {
          1: '一',
          2: '二',
          3: '三',
          4: '四',
          5: '五',
          6: '六',
          7: '日',
        },
        protocol: {
          id: '',
          content: ''
        },
        firstTimeShow: false,
        firstTime: null,
        areas: [],
        counselors: [], //线下预约信息列表
        counselors_online: [], //线上预约信息列表
        times: [],
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
        curCounselor: null,
        curAreaValue: '',
        curClass: null,
        curDay: null,
        classData: [],
        formFields: {

        },
        isReservation: false,
        isRead: false,
        formatError: {
          email: false,
          contact: false
        },
        isInterviewFirst: false,
        reserveDate: ''
      }
    },
    computed: {
      curCounselorClassJson: function () {
        var j = {}
        this.curCounselor.classes.forEach((c) => {
          this.$set(j, `${c.timeQuantum}_${c.dateTime}`, c)
        })
        return j
      }
    },
    methods: {
      consultationDateSelected(data){
          this.formFields.consultingDate = data.value.substring(0,10)
      },
      consultingHoursSelected(data){
        this.formFields.localConsultingHours = data.value.substring(0,10)
      },
      _selectDate: function (ev) {
        this.$date({
          type: 'init',
          event: ev,
          value: this.curDay.dateTime,
          onSelect: (value) => {
            this.curDay = {
              dateTime: value
            }
          }
        })
      },
      _formatterCell: function (d) {
        var disabledSpan = '<div class="disabled">满</div>'
        var validSpan = '<div class="valid">预约</div>'
        var hideSpan = ''
        // console.log('d',JSON.parse(JSON.stringify(d)))
        return d.isVisual ? (d.data ? (d.data.isReserved ? disabledSpan : validSpan) : '') : ''
      },
      selectIsRead: function () {
        this.isRead = !this.isRead
      },
      agreeProtocol: function () {
        if (!this.isRead) {
          return
        }
        if (this.isInterviewFirst) {
          if (this.isReservation) {
            this._go(false)
          } else {
            this.firstTimeShow = true
          }
        } else {
          this._go(false)
        }

      },
      checkContact: function () {
        if (!this.formFields.contact) {
          this.formatError.contact = true
          this.$toast('联系方式不能为空')
          return
        } else {
          this.formatError.contact = false
        }
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
        if (!this.formFields.email) {
          this.formatError.email = true
          this.$toast('邮箱不能为空')
          return
        } else {
          this.formatError.email = false
        }
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
        if(field === "hasConsultingExperience" ){
          if(opt.value == '是'){
            this.hasExperience = true
          }
          else{
            this.hasExperience = false
          }
        }
        if(field === "hasPsychiatricHistory" ){
          if(opt.value == '是'){
            this.hasPsychiatricHistory = true
          }
          else{
            this.hasPsychiatricHistory = false
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
      _back: function () {
        this.curClass = null
        this.formFields = {}
      },
      _selectClass: function (cell) {
        if (cell && cell.data && !cell.data.isReserved) {
          this.curClass = cell.data
          this._getFamilyMembers()
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
        }
      },
      _getIndexClass: function (day, time) {
        return this.curCounselorClassJson[`${time.timeQuantumStart}-${time.timeQuantumEnd}_${day.dateTime}`]
      },
      _formatDate: function (a) {
        var str = a
        return str
      },
      _go: function (firstTime) {
         if (!this.isRead) {
          return
        }
        this.firstTime = false
        // this.firstTimeShow = false
        this._getAreas()
      },
      _getTimes: function (param) {
        sAjax({
          url: '/api/mentality/scheduling/timeSettings/thisWeek',
          type: 'get',
          data: {
            dateStart: param.dateStart,
            dateEnd: param.dateEnd,
            type: this.adviceType=='online'?'ONLINE':'RESERVATION',
            campus: this.curAreaValue
          },
          success: (data) => {
            if (data.state) {
              this.times = data.data || []
              this.times.forEach((t) => {
                t.name = t.timeQuantumStart + '-' + t.timeQuantumEnd
              })
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _getIsInterviewFirst: function () {
        sAjax({
          url: '/api/mentality/config',
          dataType: 'json',
          type: 'get',
          success: (data) => {
            if (data.state) {
              if (data.data) {
                this.isInterviewFirst = data.data.interviewFirst
              }
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _getProtocol: function () {
        sAjax({
          url: '/api/mentality/config/readme',
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.protocol = data.data
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _getAreas: function () {
        sAjax({
          url: '/api/mentality/scheduling/campus',
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.areas = data.data || []
              if (this.areas.length > 0) {
                this.curAreaValue = this.areas[0].value
              }
            }
          }
        })
      },
      _getTeacherList: function () {
        this.counselors = []
        this.loading = true
        sAjax({
          url: '/api/mentality/teachers/list',
          type: 'get',
          data: {
            campus: this.curAreaValue,
            firstTime: this.firstTime
          },
          success: (data) => {
            //遍历数据 区分网上预约和线下预约
            if (data.state) {
              this.counselors = data.data || []  //所有数据 未区分线上线下
              // this.counselors.forEach((ele) => {
              //   var days = this._getDayArr(ele.classes)
              //   this.$set(ele, 'days', days)
              //   if(!ele.isOrder) {
              //     return this.$toast('暂无之前的咨询师排班信息')
              //   }
              // })
              
              if(data.data.length) {
                let allList = [].concat(data.data)
                let allList_offline =JSON.parse(JSON.stringify(allList));
                let allList_online = JSON.parse(JSON.stringify(allList));
                 for(let i = 0;i<allList_offline.length;i++) {
                   for(let x = 0;x<allList_offline[i].classes.length;x++) {
                     if(allList_offline[i].classes[x].setting.type != 'RESERVATION') {
                       allList_offline[i].classes.splice(x,1)
                     }else {
                        // let days = this._getDayArr(allList_offline[i].classes)
                        // this.$set(allList_offline[i], 'days', days)
                        
                        // var days = this._getDayArr(item.classes)
                        // this.$set(item, 'days', days)
                        // if(!item.isOrder) {
                        //   return this.$toast('暂无之前的咨询师排班信息')
                        // }
                      }
                   }
                 }
                 for(let i = 0;i<allList_offline.length;i++) {
                    let days = this._getDayArr(allList_offline[i].classes)
                    this.$set(allList_offline[i], 'days', days)
                    if(!allList_offline[i].isOrder) {
                         this.$toast('暂无之前线下预约的咨询师排班信息')
                      }
                 }
                 for(let i = 0;i<allList_online.length;i++) {
                   for(let x = 0;x<allList_online[i].classes.length;x++) {
                     if(allList_online[i].classes[x].setting.type == 'RESERVATION') {
                       allList_online[i].classes.splice(x,1)
                     }else {
                      //  let days = this._getDayArr(allList_online[i].classes)
                      //   this.$set(allList_online[i], 'days', days)
                        
                     }
                   }
                 }
                 for(let i = 0;i<allList_online.length;i++) {
                   let days = this._getDayArr(allList_online[i].classes)
                    this.$set(allList_online[i], 'days', days)
                    if(!allList_online[i].isOrder) {
                          this.$toast('暂无之前网上预约的咨询师排班信息')
                        }
                 }
                 this.counselors = allList_offline
                 this.counselors_online = allList_online
                //  for(let i = 0;i<offlineList.length;i++) {
                //     for(let x = 0;x<offlineList[i].classes.length;x++) {
                //       let curClass = offlineList[i].classes[x]
                //       if(curClass.setting.type == 'ONLINE') {
                //         console.log(curClass.id)
                //         offlineList[i].classes.splice(x,1)
                //       }
                //     }
                //   }
                
              }
            } else {
              this.$toast(data.message)
            }
          }
        }).always(() => {
          this.loading = false
        })
      },
      _getDayArr: function (classesArr) {
        var dayArr = []
        classesArr.forEach((c) => {
          var isIn = false
          dayArr.forEach((d) => {
            if (d.dateTime === c.dateTime) {
              isIn = true
              if (!d.times) {
                this.$set(d, 'times', [])
              }
              d.times.push(c)
            }
          })
          if (!isIn) {
            var d = {
              dateTime: c.dateTime,
              dayOfWeek: c.dayOfWeek,
              times: []
            }
            d.times.push(c)
            dayArr.push(d)
          }
        })
        dayArr.forEach((day) => {
          var isFull = true
          day.times.forEach((time) => {
            if (!time.isReserved) {
              isFull = false
            }
          })
          this.$set(day, 'isFull', isFull)
        })
        return dayArr
      },
      reserveDateSelected(data) {
        if (data.value) {
          this.reserveDate = data.value.split(' ')[0];
        } else {
          this.reserveDate = data.value;
        }
      },
      _checkCounselor: function (counselor, day) {
        this.curCounselor = counselor
        this.curDay = day
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
      _getPage: function (dateArr) {
        var param = {
          dateStart: dateArr[0].date,
          dateEnd: dateArr[6].date,
          userId: this.curCounselor.teacherBaseInfo.userId,
          campus: this.curAreaValue,
          firstTime: this.firstTime,
          type: this.adviceType=='online'?'ONLINE':'RESERVATION',
        }
        sAjax({
          url: `/api/mentality/scheduling/teacherSchedulings/page/week`,
          type: 'get',
          data: param,
          success: (data) => {
            if (data.state) {
              this.classData = data.data || []
              this.classData.forEach((c) => {
                c.dateName = c.dateTime
                c.timeName = c.timeQuantum
              })
            } else {
              this.$toast(data.message)
            }
          }
        })
        this._getTimes(param)
      },
      _nextPage: function () {
        this.$refs.tableDateAndTime._nextWeek()
      },
      _prePage: function () {
        this.$refs.tableDateAndTime._preWeek()
      },
      _submit: function () {
        if(this.formFields.remark){
             if(this.formFields.remark.length>220){
                 this.$toast("备注输入不得超过200字！")
              return
        }
        }

        if (!(this.formFields.contact && this.formFields.content && this.formFields.email)) {
          this.$toast('请完善必填信息！')
          return
        }
        this.formFields.firstTime = this.firstTime
        this.formFields.readmeId = this.protocol.id
        this.formFields.dayTimeTeacherId = this.curClass.id
        this.formFields.reservationDate = this.curClass.dateTime

        sAjax({
          url: '/api/mentality/reservation',
          type: 'post',
          data: this.formFields,
          success: (data) => {
            if (data.state) {
              this.$toast('预约成功！')
              this.curClass.isReserved = true
              this.$nextTick(() => {
                this.$addBread({
                  route: '/psychologicalReservation/reservationRecord',
                  title: '我的预约记录'
                })
                this._back()
                this.$removeBread(this.data)
              })
            } else {
              this.$toast(data.message)
            }
          }
        })
      }
    },
    created: function () {
      this._getProtocol()
      this._getIsInterviewFirst()
      sAjax({
        url: '/api/mentality/reservation/has',
        type: 'get',
        success: (data) => {
          if (data.state) {
            this.isReservation = data.data
          } else {
            this.$toast(data.message)
          }
        }
      })
      // 测试后删除
      // this._getAreas()
      // this.counselors.forEach((ele) => {
      //   var days = this._getDayArr(ele.classes)
      //   this.$set(ele, 'days', days)
      // })
    },
    watch: {
      curAreaValue: function () {
        // this._getTimes()
        // if (this.firstTime !== null) {
          this._getTeacherList()
        // }
      }
    }
  }
</script>
<style lang="less">
.advisory-reservation-page {
  position: relative;
  height: 100%;
  // background: #fff;
  user-select: none;
  overflow-y: auto;
  overflow-x: hidden;
  .reservation-container {
    // min-width: 768px;
    height: 100%;
    padding: 24px 50px 60px;
    background: #fff;
    box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
    .protocol-content {
      padding-bottom: 24px;
      border-bottom: 2px solid #f0f0f0;
    }
    .check-box-options {
      display: inline-block;
      margin-top: 10px;
      i {
        font-size: 22px;
        color: #d9d9d9;
        transition: all 0.3s ease;
        cursor: pointer;
        &.active {
          color: #298df7;
        }
      }
      .icon-title {
        font-size: 14px;
        color: #333333;
        display: inline-block;
        margin-top: 2px;
        vertical-align: top;
      }
    }
    .agree {
      width: 110px;
      height: 40px;
      margin-top: 24px;
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
      &.disabled-click {
        cursor: not-allowed;
      }
      &.next-step {
        margin-top: 40px;
      }
    }
    .reservation-header {
      .back {
        font-size: 17px;
        color: #777777;
        letter-spacing: 0;
        text-align: center;
        line-height: 28px;
        cursor: pointer;
      }
      .reservation-sure-title {
        margin-left: 24px;
        font-size: 18px;
        color: #777777;
        letter-spacing: 0;
        text-align: center;
        line-height: 20px;
      }
    }
    .reservation-days {
      .days-header {
        margin-bottom: 10px;
        strong {
          font-size: 15px;
          color: #3e3e3e;
          letter-spacing: 0.3px;
        }
        .page-control {
          display: block;
          margin-top: -10px;
          .pre,
          .next {
            cursor: pointer;
            transition: all 0.3s ease;
            &:hover {
              color: #fff;
              background: #298df7;
            }
          }
        }
        .span-block {
          padding: 3px;
          background: #f0f0f0;
          &.rotate {
            transform: rotate(180deg);
          }
        }
      }
      .teacher-container {
        position: relative;
        width: 100%;
        min-height: 139px;
        padding: 13px;
        background: #f9f9f9;
        .teacher-pic {
          position: absolute;
          left: 13px;
          top: 13px;
          width: 110px;
          height: 112px;
        }
        .teacher-info {
          padding-top: 10px;
          margin-left: 120px;
          .name-p {
            width: 80%;
            padding-bottom: 5px;
            margin-bottom: 7px;
            border-bottom: 1px solid #f2f2f2;
          }
          .teacher-name {
            font-size: 14px;
            color: #222222;
            letter-spacing: 0;
            text-align: left;
          }
          .teacher-sex {
            margin-left: 16px;
            font-size: 12px;
            color: #868686;
            letter-spacing: 0;
            text-align: left;
          }
          .teacher-desc {
            font-size: 14px;
            line-height: 20px;
            color: #8f8f8f;
            letter-spacing: 0.3px;
            text-align: left;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            .more {
              font-size: 14px;
              color: #002100;
              letter-spacing: 0.3px;
              text-align: left;
              line-height: 20px;
            }
          }
        }
      }
    }
    .reservation-submit {
      padding: 20px 0;
      border: 1px solid #e3e3e3;
      .teacher-container,
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
            line-height: 24px;
          }
          .info-options {
            float: left;
            width: 340px;
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
        .teacher-pic {
          position: absolute;
          left: 39px;
          top: 55px;
          width: 110px;
          height: 112px;
        }
        .teacher-info {
          padding-top: 10px;
          margin-left: 126px;
          .name-p {
            width: 80%;
            padding-bottom: 5px;
            margin-bottom: 7px;
            border-bottom: 1px solid #f2f2f2;
          }
          .teacher-name {
            font-size: 14px;
            color: #222222;
            letter-spacing: 0;
            text-align: left;
          }
          .teacher-sex {
            margin-left: 16px;
            font-size: 12px;
            color: #868686;
            letter-spacing: 0;
            text-align: left;
          }
          .teacher-desc {
            font-size: 14px;
            line-height: 20px;
            color: #8f8f8f;
            letter-spacing: 0.3px;
            text-align: left;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            .more {
              font-size: 14px;
              color: #002100;
              letter-spacing: 0.3px;
              text-align: left;
              line-height: 20px;
            }
          }
        }
        .attention {
          margin-top: 33px;
          font-size: 14px;
          font-weight: bold;
          color: #495ab9;
          letter-spacing: 0.18px;
          text-align: left;
          line-height: 34px;
        }
      }
      .submit-info {
        border-left: 1px dashed #e3e3e3;
      }
    }
  }
  .protocol-body {
    padding: 37px;
  }
  .protocol-question-container {
    margin-bottom: 28px;
    font-size: 20px;
    color: #222222;
    letter-spacing: 0.66px;
    line-height: 20px;
  }
  .protocol-button-list {
    text-align: center;
    .protocol-btn {
      width: 78px;
      height: 30px;
      line-height: 1;
      background: #fff;
      border-radius: 15px;
      border: 1px solid #666666;
      outline: none;
      box-shadow: none;
      transition: all 0.3s ease;
      &:hover {
        background: #f0f0f0;
      }
    }
  }
  .search-container {
    width: 78%;
    margin: 0 auto;
    line-height: 40px;
    text-align: center;
    background: #f5f5f5;
    border-radius: 20px;
    .search-part {
      display: inline-block;
      i {
        margin-right: 7px;
        color: rgba(0, 0, 0, 0.3);
        line-height: 38px;
      }
    }
    input {
      width: 180px;
      line-height: 1.5;
      border: none;
      background: transparent;
      box-shadow: none;
      outline: none;
    }
  }
  .divide-line {
    height: 1px;
    margin: 13px -50px 19px;
    background: #f0f0f0;
  }
  .campus-area {
    padding: 0 20px;
    margin-bottom: 12px;
    position: relative;
    .selectDate {
      position: absolute;
      top: 0;
      right: 20px;
    }
    label {
      font-size: 15px;
      color: #494747;
      letter-spacing: 0.3px;
    }
  }
  .area-list,.advice {

    .area {
      display: inline-block;
      margin-right: 12px;
      line-height: 22px;
      font-size: 15px;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.87);
      letter-spacing: 0;
      i {
        font-size: 18px;
      }
      &:hover {
        color: #298df7;
        cursor: pointer;
      }
    }
  }
  .counselor {
    padding: 0;
    margin: 0 -10px 10px;
    border: 1px solid #eaeaea;
    .counselor-top {
      position: relative;
      width: 100%;
      height: 125px;
      border-bottom: 1px dashed #989898;
      .pic {
        position: absolute;
        top: 14px;
        left: 0;
        width: 98px;
        height: 99px;
      }
      .info {
        position: absolute;
        left: 105px;
        top: 14px;
        right: 14px;
        label,
        p {
          margin: 0;
          font-size: 13px;
          font-weight: 500;
          color: #222222;
          letter-spacing: 1px;
          text-align: left;
          line-height: 20px;
        }
        .line {
          width: 100%;
          margin: 5px 0;
          border-top: 1px solid #f2f2f2;
        }
        .sex {
          margin-left: 6px;
          font-size: 12px;
          color: #989898;
          letter-spacing: 0.92px;
          text-align: left;
        }
        .desc {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          /*! autoprefixer: off */
          -webkit-box-orient: vertical;
        }
      }
    }
    .counselor-bottom {
      height: 87px;
      padding: 6px 0 0;
      background: #f9f9f9;
      overflow: hidden;
      .bottom-item {
        &.border {
          border-top: 1px solid #989898;
        }
      }
      .bottom-item-content {
        padding-left: 8px;
        margin: 0 -15px 10px;
        font-size: 12px;
        font-weight: 500;
        color: #298df7;
        letter-spacing: 0.3px;
        .full-tip {
          padding-left: 3px;
          border-left: 1px solid #b6b6b6;
        }
        .line {
          position: absolute;
          width: 300%;
          height: 1px;
          margin-left: -8px;
          background: #eaeaea;
        }
        &:hover {
          cursor: pointer;
          // text-decoration: underline;
        }
        &.full {
          color: #b6b6b6;
          &:hover {
            cursor: default;
            text-decoration: none;
          }
        }
      }
    }
  }
  .reservation-table {
    .valid {
      color: #298df7;
      cursor: pointer;
      transition: all .3s ease;
      &:hover {
        color: #fff;
        background: #79a4e8;
      }
    }
    .disabled{
      color: #b6b6b6;
    }
  }
}
</style>
