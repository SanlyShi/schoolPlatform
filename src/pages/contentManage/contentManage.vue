<template>
  <div class="content-page">
    <div class="c-module-wrap">
      <div class="back-btn">
        <i class="maticon pull-left" @click="back()" v-html="icons('arrow_back')">arrow_back</i>
        <span @click="back()">返回</span>
      </div>
      <div class="content text-center">
        <v-table title="内容列表" :url="url+systemId+timestamp+subParentId" :pagesize="10" :columns="columns" :multiple="false" :order="true" :search="false">
          <div slot="btn-group" role="group">
            <div class="btn-group pull-right ">
              <button type="button" @click="addOrEditModule('add')" class="btn batch-add-btn btn-bgColor-style clearBtnBorder">新增内容</button>
            </div>
          </div>
        </v-table>
      </div>
      <v-modal :show="showAddView" effect="fade" @onHide="showAddView=false" width="800">
        <div slot="modal-header" class="modal-header">
          <h5 class="modal-title">{{modalType=='add'?'新增':'编辑'}}内容</h5>
        </div>
        <div slot="modal-body" class="modal-body">
          <div class="input-group addClass-input-group">
            <label class="addClass-text">内容标题:</label>
            <input v-model="addParams.title" class="form-control search-input" type="text">
            <v-select style="width:160px" :options="contentTypeList" v-model="contentType" ></v-select>
          </div>
          <!-- <div class="input-group addClass-input-group"> -->
            <!-- <label class="addClass-text">内容标题:</label> -->
            <!-- <input v-model="addParams.title" class="form-control search-input" type="text"> -->
            
          <!-- </div> -->
          <div class="input-group addClass-input-group">
            <!-- <label class="addClass-text">内容:</label> -->
            <u-editor class="my-edit" v-model="addParams.content" v-if="contentType == 2"></u-editor>
            <div class="input-group addClass-input-group" v-if="contentType == 1">
            <label class="addClass-text">网址:</label>
            <input v-model="addParams.content" class="form-control search-input" style="width:388px" type="text">
          </div>
          </div>
        </div>
        <div slot="modal-footer" class="modal-footer">
          <button type="button" class="btn cancel-btn clearBtnBorder" style="margin-right: 8px;" @click="showAddView = false">取消</button>
          <button v-if="modalType=='add'||(modalType=='edit'&&!isTimeOut(addParams.releaseTime))" type="button" class="btn submit-btn clearBtnBorder" @click="showTimingModal = true">定时发布</button>
          <button type="button" class="btn submit-btn clearBtnBorder" @click="save(addParams.needRegularTime)">{{modalType=='add'?'发布':'修改'}}</button>
        </div>
      </v-modal>
      <v-modal :show="showTimingModal" effect="fade"  @onHide="showTimingModal=false" width="400">
        <div slot="modal-header" class="modal-header">
          <h5 class="modal-title">定时发布</h5>
        </div>
        <div slot="modal-body" class="modal-body">
          <div class="input-group addClass-input-group">
            <label class="addClass-text">发送时间：</label>
            <el-date-picker
              v-model="addParams.releaseTime"
              type="datetime"
              placeholder="选择日期时间">
            </el-date-picker>
          </div>
          <div class="release-tip">本条内容将在 <span>{{addParams.releaseTime}}</span> 发送至首页展示</div>
        </div>
        <div slot="modal-footer" class="modal-footer">
          <button type="button" class="btn cancel-btn clearBtnBorder" @click="showTimingModal = false">取消</button>
          <button type="button" class="btn submit-btn clearBtnBorder" @click="save(true)">定时发布</button>
        </div>
      </v-modal>
    </div>
  </div>
</template>

<script>
import { request } from '../../assets/utils/utils.js'
export default {
  props: {
    subParentId: {
      default: 0
    },
    systemId: {
      default: 0
    }
  },
  data: function () {
    return {
      contentTypeList:[
        {
          label:'文本',
          value:2
        },
        {
          label:'网址',
          value:1
        }
      ],
      contentType:'',
      url: '/table-data/cms/module/getModuleList?systemId=',
      timestamp: '&timestamp=&parentId=',
      columns: [],
      showAddView: false,
      showTimingModal: false,
      showChildModule: false,
      modalType: 'add',
      addParams: {
        title: '1',
        content: '',
        type: 'CONTENT_DETAIL',
        parentId: this.subParentId,
        needRegularTime: false,
        releaseTime: '',
        // url:''
      },
      requireField: [{ text: '内容标题', value: 'title' },{ text: '内容', value: 'content' }],
      showTypeModal: false,
      oldParams: {}
    }
  },
  watch: {
    "addParams.releaseTime"(val){
      let time = this.formateTime(val)
      if(!this.isTimeOut(time)) {
        this.addParams.releaseTime = time
      } else if(this.showTimingModal){
        this.$toast('发布时间不能小于当前时间')
        this.addParams.releaseTime = this.initReleasedTime()
      }
      
    }
  },
  mounted: function () {
    this.initTable()
  },
  methods: {
    validate(d){
      if(d.indexOf('http://') > -1 ||  d.indexOf('https://') > -1){
        return true
      }
      else{
        this.$toast("网址需要以http://或者https://开头")
        return false
      }
    },
    save(needRegularTime) {
      if(!this.validate(this.addParams.content) && this.contentType == 1){
        return
      }
      for (var i in this.requireField) {
        if (!this.addParams[this.requireField[i].value]) {
          this.$toast(this.requireField[i].text + '不能为空!')
          this.showTimingModal = false
          return;
        }
      }
      let params = JSON.parse(JSON.stringify(this.addParams));
      params.systemId = this.systemId
      params.needRegularTime = needRegularTime
      params.contentType = this.contentType==2?0:1
      let url = this.modalType == 'add' ?'/api/cms/module/addModule':'/api/cms/module/updateModule'
      let method = 'post'

      request(url, params, method).then(o => {
        if (o.state) {
          this.$toast('操作成功!');
          this.timestamp = `&timestamp=${new Date()}&parentId=`
          this.showAddView = false
          this.showTimingModal = false
        } else {
          this.$toast(o.message)
        }
      })
    },
    initTable() {
      let that = this
      this.columns = [{
        id: 'title',
        title: '内容标题',
        className: 'text-left',
        hidden: false,
        search: {
          type: 'input',
          data: {
            placeholder: ''
          }
        },
        formatter: (record, index) => {
          if(!that.isTimeOut(record.releaseTime)) {
            return `[未发布] ${record.title}`
          }
        }
      },  {
        id: 'updateTime',
        title: '更新时间',
        className: 'text-left',
        hidden: false,
      }, {
        id: 'operatorName',
        title: '操作人',
        className: 'text-left',
        hidden: false,
      }, {
        id: 'opt',
        title: '操作',
        className: 'text-center',
        width: '210px',
        hidden: false,
        formatter: (record, index) => {
          let isTop = record.top
          return [{
            tag: 'a',
            text: `${isTop==1?'取消置顶':'置顶'}`,
            className: 'opt-btn',
            callback: (record, index) => {
              request(`/api/cms/module/setTop?id=${record.id}&isTop=${isTop==1?'NO':'YES'}`,{},'post').then(data => {
                if (data.state) {
                  this.$toast(`${isTop==1?'取消成功':'置顶成功'}`);
                  this.timestamp = `&timestamp=${new Date()}&parentId=`
                } else {
                  this.$toast(data.message);
                }
              })
            }
          },{
            tag: 'a',
            text: '编辑',
            className: 'opt-btn',
            callback: (record, index) => {
              this.addParams.id = record.id
              this.addParams.content = record.content
              this.addParams.title = record.title
              this.contentType = record.contentType==0?2:1
              this.addParams.parentId = record.parentId
              this.addParams.needRegularTime = record.needRegularTime
              this.addParams.releaseTime = record.releaseTime
              this.addOrEditModule('edit')
            }
          },{
            tag: 'a',
            text: '删除',
            className: 'opt-btn',
            callback: (record, index) => {
              this.delModule(record)
            }
          }]
        }
      }]
    },
    back() {
      this.$emit('back')
    },
    addOrEditModule(type) {
      this.modalType = type
      this.showAddView = true;
      if(type == 'add') {
        this.contentType = 2
        this.addParams = {
          contentType:this.contentType==2?0:1,
          title: '',
          content: '',
          type: 'CONTENT_DETAIL',
          parentId: this.subParentId,
          needRegularTime: false,
          releaseTime: this.initReleasedTime()
        }
      }
    },
    initReleasedTime() {
      let curDate = new Date()
      let nextDay = new Date(curDate.getTime() + 24*60*60*1000).format("yyyy-MM-dd")
      return `${nextDay} 00:00:00`
    },
    formateTime(inputTime) {
      var date = new Date(inputTime);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? ('0' + m) : m;
      var d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      var h = date.getHours();
      h = h < 10 ? ('0' + h) : h;
      var minute = date.getMinutes();
      var second = date.getSeconds();
      minute = minute < 10 ? ('0' + minute) : minute;
      second = second < 10 ? ('0' + second) : second;
      return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
    },
    delModule(record) {
      if(confirm('确认要删除吗？删除后该内容将无法恢复！')) {
        request(`/api/cms/module/${record.id}`,{},'post').then(data => {
          if (data.state) {
            this.$toast("删除成功");
            this.timestamp = `&timestamp=${new Date()}&parentId=`
          } else {
            this.$toast(data.message);
          }
        })
      }
    },
    isTimeOut(time) {
      let now = new Date()
      let releaseTime = new Date(time)
      if(now < releaseTime) {
        return false;
      } else {
        return true;
      }
    },
  }
}
</script>
<style lang="less" scoped>
.content-page {
  .c-module-wrap {
    position: relative;
    .back-btn {
      position: absolute;
      left: 10px;
      top: 6px;
      display: flex;
      align-items: center;
      color: #666;
      z-index: 1;
      cursor: default;
      .maticon {
        font-size: 20px;
      }
    }
  }
  .w240 {
    width: 240px;
  }
  .addClass-input-group {
    display: inline-flex;
    width: 100%;
    margin-bottom: 18px;
    .search-select {
      width: 212px;
      margin: 0 19px;
    }
    .search-input {
      margin: 0 16px;
      width: 212px;
      float: initial;
    }
  }
  
  .addClass-text {
    width: 72px;
    padding-top: 6px;
    text-align: right;
  }
  .release-tip {
    font-size: 13px;
    margin-top: -4px;
    span {
      font-weight: 600;
      font-size: 14px;
    }
  }
  .el-form-item__content {
    margin-left: 0;
  }
}
 
</style>
