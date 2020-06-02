<template>
  <div id="collegeRole-page" class="container-fluid">
    <div class="row text-center">
      <v-table :url="url" pagesize="10" idField="id" :order="true" :columns="columns">
        <div slot="btn-group" role="group">
          <div class="btn-group pull-left">
            <v-select :value="currentCollegeId" :options="collegeOptions"  optionsLabel="name" optionsValue="code" @afterSelected="changeCollege"></v-select>
          </div>
          <div class="btn-group pull-right">
            <button type="button" class="btn exchange-dimension-btn clearBtnBorder" @click="exchangeDimension()">{{ buttonText }}</button>
          </div>
        </div>
      </v-table>
    </div>

    <!-- 模态框（Modal） -->
    <v-modal :show="showUserModal" effect="fade" width="420">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          {{translate.user}}
        </h5>
      </div>
      <div slot="modal-body" class="modal-body container-fluid" style="overflow: visible;">
        <div class="form-group">
           <label class="input-label">检测</label>
            <detect style="display:inline-block;vertical-align: middle;margin-left: 18px;" ref="searchVal" :searchVal='searchVal' url="/api/relClass/getUserSimpleInfo" keyword="nameOrNo" :placeholder="请输入学号或者姓名" @afterSelected="afterSelectAddPerson"></detect>
        </div>
        <!-- <input type="hidden" id="role-id" v-model="newRoleUser.roleId">
        <div class="form-group">
          <label class="input-label" >{{translate.userNo}}</label>
          <input id="user-no" type="text" :placeholder="translate.checkUserTip" class="form-control search-input modal-form-style"  @change="checkUser" v-model="newRoleUser.userNo">
          <button type="button" class="btn check-btn clearBtnBorder" @click="checkUser">{{translate.check}}</button>
          <p class="error-message">{{errorMessage}}</p>
        </div> -->
        <div class="form-group">
          <div class="form-group">
            <label class="input-label" >{{translate.username}}</label>
            <input type="text" class="form-control name-input modal-form-style" readonly="readonly" v-model="newRoleUser.name">
            <button type="button" class="btn check-btn clearBtnBorder" @click="addNewUser">{{ translate.add }}</button>
          </div>
        </div>
        <div class="user-list">
          <p class="" v-for="(com,cIndex) in userInfoArr" :key="cIndex">
            <span class="user-name">{{com.userName}}</span> <i class="maticon pull-right remove-icon" v-html="icons('cancel')" @click="removeUser(com.userId)">cancel</i>
          </p>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="cancelAddUser">{{translate.cancel}}</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="addUser">{{translate.submit}}</button>
      </div>
    </v-modal>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { sAjax, translation } from '../../assets/utils/utils.js'
  export default {
    created: function () {
      var la = localStorage.getItem('lang')
      var that = this
      if (translation(la)) {
        this.lang = la
      }
      sAjax({
        url: '/api/currentUser/manageColleges',
        dataType: 'json',
        type: 'get',
        success: function (result) {
          if (result.state) {
            if (result.data.length > 0) {
              that.collegeOptions = result.data
              that.currentCollegeId = that.collegeOptions[0].code
              that.url = that.roleUrl + '?collegeId=' + that.currentCollegeId
            } else {
              that.$toast(this.translate.noManageCollegeTip)
            }
          } else {
            that.$toast(result.message)
          }
        }
      })
      this.roleColumns = [{
        id: 'name',
        title: this.translate.roleName,
        className: 'text-left',
        hidden: false
      },{
        id: 'remark',
        title: this.translate.roleDescription,
        className: 'text-left',
        hidden: false
      },
      {
        title: this.translate.user,
        className: 'text-left',
        hidden: false,
        hover: false,
        formatter: function (record) {
          if (!record.users) {
            return ''
          }
          var userString = ''
          record.users.forEach(function (e) {
            userString += '<span title=' + e.userNo + '>' + e.name + '</span>' + ','
          })
          return userString.substring(0, userString.length - 1)
        }
      },
      {
        id: 'opt',
        className: 'text-center',
        title: this.translate.operation,
        width: '130px',
        hidden: false,
        formatter: function () {
          return [{
            tag: 'a',
            text: '授权',
            className: 'opt-btn',
            callback: function (record, index) {
              that.userInfoArr.splice(0, that.userInfoArr.length)
              record.users.forEach((ele, i) => {
                that.userInfoArr.push({
                  userId: ele.userId,
                  userName: ele.name
                })
              })
              that.newRoleUser.roleId = record.id
              that.newRoleUser.userNo = ''
              that.newRoleUser.name = ''
              that.searchVal = ''
              that.showUserModal = true
              that.isCheck = false
            }
          }]
        }
      }]
      this.userColumns = [{
        id: 'userNo',
        title: this.translate.user,
        className: 'text-left',
        hidden: false
      },
      {
        id: 'name',
        title: this.translate.userNo,
        className: 'text-left',
        hidden: false
      },
      {
        title: this.translate.role,
        className: 'text-left',
        hidden: false,
        formatter: function (record) {
          if (!record.roles) {
            return ''
          }
          var roleString = ''
          record.roles.forEach(function (item) {
            roleString += item.name + ','
          })
          return roleString.substring(0, roleString.length - 1)
        }
      }]
      this.columns = this.roleColumns
    },
    data: function () {
      return {
        searchVal:'',
        collegeOptions: [],
        currentCollegeId: '',
        columns: [],
        roleColumns: [],
        userColumns: [],
        url: '',
        roleUrl: '/table-data/authorities/collegeRoles/pages',
        userUrl: '/table-data/authorities/collegeRoles/users/pages',
        showUserModal: false,
        roleDimension: true,
        newRoleUser: {
          roleId: 0,
          userId: '',
          name: '',
          userNo: ''
        },
        errorMessage: '',
        userInfoArr: [],
        isCheck: false,
        lang: 'zh-cn'
      }
    },
    computed: {
      translate: function () {
        return translation(this.lang).schoolRoleManage
      },
      buttonText: function () {
        return this.roleDimension ? this.translate.exchangeDimensionLabel1 : this.translate.exchangeDimensionLabel2
      }
    },
    methods: {
      afterSelectAddPerson(o){
        this.newRoleUser.userId = o.userId;
        this.newRoleUser.userNo = o.userNo;
        this.newRoleUser.name = o.name;
      },
      changeCollege: function (data) {
        this.currentCollegeId = data.val
        this.url = (this.roleDimension ? this.roleUrl : this.userUrl) + '?time=' + new Date().getTime() + '&collegeId=' + this.currentCollegeId
      },
      exchangeDimension: function () {
        if (this.roleDimension) {
          this.columns = this.userColumns
          this.url = this.userUrl + '?collegeId=' + this.currentCollegeId
        } else {
          this.columns = this.roleColumns
          this.url = this.roleUrl + '?collegeId=' + this.currentCollegeId
        }
        this.roleDimension = !this.roleDimension
      },
      cancelAddUser: function () {
        this.newRoleUser = {
          roleId: 0,
          userId: '',
          name: '',
          userNo: ''
        }
        this.showUserModal = false
      },
      // userNoChange: function () {
      //   this.newRoleUser.name = ''
      //   return this.newRoleUser
      // },
      checkUser: function () {
        var that = this
        if (!this.newRoleUser.userNo) {
          that.errorMessage = this.translate.checkUserTip
          return
        }
        sAjax({
          url: '/api/users/' + this.newRoleUser.userNo,
          dataType: 'json',
          data: {},
          type: 'GET',
          success: function (data) {
            if (data.state) {
              that.newRoleUser.userId = data.data.userId
              that.newRoleUser.name = data.data.name
              that.errorMessage = ''
              that.isCheck = true
            } else {
              that.errorMessage = that.translate.userNoExistedTip
              that.isCheck = false
            }
          }
        })
      },
      addUser: function () {
        var that = this
        sAjax({
          url: '/api/authorities/collegeRoles/' + this.newRoleUser.roleId + '/users',
          dataType: 'json',
          data: {
            users: this.userInfoArr,
            collegeId: this.currentCollegeId
          },
          type: 'post',
          success: function (data) {
            if (data.state) {
              that.showUserModal = false
              that.url = (that.roleDimension ? that.roleUrl : that.userUrl) + '?time=' + new Date().getTime() + '&collegeId=' + that.currentCollegeId
              that.$toast('提交成功')
            } else {
              that.$toast(data.message)
            }
          }
        })
      },
      addNewUser: function () {
        if (!this.newRoleUser.userId) {
          this.$toast('请先检测学工号！')
          return
        }
        this.userInfoArr.push({
          userId: this.newRoleUser.userId,
          userName: this.newRoleUser.name
        })
      },
      removeUser: function (userId) {
        this.userInfoArr.forEach((ele, i) => {
          if (ele.userId === userId) {
            this.userInfoArr.splice(i, 1)
          }
        })
      }
    }
  }
</script>
<style lang="less">
@import url("../../assets/common.less");
#collegeRole-page {
  .dropdown-toggle {
    box-shadow: none;
  }
  .exchange-dimension-btn {
    font-weight: 500;
    background: transparent;
    box-shadow: none;
    transition: all 0.2s ease;
    &:hover {
      color: #298df7;
    }
  }
  .add {
    background: @-90ThemeColor;
    border: none;
    border-radius: 100px;
  }
  .name-input {
    border-radius: 0;
    border-top: 0 solid #ffffff;
    border-left: 0 solid #ffffff;
    border-right: 0 solid #ffffff;
    border-bottom: 2px solid #e0e0e0;
    box-shadow: inset 0 0px 0px rgba(0, 0, 0, 0.075);
    padding: 0;
  }
  .form-control[readonly] {
    background: #fff;
  }
  .error-message {
    font-size: 13px;
    color: #ff5252;
    line-height: 13px;
    margin: 8px 0 0 50px;
  }
  .user-name {
    font-size: 14px;
    display: inline-block;
    margin-top: 3px;
  }
  .remove-icon {
    color: rgba(0, 0, 0, 0.4);
    cursor: pointer;
    margin-right: 20px;
  }
  .user-list {
    margin-top: 30px;
  }
}
</style>
