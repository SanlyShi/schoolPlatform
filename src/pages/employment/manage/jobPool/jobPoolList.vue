<template>
    <div id="jobPoolList" >
        <v-table
        :url="tableDataUrl"
        :columns="columns"
        ref='poollIst'
        idField="id"
        pagesize="15"
        :search="false"
        :order="true"
        :columnsControl="true"
         v-if='currentPage == "table"'
      >

        <div slot="btn-group" class="pull-right">
            <el-button
                class="custom-btn"
                type="primary"
                v-if="loginType.loginType !='COMPANY'"
                @click="changeUnitView"
            >{{isUnitView?'切换至职位维度':'切换至单位维度'}}</el-button>
            <el-button
                class="custom-btn"
                type="primary"
                 v-if="loginType.loginType !='COMPANY'"
                 @click='toImport'
            >批量导入</el-button>
            <el-button
                class="custom-btn"
                type="primary"
                @click="addPositon"
            >新增职位</el-button>
        </div>
        </v-table>

        <position v-if="showDialog" :saveToJobPool='false' :showDialog='showDialog'  @closeDialog='showDialog = false' :defaultFormInfo='defaultFormInfo'  @positionSubmit='positionSubmit'></position>
         <!-- 批量添加模板页    包括组织成员信息的批量添加模板页 -->
   
        <el-dialog
          title="选择单位"
          :visible.sync="showUnitList"
          width="30%">
          <el-select  :disabled='status == "0"' placeholder='请选择或输入公司名称' v-model="companyId" filterable  style="width: 100%;">
              <el-option v-for="(item,index) in unitList" :key="index" :label='item.companyName' :value='item.id'>

              </el-option>
            </el-select>
          <span slot="footer" class="dialog-footer">
            <el-button @click="showUnitList = false">取 消</el-button>
            <el-button type="primary" @click="showUnitList = false;showDialog = true">确 定</el-button>
          </span>
        </el-dialog>
    <v-import v-bind="importParams" @backParentPage="importPageBack" v-if=" currentPage === 'importPage'"></v-import>
    </div>
</template>
<script>
import position from '../../components/position'
import {getLoginType} from '../../api/techin/api.js'
import {getUnitList} from '../../api/api.js'
import { sAjax } from '../../../../assets/utils/utils';
export default {
    components: {
        position
    },
    watch: {
    },
    data() {
        return {
            tableDataUrl: '/table-data/employment/positionTemplate/getPositionTemplateList?timeStamp=' + new Date().getTime(),
            columns: [],
            showDialog: false,
            defaultFormInfo: null,
            isEditPosition: true,
            newPosition: false,//是否是新增模板
            loginType: {},
            isUnitView: false,//当前视图是否是单位维度视图
            importParams: {},    //批量添加模板页参数
            currentPage:'table',
            showUnitList: false,
            companyId:'',
            unitList: [],
            
        }
    },
    methods: {
      changeUnitView() {
        this.isUnitView = !this.isUnitView
        if(!this.isUnitView) {   // 单位维度
            this.setTableUrl(this.loginType.loginType)
             this.setColumns(this.loginType.loginType)
        }else {
          this.tableDataUrl = `/table-data/employment/manage/positionTemplate/getPositionTemplateList?timeStamp=${new Date().getTime()}`
          this.columns = [{
            id: "companyName",
            title: "单位名称",
            className: "text-left",
            width: 250,
            hidden: false
          },{
            id: "positionName",
            title: "职位",
            className: "text-left",
            width: 300,
            hidden: false,
            formatter: (record) => {
              let arr = []
              if(record.positionTemplates&&record.positionTemplates.length) {
                for(let i = 0;i<record.positionTemplates.length;i++) {
                  arr.push(record.positionTemplates[i].positionName)
                }
                return arr.join(',')
              }else {
                return '暂无职位'
              }
            }
          },{
            id: "recruitNumberTotal",
            title: "招聘人数",
            className: "text-left",
            width: 100,
            hidden: false
          },{
            id: "opts",
            title: "操作",
            width: 50,
            hidden: false,
            formatter: (record) => {
              return [{
                tag: 'a',
                text: '查看',
                callback: (record, index) => {
                  let unitName = record.companyName
                   this.setColumns(this.loginType.loginType)
                  this.tableDataUrl =  `/table-data/employment/positionTemplate/getPositionTemplateList?timeStamp=${new Date().getTime()}&companyName=${unitName}`
                  this.isUnitView = false
                }
              }]
            }}]
        }
      },
      importPageBack() {   //批量添加返回上一页面
        this.currentPage = 'table'
      },
      toImport() {
        this.currentPage = 'importPage'
        this.importParams = {
          parentPageTitle: '职位库',
          downloadTemplateUrl: '/employment/manage/positionTemplate/template',
          downloadErrorTemplateUrl: '/employment/manage/positionTemplate/errorFile',
          checkTemplateUrl: '/employment/manage/positionTemplate/checkExcel',
          templateName: '批量新增职位模板',
          importBtnType: [{
            name: '覆盖导入',
            url: '/employment/manage/positionTemplate/addByExcel	',
            method: 'post',
            isShowBtn: true,
            success: (data) => {
              if (data.state) {
                this.setTableUrl()
              }
            }
          }]
        }
      },
      catchLoginType() {
        getLoginType().then(data => {
          this.loginType = data
          this.setTableUrl(data.loginType)
          this.setColumns(data.loginType)
        })
      },
      setTableUrl(loginType) {
        this.tableDataUrl = '/table-data/employment/positionTemplate/getPositionTemplateList?timeStamp=' + new Date().getTime()
        
      },
      positionSubmit(info) {
        let url,msg
        console.log(info)
        if(this.newPosition) {
          url = '/api/employment/positionTemplate/addPositionTemplate'
        }else {
          url = '/api/employment/positionTemplate/updatePositionTemplate'
        }
        if(this.loginType.loginType != 'COMPANY') {
          info.companyId = this.companyId
        }
        sAjax({
          url: url,
          type:'post',
          data: info,
          success: (data) => {
            if(data.state) {
              this.setTableUrl(this.loginType.loginType)
              this.showDialog = false
            }else {
              this.setTableUrl(this.loginType.loginType)
              this.$message.error(data.message)
              this.showDialog = false
            }
            this.companyId = ''
          }
        })

      },
      setColumns(type) {
        // 单位？
        if(type == 'COMPANY') {
          this.columns = [{
            id: "positionName",
            title: "职位名称",
            className: "text-left",
            width: 150,
            hidden: false,
            search: {
              type: "input",
              data: {
                placeholer: "",
                autoFocus: false
              }
            }
          },{
            id: "positionTypeName",
            title: "职位类别",
            className: "text-left",
            width: 100,
            hidden: true,
            search: {
              type: "input",
              data: {
                placeholer: "",
                autoFocus: false
              }
            }
          },{
            id: "positionProperty",
            title: "职位性质",
            className: "text-left",
            width: 100,
            hidden: false,
            search: {
              type: "select",
              data: {
                optionsLabel: 'label',
                optionsValue: 'value',
                options:[{label:'实习',value:'PRACTICE'},{label:'全职',value:'FULL_TIME'}],
                placeholer: "",
                autoFocus: false
              }
            },
            formatter: (record) => {
              if(record.positionProperty == 'PRACTICE') {
                return '实习'
              }else {
                return '全职'
              }
            }
          },{
            id: "diploma",
            title: "学历要求",
            className: "text-left",
            width: 150,
            hidden: false,
            search: {
              type: "select",
              data: {
                optionsLabel: 'label',
                optionsValue: 'value',
                options:[{label:'专科及以下',value:'1'},{label:'大学本科',value:'2'},{label:'硕士研究生',value:'3'},{label:'博士研究生',value:'4'}],
                placeholer: "",
                autoFocus: false
              }
            },
            formatter: (record) => {
              return record.diplomaName
            }
          },{
            id: "major",
            title: "专业要求",
            className: "text-left",
            width: 80,
            hidden: true,
            search: {
              type: "select",
              data: {
                optionsLabel: 'label',
                optionsValue: 'value',
                options:[{label:'专业不限',value:''},{label:'测试',value:'1558337668735'},{label:'教育专业',value:'20500001'},{label:'法语专业',value:'20800001'},{label:'新闻传播专业',value:'22300001'}],
                placeholer: "",
                autoFocus: false
              }
            },
            formatter: (record) => {
              return record.majorName
            }
          },{
            id: "salary",
            title: "薪资范围",
            className: "text-left",
            width:  100,
            hidden: true,
            search: {
              type: "select",
              data: {
                optionsLabel: 'label',
                optionsValue: 'value',
                options:[{label:'面谈',value:'1'},{label:'2000以下',value:'2'},{label:'2000-4000',value:'3'},{label:'4000-6000',value:'4'},{label:'6000-8000',value:'5'},{label:'8000-10000',value:'6'},{label:'10000-15000',value:'7'},{label:'15000以上',value:'8'}],
                placeholer: "",
                autoFocus: false
              }
            },
            formatter: (record) => {
              return record.salaryName
            }

          },{
            id: "number",
            title: "招聘人数",
            className: "text-left",
            width: 80,
            hidden: false,
            search: {
              type: "select",
              data: {
                optionsLabel: 'label',
                optionsValue: 'label',
                options:[{label:'1-5'},{label:'5-10'},{label:'10-30'},{label:'30-50'},{label:'50-70'},{label:'70-90'},{label:'90以上'}],
                placeholer: "",
                autoFocus: false,
                change: ({ value, target }) => {
                  let arr = value.split('-')
                  if(arr.length != 1) {
                    let min = arr[0]
                    let max = arr[1]
                    this.tableDataUrl = `/table-data/employment/positionTemplate/getPositionTemplateList?timeStamp=${new Date().getTime()}&minRecruitNumber=${min}&maxRecruitNumber=${max}`
                  }else {
                    let min = 90
                     this.tableDataUrl = `/table-data/employment/positionTemplate/getPositionTemplateList?timeStamp=${new Date().getTime()}&minRecruitNumber=${min}`
                  }
                  //  this.tableDataUrl = `/table-data/employment/positionTemplate/getPositionTemplateList?timeStamp=${new Date().getTime()}&beginTime=${this.$refs.teachList.tableSearchFields['timeSpace_start']}&endTime=${this.$refs.teachList.tableSearchFields['timeSpace_end']}`
                   
                  }
              }
            },
            formatter: (record) => {
              return record.recruitNumber
            }
          },{
            id: "workplaceName",
            title: "工作地点",
            className: "text-left",
            width:  150,
            hidden: true,
            search: {
              type: "input",
              data: {
                placeholer: "",
                autoFocus: false
              }
            }
          },{
            id: "positionRemarks",
            title: "工作职责",
            className: "text-left",
            width:  150,
            hidden: true,
            search: {
              type: "input",
              data: {
                placeholer: "",
                autoFocus: false
              }
            }
          },{
            id: "positionRequire",
            title: "工作要求",
            className: "text-left",
            width:  150,
            hidden: true,
            search: {
              type: "input",
              data: {
                placeholer: "",
                autoFocus: false
              }
            }
          },{
            id: "createTime",
            title: "发布时间",
            className: "text-left",
            width: 150,
            hidden: false,
          },{
            id: "opts",
            title: "操作",
            width: 50,
            hidden: false,
            formatter: (record) => {
              return [{
                tag: 'a',
                text: '查看',
                callback: (record, index) => {
                  this.newPosition = false
                  this.defaultFormInfo = record
                  this.isEditPosition = false
                  this.showDialog = true
                }
              }, {
                tag: 'a',
                text: '删除',
                callback: (record, index) => {
                  this.$confirm('是否删除该模板?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    let url = '/api/employment/positionTemplate/deletePositionTemplate?id=' + record.id
                    sAjax({
                      url: url,
                      type: 'post',
                      success: (data) => {
                        if(data.state)  {
                          this.setTableUrl(this.loginType.loginType)
                          this.$message({
                            type: 'success',
                            message: '删除成功!'
                          });
                        }else{
                           this.$message({
                            type: 'error',
                            message: '删除失败'
                          });
                        }
                      }
                    })
                  })
                }
              }]
            }

          }]
        }else {
          // 管理员
          this.columns = [{
            id: "positionName",
            title: "职位名称",
            className: "text-left",
            width: 150,
            hidden: false,
            search: {
              type: "input",
              data: {
                placeholer: "",
                autoFocus: false
              }
            }
          },{
            id: "companyName",
            title: "单位名称",
            className: "text-left",
            width: 100,
            hidden: false,
          },{
            id: "positionTypeName",
            title: "职位类别",
            className: "text-left",
            width: 100,
            hidden: true,
            search: {
              type: "input",
              data: {
                placeholer: "",
                autoFocus: false
              }
            }
          },{
            id: "diploma",
            title: "学历要求",
            className: "text-left",
            width: 150,
            hidden: false,
            search: {
              type: "select",
              data: {
                optionsLabel: 'label',
                optionsValue: 'value',
                options:[{label:'专科及以下',value:'1'},{label:'大学本科',value:'2'},{label:'硕士研究生',value:'3'},{label:'博士研究生',value:'4'}],
                placeholer: "",
                autoFocus: false
              }
            },
            formatter: (record) => {
              return record.diplomaName
            }
          },{
            id: "positionProperty",
            title: "职位性质",
            className: "text-left",
            width: 100,
            hidden: false,
            search: {
              type: "select",
              data: {
                optionsLabel: 'label',
                optionsValue: 'value',
                options:[{label:'实习',value:'PRACTICE'},{label:'全职',value:'FULL_TIME'}],
                placeholer: "",
                autoFocus: false
              }
            },
            formatter: (record) => {
              if(record.positionProperty == 'PRACTICE') {
                return '实习'
              }else {
                return '全职'
              }
            }
          },{
            id: "major",
            title: "专业要求",
            className: "text-left",
            width: 80,
            hidden: true,
            search: {
              type: "select",
              data: {
                optionsLabel: 'label',
                optionsValue: 'value',
                options:[{label:'专业不限',value:''},{label:'测试',value:'1558337668735'},{label:'教育专业',value:'20500001'},{label:'法语专业',value:'20800001'},{label:'新闻传播专业',value:'22300001'}],
                placeholer: "",
                autoFocus: false
              }
            },
            formatter: (record) => {
              return record.majorName
            }
          },{
            id: "salary",
            title: "薪资范围",
            className: "text-left",
            width:  100,
            hidden: true,
            search: {
              type: "select",
              data: {
                optionsLabel: 'label',
                optionsValue: 'value',
                options:[{label:'面谈',value:'1'},{label:'2000以下',value:'2'},{label:'2000-4000',value:'3'},{label:'4000-6000',value:'4'},{label:'6000-8000',value:'5'},{label:'8000-10000',value:'6'},{label:'10000-15000',value:'7'},{label:'15000以上',value:'8'}],
                placeholer: "",
                autoFocus: false
              }
            },
            formatter: (record) => {
              return record.salaryName
            }

          },{
            id: "number",
            title: "招聘人数",
            className: "text-left",
            width: 80,
            hidden: false,
            search: {
              type: "select",
              data: {
                optionsLabel: 'label',
                optionsValue: 'label',
                options:[{label:'1-5'},{label:'5-10'},{label:'10-30'},{label:'30-50'},{label:'50-70'},{label:'70-90'},{label:'90以上'}],
                placeholer: "",
                autoFocus: false,
                change: ({ value, target }) => {
                  let arr = value.split('-')
                  if(arr.length != 1) {
                    let min = arr[0]
                    let max = arr[1]
                    this.tableDataUrl = `/table-data/employment/positionTemplate/getPositionTemplateList?timeStamp=${new Date().getTime()}&minRecruitNumber=${min}&maxRecruitNumber=${max}`
                  }else {
                    let min = 90
                     this.tableDataUrl = `/table-data/employment/positionTemplate/getPositionTemplateList?timeStamp=${new Date().getTime()}&minRecruitNumber=${min}`
                  }
                  //  this.tableDataUrl = `/table-data/employment/positionTemplate/getPositionTemplateList?timeStamp=${new Date().getTime()}&beginTime=${this.$refs.teachList.tableSearchFields['timeSpace_start']}&endTime=${this.$refs.teachList.tableSearchFields['timeSpace_end']}`
                   
                  }
              }
            },
            formatter: (record) => {
              return record.recruitNumber
            }
          },{
            id: "workplaceName",
            title: "工作地点",
            className: "text-left",
            width:  150,
            hidden: true,
            search: {
              type: "input",
              data: {
                placeholer: "",
                autoFocus: false
              }
            }
          },{
            id: "positionRemarks",
            title: "工作职责",
            className: "text-left",
            width:  150,
            hidden: true,
            search: {
              type: "input",
              data: {
                placeholer: "",
                autoFocus: false
              }
            }
          },{
            id: "positionRequire",
            title: "工作要求",
            className: "text-left",
            width:  150,
            hidden: true,
            search: {
              type: "input",
              data: {
                placeholer: "",
                autoFocus: false
              }
            }
          },{
            id: "createTime",
            title: "发布时间",
            className: "text-left",
            width: 150,
            hidden: false,
          },{
            id: "opts",
            title: "操作",
            width: 50,
            hidden: false,
            formatter: (record) => {
              return [{
                tag: 'a',
                text: '查看',
                callback: (record, index) => {
                  this.newPosition = false
                  this.defaultFormInfo = record
                  this.isEditPosition = false
                  this.showDialog = true
                }
              }, {
                tag: 'a',
                text: '删除',
                callback: (record, index) => {
                  this.$confirm('是否删除该模板?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    let url = '/api/employment/positionTemplate/deletePositionTemplate?id=' + record.id
                    sAjax({
                      url: url,
                      type: 'post',
                      success: (data) => {
                        if(data.state)  {
                          this.setTableUrl(this.loginType.loginType)
                          this.$message({
                            type: 'success',
                            message: '删除成功!'
                          });
                        }else{
                           this.$message({
                            type: 'error',
                            message: '删除失败'
                          });
                        }
                      }
                    })
                  })
                }
              }]
            }

          }]
        }
      },
        addPositon() {
          this.newPosition = true
          if(this.loginType.loginType == 'COMPANY') {
            this.isEditPosition = true
            this.showDialog = true,
            this.defaultFormInfo = null
            
          }else {
            getUnitList().then(data => {
              if(data.state) {
                this.unitList = data.data
                this.showUnitList = true
              }else {
                this.$message.error('单位获取失败')
              }
            })
          }
            
        },
    },
    created() {
      this.catchLoginType()
    }
}
</script>
<style lang="less" scoped>
#jobPoolList {
    margin-left: 20px;
}
</style>
<style lang="less">
 #jobPoolList {
     .custom-btn {
         padding: 0 20px;
         height:44px;
         line-height: 44px;
         margin-right: 20px;
         margin-left: 0;
         float: right;
     }
     .table {
       .dropdown-icon {
         i {
            vertical-align: initial!important;
         }
       }
     }
 }
</style>

