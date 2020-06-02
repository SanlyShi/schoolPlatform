<template>
  <div class="unit-salary-manage" v-if="curRouter === 'unitSalaryManageList'">
    <div class v-if="curTable === 'manageTable'">
      <v-table ref="unitTable" :url="unit?`${manageTableUrl}?unitId=${unit}&timeStamp=${manageTimeStamp}`:''" :columns="manageTableColumns" pagesize="10" idField="id" :multiple="false" :order="true" :search="false" key="0">
        <div slot="btn-group" role="group">
          <div class="btn-group pull-left">
            <v-select v-model="unit" placeholder="暂无单位可选" :url="`/api/pwps/units/my`" :required="true" options-value="id" options-label="name"></v-select>
          </div>
          <div class="btn-group pull-right">
            <button type="button" class="btn btn-bgColor-style" @click="_exportUnit()" >导出</button>
            <!-- <button type="button" class="btn blue" @click="curTable = 'worktimeTable'" v-if="unit">切换到工时录入</button> -->
            <!-- <button type="button" class="btn btn-bgColor-style" @click="salarySubmit.modalShow = true;_countSalaryTotal()" v-if="unit">提交薪酬审核</button> -->
          </div>
        </div>
      </v-table>
    </div>
    <v-modal :show="salarySubmit.modalShow" width="1000">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">提交薪酬审核</h5>
      </div>
      <div slot="modal-body" class="modal-body" v-if="salarySubmit.modalShow">
        <v-table :url="unit?`${salarySubmit.tableUrl}?unitId=${unit}&month=${salarySubmit.year}${salarySubmit.month}&timeStamp=${salarySubmit.timeStamp}`:''" :columns="salarySubmit.columns" pagesize="10" idField="id" :multiple="false" :order="true" key="2">
          <div slot="btn-group">
            <div class="btn-group pull-left worktime-month">
              <input class="pull-left year-input" type="text" maxlength="4" placeholder="公元年2018" v-model="salarySubmit.year" @input="_onlyNumber">
              <v-select class="month-select" :autoSelect="false" v-model="salarySubmit.month" :required="true" :options="monthOptions" options-value="id" options-label="name" @afterSelected="_refreshTable(salarySubmit)"></v-select>
            </div>
            <div class="btn-group pull-right">
              <span style="line-height:36px;">总计：{{salarySubmit.total}}元</span>
            </div>
          </div>
        </v-table>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <a type="button" class="btn cancel-btn" @click="salarySubmit.modalShow = false">取消</a>
        <a type="button" class="btn submit-btn" @click="_submitSalary(salarySubmit)">提交</a>
      </div>
    </v-modal>
    <v-modal :show="checkRecord.modalShow" width="1000">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">{{checkRecord.isEdit?'编辑':'查看'}}</h5>
      </div>
      <div slot="modal-body" class="modal-body" v-if="checkRecord.modalShow">
        <div class="tab-div">
          <div
            class="tab"
            :class="checkRecord.viewIndex == 'job' ? 'active' : ''"
            title="岗位视图"
            @click="checkRecord.viewIndex = 'job'"
          >岗位视图</div>
          <div
            class="tab"
            :class="checkRecord.viewIndex == 'member' ? 'active' : ''"
            title="人员视图"
            @click="checkRecord.viewIndex = 'member'"
          >人员视图</div>
        </div>
        <v-table :title="checkRecord.viewIndex === 'job'?'岗位视图':'人员视图'" :url="viewRecord?`${checkRecord.tableUrl[checkRecord.viewIndex]}?incloudAll=true&unitId=${unit}&month=${viewRecord.month}`:''" :columns="checkRecord.columns[checkRecord.viewIndex]" pagesize="10" idField="id" :multiple="false" :order="true" :search="false" key="3">
          <div slot="btn-group">
            <div class="btn-group pull-right">
              <!-- <button type="button" class="btn btn-bgColor-style" @click="checkRecord.viewIndex = (checkRecord.viewIndex === 'job'?'member':'job')">切换视图</button> -->
            </div>
          </div>
        </v-table>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <a type="button" class="btn orangered" @click="checkRecord.modalShow = false">关闭</a>
      </div>
    </v-modal>
  </div>
  <div v-else-if="curRouter === 'editUnit'">
    <button type="button" class="btn back-btn box_flex align_center" style="background:none" @click="curRouter = 'unitSalaryManageList';saveUnitEdit()">
      <!--返回教师列表-->
      <i class="maticon back-icon-btn" v-html="icons('arrow_back')">arrow_back</i><span class="nav-title">返回</span>
    </button>
    <div class="tab-div">
      <div class="tab" :class="hasImport ? 'active' : ''" title="在校生信息" @click="hasImport = true">已导入</div>
      <div class="tab" :class="!hasImport ? 'active' : ''" title="非在校生信息" @click="hasImport = false">未导入</div>
    </div>
    <v-table ref="unitEditTable" :url="unit?`${worktime.tableUrl}?incloudAll=true&isImport=${hasImport}&unitId=${unit}&month=${editParams.month}&timeStamp=${worktime.timeStamp}`:''" :columns="worktime.columns" :needSaveEdit="true" pagesize="10" idField="id" :multiple="false" :order="true" :search="false" key="1">
      <div slot="btn-group">
        <!-- <div class="btn-group pull-left worktime-month">
            <input class="pull-left year-input" type="text" maxlength="4" placeholder="公元年2018" v-model="worktime.year" @input="_onlyNumber">
            <v-select class="month-select" :autoSelect="false" v-model="worktime.month" :required="true" :options="monthOptions" options-value="id" options-label="name" @afterSelected="_refreshTable(worktime)"></v-select>
          </div> -->
        <div class="btn-group pull-right">
          <button type="button" class="btn btn-bgColor-style" @click="_export">导出</button>
          <button type="button" class="btn btn-bgColor-style" @click="curRouter = 'importPage'">批量录入</button>
          <!-- <button type="button" class="btn blue" @click="curTable = 'manageTable'">切换到单位薪酬管理</button> -->
        </div>
      </div>
    </v-table>
    <!-- <div v-if="hasImport" class="box_flex flex_center table-container" style="width:100%;padding:20px;">
      <button class="btn submit-btn" @click="saveUnitEdit" >保存</button>
    </div> -->
    <v-modal :show="worktime.editShow" width="200">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">编辑应发薪酬</h5>
      </div>
      <div slot="modal-body" class="modal-body" v-if="worktime.editRecord">
        <div class="form-group">
          <label>应发薪酬</label><span>应为 {{worktime.editRecord.position.salaryCapMonth}} 内</span>
          <input type="number" min="0" class="form-control" v-model="worktime.editTotal">
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <a type="button" class="btn orangered" @click="worktime.editShow = false">取消</a>
        <a type="button" class="btn orangered" @click="_submitWorkTime">提交</a>
      </div>
    </v-modal>
  </div>
  <v-import class="container-fluid" v-bind="worktime.importParams" :downloadTemplateUrl="`${worktime.downloadTemplateUrl}?unitId=${unit}&month=${worktime.year}${worktime.month}`" @backParentPage="curRouter = 'unitSalaryManageList'" v-else></v-import>
</template>
<script>
import { sAjax, createTime, request } from '../../assets/utils/utils';
export default {
  data: function () {
    return {
      curRouter: 'unitSalaryManageList',
      curTable: 'manageTable',
      editParams: {},
      hasImport: true,
      manageTimeStamp: '',
      worktime: {
        timeStamp: '',
        modalShow: false,
        editShow: false,
        editTotal: 0,
        editRecord: null,
        year: '2018',
        month: '01',
        import: false,
        downloadTemplateUrl: '/pwps/users/template/manHour',
        importParams: { //需要初始化之后才可使用
          parentPageTitle: '',
          needData:'工时录入模板（包含当前搜索结果数据）',
          downloadErrorTemplateUrl: '/pwps/users/excel/error/manHour',
          checkTemplateUrl: '/pwps/users/manHour/excel',
          templateName: '工时录入模板',
          importBtnType: [{
            name: '覆盖导入',
            url: `/pwps/users/manHours`,
            method: 'post',
            isShowBtn: true,
            success: (data) => {
              if (data.state) {
                this._refreshTable(this.worktime)
                this.worktime.import = false
              } else {
                this.$toast(data.message)
              }
            }
          }]
        },
        tableUrl: '/table-data/pwps/salaries/page/byUser',
        columns: []
      },
      salarySubmit: {
        timeStamp: '',
        modalShow: false,
        year: '2018',
        month: '01',
        tableUrl: '/table-data/pwps/salaries/page/forSubmit',
        total: 0,
        columns: [{
          id: 'name',
          title: '姓名',
          className: 'text-left',
          width: 60,
          hidden: false,
          formatter: (record) => {
            return record.user ? record.user.name : ''
          }
        }, {
          id: 'userNo',
          title: '学号',
          className: 'text-left',
          width: 120,
          hidden: false,
          formatter: (record) => {
            return record.user ? record.user.userNo : ''
          }
        }, {
          id: 'userType',
          title: '学生类别',
          className: 'text-left',
          width: 80,
          hidden: false,
          formatter: (record) => {
            return record.user ? record.user.type : ''
          }
        }, {
          id: 'userCollege',
          title: '学院',
          className: 'text-left',
          width: 120,
          hidden: false,
        }, {
          id: 'unit',
          title: '用工单位',
          className: 'text-left',
          width: 100,
          hidden: false,
          formatter: (record) => {
            return (record.position && record.position.unit) ? record.position.unit.name : ''
          }
        }, {
          id: 'positionName',
          title: '岗位名称',
          className: 'text-left',
          width: 80,
          hidden: false,
          formatter: (record) => {
            return record.position ? record.position.positionName : ''
          }
        }, {
          id: 'positionType',
          title: '岗位类型',
          className: 'text-left',
          width: 100,
          hidden: false,
          formatter: (record) => {
            return record.position ? record.position.positionTypeName : ''
          }
        }, {
          id: 'totalPayMount',
          title: '应发薪酬',
          className: 'text-left',
          width: 100,
          hidden: false
        }]
      },
      checkRecord: {
        isEdit: false,
        modalShow: false,
        viewIndex: 'job',
        tableUrl: {
          job: '/table-data/pwps/salaries/page/byPosition',
          member: '/table-data/pwps/salaries/page/byUser'
        },
        columns: {
          job: [{
            id: 'positionName',
            title: '岗位名称',
            className: 'text-left',
            width: 100,
            hidden: false,
            search: {
              type: 'input',
              data: {
                placeholer: '',
                autoFocus: true
              }
            },
            formatter: (record) => {
              return record.position ? record.position.positionName : ''
            }
          }, {
            id: 'positionType',
            title: '岗位类型',
            className: 'text-left',
            width: 100,
            hidden: false,
            search: {
              type: 'select',
              data: {
                url: '/api/system/dicts?dictType=岗位类型',
                optionsLabel: 'label',
                optionsValue: 'value'
              }
            },
            formatter: (record) => {
              return record.position ? record.position.positionTypeName : ''
            }
          }, {
            id: 'month',
            title: '月份',
            className: 'text-left',
            width: 80,
            hidden: false
          }, {
            id: 'grantCount',
            title: '发放人数',
            className: 'text-left',
            width: 100,
            hidden: false
          }, {
            id: 'totalWork',
            title: '岗位总工时上限',
            className: 'text-left',
            width: 100,
            hidden: false,
            formatter: (record) => {
              return record.position.totalWork
            }
          },{
            id: 'realWork',
            title: '岗位实际总工时',
            className: 'text-left',
            width: 100,
            hidden: false,
            formatter: (record) => {
              if(Number(record.position.totalWork&&record.position.realWork)>Number(record.position.totalWork)) {
                return `<span style="color: red">${record.position.realWork}</span>`
              } else {
                return record.position.realWork
              }
            }
          }, {
            id: 'totalPayMount',
            title: '应发放薪酬',
            className: 'text-left',
            width: 100,
            hidden: false
          },{
            id: 'realPayMount',
            title: '实发薪酬',
            className: 'text-left',
            width: 100,
            hidden: false
          }],
          member: [{
            id: 'name',
            title: '姓名',
            className: 'text-left',
            width: 60,
            hidden: false,
            search: {
              type: 'input',
              data: {
                placeholer: '',
                autoFocus: true
              }
            },
            formatter: (record) => {
              return record.user ? record.user.name : ''
            }
          }, {
            id: 'userNo',
            title: '学号',
            className: 'text-left',
            width: 120,
            hidden: false,
            search: {
              type: 'input',
              data: {
                placeholer: '',
                autoFocus: true
              }
            },
            formatter: (record) => {
              return record.user ? record.user.userNo : ''
            }
          }, {
            id: 'positionName',
            title: '岗位名称',
            className: 'text-left',
            width: 100,
            hidden: false,
            search: {
              type: 'input',
              data: {
                placeholer: '',
                autoFocus: true
              }
            },
            formatter: (record) => {
              return record.position ? record.position.positionName : ''
            }
          }, {
            id: 'positionType',
            title: '岗位类型',
            className: 'text-left',
            width: 100,
            hidden: false,
            search: {
              type: 'select',
              data: {
                url: '/api/system/dicts?dictType=岗位类型',
                optionsLabel: 'label',
                optionsValue: 'value'
              }
            },
            formatter: (record) => {
              return record.position ? record.position.positionTypeName : ''
            }
          }, {
            id: 'month',
            title: '月份',
            className: 'text-left',
            width: 80,
            hidden: false,
            search: {
              type: 'input'
            }
          }, {
            id: 'manHour',
            title: '工时',
            className: 'text-left',
            width: 50,
            hidden: false
          }, {
            id: 'rewardStandard',
            title: '薪酬标准',
            className: 'text-left',
            width: 60,
            hidden: false,
            formatter: (record) => {
              var value = parseFloat(record.position ? record.position.rewardStandard : '0').toFixed(2)
              return value
            }
          }, {
            id: 'salaryCapMonth',
            title: '薪酬上限',
            className: 'text-left',
            width: 100,
            hidden: false,
            formatter: (record) => {
              return record.position ? record.position.salaryCapMonth : ''
            }
          }, {
            id: 'totalPayMount',
            title: '应发薪酬',
            className: 'text-left',
            width: 100,
            hidden: false
          }, {
            id: 'realPayMount',
            title: '实发薪酬',
            className: 'text-left',
            width: 100,
            hidden: false
          }]
        }
      },
      batchYear: '', //批次学年值
      yearOptions: [],
      monthOptions: [{
        id: '01', name: '一月'
      }, {
        id: '02', name: '二月'
      }, {
        id: '03', name: '三月'
      }, {
        id: '04', name: '四月'
      }, {
        id: '05', name: '五月'
      }, {
        id: '06', name: '六月'
      }, {
        id: '07', name: '七月'
      }, {
        id: '08', name: '八月'
      }, {
        id: '09', name: '九月'
      }, {
        id: '10', name: '十月'
      }, {
        id: '11', name: '十一月'
      }, {
        id: '12', name: '十二月'
      }],
      uniyOptions: [{
        id: 'unitA',
        name: '单位A'
      }, {
        id: 'unitB',
        name: '单位B'
      }, {
        id: 'unitC',
        name: '单位C'
      }, {
        id: 'unitD',
        name: '单位D'
      }],
      unit: '',
      manageTableUrl: '/table-data/pwps/salaries/page/manage',
      manageTableColumns: [{
        id: 'unitName',
        title: '单位',
        className: 'text-left',
        width: 100,
        hidden: false,
        search: {
          type: 'input',
          data: {
            placeholer: '',
            autoFocus: true
          }
        },
        formatter: (record) => {
          return record.unit ? record.unit.name : ''
        }
      }, {
        id: 'month',
        title: '月份',
        className: 'text-left',
        width: 60,
        hidden: false,
        search: {
          type: 'input'
        },
      }, {
        id: 'grantCount',
        title: '发放人数',
        width: 100,
        className: 'text-left',
        hidden: false
      }, {
        id: 'totalPayMount',
        title: '应发薪酬',
        width: 100,
        className: 'text-left',
        hidden: false
      }, {
        id: 'realPayMount',
        title: '实发薪酬',
        width: 100,
        className: 'text-left',
        hidden: false
      }, {
        id: 'statusLabel',
        title: '审核状态',
        width: 100,
        className: 'text-left',
        hidden: false
      }, {
        id: 'grantStatus',
        title: '是否发放',
        width: 100,
        className: 'text-center',
        hidden: false,
        search: {
          type: 'select',
          data: {
            options: [{ value: 'ALL', label: '全部发放' }, { value: 'PART', label: '部分发放' }, { value: 'NONE', label: '未发放' }],
            optionsLabel: 'label',
            optionsValue: 'value'
          }
        },
        formatter: (record) => {
          return record['grantStatus'] === 'ALL' ? '全部发放' : (record['grantStatus'] === 'PART' ? '部分发放' : '未发放')
        }
      }, {
        id: 'opt',
        title: '操作',
        className: 'text-left',
        width: 150,
        hidden: false,
        formatter: (record) => {
          let actionArr = []
          actionArr.push({
            tag: 'a',
            text: '查看',
            className: 'opt-btn',
            callback: (record, index) => {
              this.checkRecord.isEdit = false
              this.checkRecord.modalShow = true
              this.viewRecord = record
            }
          })
          if (record.status !== 'SUCCESS'&&record.status !== 'PENDING') {//未通过
            actionArr.push({
              tag: 'a',
              text: '编辑',
              className: 'opt-btn',
              callback: (record, index) => {
                this.curRouter = 'editUnit';
                this.editParams = JSON.parse(JSON.stringify(record))
                this.initWorkTableColumn()
                this.worktime.importParams.checkTemplateUrl = '/pwps/users/manHour/excel?id='+record.id
              }
            })
          }
          if (record.status === 'PENDING') {//待审核
            actionArr.push({
              tag: 'a',
              text: '撤回',
              className: 'opt-btn',
              callback: (record, index) => {
                this.recall(record)
              }
            })
          }
          if (record.statusLabel === '未审核') {//未审核
            actionArr.push({
              tag: 'a',
              text: '提交审核',
              className: 'opt-btn',
              callback: (record, index) => {
                this._submitSalary(record)
              }
            })
          }
          if (record.status === 'FAILED'||record.status === 'RESUBMIT') {//不通过
            actionArr.push({
              tag: 'a',
              text: '重新提交',
              className: 'opt-btn',
              callback: (record, index) => {
                this.reSubmit(record)
              }
            })
          }
          return actionArr
        }
      }],
      viewRecord: null,
      rows: [{
        id: 1,
        name: '张三', //姓名
        userNo: '30920122202598', //学号
        grade: '2012', //年级
        unit: '单位A', //单位名称
        month: '一月', //月份
        number: 20, //发放人数
        contact: '18888888888', //联系方式
        college: '软件学院', //学院
        positionName: '兼职辅导员', //岗位名称
        positionType: '文职', //岗位类型
        manHour: 30, //工时
        rewardStandard: 1000, //薪酬
        totalPayMount: 300, //应发薪酬
        realPayMount: 300, //实发薪酬
        totalSalary: 3000, //应发薪酬
        realSalary: 3000, //实发薪酬
        salaryCapMonth: 5000,//薪酬上限
        isGrant: true //是否发放
      }],
    }
  },
  methods: {
    _exportUnit(){
      let tableSearchFields = this.$refs.unitTable.tableSearchFields
      let url = `/downloads/pwps/salaries/excel/manage?incloudAll=true&unitId=${this.unit}&filename=单位薪酬`
      for(let i in tableSearchFields){
        url+=i+'='+tableSearchFields[i]+'&'
      }
      window.location.href = url      
    },
    reSubmit(record){//重新提交 未测试
      let url = `api/pwps/workflow/runtime/salary/${record.instantId}/resubmit`
      request(url,record,'post').then(o=>{
        if(o.state){
          this.$toast('操作成功!')
          this.manageTimeStamp = createTime()
        }else{
          this.$toast(o.message)
        }
      })
    },
    recall(record){//撤回
      let url = `api/pwps/workflow/runtime/salary/${record.id}/revoke`
      request(url,null,'post').then(o=>{
        if(o.state){
          this.$toast('操作成功!')
          this.manageTimeStamp = createTime()
        }else{
          this.$toast(o.message)
        }
      })
    },
    saveUnitEdit() {
      let url = 'api/pwps/salaries/batch/updateSalar'
      let params = []
      for(var i in this.$refs.unitEditTable.newVal){
        this.$refs.unitEditTable.newVal[i].id = i
        params.push(this.$refs.unitEditTable.newVal[i])
      }
      request(url,params).then(o=>{
        if(o.state){
          // this.$toast('编辑成功!')
        }else{
          this.$toast(o.message)
        }
      })
     },
    _onlyNumber: function (e) {
      this.worktime.year = e.target.value.replace(/[^\d]/g, '')
    },
    _refreshTable: function (obj) {
      obj.timeStamp = createTime()
    },
    _submitSalary: function (record) {
      sAjax({
        url: `/api/pwps/salaries/submit/auditing`,
        type: 'post',
        data: {
          unitId: this.unit,
          month: `${record.month}`
        },
        success: (data) => {
          if (data.state) {
            this.$toast('提交审核成功')
            this.salarySubmit.modalShow = false
            this.manageTimeStamp = createTime()
          } else {
            this.$toast(data.message)
          }
        }
      })
    },
    _submitWorkTime: function () {
      sAjax({
        url: `/api/pwps/salaries/${this.worktime.editRecord.id}`,
        type: 'post',
        data: {
          totalPayMount: this.worktime.editTotal
        },
        success: (data) => {
          if (data.state) {
            this.worktime.editShow = false
            this.worktime.editRecord.totalPayMount = this.worktime.editTotal
          } else {
            this.$toast(data.message)
          }
        }
      })
    },
    _countSalaryTotal: function () {
      sAjax({
        url: `/api/pwps/salaries/count/forSubmit`,
        type: 'get',
        data: {
          unitId: this.unit,
          month: `${this.salarySubmit.year}${this.salarySubmit.month}`
        },
        success: (data) => {
          if (data.state) {
            this.salarySubmit.total = data.data || 0
          } else {
            this.$toast(data.message)
          }
        }
      })
    },
    _export: function () {
      var param = this.$refs.unitEditTable.tableSearchFields
      param.month = `${this.worktime.year}${this.worktime.month}`
      param.id = this.editParams.id
      // window.location.href =
      var str = ''
      for (var i in param) {
        str += `&${i}=${param[i]}`
      }
      window.location.href = `/downloads/pwps/salaries/excel/byUser?incloudAll=true&isImport=${this.hasImport}&filename=${param.month}工时录入表${str}`
    },
    initWorkTableColumn(){
      if(this.hasImport){
       this.worktime.columns = [{
          id: 'userName',
          title: '姓名',
          className: 'text-left',
          width: 90,
          hidden: false,
          search: {
            type: 'input',
            data: {
              placeholer: '',
              autoFocus: true
            }
          },
          formatter: (record) => {
            return record.user ? record.user.name : ''
          }
        }, {
          id: 'userNo',
          title: '学号',
          className: 'text-left',
          width: 120,
          hidden: false,
          search: {
            type: 'input',
            data: {
              placeholer: '',
              autoFocus: true
            }
          },
          formatter: (record) => {
            return record.user ? record.user.userNo : ''
          }
        }, {
          id: 'collegeCode',
          title: '学院',
          className: 'text-left',
          width: 120,
          hidden: false,
          search: {
            type: 'select',
            data: {
              url: `/api/colleges`,
              optionsLabel: 'name',
              optionsValue: 'code'
            }
          },
          formatter: (record) => {
            return record.userDetail.collegeName
          }
        }, {
          id: 'grade',
          title: '年级',
          className: 'text-center',
          width: 50,
          hidden: false,
          search: {
            type: 'input',
            data: {
              placeholer: '',
              autoFocus: true
            }
          },
          formatter: (record) => {
            return record.userGrade
          }
        }, {
          id: 'contact',
          title: '联系方式',
          className: 'text-left',
          width: 90,
          hidden: false,
          search: {
            type: 'input',
            data: {
              placeholer: '',
              autoFocus: true
            }
          },
          formatter: (record) => {
            return record.userContact
          }
        }, {
          id: 'positionName',
          title: '岗位名称',
          className: 'text-left',
          width: 100,
          hidden: false,
          search: {
            type: 'input',
            data: {
              placeholer: '',
              autoFocus: true
            }
          },
          formatter: (record) => {
            return record.position ? record.position.positionName : ''
          }
        }, {
          id: 'positionType',
          title: '岗位类型',
          className: 'text-left',
          width: 100,
          hidden: false,
          search: {
            type: 'select',
            data: {
              url: '/api/system/dicts?dictType=岗位类型',
              optionsLabel: 'label',
              optionsValue: 'value'
            }
          },
          formatter: (record) => {
            return record.position ? record.position.positionTypeName : ''
          }
        }, {
          id: 'salaryCapMonth',
          title: '薪酬上限',
          width: 60,
          className: 'text-left',
          hidden: false,
          formatter: (record) => {
            var value = parseFloat(record.position ? record.position.salaryCapMonth : '0').toFixed(2)
            return value
          }
        }, {
          id: 'rewardStandard',
          title: '薪酬标准',
          width: 60,
          className: 'text-left',
          hidden: false,
          formatter: (record) => {
            var value = parseFloat(record.position ? record.position.rewardStandard : '0').toFixed(2)
            return value
          }
        }, {
          id: 'manHour',
          title: '工时',
          width: 40,
          className: 'text-left',
          edit: {
            type: 'number'
          },
          hidden: false
        }, {
          id: 'totalPayMount',
          title: '应发金额',
          className: 'text-left',
          width: 90,
          hidden: false,
          hover: false,
          edit: {
            type: 'number'
          }
        }, {
          id: 'remark',
          title: '备注',
          width: 160,
          className: 'text-left',
          edit: {
            type: 'text'
          },
          hidden: false
        }]
      }else{
        this.worktime.columns = [{
            id: 'userName',
            title: '姓名',
            className: 'text-left',
            width: 90,
            hidden: false,
            search: {
              type: 'input',
              data: {
                placeholer: '',
                autoFocus: true
              }
            },
            formatter: (record) => {
              return record.user ? record.user.name : ''
            }
          }, {
            id: 'userNo',
            title: '学号',
            className: 'text-left',
            width: 120,
            hidden: false,
            search: {
              type: 'input',
              data: {
                placeholer: '',
                autoFocus: true
              }
            },
            formatter: (record) => {
              return record.user ? record.user.userNo : ''
            }
          }, {
            id: 'collegeCode',
            title: '学院',
            className: 'text-left',
            width: 120,
            hidden: false,
            search: {
              type: 'select',
              data: {
                url: `/api/colleges`,
                optionsLabel: 'name',
                optionsValue: 'code'
              }
            },
            formatter: (record) => {
              return record.userCollege
            }
          }, {
            id: 'grade',
            title: '年级',
            className: 'text-center',
            width: 50,
            hidden: false,
            search: {
              type: 'input',
              data: {
                placeholer: '',
                autoFocus: true
              }
            },
            formatter: (record) => {
              return record.userGrade
            }
          }, {
            id: 'contact',
            title: '联系方式',
            className: 'text-left',
            width: 90,
            hidden: false,
            search: {
              type: 'input',
              data: {
                placeholer: '',
                autoFocus: true
              }
            },
            formatter: (record) => {
              return record.userContact
            }
          }, {
            id: 'positionName',
            title: '岗位名称',
            className: 'text-left',
            width: 100,
            hidden: false,
            search: {
              type: 'input',
              data: {
                placeholer: '',
                autoFocus: true
              }
            },
            formatter: (record) => {
              return record.position ? record.position.positionName : ''
            }
          }, {
            id: 'positionType',
            title: '岗位类型',
            className: 'text-left',
            width: 100,
            hidden: false,
            search: {
              type: 'select',
              data: {
                url: '/api/system/dicts?dictType=岗位类型',
                optionsLabel: 'label',
                optionsValue: 'value'
              }
            },
            formatter: (record) => {
              return record.position ? record.position.positionTypeName : ''
            }
          }, {
            id: 'salaryCapMonth',
            title: '薪酬上限',
            width: 60,
            className: 'text-left',
            hidden: false,
            formatter: (record) => {
              var value = parseFloat(record.position ? record.position.salaryCapMonth : '0').toFixed(2)
              return value
            }
          }, {
            id: 'rewardStandard',
            title: '薪酬标准',
            width: 60,
            className: 'text-left',
            hidden: false,
            formatter: (record) => {
              var value = parseFloat(record.position ? record.position.rewardStandard : '0').toFixed(2)
              return value
            }
          }, {
            id: 'manHour',
            title: '工时',
            width: 40,
            className: 'text-left',
            edit: {
              type: 'number'
            },
            hidden: false
          }, {
            id: 'totalPayMount',
            title: '应发金额',
            className: 'text-left',
            width: 90,
            hidden: false,
            hover: false,
            edit: {
              type: 'number'
            }
            // formatter: (record) => {
            //   var value1 = parseFloat(record.position.salaryCapMonth)
            //   var value2 = parseFloat(record.totalPayMount)
            //   var value = value2.toFixed(2)
            //   if (value2 - value1 > 1e-6) {
            //     return `<span style="color: orangered;" title="${value}">${value}</span>`
            //   }
            //   return `<span title="${value}">${value}</span>`
            // }
          }, {
            id: 'remark',
            title: '备注',
            width: 160,
            className: 'text-left',
            edit: {
              type: 'text'
            },
            hidden: false
          }, {
            id: 'opt',
            title: '操作',
            className: 'text-left',
            width: 40,
            hidden: false,
            formatter: (record) => {
              var opts = []
              if (record.position && record.position.salaryCapMonth && record.totalPayMount) {
                var value1 = parseFloat(record.position.salaryCapMonth)
                var value2 = parseFloat(record.totalPayMount)
                opts.push({
                    tag: 'a',
                    text: '编辑1',
                    callback: (record, index) => {
                      this.worktime.editShow = true
                      this.worktime.editRecord = record
                      this.worktime.editTotal = record.totalPayMount
                      this.worktime.importParams.checkTemplateUrl = '/pwps/users/manHour/excel?id='+record.id
                    }
                  })
              }
              return opts
            }
          }]
      }
    }
  },
  watch:{
    hasImport(newVal){
      this.initWorkTableColumn()
    },
  },
  created: function () {
    var today = new Date()
    var year = today.getFullYear()
    var month = today.getMonth() + 1
    this.yearOptions = []
    for (var i = year - 2; i < year + 8; i++) {
      this.yearOptions.push({
        id: `${i}-${i + 1}学年`,
        name: `${i}-${i + 1}学年`
      })
    }
    this.worktime.year = year
    this.worktime.month = month
    this.salarySubmit.year = year
    this.salarySubmit.month = month
  }
}
</script>
<style lang="less">
.unit-salary-manage {
  .container {
    width: 100%;
  }
  .btn {
    border: none;
    box-shadow: none;
    outline: none;
    background: transparent;
  }
  .blue {
    // color: #fff;
    // background: #298df7;
  }
  .orangered {
    // color: #fff;
    // background: orangered;
  }
  .green {
    // color: #fff;
    // background: rgb(91, 204, 91);
  }
  .worktime-month {
    border: 1px solid #e0e0e0;
    border-radius: 3px;
    .year-input {
      width: 52px;
      padding: 6px 10px;
      text-align: right;
      border: none;
      box-shadow: none;
      outline: none;
    }
    .month-select {
      color: #666;
    }
  }
  .import-cover {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
    background: #fff;
    #batchSet-page {
      width: 100%;
      height: 100%;
      padding-top: 20px;
    }
  }
  .modal-body {
    padding: 0 12px;
    .table-container {
      box-shadow: none;
    }
  }
}
</style>
