<template>
  <div id="party-train-manage" class="container-fluid" v-if="isParentPage">
    <div class="tab-div" v-if="check">
      <div class="tab" v-for="item in orgnizationRelationArray" :title="item.label" :class="(partytab == item.value)  ? 'active' : ''" @click="setTab(item.value)">{{item.label}}</div>
    </div>
    <v-table :columns='columns' :searchParams="definedSearch" :url="url" idField="id" :search="false" ref="partyTrainTable" pagesize=10 order='true' v-if="check" :columnsControl="true">
      <div slot="btn-group" role="group">
        <div class="btn-group pull-right">
          <button type="button" class="btn btn-bgColor-style clearBtnBorder" @click="batchSet">批量编辑</button>
          <button type="button" class="btn btn-bgColor-style clearBtnBorder" @click="exportStat">导出</button>
        </div>
      </div>
    </v-table>

    <div class="box-wrap" v-if="!check">
      <div class="title-div">
        <button type="button" class="btn back-btn clearBtnBorder btnclass" @click="_backList">
          <i class="maticon back-icon-btn" v-html="icons('arrow_back')">arrow_back</i>
          <span class="nav-title">返回党员管理</span>
        </button>
      </div>
      <p style="font-weight:600;padding-left:10px">基本信息：</p>
      <div class="item" v-for="(item,index) in fieldArr" v-if="index <=10">
        <p>{{item.name}}</p>
        <p>
          <input type="text" class="form-control" disabled="true" v-model="fieldArr[index].value">
          <!-- <v-select id="sele" v-else class="btn-block search-select" :options="orgnazationArr" :value="fieldArr[13].value" options-value="value" options-label="label" @afterSelected="orgnazationSelected" search></v-select> -->
        </p>
      </div>
      <p style="font-weight:600;padding-left:10px">入党信息：</p>
      <div class="item" v-for="(item,index) in fieldArr" v-if="index >10">
        <p>{{item.name}}</p>
        <p>
          <input type="text" v-if="index !== 14" class="form-control" disabled="true" v-model="fieldArr[index].value">
          <v-select id="sele" v-else class="btn-block search-select" :options="orgnizationRelationArray" :value="fieldArr[14].value" options-value="value" options-label="label" @afterSelected="orgnazationSelected"></v-select>
        </p>
      </div>
    </div>

  </div>
  <v-import v-bind="importParams" :checkTemplateUrl="checkTemplateUrl" @backParentPage="backParentPage" v-else></v-import>
</template>
<script>
import { sAjax } from "../../assets/utils/utils.js";
export default {
  props: {
    role: ""
  },
  data() {
    return {
      // VALUE:11,
      orgnizationRelationArray: null,
      userId: "",
      isParentPage: true,
      checkTemplateUrl: "/partyMember/excel/check",
      orgnazationCode: 0,
      orgnazationArr: [{ "id": 24699295, "label": "组织关系在校", "value": "11", "sort": 1 }, { "id": 24699297, "label": "组织关系已转出", "value": "12", "sort": 1 }, { "id": 24699299, "label": "组织关系未转入", "value": "13", "sort": 1 }],
      partytab: this.orgnizationRelationArray ? this.orgnizationRelationArray[0].value : "",
       definedSearch: {
        userNo: "",
        name: "",
        college: "",
        educationLevel: '',
        className: "",
        grade: "",
        schoolStatus: "",
        politicalStatus: '',
        organizationName: undefined,
        nation: '',
        sex: '',
        originPlace: '',
      },
      fieldArr: [
        {
          name: "姓名",
          value: ""
        },
        {
          name: "学号",
          value: ""
        },
        {
          name: "性别",
          value: ""
        },
        {
          name: "民族",
          value: ""
        },
        {
          name: "年级",
          value: ""
        },
        {
          name: "班级",
          value: ""
        },
        {
          name: "学院",
          value: ""
        },
        {
          name: "专业",
          value: ""
        },
        {
          name: "培养层次",
          value: ""
        },
        {
          name: "生源地",
          value: ""
        },
        {
          name: "出生日期",
          value: ""
        },
        {
          name: "政治面貌",
          value: ""
        },
        {
          name: "发展入党的党组织",
          value: ""
        },
        {
          name: "所属党组织",
          value: ""
        },
        {
          name: "组织关系",
          value: ""
        },
        {
          name: "申请入党日期",
          value: ""
        },
        {
          name: "入党日期",
          value: ""
        },
        {
          name: "转正日期",
          value: ""
        }
      ],
      check: true,
      columns: "",
      url: "/table-data/partyMember/page/" + this.role + "/" + this.partytab,
      importParams: {
        parentPageTitle: '党员管理',
        downloadTemplateUrl: '/partyMember/excel/template',
        downloadErrorTemplateUrl: '/partyMember/excel/errorExcels',
        templateName: '党员管理批量编辑模板.xlsx',
        importBtnType: [{
          name: "党员管理批量编辑.xlsx",
          url: '/partyMember/import',
          method: 'post',
          isShowBtn: true,
          success: (data) => {
            if (data.state) {
              this.url = this.url + '?timestamp=' + new Date().getTime()
            }
          }
        }]
      },
    }
  },
  created() {
    // console.log(this.role)
    sAjax({
      url: '/api/system/dicts?dictType=组织关系',
      type: 'get',
      async: false,
      success: data => {
        this.orgnizationRelationArray = data.data
      }
    })
    this.setTab(this.orgnizationRelationArray[0].value);
    let year = new Date().getFullYear()
    let years = []
    for (var i = 0; i < 10; i++) {
      let a = year - i
      years.push({
        label: a + '',
        value: a + ''
      })
    }
    this.columns = [{
      id: 'userNo',
      title: '学号',
      className: 'text-left',
      width: 130,
      hidden: false,
      search: {
        type: "input",
        data: {
          placeholder: "学号"
        }
      }
    }, {
      id: 'name',
      title: '姓名',
      className: 'text-left',
      width: 150,
      hidden: false,
      search: {
        type: "input",
        data: {
          placeholder: "姓名"
        }
      }
    }, {
      id: 'college',
      title: '学院名称',
      width: 150,
      className: 'text-left',
      hidden: false,
      search: {
        type: "select",
        data: {
          url: '/api/partyBuild/organizations/manage/college/options',
          optionsLabel: 'text',
          optionsValue: 'id',
          placeholder: ""
        }
      },
    },
    {
      id: 'educationLevel',
      title: '培养层次',
      width: 150,
      className: 'text-left',
      hidden: false,
      search: {
        type: "select",
        data: {
          url: '/api/system/dicts?dictType=培养层次',
          optionsLabel: 'label',
          optionsValue: 'value',
          placeholder: ""
        }
      }
    },
    {
      id: 'grade',
      title: '年级',
      width: 150,
      className: 'text-left',
      hidden: false,
      search: {
        type: "select",
        data: {
          options: years,
          optionsLabel: 'label',
          optionsValue: 'value',
          placeholder: ""
        }
      }
    },
    {
      id: 'className',
      title: '班级',
      className: 'text-left',
      hidden: false,
      width: 130,
      search: {
        type: "input",
        data: {
          placeholder: "班级"
        }
      }
    },
    {
      id: 'schoolStatus',
      title: '当前状态',
      className: 'text-left',
      hidden: false,
      width: 130,
      search: {
        type: "select",
        data: {
          url: '/api/system/dicts?dictType=在校状态',
          optionsLabel: 'label',
          optionsValue: 'value',
          placeholder: ""
        },
      }
    },
    {
      id: 'politicalStatus',
      title: '政治面貌',
      width: 150,
      className: 'text-left',
      hidden: false,
      search: {
        type: "select",
        data: {
          url: '/api/system/dicts?dictType=政治面貌',
          optionsLabel: 'label',
          optionsValue: 'value',
          placeholder: ""
        }
      }
    },
    {
      id: 'organizationName',
      title: '所属党组织',
      width: 150,
      className: 'text-left',
      hidden: false,
      formatter: function (record, index) {
        if (record.partyBuildOrganization) {
          return record.partyBuildOrganization.name
        }
        else {
          return ""
        }
      },
      search: {
        type: "input",
        data: {
          placeholder: "所属党组织"
        }
      }
    },
    {
      id: 'nation',
      title: '民族',
      width: 150,
      className: 'text-left',
      hidden: true,
      search: {
        type: "select",
        data: {
          url: '/api/system/dicts?dictType=民族',
          optionsLabel: 'label',
          optionsValue: 'value',
          placeholder: ""
        },
      }
    },
    {
      id: 'sex',
      title: '性别',
      width: 150,
      className: 'text-left',
      hidden: true,
      search: {
        type: "select",
        data: {
          url: '/api/system/dicts?dictType=性别',
          optionsLabel: 'label',
          optionsValue: 'value',
          placeholder: ""
        }
      }
    },
    
    {
      id: 'originPlace',
      title: '生源地',
      width: 150,
      className: 'text-left',
      hidden: true,
      search: {
        type: "input",
        data: {
          placeholder: "生源地"
        }
      }
    },
    {
      id: 'opt',
      className: 'text-left',
      title: '操作',
      width: 50,
      hidden: false,
      formatter: () => {
        return [{
          tag: 'a',
          text: '编辑',
          className: 'opt-btn',
          callback: (record, index) => {
            var that = this
            this.userId = record.userId
            sAjax({
              url: '/api/document/students/baseStatusOrganizationInfo/' + record.userId,
              type: 'get',
              async: false,
              success: data => {
                that.fieldArr[0].value = data.data.name
                that.fieldArr[1].value = record.userNo
                that.fieldArr[2].value = record.sex
                that.fieldArr[3].value = data.data.nation
                that.fieldArr[4].value = data.data.grade
                that.fieldArr[5].value = data.data.className
                that.fieldArr[6].value = data.data.college
                that.fieldArr[7].value = data.data.major
                that.fieldArr[8].value = data.data.educationLevel
                that.fieldArr[9].value = data.data.originPlace
                that.fieldArr[10].value = record.birthday
                that.fieldArr[11].value = data.data.politicalStatus
                that.fieldArr[12].value = data.data.studentPartyBuildInfo ? data.data.studentPartyBuildInfo.recommendPartyOrganizations : ""
                that.fieldArr[13].value = data.data.partyBuildOrganization ? data.data.partyBuildOrganization.name : ""
                if (data.data.organizationRelationship) {
                  that.fieldArr[14].value = data.data.organizationRelationship
                }
                else {
                  that.fieldArr[14].value = ""
                }
                that.fieldArr[15].value = data.data.studentPartyBuildInfo ? data.data.studentPartyBuildInfo.applyTime : ""
                that.fieldArr[16].value = data.data.studentPartyBuildInfo ? data.data.studentPartyBuildInfo.joinTime : ""
                that.fieldArr[17].value = data.data.studentPartyBuildInfo ? data.data.studentPartyBuildInfo.correctionTime : ""
              }
            })
            this.check = false
          }
        }]
      }
    }]
  },
  methods: {
    orgnazationSelected(obj) {
      console.log(obj.value)
      if (obj.value) {
        if (obj.value != this.fieldArr[14].value) {
          sAjax({
            url: '/api/document/students/organizationRelationship/' + this.userId + "?organizationRelationship=" + obj.value,
            type: 'post',
            async: false,
            success: data => {
              this.$toast("修改组织关系成功！")
            }
          })
        }
        this.fieldArr[14].value = obj.value
      }
      else {
        this.$toast("只能切换，不能取消哦！")
      }
    },
    batchSet: function () {
      // console.log("哈哈")
      this.isParentPage = false
    },
    backParentPage: function () {
      this.isParentPage = true
    },
    setTab(item) {
      this.partytab = item;
      this.orgnazationCode = item
      this.url = "/table-data/partyMember/page/" + this.role + "/" + this.orgnazationCode
    },
    _backList() {
      this.check = true
    },
    exportStat() {
      let url = "/downloads/partyMember/excels/" + this.role + "/" + this.orgnazationCode
      let params = this.$refs.partyTrainTable.tableSearchFields
      let hasParams = false
      let str = ''
      for(let k in params) {
        if(params[k]) {
          hasParams = true
          str +=  k+ '=' + params[k]  +'&'
        }
      }
      if(hasParams) url = url +'?' + str
      
      window.location.href = url
    }
  }

}
</script>
<style lang="less" >
#party-train-manage {
  #sele {
    .form-control {
      background: #fff !important;
    }
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
  .box-wrap {
    .title-div {
      padding: 20px 5px;
    }
    width: 100%;
    background-color: #fff;
    height: 800px;
    .item {
      display: inline-block;
      padding: 10px 10px;
      width: 25%;
    }
  }
  .btnclass {
    padding: 0;
  }
  .form-control {
    width: 80%;
    background: #fff;
  }
  .back-icon-btn {
    font-size: 20px;
    line-height: 20px;
    cursor: pointer;
    vertical-align: text-bottom;
  }
}
</style>


