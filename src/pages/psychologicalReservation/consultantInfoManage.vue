<template>
  <div id="consultant-info-manage" class="container">
    <div class="header">
      <div>咨询师个人信息</div>
    </div>
    <div class="content">
      <div class="row">
        <div class="col-md-4">
          <div class="form-group name-group">
            <label class="form-label two-words-difference-margin">姓名</label>
            <input type="text" class="form-control form-input" disabled="disabled"  placeholder="请输入姓名" v-model="consultantData.name">
          </div>
          <div class="info-item">
            <span class="item-title">性别</span>
            <div class="info-options">
              <span class="" v-for="(opt, i) in sexData" :key="i" @click="_selectSex(opt)">
                <i class="maticon" :class="consultantData.sex === opt.value?'active':''" v-html="icons(consultantData.sex === opt.value?'radio_button_checked':'radio_button_unchecked')"></i>{{opt.label}}
              </span>
            </div>
          </div>
          <div class="form-group ">
            <label class="form-label" style="min-width: 20px;">联系方式</label>
            <input type="text" class="form-control form-input" :class="showErrorColor?'error':''" placeholder="请输入联系方式"  v-model="consultantData.contact" @change="isPhoneNo">
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label class="textarea-label two-words-difference-margin">照片</label>
            <div class="file-select" v-if="!consultantData.imgHash&&!showDefaultImg">
              <i class="maticon" v-html="icons('file_upload')">file_upload</i>
              <input type="file" accept="image/*" @change="_fileUpload($event)">
            </div>
            <div v-else>
              <div v-if="showDefaultImg" class="photo-show" :style="{
              backgroundImage: consultantData.sex == '2'?`url(${picGirl})`:`url(${picBoy})`,
              backgroundSize: `100% 100%`
              }" @click="_showAttachmentPreview">
              <i class="maticon" v-html="icons('cancel')" @click.stop="removeImg">cancel</i>
            </div>
            <div v-else  class="photo-show" :style="{
              backgroundImage: consultantData.sex == '2'?`url(${imageUrlPrefix+ consultantData.imgHash + '?thumb=true'})`:`url(${imageUrlPrefix+ consultantData.imgHash + '?thumb=true'})`,
              backgroundSize: `100% 100%`
              }" @click="_showAttachmentPreview">
                 <i class="maticon" v-html="icons('cancel')" @click.stop="removeImg">cancel</i>
            </div>
            </div>
            
          </div>
        </div>
      </div>
      
      <div class="form-group">
        <label class="input-label two-words-difference-margin textarea-label">简介</label>
        <textarea cols="24" rows="5" class="modal-textarea" maxlength="300" placeholder="请输入300字以内的简介" v-model="consultantData.introduction"></textarea>
      </div>
    </div>
    <div class="info-footer">
        <button class="agree" @click="sumbit">保存</button>
    </div>
  </div>
  
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
        consultantData: {
          userId: '',
          account: '',
          password: '',
          name: '',
          contact: '',
          sex: '',
          introduction: '',
          imgHash: '',
          type: ''
        },
        sexData: [],
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
      sAjax({
        url: '/api/mentality/teachers/info',
        dataType: 'json',
        type: 'get',
        success: (data) => {
          if (data.state) {
            var data = data.data
            this.consultantData = {
              userId: data.teacherBaseInfo ? data.teacherBaseInfo.userId : '',
              account: data.userCertificationVO ? data.userCertificationVO.userNo : '',
              password: data.userCertificationVO ? data.userCertificationVO.password : '',
              name: data.teacherBaseInfo ? data.teacherBaseInfo.name : '',
              contact: data.teacherBaseInfo && data.teacherBaseInfo.teacherContactPO ? data.teacherBaseInfo.teacherContactPO.mobilePhone : '',
              sex: data.teacherBaseInfo ? data.teacherBaseInfo.sex : '',
              introduction: data.synopsis,
              imgHash: data.portrait,
              type: data.type
            }
            if(!this.consultantData.imgHash) {
              this.showDefaultImg = true
            }
          } else {
            this.$toast(data.message)
          }
        }
      })
    },
    methods: {
      _selectSex: function (opt) {
        return
        this.consultantData.sex = opt.value
      },
      _fileUpload: function (event) {
        this.$waiting.show({
          text: '附件上传中...'
        })
        var fd = new FormData()
        fd.append('file', event.target.files[0])
        fd.append('fieldName', event.target.files[0].name)
        console.log(event.target.files[0].name)
        sAjax({
          url: this.uploadFile,
          type: 'post',
          data: fd,
          contentType: false,
          processData: false,
          success: (data) => {
            if (data.code === '88888') {
              this.consultantData.imgHash = data.data.hash
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
          this.consultantData.imgHash = ''
          this.showDefaultImg = false
          
        }
      },
      _showAttachmentPreview: function () {
        let hash
        let sex = this.consultantData.sex
       if(this.consultantData.imgHash) {
         hash = this.fileUrlPrefix + this.consultantData.imgHash
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
      isPhoneNo: function () {
        var pattern = /^1[3456789]\d{9}$/
        if (!pattern.test(this.consultantData.contact)) {
          this.$toast('联系方式格式不对')
          this.showErrorColor = true
          return
        } else {
          this.showErrorColor = false
        }
      },
      sumbit: function () {
        sAjax({
          url: '/api/mentality/teachers/update',
          type: 'post',
          data: {
            synopsis: this.consultantData.introduction,
            teacherBaseInfo: {
              userId: this.consultantData.userId,
              name: this.consultantData.name,
              sex: this.consultantData.sex,
              teacherContactPO: {
                mobilePhone: this.consultantData.contact
              }
            },
            portrait: this.consultantData.imgHash,
            type: this.consultantData.type,
            userCertificationVO: {
              userNo: this.consultantData.account,
              password: this.consultantData.password
            }
          },
          success: (data) => {
            if (data.state) {
              this.$toast('保存成功！')
            } else {
              this.$toast(data.message)
            }
          }
        })
      }
    }
  }
</script>
<style lang="less">
@import url("../../assets/common.less");
#consultant-info-manage {
  height: 100%;
  padding: 0;
  margin: 24px auto;
  background: #fff;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
  font-family: PingFangSC-Medium;
  position: relative;
  .header {
    height: 58px;
    border-bottom: 2px solid #f5f5f5;
    div {
      font-size: 16px;
      padding-top: 18px;
      padding-left: 110px;
    }
  }
  .content {
    padding: 30px 84px;
    input[type="text"],
    textarea {
      border: 1px solid #d9d9d9;
      border-radius: 3px;
      padding: 3px 8px;
      resize: none;
      outline: none;
      box-shadow: none;
    }
    input[type="text"] {
      padding: 5px 8px;
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
    .form-input {
      display: inline-block;
      width: 220px;
      margin-left: 9px;
      font-size: 14px;
      &.error {
        border: 1px solid red;
      }
    }
    .name-group {
      margin-bottom: 25px;
    }
    .radio-group {
      margin-bottom: 25px;
      .radio-area {
        display: inline-block;
        div {
          display: inline-block;
          margin-left: 14px;
          margin-right: 5px;
          input[type="radio"] {
            float: left;
            cursor: pointer;
          }
          label {
            margin-left: 5px;
            cursor: pointer;
          }
        }
      }
    }
    .textarea-label {
      vertical-align: top;
    }
    .modal-textarea {
      width: 50%;
      margin-left: 10px;
    }
    .info-item {
      margin-bottom: 12px;
      overflow: hidden;
      .item-title {
        display: block;
        float: left;
        width: 56px;
        margin-right: 10px;
        font-size: 14px;
        font-weight: bold;
        color: #333333;
        letter-spacing: 0;
        text-align: right;
        line-height: 24px;
      }
      .info-options {
        width: 150px;
        display: inline-block;
        span {
          display: inline-block;
          margin-left: 1px;
          margin-right: 16px;
          margin-bottom: 12px;
          font-size: 14px;
          color: #555555;
          letter-spacing: 0.6px;
          text-align: left;
          line-height: 24px;
          cursor: not-allowed;
          i {
            float: left;
            margin-right: 2px;
            font-size: 22px;
            color: #d9d9d9;
          }
        }
      }
    }
    .photo-show {
      position: relative;
      width: 150px;
      height: 180px;
      display: inline-block;
      margin-left: 13px;
      background-size: 150px 180px;
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
        background: #fff;
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
      overflow: hidden;
      cursor: pointer;
      i {
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
  .info-footer {
    span {
      margin-right: 32px;
      font-size: 14px;
      color: #298df7;
      letter-spacing: 0;
      text-align: right;
      cursor: pointer;
    }
    .agree {
      width: 110px;
      height: 40px;
      margin-top: 24px;
      margin-left: 123px;
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
}
</style>
