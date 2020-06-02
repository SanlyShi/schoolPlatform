<template>
  <div>
    <a type="button" class="box_flex align_center back_wrap" @click="back()">
      <!--返回教师列表-->
      <i class="maticon back-icon-btn" v-html="icons('arrow_back')">arrow_back</i><span class="nav-title">返回</span>
    </a>
    <div>
      <div class="tab-div">
        <div class="tab" v-for="(tab, index) in tabList" :key="index" :class="courseClassId===tab.id? 'active' : ''" :title="tab.className" @click="courseClassId=tab.id">{{tab.className}}</div>
      </div>
      <v-table :url="tableUrl+courseClassId+timestamp" :title="courseName" :search="false" pagesize="10" idField="id" :order="true" :columns="columns">
        <div slot="btn-group" role="group">
          <div class="btn-group pull-right">
            <button type="button" class="btn btn-bgColor-style clearBtnBorder" @click="showAddModal=true">新增人员名单</button>
          </div>
        </div>
      </v-table>
      <v-modal :show="showAddModal" effect="fade" width="420">
        <div slot="modal-header" class="modal-header">
          <h5 class="modal-title">
            新增考勤人员名单
          </h5>
        </div>
        <div slot="modal-body" class="modal-body">
          <button type="button" class="btn submit-btn clearBtnBorder" @click="addPersonByOne" style="width:380px;text-align:center">单条增加</button>
          <button type="button" class="btn submit-btn clearBtnBorder" @click="batchAddPerson()" style="width:380px;text-align:center;margin-top:20px;">批量导入</button>
        </div>
        <div slot="modal-footer" class="modal-footer">
          <button type="button" class="btn cancel-btn clearBtnBorder" @click="showAddModal = false">取消</button>
          <!-- <button type="button" class="btn submit-btn clearBtnBorder">保存</button> -->
        </div>
      </v-modal>
      <v-modal :show="showAddOnePersonModal" effect="fade" width="400">
        <div slot="modal-header" class="modal-header">
          <h5 class="modal-title">
            新增考勤人员名单
          </h5>
        </div>
        <div slot="modal-body" class="modal-body container-fluid" style="overflow: inherit;">
          <div class="form-group">
            <detect url='/api/ca/users/students/searchResults' :placeholder="请输入学号或者姓名" @afterSelected="afterSelectAddPerson"></detect>
          </div>
        </div>
        <div slot="modal-footer" class="modal-footer">
          <button type="button" class="btn cancel-btn clearBtnBorder" @click="showAddOnePersonModal = false">取消</button>
          <button type="button" class="btn submit-btn clearBtnBorder" @click="addOnePerson">确定</button>
        </div>
      </v-modal>
    </div>
  </div>
</template>
<script>
import { request } from '../../assets/utils/utils.js'
export default {
  data: function () {
    return {
      courseClassId: this.tabList[0].id,
      timestamp: '',
      columns: [],
      classArr: [],
      addPersonParams: {},
      showAddModal: false,
      showAddOnePersonModal: false,
      tableUrl: '/table-data/ca/person/page/'
    }
  },
  props: {
    tabList: {//tab的数组  [{id,className}]
      type: Array,
      default() {
        return []
      }
    },
    courseName: String,//table的名字而已
  },
  created() {
    this.getClassList()
  },
  methods: {
    addOnePerson(){
      let url = `api/ca/person/${this.courseClassId}?userId=${this.addPersonParams.userId}`
      request(url,null,'post').then(o=>{
        if(o.state){
          this.$toast('操作成功!')
          this.showAddOnePersonModal = false
          this.upDataTable()
        }
      })
    },
    getClassList() {
      let url = '/api/relClass/classes/list'
      request(url).then(o => {
        if (o.state) {
          this.classArr = o.data;
          this.initTable()
        }
      })
    },
    afterSelectAddPerson(a) {
      this.addPersonParams.userId = a.userId
      this.addPersonParams.userNo = a.userNo
      this.addPersonParams.name = a.name

    },
    addPersonByOne() {
      this.showAddOnePersonModal = true
      this.showAddModal = false
    },
    addSignPeople(o) {
        let url = `api/ca/person/${this.courseClassId}?userId=${o.userId}`
        request(url).then(a=>{
            if(a.state){
                this.$toast('签到成功!')
            }
        })
    },
    batchAddPerson() {//
      this.$parent.importParams = {
        parentPageTitle: "",
        downloadTemplateUrl: `/ca/person/batch/template`,
        downloadErrorTemplateUrl: `/ca/courses/batch/error`,
        checkTemplateUrl: `/ca/person/batch/excel/${this.courseClassId}`,
        templateName: "批量导入模板",
        importBtnType: [
          {
            url: `/ca/person/batch/update`,
            method: 'post',
            isShowBtn: true,
            name: "增量导入",
            success: data => {
              this.timestamp = "?timestamp=" + new Date().getTime();
              this.curRoute = "personList";
            }
          }
        ]
      };
      this.$parent.quickAddRecord()
    },
    initTable() {
      let that = this
      this.columns = [
        {
          id: 'userNo',
          title: '学号',
          className: 'text-left',
          width: '120px',
          hidden: false,
          search: {
            type: 'input',
            data: {
              placeholder: ''
            }
          }
        }, {
          id: 'name',
          title: '姓名',
          className: 'text-left',
          width: '55px',
          hidden: false,
          search: {
            type: 'input',
            data: {
              placeholder: ''
            }
          }
        }, {
          id: 'college',
          title: '学院',
          className: 'text-left',
          width: '120px',
          hidden: false,
          search: {
            type: 'select',
            data: {
              // options: this.searchOptions.colleges,
              url: "/api/colleges",
              optionsLabel: 'name',
              optionsValue: 'code',
              placeholder: ''
            }
          },
          formatter(record) {
            return record.college
          }
        }, {
          id: 'className',
          title: "行政班级",
          className: 'text-left',
          width: '120px',
          hidden: false,
          search: {
            type: 'select',
            data: {
              options: this.classArr,
              optionsLabel: 'text',
              optionsValue: 'text',
              placeholder: ''
            }
          },
          formatter(record) {
            return record.className
          }
        }, {
          id: "opt",
          title: "操作",
          className: "text-center",
          width: "230px",
          formatter: function (obj) {
            return [
              {
                tag: "a",
                text: '删除',
                className: "opt-btn",
                callback(record, index) {
                  if (!confirm("是否删除?")) {
                    return
                  }
                  let url = `api/ca/person/delete/${that.courseClassId}?userId=${record.userId}`
                  request(url, null, 'post').then(o => {
                    if (o.state) {
                      that.$toast('操作成功!')
                      that.upDataTable()
                    }
                  })
                }
              },
            ];
          }
        }]
    },
    upDataTable() {
      this.timestamp = "?timestamp=" + new Date().getTime();
    },
    back() {
      this.$emit('back')
    }
  }
}
</script>
<style lang="less" scoped>
.tab-div {
  position: relative;
  height: 40px;
  margin: 0;
  background: white;
  white-space: nowrap;
  border-bottom: 1px solid #f0f0f0;
  .apply-container {
    position: absolute;
    right: 0;
  }
  .tab-list {
    position: relative;
    .gm-scroll-view {
      padding-right: 200px;
    }
  }
  .tab {
    display: inline-block;
    // max-width: 200px;
    width: 150px;
    padding: 0 20px;
    font-size: 13px;
    color: rgba(0, 0, 0, 0.54);
    line-height: 40px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    vertical-align: top;
    &.tab-node {
      line-height: 20px;
      p {
        margin: 0;
        text-align: left;
      }
    }
    &:hover,
    &.active {
      color: #298df7;
      border-bottom: 2px solid #298df7;

      height: 40px;
    }
    margin-right: -4px;
  }
}
</style>

