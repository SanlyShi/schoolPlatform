<!--字典管理组件-->
<template>
  <div id="dictionary-page" class="container-fluid">
    <div class="row text-center">
      <!--初始往表格中填入数据时，只需要将这些参数给定即可，组件会自动生成请求的地址和传参，search为是否显示搜索，muti为是否开启多选-->
      <v-table
        :title="translate.tableTitle"
        :url="url"
        pagesize="10"
        :order="true"
        idField="id"
        :columns="columns"
        :multiple="false"
        :search="true"
      >
        <!--使用插槽-“新增条目”-->
        <div slot="btn-group" class="btn-group pull-right" role="group">
          <button type="button" class="btn blue" @click="addModal">{{ translate.addNew }}</button>
          <button type="button" class="btn blue" @click="quickAddRecord">批量新增</button>
        </div>
      </v-table>
    </div>
    <v-modal :show="showAddModal" effect="fade" width="446">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">{{modalType}}</h5>
      </div>
      <!--新建选项-->
      <div slot="modal-body" class="modal-body">
        <div class="form-group class-committee-group">
          <label class="classCommittee-text">{{translate.dictionaryTypeName}}:</label>
          <input
            type="text"
            class="optionInput"
            :placeholder="translate.dictionaryNameInputPlaceholder"
            @click="dicNameDisabled"
            v-model="dicName"
            :readonly="flow.rank === 'systemDefined'? true : false"
            maxlength="15"
            @change="modifyDicName"
          >
        </div>
        <div v-show="dicNameErrorTip" class="dicNameErrorTip">{{errorMsg}}</div>
        <div class="dictionaryCreateOption">
          <span @click="addOption">{{ translate.dictionaryCreateOption }}</span>
        </div>
        <!-- 新建选项输入框 -->
        <div class="form-group" v-show="showOptionInput">
          <input
            id="formName"
            type="text"
            class="form-control name-input"
            @change="optionInput"
            maxlength="15"
            :placeholder="translate.dictionaryOptionInputPlaceholder"
            v-model="inputContent"
          >
        </div>
        <div class="modal-body-content">
          <!--点击文字变成可编辑状态,拖动排序后optionsArr内元素顺序自动改变-->
          <div
            v-for="(option,index) in optionsArr"
            v-dragging="{ item: option, list: optionsArr, group: ' ' }"
            :key="index"
          >
            <input
              class="optionInput"
              type="text"
              v-model="option.label"
              @click="editable(option, index)"
              @change="modifyOption(option,index)"
              autofocus
              :readonly="!option.edit"
              maxlength="20"
            >
            <!-- 选项最右边的icon-->
            <i
              class="maticon remove"
              @mousedown="remove(option,index)"
              v-html="icons('cancel')"
            >cancel</i>
            <i class="maticon order" title="长按拖拽排序" v-html="icons('swap_vert')">swap_vert</i>
          </div>
        </div>
      </div>
      <!--模态框的“取消”和“提交”-->
      <div slot="modal-footer" class="modal-footer">
        <button
          type="button"
          class="btn cancel-btn clearBtnBorder"
          @click="cancel"
        >{{ translate.cancel }}</button>
        <button
          type="button"
          class="btn submit-btn clearBtnBorder"
          @click="submit"
        >{{ translate.submit }}</button>
      </div>
    </v-modal>
    <div id="previewImportPage" v-show="curRoute === 'importPage'">
      <v-import v-bind="importParams" @backParentPage="curRoute = 'allStaff'"  ></v-import>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
// sAjax, translation为util.js 中的函数模块
import { sAjax, translation } from "../../assets/utils/utils.js";
import importTable from "../../mixins/import.js"
export default {
  mixins:[importTable],
  data: function() {
    return {
      // 控制字典名称错误提示
      submitCtrl: false,
      dicNameErrorTip: false,
      columns: [],
      // 初始数据,添加table-data
      url: "/table-data/system/dictTypes/pages",
      showAddModal: false,
      flow: {},
      newFlow: {
        id: "",
        dicts: [{ id: "", label: "", value: "", sort: 0 }],
        name: "",
        rank: "customDefined"
      },
      newDictionaryType: {},
      modalType: "",
      lang: "zh-cn",
      dicName: "",
      showOptionInput: false,
      optionsArr: [],
      optionInputTemp: "",
      inputContent: "",
      errorMsg: ""
    };
  },
  created: function() {
    let la = localStorage.getItem("lang");
    let that = this;
    if (translation(la)) {
      this.lang = la;
    }
    this.columns = [
      {
        // 名称
        id: "name",
        title: this.translate.dictionaryTypeName,
        className: "text-left",
        hidden: false,
        width: 150,
        search: {
          type: "input",
          data: {
            placeholder: this.translate.dictionaryTypeSearchPlaceholder,
            autoFocus: true
          }
        }
      },
      {
        // 选项
        id: "dictionaryOption",
        title: this.translate.dictionaryOption,
        className: "text-left text-overflow",
        hidden: false,
        width: 550,
        // 数据格式化
        formatter: function(record) {
          if (!record.dicts) {
            return "";
          }
          let dicts = "";
          record.dicts.forEach(item => {
            dicts += item.label + " ";
          });
          return dicts;
        }
      },
      {
        id: "opt",
        className: "text-center",
        title: this.translate.operation,
        width: 120,
        hidden: false,
        formatter: function() {
          return [
            {
              tag: "a",
              // 编辑
              text: that.translate.edit,
              className: "opt-btn",
              // 点击编辑将该字段数据显示到modal中
              callback: function(record, index) {
                that.flow = JSON.parse(JSON.stringify(record));
                that.dicName = that.flow.name;
                for (let i = 0; i < that.flow.dicts.length; i++) {
                  that.optionsArr.push({
                    id: that.flow.id,
                    label: that.flow.dicts[i].label,
                    value: that.flow.dicts[i].value,
                    sort: that.flow.dicts[i].sort,
                    edit: false
                  });
                }
                that.newFlow.id = that.flow.id;
                that.newFlow.name = that.flow.name;
                that.dicName = that.flow.name;
                that.newFlow.dicts = that.flow.dicts;
                //  传“编辑”字段
                that.modalType = that.translate.edit;
                that.showAddModal = true;
                that.dicNameErrorTip = false;
                that.submitCtrl = false;
              }
            },
            {
              tag: "a",
              text: that.translate.remove,
              className: "opt-btn",
              //  删除字典
              callback: function(record, index) {
                if (record.rank !== "systemDefined") {
                  sAjax({
                    // 对于新建的字典类型，后台会自动给一个ID
                    url: "/api/system/dictTypes/delete/" + record.id,
                    dataType: "json",
                    type: "post",
                    success: function(data) {
                      if (confirm(that.translate.removeConfirmTip)) {
                        if (data.state) {
                          that.url += "?time=" + new Date().getTime();
                        } else {
                          that.$toast(that.translate.removeFailedTip);
                        }
                      }
                    }
                  });
                } else {
                  that.$toast("默认字段无法删除！");
                }
              }
            }
          ];
        }
      }
    ];
  },
  computed: {
    // 计算属性translate为utils.js 中的函数模块
    translate: function() {
      return translation(this.lang).dictionaryManage;
    }
  },
  methods: {
    editable: function(option, index) {
      if (this.flow.rank !== "systemDefined") {
        this.optionsArr[index].edit = true;
        this.optionInputTemp = option.label;
      } else {
        this.$toast("默认选项无法修改!");
      }
    },
    dicNameDisabled: function() {
      if (this.flow.rank === "systemDefined") {
        this.$toast("默认名称无法修改!");
        return;
      }
    },
    submit: function() {
      if (!this.dicName) {
        this.dicNameErrorTip = true;
        this.errorMsg = "字典名称不能为空";
        return;
      }
      if (this.submitCtrl) {
        this.errorMsg = "请输入正确的字典名称";
        this.dicNameErrorTip = true;
      } else {
        this.errorMsg = "";
        this.dicNameErrorTip = false;
        // 用户可能使用了拖动排序，故需要在提交前重新填充newFlow
        this.newFlow.dicts = [];
        this.optionsArr.forEach(option => {
          delete option.edit;
          this.newFlow.dicts.push(option);
        });
        let that = this;
        if (this.modalType === this.translate.edit) {
          // 修改选项，提交选项数组到数据库（点击编辑或新增）

          sAjax({
            url: "/api/system/dictTypeWithDicts/" + this.newFlow.id,
            dataType: "json",
            data: {
              dicts: this.newFlow.dicts,
              name: this.dicName
            },
            type: 'post',
            success: function(data) {
              if (data.state) {
                that.url += `?time=${new Date().getTime()}`;
                that.showAddModal = false;
                that.showOptionInput = false;
              } else {
                this.$toast(data.message);
              }
            }
          });
        } else {
          sAjax({
            url: "/api/system/dictTypeWithDicts",
            data: {
              dicts: this.newFlow.dicts,
              name: this.dicName
            },
            type: "post",
            success: function(data) {
              if (data.state) {
                that.url += `?time=${new Date().getTime()}`;
                that.showAddModal = false;
                that.showOptionInput = false;
              } else {
                this.$toast(data.message);
              }
            }
          });
        }
        // 提交后将modal清空
        this.optionsArr = [];
        this.flow = "";
        this.dicName = "";
        this.showAddModal = false;
        this.showOptionInput = false;
      }
    },
    cancel: function() {
      this.showAddModal = false;
      this.optionsArr = [];
      this.flow = "";
      this.dicName = "";
    },
    addOption: function() {
      if (this.flow.rank !== "systemDefined") {
        this.showOptionInput = !this.showOptionInput;
      } else {
        this.inputContent = "";
        this.$toast("默认字段无法添加选项!");
      }
    },
    optionInput: function() {
      let pattern = /^[ ]+$/;
      //  点击“编辑” 后, 操作newFlow.dicts
      // if (this.modalType === this.translate.edit) {
      // 如果添加的选项不是已经有的
      if (
        !this.optionsArr.find(item => {
          return item.label === this.inputContent;
        })
      ) {
        // 如果新增的选项无效则不保存
        if (this.inputContent !== "" && !pattern.test(this.inputContent)) {
          this.optionsArr.push({
            id: `${this.optionsArr.length}`,
            value: `${new Date().getTime()}`,
            label: this.inputContent,
            sort: this.optionsArr.length + 1,
            edit: false
          });
          console.log('label',this.inputContent);
          this.inputContent = "";
        } else {
          this.$toast("新增选项名不能为空!");
        }
      } else {
        this.inputContent = "";
        this.$toast("该选项已存在!");
      }
      // }
    },
    // ES6过滤函数
    remove: function(option, index) {
      // 如果是系统字段，则提示不能删除
      if (this.flow.rank === "systemDefined") {
        this.$toast("默认选项无法删除!");
        // 如果是自定义字段,可删
      } else {
        this.newFlow.dicts = this.flow.dicts;
        // 用filter从dicts中去除
        this.optionsArr = this.optionsArr.filter(item => {
          return item.label !== option.label;
        });
      }
    },
    // 选项修改后change提交
    modifyOption: function(option, index) {
      let pattern = /^[ ]$/;
      // 且修改后的字段仍是合法的
      if (
        this.newFlow.dicts.find(item => {
          return item.label === option.label;
        })
      ) {
        this.$toast("该选项已存在!");
        option.label = this.optionInputTemp;
        this.optionInputTemp = "";
      } else {
        if (option.label !== "" && !pattern.test(option.label)) {
          this.newFlow.dicts[index].label = this.optionsArr[index].label;
        }
      }
    },
    modifyDicName: function() {
      if (this.flow.rank !== "systemDefined") {
        if (/[\s]+/.test(this.dicName)) {
          this.submitCtrl = true;
          this.errorMsg = "请输入正确的字典名称";
          this.dicNameErrorTip = true;
        } else {
          this.submitCtrl = false;
          this.newFlow.name = this.dicName;
          this.dicNameErrorTip = false;
          this.errorMsg = "";
        }
      } else {
        this.$toast("默认名称无法修改!");
      }
    },
    // 点击“新增项目”后，将传入addNew,并且打开modal
    addModal: function() {
      this.dicNameErrorTip = false;
      this.modalType = this.translate.addNew;
      this.showAddModal = true;
    }
  }
};
</script>
<style lang="less">
@import url("../../assets/common.less");
/*less的写法*/
#dictionary-page {
  /*placeholder的通用属性*/
  .placeholder-style-common {
    color: rgba(0, 0, 0, 0.87);
    font-size: 16px;
    letter-spacing: 0;
    line-height: 16px;
    font-weight: 500;
  }
  /* 选项的通用样式*/
  .option-style-common {
    width: 70px;
    // height:40px;
    .font-style-common(13px, rgba(0, 0, 0, 67), 500);
    letter-spacing: 0;
    line-height: 40px;
    outline: none;
    border: none;
  }
  /*input的下边框的通用样式*/
  .input-border-bottom-common(@color) {
    border-bottom: solid @color 2px;
  }
  /*字体的通用样式*/
  .font-style-common(@size, @color, @weight) {
    font-size: @size;
    color: @color;
    font-weight: @weight;
  }
  /*长/宽通用样式*/
  .wh-style-common(@w,@h) {
    width: @w;
    height: @h;
  }
  .search-name {
    padding-left: 55px;
  }
  tbody tr td:first-child {
    border-left: #000;
  }
  th.text-right {
    cursor: pointer;
    padding-right: 48px;
  }
  td > div {
    white-space: nowrap; //超出但是不换行
    overflow: hidden; //超出隐藏
    text-overflow: ellipsis; //超出部分用...代替
  }
  td.text-right {
    .wh-style-common(140px, 40px);
    /*编辑和删除按钮*/
    .opt-btn {
      display: inline-block;
      .wh-style-common(26px, 40px);
      font-size: 13px;
      color: rgba(0, 0, 0, 0.54);
      letter-spacing: 0;
      line-height: 40px;
      margin-right: 16px;
    }
  }
  /* "字典列表" */
  .panel-title {
    .wh-style-common(64px, 16px);
    .font-style-common(16px, rgba(0, 0, 0, 0.87), 500);
    letter-spacing: 0;
    line-height: 16px;
  }
  /*增加条目按钮*/
  .btn-group button.add {
    outline: none;
    background: #fff;
  }
  /* 去掉搜索按钮的外轮廓*/
  button.search-btn {
    outline: none;
    background: #fff;
  }
  .modal-content {
    .modal-header {
      /*input占位符样式*/
      padding-left: 24px;
      ::-webkit-input-placeholder {
        .placeholder-style-common;
      }
      /* firefox 19+ */
      ::-moz-placeholder {
        .placeholder-style-common;
      }
      /* Internet Explorer 10+ */
      :-ms-input-placeholder {
        .placeholder-style-common;
      }
      /* firefox 14-18 */
      :-moz-placeholder {
        .placeholder-style-common;
      }
      /* " 字典名称下面的边框样式 " */
      // .dictionaryNameEnter input {
      //   width: 80%;
      //   border: none;
      //   outline: none;
      //   border-bottom: solid transparent 2px;
      // }
      // .dictionaryNameEnter input:hover {
      //   border-bottom: solid #e0e0e0 2px;
      // }
      // .dictionaryNameEnter input:focus {
      //   border-bottom: solid #298df7 2px;
      // }
      .modal-title b {
        margin-bottom: 10px;
        font-size: 13px;
        color: rgba(0, 0, 0, 0.4);
        letter-spacing: 0;
        line-height: 13px;
      }
      .modal-title {
        margin-bottom: 8px;
      }
      .dicNameErrorTip {
        color: #f00;
        margin-top: 5px;
      }
    }
    .modal-body {
      padding-top: 0px;
      padding-left: 0px;
      height: 325px;
      overflow-x: hidden;
      overflow-y: scroll;
      .dictionaryCreateOption {
        .font-style-common(13px, #298df7, 500);
        letter-spacing: 0;
        line-height: 48px;
        padding-left: 24px;
        .wh-style-common(446px, 48px);
        border-bottom: solid #e0e0e0 1px;
        cursor: pointer;
        margin-bottom:10px;
      }
      .modal-body-content {
        padding-left: 24px;
        margin-bottom: 0;
        li,div {
          background:white;
          list-style: none;
          margin-top:10px;
          position: relative;
        }
        // input {
        //   .option-style-common;
        // }
        // input:hover {
        //   .input-border-bottom-common(#298df7);
        // }
        // .optionInput {
        //   width: 80%;
        //   border-bottom: 2px solid transparent;
        // }
        .order {
          position: absolute;
          right: 0;
          top: 5px;
          .wh-style-common(20px, 20px);
          color: rgba(0, 0, 0, 0.67);
          letter-spacing: 0;
          cursor: pointer;
        }
        .remove {
          position: absolute;
          right: 28px;
          top: 5px;
          .wh-style-common(20px, 20px);
          color: rgba(0, 0, 0, 0.4);
          letter-spacing: 0;
          cursor: pointer;
        }
      }
      /*点击“新建选项” 的输入框样式*/
      .class-committee-group{
        margin-top:5px;
      }
      .form-group {
        box-sizing: content-box;
        padding-left: 24px;
        margin-bottom: 0;
        // input {
        //   width: 80%;
        //   border: none;
        //   outline: none;
        //   border-radius: 0;
        //   transition: none;
        //   box-shadow: none;
        //   padding: 0;
        //   border-bottom: 2px solid transparent;
        // }
        // input:hover {
        //   .input-border-bottom-common(#e0e0e0);
        // }
        // input:focus {
        //   .input-border-bottom-common(#298df7);
        // }
      }
    }
  }
  /* 去掉右边滚动条*/
  div.row:first-child {
    /*height:800px;*/
    overflow-y: auto;
    /*&::-webkit-scrollbar {*/
    /*width: 0px;*/
    /*background-color: #d0d0d0;*/
    /*}*/
  }
}
#previewImportPage {
  height: 888px;
  width: 100%;
  position: absolute;
  top:0;left: 0;
  right: 0;
  z-index: 12;
  background: white;
}
</style>
