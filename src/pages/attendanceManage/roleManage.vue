<template>
  <div id="attendanceRole-page" class="container-fluid">
    <div class="row text-center">
      <v-table  :title="type === 'COLLEGE'?'':'校级权限管理'" :url="url" pagesize="10" idField="id" :order="true" :columns="columns">
        <div slot="btn-group" role="group">
          <div v-if="type === 'COLLEGE'" class="btn-group pull-left">
            <v-select :value="currentCollegeId" :options="collegeOptions"  optionsLabel="name" optionsValue="code" @afterSelected="changeCollege"></v-select>
          </div>
          <div slot="btn-group" class="btn-group pull-right" role="group">
            <button v-if="roleDimension" type="button" class="btn batch-add-btn btn-bgColor-style clearBtnBorder" @click="addNewRole">新增角色</button>
            <button type="button" class="btn batch-add-btn btn-bgColor-style clearBtnBorder" @click="exchangeDimension()">{{ buttonText }}</button>
          </div>
        </div>
      </v-table>
    </div>

    <!-- 模态框（Modal） -->
    <v-modal :show="showUserModal" effect="fade" width="460">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          {{ modalType == 'edit' ? '编辑角色' : '新增角色'}}
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <input type="hidden" id="role-id" v-model="newRoleUser.roleId">
        <div class="form-group">
          <label class="input-label" >角色名称</label>
          <input id="user-name" type="text" placeholder="请输入角色名称" class="form-control search-input modal-form-style" v-model="newRoleUser.roleName">
        </div>
        <div class="form-group flex">
          <label class="input-label" style="margin-right: 4px;">角色说明</label>
          <textarea id="user-name" type="text" placeholder="请输入角色说明" class="form-control textarea modal-form-style" v-model="newRoleUser.remark"></textarea>
        </div>
        <div v-if="modalType == 'edit'" class="form-group">
          <label class="input-label" >{{translate.userNo}}</label>
          <input id="user-no" type="text" :placeholder="translate.checkUserTip" class="form-control search-input modal-form-style"  @change="checkUser" v-model="newRoleUser.userNo">
          <button type="button" class="btn check-btn clearBtnBorder" @click="checkUser">{{ translate.check }}</button>
          <p class="error-message">{{errorMessage}}</p>
        </div>
        <div v-if="modalType == 'edit'" class="form-group">
          <div class="form-group">
            <label class="input-label" >{{translate.username}}</label>
            <input type="text" class="form-control name-input modal-form-style" readonly="readonly" v-model="newRoleUser.name">
            <button type="button" class="btn check-btn clearBtnBorder" @click="addNewUser">{{ translate.add }}</button>
          </div>
        </div>
        <div v-if="modalType == 'edit'" class="user-list">
          <p class="" v-for="(com,cIndex) in userInfoArr" :key="cIndex">
            <span class="user-name">{{com.userName}}</span> <i class="maticon pull-right remove-icon" v-html="icons('cancel')" @click="removeUser(com.userId)">cancel</i>
          </p>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="cancelAddUser">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="addUser">确定</button>
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
      this.type = this.$route.query.type
      if(this.type === 'COLLEGE') {
        this.getCollegeList()
      } else {
        this.url = this.roleUrl + this.type
      }
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
            userString += '<span title='+ e.userNo +'>' + e.name + '</span>' + ','
           
          })
          return userString.substring(0, userString.length - 1)
        }
      },
      {
        id: 'opt',
        title: this.translate.operation,
        className: 'text-center',
        width: '130px',
        hidden: false,
        formatter: function (record) {
          let optList = [{
            tag: 'a',
            text: that.translate.edit,
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
              that.newRoleUser.roleName = record.name
              that.newRoleUser.remark = record.remark
              that.showUserModal = true
              that.isCheck = false
              that.modalType = 'edit'
            }
          }]
          if(record.source !== 'systemRole') {
            optList.push({
              tag: 'a',
              text: '删除',
              className: 'opt-btn',
              callback: function (record, index) {
                if(confirm('确定删除该角色吗？删除后数据将无法恢复')) {
                  sAjax({
                    url: '/api/ca/roles/delete/'+ record.id,
                    dataType: 'json',
                    data: {
                      users: this.userInfoArr
                    },
                    type: 'post',
                    success: function (data) {
                      if (data.state) {
                        that.showUserModal = false
                        that.url = (that.roleDimension ? that.roleUrl : that.userUrl) + that.type + '?time=' + new Date().getTime()
                        if(that.type == 'COLLEGE') {
                          that.url += '&college=' + that.currentCollegeId
                        }
                        that.$toast('删除成功')
                      } else {
                        that.$toast(data.message)
                      }
                    }
                  })
                }
              }
            })
          }
          return optList
        }
      }]
      this.userColumns = [{
        id: 'userNo',
        title: this.translate.userNo,
        className: 'text-left',
        hidden: false
      },
      {
        id: 'name',
        title: this.translate.username,
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
        type: 'SCHOOL',
        collegeOptions: [],
        currentCollegeId: '',
        columns: [],
        roleColumns: [],
        userColumns: [],
        url: '',
        roleUrl: '/table-data/ca/roles/page/',
        userUrl: '/table-data/ca/roles/user/page/',
        showUserModal: false,
        roleDimension: true,
        newRoleUser: {
          roleId: 0,
          userId: '',
          name: '',
          userNo: '',
          roleName: '',
          remark: '',
        },
        errorMessage: '',
        userInfoArr: [],
        isCheck: false,
        modalType: 'add',
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
      getCollegeList() {
        let that = this
         sAjax({
          url: '/api/ca/unit/colleges/leading',
          dataType: 'json',
          type: 'get',
          success: function (result) {
            if (result.state) {
              if (result.data.length > 0) {
                that.collegeOptions = result.data
                that.currentCollegeId = that.collegeOptions[0].code
                that.url = that.roleUrl +that.type+ '?college=' + that.currentCollegeId
              } else {
                that.$toast(this.translate.noManageCollegeTip)
              }
            } else {
              that.$toast(result.message)
            }
          }
        })
      },
      changeCollege: function (data) {
        this.currentCollegeId = data.val
        this.url = (this.roleDimension ? this.roleUrl : this.userUrl)+this.type + '?time=' + new Date().getTime() + '&college=' + this.currentCollegeId
      },
      exchangeDimension: function () {
        if (this.roleDimension) {
          this.columns = this.userColumns
          this.url = this.userUrl+this.type
        } else {
          this.columns = this.roleColumns
          this.url = this.roleUrl+this.type
        }
        if(this.type == 'COLLEGE') {
          this.url += '?college=' + this.currentCollegeId
        }
        this.roleDimension = !this.roleDimension
      },
      cancelAddUser: function () {
        this.newRoleUser = {
          roleId: 0,
          userId: '',
          name: '',
          userNo: '',
          roleName: '',
          remark: '',
        }
        this.errorMessage = ''
        this.showUserModal = false
      },
      addNewRole: function () {
        this.showUserModal = true
        this.modalType = 'add'
      },
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
      addNewUser: function () {
        if (!this.isCheck) {
          return this.$toast('请先检测学工号！')
        } 
        this.userInfoArr.push({
          userId: this.newRoleUser.userId,
          userName: this.newRoleUser.name
        })
      },
      addUser: function () {
        var that = this
        if(!this.newRoleUser.roleName) {
          this.$toast('角色名称不能为空')
          return;
        }
        if(this.modalType == 'add') {
          sAjax({
            url: `/api/ca/roles/${this.type}/`,
            dataType: 'json',
            data: {
              name: this.newRoleUser.roleName,
              remark: this.newRoleUser.remark,
            },
            type: 'post',
            success: function (data) {
              if (data.state) {
                that.showUserModal = false
                that.url = (that.roleDimension ? that.roleUrl : that.userUrl) + that.type + '?time=' + new Date().getTime()
                if(that.type == 'COLLEGE') {
                  that.url += '&college=' + that.currentCollegeId
                }
                that.$toast('新增成功')
                that.cancelAddUser()
              } else {
                that.$toast(data.message)
              }
            }
          })
        } else {
          let data = {
              name: this.newRoleUser.roleName,
              remark: this.newRoleUser.remark,
              users: this.userInfoArr
            }
            if(this.type == 'COLLEGE') {
              data.college = this.currentCollegeId
            }
          sAjax({
            url: `/api/ca/roles/${this.type}/`+ this.newRoleUser.roleId,
            dataType: 'json',
            data: data,
            type: 'post',
            success: function (data) {
              if (data.state) {
                that.url = (that.roleDimension ? that.roleUrl : that.userUrl) + that.type + '?time=' + new Date().getTime()
                if(that.type == 'COLLEGE') {
                  that.url += '&college=' + that.currentCollegeId
                }
                that.$toast('编辑成功')
                that.cancelAddUser()
              } else {
                that.$toast(data.message)
              }
            }
          })
        }
        
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
#attendanceRole-page {
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
  .flex {
    display: flex;
  }
  .error-message {
    font-size: 13px;
    color: #ff5252;
    line-height: 13px;
    margin: 8px 0 0 88px;
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
  .input-label {
    text-align: right;
    width: 60px;
  }
  .textarea {
    height: 100px !important;
    line-height: 1 !important;
    padding: 8px 5px !important;
  }
  .form-group{
    .btn{
      top:-2px;
    }
  }
}
</style>
