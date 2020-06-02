<template>
  <div id="party-train-manage" class="container-fluid">
    <v-table :columns='columns' :url="url" idField="id" :search="true" ref="partyTrainTable" pagesize=10 order='true' v-if="check" :columnsControl="true">
      <div slot="btn-group" role="group">
        <div class="btn-group pull-right">
          <button type="button" class="btn btn-bgColor-style clearBtnBorder" @click="exportStat">导出</button>
        </div>
      </div>
    </v-table>

    <div class="box-wrap" v-if="!check">
      <div class="title-div">
        <button type="button" class="btn back-btn clearBtnBorder btnclass" @click="_backList">
          <i class="maticon back-icon-btn" v-html="icons('arrow_back')">arrow_back</i>
          <span class="nav-title">返回培养发展管理</span>
        </button>
      </div>
      <p style="font-weight:600;padding-left:10px">基本信息：</p>
      <div class="item" v-for="(item,index) in fieldArr" v-if="index <=10">
        <p>{{item.name}}</p>
        <p><input type="text" class="form-control" disabled="true" v-model="fieldArr[index].value"></p>
      </div>
      <p style="font-weight:600;padding-left:10px">入党信息：</p>
      <div class="item" v-for="(item,index) in fieldArr" v-if="index >10">
        <p>{{item.name}}</p>
        <p><input type="text" class="form-control" disabled="true" v-model="fieldArr[index].value"></p>
      </div>
    </div>

  </div>
</template>
<script>
import { sAjax } from "../../assets/utils/utils.js";
export default {
  props: {
    role: ""
  },
  data() {
    return {
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
          name: "培养发展阶段",
          value: ""
        },
        {
          name: "所属党组织",
          value: ""
        },
        {
          name: "申请入党日期",
          value: ""
        }
      ],
      check: true,
      columns: "",
      url: "/table-data/trainingDevelopment/page/" + this.role
    }
  },
  created() {
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
      }
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
      className: 'text-left',
      hidden: false,
      width: 130,
      search: {
       type: "select",
        data: {
          options: years,
          optionsLabel: 'label',
          optionsValue: 'value',
          placeholder: ""
        }
      }
    }, {
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
      },
      formatter:(record)=>{
        return record.className
      }
    }, {
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
    }, {
      id: 'politicalStatus',
      title: '政治面貌',
      className: 'text-left',
      hidden: false,
      width: 130,
      search: {
        type: "select",
        data: {
          url: '/api/system/dicts?dictType=政治面貌',
          optionsLabel: 'label',
          optionsValue: 'value',
          placeholder: ""
        }
      }
    }, {
      id: 'trainingAndDevelopmentStage',
      title: '培养发展阶段',
      className: 'text-left',
      hidden: false,
      width: 130,
      search: {
        type: "select",
        data: {
          url: '/api/system/dicts?dictType=培养发展阶段',
          optionsLabel: 'label',
          optionsValue: 'value',
          placeholder: ""
        }
      }
    }, {
      id: 'organizationName',
      title: '所属党组织',
      className: 'text-left',
      hidden: false,
      width: 130,
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
    }, {
      id: 'nation',
      title: '民族',
      className: 'text-left',
      hidden: true,
      width: 130,
      search: {
        type: "select",
        data: {
          url: '/api/system/dicts?dictType=民族',
          optionsLabel: 'label',
          optionsValue: 'value',
          placeholder: ""
        },
      }
    }, {
      id: 'sex',
      title: '性别',
      className: 'text-left',
      hidden: true,
      width: 130,
      search: {
        type: "select",
        data: {
          url: '/api/system/dicts?dictType=性别',
          optionsLabel: 'label',
          optionsValue: 'value',
          placeholder: ""
        }
      }
    }, {
      id: 'birthday',
      title: '出生日期',
      className: 'text-left',
      hidden: true,
      width: 130,
      // search: {
      //   type: "input",
      //   data: {
      //     placeholder: "出生日期"
      //   }
      // },
      formatter:(record)=>{
        return record.birthday.substring(0,10)

      }
    }, {
      id: 'originPlace',
      title: '生源地',
      className: 'text-left',
      hidden: true,
      width: 130,
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
          text: '查看',
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
                that.fieldArr[12].value = record.trainingAndDevelopmentStage
                that.fieldArr[13].value = data.data.partyBuildOrganization?data.data.partyBuildOrganization.name:""
                that.fieldArr[14].value = data.data.studentPartyBuildInfo?data.data.studentPartyBuildInfo.applyTime:""

              }
            })
            this.check = false




          }
        }]
      }
    }]
  },
  methods: {
    _backList() {
      this.check = true
    },
    exportStat() {
      window.location.href = "/downloads//trainingDevelopment/excels/" + this.role
    }
  }

}
</script>
<style lang="less" >
#party-train-manage {
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


