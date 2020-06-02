<template>
  <div class="editScheduling">
    <label class="back pull-left box_flex flex_between" style="padding:0;width:100%;padding-right:200px;">
      <span><i class="maticon pull-left" @click="back()" v-html="icons('arrow_back')">arrow_back</i>
        <span @click="back()">返回</span></span>
      <div class="opt-btn btn" style="color:#298df7" v-show="schedulingType!=='add'" @click="_showDialog">日志</div>
    </label>
    <div class="form-wrap box_flex align_center">
      <div v-for="(item,index) in addOptions.filter((o,i)=>{return i<=13})" :key="index" class="form-group align_center">
        <div class="label" :class="{require:item.require}"><span>{{item.name}}:</span></div>
        <input type="text" v-if="item.type=='input'" :placeholder="item.placeholder" class="form-control search-input organization-input" :disabled="schedulingType=='read'||item.noEdit" v-model="addParams[item.value]">
        <div v-if="item.type=='select_input'" style="width:450px;" class="select_input_wrap box_flex flex_between">
          <v-select :disabled="schedulingType=='read'" :options="getSelectOptions(item.value)" v-if="getSelectOptions(item.value).length&&addParams['middleConsult']==='13001'" options-value="id" options-label="text" close-on-select justify v-model="middleSchool"></v-select>
          <input type="text" class="form-control search-input organization-input" v-if="middleSchool=='其他'||addParams['middleConsult']!=='13001'||!getSelectOptions(item.value).length" :disabled="schedulingType=='read'||item.noEdit" v-model="addParams[item.value2]">
        </div>
        <newAddress :disabled="schedulingType=='read'||item.noEdit" v-if="item.type=='address'" ref="address" :value="myAddress" @onChange="o=>{changeAddress(o,item)}" :width="200" noArea="true"></newAddress>
        <detect v-if="item.type=='detect'" :url='item.url' :searchVal='addParams[item.label]' :placeholder="item.placeholder" @afterSelected="obj=>{afterDetect(obj,item)}"></detect>
        <v-select :disabled="schedulingType=='read'||item.noEdit" v-if="item.type=='select'" :options="getSelectOptions(item.value)" options-value="id" options-label="text" close-on-select justify v-model="addParams[item.value]"></v-select>
        <v-datepicker :disabled="schedulingType=='read'||item.noEdit" ref="datepicker" format="yyyy-MM-dd" :clearButton="false" :showTime="false" v-if="item.type=='date'" v-model="addParams[item.value]"></v-datepicker>
      </div>
      <div v-for="(inputItem,inputIndex) in addParams['schoolJoinPeopleVO']" class="box_flex" :key="'input'+inputIndex">
        <div class="form-group align_center">
          <div class="label"><span>我校主要参加人{{inputIndex+1}}:</span></div>
          <div class="tow_input_wrap box_flex flex_between">
            <input type="text" style="width:40px;padding-right:0;" placeholder="姓氏" class="form-control search-input organization-input" :disabled="schedulingType=='read'" v-model="inputItem['surnames']">
            <input type="text" style="width:140px" placeholder="名字" class="form-control search-input organization-input" :disabled="schedulingType=='read'" v-model="inputItem['name']">
          </div>
        </div>
        <div class="form-group align_center">
          <div class="label"><span>我校主要参加人联系方式{{inputIndex+1}}:</span></div>
          <input type="text" class="form-control search-input organization-input" :disabled="schedulingType=='read'" v-model="inputItem['phone']">
        </div>
      </div>
      <div v-if="schedulingType=='add'" style="width:100%"><button class="btn submit-btn" @click="addJoinPeople()">新增</button></div>
      <div v-for="(item,index) in addOptions.filter((o,i)=>{return i>13})" :key="'add'+index" class="textarea_wrap form-group align_center">
        <div class="label" :class="{require:item.require}"><span>{{item.name}}:</span></div>
        <input type="text" v-if="item.type=='input'" class="form-control search-input organization-input" :disabled="schedulingType=='read'||item.noEdit" v-model="addParams[item.value]">
        <v-textarea :readonly="schedulingType=='read'||item.noEdit" v-if="item.type=='textarea'" v-model="addParams[item.value]" :lineHeight="22" :placeholder="item.placeholder" :rows="6" :maxLength="255"></v-textarea>
      </div>
      <div v-if="schedulingType=='edit'||$parent.curTab&&$parent.curTab==='NO'" class="textarea_wrap form-group align_center">
        <div class="label"><span>驳回理由:</span></div>
        <v-textarea v-model="addParams['reason']" readonly="true" :lineHeight="22" placeholder="请输入驳回理由" :rows="6" :maxLength="255"></v-textarea>
      </div>
      <div v-if="$parent.curTab" class="textarea_wrap form-group align_center">
        <div class="label"><span>备注:</span></div>
        <v-textarea v-model="addParams['note']" :readonly="schedulingType=='read'" placeholder="请输入备注" :lineHeight="22" :rows="6" :maxLength="255"></v-textarea>
      </div>
    </div>
    <div v-if="schedulingType==='check'" class="box_flex flex_center">
      <button class="btn submit-btn" @click="changeStatus('1')">通过</button>
      <button class="btn submit-btn" @click="changeStatus('2')">驳回</button>
      <button class="btn submit-btn" @click="save('SAVE')">保存</button>
    </div>
    <div v-else-if="schedulingType==='recall'" class="box_flex flex_center">
      <button class="btn submit-btn" @click="save('RECALL')">保存</button>
    </div>
    <div v-else-if="schedulingType==='ok'" class="box_flex flex_center">
      <button class="btn submit-btn" v-if="index == '1'" @click="save('RECALL')">保存</button>
      <button class="btn submit-btn" v-if="index == '2'" @click="save('OK')">保存</button>
    </div>
    <div v-else-if="schedulingType!=='read'" class="box_flex flex_center">
      <button class="btn submit-btn" @click="save('SAVE')">保存</button>
      <button class="btn submit-btn" @click="save('WAIT')">提交</button>
    </div>
    <div class="dialog_wrap" v-if="showDialogStatus">
      <div v-for="(item,index) in dialogList" class="dialog" :key="index">
        <p class="gray">{{new Date(item.updateTime).format('yyyy-MM-dd HH:mm')}}</p>
        <p><b>{{item.name}}</b>修改了内容:</p>
        <p>修改了{{item.field}}为</p>
        <b>{{item.value}}</b>
      </div>
      <div v-if="dialogList.length===0">
        暂无数据哟~
      </div>
    </div>
    <v-modal :show="showReasonModal" width="374">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">驳回理由</h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="form-wrap box_flex align_center">
          <div class="form-group box_flex column" style="width:100%;margin-right:0;margin-bottom:0">
            <div class="label require" style="text-align:left;padding-left:0"><span>驳回理由:</span></div>
            <v-textarea v-model="reason" :lineHeight="22" placeholder="请输入驳回理由" :rows="6" :maxLength="255"></v-textarea>
          </div>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showReasonModal = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="changeStatus('2')">确定</button>
      </div>
    </v-modal>
  </div>
</template>
<script>
import newAddress from "../../components/NewAddress"
import { request } from "../../assets/utils/utils.js";
export default {
  data() {
    return {
      address: {
        province: '',
        city: '',
        area: '',
      },
      showReasonModal: false,
      reason: '',
      middleSchool: '',//中学 过度用 
      addOptions: [
        { name: "年份", type: "select", value: "year", require: false, noEdit: false },
        { name: "学年", type: "input", value: "studyYear", require: false, noEdit: true },
        { name: "省份", type: "address", value: "addressCode", require: false, noEdit: false },
        { name: "时间", type: "date", value: "submitTime", require: false, noEdit: false },
        { name: "活动类别", type: "select", value: "activityType", require: false, noEdit: false },
        { name: "活动性质", type: "select", value: "activityNature", require: false, noEdit: false },
        { name: "中学/咨询会", type: "select", value: "middleConsult", require: false, noEdit: false },
        { name: "中学性质", type: "input", value: "middleNature", placeholder: '仅中学填写', require: false, noEdit: false },
        { name: "中学/咨询会联系人", type: "input", value: "middleConsultPeople", require: false, noEdit: false },
        { name: "中学/咨询会地址  ", type: "select_input", value: "middleConsultPlace", value2: "middleConsultPlace", require: false, noEdit: false },
        { name: "有无讲座", type: "select", value: "theLecture", require: false, noEdit: false },
        { name: "讲座题目", type: "input", value: "lectureName", require: false, noEdit: false },
        { name: "专家名字", type: "input", value: "expertsName", require: false, noEdit: false },
        { name: "其他人员", type: "input", value: "otherJoinPeople", require: false, noEdit: false },
        { name: "工作内容说明", type: "textarea", placeholder: '请输入工作内容说明', value: "workDescribe", require: false, noEdit: false },
      ],
      addParams: {
        "id": '',
        "userId": '',
        "userName": "",// 提交人姓名 
        "year": "",// 年份     
        "studyYear": "",//学年  
        "addressCode": "",// 省份  
        "provinceSecond": "",//地区
        "submitTime": null,// 时间    
        "activityType": "",// 活动类别         
        "activityNature": "",// 活动性质
        "middleConsult": "",// 中学/咨询会     
        "middleNature": "",// 中学性质
        "middleConsultPeople": "",// 中学/咨询会联系人   
        "middleConsultPlace": "",// 中学/咨询会地址
        "theLecture": "",// 有无讲座  
        "lectureName": "",// 讲座题目         
        "expertsName": "",// 专家名字
        "schoolJoinPeopleSurnames": "",//        
        "schoolJoinPeopleName": "",//
        "schoolJoinPeoplePhone": "",// "155&1560",      
        "schoolJoinPeopleVO": [],// [   一个对象代表一个联系人 ],  
        "otherJoinPeople": "",// 其他人员       
        "workDescribe": "",// 工作说明           
        "note": "",// 备注          
        "status": "",//    状态（备注有说明）         
        "reason": "",// 驳回原因           
        "createTime": "",// null,  
        "updateTime": "",// 提交时间    
      },
      yearList: [],
      middleList: [],
      selectOptions: {
        activityType: [],
        activityNature: [],
        middleConsult: [],
        middleConsultPlace: [],
        theLecture: []
      },
      dialogList: [],
      hasEdit: 0,
      myAddress: '',
      schedulingType: 'edit',
      showDialogStatus: false
    }
  },
  components: { newAddress },
  created() {
    this.addParams = this.value
    this.myAddress = this.addParams.province
    if (this.addParams.provinceSecond) {
      this.myAddress += ',' + this.addParams.provinceSecond
    }
    if (this.addParams.provinceCode) {
      let str = this.addParams.provinceCode
      if (this.addParams.provinceSecondCode) {
        str += ',' + this.addParams.provinceSecondCode
      }
      this.getMiddleList(str)
    }
    this.getYearList()
    let labelList = [
      { name: '活动类别', value: 'activityType' },
      { name: '活动性质', value: 'activityNature' },
      { name: '中学/咨询会', value: 'middleConsult' },
      { name: '中学/咨询会地址', value: 'middleConsultPlace' },
      { name: '有无讲座', value: 'theLecture' }
    ]
    labelList.forEach(o => {
      this.getDirectoryList(o)
    })
    this.schedulingType = this.type
  },
  props: {
    value: {
      default: {}
    },
    width: {
      default: 220
    },
    noArea: {
      default: false
    },
    type: {
      default: 'edit'
    },
    index: {
      default: ''
    },
  },
  watch: {
    value(newVal) {
      this.addParams = JSON.parse(JSON.stringify(newVal))
      this.myAddress = this.addParams.province
      if (this.addParams.provinceSecond) {
        this.myAddress += ',' + this.addParams.provinceSecond
      }
    },
    type(newVal) {
      this.schedulingType = newVal
    },
    addParams: {
      handler(newValue, oldValue) {
        this.hasEdit++;//进来会执行一次 编辑过就会大于1
      },
      deep: true    },
  },
  methods: {
    changeStatus(type) {
      let str = '?id=' + this.addParams.id
      if (type === '1') {
        this.$parent.submitAction(str, type)
        this.schedulingType = 'ok'
        this.addParams.status = 'OK'
      } else if (type === '2') {
        if (!this.showReasonModal) {
          this.showReasonModal = true
          return
        }
        if (!this.reason) {
          this.$toast('驳回理由不能为空!')
          return
        }
        this.showReasonModal = false
        let url = `api/archives/trip/updateArrangeStatus${str}&status=NO&reason=${this.reason}`
        request(url, {}, 'post').then(o => {
          if (o.state) {
            this.$toast('操作成功!')
            this.schedulingType = 'read'
            this.addParams.status = 'NO'
            this.$parent.curTab = 'NO'
            this.addParams.reason = this.reason
          }
        })
      }
    },
    _showDialog() {
      if (this.showDialogStatus) {
        this.showDialogStatus = false
        return;
      }
      let url = `api/archives/trip/${this.addParams.id}/getOneArrangeRecord`
      request(url).then(o => {
        if (o.state) {
          this.showDialogStatus = true
          let arr = [{ name: '档案接收人', value: 'archivesReceiveMemberName' }, { name: '辅导员', value: 'instructorName' }]
          let replaceList = [...arr, ...this.addOptions]
          this.dialogList = o.data.content.map(element => {
            return element
          })
        }
      })
    },
    back() {
      if (this.hasEdit > 1) {
        if (confirm('行程未保存,是否继续返回?')) {
          this.hasEdit = 0
          this.$emit('back')
        }
      } else {
        this.hasEdit = 0
        this.$emit('back')
      }
    },
    addJoinPeople() {
      if (!this.addParams.schoolJoinPeopleVO) {
        this.addParams.schoolJoinPeopleVO = []
      }
      this.addParams.schoolJoinPeopleVO.push({ "surnames": "", "name": '', "phone": '' })
    },
    getYearList() {
      // let url = 'api/archives/enroll/getListYear'
      // request(url).then(o => {
      //   if (o.state) {
      //     this.yearList = o.data.map(o => {
      //       return {
      //         id: o.value,
      //         text: o.label,
      //       }
      //     })
      //   }
      // })
      let yearList = []
      let date = new Date()
      let currentYear = date.getFullYear()
      for(let i = 0; i < 5; i++) {
        yearList.push({
          id: currentYear - i,
          text: `${currentYear - i}`,
        })
      }
      this.yearList = yearList
    },
    save(status) {//WAIT SAVE
      this.hasEdit = 0
      if (status === 'SAVE') {//新增的时候status为空,赋值save状态,其他情况 用原本的状态
        if (!this.addParams.status) {
          this.addParams.status = status
        }
      } else {
        this.addParams.status = status
      }
      if (this.middleSchool && this.middleSchool != "其他") {
        this.addParams.middleConsultPlace = this.middleSchool
      }
      this.addParams.submitTime = this.addParams.submitTime?this.addParams.submitTime.split(' ')[0]:''
      this.$emit('input', this.addParams)
      this.$emit('onchange')
    },
    getDirectoryList(o) {
      let url = `api/archives/demo/getSysDict?name=${o.name}`
      request(url).then(a => {
        if (a.state) {
          this.selectOptions[o.value] = a.data.map(v => {
              if (this.addParams[o.value] === v.name) {
                this.addParams[o.value] = v.value
              }
            v.text = v.name
            v.id = v.value
            return v
          })
          this.hasEdit = 0
        }
      })
    },
    getSelectOptions(value) {
      switch (value) {
        case 'year':
          return this.yearList;
        case 'middleConsultPlace':
          return this.middleList;
        default:
          return this.selectOptions[value]
      }
    },
    getMiddleList(val) {
      let province = val.split(',')[0]
      let provinceSecond = val.split(',')[1] ? val.split(',')[1] : ''
      let url = `api/archives/trip/getMiddleData?province=${province}&provinceSecond=${provinceSecond}`
      this.middleSchool = ''
      request(url).then(o => {
        if (o.state) {
          this.middleList = o.data.map(o => {
            if (o.name === this.addParams.middleConsultPlace) {
              this.middleSchool = o.name
            }
            return { id: o.name, text: o.name }
          })
          this.middleList.push({ id: '其他', text: '其他' })
        }
      })
    },
    changeAddress(val, item) {
      this.addParams[item.value] = val
      this.getMiddleList(val)
    },
  }
}
</script>

<style lang="less" scoped>
.editScheduling {
  background: white;
  width: 100%;
  min-height: 888px;
  padding: 20px;
  position: relative;
  .textarea_wrap {
    width: 950px;
    .v-textarea {
      border-radius: 5px;
      .v-text-container {
        padding: 5px;
      }
    }
    .v-textarea .v-textarea-readonly {
      background: #f5f5f5;
    }
  }
}
.dialog_wrap {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 3;
  overflow: auto;
  width: 240px;
  background: white;
  padding: 20px;
  padding-bottom: 130px;
  border-left: 1px solid #ccc;
  .dialog {
    border-bottom: 1px solid #ccc;
  }
  p {
    margin: 5px 0;
  }
  .gray {
    color: #ccc;
  }
}
.dialog_wrap::-webkit-scrollbar {
  width: 4px;
  /*height: 4px;*/
}
.dialog_wrap::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.dialog_wrap::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
.form-wrap {
  width: 100%;
  flex-wrap: wrap;
  .form-group {
    margin-right: 50px;
    .label {
      width: 200px;
      font-size: 14px;
      color: #666;
      text-align: left;
      display: block;
      padding-left: 2px;
      padding-right: 12px;
    }
    .v-select,
    .form-control,
    .v-datepicker,
    .ditection {
      width: 200px;
    }
  }
}
</style>
