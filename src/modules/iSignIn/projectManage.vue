<template>
  <div id="i-sign" v-if="!importPeople.show&&!importPeopleBai.show">
    <div class="i-sign-header">
      <ul class="tabs">
        <li
          v-for="tabName in tabs"
          :key="tabName"
          :class="{ active: isCurrentTab(tabName) }"
          @click="selectTab(tabName)"
          @mouseover="mouseoverTab(tabName)"
          @mouseout="mouseoutTab(tabName)"
        >{{ tabsData[tabName].text }}</li>
      </ul>
      <div class="search">
        <input type="text" v-model="keyword" @input="searchCategoriesAndProjects" />
        <v-icon name="search"></v-icon>
      </div>
      <div class="actions" v-if="isCurrentTab(tabs.MANAGE)">
        <button type="button" class="btn" @click="toAddProjectModal">
          <v-icon class="pull-left" name="add"></v-icon>
          {{i18n.addProject}}
        </button>
      </div>
    </div>
    <div class="i-sign-projects">
      <div v-for="tab in tabs" :key="tab">
        <category-project-list
          :tabs="tabs"
          :cur-tab="tab"
          :loading="tabsData[tab].loading"
          :categories="tabsData[tab].categories"
          :projects="tabsData[tab].projects"
          :activeCategoryId="tabsData[tab].activeCategoryId"
          :activeProjectId="tabsData[tab].activeProjectId"
          :hasAuthority="tabsData[tab].hasAuthority"
          :limitOptions="limitOptions"
          :proxyArr="proxyArr"
          :schoolStatusArr="schoolStatusArr"
          :currentSchoolStatusOptions="currentSchoolStatusOptions"
          :collegeList="allCollegeList"
          :classList="classList"
          v-show="isCurrentTab(tab)"
          :key="tab"
          @to-edit-category-name="toEditCategoryName"
          @to-edit-project-name="toEditProjectName"
          @to-add-sign="toAddSign"
          @to-proxy-settings="toProxySettings"
          @to-sign-info="toSignInfo"
          @to-import="toImport"
          @to-importBai="toimportBai"
          @select-category="selectCategory"
          @select-project="selectProject"
          @set-limit-type="setLimitType"
          @delete-sign="deleteSign"
          @show-more-projects="showMoreProjects"
        ></category-project-list>
      </div>
    </div>

    <!-- add project modal -->
    <v-modal :show="newProjectModal.show" effect="fade" width="400">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">{{i18n.addProject}}</h5>
      </div>
      <div slot="modal-body" class="modal-body container-fluid new-sign-modal-body">
        <div class="form-group">
          <input
            type="text"
            class="form-control modal-input"
            v-model="newProjectModal.name"
            :maxlength="newProjectModal.projectNameMaxLength"
            :placeholder="i18n.addProjectPlaceholder"
          />
          <!-- <input
            type="text"
            class="form-control modal-input seleced_role"
            v-model="seleced_role"
            maxlength="20"
            placeholder="所属级别"
            v-if="roleList.length == 1"
          >-->
          <v-select
            v-model="seleced_role"
            :options="roleList"
            optionsLabel="label"
            optionsValue="value"
            class="seleced_role"
            @afterSelected="afterSelectedRole($event)"
          ></v-select>
          <!-- 当权限为院级时,选择分管学院 -->
          <v-select
            v-model="seleced_college"
            :options="collegeList"
            optionsLabel="text"
            optionsValue="id"
            v-if="seleced_role == 'COLLEGE'"
            class="seleced_role"
            placeholder="请选择学院"
          ></v-select>
          <v-select
            v-model="seleced_type"
            :options="typeList"
            optionsLabel="text"
            optionsValue="id"
            class="seleced_role"
            placeholder="请选择签到类型"
          ></v-select>
        </div>
        <div class="row type-div">
          <div class="app-type-text">
            {{i18n.selectCategory}}
            <span
              class="add-category"
              @click="newProjectModal.showAddCategoryForm = true"
            >{{i18n.new}}</span>
          </div>
          <div class="app-type-content">
            <div class="creat-category-input" v-if="newProjectModal.showAddCategoryForm">
              <!-- TODO 这个maxlength的提示不友好 -->
              <input
                type="text"
                class="form-control"
                :maxlength="newProjectModal.categoryNameMaxLength"
                :placeholder="i18n.addCategoryPlaceholder"
                v-model="newProjectModal.newCategoryName"
                v-focus
              />
              <div class="pull-right create-btn-group">
                <button
                  class="btn create-cancel clearBtnBorder"
                  @click="newProjectModal.showAddCategoryForm = false"
                >{{i18n.cancel}}</button>
                <button class="btn create-sure clearBtnBorder" @click="addCategory">{{i18n.sure}}</button>
              </div>
              <p class="error-msg"></p>
            </div>
            <p
              class="type-p"
              v-for="(category, index) in newProjectModal.categories"
              :class="{ active: newProjectModal.categoryId === category.id }"
              @click="newProjectModal.categoryId = category.id;"
              :key="index"
            >
              <v-icon name="done"></v-icon>
              {{category.name}}
            </p>
          </div>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button
          type="button"
          class="btn cancel-btn clearBtnBorder"
          @click="newProjectModal.show = false"
        >{{i18n.cancel}}</button>
        <button
          type="button"
          class="btn submit-btn clearBtnBorder"
          @click="addProject"
        >{{i18n.sure}}</button>
      </div>
    </v-modal>

    <!-- edit category or project name modal -->
    <v-modal :show="editNameModal.show" effect="fade" width="400">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">{{editNameModal.title}}</h5>
      </div>
      <div slot="modal-body" class="modal-body container-fluid">
        <div class="form-group">
          <input
            type="text"
            class="form-control modal-input"
            v-model="editNameModal.name"
            :maxlength="editNameModal.maxLength"
            :placeholder="editNameModal.placeholder"
            v-focus="editNameModal.focusInput"
            @keyup.enter="submitEditName"
          />
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button
          type="button"
          class="btn cancel-btn clearBtnBorder"
          @click="editNameModal.show = false"
        >{{i18n.cancel}}</button>
        <button
          type="button"
          class="btn submit-btn clearBtnBorder"
          @click="submitEditName"
        >{{i18n.sure}}</button>
      </div>
    </v-modal>

    <!-- add sign modal -->
    <sign-info-modal
      title="新增签到"
      :checkInType="newSignModal.project?newSignModal.project.checkInType:''"
      :signInfo="newSignModal"
      :i18n="i18n"
      @confirm="addSign"
    ></sign-info-modal>

    <!-- 多次签到 -->
  </div>
  <v-import
    v-bind="importPeople"
    @backParentPage="closeImportPeople"
    v-else-if="importPeople.show&&!importPeopleBai.show"
  ></v-import>
  <v-import v-bind="importPeopleBai" @backParentPage="closeImportPeopleBai" v-else></v-import>
</template>
<script>
import Vue from "vue";
import VIcon from "./components/vIcon";
import CategoryProjectList from "./categoryProjectList";
import Locations from "./locations";
import SignInfoModal from "./signInfoModal";
import backend from "./backend";
import {
  sAjax,
  request,
  translation,
  debounce
} from "../../assets/utils/utils.js";
import { setTimeout } from "timers";

export default {
  components: {
    VIcon,
    CategoryProjectList,
    Locations,
    SignInfoModal
  },
  data: function() {
    const ALL = "ALL";
    const MANAGE = "MANAGE";
    const PROXY = "PROXY";
    const MINE = "MINE";
    return {
      proxyArr: [],
      schoolStatusArr: [
        {
          label: "在校",
          value: "IN_SCHOOL"
        },
        {
          label: "不在校",
          value: "NOT_IN_SCHOOL"
        }
      ],
      lang: "zh-cn",
      tabs: {
        ALL,
        MANAGE,
        PROXY,
        MINE
      },
      roleList: [], //用户权限列表(校级、院级、校级院级)
      seleced_role: "", //用户选择的权限(校级、院级)
      collegeList: [], //学院列表
      seleced_college: "", //权限为院级时，选择的学院
      keyword: null,
      curTab: MANAGE,
      currentSchoolStatusOptions: [],
      tabsData: {
        ALL: {
          text: null,
          name: null,
          loading: true,
          init: false,
          activeCategoryId: null, // TODO 使用这个控制默认开合的什么鬼
          activeProjectId: null,
          categories: [],
          projects: {},
          hasAuthority: false
        },
        MANAGE: {
          text: null,
          name: null,
          loading: true,
          init: false,
          activeCategoryId: null, // TODO 使用这个控制默认开合的什么鬼
          activeProjectId: null,
          categories: [],
          projects: {},
          hasAuthority: false
        },
        PROXY: {
          text: null,
          name: null,
          loading: true,
          init: false,
          activeCategoryId: null, // TODO 使用这个控制默认开合的什么鬼
          activeProjectId: null,
          categories: [],
          projects: {},
          hasAuthority: false
        },
        MINE: {
          text: null,
          name: null,
          loading: true,
          init: false,
          activeCategoryId: null, // TODO 使用这个控制默认开合的什么鬼
          activeProjectId: null,
          categories: [],
          projects: {},
          hasAuthority: false
        }
      },
      userTypes: {
        ALL,
        MANAGE,
        PROXY: "AGENT",
        MINE: "MY"
      },
      newProjectModal: {
        show: false,
        name: null,
        categoryId: null,
        projectNameMaxLength: 30,
        categoryNameMaxLength: 15,
        categories: [],
        showAddCategoryForm: false,
        newCategoryName: null
      },
      editNameModal: {
        show: false,
        title: null,
        placeholder: null,
        maxLength: null,
        i18n: null,
        id: null,
        type: null,
        name: null,
        focusInput: true,
        category: null,
        project: null
      },
      newSignModal: {
        show: false,
        name: null,
        startTime: "",
        endTime: "",
        startTimeToHours: "",
        endTimeToHours: "",
        signWays: {
          qrcode: "qrcode",
          location: "location",
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
      importPeople: {
        show: false,
        parentPageTitle: null,
        downloadTemplateUrl: "/iSignIn/projects/downloadTemplate",
        downloadErrorTemplateUrl: "/iSignIn/projects/excels/error",
        checkTemplateUrl: "",
        importBtnType: null,
        templateName: "自定义名单模板",
        project: null
      },
      allCollegeList:[],
      classList:[],
      // 导入白名单
      importPeopleBai: {
        show: false,
        parentPageTitle: null,
        downloadTemplateUrl: "/iSignIn/projects/excludeListTemplate",
        downloadErrorTemplateUrl: "/iSignIn/projects/excludeList/excels/error",
        checkTemplateUrl: "",
        importBtnType: null,
        templateName: "自定义白名单模板",
        project: null
      },
      limitOptions: {
        educationLevel: []
      },
      seleced_type: "single",
      typeList: [
        { text: "单次签单", id: "single" },
        { text: "考勤签到", id: "loop" }
      ]
    };
  },
  created: function() {
    let lang = window.localStorage.getItem("lang");
    if (lang && translation(lang)) {
      this.lang = lang;
    }
    // sAjax({
    //   url: "/api/payment/sysdicttype?typeName=在校状态",
    //   dataType: "json",
    //   type: "get",
    //   async: false,
    //   success: (result)=> {
    //     if (result.state) {
    //       this.schoolStatusArr = result.data;
    //     }
    //   }
    // });

    this.editNameModal.i18n = this.i18n;
    this.tabsData.MANAGE.name = this.tabsData.MANAGE.text = this.i18n.listTypeManage;
    this.tabsData.ALL.name = this.tabsData.ALL.text = this.i18n.listAll;

    this.tabsData.PROXY.name = this.tabsData.PROXY.text = this.i18n.listTypeProxy;
    this.tabsData.MINE.name = this.tabsData.MINE.text = this.i18n.listTypeMine;
    this.selectTab(this.tabs.MANAGE);
    this.initLimitConditions();
    this.getCurrentSchoolStatusList();
    this.getClassList()
    this.getCollegeList()
  },
  computed: {
    i18n: function() {
      return translation(this.lang).iSign;
    }
  },
  methods: {
    getClassList() {
      let url = `api/relClass/classes/list`;
      request(url).then(o => {
        if (o.state) {
          this.classList = o.data;
        }
      });
    },
    getCollegeList() {
      let url = `api/colleges`;
      request(url).then(o => {
        if (o.state) {
          this.allCollegeList = o.data;
        }
      });
    },
    getCurrentSchoolStatusList() {
      let url = "api/system/dicts?dictType=当前在校状态";
      request(url).then(o => {
        if (o.state) {
          console.log("o", o);
          this.currentSchoolStatusOptions = o.data;
        }
      });
    },
    isCurrentTab: function(tabName) {
      return this.curTab === tabName;
    },
    selectTab: function(tabName) {
      // console.log("选择tab")
      this.proxyArr = [];
      let tabData = this.tabsData[tabName];
      if (this.curTab === tabName) {
        tabData.init = false;
        tabData.loading = true;
        tabData.projects = {};
        tabData.activeCategoryId = null;
        tabData.activeProjectId = null;
      }
      this.curTab = tabName;
      if (tabData.init) {
        // TODO 更好的更新机制
        tabData.loading = false;
        return;
      }
      tabData.loading = true;
      backend.getManagerAuthority((err, result) => {
        if (err) {
          return this.$toast(this.i18n.error.networkError);
        }
        if (!result.state) {
          return this.$toast(result.message);
        }
        // console.log(result)
        tabData.hasAuthority = true;
        if (tabName == this.tabs.MANAGE && !result.data) {
          tabData.hasAuthority = false;
          tabData.init = true;
          tabData.loading = false;
          return;
        }
        backend.getProjectCategories(
          this.curTab,
          this.keyword,
          (err, result) => {
            if (err) {
              return this.$toast(this.i18n.error.networkError);
            }
            if (!result.state) {
              return this.$toast(result.message);
            }
            tabData.init = true;
            tabData.categories = result.data;
            tabData.loading = false;
            if (!tabData.categories.length) {
              return;
            }
            let firstCategory = tabData.categories[0];
            tabData.activeCategoryId = firstCategory.id;
            let firstCategoryProjects = this.getProjectDefaultViewSettings();
            this.$set(
              tabData.projects,
              firstCategory.id,
              firstCategoryProjects
            );
            backend.getProjectsByCategoryId(
              this.userTypes[tabName],
              firstCategory.id,
              this.keyword,
              firstCategoryProjects.page,
              firstCategoryProjects.size,
              (err, result) => {
                if (err) {
                  return this.$toast(this.i18n.error.networkError);
                }
                if (!result.state) {
                  return this.$toast(result.message);
                }
                this.proxyArr = result.list;
                firstCategoryProjects.init = true;
                firstCategoryProjects.list = result.list;
                firstCategoryProjects.loading = false;
                firstCategoryProjects.hasMore =
                  result.totalPages > firstCategoryProjects.page + 1;
                if (firstCategoryProjects.list.length) {
                  tabData.activeProjectId =
                    tabData.activeCategoryId +
                    "-" +
                    firstCategoryProjects.list[0].id;
                  this.selectProject(tabData.activeProjectId);
                }
                for (let project of result.list) {
                  this.setProjectPeopleCount(project);
                }
              }
            );
          }
        );
      });
    },
    initLimitConditions: function() {
      backend.getLimitConditions((err, result) => {
        if (err) {
          return this.$toast(this.i18n.error.networkError);
        }
        if (!result.state) {
          return this.$toast(result.message);
        }
        if (result.data) {
          for (let code in result.data) {
            this.limitOptions.educationLevel.push({
              id: code,
              text: result.data[code]
            });
          }
        }
      });
    },
    showMoreProjects: function(category) {
      let projectsInfo = this.tabsData[this.curTab].projects[category.id];
      projectsInfo.page += 1;
      projectsInfo.pageLoading = true;
      backend.getProjectsByCategoryId(
        this.userTypes[this.curTab],
        category.id,
        this.keyword,
        projectsInfo.page,
        projectsInfo.size,
        (err, result) => {
          if (err) {
            return this.$toast(this.i18n.error.networkError);
          }
          if (!result.state) {
            return this.$toast(result.message);
          }
          projectsInfo.pageLoading = false;
          projectsInfo.list = projectsInfo.list.concat(result.list);
          projectsInfo.hasMore = result.totalPages > projectsInfo.size + 1;
          if (!projectsInfo.hasMore) {
            projectsInfo.showNoMoreTip = true;
            setTimeout(() => {
              projectsInfo.showNoMoreTip = false;
            }, 2000);
          }
          for (let project of result.list) {
            this.setProjectPeopleCount(project);
          }
        }
      );
    },
    mouseoverTab: function(tabName) {
      if (tabName === this.curTab) {
        this.tabsData[tabName].text = this.i18n.refresh;
      }
    },
    mouseoutTab: function(tabName) {
      this.tabsData[tabName].text = this.tabsData[tabName].name;
    },
    toAddProjectModal: function() {
      backend.getProjectCategories(this.curTab, this.keyword, (err, result) => {
        if (err) {
          return this.$toast(this.i18n.error.networkError);
        }
        if (result.state) {
          this.getRole(); //查看用户权限
          this.newProjectModal.categories = [];
          if (!this.collegeList.length && this.getCollege())
            //获取学院
            this.newProjectModal.categories = [];
          result.data.map(val => {
            this.newProjectModal.categories.push(val);
          });

          this.newProjectModal.categoryId = null;
          this.newProjectModal.newCategoryName = null;
          this.newProjectModal.show = true;
        } else {
          this.$toast(result.message);
        }
      });
    },
    getRole() {
      //查看用户权限接口
      let url = "/api/iSignIn/projects/userSignInManageRole";
      sAjax({
        type: "get",
        url: url,
        success: data => {
          if (data.state) {
            if (data.data.length) {
              if (data.data.length == 1) {
                this.roleList = [
                  {
                    label: data.data[0] == "SCHOOL" ? "校级" : "院级",
                    value: data.data[0]
                  }
                ];
                this.seleced_role = data.data[0];
              } else {
                //同时拥有2种权限
                this.roleList = [
                  { label: "校级", value: "SCHOOL" },
                  { label: "院级", value: "COLLEGE" }
                ];
                this.seleced_role = "SCHOOL";
              }
            }
          }
        }
      });
    },
    getCollege() {
      //获取管理的学院
      let url = "/api/iSignIn/projects/manageSignInColleges";
      sAjax({
        type: "get",
        url: url,
        success: data => {
          if (data.state) {
            if (data.data.length) {
              this.collegeList = data.data;
            }
          }
        }
      });
    },
    afterSelectedRole(obj) {
      //权限下拉框回调
    },
    addCategory: function() {
      if (!this.newProjectModal.newCategoryName) {
        return this.$toast(this.i18n.error.pleaseFillInCategoryName);
      }
      backend.addCategory(
        this.newProjectModal.newCategoryName,
        (err, result) => {
          if (err) {
            return this.$toast(this.i18n.error.networkError);
          }
          if (!result.state) {
            if (result.code == "50003") {
              return this.$toast(this.i18n.error.categoryNameIsExisted);
            }
            return this.$toast(result.message);
          }
          this.newProjectModal.categories.unshift(result.data);
          this.newProjectModal.categoryId = result.data.id;
          this.unshiftCategoryToTabs(result.data);
          this.$toast(this.i18n.tip.addCategorySuccess);
          this.newProjectModal.showAddCategoryForm = false;
        }
      );
    },
    unshiftCategoryToTabs: function(category) {
      for (let type in this.tabsData) {
        this.tabsData[type].categories.unshift(category);
        this.$set(
          this.tabsData[type].projects,
          category.id,
          this.getProjectDefaultViewSettings()
        );
      }
    },
    addProject: function() {
      if (!this.newProjectModal.name) {
        return this.$toast(this.i18n.error.pleaseFillInProjectName);
      }
      if (!this.seleced_role) {
        return this.$toast("请选择所属级别");
      }
      if (this.seleced_role == "COLLEGE" && !this.seleced_college) {
        return this.$toast("请选择分管学院");
      }
      let selectCategoryId = this.newProjectModal.categoryId;
      if (!selectCategoryId && !this.newProjectModal.newCategoryName) {
        return this.$toast(this.i18n.error.pleaseChooseCategoryOrAddCategory);
      }
      backend.addProject(
        {
          projectName: this.newProjectModal.name,
          projectTypeId: selectCategoryId,
          projectTypeName: this.newProjectModal.newCategoryName,
          level: this.seleced_role,
          checkInType: this.seleced_type,
          college: this.seleced_college
        },
        (err, result) => {
          if (err) {
            return this.$toast(this.i18n.error.networkError);
          }
          if (!result.state) {
            return this.$toast(result.message);
          }
          let projects = this.tabsData[this.curTab].projects;

          if (!projects[selectCategoryId]) {
            this.$set(
              projects,
              selectCategoryId,
              this.getProjectDefaultViewSettings()
            );
          }
          result.data.peopleLoading = false;
          result.data.peopleCount = 0;
          projects[selectCategoryId].init = false;
          projects[selectCategoryId].loading = false;
          projects[selectCategoryId].list.unshift(result.data);
          this.newProjectModal.show = false;

          this.tabsData[this.curTab].activeCategoryId = selectCategoryId;
          this.selectProject(selectCategoryId + "-" + result.data.id);
          alert("项目创建成功，请继续设置人员限制、代理设置、签到");
          let categories = this.tabsData[this.curTab].categories;
          let selectedCategoryIndex = -1;
          for (let i in categories) {
            if (categories[i].id == selectCategoryId) {
              selectedCategoryIndex = parseInt(i);
              break;
            }
          }
          if (selectedCategoryIndex == -1) {
            return console.warn(
              "unexpected data: category not found:",
              categories,
              selectCategoryId
            );
          }
          if (selectedCategoryIndex == 0) {
            return;
          }
          categories.unshift(categories.splice(selectedCategoryIndex, 1)[0]);
        }
      );
    },

    toEditCategoryName: function(category) {
      this.editNameModal.show = true;
      this.editNameModal.title = this.i18n.editCategoryName;
      this.editNameModal.placeholder = this.i18n.addCategoryPlaceholder;
      this.editNameModal.maxLength = this.newProjectModal.categoryNameMaxLength;
      this.editNameModal.focusInput = true;
      this.editNameModal.id = category.id;
      this.editNameModal.name = category.name;
      (this.editNameModal.type = "category"),
        (this.editNameModal.category = category);
      this.editNameModal.project = null;
    },
    toEditProjectName: function(project) {
      this.editNameModal.show = true;
      this.editNameModal.title = this.i18n.editProjectName;
      this.editNameModal.placeholder = this.i18n.addProjectPlaceholder;
      this.editNameModal.maxLength = this.newProjectModal.projectNameMaxLength;
      this.editNameModal.focusInput = true;
      this.editNameModal.id = project.id;
      this.editNameModal.name = project.name;
      this.editNameModal.type = "project";
      this.editNameModal.category = null;
      this.editNameModal.project = project;
    },
    toAddSign: function(project) {
      this.newSignModal.show = true;
      this.newSignModal.projectId = project.id;
      this.newSignModal.project = project;
      this.newSignModal.name = "";
      this.newSignModal.startTime = null;
      this.newSignModal.endTime = null;
      this.newSignModal.useDynamicCode = false;
      this.newSignModal.weeklyDate = [];
      this.newSignModal.startTimeToHours = "";
      this.newSignModal.endTimeToHours = "";
      this.newSignModal.signWay = "qrcode";
      for (let i = 0; i < 7; i++) {
        this.newSignModal.weeklyDate.push({
          index: i,
          isChecked: true,
          startHours: "",
          endHours: ""
        });
      }
    },
    toSignInfo: function(data) {
      backend.getSignById(data.sign.id, (err, result) => {
        if (err) {
          return this.$toast(this.i18n.error.networkError);
        }
        if (!result.state) {
          return this.$toast(result.message);
        }
        Object.assign(data.sign, result.data);
        console.log(result.data);
        this.$emit("to-sign-info", Object.assign(data, { tab: this.curTab }));
      });
    },
    toProxySettings: function(project) {
      this.$emit("to-proxy-settings", project);
    },
    toImport: function(project) {
      this.importPeople.parentPageTitle = project.name + "/ 自定义名单导入";
      this.importPeople.checkTemplateUrl =
        "/iSignIn/projects/peopleLimit/excels/" + project.id;
      this.importPeople.importBtnType = [
        {
          url: "/iSignIn/projects/peopleLimit/" + project.id + "/LIMIT_BY_LIST",
          method: "post",
          isShowBtn: true,
          name: "覆盖导入",
          success: data => {
            if (data.state) {
              this.importSuccess();
            }
          }
        }
      ];
      this.importPeople.show = true;
      this.importPeople.project = project;
    },
    toimportBai(project) {
      // 这里导入白名单
      this.importPeopleBai.parentPageTitle = project.name + "/ 白名单导入";
      this.importPeopleBai.checkTemplateUrl =
        "/iSignIn/projects/checkExcludeList/excels/" + project.id;
      this.importPeopleBai.importBtnType = [
        {
          url: "/iSignIn/projects/createExcludePeoples",
          method: "post",
          isShowBtn: true,
          name: "覆盖导入",
          success: data => {
            if (data.state) {
              this.importSuccess();
            }
          }
        }
      ];
      this.importPeopleBai.show = true;
      this.importPeopleBai.project = project;
    },
    setSignWay: function(signWay) {
      this.newSignModal.signWay = signWay;
    },
    addSign: function() {
      if (this.saveing) {
        return;
      } else {
        this.saveing = true;
      }
      backend.addSign(this.newSignModal, (err, result) => {
        this.saveing = false;
        if (err) {
          return this.$toast(this.i18n.error.networkError);
        }
        if (!result.state) {
          return this.$toast(result.message);
        }
        this.newSignModal.project.signs.init = false;
        this.$toast(this.i18n.tip.addSignSuccess);
        this.newSignModal.show = false;
        this.newSignModal.project.signs.list.push(result.data);
        this.selectProject(
          this.newSignModal.project.categoryId +
            "-" +
            this.newSignModal.projectId
        );
      });
    },
    deleteSign: function({ project, sign }) {
      backend.deleteSign(sign.id, (err, result) => {
        if (err) {
          return this.$toast(this.i18n.error.networkError);
        }
        if (!result.state) {
          if (result.code === "50001") {
            return this.$toast("该签到已经被删除，请刷新页面查看最新数据");
          }
          return this.$toast(result.message);
        }
        this.$toast(this.i18n.tip.deleteSuccess);
        let index = -1;
        project.signs.list.forEach((_sign, _index) => {
          if (sign.id == _sign.id) {
            index = _index;
          }
        });
        if (index === -1) {
          console.warn("delete sign which not in project", sign, -1);
          return;
        }
        project.signs.list.splice(index, 1);
      });
    },
    submitEditName: function() {
      if (!this.editNameModal.name) {
        return this.$toast(this.i18n.error.pleaseFillInName);
      }
      let modifyData = {
        id: this.editNameModal.id,
        name: this.editNameModal.name
      };
      if (this.editNameModal.type == "category") {
        backend.editCategory(modifyData, (err, result) => {
          if (err) {
            return this.$toast(this.i18n.error.networkError);
          }
          if (!result.state) {
            if (result.code === "50003") {
              return this.$toast("该分类名称已经存在");
            }
            return this.$toast(result.message);
          }
          this.$toast(this.i18n.tip.modifySuccess);
          this.editNameModal.category.name = this.editNameModal.name;
          this.editNameModal.show = false;
        });
      } else {
        modifyData.categoryId = this.editNameModal.project.categoryId;
        backend.editProject(modifyData, (err, result) => {
          if (err) {
            return this.$toast(this.i18n.error.networkError);
          }
          if (!result.state) {
            if (result.code === "50003") {
              return this.$toast("该项目名称已经存在");
            }
            return this.$toast(result.message);
          }
          this.$toast(this.i18n.tip.modifySuccess);
          this.editNameModal.project.name = this.editNameModal.name;
          this.editNameModal.show = false;
        });
      }
    },
    getProjectDefaultViewSettings: function() {
      return {
        init: false,
        page: 0,
        size: 5,
        list: [],
        loading: true,
        end: false,
        hasMore: false,
        pageLoading: false,
        showNoMoreTip: false
      };
    },
    selectCategory: function(categoryId) {
      this.proxyArr = [];
      let tabData = this.tabsData[this.curTab]; // 不够优雅，但是问题不大
      let categoryProjects =
        tabData.projects[categoryId] || this.getProjectDefaultViewSettings();
      this.$set(tabData.projects, categoryId, categoryProjects);
      backend.getProjectsByCategoryId(
        this.userTypes[this.curTab],
        categoryId,
        this.keyword,
        categoryProjects.page,
        categoryProjects.size,
        (err, result) => {
          if (err) {
            return this.$toast(this.i18n.error.networkError);
          }
          if (!result.state) {
            return this.$toast(result.message);
          }
          categoryProjects.init = true;
          categoryProjects.list = result.list;
          this.proxyArr = result.list;
          categoryProjects.loading = false;
          categoryProjects.hasMore =
            result.totalPages > categoryProjects.page + 1;
          if (categoryProjects.list.length) {
            tabData.activeProjectId =
              categoryId + "-" + categoryProjects.list[0].id;
            this.selectProject(tabData.activeProjectId);
          }
          for (let project of result.list) {
            this.setProjectPeopleCount(project);
          }
        }
      );
    },
    selectProject: function(categoryProjectId) {
      let tabData = this.tabsData[this.curTab];
      tabData.activeProjectId = categoryProjectId;
      let [categoryId, projectId] = categoryProjectId.split("-");
      let projects = tabData.projects[categoryId].list;
      let currentProject;
      for (let project of projects) {
        if (project.id == projectId) {
          currentProject = project;
          break;
        }
      }
      if (!currentProject) {
        return this.$toast(this.i18n.error.dataError);
      }
      if (currentProject.signs.init) {
        return;
      }
      let getSigns = backend.getSignsByProjectId;
      if (this.curTab == this.tabs.MINE) {
        getSigns = backend.getMySignsByProjectId;
      }
      currentProject.signs.loading = true;
      getSigns(currentProject.id, (err, result) => {
        if (err) {
          return this.$toast(this.i18n.error.networkError);
        }
        if (!result.state) {
          return this.$toast(result.message);
        }
        currentProject.signs.init = true;
        currentProject.signs.loading = false;
        if (result.data.length) {
          currentProject.signs.list = result.data;
        }
      });
    },
    setLimitType: function({ project, type, conditions }) {
      project.peopleLoading = true;
      project.peopleCount = "";
      conditions = conditions || {};
      backend.setLimitType(project.id, type, conditions, (err, result) => {
        if (err) {
          return this.$toast(this.i18n.error.networkError);
        }
        if (!result.state) {
          return this.$toast(result.message);
        }
        this.$toast(this.i18n.tip.setSuccess);
        this.selectTab(this.tabs.MANAGE);
        return
        project.limitListOfPeople = type;
        project.educationLevel = conditions.educationLevel;
        project.educationLevelLabel = conditions.educationLevelLabel;
        project.grade = conditions.grade;
        project.inSchoolStatus = conditions.inSchoolStatus;
        project.currentSchoolStatus = conditions.currentSchoolStatus;
        this.setProjectPeopleCount(project);
      });
    },
    setProjectPeopleCount: function(project) {
      backend.getProjectPeopleCountByProjectId(project.id, (err, result) => {
        if (err) {
          return this.$toast(this.i18n.error.networkError);
        }
        if (!result.state) {
          return this.$toast(result.message);
        }
        project.peopleLoading = false;
        project.peopleCount = result.data;
      });
    },
    importSuccess: function() {
      this.$toast("设置成功");
      this.importPeople.show = false;
      this.importPeople.project.peopleLoading = true;
      backend.getProjectById(this.importPeople.project.id, (err, result) => {
        if (err) {
          return this.$toast(this.i18n.error.networkError);
        }
        if (!result.state) {
          return this.$toast(result.message);
        }
        this.importPeople.project.peopleLoading = false;
        this.importPeople.project.limitListOfPeople =
          result.data.limitListOfPeople;
        this.importPeople.project.peopleCount = result.data.peopleCount;
      });
    },
    closeImportPeople: function() {
      this.importPeople.show = false;
    },
    closeImportPeopleBai() {
      this.importPeopleBai.show = false;
    },
    searchCategoriesAndProjects: debounce(function() {
      this.tabsData[this.curTab].init = false;
      this.selectTab(this.curTab);
    }, 400)
  }
};
</script>
<style lang="less">
@import url("../../assets/common.less");
@primaryColor: #298df7;
@blackTextColor: rgba(0, 0, 0, 0.77);
@defaultTextColor: rgba(0, 0, 0, 0.54);
@muteTextColor: rgba(0, 0, 0, 0.36);
#i-sign {
  padding: 24px 100px 24px 180px;
  // max-width: 1116px;
  margin: 0 auto;
  min-width: 900px;
  background: white;
}
#i-sign,
#sign-info {
  .modal-header {
    padding: 21px 25px;
    .modal-title {
      font-weight: 600;
      font-size: 16px;
      color: @blackTextColor;
    }
  }
  .modal-body {
    font-weight: 600;
    .form-group {
      .modal-input {
        padding-left: 10px;
        padding-right: 10px;
      }
    }
    .modal-input {
      display: inline-block;
      font-size: 13px;
      color: @blackTextColor;
      border: none;
      box-shadow: none;
      outline: none;
    }
    .type-div.row {
      padding: 12px 15px;
      border-top: 1px solid #e0e0e0;
      .app-type-text {
        font-size: 13px;
        color: @muteTextColor;
        line-height: 40px;
        margin-left: 9px;
        margin-top: -12px;
        .add-category {
          cursor: pointer;
          font-size: 13px;
          color: @defaultTextColor;
          text-decoration: underline;
          letter-spacing: 0;
        }
      }
      .app-type-content {
        height: 146px;
        overflow: auto;
        .type-p {
          padding: 11px 10px;
          margin: 0;
          font-size: 13px;
          color: @defaultTextColor;
          cursor: pointer;
          i {
            display: none;
            float: left;
            margin-right: 8px;
            font-size: 18px;
            color: @defaultTextColor;
          }
          &.active {
            i {
              display: inline-block;
            }
          }
        }
        .creat-category-input {
          input {
            border: none;
            -webkit-box-shadow: none;
            box-shadow: none;
            border-radius: 0;
            background: transparent;
            width: 77%;
            margin-left: 70px;
            font-size: 13px;
            font-weight: 500;
            padding: 0;
            color: @defaultTextColor;
            border-bottom: 2px solid #e0e0e0;
            margin-left: 10px;
            &:focus,
            &:hover {
              border-bottom: 2px solid @primaryColor;
            }
          }
          .create-btn-group {
            margin: -36px 64px 0 0;
            .btn {
              background: transparent;
            }
            .create-cancel {
              padding: 6px 0;
              font-size: 13px;
              color: @defaultTextColor;
              font-weight: 500;
            }
            .create-sure {
              color: @primaryColor;
            }
            .error-msg {
              padding: 10px;
              margin: 0;
              font-size: 13px;
              color: indianred;
              font-weight: 500;
            }
          }
        }
      }
    }
    &.modal-full-width {
      padding: 0;
      overflow: inherit;
      max-height: 1000px;
      .form-group {
        margin-bottom: 0;
        & > input {
          height: 56px;
          padding-left: 24px;
          outline: 0;
          box-shadow: none;
          border-radius: 0;
          border: none;
          font-size: 13px;
        }
        .time-picker {
          .form-control {
            // padding: 16px 22px;
            // border: 0 solid #fff;
            // border-top: 1px solid #e0e0e0;
          }
          // input {
          //   height: 100%;
          //   background: transparent;
          //   box-shadow: none;
          //   border: 0;
          //   border-top: 1px solid #e0e0e0;
          //   padding: 6px 24px;
          //   font-size: 13px;
          // }
        }
        .switch {
          height: 30px;
          line-height: 30px;
          position: relative;
          cursor: pointer;
          padding-right: 5px;
          margin-top: 5px;
          .label {
            padding-left: 0;

            font-size: 13px;
            color: @blackTextColor;
          }
          .slider {
            position: relative;
            height: 100%;
            float: right;
            padding: 0 18px 0;
            .head {
              width: 20px;
              height: 20px;
              position: absolute;
              left: 0;
              top: 5px;
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
              width: 30px;
              height: 13px;
              border-radius: 10px;
              left: 5px;
              top: 9px;
              position: absolute;
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
        }
        .sign-ways {
          padding: 22px;
          border-top: 1px solid #e0e0e0;
          .sign-way {
            cursor: pointer;
            transition: all 200ms;
            margin-top: 20px;
            i {
              font-size: 22px;
              color: #bdbdbd;
              float: left;
            }
            span {
              height: 22px;
              line-height: 26px;
              color: #bdbdbd;
              margin-left: 5px;
              font-size: 13px;
            }
            &.active {
              i,
              span {
                color: #555;
              }
            }
          }
        }
      }
    }
  }

  .qrcode-locations {
  }

  .new-sign-modal-body {
    max-height: 600px !important;
    overflow-y: scroll !important;
  }
}
.i-sign-header {
  background: #ffffff;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.12), 0 4px 4px 0 rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  position: relative;
  text-align: center;
  height: 56px;
  margin-bottom: 12px;
  .tabs {
    display: inline-block;
    list-style: none;
    margin: 0;
    padding: 0;
    position: absolute;
    left: 0;
    li {
      // display: inline-block;
      float: left;
      padding: 21px 19px 20px;
      border-bottom: 2px solid #ffffff;
      transition: all 200ms;
      font-size: 13px;
      font-weight: 600;
      color: @defaultTextColor;
      letter-spacing: 0;
      line-height: 13px;
      &.active,
      &:hover {
        cursor: pointer;
        border-color: @primaryColor;
        color: @primaryColor;
      }
    }
  }
  .search {
    position: relative;
    display: inline-block;
    margin: 0 auto;
    height: 56px;
    padding: 10px;
    width: 33%;
    input {
      padding-left: 36px;
      font-size: 13px;
      height: 100%;
      width: 100%;
      border-radius: 100px;
      border-color: transparent;
      background: #f5f5f5;
      outline: 0;
    }
    i {
      position: absolute;
      left: 0;
      top: 0;
      padding: 17px 5px 17px 22px;
      font-size: 22px;
      transform: none;
      -webkit-transform: none;
      color: @muteTextColor;
    }
  }
  .actions {
    display: inline-block;
    position: absolute;
    right: 0;
    top: 0;
    width: 127px;
    height: 56px;
    padding: 10px;
    .btn {
      height: 100%;
      width: 100%;
      font-size: 13px;
      color: #ffffff;
      letter-spacing: 0;
      line-height: 24px;
      padding: 6px 16px 6px 12px;
      background: @primaryColor;
      i {
        font-size: 18px;
        transform: translateY(0.05em);
      }
    }
  }
}
.loader svg {
  transform: translateY(6px);
  margin-right: 5px;
}

//权限选择样式
.modal .modal-body {
  .form-group {
    .seleced_role {
      width: 100%;
      margin-top: 15px;
    }
  }
}
</style>
