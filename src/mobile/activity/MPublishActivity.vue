<template>
  <div id="activityPublish">
    <view-box>
      <x-header title="发布活动">
        <i slot="overwrite-left" class="maticon back-icon" v-html="icons('navigate_before')" @click="_back">navigate_before</i>
      </x-header>
      <div class="publish-content">
        <group class="info-group" :title="group.title" label-width="8em" label-margin-right="2em" label-align="left" v-for="(group, gIndex) in pageStatus.pageLayout.groups" :key="gIndex">
          <group v-for="(cell, cIndex) in group.cells" :key="cIndex" style="position: relative;">
            <div class="require">{{cell.required?'*':''}}</div>
            <x-input :title="cell.title" :show-clear="false" placeholder="请输入" :max="cell.max" v-model="formFields[cell.name]" text-align="right" :ref="`${cell.name}_input`" v-if="['input'].indexOf(cell.type)>=0"></x-input>
            <x-input :title="cell.title" :show-clear="false" placeholder="请输入" v-model="formFields[cell.name]" text-align="right" type="text" :debounce="500" @change.native="_checkVal(cell)" v-else-if="['number'].indexOf(cell.type)>=0"></x-input>
            <x-input :title="cell.title" :show-clear="false" placeholder="请输入" v-model="formFields[cell.name]" text-align="right" is-type="china-mobile" v-else-if="['tel'].indexOf(cell.type)>=0"></x-input>
            <x-textarea :title="cell.title" :class="{'textarea': !formFields[cell.name]}" placeholder="请输入" :max="cell.max" v-model="formFields[cell.name]" v-else-if="['textarea'].indexOf(cell.type)>=0"></x-textarea>
            <datetime :title="cell.title" placeholder="请选择" v-model="formFields[cell.name]" value-text-align="right" format="YYYY-MM-DD HH:mm" @on-change="_valueChange($event, cell)" v-else-if="cell.type === 'datetime'"></datetime>
            <popup-radio arrow-direction :title="cell.title" :options="pageStatus.pageOptions[cell.name]||[]" placeholder="请选择" v-model="formFields[cell.name]" value-text-align="right" v-else-if="cell.type === 'radio'"></popup-radio>
            <popup-picker arrow-direction :title="cell.title" :data="pageStatus.pageOptions[cell.name]||[]" :columns="2" placeholder="请选择" v-model="formFields[cell.name]" value-text-align="right" :ref="cell.name+'_picker'" show-name v-else-if="cell.type === 'tree'"></popup-picker>
            <x-input :title="cell.title" :value="selectPoint" readonly=true text-align="right" type="text" v-else-if="formFields['activityType']&&cell.name === 'treePoint'"></x-input>
            <x-input :title="cell.title" readonly :placeholder="cell.name==='studentOriented'?'全校':'请选择'" :value="_getNameStr(cell)" text-align="right" @on-focus="_focus(cell)" v-else-if="!cell.hide&&['checkbox'].indexOf(cell.type)>=0"></x-input>
            <div class="weui-cell image" v-else-if="cell.type === 'image'">
              <label class="title">{{cell.title}}</label>
              <div class="img-body">
                <div class="img-item-cover" v-if="formFields[cell.name]">
                  <img :src="imageUrlPrefix+formFields[cell.name]" alt="">
                  <input type="file" @change="_startCut($event, cell)">
                </div>
                <div class="choose-img" v-else>
                  <img :src="require('../../../mobile_static/image/addIcon.png')" alt="">
                  <input type="file" @change="_startCut($event, cell)">
                </div>
              </div>
            </div>
            <div class="weui-cell images" v-else-if="cell.type === 'images'">
              <label class="title">{{cell.title}}</label>
              <div class="box_flex">
                <x-img class="img-item" :src="imageUrlPrefix+img"  v-for="(img, iIndex) in formFields[cell.name]" :key="iIndex" @click.stop.native="_removeImage(cell.name, iIndex)"></x-img>
                <div class="choose-img">
                  <img :src="require('../../../mobile_static/image/addIcon.png')" alt="">
                  <input type="file" @change="_uploadImages($event, cell)">
                </div>
              </div>
            </div>
            <!-- <x-input class="img-input" :title="cell.title" v-model="formFields[cell.name]" v-else-if="cell.type === 'image'">
              <span slot="right">
                <span class="img-control pull-right">
                  <x-img class="img-item-cover" :src="imageUrlPrefix+formFields[cell.name]" v-if="formFields[cell.name]"></x-img>
                  <i class="maticon" style="color:#999" v-html="icons('add_a_photo')" v-else></i>
                  <input type="file" @change="_startCut($event, cell)">
                </span>
              </span>
            </x-input>
            <x-input :title="cell.title" readonly v-else-if="cell.type === 'images'">
              <span slot="right">
                <x-img class="img-item" :src="imageUrlPrefix+img" v-for="(img, iIndex) in formFields[cell.name]" :key="iIndex" @click.stop.native="_removeImage(cell.name, iIndex)"></x-img>
                <span class="img-control pull-right">
                  <i class="maticon" style="color:#999" v-html="icons('add_a_photo')"></i>
                  <input type="file" @change="_uploadImages($event, cell)">
                </span>
              </span>
            </x-input> -->

            <cell :title="cell.title" :value="formFields[cell.name]||'请输入'" @click.native="showDetect=true" v-else-if="cell.type === 'detect'">
            </cell>
          </group>
        </group>
        <box class="submit-box">
          <x-button plain type="primary" class="custom-primary-blue" @click.native="_submit">发布活动</x-button>
        </box>
        <div v-transfer-dom>
          <popup class="act-modal-wrap" v-model="showDetect" height="100%" is-transparent>
            <div class="act-modal">
              <div class="body">
                 <detect class="form-control search-input modal-form-style" url="/api/users/search" :searchVal="formFields.userNo?formFields.teacherName+'('+formFields.userNo+')':''" type="query" @afterSelected="_detect"></detect>
              </div>
              <div class="bottom">
                <div class="act-btn" @click="modalCancel">取消</div>
                <div class="act-btn sure" @click="modalSure">确定</div>
              </div>
            </div>
          </popup>
        </div>
        <div v-transfer-dom>
          <popup v-model="pageStatus.checkShow" position="bottom" max-height="70%">
            <group :title="formFields[pageStatus.editingField.name]&&formFields[pageStatus.editingField.name].length>0?('已选择'+formFields[pageStatus.editingField.name].length+'项'):pageStatus.editingField.title">
              <checklist v-model="formFields[pageStatus.editingField.name]" :options="pageStatus.pageOptions[pageStatus.editingField.name]||[]" v-if="pageStatus.checkShow"></checklist>
            </group>
          </popup>
        </div>
        <div v-transfer-dom>
          <popup class="cut-wrap" v-model="pageStatus.imageCut.start" height="100%">
            <croppa class="cut" v-model="pageStatus.myCroppa" :width="pageStatus.imageCut.width" :height="pageStatus.imageCut.width/2" :initial-image="pageStatus.imageCut.imageUrl" :show-remove-button="false" :disable-click-to-choose="false">
              <img slot="initial" :src="pageStatus.imageCut.imageUrl" />
            </croppa>
            <div class="cut-wrap">
              <x-button type="warn" :style="`width:${pageStatus.imageCut.width}px;`" @click.native="_endCut(false)">取消</x-button>
            <x-button type="primary" :style="`width:${pageStatus.imageCut.width}px;`" @click.native="_endCut(true)">确定</x-button>
            </div>
          </popup>
        </div>
      </div>
    </view-box>
  </div>
</template>
<script>
import { sAjax, translation,request } from '../../assets/utils/utils.js'
export default {
  props: {
    data: {
      default: null
    }
  },
  data: function () {
    return {
      teacher: null,
      showDetect: false,
      // 字段默认值
      formFields: {
        name: '',
        teacherName: '',
        classTime: '',
        peopleType: 'ALL',
        activityPictures: [],
        applyAuditNeeded: true,
        applyEndTime: '',
        applyStartTime: '',
        endTime: '',
        startTime: '',
        userLimit: ''
      },
      detectShow: false,
      pageStatus: {
        pageLayout: {
          groups: [{
            title: '',
            cells: [{
              title: '活动名称',
              name: 'name',
              type: 'input',
              required: true
            }, {
              title: '活动定位',
              name: 'activityCategory',
              type: 'radio',
              required: true
            }]
          },{
            title: '',
            cells: [{
              title: '任课教师',
              name: 'teacherName',
              type: 'detect',
              required: false
            }, {
              title: '上课时间',
              name: 'classTime',
              type: 'input',
              required: false
            }]
          }, {
            title: '',
            cells: [{
              title: '发布方',
              name: 'publisher',
              type: 'radio',
              required: true
            }, {
              title: '主办方',
              name: 'holder',
              type: 'radio',
              required: true
            }, {
              title: '承办方',
              name: 'organizer',
              type: 'radio',
              required: false
            }, {
              title: '协办方',
              name: 'coOrganizer',
              type: 'radio',
              required: false
            }]
          }, {
            title: '',
            cells: [{
              title: '活动封面',
              name: 'activityCover',
              type: 'image',
              required: false
            }, {
              title: '活动图片',
              name: 'activityPictures',
              type: 'images',
              required: false
            }, {
              title: '活动简介',
              name: 'introduction',
              type: 'textarea',
              max: 1000,
              required: true
            }, {
              title: '活动类型',
              name: 'activityType',
              type: 'tree',
              required: true
            }, {
              title: '活动积分',
              name: 'treePoint',
              type: 'text',
              required: false
            }]
          }, {
            title: '',
            cells: [{
              title: '报名开始时间',
              name: 'applyStartTime',
              type: 'datetime',
              start: '',
              end: 'applyEndTime',
              required: true
            }, {
              title: '报名结束时间',
              name: 'applyEndTime',
              type: 'datetime',
              start: 'applyStartTime',
              end: 'endTime',
              required: true
            }, {
              title: '活动开始时间',
              name: 'startTime',
              type: 'datetime',
              start: 'applyStartTime',
              end: 'endTime',
              required: true
            }, {
              title: '活动结束时间',
              name: 'endTime',
              type: 'datetime',
              start: 'startTime',
              end: '',
              required: true
            }, {
              title: '活动地点',
              name: 'place',
              type: 'textarea',
              max: 50,
              required: true
            }, {
              title: '联系方式',
              name: 'telephoneNumber',
              type: 'input',
              required: true
            }]
          }, {
            title: '',
            cells: [{
              title: '面向群体',
              name: 'peopleType',
              type: 'radio',
              required: true
            }, 
            {
              hide: true,
              title: '',
              name: 'peopleList',
              type: 'checkbox',
              required: false
            },
            {
              title: '人数上限',
              name: 'userLimit',
              type: 'number',
              required: false
            }, {
              title: '报名是否审核',
              name: 'applyAuditNeeded',
              type: 'radio',
              required: true
            }]
          }]
        },
        pageOptions: {
          applyAuditNeeded: [{
            key: true,
            value: '是'
          }, {
            key: false,
            value: '否'
          }],
          peopleType: [
            { key: "ALL", value: " 全体"},
            { key: "GRADE", value: "年级"},
            { key: "COLLEGE", value: "学院"},
          ],
          peopleList: [],
          collegesList: [],//面向群体列表,外语系,信工院之类
          gradesList: [],
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
      },
      isChange: false
    }
  },
  watch: {
    historyForm: {
      handler: function (val, oldVal) {
        if (val !== oldVal) {
          this.isChange = true
        }
      },
      deep: true
    },
    changePeople(val, oldVal) {
      this.pageStatus.pageLayout.groups[5].cells[1].hide = true
      this.pageStatus.pageOptions.peopleList = []
      if(val !== 'ALL') {
        this.pageStatus.pageLayout.groups[5].cells[1].hide = false
        this.pageStatus.pageOptions.peopleList = val=='COLLEGE' ? this.pageStatus.pageOptions.collegesList : this.pageStatus.pageOptions.gradesList
      }
    }
  },
  computed: {
    changePeople() {
      return this.formFields.peopleType
    },
    republish: function () {
      return this.data.data.initData ? true : false
    },
    historyForm: function () {
      return JSON.stringify(this.formFields)
    },
    selectPoint() {
      if (this.formFields['activityType'] && this.pageStatus.pageOptions.activityType) {
        for (var i in this.pageStatus.pageOptions.activityType) {
          if (this.formFields['activityType'][1] === this.pageStatus.pageOptions.activityType[i].value) {
            return this.pageStatus.pageOptions.activityType[i].point
          }
        }
      }
      return 0;
    }
  },
  created: function () {
    this._getPublishers()
    this._getHolders()
    this._getGroups()
    this._getContentTypes()
    this._getActivityTypes()
    this.getCollegesList()
    this.getGradesList()
    if (this.republish) {
      this._initPublish(this.data.data.initData)
    }
  },
  methods: {
    _detect (member) {
      this.teacher = member
      // this.teacher.userNo = member.userNo
      // this.teacher.teacherName = member.name
      // this.params.managerId = member.userId
      // this.params.manager = member
      // this.showDetect = false
    },
    modalCancel() {
      this.teacher = null
      // this.params.managerId = member.userId
      // this.params.manager = member
      this.showDetect = false
    },
    modalSure() {
      this.formFields.teacherId = this.teacher.userId
      this.formFields.userNo = this.teacher.userNo
      this.formFields.teacherName = this.teacher.name
      // this.params.managerId = member.userId
      // this.params.manager = member
      this.showDetect = false
    },
    _initPublish: function (data) {
      for (var i in data) {
        this.$set(this.formFields, i, data[i])
      }
      data.organizations.forEach((org) => {
        if (org.type === 'PUBLISHER') {
          this.$set(this.formFields, 'publisher', org.organizationId)
        } else if (org.type === 'SPONSOR') {
          if (!this.formFields.holder) {
            this.$set(this.formFields, 'holder', [])
          }
          this.formFields.holder.push(org.organizationId)
        } else if (org.type === 'PURVEYOR') {
          if (!this.formFields.organizer) {
            this.$set(this.formFields, 'organizer', [])
          }
          this.formFields.organizer.push(org.organizationId)
        } else if (org.type === 'ASSISTANT') {
          if (!this.formFields.coOrganizer) {
            this.$set(this.formFields, 'coOrganizer', [])
          }
          this.formFields.coOrganizer.push(org.organizationId)
        }
      })

      this.$set(this.formFields, 'studentOriented', [])
      data.studentOriented.forEach((so) => {
        this.formFields.studentOriented.push(so.code + '')
      })
      data.images.forEach((img) => {
        if (img.isCover) {
          this.$set(this.formFields, 'activityCover', img.image)
        } else {
          if (!this.formFields.activityPictures) {
            this.$set(this.formFields, 'activityPictures', [])
          }
          this.formFields.activityPictures.push(img.image)
        }
      })
      this.$set(this.formFields, 'activityType', [data.contentTypeParentId + '', data.contentTypeId + ''])
      this.$set(this.formFields, 'activityCategory', data.typeId)
      this.$set(this.formFields, 'telephoneNumber', data.contactWay)
      this.$set(this.formFields, 'id', data.id + '')
    },
    _checkVal: function (cell) {
      if (!/^\d+(\.{0,1}\d+){0,1}$/.test(this.formFields[cell.name])) {
        this.formFields[cell.name] = ''
      }
    },
    _getHourMinuteList: function (cell) {
      var startHour = 0, endHour = 23, startMinute = 0, endMinute = 0,
        startTime = this.formFields[cell.start],
        endTime = this.formFields[cell.end],
        obj = {
          hourList: [],
          minuteList: []
        }

      for (var h = 0; h < 24; h++) {
        obj.hourList.push(('0' + h).slice(-2))
      }

      for (var m = 0; m < 24; m++) {
        obj.minuteList.push(('0' + m).slice(-2))
      }

      if (startTime) {
        startHour = parseInt(startTime.slice(10, 13))
        startMinute = parseInt(startTime.slice(13, 16))
        startTime = (new Date(startTime.replace(/\-\g/, '/'))).getTime()
      } else {
        return obj
      }
      if (endTime) {
        endHour = parseInt(endTime.slice(10, 13))
        endMinute = parseInt(startTime.slice(13, 16))
        endTime = (new Date(endTime.replace(/\-\g/, '/'))).getTime()
      } else {
        return obj
      }

      var arr = []
      var hours = (endTime - startTime) / 3600000
      var minutes = (endTime - startTime) / 60000
      if (hours < 24) {
        obj.hourList = []
        for (var i = 0; i < hours; i++) {
          obj.hourList.push(('0' + ((startHour + i) > 23 ? (startHour + i - 24) : (startHour + i))).slice(-2))
        }
      }
      if (minutes < 60) {
        obj.minuteList = []
        for (var j = 0; j < minutes; j++) {
          obj.minuteList.push(('0' + ((startMinute + j) > 59 ? (startMinute + j - 60) : (startMinute + j))).slice(-2))
        }
      }
      return obj
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
    _startCut: function (event, cell) {
      if (event.target.files[0]) {
        var that = this
        this.pageStatus.imageCut.start = true
        this.pageStatus.imageCut.cell = cell
        var reader = new FileReader()
        reader.onloadend = function (evt) {
          that.pageStatus.imageCut.imageUrl = evt.target.result
        }
        reader.readAsDataURL(event.target.files[0])
        event.target.value = ''
      }
    },
    _endCut: function (isCut) {
      if (isCut) {
        var base64 = this.pageStatus.myCroppa.generateDataUrl(
          'image/jpeg', 0.52
        )
        this._uploadImages(base64, this.pageStatus.imageCut.cell, 'base64')
      }
      this.pageStatus.imageCut.start = false
      this.pageStatus.imageCut.imageUrl = ''
      this.pageStatus.cell = {}
    },
    _removeImage: function (fieldName, index) {
      this.$vux.confirm.show({
        title: '确定删除该图片吗？',
        onConfirm: () => {
          this.formFields[fieldName].splice(index, 1)
        }
      })
    },
    _uploadImages: function (event, cell, way) {
      var url = '', data = {}
      if (way === 'base64') {
        data.data = event
        url = this.uploadBase64
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
            if (cell.type === 'images') {
              if (!this.formFields[cell.name]) {
                this.$set(this.formFields, cell.name, [])
              }
              this.formFields[cell.name].push(data.data.hash)
            } else if (cell.type === 'image') {
              this.$set(this.formFields, cell.name, data.data.hash)
            }
          } else {
            this._toast(data.message)
          }
        }
      })
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
    _back: function (isUpdate) {
      if (this.isChange) {
        this.$vux.confirm.show({
          title: '返回将会丢失编辑内容，是否返回？',
          onConfirm: () => {
            this.$emit('removeBread', this.data)
          }
        })
      } else {
        this.$emit('removeBread', this.data)
      }
    },
    _submit: function () {
      var flag = this._verify()
      if (flag.length > 0) {
        // this.$vux.alert.show({
        //   title: flag.join(',   ') + '必填！'
        // })
        this._toast('请完善活动信息！')
        return
      }

      // var errorStr = this._verifyTime()
      this.$vux.confirm.show({
        title: '确定提交活动内容等候审核?',
        onConfirm: () => {
          var res = this._format(this.formFields)
          sAjax({
            url: '/api/sc/activities' + (this.republish ? ('/' + this.formFields.id) : ''),
            type: 'post',
            data: res,
            success: (data) => {
              if (data.state) {
                this._toast('发布成功', () => {
                  this.data.isUpdateLastPage = true
                  this.$emit('removeBread', this.data)
                })
              } else {
                this._toast(data.message)
              }
            }
          })
        }
      })
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
    _format: function (obj) {
      var newObj = JSON.parse(JSON.stringify(obj))
      newObj.organizations = []
      newObj.publisher && newObj.organizations.push({
        organizationId: newObj.publisher,
        type: 'PUBLISHER'
      })
      delete newObj.publisher
      newObj.holder && newObj.organizations.push({
        organizationId: newObj.holder,
        type: 'SPONSOR'
      })
      //   var h = {
      //     organizationId: id,
      //     type: 'SPONSOR'
      //   }
      //   newObj.organizations.push(h)
      // })
      delete newObj.holder
      newObj.organizer && newObj.organizations.push({
        organizationId: newObj.organizer,
        type: 'PURVEYOR'
      })
      //   var h = {
      //     organizationId: id,
      //     type: 'PURVEYOR'
      //   }
      //   newObj.organizations.push(h)
      // })
      delete newObj.organizer
      newObj.coOrganizer && newObj.organizations.push({
        organizationId: newObj.coOrganizer,
        type: 'ASSISTANT'
      })
      //   var h = {
      //     organizationId: id,
      //     type: 'ASSISTANT'
      //   }
      //   newObj.organizations.push(h)
      // })
      delete newObj.coOrganizer
      var arr = []
      newObj.peopleList && newObj.peopleList.forEach((code) => {
        arr.push({ code: code })
      })
      newObj.studentOriented = []
      newObj.grade = []
      if(newObj.peopleType=='COLLEGE'){
        newObj.studentOriented = arr
      } else if(newObj.peopleType=='GRADE') {
        newObj.grade = newObj.peopleList
      }

      newObj.images = []
      newObj.activityCover && newObj.images.push({
        image: newObj.activityCover,
        isCover: true
      })
      delete newObj.activityCover

      newObj.activityPictures && newObj.activityPictures.forEach((hash) => {
        newObj.images.push({
          image: hash,
          isCover: false
        })
      })
      delete newObj.activityPictures

      newObj.activityType && (newObj.contentTypeId = newObj.activityType[1])
      delete newObj.activityType

      newObj.activityCategory && (newObj.typeId = newObj.activityCategory)
      delete newObj.activityCategory

      newObj.telephoneNumber && (newObj.contactWay = newObj.telephoneNumber)
      delete newObj.telephoneNumber
      
      console.log(newObj)
      return newObj
    },
    _getPublishers: function () {
      if (!this.pageStatus.pageOptions['publisher']) {
        this.$set(this.pageStatus.pageOptions, 'publisher', [])
      }
      if (this.data.data && this.data.data.publishers) {
        this.data.data.publishers.forEach((org) => {
          var item = {
            key: org.id,
            value: org.name
          }
          this.pageStatus.pageOptions['publisher'].push(item)
        })
      }
    },
    _getHolders: function () {
      sAjax({
        url: '/api/sc/organizations/list/brief',
        type: 'get',
        success: (data) => {
          if (data.state) {
            if (!this.pageStatus.pageOptions['holder']) {
              this.$set(this.pageStatus.pageOptions, 'holder', [])
            }
            if (!this.pageStatus.pageOptions['organizer']) {
              this.$set(this.pageStatus.pageOptions, 'organizer', [])
            }
            if (!this.pageStatus.pageOptions['coOrganizer']) {
              this.$set(this.pageStatus.pageOptions, 'coOrganizer', [])
            }
            if (data.data) {
              var arr = []
              data.data.forEach((org) => {
                var item = {
                  key: org.id,
                  value: org.name
                }
                arr.push(item)
              })
              this.pageStatus.pageOptions['holder'] = arr
              this.pageStatus.pageOptions['organizer'] = arr
              this.pageStatus.pageOptions['coOrganizer'] = arr
            }

          } else {
            this._toast('举办方列表获取失败')
          }
        }
      })
    },
    _getGroups: function () {
      sAjax({
        url: '/api/colleges',
        type: 'get',
        success: (data) => {
          if (data.state) {
            if (!this.pageStatus.pageOptions['studentOriented']) {
              this.$set(this.pageStatus.pageOptions, 'studentOriented', [])
            }
            if (data.data) {
              data.data.forEach((college) => {
                var item = {
                  key: college.code,
                  value: college.name
                }
                this.pageStatus.pageOptions['studentOriented'].push(item)
              })
            }
          } else {
            this._toast('群体列表获取失败')
          }
        }
      })
      this.pageStatus.pageOptions
    },
    getCollegesList() {
      let url = "/api/colleges";
      request(url).then(o => {
        this.pageStatus.pageOptions.collegesList = []
        if (o.state) {
          o.data.map((item, index)=> {
            this.pageStatus.pageOptions.collegesList.push({key: item.code, value: item.name});
          })
        }
      });
    },
    getGradesList() {
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      year = month < 7 ? year -1 : year
      for(let i = 0; i < 5; i++) {
        this.pageStatus.pageOptions.gradesList.push({key: `${year-i}`, value: `${year-i}级`})
      }
      
    },
    _getContentTypes: function () {
      sAjax({
        url: '/api/sc/activityContentType',
        type: 'get',
        success: (data) => {
          if (data.state) {
            if (!this.pageStatus.pageOptions['activityType']) {
              this.$set(this.pageStatus.pageOptions, 'activityType', [])
            }
            if (data.data) {
              data.data.forEach((type) => {
                var item = {
                  value: type.id + '',
                  name: type.typeName,
                  parent: 0
                }
                if (type.childType.length > 0) {
                  this.pageStatus.pageOptions['activityType'].push(item)
                }
                
                type.childType.length > 0 && type.childType.forEach((typeChild) => {
                  var item2 = {
                    value: typeChild.id + '',
                    name: typeChild.typeName,
                    parent: type.id + '',
                    point: typeChild.point,
                  }
                  this.pageStatus.pageOptions['activityType'].push(item2)
                })
              })
            }
          } else {
            this._toast('活动类型列表获取失败')
          }
        }
      })
    },
    _getActivityTypes: function () {
      sAjax({
        url: '/api/sc/activities/types',
        type: 'get',
        success: (data) => {
          if (data.state) {
            if (!this.pageStatus.pageOptions['activityCategory']) {
              this.$set(this.pageStatus.pageOptions, 'activityCategory', [])
            }
            if (data.data) {
              data.data.forEach((cat) => {
                var item = {
                  key: cat.id,
                  value: cat.name
                }
                this.pageStatus.pageOptions['activityCategory'].push(item)
              })
            }
          } else {
            this.$vux.toast.show({
              text: data.message,
              position: 'bottom',
              type: 'text'
            })
          }
        }
      })
    },
    _toast: function (msg, cb) {
      this.$vux.toast.show({
        text: msg,
        position: 'bottom',
        type: 'text',
        time: 1500,
        onHide: cb
      })
    }
  },
  mounted: function () {
    // this.$nextTick(() => {
    //   this.$refs['name_input'][0].focus()
    // })

    // $('.publish-content').scroll(function(evt){
    //   console.log(evt.target)
    // })
  }
}
</script>
<style lang="less">
.act-modal-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  .modal-form-style {
    margin-left: 0;
  }
}
   
.cut-wrap {
  margin-top: 200px;
}
.cut {
  width: 360px;
  height: 180px;
  background-color: transparent;
  position: absolute;
  left: 50%;
  margin-left: -180px;
  margin-bottom: 10px;
}
.act-modal {
  // position: absolute;
  // width: 100%;
  // margin: 0 52px;
  // left: 50%;
  // margin-left: -185px;
  // top: 30%;
  // margin-top: -75px;
  margin-top: -150px;
  width: 270px;
  // height: 150px;
  border-radius: 10px;
  background: #fff;
  // overflow: hidden;
  .body {
    padding: 40px 24px 20px;
    border-radius: 10px 10px 0 0; 
  }
  .bottom {
    height: 42px;
    line-height: 42px;
    display: flex;
    border-top: 1px solid #CCCCCE;
    border-radius: 0 0 10px 10px;
    .act-btn {
      flex: 1;
      text-align: center;
      color: #909090;
      font-size: 17px;
    }
    .sure {
      color: #298DF7;
      border-left: 1px solid #CCCCCE;
    }
  }
  .form-control {
    padding: 0;
    border: none;
  }
  input {
    border: 1px solid #ccc !important;
    padding: 6px 12px !important;
    border-radius: 4px !important;
    outline: none !important;
  }
}
.weui-cells_radio label {
  font-weight: 400;
}
#activityPublish {
  p,
  label {
    font-weight: 400 !important;
    margin-bottom: 0;
  }
  .vux-header {
    z-index: 1;
    background: transparent;
    padding: 0;
    span {
      color: #303030 !important;
    }
    // box-shadow: 0 0 4px 0 rgba(0,0,0,0.12), 0 4px 4px 0 rgba(0,0,0,0.12);
    .vux-header-title {
      height: 44px;
      line-height: 44px;
    }
  }
  .image {
    display: flex;
    flex-direction: column;
    align-items: baseline;
    .choose-img {
      position: relative;
      width: 122px;
      height: 61px;
      text-align: center;
      line-height: 61px;
      background: #F4F5F7;
      margin-top: 14px;
      margin-right: 10px;
      img {
        width: 50px;
        height: 50px;
      }
    }
    .img-item-cover{
      position: relative;
      width: 122px;
      height: 61px;
      margin-top: 14px;
      margin-right: 10px;
      img {
        width: 122px;
        height: 61px;
      }
    }
  }
  .images {
    display: flex;
    flex-direction: column;
    align-items: baseline;
    .choose-img {
      position: relative;
      width: 47px;
      height: 47px;
      text-align: center;
      line-height: 47px;
      background: #F4F5F7;
      margin-top: 14px;
      margin-right: 10px;
      img {
        width: 24px;
        height: 24px;
      }
    }
    .img-item {
      width: 47px;
      height: 47px;
      margin-top: 14px;
      margin-right: 10px;
    }
  }
  .vux-datetime {
    text-decoration: none;
  }
  .vux-header .vux-header-left {
    top: 8px;
  }
  .textarea textarea {
    text-align: right;
    color: #909399;
  }
  .publish-content {
    position: absolute;
    top: 44px;
    bottom: 0;
    left: 0;
    right: 0;
    // padding-bottom: 143px;
    // background: #f4f5f7;
    // padding: 0 0 16px;
    z-index: 0;
    overflow: auto;
    background: #F4F5F7;
    
    .info-group {
      // margin-bottom: 14px;
      margin-top: 12px;
      .weui-cells {
        position: relative;
        margin-top: 0;
        background: #fff;
        // border-radius: 8px;
        &::before,
        &::after {
          height: 0;
          border: none;
        }
      }
      .weui-cell {
        padding: 14px 15px;
        font-size: 16px;
        &::before {
          left: 0;
        }
        &.img-input {
          input[type="text"] {
            display: none;
          }
        }
        label {
          font-weight: 400 !important;
          margin-bottom: 0;
        }
        input {
          padding-right: 0;
        }
        // .focus-red {
        //   color: #ff5252;
        // }
        .img-control {
          position: relative;
          display: block;
          width: 24px;
          height: 24px;
          &.img-unset {
            width: auto;
            height: auto;
          }
        }
      }
      input[type="file"] {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 47px;
        opacity: 0;
      }
      .vux-cell-placeholder {
        color: #909399;
      }
      .vux-cell-value,
      .weui-input {
        color: #303133;
      }
      .weui-cell_access {
        .weui-cell__ft {
          // color: #303133;
          // padding-right: 0;
          &::after {
            height: 8px;
            width: 8px;
            color: #DCDFE6; 
          }
        }
      }
      .weui-icon-warn {
        margin-top: -5px;
      }
    }

  }
  .submit-box {
    padding: 12px 15px;
    margin-top: 71px;
    // position: fixed;
    // bottom: 0;
    z-index: 1;
    background: #fff;
    width: 100%;
  }
  .custom-primary-blue {
    height: 48px;
    font-size: 18px;
    color: #ffffff;
    line-height: 18px;
    background: #4C76F7;
    border: none;
    // margin: 80px 15px;
    border-radius: 100px;
  }
  .require {
    position: absolute;
    top: 16px;
    left: 6px;
    color: #fe6770;
  }  
}
</style>
