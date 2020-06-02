<template>
  <div id="messageManage" class="message-manage-page" :class="!nowPage?'overflow-auto':''">
    <!-- 消息列表 -->
    <div v-show="nowPage">
      <v-table
        :url="allMessageUrl"
        :columns="columns"
        pagesize="15"
        idField="id"
        :multiple="false"
        :order="true"
      >
        <div slot="btn-group" class="pull-right">
          <a class="btn clearBtnBorder" @click="_addMessage">新建消息</a>
        </div>
      </v-table>
    </div>
    <!-- 消息查看 -->
    <div class="check-page" v-if="curMessage">
      <div class="check-page-header">
        <i
          class="maticon pull-left"
          style="color:#777777;top:5px !important;font-size:18px !important"
          v-html="icons('arrow_back')"
          @click="curMessage = null;nowPage = true"
        ></i>
        <span style="margin-top:2px;display:inline-block;font-size:14px">查看消息</span>
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
        <div class="row rooo" style="margin-bottom:20px">
          <span class="left-span">接收人:</span>
          <span class="right-span">{{curMessage.otherMessage}}</span>
        </div>
        <div class="row rooo1 pull-left">
          <i class="maticon pull-left" v-html="icons('person')"></i>
          <span>&nbsp;&nbsp;已读 {{readInfo.countRead}} | 未读 {{readInfo.countNotRead}}</span>
        </div>
        <div class="row rooo2 pull-right">
          <!-- <i class="maticon pull-left"  v-html="icons('person')" ></i>
          <span>&nbsp;&nbsp;已读  10 | 未读  10</span>-->
          <i
            class="maticon pull-left"
            v-if="showTable"
            @click="showTable = false"
            v-html="icons('arrow_drop_down')"
          ></i>
          <i
            class="maticon pull-left"
            v-else
            @click="showTable = true"
            v-html="icons('arrow_drop_up')"
          ></i>
        </div>
        <v-table
          v-if="showTable"
          class="table"
          :url="checkUrl"
          :columns="checkColumns"
          pagesize="10"
          idField="id"
          :order="true"
        ></v-table>
      </div>
    </div>
    <!-- 新建消息 -->
    <div class="check-page" v-if="(newMessage || fromOutSedMessage) && !nowPage">
      <div class="check-page-header">
        <i
          class="maticon pull-left"
          style="color:#777777;cursor:pointer"
          v-html="icons('arrow_back')"
          @click="backToList"
          v-if="!fromOutSedMessage"
        ></i>
        <span style="margin-top:2px;display:inline-block;font-size:14px">新建消息</span>
      </div>
      <div class="check-page-content container-fluid">
        <div class="row rooo">
          <span class="left-span">接收人:</span>
          <input
            type="text"
            placeholder="选择接收人"
            :disabled="showSendMan"
            @click="showSendMan = true;deleteArray = [];deleteNameArray = [];"
            v-model="sendPerStr"
          />
        </div>
        <div class="row rooo">
          <span class="left-span">标题:</span>
          <input type="text" placeholder="请输入消息标题" v-model="messageTitle" />
        </div>

        <div class="row rooo" style="height:510px">
          <!-- <v-table
            class="table-striped"
            :url="checkUrl"
            :rows="rows"
            :columns="computedCheckColumns"
            pagesize="10"
            idField="id"
            :order="true"
          ></v-table>-->
          <!-- border:solid 1px rgb(200,200,200);border-left:solid 1px rgb(200,200,200) -->
          <span class="left-span">正文:</span>
          <u-editor
            style="display:inline-block;vertical-align:top;width:80%;"
            ref="description"
            :config="editorConfig"
            v-model="contentValue"
          ></u-editor>
        </div>
        <div class="row rooo" style="flex-direction:column">
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
          <div style="margin-left:133px ">
            <span class="left-span">是否微信推送:</span>
            <select
              name
              id
              style="height:23px;border-radius:5px;outline: none;"
              v-model="isReceiveW.status"
            >
              <option :value="list.id" v-for="(list,i) in isReceiveW.list" :key="i">{{list.val}}</option>
            </select>
          </div>
        </div>
        <div class="row rooo">
          <div style="width:25%;margin-left:42%;margin-bottom:20px">
            <button
              type="button"
              class="btn sendbtn"
              :disabled="sendLoading.send"
              @click="immediatelySend('immed')"
            >立即发送</button>
            <button
              type="button"
              class="btn sendbtn"
              :disabled="sendLoading.sendTiming"
              @click="showTimingSendMan"
            >定时发送</button>
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
          v-if="downItemArray.length && !fromOutSedMessage"
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
        <div class="empty-prompt" v-else-if="!downItemArray.length && !fromOutSedMessage">尚无权限...</div>
        <v-table
          v-if="selfSettingModel && !fromOutSedMessage"
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

        <div style="padding:10px 0" v-if="fromOutSedMessage">
          <span>发送对象:&nbsp;&nbsp;</span>
          <v-select
            :options="OutSedMessagePeopleTypeList"
            :value="signInType"
            @afterSelected="afterSelectedType"
          ></v-select>
        </div>
        <p v-if="deleteNameArray.length>0">{{"去除人员："+deleteNameArray.toString(',')}}</p>
        <v-table
          v-if="fromOutSedMessage"
          ref="tableOut"
          :url="tableOutUrl"
          :columns="columnsSetting"
          pagesize="10"
          idField="id"
          :order="true"
        ></v-table>
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
        <!-- <v-datepicker
          v-model="timingSendParams.sendTimeValue"
          :placeholder="timingSendParams.placeholder"
          :format="dateFormat"
          @daySelected="_sendSelect"
        ></v-datepicker>-->
        <dateLinkage
          v-if="timingSendParams.timingSendMan"
          @dateSelected="_dateSelected"
          :sourceDateProp="sourceDateProp"
        ></dateLinkage>
        <p v-if="timingSendParams.sendTimeValue" class="send-p">
          本消息将在
          <span class="sign">{{timingSendParams.sendTimeValue}}</span> 投递到对方消息盒子。
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
          />
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
          />
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
import { sAjax } from "../../assets/utils/utils.js";
import { constants } from "fs";
import dateLinkage from "./dateLinkage.vue";
export default {
  props: {
    data: {
      default: null
    },
    dateFormat: {
      default: "yyyy-MM-dd hh:ii:ss"
    }
  },
  data: function() {
    return {
      tableOutUrl:'',
      signId: "",
      signInType: "ALL",
      OutSedMessagePeopleTypeList: [
        {
          label: "所有人",
          value: "ALL"
        },
        {
          label: "未签到",
          value: "NOT_SIGN"
        }
      ],
      deleteArray:[],
      deleteNameArray:[],
      outSedMessageRows: [],
      fromOutSedMessage: false,
      readInfo: "",
      sendLoading: {
        sendTiming: false,
        send: false
      },
      showTable: true,
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
        list: [
          { id: 1, val: "是" },
          { id: 0, val: "否" }
        ],
        status: 1
      },
      isReceiveW: {
        //  是否接收
        list: [
          { id: 1, val: "是" },
          { id: 0, val: "否" }
        ],
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
        toUserId: [],
        grades: [],
        educationLevels: []
      },
      selfSettingModel: false,
      editorConfig: {
        initialFrameHeight: 420
      },
      nowPage: true,
      allMessageUrl: "/table-data/message/querySendMessage?queryType=1",
      searchParams: {
        // 搜索参数列表
        title: "",
        content: "",
        name: "",
        otherMessage: "",
        createTime: ""
      },
      url: "",
      checkUrl: "",
      showSendMan: false,
      downItemArray: [], // 信息接收人
      rows: [],
      columns: [
        {
          id: "title",
          title: "消息标题",
          width: 120,
          hidden: false
        },
        {
          id: "content",
          title: "消息内容",
          width: 150,
          hidden: false,
          formatter: function(record) {
            return (
              '<div style="height:34px;overflow: hidden;">' +
              record.content.substr(0, 10) +
              "...</div>"
            );
          }
        },
        {
          id: "name",
          title: "发送人",
          width: 120,
          hidden: false
        },
        {
          id: "otherMessage",
          title: "接收人员",
          width: 130,
          hidden: false
        },
        {
          id: "isWechatPush",
          title: "微信推送",
          width: 130,
          hidden: false,
          formatter: function(record) {
            if (record.isWechatPush) {
              return "是";
            } else {
              return "否";
            }
          }
        },
        {
          id: "createTime",
          title: "发送时间",
          width: 200,
          hidden: false
          // search: {
          //   type: "datetime",
          //   data: {
          //     dateFormat: "yyyy-MM-dd"
          //   }
          // }
        },
        {
          id: "opts",
          title: "操作",
          width: 80,
          hidden: false,
          options: [
            {
              tag: "a",
              text: "查看",
              callback: (record, index) => {
                this.curMessage = record;
                this.checkUrl =
                  "/table-data/message/formMessagefo/" + record.id;
                this.nowPage = false;

                sAjax({
                  url: "/api/message/count/read/notRead/" + record.id,
                  type: "get",
                  async: false,
                  success: data => {
                    if (data.state) {
                      this.readInfo = data.data;
                    } else {
                      // this.$toast(data.message);
                    }
                  }
                }).always(() => {});
              }
            }
          ]
        }
      ],
      columnsSetting: [
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
                // this.curMessage = record;
                // this.nowPage = false;
                // this.outSedMessageRows = this.outSedMessageRows.filter(item => {
                //   return item.userNo != record.userNo;
                // });
                console.log(record)
                if (this.deleteArray.findIndex(item => item == record.userId) === -1) {
                  this.deleteNameArray.push(record.name)
                  this.deleteArray.push(record.userId)
                } else {
                  this.$toast("您已去除该人员");
                }
                // this.$toast("删除成功");
              }
            }
          ]
        }
      ],
      checkColumns: [
        {
          id: "name",
          title: "姓名",
          width: 80,
          hidden: false
        },
        {
          id: "studentId",
          title: "学工号",
          width: 80,
          hidden: false
        },
        {
          id: "collegeName",
          title: "学院",
          width: 80,
          hidden: false
        },
        {
          id: "phone",
          title: "联系方式",
          width: 80,
          hidden: false
        },
        {
          id: "alreadyRead",
          title: "平台消息",
          width: 80,
          hidden: false,
          formatter: record => {
            return record.alreadyRead == "1"
              ? '<span class="stutus-color">已接收</span>'
              : '<span class="stutus-color">未接收</span>';
          }
        },
        {
          id: "wechatPushResult",
          title: "微信推送",
          width: 80,
          hidden: false,
          formatter: record => {
            return record.wechatPushResult
              ? '<span class="stutus-color">推送成功</span>'
              : '<span class="stutus-color">推送失败</span>';
          }
        }
      ],
      curMessage: null,
      newMessage: false
    };
  },
  components: {
    dateLinkage
  },
  created() {
    if (sessionStorage.getItem("fromOutSedMessage") == "true") {
      this.fromOutSedMessage = true;
      this.rows = [];
      this.newMessage = true;
      this.nowPage = false;
      this.signId = sessionStorage.getItem("signIdSend");
      this.getData();
    } else {
      this.fromOutSedMessage = false;
    }
    sessionStorage.setItem("fromOutSedMessage", false);
    let that = this;

    sAjax({
      url: "/login/check",
      type: "get",
      success: data => {
        if (data.state) {
          this.userInfo = data.data;
        } else {
          // this.$toast(data.message);
        }
      }
    }).always(() => {});

    this.getStuDictType();
    this.getCollDictType();

    sAjax({
      url: "/api/message/authority",
      type: "get",
      success: data => {
        if (data.state) {
          let dataD = data.data;
          if (dataD.schoolStudent && dataD.schoolStudent.length > 0) {
            that.downItemArrayAddItem(
              "1",
              "全校在校生",
              true,
              dataD.schoolStudent
            );
          }
          if (
            dataD.isCollege &&
            dataD.isCollege.length > 0 &&
            dataD.collegeName &&
            dataD.collegeName.length > 0 &&
            dataD.collegeId &&
            dataD.collegeId.length > 0
          ) {
            that.downItemArrayAddItem(
              "2",
              "学院",
              false,
              dataD.isCollege,
              dataD.collegeId,
              dataD.collegeName
            );
          }
          if (
            dataD.isClass &&
            dataD.isClass.length > 0 &&
            dataD.className &&
            dataD.className.length > 0 &&
            dataD.classId &&
            dataD.classId.length > 0
          ) {
            that.downItemArrayAddItem(
              "3",
              "所带班级",
              false,
              dataD.isClass,
              dataD.classId,
              dataD.className
            );
          }
          if (dataD.isStudent && dataD.isStudent.length > 0) {
            that.downItemArrayAddItem("4", "所带学生", false, dataD.isStudent);
          }
          that.downItemArrayAddItem("5", "自定义名单", false, "");
          that.downItemArrayAddItem(
            "6",
            "年级",
            false,
            true,
            ["2019", "2018", "2017", "2016", "2015"],
            ["2019级", "2018级", "2017级", "2016级", "2015级"]
          );
          that.downItemArrayAddItem(
            "7",
            "培养层次",
            false,
            true,
            ["100", "200", "300", "400", "500", "600"],
            ["博士", "硕士", "本科", "专科", "其他", "预科"]
          );
        } else {
          this.$toast(data.message);
        }
      }
    }).always(() => {});
  },
  computed: {
    computedCheckColumns: function() {
      var arr = JSON.parse(JSON.stringify(this.checkColumns));
      if (this.curMessage && this.curMessage.isNeedSure) {
        arr.push({
          id: "status",
          title: "状态",
          width: 80,
          hidden: false,
          hover: false,
          formatter: record => {
            return `<span style="color: ${record.status ? "blue" : "red"};">${
              record.status ? "已接收" : "未接收"
            }</span>`;
          }
        });
      }
      return arr;
    }
  },
  methods: {
    afterSelectedType(o) {
      this.signInType = o.val;
      //这里刷新签到人员列表数据
      this.getData();
    },
    getData() {
      this.tableOutUrl = `/table-data/message/signInPeople?signInId=${this.signId}&signInType=${this.signInType}&timeStamp=${new Date().getTime()}`
      // sAjax({
      //   url: `/api/message/signInPeople?signInId=${this.signId}&signInType=${this.signInType}&page=0&size=9999`,
      //   type: "get",
      //   success: data => {
      //     if (data.state) {
      //       this.outSedMessageRows = data.data.content;
      //     } else {
      //       this.$toast("获取签到人员信息失败！");
      //     }
      //   }
      // }).always(() => {});
    },
    backToList() {
      this.newMessage = false;
      this.nowPage = true;
      this.allMessageUrl =
        "/table-data/message/querySendMessage?queryType=1" +
        "&timeStamp=" +
        new Date().getTime();
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
        if (this.sendPerStr.indexOf(",") > -1) {
          this.sendPerStr =
            this.sendPerStr.slice(0, this.sendPerStr.length - 1) +
            "(" +
            number +
            "人)";
        } else {
          this.sendPerStr =
            this.sendPerStr.slice(0, this.sendPerStr.length) +
            "(" +
            number +
            "人)";
        }
      }
      this.sendPerStr = this.judgeLast(this.sendPerStr, ",");
    },
    getIntegrals(type, params, title) {
      // 获取查询的人数
      let url = "";
      let that = this;
      switch (type) {
        case "school":
          url = "api/message/integralSchool";
          break;
        case "collegeId":
          url = "api/message/integralCollege?collegeId=" + params;
          break;
        case "classId":
          url = "api/message/integralClass?classId=" + params;
          break;
        case "student":
          url = "api/message/integralStudent";
          break;
        case "grades":
          url = "api/message/integralGrades?grades=" + params;
          break;
        case "educationLevels":
          url = "api/message/integralEducationLevels?educationLevels=" + params;
          break;
      }
      sAjax({
        url: url,
        type: "post",
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
        number: number,
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
      this.isReceiveW.status = this.isReceiveW.list[0].id;
      this.timingSendParams.sendTimeValue = "";
      this.timingSendParams.timingSendMan = false;
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
    urlEncode: function(param, key, encode) {
      // 拼接url地址
      let that = this;
      if (param == null) return "";
      var paramStr = "";
      var t = typeof param;
      if (t == "string" || t == "number" || t == "boolean") {
        paramStr +=
          "&" +
          key +
          "=" +
          (encode == null || encode ? encodeURIComponent(param) : param);
      } else {
        for (var i in param) {
          var k =
            key == null
              ? i
              : key + (param instanceof Array ? "[" + i + "]" : "." + i);
          paramStr += that.urlEncode(param[i], k, encode);
        }
      }
      return paramStr;
    },
    regularlySend: function() {
      //  定时发送
    },
    //外部签到消息发送
    immediatelySendFrom(type) {
      let params = {
        content: this.contentValue,
        signInId: this.signId,
        title: this.messageTitle,
        excludeUserIds: this.deleteArray,
        notifyId: this.isReceive.status == 1 ? 1 : 0,
        signInType: this.signInType,
        wechatPush: this.isReceiveW.status == 1 ? true : false
      };


      if (!this.sendCheck()) return;
      var that = this;
      let dataUrl = "/api/message/iSignIn";
      let reType = "post";
      if (type == "timing") {
        let sendTimeArr = this.timingSendParams.sendTimeValue.split(" ");
        let dateArr = sendTimeArr[0].split("-");
        let timeArr = sendTimeArr[1].split(":");
        data.cronExpression =
          "00 " +
          timeArr[1] +
          " " +
          timeArr[0] +
          " " +
          dateArr[2] +
          " " +
          dateArr[1] +
          " ? " +
          dateArr[0];
        // data.cronExpression = "50 19 11 8 4 ? 2019";
        dataUrl = "/api/message/sendTiming?";
        reType = "post";
        this.sendLoading.sendTiming = true;
      } else {
        this.sendLoading.send = true;
      }

      sAjax({
        url: dataUrl,
        dataType: "json",
        type: reType,
        data: params,
        success: function(result) {
          if (result.state) {
            that.initSendData();
            that.$toast("发送成功");
            that.newMessage = false;
            that.nowPage = true;
            that.rows = [];
            that.allMessageUrl =
              "/table-data/message/querySendMessage?queryType=1" +
              "&timeStamp=" +
              new Date().getTime();
          } else {
            that.$toast(result.message);
          }
        }
      }).always(() => {
        this.sendLoading.sendTiming = false;
        this.sendLoading.send = false;
      });
    },
    immediatelySendNow(type) {
      // 立即发送
      if (!this.sendCheck()) return;
      var that = this;
      let dataUrl = "/api/message/insertByType?";
      let reType = "get";
      let data = {
        ifSchool: this.sendPerIdList.school,
        collegeId: encodeURI(this.sendPerIdList.collegeId),
        ifStudent: this.sendPerIdList.student,
        classId: encodeURI(this.sendPerIdList.classId),
        grades: encodeURI(this.sendPerIdList.grades),
        educationLevels: encodeURI(this.sendPerIdList.educationLevels),
        toUserId: encodeURI(this.sendPerIdList.toUserId),
        title: that.messageTitle,
        content: that.contentValue,
        otherMessage: "",
        type: "3",
        cronExpression: "",
        senderId: this.userInfo.id,
        school: this.userInfo.schoolId,
        userName: this.userInfo.name,
        notifyId: that.isReceive.status,
        isWechatPush: that.isReceiveW.status
      };
      if (type == "timing") {
        let sendTimeArr = this.timingSendParams.sendTimeValue.split(" ");
        let dateArr = sendTimeArr[0].split("-");
        let timeArr = sendTimeArr[1].split(":");
        data.cronExpression =
          "00 " +
          timeArr[1] +
          " " +
          timeArr[0] +
          " " +
          dateArr[2] +
          " " +
          dateArr[1] +
          " ? " +
          dateArr[0];
        // data.cronExpression = "50 19 11 8 4 ? 2019";
        dataUrl = "/api/message/sendTiming?";
        reType = "post";
        this.sendLoading.sendTiming = true;
      } else {
        this.sendLoading.send = true;
      }
      let params = this.urlEncode(data).slice(1);
      sAjax({
        url: dataUrl + params,
        dataType: "json",
        type: reType,
        success: function(result) {
          if (result.state) {
            that.initSendData();
            that.$toast("发送成功");
            that.newMessage = false;
            that.nowPage = true;
            that.rows = [];
            that.allMessageUrl =
              "/table-data/message/querySendMessage?queryType=1" +
              "&timeStamp=" +
              new Date().getTime();
          } else {
            that.$toast(result.message);
          }
        }
      }).always(() => {
        this.sendLoading.sendTiming = false;
        this.sendLoading.send = false;
      });
    },
    immediatelySend: function(type) {
      if (!this.fromOutSedMessage) {
        this.immediatelySendNow(type);
      } else {
        this.immediatelySendFrom(type);
      }
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
        if (item.id == id) {
          if (item.checked) {
            item.checked = false;
            item.children.map(item_i => {
              // if (index == i) item_i.checked = true;
              // else
              item_i.checked = false;
              // return item_i;
            });
          } else {
            item.checked = true;
            item.children.map(item_i => {
              // if (index == i) item_i.checked = true;
              // else
              item_i.checked = true;
              // return item_i;
            });
          }
        } else item.checked = false;
        // item.children.map(item_i => {
        //   if (index == i) item_i.checked = true;
        //   else item_i.checked = false;
        //   return item_i;
        // });
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
        toUserId: [],
        grades: [],
        educationLevels: []
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
      if (!this.fromOutSedMessage) {
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
            // that.sendPerStr = cList[0].title;
            that.sendPerIdList.school = "true";
            that.getIntegrals("school", "", cList[0].title);
            break;
          case "2": //学院
            list = that.setSendPerIdList(cList);
            that.sendPerIdList.collegeId = list.arr;
            that.getIntegrals("collegeId", encodeURI(list.arr), list.title);
            break;
          case "6": //年级
            list = that.setSendPerIdList(cList);
            that.sendPerIdList.grades = list.arr;
            that.getIntegrals("grades", encodeURI(list.arr), list.title);
            break;
          case "7": //培养层次
            list = that.setSendPerIdList(cList);
            list.arr = list.arr.map(o => {
              return (o = o.substring(0, 1));
            });
            that.sendPerIdList.educationLevels = list.arr;
            that.getIntegrals(
              "educationLevels",
              encodeURI(list.arr),
              list.title
            );
            break;
          case "3": //班级
            list = that.setSendPerIdList(cList);
            // that.sendPerStr = list.title;
            that.sendPerIdList.classId = list.arr;
            that.getIntegrals("classId", encodeURI(list.arr), list.title);
            break;
          case "4": //学生
            // that.sendPerStr = cList[0].title + ",";
            that.sendPerIdList.student = "true";
            that.getIntegrals("student", "", cList[0].title);
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
            // this.rows = [];
            break;
        }
      } else {
        //如果是外部消息发送人员的确定
        let nums = this.$refs.tableOut.tableState.totalRecords - this.deleteArray.length
        if (this.signInType == "ALL") {
          this.sendPerStr = `所有需要签到的人(${nums}人)`;
        } else {
          this.sendPerStr = `未签到的人(${nums}人)`;
        }
        this.showSendMan = false;
      }
    },
    _addMessage: function() {
      // 控制新建消息弹窗
      this.rows = [];
      this.newMessage = true;
      this.nowPage = false;
      // this.sendPerStr = ""
      // this.sendPerIdList = {
      //   //  发送人员列表
      //   school: "",
      //   collegeId: [],
      //   student: "",
      //   classId: [],
      //   toUserId: [],
      //   grades:[],
      //   educationLevels:[]
      // }
      // this.messageTitle = ""
      // this.contentValue = ""
      // this.isReceiveW.status = true
      // this.isReceive.status = true
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
            this.member.errorMessage = "用户不存在";
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
#messageManage {
  .message-manage-add {
    background: #298df7 !important;
  }
  .edui-editor-iframeholder {
    border: solid 1px rgb(200, 200, 200);
    width: inherit !important;
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
        display: flex;
      }
      .rooo1 {
        text-align: left;
        margin-top: 15px;
        padding-left: 25px;
        .maticon {
          color: #777777;
          font-size: 20px !important;
        }
      }
      .rooo2 {
        text-align: right;
        padding-right: 25px;
        .maticon {
          color: #777777;
          font-size: 40px !important;
          cursor: pointer;
        }
      }
      .table {
        .table-title-container {
          padding-top: 8px !important;
        }
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
        display: inline-block;
        width: 150px;
        text-align: right;
      }
      .right-span {
        display: inline-block;
        max-width: 800px;
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
