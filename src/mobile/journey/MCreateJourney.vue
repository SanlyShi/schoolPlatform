<!--  -->
<template>
  <div class="createJourney">
    <view-box>
      <x-header class="journey-header" :title="title[this.data.type] + '行程'">
        <i slot="overwrite-left" class="maticon back-icon" v-html="icons('navigate_before')" @click="_back">navigate_before</i>
      </x-header>
      <!-- 编辑展示部分 -->
      <div class="addRoute" v-if="this.data.type=='add' || this.data.type == 'edit'">
        <group class="route-info" v-for="(group, gIndex) in groupInfo.groups" :key="gIndex" :gutter="group.gutter" v-if="!group.hasParticipant">
          <datetime v-for="(cell, cIndex) in group.cells" :key="cIndex" v-if="cell.type=='datetime'" :title="cell.title" :border-intent="false" v-model="journeyInfo[cell.name]" :format="cell.format" placeholder="请选择"></datetime>
          <popup-picker v-else-if="cell.type=='picker'" :title="cell.title" :data="groupInfo.initData[cell.name].list" show-name v-model="groupInfo.initData[cell.name].value" placeholder="请选择"></popup-picker>
          <cell v-else-if="cell.type=='cell'" :title="cell.title" :border-intent="false" :value="journeyInfo[cell.name]"></cell>
          <template v-else-if="cell.type=='textarea'">
            <cell v-if="cell.title" :title="cell.title" :border-intent="false"></cell>
            <x-textarea class="textarea" placeholder="请输入" v-model="journeyInfo[cell.name]"></x-textarea>
          </template>
        <x-input v-else-if="cell.type=='input'" :label-width="cell.width" :title="cell.title" text-align="right" :placeholder="cell.placeholder" v-model="journeyInfo[cell.name]"></x-input>
      </group>
      <!-- 我校参加人员显示部分 -->
      <group class="route-info" v-else>
        <group-title slot="title">{{group.title+(gIndex-1)}}
          <div v-if="gIndex < groupInfo.groups.length-2 && groupInfo.groups.length > 5"  class="delete-btn" style="float:right;" @click="_deleteContactPeople(gIndex)">删除</div>
        </group-title>
        <x-input v-for="(cell, cIndex) in group.cells" :key="cIndex" v-if="cell.type=='input'" :label-width="cell.width" :title="cell.title" text-align="right" :placeholder="cell.placeholder" v-model="journeyInfo.schoolJoinPeopleVO[gIndex-2][cell.name]"></x-input>
        <x-button v-if="gIndex == groupInfo.groups.length-3" class="add-btn" @click.native="_addOnePeople">+ 增加我校联系人</x-button>
      </group>
      <div class="footer">
        <x-button class="btn btn-line" @click.native="submit(journeyInfo.status || 'SAVE')">保存</x-button>
        <x-button class="btn btn-bg" @click.native="submit('WAIT')">提交</x-button>
      </div>
    </div>
    <!-- 展示所有信息 -->
    <div class="showAllDetail" v-else>
      <group class="route-info" v-for="(group, gIndex) in groupInfo.groups" :key="gIndex" :gutter="group.gutter" v-if="!group.hasParticipant">
        <cell v-for="(cell, cIndex) in group.cells" :key="cIndex" :title="cell.title" :value="journeyInfo[cell.name]" :label-width="cell.width"   text-align="right" :border-intent="false" v-if="cell.type!='textarea'"></cell>
        <template v-else>
          <cell :title="cell.title" :border-intent="false">
          </cell>
          <x-textarea class="textarea" disabled="true" :value="journeyInfo[cell.name]||'无'" value-align="left"></x-textarea>
        </template>
      </group>
      <!-- 我校参加人员显示部分 -->
      <group class="route-info" v-else>
        <group-title slot="title">{{group.title+(gIndex-1)}}</group-title>
        <cell v-for="(cell, cIndex) in group.cells" :key="cIndex" v-if="cell.type=='input'" :title="cell.title" :value="journeyInfo.schoolJoinPeopleVO?journeyInfo.schoolJoinPeopleVO[gIndex-2][cell.name]:''" text-align="right"></cell>
      </group>
      <div class="footer-edit" v-if="journeyInfo.status == 'NO'">
        <x-button class="btn edit-btn" @click.native="_edit">编辑</x-button>
      </div>
    </div>
    </view-box>
  </div>
</template>

<script>
  import {
    sAjax
  } from '../../assets/utils/utils';
import { setTimeout } from 'timers';
  export default {
    props: {
      data: {
        default: null
      }
    },
    data() {
      return {
        hasSaveInfo: true, // 是否有未保存的数据
        title: {
          add: '新建',
          edit: '编辑',
          check: '查看',
        },
        minuteListValue: '',
        semester: '',
        groupInfo: {
          groups: [{
            hasParticipant: false,
            gutter: '0',
            title: null,
            cells: [{
              title: '年份',
              name: 'year',
              type: 'picker',
            }, {
              title: '省份',
              name: 'province',
              type: 'picker',
            }, {
              title: '地区',
              name: 'provinceSecond',
              type: 'picker',
            }, {
              title: '时间',
              name: 'submitTime',
              type: 'datetime',
              format: 'YYYY-MM-DD'
            }, {
              title: '学年',
              name: 'studyYear',
              type: 'cell',
            }, ],
          }, {
            hasParticipant: false,
            gutter: '10px',
            title: null,
            cells: [{
              title: '活动类别',
              name: 'activityType',
              type: 'picker',
              isDict: true,
            }, {
              title: '活动性质',
              name: 'activityNature',
              type: 'picker',
              isDict: true,
            }, {
              title: '中学/咨询会',
              name: 'middleConsult',
              type: 'picker',
              isDict: true,
            }, {
              title: '中学性质（仅中学填写）',
              name: 'middleNature',
              type: 'textarea',
            }, {
              title: '中学/咨询会联系人',
              name: 'middleConsultPeople',
              type: 'input',
              width: '158px',
              placeholder: '联系人姓名'
            }, {
              title: '中学名称/咨询会地址',
              name: 'middleConsultPlace',
              type: 'picker',
            }, {
              title: '有无讲座',
              name: 'theLecture',
              type: 'picker',
              isDict: true,
            }, {
              title: '讲座题目',
              name: 'lectureName',
              type: 'input',
              placeholder: '无讲座填写“无”'
            }, {
              title: '专家姓名',
              name: 'expertsName',
              type: 'input',
              placeholder: '无讲座填写“无”'
            }, ],
          }, {
            gutter: '10px',
            title: null,
            cells: [{
              title: '其他人员',
              name: 'otherJoinPeople',
              type: 'input',
              placeholder: '其他人员姓名/联系方式'
            }, ]
          }, {
            gutter: '10px',
            title: null,
            cells: [{
              title: '工作内容说明',
              name: 'workDescribe',
              type: 'textarea',
            }, ]
          }],
          initData: {
            year: {
              list: [],
              value: [],
            },
            province: {
              list: [],
              value: [],
            },
            provinceSecond: {
              list: [],
              value: [],
            },
            activityType: {
              list: [],
              value: [],
            },
            activityNature: {
              list: [],
              value: [],
            },
            middleConsult: {
              list: [],
              value: [],
            },
            middleConsultPlace: {
              list: [],
              value: [],
            },
            theLecture: {
              list: [],
              value: [],
            },
          }
        },
        schoolJoinPeople: {
          hasParticipant: true,
          gutter: '10px',
          title: '我校参加人员',
          cells: [{
            title: '姓氏',
            name: 'surnames',
            type: 'input',
            placeholder: '请输入姓氏'
          }, {
            title: '名字',
            name: 'name',
            type: 'input',
            placeholder: '请输入名字'
          }, {
            title: '联系方式',
            name: 'phone',
            type: 'input',
            placeholder: '请输入联系方式'
          }, ]
        },
        journeyInfo: {
          "id": null,
          "userId": null,
          "userName": "", // 提交人姓名 
          "year": "", // 年份     
          "studyYear": "", //学年  
          "addressCode": "", // 省份  
          "provinceSecond": "", //地区
          "submitTime": null, // 时间    
          "activityType": "", // 活动类别         
          "activityNature": "", // 活动性质
          "middleConsult": "", // 中学/咨询会     
          "middleNature": "", // 中学性质
          "middleConsultPeople": "", // 中学/咨询会联系人   
          "middleConsultPlace": "", // 中学/咨询会地址
          "theLecture": "", // 有无讲座  
          "lectureName": "", // 讲座题目         
          "expertsName": "", // 专家名字
          "schoolJoinPeopleSurnames": "", //        
          "schoolJoinPeopleName": "", //
          "schoolJoinPeoplePhone": "", // "155&1560",      
          "schoolJoinPeopleVO": null, // [   一个对象代表一个联系人 ],  
          "otherJoinPeople": "", // 其他人员       
          "workDescribe": "", // 工作说明           
          "note": "", // 备注          
          "status": "", //    状态（备注有说明）         
          "reason": "", // 驳回原因           
          "createTime": "", // null,  
          "updateTime": "", // 提交时间   
        },
      }
    },
    computed: {
      getProvince() {
        return this.groupInfo.initData.province.value[0]
      },
      getMiddleConsult() {
        return this.groupInfo.initData.middleConsult.value[0]
      },
      getMiddle() {
        return this.groupInfo.initData.middleConsultPlace.value[0]
      }
    },
    watch: {
      getProvince(value){
          this.initCity(value)
      },
      getMiddleConsult(value) {
        // console.log(value)
        if(value == '13001') {
          this.groupInfo.groups[1].cells[5].type = 'picker'
          this.getMiddleList(this.groupInfo.initData.province.value[0],this.groupInfo.initData.provinceSecond.value[0])
        } else {
          // 选择咨询会，地址为输入框
          this.groupInfo.groups[1].cells[5].type = 'textarea'
        }
      },
      getMiddle(value) {
        // 中学名称选择其他，增加一个输入框
        if (value == '其他' && this.groupInfo.groups[1].cells[6].name !== 'middleConsultPlace') {
          this.groupInfo.groups[1].cells.splice(6,0, {title: '', name: 'middleConsultPlace', type: 'textarea'})
        } else if (value !== '其他' && this.groupInfo.groups[1].cells[6].name === 'middleConsultPlace') {
          this.groupInfo.groups[1].cells.splice(6,1)
        }
      }
    },
    created() {
      
      // 初始化数据
      this.initPickerData()
      this.initYear()
      this.initSchoolYear()
      this.initArea()
    },
    mounted() {
      if (this.data.type !== "add") {
        // this.journeyInfo = JSON.parse(JSON.stringify(this.data.journeyObj));
        this.journeyInfo = Object.assign({}, this.data.journeyObj);
        this.initJourneyPeople()
        if(this.journeyInfo.middleConsult =='咨询会') {
          this.groupInfo.groups[1].cells[5].type = 'textarea'
        }
        if(this.data.type == "edit") {
            this.initEditData() 
        }
        
      } else {
        // 判断之前是否有保存过数据
        this.isSaved()
      }
      
    },
    methods: {
      isSaved() {
        sAjax({
          url: '/api/archives/trip/getOneArrange?status=SAVE',
          type: 'get',
          // data: param,
          success: (data) => {
            // console.log(data)
            if (data.state) {
              if(data.data.content.length>0) {
                this.journeyInfo = data.data.content[0]
                this.initEditData()
              } else {
                this.hasSaveInfo = false
              }
              this.initJourneyPeople()
            } else {
              this._toast(data.message)
            }
          }
        })
      },
      submit(type) {
        for(let key in this.groupInfo.initData) {
          if(key == 'middleConsultPlace' && (this.groupInfo.initData.middleConsult.value[0]=='13002'||this.groupInfo.initData[key].value[0]=='其他')) {
  
          }
          else {
          this.journeyInfo[key] = this.groupInfo.initData[key].value[0]
          }
        }
        // console.log(this.journeyInfo)
        let path = 'trip/insertArrange'
        if (this.data.type == 'edit') {
          path = `trip/${this.journeyInfo.id}/updateOneArrange`
        }
        this.journeyInfo.status = type
        // this.updateData()
        sAjax({
          url: `/api/archives/${path}`,
          dataType: "json",
          data: this.journeyInfo,
          type: 'POST',
          success: (result) => {
            if (result.state) {
               this.hasSaveInfo = true
               this._toast(`${type=='WAIT'?'提交':'保存'}成功`)
               if (this.data.type == 'edit') {
                 this.updateData()
               }
               if(type == 'WAIT') {
                 setTimeout(() => {
                  this._back()
                 }, 500);
               }
            } else {
              this._toast(result.message)
            }
  
          }
        })
      },
      // 更新上一页数据
      updateData() {
        // this.data.journeyObj = this.journeyInfo
        // 直接赋值会导致原来的对象指向改变，没法达到数据更新的效果
        for(let k in this.data.journeyObj) {
          this.data.journeyObj[k] = this.journeyInfo[k]
        }
        for(let key in this.groupInfo.initData) {
          if(key == 'middleConsultPlace') {
  
          } else {
            let obj = this.groupInfo.initData[key].list[0].find(o => o.value == this.journeyInfo[key])
            if(obj) {
              this.data.journeyObj[key] = obj.name
            }
          }
        }
        console.log(this.data.journeyObj)
      },
      // 编辑时，将数据转化为可编辑文本对应数据格式
      initEditData() {
        for(let key in this.groupInfo.initData) {
          // console.log(key)
          if(key == 'middleConsultPlace' && this.journeyInfo.middleConsult=='咨询会') {
  
          } else if ((key === 'province' || key ==='provinceSecond')&&this.journeyInfo[key]) {
            this.groupInfo.initData[key].value.push(this.journeyInfo[`${key}Code`])
          } else if(this.groupInfo.initData[key].list.length>0) {
            // 找到名称对应的code
            setTimeout(() => {
              let obj = this.groupInfo.initData[key].list[0].find(o => o.name == this.journeyInfo[key])
              if(obj) {
                this.groupInfo.initData[key].value.push(obj.value)
              }
            }, 500);
          }
        }
      },
      initPickerData() {  
        this.groupInfo.groups[1].cells.map((item,index) => {
          if (item.isDict) {
            this.initDict(item)
          }
        })
      },
      initDict(obj) {
        sAjax({
          url: `/api/archives/demo/getSysDict?name=${obj.title}`,
          dataType: "json",
          type: "GET",
          async: false,
          success: (result) => {
            if (result.state) {
              let list = []
              if(result.data.length>0) {
                list = result.data.map(item => {
                  return {name: item.name, value: item.value}
                })
              }
              this.groupInfo.initData[obj.name].list[0] = list
            } else {
              this._toast(`${obj.title}获取失败`)
            }
  
          }
        })
      },
      initYear(){
        // sAjax({
        //   url: `/api/archives/enroll/getListYear`,
        //   dataType: "json",
        //   type: "GET",
        //   async: false,
        //   success: (result) => {
        //     if (result.state) {
        //       result.data.forEach(item => {
        //         item.name = item.value
        //       })
        //       this.groupInfo.initData.year.list[0] = result.data
        //     } else {
        //       this._toast(`年份获取失败`)
        //     }
  
        //   }
        // })
        let yearList = []
        let date = new Date()
        let currentYear = date.getFullYear()
        for(let i = 0; i < 5; i++) {
          yearList.push({
            name: `${currentYear - i}`,
            value: `${currentYear - i}`,
            label: `${currentYear - i}`,
          })
        }
        this.groupInfo.initData.year.list[0] = yearList
      },
      initSchoolYear(){
        let year = new Date().getFullYear()
        let nowTime = new Date(year + '-7-31 23:59:59')
        let studyYear = ''
        if (new Date() > nowTime) {//说明已经8月一号之后了 要下一个学年了
          studyYear = year + '-' + (year + 1)
        } else {
          studyYear = (year - 1) + '-' + year
        }
        this.journeyInfo.studyYear = studyYear
      },
      getMiddleList(province, provinceSecond) {
        sAjax({
          url: `/api/archives/trip/getMiddleData?province=${province}&provinceSecond=${provinceSecond}`,
          dataType: "json",
          type: "GET",
          async: false,
          success: (result) => {
            if (result.state) {
              let middleList = []
              if(result.data.length>0) { 
                middleList = result.data.map(o => {
                  return { name: o.name, value: o.name }
                })
              }
              middleList.push({ name: '其他', value: '其他'})
              // this.groupInfo.initData.middleConsultPlace.list[0] = middleList
              this.$set(this.groupInfo.initData.middleConsultPlace, 'list', [middleList])
            } else {
              this._toast(`中学名称获取失败`)
            }
  
          }
        })
      },
      _back: function() {
        let _this = this
        // add时退出，若有未提交的数据，提示框
        if(this.data.type == 'add' && !this.hasSaveInfo) {
          this.$vux.confirm.show({
            content: '行程未保存，是否继续返回？',
            onConfirm (msg) {
              _this.data.isUpdateLastPage = true
              _this.$emit('removeBread', _this.data)
            },
            onCancel (msg) {
              // return;
            }
          })
        } else {
          this.data.isUpdateLastPage = true
          this.$emit('removeBread', this.data)
        }
      },
      _edit() {
        this.data.type = 'edit'
        if (!this.journeyInfo.schoolJoinPeopleVO) {
          this.journeyInfo.schoolJoinPeopleVO = []
          this.journeyInfo.schoolJoinPeopleVO.push({
            surnames: '',
            name: '',
            phone: '',
          })
        }
        this.initEditData()
      },
      initJourneyPeople() {
        // 初始化一个我校参加人员对象
        if (this.journeyInfo.schoolJoinPeopleVO && this.journeyInfo.schoolJoinPeopleVO.length > 0) {
          this.journeyInfo.schoolJoinPeopleVO.map(item => {
            this._addContactPeople()
          })
        } else {
          this.journeyInfo.schoolJoinPeopleVO = []
          this._addOnePeople()
        }
      },
      _addOnePeople() {
        this.journeyInfo.schoolJoinPeopleVO.push({
          surnames: '',
          name: '',
          phone: '',
        })
        this._addContactPeople()
      },
      _addContactPeople() {
        let index = this.groupInfo.groups.length - 2
        this.groupInfo.groups.splice(index, 0, this.schoolJoinPeople)
      },
      _deleteContactPeople(index) {
        // console.log(index)
        this.groupInfo.groups.splice(index, 1)
        this.journeyInfo.schoolJoinPeopleVO.splice(index-2, 1)
      },
      initArea() {
        sAjax({
          url: "/api/archives/permissions/getProvinceList",
          dataType: "json",
          type: "GET",
          success: (result) => {
            if (result.state) {
              result.data.forEach(item => {
                item.name = item.label
              })
              this.$set(this.groupInfo.initData.province, 'list', [result.data])
            }
            else {
              this.$toast(result.message)
            }
          }
        })
      },
      initCity(value) {
        sAjax({
          url: `/api/archives/permissions/getProvinceSecond?value=${value}`,
          dataType: "json",
          type: "GET",
          success: (result) => {
            if (result.state) {
              result.data.forEach(item => {
                item.name = item.label
              })
              this.$set(this.groupInfo.initData.provinceSecond, 'list', [result.data])
            }
            else {
              this._toast(result.message)
            }

          }
        })
      },
       _toast: function (msg) {
        this.$vux.toast.show({
          text: msg,
          position: 'bottom',
          type: 'text'
        })
      }
    }
  }
</script>

<style lang="less">
  .createJourney {
    background-color: #efeff3 !important;
    .journey-header {
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
        color: #101010;
        line-height: 56px;
      }
    }
    .addRoute,
    .showAllDetail {
      position: absolute;
      top: 56px;
      right: 0;
      bottom: 0;
      left: 0;    
      padding-bottom: 80px;
      overflow: auto;
      background-color: #efeff3;
    }
    .route-info {
      .delete-btn {
        color: #3C9BFF;
        font-size: 16px;
      }
      .add-btn {
        height: 50px;
        line-height: 50px;
        border: none;
        border-radius: 0;
        background: #FFF;
        color: #3C9BFF;
        font-size: 16px;
        &::after {
          border-radius: 0;
          border: none;
          border-top: 1px solid #D9D9D9;
          transform: scaleY(0.5);
        }
      }
    }
    .footer {
      position: fixed;
      bottom: 0;
      right: 0;
      left: 0;
      display: flex;
      height: 58px;
      align-items: center;
      background: #fff;
      box-shadow: 0px -1px 6px 0px rgba(174, 175, 179, 0.26);
      z-index: 1;
      .btn {
        height: 38px;
        line-height: 1;
        border-radius: 38px;
        font-size: 14px;
      }
      .btn-line {
        flex: 1;
        margin: 0 10px;
        // height: 48px;
        background: #fff;
        color: #3C9BFF;
        border: 1px solid #0091FF;
      }
      .btn-bg {
        flex: 1;
        margin: 0 10px;
        // height: 48px;
        background: #3C9BFF;
        color: #fff;
      }
    }
    .footer-edit {
      position: fixed;
      bottom: 0;
      right: 0;
      left: 0;
      display: flex;
      height: 58px;
      align-items: center;
      z-index: 1;
      .edit-btn {
        width: 300px;
        height: 44px;
        background: rgba(60, 155, 255, 1);
        box-shadow: 0px 3px 4px 0px rgba(60, 155, 255, 0.4);
        border-radius: 22px;
        font-size: 17px;
        font-family: 'PingFangSC-Medium';
        font-weight: 500;
        color: #fff;
      }
    }
    .weui-cells {
      &::before,
      &::after {
        border: none;
      }
      p {
        margin: 0;
      }
      .weui-cell {
        &.textarea {
          left: 15px;
          padding-left: 0;
          margin-right: 15px;
        }
        &::before {
          left: 0;
        }
      }
      .vux-cell-box::before {
        left: 0;
      }
      .weui-check_label,
      .vux-radio-label,
      .weui-cell_access,
      .weui-label,
      .vux-label {
        font-size: 16px;
        color: #333;
        letter-spacing: 0;
        text-decoration: none;
        font-weight: 500;
      }
      textarea:disabled {
        background: #fff;
        color: #666;
      }
    }
  }
</style>
