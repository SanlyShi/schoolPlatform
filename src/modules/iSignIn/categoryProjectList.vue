<template>
  <div>
    <!-- loading -->
    <div class="empty-categories loader" v-if="loading" v-html="loader.iconWithText"></div>
    <div class="empty-categories loader" v-else-if="!hasAuthority">您无管理签到项目的权限</div>
    <div class="empty-categories" v-else-if="!categories.length">{{ '暂无项目分类' }}</div>
    <el-collapse :value="activeCategoryId" @change="selectCategory" accordion v-else>
      <el-collapse-item
        class="i-sign-category-item"
        v-for="(category, index) in categories"
        :name="category.id"
        :key="index"
        :itemWrapCorrectionHeight="48"
      >
        <template slot="title">
          <div
            class="category-item-title"
            @click.stop="toEditCategoryName(category)"
            v-if="isManager"
          >
            {{category.name}}
            <span class="edit-mask">.</span>
            <v-icon name="edit" :title="i18n.editName"></v-icon>
          </div>
          <div class="category-item-title" v-else>{{category.name}}</div>
        </template>
        <template slot="content">
          <div class="empty-projects" v-if="!projects[category.id]">nothing here</div>
          <div
            class="empty-projects loader"
            v-else-if="projects[category.id].loading"
            v-html="loader.iconWithText"
          ></div>
          <div class="empty-projects" v-else-if="!projects[category.id].list.length">暂无签到项目</div>
          <el-collapse :value="activeProjectId" @change="selectProject" accordion v-else>
            <el-collapse-item
              class="i-sign-project-item"
              v-for="(project, index) in projects[category.id].list"
              :name="getProjectCollapseItemId(category, project)"
              :key="index"
            >
              <template slot="title">
                <div class="project-name-container box_flex align_center">
                  <div class="project-name">{{project.name}}</div>
                  <div
                    class="project-edit"
                    @click.stop="toEditProjectName(project)"
                    v-if="isManager"
                  >
                    <v-icon name="edit" :title="i18n.editName"></v-icon>
                  </div>
                  <div v-if="project.checkInType ==='single'" class="check_type single">单次</div>
                  <div v-if="project.checkInType ==='loop'" class="check_type loop">考勤</div>
                </div>

                <div class="project-actions box_flex flex_between" v-if="isManager">
                  <div class="people-restration">
                    <button type="button" class="btn btn-primary clearBtnBorder" @click.stop=";">
                      <!-- <v-icon class="pull-left" name="people"></v-icon> -->
                      <span
                        v-html="project.peopleLoading ? (loader.small) : getLimitPeopleDesc(project)"
                      ></span>
                    </button>
                    <transition name="fade">
                      <ul class="list-popper">
                        <!-- <h1 style="font-size:12px">{{proxyArr[0]}}</h1> -->
                        <li @click.stop="setLimitType(project, 'NOT_LIMIT')">无限制</li>
                        <li @click.stop="toSelectCondition(project)">按条件筛选</li>
                        <li
                          v-if="proxyArr[index] && proxyArr[index].level && proxyArr[index].level == 'SCHOOL'"
                          @click.stop="setLimitType(project, 'ALL_SCHOOL')"
                        >全校在校生</li>
                        <li @click.stop="toImport(project)">自定义名单导入</li>
                        <li
                          v-if="proxyArr[index] && proxyArr[index].level && proxyArr[index].level == 'SCHOOL'"
                          @click.stop="toImportBai(project)"
                        >排除人员名单</li>
                        <li @click.stop="showSearch(project)">高级搜索</li>
                      </ul>
                    </transition>
                  </div>
                  <button
                    type="button"
                    class="btn btn-primary clearBtnBorder"
                    @click.stop="toProxySettings(project)"
                  >
                    <!-- <v-icon class="pull-left" name="settings"></v-icon> -->
                    {{i18n.proxySettings}}
                  </button>
                  <button
                    type="button"
                    class="btn btn-primary clearBtnBorder"
                    @click.stop="toAddSign(project)"
                  >
                    <!-- <v-icon class="pull-left" name="add"></v-icon> -->
                    {{i18n.addSign}}
                  </button>
                </div>
              </template>
              <template slot="content">
                <div class="signs">
                  <div v-if="!project.signs">nothing here</div>
                  <div
                    class="empty-signs loader"
                    v-else-if="project.signs.loading"
                    v-html="loader.iconWithText"
                  ></div>
                  <div
                    class="empty-signs"
                    v-else-if="!project.signs.list.length"
                  >{{ isManager ? '该项目下没有签到' : '暂无签到' }}</div>
                  <div
                    class="sign box_flex align_center"
                    v-for="(sign, index) in project.signs.list"
                    :class="{ 'sign-hover': !isMine, 'sign-success': sign.signInStatus == 'SIGN' || sign.signInStatus == 'MANUAL_ENTRY', 'sign-failed': sign.signInStatus == 'TIME_OUT_NOT_SIGN', 'sign-without-icon': isProxy }"
                    :key="index"
                    @click="toSignInfo(project, sign)"
                    v-else
                  >
                    {{sign.name}}
                    <div class="status_wrap box_flex flex_center" :class="sign.signWay">
                      <img
                        v-if="sign.signWay==='location'"
                        :src="require('../../../static/image/i_icon_dingwei@2x.png')"
                        alt
                      />
                      <img
                        v-if="sign.signWay==='qrcode'"
                        :src="require('../../../static/image/i_icon_saoma@2x.png')"
                        alt
                      />
                      <img
                        v-if="sign.signWay==='outside'"
                        :src="require('../../../static/image/i_waiqin@2x.png')"
                        alt
                      />
                      {{formatterSignWay(sign.signWay)}}
                    </div>
                    <v-icon
                      name="delete"
                      class="sign-status-icon delete-sign"
                      v-if="isManager"
                      @click.native.stop="deleteSign(project, sign)"
                    ></v-icon>
                    <v-icon
                      name="done"
                      class="sign-status-icon"
                      v-if="isMine && (sign.signInStatus == 'SIGN' || sign.signInStatus == 'MANUAL_ENTRY')"
                    ></v-icon>
                    <v-icon
                      name="clear"
                      class="sign-status-icon"
                      v-else-if="isMine && (sign.signInStatus == 'TIME_OUT_NOT_SIGN')"
                    ></v-icon>
                  </div>
                </div>
              </template>
            </el-collapse-item>
            <div
              class="show-more"
              v-if="projects[category.id].hasMore && !projects[category.id].pageLoading"
              @click="showMore(category)"
            >查看更多</div>
            <div
              class="page-loading loader"
              v-if="projects[category.id].pageLoading"
              v-html="loader.iconWithText"
            ></div>
            <div class="page-loading" v-if="projects[category.id].showNoMoreTip">已经到底了~</div>
          </el-collapse>
        </template>
      </el-collapse-item>
    </el-collapse>
    <v-modal :show="advancedSearch.show" effect="fade" width="720">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">{{translate.advancedSearch}}</h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div
          class="form-group advancedSearch-group"
          v-for="(searchItem, index) in advancedSearch.searchItems"
          :key="'search-item-' + index"
        >
          <v-select
            :options="advancedSearch.columns"
            :value="searchItem.key"
            :search="true"
            :data-index="index"
            @afterSelected="advancedSearchKeySelected"
          ></v-select>
          <v-select
            :options="searchItem.options.relation"
            :value="searchItem.relation"
            :search="true"
            :data-index="index"
            @afterSelected="advancedSearchRelationSelected"
          ></v-select>
          <v-select
            :options="searchItem.options.dictOptions"
            :value="searchItem.value"
            optionsLabel="text"
            optionsValue="id"
            :search="true"
            :multiple="true"
            :data-index="index"
            @afterSelected="advancedSearchValueSelected"
            v-if="searchItem.isDict"
          ></v-select>
          <v-select
            :options="searchItem.options.province"
            :value="searchItem.province"
            optionsLabel="text"
            optionsValue="id"
            :search="true"
            :multiple="true"
            :data-index="index"
            @afterSelected="advancedSearchProvinceSelected"
            v-if="searchItem.isAddress"
          ></v-select>
          <v-select
            :options="searchItem.options.city"
            :value="searchItem.city"
            optionsLabel="text"
            optionsValue="id"
            :search="true"
            :multiple="true"
            :data-index="index"
            @afterSelected="advancedSearchCitySelected"
            v-if="searchItem.isSelectProvince"
          ></v-select>
          <v-select
            :options="searchItem.options.county"
            :value="searchItem.county"
            optionsLabel="text"
            optionsValue="id"
            :search="true"
            :multiple="true"
            :data-index="index"
            @afterSelected="advancedSearchCountySelected"
            v-if="searchItem.isSelectCity"
          ></v-select>
          <v-datepicker
            ref="datepicker"
            class="btn-block time-picker value-datepicker"
            :value="searchItem.value"
            :clearButton="false"
            :showTime="false"
            :data-index="index"
            @daySelected="advancedSearchDateValue"
            v-if="searchItem.isDate"
          ></v-datepicker>
          <input
            type="text"
            class="value-input"
            v-if="searchItem.isInput"
            v-model="searchItem.value"
          />
          <button
            type="button"
            class="btn deleteBtn clearBtnBorder"
            :data-index="index"
            @click="deleteSearchItem(index)"
          >{{translate.remove}}</button>
        </div>

        <button
          type="button"
          class="btn addBtn clearBtnBorder"
          @click="addSearchItem()"
        >{{translate.addNew}}</button>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button
          type="button"
          class="btn submit-btn clearBtnBorder"
          @click="resetSearchItem()"
        >{{translate.reset}}</button>
        <button
          type="button"
          class="btn cancel-btn clearBtnBorder"
          @click="advancedSearch.show = false"
        >{{translate.cancel}}</button>
        <button
          type="button"
          class="btn submit-btn clearBtnBorder"
          :class="{disabled: isDisabled}"
          @click="execAdvancedSearch()"
        >{{translate.search}}</button>
      </div>
    </v-modal>
    <v-modal :show="peopleConditionsModal.show" effect="fade" width="900">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">{{peopleConditionsModal.title}}</h5>
      </div>
      <div slot="modal-body" class="modal-body container-fluid">
        <div class="conditions">
          <ul>
            <li>
              <label>培养层次</label>
              <v-select
                ref="educationLevel"
                :options="limitOptions.educationLevel"
                v-model="selectLimitOptions.educationLevel"
                options-value="id"
                options-label="text"
                :multiple="true"
                @afterSelected="selectEducationLevel"
              ></v-select>
            </li>
            <li>
              <label>学院</label>
              <v-select
                ref="inSchoolStatus"
                :multiple="true"
                :options="collegeList"
                v-model="selectLimitOptions.colleges"
                options-value="code"
                options-label="name"
              ></v-select>
            </li>
            <li>
              <label>年级</label>
              <v-select
                ref="grade"
                :multiple="true"
                :options="peopleConditionsModal.grades"
                v-model="selectLimitOptions.grade"
                options-value="id"
                options-label="text"
                @afterSelected="selectGrade"
              ></v-select>
            </li>
            <li>
              <label>班级</label>
              <v-select
                ref="inSchoolStatus"
                :multiple="true"
                :options="classList"
                v-model="selectLimitOptions.classIds"
                options-value="id"
                options-label="text"
              ></v-select>
            </li>
            <li>
              <label>在校状态</label>
              <v-select
                ref="inSchoolStatus"
                :options="schoolStatusArr"
                v-model="selectLimitOptions.inSchoolStatus"
                options-value="value"
                options-label="label"
                @afterSelected="selectInSchoolStatus"
              ></v-select>
            </li>
            <li>
              <label>学生当前状态</label>
              <v-select
                :multiple="true"
                :options="currentSchoolStatusOptions"
                v-model="selectLimitOptions.currentSchoolStatus"
                options-value="value"
                options-label="label"
                @afterSelected="selectCurrentSchoolStatus"
              ></v-select>
            </li>
          </ul>
        </div>
      </div>

      <div slot="modal-footer" class="modal-footer">
        <button
          type="button"
          class="btn cancel-btn clearBtnBorder"
          @click="peopleConditionsModal.show = false"
        >{{i18n.cancel}}</button>
        <button
          type="button"
          class="btn submit-btn clearBtnBorder"
          @click="setConditionLimit(peopleConditionsModal.project)"
        >{{i18n.sure}}</button>
      </div>
    </v-modal>
  </div>
</template>

<script>
import ELCollapse from "./components/collapse/collapse";
import ELCollapseItem from "./components/collapse/collapseItem";
import { sAjax, request, translation } from "../../assets/utils/utils.js";
import VIcon from "./components/vIcon";
import loader from "./loader";
import advancedSearch from "../../mixins/advancedSearch2.js";
export default {
  mixins: [advancedSearch],
  components: {
    "el-collapse": ELCollapse,
    "el-collapse-item": ELCollapseItem,
    VIcon
  },
  props: {
    proxyArr: {
      type: Array,
      default: function() {
        return [];
      }
    },
    tabs: Object,
    curTab: String,
    activeCategoryId: Number,
    activeProjectId: Number,
    categories: {
      type: Array,
      default: function() {
        return [];
      }
    },
    collegeList: {
      type: Array,
      default: function() {
        return [];
      }
    },
    classList: {
      type: Array,
      default: function() {
        return [];
      }
    },
    currentSchoolStatusOptions: {
      type: Array,
      default: function() {
        return [];
      }
    },
    schoolStatusArr: {
      type: Array,
      default: function() {
        return [];
      }
    },
    projects: Object,
    loading: {
      type: Boolean,
      default: false
    },
    limitOptions: Object,
    hasAuthority: Boolean
  },
  data: function() {
    return {
      // schoolStatusArr:[],
      lang: "zh-cn",
      loader: loader,
      peopleConditionsModal: {
        show: false,
        title: "选择条件",
        grade: "",
        educationLevel: "",
        educationLevelLabel: "",
        inSchoolStatus: "",
        inSchoolStatusLabel: "",
        currentSchoolStatus: "",
        grades: [],
        gradesMax: 10,
        inSchoolStatusOptions: [
          { id: "IN_SCHOOL", text: "在校" },
          { id: "NOT_IN_SCHOOL", text: "不在校" }
        ]
      },
      selectLimitOptions: {
        educationLevel: "",
        grade: "",
        inSchoolStatus: "",
        currentSchoolStatus: "",
        classIds: "",
        colleges: ""
      }
    };
  },
  created: function() {
    // console.log(this.proxyArr)
    let lang = window.localStorage.getItem("lang");
    if (lang && translation(lang)) {
      this.lang = lang;
    }
    let currentYear = new Date().getFullYear() + 1;
    for (let i = 0; i < this.peopleConditionsModal.gradesMax; ++i) {
      let year = currentYear-- + "";
      this.peopleConditionsModal.grades.push({ id: year, text: year });
    }
  },
  computed: {
    i18n: function() {
      return translation(this.lang).iSign;
    },
    isManager: function() {
      return this.curTab === this.tabs.MANAGE;
    },
    isMine: function() {
      return this.curTab === this.tabs.MINE;
    },
    isProxy: function() {
      return this.curTab === this.tabs.PROXY;
    },
    translate: function() {
      return translation(this.lang).infoManage;
    }
  },
  methods: {
    formatterSignWay(signWay) {
      if (signWay === "outside") {
        return "外勤";
      } else if (signWay === "location") {
        return "定位";
      } else {
        return "扫码";
      }
    },
    execAdvancedSearch() {
      //重写高级搜索的确定按钮点击事件,因为那个高级搜索是全校学生信息用的
      let searchDTOS = this.advancedSearch.searchItems.map(searchItem => {
        return {
          key: searchItem.key,
          relation: searchItem.relation,
          value: searchItem.value,
          tableName: this.advancedSearch.optionKeys[searchItem.key].tableName,
          listValues: searchItem.value ? searchItem.value.split(",") : [],
          provinces: searchItem.province ? searchItem.province.split(",") : [],
          cities: searchItem.city ? searchItem.city.split(",") : [],
          counties: searchItem.county ? searchItem.county.split(",") : []
          // type: searchItem.type
        };
      });
      if (this.searchProject) {
        let url = `api/iSignIn/projects/peopleListByAdvancedSearch/${this.searchProject.id}`;
        if (searchDTOS.length === 0) {
          url = `api/iSignIn/projects/peopleLimit/${this.searchProject.id}/NOT_LIMIT`;
          request(url, null, "post").then(o => {
            if (o.state) {
              this.advancedSearch.show = false;
              this.$parent.selectTab(this.curTab);
            }
          });
          return false;
        }
        request(url, { searchDTOS: searchDTOS }).then(o => {
          if (o.state) {
            this.advancedSearch.show = false;
            this.$parent.selectTab(this.curTab);
          }
        });
      }
    },
    getProjectCollapseItemId: function(category, project) {
      return category.id + "-" + project.id;
    },
    toEditCategoryName: function(category) {
      this.$emit("to-edit-category-name", category);
    },
    toEditProjectName: function(project) {
      this.$emit("to-edit-project-name", project);
    },
    toAddSign: function(project) {
      if (!project.limitListOfPeople) {
        return this.$toast("请先设置人员限制");
      }
      this.$emit("to-add-sign", project);
    },
    toProxySettings: function(project) {
      console.log(project);
      this.$emit("to-proxy-settings", project);
    },
    toSignInfo: function(project, sign) {
      if (this.isMine) {
        return;
      }
      this.$emit("to-sign-info", {
        project,
        sign
      });
    },
    selectCategory: function(value) {
      if (value) {
        this.$emit("select-category", value);
      } else {
        return;
      }
    },
    selectProject: function(value) {
      if (!value) {
        return;
      }
      this.$emit("select-project", value);
    },
    setLimitType: function(project, type) {
      this.$emit("set-limit-type", { project, type });
    },
    toSelectCondition: function(project) {
      if (project.limitListOfPeople === "BY_CONDITIONS") {
        this.selectLimitOptions = JSON.parse(JSON.stringify(project));
        this.peopleConditionsModal.educationLevel = project.educationLevel?project.educationLevel:0;
        this.peopleConditionsModal.grade = project.grade?project.grade:0;
        this.peopleConditionsModal.inSchoolStatus = project.inSchoolStatus?project.inSchoolStatus:0;
        this.peopleConditionsModal.currentSchoolStatus = project.currentSchoolStatus?project.currentSchoolStatus:0;
      } else {
        this.selectLimitOptions.educationLevel = "";
        this.selectLimitOptions.grade = "";
        this.selectLimitOptions.inSchoolStatus = "";
        this.selectLimitOptions.currentSchoolStatus = "";
        this.selectLimitOptions.colleges = "";
        this.peopleConditionsModal.educationLevel = "";
        this.peopleConditionsModal.grade = "";
        this.peopleConditionsModal.inSchoolStatus = "";
        this.peopleConditionsModal.currentSchoolStatus = "";
        this.peopleConditionsModal.colleges = "";
      }

      this.peopleConditionsModal.show = true;
      this.peopleConditionsModal.project = project;
    },
    setConditionLimit: function() {
      this.$emit("set-limit-type", {
        project: this.peopleConditionsModal.project,
        type: "BY_CONDITIONS",
        conditions: {
          educationLevel: this.peopleConditionsModal.educationLevel,
          grade: this.peopleConditionsModal.grade,
          inSchoolStatus: this.peopleConditionsModal.inSchoolStatus,
          currentSchoolStatus: this.peopleConditionsModal.currentSchoolStatus,
          educationLevelLabel: this.peopleConditionsModal.educationLevelLabel,
          inSchoolStatusLabel: this.peopleConditionsModal.inSchoolStatusLabel,
          classIds:this.selectLimitOptions.classIds,
          colleges:this.selectLimitOptions.colleges
        }
      });
      this.peopleConditionsModal.show = false;
    },
    selectEducationLevel: function(obj) {
      this.peopleConditionsModal.educationLevel = obj.val || "";
      this.$nextTick(function() {
        this.peopleConditionsModal.educationLevelLabel =
          (obj.target && obj.target.selected) || "obj.target.selected is null";
      });
    },
    selectGrade: function(obj) {
      this.peopleConditionsModal.grade = obj.val || "";
    },
    selectInSchoolStatus: function(obj) {
      this.peopleConditionsModal.inSchoolStatus = obj.val || "";
      this.$nextTick(function() {
        this.peopleConditionsModal.inSchoolStatusLabel =
          (obj.target && obj.target.selected) || "obj.target.selected is null";
      });
    },
    selectCurrentSchoolStatus: function(obj) {
      this.peopleConditionsModal.currentSchoolStatus = obj.val || "";
    },
    deleteSign: function(project, sign) {
      if (window.confirm("确定要删除" + sign.name + "吗?")) {
        this.$emit("delete-sign", { project, sign });
      }
    },
    toImport: function(project) {
      this.$emit("to-import", project);
    },
    toImportBai(project) {
      this.$emit("to-importBai", project);
    },
    getLimitPeopleDesc: function(project) {
      if (!project.limitListOfPeople) {
        return this.i18n.peopleRestrition;
      }
      switch (project.limitListOfPeople) {
        case "NOT_LIMIT":
          return "无限制";
        case "BY_CONDITIONS":
          let conditions = [];
          if (project.educationLevel) {
            conditions.push(project.educationLevelLabel);
          }
          if (project.colleges) {
            conditions.push(project.collegeNames);
          }
          if (project.classIds) {
            conditions.push(project.classNames);
          }
          if (project.grade) {
            conditions.push(project.grade + "级");
          }
          if (project.inSchoolStatus) {
            conditions.push(
              project.inSchoolStatus == "IN_SCHOOL" ? "在校" : "不在校"
            );
          }
          if (project.currentSchoolStatus) {
            project.currentSchoolStatus.split(",").forEach(o => {
              this.currentSchoolStatusOptions.forEach(element => {
                if (element.value == o) {
                  conditions.push(element.label);
                }
              });
            });
          }

          if (!conditions.length) {
            conditions.push("无条件限制");
          }
          let desc;
          if (conditions.length >= 2) {
            desc = conditions.join(",");
          } else {
            desc = conditions[0];
          }
          return desc + "(" + project.peopleCount + "人)";
        case "ALL_SCHOOL":
          return "全校在校生(" + project.peopleCount + "人)";
        case "ADVANCED_SEARCH":
          return "高级搜索(" + project.peopleCount + "人)";
        default:
          return "自定义名单(" + project.peopleCount + "人)";
      }
    },
    showMore: function(category) {
      this.$emit("show-more-projects", category);
    }
  }
};
</script>
<style lang="less">
@primaryColor: #298df7;
@blackTextColor: rgba(0, 0, 0, 0.77);
@defaultTextColor: rgba(0, 0, 0, 0.54);
@muteTextColor: rgba(0, 0, 0, 0.36);
@extraMuteTextColor: rgba(0, 0, 0, 0.24);
.i-sign-category-item {
  .category-item-title {
    position: relative;
    padding-top: 8px;
    font-size: 13px;
    color: @defaultTextColor;
    letter-spacing: 0;
    line-height: 20px;
    font-weight: 600;
    margin-right: 40px;
    overflow: hidden;
    width: 150px;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    word-break: keep-all;
    i {
      display: none;
      position: absolute;
      left: 53px;
      top: 7px;
      border-radius: 50%;
      color: #616161;
      font-size: 20px;
      transition: all 200ms;
      cursor: pointer;
    }
    .edit-mask {
      cursor: pointer;
      display: none;
      position: absolute;
      left: 30px;
      top: 22px;
      line-height: 1px;
      font-size: 1px;
      color: transparent;
      transition: all 200ms;
      box-shadow: 0 0 30px 16px white;
    }
    &:hover {
      i,
      .edit-mask {
        display: inline;
      }
    }
  }
  & > div > .el-collapse-item__header {
    width: 160px;
    transform: translateX(-150px);
    position: relative;
    left: -10px;
    background: transparent;
    border: none;
  }
  & > .el-collapse-item__wrap {
    transform: translateY(-48px);
    margin-bottom: -48px;
  }

  .el-collapse-item__wrap {
    background: transparent;
  }

  .empty-projects {
    height: 48px;
    line-height: 48px;
    color: @defaultTextColor;
    font-size: 13px;
  }
}
.i-sign-project-item {
  margin-bottom: 12px;
  &:last-child {
    margin-bottom: 0;
  }
  .el-collapse-item__header {
    background: rgba(63, 81, 181, 0.08);
    border-radius: 4px;
    .project-name-container {
      position: absolute;
      .project-name {
        // display: inline-block;
        float: left;
        padding: 18px 14px 17px 16px;
        font-size: 13px;
        color: @blackTextColor;
        font-weight: 600;
        letter-spacing: 0;
        line-height: 13px;
        max-width: 200px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .project-edit {
        cursor: pointer;
        display: none;
        float: left;
        line-height: 13px;
        padding: 16px 0 12px;
        color: @primaryColor;
        i {
          font-size: 20px;
          line-height: inherit;
        }
      }
      &:hover .project-edit {
        display: inline-block;
      }
    }
    .project-actions {
      // display: inline-block;
      float: right;
      margin-right: 14px;
      line-height: 13px;
      padding: 8px;
      width: 80%;
      .btn {
        background: rgba(63, 81, 181, 0.08);
        border-radius: 100px;
        padding: 6px 16px;
        height: 32px;
        border: none;
        color: @defaultTextColor;
        i {
          font-size: 20px;
          transform: translateY(-0.1em);
          margin-right: 8px;
        }
        &:hover {
          background: @primaryColor;
          color: white;
        }
      }
      .people-restration {
        position: relative;
        display: inline-block;
        .list-popper {
          display: none;
          list-style: none;
          position: absolute;
          top: 28px;
          padding: 0;
          z-index: 1;
          background: #ffffff;
          box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.12),
            0 4px 4px 0 rgba(0, 0, 0, 0.12);
          border-radius: 4px;
          min-width: 130px;
          li {
            cursor: pointer;
            line-height: 40px;
            padding: 0 16px;
            font-weight: 500;
            font-size: 13px;
            color: @defaultTextColor;
            &:hover {
              background: rgba(63, 81, 181, 0.08);
              color: @primaryColor;
            }
          }
        }
        &:hover {
          .list-popper {
            display: block;
          }
          .btn {
            background: @primaryColor;
            color: white;
          }
        }
      }
    }
  }
  .check_type {
    width: 54px;
    height: 24px;
    text-align: center;
    line-height: 25px;
    border-radius: 12px;
    color: white;
    &.single {
      background-color: #49c7ee;
    }
    &.loop {
      background-color: #298df7;
    }
  }
  .signs {
    display: flex;
    display: -webkit-flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    padding: 5px 0;
    margin-left: -0.5%;
    margin-right: -0.5%;
    .status_wrap {
      width: 56px;
      border-radius: 8px 8px 8px 0px;
      height: 24px;
      font-size: 12px;
      margin-left: 8px;
      color: white;
      &.location {
        background: rgba(245, 199, 78, 1);
      }
      &.qrcode {
        background: #1fcbb8;
      }
      &.outside {
        background: #f46c6d;
      }
      > img {
        width: 16px;
        height: 16px;
        position: relative;
      }
    }
    .sign {
      position: relative;
      width: 19%;
      margin: 5px 0.5%;
      padding: 14px 35px 14px 16px;
      background: #ffffff;
      border: 1px solid rgba(63, 81, 181, 0.18);
      border-radius: 4px;
      font-size: 13px;
      color: @defaultTextColor;
      letter-spacing: 0;
      line-height: 18px;
      &.sign-without-icon {
        padding: 14px 16px;
      }
      &.sign-hover:hover {
        cursor: pointer;
      }
      .sign-status-icon {
        cursor: pointer;
        position: absolute;
        top: 0;
        right: 0;
        font-size: 20px;
        line-height: 20px;
        padding: 12px;
        color: @extraMuteTextColor;
        &.delete-sign:hover {
          color: @primaryColor;
        }
      }
      &.sign-success {
        background: #4caf50;
        color: white;
        .sign-status-icon {
          color: white;
        }
      }
      &.sign-failed {
        background: #e0e0e0;
        .sign-status-icon {
          color: @muteTextColor;
        }
      }
    }
    .empty-signs {
      text-align: center;
      width: 100%;
      padding: 10px;
      color: @defaultTextColor;
    }
  }
}
#i-sign {
  .el-collapse,
  .el-collapse-item__wrap {
    border: none;
  }
  .el-collapse-item__wrap {
    overflow: inherit;
  }
  .el-collapse-item__header {
    .el-collapse-item__arrow {
      margin-right: 8px;
      transition: transform 0.3s;
      float: right;
      line-height: 48px;
      font-weight: 300;
      cursor: pointer;
      color: @defaultTextColor;
      font-size: 20px;
      margin-right: 16px;
    }
  }
  .el-collapse-item__content:last-child .el-collapse-item__content:last-child {
    padding-bottom: 0;
  }
}
.empty-categories {
  padding-top: 20px;
  text-align: center;
  color: @defaultTextColor;
}

.show-more {
  text-align: center;
  color: rgba(0, 0, 0, 0.67);
  padding: 10px;
  cursor: pointer;
  line-height: 32px;
}
.page-loading {
  text-align: center;
  width: 100%;
  padding: 10px;
  line-height: 24px;
  color: @defaultTextColor;
}
.loader svg {
  transform: translateY(6px);
  margin-right: 5px;
}

.conditions {
  padding: 10px;
  ul {
    margin: 0;
    list-style: none;
    padding: 0;
    li {
      display: inline-block;
      margin-bottom: 15px;
      label {
        width: 100px;
        text-align: right;
      }
      .v-select {
        .form-control {
          width: 140px;
        }
      }
    }
  }
  .v-select {
    .form-control {
      border: none;
      box-shadow: none;
      outline: none;
      width: 115px;
    }
  }
}
</style>
