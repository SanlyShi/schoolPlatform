<template>
  <div class="work-study-flowset">
    <div class="container-fluid">
      <div class="tab_wrap">
        <!-- <div class="btn-group">
          <button
            class="btn tab"
            :class="{
              active: tab === item.id
            }"
            @click="tab = item.id"
            v-for="(item, i) in tabList"
            :key="i"
          >{{item.name}}</button>
        </div> -->
        <ul class="nav nav-tabs relationClassManage-tab">
          <li  :class="{
              active: tab === item.id
            }"
            @click="tab = item.id"
            v-for="(item, i) in tabList"
            :key="i"><a>{{item.name}}</a></li>
        </ul>
        <button
          class="btn submit-btn"
          :class="{
            active: isChange
          }"
          @click="_submit"
        >保存</button>
      </div>
      <div class="row" v-show="tab === 'flow'">
        <div class="flow-nodes-list">
          <label>节点列表：</label>
          <span
            class="flow-node"
            v-for="(node,nid) in nodeList"
            :key="nid"
            :data-type="node.type"
            @dragstart="_dragStart"
            draggable="true"
          >{{node.name}}</span>
        </div>
        <div class="flow-container" v-for="(flow, fid) in flows" :key="fid">
          <label>{{flow.name}}</label>
          <div class="flow-content" :data-type="flow.type" @dragover="_dragover" @drop="_drop">
            <div class="flow-item" v-for="(node, nid) in flow.nodes" :key="nid">
              <i
                class="maticon pull-left flow-arrow"
                v-html="icons('arrow_forward')"
                v-if="nid !== 0"
              ></i>
              <span class="flow-node">
                {{node.nodeType.name}}
                <i
                  class="maticon pull-right remove"
                  v-html="icons('cancel')"
                  @click="_remove(flow,node)"
                  v-if="nid !== 0"
                ></i>
                <div class="pull-right options" v-if="nid !== 0">
                  <i
                    class="maticon pull-left"
                    title="批量操作"
                    v-html="icons(node.allowBatchOperation?'check_box':'check_box_outline_blank')"
                    @click="node.allowBatchOperation = !node.allowBatchOperation"
                  ></i>
                  <!-- 驳回功能后续添加 -->
                  <!-- <i class="maticon pull-left" title="驳回" v-html="icons(node.allowReject?'check_box':'check_box_outline_blank')" @click="node.allowReject = !node.allowReject"></i> -->
                </div>
              </span>
            </div>
          </div>
        </div>
        <div class="flow-container" v-for="(flow, fid) in publish" :key="fid">
          <div>
            <label>{{flow.name}}</label>
            <span class="flow-tip" v-if="flow.announcement">{{flow.announcement}}</span>
          </div>
          <div class="flow-content" :data-type="flow.type" @dragover="_dragover" @drop="_drop">
            <div class="flow-item" v-for="(node, nid) in flow.nodes" :key="nid">
              <!-- <i
                class="maticon pull-left flow-arrow"
                v-html="icons('arrow_forward')"
                v-if="nid !== 0"
              ></i> -->
              <span class="flow-node">
                {{node.name}}
                <i
                  class="maticon pull-right remove"
                  v-html="icons('cancel')"
                  @click="_remove(flow,node)"
                  v-if="!node.fixed"
                ></i>
                <!-- <div class="pull-right options" v-if="nid !== 0">
                  <i
                    class="maticon pull-left"
                    title="批量操作"
                    v-html="icons(node.allowBatchOperation?'check_box':'check_box_outline_blank')"
                    @click="node.allowBatchOperation = !node.allowBatchOperation"
                  ></i> -->
                  <!-- 驳回功能后续添加 -->
                  <!-- <i class="maticon pull-left" title="驳回" v-html="icons(node.allowReject?'check_box':'check_box_outline_blank')" @click="node.allowReject = !node.allowReject"></i> -->
                <!-- </div> -->
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="row jobs-list" v-show="tab === 'job'">
        <div class="job-item" v-for="(type, ti) in jobTypes" :key="ti">
          <span v-if="ti === 0">1人仅可拥有</span>
          <input type="number" min="0" v-model="type.maxNumber">
          <span>个</span><span>{{type.positionTypeLabel}}</span>
          <span v-if="ti<jobTypes.length-1">，</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { sAjax, translation } from '../../assets/utils/utils.js'
  export default {
    data: function () {
      return {
        tab: 'flow',
        tabList: [{
          id: 'flow',
          name: '勤工助学设置'
        },{
          id: 'job',
          name: '岗位类型人数限制'
        }],
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
        setList: ['flows', 'publish'],
        flows: [],
        publish: [],
        oldSettingStr: '',
        oldSettingStr1: '',
        oldSettingStr2: '',
        dragNodeType: '',
        jobTypes: [],
        jobForm: {}
      }
    },
    computed: {
      nodeListJson: function () {
        var nodeListJson = {}
        this.nodeList.forEach((node) => {
          this.$set(nodeListJson, node.type, node)
        })
        return nodeListJson
      },
      flowsJson: function () {
        var flowsJson = {}
        this.flows.forEach((flow) => {
          this.$set(flowsJson, flow.type, flow)
        })
        return flowsJson
      },
      publishJson: function () {
        var publishJson = {}
        this.publish.forEach((flow) => {
          this.$set(publishJson, flow.type, flow)
        })
        return publishJson
      },
      isChange: function () {
        var state = false
        if (this.tab === 'flow') {
          if (this.oldSettingStr || this.oldSettingStr1) {
            state = this.oldSettingStr !== JSON.stringify(this.flows) || this.oldSettingStr1 !== JSON.stringify(this.publish)

          }
        } else if (this.tab === 'job') {
          if (this.oldSettingStr2) {
            state = this.oldSettingStr2 !== JSON.stringify(this.jobTypes)
          }
        }
        return state
      }
    },
    methods: {
      _initFlows: function () {
        sAjax({
          url: `/api/pwps/workflow/nodes`,
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.nodeList = data.data
            } else {
              this.$toast(data.message)
            }
          }
        })
        sAjax({
          url: `/api/pwps/workflow/settings`,
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.flows = data.data
              this.oldSettingStr = JSON.stringify(data.data)
            } else {
              this.$toast(data.message)
            }
          }
        })
        this.getWorkSetting()
      },
      getWorkSetting() {
        sAjax({
          url: `/api/pwps/work/setting`,
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.publish = data.data
              this.oldSettingStr1 = JSON.stringify(data.data)
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _initJobTypes: function () {
        sAjax({
          url: `/api/pwps/config/student/limit`,
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.jobTypes = data.data || []
              this.jobTypes.forEach((type) => {
                type.maxNumber += ''
              })
              this.oldSettingStr2 = JSON.stringify(data.data)
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _dragStart: function (e) {
        e.dataTransfer.setData("jobId", e.target.id)
        this.dragNodeType = e.target.getAttribute('data-type')
      },
      _dragover: function (e) {
        e.preventDefault()
      },
      _drop: function (e) {
        var type = $(e.target).attr('data-type') || $(e.target).parents('.flow-content').attr('data-type')
        if(this.publishJson[type]) {
          let hasData = this.publishJson[type].nodes.filter((item) => { return item.id == this.nodeListJson[this.dragNodeType].id})
          if(hasData.length == 0) {
            var index = this.publishJson[type].nodes ? this.publishJson[type].nodes.length : 0
            this.publishJson[type] && this.publishJson[type].nodes.push({
              id: this.nodeListJson[this.dragNodeType].id,
              type: this.nodeListJson[this.dragNodeType].type,
              name: this.nodeListJson[this.dragNodeType].name
            })
          } else {
            this.$toast('您已添加该单位')
          }
          
        } else if (this.flowsJson[type]) {
          var index = this.flowsJson[type].nodes ? this.flowsJson[type].nodes.length : 0
          this.flowsJson[type] && this.flowsJson[type].nodes.push({
            nodeType: {
              id: this.nodeListJson[this.dragNodeType].id,
              type: this.nodeListJson[this.dragNodeType].type,
              name: this.nodeListJson[this.dragNodeType].name
            },
            nodeNo: index,
            statusType: 'PROCESS',
            allowReject: true,
            allowBatchOperation: true
          })
        }
      },
      _remove: function (flow, node) {
        var index = -1
        flow.nodes.forEach((ele, i) => {
          if (ele.nodeNo === node.nodeNo) {
            index = i
          }
        })
        flow.nodes.splice(index, 1)
      },
      _submit: function () {
        if (!this.isChange) {
          this.$toast('暂无变更，无需保存')
          return
        }
        if (this.tab === 'flow') {
          this._submitAjax(false, (data) => {
            this.oldSettingStr = JSON.stringify(this.flows)
            if (data.success) {
              this.$toast('保存成功')
            } else {
              if (confirm('保存成功,是否废弃未处理的表单？')) {
                this._submitAjax(true, () => {
                  this.$toast('操作成功')
                })
              }
            }
          })
          let publishNodes = this.publish[0].nodes.map((item)=> item.id)
          sAjax({
            url: `/api/pwps/work/setting`,
            type: 'post',
            data: {
              id: this.publish[0].id,
              nodes: publishNodes,
            },
            success: (res) => {
              if (res.state) {
              } else {
                this.$toast(res.message)
              }
            }
          })
        } else if (this.tab === 'job') {
          sAjax({
            url: `/api/pwps/config/student/limit`,
            type: 'post',
            data: this.jobTypes,
            success: (res) => {
              if (res.state) {
                this.oldSettingStr2 = JSON.stringify(this.jobTypes)
                this.$toast('保存成功')
              } else {
                this.$toast(res.message)
              }
            }
          })
        }
      },
      _submitAjax: function (reset, cb) {
        sAjax({
          url: `/api/pwps/workflow/settings`,
          type: 'post',
          data: {
            flows: this.flows,
            reset: reset,
          },
          success: (res) => {
            if (res.state) {
              cb && cb(res.data)
            } else {
              this.$toast(res.message)
            }
          }
        })
      },
    },
    created: function () {
      this._initFlows()
      this._initJobTypes()
    }
  }
</script>
<style lang="less">
.work-study-flowset {
  position: relative;
  height: 100%;
  background: #fff;
  overflow: hidden;
  overflow-y: auto;
  user-select: none;
  .flow-page {
    height: 100%;
    background: #fff;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
  }
  .tab_wrap{
    position: relative;
    .nav-tabs{
     width:100%;
     a {
       color: #555;
       cursor: pointer;
     }
     .active a{
       color: #298df7;
     }
    }
    .submit-btn {
      position: absolute!important;
      top:5px;
      right:5px;
    }
  }
  .flow-head {
    height: 64px;
    background: #ffffff;
    border-bottom: 1px solid #e0e0e0;
    padding: 14px 24px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    .flow-head-title {
      font-size: 16px;
    }
    .tab {
      outline: none;
      transition: all 0.1s ease-in-out;
      &:hover,
      &.active {
        color: #fff;
        background: #298df7;
      }
    }
    .submit-btn {
      
    }
  }
  .flow-nodes-list {
    padding: 10px 24px;
    position: sticky;
    top: 0;
    z-index: 100;
    background: #fff;
    label {
      font-size: 16px;
    }
  }
  .flow-tip {
    font-size: 12px;
    color: #999;
    margin-left: 20px;
  }
  .flow-container {
    padding: 20px 24px;
    label {
      font-size: 16px;
    }
    .flow-content {
      min-height: 60px;
      padding: 6px 10px;
      border: 1px solid #e0e0e0;
      border-radius: 3px;
      .flow-item {
        display: inline-block;
      }
      .flow-arrow {
        margin-top: 12px;
        font-size: 20px;
      }
      .flow-node {
        background: #f0f0f0;
        border: none;
        cursor: pointer;
      }
    }
  }
  .flow-node {
    position: relative;
    display: inline-block;
    padding: 8px 36px;
    margin: 10px 16px;
    background: #fff;
    border-radius: 3px;
    border: 1px solid #929292;
    // box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.12), 0 4px 4px 0 rgba(0, 0, 0, 0.12);
    transition: all 0.1s ease;
    cursor: move;
    &:hover {
      background: #f0f0f0;
      .remove,
      .options {
        opacity: 1;
      }
    }
    .remove {
      margin-left: 18px;
      margin-right: -30px;
      font-size: 18px;
      color: #666;
      cursor: pointer;
      opacity: 0;
      transition: all 0.3s ease;
      &:hover {
        color: rgb(255, 68, 0);
      }
    }
    .options {
      position: absolute;
      left: 0;
      top: 0;
      width: 20px;
      opacity: 0;
      transition: all 0.3s ease;
      i {
        font-size: 18px;
        // color: #298df7;
      }
    }
  }
  .jobs-list {
    padding: 20px 24px;
    .job-item {
      display: inline-block;
      // width: 300px;
      padding: 10px 0;
      font-size: 20px;
      .input-group-addon {
        width: 135px;
        text-align: right;
        background: transparent;
        border: none;
      }
      input {
        width: 52px;
        padding: 0;
        text-align: right;
        border: none;
        box-shadow: none;
        outline: none;
        border-radius: 0;
        border-bottom: 2px solid #298df7;
      }
    }
  }
}
</style>
