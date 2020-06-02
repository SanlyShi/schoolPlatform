<template>
  <div id="classMembers-page" v-if="isParentPage">
    <div class="back-parent-page" >
       <button type="button" class="btn back-btn clearBtnBorder" @click="_backClassList">
        <i class="maticon back-icon-btn" v-html="icons('arrow_back')">arrow_back</i><span class="nav-title">{{translate.parentPage}}</span>
      </button>
    </div>
    <div class="row text-center">
      <v-table  :title="translate.tableName" :url="url" pagesize="10" idField="id" :columns="columns" :order="true" :search="true">
        <div slot="btn-group" class="btn-group pull-right" role="group">
          <button type="button" class="btn btn-bgColor-style clearBtnBorder" @click="singleAddModal()">{{translate.single}}{{translate.addNew}}</button>
          <button type="button" class="btn btn-bgColor-style clearBtnBorder" @click="batchAddModal()">{{translate.batch}}{{translate.addNew}}</button>
        </div>
      </v-table>
    </div>

    <!-- 模态框（Modal） -->
    <v-modal :show="showSingleAddModal" effect="fade" width="430">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          {{translate.addNew}}{{translate.student}}
      </h5>
      </div>
      <div slot="modal-body" class="modal-body" style="overflow: visible;">
        <div class="form-group single-add-group">
         <label>{{translate.studentId}}:</label>
         <detect v-if="showSingleAddModal" style="display:inline-block;vertical-align: middle;margin-left: 18px;" ref="searchVal"  url="/api/relClass/getUserSimpleInfo"  keyword="nameOrNo" :placeholder="请输入学工号或者姓名" @afterSelected="afterSelectStudent"></detect>
         <!-- <input class="form-control studentId-input search-input" :placeholder="translate.placeholder" type="text"  v-model="studentId" @change="checkStudentId" aria-describedby="basic-singleAdd-id">
         <button type="button" class="btn check-btn clearBtnBorder">{{translate.check}}</button> -->
       </div>
       <!-- <div>
        <label class="singleAddText">{{translate.name}}:</label>
        <span v-if="isCheckResult">{{singleAddText}}</span>
        <span v-else>{{translate.singleAddText}}</span>
       </div> -->
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showSingleAddModal = false">{{translate.cancel}}</button>
        <button type="button" class="btn submit-btn clearBtnBorder"  @click="sureSingleAdd()">{{translate.sure}}</button>
      </div>
    </v-modal>
  </div>
  <div class="import-page" v-else>
    <v-import  v-bind="importParams" @backParentPage="backParentPage" :overflow="'inherit'" ></v-import>
  </div>
  
</template>

<script>
  import Vue from 'vue'
  import { sAjax, translation } from '../../assets/utils/utils.js'
  export default {
    props: {
      // 唯一标记字段
      classId: {
        default: 0
      }
    },
    created: function () {
      var la = localStorage.getItem('lang')
      var that = this
      if (translation(la)) {
        this.lang = la
      }
      sAjax({
        url: '/api/relationship/getTempleteFileName/relClassMember',
        dataType: 'json',
        type: 'get',
        success: function (result) {
          if (result.state) {
            that.importParams.templateName = result.data
          }
        }
      })
      this.columns = [
        {
          id: 'studentId',
          title: this.translate.studentId,
          className: 'text-left',
          hidden: false,
          search: {
            type: 'input',
            data: {
              autoFocus: true
            }
          }
        },
        {
          id: 'studentName',
          title: this.translate.name,
          className: 'text-left',
          hidden: false,
          search: {
            type: 'input'
          },
          formatter: function (record, index) {
            return record.name
          }
        },
        {
          id: 'instructor',
          title: this.translate.instructor,
          className: 'text-left',
          hidden: false
        },
        {
          id: 'college',
          title: this.translate.college,
          className: 'text-left',
          hidden: false
        },
        {
          id: 'department',
          title: this.translate.department,
          className: 'text-left',
          hidden: false
        },
        {
          id: 'grade',
          title: this.translate.grade,
          className: 'text-center',
          hidden: false
        },
        {
          id: 'studentType',
          title: this.translate.studentType,
          className: 'text-left',
          hidden: false
        },
        {
          id: 'classCommitteeType',
          title: this.translate.position,
          className: 'text-left',
          hidden: false
        },
        {
          id: 'opt',
          title: this.translate.opt,
          className: 'text-center',
          width: '60px',
          hidden: false,
          formatter: function () {
            return [{
              tag: 'a',
              text: that.translate.remove,
              className: 'opt-btn',
              callback: function (record, index) {
                if (confirm(that.translate.removeConfirmTip)) {
                  that.$waiting.show()
                  sAjax({
                    url: `/api/relClass/deleteStudent/${that.classId}?userId=${record.studentUserId}`,
                    type: 'post',
                    success: function (data) {
                      if (data.state) {
                        if (data.data.success) {
                          that.url = '/table-data/relClass/getClassStudents/' + that.classId + '?timestamp=' + new Date().getTime()
                          that.$toast(that.translate.removeSuccessTip)
                        } else {
                          that.$toast(data.data.message)
                        }
                      } else {
                        that.$toast(that.translate.removeFailedTip + ':' + data.message)
                      }
                    }
                  }).always(() => {
                    that.$waiting.close()
                  })
                }
              }
            }]
          }
        }]
      this.importParams.parentPageTitle = this.translate.tableName
      this.importParams.importBtnType = [{
        name: this.translate.overriteImport,
        url: '/relClass/addStudentsByTemplate/' + that.classId,
        method: 'post',
        isShowBtn: true,
        success: (data) => {
          if (data.state) {
            this.url = '/table-data/relClass/getClassStudents/' + that.classId + '?timestamp=' + new Date().getTime()
          }
        }
      }]
    },
    data: function () {
      return {
        columns: [],
        url: '/table-data/relClass/getClassStudents/' + this.classId,
        importParams: {
          parentPageTitle: '',
          downloadTemplateUrl: '/relClass/downloadAddStudentTemplate/' + this.classId,
          downloadErrorTemplateUrl: '/relationship/downloadErrorExcel',
          checkTemplateUrl: '/relClass/uploadAddStudentTemplateExcel',
          templateName: '',
          importBtnType: null
        },
        showSingleAddModal: false,
        department: {},
        classMembers: {},
        definedSearch: {},
        studentId: '',
        studentUserId: '',
        singleAddText: '',
        isDisabled: true,
        isSingleDisabled: true,
        isCheckResult: false,
        checkResult: '',
        fileName: '',
        isParentPage: true,
        lang: 'zh-cn'
      }
    },
    computed: {
      translate: function () {
        return translation(this.lang).classMembers
      }
    },
    methods: {
      afterSelectStudent(o){
        this.studentUserId = o.userId
      },
      singleAddModal: function () {
        this.studentUserId = ''
        this.showSingleAddModal = true
        this.isCheckResult = false
      },
      checkStudentId: function () {
        var that = this
        if (!this.studentId) {
          that.isCheckResult = true
          that.singleAddText = that.translate.enterStudentId
          return false
        }
        sAjax({
          url: '/api/relClass/checkStudent/' + this.studentId,
          dataType: 'json',
          type: 'get',
          success: function (data) {
            that.isCheckResult = true
            if (data.state) {
              if (data.data.hasThisPerson) {
                that.studentUserId = data.data.userId
                that.singleAddText = data.data.name
                that.isSingleDisabled = false
              } else {
                that.singleAddText = that.translate.noExist
                that.isSingleDisabled = true
              }
            } else {
              that.singleAddText = data.message
              that.isSingleDisabled = true
            }
          }
        })
      },
      batchAddModal: function () {
        this.isParentPage = false
      },
      backParentPage: function () {
        this.isParentPage = true
      },
      _backClassList: function () {
        this.$emit('backClassList', 'classManage')
      },
      sureSingleAdd: function () {
        if (!this.studentUserId) {
          this.$toast('请正确输入信息！')
          return false
        }
        var that = this
        that.showSingleAddModal = false
        // that.$waiting.show()
        sAjax({
          url: '/api/relClass/addStudent/' + this.classId,
          dataType: 'json',
          data: {
            userId: this.studentUserId
          },
          type: 'post',
          success: function (data) {
            if (data.state) {
              //这里业务层面不知道为啥判断，先注释掉了
              // if (data.data.success) {
                that.url = '/table-data/relClass/getClassStudents/' + that.classId + '?timestamp=' + new Date().getTime()
                that.$toast(that.translate.submitSuccessTip)

              // } else {
              //   that.$toast(data.data.message)
              // }
            } else {
              that.$toast(that.translate.submitFailedTip + ':' + data.message)
            }
          }
        }).always(() => {
          // that.$waiting.close()
        })
      }
    }
  }
</script>
<style lang="less">
@import url("../../assets/common.less");
.import-page {
  background: rgb(245, 245, 245);
  position: absolute;
  height: 100%;
  top: 10px;
  left: 0;
  right: 25px;
}
#classMembers-page {
  .opt-btn {
    border-radius: 3px;
    margin-right: 5px;
    font-size: 13px;
    color: rgba(0, 0, 0, 0.54);
  }
  .single-add-group .btn-group {
    width: 198px;
    margin-left: 18px;
  }
  .studentId-input {
    width: 200px;
    display: inline-block;
    margin-left: 18px;
  }
  .singleAddText {
    margin-right: 18px;
  }
  .back-parent-page {
    margin: 0 -15px 0px -15px;
    background: rgb(245, 245, 245);
    padding: 12px 15px;
  }
  .back-btn {
    padding: 0;
    background: transparent;
  }
  .back-icon-btn {
    font-size: 20px;
    color: rgba(0, 0, 0, 0.54);
    line-height: 20px;
    cursor: pointer;
    vertical-align: middle;
  }
  .nav-title {
    font-size: 13px;
    color: rgba(0, 0, 0, 0.54);
    line-height: 13px;
    margin: 5px 0 0 8px;
    font-weight: 500;
    vertical-align: middle;
  }
  .name-search {
    margin-left: 15px;
  }
}
</style>
