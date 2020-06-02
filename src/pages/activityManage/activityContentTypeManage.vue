<template>
  <div id="activity-content-type-manage">
    <div class="">
      <div class="container-fluid activity-content-type-fluid">
        <div class="row">
          <div class="content-type-header">
            <div class="col-md-4">
              <div class="select-title">{{translate.type}}{{translate.select}}</div>
              <div class="content-type-select">
                <v-select :value="typeId" :options="typeData"  optionsLabel="typeName" optionsValue="id"  :search="false" @afterSelected="_selectType"></v-select>
              </div>
            </div>
            <div class="col-md-2 col-md-offset-6">
              <button type="button" class="btn add-content-type btn-bgColor-style" @click="_showAddModal"><i class="maticon pull-left" v-html="icons('add')">add</i>{{translate.add}}{{translate.type}}</button>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="content-type-content" :style="'max-height:' + scrollHeight + 'px'">
            <div class="content-type-card" v-for="(item, index) in contentTypeData" :key="index">
              <div class="col-md-3">
                <div class="type-title">
                  <div class="info-container" v-if="!item.isEdit">
                    <span>{{item.typeName}}</span>
                    <span class="type-disable" v-if="item.status === 0">不可用</span>
                    <span class="typeName-opt">
                      <i class="maticon type-opt-icon" title="编辑" v-html="icons('edit')" @click="_editName(item.id, 'type')">edit</i>
                      <i class="maticon type-opt-icon" title="启用" v-html="icons('panorama_fish_eye')"  @click="_changeStatus(item)" v-if="item.status === false">panorama_fish_eye</i>
                      <i class="maticon type-opt-icon" title="禁用" v-html="icons('not_interested')" @click="_changeStatus(item)" v-else>not_interested</i>
                    </span>
                  </div>
                  <div class="edit-container" v-else>
                     <input class="form-control search-input edit-name-input" maxlength="15" type="text" v-model="item.typeName" v-focus  @blur="_inputBlur(item.id, 'type')">
                     <i class="maticon project-confirm" v-html="icons('done')" @click="_setTypeName(item.typeName,item.id)">done</i>
                   </div>
                </div>
              </div>
              <div class="col-md-7">
                <div :class="item.isVerticalLayout ? '':'display-block'" v-for="(col, i) in item.childType" :key="i">
                  <div class="type-badge">
                    <div class="info-container" :title="col.isEdit" v-if="!col.isEdit">
                      <span class="project-title" :class="col.status === 0 ? 'disable' : ''">{{col.typeName}}</span>
                      <span class="project-opt">
                        <i class="maticon project-opt-icon" title="编辑" v-html="icons('edit')" @click="_editName(item.id, 'childType', col.id)">edit</i>
                        <i class="maticon project-opt-icon" title="启用" v-html="icons('panorama_fish_eye')"  @click="_changeStatus(col)" v-if="col.status === false">panorama_fish_eye</i>
                        <i class="maticon project-opt-icon" title="禁用" v-html="icons('not_interested')" @click="_changeStatus(col)" v-else>not_interested</i>
                      </span>
                    </div>
                    <div class="edit-container name-edit-container" :title="col.isEdit" v-else>
                      <input class="form-control search-input edit-name-input" maxlength="15" type="text" v-model="col.typeName" v-focus @blur="_inputBlur(item.id, 'childType', col.id)">
                      <i class="maticon project-confirm" v-html="icons('done')" @click="_setChildTypeName(item.id, col)">done</i>
                    </div>
                  </div>
                </div>
                <div :class="item.isVerticalLayout ? '':'display-block'">
                  <div class="type-badge add-type-badge">
                    <i class="maticon add-child-type-icon" v-if="!item.creatChildTypeIsEdit" v-html="icons('add')"  @click="_editName(item.id, 'creat')">add</i>
                    <div class="edit-container" v-else>
                      <input class="form-control search-input edit-name-input" maxlength="15" type="text" v-model="newChildTypeName" v-focus @blur="_inputBlur(item.id, 'creat')">
                      <i class="maticon project-confirm" v-html="icons('done')" @click.stop="_setCreatChildTypeName(newChildTypeName,item.id)">done</i>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-2">
                <i class="maticon pull-right" v-html="icons('swap_horiz')" title="切换视图" @click="_switchView(item.id, item.isVerticalLayout)">swap_horiz</i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <v-modal :show="showAddModal" effect="fade" width="560" class="content-type-modal">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          {{translate.add}}{{translate.type}}
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="form-group">
          <label class="input-label" >{{translate.type}}{{translate.name}}</label>
          <input  type="text" :placeholder="translate.typeNamePlaceholder" maxlength="15" class="form-control search-input childType-name-input" v-model="typeName" @change="_changeTypeName">
          <p class="error-message">{{errorMessage.type}}</p>
        </div>
        <div class="form-group">
          <label class="input-label" >&nbsp;&nbsp;&nbsp;&nbsp;{{translate.child}}{{translate.type}}</label>
          <input  type="text" :placeholder="translate.childTypePlaceholder" maxlength="15" class="form-control search-input childType-name-input" v-model="childTypeName">
          <button type="button" class="btn  check-btn clearBtnBorder" @click="_addChildTypeName">{{translate.add}}</button>
          <p class="error-message">{{errorMessage.childType}}</p>
        </div>
        <div class="child-Type-list" v-show="childTypeData.length > 0">
          <p v-for="(item, i) in childTypeData" :key="i">
            <span class="child-type-name">{{item}}</span> <i class="maticon pull-right remove-icon" v-html="icons('cancel')" @click="_removeChildTypeName(item)">cancel</i>
          </p>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showAddModal = false">{{translate.cancel}}</button>
        <button type="button" class="btn submit-btn clearBtnBorder"  @click="_addType">{{translate.confirm}}</button>
      </div>
    </v-modal>
  </div>
</template>

<script>
  import Vue from 'vue'
  import $ from 'jquery'
  import { sAjax, translation } from '../../assets/utils/utils.js'
  export default {
    inject: {
      windowObj: {
        default: null
      }
    },
    props: {

    },
    created: function () {
      var la = localStorage.getItem('lang')
      var that = this
      if (translation(la)) {
        this.lang = la
      }
      sAjax({
        url: '/api/sc/activityContentType/selectOptions',
        dataType: 'json',
        type: 'get',
        success: function (result) {
          if (result.state) {
            if (result.data.length > 0) {
              that.typeData = result.data
              that.typeId = result.data[0].id
            }
          } else {
            that.$toast(result.message)
          }
        }
      })
      this._getContentTypeData()
    },
    data: function () {
      return {
        typeData: [],
        typeId: 0,
        showAddModal: false,
        errorMessage: {
          type: '',
          childType: ''
        },
        contentTypeData: [],
        childTypeData: [],
        typeName: '',
        childTypeName: '',
        newChildTypeName: '',
        scrollHeight: null,
        lang: 'zh-cn'
      }
    },
    computed: {
      translate: function () {
        return translation(this.lang).activityContentTypeManage
      }
    },
    watch: {

    },
    mounted: function () {
      var that = this
      var timer = null
    },
    methods: {
      _showAddModal: function () {
        this.showAddModal = true
        this.typeName = ''
        this.childTypeName = ''
        this.errorMessage = {
          type: '',
          childType: '',
        }
        this.childTypeData = []
      },
      _getContentTypeData: function () {
        var that = this
        sAjax({
          url: '/api/sc/activityContentType/manage/getContentTypes',
          dataType: 'json',
          type: 'get',
          data: {
            typeId: this.typeId
          },
          success: function (data) {
            if (data.state) {
              that.contentTypeData = data.data
              that.contentTypeData.forEach((ele) => {
                Vue.set(ele, 'isEdit', false)
                Vue.set(ele, 'creatChildTypeIsEdit', false)
                Vue.set(ele, 'isVerticalLayout', false)
                ele.childType.forEach((ele) => {
                  Vue.set(ele, 'isEdit', false)
                })
              })
              var pageContentHeight = $("#activity-content-type-manage").height().toFixed(1)
              that.scrollHeight = pageContentHeight - $(".content-type-header").height().toFixed(1)
            } else {
              that.$toast(data.message)
            }
          }
        })
      },
      _selectType: function (obj) {
        this.typeId = obj.value
        this._getContentTypeData()
      },
      _editName: function (typeId, type, childTypeId) {
        if (type === 'type') {
          this.contentTypeData.forEach((ele) => {
            if (ele.id === typeId) {
              ele.isEdit = true
            }
          })
        } else if (type === 'childType') {
          this.contentTypeData.forEach((ele) => {
            if (ele.id === typeId) {
              ele.childType.forEach((item) => {
                if (item.id === childTypeId) {
                  item.isEdit = true
                }
              })
            }
          })
        } else {
          this.contentTypeData.forEach((ele) => {
            if (ele.id === typeId) {
              ele.creatChildTypeIsEdit = true
            }
          })
        }
      },
      _inputBlur: function (typeId, type, childTypeId) {
        setTimeout(() => {
          if (type === 'type') {
            this.contentTypeData.forEach((ele) => {
              if (ele.id === typeId) {
                ele.isEdit = false
              }
            })
          } else if (type === 'childType') {
            this.contentTypeData.forEach((ele) => {
              if (ele.id === typeId) {
                ele.childType.forEach((item) => {
                  if (item.id === childTypeId) {
                    item.isEdit = false
                  }
                })
              }
            })
          } else {
            this.contentTypeData.forEach((ele) => {
              if (ele.id === typeId) {
                ele.creatChildTypeIsEdit = false
              }
            })
          }
        }, 300)
      },
      _setCreatChildTypeName: function (name, id) {
        var that = this
        sAjax({
          url: '/api/sc/activityContentType/addChildContentType',
          dataType: 'json',
          type: 'post',
          data: {
            typeName: name,
            parentId: id
          },
          success: function (data) {
            if (data.state) {
              that.contentTypeData.forEach((ele) => {
                if (ele.id === id) {
                  ele.creatChildTypeIsEdit = false
                }
              })
              that._getContentTypeData()
            } else {
              that.$toast(data.message)
            }
          }
        })
      },
      _setTypeName: function (name, typeId) {
        this._saveEditName(name, typeId)
        this.contentTypeData.forEach((ele) => {
          if (ele.id === typeId) {
            ele.isEdit = false
          }
        })
      },
      _setChildTypeName: function (typeId, childType) {
        this._saveEditName(childType.typeName, childType.id)
        this.contentTypeData.forEach((ele) => {
          if (ele.id === typeId) {
            ele.childType.forEach((item) => {
              if (item.id === childType.id) {
                item.isEdit = false
              }
            })
          }
        })
      },
      _saveEditName: function (name, id) {
        var that = this
        sAjax({
          url: '/api/sc/activityContentType/editContentType/' + id,
          dataType: 'json',
          type: 'post',
          data: {
            typeName: name
          },
          success: function (data) {
            if (data.state) {
              that._getContentTypeData()
            } else {
              that.$toast(data.message)
            }
          }
        })
      },
      _changeStatus: function (item) {
        var that = this
        var typeStatus = item.status ? 0 : 1
        sAjax({
          url: '/api/sc/activityContentType/forbiddenContentType/' + item.id + '/' + typeStatus,
          dataType: 'json',
          type: 'post',
          success: function (data) {
            if (data.state) {
              item.status = item.status ? false : true
            } else {
              that.$toast(data.message)
            }
          }
        })
      },
      _addChildTypeName: function () {
        if (!this.childTypeName) {
          this.errorMessage.childType = '子类别不能为空'
          return false
        }
        this.errorMessage.childType = ''
        this.childTypeData.push(this.childTypeName)
        this.childTypeName = ''
      },
      _removeChildTypeName: function (name) {
        var index = this.childTypeData.indexOf(name)
        if (index >= 0) {
          this.childTypeData.splice(index, 1)
        }
      },
      _changeTypeName: function () {
        this.errorMessage.type = ''
      },
      _addType: function () {
        var that = this
        if (!this.typeName) {
          this.errorMessage.type = '类别名称不能为空'
          return
        }
        if (this.childTypeData.length === 0) {
          this.errorMessage.childType = '请至少添加一个子类型'
          return
        }
        sAjax({
          url: '/api/sc/activityContentType/addParentContentType',
          dataType: 'json',
          type: 'post',
          data: {
            typeName: this.typeName,
            childTypeNames: this.childTypeData
          },
          success: function (data) {
            if (data.state) {
              that._getContentTypeData()
              that.showAddModal = false
            } else {
              that.$toast(data.message)
            }
          }
        })
      },
      _switchView: function (typeId, isVerticalLayout) {
        this.contentTypeData.forEach((ele) => {
          if (ele.id === typeId) {
            if (isVerticalLayout) {
              ele.isVerticalLayout = false
            } else {
              ele.isVerticalLayout = true
            }
          }
        })
      }
    },
    watch: {
      windowObj: {
        deep: true,
        handler: function (val) {
          var pageContentHeight = $("#activity-content-type-manage").height().toFixed(1)
          this.scrollHeight = pageContentHeight - $(".content-type-header").height().toFixed(1)
        }
      }
    }
  }
</script>
<style lang="less">
@import url("../../assets/common.less");

#activity-content-type-manage {
  height: 100%;
  margin: 0 auto;
  overflow: hidden;
  .display-none {
    display: none;
  }
  .display-block {
    display: inline-block;
  }
  .activity-content-type-fluid {
    background: #f8f8f8;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
    border-radius: 4px;
  }
  .content-type-header {
    height: 90px;
    width: 100%;
    background: #ffffff;
    border-bottom: 1px solid #e0e0e0;
    .select-title {
      margin-top: 21px;
      margin-left: 5px;
      font-size: 13px;
      color: rgba(0, 0, 0, 0.4);
    }
    .content-type-select {
      .btn-group .form-control.dropdown-toggle {
        border: none;
        box-shadow: none;
        font-size: 14px;
      }
    }
    .add-content-type {
      font-size: 13px;
      color: #ffffff;
      line-height: 18px;
      background: #298df7;
      box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
      font-weight: 500;
      border-radius: 4px;
      margin-top: 24px;
      i {
        font-size: 18px;
        color: #ffffff;
        margin-right: 8px;
        margin-top: -1px;
      }
    }
  }
  .content-type-content {
    padding: 10px 24px;
    overflow: auto;
    .content-type-card {
      background: #ffffff;
      box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
      border-radius: 4px;
      display: inline-block;
      width: 100%;
      padding: 24px 24px;
      .type-title {
        font-size: 16px;
        color: rgba(0, 0, 0, 0.87);
        margin-top: -4px;
        -webkit-transition: all 0.2s;
        -moz-transition: all 0.2s;
        -ms-transition: all 0.2s;
        -o-transition: all 0.2s;
        transition: all 0.2s;
        .typeName-opt {
          display: none;
          .type-opt-icon {
            font-size: 16px;
            margin-left: 5px;
            color: rgba(0, 0, 0, 0.54);
            font-weight: bold;
            cursor: pointer;
            &:hover {
              color: rgba(0, 0, 0, 0.87);
            }
          }
        }
        &:hover {
          .typeName-opt {
            display: inline-block;
          }
        }
        .edit-container {
          position: relative;
          .edit-name-input {
            height: auto;
            background: transparent;
            font-size: 16px;
            width: 90%;
            border-bottom: 2px solid #298df7;
          }
          .project-confirm {
            font-size: 16px;
            color: rgba(0, 0, 0, 0.54);
            position: absolute;
            right: -4px;
            top: 2px;
            font-weight: bold;
          }
        }
        .add-child-type-icon {
          font-size: 13px;
          font-weight: bold;
        }
      }
      .type-disable {
        background: #e5e5e5;
        font-size: 13px;
        padding: 3px 7px;
        margin-left: 5px;
        border-radius: 20px;
        color: rgba(0, 0, 0, 0.54);
      }
      .type-badge {
        display: inline-block;
        background: #dedede;
        border-radius: 50px;
        box-sizing: border-box;
        // padding: 8px 11px;
        margin-right: 5px;
        margin-bottom: 10px;
        -webkit-transition: all 0.2s;
        -moz-transition: all 0.2s;
        -ms-transition: all 0.2s;
        -o-transition: all 0.2s;
        transition: all 0.2s;
        min-width: 60px;
        text-align: center;
        &.add-type-badge {
          padding: 8px 12px;
          min-width: 0;
        }
        .info-container {
          position: relative;
        }
        .project-title {
          font-size: 13px;
          color: rgba(0, 0, 0, 0.87);
          padding: 8px 14px;
          display: inline-block;
          &.disable {
            color: rgba(0, 0, 0, 0.54);
          }
        }
        .project-opt {
          // display: none;
          position: absolute;
          left: 0;
          right: 0;
          top: -35px;
          border-radius: 50px;
          padding: 7px 0px;
          background: #f1f1f1;
          opacity: 0;
          visibility: hidden;
          -webkit-transition: all 0.2s;
          -moz-transition: all 0.2s;
          -ms-transition: all 0.2s;
          -o-transition: all 0.2s;
          transition: all 0.2s;
          .project-opt-icon {
            font-size: 12px;
            margin-left: 5px;
            color: rgba(0, 0, 0, 0.54);
            font-weight: bold;
            &:hover {
              color: rgba(0, 0, 0, 0.87);
            }
          }
        }
        &:hover {
          background: #f1f1f1;
          box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12),
            0 2px 2px 0 rgba(0, 0, 0, 0.12);
          .project-opt {
            // display: inline-block;
            top: 0;
            opacity: 0.9;
            visibility: visible;
          }
        }
        .edit-container {
          position: relative;
          .edit-name-input {
            height: auto;
            background: transparent;
            width: 86%;
            border-bottom: 2px solid #298df7;
          }
          .project-confirm {
            font-size: 16px;
            color: rgba(0, 0, 0, 0.54);
            position: absolute;
            right: 0;
            top: 3px;
            font-weight: bold;
          }
          &.name-edit-container {
            padding: 8px 12px;
            .project-confirm {
              right: 10px;
              top: 11px;
            }
          }
        }
        .add-child-type-icon {
          font-size: 13px;
          font-weight: bold;
        }
      }
      i {
        cursor: pointer;
      }
    }
  }
  .content-type-modal {
    .modal-title {
      margin-left: 10px;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.87);
      padding: 6px 0;
    }
    .modal-body {
      padding:0 15px;
      .form-group {
        margin-top:15px;
        .childType-name-input {
          display: inline-block;
          margin-left: 8px;
          width: 63%;
        }
      }
      .error-message {
        font-size: 13px;
        color: #ff5252;
        line-height: 13px;
        margin: 8px 0 0 67px;
      }
      .child-type-name {
        font-size: 14px;
        display: inline-block;
        margin-top: 3px;
        margin-left: 24px;
      }
      .remove-icon {
        color: rgba(0, 0, 0, 0.4);
        cursor: pointer;
        margin-right: 20px;
      }
      .child-type-list {
        border-top: 1px solid #e0e0e0;
        margin-top: 10px;
        padding: 10px 24px;
        max-height: 300px;
        overflow: auto;
      }
    }
  }
}
</style>
