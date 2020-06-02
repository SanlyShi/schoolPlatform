<template>
  <div class="intelligent">
    <div class="tab-div">
      <div v-for="(item, index) in tabbar" :key="index" class="tab" :class="currentTab == index ? 'active' : ''" @click="selectTab(index)">{{item}}</div>
    </div>
    <div class="content text-center">
      <div class="explain-box" v-if="showExplainBox">
        <div class="explain-cnt">
          通过本功能（{{tabbar[currentTab]}}）可控制数据可选项在客户端的显示。
        </div>
      </div>
      <v-table ref="dictionaryTable" :url="tableUrl" pagesize="10" idField="id" :columns="columns" multiple="true" @afterChecked="afterChecked" :order="true" :search="false">
        <div slot="btn-group" role="group">
          <div class="btn-group pull-left">
            <div class="batch-options" v-if="tableCheckedList.length > 0">
              <span class="pull-left">已选择{{tableCheckedList.length}}项，其中可操作的有{{tableCheckedList.length}}项</span>
            </div>
          </div>
          <div class="btn-group pull-right">
            <button type="button" class="btn batch-add-btn btn-bgColor-style clearBtnBorder no-pointer" @mouseover="showExplainBox=true" @mouseout="showExplainBox=false">说明</button>
            <button type="button" class="btn batch-add-btn btn-bgColor-style clearBtnBorder" @click="setOpenStatus(true)">设为开放</button>
            <button type="button" class="btn batch-add-btn btn-bgColor-style clearBtnBorder" @click="setOpenStatus(false)">设为关闭</button>
          </div>
        </div>
      </v-table>
    </div>
    <v-modal :show="showEditModal" effect="fade" @onHide="showEditModal=false" width="400">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">编辑</h5>
      </div>
      <div slot="modal-body" class="modal-body" v-if="showEditModal">
        <div class="input-group addClass-input-group">
          <label class="addClass-text">名称:</label>
          <input :value="editParams.typeName" class="form-control search-input" type="text" readonly="readonly">
        </div>
        <div class="input-group addClass-input-group">
          <label class="addClass-text">可选项:</label>
          <input :value="editParams.dictName" class="form-control search-input" type="text" readonly="readonly">
        </div>
        <div class="input-group addClass-input-group">
          <label class="addClass-text"></label>
          <label class="radio-inline">
              <input type="radio" name="openStatus" id="open" v-model="editParams.status" value="OPEN" :checked="editParams.status=='OPEN'"> 开放
            </label>
          <label class="radio-inline">
              <input type="radio" name="openStatus" id="close" v-model="editParams.status" value="CLOSE" :checked="editParams.status=='CLOSE'"> 关闭
            </label>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showEditModal = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="editComfirm">确认</button>
      </div>
    </v-modal>
  </div>
</template>

<script>
  import {
    sAjax,
    request,
    translation
  } from "../../assets/utils/utils.js";
  export default {
    data() {
      return {
        tabbar: ['智能评估', '历年分数'],
        currentTab: 0,
        showEditModal: false,
        showExplainBox: false,
        tableUrl: `/table-data/archives/pc/getPcDictList?timestamp=&labelName=智能评估`,
        columns: [],
        lang: "zh-cn",
        checkRows: [],
        hadCheck: false,
        openStatusList: [],
        tableCheckedList: [],
        editParams:{},
      };
    },
    created() {
      var la = localStorage.getItem("lang");
      var that = this;
  
      if (translation(la)) {
        this.lang = la;
      }
      this.initLabel()
      this.openStatusList = [{
        value: ' ',
        label: '全部'
      },{
        value: 'OPEN',
        label: '开放'
      }, {
        value: 'CLOSE',
        label: '关闭'
      }]
      this.columns = [{
          id: "typeName",
          title: '名称',
          className: "text-left",
          width: "150px",
          hidden: false,
          search: {
            type: "input",
            data: {
              placeholder: ""
            }
          }
        },
        {
          id: "dictName",
          title: "可选项",
          className: "text-left",
          width: "150px",
          hidden: false,
          search: {
            type: "input",
            data: {
              placeholder: ""
            }
          }
        },
        {
          id: "status",
          title: "开放状态",
          className: "text-left",
          width: "150px",
          hidden: false,
          search: {
            type: "select",
            data: {
              optionsLabel: 'label',
              optionsValue: 'value',
              options: this.openStatusList,
            }
          },
          formatter(record) {
            if(record.status == 'OPEN') {
              return '开放'
            } else {
              return '关闭'
            }
          }
        },
        {
          id: "createTime",
          title: '操作时间',
          className: "text-left",
          width: "200px",
          hidden: false,
        },
        {
          id: "operate",
          title: '操作人',
          className: "text-left",
          width: "150px",
          hidden: false,
          search: {
            type: "input",
            data: {
              placeholder: ""
            }
          }
        },
        {
          id: "opt",
          title: "操作",
          className: "text-center",
          width: "230px",
          hidden: false,
          formatter: function(obj) {
            return [{
              tag: "a",
              text: that.translate.edit,
              className: "opt-btn",
              callback: function(record, index) {
                that._edit(record);
              }
            }];
          }
        }
      ]
  
    },
    methods: {
      initLabel() {
        let url = 'api/archives/pc/getPcDictListName'
        request(url).then(res => {
          if (res.state) {
            this.tabbar = res.data
            this.refreshTable()
          } else {
            this.$toast(res.message)
          }
        })
      },
      selectTab(type) {
        if (this.currentTab === type) {
          return
        }
        this.currentTab = type
        this.refreshTable()
      },
      _edit(record) { //查看详情
        this.editParams = JSON.parse(JSON.stringify(record));
        this.showEditModal = true;
      },
      editComfirm() {
        this.updateOpenStatus(this.editParams.status, [this.editParams])
      },
      setOpenStatus(type) {
        let tip = `确定将所有可选项状态设为${type?'开放':'关闭'}吗？`
        if (this.tableCheckedList.length == 0) {
          this.$toast('请先选择需操作项')
          return ;
        }
        if (confirm(tip)) {
          this.updateOpenStatus(type?'OPEN':'CLOSE', this.tableCheckedList)
        }
      },
      afterChecked(records) {
        this.tableCheckedList = records
      },
      updateOpenStatus(status, options) {
        let url = `api/archives/pc/updatePcDictList?status=${status}`
        request(url, options).then(res => {
          if (res.state) {
            this.$toast('修改成功')
            this.showEditModal = false
            this.tableCheckedList = []
            this.refreshTable()
          } else {
            this.$toast(res.message)
          }
        })
      },
      refreshTable() {
        this.tableUrl = `/table-data/archives/pc/getPcDictList?timestamp=${new Date().getTime()}&labelName=${this.tabbar[this.currentTab]}`
      },
    },
    computed: {
      translate: function() {
        return translation(this.lang).enrollManage;
      }
    }
  };
</script>

<style lang="less" scoped>
  @import url("../../assets/common.less");
  .intelligent {
    .content {
      position: relative;
    }
    .explain-box {
      position: absolute;
      top: -70px;
      right: 264px;
    }
    .explain-cnt {
      position: relative;
      width: 120px;
      height: 90px;
      background: rgba(0, 0, 0, 0.54);
      color: rgba(255, 255, 255, 0.54);
      border-radius: 4px;
      font-size: 12px;
      padding: 10px;
      &::after {
        content: '';
        position: absolute;
        bottom: -16px;
        right: 52px;
        border-top: 8px solid rgba(0, 0, 0, 0.54);
        border-bottom: 8px solid transparent;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
      }
    }
    .no-pointer {
      cursor: default;
    }
  }
  
  .addClass-input-group {
    display: inline-flex;
    width: 100%;
    margin-bottom: 18px;
    .search-select {
      width: 212px;
      margin: 0 19px;
    }
    .search-input {
      margin: 0 16px;
      width: 212px;
      float: initial;
    }
  }
  
  .addClass-text {
    width: 90px;
    text-align: right;
  }
  
  .radio-inline {
    margin-left: 20px;
  }
  
  .radio-area {
    display: inline-block;
    margin-left: 18px;
  }
  
  .tab-div {
    position: relative;
    height: 40px;
    margin: 10px 0px 0;
    background: white;
    white-space: nowrap;
    border-bottom: 1px solid #f0f0f0;
    .apply-container {
      position: absolute;
      right: 0;
    }
    .tab-list {
      position: relative;
      .gm-scroll-view {
        padding-right: 200px;
      }
    }
    .tab {
      display: inline-block;
      // max-width: 200px;
      width: 150px;
      padding: 0 20px;
      font-size: 13px;
      color: rgba(0, 0, 0, 0.54);
      line-height: 40px;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      border-bottom: 2px solid transparent;
      cursor: pointer;
      transition: all 0.2s ease-out;
      vertical-align: top;
      &.tab-node {
        line-height: 20px;
        p {
          margin: 0;
          text-align: left;
        }
      }
      &:hover,
      &.active {
        color: #298df7;
        border-bottom: 2px solid #298df7;
        height: 40px;
      }
      margin-right: -4px;
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
</style>
