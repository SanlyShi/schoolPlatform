<template>
  <div class="enroll">
    <v-table v-show="!userStatus" :url="powerSettingUrl+timestamp" pagesize="10" idField="id" :columns="powerSetColumns" :columnsControl="true" :order="true" :search="false">
      <div slot="btn-group" class="btn-group pull-right" role="group">
        <button type="button" class="btn batch-add-btn btn-bgColor-style clearBtnBorder" @click="editPower()">新增组别</button>
        <button type="button" class="btn batch-add-btn btn-bgColor-style clearBtnBorder" @click="changePanel(true)">切换到用户维度</button>
      </div>
    </v-table>
    <v-table v-show="userStatus" :url="userUrl+timestamp" pagesize="10" idField="id" :columns="userColumns" :columnsControl="true" :order="true" :search="false">
      <div slot="btn-group" class="btn-group pull-right" role="group">
        <button type="button" class="btn batch-add-btn btn-bgColor-style clearBtnBorder" @click="changePanel(false)">切换到组别</button>
      </div>
    </v-table>
    <v-modal :show="showAddModalStatus" effect="fade" width="400">
      <div slot="modal-header" class="modal-header">
        <h5 v-if="!isEdit" class="modal-title">新增组别</h5>
        <h5 v-else class="modal-title">编辑组别</h5>
      </div>
      <div slot="modal-body" class="modal-body setParty form-wrap" style="overflow: inherit;">
        <div class="form-group box_flex align_center">
          <label class="partyName label" style="margin-right:5px;">组别名称</label>
          <input type="text" class="form-control search-input organization-input" v-model="addParams['name']">
        </div>
        <div class="form-group box_flex ">
          <label class="partyName label" style="margin-right:5px;">组别说明</label>
          <v-textarea v-model="addParams['remark']" class="info_value" style="overflow:hidden;height:60px;width:200px;" :autoHeight="true" :rows="3" :maxLength="200"></v-textarea>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showAddModalStatus = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="submitAdd()">确定</button>
      </div>
    </v-modal>
    <v-modal :show="showSetModalStatus" effect="fade" width="520">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">配置</h5>
      </div>
      <div slot="modal-body" class="modal-body setParty form-wrap" style="overflow: inherit;">
        <h5 class="modal-title">权限配置</h5>
        <div class="box_flex flex_wrap">
          <div v-for="(item,index) in powerSelectList" class="power_child" :key="index">
            <v-checkbox v-model="item.checked" :name="item.name"></v-checkbox>
          </div>
        </div>
        <h5 class="modal-title" style="border-top:1px solid #ddd;width:100%;padding:10px 0">权限配置</h5>
        <div class="form-group box_flex align_center">
          <label class="partyName label" style="margin-right:5px;width:auto">生源地</label>
          <!-- <Vaddress v-model="myAddress" noArea="true" :width="110"></Vaddress> -->
          <newAddress :value="myAddress" @onChange="changeAddress" :width="180" noArea="true"></newAddress>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showSetModalStatus = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="submitSet()">确定</button>
      </div>
    </v-modal>
    <v-modal :show="showUserModalStatus" effect="fade" width="520">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">配置</h5>
      </div>
      <div slot="modal-body" class="modal-body setParty form-wrap user-modal-body" style="overflow: inherit;">
        <v-table :rows="userTableOptions" style="width:100%;height:343px;" :paginationShow="false" idField="id" :columns="userSetColumns">
        </v-table>
        <div class="form-group box_flex align_center" style="margin-top:20px">
          <label class="partyName label" style="margin-right:5px;width:auto">用户检索</label>
          <detect url='api/archives/check/searchResults' @afterSelected="afterSelected"></detect>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showUserModalStatus = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="submitSetUser()">确定</button>
      </div>
    </v-modal>
  </div>
</template>
<script>
import { sAjax, request, translation } from "../../assets/utils/utils.js";
import newAddress from "../../components/NewAddress"
import checkbox from "../../components/VCheckbox"
export default {
  data() {
    let that = this
    return {
      testObj: { a: 1, b: 2 },
      showSign: false,
      showImgDetailStatus: false,
      deleteImgWidth: 1,
      imgDetailSrc: '',
      myAddress: '',
      powerSettingUrl: `/table-data/archives/permissions/getRoleList`,
      powerSetColumns: [],
      userUrl: '/table-data/archives/permissions/getRoleListByUser',
      userColumns: [],
      showDetailStatus: false,
      imgList: [],
      timestamp: "?timestamp=",
      enrollUserNo: "",
      enrollAddList: [],
      lang: "zh-cn",
      checkRows: [],
      powerSelectList: [],//权限下拉框列表
      isEdit: true,
      showAddModalStatus: false,
      showSetModalStatus: false,
      showUserModalStatus: false,
      userRecord: {},
      editMenuId: '',
      editMenuName: '',
      editAddressValues: '',
      userTableOptions: [],
      userStatus: false,
      addParams: { name: '', remark: '' },
      userSetColumns: [
        {
          title: "姓名",
          id: "roleName",
          className: "text-left",
          width: 100,
          formatter: function (record) {
            return record.user.name
          }
        },
        {
          title: "角色",
          id: "rolePosition",
          className: "text-left",
          width: 100,
          formatter: function (record) {
            return record.position === 'MEMBER' ? '成员' : '负责人'
          }
        },
        {
          id: "opt",
          title: "操作",
          className: "text-center",
          width: "260px",
          hidden: false,
          formatter: function (obj) {
            if (obj.position === 'MEMBER') {
              return [
                {
                  tag: "a",
                  text: '设置负责人',
                  className: "opt-btn",
                  callback: function (record, index) {
                    that.setCharge(index, 'HEADER');
                  }
                },
                {
                  tag: "a",
                  text: '删除',
                  className: "opt-btn",
                  callback: function (record, index) {
                    that.deleteUser(index);
                  }
                }
              ];
            } else {
              return [
                {
                  tag: "a",
                  text: '取消负责人',
                  className: "opt-btn",
                  callback: function (record, index) {
                    that.setCharge(index, 'MEMBER');
                  }
                }, {
                  tag: "a",
                  text: '删除',
                  className: "opt-btn",
                  callback: function (record, index) {
                    that.deleteUser(index);
                  }
                }
              ];
            }
          }
        }
      ]
    };
  },
  components: {  
      newAddress,
    'v-checkbox': checkbox
    },
  props: {
    selectItem: {
      default: () => { }
    },
    orgM: {
      default: false
    }
  },
  created() {
    var la = localStorage.getItem("lang");

    if (translation(la)) {
      this.lang = la;
    }
    this.initTable()
    this.initUserTable()
    this.getPowerList()
  },
  methods: {
    deleteUser(i) {
      this.userTableOptions.splice(i, 1)
    },
    initTable() {
      var that = this;
      this.powerSetColumns = [
        {          title: "组别名称", id: "roleName", className: "text-left", width: 100, search: { type: "input", data: { placeholder: "" } }, hidden: false,
          formatter: function (record) {
            return record.name
          }        },
        { title: "组别说明", id: "remark", className: "text-left", width: 200, hidden: false },
        {          title: "用户", id: "user", className: "text-left", width: 100, hidden: false, formatter: function (record) {
            let str = ''
            if (record.roleUsers) {
              record.roleUsers.forEach((o, index) => {
                if (o.user) {
                  str += o.user.name + '、'
                }
              })
              str = str.substring(0, str.length - 1)
            }
            return str
          }        },
        {
          id: "opt",
          title: "操作",
          className: "text-center",
          width: "260px",
          hidden: false,
          formatter: function (obj) {
            return [
              {
                tag: "a",
                text: '编辑',
                className: "opt-btn",
                callback: function (record, index) {
                  that.editPower(record);
                }
              },
              {
                tag: "a",
                text: '配置',
                className: "opt-btn",
                callback: function (record, index) {
                  that.setPower(record);
                }
              },
              {
                tag: "a",
                text: '用户',
                className: "opt-btn",
                callback: function (record, index) {
                  that.setUser(record);
                }
              },
              {
                tag: "a",
                text: '删除',
                className: "opt-btn",
                callback: function (record, index) {
                  that.deletePower(record);
                }
              },
            ];
          }
        }
      ]
    },
    submitSetUser() {//保存用户编辑
      let url = `api/archives/permissions/${this.userRecord.id}/updateRoleMember`
      let hasHeader = false
      let roleUsers = this.userTableOptions.map(o => {
        if (o.position === 'HEADER') {
          hasHeader = true
        }
        return {
          roleId: this.userRecord.id,
          name: o.user.name,
          userId: o.user.userId,
          position: o.position
        }
      })
      if (!hasHeader) {
        this.$toast('请设置负责人!')
        return
      }
      let params = {
        roleUsers: roleUsers,
        name: this.userRecord.name,
        remark: this.userRecord.remark,
      }
      request(url, params, 'post').then(o => {
        if (o.state) {
          this.$toast('操作成功!')
          this.showUserModalStatus = false
          this.timestamp = "?timestamp=" + new Date().getTime();
        }
      })
    },
    setCharge(index, type) {//设置或者取消负责人
      this.userTableOptions[index].position = type
    },
    afterSelected(obj) {
      console.log('obj', obj)
      let name = obj.name
      let alreadyHad = false
      this.userTableOptions.forEach(o => {
        if (o.user.name === name) {
          alreadyHad = true
        }
      })
      if (alreadyHad) {
        return;
      }
      this.userTableOptions.push({
        user: {
          name: name,
          userId: obj.userId
        },
        position: 'MEMBER'
      })
    },
    changeAddress(val) {
      this.editAddressValues = val
    },
    getPowerList() {//获取权限配置列表 
      let url = 'api/archives/permissions/getMenuList'
      request(url).then(o => {
        if (o.state) {
          this.powerSelectList = o.data.map(a => {
            a.checked = false
            return a;
          })
        }
      })
    },
    changePanel(bool) {//切换用户维度 
      this.userStatus = bool
    },
    initUserTable() {
      this.userColumns = [{
        title: "工号", id: "userNo", className: "text-left", width: 150, search: { type: "input", data: { placeholder: "" } }, hidden: false,
      }, {
        title: "姓名", id: "name", className: "text-left", width: 150, search: { type: "input", data: { placeholder: "" } }, hidden: false,
      }, {
        title: "组别", id: "roleName", className: "text-left", width: 270, search: { type: "input", data: { placeholder: "" } }, hidden: false,
        formatter: function (record) {
          let str1 = ''
          if (record.dutiesWithRoleVO) {
            record.dutiesWithRoleVO.forEach(o => {
              str1 += o.name + ','
            })
            str1 = str1.substring(0, str1.length - 1)
          }
          return str1
        }
      }, {
        title: "角色", id: "position", className: "text-left", width: 150, search: { type: "input", data: { placeholder: "" } }, hidden: false,
        formatter: function (record) {
          let str2 = ''
          if (record.dutiesWithRoleVO) {
            record.dutiesWithRoleVO.forEach(o => {
              if (o.position == 'MEMBER') {
                str2 += '成员' + ','
              } else {
                str2 += '负责人' + ','
              }
            })
            str2 = str2.substring(0, str2.length - 1)
          }
          return str2
        }
      }]
    },
    getMenuList(id) {//获取选中权限配置列表 
      this.powerSelectList = this.powerSelectList.map(a => {
        a.checked = false
        return a;
      })
      let url = `api/archives/permissions/${id}/getMenuProvince`
      request(url).then(o => {
        if (o.state) {
          o.data.roleMenu.forEach(a => {
            this.checkedPowerSelect(a.menuId)
          })
          if (o.data.roleProvince) {
            this.myAddress = o.data.roleProvince.province ? o.data.roleProvince.province : ''
            this.myAddress += o.data.roleProvince.provinceSecond ? ',' + o.data.roleProvince.provinceSecond : ''
            this.editAddressValues = o.data.roleProvince.provinceCode ? o.data.roleProvince.provinceCode : ''
            this.editAddressValues += o.data.roleProvince.provinceSecondCode ? ',' + o.data.roleProvince.provinceSecondCode : ''
          } else {
            this.myAddress = ''
            this.editAddressValues = ''
          }
        }
      })
    },
    checkedPowerSelect(id) {
      this.powerSelectList.forEach(o => {
        if (o.id === id) {
          o.checked = true
        }
      })
    },
    editPower(record) { //新增编辑组别
      if (record) {
        this.isEdit = true
        this.addParams = {
          name: record.name,
          remark: record.remark,
          id: record.id
        }
      } else {
        this.isEdit = false
      }
      this.showAddModalStatus = true
    },
    submitAdd() {
      let url = 'api/archives/permissions/insertGroup'
      let type = 'post'
      if (this.isEdit) {
        url = `api/archives/permissions/${this.addParams.id}/updateRole`
        type = 'post'
      }
      request(url, this.addParams, type).then(o => {
        if (o.state) {
          this.$toast('操作成功!')
          this.showAddModalStatus = false
          this.timestamp = "?timestamp=" + new Date().getTime();
        } else {
          this.$toast(o.message)
        }
      })
    },
    submitSet() {
      let url = `api/archives/permissions/${this.editMenuId}/updateMenuProvince`
      let roleMenu = this.powerSelectList.filter(o => {
        return o.checked
      }).map(o => {
        return { menuId: o.id, roleId: this.editMenuId }
      })
      this.roleProvince.province = this.editAddressValues.split(',')[0]
      this.roleProvince.provinceSecond = this.editAddressValues.split(',')[1] ? this.editAddressValues.split(',')[1] : ''
      let params = {
        roleMenu: roleMenu,
        roleProvince: this.roleProvince,
        name: this.editMenuName
      }
      request(url, params, 'post').then(o => {
        if (o.state) {
          if (o.state) {
            this.$toast('操作成功!')
            this.showSetModalStatus = false
            this.timestamp = "?timestamp=" + new Date().getTime();
          }
        }
      })
    },
    setPower(record) {
      this.showSetModalStatus = true
      this.editMenuId = record.id
      this.editMenuName = record.name
      this.roleProvince = record.roleProvince ? record.roleProvince : { province: '', roleId: record.id, provinceSecond: '' }
      this.getMenuList(record.id)
    },
    setUser(record) {
      this.userTableOptions = record.roleUsers
      this.userRecord = record
      this.showUserModalStatus = true
    },
    deletePower(record) {
      if (confirm('是否确定删除组别?')) {
        let url = `api/archives/permissions/${record.id}/deleteRole`
        request(url, {}, 'post').then(o => {
          if (o.state) {
            this.$toast('操作成功!')
            this.timestamp = "?timestamp=" + new Date().getTime();
          }
        })
      }
    },
  },
  computed: {
    translate: function () {
      return translation(this.lang).enrollManage;
    }
  }
};
</script>
<style lang="less" scoped>
.sign_wrap {
  width: 100%;
  height: 164px;
  position: relative;
}
.detail_wrap {
  width: 100%;
  min-height: 500px;
  background-color: white;
  .back {
    cursor: pointer;
  }
}
.img-div {
  background-color: #eee;
  background-position: center;
  background-size: contain;
  text-align: center;
  margin-top: 6px;
  width: 220px;
  min-height: 130px;
  border-radius: 5px;
  margin-left: 50px;
  border: 1px solid #d8d9da;
  .add {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #298df7;
    color: white;
    font-size: 24px;
    position: relative;
    line-height: 40px;
    top: 30px;
  }
  .img {
    position: relative;
    width: 163px;
    margin: 0 auto;
    text-align: center;
    &.mobile-img {
      height: 160px;
      i {
        top: 43%;
      }
    }
    i {
      top: 45%;
      cursor: pointer;
    }
    img {
      position: absolute;
      display: none;
      top: 0;
      left: 0;
      width: 100%;
      // height: 100%;
      // z-index: 11;
    }
    input[type="file"] {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      // z-index: 12;
      opacity: 0;
      cursor: pointer;
    }
    div.close-img {
      position: absolute;
      top: -12px;
      right: -12px;
      // z-index: 13;
      width: 24px;
      height: 24px;
      cursor: default;
      // transform: scale(0);
      transition: all 0.1s ease-out;
      i {
        top: 0;
        color: rgba(0, 0, 0, 1);
        cursor: pointer;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.12),
          0 8px 8px 0 rgba(0, 0, 0, 0.12);
        border-radius: 100px;
      }
    }
    &.active {
      // &:hover {
      //   div.close-img {
      //     // transform: scale(1);
      //   }
      // }
      img {
        display: block;
      }
    }
  }
}
.img_wrap {
  min-height: 240px;
  width: 100%;
  .img_child {
    width: 220px;
  }
}
.form-wrap {
  width: 100%;
  flex-wrap: wrap;
  .form-group {
    margin-right: 20px;
    .label {
      width: 110px;
      font-size: 14px;
      color: #666;
      text-align: right;
      padding-left: 12px;
      padding-right: 12px;
    }
    .v-select,
    .form-control,
    .v-datepicker,
    .v-textarea,
    .ditection {
      width: 200px;
    }
    .v-textarea {
      border-radius: 5px;
      padding: 5px;
      color: #666;
      font-family: inherit;
    }
  }
}
.power_child {
  padding: 5px;
  input[type="checkbox"] {
    margin: 0 5px;
  }
}
</style>
<style lang="less">
.img_modal {
  .modal-content {
    border: none;
    box-shadow: none;
    background: none;
  }
}
.user-modal-body {
  .table-header {
    display: none;
  }
}
</style>
