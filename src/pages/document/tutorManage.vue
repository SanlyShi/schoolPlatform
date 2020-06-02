<template>
  <div class="info-set-container" v-if="curRouter === 'tutorInfoList'">
    <div class="text-center">
        <ul class="nav nav-tabs relationClassManage-tab">
          <li :class="{active:onGuardStatus}" @click="onGuardStatus = true">
            <a>在岗</a>
          </li>
          <li :class="{active:!onGuardStatus}" @click="onGuardStatus = false">
            <a>非在岗</a>
          </li>
        </ul>
      </div>
    <div class="tutor-info-page" v-show="layoutManageJson.route === 'main'">
      <div class="content text-center">
        <v-table :title="tableCheckedList.length > 0 ? '':'全校导师信息'" ref="studentTable" :url="`${url}?timeStamp=${timeStamp}&onGuardStatus=${onGuardStatus}`" :method="method" pagesize="10" idField="id" :columns="columns" :search="false" :order="true" :multiple="true"
        :columnsControl="true" @afterChecked="_tableChecked">
        <div slot="btn-group" role="group">

          <div class="btn-group pull-left" >
            <div class="batch-options" v-if="tableCheckedList.length > 0">
              <span class="pull-left">已选择{{tableCheckedList.length}}项，其中可操作的有{{tableCheckedList.length}}项</span>
              <div class="pull-left">
                <button type="button" style="margin-left:10px;" class="btn btn-bgColor-style clearBtnBorder resetBtn" @click="selcetBatchDelete()">批量删除</button>
                <button type="button" v-if="onGuardStatus" class="btn btn-bgColor-style clearBtnBorder" @click="selcetBatchTo('off')">批量转为非在岗</button>
                <button type="button" v-if="!onGuardStatus" class="btn btn-bgColor-style clearBtnBorder" @click="selcetBatchTo('on')">批量转为在岗</button>
              </div>
            </div>
          </div>

           <div  class="btn-group pull-right" >
            <!-- <button class="btn btn-bgColor-style clearBtnBorder" @click="_setLayout">{{translate.layoutManage}}</button> -->
            <button class="btn btn-bgColor-style clearBtnBorder" @click="_addTutor">新增人员</button>
            <button class="btn btn-bgColor-style clearBtnBorder" @click="_batchTutor">批量新增人员</button>
          </div>
        </div>
         
        </v-table>
      </div>
    </div>
    <FormSetManage
      :infoSetting="{
        type: 'TUTOR',
        tabs: layoutManageJson.infoTypes
      }"
      :student="studentBie"
      @back="_closeFormSetting"
      @submit="_saveFormInfo"
      @gotoRoleSet="layoutManageJson.route='joinRoleSet'"
      v-show="layoutManageJson.route === 'formSetManage'"
      v-if="layoutManageJson.route !== 'main'">
    </FormSetManage>
    <JoinRoleSetManage
      :roleSetting="{
        type: 'TUTOR',
        educationLevel: layoutManageJson.educationLevel
      }"
      @back="layoutManageJson.route = 'formSetManage'"
      @submit="_saveRoles"
      v-if="layoutManageJson.route==='joinRoleSet'">
    </JoinRoleSetManage>
    <div class="preview-container"
    v-if="layoutManageJson.preview">
      <preview
        :data="layoutManageJson.layoutsJson[layoutManageJson.curInfoId]&&layoutManageJson.layoutsJson[layoutManageJson.curInfoId].components"
        :defaultData="layoutManageJson.instanceJson[layoutManageJson.curInfoId]"
        :log="layoutManageJson.logsJson[layoutManageJson.curInfoId]"
        :script="layoutManageJson.layoutsJson[layoutManageJson.curInfoId]&&layoutManageJson.layoutsJson[layoutManageJson.curInfoId].property&&layoutManageJson.layoutsJson[layoutManageJson.curInfoId].property.script"
        :previewType="'form'"
        :infoSetting="{
          tabs: layoutManageJson.infoTypes,
          curInfoId: layoutManageJson.curInfoId
        }"
        @tabExchange="_initInfoType"
        @submit="_getInfoValue"
        @submitAll="_submitAll"
        @search="_getInfoTypes(null, $event)"
        @back="layoutManageJson.preview = false"></preview>
    </div>
    <v-modal :show="showAddModal" effect="fade" width="500">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          新增人员
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="form-group">
          <label class="input-label" >教工号</label>
          <input id="user-no" type="text"  class="form-control search-input modal-form-style"  @change="checkAddUser" v-model="tutor.userNo">
          <button type="button" class="btn check-btn clearBtnBorder" @click="checkAddUser">检测</button>
          <p class="error-message">{{tutor.errorMessage}}</p>
        </div>
        <div class="form-group">
          <label class="input-label" style="margin-left: 15px;">姓名</label>
          <input type="text" class="form-control search-input modal-form-style" disabled="disabled" v-model="tutor.userName">
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showAddModal = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder"  @click="sureAddTutor">确定</button>
      </div>
    </v-modal>
  </div>
  <v-import
    v-bind="importParams"
    @backParentPage="curRouter = 'tutorInfoList'"
     v-else>
  </v-import>
</template>

<script>
  import Vue from 'vue'
  import { sAjax, translation, createTime } from '../../assets/utils/utils.js'
  import formSetManage from '../workflow/formSetManage.vue'
  Vue.component('FormSetManage', formSetManage)
  export default {
    props: {
      data: {
        default: null
      },
      role: {
        default: ''
      }
    },
    created: function () {
      var la = localStorage.getItem('lang')
      var that = this
      if (translation(la)) {
        this.lang = la
      }
      this._initColumns()
    },
    data: function () {
      return {
        tableCheckedList:[],
        studentBie:true,
        columns: [],
        onGuardStatus:true,
        //这里修改为导师的列表url
        url: '/table-data/tutor/getTutors',
        tableName: '导师信息',
        method: 'get',
        lang: 'zh-cn',
        student: {
          name: ''
        },
        layoutManageJson: {
          infoTypes: [],
          route: 'main',
          layoutsJson: {},
          logJson: {},
          instanceJson: {},
          preview: false,
          curInfoId: ''
        },
        showAddModal: false,
        tutor: {
          message: '',
          userId: '',
          userNo: '',
          userName: ''
        },
        timeStamp: '',
        curRouter: 'tutorInfoList',
        // 这里修改为导师的批量导入接口
        importParams: {
          parentPageTitle: '导师信息列表',
          downloadTemplateUrl: '/tutor/tutorExcelDownload',
          checkTemplateUrl: '/tutor/checkTutor',
          downloadErrorTemplateUrl: '/tutor/tutorExcelInput/error',
          templateName: '批量导入导师信息',
          importBtnType: null
        }
      }
    },
    computed: {
      translate: function () {
        return translation(this.lang).infoManage
      }
    },
    methods: {
      getStudentId(){
        let arr = []
        arr = this.tableCheckedList.map((item)=>{
          return  item.userNo
        })
        return arr
      },
      selcetBatchDelete(){
        if(this.tableCheckedList.length>0){
          let params = {}
          params['onGuardStatus'] = this.onGuardStatus
          params['userNoList'] = this.getStudentId()

          this.$confirm("是否批量删除数据？", "提示", {confirmButtonText: "确定", cancelButtonText: "取消", type: "warning"})
          .then(() => {
                let url = "/api/tutor/batchDeleteTutor"
                sAjax({
                  url: url,
                  type: 'post',
                  data:params,
                  success: result => {
                    if (result.state) {
                      this.timeStamp = new Date().getTime()
                      this.tableCheckedList = []
                      this.$toast('批量删除成功')
                    } else {
                       if (result.code === '50003') {
                            this.$toast('当前导师仍有带生关系，请到带生关系设置中解除')
                          } else {
                            this.$toast(result.message)
                          }
                    }
                  }
             });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
        }
        else{
         this.$toast('请先选择要删除的数据！')
        }
      },
      selcetBatchTo(onOrOff){
        if(this.tableCheckedList.length>0){
          let params = {}
          if(onOrOff == 'off'){
            params['onGuardStatus'] = false
          }
          else{
            params['onGuardStatus'] = true
          }
          params['userNoList'] = this.getStudentId()

          this.$confirm(onOrOff=='off'?"是否确认改为非在岗状态？":"是否确认改为在岗状态？", "提示", {confirmButtonText: "确定", cancelButtonText: "取消", type: "warning"})
          .then(() => {
                let url = "/api/tutor/batchTutorStatus"
                sAjax({
                  url: url,
                  type: 'post',
                  data:params,
                  success: result => {
                    if (result.state) {
                      this.timeStamp = new Date().getTime()
                      this.tableCheckedList = []
                      this.$toast('批量修改成功!')
                    } else {
                       if (result.code === '50003') {
                            this.$toast('当前辅导员仍有带生关系，请到带生关系设置中解除')
                          } else {
                            this.$toast(result.message)
                          }
                    }
                  }
             });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消修改"
            });
          });
        }
        else{
         this.$toast('请先选择要修改的数据！')
        }

        

      },
      _tableChecked: function (recordArr) {
      this.tableCheckedList = recordArr
    },
      _addTutor: function () {
        this.showAddModal = true
        this.tutor = {
          message: '',
          userId: '',
          userNo: '',
          userName: ''
        }
      },
      _batchTutor: function () {
        this.curRouter = 'importPag'
        this.importParams.importBtnType = [{
          url: '/tutor/inputExcelTutor',
          method: 'POST',
          isShowBtn: true,
          name: '增量导入',
          success: (data) => {
            if (data.state) {
              this.timeStamp = createTime()
            }
          }
        }]
      },
      checkAddUser: function () {
        sAjax({
          url: '/api/users/' + this.tutor.userNo,
          type: 'GET',
          success: (data) => {
            if (data.state) {
              this.tutor.userId = data.data.userId
              this.tutor.userName = data.data.name
              this.tutor.errorMessage = ''
            } else {
              this.tutor.errorMessage = '用户不存在'
              this.tutor.userId = ''
              this.tutor.userName = ''
            }
          }
        })
      },
      sureAddTutor: function () {
        sAjax({
          url: '/api/tutor/addTutor',
          type: 'post',
          data: {
            userNo: this.tutor.userNo,
            userId: this.tutor.userId,
            userName: this.tutor.userName
          },
          success: (data) => {
            if (data.state) {
              this.showAddModal = false
              this.$toast('新增成功')
              this.timeStamp = createTime()
            } else {
              if (data.code === '50003') {
                this.$toast('该导师已存在')
              } else {
                this.$toast(data.message)
              }
            }
          }
        })
      },
      _initColumns: function () {
        this.columns = [
          {
            id: 'userNo',
            title: "教工号",
            className: 'text-left',
            // width: 150,
            hidden: false,
            search: {
              type: 'input',
              data: {
                placeholder: "教工号"
              }
            }
          },
          {
            id: 'tutorName',
            title: "姓名",
            className: 'text-left',
            hidden: false,
            search: {
              type: 'input',
              data: {
                placeholder: "姓名"
              }
            },
          },
          //  {
          //   id: 'postNature',
          //   title: "岗位性质",
          //   className: 'text-left',
          //   hidden: false
          // },
          //  {
          //   id: 'unit',
          //   title: "单位",
          //   className: 'text-left',
          //   hidden: false
          // },
          //  {
          //   id: 'phoneNumber',
          //   title: "电话/手机",
          //   className: 'text-left',
          //   hidden: false
          // },
          //  {
          //   id: 'idCardNo',
          //   title: "身份证号",
          //   className: 'text-left',
          //   hidden: true
          // },
          // {
          //   id: 'sex',
          //   title: "性别",
          //   className: 'text-left',
          //   hidden: true
          // },
          // {
          //   id: 'birthday',
          //   title: "出生日期",
          //   className: 'text-left',
          //   hidden: true
          // },
          // {
          //   id: 'nation',
          //   title: "民族",
          //   className: 'text-left',
          //   hidden: true
          // },
          // {
          //   id: 'politicalStatus',
          //   title: "政治面貌",
          //   className: 'text-left',
          //   hidden: true
          // },
          // {
          //   id: 'unitType',
          //   title: "单位类型",
          //   className: 'text-left',
          //   hidden: true
          // },
          //  {
          //   id: 'administrativeFunction',
          //   title: "行政职能",
          //   className: 'text-left',
          //   hidden: true
          // },
          // {
          //   id: 'professionalPosition',
          //   title: "职业职位",
          //   className: 'text-left',
          //   hidden: true
          // },
          // {
          //   id: 'joinJobTime',
          //   title: "参加工作时间",
          //   className: 'text-left',
          //   hidden: true
          // },
          //   {
          //   id: 'joinJobTime',
          //   title: "参加工作时间",
          //   className: 'text-left',
          //   hidden: true
          // },
          //   {
          //   id: 'professionalType',
          //   title: "职业类型",
          //   className: 'text-left',
          //   hidden: true
          // },
          //  {
          //   id: 'instructorTime',
          //   title: "指导时间",
          //   className: 'text-left',
          //   hidden: true
          // },
          //  {
          //   id: 'manageStuCount',
          //   title: "管理层",
          //   className: 'text-left',
          //   hidden: true
          // },
          // {
          //   id: 'formationType',
          //   title: "格式类型",
          //   className: 'text-left',
          //   hidden: true
          // },
          //  {
          //   id: 'highestEducation',
          //   title: "最高学历",
          //   className: 'text-left',
          //   hidden: true
          // },
          //  {
          //   id: 'graduteSchool',
          //   title: "毕业院校",
          //   className: 'text-left',
          //   hidden: true
          // },
          //  {
          //   id: 'major',
          //   title: "专业",
          //   className: 'text-left',
          //   hidden: true
          // },
          //  {
          //   id: 'jobLevel',
          //   title: "工作水平",
          //   className: 'text-left',
          //   hidden: true
          // },
          //  {
          //   id: 'finalDegree',
          //   title: "最高学位",
          //   className: 'text-left',
          //   hidden: true
          // },
          //  {
          //   id: 'degreeType',
          //   title: "学位类型",
          //   className: 'text-left',
          //   hidden: true
          // },
          //  {
          //   id: 'archivalRepository',
          //   title: "档案库",
          //   className: 'text-left',
          //   hidden: true
          // },
          // {
          //   id: 'monthlyIncomeRange',
          //   title: "月收入范围",
          //   className: 'text-left',
          //   hidden: true
          // },
          // {
          //   id: 'marriageStatus',
          //   title: "婚姻状态",
          //   className: 'text-left',
          //   hidden: true
          // },
          // {
          //   id: 'officialPhone',
          //   title: "电话",
          //   className: 'text-left',
          //   hidden: true
          // },
          // {
          //   id: 'mail',
          //   title: "邮箱",
          //   className: 'text-left',
          //   hidden: true
          // },
          // {
          //   id: 'wechat',
          //   title: "微信号",
          //   className: 'text-left',
          //   hidden: true
          // },
          // {
          //   id: 'qq',
          //   title: "QQ",
          //   className: 'text-left',
          //   hidden: true
          // },
          // {
          //   id: 'postalCode',
          //   title: "邮政编码",
          //   className: 'text-left',
          //   hidden: true
          // },
          // {
          //   id: 'address',
          //   title: "地址",
          //   className: 'text-left',
          //   hidden: true
          // },
          // {
          //   id: 'majorType',
          //   title: "专业类型",
          //   className: 'text-left',
          //   hidden: true
          // },
          {
            id: 'opt',
            title: this.translate.opt,
            className: 'text-center',
            // width: 120,
            hidden: false,
            formatter: () => {
              var that = this
              return [{
                tag: 'a',
                text: '删除',
                className: 'opt-btn',
                callback: (record, index) => {
                  if (window.confirm('确定删除吗？')) {
                    sAjax({
                      url: `/api/tutor/deleteTutor?userNo=${record.userNo}`,
                      type: 'POST',
                      success: (data) => {
                        if (data.state) {
                          this.$toast('删除成功')
                          this.timeStamp = createTime()
                        } 
                        // else {
                        //   if (data.code === '50003') {
                        //     this.$toast('当前导师仍有带生关系，请到带生关系设置中解除')
                        //   } 
                          else {
                            this.$toast('删除失败')
                            this.$toast(data.message)
                          }
                        }
                      // }
                    })
                  }
                }
              }]
            }
          }]
      },
      _resetLayoutManageJson: function () {
        this.layoutManageJson.layoutsJson = {}
        this.layoutManageJson.logsJson = {}
        this.layoutManageJson.instanceJson = {}
        this.layoutManageJson.curInfoId = ''
      },
      _setLayout: function () {
        // 获取信息类别
        if (this.layoutManageJson.infoTypes.length === 0) {
          this.$waiting.show()
          this._getInfoTypes(() => {
            this.$waiting.close()
            this.layoutManageJson.route = 'formSetManage'
            this.$emit('fullScreen', true)
          })
        } else {
          this.layoutManageJson.route = 'formSetManage'
          this.$emit('fullScreen', true)
        }
      },
      _getInfoTypes: function (cb, searchContent) {
        sAjax({
          url: '/api/information/columnTypes/INSTRUCTOR',
          type: 'get',
          data: {
            searchContent: searchContent
          },
          success: (data) => {
            if (data.state) {
              if (data.data && data.data.length > 0) {
                this.layoutManageJson.infoTypes = data.data || []
                this.layoutManageJson.infoTypes.forEach((type) => {
                  this.$set(type, 'title', type.text)
                })
                cb && cb()
              } else {
                this.$toast(this.translate.nullColumnTypesTip)
              }
            } else {
              this.$toast(data.message)
            }
          }
        }).always(() => {
          // this.$waiting.close()
        })
      },
      _closeFormSetting: function () {
        this.layoutManageJson.route = 'main'
        this.$emit('fullScreen', false)
      },
      _saveFormInfo: function (arr) {
        if (arr.length > 0) {
          this.$waiting.show()
          sAjax({
            url: '/api/information/infoSettings/INSTRUCTOR',
            type: 'post',
            data: {
              infoTypes: arr
            },
            success: (data) => {
              if (data.state) {
                this.layoutManageJson.route = 'main'
                this.$toast(this.translate.successTip)
              } else {
                this.$toast(data.message)
              }
            }
          }).always(() => {
            this.$waiting.close()
          })
        } else {
          this.layoutManageJson.route = 'main'
          this.$toast(this.translate.successTip)
        }
      },
      _initInfoType: function (tab) {
        // 获取布局
        if (!(this.layoutManageJson.layoutsJson[tab.id] && this.layoutManageJson.logsJson[tab.id])) {
          this.$waiting.show({
            container: '.preview-container'
          })
          sAjax({
            url: `/api/information/infoSetting/INSTRUCTOR/${tab.id}`,
            type: 'get',
            data: {
              userId: this.student.userId,
              distributary: 'bySchool'
            },
            success: (data) => {
              if (data.state) {
                if (!data.data) {
                  data.data = []
                }
                data.data.components.forEach((ele) => {
                  Vue.set(ele, 'x', ele.location.left)
                  Vue.set(ele, 'y', ele.location.top)
                  Vue.set(ele, 'w', ele.size.width)
                  Vue.set(ele, 'h', ele.size.height)
                })
                this.$set(this.layoutManageJson.layoutsJson, tab.id, data.data)
                // 获取操作日志
                sAjax({
                  url: `/api/information/infoInstance/changeLogs/INSTRUCTOR/${tab.id}`,
                  type: 'get',
                  data: {
                    userId: this.student.userId
                  },
                  success: (data) => {
                    if (data.state) {
                      this.$set(this.layoutManageJson.logsJson, tab.id, data.data || [])
                      this.layoutManageJson.curInfoId = tab.id
                      this.layoutManageJson.preview = true
                    } else {
                      this.$toast(data.message)
                    }
                  }
                })
              } else {
                this.$toast(data.message)
              }
            }
          }).always(() => {
            this.$waiting.close()
          })
        } else {
          this.layoutManageJson.curInfoId = tab.id
        }
      },
      _getInfoValue: function (obj) {
        // 获取当前类型数据
        this.$set(this.layoutManageJson.instanceJson, this.layoutManageJson.curInfoId, obj)
      },
      _submitAll: function () {
        // 提交全部修改记录
        var arr = []
        for (var i in this.layoutManageJson.instanceJson) {
          arr.push({ infoId: i, formData: this.layoutManageJson.instanceJson[i].formData })
        }
        if (arr.length === 0) {
          this.$toast('暂无需保存记录')
          return
        }
        this.$waiting.show()
        sAjax({
          url: `/api/information/infoInstance/INSTRUCTOR/bySchool/${this.student.userId}`,
          type: 'post',
          data: {
            typesValue: arr,
            source:'INSTRUCTOR'
          },
          success: (data) => {
            if (data.state) {
              this.$toast(this.translate.successTip)
              this.layoutManageJson.instanceJson = {}
              this.layoutManageJson.preview = false
            } else {
              this.$toast(data.message)
            }
          }
        }).always(() => {
          this.$waiting.close()
        })
      },
      _saveRoles: function (data) {
        sAjax({
          url: '/api/information/player/' + data.type,
          type: 'post',
          data: {
            players: data.players,
            educationLevel: data.educationLevel,
          },
          success: (data) => {
            if (data.state) {
              this.$toast(this.translate.successTip)
              this.layoutManageJson.route = 'formSetManage'
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
    }
  }
</script>
<style lang="less">
@import url("../../assets/common.less");
.info-set-container {
  height: 100%;
}

.tutor-info-page {
  .modal-body {
    max-height: 400px;
  }
}
</style>
