<template>
  <div>
    <div class="module-container">
      <el-button
        style="color:#666;"
        type="text"
        icon="el-icon-back"
        @click="back"
      >返回</el-button>
    </div>
    <div class="page-title-status">
      <p v-if="!hideStatus"><span class="title">审核状态：</span><el-tag v-loading="loading" :type="auditStatusLabelType" effect="dark">{{ UnitApplyAuditStatusLabel[this.ojfUnitApply.status] }}</el-tag></p>
      <p v-if="auditReasonVisiable"><span class="title">审核意见：</span><span v-loading="loading">{{ this.ojfUnitApply.auditReason }}</span></p>
      <p><span class="title">网招会名称：</span><span>{{ ojf.name }}</span></p>
      <div class="operations-container-action">
        <el-button type="text" @click="toEditPassedInfo" v-if="canEditPassedInfo && !passedInfoEditing">编辑</el-button>
        <el-button type="text" @click="cancelEditPassedInfo" v-if="passedInfoEditing">取消编辑</el-button>
        <el-button type="text" @click="showOpLogs = !showOpLogs" v-if="!hideOplog">操作日志</el-button>
      </div>
    </div>
    <module-loader v-loading="loading" v-if="loading"></module-loader>
    <div class="module-container" v-else>
      <unit-info v-model="ojfUnitApply" :edit="canEditApplyInfo" :rules="isManager ? managerUnitApplyRules : {}"></unit-info>
      <positions-info v-model="ojfUnitApply.positions" :edit="canEditApplyInfo"></positions-info>
      <recruitment-info v-model="ojfUnitApply.recruitment" :edit="canEditApplyInfo"></recruitment-info>
      <module-container class="audit-actions" actions v-if="isUnit">
        <el-button type="primary" size="large" @click="resubmitApply" v-if="[UnitApplyAuditStatus.COUNTERMAND, UnitApplyAuditStatus.REJECT].includes(ojfUnitApply.status)">重新提交</el-button>
        <el-button type="danger" plain size="large" @click="countermandApply" v-if="ojfUnitApply.status === UnitApplyAuditStatus.AUDITING">撤回</el-button>
      </module-container>
      <module-container class="audit-actions" actions v-if="isManager && ojfUnitApply.status === UnitApplyAuditStatus.AUDITING">
        <el-button type="danger" plain size="large" @click="rejectApply">驳回</el-button>
        <el-button size="large" @click="disagreeApply">不通过</el-button>
        <el-button type="primary" size="large" @click="agreeApply">通过</el-button>
      </module-container>
      <module-container actions v-if="passedInfoEditing">
        <el-button size="large" @click="cancelEditPassedInfo">取消</el-button>
        <el-button type="primary" size="large" @click="saveEditPassedInfo" v-loading="savingPassedInfo">保存</el-button>
      </module-container>

      <div class="operations-container" :class="{ show: showOpLogs }" v-if="!hideOplog">
        <oplog :dataUrl="opLogDataUrl" v-if="showOpLogs"></oplog>
      </div>
    </div>
  </div>
</template>

<script>
import { MessageBox } from 'element-ui'
import UnitInfo from '../../components/unitInfo.vue'
import PositionsInfo from '../../components/positionsInfo.vue'
import RecruitmentInfo from '../../components/recruitmentInfo.vue'
import Oplog from '../../components/oplog.vue'
import ModuleContainer from '../.././components/moduleContainer.vue'
import ModuleLoader from '../.././components/moduleLoader.vue'
import api from '../../api/onlineJobFair'
import { getMyUnit } from '../../api/api'
import { Ojf, OjfUnitApply } from './types'
import { UnitApplyAuditStatus, UnitApplyAuditStatusLabel, UnitApplyAuditStatusLabelColorType } from './types/dict'

export default {
  props: {
    isManager: Boolean,
    isUnit: Boolean,
    ojf: Object,
    ojfUnitApplyId: Number,
    showOplog: Boolean,
    edit: Boolean,
    from: String,
    hideStatus: Boolean,
    hideOplog: Boolean,
    onlyLook: Boolean,
  },
  components: {
    ModuleContainer,
    ModuleLoader,
    UnitInfo,
    PositionsInfo,
    RecruitmentInfo,
    Oplog
  },
  data() {
    return {
      UnitApplyAuditStatus,
      UnitApplyAuditStatusLabel,
      loading: true,
      ojfUnitApply: new OjfUnitApply(),
      ojfUnitApplyTemp: null,
      showOpLogs: this.showOplog || false,
      passedInfoEditing: false,
      savingPassedInfo: false,
      shouldRefreshTable: false,
      managerUnitApplyRules: {
        desc: {
          readonly: true
        }
      },
      opLogDataUrl: `/api/employment/manage/networkMeeting/getOperationDetailList?participantId=${this.ojfUnitApplyId}`
    }
  },
  computed: {
    auditStatusLabelType() {
      return UnitApplyAuditStatusLabelColorType[this.ojfUnitApply.status]
    },
    canEditApplyInfo() {
      if (this.passedInfoEditing) {
        return true
      }
      if (this.isManager) {
        if (this.ojfUnitApply.status === UnitApplyAuditStatus.AUDITING) {
          return true
        }
        return false
      } else if (this.isUnit) {
        return [UnitApplyAuditStatus.COUNTERMAND, UnitApplyAuditStatus.REJECT].includes(this.ojfUnitApply.status)
      } else {
        console.warn('invalid status', this.ojfUnitApply.status, this.$props)
        return false
      }
    },
    canAuditing() {
      return this.isManager && this.ojfUnitApply.status === UnitApplyAuditStatus.AUDITING
    },
    auditReasonVisiable() {
      return [UnitApplyAuditStatus.FAILED, UnitApplyAuditStatus.REJECT].includes(this.ojfUnitApply.status)
    },
    canEditPassedInfo() {
      return this.isManager && this.ojfUnitApply.status === UnitApplyAuditStatus.PASSED && this.edit
    }
  },
  async created() {
    await this.initOjf()
    await this.initOjfUnitApply()
    this.loading = false
  },
  methods: {
    async initOjf() {
      if (this.ojf.initialized) {
        return
      }
      let getOjf = api.get;
      if (this.onlyLook) {
        getOjf = api.getPublic;
      }
      const { state, message, data } = await getOjf(this.ojf.id)
      if (state) {
        this.ojf = Ojf.fromApi(data)
      } else {
        this.$toast(message)
      }
    },
    async initOjfUnitApply() {
      let getOjfUnitApply = api.getOjfUnitApplyById;
      if (this.onlyLook) {
        getOjfUnitApply = api.getPublicOjfUnitApplyById;
      }
      const { state, message, data } = await getOjfUnitApply(this.ojfUnitApplyId)
      if (state) {
        this.ojfUnitApply = OjfUnitApply.fromApi(data)
        this.ojfUnitApply.ojf = this.ojf
      } else {
        this.$toast(message)
      }
    },
    async resubmitApply() {
      const { state, message, data } = await api.apply(this.ojfUnitApply)
      if (state) {
        this.$toast('重新提交成功')
        this.ojfUnitApply.status = UnitApplyAuditStatus.AUDITING
        this.shouldRefreshTable = true
      } else {
        this.$toast(message)
      }
    },
    async countermandApply() {
      MessageBox.confirm('确认撤回申请?').then(async () => {
        const { state, message, data } = await api.countermand(this.ojfUnitApply.id)
        if (state) {
          this.ojfUnitApply.status = UnitApplyAuditStatus.COUNTERMAND
          this.shouldRefreshTable = true
          this.$toast('撤回成功')
        } else {
          this.$toast(message)
        }
      })
    },
    async rejectApply() {
      MessageBox.prompt('请填写驳回意见', '驳回').then(async ({ value }) => {
        const { state, message, data } = await api.reject(this.ojfUnitApply.id, value)
        if (state) {
          this.ojfUnitApply.status = UnitApplyAuditStatus.REJECT
          this.ojfUnitApply.auditReason = value
          this.shouldRefreshTable = true
          this.$toast('驳回成功')
        } else {
          this.$toast(message)
        }
      })
    },
    async disagreeApply() {
      MessageBox.prompt('请填写不通过意见', '不通过').then(async ({ value }) => {
        const { state, message, data } = await api.disagree(this.ojfUnitApply.id, value)
        if (state) {
          this.ojfUnitApply.status = UnitApplyAuditStatus.FAILED
          this.ojfUnitApply.auditReason = value
          this.shouldRefreshTable = true
          MessageBox.confirm('不通过成功，是否返回审核列表?').then(() => {
            this.back()
          })
        } else {
          this.$toast(message)
        }
      })
    },
    async agreeApply() {
      MessageBox.confirm('确认同意该申请?').then(async () => {
        const { state, message, data } = await api.agree(this.ojfUnitApply)
        if (state) {
          this.ojfUnitApply.status = UnitApplyAuditStatus.PASSED
          this.shouldRefreshTable = true
          MessageBox.confirm('操作成功，是否返回审核列表?').then(() => {
            this.back()
          })
        } else {
          this.$toast(message)
        }
      })
    },
    toEditPassedInfo() {
      this.passedInfoEditing = true
    },
    async cancelEditPassedInfo() {
      this.loading = true
      await this.initOjfUnitApply()
      this.loading = false
      this.passedInfoEditing = false
    },
   async saveEditPassedInfo() {
      this.savingPassedInfo = true
      const { state, message, data } = await api.upsertOjfUnitApply(this.ojfUnitApply)
      this.savingPassedInfo = false
      if (state) {
        this.$toast('更新成功')
        this.loading = true
        await this.initOjfUnitApply() // 刷新，防止id未更新导致的重复添加问题
        this.loading = false
        this.passedInfoEditing = false
      } else {
        this.$toast(message)
      }
    },
    back() {
      this.$emit('back', { refresh: this.shouldRefreshTable, tableName: 'auditList', from: this.from })
    },
  }
}
</script>

<style lang="less" scoped>

.operations-container {
  top: 0;
}
</style>
