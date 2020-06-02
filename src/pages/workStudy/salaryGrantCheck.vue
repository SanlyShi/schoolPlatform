<template>
  <div class="salary-grant-check">
    <div>
      <v-table
        ref="salaryTable"
        :url="curNodeId?`${manageTableUrl}?nodeId=${curNodeId}&timeStamp=${timeStamp}`:''"
        :columns="manageTableColumns"
        pagesize="10"
        idField="id"
        :multiple="allowBatch"
        :order="true"
        :search="false"
        @afterChecked="_tableChecked">
        <div slot="btn-group" role="group" class="table-options-container">
          <div class="btn-group pull-left">
            <v-select v-model="curNodeId" placeholder="暂无流程可选" :options="curNodeList" :required="true" options-value="id" options-label="name" @afterSelected="afterSelected"></v-select>
          </div>
          <div class="batch-options"
            :class="{
              active: tableCheckedList.length > 0
            }">
            <span class="pull-left">已选择{{tableCheckedList.length}}项，其中可操作的有{{tableCheckedIds.length}}项</span>
            <div class="pull-left" style="margin-left:20px">
              <button type="button" class="btn btn-bgColor-style" @click="_submit('pass', tableCheckedIds)">通过</button>
              <button type="button" class="btn btn-bgColor-style" @click="_submit('unpass', tableCheckedIds)">不通过</button>
            </div>
            <!-- 后续需求跟上 -->
            <!-- <button type="button" class="btn blue" v-if="allowReject">驳回</button> -->
          </div>
          <div class="btn-group pull-right">
            <button type="button" class="btn btn-bgColor-style clearBtnBorder " @click="_export">导出</button>
          </div>
        </div>
      </v-table>
    </div>
    <!-- 导出字段配置，暂时保留 -->
    <v-modal :show="exportModalShow">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          导出字段配置
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="field-list">
          <div class="field-item"
            :class="{
              active: exportFieldList.indexOf(field.id)>=0
            }"
            v-for="(field, i) in manageTableColumns" :key="i" @click="_checkField(field)" v-if="field.id !== 'opt'">
            <i class="maticon pull-left" v-html="icons(exportFieldList.indexOf(field.id)>=0?'check_box':'check_box_outline_blank')"></i>
            <span>{{field.title}}</span>
          </div>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn" @click="exportModalShow = false">取消</button>
        <button type="button" class="btn" @click="_export">开始导出</button>
      </div>
    </v-modal>
    <v-modal :show="checkRecord.modalShow" width="1000">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          查看
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
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
        <v-table
          :title="checkRecord.viewIndex === 'job'?'岗位视图':'人员视图'"
          :url="viewRecord?`${checkRecord.tableUrl[checkRecord.viewIndex]}?unitId=${viewRecord.unitMonthlySalary.unit.id}&month=${viewRecord.unitMonthlySalary.month}`:''"
          :columns="checkRecord.columns[checkRecord.viewIndex]"
          pagesize="10"
          idField="id"
          :multiple="false"
          :order="true"
          :search="false"
          key="5">
          <div slot="btn-group">
            <div class="btn-group pull-right">
              <!-- <button type="button" class="btn btn-bgColor-style" @click="checkRecord.viewIndex = (checkRecord.viewIndex === 'job'?'member':'job')">切换视图</button> -->
            </div>
          </div>
        </v-table>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <a type="button" class="btn orangered" v-if="currentNodeStatus === 'TODO'" @click="_submit('pass', positionIds)">通过</a>
        <a type="button" class="btn orangered" v-if="currentNodeStatus === 'TODO'" @click="_submit('unpass', positionIds)">不通过</a>
        <a type="button" class="btn orangered" v-if="canRevoke" @click="_revoke">撤回</a>
        <a type="button" class="btn orangered" @click="checkRecord.modalShow = false">关闭</a>
      </div>
    </v-modal>
     <v-modal :show="showUnpassOpinionModal" width="500">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          确定不通过该申请吗？
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="form-group">
          <textarea cols="24" rows="5" placeholder="请输入不通过的意见" class="unpass-modal-textarea"  maxlength="600" v-model="opinion"></textarea>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showUnpassOpinionModal = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder"  @click="submitUnpassOpinion">确定</button>
      </div>
    </v-modal>
  </div>
</template>
<script>
  import { sAjax, createTime } from '../../assets/utils/utils';
  export default {
    data: function () {
      return {
        exportModalShow: false,
        timeStamp: '',
        showUnpassOpinionModal: false,
        unpassIds: [],
        opinion: '',
        positionId: '',
        canRevoke: false,
        checkRecord: {
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
              className: 'text-center',
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
                return record.position.positionName
              }
            }, {
              id: 'positionType',
              title: '岗位类型',
              className: 'text-center',
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
                return record.position.positionTypeName
              }
            }, {
              id: 'month',
              title: '月份',
              className: 'text-center',
              width: 50,
              hidden: false
            }, {
              id: 'grantCount',
              title: '发放人数',
              className: 'text-center',
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
                if(record.position.totalWork&&Number(record.position.realWork)>Number(record.position.totalWork)) {
                  return `<span style="color: red">${record.position.realWork}</span>`
                } else {
                  return record.position.realWork
                }
              }
            }, {
              id: 'totalPayMount',
              title: '应发薪酬',
              className: 'text-right',
              width: 100,
              hidden: false
            }, {
              id: 'realPayMount',
              title: '实发薪酬',
              className: 'text-right',
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
              width: 80,
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
              className: 'text-center',
              width: 80,
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
              className: 'text-center',
              width: 60,
              hidden: false
            }, {
              id: 'manHour',
              title: '工时',
              className: 'text-center',
              width: 50,
              hidden: false
            }, {
              id: 'rewardStandard',
              title: '薪酬标准',
              className: 'text-right',
              width: 80,
              hidden: false,
              formatter: (record) => {
                return record.position ? record.position.rewardStandard : ''
              }
            }, {
              id: 'salaryCapMonth',
              title: '薪酬上限',
              className: 'text-right',
              width: 80,
              hidden: false,
              formatter: (record) => {
                return record.position ? record.position.salaryCapMonth : ''
              }
            }, {
              id: 'totalPayMount',
              title: '应发薪酬',
              className: 'text-right',
              width: 100,
              hidden: false
            }, {
              id: 'realPayMount',
              title: '实发薪酬',
              className: 'text-right',
              width: 100,
              hidden: false
            }]
          }
        },
        manageTableUrl: '/table-data/pwps/workflow/runtime/salary/instances',
        // manageTableUrl: '/table-data/pwps/workflow/runtime/salary/multiInstances',
        manageTableColumns: [{
          id: 'month',
          title: '月份',
          className: 'text-left',
          width: 100,
          hidden: false,
          search: {
            type: 'input',
          },
          formatter: (record) => {
            return record.unitMonthlySalary ? record.unitMonthlySalary.month : ''
          }
        }, {
          id: 'unitName',
          title: '单位名称',
          width: 100,
          className: 'text-left',
          hidden: false,
          search: {
            type: 'input'
          },
          formatter: (record) => {
            return record.unitMonthlySalary && record.unitMonthlySalary.unit ? record.unitMonthlySalary.unit.name : ''
          }
        }, {
          id: 'grantCount',
          title: '发放人数',
          width: 60,
          className: 'text-center',
          hidden: false,
          formatter: (record) => {
            return record.unitMonthlySalary ? record.unitMonthlySalary.grantCount : ''
          }
        }, {
          id: 'totalPayMount',
          title: '应发薪酬',
          width: 60,
          className: 'text-right',
          hidden: false,
          formatter: (record) => {
            return record.unitMonthlySalary ? record.unitMonthlySalary.totalPayMount : ''
          }
        }, {
          id: 'realPayMount',
          title: '实发薪酬',
          width: 60,
          className: 'text-right',
          hidden: false,
          formatter: (record) => {
            return record.unitMonthlySalary ? record.unitMonthlySalary.realPayMount : ''
          }
        }, {
          id: 'applicantName',
          title: '提交人姓名',
          width: 80,
          className: 'text-left',
          hidden: false,
          formatter: (record) => {
            return record.applicant.name
          }
        }, {
          id: 'applicantUserNo',
          title: '提交人学工号',
          width: 120,
          className: 'text-left',
          hidden: false,
          formatter: (record) => {
            return record.applicant.userNo
          }
        }, {
          id: 'createTime',
          title: '提交时间',
          width: 140,
          className: 'text-left',
          hidden: false,
        }, {
          id: 'auditStatus',
          title: '审核状态',
          width: 120,
          className: 'text-center',
          hidden: false,
          search: {
            type: 'select',
            data: {
              options: [],
              optionsLabel: 'text',
              optionsValue: 'id'
            }
          },
          formatter: (record) => {
            return record.statusLabel
          }
        }, {
          id: 'opt',
          title: '操作',
          className: 'text-center',
          width: 150,
          hidden: false,
          formatter: (record) => {
            var opts = [{
              tag: 'a',
              text: '查看',
              className: 'opt-btn',
              callback: (record, index) => {
                this.checkRecord.modalShow = true
                this.viewRecord = record
                this.positionId = record.id
                this.positionIds.push(record.id)
                this.currentNodeStatus = record.currentNodeStatus
              }
            }]
            if (record.currentNodeStatus === 'TODO') {
              opts.push({
                tag: 'a',
                text: '通过',
                className: 'opt-btn',
                callback: (record, index) => {
                  this._submit('pass', [record.id])
                }
              })
              opts.push({
                tag: 'a',
                text: '不通过',
                className: 'opt-btn',
                callback: (record, index) => {
                  this._submit('unpass', [record.id])
                }
              })
            }
            if (record.canRevoke) {
              opts.push({
                tag: 'a',
                text: '撤回',
                className: 'opt-btn',
                callback: (record, index) => {
                  this.positionId = record.id
                  this._revoke()
                }
              })
            }
            if (this.allowReject) {
              // 产品后续加需求会用到
              // opts.push({
              //   tag: 'a',
              //   text: '驳回',
              //   className: 'opt-btn',
              //   callback: (record, index) => {

              //   }
              // })
            }
            return opts
          }
        }],
        viewRecord: null,
        exportFieldList: [],
        tableCheckedList: [],
        positionIds: [],
        currentNodeStatus: '',
        nodeList: [{
          type: 'APPLICANT_STUDENT',
          name: '学生'
        }, {
          type: 'APPLICANT_UNIT',
          name: '用工单位'
        }, {
          type: 'UNIT_MANAGE',
          name: '用工单位领导'
        }, {
          type: 'COLLEGE',
          name: '学院勤工助学'
        }, {
          type: 'SCHOOL',
          name: '学校勤工助学'
        }, {
          type: 'FINANCE_OFFICE',
          name: '财务处'
        }],
        curNodeList: [],
        curNode: null,
        curNodeId: ''
      }
    },
    computed: {
      allowBatch: function () {
        return this.curNode && this.curNode.allowBatchOperation
      },
      allowReject: function () {
        return this.curNode && this.curNode.allowReject
      },
      tableCheckedIds: function () {
        var arr = []
        this.tableCheckedList.forEach((record) => {
          if (record.currentNodeStatus === 'TODO') {
            arr.push(record.id)
          }
        })
        return arr
      },
      manageTableColumnsJson: function () {
        var j = {}
        this.manageTableColumns.forEach((ele) => {
          j[ele.id] = ele
        })
        return j
      }
    },
    methods: {
      _checkField: function (field) {
        var index = this.exportFieldList.indexOf(field.id)
        if (index >= 0) {
          this.exportFieldList.splice(index, 1)
        } else {
          this.exportFieldList.push(field.id)
        }
      },
      _tableChecked: function (recordArr) {
        this.tableCheckedList = recordArr
      },
      _export: function () {
        // 待对接
        this.$waiting.show()
        var param = this.$refs.salaryTable.tableSearchFields || {}
        param.nodeId = this.curNode.id
        param.nodeType = this.curNode.type
        param.ids = []
        this.tableCheckedList.forEach((ele) => {
          param.ids.push(ele.id)
        })
        sAjax({
          url: `/api/pwps/workflow/runtime/salary/instances/export`,
          type: 'get',
          data: param,
          // data: {
          //   // fieldList: this.exportFieldList,// array of string
          //   ids: this.tableCheckedIds,
          //   param: param
          // },
          success: (data) => {
            if (data.state) {
              this.$toast('文件获取成功，开始下载...')
              window.location.href = `/downloads/pwps/workflow/runtime/download?key=${data.data}`
            } else {
              this.$toast(data.message)
            }
          }
        }).always(() => {
          this.$waiting.close()
        })
      },
      _submit: function (way, list) {
        if (list.length === 0) {
          this.$toast('当前没有可操作的数据')
          return
        }
        if (way === 'pass') {
          if (window.confirm('确定通过吗？')) {
            this.$waiting.show()
            sAjax({
              url: '/api/pwps/workflow/runtime/salary/instances/success',
              type: 'post',
              data: {
                ids: list
              },
              success: (data) => {
                if (data.state) {
                  this.$toast('操作成功')
                  this._refreshTable(this)
                  this.checkRecord.modalShow = false
                } else {
                  this.$toast(data.message)
                }
              }
            }).always(() => {
              this.$waiting.close()
            })
          }
        } else if (way === 'unpass') {
          this.showUnpassOpinionModal = true
          this.unpassIds = list
        }

      },
      _revoke: function () {
        if (window.confirm('确定撤回吗？')) {
          sAjax({
            url: '/api/pwps/workflow/runtime/salary/instances/' + this.positionId + '/revoke',
            type: 'post',
            success: (data) => {
              if (data.state) {
                this._refreshTable(this)
                this.checkRecord.modalShow = false
                this.$toast('撤回成功')
              } else {
                this.$toast(data.message)
              }
            }
          })
        }
      },
      submitUnpassOpinion: function () {
        if (!this.opinion) {
          return this.$toast('请输入不通过的意见')
        }
        sAjax({
          url: '/api/pwps/workflow/runtime/salary/instances/failed',
          type: 'post',
          data: {
            ids: this.unpassIds,
            opinion: this.opinion
          },
          success: (data) => {
            if (data.state) {
              this.showUnpassOpinionModal = false
              this._refreshTable(this)
              this.checkRecord.modalShow = false
              this.$toast('操作成功')
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _refreshTable: function (obj) {
        obj.timeStamp = createTime()
        this.tableCheckedList = []
      },
      afterSelected(record) {
        let obj = this.curNodeList.find(item => item.id == record.val)
        this.curNode = obj
      }
    },
    created: function () {
      sAjax({
        url: `/api/pwps/workflow/runtime/salary/nodes`,
        type: 'get',
        success: (data) => {
          if (data.state) {
            this.curNode = data.data[0]
            this.curNodeId = data.data[0].id
            this.curNodeList = data.data
            this.curNodeList.forEach((item, index) => {
              let obj = this.nodeList.find(o => o.type == item.type)
              item.name = obj.name
            })
          } else {
            this.$toast(data.message)
          }
        }
      })
      sAjax({
        url: '/api/pwps/workflow/runtime/salary/search/options',
        type: 'get',
        success: (data) => {
          if (data.state) {
            if (data.data) {
              this.manageTableColumnsJson['auditStatus'].search.data.options = data.data['auditStatus'] || []
            }
          } else {
            this.$toast(data.message)
          }
        }
      })
    }
  }
</script>
<style lang="less">
.salary-grant-check {
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
  .modal-body {
    padding: 0 12px;
    .table-container {
      box-shadow: none;
    }
  }
  .field-list {
    padding: 10px 0;
    user-select: none;
    .field-item {
      display: inline-block;
      margin: 5px 10px;
      color: #999;
      cursor: pointer;
      span {
        display: inline-block;
        margin-left: 4px;
        line-height: 26px;
      }
      &.active {
        color: #303133;
      }
    }
  }
  .table-options-container {
    position: relative;
    overflow: hidden;
  }
  .unpass-modal-textarea {
    width: 100%;
    resize: none;
    margin-top: 10px;
    padding: 5px;
    border: 0 solid #e0e0e0;
    outline: none;
  }
  .batch-options {
    position: absolute;
    left: 0;
    top: -40px;
    transition: all 0.1s ease;
    span {
      line-height: 32px;
    }
    &.active {
      top: 0;
    }
  }
}
</style>
