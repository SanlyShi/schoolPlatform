
/**宣讲会列表页 */
<template>
  <div id="techinList">
    <el-button
      style="color:#666;"
      type="text"
      icon="el-icon-back"
      v-if="curStatus != 'list'"
      @click="curStatus = 'list'"
    >返回</el-button>

    <!-- 新增宣讲会组件 -->
    <add-teachin v-if="curStatus=='edit'" @backToParent="backToParent" :loginType="loginType"></add-teachin>

    <!-- 宣讲会详情 -->
    <techin-details
      v-if="curStatus == 'details'"
      :techinDetails="techinDetails"
      :techinId = "techinId"
      :loginType="loginType"
      :data='data'
      @backToParent="backToParent"
    ></techin-details>

    <!-- 宣讲会列表 -->
    <div class="techinBox" v-show="curStatus=='list'">
      <v-table
        :url="tableDataUrl"
        :columns="columns"
        ref='teachList'
        idField="id"
        pagesize="15"
        :multiple="showMultiple"
        :search="false"
        :order="true"
        :columnsControl="true"
        @afterChecked="_tableChecked"
      >
      <div slot="btn-group" class="pull-left" >
          <el-button v-if="tableCheckedListAll" class="operability-hint" type="text">已选择{{tableCheckedListAll}}项,其中可操作的有{{tableCheckedList.length}}项</el-button>
        </div>
        <div slot="btn-group" class="pull-right">
          <el-button
            class="custom-btn"
            type="primary"
            @click="exportStat"
            v-if="loginType.isAdmin&&data.title == '宣讲会管理'"
          >导出</el-button>
          <el-button
            class="custom-btn"
            type="primary"
            @click="batchAssistant"
            v-if="loginType.isAdmin&&data.title == '宣讲会管理'"
          >批量设置跟场助理</el-button>
          <el-button
            class="custom-btn"
            type="primary"
            @click="createTechin"
          >新增宣讲会</el-button>
        </div>
      </v-table>
    </div>
    
    <!-- 设置跟场助理 -->
    <div class="setAssistant">
      <el-dialog :visible.sync="dialogVisible" width="480px" :before-close="beforCancle">
        <div class="form">
          <el-form ref="assistant" :model="assistant" :rules="assistantRules" label-width="50px">
            <el-form-item prop="name">
              <i slot="label" class="nameIcon"></i>
              <el-input v-model="assistant.name" placeholder="请输入跟场助理姓名"></el-input>
            </el-form-item>
            <el-form-item prop="phone">
              <i slot="label" class="phoneIcon"></i>
              <el-input v-model="assistant.phone" placeholder="请输入跟场助理电话"></el-input>
            </el-form-item>
            <div class="btnGroup">
              <a @click="cancle">取 消</a>
              <a @click="submit">确 定</a>
            </div>
          </el-form>
        </div>
      </el-dialog>
    </div>

        <!-- 审核意见 -->
      <div class="reason btnGroup" v-if="reasonVisible">
        <el-dialog :visible.sync="reasonVisible"  title="审核意见" width="480px">
          <div class="sumarryInput">
            <el-input type="textarea" v-model="reason" resize="none" rows="4"></el-input>
              <a @click="reject" style="margin-top: 20px;">提交</a>
          </div>
        </el-dialog>
      </div>

    <!-- 管理员审核 -->
    <div v-if="curStatus == 'audit1111'" style="background: #fff;">
        <base-info-edit ref="baseInfoEdit" :editStatus='editStatus' :defaultInfo='defaultInfo' :placeRule="placeRule" :loginType="loginType"></base-info-edit>

        <!-- 单位信息 -->
        <unit-info-edit ref="unitInfoEdit" :defaultInfo='defaultInfo' :loginType="loginType"></unit-info-edit>

        <!-- 职位信息 -->
        <position-edit ref="positionInfoEdit" :defaultInfo='defaultInfo' :unitList='unitList' ></position-edit>
        
        <!-- 招聘简章 -->
        <div class="sumarry">
        <div class="title clearfix">
          <h1>
            <span>
              <em></em>
              <i>招聘简章</i>
            </span>
          </h1>
        </div>
        <div class="sumarryInput">
          <el-input type="textarea" v-model="sumarry" resize="none" rows="8"></el-input>
        </div>
      </div>

        <div class="btnGroup"> 
          <div>
            <a @click="submitAudit">通过</a>
            <a @click="showReason('fail')">不通过</a>
            <a @click="showReason('reject')">驳回重新提交</a>
          </div>
          <!-- <a class="submit" @click="revise"  v-if="status == 0&&">通过</a>
          <a class="submit" @click="toEdit"  v-if="status == 1">不通过</a>
          <a class="submit" @click="toEdit"  v-if="status == 1">驳回重新提交</a> -->
        </div>
      </div>

      <!-- 导出筛选 -->
      <v-modal :show="showExport" effect="fade">
        <div slot="modal-header" class="modal-header">
          <h5 class="modal-title">导出</h5>
        </div>
        <div slot="modal-body" class="modal-body">
          <v-tree
            id="resourceTree"
            ref="tree"
            cascade="true"
            :items="fieldsToExport"
            :checkable="true"
            :search="true"
          ></v-tree>
        </div>
        <div slot="modal-footer" class="modal-footer">
          
          <button
            type="button"
            class="btn cancel-btn clearBtnBorder"
            @click="showExport = false"
          >取消</button>
          <button
            type="button"
            class="btn submit-btn clearBtnBorder"
            @click="exportTable"
          >导出</button>
        </div>
      </v-modal>
  </div>
</template>
<script>
  import techinDetails from './components/techinDetails'
  import addTeachin from './components/addTeachin'
   import baseInfoEdit from './components/baseInfoEdit'
  import unitInfoEdit from './components/unitInfoEdit'
  import positionEdit from './components/positionEdit'
  import { getLoginType, getMeetingInfo, reCallMeeting, setTop, undercarriage, assistant, signIn } from '../../api/techin/api'
  import { getPlaceRules } from '../../api/placeManage/api'
  import { sAjax } from '../../../../assets/utils/utils';
  import { checkOverStep,checkUnitDisabled } from '../../api/api.js'
  export default {
    props: ['data'],
    data() {
      let checkPhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error("手机号不能为空"));
        } else {
          const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
          if (reg.test(value)) {
            callback();
          } else {
            return callback(new Error("请输入正确的手机号"));
          }
        }
      };
      return {
        columns: [],
        loginType: '',
        curStatus: 'list',//当前页面是属于列表页、编辑、详情页、审核list/edit/details/audit
        tableDataUrl: '',
        showMultiple:true,//是否展示多选框
        tableCheckedListAll:'',
        tableCheckedList:[],
        addAssignType:'single',//添加跟场助理方式为单个或者批量
        showExport:false,
        fieldsToExport:[],//导出字段列表
        editStatus:'',
        teachinDetails: {},//宣讲会详情信息
        dialogVisible: false,//跟场助理弹窗
        curId: '',//当前宣讲会详情ID
        defaultInfo:{},
        reasonVisible:false,
        reason:'',
        curReasonType:'',//区分当前是驳回或者不通过
        placeRule:{},
        techinDetails:{},
        sumarry:'',//招聘简章
        techinId:'',
        assistant: {
          name: '',
          phone: '',
        },
        assistantRules: {
          name: [{ required: true, message: '请输入跟场助理名字', trigger: 'blur' }],
          phone: [{ required: true, message: '请输入跟场助理手机号', trigger: 'blur' }, { validator: checkPhone, trigger: "blur" }],
        }
      }
    },
    methods: {
      
      // 批量通过不通过选项
    _tableChecked(arr) {
      let checkedArr = []
      console.log(arr)
      arr.forEach(item => {
          checkedArr.push(item.id)
      })
      this.tableCheckedListAll = arr.length;
      this.tableCheckedList = checkedArr;
    },
      batchAssistant() {  //批量设置跟场助理
        if(!this.tableCheckedListAll) {
          return this.$message.error('请先勾选单位')
        }
        this.assistant =  {
          name: '',
          phone: '',
        };
        this.addAssignType = 'list'
        this.dialogVisible = true
        
      },
      createTechin() {  //新增宣讲会
        if(this.loginType.loginType == 'COMPANY') {  //查看单位是否受限制
          checkOverStep('PREACH_MEETING').then(data => {
            if(data.state) {
              checkUnitDisabled().then(info => {
                if(info.state) {
                  if(info.data != 1) {  //未停用
                    this.curStatus='edit'
                  }else {
                    this.$message({
                      type: 'error',
                      message: '该单位账号已被停用'
                    })
                  }
                }
              })
              
            }else {
              this.$message.error(data.message)
            }
          }) 
        }else {
          this.curStatus='edit'
        }
      },
      catchLoginType() {
        getLoginType().then(data => {
          this.loginType = data
          this.setTableUrl(data.loginType)
          this.setColumns(data.loginType)
        })
      },
      
      catchPlaceRules() {
        getPlaceRules('PREACH_MEETING').then(data => {
          if (data.length) {
            this.placeRule = data[0]
            this.status = this.techinDetails.status
            this.statusName = this.techinDetails.statusName
          }
        })
      },
      setTableUrl(loginType) {
        if (loginType == 'COMPANY') {
          this.tableDataUrl = '/table-data/employment/preachMeeting/getPreachMeetingListForCompany?timeStamp=' + new Date().getTime()
        } else {
          if (this.data.title == "宣讲会管理") {
            this.tableDataUrl = '/table-data/employment/manage/preachMeeting/getPreachMeetingListForAdmin?timeStamp=' + new Date().getTime()
          } else {
            this.tableDataUrl = '/table-data/employment/manage/preachMeeting/getPreachMeetingAuditList?timeStamp=' + new Date().getTime()
          }

        }
      },
      backToParent() {   //返回父页面
        this.curStatus = 'list'
      },
      exportStat() {  //导出
      this.fieldsToExport = [
          {title:'宣讲会标题',id:'1',checked: true},
          {title:'宣讲会时间 ',id:'2',checked: true},
          {title:'场地',id:'3',checked: true},
          {title:'跟场助理',id:'4',checked: true},
          {title:'助理联系方式',id:'5',checked: true},
           {title:'简历接收时间',id:'6',checked: true},
          {title:'单位名称',id:'7',checked: true},
          {title:'行业类别',id:'8',checked: true},
          {title:'是否自行联系',id:'9',checked: true},
          {title:'单位所在地',id:'10',checked: true},
          {title:'单位标签',id:'11',checked: true},
          {title:'单位规模',id:'12',checked: true},
          {title:'单位地址',id:'13',checked: true},
          {title:'单位简介',id:'14',checked: true},
          {title:'单位联系人',id:'15',checked: true},
          {title:'单位联系人电话',id:'16',checked: true},
          {title:'邮箱',id:'17',checked: true},
          {title:'职位名称',id:'20',checked: true},
          {title:'报名人数',id:'18',checked: true},
          {title:'总招聘人数',id:'19',checked: true},
          {title:'需求专业',id:'21',checked: true},
          {title:'审核状态',id:'22',checked: true},
          {title:'更新时间',id:'23',checked: true},
          
        ]
        this.showExport = true 
        return 
      },
      cancle() {
        this.$refs['assistant'].resetFields()
        this.$refs['assistant'].clearValidate()
        this.dialogVisible = false
      },
      beforCancle(done) {
        this.$refs['assistant'].resetFields()
        this.$refs['assistant'].clearValidate()
        done()
      },
      showReason(type) {
        this.reasonVisible = true
        this.curReasonType = type
        this.reason = ''
      },
      reject() {  //驳回或者不tongg
        if(!this.reason) {
          return this.$message.error('请填写审核意见')
        }
        let url 
        if(this.curReasonType == 'fail') {   //不通过
           url = '/api/employment/manage/preachMeeting/refuseApply?id='+ this.defaultInfo.id +'&reason='+this.reason
        }else {  //驳回
          url = '/api/employment/manage/preachMeeting/rejectApply?id='+ this.defaultInfo.id +'&reason='+this.reason
        }
        sAjax({
          url: url,
          type: 'post',
          success:(data) => {
            if(data.state) {
              this.$message.success('操作成功')
              this.curStatus = 'list'
              this.setTableUrl(this.loginType.loginType)
            }else {
              this.$message.success('操作失败')
            }
            this.reasonVisible = false
          }
        }) 
      },
      exportTable() {
        let checkedItems = this.$refs.tree.getChecked();
        let params = []
        let url = ''
        if(checkedItems.length) {
          for(let i=0;i<checkedItems.length;i++) {
            params.push(checkedItems[i].id)
          }
        }
        if(params.length) {
          var data = params.join(',')
          url = "/downloads/employment/manage/preachMeeting/excelOut?fields=" + data
        }else {
          url = "/downloads/employment/manage/preachMeeting/excelOut"
        }
        this.showExport = false
        window.location.href = url;
    },
    setColumns(type) {
      if (type == 'COMPANY') {
          this.showMultiple = false
          this.columns = [{
            id: "title",
            title: "宣讲会标题",
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
          }, {
            id: "timeSpace",
            title: "宣讲会时间",
            className: "text-left line-height-normal",
            width: 220,
            search: {
                type: 'datetime',
                data: {
                  dateFormat: 'yyyy-MM-dd hh:ii',
                  placeholder: '宣讲会',
                  change: ({ value, target }) => {
                   this.tableDataUrl = `/table-data/employment/preachMeeting/getPreachMeetingListForCompany?timeStamp=${new Date().getTime()}&beginTime=${this.$refs.teachList.tableSearchFields['timeSpace_start']}&endTime=${this.$refs.teachList.tableSearchFields['timeSpace_end']}`
                   
                  }
                }
              },
            
          }, {
            id: "areaName",
            title: "宣讲会场地",
            className: "text-left",
            width: 120,
            search: {
              type: "input",
              data: {
                placeholer: "",
                autoFocus: false
              }
            },
          },{
              id: "enrollNum",
              title: "报名人数",
              className: "text-left",
              width: 100,
              hidden: false,
              formatter: (record) => {
                if(record.enrollNum) {
                  return record.enrollNum
                }
              }
            },
          {
            id: "createTime",
            title: "提交时间",
            className: "text-left",
            width: 150,
          }, {
            id: "assistantName",
            title: "跟场助理",
            className: "text-left",
            width: 100,
            hidden: false,
            formatter: (record) => {
              if(!record.assistantName) {
                return '-'
              }
            }
          }, {
            id: "assistantPhone",
            title: "助理联系方式",
            className: "text-left",
            width: 100,
            hidden: false,
          }, {
            id: "status",
            title: "状态",
            className: "text-left",
            width: 50,
            search: {
              type: "select",
              data: {
                optionsLabel: 'label',
                optionsValue: 'value',
                options:[{label:'待审核',value:0},{label:'已通过',value:1},{label:'未通过',value:2},{label:'已撤回',value:3},{label:'已下架',value:4},{label:'已驳回',value:5}],
                placeholer: "",
                autoFocus: false
              }
            },
            formatter: (record) => {
              return record.statusName
            }
          }, {
            id: "auditReason",
            title: "审核意见",
            className: "text-left",
            width: 100,
            hidden: false,
            formatter: (record) => {
              if(!record.auditReason) {
                return ' - '
              }
            }
          }, {
            id: "opts",
            title: "操作",
            width: 70,
            hidden: false,
            formatter: (record) => {
              return [{
                tag: 'a',
                text: '查看',
                callback: (record, index) => {
                  getMeetingInfo(record.id).then(data => {
                    if(data.state) {
                      this.techinDetails = data.data
                      console.log(this.techinDetails)
                      this.techinId = record.id
                      this.curStatus = 'details'
                    }else {
                      this.$message.error(data.message)
                    }
                  })
                }
              }, {
                tag: 'a',
                text: '撤回',
                className: record.status == '0' ? '' : 'none',
                callback: (record, index) => {
                  reCallMeeting(record.id).then(data => {
                    console.log(this.loginType.loginType)
                    if (data.state) {
                      this.$message.success('撤回成功')
                      this.setTableUrl(this.loginType.loginType)
                    } else {
                      this.$message.error(data.message)
                    }
                  })
                }
              },]
            }

          }]
        } else {  //管理员
          if (this.data.title == '宣讲会管理') {
           this.columns = [{
              id: "title",
              title: "宣讲会标题",
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
            }, {
              id: "companyName",
              title: "单位名称",
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
            }, {
              id: "timeSpace",
              title: "宣讲会时间",
              className: "text-left line-height-normal",
              width: 200,
              hidden: false,
              search: {
                type: 'datetime',
                data: {
                  dateFormat: 'yyyy-MM-dd hh:ii',
                  placeholder: '宣讲会',
                  change: ({ value, target }) => {
                   this.tableDataUrl = `/table-data/employment/manage/preachMeeting/getPreachMeetingListForAdmin?timeStamp=${new Date().getTime()}&beginTime=${this.$refs.teachList.tableSearchFields['timeSpace_start']}&endTime=${this.$refs.teachList.tableSearchFields['timeSpace_end']}`
                   
                  }
                }
              },
              // formatter(record) {
              //   return `${new Date(record.beginTime).format('yyyy-MM-dd HH:mm')} -<br/> ${new Date(record.endTime).format('yyyy-MM-dd HH:mm')}`
              // }
            }, {
              id: "areaName",
              title: "宣讲会场地",
              className: "text-left",
              width: 120,
              hidden: false,
              search: {
                type: "input",
                data: {
                  placeholer: "",
                  autoFocus: false
                }
              }
            }, 
            {
              id: "enrollNum",
              title: "报名人数",
              className: "text-left",
              width: 100,
              hidden: false,
              formatter: (record) => {
                if(record.enrollNum) {
                  return record.enrollNum
                }
              }
            },
            {
              id: "allocationScheme",
              title: "场地分配方式",
              className: "text-left",
              width: 100,
              hidden: false,
            }, 
            {
              id: "assistantName",
              title: "跟场助理",
              className: "text-left",
              width: 100,
              hidden: false,
              formatter: (record) => {
                if(!record.assistantName) {
                  return '-'
                }
              }
            }, {
              id: "assistantPhone",
              title: "助理联系方式",
              className: "text-left",
              width: 100,
              hidden: false,
            }, {
              id: "signInStatus",
              title: "签到状态",
              className: "text-left",
              width: 100,
              hidden: false,
              search: {
                type: "select",
                data: {
                  optionsLabel: 'label',
                  optionsValue: 'value',
                  options:[{label:'已签到',value:true},{label:'未签到',value:false}],
                  placeholer: "",
                  autoFocus: false
                }
              },
              formatter: (record) => {
                return record.signInStatus?'已签到':'未签到'
              }
            },{
              id: "opts",
              title: "操作",
              width: 200,
              hidden: false,
              formatter: (record) => {
                return [{
                  tag: "a",
                  text: "查看",
                  callback: (record, index) => {
                    getMeetingInfo(record.id).then(data => {
                      if(data.state) {
                        this.tableCheckedListAll = ''
                        this.tableCheckedList = []
                        this.techinDetails = data.data
                        this.techinId = record.id
                        this.curStatus = 'details'
                      }else {
                        this.$message.error(data.message)
                      }
                  })
                  }
                },
                {
                  tag: "a",
                  text: "跟场助理",
                  callback: (record, index) => {
                    this.curId = record.id
                    this.assistant.name = record.assistantName
                    this.assistant.phone = record.assistantPhone
                    this.addAssignType = 'single'
                    this.dialogVisible = true
                  }
                },
                {
                  tag: "a",
                  text: record.status == 4 ? '重新上架' : '下架',
                  callback: (record, index) => {
                    let isUnder
                    let text = record.status == 4 ? '重新上架' : '下架'
                    if (record.status == 4) {
                      isUnder = false
                    } else {
                      isUnder = true
                    }
                    this.$confirm('是否执行'+ text + '操作', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(() => {
                      undercarriage(record.id, isUnder).then(data => {
                        if (data.state) {
                          let msg = text+'成功！'
                          this.setTableUrl(this.loginType.loginType)
                          this.$message.success(msg)
                        }else {
                           this.setTableUrl(this.loginType.loginType)
                          this.$message.error(data.message)
                        }
                      })
                    }).catch(() => {
                      this.$message({
                        type: 'info',
                        message: '已取消' + text
                      });          
                    });
                    

                  }
                }, {
                  tag: "a",
                  text: record.top == 1 ? '取消置顶' : '置顶',
                  callback: (record, index) => {
                    let top
                    let text
                    if (record.top == 1) {
                      top = 'NO'
                      text = '取消置顶'
                    } else {
                      top = 'YES'
                      text = '置顶'
                    }
                    this.$confirm('是否执行'+ text + '操作', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(() => {
                      setTop(record.id, top).then(data => {
                        if (data.state) {
                          this.setTableUrl(this.loginType.loginType)
                          this.$message.success(text + '成功')
                        }else {
                          this.setTableUrl(this.loginType.loginType)
                          this.$message.success(data.message)
                        }
                      })
                    }).catch(() => {
                      this.$message({
                        type: 'info',
                        message: '已取消' + text
                      });          
                    });
                    
                  }
                },{
                  tag: "a",
                  text: record.signInStatus?"取消签到":"签到",
                  className: record.status == 4?'hide':'',
                  callback: (record, index) => {
                     let text = record.signInStatus?"取消签到":"签到"
                     let status = record.signInStatus?false:true
                     let id = record.id
                      this.$confirm('是否'+ text, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                      }).then(() => {
                        signIn(id,status).then(data => {
                          if (data.state) {
                            this.setTableUrl(this.loginType.loginType)
                            this.$message.success(text + '成功')
                          }else {
                            this.setTableUrl(this.loginType.loginType)
                            this.$message.success(data.message)
                          }
                        })
                      }).catch(() => {
                      this.$message({
                        type: 'info',
                        message: '已取消' + text
                      });          
                    });
                     
                  }
                }]
              }

            }]
          } else {
            this.showMultiple = false
            this.columns = [{
              id: "companyName",
              title: "单位名称",
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
            }, {
              id: "title",
              title: "宣讲会标题",
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
            }, {
              id: "timeSpace",
              title: "宣讲会时间",
              className: "text-left line-height-normal",
              width: 200,
              search: {
                type: 'datetime',
                data: {
                  dateFormat: 'yyyy-MM-dd hh:ii',
                  placeholder: '宣讲会',
                  change: ({ value, target }) => {
                   this.tableDataUrl = `/table-data/employment/manage/preachMeeting/getPreachMeetingAuditList?timeStamp=${new Date().getTime()}&beginTime=${this.$refs.teachList.tableSearchFields['timeSpace_start']}&endTime=${this.$refs.teachList.tableSearchFields['timeSpace_end']}`
                   
                  }
                }
              },
              // formatter(record) {
              //   return `${new Date(record.beginTime).format('yyyy-MM-dd HH:mm')} -<br/> ${new Date(record.endTime).format('yyyy-MM-dd HH:mm')}`
              // }
            }, {
              id: "areaName",
              title: "宣讲会场地",
              className: "text-left",
              width: 120,
              search: {
                type: "input",
                data: {
                  placeholer: "",
                  autoFocus: false
                }
              }
            },{
              id: "enrollNum",
              title: "报名人数",
              className: "text-left",
              width: 100,
              hidden: false,
              formatter: (record) => {
                if(record.enrollNum) {
                  return record.enrollNum
                }
              }
            },
             {
              id: "createTime",
              title: "提交时间",
              className: "text-left",
              width: 150,
            }, {
            id: "status",
            title: "审核状态",
            className: "text-left",
            width: 100,
            search: {
              type: "select",
              data: {
                optionsLabel: 'label',
                optionsValue: 'value',
                options:[{label:'待审核',value:0},{label:'已通过',value:1},{label:'未通过',value:2},{label:'已驳回',value:5}],
                placeholer: "",
                autoFocus: false
              }
            },
            formatter: (record) => {
              return record.statusName
            }
          }, {
              id: "auditReason",
              title: "审核意见",
              className: "text-left",
              width: 100,
              hidden: false,
              formatter: (record) => {
              if(!record.auditReason) {
                return ' - '
              }
            }
            }, {
              id: "opts",
              title: "操作",
              width: 50,
              hidden: false,
              formatter: (record) => {
                return [{
                  tag: 'a',
                  text: record.status == 0 ? '审核' : '查看',
                  callback: (record, index) => {
                    if(record.status == 0) {//审核
                    this.catchPlaceRules()
                    getMeetingInfo(record.id).then(data => {
                        this.techinDetails = data.data
                        console.log(this.defaultInfo)
                        this.curStatus = 'details'
                        this.editStatus = 'details'
                        this.sumarry = data.data.recruitmentBrief
                      })
                    }else {  //查看
                      getMeetingInfo(record.id).then(data => {
                        this.techinDetails = data.data
                        this.techinId = record.id
                        this.curStatus = 'details'
                      })
                    }
                  }
                }]
              }

            }]
          }
        }
    },
      submit() { //设置助理
        this.$refs['assistant'].validate(valid => {
          if (valid) {
            if(this.addAssignType == 'single') {
              assistant(this.curId, this.assistant.name, this.assistant.phone).then(data => {
                if (data.state) {
                  this.$message.success('编辑成功!')
                  this.setTableUrl(this.loginType.loginType)
                } else {
                  this.$message.error(data.message)
                }
                this.dialogVisible = false
              })
            }else {
              let idList = this.tableCheckedList.join(',')
              let url = '/api/employment/manage/preachMeeting/setAssistantPatch?idListStr='+idList + '&assistantName=' +this.assistant.name+'&assistantPhone=' + this.assistant.phone
              sAjax({
                url: url,
                type: 'post',
                success: (data) => {
                  if (data.state) {
                    this.$message.success('跟场助理设置成功!')
                    this.tableCheckedListAll = ''
                    this.tableCheckedList = []
                    this.setTableUrl(this.loginType.loginType)
                    
                  } else {
                    this.$message.error(data.message)
                    this.tableCheckedListAll = ''
                    this.tableCheckedList = []
                  }
                    this.dialogVisible = false
                }
              })
            }
            
          }
        })
      },
      submitAudit() {   //审核通过
        let vali_baseInfo = this.$refs.baseInfoEdit.vali()
        let vali_unitInfo = this.$refs.unitInfoEdit.vali()
        let positionInfo = this.$refs.positionInfoEdit.tableData // 职位列表
        let url = '/api/employment/manage/preachMeeting/agreeApply'
        console.log(positionInfo)
        if (vali_baseInfo && vali_unitInfo) {  //子组件验证通过
          this.$refs.baseInfoEdit.toSubmit()
          setTimeout(() => {
            let baseInfo = this.$refs.baseInfoEdit.baseInfo
            let unitInfo = this.$refs.unitInfoEdit.unitForm
            let positionInfo = this.$refs.positionInfoEdit.tableData // 职位列表
            console.log(baseInfo)

            let obj = Object.assign({}, baseInfo, unitInfo)
            if (positionInfo) {
              obj.recruitmentPositionVOList = positionInfo
            }
            obj.recruitmentBrief = this.sumarry
            console.log(obj)
            sAjax({
              url: url,
              type: 'post',
              data: obj,
              success: (info) => {
                if (info.state) {
                  this.$message.success('审核通过')
                  this.curStatus = 'list'
                  this.setTableUrl(this.loginType.loginType)
                } else {
                  this.$message.error(info.message)
                }
              }
            })
          }, 200);
        }
      },
    },
  
    components: {
      techinDetails,
      addTeachin,
      baseInfoEdit,
      unitInfoEdit,
      positionEdit,
    },
    created() {
      this.catchLoginType()
    },
  }
</script>
<style lang="less" scoped>
#techinList {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  font-size: 14px;
  background: #f6f6f8;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin-top: 20px;
  em,
  span,
  i,
  a {
    display: inline-block;
    vertical-align: middle;
  }
  h1,
  h2,
  h3,
  label,
  p {
    margin: 0;
  }
  .sumarry {
    padding: 30px;
    border-top: 1px solid #e7e7e7;
  }
  .sumarryInput {
    margin-top: 20px;
  }
}
</style>
<style lang="less">
.column-opts {
  .opt-btn.none {
    display: none;
  }
}
#techinList {
  .custom-btn {
    height: 44px;
    line-height: 44px;
    padding: 0 20px;
    float: right;
    margin-right: 20px;
    margin-left: 0;
  }
  .title {
    h1 {
      color: #000;
      font-size: 16px;
      & > span {
        float: left;
        em {
          background: #3e92fe;
          border-radius: 8px;
          width: 6px;
          height: 22px;
          margin-right: 8px;
        }
        i {
          color: #000;
          font-weight: bold;
        }
      }
      & > a {
        float: right;

        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        i {
          background: url("/static/image/employment/edit.png") no-repeat;
          width: 16px;
          height: 16px;
          margin-right: 10px;
           background-size: contain;
        }
      }
    }
  }
  .btnGroup {
    text-align: center;
    padding-bottom: 30px;
    a {
        width: 150px;
        height: 150px;
        height: 44px;
        margin-right: 20px;
        line-height: 44px;
        border-radius: 4px;
        text-align: center;
        color: #fff;
        background: #3e92fe;
        border: 1px solid #3e92fe;
        cursor: pointer;
      }
  }
  .line-height-normal {
    line-height: normal;
  }
}
.setAssistant {
  .el-dialog__body {
    padding: 30px 0;
  }
  .el-form {
    padding: 0 70px;
    label {
      text-align: left;
      i.nameIcon {
        width: 16px;
        height: 18px;
        background: url("/static/image/employment/account.png") no-repeat;
      }
      i.phoneIcon {
        width: 16px;
        height: 18px;
        background: url("/static/image/employment/phoneIcon.png") no-repeat;
      }
    }
    .btnGroup {
      margin-top: 60px;
      a {
        width: 150px;
        height: 150px;
        height: 44px;
        line-height: 44px;
        border-radius: 4px;
        text-align: center;
        color: #999;
        background: #fff;
        border: 1px solid #999;
        cursor: pointer;
      }
      a:last-child {
        color: #fff;
        background: #3e92fe;
        border: 1px solid #3e92fe;
        float: right;
      }
    }
  }
 
}
.techinBox {
  table {
    .operability-hint {
      span {
        color: #000;
      }
    }
  }
  
}

</style>
