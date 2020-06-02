<template>
  <div id="fts-messageManage" class="message-manage-page" :class="!nowPage?'overflow-auto':''">
    <!-- 消息列表 -->
    <div v-show="nowPage">
      <v-table
        ref="studentTable"
        :url="allMessageUrl+timestamp+'&type='+type"
        :columns="columns"
        pagesize="15"
        idField="id"
        :multiple="false"
        :order="true"
        :search="false"
      >
        <div slot="btn-group">
          <div v-if="type === 'COLLEGE'" class="btn-group pull-left">
            <v-select :value="currentCollegeId" :options="collegeOptions" @afterSelected="changeCollege"></v-select>
          </div>
          <div class="pull-right">
            <button
              class="btn btn-bgColor-style clearBtnBorder"
              @click="_addMessage"
            >新建消息</button>
          </div>
        </div>
      </v-table>
    </div>
    <!-- 消息查看 -->
    <div class="check-page" v-if="curMessage">
      <div class="check-page-header">
        <i
          class="maticon pull-left"
          style="color:#777777;top:5px !important;font-size:18px !important;cursor:pointer;"
          v-html="icons('arrow_back')"
          @click="curMessage = null;nowPage = true"
        ></i>
        <span 
          style="margin-top:2px;display:inline-block;font-size:14px;cursor:pointer;"
          @click="curMessage = null;nowPage = true"
        >查看消息</span>
      </div>
      <div class="check-page-content container-fluid">
        <div class="row rooo">
          <span class="left-span">标题:</span>
          <span class="right-span">{{curMessage.title}}</span>
        </div>
        <div class="row rooo">
          <span class="left-span">消息内容:</span>
          <div class="right-span" v-html="curMessage.content"></div>
        </div>
        <div class="row rooo">
          <span class="left-span">接收人:</span>
          <span class="right-span">{{curMessage.receiveTypeName}}</span>
        </div>
        <!-- <div class="row"> -->
        <v-table :url="checkUrl" :columns="checkColumns" pagesize="10" idField="id" :order="true" :search="false"></v-table>
        <!-- </div>  -->
      </div>
    </div>
    <!-- 新建消息 -->
    <div class="check-page" v-if="newMessage">
      <div class="check-page-header">
        <i
          class="maticon pull-left"
          style="color:#777777;cursor:pointer"
          v-html="icons('arrow_back')"
          @click="newMessage = false;nowPage = true"
        ></i>
        <span 
          @click="newMessage = false;nowPage = true" 
          style="margin-top:2px;display:inline-block;font-size:14px;cursor:pointer;"
        >新建消息</span>
      </div>
      <div class="check-page-content container-fluid">
        <div class="row rooo">
          <span class="left-span">接收人:</span>
          <input
            type="text"
            placeholder="选择接收人"
            :disabled="showSendMan"
            @click="showSendMan = true"
            v-model="sendPerStr"
            sytle="cursor:default;"
          >
        </div>
        <div class="row rooo">
          <span class="left-span">标题:</span>
          <input type="text" placeholder="请输入消息标题" v-model="messageTitle">
        </div>

        <div class="row rooo" style="height:510px">
          <span class="left-span">正文:</span>
          <u-editor
            style="display:inline-block;vertical-align:top;width:80%;"
            ref="description"
            :config="editorConfig"
            v-model="contentValue"
          ></u-editor>
        </div>
        <div class="row rooo">
          <div style="margin-left:133px ">
            <span class="left-span">是否需要接收者确认:</span>
            <select
              name
              id
              style="height:23px;border-radius:5px;outline: none;"
              v-model="isReceive.status"
            >
              <option :value="list.id" v-for="(list,i) in isReceive.list" :key="i">{{list.val}}</option>
            </select>
          </div>
        </div>
        <div class="row rooo">
          <div style="width:25%;margin-left:42%;margin-bottom:20px">
            <button type="button" class="btn sendbtn" :disabled="sendLoading.send" @click="immediatelySend('immed')">立即发送</button>
            <button type="button" class="btn sendbtn" :disabled="sendLoading.sendTiming" @click="showTimingSendMan">定时发送</button>
          </div>
        </div>
      </div>
    </div>
    <!-- 选择接收人弹窗 -->
    <v-modal :show="showSendMan" effect="fade" width="800">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">请选择信息接收人</h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <v-tree
          v-if="downItemArray.length"
          id="resourceTree"
          ref="treeMe"
          cascade="true"
          :items="downItemArray"
          :checkable="true"
          :search="false"
          :multiple="false"
          :collapsed="false"
          @itemClick="_itemClick"
          @clickChild="clickChild"
        ></v-tree>
        <div class="empty-prompt" v-else>暂无数据...</div>
        <v-table
          v-show="selfSettingModel"
          :url="url"
          :rows="rows"
          :columns="columnsSetting"
          pagesize="10"
          idField="id"
          :order="true"
        >
          <div slot="btn-group" class="pull-right">
            <a class="btn clearBtnBorder" @click="_clearMember">清空</a>
            <!-- <a class="btn clearBtnBorder " @click="_importData">导入名单</a> -->
            <a class="btn clearBtnBorder new message-manage-add" @click="_addMember">
              <i class="maticon pull-left" v-html="icons('add')"></i>新增成员
            </a>
          </div>
        </v-table>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showSendMan = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="insure()">确定</button>
      </div>
    </v-modal>
    <!-- 定时发送弹窗 -->
    <v-modal :show="timingSendParams.timingSendMan" effect="fade" width="500">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">定时发送</h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <p class="send-p">选择定时发送时间:</p>
        <dateLinkage
          v-if="timingSendParams.timingSendMan"
          @dateSelected="_dateSelected"
          :sourceDateProp="sourceDateProp"
        ></dateLinkage>
        <p v-if="timingSendParams.sendTimeValue" class="send-p">
          本消息将在
          <span class="sign">{{timingSendParams.sendTimeValue}}</span> 发送至家校通小程序。
        </p>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button
          type="button"
          class="btn cancel-btn clearBtnBorder"
          @click="timingSendParams.timingSendMan = false"
        >取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="timingSendSure">确定</button>
      </div>
    </v-modal>
    <!-- 新增成员弹窗 -->
    <v-modal :show="showAddModal" effect="fade" width="500">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">新增人员</h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <!-- <div class="modal-search-user">
          <detect
            url="/api/message/queryUser"
            placeholder="请输入姓名或学工号"
            @afterSelected="editConsultantAfterSelected"
          ></detect>
        </div>
        <div class="consultant-name-list">
          <div
            class="consultant-name"
            v-for="(item, index) in newMembersArr"
            :key="index"
            @click="deleteConsultant(item)"
          >
            <i class="maticon" v-html="icons('clear')">clear</i>
            {{item.name}}
          </div>
        </div>-->
        <div class="form-group">
          <label class="input-label">学号</label>
          <input
            id="user-no"
            type="text"
            class="form-control search-input modal-form-style"
            @change="checkAddUser"
            v-model="member.userNo"
          >
          <button type="button" class="btn check-btn clearBtnBorder" @click="checkAddUser">检测</button>
          <p class="error-message">{{member.errorMessage}}</p>
        </div>
        <div class="form-group">
          <label class="input-label">姓名</label>
          <input
            type="text"
            class="form-control search-input modal-form-style"
            disabled="disabled"
            v-model="member.userName"
          >
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showAddModal = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="sureAddMember">确定</button>
      </div>
    </v-modal>
    <!-- 批量添加模板页    包括组织成员信息的批量添加模板页 -->
    <v-import v-bind="importParams" @backParentPage="importPageBack" v-if="importPage"></v-import>
  </div>
</template>
<script>
import { sAjax, request } from "../../assets/utils/utils.js";
import { constants } from "fs";
import dateLinkage from "../messageBox/dateLinkage.vue";
export default {
  props: {
    data: {
      default: null
    },
    dateFormat: {
      default: "yyyy-MM-dd hh:ii:ss"
    }
  },
  components: {
    dateLinkage
  },
  data: function() {
    return {
      sendLoading:{
        sendTiming:false,
        send:false
      },
      type: '',
      replyList: [
        {label: "有回复", value: "1"},
        {label: "无回复", value: "0"},
        {label: "不需回复", value: "2"},
      ],
      classList: [],
      collegeOptions: [],
      currentCollegeId: '',
      sourceDateProp: new Date().getTime(),
      newMembersArr: [], // 成员检查下拉列表
      collDictType: [], // 学院类别字典
      stuDictType: [], // 学生类别字典
      userInfo: "",
      importPage: false, // 控制批量添加模板页
      importParams: {
        //批量添加模板页参数
      },
      showAddModal: false, //  新增成员弹窗
      member: {
        // 新增成员参数
        message: "",
        userId: "",
        userNo: "",
        userName: "",
        detail: ""
      },
      timingSendParams: {
        placeholder: "请选择发送时间",
        sendTimeValue: "", //  发送时间
        timingSendMan: false, //  定时发送
        timestamp: ""
      },
      isReceive: {
        //  是否接收
        list: [{ id: 1, val: "是" }, { id: 0, val: "否" }],
        status: 1
      },
      contentValue: "", //  消息内容
      messageTitle: "", //  消息标题
      sendPerStr: [], //  发送人员string
      sendPerIdList: {
        //  发送人员列表
        school: "",
        collegeId: [],
        student: "",
        classId: [],
        toUserId: []
      },
      selfSettingModel: false,
      editorConfig: {
        initialFrameHeight: 420
      },
      nowPage: true,
      allMessageUrl: "/table-data/fts/notice/getNoticeList?timestamp=",
      timestamp: new Date().getTime(),
      url: "",
      checkUrl: "",
      showSendMan: false,
      downItemArray: [], // 信息接收人
      rows: [],
      columns: [],
      columnsSetting: [],
      checkColumns: [],
      curMessage: null,
      newMessage: false
    };
  },
  created() {
    let that = this;
    this.type = this.$route.query.type

    if(this.type === "COLLEGE") {
      this.getRole();
    }
    this.getStuDictType();
    this.getCollDictType();
    this.getClassList();
    this._initColumns();

    sAjax({
      url: "/api/fts/notice/authority",
      type: "get",
      success: data => {
        if (data.state) {
          let dataD = data.data;
          if (dataD.allSchool) {
            that.downItemArrayAddItem(
              "1",
              "全校在校生",
              true,
              "ALL_SCHOOL"
            );
          }
          if (
            dataD.college &&
            dataD.collegeName &&
            dataD.collegeName.length > 0 &&
            dataD.collegeId &&
            dataD.collegeId.length > 0
          ) {
            that.downItemArrayAddItem(
              "2",
              "学院",
              false,
              "COLLEGE",
              dataD.collegeId,
              dataD.collegeName
            );
          }
          if (dataD.leadStudent) {
            that.downItemArrayAddItem("4", "所带学生", false, "LEAD_STUDENT");
          }
          that.downItemArrayAddItem("5", "自定义名单", false, "CUSTOMIZE");
        } else {
          this.$toast(data.message);
        }
      }
    }).always(() => {});
  },
  methods: {
    getRole() {
      let that = this
      sAjax({
        url: '/api/fts/user/getUserRole',
        dataType: 'json',
        type: 'get',
        success: function (result) {
          if (result.state) {
            let url = "/api/fts/dict/getOwnerUnitList"
            if(result.data == "SCHOOL_LEVEL") {
              url = "/api/fts/dict/getUnitList"
            }
            that.getCollegeList(url)
          } else {
            that.$toast(result.message)
          }
        }
      })
    },
    getCollegeList(url) {
      let that = this
        
      sAjax({
        url: url,
        dataType: 'json',
        type: 'get',
        success: function (result) {
          if (result.state) {
            if (result.data.length > 0) {
              that.collegeOptions = result.data
              that.currentCollegeId = that.collegeOptions[0].value
              that.allMessageUrl = '/table-data/fts/notice/getNoticeList?college=' + that.currentCollegeId + '&timestamp='
            } else {
              // that.$toast(this.translate.noManageCollegeTip)
            }
          } else {
            that.$toast(result.message)
          }
        }
      })
    },
    changeCollege: function (data) {
      this.currentCollegeId = data.val
      this.allMessageUrl = '/table-data/fts/notice/getNoticeList?college=' + this.currentCollegeId + '&timestamp='
    },
    _initColumns() {
      this.columns = [
        {
          id: "title",
          title: "名称",
          className: "text-left",
          width: 120,
          hidden: false,
          search: {
            type: "input"
          }
        },
        {
          id: "sendTime",
          title: "发送时间",
          className: "text-left",
          width: 150,
          hidden: false,
          search: {
            type: "datetime",
            data: {
              dateFormat: 'yyyy-MM-dd',
              change: ({ value, target }) => {
                this.allMessageUrl = `/table-data/fts/notice/getNoticeList?sendTimeBegin=${
                  this.$refs.studentTable.tableSearchFields["sendTime_start"]?this.$refs.studentTable.tableSearchFields["sendTime_start"].substr(0,10):''
                }&sendTimeEnd=${
                  this.$refs.studentTable.tableSearchFields["sendTime_end"]?this.$refs.studentTable.tableSearchFields["sendTime_end"].substr(0,10):''
                }&timestamp=`;
              }
            }
          }
        },
        {
          id: "browseCount",
          title: "浏览数",
          className: "text-left",
          width: 120,
          hidden: false
        },
        {
          id: "replyCount",
          title: "回复数",
          className: "text-left",
          width: 130,
          hidden: false,
          search: {
            type: "select",
            data: {
              options: this.replyList,
              optionsLabel: "label",
              optionsValue: "value",
            }
          }
        },
        {
          id: "opts",
          title: "操作",
          className: "text-left",
          width: 80,
          hidden: false,
          options: [
            {
              tag: "a",
              text: "查看",
              callback: (record, index) => {
                // this.curMessage = record;
                sAjax({
                  url: "/api/fts/notice/getNoticeDetailPc?id="+ record.id,
                  type: "get",
                  success: data => {
                    if (data.state) {
                      this.curMessage = data.data;
                    } else {
                      this.$toast(data.message);
                    }
                  }
                })
                this.checkUrl =
                  "/table-data/fts/notice/getReceiveUserChildrenList?noticeId=" + record.id;
                  this.nowPage = false;
              }
            },
            {
              tag: "a",
              text: "删除",
              callback: (record, index) => {
                if(confirm("您确定要删除该消息通知？")) {
                  sAjax({
                    url: "/api/fts/notice/deleteNoticeById?ids="+ record.id,
                    type: 'post',
                    success: data => {
                      if (data.state) {
                        this.timestamp = new Date().getTime()
                      } else {
                        this.$toast(data.message);
                      }
                    }
                  })
                }
              }
            }
          ]
        }
      ];
      this.columnsSetting = [
        {
          id: "name",
          title: "姓名",
          width: 120,
          hidden: false,
          search: {}
        },
        {
          id: "userNo",
          title: "学号",
          width: 150,
          hidden: false,
          search: {}
        },
        {
          id: "collegeName",
          title: "学院",
          width: 120,
          hidden: false,
          search: {}
        },
        {
          id: "studentTypeD",
          title: "学生类型",
          width: 130,
          hidden: false,
          search: {}
        },
        {
          id: "opts",
          title: "操作",
          width: 80,
          hidden: false,
          options: [
            {
              tag: "a",
              text: "删除",
              callback: (record, index) => {
                this.rows = this.rows.filter(item => {
                  return item.userNo != record.userNo;
                });
                this.$toast("删除成功");
              }
            }
          ]
        }
      ];
      this.checkColumns = [
        {
          id: "name",
          title: "学生姓名",
          width: 120,
          hidden: false,
          search: {
            type: "input"
          }
        },
        {
          id: "studentId",
          title: "学工号",
          width: 120,
          hidden: false,
          search: {
            type: "input"
          }
        },
        {
          id: "college",
          title: "学院",
          width: 120,
          hidden: false,
          search: {
            type: "select",
            data: {
              url: `/api/fts/dict/getUnitList`,
              optionsLabel: "label",
              optionsValue: "value",
            }
          }
        },
        {
          id: "className",
          title: "班级",
          width: 120,
          hidden: false,
          search: {
            type: "select",
            data: {
              options: this.classList,
              optionsLabel: "label",
              optionsValue: "value"
            }
          },
        },
        {
          id: "isRead",
          title: "家长查阅状态",
          width: 120,
          hidden: false,
          formatter: record => {
            return record.isRead == null ? '' : record.isRead   == "1"
              ? '<span class="stutus-color">已接收</span>'
              : '<span class="stutus-color">未接收</span>';
          },
          search: {
            type: "select",
            data: {
              options: [{label: "已接收", value: "1"},{label: "未接收", value: "0"},],
              optionsLabel: "label",
              optionsValue: "value"
            }
          }
        }
      ];
    },
    getClassList() {
      sAjax({
        url: "/api/fts/dict/getClassList",
        dataType: "json",
        type: "get",
        async: false,
        success: (result) => {
          if (result.state) {
            this.classList = result.data.map(item => {
              return {
                label: item,
                value: item
              }
            });
          }
        }
      });
    },
    _dateSelected(val1, val2) {
      this.timingSendParams.timestamp = val1;
      this.timingSendParams.sendTimeValue = val2;
    },
    judgeLast(str, symbol) {
      // 判断最后一位
      if (str.substr(str.length - 1, 1) == symbol) {
        str = str.slice(0, str.length - 1);
      }
      return str;
    },
    disposeSendPerStr(number, title) {
      // 处理SendPerStr字段
      this.sendPerStr = title;
      if (this.sendPerStr > 50) {
        this.sendPerStr =
          this.sendPerStr.slice(0, 50) + "...(" + number + "人)";
      } else {
        this.sendPerStr =
          this.sendPerStr.slice(0, this.sendPerStr.length - 1) +
          "(" +
          number +
          "人)";
      }
      this.sendPerStr = this.judgeLast(this.sendPerStr, ",");
    },
    getIntegrals(type, params, title) {
      // 获取查询的人数
      let url = "";
      let that = this;
      switch (type) {
        case "ALL_SCHOOL":
          url = "/api/fts/notice/getAllStudentCount";
          break;
        case "COLLEGE":
          url = "/api/fts/notice/getCollegeCount?code=" + params;
          break;
        case "LEAD_STUDENT":
          url = "/api/fts/notice/getLeadStudentCount";
          break;
      }
      sAjax({
        url: url,
        type: "get",
        success: data => {
          if (data.state) {
            this.disposeSendPerStr(data.data, title);
          } else {
            this.sendPerStr = this.judgeLast(this.sendPerStr, ",");
            this.$toast(data.message);
          }
        }
      }).always(() => {
        this.showSendMan = false;
      });
    },
    editConsultantAfterSelected: function(data) {
      var isAdd = true;
      this.newMembersArr.forEach((ele, index) => {
        if (data.userId === ele.userId) {
          this.$toast("该成员已在列表上");
          isAdd = false;
          return;
        }
      });
      if (isAdd) {
        this.newMembersArr.push({
          name: data.name,
          userId: data.userId,
          userNo: data.userNo,
          organizationName: data.organizationName
        });
      }
    },
    deleteConsultant: function(data) {
      // 新增新人检查
      this.newMembersArr.forEach((ele, index) => {
        if (ele.userId === data.userId) {
          this.newMembersArr.splice(index, 1);
        }
      });
    },
    getCollDictType() {
      // 学院类别字典
      sAjax({
        url: "/api/colleges",
        type: "get",
        success: data => {
          if (data.state) {
            this.collDictType = data.data;
          } else {
            this.$toast(data.message);
          }
        }
      }).always(() => {});
    },
    getStuDictType() {
      // 学生类别字典
      sAjax({
        url: "/api/system/dicts?dictType=学生类别",
        type: "get",
        success: data => {
          if (data.state) {
            this.stuDictType = data.data;
          } else {
            this.$toast(data.message);
          }
        }
      }).always(() => {});
    },
    downItemArrayAddItem(id, title, checked, number, arrId, arrName) {
      //  信息接收人字段增加
      let childrenArr = [];
      if (arrId && arrName && arrName.forEach) {
        arrName.forEach((item, index) => {
          let obj = {};
          obj.pid = id;
          (obj.checked = checked),
            (obj.disabled = false),
            (obj.meta = true),
            (obj.id = arrId[index]);
          (obj.title = item), childrenArr.push(obj);
        });
      }
      this.downItemArray.push({
        id: id,
        title: title,
        edit: false,
        checked: checked,
        type: number,
        children: childrenArr
      });
    },
    _sendSelect: function(e) {
      // 选择定时发送时间
      let time = e.value;
      let timeLog = new Date(time).getTime() - new Date().getTime();
      if (timeLog < 0) {
        this.$nextTick(() => {
          this.timingSendParams.sendTimeValue = "";
          this.$toast("请选择大于当前时间的日期");
        });
      }
    },
    initSendData: function() {
      //  初始化数据列表
      this.initSendPerIdList();
      this.sendPerStr = "";
      this.messageTitle = "";
      this.contentValue = "";
      this.isReceive.status = this.isReceive.list[0].id;
      this.timingSendParams.sendTimeValue = "";
      this.timingSendParams.timingSendMan = false;
      this.timestamp = new Date().getTime();
    },
    showTimingSendMan: function() {
      // 定时发送弹窗
      if (!this.sendCheck()) return;
      this.timingSendParams.timingSendMan = true;
      this.sourceDateProp = new Date().getTime();
    },
    timingSendSure: function() {
      //  定时发送确定
      if (this.timingSendParams.timestamp < new Date().getTime()) {
        this.$toast("您设置的定时时间已经过期");
        return;
      }
      if (!this.timingSendParams.sendTimeValue) {
        this.$toast("请选择时间");
        return;
      }
      this.immediatelySend("timing");
    },
    immediatelySend: function(type) {
      // 立即发送
      if (!this.sendCheck()) return;
      var that = this;
      let receiveType = this.downItemArray.find(item => item.checked).type
      let data = {
        title:that.messageTitle,
        content:that.contentValue,
        type: this.type,
        receiveType:receiveType,
        needReply: this.isReceive.status == 1?true:false,
        needRegular: type=="timing"?true:false,
        sendTime: null,
        receiveCollegeCodeList:receiveType == "COLLEGE" ? this.sendPerIdList.collegeId : [],
        receiveUserIdList: receiveType == "CUSTOMIZE" ? this.sendPerIdList.toUserId : [],
      }
      if (type == "timing") {
        data.sendTime = this.timingSendParams.sendTimeValue+":00"
        this.sendLoading.sendTiming = true
      }
      else{
        this.sendLoading.send = true
      }
      request("/api/fts/notice/addNotice", data, "post").then((result) => {
        if (result.state) {
          that.initSendData();
          that.$toast("发送成功");
          that.newMessage = false;
          that.nowPage = true;
          that.rows = [];
        } else {
          that.$toast(result.message);
        }
        this.sendLoading.sendTiming = false
        this.sendLoading.send = false
      })
      // sAjax({
      //   url: "/api/fts/notice/addNotice",
      //   dataType: "json",
      //   type: "post",
      //   data: data,
      //   success: function(result) {
      //     if (result.state) {
      //       that.initSendData();
      //       that.$toast("发送成功");
      //       that.newMessage = false;
      //       that.nowPage = true;
      //       that.rows = [];
      //     } else {
      //       that.$toast(result.message);
      //     }
      //   }
      // }).always(() => {
      //   this.sendLoading.sendTiming = false
      //   this.sendLoading.send = false
      // });
    },
    sendCheck: function() {
      // 发送判空
      if (!this.sendPerStr.length) {
        this.$toast("请选择接收人");
        return;
      }
      if (!this.messageTitle) {
        this.$toast("请输入消息标题");
        return;
      }
      if (!this.contentValue) {
        this.$toast("请输入内容");
        return;
      }
      return true;
    },
    clickChild(obj) {
      // 子节点点击事件
      let itemId = obj.item.id;
      let itempId = obj.item.pid;
      let curPid = -1;
      this.$nextTick(() => {
        this.downItemArray.map(item => {
          itempId == item.id
            ? ((item.checked = true), (curPid = item.id))
            : (item.checked = false);
          item.children.map(item_i => {
            item_i.id == itemId
              ? (item_i.checked = true)
              : curPid == item_i.pid
              ? ""
              : (item_i.checked = false);
          });
        });
      });
    },
    _itemClick(index, id) {
      // 父节点点击事件
      this.downItemArray.map((item, i) => {
        if (item.id == id) item.checked = true;
        else item.checked = false;
        item.children.map(item_i => {
          if (index == i) item_i.checked = true;
          else item_i.checked = false;
          return item_i;
        });
        return item;
      });
      if (id == "5") {
        this.selfSettingModel = true;
      } else {
        this.selfSettingModel = false;
      }
    },
    initSendPerIdList() {
      // 初始化发送人员列表
      this.sendPerIdList = {
        school: "",
        collegeId: [],
        student: "",
        classId: [],
        toUserId: []
      };
    },
    setSendPerIdList(pList, type) {
      // 设置发送列表
      let list = {
        title: "",
        arr: ""
      };
      let arr = [];
      if (pList[0].children && pList[0].children.length > 0) {
        pList[0].children.forEach(item => {
          if (item.checked) {
            list.title += item.title + ",";
            arr.push(item.id);
          }
        });
        list.arr = arr;
      }
      return list;
    },
    insure() {
      // 选择接收人确认
      let that = this;
      let cList = this.$refs.treeMe.getChecked();
      this.sendPerStr = "";
      let list = [];
      this.initSendPerIdList();
      if (cList.length == 0) {
        this.$toast("请选择发送人员");
        return;
      }
      switch (cList[0].id) {
        case "1": //全校
          that.sendPerIdList.school = "true";
          that.getIntegrals("ALL_SCHOOL", "", cList[0].title);
          break;
        case "2": //学院
          list = that.setSendPerIdList(cList);
          that.sendPerIdList.collegeId = list.arr;
          that.getIntegrals("COLLEGE", encodeURI(list.arr), list.title);
          break;
        case "4": //学生
          that.sendPerIdList.student = "true";
          that.getIntegrals("LEAD_STUDENT", "", cList[0].title);
          break;
        case "5": //自定义
          let toUserId = [];
          let sendPerStr = "";
          this.rows.forEach(item => {
            sendPerStr += item.name + ",";
            toUserId.push(item.userId);
          });
          this.sendPerIdList.toUserId = toUserId;
          this.disposeSendPerStr(this.rows.length, sendPerStr);
          this.showSendMan = false;
          break;
      }
    },
    _addMessage: function() {
      // 控制新建消息弹窗
      this.rows = [];
      this.newMessage = true;
      this.nowPage = false;
    },
    _clearMember: function() {
      // 清空自定义名单
      if (this.rows.length == 0) return;
      if (window.confirm("删除后数据无法恢复，确定删除吗？")) {
        this.rows = [];
        this.$toast("删除成功");
      }
    },
    _addMember: function() {
      //  控制新增成员弹窗
      this.showAddModal = true;
      this.member = {
        message: "",
        userId: "",
        userNo: "",
        userName: "",
        detail: ""
      };
    },
    sureAddMember: function() {
      // this.rows = this.newMembersArr;
      // this.newMembersArr = []
      // this.showAddModal =false;
      //  新增成员确定
      var that = this;
      let detail = this.member.detail;
      if (detail == "") {
        this.$toast("用户不存在!");
        return;
      }
      this.stuDictType.forEach(item => {
        if (item.value == detail.studentType) {
          detail.studentTypeD = item.label;
        }
      });
      this.collDictType.forEach(item => {
        if (item.code == detail.college) {
          detail.collegeName = item.name;
        }
      });
      if (JSON.stringify(this.rows).indexOf(JSON.stringify(detail)) == -1) {
        this.rows.push(detail); // 进行动态的操作
        this.showAddModal = false;
      } else {
        this.$toast("不能添加重复的成员!");
        return;
      }
    },
    checkAddUser: function() {
      //  检测成员是否存在
      sAjax({
        url: "/api/users/" + this.member.userNo,
        type: "GET",
        success: data => {
          if (data.state) {
            this.member.userId = data.data.userId;
            this.member.userName = data.data.name;
            this.member.errorMessage = "";
            this.member.detail = data.data;
          } else {
            this.$set(this.member, "errorMessage", "用户不存在")
            this.member.userId = "";
            this.member.userName = "";
            this.member.detail = "";
            this.$toast(data.message);
          }
        }
      });
    },
    importPageBack() {
      // 批量导入返回上一级
      this.newMessage = true;
      this.showSendMan = true;
      this.importPage = false;
    },
    _importData: function() {
      // 导入名单
      this.$toast("导入功能正在升级中...");
      return;
      // this.newMessage =false;
      // this.showSendMan = false;
      // this.importPage = true;
      // this.importParams = {
      //   parentPageTitle: '自定义名单',
      //   downloadTemplateUrl: '/partyBuild/organizations/excel/template',
      //   downloadErrorTemplateUrl: '/partyBuild/organizations/excels/errorExcels',
      //   checkTemplateUrl: this.curRoute_name === 'school'?'/partyBuild/organizations/excel?rank=SCHOOL&college='+this.collegeId:'/partyBuild/organizations/excel?rank=COLLEGE&college='+this.collegeId,
      //   templateName: '批量自定义名单模板',
      //   importBtnType: [{
      //     name: '覆盖导入',
      //     url: '/partyBuild/organizations/import',
      //     method: 'post',
      //     isShowBtn: true,
      //     success: (data) => {
      //       if (data.state) {
      //         this._refreshTable()
      //       }
      //     }
      //   }]
      // }
    }
  }
};
</script>
<style lang="less">
// .modal-body {
//   .consultant-name-list {
//     min-height: 50px;
//     padding: 16px 27px 0 0;
//     .consultant-name {
//       border: 1px solid #d9d9d9;
//       border-radius: 3px;
//       font-size: 15px;
//       color: #333333;
//       display: inline-block;
//       position: relative;
//       padding: 6px 16px;
//       margin-right: 12px;
//       margin-bottom: 10px;
//       cursor: pointer;
//       i {
//         font-size: 11px;
//         color: #9a9a9a;
//         position: absolute;
//         right: 0;
//       }
//     }
//   }
// }
.u-editor-warp {
  border: 1px solid red;
}
#fts-messageManage {
  .message-manage-add {
    background: #298df7 !important;
  }
  .edui-editor-iframeholder {
    border: solid 1px rgb(200, 200, 200);
    width: inherit!important;
  }
  .edui-default .edui-editor-bottomContainer td {
    border-top: none;
  }
  .v-datepicker-area .v-datepicker-area-div {
    width: 350px;
  }
  .table-container .table thead th:nth-child(6) .column-content,
  .table-data thead .table-head th:nth-child(6) div,
  table th:nth-child(6) .column-content {
    overflow: inherit !important;
  }
}
.empty-prompt {
  text-align: center;
  color: #70727c;
  margin: 20px auto;
}
.stutus-color {
  color: #6797f7;
}
.send-p {
  font-size: 12px;
  color: #666666;
  letter-spacing: 0.1px;
  text-align: left;
  margin: 10px 0;
  .sign {
    color: #3f51b5;
  }
}
.overflow-auto {
  overflow: auto;
}
.message-manage-page {
  position: relative;
  width: 100%;
  height: 100%;
  min-width: 1000px;
  .sendbtn {
    background: #298df7;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
    border-radius: 4px;
    font-size: 13px;
    color: #ffffff;
    line-height: 13px;
    font-weight: 500;
    padding: 11px 16px;
    margin: 0 16px 0 12px;
  }
  .new {
    font-size: 13px;
    color: #ffffff !important;
    line-height: 28px;
    background: #298df7;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
    border-radius: 4px;
    i {
      float: left;
      margin-right: 2px;
      font-size: 24px;
      color: #ffffff;
    }
  }
  .check-page {
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
    background: #fff;
    .check-page-header {
      border-bottom: 1px solid #d9d9d9;
      padding: 5px 10px;
      // border-bottom: 1px solid #e0e0e0;
      span {
        font-size: 18px;
        color: #777777;
        letter-spacing: 0;
        line-height: 24px;
      }
    }
    .check-page-content {
      padding: 10px 15px;
      .rooo {
        margin-top: 8px;
      }
      .rooo input {
        width: 80%;
        height: 40px;
        border: none;
        background: #f5f5f5;
        color: rgb(0, 0, 0, 0.67);
        border-radius: 10px;
        outline: none;
        box-shadow: none;
        padding: 6px 12px;
      }
      .row span {
        // height: 40px;
      }
      .left-span,
      .right-span {
        display: inline-block;
        font-size: 14px;
        color: #333333;
        line-height: 32px;
        p {
          padding: 0;
        }
      }
      .left-span {
        width: 150px;
        text-align: right;
      }
      .right-span {
        padding: 0 10px;
        border: 1px solid #d9d9d9;
        border-radius: 3px;
      }
    }
    .table-container {
      box-shadow: none;
    }
  }
}
</style>
