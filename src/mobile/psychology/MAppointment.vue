<template>
  <div class="appointment-page">
    <view-box>
      <x-header title="完善资料" class="position-apply-header">
        <i slot="overwrite-left" class="maticon back-icon" v-html="icons('navigate_before')" @click="_back">navigate_before</i>
      </x-header>
      <div class="apply-content">
        <group class="info-group" :title="group.title" label-width="8em" label-margin-right="2em" label-align="left" v-for="(group, gIndex) in pageStatus.pageLayout.groups" :key="gIndex">
          <x-input :title="cell.title" placeholder="请填写" :max="cell.max" :readonly="cell.readonly" v-model="formFields[cell.name]" text-align="right" v-for="(cell, cIndex) in group.cells" :key="cIndex" :ref="`${cell.name}_input`" v-if="['input'].indexOf(cell.type)>=0"></x-input>
          <x-input :title="cell.title" placeholder="请填写" v-model="formFields[cell.name]" text-align="right" type="text" :debounce="500" @change.native="_checkVal(cell)" v-else-if="['number'].indexOf(cell.type)>=0"></x-input>
          <x-input :title="cell.title" placeholder="请填写" v-model="formFields[cell.name]" text-align="right" is-type="china-mobile" v-else-if="['tel'].indexOf(cell.type)>=0"></x-input>
          <x-textarea :title="cell.title" placeholder="请填写" :max="cell.max" v-model="formFields[cell.name]" v-else-if="['textarea'].indexOf(cell.type)>=0"></x-textarea>
          <datetime :title="cell.title" placeholder="请选择" v-model="formFields[cell.name]" value-text-align="right" format="YYYY-MM-DD HH:mm" @on-change="_valueChange($event, cell)" v-else-if="cell.type === 'datetime'"></datetime>
          <popup-radio :title="cell.title" :options="pageStatus.pageOptions[cell.name]||[]" placeholder="请选择" v-model="formFields[cell.name]" value-text-align="right" v-else-if="cell.type === 'radio'"></popup-radio>
          <popup-picker :title="cell.title" :data="pageStatus.pageOptions[cell.name]||[]" :columns="2" placeholder="请选择" v-model="formFields[cell.name]" value-text-align="right" :ref="cell.name+'_picker'" show-name v-else-if="cell.type === 'tree'"></popup-picker>
          <x-input :title="cell.title" readonly :placeholder="'请选择'" :value="_getNameStr(cell)" text-align="right" @on-focus="_focus(cell)" v-else-if="['checkbox'].indexOf(cell.type)>=0"></x-input>
          <div v-else-if="cell.type === 'attachment'">
            <x-input :title="cell.title" readonly>
              <span slot="right">
                <!-- <x-img class="img-item" :src="imageUrlPrefix+img" v-for="(img, iIndex) in formFields[cell.name]" :key="iIndex" @click.stop.native="_removeImage(cell.name, iIndex)"></x-img> -->
                <span class="img-control pull-right">
                  <i class="maticon" v-html="icons('add_a_photo')"></i>
                  <input type="file" @change="_uploadImages($event, cell, 'file')">
                </span>
              </span>
            </x-input>
            <div class="file-list">
              <p  v-for="(file,i) in formFields[cell.name]">
                <a class="file-link">{{file.name}}</a>
                <i class="maticon remove-icon" v-html="icons('cancel')" @click="formFields[cell.name].splice(i, 1)"></i>
              </p>
            </div>
          </div>
        </group>
        <box class="submit-box">
          <x-button plain type="primary" class="custom-primary-blue" @click.native="_submit">提交</x-button>
        </box>
        <div v-transfer-dom>
          <popup v-model="pageStatus.checkShow" position="bottom" max-height="70%">
            <group>
              <checklist v-model="formFields[pageStatus.editingField.name]" :options="pageStatus.pageOptions[pageStatus.editingField.name]||[]" v-if="pageStatus.checkShow"></checklist>
            </group>
          </popup>
        </div>
      </div>
    </view-box>
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
        formFields: {
          name: '获取中...',
          appointmentTime: '',
          familyMembers: []
        },
        pageStatus: {
          pageLayout: {
            groups: [{
              title: '',
              cells: [{
                title: '预约时间:',
                name: 'appointmentTime',
                type: 'input',
                readonly: true
              }, {
                title: '预约咨询师:',
                name: 'name',
                type: 'input',
                readonly: true
              }, {
                title: '联系方式(必填)',
                name: 'contact',
                type: 'input',
                required: true
              }, {
                title: '邮箱(必填)',
                name: 'email',
                type: 'input',
                required: true
              }]
            }, {
              title: '',
              cells: [{
                title: '家庭成员:',
                name: 'familyMembers',
                type: 'checkbox',
                required: false
              }, {
                title: '父母婚姻状况:',
                name: 'parentsMarriageSituation',
                type: 'radio',
                required: false
              }, {
                title: '家族精神病史:',
                name: 'psychiatricHistory',
                type: 'radio',
                required: false
              }, {
                title: '是否服用药物:',
                name: 'takeMedicine',
                type: 'radio',
                required: false
              }, {
                title: '是否有咨询经历:',
                name: 'hasConsultingExperience',
                type: 'radio',
                required: false
              }]
            }, {
              title: '',
              cells: [{
                title: '咨询问题(必填):',
                name: 'content',
                type: 'textarea',
                required: true
              }]
            }, {
              title: '',
              cells: [{
                title: '备注:',
                name: 'remark',
                type: 'textarea',
                required: false
              }]
            }]
          },
          pageOptions: {
            familyMembers: [],
            parentsMarriageSituation: [{
              key: '良好',
              value: '良好'
            }, {
              key: '一般',
              value: '一般'
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
            }]
          },
          editingField: {},
          checkShow: false,
          myCroppa: {},
          imageCut: {
            width: 360,
            height: 130,
            start: false,
            imageUrl: '',
            cell: {}
          }
        }
      }
    },
    methods: {
      _back: function () {
        this.$emit('removeBread', this.data)
      },
      _getNameStr: function (cell, key = 'key', value = 'value') {
        var str = ''
        if (this.pageStatus.pageOptions[cell.name] && this.pageStatus.pageOptions[cell.name].length > 0) {
          this.formFields[cell.name] && this.formFields[cell.name].forEach((val) => {
            this.pageStatus.pageOptions[cell.name].forEach((opt) => {
              if (val === opt[key]) {
                str += ' ' + opt[value]
              }
            })
          })
        }
        return str
      },
      _focus: function (cell) {
        this.pageStatus.editingField = cell
        if (['checkbox'].indexOf(cell.type) >= 0) {
          this.pageStatus.checkShow = true
        }
      },
      _submit: function () {
        var flag = this._verify()
        if (flag.length > 0) {
          this._toast('请完善必填信息！')
          return
        }
        this.formFields.reservationDate = this.data.time.dateTime
        this.$waiting.show()
        sAjax({
          url: '/api/mentality/reservation',
          type: 'post',
          data: this.formFields,
          success: (data) => {
            if (data.state) {
              this._toast('预约成功！')
              this.$waiting.close()
              // 这里记得将当前预约的时段的isReserved变为false
              // this.$emit('addBread', {
              //   route: '/partTime/positionMyApplies',
              //   title: ''
              // })
              this.$nextTick(() => {
                this.data.time.isReserved = true
                this._back()
              })
            } else {
              this._toast(data.message)
            }
          }
        })
      },
      _uploadImages: function (event, cell, way) {
        var url = '', data = {}, name = ''
        if (way === 'base64') {
          data.data = event
          url = this.uploadBase64
        } else if (way === 'file') {
          data = new FormData()
          data.append('file', event.target.files[0])
          name = event.target.files[0].name
          event.target.value = ''
          url = this.uploadFile
        } else {
          data = new FormData()
          data.append('file', event.target.files[0])
          event.target.value = ''
          url = this.uploadImage
        }
        sAjax({
          url: url,
          type: 'post',
          data: data,
          processData: way === 'base64',
          contentType: way === 'base64',
          success: (data) => {
            if (data.code === '88888' || data.state) {
              if (cell.type === 'images' || cell.type === 'attachment') {
                if (!this.formFields[cell.name]) {
                  this.$set(this.formFields, cell.name, [])
                }
                this.formFields[cell.name].push({ name: name, hash: data.data.hash })
              } else if (cell.type === 'image') {
                this.$set(this.formFields, cell.name, data.data.hash)
              }
            } else {
              this._toast(data.message)
            }
          }
        })
      },
      _valueChange: function (value, cell) {
        var startTime = this.formFields[cell.start], endTime = this.formFields[cell.end], start = 0, end = 0
        var valueTime = (new Date(value.replace(/\-\g/, '/'))).getTime()
        var message = ''
        startTime && (start = (new Date(startTime.replace(/\-\g/, '/'))).getTime())
        endTime && (end = (new Date(endTime.replace(/\-\g/, '/'))).getTime())
        if (startTime) {
          if (valueTime <= start) {
            message = `选择的时间要在${startTime}之后！`
          }
        }
        if (endTime) {
          if (valueTime >= end) {
            message = `选择的时间要在${endTime}之前！`
          }
        }
        if (cell.name === 'endTime') {
          var applyEndTime = this.formFields['applyEndTime']
          var aT = applyEndTime ? ((new Date(applyEndTime.replace(/\-\g/, '/'))).getTime()) : 0
          if (aT) {
            if (valueTime <= aT) {
              message = `选择的时间要在${applyEndTime}之后！`
            }
          }
        }
        if (message) {
          setTimeout(() => {
            this.formFields[cell.name] = ''
          }, 100);
          this.$vux.alert.show({
            title: message
          })
        }
      },
      _verify: function () {
        var flag = []
        this.pageStatus.pageLayout.groups.forEach((group) => {
          group.cells.forEach((cell) => {
            if (cell.required) {
              if (!this.formFields[cell.name]) {
                flag.push(cell.title)
              }
            }
          })
        })
        return flag
      },
      _toast: function (msg) {
        this.$vux.toast.show({
          text: msg,
          position: 'bottom',
          type: 'text'
        })
      }
    },
    created: function () {
      sAjax({
        url: '/api/system/dicts?dictType=家庭成员类型',
        type: 'get',
        success: (data) => {
          if (data.state) {
            data.data.forEach((ele) => {
              ele.key = ele.value
              ele.value = ele.label
            })
            this.$set(this.pageStatus.pageOptions, 'familyMembers', data.data)
          }
        }
      })
      this.formFields.firstTime = this.data.firstTime
      this.formFields.readmeId = this.data.protocolId
      this.formFields.dayTimeTeacherId = this.data.time.id
      this.formFields.appointmentTime = `${this.data.time.dateTime}  ${this.data.time.timeQuantum}`
      this.formFields.name = this.data.counselor.teacherBaseInfo.name
      sAjax({
        url: '/api/mentality/reservation/myStudentInfo',
        type: 'get',
        success: (data) => {
          if (data.state) {
            if (data.data) {
              for (var i in data.data) {
                this.$set(this.formFields, i, data.data[i])
              }
            }
          } else {
            this._toast('个人信息初始失败：' + data.message)
          }
        }
      })
    }
  }
</script>
<style lang="less">
.appointment-page {
  .position-apply-header {
    height: 56px;
    background: #fff;
    box-shadow: 0 2px 4px 0 rgba(154, 154, 154, 0.1);
    z-index: 100;
    padding: 0;
    .back-icon {
      color: #2e2e2e;
    }
    .vux-header-title {
      font-size: 18px;
      font-weight: bold;
      color: #101010;
      line-height: 56px;
    }
  }
  .apply-content {
    position: absolute;
    top: 56px;
    left: 0;
    bottom: 0;
    width: 100%;
    padding: 10px 16px 16px;
    z-index: 0;
    background: #f0f0f0;
    overflow: auto;
    .info-group {
      margin: 0 -16px 14px;
      .weui-cells {
        position: relative;
        margin-top: 0;
        background: #fff;
        &::before,
        &::after {
          height: 0;
          border: none;
        }
      }
      .weui-cell {
        padding: 14px 16px;
        font-size: 14px;
        &::before {
          left: 0;
        }
        &.img-input {
          input[type="text"] {
            display: none;
          }
        }
        p {
          margin: 0;
        }
        label {
          margin-bottom: 0;
        }
        input {
          padding-right: 0;
        }
        // .focus-red {
        //   color: #ff5252;
        // }
        .img-item-cover {
          width: 24px;
          height: 16px;
        }
        .img-item {
          height: 24px;
          margin-right: 16px;
        }
        .img-control {
          position: relative;
          display: block;
          width: 24px;
          height: 24px;
          &.img-unset {
            width: auto;
            height: auto;
          }
          input[type="file"] {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
          }
        }
      }
      .vux-cell-placeholder,
      .vux-cell-value,
      .weui-input {
        font-size: 13px;
        color: #333;
      }
      .weui-cell_access {
        .weui-cell__ft {
          padding-right: 0;
          &::after {
            border-width: 0;
          }
        }
      }
      .weui-icon-warn {
        margin-top: -5px;
      }
    }
    .attachment {
      label {
        padding: 10px 16px;
        font-size: 13px;
      }
    }
  }
  .custom-primary-blue {
    font-size: 18px;
    color: #ffffff;
    letter-spacing: 1.01px;
    line-height: 42px;
    border: none;
    background: #298df7;
    box-shadow: 0 -2px 3px 0 rgba(0, 0, 0, 0.16);
    border-radius: 3px;
  }
}
</style>
