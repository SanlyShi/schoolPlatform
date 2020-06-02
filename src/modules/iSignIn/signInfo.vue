<template>
  <div>
    <div id="qrcode-fullscreen" v-show="qrcode.fullscreen">
      <v-icon name="close" @click.native="existFullscreen"></v-icon>
      <div class="qrcode-container">
        <div id="sign-qrcode-name">{{ sign.name }}</div>
        <div id="sign-qrcode-type" v-if="sign.useDynamicCode">动态码(刷新间隔10s)</div>
        <div
          v-if="editSignModal.needOut&&$parent.isAgent"
          id="needOut-sign-qrcode-isAgent-fullscreen"
        ></div>
        <div
          v-else-if="editSignModal.needOut&&$parent.isPerson"
          id="needOut-sign-qrcode-isPerson-fullscreen"
        ></div>
        <div v-else-if="editSignModal.needOut" id="needOut-sign-qrcode-fullscreen"></div>
        <div v-else id="sign-qrcode-fullscreen"></div>
        <div id="sign-qrcode-time">{{ sign.startTime + ' ~ ' + sign.endTime }}</div>
      </div>
    </div>
    <a type="button" class="box_flex align_center back_wrap">
      <!--返回教师列表-->
      <i class="maticon back-icon-btn" @click="back" v-html="icons('arrow_back')">arrow_back</i>
      <span @click="back" class="nav-title">{{ isProxy ? sign.name : '返回'}}</span>
    </a>
    <div id="sign-info">
      <div v-if="sign.needOut" class="tab-div">
        <div
          class="tab"
          v-for="(tab, index) in tabList"
          :key="index"
          :class="signTabVal===tab.id? 'active' : ''"
          :title="tab.name"
          @click="signTabVal=tab.id"
        >{{tab.name}}</div>
      </div>

      <!-- 时间选择器 -->

      <div class="box_flex" style="align-items: stretch;margin-left:-15px">
        <div class="col-md-9">
          <v-table
            ref="sign-table"
            :title=" isManager ? sign.name : ''"
            :url="tableUrl"
            :pagesize="tableParams.pagesize"
            :idField="tableParams.idField"
            :columns="tableParams.columns"
            :multiple="tableParams.multi"
            :order="tableParams.order"
            :search="tableParams.search"
          >
            <div slot="btn-group" role="group">
              <div class="btn-group college-select pull-left" v-if="isProxy">
                <v-select
                  :options="this.proxy.proxies"
                  :value="this.proxy.id"
                  options-value="id"
                  options-label="name"
                  :required="true"
                  close-on-select
                  justify
                  @afterSelected="changeProxy"
                ></v-select>
              </div>

              <div
                class="dateSelect pull-left"
                v-if="sign.checkInType != 'single'&&!editSignModal.needOut"
              >
                <!-- <span>时间范围：</span> -->
                <el-date-picker
                  type="daterange"
                  @change="dateChange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  style="width:80%;"
                  v-model="dateArea"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </div>
              <div class="pull-right">
                <button
                  type="button"
                  class="btn btn-bgColor-style edit-btn"
                  @click="goToSendMessage"
                >通知</button>
                <button
                  type="button"
                  class="btn btn-bgColor-style edit-btn"
                  :class="{ disabled: exporting }"
                  @click="exportSigns"
                  v-html="exporting ? loader.small + '导出中' : i18n.export"
                ></button>
                <button
                  type="button"
                  class="btn btn-bgColor-style edit-btn"
                  @click="showAddModal = true"
                  v-if="isManager"
                >{{i18n.signInfo.editPeople}}</button>
                <button
                  type="button"
                  v-if="!sign.needOut"
                  class="btn btn-bgColor-style stat-btn"
                  @click="showStat"
                >
                  <v-icon class="pull-left" name="donut_large"></v-icon>
                  {{i18n.signInfo.stat}}
                </button>
              </div>
            </div>
          </v-table>
        </div>
        <div :class="['col-md-3','sign-detail',sign.frequency == 'week'?'over':'']">
          <div class="sign-detail-div">
            <div class="info-row" v-if="editSignModal.needOut">
              <span class="title">二维码</span>
              <img
                @click="fullscreen"
                :src="require('../../assets/img/towCode.png')"
                class="tow_code"
                alt
              />
            </div>
            <div class="info-row">
              <span class="title">{{editSignModal.name}}</span>
              <v-icon
                class="edit"
                v-if="userType !== 'PROXY'"
                name="edit"
                @click.native="toEditSign"
              ></v-icon>
            </div>
            <div class="info-row" style="display: flex;">
              <span class="title">{{sign.checkInType == 'single'?i18n.signInfo.start:'开始日期'}}</span>
              <div v-if="sign.checkInType == 'single'">
                <span class="time">{{ editSignModal.startTime }}</span>
              </div>
              <div v-else-if="sign.checkInType == 'loop'">
                <span
                  class="time"
                  v-if="sign.frequency == 'day'"
                >{{ editSignModal.startTime.split(' ')[0]}}</span>
                <span
                  class="time"
                  v-if="sign.frequency == 'week'"
                >{{ editSignModal.startTime.split(' ')[0]}}</span>
              </div>
              <span v-else class="time">{{ editSignModal.startTime }}</span>
            </div>

            <div class="info-row" style="display: flex;">
              <span class="title">{{sign.checkInType == 'single'?i18n.signInfo.end:'结束日期'}}</span>
              <div v-if="sign.checkInType == 'single'">
                <span class="time">{{ editSignModal.endTime }}</span>
              </div>
              <div v-else-if="sign.checkInType == 'loop'">
                <span
                  class="time"
                  v-if="sign.frequency == 'day'"
                >{{editSignModal.endTime.split(' ')[0]}}</span>
                <span
                  class="time"
                  v-if="sign.frequency == 'week'"
                >{{ editSignModal.endTime.split(' ')[0]}}</span>
              </div>
              <span v-else class="time">{{ editSignModal.endTime }}</span>
            </div>
            <template v-if="sign.checkInType == 'loop'&&sign.frequency == 'day'">
              <div class="weekDay">
                <p class="info-row">
                  <i>签到开始时间</i>
                  <em>{{editSignModal.hourStart?editSignModal.hourStart.substring(0,8):''}}</em>
                </p>
                <p class="info-row" style="border-bottom: 1px solid #e0e0e0;">
                  <i>签到结束时间</i>
                  <em>{{editSignModal.hourEnd?editSignModal.hourEnd.substring(0,8):''}}</em>
                </p>
              </div>
            </template>
            <template v-if="sign.checkInType == 'loop'&&sign.frequency == 'week'">
              <div class="weekDay" v-for="(item,index) in editSignModal.weekDayList" :key="index">
                <span>{{item.date}}</span>
                <p class="info-row">
                  <i>签到开始时间</i>
                  <em>{{item.startTime}}</em>
                </p>
                <p class="info-row" style="border-bottom: 1px solid #e0e0e0;">
                  <i>签到结束时间</i>
                  <em>{{item.endTime}}</em>
                </p>
              </div>
            </template>

            <div v-if="editSignModal.needOut">
              <div class="info-row">
                <div class="switch" :class="{ on: editSignModal.isSignOut, readonly: true }">
                  <span class="label">需要签退</span>
                  <div class="slider">
                    <div class="pipe"></div>
                    <div class="head"></div>
                  </div>
                </div>
              </div>
              <div v-if="editSignModal.isSignOut" class="info-row">
                <span class="title">签退开始时间</span>
                <span class="time">{{ editSignModal.signOutTimeStart }}</span>
              </div>
              <div v-if="editSignModal.isSignOut" class="info-row">
                <span class="title">签退结束时间</span>
                <span class="time">{{ editSignModal.signOutTimeEnd}}</span>
              </div>
            </div>
            <div class="info-row">
              <span class="title">签到方式</span>
              <span class="time">{{signWayText[editSignModal.signWay]}}</span>
            </div>
            <div class="info-row" v-if="editSignModal.signWay === 'qrcode'">
              <div class="switch" :class="{ on: editSignModal.useDynamicCode, readonly: true }">
                <span class="label">{{i18n.useDynamicCode}}</span>
                <div class="slider">
                  <div class="pipe"></div>
                  <div class="head"></div>
                </div>
              </div>
            </div>
            <div class="info-row" v-if="editSignModal.signWay === 'qrcode'">
              <div
                class="switch"
                :class="{ on: editSignModal.scanQrcodeWithLocation, readonly: true }"
              >
                <span class="label">扫码定位限制</span>
                <div class="slider">
                  <div class="pipe"></div>
                  <div class="head"></div>
                </div>
              </div>
            </div>
            <div
              class="info-row auto-height"
              v-if="editSignModal.signWay === 'qrcode' && editSignModal.scanQrcodeWithLocation"
            >
              <span class="title">地点</span>
              <div class="list">
                <div
                  class="item"
                  v-for="(location, index) in editSignModal.qrcodeLocations"
                  :key="index"
                >{{ location.address + ' 范围：' + location.radius + '米' }}</div>
              </div>
            </div>
            <div class="info-row auto-height" v-if="editSignModal.signWay === 'location'">
              <span class="title">地点</span>
              <div class="list">
                <div
                  class="item"
                  v-for="(location, index) in editSignModal.locations"
                  :key="index"
                >{{ location.address + ' 范围：' + location.radius + '米' }}</div>
              </div>
            </div>
            <div
              class="qr-code-container"
              v-if="editSignModal.signWay === 'qrcode'&&!editSignModal.needOut"
            >
              <!-- fullscreen 在这儿添加数据 -->
              <div class="qr-code">
                <v-icon name="zoom_out_map" @click.native="fullscreen"></v-icon>
                <!-- <div v-if="editSignModal.needOut&&$parent.isAgent" id="needOut-sign-qrcode-isAgent"></div>
              <div v-else-if="editSignModal.needOut&&$parent.isPerson" id="needOut-sign-qrcode-isPerson"></div>
                <div v-else-if="editSignModal.needOut" id="needOut-sign-qrcode"></div>-->
                <div id="sign-qrcode"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- add person modal -->
      <v-modal :show="addPersonModal.show" effect="fade" width="400">
        <div slot="modal-header" class="modal-header">
          <h5 class="modal-title">{{i18n.signInfo.editPeople}}</h5>
        </div>
        <div slot="modal-body" class="modal-body container-fluid" style="overflow: inherit;">
          <div v-if="editSignModal.needOut&&userType === 'PROXY'" class="form-group">
            <detect
              url="api/ca/users/agent/students/searchResults"
              :placeholder="请输入学号或者姓名"
              @afterSelected="afterSelectAddPerson"
            ></detect>
          </div>
          <div v-else-if="editSignModal.needOut" class="form-group">
            <detect
              ref="searchVal"
              url="api/ca/users/students/searchResults"
              :placeholder="请输入学号或者姓名"
              @afterSelected="afterSelectAddPerson"
            ></detect>
          </div>
          <div v-else class="form-group">
            <detect
              ref="searchVal"
              url="/api/users/check/searchResults"
              :placeholder="请输入学号或者姓名"
              @afterSelected="afterSelectAddPerson"
            ></detect>
          </div>
        </div>
        <div slot="modal-footer" class="modal-footer">
          <button
            type="button"
            class="btn cancel-btn clearBtnBorder"
            @click="cancelAddSignPeople"
          >{{i18n.cancel}}</button>
          <button
            type="button"
            class="btn submit-btn clearBtnBorder"
            @click="addSignPeople"
          >{{i18n.sure}}</button>
        </div>
      </v-modal>

      <v-modal :show="showAdviceModal" effect="fade" width="520">
        <div slot="modal-header" class="modal-header">
          <h5 class="modal-title">通知</h5>
        </div>
        <div slot="modal-body" class="modal-body form-wrap advice-modal">
          <div class="form-group box_flex">
            <div class="label require">
              <span>通知发送时间:</span>
            </div>
            <v-select
              :options="sendTimeTypeList"
              options-value="value"
              options-label="label"
              close-on-select
              justify
              v-model="adviceParams.sendTimeType"
            ></v-select>
          </div>
          <div v-if="adviceParams.sendTimeType === 'TIMING'" class="form-group box_flex">
            <div class="label require">
              <span>发送时间:</span>
            </div>
            <v-datepicker
              class="btn-block time-picker"
              v-model="adviceParams.sendTime"
              format="yyyy-MM-dd hh:ii:ss"
              placeholder="请选择发送时间"
              :clearButton="false"
              @daySelected="sendTimeSelected"
            ></v-datepicker>
          </div>
          <div class="form-group box_flex">
            <div class="label require">
              <span>消息内容:</span>
            </div>
            <v-textarea
              v-model="adviceParams.content"
              lineHeight="22"
              style="height:88px;"
              placeholder="请输入消息内容"
              rows="6"
              maxlength="255"
            ></v-textarea>
          </div>
          <div class="form-group box_flex">
            <div class="label require">
              <span>发送对象:</span>
            </div>
            <v-select
              :options="messageToTargetList"
              options-value="value"
              options-label="label"
              close-on-select
              justify
              v-model="adviceParams.messageToTarget"
            ></v-select>
          </div>
        </div>
        <div slot="modal-footer" class="modal-footer">
          <button
            type="button"
            class="btn cancel-btn clearBtnBorder"
            @click="showAdviceModal = false"
          >取消</button>
          <button type="button" class="btn submit-btn clearBtnBorder" @click="sendMessage()">发送</button>
        </div>
      </v-modal>
      <v-modal :show="showAddModal" effect="fade" width="420">
        <div slot="modal-header" class="modal-header">
          <h5 class="modal-title">新增签到人员</h5>
        </div>
        <div slot="modal-body" class="modal-body">
          <button
            type="button"
            class="btn submit-btn clearBtnBorder"
            @click="addPersonByOne"
            style="width:380px;text-align:center"
          >单条增加</button>
          <button
            type="button"
            class="btn submit-btn clearBtnBorder"
            v-if="editSignModal.needOut"
            @click="batchAddPerson()"
            style="width:380px;text-align:center;margin-top:20px;"
          >批量导入</button>
        </div>
        <div slot="modal-footer" class="modal-footer">
          <button
            type="button"
            class="btn cancel-btn clearBtnBorder"
            @click="showAddModal = false"
          >取消</button>
          <!-- <button type="button" class="btn submit-btn clearBtnBorder">保存</button> -->
        </div>
      </v-modal>

      <!-- sign manual modal -->
      <v-modal :show="signManualModal.show" effect="fade" width="400">
        <div slot="modal-header" class="modal-header">
          <h5 class="modal-title">{{i18n.signInfo.recordByHand}}</h5>
        </div>
        <div slot="modal-body" class="modal-body container-fluid">
          <div class="form-group">
            <input
              type="text"
              class="form-control modal-input"
              maxlength="100"
              v-model="signManualModal.remark"
              :placeholder="i18n.signInfo.recordByHandPlaceholder"
              v-focus
            />
          </div>
          <div class="form-group"></div>
        </div>
        <div slot="modal-footer" class="modal-footer">
          <button
            type="button"
            class="btn cancel-btn clearBtnBorder"
            @click="signManualModal.show = false"
          >{{i18n.cancel}}</button>
          <button
            type="button"
            class="btn submit-btn clearBtnBorder"
            @click="signManual"
          >{{i18n.sure}}</button>
        </div>
      </v-modal>

      <!-- stat modal -->
      <v-modal id="stat-modal" :show="statModal.show" effect="fade" width="900">
        <div slot="modal-header" class="modal-header">
          <h5 class="modal-title">
            <v-icon name="close" @click.native="statModal.show = false"></v-icon>
            <span>{{i18n.signInfo.stat}}</span>
            <el-date-picker
              type="daterange"
              style="width: 50%;"
              @change="statDateChange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              v-model="statDate"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </h5>
        </div>
        <div slot="modal-body" class="modal-body container-fluid">
          <div class="loader" v-if="statModal.loading" v-html="loader.iconWithText"></div>
          <div class="loader" v-else-if="statModal.noStat">暂无统计数据</div>
          <div style="display: inline-block" v-else>
            <div id="stat-control">
              <ul>
                <li
                  v-for="(status, type) in statModal.control"
                  v-if="status.show"
                  @click="changeStatType(type)"
                  :key="type"
                >
                  <v-icon :name="getRadioIcon(status.checked)"></v-icon>
                  <span>{{status.text}}</span>
                </li>
              </ul>
            </div>
            <div v-show="statModal.currentControl === 'general'">
              <div id="general-chart-text">
                <ul>
                  <li v-for="(data, status) in statModal.generalChart.legend" :key="status">
                    <span class="color" :style="{ background: data.color }"></span>
                    <span class="text">{{data.text}}</span>
                    <span class="num">{{data.num}}</span>
                  </li>
                </ul>
              </div>
              <div id="general-chart"></div>
            </div>
            <div v-show="statModal.currentControl !== 'general'">
              <div id="bar-chart">
                <ul
                  class="items"
                  v-for="(status, type) in statModal.control"
                  v-if="type != 'manage' && status.checked"
                  :key="type"
                >
                  <li class="item" v-for="stat in status.data" :key="stat.title">
                    <div class="title" :title="stat.title">{{stat.title}}</div>
                    <div class="bar">
                      <ul class="bar-chart">
                        <li
                          class="part bar-done"
                          :title="'已签到:' + stat.overview.done"
                          :style="{ width: stat.widthData.done + 'px' }"
                        ></li>
                        <li
                          class="part bar-manual"
                          :title="'手工签到:' + stat.overview.manual"
                          :style="{ width: stat.widthData.manual + 'px' }"
                        ></li>
                        <li
                          class="part bar-todo"
                          :title="'未签到:' + stat.overview.todo"
                          :style="{ width: stat.widthData.todo + 'px' }"
                        ></li>
                      </ul>
                      <ul class="bar-tip">
                        <li
                          class="text"
                          :style="{ width: stat.widthData.done + 'px' }"
                        >{{ stat.widthData.done > 36 ? ('已签到 ' + stat.overview.done) : '' }}</li>
                        <li
                          class="text"
                          :style="{ width: stat.widthData.manual + 'px' }"
                        >{{ stat.widthData.manual > 36 ? ('手工签到 ' + stat.overview.manual) : '' }}</li>
                        <li
                          class="text"
                          :style="{ width: stat.widthData.todo + 'px' }"
                        >{{ stat.widthData.todo > 36 ? ('未签到 ' + stat.overview.todo) : '' }}</li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div id="stat-sync-time">以上数据统计截止至：{{statModal.syncTime}}</div>
          </div>
        </div>
      </v-modal>

      <!-- edit sign modal -->
      <sign-info-modal
        title="编辑签到"
        @editMethod="editMethod"
        :weekDay="sign.weekDay"
        :frequency="sign.frequency"
        :checkInType="sign.checkInType"
        :signInfo="editSignModal"
        :i18n="i18n"
        @confirm="saveSign"
      ></sign-info-modal>

      <!-- 导出字段 -->
      <v-modal :show="outputModalShow" effect="fade" width="550">
        <div slot="modal-header" class="modal-header">
          <h5 class="modal-title">导出——字段选择</h5>
        </div>
        <div slot="modal-body" class="modal-body export-modal-body">
          <div class="loopTitle">
            <h1>选择导出时间范围</h1>
            <div v-if="sign.checkInType != 'single'">
              <el-date-picker
                type="daterange"
                @change="dateChange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width:100%;"
                v-model="dateArea"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </div>
          </div>

          <ul class="list-group outPut">
            <li
              class="list-group-item field-item"
              :class="outputList.indexOf(field.fieldName)<0?'':'output-active'"
              @click="_changeOutputList(field)"
              v-for="(field,index) in formFields"
              :key="index"
            >
              <i
                class="maticon"
                v-html="icons('check_box_outline_blank')"
                v-if="outputList.indexOf(field.fieldName)<0"
              >check_box_outline_blank</i>
              <i class="maticon" v-html="icons('check_box')" v-else>check_box</i>
              <span>{{field.fieldTitle}}</span>
            </li>
          </ul>
        </div>
        <div slot="modal-footer" class="modal-footer">
          <button
            type="button"
            class="btn cancel-btn clearBtnBorder"
            @click="outputModalShow = false;outputList = []"
          >取消</button>
          <button type="button" class="btn submit-btn clearBtnBorder" @click="_sureToOutput">确定</button>
        </div>
      </v-modal>
      <v-modal
        :show="showImgDetailStatus"
        class="img_modal"
        backdrop="true"
        @onHide="showImgDetailStatus=false"
      >
        <div
          slot="modal-body"
          @click="showImgDetailStatus=false"
          :style="{'transform':'scale('+deleteImgWidth+')'}"
          class="modal-body box_flex flex_center"
        >
          <img id="detailImg" :src="imgDetailSrc" style="width:100%;height:350px;" alt />
        </div>
      </v-modal>
      <v-modal :show="showAddressModal" backdrop="true" @onHide="showAddressModal=false">
        <div
          slot="modal-body"
          style="width:600px;height:400px;"
          class="modal-body box_flex flex_center"
        >
          <v-map v-if="addressRecord.lat" :showPosition="true" :center="addressRecord"></v-map>
        </div>
      </v-modal>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import VIcon from "./components/vIcon";
import SignInfoModal from "./signInfoModal";
import { sAjax, request, translation } from "../../assets/utils/utils.js";
import backend from "./backend";
import echarts from "echarts";
import QRCode from "qrcodejs2";
import loader from "./loader";
import { win32 } from "path";
import { fail } from "assert";
const USER_TYPE_ALL = "ALL";
const USER_TYPE_MANAGE = "MANAGE";
const USER_TYPE_PROXY = "PROXY";

const signStatusDict = {
  NOT_SIGN: "未签到",
  SIGN: "已签到",
  MANUAL_ENTRY: "手工签到",
  TIME_OUT_NOT_SIGN: "超时未签到"
};
const newSignStatusDict = {
  SIGN_IN: " 已签到",
  NOT_SIGN_IN: " 未签到",
  MANUAL_SIGN_IN: "手动签到",
  SIGN_OUT: " 已签退",
  NOT_SIGN_OUT: " 未签退",
  MANUAL_SIGN_OUT: "手动签退",
  ASK_FOR_LEAVE: "请假"
};
const proxyDistributary = {
  SCHOOL: "SCHOOL",
  COLLEGE: "COLLEGE",
  CLASS: "CLASS",
  RELATIONSHIP: "RELATIONSHIP"
};

export default {
  components: {
    VIcon,
    SignInfoModal
  },
  props: {
    project: Object,
    sign: Object,
    userType: String
  },
  data: function() {
    return {
      signWayText: {
        location: "定位签到",
        qrcode: "扫码签到",
        outside: "外勤打卡"
      },
      searchVal: "",
      statType: "",
      statDate: [],
      eduList: [],
      gradeYear: [],
      formFields: [],
      unitList: [],
      tableUrl: "",
      dateArea: "",
      outputModalShow: false,
      outputList: [],
      downLoadDate: "",
      classArr: [],
      loader: loader,
      lang: "zh-cn",
      datePickerStartTime: "",
      datePickerEndTime: "",
      showAdviceModal: false,
      adviceParams: {
        sendTimeType: "IMMEDIATELY",
        sendTime: "",
        content: "",
        messageToTarget: "ALL_STUDENT"
      },
      sendTimeTypeList: [
        {
          label: "立即发送",
          value: "IMMEDIATELY"
        },
        {
          label: "定时发送",
          value: "TIMING"
        }
      ],
      tableParams: {
        pagesize: 10,
        idField: "id",
        columns: [],
        multi: false,
        order: true,
        search: false,
        ts: +new Date()
      },
      showAddModal: false,
      signTabVal: "signIn",
      searchOptions: {
        colleges: [],
        status: [
          {
            id: "NOT_SIGN",
            text: "未签到"
          },
          {
            id: "SIGN",
            text: "已签到"
          },
          {
            id: "MANUAL_ENTRY",
            text: "手工签到"
          }
        ],
        newSignInStatus: [
          {
            id: "SIGN_IN",
            text: "已签到"
          },
          {
            id: "NOT_SIGN_IN",
            text: "未签到"
          },
          {
            id: "MANUAL_SIGN_IN",
            text: "手动签到"
          },
          {
            id: "ASK_FOR_LEAVE",
            text: "请假"
          }
        ],
        newSignOutStatus: [
          {
            id: "SIGN_OUT",
            text: "已签退"
          },
          {
            id: "NOT_SIGN_OUT",
            text: "未签退"
          },
          {
            id: "MANUAL_SIGN_OUT",
            text: "手动签退"
          },
          {
            id: "ASK_FOR_LEAVE",
            text: "请假"
          }
        ],
        managedColleges: []
      },
      addPersonModal: {
        show: false,
        userNo: null,
        userName: null,
        userId: null,
        tip: null
      },
      signManualModal: {
        show: false,
        remark: null,
        signId: null,
        userId: null,
        userNo: null
      },
      editSignModal: {
        hourStart: "",
        hourEnd: "",
        weekDay: "",
        weekDayList: [],
        show: false,
        name: null,
        startTime: "",
        isSignOut: false,
        startTimeToHours: "",
        endTimeToHours: "",
        endTime: "",
        signWays: {
          qrcode: "qrcode",
          location: "location",
          outside: "outside"
        },
        signWay: "qrcode",
        useDynamicCode: false,
        scanQrcodeWithLocation: false,
        locations: [],
        qrcodeLocations: [],
        activeLocationIndex: 0,
        project: null,
        projectId: null,
        maxLength: 20,
        dateFormat: "yyyy-MM-dd hh:ii:ss"
      },
      qrcode: {
        fullscreen: false,
        oldInstance: null,
        url: "",
        instance: null,
        timer: null
      },
      statModal: {
        show: false,
        syncTime: "",
        totalWidth: 550,
        minWidth: 10,
        loading: false,
        noStat: false,
        generalChart: {
          init: false,
          instance: null,
          options: {
            tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            color: [
              "rgba(92, 107, 192, 1)",
              "rgba(92, 107, 192, .75)",
              "rgba(92, 107, 192, .5)"
            ],
            series: [
              {
                name: "统计",
                type: "pie",
                radius: "60%",
                center: ["49%", "41%"],
                data: [],
                label: {
                  normal: {
                    show: true
                  }
                },
                labelLine: {
                  normal: {
                    show: true
                  }
                },
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)"
                  }
                }
              }
            ]
          },
          legend: {
            // total: {
            //   color: '#aaa',
            //   text: '应签到',
            //   num: 0
            // },
            done: {
              color: "rgba(92, 107, 192, 1)",
              text: "已签到",
              num: 0
            },
            // manual: {
            //   color: 'rgba(92, 107, 192, .75)',
            //   text: '手动签到',
            //   num: 0
            // },
            todo: {
              color: "rgba(92, 107, 192, 0.5)",
              text: "未签到",
              num: 0
            }
          }
        },
        currentControl: "general",
        control: {
          general: {
            text: "总览",
            show: true,
            checked: true,
            loading: false
          },
          college: {
            text: "各学院对比",
            show: true,
            checked: false,
            type: "COLLEGE",
            data: [],
            loading: false
          },
          instructor: {
            text: "各辅导员对比",
            show: true,
            checked: false,
            type: "INSTRUCTOR",
            data: [],
            loading: false
          },
          clazz: {
            text: "各班级对比",
            show: true,
            checked: false,
            type: "CLAZZ",
            data: [],
            loading: false
          }
        }
      },
      proxy: {
        proxies: [],
        id: null,
        distributary: proxyDistributary.SCHOOL,
        proxyId: null,
        name: "",
        classId: "",
        collegeCode: ""
      },
      exporting: false,
      showImgDetailStatus: false,
      showAddressModal: false,
      addressRecord: {},
      deleteImgWidth: 1,
      imgDetailSrc: ""
    };
  },
  beforeDestroy() {
    if (this.setInterFun) {
      clearInterval(this.setInterFun);
      this.setInterFun = null;
      this.oldHasSignList = null;
    }
  },
  created: function() {
    this.setUrl();
    this.getUnitList();
    this.setGrade();
    this.getEdu();
    if (this.sign.checkInType == "loop" && this.sign.frequency == "week") {
      this.editSignModal.weekDay = this.sign.weekDay;
      this.editSignModal.weekDayList = [];
      let list = this.sign.weekDay.split("&");
      for (let i = 0; i < list.length; i++) {
        let timeSplit = list[i].split(",");
        this.editSignModal.weekDayList.push({
          date: this.dateToCn(i),
          startTime: timeSplit[1],
          endTime: timeSplit[2]
        });
      }
    }
    let lang = window.localStorage.getItem("lang");
    if (lang && translation(lang)) {
      this.lang = lang;
    }
    this.datePickerStartTime = this.sign.startTime;
    this.datePickerEndTime = this.sign.endTime;
    sAjax({
      url: "/api/relClass/classes/list",
      dataType: "json",
      type: "get",
      async: false,
      success: result => {
        if (result.state) {
          this.classArr = result.data;
        }
      }
    });
    if (this.isProxy) {
      this.initProxies();
    }
    this.initEditSignModal();
    if (this.sign.needOut) {
      this.initTable();
    } else {
      this.initManagedColleges(() => {
        this.initTable();
      });
    }
    this.stopQrcodeTimer();
  },
  mounted: function() {
    if (this.isProxy) {
      return;
    }
    if (this.editSignModal.signWay === "qrcode") {
      this.initQrcode();
    }
  },
  computed: {
    messageToTargetList() {
      if (this.editSignModal.isSignOut) {
        return [
          {
            label: "所有人",
            value: "ALL_STUDENT"
          },
          {
            label: "未签到",
            value: "NOT_SIGN"
          },
          {
            label: "请假",
            value: "ASK_FOR_LEAVE"
          }
        ];
      } else {
        return [
          {
            label: "所有人",
            value: "ALL_STUDENT"
          },
          {
            label: "未签到",
            value: "NOT_SIGN"
          }
        ];
      }
    },
    tabList() {
      if (this.editSignModal.isSignOut) {
        return [
          { id: "signIn", name: "签到" },
          { id: "signOut", name: "签退" }
        ];
      } else {
        return [{ id: "signIn", name: "签到" }];
      }
    },
    i18n: function() {
      return translation(this.lang).iSign;
    },
    isManager: function() {
      return this.userType === USER_TYPE_MANAGE;
    },
    isALL: function() {
      return this.userType === USER_TYPE_ALL;
    },
    isProxy: function() {
      return this.userType === USER_TYPE_PROXY;
    },
    qrCodeExpireTime: function() {
      return this.sign.useDynamicCode ? 15 : 0;
    }
  },
  watch: {
    signTabVal() {
      this.initTable();
      this.refreshQrcode();
    },
    "tableParams.ts"() {
      this.setUrl();
    }
  },
  methods: {
    goToSendMessage() {
      sessionStorage.setItem("signIdSend", this.sign.id);
      sessionStorage.setItem("fromOutSedMessage", true);
      this.$addBread({
        route: "/messageBox/messageManage",
        title: "消息盒子"
      });
    },
    showImgDetail(hash) {
      this.showImgDetailStatus = true;
      this.imgDetailSrc = `/downloads/storage/images/${hash}`;
      window.onmousewheel = document.onmousewheel = this.scrollImg; //W3C
    },
    showAddressDetail(record) {
      this.showAddressModal = true;
      this.addressRecord = {
        lat: record.latitude,
        lng: record.longitude
      };
    },
    scrollImg(e) {
      if (this.showImgDetailStatus) {
        if (e.deltaY > 0) {
          if (this.deleteImgWidth < 2) {
            this.deleteImgWidth += 0.1;
          }
        } else {
          if (this.deleteImgWidth > 0.2) {
            this.deleteImgWidth -= 0.1;
          }
        }
      }
    },
    statDateChange(val) {
      if (val) {
        if (this.statModal.currentControl != "general") {
          this.changeStatType(this.statModal.currentControl);
        } else {
          this.showStat();
        }
      }
    },
    getUnitList() {
      let url = "/api/colleges/units";
      sAjax({
        type: "get",
        url: url,
        success: data => {
          if (data.state) {
            this.unitList = data.data;
          } else {
            this.unitList = [];
          }
        }
      });
    },
    _sureToOutput() {
      if (!this.outputList.length) return this.$toast("请选择导出的字段");
      let url =
        "/downloads/signIns/peoples/excel/" +
        this.userType +
        "?signInId=" +
        this.sign.id +
        "&fields=" +
        this.outputList.join(",");

      let searchFields = this.$refs["sign-table"].tableSearchFields || {};
      if (this.dateArea.length) {
        url +=
          "&startTime=" +
          this.dateArea[0] +
          "&endTime=" +
          this.dateArea[1] +
          "&";
      }
      for (var i in searchFields) {
        url += i + "=" + searchFields[i] + "&";
      }
      window.location.href = url;
    },
    setUrl() {
      if (this.sign.needOut) {
        // 课堂考勤特有变量  顺便用于处理课堂考勤与原签到之间区别的逻辑
        if (this.sign.isAgent) {
          this.tableUrl = `/table-data/ca/signIn/agent/person/page/${this.signTabVal}/${this.sign.id}?ts=${this.tableParams.ts}`;
        }
        this.tableUrl = `/table-data/ca/signIn/person/page/${this.signTabVal}/${this.sign.id}?ts=${this.tableParams.ts}`;
      } else if (this.isManager || this.isALL) {
        // if(this.sign.checkInType == 'loop') {
        //   return `/table-data/signIns/peoples/MANAGE?signInId=${this.sign.id}&startTime=${this.dateArea[0]}&endTime=${this.[1]}&ts=${new Date().getTime()}`
        // }else {
        this.tableUrl = `/table-data/signIns/peoples/MANAGE?signInId=${this.sign.id}&ts=${this.tableParams.ts}`;
        // }
      }
      // else if(){
      //   return `/table-data/signIns/peoples/ALL?signInId=${this.sign.id}&ts=${this.tableParams.ts}`
      // }
      else if (this.isProxy) {
        if (!this.proxy.proxyId) {
          this.tableUrl = "";
        } else {
          this.tableUrl = `/table-data/signIns/${
            this.sign.id
          }/people/pages?ts=${this.tableParams.ts}&agentId=${
            this.proxy.proxyId
          }&classId=${this.proxy.classId || ""}&collegeCode=${this.proxy
            .collegeCode || ""}`;
        }
      }
    },
    dateChange(val) {
      this.isALL = true;
      this.isManager = false;
      this.$nextTick(() => {
        // this.tableUrl  = '11'
        if (this.isProxy) {
          if (!this.proxy.proxyId) {
            this.tableUrl = "";
          } else {
            this.tableUrl = `/table-data/signIns/${
              this.sign.id
            }/people/pages?ts=${this.tableParams.ts}&startTime=${
              val[0]
            }&endTime=${val[1]}&agentId=${this.proxy.proxyId}&classId=${this
              .proxy.classId || ""}&collegeCode=${this.proxy.collegeCode ||
              ""}`;
          }
        } else {
          this.tableUrl = `/table-data/signIns/peoples/MANAGE?signInId=${
            this.sign.id
          }&startTime=${val[0]}&endTime=${val[1]}&ts=${new Date().getTime()}`;
        }
      });
    },
    editMethod(obj) {
      setTimeout(() => {
        if (obj.selectType == "day") {
          this.$set(
            this.editSignModal,
            "hourStart",
            this.editSignModal.startTimeToHours
          );
          this.$set(
            this.editSignModal,
            "hourEnd",
            this.editSignModal.endTimeToHours
          );
          // this.editSignModal.hourStart =
          // this.editSignModal.hourEnd = this.editSignModal.endTimeToHours
        } else {
          let weekDay = this.editSignModal.weekDay;
          let dayList = [];
          this.editSignModal.weekDayList = [];
          let list = weekDay.split("&");
          for (let i = 0; i < list.length; i++) {
            let timeSplit = list[i].split(",");
            dayList.push({
              date: this.dateToCn(i),
              startTime: timeSplit[1],
              endTime: timeSplit[2]
            });
          }
          this.$set(this.editSignModal, "weekDayList", dayList);
        }
      }, 300);
    },
    dateToCn(index) {
      switch (index) {
        case 0:
          return "星期一";
          break;
        case 1:
          return "星期二";
          break;
        case 2:
          return "星期三";
          break;
        case 3:
          return "星期四";
          break;
        case 4:
          return "星期五";
          break;
        case 5:
          return "星期六";
          break;
        case 6:
          return "星期日";
          break;
        default:
          break;
      }
    },
    setGrade() {
      let year = new Date().getFullYear();
      let list_before = [];
      let list_after = [];
      for (let i = 0; i < 6; i++) {
        list_before.push({
          label: year - i + "",
          value: year - i
        });
      }
      for (let i = 1; i < 11; i++) {
        list_after.push({
          label: year + i + "",
          value: year + i
        });
      }
      this.gradeYear = list_before.reverse().concat(list_after);
    },
    getEdu() {
      let url = "/api/system/dicts?dictType=培养层次";
      sAjax({
        url: url,
        type: "get",
        success: data => {
          if (data.state) {
            this.eduList = data.data;
          } else {
            this.eduList = [];
          }
        }
      });
    },
    _changeOutputList: function(field) {
      // this.outputList = []
      // if(field.fieldName == 'allChoice') {
      //   if(this.outputList.length == this.formFields.length) {
      //      this.outputList = []
      //   }else {
      //     this.outputList = []
      //     for(let i = 0;i<this.formFields.length;i++) {
      //       this.outputList.push(this.formFields[i].fieldName)
      //     }
      //   }
      // }else{
      var index = this.outputList.indexOf(field.fieldName);
      if (index >= 0) {
        this.outputList.splice(index, 1);
        let allChoice = this.outputList.indexOf("allChoice");
        if (allChoice >= 0) {
          this.outputList.splice(allChoice, 1);
        }
      } else {
        this.outputList.push(field.fieldName);
        // if((this.outputList.length == this.formFields.length - 1) && field.fieldName != 'allChoice') {
        //   this.outputList.push('allChoice')
        // }
      }
      // }
    },
    sendMessage() {
      let url = `api/ca/signIn/person/message/${this.signTabVal}/${this.sign.id}`;
      if (this.sign.isAgent) {
        url = `api/ca/signIn/agent/person/message/${this.signTabVal}/${this.sign.id}`;
      }
      if (!this.adviceParams.sendTimeType) {
        this.$toast("请选择发送!");
        return;
      }
      if (this.adviceParams.sendTimeType === "TIMING") {
        if (!this.adviceParams.sendTime) {
          this.$toast("发送时间不能为空!");
          return;
        }
      }
      if (!this.adviceParams.content) {
        this.$toast("请输入发送内容!");
        return;
      }
      if (!this.adviceParams.messageToTarget) {
        this.$toast("请选择发送对象!");
        return;
      }
      request(url, this.adviceParams).then(o => {
        if (o.state) {
          this.showAdviceModal = false;
          this.$toast("操作成功!");
        }
      });
    },
    sendTimeSelected(o) {
      if (!o.value) {
        return;
      }
      if (new Date(o.value) < new Date()) {
        this.$toast("发送时间已过期!");
        this.adviceParams.sendTime = "";
      }
    },
    addPersonByOne() {
      this.addPersonModal.show = true;
      this.showAddModal = false;
    },
    batchAddPerson() {
      this.$parent.importParams = {
        parentPageTitle: "",
        downloadTemplateUrl: `/ca/signIn/batch/template`,
        downloadErrorTemplateUrl: `/ca/courses/batch/error`,
        checkTemplateUrl: `/ca/signIn/batch/excel/${this.sign.id}`,
        templateName: "批量导入模板",
        importBtnType: [
          {
            url: `/ca/signIn/batch/update`,
            method: "post",
            isShowBtn: true,
            name: "增量导入",
            success: data => {
              this.$parent.timestamp = "?timestamp=" + new Date().getTime();
              this.$parent.curRoute = "signInfo";
            }
          }
        ]
      };
      if (this.sign.isAgent) {
        this.$parent.importParams.checkTemplateUrl = `/ca/signIn/agent/batch/excel/${this.sign.id}`;
      }
      this.$parent.quickAddRecord();
    },

    back: function() {
      this.$emit("back");
    },

    initEditSignModal: function() {
      //不可以直接把this.sign赋值给this.editSignModal 否则旧签到会报错,原因不明
      this.editSignModal.signId = this.sign.id;
      this.editSignModal.projectId = this.sign.projectId;
      (this.editSignModal.hourStart = this.sign.hourStart),
        (this.editSignModal.hourEnd = this.sign.hourEnd),
        (this.editSignModal.name = this.sign.name);
      this.editSignModal.startTime = this.sign.startTime;
      this.editSignModal.endTime = this.sign.endTime;
      this.editSignModal.useDynamicCode = this.sign.useDynamicCode;
      this.editSignModal.signWay = this.sign.signWay;
      this.editSignModal.scanQrcodeWithLocation = this.sign.scanQrcodeWithLocation;
      this.editSignModal.qrcodeLocations = this.sign.qrcodeLocations;
      this.editSignModal.locations = this.sign.locations.map(o => {
        o.init = true;
        return o;
      });
      this.editSignModal.signOutTimeEnd = this.sign.signOutTimeEnd;
      this.editSignModal.signOutTimeStart = this.sign.signOutTimeStart;
      this.editSignModal.isSignOut = this.sign.isSignOut;
      this.editSignModal.needOut = this.sign.needOut;
    },
    initTable: function() {
      if (this.sign.needOut) {
        let that = this;
        this.tableParams.columns = [
          {
            id: "userNo",
            title: this.i18n.signInfo.userNo,
            className: "text-left",
            width: "120px",
            hidden: false,
            search: {
              type: "input",
              data: {
                placeholder: ""
              }
            }
          },
          {
            id: "name",
            title: this.i18n.signInfo.userName,
            className: "text-left",
            width: "55px",
            hidden: false,
            search: {
              type: "input",
              data: {
                placeholder: ""
              }
            }
          },
          {
            id: "college",
            title: this.i18n.signInfo.college,
            className: "text-left",
            width: "120px",
            hidden: false,
            search: {
              type: "select",
              data: {
                // options: this.searchOptions.colleges,
                url: "/api/colleges",
                optionsLabel: "name",
                optionsValue: "code",
                placeholder: ""
              }
            },
            formatter(record) {
              return record.college;
            }
          },
          {
            id: "classId",
            title: "行政班级",
            className: "text-left",
            width: "120px",
            hidden: false,
            search: {
              type: "select",
              data: {
                options: this.classArr,
                optionsLabel: "text",
                optionsValue: "id",
                placeholder: ""
              }
            },
            formatter(record) {
              return record.className;
            }
          },
          {
            id: "signInStatus",
            title: "签到状态",
            className: "text-left",
            width: "80px",
            hidden: that.signTabVal !== "signIn",
            formatter: obj => {
              return newSignStatusDict[obj.signInStatus];
            },
            search: {
              type: "select",
              data: {
                options: this.searchOptions.newSignInStatus,
                optionsLabel: "text",
                optionsValue: "id",
                placeholder: ""
              }
            }
          },
          {
            id: "signInTime",
            title: this.i18n.signInfo.signTime,
            className: "text-left",
            width: "150px",
            hidden: that.signTabVal !== "signIn"
          },
          {
            id: "signOutStatus",
            title: "签退状态",
            className: "text-left",
            width: "60px",
            hidden: that.signTabVal === "signIn",
            formatter: obj => {
              if (newSignStatusDict[obj.signInStatus] === "请假") {
                return newSignStatusDict[obj.signInStatus];
              }
              return newSignStatusDict[obj.signOutStatus];
            },
            search: {
              type: "select",
              data: {
                options: this.searchOptions.newSignOutStatus,
                optionsLabel: "text",
                optionsValue: "id",
                placeholder: ""
              }
            }
          },
          {
            id: "signOutTime",
            title: "签退时间",
            className: "text-left",
            width: "150px",
            hidden: that.signTabVal === "signIn"
          },
          {
            id: "opt",
            title: "操作",
            className: "text-right",
            hidden: false,
            formatter: obj => {
              let statusOption = {
                signInStatus: {
                  in: "SIGN_IN",
                  not: "NOT_SIGN_IN",
                  manual: "MANUAL_SIGN_IN"
                },
                signOutStatus: {
                  in: "SIGN_OUT",
                  not: "NOT_SIGN_OUT",
                  manual: "MANUAL_SIGN_OUT"
                }
              };
              let opts = [];
              let statusValue = "";
              let showText = "";
              if (that.signTabVal === "signIn") {
                //签到的情况
                statusValue = "signInStatus";
                showText = "签到";
              } else {
                statusValue = "signOutStatus";
                showText = "签退";
              }
              if (obj.signInStatus == "ASK_FOR_LEAVE") {
                //如果签到请假 则不能签退  而且签退列表不能取消请假
                if (that.signTabVal === "signIn") {
                  opts.push({
                    tag: "a",
                    text: "取消请假",
                    className: "opt-btn",
                    callback: (record, index) => {
                      let url = `api/ca/signIn/cancel/askForLeave/${that.signTabVal}/${record.userId}/${record.signInId}`;
                      request(url, {}, "post").then(o => {
                        that.tableParams.ts = +new Date();
                      });
                    }
                  });
                }
              } else if (obj.signOutStatus === "ASK_FOR_LEAVE") {
                if (that.signTabVal !== "signIn") {
                  opts.push({
                    tag: "a",
                    text: "取消请假",
                    className: "opt-btn",
                    callback: (record, index) => {
                      let url = `api/ca/signIn/cancel/askForLeave/${that.signTabVal}/${record.userId}/${record.signInId}`;
                      request(url, {}, "post").then(o => {
                        that.tableParams.ts = +new Date();
                      });
                    }
                  });
                }
              } else if (obj[statusValue] == statusOption[statusValue].not) {
                opts.push({
                  tag: "a",
                  text: "手动" + showText,
                  className: "opt-btn",
                  callback: (record, index) => {
                    let url = `api/ca/signIn/manualSign/${that.signTabVal}/${record.userId}/${record.signInId}`;
                    request(url, {}, "post").then(o => {
                      that.tableParams.ts = +new Date();
                    });
                  }
                });
                opts.push({
                  tag: "a",
                  text: "请假",
                  className: "opt-btn",
                  callback: (record, index) => {
                    let url = `api/ca/signIn/askForLeave/${that.signTabVal}/${record.userId}/${record.signInId}`;
                    request(url, {}, "post").then(o => {
                      that.tableParams.ts = new Date();
                    });
                  }
                });
              } else if (obj[statusValue] == statusOption[statusValue].manual) {
                opts.push({
                  tag: "a",
                  text: "取消手动" + showText,
                  className: "opt-btn",
                  callback: (record, index) => {
                    let url = `api/ca/signIn/cancel/manualSign/${that.signTabVal}/${record.userId}/${record.signInId}`;
                    request(url, {}, "post").then(o => {
                      that.tableParams.ts = +new Date();
                    });
                  }
                });
              }
              opts.push({
                tag: "a",
                text: "删除",
                className: "opt-btn",
                callback: (record, index) => {
                  if (confirm("是否删除?")) {
                    let url = `api/ca/signIn/delete/${record.userId}/${record.signInId}`;
                    request(url, {}, "post").then(o => {
                      that.tableParams.ts = new Date();
                    });
                  }
                }
              });
              return opts;
            }
          }
        ];
        return;
      }
      if (this.editSignModal.signWay === "outside") {
        //外勤打卡特殊处理
        if (this.userType === "PROXY") {
          //代理特殊处理
          this.tableParams.columns = [
            {
              id: "name",
              title: this.i18n.signInfo.userName,
              className: "text-left",
              width: "55px",
              hidden: false,
              search: {
                type: "input",
                data: {
                  placeholder: ""
                }
              }
            },
            {
              id: "userNo",
              title: this.i18n.signInfo.userNo,
              className: "text-left",
              width: "120px",
              hidden: false,
              search: {
                type: "input",
                data: {
                  placeholder: ""
                }
              }
            },
            {
              id: "collegeCode",
              title: this.i18n.signInfo.college,
              className: "text-left",
              width: "120px",
              hidden: false,
              search: {
                type: "select",
                data: {
                  // options: this.searchOptions.colleges,
                  url: "/api/colleges",
                  optionsLabel: "name",
                  optionsValue: "code",
                  placeholder: ""
                }
              },
              formatter(record) {
                return record.college;
              }
            },
            {
              id: "classId",
              title: "班级",
              className: "text-left",
              width: "120px",
              hidden: false,
              search: {
                type: "select",
                data: {
                  options: this.classArr,
                  optionsLabel: "text",
                  optionsValue: "id",
                  placeholder: ""
                }
              }
            },
            {
              id: "status",
              title: this.i18n.signInfo.signStatus,
              className: "text-left",
              width: "60px",
              hidden: false,
              formatter: obj => {
                return signStatusDict[obj.signInStatus];
              },
              search: {
                type: "select",
                data: {
                  options: this.searchOptions.status,
                  optionsLabel: "text",
                  optionsValue: "id",
                  placeholder: ""
                }
              }
            },
            {
              id: "signInTime",
              title: this.i18n.signInfo.signTime,
              className: "text-left",
              width: "150px",
              hidden: false
            },
            {
              id: "address",
              title: "打卡地点",
              className: "text-left",
              width: "150px",
              hidden: false,
              formatter: obj => {
                let opts = [];
                opts.push({
                  tag: "a",
                  text: obj.address,
                  className: "opt-btn",
                  callback: (record, index) => {
                    this.showAddressDetail(record);
                  }
                });
                return opts;
              }
            },
            {
              id: "remark",
              title: this.i18n.signInfo.remark,
              className: "text-left",
              width: "250px",
              hidden: false
            },
            {
              id: "opt",
              title: "",
              className: "text-right",
              hidden: false,
              formatter: obj => {
                let opts = [];
                if (obj["signInStatus"] == "NOT_SIGN") {
                  opts.push({
                    tag: "a",
                    text: this.i18n.signInfo.recordByHand,
                    className: "opt-btn",
                    callback: (record, index) => {
                      this.signManualModal.userId = record.userId;
                      this.signManualModal.userNo = record.userNo;
                      this.signManualModal.signId = record.signInId;
                      this.signManualModal.createDate = record.createDate;
                      this.signManualModal.show = true;
                    }
                  });
                }
                if (this.isManager) {
                  opts.push({
                    tag: "a",
                    text: this.i18n.signInfo.remove,
                    className: "opt-btn",
                    callback: (record, index) => {
                      if (
                        window.confirm(
                          "确定把" + record.name + "从此次签到中移除?"
                        )
                      ) {
                        backend.removePersonFromSign(
                          record.signInId,
                          record.userId,
                          record.createDate,
                          (err, result) => {
                            if (err) {
                              return this.$toast(this.i18n.error.networkError);
                            }
                            if (!result.state) {
                              return this.$toast(result.message);
                            }
                            this.$toast(this.i18n.tip.removeSuccess);
                            this.tableParams.ts = +new Date();
                          }
                        );
                      }
                    }
                  });
                }
                return opts;
              }
            }
          ];
        } else {
          this.tableParams.columns = [
            {
              id: "name",
              title: this.i18n.signInfo.userName,
              className: "text-left",
              width: "55px",
              hidden: false,
              search: {
                type: "input",
                data: {
                  placeholder: ""
                }
              }
            },
            {
              id: "userNo",
              title: this.i18n.signInfo.userNo,
              className: "text-left",
              width: "120px",
              hidden: false,
              search: {
                type: "input",
                data: {
                  placeholder: ""
                }
              }
            },
            {
              id: "college",
              title: this.i18n.signInfo.college,
              className: "text-left",
              width: "120px",
              hidden: false,
              search: {
                type: "select",
                data: {
                  // options: this.searchOptions.colleges,
                  url: "/api/colleges",
                  optionsLabel: "name",
                  optionsValue: "code",
                  placeholder: ""
                }
              },
              formatter(record) {
                return record.college;
              }
            },
            {
              id: "classId",
              title: "班级",
              className: "text-left",
              width: "120px",
              hidden: false,
              search: {
                type: "select",
                data: {
                  options: this.classArr,
                  optionsLabel: "text",
                  optionsValue: "id",
                  placeholder: ""
                }
              }
            },
            {
              id: "grade",
              title: "年级",
              className: "text-left",
              width: "120px",
              hidden: false,
              search: {
                type: "select",
                data: {
                  options: this.gradeYear,
                  optionsLabel: "label",
                  optionsValue: "value",
                  placeholder: ""
                }
              }
            },
            {
              id: "educationLevel ",
              title: "培养层次",
              className: "text-left",
              width: "120px",
              hidden: false,
              search: {
                type: "select",
                data: {
                  options: this.eduList,
                  optionsLabel: "label",
                  optionsValue: "value",
                  placeholder: ""
                }
              }
            },
            {
              id: "unit",
              title: "部门",
              className: "text-left",
              width: "120px",
              hidden: false,
              search: {
                type: "select",
                data: {
                  options: this.unitList,
                  optionsLabel: "name",
                  optionsValue: "id",
                  placeholder: ""
                }
              }
            },
            {
              id: "signInStatus",
              title: this.i18n.signInfo.signStatus,
              className: "text-left",
              width: "60px",
              hidden: false,
              formatter: obj => {
                return signStatusDict[obj["signInStatus"]];
              },
              search: {
                type: "select",
                data: {
                  options: this.searchOptions.status,
                  optionsLabel: "text",
                  optionsValue: "id",
                  placeholder: ""
                }
              }
            },
            {
              id: "signInTime",
              title: this.i18n.signInfo.signTime,
              className: "text-left",
              width: "150px",
              hidden: false
            },
            {
              id: "address",
              title: "打卡地点",
              className: "text-left",
              width: "150px",
              hidden: false,
              formatter: obj => {
                let opts = [];
                opts.push({
                  tag: "a",
                  text: obj.address,
                  className: "opt-btn",
                  callback: (record, index) => {
                    this.showAddressDetail(record);
                  }
                });
                return opts;
              }
            },
            {
              id: "remark",
              title: this.i18n.signInfo.remark,
              className: "text-left",
              width: "250px",
              hidden: false
            },
            {
              id: "opt",
              title: "",
              className: "text-right",
              hidden: false,
              formatter: obj => {
                let opts = [];
                if (obj.picture) {
                  //如果有图片
                  opts.push({
                    tag: "a",
                    text: "查看图片",
                    className: "opt-btn",
                    callback: (record, index) => {
                      this.showImgDetail(record.picture);
                    }
                  });
                }
                if (obj["signInStatus"] == "NOT_SIGN") {
                  opts.push({
                    tag: "a",
                    text: this.i18n.signInfo.recordByHand,
                    className: "opt-btn",
                    callback: (record, index) => {
                      this.signManualModal.userId = record.userId;
                      this.signManualModal.userNo = record.userNo;
                      this.signManualModal.signId = record.signInId;
                      this.signManualModal.createDate = record.createDate;
                      this.signManualModal.show = true;
                    }
                  });
                }
                if (this.isManager) {
                  opts.push({
                    tag: "a",
                    text: this.i18n.signInfo.remove,
                    className: "opt-btn",
                    callback: (record, index) => {
                      if (
                        window.confirm(
                          "确定把" + record.name + "从此次签到中移除?"
                        )
                      ) {
                        backend.removePersonFromSign(
                          record.signInId,
                          record.userId,
                          record.createDate,
                          (err, result) => {
                            if (err) {
                              return this.$toast(this.i18n.error.networkError);
                            }
                            if (!result.state) {
                              return this.$toast(result.message);
                            }
                            this.$toast(this.i18n.tip.removeSuccess);
                            this.tableParams.ts = +new Date();
                          }
                        );
                      }
                    }
                  });
                }
                return opts;
              }
            }
          ];
        }

        return;
      }
      if (this.userType === "PROXY") {
        //代理特殊处理
        this.tableParams.columns = [
          {
            id: "name",
            title: this.i18n.signInfo.userName,
            className: "text-left",
            width: "55px",
            hidden: false,
            search: {
              type: "input",
              data: {
                placeholder: ""
              }
            }
          },
          {
            id: "userNo",
            title: this.i18n.signInfo.userNo,
            className: "text-left",
            width: "120px",
            hidden: false,
            search: {
              type: "input",
              data: {
                placeholder: ""
              }
            }
          },
          {
            id: "collegeCode",
            title: this.i18n.signInfo.college,
            className: "text-left",
            width: "120px",
            hidden: false,
            search: {
              type: "select",
              data: {
                // options: this.searchOptions.colleges,
                url: "/api/colleges",
                optionsLabel: "name",
                optionsValue: "code",
                placeholder: ""
              }
            },
            formatter(record) {
              return record.college;
            }
          },
          {
            id: "classId",
            title: "班级",
            className: "text-left",
            width: "120px",
            hidden: false,
            search: {
              type: "select",
              data: {
                options: this.classArr,
                optionsLabel: "text",
                optionsValue: "id",
                placeholder: ""
              }
            }
          },
          {
            id: "status",
            title: this.i18n.signInfo.signStatus,
            className: "text-left",
            width: "60px",
            hidden: false,
            formatter: obj => {
              return signStatusDict[obj.signInStatus];
            },
            search: {
              type: "select",
              data: {
                options: this.searchOptions.status,
                optionsLabel: "text",
                optionsValue: "id",
                placeholder: ""
              }
            }
          },
          {
            id: "signInTime",
            title: this.i18n.signInfo.signTime,
            className: "text-left",
            width: "150px",
            hidden: false
          },
          {
            id: "remark",
            title: this.i18n.signInfo.remark,
            className: "text-left",
            width: "250px",
            hidden: false
          },
          {
            id: "opt",
            title: "",
            className: "text-right",
            hidden: false,
            formatter: obj => {
              let opts = [];
              if (obj["signInStatus"] == "NOT_SIGN") {
                opts.push({
                  tag: "a",
                  text: this.i18n.signInfo.recordByHand,
                  className: "opt-btn",
                  callback: (record, index) => {
                    this.signManualModal.userId = record.userId;
                    this.signManualModal.userNo = record.userNo;
                    this.signManualModal.signId = record.signInId;
                    this.signManualModal.createDate = record.createDate;
                    this.signManualModal.show = true;
                  }
                });
              }
              if (this.isManager) {
                opts.push({
                  tag: "a",
                  text: this.i18n.signInfo.remove,
                  className: "opt-btn",
                  callback: (record, index) => {
                    if (
                      window.confirm(
                        "确定把" + record.name + "从此次签到中移除?"
                      )
                    ) {
                      backend.removePersonFromSign(
                        record.signInId,
                        record.userId,
                        record.createDate,
                        (err, result) => {
                          if (err) {
                            return this.$toast(this.i18n.error.networkError);
                          }
                          if (!result.state) {
                            return this.$toast(result.message);
                          }
                          this.$toast(this.i18n.tip.removeSuccess);
                          this.tableParams.ts = +new Date();
                        }
                      );
                    }
                  }
                });
              }
              return opts;
            }
          }
        ];
      } else {
        this.tableParams.columns = [
          {
            id: "name",
            title: this.i18n.signInfo.userName,
            className: "text-left",
            width: "55px",
            hidden: false,
            search: {
              type: "input",
              data: {
                placeholder: ""
              }
            }
          },
          {
            id: "userNo",
            title: this.i18n.signInfo.userNo,
            className: "text-left",
            width: "120px",
            hidden: false,
            search: {
              type: "input",
              data: {
                placeholder: ""
              }
            }
          },
          {
            id: "college",
            title: this.i18n.signInfo.college,
            className: "text-left",
            width: "120px",
            hidden: false,
            search: {
              type: "select",
              data: {
                // options: this.searchOptions.colleges,
                url: "/api/colleges",
                optionsLabel: "name",
                optionsValue: "code",
                placeholder: ""
              }
            },
            formatter(record) {
              return record.college;
            }
          },
          {
            id: "classId",
            title: "班级",
            className: "text-left",
            width: "120px",
            hidden: false,
            search: {
              type: "select",
              data: {
                options: this.classArr,
                optionsLabel: "text",
                optionsValue: "id",
                placeholder: ""
              }
            }
          },
          {
            id: "grade",
            title: "年级",
            className: "text-left",
            width: "120px",
            hidden: false,
            search: {
              type: "select",
              data: {
                options: this.gradeYear,
                optionsLabel: "label",
                optionsValue: "value",
                placeholder: ""
              }
            }
          },
          {
            id: "educationLevel ",
            title: "培养层次",
            className: "text-left",
            width: "120px",
            hidden: false,
            search: {
              type: "select",
              data: {
                options: this.eduList,
                optionsLabel: "label",
                optionsValue: "value",
                placeholder: ""
              }
            }
          },
          {
            id: "unit",
            title: "部门",
            className: "text-left",
            width: "120px",
            hidden: false,
            search: {
              type: "select",
              data: {
                options: this.unitList,
                optionsLabel: "name",
                optionsValue: "id",
                placeholder: ""
              }
            }
          },
          {
            id: "signInStatus",
            title: this.i18n.signInfo.signStatus,
            className: "text-left",
            width: "60px",
            hidden: false,
            formatter: obj => {
              return signStatusDict[obj["signInStatus"]];
            },
            search: {
              type: "select",
              data: {
                options: this.searchOptions.status,
                optionsLabel: "text",
                optionsValue: "id",
                placeholder: ""
              }
            }
          },
          {
            id: "signInTime",
            title: this.i18n.signInfo.signTime,
            className: "text-left",
            width: "150px",
            hidden: false
          },
          {
            id: "remark",
            title: this.i18n.signInfo.remark,
            className: "text-left",
            width: "250px",
            hidden: false
          },
          {
            id: "opt",
            title: "",
            className: "text-right",
            hidden: false,
            formatter: obj => {
              let opts = [];
              if (obj["signInStatus"] == "NOT_SIGN") {
                opts.push({
                  tag: "a",
                  text: this.i18n.signInfo.recordByHand,
                  className: "opt-btn",
                  callback: (record, index) => {
                    this.signManualModal.userId = record.userId;
                    this.signManualModal.userNo = record.userNo;
                    this.signManualModal.signId = record.signInId;
                    this.signManualModal.createDate = record.createDate;
                    this.signManualModal.show = true;
                  }
                });
              }
              if (this.isManager) {
                opts.push({
                  tag: "a",
                  text: this.i18n.signInfo.remove,
                  className: "opt-btn",
                  callback: (record, index) => {
                    if (
                      window.confirm(
                        "确定把" + record.name + "从此次签到中移除?"
                      )
                    ) {
                      backend.removePersonFromSign(
                        record.signInId,
                        record.userId,
                        record.createDate,
                        (err, result) => {
                          if (err) {
                            return this.$toast(this.i18n.error.networkError);
                          }
                          if (!result.state) {
                            return this.$toast(result.message);
                          }
                          this.$toast(this.i18n.tip.removeSuccess);
                          this.tableParams.ts = +new Date();
                        }
                      );
                    }
                  }
                });
              }
              return opts;
            }
          }
        ];
      }
    },
    toEditSign: function() {
      this.editSignModal.show = true;
    },
    normalizeDateString: function(dateValue) {
      if (!dateValue) {
        return dateValue;
      }
      return dateValue.length !== 19 ? dateValue + ":00" : dateValue;
    },
    changeProxy: function(obj) {
      if (!obj.val) {
        return;
      }
      let proxyId = obj.val;
      for (let proxy of this.proxy.proxies) {
        if (proxy.id !== proxyId) {
          continue;
        }
        this.setCurrentProxy(proxy);
        this.refreshQrcode();
      }
    },
    saveSign: function() {
      if (this.sign.needOut) {
        let params = JSON.parse(JSON.stringify(this.editSignModal));
        params.signInName = params.name;
        params.signInTimeStart = params.startTime;
        params.signInTimeEnd = params.endTime;
        params.dynamicCode = params.useDynamicCode ? true : false;
        params.isLocation = params.scanQrcodeWithLocation ? true : false;
        params.ranges = params.qrcodeLocations.map(o => {
          return {
            longitude: o.lng,
            latitude: o.lat,
            distance: o.radius,
            address: o.address
          };
        });
        let url = `api/ca/signIn/update/${this.editSignModal.signId}`;
        request(url, params, "post").then(o => {
          if (o.state) {
            if (this.editSignModal.useDynamicCode) {
              this.sign.useDynamicCode = true;
              this.initQrcode();
            } else {
              this.sign.useDynamicCode = false;
              this.stopQrcodeTimer();
            }
            this.editSignModal.show = false;
            this.$toast("操作成功!");
          } else {
            this.$toast(o.message);
          }
        });
        return;
      }
      backend.editSign(this.editSignModal, (err, result) => {
        if (err) {
          return this.$toast(this.i18n.error.networkError);
        }
        if (!result.state) {
          return this.$toast(result.message);
        }
        // this.editSignModal.hourStart = result.data.hourStart
        // this.editSignModal.hourEnd = result.data.hourEnd
        this.syncSignInfo();
        // this.initEditSignModal()
        this.editSignModal.show = false;
        if (this.editSignModal.signWay === "qrcode") {
          this.initQrcode();
        } else {
          this.stopQrcodeTimer();
        }
        this.$toast(this.i18n.tip.saveSuccess);
      });
    },
    syncSignInfo: function() {
      this.sign.name = this.editSignModal.name;
      this.sign.startTime = this.editSignModal.startTime;
      this.sign.endTime = this.editSignModal.endTime;
      this.sign.hourStart = this.editSignModal.hourStart;
      this.sign.hourEnd = this.editSignModal.hourEnd;
      this.sign.useDynamicCode = this.editSignModal.useDynamicCode;
      this.sign.signWay = this.editSignModal.signWay;
      this.sign.scanQrcodeWithLocation = this.editSignModal.scanQrcodeWithLocation;
      this.sign.qrcodeLocations = this.editSignModal.qrcodeLocations;
      this.sign.locations = this.editSignModal.locations;
    },
    showStat: function() {
      this.statModal.loading = true;
      this.statModal.show = true;
      let start = "";
      let end = "";
      if (this.statDate.length) {
        start = this.statDate[0];
        end = this.statDate[1];
      }
      backend.getGeneralSignStat(this.sign.id, start, end, (err, result) => {
        if (err) {
          return this.$toast(this.i18n.error.networkError);
        }
        if (!result.state) {
          return this.$toast(result.message);
        }
        this.statModal.loading = false;
        let stat = result.data;
        if (!stat) {
          return (this.statModal.noStat = true);
        }
        this.statModal.noStat = false;
        // this.statModal.generalChart.legend.total.num = stat.count
        this.statModal.generalChart.legend.done.num = stat.countSign;
        this.statModal.generalChart.legend.todo.num = stat.countNotSinIn;
        // this.statModal.generalChart.legend.manual.num = stat.countManualEntry
        this.statModal.syncTime = stat.timeTemp;

        this.$nextTick(() => {
          this.refreshGeneralChart();
        });
      });
    },
    getSignOptionWidth: function(overview) {
      // TODO 重构这段愚蠢的代码
      let doneRate = overview.done / overview.total;
      let manualRate = overview.manual / overview.total;
      let todoRate = overview.todo / overview.total;

      if (
        overview.total == 0 ||
        (todoRate == doneRate && todoRate == manualRate)
      ) {
        todoRate = doneRate = manualRate = 0.3333333;
      }
      let doneWidth = this.statModal.totalWidth * doneRate;
      let manualWidth = this.statModal.totalWidth * manualRate;
      let todoWidth = this.statModal.totalWidth * todoRate;

      let deviation = 0;
      if (doneWidth < 10) {
        deviation += 10 - doneWidth;
        doneWidth = 10;
      }
      if (manualWidth < 10) {
        deviation += 10 - manualWidth;
        manualWidth = 10;
      }
      if (todoWidth < 10) {
        deviation += 10 - todoWidth;
        todoWidth = 10;
      }
      if (doneWidth < manualWidth) {
        if (manualWidth > todoWidth) {
          manualWidth -= deviation;
        } else {
          if (doneWidth > todoWidth) {
            doneWidth -= deviation;
          } else {
            todoWidth -= deviation;
          }
        }
      } else if (doneWidth > todoWidth) {
        doneWidth -= deviation;
      } else {
        if (manualWidth > todoWidth) {
          manualWidth -= deviation;
        } else {
          todoWidth -= deviation;
        }
      }
      return {
        done: doneWidth,
        manual: manualWidth,
        todo: todoWidth
      };
    },

    initChartIfNotInit: function() {
      this.statModal.generalChart.instance = echarts.init(
        document.getElementById("general-chart")
      );
    },
    initQrcode: function() {
      this.createSignUrl(url => {
        if (!url) {
          return;
        }
        this.qrcode.url = url;
        if (!this.qrcode.instance) {
          if (this.sign.needOut) {
            // if (this.$parent.isAgent) {
            //   this.qrcode.instance = new QRCode('needOut-sign-qrcode-isAgent', { text: url, width: 400, height: 400 })
            // } else if (this.$parent.isPerson) {
            //   this.qrcode.instance = new QRCode('needOut-sign-qrcode-isPerson', { text: url, width: 400, height: 400 })
            // } else {
            //   this.qrcode.instance = new QRCode('needOut-sign-qrcode', { text: url, width: 400, height: 400 })
            // }
          } else {
            this.qrcode.instance = new QRCode("sign-qrcode", {
              text: url,
              width: 400,
              height: 400
            });
          }
        } else {
          this.qrcode.instance.clear();
          this.qrcode.instance.makeCode(url);
        }
        if (!this.sign.useDynamicCode) {
          this.stopQrcodeTimer();
          return;
        }
        this.startQrcodeTimer();
      });
    },
    refreshQrcode: function() {
      this.createSignUrl(url => {
        if (!url) {
          return;
        }
        this.qrcode.url = url;
        if (!this.qrcode.instance) {
          if (this.sign.needOut) {
            // this.qrcode.instance = new QRCode('needOut-sign-qrcode', { text: url, width: 400, height: 400 })
          } else {
            this.qrcode.instance = new QRCode("sign-qrcode", {
              text: url,
              width: 400,
              height: 400
            });
          }
        } else {
          this.qrcode.instance.clear();
          this.qrcode.instance.makeCode(url);
        }
      });
    },
    startQrcodeTimer: function() {
      this.stopQrcodeTimer();
      this.qrcode.timer = setInterval(() => {
        this.refreshQrcode();
      }, 10000);
    },
    stopQrcodeTimer: function() {
      if (this.qrcode.timer) {
        clearInterval(this.qrcode.timer);
        this.qrcode.timer = null;
      }
    },
    refreshGeneralChart: function() {
      this.initChartIfNotInit();
      this.statModal.generalChart.options.series[0].data = [
        {
          value: this.statModal.generalChart.legend.done.num,
          name: "已签到"
        },
        {
          name: "未签到",
          value: this.statModal.generalChart.legend.todo.num
        }
      ];
      this.statModal.generalChart.instance.setOption(
        this.statModal.generalChart.options
      );
    },
    getRadioIcon: function(checked) {
      return checked ? "radio_button_checked" : "radio_button_unchecked";
    },
    changeStatType: function(type) {
      this.statType = type;
      let control = this.statModal.control[type];
      for (let _type in this.statModal.control) {
        this.statModal.control[_type].checked = false;
      }
      control.checked = true;
      this.statModal.currentControl = type;
      if (type != "general") {
        let start = "";
        let end = "";
        if (this.statDate.length) {
          start = this.statDate[0];
          end = this.statDate[1];
        }
        backend.getSignStatByType(
          this.sign.id,
          control.type,
          start,
          end,
          (err, result) => {
            if (err) {
              return this.$toast(this.i18n.error.networkError);
            }
            if (!result.state) {
              return this.$toast(result.message);
            }
            control.data = result.data.map(_stat => {
              let stat = {
                overview: {
                  total: _stat.overview.count,
                  done: _stat.overview.countSign,
                  manual: _stat.overview.countManualEntry,
                  todo: _stat.overview.countNotSinIn
                },
                title: _stat.title,
                sort: _stat.sort
              };
              stat.widthData = this.getSignOptionWidth(stat.overview);
              return stat;
            });
          }
        );
      } else {
        this.showStat();
      }
    },
    fullscreen: function() {
      this.qrcode.oldInstance = this.qrcode.instance;
      this.qrcode.fullscreen = true;
      this.$nextTick(() => {
        if (this.sign.needOut) {
          if (this.$parent.isAgent) {
            this.qrcode.instance = new QRCode(
              "needOut-sign-qrcode-isAgent-fullscreen",
              { text: this.qrcode.url, width: 400, height: 400 }
            );
          } else if (this.$parent.isPerson) {
            this.qrcode.instance = new QRCode(
              "needOut-sign-qrcode-isPerson-fullscreen",
              { text: this.qrcode.url, width: 400, height: 400 }
            );
          } else {
            this.qrcode.instance = new QRCode(
              "needOut-sign-qrcode-fullscreen",
              { text: this.qrcode.url, width: 400, height: 400 }
            );
          }
        } else {
          this.qrcode.instance = new QRCode("sign-qrcode-fullscreen", {
            text: this.qrcode.url,
            width: 400,
            height: 400
          });
        }
      });
      if (this.sign.needOut) {
        this.getHasSignList();
        this.setInterFun = setInterval(() => {
          this.getHasSignList();
        }, 5000);
      }
    },
    getHasSignList() {
      // let url = `api/ca/signIn/person/hadSignIn/${this.signTabVal}/${this.sign.id}`
      let url = this.tableUrl;
      if (this.signTabVal === "signIn") {
        url += "&signInStatus=SIGN_IN";
      } else {
        url += "&signOutStatus=SIGN_OUT";
      }
      request(url).then(o => {
        if (this.oldHasSignList) {
          if (o.data.length || this.oldHasSignList.length) {
            //说明有新人签到了
            let newSignList = o.data.filter((row, index, rows) => {
              //过滤掉不是刚签到的用户
              return this.oldHasSignList.indexOf(row.userNo) === -1;
            });
            let successText =
              this.signTabVal === "signIn" ? "签到成功!" : "签退成功!";
            let i = 0;
            let that = this;
            function showNotify() {
              let a = newSignList[i];
              that.$notify({
                title: "提示",
                message: a.college + a.name + successText
              });
              i += 1;
              if (i < newSignList.length) {
                setTimeout(showNotify, 1000);
              }
            }
            if (newSignList.length) {
              showNotify();
            }
          }
        }
        this.oldHasSignList = o.data.map(a => {
          return a.userNo;
        });
      });
    },
    existFullscreen: function() {
      if (this.setInterFun) {
        clearInterval(this.setInterFun);
        this.setInterFun = null;
        this.oldHasSignList = null;
      }
      this.clearQrcodeInstance();
      this.qrcode.instance.clear();
      this.qrcode.fullscreen = false;
      this.qrcode.instance = this.qrcode.oldInstance;
    },
    clearQrcodeInstance: function() {
      let el = this.qrcode.instance._el;
      while (el.hasChildNodes()) {
        el.removeChild(el.lastChild);
      }
    },
    initManagedColleges: function(callback) {
      backend.getBaseSearchOptions((err, result) => {
        if (err) {
          return this.$toast(this.i18n.error.networkError);
        }
        if (!result.state) {
          return this.$toast(result.message);
        }
        for (let college of result.data) {
          if (college.id == -1) {
            college.id = "";
          }
        }
        this.searchOptions.managedColleges = result.data;
        this.searchOptions.colleges = this.searchOptions.managedColleges;
        callback && callback();
      });
    },
    initProxies: function() {
      backend.getMyProxies(this.sign.id, (err, result) => {
        if (err) {
          return this.$toast(this.i18n.error.networkError);
        }
        if (!result.state) {
          return this.$toast(result.message);
        }
        if (!result.data) {
          return this.$toast(this.i18n.error.dataError);
        }
        let schoolProxies = [];
        let collegeProxies = [];
        let classProxies = [];
        let relationshipProxies = [];

        let hasSchoolProxy = false;
        let hasCollegeProxy = false;
        let hasClazzProxy = false;
        let hasInstructorProxy = false;

        for (let proxy of result.data) {
          switch (proxy.distribution) {
            case proxyDistributary.SCHOOL:
              schoolProxies.push(
                this.createMixProxy(
                  proxyDistributary.SCHOOL,
                  proxy.agentId,
                  proxy.agentName,
                  proxy.agentName,
                  null,
                  null
                )
              );
              hasSchoolProxy = true;
              break;
            case proxyDistributary.COLLEGE:
              for (let collegeCode in proxy.colleges) {
                collegeProxies.push(
                  this.createMixProxy(
                    proxyDistributary.COLLEGE,
                    proxy.agentId,
                    proxy.agentName,
                    proxy.colleges[collegeCode],
                    null,
                    collegeCode
                  )
                );
              }
              hasCollegeProxy = true;
              break;
            case proxyDistributary.CLASS:
              for (let classId in proxy.clazz) {
                classProxies.push(
                  this.createMixProxy(
                    proxyDistributary.CLASS,
                    proxy.agentId,
                    proxy.agentName,
                    proxy.clazz[classId],
                    classId,
                    null
                  )
                );
              }
              hasClazzProxy = true;
              break;
            case proxyDistributary.RELATIONSHIP:
              relationshipProxies.push(
                this.createMixProxy(
                  proxyDistributary.RELATIONSHIP,
                  proxy.agentId,
                  proxy.agentName,
                  proxy.agentName,
                  null,
                  null
                )
              );
              hasInstructorProxy = true;
              break;
            default:
              console.warn("unknown proxy:", proxy);
              break;
          }
        }
        this.proxy.proxies = schoolProxies.concat(
          collegeProxies.concat(classProxies.concat(relationshipProxies))
        );
        this.setCurrentProxy(this.proxy.proxies[0]);
        this.$nextTick(() => {
          this.initQrcode();
        });
        this.statModal.control.college.show = false;
        this.statModal.control.instructor.show = false;
        this.statModal.control.clazz.show = false;
        if (hasSchoolProxy) {
          this.statModal.control.college.show = true;
          this.statModal.control.instructor.show = true;
          this.statModal.control.clazz.show = true;
        } else if (hasCollegeProxy) {
          this.statModal.control.college.show = true;
          this.statModal.control.clazz.show = true;
        } else if (hasInstructorProxy || hasClazzProxy) {
          this.statModal.control.clazz.show = true;
        }
      });
    },
    setCurrentProxy: function(currentProxy) {
      this.proxy.id = currentProxy.id;
      this.proxy.proxyId = currentProxy.proxyId;
      this.proxy.name = currentProxy.name;
      this.proxy.collegeCode = currentProxy.collegeCode;
      this.proxy.classId = currentProxy.classId;
      this.proxy.distributary = currentProxy.distributary;
      if (currentProxy.distributary === proxyDistributary.COLLEGE) {
        this.searchOptions.colleges = [
          { id: currentProxy.collegeCode, text: currentProxy.name }
        ];
      } else {
        this.searchOptions.colleges = this.searchOptions.managedColleges;
      }
      this.tableParams.ts = new Date().getTime();
    },
    createMixProxy: function(
      distributary,
      proxyId,
      proxyName,
      name,
      classId,
      collegeCode
    ) {
      let id = `${distributary}-${proxyId}-${classId || "__"}-${collegeCode ||
        "__"}`;
      return {
        id,
        proxyId,
        distributary,
        proxyName,
        name,
        classId: classId || "",
        collegeCode: collegeCode || ""
      };
    },
    signManual: function() {
      if (!this.signManualModal.remark) {
        return this.$toast("您还未填写备注");
      }
      let obj = {
        createDate: this.signManualModal.createDate,
        signId: this.sign.id,
        userId: this.signManualModal.userId,
        remark: this.signManualModal.remark,
        callback: (err, result) => {
          if (err) {
            return this.$toast(this.i18n.error.networkError);
          }
          if (!result.state) {
            return this.$toast(result.message);
          }
          this.$toast(this.i18n.tip.setSuccess);
          this.tableParams.ts = new Date().getTime();
          this.signManualModal.show = false;
        }
      };
      backend.signManual(obj);
    },
    checkUser: function() {
      if (!this.addPersonModal.userNo) {
        return this.$toast("请输入学号");
      }
      this.addPersonModal.userId = null;
      this.addPersonModal.tip = "检测中...";
      backend.checkUserNo(this.addPersonModal.userNo, (err, result) => {
        if (err) {
          return this.$toast(this.i18n.error.networkError);
        }
        if (!result.state) {
          if (result.code == "50001") {
            return (this.addPersonModal.tip = "不存在该学号");
          }
          return this.$toast(result.message);
        }
        this.addPersonModal.userId = result.data.userId;
        this.addPersonModal.userName = this.addPersonModal.tip =
          result.data.name;
      });
    },
    afterSelectAddPerson(a) {
      this.addPersonModal.userId = a.userId;
      this.addPersonModal.userNo = a.userNo;
      this.addPersonModal.name = a.name;
    },
    cancelAddSignPeople() {
      this.addPersonModal.show = false;
    },
    addSignPeople: function() {
      if (!this.addPersonModal.userId) {
        return this.$toast("请输入学号或者姓名!");
      }
      if (this.sign.needOut) {
        // 再强调一次 课堂考勤特有变量  顺便用于处理课堂考勤与原签到之间区别的逻辑
        let url = `api/ca/signIn/${this.addPersonModal.userId}/${this.sign.id}`;
        if (this.sign.isAgent) {
          url = `api/ca/signIn/agent/${this.addPersonModal.userId}/${this.sign.id}`;
        }
        request(url, {}, "post").then(o => {
          if (o.state) {
            this.$toast("添加成功");
            this.tableParams.ts = +new Date();
            this.addPersonModal.show = false;
          } else {
            this.$toast(o.message);
          }
        });
        return;
      }
      backend.addSignPeople(
        this.project.id,
        this.sign.id,
        this.addPersonModal.userId,
        (err, result) => {
          if (err) {
            return this.$toast(this.i18n.error.networkError);
          }
          if (!result.state) {
            if (result.code == "50003") {
              return this.$toast("该人员已经在签到名单中");
            }
            return this.$toast(result.message);
          }
          this.$toast("添加成功");
          this.tableParams.ts = +new Date();
          this.addPersonModal.show = false;
        }
      );
    },
    createSignUrl: function(callback) {
      if (this.sign.needOut) {
        request("api/ca/system/saasId").then(o => {
          let sysId = "default";
          if (o.state) {
            sysId = o.data;
          }
          let codeHref =
            window.location.origin +
            "/mobileTowCodeSign?isSign=true&signId=" +
            this.sign.id +
            "&signTabVal=" +
            this.signTabVal +
            "&timestamp=" +
            new Date().getTime() +
            "&sysId=" +
            sysId;
          callback(codeHref);
        });
        return;
      }
      backend.createSignUrl(
        this.sign.id,
        this.proxy.distributary,
        this.proxy.collegeCode,
        this.proxy.classId,
        this.qrCodeExpireTime,
        (err, result) => {
          if (err) {
            callback();
            return this.$toast(this.i18n.error.networkError);
          }
          if (!result.state) {
            callback();
            return this.$toast(result.message);
          }
          let url =
            window.location.origin + result.data + "?scope=yiban_scan_result";
          callback(url);
        }
      );
    },
    getOutText() {
      if (this.formFields.length) return false;
      let url = "/api/signIns/peoples/export/fields";
      sAjax({
        url: url,
        type: "get",
        success: data => {
          if (data.state) {
            for (let k in data.data) {
              this.formFields.push({
                fieldName: k,
                fieldTitle: data.data[k]
              });
            }
          } else {
            this.formFields = [];
          }
        }
      });
    },
    exportSigns: function() {
      let searchFields = this.$refs["sign-table"].tableSearchFields || {};
      if (this.sign.needOut) {
        let filename = new Date().format("yyyy-MM-dd") + this.sign.name;
        if (this.signTabVal === "signIn") {
          filename += "签到列表";
        } else {
          filename += "签退列表";
        }
        let url = `/downloads/ca/signIn/person/export/${this.signTabVal}/${this.sign.id}?filename=${filename}&`;
        if (this.sign.isAgent) {
          url = `/downloads/ca/signIn/agent/person/export/${this.signTabVal}/${this.sign.id}?filename=${filename}&`;
        }
        for (var i in searchFields) {
          url += i + "=" + searchFields[i] + "&";
        }
        url = url.substring(0, url.length - 1);
        window.location.href = url;
        return;
      }

      if (this.isManager) {
        this.getOutText();
        this.outputModalShow = true;
        // if (this.sign.checkInType == "loop") {
        //   this.getOutText();
        //   this.outputModalShow = true;
        // } else {
        //   backend.exportSignsOfManage(
        //     this.sign.id,
        //     searchFields.name,
        //     searchFields.userNo,
        //     searchFields.college,
        //     searchFields.signInStatus,
        //     searchFields.classId
        //   );
        // }
      } else {
        let filename = this.project.name + this.sign.name + ".xlsx";
        backend.exportSignsOfProxy(
          this.sign.id,
          this.proxy.proxyId,
          searchFields.name,
          searchFields.userNo,
          this.proxy.collegeCode || searchFields.college,
          this.proxy.classId,
          searchFields.signInStatus,
          filename,
          this.dateArea
        );
      }
    }
  },
  beforeDestroy: function() {
    this.stopQrcodeTimer();
  }
};
</script>
<style lang="less">
@import url("../../assets/common.less");
@primaryColor: #298df7;
@blackTextColor: rgba(0, 0, 0, 0.77);
@defaultTextColor: rgba(0, 0, 0, 0.54);
@muteTextColor: rgba(0, 0, 0, 0.36);
.img_modal {
  .modal-content {
    border: none;
    box-shadow: none;
    background: none;
  }
}
.outside_wrap {
  width: 100%;
  padding: 0 15px;
}
.weekDay {
  .info-row {
    display: flex;
    justify-content: space-between;
  }
  span {
    display: block;
    text-align: center;
  }
  span,
  p {
    border-top: 1px solid #e0e0e0;
    position: relative;
    height: 48px;
    line-height: 48px;
    margin-bottom: 0;
    color: rgba(0, 0, 0, 0.67);
    padding: 0 16px;
    i {
      color: rgba(0, 0, 0, 0.4);
    }
    em,
    i {
      font-style: normal;
    }
  }
}
#sign-info {
  margin: 0 auto;
  min-width: 900px;
  max-height: 724px;
  overflow-y: auto;
  .modal-body {
    .form-group {
      position: relative;
      margin-bottom: 0;
      // input {
      //   border: 0;
      //   border-radius: 0;
      //   box-shadow: none;
      //   outline: 0;
      // }
      .check {
        position: absolute;
        right: 30px;
        top: 7px;
      }
      .check-user-tip {
        padding: 6px 12px;
        color: @blackTextColor;
        margin-bottom: 0;
      }
    }
  }
  .tab-div {
    position: relative;
    height: 40px;
    margin: 0;
    background: white;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12);
    border-bottom: 0;
    white-space: nowrap;
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
  .form-wrap {
    &.advice-modal {
      width: 100%;
      flex-wrap: wrap;
      .form-group {
        margin-right: 20px;
        margin-bottom: 5px;
        .label {
          width: 180px;
          font-size: 14px;
          line-height: 29px;
          color: #666;
          text-align: right;
          padding-left: 12px;
          padding-right: 12px;
        }
        .v-textarea {
          border-radius: 5px;
        }
        .v-select,
        .form-control,
        .v-datepicker,
        .v-textarea,
        .ditection {
          width: 200px;
        }
      }
    }
  }
  .table-container .table-title th.table-title-container {
    padding: 20px 8px 6px 24px;
  }
  .back-div {
    cursor: pointer;
    color: @defaultTextColor;
    line-height: 48px;
    i {
      transform: translateY(0.25em);
      margin-right: 5px;
    }
  }
  .edit-btn {
    color: @primaryColor;
    outline: 0;
    & + .edit-btn {
      padding-left: 0;
    }
  }
  .stat-btn {
    height: 100%;
    font-size: 13px;
    color: #ffffff;
    letter-spacing: 0;
    line-height: 24px;
    padding: 6px 16px 6px 12px;
    background: @primaryColor;
    i {
      font-size: 20px;
      margin-right: 8px;
      transform: translateY(0.05em);
    }
  }
  .v-select div.form-control.dropdown-toggle {
    background: transparent;
    box-shadow: none;
  }
  .sign-detail {
    padding: 0;
    .sign-detail-div {
      background: #ffffff;
      //box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
      border-radius: 4px;
      height: 100%;
      .edit {
        position: absolute;
        right: 10px;
        top: 10px;
        color: #666;
        cursor: pointer;
        &:hover {
          color: #333;
        }
      }
    }
    .info-row {
      position: relative;
      height: 48px;
      .title {
        position: absolute;
        left: 16px;
        font-size: 13px;
        color: rgba(0, 0, 0, 0.4);
        letter-spacing: 0;
        line-height: 48px;
      }
      .tow_code {
        position: absolute;
        right: 11px;
        width: 30px;
        height: 30px;
        top: 9px;
        cursor: pointer;
      }
      .time {
        position: absolute;
        right: 16px;
        font-size: 13px;
        color: rgba(0, 0, 0, 0.67);
        letter-spacing: 0;
        line-height: 48px;
      }
      .time-picker {
        .v-datepicker-icon {
          display: none;
        }
        .form-control {
          padding: 16px 22px;
          border: 0 solid #fff;
          border-top: 1px solid #e0e0e0;
        }
        input {
          cursor: pointer;
          background: transparent;
          border: none;
          width: 135px;
          padding: 0;
          line-height: 48px;
          height: 48px;
          text-align: right;
          margin: 0;
          box-shadow: none;
          float: right;
          margin-right: 16px;
        }
      }
      & + .info-row {
        border-top: 1px solid #e0e0e0;
      }

      &.auto-height {
        height: auto;
        .title {
          position: relative;
        }
        .list {
          padding: 0 16px 16px;
          color: rgba(0, 0, 0, 0.67);
          .item {
            & + .item {
              margin-top: 5px;
            }
          }
        }
      }

      .switch {
        height: 48px;
        line-height: 48px;
        position: relative;
        cursor: pointer;
        .label {
          padding-left: 16px;
          font-size: 13px;
          color: rgba(0, 0, 0, 0.4);
        }
        .slider {
          position: absolute;
          top: 0;
          right: 0;
          padding: 0 18px 12px;
          .head {
            width: 20px;
            height: 20px;
            border-radius: 10px;
            background: #f5f5f5;
            box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12),
              0 2px 2px 0 rgba(0, 0, 0, 0.12);
            transform: translateX(0);
            transition: transform 300ms;
          }
          .pipe {
            background: #bdbdbd;
            width: 36px;
            height: 13px;
            border-radius: 10px;
            transform: translateY(17px);
            transition: all 300ms;
          }
        }
        &.on {
          .head {
            background: @primaryColor;
            transform: translateX(16px);
          }
          .pipe {
            background: rgba(63, 81, 181, 0.3);
          }
        }
        &.readonly {
          cursor: default;
          .pipe {
            background: #ccc;
          }
          &.on {
            .head {
              background: #999;
            }
          }
        }
      }
    }
    .qr-code-container {
      margin-top: 10px;
      padding: 10px;
      position: relative;
      .sign-qrcode {
        width: 100%;
      }
      i {
        display: none;
        position: absolute;
        top: 0;
        right: 0;
        cursor: pointer;
        width: 100%;
        height: 100%;
        text-align: center;
        padding-top: calc(50% - 12px);
        background: rgba(255, 255, 255, 0.9);
      }
      &:hover i {
        display: block;
      }
    }
  }
  #stat-modal {
    .loader {
      text-align: center;
      margin-top: 100px;
    }
    .modal-header {
      padding: 20px;
      border-bottom: none;
      i {
        cursor: pointer;
        float: left;
        margin-right: 28px;
      }
      span {
        display: inline-block;
        transform: translateY(2px);
        font-size: 15px;
        color: rgba(0, 0, 0, 0.87);
        letter-spacing: 0;
        line-height: 16px;
      }
      .el-date-editor {
        margin-left: 20px;
        width: 50%;
        padding: 1px 10px;
        height: 32px;
        line-height: 32px;
        font-size: 12px;
        .el-range__icon {
          line-height: 24px;
        }
        .el-range-separator {
          width: 8%;
          line-height: 28px;
        }
      }
    }
    .modal-body {
      position: initial;
      min-height: 400px;
    }
    #stat-control {
      position: absolute;
      top: 24px;
      right: 24px;
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
        background: #f5f5f5;
        border-radius: 4px;
        padding: 20px;
        li {
          cursor: pointer;
          i {
            float: left;
            color: rgba(0, 0, 0, 0.67);
            margin-right: 16px;
          }
          span {
            display: inline-block;
            font-size: 13px;
            transform: translateY(2px);
            color: rgba(0, 0, 0, 0.54);
            letter-spacing: 0;
            line-height: 24px;
          }
          & + li {
            margin-top: 24px;
          }
        }
      }
    }
    #general-chart {
      float: left;
      width: 500px;
      height: 500px;
    }
    #general-chart-text {
      float: left;
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
        border-radius: 4px;
        li {
          padding: 10px;
          .color {
            display: inline-block;
            width: 30px;
            height: 13px;
            transform: translateY(2px);
            border-radius: 3px;
            box-shadow: 1px 1px 3px -3px;
          }
          .text {
            margin-left: 10px;
            color: rgba(0, 0, 0, 0.54);
          }
          .num {
            margin-left: 5px;
            color: rgba(0, 0, 0, 0.77);
          }
        }
      }
    }
    #stat-sync-time {
      position: absolute;
      bottom: 14px;
      left: 24px;
      color: rgba(0, 0, 0, 0.54);
    }
    #bar-chart {
      ul {
        list-style: none;
        padding: 0;
        &.items {
          li.item {
            width: 800px;
            height: 56px;
            margin-bottom: 15px;
            & > .title {
              // display: inline-block;
              width: 90px;
              float: left;
              font-size: 13px;
              color: rgba(0, 0, 0, 0.67);
              letter-spacing: 0;
              line-height: 36px;
              padding-left: 10px;
              white-space: nowrap;
              overflow: hidden;
              margin-right: 10px;
            }
            .bar {
              // display: inline-block;
              width: 550px;
              float: left;
              .bar-chart {
                height: 36px;
                border-radius: 18px;
                background: #f5f5f5;
                overflow: hidden;
                .part {
                  background: #5c6bc0;
                  // display: inline-block;
                  height: 36px;
                  float: left;
                  &.bar-done {
                    opacity: 1;
                  }
                  &.bar-manual {
                    opacity: 0.75;
                  }
                  &.bar-todo {
                    opacity: 0.5;
                  }
                }
              }
              .bar-tip {
                height: 12px;
                font-size: 12px;
                line-height: 12px;
                margin-top: 8px;
                .text {
                  white-space: nowrap;
                  // display: inline-block;
                  float: left;
                  font-size: 12px;
                  color: rgba(0, 0, 0, 0.4);
                  letter-spacing: 0;
                  line-height: 12px;
                  overflow: hidden;
                  height: 12px;
                }
              }
            }
          }
        }
      }
    }
  }
}

#qrcode-fullscreen {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  right: 0;
  z-index: 222;
  background: rgba(255, 255, 255, 1);
  i {
    position: absolute;
    top: 88px;
    right: 24px;
    font-size: 36px;
    cursor: pointer;
    color: rgba(0, 0, 0, 0.54);
    &:hover {
      color: rgba(0, 0, 0, 0.77);
    }
  }
  .qrcode-container {
    margin-top: 250px;
    text-align: center;
    .sign-qrcode-time {
      font-size: 18px;
      color: #666;
    }
  }
}

#sign-qrcode-fullscreen,
#needOut-sign-qrcode-fullscreen {
  width: 400px;
  height: 400px;
  margin: 0 auto;
  margin-bottom: 30px;
  img {
    transition: all 300ms;
    width: 100%;
    height: 100%;
    margin: 0 auto;
  }
}
#sign-qrcode-time {
  font-size: 18px;
  color: rgba(0, 0, 0, 0.77);
}
#sign-qrcode-type {
  margin-top: -20px;
  margin-bottom: 30px;
  color: rgba(0, 0, 0, 0.36);
}
#sign-qrcode-name {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 30px;
}
#sign-qrcode {
  overflow: hidden;
  img {
    transition: all 300ms;
    width: 100%;
    height: 100%;
  }
}
#needOut-sign-qrcode {
  overflow: hidden;
  img {
    transition: all 300ms;
    width: 100%;
    height: 100%;
  }
}
.loader svg {
  transform: translateY(6px);
  margin-right: 5px;
}
</style>
<style lang="less">
.loopTitle {
  h1 {
    font-size: 14px;
  }
  .el-date-editor {
    width: 50%;
    padding: 1px 10px;
    height: 32px;
    line-height: 32px;
    font-size: 12px;
    .el-range-separator {
      width: 8%;
      line-height: 28px;
    }
  }
}
.outPut.list-group {
  margin-top: 20px;
  .list-group-item {
    cursor: pointer;
    border: none;
    span,
    i {
      display: inline-block;
      vertical-align: middle;
    }
  }
}
.dateSelect {
  margin-bottom: 20px;
  margin-left: 20px;
  width: 50%;
  display: flex;
  .el-date-editor {
    padding: 1px 10px;
    height: 32px;
    line-height: 32px;
    font-size: 12px;
    .el-range__icon {
      line-height: 24px;
    }
    .el-range-separator {
      width: 8%;
      line-height: 28px;
    }
  }
}
.sign-detail.over {
  max-height: 600px;
  overflow-y: auto;
  background: #fff;
}
.data-wrap label.el-checkbox {
  margin-right: 30px;
}
</style>
