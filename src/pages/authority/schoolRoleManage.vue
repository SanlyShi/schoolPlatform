<template>
  <div id="schoolRole-page" class="container-fluid">
    <div class="row text-center">
      <v-table :title="translate.tableTitle" :url="url+timestamp" pagesize="10" idField="id" :order="true" :columns="columns">
        <div slot="btn-group" class="btn-group pull-right" role="group">
          <button type="button" class="btn batch-add-btn btn-bgColor-style clearBtnBorder" @click="_showAddRoleModal('add')">新增角色</button>
          <button type="button" class="btn clearBtnBorder" @click="exchangeDimension()">{{ buttonText }}</button>
        </div>
      </v-table>
    </div>
    <!-- 模态框（Modal） -->
    <v-modal :show="showNewRoleBox" effect="fade" width="850">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          自定义角色
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="form-group">
          <label class="input-label">角色名称：</label>
          <el-input v-model="newCustomRole.name" maxlength=40 placeholder="请输入角色名称" class="w400"></el-input>
          <!-- <input type="text" placeholder="请输入角色名称" max-length="40" class="form-control search-input modal-form-style w400" v-model="newCustomRole.name"> -->
        </div>
        <div class="form-group">
          <div class="form-group">
            <label class="input-label">角色说明：</label>
            <el-input v-model="newCustomRole.remark" maxlength=40 placeholder="请输入角色说明" class="w400"></el-input>
            <!-- <input type="text" placeholder="请输入角色说明" max-length="40" class="form-control name-input modal-form-style w400" v-model="newCustomRole.remark"> -->
          </div>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane 
            v-for="(tab, index) in newCustomRole.systems" 
            :key="index" 
            :label="tab.title" 
            :name="tab.name"
          >
            <el-radio-group v-model="tab.role" @change="radioChange($event, tab)" style="padding-left: 10px;">
              <el-radio label="admin" @click.native.prevent="radioClick('admin', tab)">系统管理员</el-radio>
              <el-radio v-if="filterSys(tab.name)" label="normal" @click.native.prevent="radioClick('normal', tab)">普通用户</el-radio>
              <el-tree
                v-if="tab.role === 'normal'&&tab.menus&&tab.menus.length>0"
                :data="tab.menus"
                show-checkbox
                node-key="id"
                :default-expanded-keys="expandedList"
                :default-checked-keys="tab.checkedList"
                @check="handleTreeCheck"
                :props="defaultProps">
              </el-tree>
            </el-radio-group>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showNewRoleBox=false">{{translate.cancel}}</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="addRole">确定</button>
      </div>
    </v-modal>
    <v-modal :show="showUserModal" effect="fade" width="420" style="height:600px">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          {{ translate.user }}
        </h5>
      </div>
      <div slot="modal-body" class="modal-body container-fluid" style="overflow: visible;">
        <div class="form-group">
           <label class="input-label">检测</label>
            <detect style="display:inline-block;vertical-align: middle;margin-left: 18px;" ref="searchVal" :searchVal='searchVal' url="/api/relClass/getUserSimpleInfo" keyword="nameOrNo" :placeholder="请输入学号或者姓名" @afterSelected="afterSelectAddPerson"></detect>
        </div>
        <!-- <input type="hidden" id="role-id" v-model="newRoleUser.roleId"> -->
        <!-- <div class="form-group">
          <label class="input-label">{{translate.userNo}}</label>
          <input id="user-no" type="text" :placeholder="translate.checkUserTip" class="form-control search-input modal-form-style" @change="checkUser" v-model="newRoleUser.userNo">
          <button type="button" class="btn check-btn clearBtnBorder" @click="checkUser">{{ translate.check }}</button>
          <p class="error-message">{{errorMessage}}</p>
        </div> -->
        <div class="form-group">
          <div class="form-group">
            <label class="input-label">{{translate.username}}</label>
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
  import {
    sAjax,
    request,
    translation
  } from '../../assets/utils/utils.js'
  
  export default {
    created: function () {
      var la = localStorage.getItem('lang')
      var that = this
      if (translation(la)) {
        this.lang = la
      }
      this.roleColumns = [{
          id: 'name',
          title: this.translate.roleName,
          className: 'text-left',
          hidden: false
        }, {
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
          title: this.translate.operation,
          className: 'text-center',
          width: '130px',
          hidden: false,
          formatter: function (e) {
            let opt = [{
              tag: 'a',
              text: '授权',
              className: 'opt-btn',
              callback: function (record, index) {
                that.userInfoArr.splice(0, that.userInfoArr.length)
                record.users && record.users.forEach((ele, i) => {
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
                that.timestamp = new Date()
              }
            }]
            if (e.source === 'customDefined') {
              opt.unshift({
                tag: 'a',
                text: '编辑',
                className: 'opt-btn',
                callback: function (record, index) {
                  that.getCustomRole(record.id, () => {
                    that._showAddRoleModal()
                  })
                }
              })
            }
            return opt
          }
        }
      ]
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
          formatter: function(record) {
            if (!record.roles) {
              return ''
            }
            var roleString = ''
            record.roles.forEach(function(item) {
              roleString += item.name + ','
            })
            return roleString.substring(0, roleString.length - 1)
          }
        }
      ]
      this.columns = this.roleColumns
      this.url = this.roleUrl
      this.getCustomRole()
    },
    data: function () {
      return {
        searchVal:'',
        expandedList: [],
        timestamp: '',
        activeName: 'core',
        defaultProps: {
          children: 'subMenus',
          label: 'name'
        },
        modalState: 'add',
        showNewRoleBox: false,
        columns: [],
        roleColumns: [],
        userColumns: [],
        url: '',
        // roleUrl: '/table-data/authorities/schoolRoles/pages',
        roleUrl: '/table-data/authorities/schoolRoles/list?timestamp=',
        // userUrl: '/table-data/authorities/schoolRoles/users/pages?timestamp=',
        userUrl: '/table-data/authorities/schoolRoles/users/pages?timestamp=',
        showUserModal: false,
        roleDimension: true,
        newCustomRole: {
          id: null,
          name: '',
          remark: '',
          systems: []
        },
        newRoleUser: {
          roleId: 0,
          userId: '',
          name: '',
          userNo: ''
        },
        errorMessage: '',
        userInfoArr: [],
        isCheck: false,
        lang: 'zh-cn',
        tabList: [],
        role: [
          {admin: true},
          {normal: false}
        ]
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
      filterSys (label) {
        if (
          label === 'ixuexi' || 
          label === 'appointment' || 
          label === 'warning' || 
          label === 'portrayal'
        ) {
          return false
        }
        return true
      },
      _showAddRoleModal (type) {
        this.activeName = 'core'
        if (type === 'add') {
          this.newCustomRole = {
            id: null,
            name: '',
            remark: '',
            systems: JSON.parse(JSON.stringify(this.tabList)),
          }
        }
        this.expandedList = []
        this.newCustomRole.systems.forEach(item => {
          item.checkedList = []
          
          item.menus && item.menus.forEach(menu => {
            if (menu.hasAuthority) {
              item.checkedList.push(menu.id)
            }
            if (menu.subMenus.length > 0) {
              this.expandedList.push(menu.id)
            }
            menu.subMenus.forEach(sub => {
              if (sub.hasAuthority) {
                item.checkedList.push(sub.id)
              }
            })
          })
        })
        this.modalState = type
        this.showNewRoleBox = true
      },
      addRole () {
        if (!this.newCustomRole.name) {
          this.$toast('请填写角色名称')
          return;
        }
        let params = Object.assign({}, this.newCustomRole)
        params.systems.forEach(item => {
          delete item.checkedList
          item.menus && item.menus.forEach(ele => {
            if (ele.hasAuthority && ele.subMenus.length > 0) {
              ele.hasAuthority = false
            }
          })
        })
         request('/api/authorities/schoolRoles/customRole', params, 'post').then(o => {
          if (o.state) {
              this.$toast(`${this.modalState === 'add' ? '新增' : '编辑'}成功`)
              this.timestamp = new Date()
              this.showNewRoleBox = false
          } else {
             this.$toast(o.message)
          }
        })
      },
      radioClick (e, tab) {
        if (!this.filterSys(tab.name)) {
          tab.isAdmin = !tab.isAdmin
          tab.isAdmin ? tab.role = 'admin' : tab.role = 'normal'
          return ;
        } 
        tab.role = e
        tab.isAdmin = (e === 'admin' ? true : false)
      },
      radioChange (e, tab) {
          tab.isAdmin = (e === 'admin' ? true : false)
      },
      handleTreeCheck (val) {
        val.hasAuthority = !val.hasAuthority
        val.subMenus.length > 0 && val.subMenus.forEach(item => {
          item.hasAuthority = val.hasAuthority
        })
        
      },
      getCustomRole (roleId = null, callback) {
        let params = roleId ? `?roleId=${roleId}` : ''
        let url = `/api/authorities/schoolRoles/customRole${params}`
        request(url).then(o => {
          if (o.state) {
              o.data.systems.forEach(item => {
                if (item.isAdmin === true) {
                  item.role = 'admin'
                } else if (item.isAdmin === false) {
                  item.role = 'normal'
                } else {
                  item.role = ''
                }

                item.menus && item.menus.forEach(ele => {
                  let trueCount = 0
                  ele.subMenus.map(o => {
                    if (o.hasAuthority) {
                      trueCount++
                    }
                  })
                  if (ele.subMenus.length > 0 && trueCount === ele.subMenus.length) {
                    ele.hasAuthority = true
                  }
                })
              })
              if (roleId) {
                this.newCustomRole = JSON.parse(JSON.stringify(o.data))
              } else {
                this.tabList = JSON.parse(JSON.stringify(o.data.systems))
              }
              if (typeof callback === 'function') {
                callback()
              }
          } else {
             this.$toast(o.message)
          }
        })
      },
      handleClick (tab, event) {
        // console.log(tab, event)
      },
      exchangeDimension () {
        if (this.roleDimension) {
          this.columns = this.userColumns
          this.url = '/table-data/authorities/schoolRoles/users/pages?pageIndex=0&timestamp='
        } else {
          this.columns = this.roleColumns
          this.url = '/table-data/authorities/schoolRoles/list?pageIndex=0&timestamp='
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
        if (!this.newRoleUser.userId) {
          return this.$toast('请先检测学工号！')
        }
        this.userInfoArr.push({
          userId: this.newRoleUser.userId,
          userName: this.newRoleUser.name
        })
      },
      addUser: function () {
        var that = this
        sAjax({
          url: '/api/authorities/schoolRoles/' + this.newRoleUser.roleId + '/users',
          dataType: 'json',
          data: {
            users: this.userInfoArr
          },
          type: 'post',
          success: function (data) {
            if (data.state) {
              that.showUserModal = false
              that.url = (that.roleDimension ? that.roleUrl : that.userUrl) + '?time=' + new Date().getTime()
              that.$toast('提交成功')
            } else {
              that.$toast(data.message)
            }
          }
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
  #schoolRole-page {
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
    .w400 {
      width: 400px !important;
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
<style lang="less">
 #schoolRole-page {
   .el-radio {
     display: block !important; 
     margin: 10px 0 !important;
   }
   .el-tree-node__content {
     line-height: 26px;
   }
   .modal-dialog {
     margin: 50px auto;
   }
   .modal-body {
     max-height: 580px;
   } 
 }
</style>
