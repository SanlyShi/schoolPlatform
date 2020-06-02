<template>

  <div id="positionApply" class="position-apply">
    <view-box>
      <x-header title="岗位申请" class="position-apply-header">
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
          applyDate: '今天',
          computerSkill: [],
          writeSkill: [],
          position: {
            id: ''
          }
        },
        pageStatus: {
          pageLayout: {
            groups: [{
              title: '',
              cells: [{
                title: '申请人姓名',
                name: 'name',
                type: 'input',
                readonly: true
              }, {
                title: '申请日期',
                name: 'applyDate',
                type: 'input',
                readonly: true
              }, {
                title: '联系方式',
                name: 'contact',
                type: 'input'
              }, {
                title: '工作开始时间',
                name: 'workStartTime',
                type: 'datetime',
                end: 'workEndTime',
                required: true
              }, {
                title: '工作结束时间',
                name: 'workEndTime',
                start: 'workStartTime',
                type: 'datetime',
                required: true
              }, {
                title: '可工作时间',
                name: 'validWorkTime',
                type: 'input',
                required: true
              }]
            }, {
              title: '',
              cells: [{
                title: '是否困难生',
                name: 'isDifficultyStudent',
                type: 'radio',
                required: true
              }, {
                title: '困难认定级别',
                name: 'difficultyLevel',
                type: 'radio',
                required: true
              }]
            }, {
              title: '',
              cells: [{
                title: '计算机能力',
                name: 'computerSkill',
                type: 'checkbox',
                required: true
              }, {
                title: '其它计算机能力',
                name: 'otherComputerSkill',
                type: 'input'
              }]
            }, {
              title: '',
              cells: [{
                title: '写作能力',
                name: 'writeSkill',
                type: 'checkbox',
                required: true
              }, {
                title: '其它写作能力',
                name: 'otherWriteSkill',
                type: 'input'
              }]
            }, {
              title: '',
              cells: [{
                title: '添加附件',
                name: 'attachment',
                type: 'attachment',
                start: '',
                end: 'applyEndTime',
                required: true
              }]
            }]
          },
          pageOptions: {
            isDifficultyStudent: [{
              key: true,
              value: '是'
            }, {
              key: false,
              value: '否'
            }],
            computerSkill: [{
              name: 'PPT',
              key: 'PPT',
              value: 'PPT'
            }, {
              name: 'Word',
              key: 'Word',
              value: 'Word'
            }, {
              name: 'Excel',
              key: 'Excel',
              value: 'Excel'
            }, {
              name: 'Access',
              key: 'Access',
              value: 'Access'
            }, {
              name: '视频制作',
              key: '视频制作',
              value: '视频制作'
            }, {
              name: '网站制作',
              key: '网站制作',
              value: '网站制作'
              // },{
              //   name: '其它',
              //   key: '其它',
              //   value: '其它'
            }],
            writeSkill: [{
              name: '新闻写作',
              key: '新闻写作',
              value: '新闻写作'
            }, {
              name: '调研报告',
              key: '调研报告',
              value: '调研报告'
            }, {
              name: '应用文写作',
              key: '应用文写作',
              value: '应用文写作'
            }, {
              name: '文字编辑',
              key: '文字编辑',
              value: '文字编辑'
              // },{
              //   name: '其它',
              //   key: '其它',
              //   value: '其它'
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
        // /pwps/workflow/runtime/applications
        var flag = this._verify()
        if (flag.length > 0) {
          // this.$vux.alert.show({
          //   title: flag.join(',   ') + '必填！'
          // })
          this._toast('请完善申请信息！')
          return
        }
        var result = JSON.parse(JSON.stringify(this.formFields))
        if (result.otherComputerSkill) {
          if (!result.computerSkill) {
            result.computerSkill = []
          }
          result.computerSkill.push(result.otherComputerSkill)
        }
        if (result.otherWriteSkill) {
          if (!result.writeSkill) {
            result.writeSkill = []
          }
          result.writeSkill.push(result.otherWriteSkill)
        }

        result.workEndTime && (result.workEndTime += ':00')
        result.workStartTime && (result.workStartTime += ':00')
        // var arr = []
        // result['attachment'] && result['attachment'].forEach((ele) => {
        //   arr.push(ele.hash)
        // })
        // result['attachment'] = arr
        sAjax({
          url: '/api/pwps/workflow/runtime/applications',
          type: 'post',
          data: result,
          success: (data) => {
            if (data.state) {
              this._toast('提交成功，等待审核')
              this.$emit('addBread', {
                route: '/partTime/positionMyApplies',
                title: ''
              })
              this.$nextTick(() => {
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
              if (typeof this.formFields[cell.name] != 'boolean' && !this.formFields[cell.name]) {
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
      var now = new Date()
      this.formFields.applyDate = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`
      this.formFields.position.id = this.data.data.position.id
      sAjax({
        url: '/login/check',
        type: 'get',
        success: (data) => {
          if (data.state) {
            this.formFields.name = data.data.name
          }
        }
      }).always(() => {

      })
      sAjax({
        url: '/api/system/dicts?dictType=困难等级',
        type: 'get',
        success: (data) => {
          if (data.state) {
            data.data.forEach((ele) => {
              ele.key = ele.value
              ele.value = ele.label
            })
            this.$set(this.pageStatus.pageOptions, 'difficultyLevel', data.data)
          }
        }
      })
    }
  }
</script>
<style lang="less">
#positionApply.position-apply {
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
        label {
          margin-bottom: 0;
        }
        input {
          padding-right: 0;
        }
        p {
          margin: 0;
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
  .file-list {
    padding: 10px 16px;
    .remove-icon {
      float: right;
    }
  }
  .file {
    display: inline-block;
    font-size: 13px;
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
