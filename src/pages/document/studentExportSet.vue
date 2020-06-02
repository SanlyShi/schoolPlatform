<template>
  <div class="studentExportSet_wrap">
    <div class="head text-center">
      <div class="pull-left back-div">
        <i class="maticon" @click="_back" v-html="icons('arrow_back')">arrow_back</i>
      </div>
      <div class="flow-title">
        <div class="input-group">
          <label class="page-name">权限管理</label>
        </div>
        <!-- <a href="javascript:;">
          <span v-if="!curForm.formSettingId">{{translate.relevanceTip}}</span>
          <span v-else>关联表单：{{curForm.formSettingName}}</span>
        </a>-->
      </div>
      <div class="pull-right opt-div">
        <a href="javascript:;" class="opt-btn" @click="_back">取消</a>
        <button class="btn save" @click="_saveExportSet">保存</button>
      </div>
    </div>
    <div class="join-set-content">
      <GeminiScrollbar :scrollY="false" :autoshow="true" class="info-container">
        <div
          class="col other-col box_flex inline_flex column"
          v-for="(item,index) in typeList"
          :key="index"
        >
          <div class="form-group flex_shrink">
            <i class="maticon pull-left app-icon black-color" v-html="icons('label')">label</i>
            <div class="form-group-input pull-left">
              <label class="name-label light-black-color">参与者名称</label>
              <input
                type="text"
                class="form-control name-input border-bottom-blue black-color"
                disabled="true"
                maxlength="25"
                v-if="item==='INSTRUCTOR'"
                value="辅导员"
              >
              <input
                type="text"
                class="form-control name-input border-bottom-blue black-color"
                disabled="true"
                maxlength="25"
                v-if="item==='COLLEGE'"
                value="学院"
              >
              <input
                type="text"
                class="form-control name-input border-bottom-blue black-color"
                disabled="true"
                maxlength="25"
                v-if="item==='SCHOOL'"
                value="学校"
              >
            </div>
            <div class="form-group">
              <i
                class="maticon pull-left app-icon black-color"
                v-html="icons('call_split')"
              >call_split</i>
              <div class="form-group-input pull-left">
                <label class="name-label light-black-color">分配方式</label>
                <div class="distribution-select">
                  <v-select
                    :autoSelect="false"
                    :options="distributaryData"
                    :value="item"
                    options-value="id"
                    options-label="name"
                    disabled="true"
                  ></v-select>
                </div>
              </div>
            </div>
            <div class="form-group clear-padding-bottom clear-bord-bottom">
              <div class="participant-read-write-header" style="height:85px">
                <i class="maticon app-icon black-color" v-html="icons('visibility')">visibility</i>
                <label class="read-write-label light-black-color">搜索</label>
                <div class="form-group-input" style="margin-left: 71px;">
                  <input
                    type="text"
                    class="name-input border-bottom-blue black-color"
                    placeholder="请输入关键字"
                    v-model="keywords[item]"
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="role-list grow_1">
            <div class="role-list-item margin-bottom-5px" style="height:100%">
              <div class="margin-left-70px">
                <div
                  class="input-group select_top box_flex align_center"
                  style="justify-content:flex-end;padding-right:100px;"
                >
                  <i
                    class="maticon role-icon white-color"
                    v-html="icons('check_box_outline_blank')"
                    v-if="exportNum[item]===0"
                    @click="setExportAll(item)"
                  >check_box_outline_blank</i>
                  <i
                    class="maticon role-icon white-color active"
                    v-html="icons('check_box')"
                    @click="setUnExportAll(item)"
                    v-else-if="exportNum[item]===fieldList.length"
                  >check_box</i>
                  <i
                    class="maticon role-icon white-color"
                    @click="setUnExportAll(item)"
                    v-html="icons('indeterminate_check_box')"
                    v-else
                  >indeterminate_check_box</i>
                  <span class="role-name white-color">全部允许导出</span>
                </div>
              </div>
              <GeminiScrollbar class="list_wrap" style="overflow:scroll;height:100%">
                <div
                  class="role-list-item"
                  v-for="(com,cIndex) in fieldList"
                  v-if="com.columnName.indexOf(keywords[item])!==-1"
                  :key="cIndex"
                >
                  <div class="margin-left-70px" @click="setExport(com,cIndex,item)">
                    <div class="col-xs-5">
                      <div class="input-group">
                        <span
                          class="data-authorities-name white-color"
                          :title="com.columnName"
                        >{{com.columnName}}</span>
                      </div>
                    </div>
                    <div class="col-xs-7 box_flex flex_center">
                      <span class="operator" :class="com.canExport[item]?'active':''">允许导出</span>
                    </div>
                  </div>
                </div>
              </GeminiScrollbar>
            </div>
          </div>
        </div>
      </GeminiScrollbar>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { request, translation } from "../../assets/utils/utils.js";

export default {
  data: function() {
    return {
      fieldList: [],
      exportNum: {
        SCHOOL: 0,
        INSTRUCTOR: 0,
        COLLEGE: 0
      },
      distributaryData: [
        { name: "全校统一汇总", id: "SCHOOL" },
        { name: "以带生关系分配", id: "INSTRUCTOR" },
        { name: "以学院关系分配", id: "COLLEGE" }
      ],
      typeList: ["SCHOOL", "COLLEGE", "INSTRUCTOR"],
      keywords: { SCHOOL: "", COLLEGE: "", INSTRUCTOR: "" },
      collegeExportNum: 0,
      schoolExportNum: 0,
      instructorExportNum: 0
    };
  },
  created() {
    var la = localStorage.getItem("lang");
    if (translation(la)) {
      this.lang = la;
    }
    this.getList();
  },
  computed: {
    translate: function() {
      return translation(this.lang).infoManage;
    }
  },
  methods: {
    getList() {
      let url = "api/data/column/roles";
      request(url).then(o => {
        if (!o.state) {
          this.$toast(o.message);
          return;
        }
        this.fieldList = o.data.map(o => {
          for (var i in this.typeList) {
            if (o.canExport[this.typeList[i]]) {
              this.exportNum[this.typeList[i]]++;
            } else {
              o.canExport[this.typeList[i]] = false;
            }
          }
          return o;
        });
      });
    },
    setExportAll(type) {
      this.hasChange = true;
      this.exportNum[type] = this.fieldList.length;
      this.fieldList = this.fieldList.map(o => {
        o.canExport[type] = true;
        return o;
      });
    },
    setUnExportAll(type) {
      this.hasChange = true;
      this.exportNum[type] = 0;
      this.fieldList = this.fieldList.map(o => {
        o.canExport[type] = false;
        return o;
      });
    },
    setExport(item, index, type) {
      this.hasChange = true;
      if (item.canExport[type]) {
        this.exportNum[type]--;
      } else {
        this.exportNum[type]++;
      }
      item.canExport[type] = !item.canExport[type];
    },
    _back: function() {
      if (this.hasChange&&confirm("当前设置不会生效，是否退出?")) {
        this.$parent._closeFormSetting();
      }else if(!this.hasChange){
        this.$parent._closeFormSetting();
      }
    },
    _saveExportSet() {
      if (confirm("是否保存?")) {
        let COLLEGE = { flowType: "COLLEGE", columnIds: [] };
        let SCHOOL = { flowType: "SCHOOL", columnIds: [] };
        let INSTRUCTOR = { flowType: "INSTRUCTOR", columnIds: [] };
        this.fieldList.map(o => {
          if (o.canExport.SCHOOL) {
            SCHOOL.columnIds.push(o.id);
          }
          if (o.canExport.COLLEGE) {
            COLLEGE.columnIds.push(o.id);
          }
          if (o.canExport.INSTRUCTOR) {
            INSTRUCTOR.columnIds.push(o.id);
          }
        });
        let params = [COLLEGE, SCHOOL, INSTRUCTOR];
        let url = "api/data/column/roles";
        request(url, params).then(o => {
          if (o.state) {
            this.hasChange = false;
            this.$toast("保存成功!");
          }
        });
        //保存配置
      }
    }
  }
};
</script>
<style lang="less" scoped >
.studentExportSet_wrap {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 11;
  padding: 0;
  background: #e0e0e0;
  overflow: hidden;
  user-select: none;
  .head {
    position: relative;
    z-index: 2;
    height: 65px;
    background: #f5f5f5;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.12), 0 4px 4px 0 rgba(0, 0, 0, 0.12);
    .opt-div,
    .back-div,
    .flow-title {
      height: 100%;
    }
    .back-div {
      margin-left: 24px;
      i {
        line-height: 65px;
        cursor: pointer;
        transition: all 0.3s ease-out;
        &:hover {
          color: #298df7;
        }
      }
    }
    .flow-title {
      display: inline-block;
      width: 50%;
      max-width: 300px;
      padding: 4px 0 16px;
      margin-left: 90px;
      .input-group {
        display: block;
        margin: 0 auto;
      }
      .page-name {
        font-size: 16px;
        color: rgba(0, 0, 0, 0.73);
        margin-top: 5px;
      }
      a {
        font-size: 13px;
        color: #298df7;

        border-radius: 2px;
        text-decoration: none;
        white-space: nowrap;
        cursor: default;
        padding: 3px 9px;
        transition: all 0.3s ease;
      }
    }
    .opt-btn {
      display: inline-block;
      padding: 8px;
      margin: 16px 10px 0 0;
      font-size: 13px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.54);
      text-decoration: none;
      transition: all 0.3s ease-out;
      &:hover {
        color: #298df7;
      }
    }
    .save {
      width: 62px;
      margin-right: 24px;
      font-size: 13px;
      color: #ffffff;
      background: #298df7;
      border-radius: 2px;
      transition: all 0.3s ease;
      &:hover {
        background: lighten(#298df7, 10%);
        box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.44);
      }
      &:active {
        background: #72a3e4;
      }
    }
  }
  .join-set-content {
    margin: 0 auto;
    position: absolute;
    // height: 100%;
    width: 100%;
    // overflow: auto;
    top: 65px;
    bottom: 0;
    .info-container {
      height: 100%;
      padding-top: 20px;
      // padding: 20px 0 5px 0;
      text-align: center;
      padding-left: 15px;
      white-space: nowrap;
      overflow-x: auto;
      overflow-y: hidden;
      // &::-webkit-scrollbar {
      //   height: 10px !important;
      //   background-color: #f5f5f5;
      // }
      // &::-webkit-scrollbar-track {
      //   background-color: transparent;
      // }
      // &::-webkit-scrollbar-thumb {
      //   background-color: #666;
      //   border-radius: 3px;
      // }
      .col {
        width: 474px;
        height: 100%;
        background: #ffffff;
        box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12),
          0 2px 2px 0 rgba(0, 0, 0, 0.12);
        border-radius: 2px;
        margin-left: 20px;
        text-align: left;
        vertical-align: top;
        margin-bottom: 10px;
        // overflow: auto;
        // overflow-x: hidden;
      }
      .first-col {
        background: #298df7;
      }
      .form-group {
        width: 474px;
        display: table;
        padding-bottom: 16px;
        margin-bottom: 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.18);
        .app-icon {
          font-size: 24px;
          margin: 11px 0 0 16px;
        }
        .form-group-input {
          width: 77%;
          margin: 13px 0 0 32px;
          .name-label {
            font-size: 13px;
          }
          .name-input,
          .search-input {
            width: 100%;
            font-weight: 500;
            border: none;
            box-shadow: none;
            border-radius: 0;
            background: transparent;
            margin-top: -5px;
            padding: 0;
            &.disabled {
              border: none;
            }
          }
          .name-input {
            font-size: 14px;
            padding: 4px;
          }
          .search-input {
            font-size: 11px;
          }
        }
        .batch-head {
          background: rgba(255, 255, 255, 0.12);
          margin-top: 10px;
          height: 40px;
          .batch-tip {
            margin: 11px 0 0 70px;
            display: inline-block;
            font-size: 13px;
            font-weight: 500;
          }
          .sure {
            font-size: 13px;
            background: transparent;
            margin: 4px 4px 0 0;
            font-weight: 500;
          }
          .btn-group {
            border: none;
            .form-control.dropdown-toggle {
              background: transparent;
              font-size: 13px;
              color: #ffffff;
              border: none;
              box-shadow: none;
              margin-top: -5px;
              font-weight: 500;
              i {
                color: #ffffff;
              }
            }
          }
        }
        .read-write-label {
          font-size: 13px;
          margin: 16px 0 0 26px;
          vertical-align: top;
        }
        .owner-batch-head {
          display: none;
          box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.12),
            0 4px 4px 0 rgba(0, 0, 0, 0.12);
          margin-top: 0;
        }
        .owner-read-write-content {
          overflow-y: scroll;
          width: 474px;
          max-height: 600px;
          position: relative;
          &::-webkit-scrollbar {
            display: none;
          }
        }
        .role-list {
          // margin-top: 15px;
          height: 100%;
          padding-bottom: 82px;
          .role-icon {
            font-size: 20px;
            display: inline-block;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .role-name {
            font-size: 13px;
            vertical-align: top;
            margin: 2px 0 0 8px;
            font-weight: 500;
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .data-authorities-name {
            font-size: 13px;
            vertical-align: top;
            margin: 2px 0 0 8px;
            font-weight: 500;
            display: inline-block;
            width: 90px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            &:hover div {
              position: absolute;
              top: -30px;
              left: 9px;
              font-size: 13px;
              word-break: break-all;
              white-space: pre-wrap;
              box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.12),
                0 4px 4px 0 rgba(0, 0, 0, 0.12);
              border-radius: 5px;
              background: #ffffff;
              padding: 5px 10px;
              color: black;
              z-index: 1;
            }
            &:hover .littleText {
              display: none;
            }
            &:hover .moreText {
              display: block;
            }
            &:hover .littleTextWidth {
              width: 100%;
            }
            &:hover .moreTextWidth {
              width: 280px;
            }
          }
          .data-authorities-name div {
            display: none;
          }
          .margin-bottom-5px {
            margin-bottom: 5px;
          }
          .margin-left-70px {
            margin-left: 70px;
          }
        }
        .white-color {
          color: #ffffff;
        }
        .light-white-color {
          color: rgba(255, 255, 255, 0.7);
        }
        .light-black-color {
          color: rgba(0, 0, 0, 0.54);
        }
        .black-color {
          color: rgba(0, 0, 0, 0.67);
        }
        .blue-color {
          color: #298df7;
        }
        .border-bottom-white {
          border-bottom: 2px solid #e0e0e0 !important;
          &:focus {
            border-bottom: 2px solid #ffffff !important;
          }
        }
        .border-bottom-blue {
          outline: none;
          padding-bottom: 3px;
          font-size: 14px;
          border-bottom: 2px solid #e0e0e0 !important;
          &:focus {
            border-bottom: 2px solid #298df7 !important;
          }
        }
        .role-list-item:hover {
          background: rgba(255, 255, 255, 0.12);
        }
        .operator {
          color: #ffffff;
          &.disabled {
            opacity: 0;
            cursor: default;
          }
        }
        .operator.active {
          background: rgba(255, 255, 255, 0.12);
          color: #ffffff;
        }
      }
      .other-col {
        .join-role-scroll-area {
          overflow: auto;
          overflow-x: hidden;
          width: 474px;
          position: relative;
          z-index: 1 !important;
          &::-webkit-scrollbar {
            display: none;
          }
        }
        .form-group {
          .distribution-select .btn-group {
            border: none;
            .form-control.dropdown-toggle {
              background: transparent;
              font-size: 16px;
              color: rgba(0, 0, 0, 0.67);
              border: none;
              box-shadow: none;
              margin-top: -5px;
              font-weight: 500;
              padding: 6px 24px 6px 0;
              i {
                color: rgba(0, 0, 0, 0.54);
              }
            }
          }
          .more-opt-menu {
            position: relative;
            float: right;
            right: 0;
            min-width: auto;
          }
          .errorMsg {
            height: 20px;
            font-size: 13px;
            height: 20px;
            font-weight: 500;
            color: #ff5252;
            opacity: 0;
            margin-left: 70px;
            transition: all 0.3s cubic-bezier(0.94, -0.25, 0.32, 1.31);
            &.show {
              opacity: 1;
            }
          }
          .participant-read-write-content {
            overflow-y: scroll;
            width: 474px;
            // max-height: 600px;
            margin-bottom: 15px;
            &::-webkit-scrollbar {
              display: none;
            }
          }
          .participant-read-write-header {
            // height: 50px;
            background: #ffffff;
          }
          .role-set-content {
            // margin-top: 50px;
            overflow-y: scroll;
            width: 474px;
            &::-webkit-scrollbar {
              display: none;
            }
            // max-height: 455px;
          }
          .creat-role-input .name-input {
            border: none;
            box-shadow: none;
            border-radius: 0;
            background: transparent;
            width: 77%;
            margin-left: 70px;
            font-size: 14px;
            font-weight: 500;
            padding: 5px;
          }
          .padding-right-70px {
            padding-right: 70px !important;
          }
          .creat-btn-group {
            margin: -36px 18px 0 0;
            .creat-cancle {
              padding: 6px 0;
              font-size: 13px;
              color: rgba(0, 0, 0, 0.4);
              font-weight: 500;
              background: #ffffff;
            }
            .creat-sure {
              padding: 6px 0;
              font-size: 13px;
              font-weight: 500;
              background: #ffffff;
            }
          }
          .creat-new-role {
            font-size: 13px;
            margin-left: 7px;
            font-weight: 500;
            text-decoration: underline;
            cursor: pointer;
          }
          .batch-head {
            background: rgba(0, 0, 0, 0.08);
            margin-top: 0;
            .form-control.dropdown-toggle {
              color: rgba(0, 0, 0, 0.67);
              i {
                color: rgba(0, 0, 0, 0.67);
              }
            }
          }
          .dividing-line {
            width: 316px;
            margin-left: 70px;
            height: 1px;
            background: rgba(0, 0, 0, 0.08);
            margin-top: 9px;
            margin-bottom: -4px;
          }
          .role-list-batch {
            margin-top: 10px;
          }
          .batch-dividing-line {
            height: 1px;
            width: 316px;
            background: rgba(0, 0, 0, 0.08);
            margin-top: 7px;
            margin-left: 70px;
          }
          .role-list-item:hover {
            background: rgba(0, 0, 0, 0.08);
          }
          .operator {
            color: rgba(0, 0, 0, 0.54);
            &.disabled {
              opacity: 0;
              cursor: default;
            }
          }
          .operator.active {
            background: rgba(0, 0, 0, 0.08);
            color: rgba(0, 0, 0, 0.67);
          }
        }
        .fiexd-header {
          display: none;
          border-top: 1px solid rgba(0, 0, 0, 0.08);
          .participant-read-write-header {
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.12),
              0 4px 4px 0 rgba(0, 0, 0, 0.12);
          }
        }
        .fiexd-batch-head {
          border-top: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.12),
            0 4px 4px 0 rgba(0, 0, 0, 0.12);
          display: none;
        }
      }
      .role-list-item {
        height: 28px;
        width: 100%;
        padding-top: 4px;
        margin-bottom: 2px;
        .col-xs-5 {
          padding: 0;
        }
        .col-xs-7 {
          padding-left: 0;
        }
      }
      .operator {
        font-size: 13px;
        color: rgba(0, 0, 0, 0.54);
        padding: 5px 8px;
        font-weight: 500;
        margin-right: -2px;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      .operator.active {
        background: rgba(0, 0, 0, 0.08);
        border-radius: 2px;
        color: rgba(0, 0, 0, 0.67);
      }
      .more-icon {
        font-size: 24px;
        color: rgba(0, 0, 0, 0.67);
        // margin: -53px 10px 0 0;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      .role-set-head {
        height: 47px;
      }
    }
    .add-role {
      display: inline-block;
      vertical-align: top;
      .add-btn {
        font-size: 13px;
        color: #298df7;
        background: rgba(0, 0, 0, 0.08);
        border-radius: 2px;
        padding: 13px 17px;
        margin: 0 67px 0 20px;
        border: 0;
      }
    }
    .clear-bord-bottom {
      border-bottom: 0 solid #fff !important;
    }
    .clear-padding-bottom {
      padding-bottom: 0 !important;
    }
    .set-margin-top-15px {
      margin-top: 15px;
    }
    .owner-read-write-header {
      // height: 50px;
    }
    .name-error-tip {
      color: tomato;
    }
    .input-group.half {
      width: auto;
      padding-right: 12px;
      display: inline-block;
    }
  }
  .data-authorities-name {
    padding-left: 70px;
  }
  .role-list.grow_1 {
    height: 100%;
    padding-bottom: 160px;
    background: white;
    &:hover {
      background: rgba(0, 0, 0, 0.08);
    }
  }
  .select_top {
    padding-left: 60px;
    i.maticon {
      color: gray;
      font-size: 20px;
    }
  }
}
</style>