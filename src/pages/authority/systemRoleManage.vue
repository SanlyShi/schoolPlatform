<template>
  <div id="systemRole-page" class="container-fluid">
    <!--v-table-->
    <div class="row text-center">
      <!--调用v-table全局组件事，将本页面请求的columns传给该组件进行数据的渲染, :xx表示正向传值-->
      <v-table  :title="translate.tableTitle" :url="url" pagesize="10" idField="id" :order="true" :columns="columns">
      </v-table>
    </div>

    <!-- 点击“添加”的模态框（Modal） -->
    <v-modal :show="showUserModal"  effect="fade" width="420">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          {{ translate.user }}
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <input type="hidden" id="role-id" v-model="newRoleUser.roleId">
        <div class="form-group">
          <label class="input-label" >{{translate.userNo}}</label>
          <input id="user-no" type="text" :placeholder="translate.checkUserTip" class="form-control search-input modal-form-style"  @change="checkUser" v-model="newRoleUser.userNo">
          <button type="button" class="btn  check-btn clearBtnBorder" @click="checkUser">{{ translate.check }}</button>
          <p class="error-message">{{errorMessage}}</p>
        </div>
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
      // columns对象数组用来填充表格
      this.columns = [{
        id: 'name',
        title: this.translate.roleName,
        // 单独设置某一列的样式
        className: 'text-left',
        // 某一列是否隐藏
        hidden: false
      }, {
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
      }, {
        id: 'opt',
        className: 'text-center',
        width: '130px',
        title: this.translate.operation,
        hidden: false,
        // 对最后变的td进行格式化，用两个a标签填充
        formatter: function () {
          return [{
            tag: 'a',
            // “清空”
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
              that.showUserModal = true
              that.isCheck = false
            }
          }]
        }
      }]
    },
    data: function () {
      return {
        columns: [],
        url: '/table-data/authorities/systemRoles/pages',
        showUserModal: false,
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
        return translation(this.lang).systemRoleManage
      }
    },
    methods: {
      // 取消增加用户
      cancelAddUser: function () {
        this.newRoleUser = {
          roleId: 0,
          userId: '',
          name: '',
          userNo: ''
        }
        this.showUserModal = false
      },
      // 检测输入的工号是否已存在
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
              // 如果该工号不存在，则新增工号和姓名
              that.newRoleUser.userId = data.data.userId
              that.newRoleUser.name = data.data.name
              that.errorMessage = ''
              that.isCheck = true
            } else {
              // 如果该工号已经存在则提示
              that.errorMessage = that.translate.userNoExistedTip
              that.isCheck = false
            }
          }
        })
      },
      // 填写完工号和姓名 点击“提交”
      addUser: function () {
        var that = this
        sAjax({
          url: '/api/authorities/systemRoles/' + this.newRoleUser.roleId + '/users',
          dataType: 'json',
          data: {
            users: this.userInfoArr
          },
          type: 'post',
          success: function (data) {
            if (data.state) {
              that.showUserModal = false
              that.url = that.url + '?time=' + new Date().getTime()
              that.$toast('提交成功')
            } else {
              that.$toast(data.message)
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
//通用样式
@import url("../../assets/common.less");
#systemRole-page {
  /*清空和增加按钮*/
  .opt-btn {
    border-radius: 3px;
    margin-right: 5px;
  }
  .modal-body {
    .user-no-input {
      width: 70%;
    }
    .checkBtn {
      float: right;
      margin-top: -33px;
      margin-right: 8px;
      font-weight: 500;
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
