<template>
  <div>
    <div class="back titleBack">
      <div @click="backToList"><i class="el-icon-back" style="display: inline-block"></i>返回</div>
      
      <div class="getTicket">
        <el-button type="primary" @click="downloadTicket">下载入场券</el-button>
      </div>
    </div>

    <div id="pdfDom" class="pdfdom">
      <div style="border: 1px solid #000;">
        
      <div class="title">
        <h5 class="mid" style="font-weight: normal;font-size: 20px;">双选会名称</h5>
        <h3 class="mid">参会通知举办时间：</h3>
        <p class="mid">{{dcw ? dcw.getApplyTimeHtml() : ''}}</p>
      </div>
      <div class="details big">
        参会详情
      </div>
      <div class="th" v-if="unitApplyInfo">
        <el-row>
          <el-col :span='4' >参展单位</el-col>
          <el-col :span='20' >{{unitApplyInfo.name}}</el-col>
        </el-row>
        <el-row>
          <el-col :span='4'>单位地址</el-col>
          <el-col :span='20' >{{unitApplyInfo.address}}</el-col>
        </el-row>
        <el-row>
          <el-col :span='4' >单位联系人</el-col>
          <el-col :span='8' >{{unitApplyInfo.contactPeople}}</el-col>
          <el-col :span='4' >单位电话</el-col>
          <el-col :span='8' >{{unitApplyInfo.contactPhone}}</el-col>
        </el-row>
        <el-row>
          <el-col :span='4' >单位邮箱</el-col>
          <el-col :span='20'>{{unitApplyInfo.email}}</el-col>
        </el-row>
      </div>
      <div class="position big" v-if="unitApplyInfo&&unitApplyInfo.positions.length">
        职位信息
      </div>

      <div class="th" v-if="unitApplyInfo&&unitApplyInfo.positions.length">
        <el-row>
          <el-col :span='4' >职位名称</el-col>
          <el-col :span='8' style="font-weight: bold;">专业要求</el-col>
          <el-col :span='4'>招聘人数</el-col>
          <el-col :span='8' style="font-weight: bold;">工作地点</el-col>
        </el-row>
        <el-row v-for="(item,index) in unitApplyInfo.positions" :key="index">
          <el-col :span='4' style="font-weight: normal;">{{item.positionName}}</el-col>
          <el-col :span='8'>{{item.major}}</el-col>
          <el-col :span='4' style="font-weight: normal;">{{item.recruitNumber}}</el-col>
          <el-col :span='8' >{{item.workplace}}</el-col>
        </el-row>
      </div>
      <div class="position big">
        展会信息
      </div>
      <div class="th">
      <el-row>
        <el-col :span='4' >双选会地点</el-col>
        <el-col :span='20'  v-if="dcw">{{dcw.baseInfo.address}}</el-col>
      </el-row>
      <el-row style="boder-bottom: 1px solid #000;">
        <el-col :span='4' >展会号</el-col>
        <el-col :span='20'  v-if="dcw&&dcw.standInfo.chooseType === 'UNIT'">
          <template>
            <span>{{ unitApplyInfo.stands.map(stand => stand.name).join(' ')}}</span>
          </template>
        </el-col>
        <el-col :span='20'  v-else>
          <template v-if="unitApplyInfo&&unitApplyInfo.stands.length">
            <span>{{ unitApplyInfo.stands.map(stand => stand.name).join(' ')}}</span>
          </template>
          <template v-else>
            <span>等待校方分配</span>
          </template>
        </el-col>
      </el-row>
      </div>
      </div>
    </div>



    <div class="page-title-status">
      <p><span class="title">审核状态：</span><el-tag :type="auditStatusLabelType" effect="dark">{{ auditStatusLabel }}</el-tag></p>
      <p><span class="title">双选会名称：</span><span>{{ dcwName }}</span></p>
      <p><span class="title">双选会时间：</span><span>{{ dcw ? dcw.getApplyTimeHtml() : '' }}</span></p>
    </div>
    <module-loader v-if="loading" v-loading="loading"></module-loader>
    <div class="module-container" v-else>
      <unit-info ref="unitInfo" :dcw="dcw" v-model="unitApplyInfo" :edit="canEditApplyInfo" :rules="isManager ? managerUnitApplyRules : {}"></unit-info>
      <positions-info :dcw="dcw" v-model="unitApplyInfo.positions" :edit="canEditApplyInfo"></positions-info>
      <recruitment-info :dcw="dcw" v-model="unitApplyInfo.recruitment" :edit="canEditApplyInfo"></recruitment-info>
      <stand-info v-model="dcw.standInfo">
        <template slot="start">
          <el-form>
            <el-form-item label="双选会场地">
              <p>{{ dcw.baseInfo.address }}</p>
            </el-form-item>
          </el-form>
        </template>
      </stand-info>
      <module-container inline v-if="dcw.standInfo.chooseType === 'UNIT'" :loader="!standsInitialized" loaderText="正在加载展位信息">
        <stand-picker :dcw="dcw" v-model="stands" published selectable v-if="standsInitialized && canEditApplyInfo"></stand-picker>
        <el-form v-if="!canEditApplyInfo">
          <el-form-item label="展位号">
            <p>{{ unitApplyInfo.stands.map(stand => stand.name).join(' ') }}</p>
          </el-form-item>
        </el-form>
      </module-container>
      <module-container inline v-else>
        <el-form v-if="unitApplyInfo.stands.length">
          <el-form-item label="展位号">
            <p>{{ unitApplyInfo.stands.map(stand => stand.name).join(' ') }}</p>
          </el-form-item>
        </el-form>
        <el-form v-else>
          <el-form-item label="展位号"><p>等待校方分配</p></el-form-item>
        </el-form>
      </module-container>
      <remark-info :dcw="dcw" v-model="unitApplyInfo.remark" :edit="canEditApplyInfo" v-if="dcw.standInfo.chooseType === 'MANAGER'"></remark-info>
      <module-container class="audit-actions" actions v-if="isUnit">
        <el-button type="primary" size="large" @click="submitApply" v-if="!unitApplyInfo.id">提交审核</el-button>
        <el-button type="primary" size="large" @click="resubmitApply" v-if="[UnitApplyAuditStatus.COUNTERMAND, UnitApplyAuditStatus.REJECT].includes(auditStatus)">重新提交</el-button>
        <el-button type="danger" plain size="large" @click="countermandApply" v-if="auditStatus === UnitApplyAuditStatus.AUDITING">撤回</el-button>
      </module-container>
      <module-container class="audit-actions" actions v-if="isManager && auditStatus === UnitApplyAuditStatus.AUDITING">
        <el-button type="danger" plain size="large" @click="rejectApply">驳回</el-button>
        <el-button size="large" @click="disagreeApply">不通过</el-button>
        <el-button type="primary" size="large" @click="agreeApply">通过</el-button>
      </module-container>
    </div>
  </div>
</template>

<script>
import BaseInfo from './components/baseInfo.vue'
import StandInfo from './components/standInfo.vue'
import StandPicker from './components/standPicker.vue'
import UnitInfo from '../../components/unitInfo.vue'
import PositionsInfo from '../../components/positionsInfo.vue'
import RecruitmentInfo from '../../components/recruitmentInfo.vue'
import RemarkInfo from './components/RemarkInfo.vue'

import ModuleContainer from '../.././components/moduleContainer.vue'
import ModuleLoader from '../.././components/moduleLoader.vue'
import api from '../../api/doubleChooseWill'
import { getDict, ScrollTop } from '../../api/api'
import { Dcw, UnitApplyInfo, Stand } from './types'
import { UnitApplyAuditStatus, UnitApplyAuditStatusLabel } from './types/dict'
import { MessageBox } from 'element-ui'

export default {
  props: {
    unitApplyInfoId: Number,
    id: Number,
    dcwName: String,
    auditStatus: Number,
    isUnit: Boolean,
    isManager: Boolean,
  },
  components: {
    ModuleContainer,
    ModuleLoader,
    BaseInfo,
    StandInfo,
    StandPicker,
    UnitInfo,
    PositionsInfo,
    RecruitmentInfo,
    RemarkInfo
  },
  data() {
    return {
      UnitApplyAuditStatus,
      loading: true,
      dcw: null,
      unitApplyInfo: null,
      standsInitialized: false,
      stands: [],
      rules: {
        name: {
          hidden: true
        },
        applyTime: {
          hidden: true
        }
      },
      managerUnitApplyRules: {
        desc: {
          readonly: true
        }
      },
    }
  },
  computed: {
    auditStatusLabel() {
      return UnitApplyAuditStatusLabel[this.auditStatus]
    },
    auditStatusLabelType() {
      let labelColorType = ''
      switch (this.auditStatus) {
        case UnitApplyAuditStatus.AUDITING:
          labelColorType = 'warning'
          break
        case UnitApplyAuditStatus.PASSED:
          labelColorType = 'success'
          break
        case UnitApplyAuditStatus.FAILED:
          labelColorType = 'danger'
          break
        case UnitApplyAuditStatus.COUNTERMAND:
          labelColorType = 'warning'
          break
        case UnitApplyAuditStatus.DISABLED:
          labelColorType = 'info'
          break
        case UnitApplyAuditStatus.REJECT:
          labelColorType = 'warning'
          break
      }
      return labelColorType
    },
    canEditApplyInfo() {
      if (this.isManager) {
        return this.auditStatus === UnitApplyAuditStatus.AUDITING
      } else if (this.isUnit) {
        return [UnitApplyAuditStatus.COUNTERMAND, UnitApplyAuditStatus.REJECT].includes(this.auditStatus)
      } else {
        console.warn('invalid status', this.auditStatus, this.$props)
        return false
      }
    },
    canAuditing() {
      return this.isManager && this.auditStatus === UnitApplyAuditStatus.AUDITING
    }
  },
  async created() {
    await this.initDcw()
    await this.initUnitApplyInfo()
    await this.initStands()
    this.loading = false
  },
  methods: {
    downloadTicket() {
      this.getPdf('入场券')
    },
    async initDcw() {
      const { state, message, data } = await api.dcw.get(this.id)
      if (state) {
        this.dcw = Dcw.fromApi(data)
      } else {
        this.$toast(message)
      }
    },
    async initUnitApplyInfo() {
      const { state, message, data } = await api.dcw.getUnitApplyInfo(this.unitApplyInfoId)
      if (state) {
        this.unitApplyInfo = UnitApplyInfo.fromApi(data)
      } else {
        this.$toast(message)
      }
    },
    async initStands() {
      const selectedStands = this.unitApplyInfo.stands.map(stand => stand.id)
      this.stands = this.dcw.standInfo.stands.map(dcwStand => {
        let stand = new Stand(dcwStand)
        if (selectedStands.includes(dcwStand.id)) {
          stand.selected = true
          stand.occupied = false
          stand.applied = false
        }
        return stand
      })
      this.standsInitialized = true
    },
    backToList() {
      this.$emit('back-to-list', { refresh: true, tableName: 'auditList' })
    },
    async submitApply() {
      alert('什么鬼')
      const { state, message, data } = await api.dcw.apply(this.dcw.id, this.unitApplyInfo)
      if (state) {
        this.$toast('提交成功')
      } else {
        this.$toast(message)
      }
    },
    async resubmitApply() {
      try {
        await this.$refs.unitInfo.validate()
      } catch (err) {
        ScrollTop(0, 200)
        return
      }
      this.unitApplyInfo.stands = this.stands.filter(stand => stand.selected)
      if (this.dcw.standInfo.chooseType === 'UNIT' && !this.unitApplyInfo.stands.length) {
        this.$toast('您还未选择展位')
        return
      }
      const { state, message, data } = await api.dcw.resubmit(this.unitApplyInfo)
      if (state) {
        this.$toast('提交成功')
        this.auditStatus = UnitApplyAuditStatus.AUDITING
      } else {
        this.$toast(message)
      }
    },
    async countermandApply() {
      MessageBox.confirm('确认撤回申请?').then(async () => {
        const { state, message, data } = await api.dcw.countermand(this.unitApplyInfo.id)
        if (state) {
          this.auditStatus = UnitApplyAuditStatus.COUNTERMAND
          // TODO to top
          this.$toast('撤回成功')
        } else {
          this.$toast(message)
        }
      })
    },
    async rejectApply() {
      MessageBox.prompt('请填写驳回意见', '驳回').then(async ({ value }) => {
        const { state, message, data } = await api.dcw.reject(this.unitApplyInfo.id, value)
        if (state) {
          this.auditStatus = UnitApplyAuditStatus.REJECT
          MessageBox.confirm('驳回成功，是否返回审核列表?').then(() => {
            this.backToList()
          })
        } else {
          this.$toast(message)
        }
      })
    },
    async disagreeApply() {
      MessageBox.prompt('请填写不通过意见', '不通过').then(async ({ value }) => {
        const { state, message, data } = await api.dcw.disagree(this.unitApplyInfo.id, value)
        if (state) {
          this.auditStatus = UnitApplyAuditStatus.FAILED
          MessageBox.confirm('操作成功，是否返回审核列表?').then(() => {
            this.backToList()
          })
        } else {
          this.$toast(message)
        }
      })
    },
    async agreeApply() {
      this.unitApplyInfo.stands = this.stands.filter(stand => stand.selected)
      MessageBox.confirm('确认同意该申请?').then(async () => {
        const { state, message, data } = await api.dcw.agree(this.unitApplyInfo)
        if (state) {
          this.auditStatus = UnitApplyAuditStatus.PASSED
          MessageBox.confirm('操作成功，是否返回审核列表?').then(() => {
            this.backToList()
          })
        } else {
          this.$toast(message)
        }
      })
    }
  }
}
</script>
<style lang="less">
  .titleBack {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%!important;
  }
  .pdfdom {
    position: absolute;
    z-index: -1;
    width: 100%;
    font-family: 'Microsoft YaHei';
    padding: 15px;
  }
  #pdfDom {
    .big {
      font-size: 24px;
      line-height: 100px;
      font-weight: bold;
      border-right: 1px solid #000;
    }
    .title {
      text-align: center;
      border: 1px solid #000;
      p {
        margin-top: 20px;
      }
    }
    .mid {
      line-height: 50px;
      font-weight: bold;
      font-size: 24px;
     
    }
    .details,.position {
      border: 1px solid #000;
      text-align: center;
     
    }
    .th {
      .el-row  {
        .el-col {
          line-height: 40px;
          height: 40px;
          border: 1px solid #000;
          padding-left: 20px;
          // margin: -1px 0 -1px -1px;
        }
        .el-col-4 {
          font-weight: bold;
        }
      }
    }
  }
</style>