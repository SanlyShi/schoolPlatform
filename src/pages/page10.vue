<template>
  <div>
    <v-table title="角色列表" :url="url" pagesize="10" idField="idNum" :columns="columns" :searchParams="definedSearch">
      <div slot="btn-group" class="btn-group pull-right" role="group">
          <button type="button" class="btn btn-success" @click="addModal()">新增</button>
      </div>
      <div slot="table-search">
          <div class="input-group pull-left col-md-3">
            <span class="input-group-addon" id="basic-addon2">角色名称</span>
            <input class="form-control" type="text" placeholder="输入角色名称" v-model="definedSearch.name" aria-describedby="basic-addon2">
          </div>
        </div>
    </v-table>
    <!-- 模态框（Modal） -->
    <v-modal :show="showAddModal" effect="fade" width="400">
      <div slot="modal-header" class="modal-header">
        <h4 class="modal-title">
          <b>{{modalType}}角色</b>
      </h4>
      </div>
      <div slot="modal-body" class="modal-body">
        <input type="hidden" id="roleId" v-model="newRole.id">
        <label>角色名</label><input id="roleName" v-model="newRole.name">
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn btn-default" @click="showAddModal = false">取消</button>
        <button type="button" class="btn btn-success" @click="changeRole">{{modalType}}</button>
      </div>
    </v-modal>
    <v-modal :show="showBindModal" effect="fade" width="400">
      <div slot="modal-header" class="modal-header">
        <h4 class="modal-title">
          <b>绑定资源</b>
      </h4>
      </div>
      <div slot="modal-body" class="modal-body">
        <input type="hidden" id="roleId" v-model="newRole.id">
        <label>角色名:{{newRole.name}}</label>
        <div>
          <v-tree id="resourceTree" ref="tree" title="资源列表" cascade="false" :url="treeUrl" :checkable="true" :search="true"></v-tree>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn btn-default" @click="showBindModal = false">取消</button>
        <button type="button" class="btn btn-success" @click="bindRolePermission">绑定</button>
      </div>
    </v-modal>
    <v-modal :show="showBindUserGroupModal" effect="fade" width="400">
      <div slot="modal-header" class="modal-header">
        <h4 class="modal-title">
          <b>绑定用户组</b>
      </h4>
      </div>
      <div slot="modal-body" class="modal-body">
        <input type="hidden" id="roleId" v-model="newRole.id">
        <label>角色名:{{newRole.name}}</label>
        <div>
          <v-tree id="resourceTree" ref="tree2" title="资源列表" cascade="false" :url="treeUrl" :checkable="true" :search="true"></v-tree>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn btn-default" @click="showBindUserGroupModal = false">取消</button>
        <button type="button" class="btn btn-success" @click="bindRoleUserGroup">绑定</button>
      </div>
    </v-modal>
  </div>
</template>

<script>
import Vue from "vue";
import $ from "jquery";
import VTree from "../components/VTree.vue";
import VTable from "../components/VTable.vue";
import VModal from "../components/VModal.vue";
Vue.component("v-modal", VModal);
Vue.component("v-tree", VTree);
Vue.component("V-table", VTable);

export default {
  components: {
    VTable
  },
  data() {
    var that = this;
    return {
      columns: [
        {
          id: "id",
          title: "id",
          width: 200,
          className: "",
          hidden: false
        },
        {
          id: "name",
          title: "角色名",
          className: "style",
          hidden: false
        },
        {
          id: "opt",
          title: "操作",
          className: "",
          hidden: false,
          formatter: function() {
            return [
              {
                tag: "button",
                text: "修改",
                className:"btn-primary",
                callback: function(record, index) {
                  that.role=record
                  that.newRole.id = record.id
                  that.newRole.name = record.name
                  that.modalType = '修改'
                  that.showAddModal = true
                }
              },{
                tag: "button",
                text: "删除",
                className:"btn-danger",
                callback: function(record, index) {
                  $.ajax({
                    url: "/service/permission/roles/" + record.id,
                    dataType: "json",
                    type: 'post',
                    success:function(data){
                      if(confirm('确认删除？')){
                        if(data.code == "200"){
                          that.url = "/table-data/permission/roles?timestamp=" + new Date().getTime()
                          alert('删除成功')
                        }else{
                          alert('删除失败')
                        }
                      }
                    }
                  })
                }
              },{
                tag: "button",
                text: "绑定权限",
                className:"btn-success",
                callback: function(record, index) {
                  that.newRole.id = record.id
                  that.newRole.name = record.name
                  that.treeUrl = "/tree-data/permission/roles/" + record.id + "/permissions"
                  that.showBindModal = true
                }
              },{
                tag: "button",
                text: "绑定用户组",
                className:"btn-info",
                callback: function(record, index) {
                  that.treeUrl = "/tree-data/permission/roles/" + record.id + "/user-groups"
                  that.newRole.id = record.id
                  that.newRole.name = record.name
                  that.showBindUserGroupModal = true
                }
              }
            ]
          }
        }
      ],
      url: "/table-data/permission/roles",
      showEditModal: false,
      showAddModal:false,
      showBindModal:false,
      role: {},
      newRole:{},
      definedSearch:{},
      treeItems:[],
      modalType:"",
      treeUrl:"",
      showBindUserGroupModal:false
    };
  },
  methods: {
    editRole:function(){
      console.log(this.role)
      var that = this
      $.ajax({
        url: "/service/permission/roles/" + this.newRole.id,
        dataType: "json",
        data:{
          name: this.newRole.name
        },
        type:"patch",
        success: function(data) {
          console.log(data);
          if(data.code == "200"){
            that.role.id = that.newRole.id
            that.role.name = that.newRole.name
            alert('修改成功')
            that.showAddModal = false
          }else{
            alert(data.message)
          }
          
        }
      })
    },
    addModal:function(){
      this.newRole = {}
      this.modalType = '新增'
      this.showAddModal = true
    },
    addRole:function(){
      var that = this
      $.ajax({
        url: "/service/permission/roles",
        dataType: "json",
        data:{
          name: this.newRole.name
        },
        type:"post",
        success: function(data) {
          console.log(data);
          if(data.code == "200"){
            that.url = "/table-data/permission/roles?timestamp=" + new Date().getTime()
            alert('新增成功')
            var checked = that.getChecked()
            console.log(checked)
            that.showAddModal = false
          }else{
            alert(data.message)
          }
        }
      })
    },
    changeRole:function(){
      if(this.modalType == '新增'){
        this.addRole()
      }else if(this.modalType == '修改'){
        this.editRole()
      }
    },
    bindRolePermission:function(){
      var checked = this.$refs.tree.getChecked()
      var bindIds = []
      checked.forEach(function(d){
        bindIds.push(d.id)
      })
      var that = this
      $.ajax({
        url:`/service/permission/roles/${that.newRole.id}/permissions`,
        data:{
          permissions:bindIds
        },
        dataType:"json",
        type:"POST",
        success:function(data){
          console.log(data)
          if(data.code == "200"){
            alert("绑定成功")
            that.showBindModal = false
          }else{
            alert("绑定失败")
          }
        }
      })
    },
    bindRoleUserGroup:function(){
      var checked = this.$refs.tree2.getChecked()
      var bindIds = []
      checked.forEach(function(d){
        bindIds.push(d.id)
      })
      var that = this
      $.ajax({
        url:`/service/permission/roles/${that.newRole.id}/user-groups`,
        data:{
          user_groups:bindIds
        },
        dataType:"json",
        type:"POST",
        success:function(data){
          console.log(data)
          if(data.code == "200"){
            alert("绑定成功")
            that.showBindUserGroupModal = false
          }else{
            alert("绑定失败")
          }
        }
      })
    },
    getChecked:function(){
       var checked = this.$refs.tree.getChecked()
       return checked
    }
  }
}
</script>
<style>
</style>
