<template>
  <div id="jobApplyForm">
    <div class="log" v-if="isShowLog">
      <button class="btn log-toggle" :class="[logShow?'open':'']" title="操作日志" @click="logShow = !logShow">
        日志
      </button>
      <div class="log-content" :class="[logShow?'active':'']">
        <div class="log-item" v-if="isLogRecord">
          <span class="btn-block log-time">当前状态</span>
          <label><strong>{{logData.statusLabel}}</strong></label>
        </div>
        <div class="log-item" v-else>
          <label><strong>暂无相关日志</strong></label>
        </div>
        <div class="log-item" v-for="(com, index) in logData.histories" :key="index">
          <label class="btn-block log-time">{{com.createTime}}</label>
          <label class="btn-block log-detail">在<strong>{{com.node.nodeType.name}}</strong>节点</label>
          <label class="btn-block log-detail"><strong>{{com.operator.name}}</strong><strong>{{actionTypeData[com.actionType]}}申请</strong></label>
          <label class="btn-block log-detail" v-if="actionTypeData[com.actionType] === 'DISAGREE'">意见为：<strong>{{com.opinion}}</strong></label>
          <div class="log-records">
            <p v-for="(item, itemIndex) in com.modifiedValues" :key="itemIndex">
              <label class="btn-block log-detail">更新了<strong>{{item.valueTypeLabel}}</strong>为<strong>{{item.newValueLabel}}</strong></label>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="jobApplyForm-header">
      <i class="maticon back-icon-btn pull-left" @click="_back" v-html="icons('navigate_before')">navigate_before</i>
      <div class="jobApplyForm-title">岗位申请表</div>
    </div>
    <div class="jobApplyForm-body" :style="'max-height:' + scrollHeight + 'px'">

      <div class="date-select-group">
        <div class="form-group">
          <label class="form-label">申请人姓名</label>
          <input type="text" class="form-control form-input" :disabled="true" placeholder="请输入姓名" v-model="applyListData.applyName">
        </div>
        <div class="form-group">
          <label class="form-label">联系方式</label>
          <input type="text" class="form-control form-input" :disabled="isApply ? false : true" placeholder="请输入联系方式" v-model="applyListData.contact" @change="isPhoneNo">
        </div>
      </div>
      <div class="date-select-group">
        <div class="form-group">
          <label class="form-label pull-left  time-picker-label">申请日期</label>
          <v-datepicker ref="workStartTime" class="time-picker" :class="{'disabled':true}" :disabled="true" :clearButton="false" :showTime="false" v-model="applyListData.applyTime"></v-datepicker>
        </div>
        <div class="form-group">
          <label class="form-label pull-left time-picker-label">工作开始时间</label>
          <v-datepicker ref="workStartTime" class="time-picker" :class="{'disabled':isApply ? false : true}" :disabled="isApply ? false : true" :clearButton="false" :showTime="false" v-model="applyListData.workStartTime"></v-datepicker>
        </div>
        <div class="form-group">
          <label class="form-label pull-left time-picker-label">工作结束时间</label>
          <v-datepicker ref="workStartTime" class="time-picker" :class="{'disabled':isApply ? false : true}" :disabled="isApply ? false : true" :clearButton="false" :showTime="false" v-model="applyListData.workEndTime"></v-datepicker>
        </div>
      </div>
      <div class="date-select-group">
        <div class="form-group verticalAlign-top">
          <label class="form-label">是否困难生</label>
          <v-select class="btn-block form-select" :value="applyListData.isDifficultyStudent" :options="isTodifficultStudentData" optionsLabel="text" optionsValue="id" :disabled="isApply ? false : true" search close-on-select @afterSelected="difficultStudentSelected"></v-select>
        </div>
        <div class="form-group verticalAlign-top" v-if="applyListData.isDifficultyStudent === 'true'">
          <label class="form-label">困难认定级别</label>
          <v-select class="btn-block form-select" :value="applyListData.difficultyLevel" :options="difficultyLevelData" optionsLabel="label" optionsValue="value" :disabled="isApply ? false : true" search close-on-select @afterSelected="levelSelected"></v-select>
        </div>
        <div class="form-group">
          <label class="form-label verticalAlign-top" :title="applyListData.validWorkTime">工作时间段</label>
          <textarea cols="6" rows="5" class="time-modal-textarea" maxlength="300" :title="applyListData.validWorkTime" :disabled="isApply ? false : true" placeholder="请输入可工作时间段" v-model="applyListData.validWorkTime"></textarea>
          <!-- <input type="text" class="form-control form-input" style="width: 542px;" :title="applyListData.validWorkTime" :disabled="isApply ? false : true" placeholder="请输入可工作时间段" v-model="applyListData.validWorkTime"> -->
        </div>
      </div>
      <div class="form-group computer-skills">
        <label class="form-label verticalAlign-top">计算机能力</label>
        <div class="computer-content">
          <div>
            <div class="computer-skills-options" v-for="(com, index) in computerSkillsData" :key="index">
              <span @click="changeComputer(com, isApply)">
                <i class="maticon" v-html="icons('check_box')" :style="{cursor: isApply ? 'pointer' : 'not-allowed'}" v-if="applyListData.computerSkill.indexOf(com.title)>=0">check_box</i>
                <i class="maticon" v-html="icons('check_box_outline_blank')" :style="{cursor: isApply ? 'pointer' : 'not-allowed'}" v-else>check_box_outline_blank</i>
              </span>
              <span class="icon-title">{{com.title}}</span>
            </div>
          </div>
          <div style="margin-top: 10px;">
            <div class="computer-skills-options">
              <span @click="changeComputer(computerOther, isApply)" v-if="!isApply">
                <i class="maticon" v-html="icons('check_box')" :style="{cursor: isApply ? 'pointer' : 'not-allowed'}" v-if="computerOther.title&&applyListData.computerSkill.indexOf(computerOther.title)>=0">check_box</i>
                <i class="maticon" v-html="icons('check_box_outline_blank')" :style="{cursor: isApply ? 'pointer' : 'not-allowed'}" v-else>check_box_outline_blank</i>
              </span>
              <span @click="changeComputer(computerOther, isApply)" v-else>
                <i class="maticon" v-html="icons('check_box')" :style="{cursor: isApply ? 'pointer' : 'not-allowed'}" v-if="computerOther.checked">check_box</i>
                <i class="maticon" v-html="icons('check_box_outline_blank')" :style="{cursor: isApply ? 'pointer' : 'not-allowed'}" v-else>check_box_outline_blank</i>
              </span>
              <span class="icon-title">其他</span>
            </div>
            <span class="other"><input type="text" class="form-control search-input" :disabled="isApply ? false : true" v-model="computerOther.title"></span>
          </div>
        </div>
      </div>
      <div class="form-group computer-skills">
        <label class="form-label verticalAlign-top">写作能力</label>
        <div class="computer-content">
          <div>
            <div class="computer-skills-options" v-for="(com, index) in writingAbilityData" :key="index">
              <span @click="changeWriting(com, isApply)">
                <i class="maticon" v-html="icons('check_box')" :style="{cursor: isApply ? 'pointer' : 'not-allowed'}" v-if="applyListData.writeSkill.indexOf(com.title)>=0">check_box</i>
                <i class="maticon" v-html="icons('check_box_outline_blank')" :style="{cursor: isApply ? 'pointer' : 'not-allowed'}" v-else>check_box_outline_blank</i>
              </span>
              <span class="icon-title">{{com.title}}</span>
            </div>
          </div>
          <div style="margin-top: 10px;">
            <div class="computer-skills-options">
              <span @click="changeWriting(writingOther, isApply)" v-if="!isApply">
                <i class="maticon" v-html="icons('check_box')" :style="{cursor: isApply ? 'pointer' : 'not-allowed'}" v-if="writingOther.title&&applyListData.writeSkill.indexOf(writingOther.title)>=0">check_box</i>
                <i class="maticon" v-html="icons('check_box_outline_blank')" :style="{cursor: isApply  ? 'pointer' : 'not-allowed'}" v-else>check_box_outline_blank</i>
              </span>
              <span title="222" @click="changeWriting(writingOther, isApply)" v-else>
                <i class="maticon" v-html="icons('check_box')" :style="{cursor: isApply ? 'pointer' : 'not-allowed'}" v-if="writingOther.checked">check_box</i>
                <i class="maticon" v-html="icons('check_box_outline_blank')" :style="{cursor: isApply ? 'pointer' : 'not-allowed'}" v-else>check_box_outline_blank</i>
              </span>
              <span class="icon-title">其他</span>
            </div>
            <span class="other"><input type="text" class="form-control search-input" :disabled="isApply ? false : true" v-model="writingOther.title"></span>
          </div>
        </div>
      </div>
      <div class="form-group" style="margin-top: 20px;">
        <label class="form-label verticalAlign-top">备注</label>
        <textarea cols="24" rows="5" class="modal-textarea" maxlength="600" v-model="applyListData.remark"></textarea>
      </div>
      <div class="form-group" style="margin-top: 20px;">
        <label class="form-label">添加附件</label>
        <span v-if="isApply ">
          <div class="btn upload">添加附件<input type="file" @change="_fileUpload($event)"></div>
        </span>
        <div class="file-div">
          <ul class="list-group" v-if="applyListData.attachment.length > 0">
            <li class="list-group-item" v-for=" (f,fIndex) in applyListData.attachment" :key="fIndex">
              <span class="pull-right"><a :data-href="fileUrlPrefix+f.hash" @click="_downloadFile">下载</a></span>
              <i class=" maticon pull-right" @click="_removeFile(fIndex)" v-html="icons('cancel')">cancel</i>
              <p class="fileName" v-if="supportPreview.indexOf(f.originalName.match(/([^.]+)$/)[1])>=0"><a class="a-style" @click="_showAttachmentPreview(f)">{{f.originalName}}</a></p>
              <p class="fileName" v-else><a>{{f.originalName}}</a></p>
            </li>
          </ul>
          <div class="list-group" v-else>无</div>
        </div>
      </div>
    </div>
    <div class="jobApplyForm-footer" v-if="formType === 'application'">
      <div class="btn-group">
        <button type="button" class="btn btn-bgColor-style sumbit-form clearBtnBorder" @click="sumbit">提交</button>
      </div>
    </div>
    <div class="jobApplyForm-footer" v-else-if="formType === 'check'">
      <div class="btn-group" v-if="formStatus === 'TODO'">
        <button type="button" class="btn btn-bgColor-style pass-form clearBtnBorder" @click="_pass">通过</button>
        <button type="button" class="btn btn-bgColor-style unpass-form clearBtnBorder" @click="_unpass">不通过</button>
      </div>
      <div class="btn-group" v-if="formDetail.opts">
        <button type="button" class="btn pass-form clearBtnBorder" @click="_revoke" v-if="formDetail.opts.canRevoke">撤回</button>
      </div>
    </div>
    <div class="jobApplyForm-footer" v-else-if="formType === 'applicationRecord'">
      <div class="btn-group">
        <button type="button" class="btn btn-bgColor-style pass-form clearBtnBorder" @click="_revoke" v-if="formDetail.opts.canRevoke">撤回</button>
        <button type="button" class="btn btn-bgColor-style pass-form clearBtnBorder" @click="_resubimt" v-if="formDetail.opts.canResubmit">重新提交</button>
        <button type="button" class="btn btn-bgColor-style unpass-form clearBtnBorder" @click="_cancelApplication" v-if="formDetail.opts.canCancel">取消申请</button>
      </div>
    </div>
    <div class="jobApplyForm-footer" v-else>

    </div>
    <v-modal :show="showUnpassOpinionModal" width="500">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          确定不通过该申请吗？
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="form-group">
          <textarea cols="24" rows="5" placeholder="请输入不通过的意见" class="unpass-modal-textarea" maxlength="600" v-model="opinion"></textarea>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showUnpassOpinionModal = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="submitUnpassOpinion">确定</button>
      </div>
    </v-modal>
  </div>
</template>
<script>
import Vue from 'vue'
import { sAjax, translation } from '../../assets/utils/utils.js'
export default {
  inject: {
    windowObj: {
      default: null
    }
  },
  props: {
    data: {
      default: null
    },
    isApply: {
      default: null
    },
    formDetail: {
      default: null
    },
    userInfo: {
      default: null
    },
    formType: {
      default: null
    }
  },
  data: function () {
    return {
      curRouter: 'jobDetail',
      computerSkillsData: [],
      computerSkillsArr: ['PPT', 'Word', 'Excel', 'Photoshop', 'Access', '视频制作', '网站制作'],
      writeSkillArr: ['新闻写作', '调研报告', '应用文写作', '文字编辑'],
      computerOther: {
        checked: false,
        title: ''
      },
      writingAbilityData: [],
      writingOther: {
        checked: false,
        title: ''
      },
      addedFileArr: [],
      deleteFileArr: [],
      supportPreview: ['doc', 'docx', 'wps', 'pdf', 'ppt', 'pptx', 'xls', 'xlsx', 'png', 'jpg', 'jpeg', 'bmp', 'txt'],
      applyListData: {
        position: {
          id: ''
        },
        applyName: '',
        contact: '',
        applyTime: '',
        workStartTime: '',
        workEndTime: '',
        isDifficultyStudent: '',
        difficultyLevel: '',
        validWorkTime: '',
        computerSkill: [],
        writeSkill: [],
        remark: '',
        attachment: []
      },
      isTodifficultStudentData: [],
      difficultyLevelData: [],
      fileData: [],
      formStatus: '',
      logShow: false,
      isShowLog: false,
      scrollHeight: null,
      logData: {},
      actionTypeData: {
        AGREE: '同意',
        DISAGREE: '不同意',
        REJECT: '驳回',
        REVOKE: '撤回',
        RESUBMIT: '重新提交',
        CANCEL: '取消申请'
      },
      isLogRecord: false,
      showUnpassOpinionModal: false,
      opinion: ''
    }
  },
  created: function () {
    sAjax({
      url: '/api/system/dicts',
      dataType: 'json',
      type: 'get',
      data: {
        dictType: '困难等级'
      },
      success: (data) => {
        if (data.state) {
          this.difficultyLevelData = data.data
        } else {
          this.$toast(data.message)
        }
      }
    })
    
    this.isTodifficultStudentData = [{ id: 'true', text: '是' }, { id: 'false', text: '否' }]
    if (this.formType !== 'application') {
      this.initData()
    } else {

      sAjax({
        url: '/api/pwps/users/info',
        dataType: 'json',
        type: 'get',
        success: (data) => {
          if (data.state) {
            this.applyListData.isDifficultyStudent = data.data.isDifficultyStudent ? 'true' : 'false'
            this.applyListData.difficultyLevel = data.data.isDifficultyStudent ? data.data.difficultyLevel : ''
          } else {
            this.$toast(data.message)
          }
        }
      })

      var date = new Date()
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? ('0' + m) : m
      var d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      this.applyListData.applyTime = y + '-' + m + '-' + d
      this.applyListData.position.id = this.formDetail.id
      this.applyListData.applyName = this.userInfo.userName
    }
    this.computerSkillsData = [{ id: 'PPT', checked: false, title: 'PPT' }, { id: 'Word', checked: false, title: 'Word' }, { id: 'Excel', checked: false, title: 'Excel' }, { id: 'Photoshop', checked: false, title: 'Photoshop' }, { id: 'Access', checked: false, title: 'Access' }, { id: '视频制作', checked: false, title: '视频制作' }, { id: '网站制作', checked: false, title: '网站制作' }]
    this.writingAbilityData = [{ id: '新闻写作', checked: false, title: '新闻写作' }, { id: '调研报告', checked: false, title: '调研报告' }, { id: '应用文写作', checked: false, title: '应用文写作' }, { id: '文字编辑', checked: false, title: '文字编辑' }]
  },
  mounted: function () {
    setTimeout(() => {
      var pageContentHeight = $("#jobApplyForm").height()
      this.scrollHeight = pageContentHeight - $(".jobApplyForm-header").height()
    }, 100)
  },
  methods: {
    initData: function () {
      if (this.formDetail) {
        if (this.formDetail.status) {
          this.formStatus = this.formDetail.status
        }
        this.isShowLog = this.formDetail.isShowLog
        this.applyListData = {
          applyName: this.formDetail.form.name,
          contact: this.formDetail.form.contact || this.formDetail.contact,
          applyTime: this.formDetail.form.createTime.split(' ')[0],
          idCarcNo: this.formDetail.form.idCardNo,
          workStartTime: this.formDetail.form.workStartTime,
          workEndTime: this.formDetail.form.workEndTime,
          isDifficultyStudent: this.formDetail.form.isDifficultyStudent,
          difficultyLevel: this.formDetail.form.difficultyLevel,
          validWorkTime: this.formDetail.form.validWorkTime,
          computerSkill: this.formDetail.form.computerSkill,
          writeSkill: this.formDetail.form.writeSkill,
          remark: this.formDetail.form.remark,
          attachment: this.formDetail.form.attachment || []
        }
        if (this.applyListData.isDifficultyStudent === null) {
          this.applyListData.isDifficultyStudent = ''
        } else {
          this.applyListData.isDifficultyStudent = this.applyListData.isDifficultyStudent ? 'true' : 'false'
        }
        for (var i in this.applyListData.computerSkill) {
          if (this.applyListData.computerSkill[i]) {
            if (this.computerSkillsArr.indexOf(this.applyListData.computerSkill[i]) < 0) {
              this.computerOther = {
                checked: true,
                title: this.applyListData.computerSkill[i]
              }
            }
          }
        }
        for (var i in this.applyListData.writeSkill) {
          if (this.applyListData.writeSkill[i]) {
            if (this.writeSkillArr.indexOf(this.applyListData.writeSkill[i]) < 0) {
              this.writingOther = {
                checked: true,
                title: this.applyListData.writeSkill[i]
              }
            }
          }
        }
        if (this.formType === 'unitJobView') {
          sAjax({
            url: '/api/pwps/workflow/runtime/position/' + this.formDetail.formId + '/histories',
            dataType: 'json',
            type: 'get',
            success: (data) => {
              if (data.state) {
                if (data.data) {
                  this.logData = data.data
                  this.isLogRecord = true
                } else {
                  this.isLogRecord = false
                }
              } else {
                this.$toast(data.message)
              }
            }
          })
        } else {
          if (this.formType === 'schoolJobView') {
            return
          }
          sAjax({
            url: '/api/pwps/workflow/runtime/instances/' + this.formDetail.formId + '/histories',
            dataType: 'json',
            type: 'get',
            success: (data) => {
              if (data.state) {
                if (data.data) {
                  this.logData = data.data
                  this.isLogRecord = true
                } else {
                  this.isLogRecord = false
                }
              } else {
                this.$toast(data.message)
              }
            }
          })
        }
      }
    },
    isPhoneNo: function () {
      var pattern = /^1[3456789]\d{9}$/
      if (!pattern.test(this.applyListData.contact)) {
        this.$toast('联系方式格式不对')
        this.applyListData.contact = ''
        return
      }
    },
    _back: function () {
      this.$emit('back')
    },
    changeComputer: function (com, isApply) {
      if (!isApply) {
        return
      }
      com.checked = !com.checked
      var index = this.applyListData.computerSkill.indexOf(com.title)
      if (index >= 0) {
        this.applyListData.computerSkill.splice(index, 1)
      } else {
        if (com.title) {
          this.applyListData.computerSkill.push(com.title)
        }
      }
    },
    changeWriting: function (com, isApply) {
      if (!isApply) {
        return
      }
      com.checked = !com.checked
      var index = this.applyListData.writeSkill.indexOf(com.title)
      if (index >= 0) {
        this.applyListData.writeSkill.splice(index, 1)
      } else {
        if (com.title) {
          this.applyListData.writeSkill.push(com.title)
        }
      }

    },
    _fileUpload: function () {
      this.$waiting.show({
        text: '附件上传中...'
      })
      var fd = new FormData()
      fd.append('file', event.target.files[0])
      fd.append('fieldName', event.target.files[0].name)
      sAjax({
        url: this.uploadFile,
        type: 'post',
        data: fd,
        contentType: false,
        processData: false,
        success: (data) => {
          if (data.code === '88888') {
            this.applyListData.attachment.push({
              hash: data.data.hash,
              originalName: data.data.originalName,
              size: data.data.size
            })
            this.addedFileArr.push(data.data.hash)
            this.$toast('附件上传成功')
          } else {
            this.$toast(data.message)
          }
        }
      }).always(() => {
        this.$waiting.close()
      })
    },
    _downloadFile: function (evt) {
      var url = evt.target.getAttribute('data-href');
      var myFrame = document.createElement("iframe");
      myFrame.src = url
      myFrame.style.display = "none";
      document.body.appendChild(myFrame);
    },
    _removeFile: function (index) {
      if (confirm('确定删除该附件吗？')) {
        this.deleteFileArr.push(this.applyListData.attachment[index].hash) //记录好需要删除的附件
        this.applyListData.attachment.splice(index, 1)
      }
    },
    _showAttachmentPreview: function (val, type) {
      var hash = this.fileUrlPrefix + val.hash
      let reg = /<[^>]+>|&[^>]/g // 匹配是否含有html标签
      if (reg.test(val.originalName)) {
        // 名字里面有标签,转义掉
        val.originalName = `<xmp>${val.originalName}</xmp>`
      }
      this.$preview({
        name: val.originalName,
        url: hash,
        type: type === 'image' ? 'png' : val.originalName.match(/([^.]+)$/)[1]
      })
    },
    sumbit: function () {
      if (this.applyListData.isDifficultyStudent === '') {
        return this.$toast('请选择是否困难生')
      }
      if (this.applyListData.isDifficultyStudent === 'true') {
        if (this.applyListData.difficultyLevel === '' || !this.applyListData.difficultyLevel) {
          return this.$toast('请选择困难认定级别')
        }
      }
      if (this.formDetail.isToDifficultyStudent) {
        if (this.applyListData.isDifficultyStudent === 'false' || !this.applyListData.isDifficultyStudent) {
          return this.$toast('你不是困难生，不能申请该岗位')
        }
      }
      if (this.applyListData.computerSkill.indexOf(this.computerOther.title) < 0) {
        this.applyListData.computerSkill.push(this.computerOther.title)
      }
      if (this.applyListData.writeSkill.indexOf(this.writingOther.title) < 0) {
        this.applyListData.writeSkill.push(this.writingOther.title)
      }
      this.$emit('submit', {
        applicationsData: this.applyListData
      })
    },
    _pass: function () {
      this.$emit('pass')
    },
    _unpass: function () {
      this.opinion = ''
      this.showUnpassOpinionModal = true
    },
    submitUnpassOpinion: function () {
      if (!this.opinion) {
        return this.$toast('请输入不通过的意见')
      }
      this.$emit('unpass', {
        opinion: this.opinion
      })
    },
    _revoke: function () {
      this.$emit('revoke')
    },
    _resubimt: function () {
      if (this.applyListData.isDifficultyStudent === '') {
        return this.$toast('请选择是否困难生')
      }
      if (this.applyListData.isDifficultyStudent === 'true') {
        if (this.applyListData.difficultyLevel === '' || !this.applyListData.difficultyLevel) {
          return this.$toast('请选择困难认定级别')
        }
      }
      if (this.formDetail.isToDifficultyStudent) {
        if (this.applyListData.isDifficultyStudent === 'false' || !this.applyListData.isDifficultyStudent) {
          return this.$toast('你不是困难生，不能申请该岗位')
        }
      }
      if (this.applyListData.computerSkill.indexOf(this.computerOther.title) < 0) {
        this.applyListData.computerSkill.push(this.computerOther.title)
      }
      if (this.applyListData.writeSkill.indexOf(this.writingOther.title) < 0) {
        this.applyListData.writeSkill.push(this.writingOther.title)
      }
      this.$emit('resubimt', this.applyListData)
    },
    _cancelApplication: function () {
      this.$emit('cancelApplication')
    },
    difficultStudentSelected: function (obj) {
      this.applyListData.isDifficultyStudent = obj.value
      if (obj.value === 'false') {
        this.applyListData.difficultyLevel = ''
      }
    },
    levelSelected: function (obj) {
      this.applyListData.difficultyLevel = obj.value
    }
  },
  watch: {
    windowObj: {
      deep: true,
      handler: function () {
        var pageContentHeight = $("#jobApplyForm").height().toFixed(1)
        this.scrollHeight = pageContentHeight - $(".jobApplyForm-header").height().toFixed(1)
      }
    }
  }
}
</script>
<style lang="less">
#jobApplyForm {
  // width: 1135px;
  height: 100%;
  margin: 0 auto;
  background: #fff;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
  position: relative;
  .unpass-modal-textarea {
    width: 100%;
    resize: none;
    margin-top: 10px;
    padding: 5px;
    border: 0 solid #e0e0e0;
    outline: none;
  }
  .jobApplyForm-header {
    border-bottom: 1px solid #e0e0e0;
    height: 58px;
    .back-icon-btn {
      font-size: 26px;
      color: rgba(0, 0, 0, 0.54);
      cursor: pointer;
      padding: 5px;
      margin-left: 27px;
      margin-top: 10px;
    }
    .jobApplyForm-title {
      font-size: 20px;
      color: #777777;
      padding-top: 15px;
    }
  }
  .jobApplyForm-body {
    padding: 26px 50px 50px;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    .date-select-group {
      margin-top: 20px;
      div {
        display: inline-block;
        margin-right: 24px;
        margin-bottom: 0;
      }
    }
    .upload {
      position: relative;
      top: -1px;
      padding: 0;
      margin-left: 8px;
      font-size: 13px;
      font-weight: 500;
      color: #298df7;
      line-height: 20px;
      text-decoration: underline;
      background: transparent;
      overflow: hidden;
      cursor: pointer;
      input[type="file"] {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        opacity: 0;
        cursor: pointer;
      }
    }
    .file-div {
      position: relative;
      width: 100%;
      height: 100%;
      width: 30%;
      margin-left: 102px;
      .list-group {
        padding: 0;
        .list-group-item {
          padding: 0;
          border: none;
          span {
            margin-left: 18px;
            a {
              font-size: 13px;
              color: #298df7;
              font-weight: 500;
              cursor: pointer;
              &:hover {
                text-decoration: none;
              }
            }
          }
          p {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            a {
              font-weight: 500;
              cursor: pointer;
              transition: all 0.2s ease-out;
              color: rgba(0, 0, 0, 0.67);
              &.a-style {
                text-decoration: underline;
                cursor: pointer;
                &:hover {
                  text-decoration: underline;
                }
              }
              &:hover {
                text-decoration: none;
              }
            }
          }
          i {
            font-size: 18px;
            color: rgba(0, 0, 0, 0.4);
            cursor: pointer;
            transition: all 0.2s ease-out;
            &:hover {
              color: #ff5252;
            }
          }
        }
      }
    }
    .form-group label {
      width: 88px;
      text-align: right;
    }
    .form-select {
      display: inline-block;
      width: 200px;
      margin-left: 9px;
      .form-control.dropdown-toggle {
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
        border-radius: 3px;
      }
    }
    .form-input {
      border: 1px solid #d9d9d9;
      border-radius: 3px;
      width: 200px;
      font-size: 14px;
      display: inline-block;
      margin-left: 9px;
      margin-right: 24px;
      &:focus {
        box-shadow: none;
        outline: none;
      }
    }
    .time-modal-textarea {
      border: 1px solid #d9d9d9;
      border-radius: 3px;
      width: 300px;
      height: 90px;
      font-size: 14px;
      display: inline-block;
      margin-left: 9px;
      margin-right: 24px;
      resize: none;
    }
    .time-picker-label {
      line-height: 34px;
    }
    .time-picker {
      width: 200px;
      display: inline-block;
      margin-left: 13px;
      .form-control {
        border: 1px solid #d9d9d9;
        border-radius: 3px;
      }
    }
    .computer-skills {
      margin-top: 25px;
      .computer-content {
        border: 1px solid #d9d9d9;
        border-radius: 3px;
        height: 106px;
        width: 896px;
        display: inline-block;
        margin-left: 9px;
        padding: 20px 10px 16px 10px;
        .computer-skills-options {
          display: inline-block;
          margin-right: 20px;
          i {
            font-size: 22px;
            color: #d9d9d9;
            transition: all 0.3s ease;
          }
          .icon-title {
            font-size: 14px;
            color: #333333;
            display: inline-block;
            margin-top: 2px;
            vertical-align: top;
          }
        }
        .other {
          input {
            width: 602px;
            display: inline-block;
            vertical-align: bottom;
          }
        }
      }
    }
    .modal-textarea {
      width: 896px;
      resize: none;
      margin-left: 9px;
      padding: 5px;
      border: 1px solid #d9d9d9;
      outline: none;
    }
    .one-words-difference-margin {
      margin-left: 13px;
    }
    .two-words-difference-margin {
      margin-left: 28px;
    }
    .three-words-difference-margin {
      margin-left: 40px;
    }
    .four-words-difference-margin {
      margin-left: 55px;
    }
    .five-words-difference-margin {
      margin-left: 64px;
    }
    .verticalAlign-top {
      vertical-align: top;
    }
  }
  .jobApplyForm-footer {
    position: absolute;
    z-index: 100;
    bottom: 30px;
    // left: 48%;
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: center;
    .sumbit-form,
    .unpass-form,
    .pass-form {
      font-family: PingFangSC-Medium;
      border-radius: 27.5px;
      font-size: 14px;
      color: #ffffff;
    }
    .sumbit-form {
      background: #298df7;
    }
    .unpass-form {
      background: red;
    }
    .pass-form {
      background: #298df7;
      margin-right: 15px;
    }
  }
  .log-toggle {
    position: absolute;
    right: 8px;
    top: 62px;
    z-index: 1;
    line-height: 26px;
    padding: 0;
    border: none;
    box-shadow: none;
    background: transparent;
    outline: none;
    transition: all 0.3s ease;
    &.open {
      right: 208px;
    }
  }
  .log-content {
    position: absolute;
    right: -200px;
    top: 58px;
    bottom: 0;
    width: 200px;
    height: auto;
    padding-top: 5px;
    background: #fff;
    transition: all 0.3s ease;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.12), 0 8px 8px 0 rgba(0, 0, 0, 0.12);
    z-index: 1;
    display: none;
    overflow-x: hidden;
    overflow-y: auto;
    &.active {
      right: 0;
      display: block;
    }
    .log-item {
      padding: 10px 0;
      margin: 0 10px 10px;
      border-radius: 2px;
      border-bottom: 1px solid #f0f0f0;
      .log-time {
        font-size: 13px;
        color: rgba(0, 0, 0, 0.4);
      }
      .log-detail {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.58);
      }
      .log-records {
        p {
          margin: 0;
          font-size: 13px;
          color: rgba(0, 0, 0, 0.58);
        }
      }
    }
  }
}
</style>
