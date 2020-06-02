<template>
  <div id="mainPage-page" v-if="sys!=='fts'&&sys!=='ca'&&sys!=='cms'">
    <GeminiScrollbar class="main-p" :scrollX="false">
      <div class="shadow_box box_wrap_1">
        <div class="box_head">事务统计</div>
        <div class="box_flex box_main">
          <div
            v-for="(item,index) in thingList"
            :key="index"
            class="box_flex align_center thing_wrap"
            @click="_viewMyAffairs('initiate')"
          >
            <div class="icon_wrap flex_center" :style="{'background-color':item.color}">
              <span class="saasicon" :class="['saasicon-'+ item.icon]"></span>
            </div>
            <div class="name_wrap justify_center box_flex column grow_1">
              <div class="thing_name">{{item.name}}</div>
              <div class="thing_type">{{formatThingType(item.type)}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="shadow_box box_wrap_2">
        <div class="box_head box_flex align_center box_between">
          <div class="box_flex align_center">
            <div class="text">全部应用</div>
            <v-select
              class="appSelect"
              v-model="applicationType"
              :options="applicationTypeList"
              optionsLabel="name"
              optionsValue="id"
            ></v-select>
            <!-- <div style="width:600px;white-space:wrap;display:flex;flex-wrap:wrap;position:relative;z-index:222222;background:white;padding:20px;">
              <div v-for="(item,i) in iconsArr" :key="i" >
              <i class="maticon" v-html="icons(i)"></i>
              {{i}}
            </div>
            </div> -->
            <!-- <div style="display:inline-block">
                <a @click="departmentManage()">部门管理</a>
            </div> -->
            
          </div>
          <div @click="toAppSearch()" class="box_flex align_center more">
            <div class="moreFont">更多</div>
            <i class="maticon" v-html="icons('chevron_right')"></i>
          </div>
        </div>
        <GeminiScrollbar :scrollY="false" :scrollX="true" style="height:120px">
        <div class="box_main box_flex">
          <div
            class="app_child box_flex"
            @click="_checkDetail(item)"
            v-for="(item,index) in applicationList"
            :key="index"
          >
            <div
              class="maticon_wrap flex_center"
              :style="{'background-image':item.background?item.background:'linear-gradient(45deg, #3F87E7 0%, #377EEB 100%)'}"
            >
              <!-- <i class="maticon" :title="item.imgPath" v-html="icons(item.imgPath)">{{item.imgPath}}</i> -->
              <i
                class="maticon"
                :title="item.imgPath"
                v-html="icons(item.imgPath)"
                v-if="item.imgType !== '2'"
              >{{item.imgPath}}</i>
              <i
                class="maticon app-icon-style theme-icon-application"
                v-else-if="item.imgType === '2'"
              >
                <span class="saasicon-44px" :class="['saasicon-44px-'+ item.imgPath]"></span>
              </i>

            </div>
            <div class="grow_1 box_flex column justify_center">
              <div class="title box_flex">{{item.name}}</div>
              <div class="text">{{item.appType.name}}</div>
              <div class="remark" v-if="item.remark">{{item.remark}}</div>
              <span
                @click.stop="collectThis(item)"
                class="collect"
                :class="{active:item.isCollected}"
              ><i class="maticon" v-html="icons('star_border')"></i></span>
            </div>
          </div>
        </div>
        </GeminiScrollbar>
      </div>
      <div class="shadow_box box_wrap_3 box_flex">
        <div class="affairs-container">
          <div class="mainPage-affairs-header">
            <div class="affairs-title">
              <span
                class="examine-all-btn"
                @click="_viewMyAffairs('initiate')"
              >{{translate.examineAll}}</span>
              <span class="affairs-text">{{translate.affairs}}</span>
            </div>
            <div
              class="pull-right affairs-type-tab"
              :style="'margin-right:'+ affairsTabStyle +'px'"
            >
              <div
                :class="val.id === affairsIndex?'active':''"
                v-for="(val, index) in myAffairsTab"
                :key="index"
                @click="_changeAffairsTab(val.id)"
              >
                {{translate[val.id]}}
                <span class="point" v-if="val.isShowPoint"></span>
              </div>
            </div>
          </div>
          <div class="affaris-content">
            <GeminiScrollbar class="my-list" :scrollX="false" v-if="affairsIndex === 'initiate'">
              <div class="text-center empty-data" v-if="myAffairsList.initiate.length === 0">
                <span>{{translate.empty}}</span>
              </div>
              <div
                v-for="(item ,index) in myAffairsList[affairsIndex]"
                :key="index"
                @click="checkInstance(item)"
                v-else
              >
                <div
                  class="my-list-card"
                  v-if="item.status === 'END'"
                  :class="item.result === 'SUCCESS'?'completed':'fail'"
                >
                  <i class="maticon" v-html="icons('done')" v-if="item.result === 'SUCCESS'">done</i>
                  <i class="maticon" v-html="icons('clear')" v-else>clear</i>
                  <div class="title" style="width:80%;">{{item.businessName}}</div>
                </div>
                <div class="my-list-card undone" v-else>
                  <i class="maticon" v-html="icons('more_horiz')">more_horiz</i>
                  <div class="title">{{item.businessName}}</div>
                  <p class="rode">{{item.currentNode.name}}</p>
                </div>
              </div>
              <div
                class="list-group-item text-center"
                :class="isLoadNextPage === false?'no-more':'more'"
              >
                <span v-if="!isLoadNextPage"></span>
                <span @click="_loadNextPage" v-else>{{translate.more}}</span>
              </div>
            </GeminiScrollbar>
            <GeminiScrollbar
              class="my-list waitHandle-list"
              :scrollX="false"
              v-if="affairsIndex === 'waitHandle'"
            >
              <div class="text-center empty-data" v-if="myAffairsList[affairsIndex].length === 0">
                <span>{{translate.empty}}</span>
              </div>
              <div
                class="waitHandle-list-card"
                :style="{'background-image': item.background ? item.background : 'linear-gradient(-135deg, #5067D7 0%, #3F53B8 100%)' }"
                v-for="(item ,index) in myAffairsList[affairsIndex]"
                :key="index"
                @click="_checkDetail(item, 'affaris')"
                v-else
              >
                <i
                  class="maticon"
                  :title="item.imgPath"
                  v-html="icons(item.imgPath)"
                >{{item.imgPath}}</i>
                <span class="title">{{item.name}}</span>
                <span
                  class="number padding-8px pull-right"
                  v-if="item.todoCount < 10"
                >{{item.todoCount}}</span>
                <span
                  class="number padding-6px pull-right"
                  v-else-if="item.todoCount >= 10 && item.todoCount <= 99"
                >{{item.todoCount}}</span>
                <span class="number padding-4px pull-right" v-else>99+</span>
              </div>
            </GeminiScrollbar>
          </div>
        </div>
        <div class="quick_server_wrap box_flex column grow_1">
          <div class="box_head flex_shrink box_flex align_center box_between">快捷服务
            <div v-if="!serverOnlyread" @click="addQuickServer()" class="icon_add_wrap">
              <i class="maticon" v-html="icons('add')"></i>
            </div>
          </div>
          <div class="box_main grow_1 column box_flex flex_wrap" style="height:224px !important">
             <GeminiScrollbar class="my-list" :scrollX="false" v-if="serverList.length>0">
                <a
                  v-if="!serverOnlyread"
                  class="box_child box_flex align_center"
                  v-for="(item,index) in serverList"
                  v-dragging="{ item: item, list: serverList, group: 'server' }"
                  :key="index"
                  @click="toUrl(item.linkUrl)"
                >
                  <div class="color_ball" :style="{'background-color':item.bgColor}"></div>
                  <div class="linkName">{{item.linkName}}</div>
                  <i
                    class="maticon edit"
                    @click.stop="editQuickServer(item,index)"
                    v-html="icons('edit')"
                  >edit</i>
                  <i
                    class="maticon"
                    @click.stop="deleteQuickServer(item,index)"
                    v-html="icons('clear')"
                  >clear</i>
                </a>
                <a
                  v-if="serverOnlyread"
                  class="box_child box_flex align_center"
                  v-for="(item,index) in serverList"
                  :key="index"
                  @click="toUrl(item.linkUrl)"
                >
                  <div class="color_ball" :style="{'background-color':item.bgColor}"></div>
                  <div class="linkName">{{item.linkName}}</div>
                </a>
              </GeminiScrollbar>
          </div>
        </div>
      </div>
      <div class="shadow_box box_wrap_4">
        <div class="container-fluid">
          <div class="page-top-half row" v-if="!isOnlyAdmin">
            <div class="announce-container">
              <div class="announce-part">
                <div class="announce-header">
                  <div class="announce-title">{{translate.announce}}</div>
                  <div class="pull-right announce-type-tab">
                    <a
                      :class="index === announceIndex?'active':''"
                      @click="_changeList(index)"
                      v-for="(val, index) in announces"
                      :key="index"
                    >{{translate[index]}}</a>
                  </div>
                </div>
                <GeminiScrollbar
                  class="announce-body list-group"
                  :scrollX="false"
                  v-if="announces[announceIndex].length > 0"
                >
                  <div
                    class="list-group-item"
                    v-for="(item ,index) in announces[announceIndex]"
                    :key="index"
                    @click="_viewAnnounce(item)"
                  >
                    <span class="announce-date">{{item.createTime}}</span>
                    <span
                      class="announce-type"
                      :class="{'green':item.type=='school','blue':item.type!='school'}"
                    >{{translate[item.type]}}</span>
                    <span class="announce-name">{{item.title}}</span>
                  </div>
                  <div
                    class="list-group-item text-center"
                    :class="pageIndex[announceIndex] < 0?'no-more':'more'"
                  >
                    <span v-if="pageIndex[announceIndex] < 0">{{translate.noMore}}</span>
                    <span
                      @click="_initAnnounceList(announceIndex, pageIndex[announceIndex]++)"
                      v-else
                    >{{translate.more}}</span>
                  </div>
                </GeminiScrollbar>
                <div class="announce-body list-group" v-else>
                  <div class="text-center empty-data">
                    <span>{{translate.empty}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GeminiScrollbar>
    <div class="preview-container" v-if="preview">
      <preview
        :businessId="previewObj.curBusinessId"
        :instanceId="priviewInstanceId"
        :appid="previewObj.appId "
        :data="previewObj.formData.components"
        :title="previewObj.formData.name"
        :script="previewObj.formData.property.script"
        :authorities="previewObj.authorities"
        :defaultData="previewObj.recordData"
        :fileServer="uploadFile"
        :log="previewObj.log"
        @submit="_submit"
        @back="preview = false"
      ></preview>
    </div>
    <v-modal :show="showQuickServerModal" effect="fade" width="304">
      <div slot="modal-header" class="modal-header quickServer-header">
        <h5 class="modal-title">{{fangshi}}快捷服务连接</h5>
      </div>
      <div slot="modal-body" class="modal-body iconModal-body" style="padding:0;">
        <div class="quickServer_row">
          <div class="text">连接名称</div>
          <input v-model="linkParams.linkName" type="text">
        </div>
        <div class="quickServer_row" style="padding:0 20px 26px 20px;">
          <div class="text">连接地址</div>
          <input v-model="linkParams.linkUrl" type="text">
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer quickServer-footer flex_box flex_center">
        <button
          type="button"
          class="btn cancel-btn clearBtnBorder"
          @click="showQuickServerModal=false"
        >取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="_saveQuickServer">确定</button>
      </div>
    </v-modal>
  </div>
</template>

<script>
import Vue from "vue";
import { sAjax, request, translation } from "../assets/utils/utils.js";
import appSearch from "./appSearch";
import { setTimeout } from "timers";
export default {
  inject: {
    windowObj: {
      default: null
    }
  },
  props: {
    account: {
      userId: "",
      userName: "",
      type: ""
    }
  },
  created: function() {
    if(sessionStorage.getItem('announceId')){
      let announceId = sessionStorage.getItem('announceId')
      sessionStorage.removeItem('announceId')
      this._viewAnnounce({
        announcementId:announceId,
        title:'公告详情'
      })
    }
    this.sys = this.$route.query.sys
    var la = localStorage.getItem("lang");
    if (translation(la)) {
      this.lang = la;
    }
    this.searchPlaceholder = this.translate.placeholder;
    this.isOnlyAdmin = this.account && this.account.type === "ADMIN";
    if (!this.isOnlyAdmin) {
      this._initAnnounceList(this.announceIndex, this.pageIndex["all"]++);
      this._initAffarisList();
      this._initInitiateList(this.initiatePageIndex);
    }

    this._initOrder();
    // sAjax({
    //   url: "/api/sc/activities/types",
    //   type: "get",
    //   success: data => {
    //     if (data.state) {
    //       this.activityAppList = data.data;
    //       this.activityAppList.forEach(app => {
    //         this.$set(app, "imgPath", "assignment");
    //         this.$set(app, "imgType", "1");
    //       });
    //     } else {
    //       this.$toast(data.message);
    //     }
    //   }
    // });
    // sAjax({
    //   url: "/api/payment/userallproject",
    //   type: "get",
    //   data: {
    //     page: 0,
    //     size: 9999
    //   },
    //   success: data => {
    //     if (data.state) {
    //       this.paymentAppList = data.data.content;
    //       this.paymentAppList.forEach(app => {
    //         this.$set(app, "imgPath", "tuition");
    //         this.$set(app, "imgType", "2");
    //       });
    //     } else {
    //       this.$toast(data.message);
    //     }
    //   }
    // });
  },
  data: function() {
    return {
      sys: "",
      fangshi: "",
      showQuickServerModal: false,
      //事务统计列表
      thingList: [
        { icon: "fly", name: "0", type: "initiate", color: "#FEC96F" },
        { icon: "person", name: "0", type: "waitHandle", color: "#307CEC" },
        { icon: "success", name: "0", type: "transfer", color: "#8387C9" },
        { icon: "waiting", name: "0", type: "copySend", color: "#46B7F5" },
        { icon: "personSuccess", name: "0", type: "success", color: "#307CEC" },
        { icon: "noreview", name: "0", type: "noreview", color: "#E34E4E" }
      ],
      //快捷服务列表
      serverList: [],
      applicationTypeList: [
        { id: "1", name: "推荐应用", value: "POPULAR" },
        { id: "2", name: "我的收藏", value: "COLLECTED" }
      ],
      linkParams: {
        linkName: "",
        linkUrl: "https://"
      },
      applicationList: [],
      applicationType: "1",
      priviewInstanceId: "",
      myAffairsPage: false,
      // 控制表单引擎应用型详情页显示
      userType: 1,
      typeList: {
        student: {
          bigType: "student",
          types: []
        },
        teacher: {
          bigType: "teacher",
          types: []
        },
        freshman: {
          bigType: "freshman",
          types: []
        },
        instructor: {
          bigType: "instructor",
          types: []
        }
      },
      appTypeSearchList: {
        student: {
          bigType: "student",
          types: []
        },
        teacher: {
          bigType: "teacher",
          types: []
        },
        freshman: {
          bigType: "freshman",
          types: []
        },
        instructor: {
          bigType: "instructor",
          types: []
        }
      },
      searchName: "",
      applyTypeTitle: "",
      popularApply: [],
      applyType: [],
      initiateList: {},
      waitHandleList: {},
      doneList: {},
      copySendList: {},
      affairsIndex: "initiate",
      curApp: null,
      preview: false,
      setTimeoutSite: false,
      doNotClosePreview: ["countermand", "carbonCopy"],
      needAdviceAuthority: [
        "reject",
        "agree",
        "disagree",
        "carbonCopy",
        "transfer"
      ],
      previewObj: {
        formData: null,
        authorities: null,
        recordData: [],
        log: null,
        curBusinessId: "",
        appId: ""
      },
      isOnlyAdmin: false,
      searchPlaceholder: "",
      isAddClass: false,
      announces: {
        all: [],
        school: [],
        college: [],
        instructor: []
      },
      announceIndex: "all",
      pageSize: 20,
      pageIndex: {
        all: 0,
        school: 0,
        college: 0,
        instructor: 0
      },
      initiatePageIndex: 0,
      isLoadNextPage: false,
      serverOnlyread: false,
      isShowPoint: {
        transfer: true,
        copySend: true,
        waitHandle: true
      },
      myAffairsList: {
        initiate: [],
        waitHandle: [],
        transfer: [],
        copySend: []
      },
      curInstance: null,
      affairsTabStyle: null,
      marginTop63px: 0,
      setWidth: 0,
      activityAppList: [],
      paymentAppList: [],
      iconsArr: {
        "3d_rotation": "&#xe84d;",
        ac_unit: "&#xeb3b;",
        access_alarm: "&#xe190;",
        access_alarms: "&#xe191;",
        access_time: "&#xe192;",
        accessibility: "&#xe84e;",
        accessible: "&#xe914;",
        account_balance: "&#xe84f;",
        account_balance_wallet: "&#xe850;",
        account_box: "&#xe851;",
        account_circle: "&#xe853;",
        adb: "&#xe60e;",
        add: "&#xe145;",
        add_a_photo: "&#xe439;",
        add_alarm: "&#xe193;",
        add_alert: "&#xe003;",
        add_box: "&#xe146;",
        add_circle: "&#xe147;",
        add_circle_outline: "&#xe148;",
        add_location: "&#xe567;",
        add_shopping_cart: "&#xe854;",
        add_to_photos: "&#xe39d;",
        add_to_queue: "&#xe05c;",
        adjust: "&#xe39e;",
        airline_seat_flat: "&#xe630;",
        airline_seat_flat_angled: "&#xe631;",
        airline_seat_individual_suite: "&#xe632;",
        airline_seat_legroom_extra: "&#xe633;",
        airline_seat_legroom_normal: "&#xe634;",
        airline_seat_legroom_reduced: "&#xe635;",
        airline_seat_recline_extra: "&#xe636;",
        airline_seat_recline_normal: "&#xe637;",
        airplanemode_active: "&#xe195;",
        airplanemode_inactive: "&#xe194;",
        airplay: "&#xe055;",
        airport_shuttle: "&#xeb3c;",
        alarm: "&#xe855;",
        alarm_add: "&#xe856;",
        alarm_off: "&#xe857;",
        alarm_on: "&#xe858;",
        album: "&#xe019;",
        all_inclusive: "&#xeb3d;",
        all_out: "&#xe90b;",
        android: "&#xe859;",
        announcement: "&#xe85a;",
        apps: "&#xe5c3;",
        archive: "&#xe149;",
        arrow_back: "&#xe5c4;",
        arrow_downward: "&#xe5db;",
        arrow_drop_down: "&#xe5c5;",
        arrow_drop_down_circle: "&#xe5c6;",
        arrow_drop_up: "&#xe5c7;",
        arrow_forward: "&#xe5c8;",
        arrow_upward: "&#xe5d8;",
        art_track: "&#xe060;",
        aspect_ratio: "&#xe85b;",
        assessment: "&#xe85c;",
        assignment: "&#xe85d;",
        assignment_ind: "&#xe85e;",
        assignment_late: "&#xe85f;",
        assignment_return: "&#xe860;",
        assignment_returned: "&#xe861;",
        assignment_turned_in: "&#xe862;",
        assistant: "&#xe39f;",
        assistant_photo: "&#xe3a0;",
        attach_file: "&#xe226;",
        attach_money: "&#xe227;",
        attachment: "&#xe2bc;",
        audiotrack: "&#xe3a1;",
        autorenew: "&#xe863;",
        av_timer: "&#xe01b;",
        backspace: "&#xe14a;",
        backup: "&#xe864;",
        battery_alert: "&#xe19c;",
        battery_charging_full: "&#xe1a3;",
        battery_full: "&#xe1a4;",
        battery_std: "&#xe1a5;",
        battery_unknown: "&#xe1a6;",
        beach_access: "&#xeb3e;",
        beenhere: "&#xe52d;",
        block: "&#xe14b;",
        bluetooth: "&#xe1a7;",
        bluetooth_audio: "&#xe60f;",
        bluetooth_connected: "&#xe1a8;",
        bluetooth_disabled: "&#xe1a9;",
        bluetooth_searching: "&#xe1aa;",
        blur_circular: "&#xe3a2;",
        blur_linear: "&#xe3a3;",
        blur_off: "&#xe3a4;",
        blur_on: "&#xe3a5;",
        book: "&#xe865;",
        bookmark: "&#xe866;",
        bookmark_border: "&#xe867;",
        border_all: "&#xe228;",
        border_bottom: "&#xe229;",
        border_clear: "&#xe22a;",
        border_color: "&#xe22b;",
        border_horizontal: "&#xe22c;",
        border_inner: "&#xe22d;",
        border_left: "&#xe22e;",
        border_outer: "&#xe22f;",
        border_right: "&#xe230;",
        border_style: "&#xe231;",
        border_top: "&#xe232;",
        border_vertical: "&#xe233;",
        branding_watermark: "&#xe06b;",
        brightness_1: "&#xe3a6;",
        brightness_2: "&#xe3a7;",
        brightness_3: "&#xe3a8;",
        brightness_4: "&#xe3a9;",
        brightness_5: "&#xe3aa;",
        brightness_6: "&#xe3ab;",
        brightness_7: "&#xe3ac;",
        brightness_auto: "&#xe1ab;",
        brightness_high: "&#xe1ac;",
        brightness_low: "&#xe1ad;",
        brightness_medium: "&#xe1ae;",
        broken_image: "&#xe3ad;",
        brush: "&#xe3ae;",
        bubble_chart: "&#xe6dd;",
        bug_report: "&#xe868;",
        build: "&#xe869;",
        burst_mode: "&#xe43c;",
        business: "&#xe0af;",
        business_center: "&#xeb3f;",
        cached: "&#xe86a;",
        cake: "&#xe7e9;",
        call: "&#xe0b0;",
        call_end: "&#xe0b1;",
        call_made: "&#xe0b2;",
        call_merge: "&#xe0b3;",
        call_missed: "&#xe0b4;",
        call_missed_outgoing: "&#xe0e4;",
        call_received: "&#xe0b5;",
        call_split: "&#xe0b6;",
        call_to_action: "&#xe06c;",
        camera: "&#xe3af;",
        camera_alt: "&#xe3b0;",
        camera_enhance: "&#xe8fc;",
        camera_front: "&#xe3b1;",
        camera_rear: "&#xe3b2;",
        camera_roll: "&#xe3b3;",
        cancel: "&#xe5c9;",
        card_giftcard: "&#xe8f6;",
        card_membership: "&#xe8f7;",
        card_travel: "&#xe8f8;",
        casino: "&#xeb40;",
        cast: "&#xe307;",
        cast_connected: "&#xe308;",
        center_focus_strong: "&#xe3b4;",
        center_focus_weak: "&#xe3b5;",
        change_history: "&#xe86b;",
        chat: "&#xe0b7;",
        chat_bubble: "&#xe0ca;",
        chat_bubble_outline: "&#xe0cb;",
        check: "&#xe5ca;",
        check_box: "&#xe834;",
        check_box_outline_blank: "&#xe835;",
        check_circle: "&#xe86c;",
        chevron_left: "&#xe5cb;",
        chevron_right: "&#xe5cc;",
        child_care: "&#xeb41;",
        child_friendly: "&#xeb42;",
        chrome_reader_mode: "&#xe86d;",
        class: "&#xe86e;",
        clear: "&#xe14c;",
        clear_all: "&#xe0b8;",
        close: "&#xe5cd;",
        closed_caption: "&#xe01c;",
        cloud: "&#xe2bd;",
        cloud_circle: "&#xe2be;",
        cloud_done: "&#xe2bf;",
        cloud_download: "&#xe2c0;",
        cloud_off: "&#xe2c1;",
        cloud_queue: "&#xe2c2;",
        cloud_upload: "&#xe2c3;",
        code: "&#xe86f;",
        collections: "&#xe3b6;",
        collections_bookmark: "&#xe431;",
        color_lens: "&#xe3b7;",
        colorize: "&#xe3b8;",
        comment: "&#xe0b9;",
        compare: "&#xe3b9;",
        compare_arrows: "&#xe915;",
        computer: "&#xe30a;",
        confirmation_number: "&#xe638;",
        contact_mail: "&#xe0d0;",
        contact_phone: "&#xe0cf;",
        contacts: "&#xe0ba;",
        content_copy: "&#xe14d;",
        content_cut: "&#xe14e;",
        content_paste: "&#xe14f;",
        control_point: "&#xe3ba;",
        control_point_duplicate: "&#xe3bb;",
        copyright: "&#xe90c;",
        create: "&#xe150;",
        create_new_folder: "&#xe2cc;",
        credit_card: "&#xe870;",
        crop: "&#xe3be;",
        crop_16_9: "&#xe3bc;",
        crop_3_2: "&#xe3bd;",
        crop_5_4: "&#xe3bf;",
        crop_7_5: "&#xe3c0;",
        crop_din: "&#xe3c1;",
        crop_free: "&#xe3c2;",
        crop_landscape: "&#xe3c3;",
        crop_original: "&#xe3c4;",
        crop_portrait: "&#xe3c5;",
        crop_rotate: "&#xe437;",
        crop_square: "&#xe3c6;",
        dashboard: "&#xe871;",
        data_usage: "&#xe1af;",
        date_range: "&#xe916;",
        dehaze: "&#xe3c7;",
        delete: "&#xe872;",
        delete_forever: "&#xe92b;",
        delete_sweep: "&#xe16c;",
        description: "&#xe873;",
        desktop_mac: "&#xe30b;",
        desktop_windows: "&#xe30c;",
        details: "&#xe3c8;",
        developer_board: "&#xe30d;",
        developer_mode: "&#xe1b0;",
        device_hub: "&#xe335;",
        devices: "&#xe1b1;",
        devices_other: "&#xe337;",
        dialer_sip: "&#xe0bb;",
        dialpad: "&#xe0bc;",
        directions: "&#xe52e;",
        directions_bike: "&#xe52f;",
        directions_boat: "&#xe532;",
        directions_bus: "&#xe530;",
        directions_car: "&#xe531;",
        directions_railway: "&#xe534;",
        directions_run: "&#xe566;",
        directions_subway: "&#xe533;",
        directions_transit: "&#xe535;",
        directions_walk: "&#xe536;",
        disc_full: "&#xe610;",
        dns: "&#xe875;",
        do_not_disturb: "&#xe612;",
        do_not_disturb_alt: "&#xe611;",
        do_not_disturb_off: "&#xe643;",
        do_not_disturb_on: "&#xe644;",
        dock: "&#xe30e;",
        domain: "&#xe7ee;",
        done: "&#xe876;",
        done_all: "&#xe877;",
        donut_large: "&#xe917;",
        donut_small: "&#xe918;",
        drafts: "&#xe151;",
        drag_handle: "&#xe25d;",
        drive_eta: "&#xe613;",
        dvr: "&#xe1b2;",
        edit: "&#xe3c9;",
        edit_location: "&#xe568;",
        eject: "&#xe8fb;",
        email: "&#xe0be;",
        enhanced_encryption: "&#xe63f;",
        equalizer: "&#xe01d;",
        error: "&#xe000;",
        error_outline: "&#xe001;",
        euro_symbol: "&#xe926;",
        ev_station: "&#xe56d;",
        event: "&#xe878;",
        event_available: "&#xe614;",
        event_busy: "&#xe615;",
        event_note: "&#xe616;",
        event_seat: "&#xe903;",
        exit_to_app: "&#xe879;",
        expand_less: "&#xe5ce;",
        expand_more: "&#xe5cf;",
        explicit: "&#xe01e;",
        explore: "&#xe87a;",
        exposure: "&#xe3ca;",
        exposure_neg_1: "&#xe3cb;",
        exposure_neg_2: "&#xe3cc;",
        exposure_plus_1: "&#xe3cd;",
        exposure_plus_2: "&#xe3ce;",
        exposure_zero: "&#xe3cf;",
        extension: "&#xe87b;",
        face: "&#xe87c;",
        fast_forward: "&#xe01f;",
        fast_rewind: "&#xe020;",
        favorite: "&#xe87d;",
        favorite_border: "&#xe87e;",
        featured_play_list: "&#xe06d;",
        featured_video: "&#xe06e;",
        feedback: "&#xe87f;",
        fiber_dvr: "&#xe05d;",
        fiber_manual_record: "&#xe061;",
        fiber_new: "&#xe05e;",
        fiber_pin: "&#xe06a;",
        fiber_smart_record: "&#xe062;",
        file_download: "&#xe2c4;",
        file_upload: "&#xe2c6;",
        filter: "&#xe3d3;",
        filter_1: "&#xe3d0;",
        filter_2: "&#xe3d1;",
        filter_3: "&#xe3d2;",
        filter_4: "&#xe3d4;",
        filter_5: "&#xe3d5;",
        filter_6: "&#xe3d6;",
        filter_7: "&#xe3d7;",
        filter_8: "&#xe3d8;",
        filter_9: "&#xe3d9;",
        filter_9_plus: "&#xe3da;",
        filter_b_and_w: "&#xe3db;",
        filter_center_focus: "&#xe3dc;",
        filter_drama: "&#xe3dd;",
        filter_frames: "&#xe3de;",
        filter_hdr: "&#xe3df;",
        filter_list: "&#xe152;",
        filter_none: "&#xe3e0;",
        filter_tilt_shift: "&#xe3e2;",
        filter_vintage: "&#xe3e3;",
        find_in_page: "&#xe880;",
        find_replace: "&#xe881;",
        fingerprint: "&#xe90d;",
        first_page: "&#xe5dc;",
        fitness_center: "&#xeb43;",
        flag: "&#xe153;",
        flare: "&#xe3e4;",
        flash_auto: "&#xe3e5;",
        flash_off: "&#xe3e6;",
        flash_on: "&#xe3e7;",
        flight: "&#xe539;",
        flight_land: "&#xe904;",
        flight_takeoff: "&#xe905;",
        flip: "&#xe3e8;",
        flip_to_back: "&#xe882;",
        flip_to_front: "&#xe883;",
        folder: "&#xe2c7;",
        folder_open: "&#xe2c8;",
        folder_shared: "&#xe2c9;",
        folder_special: "&#xe617;",
        font_download: "&#xe167;",
        format_align_center: "&#xe234;",
        format_align_justify: "&#xe235;",
        format_align_left: "&#xe236;",
        format_align_right: "&#xe237;",
        format_bold: "&#xe238;",
        format_clear: "&#xe239;",
        format_color_fill: "&#xe23a;",
        format_color_reset: "&#xe23b;",
        format_color_text: "&#xe23c;",
        format_indent_decrease: "&#xe23d;",
        format_indent_increase: "&#xe23e;",
        format_italic: "&#xe23f;",
        format_line_spacing: "&#xe240;",
        format_list_bulleted: "&#xe241;",
        format_list_numbered: "&#xe242;",
        format_paint: "&#xe243;",
        format_quote: "&#xe244;",
        format_shapes: "&#xe25e;",
        format_size: "&#xe245;",
        format_strikethrough: "&#xe246;",
        format_textdirection_l_to_r: "&#xe247;",
        format_textdirection_r_to_l: "&#xe248;",
        format_underlined: "&#xe249;",
        forum: "&#xe0bf;",
        forward: "&#xe154;",
        forward_10: "&#xe056;",
        forward_30: "&#xe057;",
        forward_5: "&#xe058;",
        free_breakfast: "&#xeb44;",
        fullscreen: "&#xe5d0;",
        fullscreen_exit: "&#xe5d1;",
        functions: "&#xe24a;",
        g_translate: "&#xe927;",
        gamepad: "&#xe30f;",
        games: "&#xe021;",
        gavel: "&#xe90e;",
        gesture: "&#xe155;",
        get_app: "&#xe884;",
        gif: "&#xe908;",
        golf_course: "&#xeb45;",
        gps_fixed: "&#xe1b3;",
        gps_not_fixed: "&#xe1b4;",
        gps_off: "&#xe1b5;",
        grade: "&#xe885;",
        gradient: "&#xe3e9;",
        grain: "&#xe3ea;",
        graphic_eq: "&#xe1b8;",
        grid_off: "&#xe3eb;",
        grid_on: "&#xe3ec;",
        group: "&#xe7ef;",
        group_add: "&#xe7f0;",
        group_work: "&#xe886;",
        hd: "&#xe052;",
        hdr_off: "&#xe3ed;",
        hdr_on: "&#xe3ee;",
        hdr_strong: "&#xe3f1;",
        hdr_weak: "&#xe3f2;",
        headset: "&#xe310;",
        headset_mic: "&#xe311;",
        healing: "&#xe3f3;",
        hearing: "&#xe023;",
        help: "&#xe887;",
        help_outline: "&#xe8fd;",
        high_quality: "&#xe024;",
        highlight: "&#xe25f;",
        highlight_off: "&#xe888;",
        history: "&#xe889;",
        home: "&#xe88a;",
        hot_tub: "&#xeb46;",
        hotel: "&#xe53a;",
        hourglass_empty: "&#xe88b;",
        hourglass_full: "&#xe88c;",
        http: "&#xe902;",
        https: "&#xe88d;",
        image: "&#xe3f4;",
        image_aspect_ratio: "&#xe3f5;",
        import_contacts: "&#xe0e0;",
        import_export: "&#xe0c3;",
        important_devices: "&#xe912;",
        inbox: "&#xe156;",
        indeterminate_check_box: "&#xe909;",
        info: "&#xe88e;",
        info_outline: "&#xe88f;",
        input: "&#xe890;",
        insert_chart: "&#xe24b;",
        insert_comment: "&#xe24c;",
        insert_drive_file: "&#xe24d;",
        insert_emoticon: "&#xe24e;",
        insert_invitation: "&#xe24f;",
        insert_link: "&#xe250;",
        insert_photo: "&#xe251;",
        invert_colors: "&#xe891;",
        invert_colors_off: "&#xe0c4;",
        iso: "&#xe3f6;",
        keyboard: "&#xe312;",
        keyboard_arrow_down: "&#xe313;",
        keyboard_arrow_left: "&#xe314;",
        keyboard_arrow_right: "&#xe315;",
        keyboard_arrow_up: "&#xe316;",
        keyboard_backspace: "&#xe317;",
        keyboard_capslock: "&#xe318;",
        keyboard_hide: "&#xe31a;",
        keyboard_return: "&#xe31b;",
        keyboard_tab: "&#xe31c;",
        keyboard_voice: "&#xe31d;",
        kitchen: "&#xeb47;",
        label: "&#xe892;",
        label_outline: "&#xe893;",
        landscape: "&#xe3f7;",
        language: "&#xe894;",
        laptop: "&#xe31e;",
        laptop_chromebook: "&#xe31f;",
        laptop_mac: "&#xe320;",
        laptop_windows: "&#xe321;",
        last_page: "&#xe5dd;",
        launch: "&#xe895;",
        layers: "&#xe53b;",
        layers_clear: "&#xe53c;",
        leak_add: "&#xe3f8;",
        leak_remove: "&#xe3f9;",
        lens: "&#xe3fa;",
        library_add: "&#xe02e;",
        library_books: "&#xe02f;",
        library_music: "&#xe030;",
        lightbulb_outline: "&#xe90f;",
        line_style: "&#xe919;",
        line_weight: "&#xe91a;",
        linear_scale: "&#xe260;",
        link: "&#xe157;",
        linked_camera: "&#xe438;",
        list: "&#xe896;",
        live_help: "&#xe0c6;",
        live_tv: "&#xe639;",
        local_activity: "&#xe53f;",
        local_airport: "&#xe53d;",
        local_atm: "&#xe53e;",
        local_bar: "&#xe540;",
        local_cafe: "&#xe541;",
        local_car_wash: "&#xe542;",
        local_convenience_store: "&#xe543;",
        local_dining: "&#xe556;",
        local_drink: "&#xe544;",
        local_florist: "&#xe545;",
        local_gas_station: "&#xe546;",
        local_grocery_store: "&#xe547;",
        local_hospital: "&#xe548;",
        local_hotel: "&#xe549;",
        local_laundry_service: "&#xe54a;",
        local_library: "&#xe54b;",
        local_mall: "&#xe54c;",
        local_movies: "&#xe54d;",
        local_offer: "&#xe54e;",
        local_parking: "&#xe54f;",
        local_pharmacy: "&#xe550;",
        local_phone: "&#xe551;",
        local_pizza: "&#xe552;",
        local_play: "&#xe553;",
        local_post_office: "&#xe554;",
        local_printshop: "&#xe555;",
        local_see: "&#xe557;",
        local_shipping: "&#xe558;",
        local_taxi: "&#xe559;",
        location_city: "&#xe7f1;",
        location_disabled: "&#xe1b6;",
        location_off: "&#xe0c7;",
        location_on: "&#xe0c8;",
        location_searching: "&#xe1b7;",
        lock: "&#xe897;",
        lock_open: "&#xe898;",
        lock_outline: "&#xe899;",
        looks: "&#xe3fc;",
        looks_3: "&#xe3fb;",
        looks_4: "&#xe3fd;",
        looks_5: "&#xe3fe;",
        looks_6: "&#xe3ff;",
        looks_one: "&#xe400;",
        looks_two: "&#xe401;",
        loop: "&#xe028;",
        loupe: "&#xe402;",
        low_priority: "&#xe16d;",
        loyalty: "&#xe89a;",
        mail: "&#xe158;",
        mail_outline: "&#xe0e1;",
        map: "&#xe55b;",
        markunread: "&#xe159;",
        markunread_mailbox: "&#xe89b;",
        memory: "&#xe322;",
        menu: "&#xe5d2;",
        merge_type: "&#xe252;",
        message: "&#xe0c9;",
        mic: "&#xe029;",
        mic_none: "&#xe02a;",
        mic_off: "&#xe02b;",
        mms: "&#xe618;",
        mode_comment: "&#xe253;",
        mode_edit: "&#xe254;",
        monetization_on: "&#xe263;",
        money_off: "&#xe25c;",
        monochrome_photos: "&#xe403;",
        mood: "&#xe7f2;",
        mood_bad: "&#xe7f3;",
        more: "&#xe619;",
        more_horiz: "&#xe5d3;",
        more_vert: "&#xe5d4;",
        motorcycle: "&#xe91b;",
        mouse: "&#xe323;",
        move_to_inbox: "&#xe168;",
        movie: "&#xe02c;",
        movie_creation: "&#xe404;",
        movie_filter: "&#xe43a;",
        multiline_chart: "&#xe6df;",
        music_note: "&#xe405;",
        music_video: "&#xe063;",
        my_location: "&#xe55c;",
        nature: "&#xe406;",
        nature_people: "&#xe407;",
        navigate_before: "&#xe408;",
        navigate_next: "&#xe409;",
        navigation: "&#xe55d;",
        near_me: "&#xe569;",
        network_cell: "&#xe1b9;",
        network_check: "&#xe640;",
        network_locked: "&#xe61a;",
        network_wifi: "&#xe1ba;",
        new_releases: "&#xe031;",
        next_week: "&#xe16a;",
        nfc: "&#xe1bb;",
        no_encryption: "&#xe641;",
        no_sim: "&#xe0cc;",
        not_interested: "&#xe033;",
        note: "&#xe06f;",
        note_add: "&#xe89c;",
        notifications: "&#xe7f4;",
        notifications_active: "&#xe7f7;",
        notifications_none: "&#xe7f5;",
        notifications_off: "&#xe7f6;",
        notifications_paused: "&#xe7f8;",
        offline_pin: "&#xe90a;",
        ondemand_video: "&#xe63a;",
        opacity: "&#xe91c;",
        open_in_browser: "&#xe89d;",
        open_in_new: "&#xe89e;",
        open_with: "&#xe89f;",
        pages: "&#xe7f9;",
        pageview: "&#xe8a0;",
        palette: "&#xe40a;",
        pan_tool: "&#xe925;",
        panorama: "&#xe40b;",
        panorama_fish_eye: "&#xe40c;",
        panorama_horizontal: "&#xe40d;",
        panorama_vertical: "&#xe40e;",
        panorama_wide_angle: "&#xe40f;",
        party_mode: "&#xe7fa;",
        pause: "&#xe034;",
        pause_circle_filled: "&#xe035;",
        pause_circle_outline: "&#xe036;",
        payment: "&#xe8a1;",
        people: "&#xe7fb;",
        people_outline: "&#xe7fc;",
        perm_camera_mic: "&#xe8a2;",
        perm_contact_calendar: "&#xe8a3;",
        perm_data_setting: "&#xe8a4;",
        perm_device_information: "&#xe8a5;",
        perm_identity: "&#xe8a6;",
        perm_media: "&#xe8a7;",
        perm_phone_msg: "&#xe8a8;",
        perm_scan_wifi: "&#xe8a9;",
        person: "&#xe7fd;",
        person_add: "&#xe7fe;",
        person_outline: "&#xe7ff;",
        person_pin: "&#xe55a;",
        person_pin_circle: "&#xe56a;",
        personal_video: "&#xe63b;",
        pets: "&#xe91d;",
        phone: "&#xe0cd;",
        phone_android: "&#xe324;",
        phone_bluetooth_speaker: "&#xe61b;",
        phone_forwarded: "&#xe61c;",
        phone_in_talk: "&#xe61d;",
        phone_iphone: "&#xe325;",
        phone_locked: "&#xe61e;",
        phone_missed: "&#xe61f;",
        phone_paused: "&#xe620;",
        phonelink: "&#xe326;",
        phonelink_erase: "&#xe0db;",
        phonelink_lock: "&#xe0dc;",
        phonelink_off: "&#xe327;",
        phonelink_ring: "&#xe0dd;",
        phonelink_setup: "&#xe0de;",
        photo: "&#xe410;",
        photo_album: "&#xe411;",
        photo_camera: "&#xe412;",
        photo_filter: "&#xe43b;",
        photo_library: "&#xe413;",
        photo_size_select_actual: "&#xe432;",
        photo_size_select_large: "&#xe433;",
        photo_size_select_small: "&#xe434;",
        picture_as_pdf: "&#xe415;",
        picture_in_picture: "&#xe8aa;",
        picture_in_picture_alt: "&#xe911;",
        pie_chart: "&#xe6c4;",
        pie_chart_outlined: "&#xe6c5;",
        pin_drop: "&#xe55e;",
        place: "&#xe55f;",
        play_arrow: "&#xe037;",
        play_circle_filled: "&#xe038;",
        play_circle_outline: "&#xe039;",
        play_for_work: "&#xe906;",
        playlist_add: "&#xe03b;",
        playlist_add_check: "&#xe065;",
        playlist_play: "&#xe05f;",
        plus_one: "&#xe800;",
        poll: "&#xe801;",
        polymer: "&#xe8ab;",
        pool: "&#xeb48;",
        portable_wifi_off: "&#xe0ce;",
        portrait: "&#xe416;",
        power: "&#xe63c;",
        power_input: "&#xe336;",
        power_settings_new: "&#xe8ac;",
        pregnant_woman: "&#xe91e;",
        present_to_all: "&#xe0df;",
        print: "&#xe8ad;",
        priority_high: "&#xe645;",
        public: "&#xe80b;",
        publish: "&#xe255;",
        query_builder: "&#xe8ae;",
        question_answer: "&#xe8af;",
        queue: "&#xe03c;",
        queue_music: "&#xe03d;",
        queue_play_next: "&#xe066;",
        radio: "&#xe03e;",
        radio_button_checked: "&#xe837;",
        radio_button_unchecked: "&#xe836;",
        rate_review: "&#xe560;",
        receipt: "&#xe8b0;",
        recent_actors: "&#xe03f;",
        record_voice_over: "&#xe91f;",
        redeem: "&#xe8b1;",
        redo: "&#xe15a;",
        refresh: "&#xe5d5;",
        remove: "&#xe15b;",
        remove_circle: "&#xe15c;",
        remove_circle_outline: "&#xe15d;",
        remove_from_queue: "&#xe067;",
        remove_red_eye: "&#xe417;",
        remove_shopping_cart: "&#xe928;",
        reorder: "&#xe8fe;",
        repeat: "&#xe040;",
        repeat_one: "&#xe041;",
        replay: "&#xe042;",
        replay_10: "&#xe059;",
        replay_30: "&#xe05a;",
        replay_5: "&#xe05b;",
        reply: "&#xe15e;",
        reply_all: "&#xe15f;",
        report: "&#xe160;",
        report_problem: "&#xe8b2;",
        restaurant: "&#xe56c;",
        restaurant_menu: "&#xe561;",
        restore: "&#xe8b3;",
        restore_page: "&#xe929;",
        ring_volume: "&#xe0d1;",
        room: "&#xe8b4;",
        room_service: "&#xeb49;",
        rotate_90_degrees_ccw: "&#xe418;",
        rotate_left: "&#xe419;",
        rotate_right: "&#xe41a;",
        rounded_corner: "&#xe920;",
        router: "&#xe328;",
        rowing: "&#xe921;",
        rss_feed: "&#xe0e5;",
        rv_hookup: "&#xe642;",
        satellite: "&#xe562;",
        save: "&#xe161;",
        scanner: "&#xe329;",
        schedule: "&#xe8b5;",
        school: "&#xe80c;",
        screen_lock_landscape: "&#xe1be;",
        screen_lock_portrait: "&#xe1bf;",
        screen_lock_rotation: "&#xe1c0;",
        screen_rotation: "&#xe1c1;",
        screen_share: "&#xe0e2;",
        sd_card: "&#xe623;",
        sd_storage: "&#xe1c2;",
        search: "&#xe8b6;",
        security: "&#xe32a;",
        select_all: "&#xe162;",
        send: "&#xe163;",
        sentiment_dissatisfied: "&#xe811;",
        sentiment_neutral: "&#xe812;",
        sentiment_satisfied: "&#xe813;",
        sentiment_very_dissatisfied: "&#xe814;",
        sentiment_very_satisfied: "&#xe815;",
        settings: "&#xe8b8;",
        settings_applications: "&#xe8b9;",
        settings_backup_restore: "&#xe8ba;",
        settings_bluetooth: "&#xe8bb;",
        settings_brightness: "&#xe8bd;",
        settings_cell: "&#xe8bc;",
        settings_ethernet: "&#xe8be;",
        settings_input_antenna: "&#xe8bf;",
        settings_input_component: "&#xe8c0;",
        settings_input_composite: "&#xe8c1;",
        settings_input_hdmi: "&#xe8c2;",
        settings_input_svideo: "&#xe8c3;",
        settings_overscan: "&#xe8c4;",
        settings_phone: "&#xe8c5;",
        settings_power: "&#xe8c6;",
        settings_remote: "&#xe8c7;",
        settings_system_daydream: "&#xe1c3;",
        settings_voice: "&#xe8c8;",
        share: "&#xe80d;",
        shop: "&#xe8c9;",
        shop_two: "&#xe8ca;",
        shopping_basket: "&#xe8cb;",
        shopping_cart: "&#xe8cc;",
        short_text: "&#xe261;",
        show_chart: "&#xe6e1;",
        shuffle: "&#xe043;",
        signal_cellular_4_bar: "&#xe1c8;",
        signal_cellular_connected_no_internet_4_bar: "&#xe1cd;",
        signal_cellular_no_sim: "&#xe1ce;",
        signal_cellular_null: "&#xe1cf;",
        signal_cellular_off: "&#xe1d0;",
        signal_wifi_4_bar: "&#xe1d8;",
        signal_wifi_4_bar_lock: "&#xe1d9;",
        signal_wifi_off: "&#xe1da;",
        sim_card: "&#xe32b;",
        sim_card_alert: "&#xe624;",
        skip_next: "&#xe044;",
        skip_previous: "&#xe045;",
        slideshow: "&#xe41b;",
        slow_motion_video: "&#xe068;",
        smartphone: "&#xe32c;",
        smoke_free: "&#xeb4a;",
        smoking_rooms: "&#xeb4b;",
        sms: "&#xe625;",
        sms_failed: "&#xe626;",
        snooze: "&#xe046;",
        sort: "&#xe164;",
        sort_by_alpha: "&#xe053;",
        spa: "&#xeb4c;",
        space_bar: "&#xe256;",
        speaker: "&#xe32d;",
        speaker_group: "&#xe32e;",
        speaker_notes: "&#xe8cd;",
        speaker_notes_off: "&#xe92a;",
        speaker_phone: "&#xe0d2;",
        spellcheck: "&#xe8ce;",
        star: "&#xe838;",
        star_border: "&#xe83a;",
        star_half: "&#xe839;",
        stars: "&#xe8d0;",
        stay_current_landscape: "&#xe0d3;",
        stay_current_portrait: "&#xe0d4;",
        stay_primary_landscape: "&#xe0d5;",
        stay_primary_portrait: "&#xe0d6;",
        stop: "&#xe047;",
        stop_screen_share: "&#xe0e3;",
        storage: "&#xe1db;",
        store: "&#xe8d1;",
        store_mall_directory: "&#xe563;",
        straighten: "&#xe41c;",
        streetview: "&#xe56e;",
        strikethrough_s: "&#xe257;",
        style: "&#xe41d;",
        subdirectory_arrow_left: "&#xe5d9;",
        subdirectory_arrow_right: "&#xe5da;",
        subject: "&#xe8d2;",
        subscriptions: "&#xe064;",
        subtitles: "&#xe048;",
        subway: "&#xe56f;",
        supervisor_account: "&#xe8d3;",
        surround_sound: "&#xe049;",
        swap_calls: "&#xe0d7;",
        swap_horiz: "&#xe8d4;",
        swap_vert: "&#xe8d5;",
        swap_vertical_circle: "&#xe8d6;",
        switch_camera: "&#xe41e;",
        switch_video: "&#xe41f;",
        sync: "&#xe627;",
        sync_disabled: "&#xe628;",
        sync_problem: "&#xe629;",
        system_update: "&#xe62a;",
        system_update_alt: "&#xe8d7;",
        tab: "&#xe8d8;",
        tab_unselected: "&#xe8d9;",
        tablet: "&#xe32f;",
        tablet_android: "&#xe330;",
        tablet_mac: "&#xe331;",
        tag_faces: "&#xe420;",
        tap_and_play: "&#xe62b;",
        terrain: "&#xe564;",
        text_fields: "&#xe262;",
        text_format: "&#xe165;",
        textsms: "&#xe0d8;",
        texture: "&#xe421;",
        theaters: "&#xe8da;",
        thumb_down: "&#xe8db;",
        thumb_up: "&#xe8dc;",
        thumbs_up_down: "&#xe8dd;",
        time_to_leave: "&#xe62c;",
        timelapse: "&#xe422;",
        timeline: "&#xe922;",
        timer: "&#xe425;",
        timer_10: "&#xe423;",
        timer_3: "&#xe424;",
        timer_off: "&#xe426;",
        title: "&#xe264;",
        toc: "&#xe8de;",
        today: "&#xe8df;",
        toll: "&#xe8e0;",
        tonality: "&#xe427;",
        touch_app: "&#xe913;",
        toys: "&#xe332;",
        track_changes: "&#xe8e1;",
        traffic: "&#xe565;",
        train: "&#xe570;",
        tram: "&#xe571;",
        transfer_within_a_station: "&#xe572;",
        transform: "&#xe428;",
        translate: "&#xe8e2;",
        trending_down: "&#xe8e3;",
        trending_flat: "&#xe8e4;",
        trending_up: "&#xe8e5;",
        tune: "&#xe429;",
        turned_in: "&#xe8e6;",
        turned_in_not: "&#xe8e7;",
        tv: "&#xe333;",
        unarchive: "&#xe169;",
        undo: "&#xe166;",
        unfold_less: "&#xe5d6;",
        unfold_more: "&#xe5d7;",
        update: "&#xe923;",
        usb: "&#xe1e0;",
        verified_user: "&#xe8e8;",
        vertical_align_bottom: "&#xe258;",
        vertical_align_center: "&#xe259;",
        vertical_align_top: "&#xe25a;",
        vibration: "&#xe62d;",
        video_call: "&#xe070;",
        video_label: "&#xe071;",
        video_library: "&#xe04a;",
        videocam: "&#xe04b;",
        videocam_off: "&#xe04c;",
        videogame_asset: "&#xe338;",
        view_agenda: "&#xe8e9;",
        view_array: "&#xe8ea;",
        view_carousel: "&#xe8eb;",
        view_column: "&#xe8ec;",
        view_comfy: "&#xe42a;",
        view_compact: "&#xe42b;",
        view_day: "&#xe8ed;",
        view_headline: "&#xe8ee;",
        view_list: "&#xe8ef;",
        view_module: "&#xe8f0;",
        view_quilt: "&#xe8f1;",
        view_stream: "&#xe8f2;",
        view_week: "&#xe8f3;",
        vignette: "&#xe435;",
        visibility: "&#xe8f4;",
        visibility_off: "&#xe8f5;",
        voice_chat: "&#xe62e;",
        voicemail: "&#xe0d9;",
        volume_down: "&#xe04d;",
        volume_mute: "&#xe04e;",
        volume_off: "&#xe04f;",
        volume_up: "&#xe050;",
        vpn_key: "&#xe0da;",
        vpn_lock: "&#xe62f;",
        wallpaper: "&#xe1bc;",
        warning: "&#xe002;",
        watch: "&#xe334;",
        watch_later: "&#xe924;",
        wb_auto: "&#xe42c;",
        wb_cloudy: "&#xe42d;",
        wb_incandescent: "&#xe42e;",
        wb_iridescent: "&#xe436;",
        wb_sunny: "&#xe430;",
        wc: "&#xe63d;",
        web: "&#xe051;",
        web_asset: "&#xe069;",
        weekend: "&#xe16b;",
        whatshot: "&#xe80e;",
        widgets: "&#xe1bd;",
        wifi: "&#xe63e;",
        wifi_lock: "&#xe1e1;",
        wifi_tethering: "&#xe1e2;",
        work: "&#xe8f9;",
        wrap_text: "&#xe25b;",
        youtube_searched_for: "&#xe8fa;",
        zoom_in: "&#xe8ff;",
        zoom_out: "&#xe900;",
        zoom_out_map: "&#xe56b;"
      },
      lang: "zh-cn"
    };
  },
  computed: {
    translate: function() {
      return translation(this.lang).mainPage;
    },
    myAffairsTab: function() {
      return [
        { id: "initiate", isShowPoint: false },
        { id: "waitHandle", isShowPoint: this.isShowPoint.waitHandle },
        { id: "transfer", isShowPoint: this.isShowPoint.transfer },
        { id: "copySend", isShowPoint: this.isShowPoint.copySend }
      ];
    }
  },
  updated(){
     this.$router.options.routes[0].children[0].children =  this.$router.options.routes[0].children[0].children.map((o)=>{
        if(o.path == ''){
          if(this.$route.fullPath == '/' || this.$route.fullPath == '/platform' || this.$route.fullPath== '/platform/'){
            o.meta.keepAlive = true
            return o
          }else{
            return o
          }
        }
        else{
          if(this.$route.fullPath.indexOf(o.path)>-1){
            o.meta.keepAlive = true
          }
        }
        return o
      })
  },
  mounted: function() {
    $("#applySearch").focus(() => {
      this.searchPlaceholder = "";
    });
    $("#applySearch").blur(() => {
      this.searchPlaceholder = this.translate.placeholder;
    });

    this.getApplicationList();
    this.getQuickServerList();
    this.getThingsList();
  },
  watch: {
    serverList(newVal, oldArr) {
      if (oldArr.length == 0) return;
      this.saveServerList(newVal);
    },
    account: {
      handler: function() {
        this._initOrder();
      },
      deep: true
    },
    windowObj: {
      deep: true,
      handler: function(val) {
        if (document.body.clientWidth < 1200) {
          this.affairsTabStyle = -24;
          this.setWidth = 135;
        } else {
          this.affairsTabStyle = -7;
          this.setWidth = 300;
        }
      }
    },
    applicationType(newVal) {
      // console.log(this.applicationType)
      this.getApplicationList();
    }
  },
  methods: {
    departmentManage(){//跳转到部门管理
    this.$emit("addBread", {
        route: '/activityManage/departmentsManage',
        title: "部门管理"
      });
    },
    saveServerList(arr) {
      //保存快捷服务排序后的数组
      let url = "api/quick/service/updateServiceLocation";
      let quickServiceVOId = "";
      let list = arr.map((element, index) => {
        return element.id;
      });
      request(url, list, "post")
        .then(o => {
          if (o.state) {
          } else {
            this.$toast(o.message);
          }
        })
        .catch(e => {
          console.log("err");
        });
    },
    _saveQuickServer() {
      //保存新增快捷服务
      if (this.linkParams.id) {
        //有ID说明是编辑
        let url = "api/quick/service/updateService/" + this.linkParams.id;
        this.linkParams.serviceId = this.linkParams.id;
        request(url, this.linkParams, "post")
          .then(o => {
            if (o.state) {
              this.showQuickServerModal = false;
              this.getQuickServerList();
            } else {
              this.$toast(o.message);
            }
          })
          .catch(e => {
            console.log("err");
          });
      } else {
        let url = "api/quick/service/addService";
        request(url, this.linkParams)
          .then(o => {
            if (o.state) {
              this.showQuickServerModal = false;
              this.getQuickServerList();
            } else {
              this.$toast(o.message);
            }
          })
          .catch(e => {
            console.log("err");
          });
      }
      this.linkParams = {};
      this.showQuickServerModal = false;
    },
    getQuickServerList() {
      //获取快捷服务列表
      let url = "api/quick/service/allQuickService";
      request(url)
        .then(o => {
          if (!o.state) return;
          let bgColorlist = [
            "#EF5E36",
            "#46B7F5",
            "#F4AA35",
            "#8387C9",
            "#307CEC",
            "#307CEC",
            "#59C9AC",
            "#EF5E36"
          ];
          this.serverOnlyread = o.data.onlyRead;
          this.serverList = o.data.quickServiceVO.map((a, i) => {
            a.bgColor = bgColorlist[i];
            return a;
          });
        })
        .catch(e => {});
    },
    addQuickServer() {
      //显示新增快捷服务弹窗
      this.fangshi = "新增";
      if (this.serverList.length < 8) {
        // this.linkParams.remove('id')
        this.showQuickServerModal = true;
      } else {
        this.$toast("快捷服务数量已达上限");
      }
    },
    editQuickServer(item, index) {
      this.fangshi = "编辑";
      //编辑快捷服务
      this.linkParams = item;
      this.showQuickServerModal = true;
    },
    toUrl(url) {
      //快捷服务点击事件
      // window.location.href=url;
      window.open(url);
    },
    deleteQuickServer(item, index) {
      //删除快捷服务
      let url = "api/quick/service/cleanService/" + item.id;
      request(url, {}, "post")
        .then(o => {
          console.log("o", o);
          this.serverList.splice(index, 1);
        })
        .catch(e => {});
    },
    formatThingType(type) {
      //格式化事务统计type,
      switch (type) {
        case "initiate":
          return "我发起的";
          break;
        case "waitHandle":
          return "审核中";
          break;
        case "transfer":
          return "已完成";
          break;
        case "copySend":
          return "待审核";
          break;
        case "success":
          return "已审核";
          break;
        case "noreview":
          return "审核超时";
          break;
      }
    },
    getApplicationList() {
      //获取应用列表
      let url = "/api/app/search";
      let cate = "POPULAR";
      if (this.applicationType == 1) {
        cate = "POPULAR";
      } else {
        cate = "COLLECTED";
      }

      let params = {
        category: cate,
        keyword: "",
        userType: "",
        typeId: "",
        capital: ""
      };
      request(url, params, "get")
        .then(o => {
          if (!o.data) return;
          this.applicationList = o.data //只要前四个
        })
        .catch(e => {
          console.log("err", e);
        });
    },
    toAppSearch() {
      this.$emit("addBread", {
        route: "/platform/appsearch",
        title: "应用搜索",
        closeable:true
      });
      this.$router.push({path:'/platform/appsearch'})
      //更多应用
    },
    collectThis(item) {
      //点击收藏
      let url = "/api/app/" + item.id + "/collections";
      let params = { appId: item.id };
      if (item.isCollected) {
        url = "/api/app/" + item.id + "/deleteCollections";
        //这里应该要做取消收藏的操作
        request(url, {}, "post")
          .then(o => {
            if (o.state) {
              item.isCollected = false;
              this.$toast("取消收藏!");
            }
          })
          .catch(e => {
            console.log("err", e);
          });
        return;
      }
      request(url, params)
        .then(o => {
          if (o.state) {
            item.isCollected = true;
            this.$toast("收藏成功!");
          } else {
            this.$toast("已收藏,无法重复收藏!");
          }
        })
        .catch(e => {
          console.log("err", e);
        });
    },
    getThingsList() {
      //获取事务统计列表
      let url = "api/processEngine/stat/applicant";
      let obj = {};
      request(url).then(o => {
        if (!o.state) {
          return;
        }
        obj = o.data;
        let url2 = "api/processEngine/stat/approval";
        request(url2).then(b => {
          let obj2 = Object.assign(obj, b.data);
          this.thingList[0].name = obj2.applyCount;
          this.thingList[1].name = obj2.pendingCount;
          this.thingList[2].name = obj2.successCount;
          this.thingList[3].name = obj2.todoCount;
          this.thingList[4].name = obj2.doneCount;
          this.thingList[5].name = obj2.overtimeCount;
        });
      });
    },
    _initOrder: function() {
      if (this.account) {
        if (this.account.type === "STUDENT") {
          this.applyType = [
            { id: "student", name: this.translate.student },
            { id: "freshman", name: this.translate.freshman },
            { id: "teacher", name: this.translate.teacher }
          ];
        } else {
          this.applyType = [
            { id: "freshman", name: this.translate.freshman },
            { id: "student", name: this.translate.student },
            { id: "teacher", name: this.translate.teacher }
          ];
        }
        sAjax({
          url: "/api/relationship/instructor/check",
          type: "get",
          success: data => {
            if (data.state) {
              if (data.data) {
                if (data.data.indexOf("instructor") >= 0) {
                  this.applyType = [
                    { id: "instructor", name: "辅导员应用" },
                    { id: "student", name: this.translate.student },
                    { id: "freshman", name: this.translate.freshman },
                    { id: "teacher", name: this.translate.teacher }
                  ];
                }
              }
            }
          }
        });
        this.initPageData();
      }
    },
    _containsSearchName: function(appList) {
      var con = false;
      if (!appList) return;
      appList.forEach(t => {
        if (
          (t.name && t.name.indexOf(this.searchName) >= 0) ||
          (t.app && t.app.name.indexOf(this.searchName) >= 0)
        ) {
          con = true;
        }
      });
      return con;
    },
    _viewAnnounce: function(announce) {
      this.$emit("addBread", {
        route: "/announce/detail?id=" + announce.announcementId,
        title: announce.title
      });
    },
    _viewMyAffairs: function(tabId) {
      if(tabId){
        this.$emit("addBread", {
        route: "/home/myAffairs?tabId=" + tabId,
        title: "我的事务"
      });
      }
    },
    _initAnnounceList: function(type, index) {
      sAjax({
        url: "/table-data/announcement/list/10",
        type: "get",
        data: {
          pageSize: this.pageSize,
          pageIndex: index,
          pageParams: {
            type: type
          }
        },
        success: data => {
          if (data.state) {
            data.data.forEach(ele => {
              this.announces[type].push(ele);
            });
            if (data.data.length < this.pageSize) {
              this.pageIndex[this.announceIndex] = -1;
            }
          }
        }
      });
    },
    _loadNextPage: function() {
      this.initiatePageIndex++;
      this._initInitiateList(this.initiatePageIndex);
    },
    _initInitiateList: function(index) {
      sAjax({
        url: "/table-data/processEngine/myProcessInstances",
        type: "get",
        data: {
          pageSize: this.pageSize,
          pageIndex: index
        },
        success: data => {
          if (data.state) {
            data.data.forEach(ele => {
              this.myAffairsList["initiate"].push(ele);
            });
            if (data.data.length < this.pageSize) {
              this.isLoadNextPage = false;
            } else {
              this.isLoadNextPage = true;
            }
          }
          var timer = null;
          timer && clearTimeout(timer);
          timer = setTimeout(() => {
            if (document.body.clientWidth < 1200) {
              this.affairsTabStyle = -24;
              this.setWidth = 135;
            } else {
              this.affairsTabStyle = -7;
              this.setWidth = 260;
            }
          }, 300);
        }
      });
    },
    _initAffarisList: function() {
      sAjax({
        url: "/api/processEngine/tasks/todo/apps",
        type: "get",
        success: data => {
          if (data.state) {
            data.data.length === 0
              ? (this.isShowPoint.waitHandle = false)
              : (this.isShowPoint.waitHandle = true);
            data.data.forEach(ele => {
              this.myAffairsList["waitHandle"].push(ele);
            });
          }
        }
      });
      sAjax({
        url: "/api/processEngine/tasks/todo/transfer/page",
        type: "get",
        data: {
          pageSize: 10,
          pageIndex: 0
        },
        success: data => {
          if (data.state) {
            data.data.content.length === 0
              ? (this.isShowPoint.transfer = false)
              : (this.isShowPoint.transfer = true);
          }
        }
      });
      sAjax({
        url: "/api/processEngine/processInstances/myCarbonCopy",
        type: "get",
        data: {
          pageSize: 10,
          pageIndex: 0
        },
        success: data => {
          if (data.state) {
            data.data.content.length === 0
              ? (this.isShowPoint.copySend = false)
              : (this.isShowPoint.copySend = true);
          }
        }
      });
    },
    _changeList: function(index) {
      this.announceIndex = index;
      if (this.announces[this.announceIndex].length === 0) {
        this._initAnnounceList(this.announceIndex, 0);
      }
    },
    _changeAffairsTab: function(obj) {
      if (obj === "transfer" || obj === "copySend") {
        if (obj === "transfer") {
          this.isShowPoint.transfer = false;
        } else {
          this.isShowPoint.copySend = false;
        }
        this._viewMyAffairs(obj);
      } else {
        this.affairsIndex = obj;
        if (this.myAffairsList[this.affairsIndex].length === 0) {
          // this._initAffarisList(this.affairsIndex, 0)
        }
      }
    },
    initPageData: function() {
      // 应用
      this.initTypes("1", "list");
      this.initTypes("2", "list");
      this.initTypes("3", "list");
      this.initTypes("4", "list");
      // 推荐应用
      sAjax({
        url: "/api/app/popular",
        type: "get",
        data: {
          isPublished: true
        },
        success: data => {
          this.popularApply = data.data.sort((a,b)=>{
              return a.sort-b.sort
            });
        }
      });
    },
    initTypes: function(userType, dataType) {
      // 获取应用类型列表
      if (dataType === "search") {
        this.appTypeSearchList.student.types.splice(
          0,
          this.appTypeSearchList.student.types.length
        );
        this.appTypeSearchList.teacher.types.splice(
          0,
          this.appTypeSearchList.teacher.types.length
        );
        this.appTypeSearchList.freshman.types.splice(
          0,
          this.appTypeSearchList.freshman.types.length
        );
        this.appTypeSearchList.instructor.types.splice(
          0,
          this.appTypeSearchList.instructor.types.length
        );
      }
      sAjax({
        url: "/api/app/type",
        type: "get",
        data: {
          userType: userType
        },
        success: data => {
          if (data.state) {
            data.data.forEach((ele, i) => {
              var obj = {};
              for (var k in ele) {
                Vue.set(obj, k, ele[k]);
              }
              Vue.set(obj, "appList", []);
              if (dataType === "list") {
                if (userType === "1") {
                  this.typeList.student.types.push(obj);
                } else if (userType === "2") {
                  this.typeList.teacher.types.push(obj);
                } else if (userType === "3") {
                  this.typeList.freshman.types.push(obj);
                } else {
                  this.typeList.instructor.types.push(obj);
                }
              } else {
                if (userType === "1") {
                  this.appTypeSearchList.student.types.push(obj);
                } else if (userType === "2") {
                  this.appTypeSearchList.teacher.types.push(obj);
                } else if (userType === "3") {
                  this.appTypeSearchList.freshman.types.push(obj);
                } else {
                  this.appTypeSearchList.instructor.types.push(obj);
                }
              }
            });
            this.initAppList(userType, dataType);
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    initAppList: function(userType, dataType) {
      var bigtype = null;
      if (dataType === "list") {
        if (userType === "1") {
          bigtype = this.typeList.student;
        } else if (userType === "2") {
          bigtype = this.typeList.teacher;
        } else if (userType === "3") {
          bigtype = this.typeList.freshman;
        } else {
          bigtype = this.typeList.instructor;
        }
        this.searchName = "";
      } else {
        if (userType === "1") {
          bigtype = this.appTypeSearchList.student;
        } else if (userType === "2") {
          bigtype = this.appTypeSearchList.teacher;
        } else if (userType === "3") {
          bigtype = this.appTypeSearchList.freshman;
        } else {
          bigtype = this.appTypeSearchList.instructor;
        }
      }
      sAjax({
        url: "/api/app",
        type: "get",
        data: {
          name: this.searchName,
          userType: userType,
          isPublished: true
        },
        success: data => {
          if (data.state) {
            data.data.forEach((app, i) => {
              bigtype.types.forEach((type, tIndex) => {
                if (type.id === app.appType.id) {
                  type.appList.push(app);
                }
              });
            });
            bigtype.types.forEach((item, tIndex) => {
              if (item.appList.length === 0) {
                Vue.set(item, "isShow", false);
              } else {
                Vue.set(item, "isShow", true);
              }
            });
            this.monitorScroll();
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    // 进入表单页面
    checkInstance: function(obj) {
      this.previewObj.curBusinessId = obj.businessId;
      this.previewObj.appId = obj.appId;
      this._getLog(obj.id, data => {
        this.previewObj.log = data || null;
      });
      this.curInstance = obj;
      this.priviewInstanceId = obj.id;

      this._initPreview(this.curInstance);
    },
    _initPreview: function(instance) {
      this.$waiting.show();
      this._getAuthorityData(instance.id, data => {
        this.previewObj.authorities = data || [];
      });
      this._getFormLayout(
        instance.businessId,
        instance.currentNode.id,
        data => {
          this.previewObj.formData = data;
          this.previewObj.formData.components.forEach(ele => {
            Vue.set(ele, "x", ele.location.left);
            Vue.set(ele, "y", ele.location.top);
            Vue.set(ele, "w", ele.size.width);
            Vue.set(ele, "h", ele.size.height);
          });
          this._getLog(instance.id, data1 => {
            this.previewObj.log = data1 || null;
          });
          this._getInitData(instance.id, data1 => {
            this.$waiting.close();
            this.previewObj.recordData = data1;
            this.preview = true;
          });
        }
      );
    },
    // app为当前应用
    _checkDetail: function(app, entranceType) {
      this.$waiting.show();
      this.curApp = app;
      // let type = app.app ? app.app.setting.type : app.setting.type;
      let type = app.app
        ? app.app.setting.type
        : app.setting
        ? app.setting.type
        : "";
      // 在此处区分应用类型
      var route = "";
      if (type === "FORM") {
        route = "/app/form?id=" + this.curApp.id;
      } else if (type === "WORKFLOW") {
        route = "/app/flow?id=" + this.curApp.id;
      } else if(app.setting){
        if (app.setting.useBusiness) {
          route = "/app/link?id=" + this.curApp.id;
        } else {
          window.open(app.setting.linkUrl);
          this.$waiting.close();
          return false;
        }
      }
      else{
        //活动审核
        this.$waiting.close();
      this._applyCheck(app);
      return;
      }
      setTimeout(() => {
        window.open(`/app/${app.id || app.app.id}`,'_blank')
        // window.open(`/platform/mmm/app/form?id=737`,'_blank')
        // this.$router.push({
        //   path:`/platform/mmm${route}`,
        //   params:{
        //   title: app.name || app.app.name,
        //   appData: app,
        //   entranceType: entranceType
        //   }
        // })
        // this.$emit("addBread", {
        //   route: `/platform/mmm${route}`,
        //   title: app.name || app.app.name,
        //   appData: app,
        //   entranceType: entranceType,
        //   noGo:true
        // });
        this.$waiting.close();
      }, 310);
    },
    _applyCheck: function(app) {
      app['flowId'] = app.activityType.flowId
      app['id'] = app.activityType.id
       this.$set(app, "imgPath", "assignment");
            this.$set(app, "imgType", "1");
            app['appType']={
              name:app.name
            }

      this.$waiting.show();
      setTimeout(() => {
        this.$emit("addBread", {
          route: "/app/flow?id=" + app.id + "&appType=activityAudit",
          title: app.name,
          appData: app,
          entranceType: "activityAudit"
        });
        this.$waiting.close();
      }, 310);
    },
    _paymentCheck: function(app) {
      if (app) {
        this.$waiting.show();
        sAjax({
          url: "/api/payment/getInProject",
          type: "get",
          data: {
            id: app.id
          },
          success: data => {
            if (data.state) {
              if (data.data && data.data.status) {
                if (data.data.status === "NOT_PAID") {
                  this.$emit("addBread", {
                    route: "/payHall/payHallApplication",
                    title: data.data.name,
                    data: data.data
                  });
                } else {
                  this.$toast("您已缴费，无需缴费！");
                }
              } else {
                this.$toast("该应用无需缴费！");
              }
            } else {
              this.$toast(data.message);
            }
          }
        }).always(() => {
          this.$waiting.close();
        });
      } else {
        this.$emit("addBread", {
          route: "/payHall/payHallRecords",
          title: "缴费记录"
        });
      }
    },

    // 获取初始数据
    _getInitData: function(instanceId, callback) {
      sAjax({
        url: "/api/processEngine/processInstances/" + instanceId,
        type: "get",
        success: data => {
          if (data.state) {
            callback(data.data);
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    // 获取权限
    _getAuthorityData: function(instanceId, callback) {
      sAjax({
        url:
          "/api/processEngine/processInstances/" + instanceId + "/operations",
        type: "get",
        success: data => {
          if (data.state) {
            callback(data.data);
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    // 获取日志
    _getLog: function(instanceId, callback) {
      sAjax({
        url:
          "/api/processEngine/processInstances/" + instanceId + "/handleLogs",
        type: "get",
        success: data => {
          if (data.state) {
            callback(data.data);
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    // 获取表单布局
    _getFormLayout: function(businessId, nodeId, callback) {
      sAjax({
        url:
          "/api/processEngine/business/" +
          businessId +
          "/formRenderData?nodeId=" +
          nodeId,
        type: "get",
        success: data => {
          if (data.state) {
            callback(data.data);
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    // 提交
    _submit: function(obj) {
      if (this.needAdviceAuthority.indexOf(obj.type) >= 0) {
        this.$prompt({
          tip: "确认" + obj.title + "?",
          placeholder: "请输入批复意见",
          callback: res => {
            if (res.type === "ok") {
              this._submitAction(obj, res.text);
            }
          }
        });
      } else if (obj.type === "cancel") {
        if (confirm("确认要放弃本申请吗？放弃后申请作废")) {
          this._submitAction(obj);
        }
      } else {
        if (confirm("确认" + obj.title + "?")) {
          this._submitAction(obj);
        }
      }
    },
    _submitAction: function(obj, msg) {
      var url = "";
      var params = {};
      if (obj.type === "submit") {
        url = "/api/processEngine/processInstances";
      } else if (obj.type === "transfer" || obj.type === "carbonCopy") {
        url =
          "/api/processEngine/update/processInstances?action=" +
          obj.type +
          "&userId=" +
          obj.userId;
      } else if (obj.type === "save") {
        url =
          "/api/processEngine/processInstances?action=" +
          obj.type +
          "&userId=" +
          obj.userId;
      } else {
        url =
          "/api/processEngine/update/processInstances?action=" +
          obj.type +
          (msg ? "&message=" + msg : "");
      }
      params = {
        id: this.previewObj.recordData ? this.previewObj.recordData.id : '',
        formData: obj.formData,
        variable: {
          appId: this.previewObj.appId,
          businessId: this.previewObj.curBusinessId
        }
      }
      if(url.indexOf('/api/processEngine/update/processInstances')!==-1){
        if(obj.record){
          params.applicant = obj.record.applicant
        }
        let newParams = {
          runtimeProcessInstancePO:params,
          appNodeQuotaTableList: [],
          conditions: []
        }
        params = newParams
      }
      sAjax({
        url: url,
        type: 'post',
        data: params,
        success: data => {
          if (data.state) {
            if (this.doNotClosePreview.indexOf(obj.type) >= 0) {
              this._getAuthorityData(this.curInstance.id, data => {
                this.previewObj.authorities = data || [];
              });
            } else {
              this.preview = false;
            }
            if(obj.type === "countermand") {
              this.curInstance.currentNode.id = data.data.targetNode
              this._initPreview(this.curInstance);
            }
            if (obj.type === "submit") {
              this.$toast("提交申请成功");
            } else {
              this.$toast("申请已" + obj.title);
            }

          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    monitorScroll: function() {
      var that = this;
      // $(".apply-header").css('width', $(".apply-content").width() + 'px')
      $(".main-p").scroll(function() {
        var top = $(this)
          .children(".container-fluid")
          .children(".apply-container")
          .position().top;
        if (top <= 0) {
          that.isAddClass = true;
          that.marginTop63px = 63;
        } else {
          that.isAddClass = false;
          that.marginTop63px = 0;
        }
      });
    }
  },
  components: {
    appSearch
  }
};
</script>
<style scoped lang="less">
// 事务统计
.box_wrap_1 {
  height: 154px;
  padding: 0 16px;
  .box_head {
    width: 100%;
    border-bottom: 1px solid #e7e7e7;
    font-family: PingFangSC-Medium;
    font-size: 18px;
    font-weight: normal;
    height: 50px;
    line-height: 50px;
    color: #3d4a5d;
    letter-spacing: 0;
    text-align: left;
  }
  .box_main {
    min-width: 1000px;
  }
}
.icon_wrap {
  width: 47px;
  height: 47px;
  border-radius: 50%;
  margin-left: 24px;
  margin-right: 24px;
  padding-left: 1px;
}
.box_main .thing_wrap:last-child {
  border-right: none;
}
.name_wrap {
  height: 79px;
  border-right: 1px solid #f0f0f0;
}
.thing_wrap {
  width: 16.6%;
  height: 100px;
}
.thing_name {
  font-family: Roboto-Medium;
  font-size: 18px;
  color: #3d4a5d;
  letter-spacing: 2px;
  text-align: left;
}
.thing_type {
  font-family: PingFang-SC-Medium;
  font-size: 16px;
  color: #3d4a5d;
  letter-spacing: 0;
  text-align: left;
}
// end事务统计
// 学校事务+快捷服务
.box_wrap_3 {
  border-radius: 3px;
  overflow: hidden;
  height: 300px;
  box-shadow: 0 0 2px 0 rgba(6, 10, 30, 0.1), 0 2px 2px 0 rgba(11, 15, 40, 0.1);
  .affairs-container {
    width: 64.8%;
    box-shadow: none;
    .mainPage-affairs-header {
      border-bottom: 1px solid #f0f0f0 !important;
    }
  }
  .mainPage-affairs-header {
    font-weight: normal;
  }
  .box_head {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: #424f61;
    letter-spacing: 0;
    text-align: left;
    line-height: 64px;
    font-weight: normal;
    padding-left: 23px;
    border-bottom: 1px solid #f0f0f0;
    height: 64px;
  }
  .box_main {
    width: 100%;
    padding-top: 18px;
    .box_child {
      width: 96%;
      margin-left: 2%;
      border-radius: 4px;
      background: #eeeeee;
      height: 34px;
      line-height: 34px;
      margin-bottom: 20px;
      font-family: PingFang-SC-Medium;
      font-size: 17px;
      color: #525a67;
      letter-spacing: 0.4px;
      text-decoration: none;
      position: relative;
      .linkName {
        max-width: 160px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      i.maticon {
        position: absolute;
        right: 5px;
        top: 9px;
        font-size: 17px;
        color: #525a67;
        display: none;

        &.edit {
          right: 24px;
        }
      }
      &:hover {
        i.maticon {
          display: block;
          &:hover {
            color: #1478f6;
          }
        }
      }
      cursor: pointer;
      .color_ball {
        width: 10px;
        height: 10px;
        margin-right: 10px;
        margin-left: 31px;
        border-radius: 50%;
      }
    }
  }
}
.quick_server_wrap {
  overflow: hidden;
  border-left: 1px solid #f0f0f0;
  .box_head {
    .icon_add_wrap {
      width: 34px;
      line-height: 41px;
      height: 34px;
      cursor: pointer;
      i {
        color: #cbcbc9;
      }
      i:hover {
        color: #2178e6;
      }
    }
  }
}

// end学校事务+快捷服务
// 全部应用
.box_wrap_2 {
  padding: 0 16px;
  height: 174px;
  .box_main {
    padding: 20px 0;
  }
  .box_head {
    .appSelect {
      cursor: pointer;
      margin-left: 2px;
      padding: 4px 18px !important;
      .form-control {
        padding-right: 33px;
      }
    }
    .text {
      font-family: PingFangSC-Medium;
      font-size: 18px;
      font-weight: normal;
      height: 50px;
      line-height: 50px;
    }
    select {
      border: 1px solid #edf1f5;
      border-radius: 5px;
      height: 33px;
      margin-left: 10px;
      -webkit-appearance: none;
    }
    .more {
      font-size: 15px;
      height: 50px;
      font-weight: bold;
      line-height: 51px;
      cursor: pointer;
      color: rgb(61,74,93);
      i.maticon {
        position: relative;
        top: -1px;
      }
      i:hover {
        color: #2178e6;
      }
      .moreFont:hover {
        color: #2178e6;
        font-weight: bold
      }
    }
    height: 50px;
    width: 100%;
    border-bottom: 1px solid #e7e7e7;

    color: #3d4a5d;
    letter-spacing: 0;
    text-align: left;
  }
}
// end学校事务+快捷服务
</style>


<style lang="less">
@import url("../assets/common.less");
@import url("../assets/newCommon.less");
#mainPage-page {
  height: 100%;
  overflow: auto;
  .main-p {
    // max-width: 1140px;
    height: 100%;
    overflow: auto;
  }
  .modal-content {
    padding-left: 0;
    top: 0;
  }
  .page-top-half {
    .announce-container {
      height: 300px;
      padding: 0 8px 0 0;
      border-radius: 4px;
      margin-bottom: 8px;
      .announce-part {
        height: 100%;

        border-radius: 4px;
      }
      .announce-header {
        height: 64px;
        background: #ffffff;
        border-bottom: 1px solid #e0e0e0;
        padding: 20px 16px;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        .announce-title {
          display: inline-block;
          font-size: 18px;
          color: #424f61;
          line-height: 16px;
          font-weight: normal;
          margin-top: 3px;
        }
        .announce-type-tab {
          margin-right: -10px;
          a {
            padding: 5px 10px;
            font-size: 13px;
            color: rgba(0, 0, 0, 0.36);
            line-height: 13px;
            font-weight: 500;
            text-decoration: none;
            background: #ffffff;
            cursor: pointer;
            &.active {
              color: #1578f6;
            }
          }
        }
      }
      .announce-body {
        height: 236px;
        background: #fff;
        margin-top: 0;
        overflow: auto;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        .list-group-item {
          padding: 0 24px 0 21px;
          line-height: 40px;
          border: none;
          cursor: pointer;
          &:hover {
            background: #f5f5f5;
          }
        }
        .announce-date {
          margin-right: 11px;
          font-family: PingFangSC-Medium;
          font-size: 13px;
          color: rgba(0, 0, 0, 0.36);
        }
        .announce-type {
          padding: 6px 12px;
          margin-right: 12px;
          font-size: 12px;
          color: white;
          border-radius: 100px;
          &.blue {
            background: #1478f6;
          }
          &.green {
            background: #62c660;
          }
        }
        .announce-name {
          font-family: PingFangSC-Medium;
          font-size: 13px;
          color: rgba(15, 27, 46, 0.77);
        }
        .more,
        .no-more,
        .empty-data {
          color: rgba(0, 0, 0, 0.36);
          font-size: 13px;
        }
        .more {
          color: rgba(0, 0, 0, 0.64);
        }
        .empty-data {
          padding: 20px;
        }
      }
    }
  }
  .affairs-container {
    background: #ffffff;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
    border-radius: 4px;
    min-width: 276px;
    height: 300px;
    padding: 0;
    margin-bottom: 8px;
    &:hover {
      .mainPage-affairs-header {
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        .affairs-title {
          .examine-all-btn {
            display: block;
            font-size: 17px;
            color: #1478f6;
            line-height: 13px;
            font-weight: normal;
            cursor: pointer;
          }
          .affairs-text {
            display: none;
          }
        }
      }
    }
    .mainPage-affairs-header {
      height: 64px;
      background: #ffffff;
      border-bottom: 1px solid #e0e0e0;
      padding: 20px 16px;
      .affairs-title {
        display: inline-block;
        font-size: 18px;
        color: #424f61;
        line-height: 16px;
        font-weight: blod;
        margin-top: 3px;
        position: absolute;
        .examine-all-btn {
          display: none;
        }
        .affairs-text {
          display: block;
          margin-top: -2px;
        }
      }
      .affairs-type-tab {
        margin-top: -4px;
        div {
          display: inline-block;
          font-size: 13px;
          color: rgba(0, 0, 0, 0.36);
          font-weight: 500;
          cursor: pointer;
          padding: 5px 6px;
          position: relative;
          &.active {
            color: #1578f6;
          }
        }
        .point {
          background: #8c9eff;
          border-radius: 100px;
          width: 6px;
          height: 6px;
          position: absolute;
          top: 0;
          right: 0;
        }
      }
    }
    .list-group-item {
      padding: 0 24px;
      line-height: 40px;
      border: none;
      cursor: pointer;
      &:hover {
        background: #f5f5f5;
      }
    }
    .waitHandle-list {
      padding-top: 12px;
      overflow: auto;
      height: 236px;
      .waitHandle-list-card {
        border-radius: 4px;
        margin: 0 22px 10px 12px;
        height: 48px;
        cursor: pointer;
        i {
          font-size: 24px;
          color: #ffffff;
          margin: 11px 7px 0 12px;
          float: left;
          position: relative;
          z-index: 9;
        }
        .title {
          font-size: 14px;
          color: #ffffff;
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 145px;
          line-height: 48px;
        }
        .number {
          background: #ffffff;
          border-radius: 100px;
          font-size: 12px;
          line-height: 12px;
          color: #169989;
          margin-right: 16px;
          margin-top: 16px;
          text-align: center;
          &.padding-8px {
            padding: 2px 8px;
          }
          &.padding-6px {
            padding: 2px 6px;
          }
          &.padding-4px {
            padding: 2px 4px;
          }
        }
      }
    }
    .my-list {
      padding-top: 12px;
      overflow: auto;
      height: 224px;
      position: relative;
      .gm-scroll-view {
        padding-bottom: 12px;
      }
      .my-list-card {
        border-radius: 4px;
        margin: 0 12px 10px;
        white-space: nowrap;
        overflow: hidden;
        cursor: pointer;
        position: relative;
        &.completed {
          background: #4caf50;
          height: 40px;
          i,
          .title {
            color: #ffffff;
          }
        }
        &.undone {
          background: #eceff1;
          height: 60px;
          i,
          .title {
            color: #607d8b;
          }
        }
        &.fail {
          background: #eeeeee;
          height: 40px;
          i,
          .title {
            color: #9e9e9e;
          }
        }
        div {
          display: inline-block;
        }
        i {
          font-size: 24px;
          margin: 8px 11px 0 12px;
        }
        .title {
          width: 80%;
          font-size: 14px;
          line-height: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-top: 13px;
          vertical-align: top;
        }
        .rode {
          font-size: 12px;
          color: #b0bec5;
          line-height: 12px;
          margin-left: 50px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }

  .apply-container {
    background: #ffffff;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
    border-radius: 4px;
    padding: 0;
    .scrollAfterStyle {
      position: absolute;
      background: #ffffff;
      top: 0;
      z-index: 999;
      width: 90%;
    }
    .apply-header {
      padding: 0 24px;
      border-bottom: 1px solid #e0e0e0;
      overflow: hidden;
      height: 64px;

      input {
        width: 560px;
        height: 40px;
        margin: 12px auto;
        text-align: center;
        background: #f5f5f5;
        border-radius: 2px;
        border: none;
        box-shadow: none;
      }
    }
    h3 {
      float: left;
      margin: 0;
      font-size: 16px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.87);
      line-height: 63px;
      letter-spacing: 2;
    }
    .search-circle1 {
      display: inline-block;
      padding: 15px 18px;
      margin: -4px -15px -5px auto;
      background: rgba(63, 81, 181, 0.06);
      border-radius: 100px;
      cursor: pointer;
    }
    .search-circle2 {
      display: inline-block;
      padding: 6px;

      border-radius: 100px;
    }
  }
  .apply-type-group {
    padding: 24px 0 0 24px;
    clear: both;
    overflow: hidden;
    border-bottom: 1px solid #e0e0e0;
    .type-head {
      font-size: 13px;
      color: rgba(0, 0, 0, 0.36);
      line-height: 13px;
    }
    .apply-list {
      padding: 13px 0 7px 0;
      margin-left: -13px;
      overflow: hidden;
      clear: both;
      .apply {
        position: relative;
        left: 0;
        top: 0;
        z-index: 0;
        display: inline-block;
        width: 110px;
        padding: 0 13px;
        opacity: 1;
        border-radius: 0%;
        overflow: hidden;
        transition: all 0.3s ease-out;
        height: 135px;
        vertical-align: top;
        .app-icon-div {
          width: 86px;
          height: 86px;
          border-radius: 100px;
          margin-bottom: 8px;
          box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.08),
            0 3px 3px 0 rgba(0, 0, 0, 0.08);
          transform: translateX(0px);
          transition: all 0.3s ease-out;
          cursor: pointer;
          background-image: linear-gradient(-135deg, #5067d7 0%, #3f53b8 100%);
          i {
            display: inline-block;
            // margin: 14px 0 0 18px;
            width: 86px;
            height: 86px;
            padding: 21px;
            font-size: 44px;
            background-image: linear-gradient(
              -135deg,
              #ffffff 0%,
              #eeeeee 100%
            );
            color: #ffffff;
            background-clip: text;
            -webkit-background-clip: text;
            // -webkit-text-fill-color: transparent;
            text-shadow: 0 0 3px rgba(0, 0, 0, 0.08),
              0 3px 3px rgba(0, 0, 0, 0.08);
          }
        }
        .apply-title {
          width: 84px;
          height: 38px;
          font-size: 13px;
          color: rgba(0, 0, 0, 0.54);
          line-height: 19px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          text-align: -webkit-center;
          -webkit-box-orient: vertical;
          word-wrap: break-word;
          word-break: break-all;
        }
      }
    }
    .apply-type-head {
      margin: -7px 0 22px 0;
      font-size: 13px;
      color: rgba(0, 0, 0, 0.67);
      line-height: 24px;
      font-weight: 500;
      i {
        margin-right: 16px;
        font-size: 24px;
        color: rgba(0, 0, 0, 0.67);
      }
    }
    .apply-type-list {
      margin-bottom: 20px;
    }
  }
  .mainPage-subPage {
    .myAffairs-header {
      border-bottom-left-radius: 2px;
      border-bottom-right-radius: 2px;
    }
    .affairs-table {
      margin-top: 6px;
    }
    .affairs-table table .table-header {
      display: none;
    }
    .table-search {
      background: #ffffff;
      margin-bottom: -6px;
      height: 60px;
      padding-top: 10px;
      box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
      border-radius: 2px;
    }
    .time-picker {
      .form-control.datepicker-input {
        border-radius: 0;
        border-top: 0 solid #ffffff;
        border-left: 0 solid #ffffff;
        border-right: 0 solid #ffffff;
        border-bottom: 2px solid #e0e0e0;
        box-shadow: inset 0 0px 0px rgba(0, 0, 0, 0.075);
        padding: 0;
      }
    }
    .search-group .form-control[readonly] {
      background: #ffffff;
    }
    .back-btn {
      padding: 0;
      background: transparent;
      margin-bottom: 20px;
    }
    .back-icon-btn {
      font-size: 20px;
      color: rgba(0, 0, 0, 0.54);
      line-height: 20px;
      cursor: pointer;
      vertical-align: middle;
    }
    .nav-title {
      font-size: 13px;
      color: rgba(0, 0, 0, 0.54);
      line-height: 13px;
      margin: 5px 0 0 8px;
      font-weight: 500;
      vertical-align: middle;
    }
  }
}

.app_child {
  position: relative;
  background: #ffffff;
  box-shadow: 0 2px 2px 0 rgba(11, 15, 40, 0.1), 0 0 2px 0 rgba(11, 15, 40, 0.1);
  border-radius: 1px;
  width: 260px;
  height: 81px;
  padding: 11px 3px 11px 11px;
  cursor: pointer;
  margin-right: 3%;
  .grow_1 {
     
    padding-left: 11px;
    .title {
      width: 150px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .text {
      width: 170px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .remark {
      width: 170px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 12px;
    }
  }
  .title {
    font-family: PingFang-SC-Bold;
    font-size: 14px;
    width: 100%;
    font-weight: normal;
    color: #595a63;
    letter-spacing: 0;
    text-align: left;
  }
  .text {
    font-family: PingFang-SC-Medium;
    font-size: 14px;
    color: #757a84;
    letter-spacing: 0;
  }
  .remark {
    font-family: PingFang-SC-Medium;
    font-size: 14px;
    color: #ed3833;
  }
  .maticon_wrap {
    border-radius: 6px;
    width: 57px;
    height: 57px;
    .maticon {
      font-size: 38px;
      color: white;
    }
  }
  .collect {
    color: #d3d3d3;
    position: absolute;
    top: 5px;
    cursor: pointer;
    right: 5px;
    &.active {
      color: #e65353;
    }
    .maticon{
      font-size:17px;
    }
  }
}
.quickServer-header {
  .modal-title {
    font-family: PingFangSC-Semibold;
    font-size: 16px;
    color: #313234;
    letter-spacing: 0;
    text-align: left;
    line-height: 16px;
    font-weight: normal;
  }
}
.quickServer_row {
  padding: 20px;
  .text {
    font-family: PingFang-SC-Medium;
    font-size: 13px;
    color: #8d8e90;
    letter-spacing: 0.37px;
    text-align: left;
    margin-bottom: 10px;
  }
  input {
    border: 1px solid #d9d9d9;
    border-radius: 3px;
    height: 32px;
    width: 260px;
    padding-left: 5px;
  }
}
</style>
