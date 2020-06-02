<template>
  <div id="premission" class="container-fluid">
    <div class="row">
      <div v-show="curRoute === 'role'">
        <v-table
          :url="`${roleUrl}?timeStamp=${timeStamp}`"
          pagesize="10"
          idField="id"
          :columns="roleColumns"
          :order="true"
          :columnsControl="false"
          :search="true">
          <div slot="btn-group" class="btn-group pull-right" role="group">
            <button type="button" class="btn btn-bgColor-style clearBtnBorder" @click="showAddRoleModal">新增角色</button>
            <button type="button" class="btn btn-bgColor-style clearBtnBorder" @click="curRoute = 'user'">切换到用户维度</button>
          </div>
        </v-table>
      </div>
      <div v-show="curRoute === 'user'">
        <v-table
          :url="userUrl"
          pagesize="10"
          idField="id"
          :columns="userColumns"
          :order="true"
          :columnsControl="false"
          :search="true">
          <div slot="btn-group" class="btn-group pull-right" role="group">
            <button type="button" class="btn btn-bgColor-style clearBtnBorder" @click="curRoute = 'role'">切换到角色维度</button>
          </div>
        </v-table>
      </div>
    </div>
    <v-modal :show="modalStatus.showAddModal" effect="fade" width="380">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">新增角色</h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="form-group">
          <label class="input-label modal-label">角色名</label>
          <input type="text" class="form-control form-input-style" v-model="addRoleJson.name">
        </div>
        <div class="form-group">
          <label class="input-label modal-textarea-label">角色说明</label>
          <textarea cols="24" rows="5" class="modal-textarea-style" maxlength="600" v-model="addRoleJson.remark"></textarea>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="modalStatus.showAddModal = false">{{translate.cancel}}</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="sumbitAddRole">{{translate.confirm}}</button>
      </div>
    </v-modal>
    <v-modal :show="modalStatus.showEidtModal" effect="fade" width="350">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">编辑</h5>
      </div>
      <div slot="modal-body" class="edit-modal-body">
        <div class="modal-container">
          <div class="form-group">
            <label class="input-label modal-label">角色名</label>
            <input type="text" class="form-control form-input-style" v-model="editRoleJson.name">
          </div>
          <div class="form-group">
            <label class="input-label modal-textarea-label">角色说明</label>
            <textarea cols="24" rows="5" class="modal-textarea-style" maxlength="600" v-model="editRoleJson.remark"></textarea>
          </div>
        </div>
        <div class="edit-card">
          <div class="form-group">
            <label class="input-label modal-label">用户检索</label>
            <detect  class="search-user" url="/api/apartment/users/searchResults" placeholder="用户姓名或学工号" @afterSelected="userSelected" v-if="editRoleJson.isShowSearch"></detect>
            <div style="display: inline-block" v-else>
              <div class="user-info">
                {{editRoleJson.userInfo}}
                <i class="maticon" v-html="icons('edit')" @click="changeUserSearch">edit</i>
              </div>
            </div>
          </div>
        </div>
        <div class="user-list" v-if="editRoleJson.roleUsers.length > 0">
          <p class v-for="(com,cIndex) in editRoleJson.roleUsers" :key="cIndex">
            <span class="user-name">{{com.name}}</span>
            <i class="maticon pull-right remove-icon" v-html="icons('cancel')" @click="removeUser(com.userId)">cancel</i>
          </p>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="modalStatus.showEidtModal = false">{{translate.cancel}}</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="sumbitEditRole">{{translate.confirm}}</button>
      </div>
    </v-modal>
    <v-modal :show="modalStatus.showSettingModal" effect="fade" width="885">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">配置</h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="form-group">
          <label class="setting-label">权限配置</label>
          <div>
            <div class="permission-options" v-for="(com, index) in permissionSetting.permissionArray" :key="index">
              <span @click="permissionSelected(com)">
                <i class="maticon check-box" v-html="icons('check_box')" v-if="permissionSetting.selected.indexOf(com.id) >= 0">check_box</i>
                <i class="maticon" v-html="icons('check_box_outline_blank')" v-else>check_box_outline_blank</i>
              </span>
              <span class="icon-title">{{com.name}}</span>
            </div>
          </div>
        </div>
        <div class="area-select">
          <label class="setting-label">片区选择</label>
          <div class="select-group">
            <div class="form-group">
              <label class="input-label">校区</label>
              <v-select
                class="btn-block form-select-style"
                :value="permissionSetting.defaultValue.campusId"
                :options="permissionSetting.campusArray"
                optionsLabel="label"
                optionsValue="value"
                @afterSelected="_valueSelected($event, 'campusId')"
                search
                close-on-select>
              </v-select>
            </div>
            <div class="form-group">
              <label class="input-label">园区</label>
              <v-select
                class="btn-block form-select-style"
                :value="permissionSetting.defaultValue.parkId"
                :options="permissionSetting.parkArray"
                optionsLabel="name"
                optionsValue="zoneId"
                @afterSelected="_valueSelected($event, 'parkId')"
                search
                close-on-select>
              </v-select>
            </div>
            <div class="form-group">
              <label class="input-label">楼栋</label>
              <v-select
                class="btn-block form-select-style"
                :value="permissionSetting.defaultValue.buildingId"
                :options="permissionSetting.buildingArray"
                optionsLabel="name"
                optionsValue="buildingId"
                @afterSelected="_valueSelected($event, 'buildingId')"
                search
                :multiple="true">
              </v-select>
            </div>
            <div class="form-group">
              <button type="button" class="btn clearBtnBorder add-btn" @click="addArea">添加</button>
            </div>
          </div>
          <div v-if="permissionSetting.roleAreas.length > 0">
            <label class="input-label pull-left">已添加片区</label>
            <div class="area-list pull-left">
              <div v-for="(com, index) in permissionSetting.roleAreas">
                <span>{{com.title}}</span>
                <i class="maticon pull-right remove-icon" v-html="icons('cancel')" @click="removeArea(com)">cancel</i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="modalStatus.showSettingModal = false" >{{translate.cancel}}</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="submitSettingRole">{{translate.confirm}}</button>
      </div>
    </v-modal>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { translation, sAjax, createTime } from '../../assets/utils/utils.js'
  export default {
    created: function () {
      var la = localStorage.getItem('lang')
      if (translation(la)) {
        this.lang = la
      }
      this.roleColumns = [{
        id: 'roleName',
        title: '角色名',
        className: 'text-left',
        hidden: false,
        width: 200,
        search: {
          type: 'input',
          data: {
            placeholer: '',
            autoFocus: true
          }
        },
        formatter: function (record) {
          return record.name
        }
      }, {
        id: 'remark',
        title: '角色说明',
        width: 120,
        className: 'text-left',
        hidden: false
      }, {
        id: 'userName',
        title: '用户',
        width: 120,
        className: 'text-left',
        hidden: false,
        hover: false,
        formatter: function (record) {
          var userName = ''
          if (record.roleUsers.length === 0) {
            return userName
          }
          record.roleUsers.forEach(function (item) {
            userName += '<span title=' + item + '>' + item.user.name + '</span>' + ','
          })
          return userName.substring(0, userName.length - 1)
        }
      }, {
        id: 'opt',
        title: this.translate.opt,
        className: 'text-centet',
        width: 130,
        hidden: false,
        formatter: (recordItem) => {
          return [{
            tag: 'a',
            text: '编辑',
            callback: (record, index) => {
              this.modalStatus.showEidtModal = true
              this.editRoleJson = {
                roleId: record.id,
                name: record.name,
                remark: record.remark,
                userInfo: '',
                userId: '',
                roleUsers: [],
                isShowSearch: true
              }
              record.roleUsers.forEach((ele) => {
                this.editRoleJson.roleUsers.push({
                  name: ele.user.name,
                  userId: ele.user.userId
                })
              })
            }
          }, {
            tag: 'a',
            text: '配置',
            className: 'opt-btn',
            callback: (record, index) => {
              this.modalStatus.showSettingModal = true
              this.permissionSetting.roleId =record.id
              sAjax({
                url: '/api/apartment/roles/menuAndArea/' + record.id,
                dataType: 'json',
                type: 'get',
                success: (data) => {
                  if (data.state) {
                    this.permissionSetting.roleAreas = data.data.roleAreas
                    this.permissionSetting.roleMenu = data.data.roleMenu
                    this.permissionSetting.defaultValue.parkId = ''
                    this.permissionSetting.defaultValue.buildingId = ''
                    this.permissionSetting.selected = []
                    if (data.data.roleMenu.length > 0) {
                      data.data.roleMenu.forEach((ele) => {
                        this.permissionSetting.selected.push(ele.menuId)
                      })
                    }
                  } else {
                    this.$toast(data.message)
                  }
                }
              })
            }
          }, {
            tag: 'a',
            text: '删除',
            className: 'opt-btn',
            callback: (record, index) => {
              if (confirm('确定要删除吗？')) {
                sAjax({
                  url: '/api/apartment/roles/delete/' + record.id,
                  dataType: 'json',
                  type: 'post',
                  success: (data) => {
                    if (data.state) {
                      this.toast('删除成功')
                      this._refreshTable()
                    } else {
                      this.$toast(data.message)
                    }
                  }
                })
              }
            }
          }]
        }
      }]
      this.userColumns = [{
        id: 'userNo',
        title: '工号',
        className: 'text-left',
        hidden: false,
        width: 200,
        search: {
          type: 'input',
          data: {
            placeholer: '',
            autoFocus: true
          }
        }
      }, {
        id: 'name',
        title: '姓名',
        className: 'text-left',
        hidden: false,
        width: 200,
        search: {
          type: 'input',
          data: {
            placeholer: '',
            autoFocus: true
          }
        }
      }, {
        id: 'roleName',
        title: '角色',
        className: 'text-left',
        hidden: false
      }, {
        id: 'college',
        title: '学院',
        className: 'text-left',
        hidden: false
      }]
      this._getSettingData()
    },
    data: function () {
      return {
        roleUrl: '/table-data/apartment/roles/page',
        userUrl: '/table-data/apartment/roles/roleUser/page',
        roleColumns: [],
        userColumns: [],
        curRoute: 'role',
        modalStatus: {
          showEidtModal: false,
          showAddModal: false,
          showSettingModal: false
        },
        addRoleJson: {
          name: '',
          remark: ''
        },
        editRoleJson: {
          roleId: '',
          name: '',
          remark: '',
          userInfo: '',
          userId: '',
          roleUsers: [],
          isShowSearch: true
        },
        permissionSetting: {
          permissionArray: [],
          selected: [],
          campusArray: [],
          parkArray: [],
          buildingArray: [],
          defaultValue: {
            campus: '',
            campusId: '',
            park: '',
            parkId: '',
            building: [],
            buildingId: ''
          },
          roleId: '',
          roleMenu: [],
          roleAreas: [],
          campusIds: [],
          zoneIds: []
        },
        timeStamp: '',
        lang: 'zh-cn'
      }
    },
    computed: {
      translate: function () {
        return translation(this.lang).accommodationStaff
      }
    },
    methods: {
      _getparkData: function () {
        sAjax({
          url: '/api/apartment/zones/getByCampuses?campusIds=' + this.permissionSetting.campusIds,
          dataType: 'json',
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.permissionSetting.parkArray = data.data || []
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _getBuildingData: function () {
        sAjax({
          url: '/api/apartment/buildings/getWithConditions?campusIds=' + this.permissionSetting.campusIds + '&zoneIds=' + this.permissionSetting.zoneIds,
          dataType: 'json',
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.permissionSetting.buildingArray = data.data || []
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _getSettingData: function () {
        sAjax({
          url: '/api/apartment/roles/menu',
          dataType: 'json',
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.permissionSetting.permissionArray = data.data
            } else {
              this.$toast(data.message)
            }
          }
        })
        sAjax({
          url: '/api/apartment/dicts?typeName=校区',
          dataType: 'json',
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.permissionSetting.campusArray = data.data || []
              if (data.data&&data.data.length > 0) {
                this.permissionSetting.defaultValue.campusId = data.data[0].value
              }
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      showAddRoleModal: function () {
        this.modalStatus.showAddModal = true
        this.addRoleJson = {
          name: '',
          remark: ''
        }
      },
      sumbitAddRole: function () {
        if (!this.addRoleJson.name) {
          return this.$toast('请输入角色名')
        }
        sAjax({
          url: '/api/apartment/roles',
          dataType: 'json',
          type: 'post',
          data: this.addRoleJson,
          success: (data) => {
            if (data.state) {
              this.toast('新增成功')
              this.modalStatus.showAddModal = false
              this._refreshTable()
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      sumbitEditRole: function () {
        sAjax({
          url: '/api/apartment/roles/' + this.editRoleJson.roleId,
          dataType: 'json',
          type: 'post',
          data: {
            name: this.editRoleJson.name,
            remark: this.editRoleJson.remark,
            roleUsers: this.editRoleJson.roleUsers
          },
          success: (data) => {
            if (data.state) {
              this.toast('编辑成功')
              this.modalStatus.showEidtModal = false
              this._refreshTable()
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      submitSettingRole: function () {
        sAjax({
          url: '/api/apartment/roles/setting/' + this.permissionSetting.roleId,
          dataType: 'json',
          type: 'post',
          data: {
            roleAreas: this.permissionSetting.roleAreas,
            roleMenu: this.permissionSetting.roleMenu,
          },
          success: (data) => {
            if (data.state) {
              this.$toast('配置成功')
              this.modalStatus.showSettingModal = false
              this._refreshTable()
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      userSelected: function (data) {
        this.editRoleJson.userId = data.userId
        this.editRoleJson.userInfo = data.name + ' (' + data.userNo + ')'
        this.editRoleJson.roleUsers.push({
          name: data.name,
          userId: data.userId
        })
        this.editRoleJson.isShowSearch = false
      },
      changeUserSearch: function () {
        this.editRoleJson.isShowSearch = true
        this.editRoleJson.userInfo = ''
        this.editRoleJson.userId = ''
      },
      removeUser: function (userId) {
        this.editRoleJson.roleUsers.forEach((ele, i) => {
          if (ele.userId === userId) {
            this.editRoleJson.roleUsers.splice(i, 1)
          }
        })
      },
      permissionSelected: function (com) {
        var index = this.permissionSetting.selected.indexOf(com.id)
        if (index >= 0) {
          this.permissionSetting.selected.splice(index, 1)
          this.permissionSetting.roleMenu.forEach((ele, i) => {
            if (com.id === ele.menuId) {
              this.permissionSetting.roleMenu.splice(i, 1)
            }
          })
        } else {
          if (com.name) {
            this.permissionSetting.selected.push(com.id)
            this.permissionSetting.roleMenu.push({
              roleId: this.permissionSetting.roleId,
              menuId: com.id
            })
          }
        }
      },
      addArea: function () {
        var campusDefaultValue = this.permissionSetting.defaultValue.campus
        var parkDefaultValue = this.permissionSetting.defaultValue.park
        var buildingDefaultValue = this.permissionSetting.defaultValue.building
        if (this.permissionSetting.campusArray.length > 0) {
          if (!campusDefaultValue) {
            return this.$toast('请选择校区')
          }
        }
        if (campusDefaultValue && buildingDefaultValue.length > 0) {
          if (this.permissionSetting.parkArray.length > 0) {
            if (!parkDefaultValue) {
              return this.$toast('请选择园区')
            }
          }
        }
        var textArray = []
        var newTextArray = []
        if (this.permissionSetting.parkArray.length > 0) {
          if (!parkDefaultValue) {
            this.permissionSetting.parkArray.forEach((ele, index) => {
              var text = campusDefaultValue + ele.name
              textArray.push({
                title: text,
                campus: this.permissionSetting.defaultValue.campusId,
                zoneId: ele.zoneId
              })
            })
          } else {
            textArray.push({
              title: campusDefaultValue + parkDefaultValue,
              campus: this.permissionSetting.defaultValue.campusId,
              zoneId: this.permissionSetting.defaultValue.parkId
            })
          }
        }
        if (this.permissionSetting.buildingArray.length > 0) {
          if (buildingDefaultValue.length === 0) {
            textArray.forEach((item, itemIndex) => {
              this.permissionSetting.buildingArray.forEach((ele, index) => {
                var text = item.title + ele.name
                newTextArray.push({
                  title: text,
                  campus: item.campus,
                  zoneId: item.zoneId,
                  buildingId: ele.buildingId
                })
              })
            })
          } else {
            textArray.forEach((item, itemIndex) => {
              buildingDefaultValue.forEach((ele, index) => {
                var text = item.title + ele
                newTextArray.push({
                  title: text,
                  campus: item.campus,
                  zoneId: item.zoneId,
                  buildingId: ele.buildingId
                })
              })
            })
          }
        }
        if (this.permissionSetting.roleAreas.length === 0) {
          this.permissionSetting.roleAreas = newTextArray
        } else {
          var flag = false
          for (var i in newTextArray) {
            for (var j in this.permissionSetting.roleAreas) {
              if (newTextArray[i].title === this.permissionSetting.roleAreas[j].title) {
                flag = true
                return this.$toast(newTextArray[i].title + '已存在')
              }
            }
          }
          if (!flag) {
            newTextArray.forEach((ele) => {
              this.permissionSetting.roleAreas.push(ele)
            })
          }
        }
      },
      removeArea: function (com) {
        this.permissionSetting.roleAreas.forEach((ele, i) => {
          if (com.title === ele.title) {
            this.permissionSetting.roleAreas.splice(i, 1)
          }
        })
      },
      _valueSelected: function (obj, type) {
        this.permissionSetting.defaultValue[type] = obj.value
        if (type === 'campusId') {
          this.permissionSetting.campusIds.splice(0, this.permissionSetting.campusIds.length)
          if (obj.value.length > 0) {
            this.permissionSetting.campusIds = obj.value.split(',')
          }
          this.permissionSetting.campusArray.forEach((ele, index) => {
            if (obj.value === ele.value) {
              this.permissionSetting.defaultValue.campus = ele.label
            }
          })
          this._getparkData()
        } else if (type === 'parkId') {
          this.permissionSetting.zoneIds.splice(0, this.permissionSetting.zoneIds.length)
          if (obj.value.length > 0) {
            this.permissionSetting.zoneIds = obj.value.split(',')
          }
          this.permissionSetting.parkArray.forEach((ele, index) => {
            if (obj.value === ele.zoneId) {
              this.permissionSetting.defaultValue.park = ele.name
            }
          })
          this._getBuildingData()
        } else {
          if (obj.value.length > 0) {
            var newArray = []
            newArray = obj.value.split(',')
            newArray = newArray.sort(this.sortNumber)
            this.permissionSetting.defaultValue.building = []
            for (var i in newArray) {
              for (var j in this.permissionSetting.buildingArray) {
                if (newArray[i] === this.permissionSetting.buildingArray[j].buildingId) {
                  var index = this.permissionSetting.defaultValue.building.indexOf(this.permissionSetting.buildingArray[j].name)
                  if (index < 0) {
                    this.permissionSetting.defaultValue.building.push(this.permissionSetting.buildingArray[j].name)
                  }
                }
              }
            }
          } else {
            this.permissionSetting.defaultValue.building = []
          }
        }
      },
       sortNumber: function (a, b) {
        return a - b
      },
      _refreshTable: function () {
        this.timeStamp = createTime()
      }
    }
  }
</script>
<style lang="less">
@import url("../../assets/common.less");
#premission {
  .modal-textarea-style {
    width: 220px;
    resize: none;
    padding: 5px;
    border: 1px solid #d9d9d9;
    border-radius: 3px;
    outline: none;
    background: #fff;
  }
  .modal-label {
    margin-right: 8px;
    text-align: right;
    width: 60px;
  }
  .modal-textarea-label {
    text-align: right;
    vertical-align: top;
    width: 60px;
    margin-right: 8px;
  }
  .edit-modal-body {
    .modal-container {
      padding: 15px 0 0 15px;
    }
    .form-group {
      padding-right: 15px;
    }
  }
  .edit-card {
    border-top: 1px solid #d9d9d9;
    padding: 15px 0 0 15px;
    .search-user {
      display: inline-block;
      vertical-align: bottom;
      input {
        border-radius: 3px;
        width: 220px;
        &:focus {
          border: 1px solid #ccc;
          box-shadow: none;
          outline: none;
        }
      }
    }
    .user-info {
      display: inline-block;
    }
    i {
      font-size: 20px;
      margin-left: 10px;
      cursor: pointer;
      vertical-align: bottom;
    }
  }
  .user-list {
    border-top: 1px solid #d9d9d9;
    max-height: 150px;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 16px 20px;
    transition: all 0.3s ease-out;
    .user-name {
      font-size: 14px;
      display: inline-block;
      margin-top: 3px;
    }
    .remove-icon {
      color: rgba(0, 0, 0, 0.4);
      cursor: pointer;
      margin-right: 16px;
    }
  }
  .setting-label {
    font-size: 16px;
    margin-bottom: 10px;
  }
  .permission-options {
    display: inline-block;
    margin-right: 20px;
    margin-bottom: 8px;
    i {
      font-size: 22px;
      color: #d9d9d9;
      transition: all 0.3s ease;
      cursor: pointer;
      &.check-box {
        color: #298df7;
      }
    }
    .icon-title {
      font-size: 14px;
      color: #333333;
      display: inline-block;
      margin-top: 2px;
      vertical-align: top;
    }
  }
  .area-select {
    border-top: 1px solid #d9d9d9;
    padding-top: 16px;
    .select-group {
      .form-group {
        display: inline-block;
        .form-select-style {
          width: 180px;
          margin-right: 16px;
          margin-left: 7px;
        }
      }
    }
    .add-btn {
      box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
      border-radius: 5px;
      font-size: 13px;
      padding: 7px 27px;
      background: #298df7;
      color: #ffffff;
    }
    .area-list {
      margin-left: 16px;
      max-height: 150px;
      overflow-x: hidden;
      overflow-y: auto;
      padding-right:22px;
      width: 86%;
      .remove-icon {
          color: rgba(0, 0, 0, 0.4);
          cursor: pointer;
        }
      div {
        margin-bottom: 5px;
        
      }
    }
  }
}
</style>
