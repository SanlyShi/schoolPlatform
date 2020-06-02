<template>
  <div id="consultant-manage" class="container-fluid" v-if="!importPage">
    <div class="row text-center">
      <v-table title="咨询师管理" :url="url" pagesize="10" idField="id" :columns="columns" :multiple="false" :order="true" :search="false">
        <div slot="btn-group" class="btn-group pull-right" role="group">
          <button type="button" class="btn add clearBtnBorder" @click="showConsultantTypeModal('batch')">批量新增咨询师</button>
          <button type="button" class="btn add clearBtnBorder" @click="showConsultantTypeModal('single')">单个新增咨询师</button>
        </div>
      </v-table>
    </div>
    <v-modal :show="showTypeModal" effect="fade" width="400">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
            选择咨询师类型
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="info-item">
          <div class="info-options">
            <span class="" v-for="(opt, i) in consultantTypeData" :key="i" @click="_selectConsultantType(opt)">
              <i class="maticon" v-html="icons(consultantType === opt.value?'radio_button_checked':'radio_button_unchecked')" :class="{'active':consultantType === opt.value}"></i>{{opt.label}}
            </span>
          </div>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder"  @click="showTypeModal = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder"  @click="sumbitTypeModal">确定</button>
      </div>
    </v-modal>
    <v-modal :show="showAddFullTimeModal" effect="fade" width="400">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
            新增咨询师
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="modal-search-user">
          <detect url="/api/document/teachers/searchResults" placeholder="咨询师姓名或学工号" @afterSelected="consultantSelected" v-if="isShowSearch"></detect>
          <div v-else>
            <div class="user-info pull-left">{{userIdAndUserName}}</div>  <i class="maticon pull-left" v-html="icons('edit')" @click="changeUserSearch">edit</i>
          </div>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder"  @click="showAddFullTimeModal = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder"  @click="sumbitFullTimeModal">确定</button>
      </div>
    </v-modal>
    <v-modal :show="showAddModal" effect="fade" width="670">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
            {{modalType}}咨询师
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="row" style="margin-bottom: 25px;">
          <div class="col-md-6">
            <div class="form-group" v-if="consultantType === 'EXTERNAL'">
              <label class="form-label two-words-difference-margin">账号</label>
              <input type="text" class="form-control form-input" :disabled="isCheck || isEditExternal" placeholder="请输入账号" v-model="consultantData.userCertificationVO.userNo">
            </div>
            <div class="form-group" v-if="consultantType === 'EXTERNAL'">
              <label class="form-label two-words-difference-margin">密码</label>
              <input type="text" class="form-control form-input" :disabled="isCheck" placeholder="请输入密码" v-model="consultantData.userCertificationVO.password">
            </div>
            <div class="form-group ">
              <label class="form-label two-words-difference-margin">姓名</label>
              <input type="text" class="form-control form-input" :disabled="isCheck||(modalType =='编辑'&&consultantData.type=='full_time')" placeholder="请输入姓名" v-model="consultantData.teacherBaseInfo.name">
            </div>
            <div class="info-item">
              <span class="item-title">性别</span>
              <div class="info-options" :class="isCheck?'disabled-click':''">
                <span class="" v-for="(opt, i) in sexData"  :key="i" @click="_selectSex(opt)">
                  <i class="maticon" :class="consultantData.teacherBaseInfo.sex === opt.value?'active':''" v-html="icons(consultantData.teacherBaseInfo.sex === opt.value?'radio_button_checked':'radio_button_unchecked')"></i>{{opt.label}}
                </span>
              </div>
            </div>
            <div class="form-group ">
              <label class="form-label" style='min-width: 20px;'>联系方式</label>
              <input type="text" class="form-control form-input" :class="showErrorColor?'error':''" placeholder="请输入联系方式" :disabled="isCheck" v-model="consultantData.teacherBaseInfo.teacherContactPO.mobilePhone" @change="isPhoneNo">
            </div>
            <div class="form-group" v-if="isCheck">
              <label class="form-label">值班时间</label>
              <div class="duty-time">
                <div class="" v-for="(com, index) in dutyTime" :key="index">{{com}}&nbsp;</div>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <!-- 编辑 -->
            <div class="form-group" v-if="!isCheck">
              <label class="textarea-label two-words-difference-margin">照片</label>

              <div class="file-select" v-if="!consultantData.portrait&&!showDefaultImg">
                <i class="maticon uploadIcon" v-html="icons('file_upload')">file_upload</i>
                <input type="file" accept="image/*" @change="_fileUpload($event)">
              </div>
              <div v-else>
                <div class="file-select" v-if="!consultantData.portrait">
                <!-- <i class="maticon" v-html="icons('file_upload')">file_upload</i>
                <input type="file" accept="image/*" @change="_fileUpload($event)"> -->
                <div class="photo-show" :style="{
                backgroundImage: consultantData.teacherBaseInfo.sex == '2'? `url(${picGirl})`:`url(${picBoy})`,
                backgroundSize: `100% 100%`
                }" @click="_showAttachmentPreview" >
                <i class="maticon" v-html="icons('cancel')" @click.stop="removeImg"  v-if="!isCheck">cancel</i>
              </div>
              </div>
              <div class="photo-show" :style="{
                backgroundImage: `url(${imageUrlPrefix+ consultantData.portrait + '?thumb=true'})`,
                backgroundSize: `100% 100%`
                }" @click="_showAttachmentPreview" v-else>
                <i class="maticon" v-html="icons('cancel')" @click.stop="removeImg"  v-if="!isCheck">cancel</i>
              </div>
              </div>
              
            </div>
            <!-- 查看 -->
            <div class="form-group aa" v-else>
               <label class="textarea-label two-words-difference-margin">照片</label>
              <div class="photo-show" v-if="consultantData.portrait" :style="{
                backgroundImage: `url(${imageUrlPrefix+ consultantData.portrait + '?thumb=true'})`,
                backgroundSize: `100% 100%`
                }" @click="_showAttachmentPreview">
              </div>
              <div class="photo-show cc" v-else :style="{
                backgroundImage:  consultantData.teacherBaseInfo.sex == '2'? `url(${picGirl})`:`url(${picBoy})`,
                backgroundSize: `100% 100%`
                }" @click="_showAttachmentPreview">
              </div>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label class="input-label two-words-difference-margin textarea-label">简介</label>
          <textarea cols="24" rows="5" class="modal-textarea" maxlength="300" placeholder="请输入300字以内的简介" :disabled="isCheck" v-model="consultantData.synopsis"></textarea>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder"  @click="showAddModal = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" v-if="!isCheck"  @click="submitConsultantInfo">确定</button>
      </div>
    </v-modal>
  </div>
  <v-import
    v-bind="importParams"
    @backParentPage="importPage = false"
    v-else>
  </v-import>
  
</template>

<script>
  import Vue from 'vue'
  import { translation, sAjax, createTime } from '../../assets/utils/utils.js'
  export default {
    data: function () {
      return {
        showDefaultImg: false,
        picGirl: require('../../../static/image/picGirl.jpeg'),
        picBoy: require('../../../static/image/picBoy.jpeg'),
        url: '/table-data/mentality/teachers/pages',
        timeStamp: '',
        columns: [],
        importPage: false,
        showTypeModal: false,
        showAddFullTimeModal: false,
        showAddModal: false,
        fullTimeConsultantId: '',
        importParams: {
          parentPageTitle: '咨询师管理',
          downloadTemplateUrl: '',
          downloadErrorTemplateUrl: '',
          checkTemplateUrl: '',
          templateName: '批量新增咨询师',
          importBtnType: null
        },
        sexData: [],
        modalType: '',
        consultantData: {
          teacherBaseInfo: {
            userId: '',
            name: '',
            sex: '',
            teacherContactPO: {
              mobilePhone: ''
            }
          },
          synopsis: '',
          portrait: '',
          type: '',
          userCertificationVO: {
            userNo: '',
            password: ''
          }
        },
        dutyTime: '',
        addType: '',
        consultantType: '',
        consultantTypeData: [{ value: 'FULL_TIME', label: '专职' }, { value: 'EXTERNAL', label: '外聘' }],
        isCheck: false, //是否查看
        isEditExternal: false,
        isShowSearch: true,
        userIdAndUserName: '',
        showErrorColor: false,
        lang: 'zh-cn'
      }
    },
    computed: {
      translate: function () {
        return translation(this.lang).employmentUnitManage
      }
    },
    created: function () {
      var la = localStorage.getItem('lang')
      if (translation(la)) {
        this.lang = la
      }
      sAjax({
        url: '/api/system/dicts',
        dataType: 'json',
        type: 'get',
        data: {
          dictType: '性别'
        },
        success: (data) => {
          if (data.state) {
            this.sexData = data.data
          } else {
            this.$toast(data.message)
          }
        }
      })
      this.importParams.importBtnType = [{
        url: '/mentality/teachers/batch/',
        method: 'post',
        isShowBtn: true,
        name: '覆盖导入',
        success: (data) => {
          if (data.state) {
            this._refreshTable()
            this.importPage = false
          }
        }
      }]
      this.columns = [{
        id: 'name',
        title: '姓名',
        className: 'text-left',
        width: 100,
        hidden: false,
        search: {
          type: 'input',
          data: {
            placeholer: '',
            autoFocus: true
          }
        },
        formatter: function (record) {
          return record.teacherBaseInfo ? record.teacherBaseInfo.name : ''
        }
      }, {
        id: 'phone',
        title: '联系方式',
        width: 120,
        className: 'text-left',
        hidden: false,
        search: {
          type: 'input',
          data: {
            placeholer: '',
            autoFocus: true
          }
        },
        formatter: function (record) {
          return record.teacherBaseInfo && record.teacherBaseInfo.teacherContactPO ? record.teacherBaseInfo.teacherContactPO.mobilePhone : ''
        }
      }, {
        id: 'synopsis',
        title: '简介',
        width: 100,
        className: 'text-left',
        hidden: false,
        width: 150
      }, {
        id: 'portrait',
        title: '照片',
        width: 100,
        className: 'text-left',
        hidden: false,
        formatter: (record) => {
          if (record.portrait) {
            return [{
              tag: 'img',
              text: '',
              src: this.imageUrlPrefix + record.portrait,
              className: 'img-style',
            }]
          }else {
            return [{
              tag: 'img',
              text: '',
              src: record.teacherBaseInfo.sex=='2'?this.picGirl:this.picBoy,
              className: 'img-style',
            }]
          }
        }
      }, {
        id: 'userNo',
        title: '账号',
        className: 'text-left',
        width: 120,
        hidden: false,
        search: {
          type: 'input',
          data: {
            placeholer: '',
            autoFocus: true
          }
        },
        formatter: function (record) {
          return record.userCertificationVO ? record.userCertificationVO.userNo : ''
        }
      },  {
        id: 'opt',
        title: '操作',
        className: 'text-left',
        width: 130,
        hidden: false,
        formatter: (recordItem) => {
          return [{
            tag: 'a',
            text: '查看',
            callback: (record, index) => {
              this.isCheck = true
              this.showAddModal = true
              this.modalType = '查看'
              this.isEditExternal = record.type === 'FULL_TIME' ? false : true
              this.consultantType = record.type
              var weekData = { 1: '周一', 2: '周二', 3: '周三', 4: '周四', 5: '周五', 6: '周六', 7: '周日' }
              var dutyTimeText = []
              if (record.timeTeacherSettings) {
                record.timeTeacherSettings.forEach((ele, index) => {
                  dutyTimeText.push(weekData[ele.dayOfWeek] + ' ' + ele.timeSetting.timeQuantumStart + '~' + ele.timeSetting.timeQuantumEnd)
                })
              }
              this.consultantData = {
                teacherBaseInfo: {
                  userId: record.teacherBaseInfo ? record.teacherBaseInfo.userId : '',
                  name: record.teacherBaseInfo ? record.teacherBaseInfo.name : '',
                  sex: record.teacherBaseInfo ? record.teacherBaseInfo.sex : '',
                  teacherContactPO: {
                    mobilePhone: record.teacherBaseInfo && record.teacherBaseInfo.teacherContactPO ? record.teacherBaseInfo.teacherContactPO.mobilePhone : ''
                  }
                },
                synopsis: record.synopsis,
                portrait: record.portrait,
                type: record.type,
                userCertificationVO: {
                  userNo: record.userCertificationVO ? record.userCertificationVO.userNo : '',
                  password: record.userCertificationVO ? record.userCertificationVO.password : ''
                }
              }
              this.dutyTime = dutyTimeText
            }
          }, {
            tag: 'a',
            text: '编辑',
            className: 'opt-btn',
            callback: (record, index) => {
              this.modalType = '编辑'
              this.isEditExternal = record.type === 'FULL_TIME' ? false : true
              this.consultantType = record.type
              this.isCheck = false
              this.showAddModal = true
              this.fullTimeConsultantId = record.teacherBaseInfo.userId
              this.consultantData = {
                userCertificationVO: record.userCertificationVO,
                teacherBaseInfo: {
                  userId: record.teacherBaseInfo ? record.teacherBaseInfo.userId : '',
                  name: record.teacherBaseInfo ? record.teacherBaseInfo.name : '',
                  sex: record.teacherBaseInfo ? record.teacherBaseInfo.sex : '',
                  teacherContactPO: {
                    mobilePhone: record.teacherBaseInfo && record.teacherBaseInfo.teacherContactPO ? record.teacherBaseInfo.teacherContactPO.mobilePhone : '',
                  }
                },
                synopsis: record.synopsis,
                portrait: record.portrait,
                type: record.type
              }
              if(!this.consultantData.portrait) {
                this.showDefaultImg = true
              }
            }
          }, {
            tag: 'a',
            text: recordItem.disable ? '启用' : '禁用',
            className: 'opt-btn',
            callback: (record, index) => {
              if (recordItem.disable) {
                sAjax({
                  url: '/api/mentality/teachers/using/' + record.teacherBaseInfo.userId,
                  type: 'post',
                  success: (data) => {
                    if (data.state) {
                      this._refreshTable()
                      this.$toast('启动成功！')
                    } else {
                      this.$toast(data.message)
                    }
                  }
                })
              } else {
                if (window.confirm('确定禁用吗？')) {
                  sAjax({
                    url: '/api/mentality/teachers/disable/' + record.teacherBaseInfo.userId,
                    type: 'post',
                    success: (data) => {
                      if (data.state) {
                        this._refreshTable()
                        this.$toast('禁用成功！')
                      } else {
                        this.$toast(data.message)
                      }
                    }
                  })
                }
              }
            }
          }]
        }
      }]
    },
    methods: {
      _selectConsultantType: function (opt) {
        this.consultantType = opt.value
      },
      _selectSex: function (opt) {
        if (this.isCheck) {
          return
        }
        this.consultantData.teacherBaseInfo.sex = opt.value
      },
      changeUserSearch: function () {
        this.isShowSearch = true
        this.userIdAndUserName = ''
        this.fullTimeConsultantId = ''
      },
      showConsultantTypeModal: function (type) {
        this.addType = type
        this.showTypeModal = true
        this.consultantType = ''
        this.consultantData.userCertificationVO = {
          userNo: '',
          password: ''
        }
      },
      sumbitTypeModal: function () {
        if (!this.consultantType) {
          return this.$toast('请先选择咨询师类型')
        }
        this.showTypeModal = false
        if (this.addType === 'batch') {
          this.showTypeModal = false
          this.importPage = true
          this.importParams.downloadTemplateUrl = '/mentality/teachers/batchCreate/templates/' + this.consultantType
          this.importParams.downloadErrorTemplateUrl = '/mentality/teachers/excel/error'
          this.importParams.checkTemplateUrl = '/mentality/teachers/excel/' + this.consultantType
        } else {
          if (this.consultantType === 'FULL_TIME') {
            this.showAddFullTimeModal = true
            this.userIdAndUserName = ''
            this.isShowSearch = true
            this.fullTimeConsultantId = ''
          } else {
            this.showAddModal = true
            this.isCheck = false
            this.modalType = '新增'
            this.consultantData = {
              teacherBaseInfo: {
                userId: '',
                name: '',
                sex: '',
                teacherContactPO: {
                  mobilePhone: ''
                }
              },
              synopsis: '',
              portrait: '',
              type: '',
              userCertificationVO: {
                userNo: '',
                password: ''
              }
            }
          }
        }
      },
      submitConsultantInfo: function () {
        if (this.modalType === '新增') {
          this._addConsultant()
        } else if (this.modalType === '编辑') {
          this._editConsultant()
        }
      },
      _checkDataIsExist: function () {
        var flag = true
        if (this.consultantType === 'EXTERNAL') {
          if (!this.consultantData.userCertificationVO.userNo) {
            this.$toast('请填写账号')
            return flag = false
          }
          if (!this.consultantData.userCertificationVO.password) {
            this.$toast('请填写密码')
            return flag = false
          }
        }
        if (!this.consultantData.teacherBaseInfo.name) {
          this.$toast('请填写姓名')
          return flag = false
        }
        if (!this.consultantData.teacherBaseInfo.sex) {
          this.$toast('请选择性别')
          return flag = false
        }
        if (!this.consultantData.teacherBaseInfo.teacherContactPO.mobilePhone) {
          this.$toast('请填写联系方式')
          return flag = false
        }
        if (!this.consultantData.synopsis) {
          this.$toast('请填写简介')
          return flag = false
        }
        // if (!this.consultantData.portrait) {
        //   this.$toast('请上传一张照片')
        //   return flag = false
        // }
        return flag
      },
      _addConsultant: function () {
        if (!this._checkDataIsExist()) {
          return
        }
        this.consultantData.type = 'EXTERNAL'
        sAjax({
          url: '/api/mentality/teachers',
          type: 'post',
          data: [this.consultantData],
          success: (data) => {
            if (data.state) {
              this.showAddModal = false
              this._refreshTable()
              this.$toast('添加成功！')
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _editConsultant: function () {
        if (!this._checkDataIsExist()) {
          return
        }
        sAjax({
          url: '/api/mentality/teachers/update',
          type: 'post',
          data: this.consultantData,
          success: (data) => {
            if (data.state) {
              this.showAddModal = false
              this._refreshTable()
              this.$toast('保存成功！')
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      isPhoneNo: function () {
        var pattern = /^1[3456789]\d{9}$/
        if (!pattern.test(this.consultantData.teacherBaseInfo.teacherContactPO.mobilePhone)) {
          this.$toast('联系方式格式不正确')
          this.showErrorColor = true
          return
        } else {
          this.showErrorColor = false
        }
      },
      sumbitFullTimeModal: function () {
        if (!this.fullTimeConsultantId) {
          return this.$toast('请先检索咨询师')
        }
        var arr = []
        arr.push({
          teacherBaseInfo: {
            userId: this.fullTimeConsultantId
          },
          type: 'FULL_TIME'
        })
        sAjax({
          url: '/api/mentality/teachers',
          type: 'post',
          data: arr,
          success: (data) => {
            if (data.state) {
              this.showAddFullTimeModal = false
              this._refreshTable()
              this.$toast('新增成功！')
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      consultantSelected: function (data) {
        this.fullTimeConsultantId = data.userId
        this.userIdAndUserName = data.name + ' (' + data.userNo + ')'
        this.isShowSearch = false
      },
      _refreshTable: function () {
        this.url = '/table-data/mentality/teachers/pages?timeStamp=' + createTime()
      },
      _fileUpload: function (event) {
        this.$waiting.show({
          text: '照片上传中...'
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
              this.consultantData.portrait = data.data.hash
              this.$toast('照片上传成功')
            } else {
              this.$toast(data.message)
            }
          }
        }).always(() => {
          this.$waiting.close()
        })
      },
      removeImg: function () {
        if (confirm('确定删除该照片吗？')) {
          this.consultantData.portrait = ''
          this.showDefaultImg = false
        }
      },
      _showAttachmentPreview: function () {
        
        let hash
        let sex = this.consultantData.teacherBaseInfo.sex
       if(this.consultantData.portrait) {
         hash = this.fileUrlPrefix + this.consultantData.portrait
       }else {
         if(sex == '2') {
           hash = this.picGirl
         }else {
           hash = this.picBoy
         }
         
       }
        this.$preview({
          name: '照片',
          url: hash,
          type: 'png'
        })
      },
    }
  }
</script>
<style lang="less">
@import url("../../assets/common.less");
#consultant-manage {
  .synopsis {
    white-space: normal;
    line-height: 1.5;
  }
  .img-style {
    width: 50px;
    // height: 80px;
  }
  .info-item {
    margin-top: 12px;
    overflow: hidden;
    .item-title {
      display: block;
      float: left;
      width: 57px;
      margin-right: 10px;
      font-size: 14px;
      color: #151515;
      letter-spacing: 0;
      text-align: right;
      line-height: 24px;
    }
    .info-options {
      width: 150px;
      display: inline-block;
      &.disabled-click {
        span {
          cursor: not-allowed;
        }
      }
      span {
        display: inline-block;
        margin-left: 1px;
        margin-right: 20px;
        margin-bottom: 17px;
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
  }
  .two-words-difference-margin {
    margin-left: 28px;
    min-width: 20px;
    margin-right: 0;
  }
  .add {
    background: #ffffff;
    border: none;
  }
  .form-label {
    color: #151515;
  }
  .form-input {
    border: 1px solid #d9d9d9;
    border-radius: 3px;
    width: 220px;
    height: 32px;
    font-size: 14px;
    display: inline-block;
    margin-left: 9px;
    margin-bottom: 6px;
    &.error {
      border: 1px solid red;
    }
    &:focus {
      box-shadow: none;
      outline: none;
    }
    &::-webkit-input-placeholder {
      color: #c1c1c1;
    }

    &::-moz-placeholder {
      color: #c1c1c1;
    }

    &:-ms-input-placeholder {
      color: #c1c1c1;
    }
  }
  .radio-group {
    margin-bottom: 13px;
    margin-top: -5px;
    .radio-area {
      display: inline-block;
      div {
        display: inline-block;
        margin-left: 14px;
        margin-right: 5px;
        cursor: pointer;
        label {
          margin-left: 5px;
        }
      }
    }
  }
  .textarea-label {
    vertical-align: top;
  }
  .modal-textarea {
    width: 79%;
    resize: none;
    margin-left: 10px;
    padding: 5px;
    border: 1px solid #e0e0e0;
    background: #ffffff;
    border-radius: 3px;
    outline: none;
    &:disabled {
      cursor: not-allowed;
    }
    &::-webkit-input-placeholder {
      color: #c1c1c1;
    }

    &::-moz-placeholder {
      color: #c1c1c1;
    }

    &:-ms-input-placeholder {
      color: #c1c1c1;
    }
  }
  .photo-show {
    position: relative;
    width: 150px;
    height: 180px;
    display: inline-block;
    // margin-left: 13px;
    cursor: pointer;
    background: #e0e0e0;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
    i {
      position: absolute;
      right: -11px;
      top: -11px;
      cursor: pointer;
      color: #298df7;
      border-radius: 100px;
      background: #ffffff;
    }
  }
  .duty-time {
    margin-left: 72px;
    margin-top: -26px;
    div {
      display: inline-block;
    }
  }
  .modal-search-user {
    height: 300px;
    .user-info {
      display: inline-block;
      margin-top: 10px;
    }
    i {
      margin-top: 8px;
      font-size: 20px;
      margin-left: 10px;
      cursor: pointer;
    }
  }
  .file-select {
    position: relative;
    display: inline-block;
    width: 150px;
    height: 180px;
    background: #e0e0e0;
    margin-left: 13px;
    text-decoration: underline;
    // overflow: hidden;
    cursor: pointer;
    i.uploadIcon {
      margin-left: 63px;
      margin-top: 77px;
    }
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
}
</style>
