<template>
  <div>
    <div class="back" @click="backToList">
      <i class="el-icon-back"></i>返回
    </div>
    <div class="module-container">
      <base-info v-model="ojf"></base-info>
      <units-info v-model="ojf.units" v-loading="loading" @show-ojf-unit-apply="showOjfUnitApply"></units-info>
      <module-container actions :loader="loading">
        <el-button type="primary" size="large" v-if="hasApplied" @click="showMyApplyInfo">查看我的参会信息</el-button>
        <el-button type="primary" size="large" v-else-if="isMyUnitDisabled" disabled>单位已被停用</el-button>
        <el-button type="primary" size="large" v-else-if="myApplyInfo" @click="showMyApplyInfo">查看我的申请</el-button>
        <el-button type="info" size="large" disabled v-else-if="!this.ojf.isApplying()">不在报名时间内</el-button>
        <el-button type="primary" size="large" v-else @click="toApply">申请</el-button>
      </module-container>
    </div>
  </div>
</template>

<script>
import { MessageBox } from 'element-ui'
import { Ojf, OjfUnitApply } from './types'
import { UnitApplyAuditStatus, UnitApplyAuditStatusLabel } from './types/dict'
import ModuleContainer from '../../components/moduleContainer.vue'
import { getMyUnit, checkUnitDisabled } from '../../api/api'
import api from '../../api/onlineJobFair'
import BaseInfo from './components/baseInfo.vue'
import UnitsInfo from './components/unitsInfo.vue'

export default {
  props: {
    ojf: Object
  },
  components: {
    ModuleContainer,
    BaseInfo,
    UnitsInfo
  },
  data() {
    return {
      loading: false,
      showOpLogs: false,
      myUnit: null,
      myApplyInfo: null,
      opLogDataUrl: ``,
      isMyUnitDisabled: true
    }
  },
  computed: {
    hasApplied() {
      if (this.myApplyInfo && this.myApplyInfo.status === UnitApplyAuditStatus.PASSED) {
        return true
      }
      return false
    },
    canApply() {
      return !this.hasApplied && this.ojf.isApplying() && !this.isMyUnitDisabled
    },
  },
  async created() {
    await Promise.all([
      this.initUnits(),
      this.initMyUnit(),
      this.initMyUnitDisabled(),
      // this.initMyApplyInfo()
    ])
    this.loading = false
  },
  methods: {
    async initUnits() {
      const { state, message, data } = await api.get(this.ojf.id)
      if (state) {
        // 先清空再赋值，保持引用不变
        this.ojf.units.splice(0, this.ojf.units.length)
        this.ojf.units.push(...Ojf.fromApi(data).units)
      } else {
        this.$toast(message)
      }
    },
    async initMyUnit() {
      const { state, message, data } = await getMyUnit()
      if (state) {
        this.myUnit = data
        this.initMyApplyInfo()
      } else {
        this.$toast(message)
      }
    },
    async initMyUnitDisabled() {
      const { state, message, data } = await checkUnitDisabled()
      if (state) {
        this.isMyUnitDisabled = !!data
      } else {
        this.$toast(message)
      }
    },
    async initMyApplyInfo() {
      if(this.$route.path == '/employment') {
        var { state, code, message, data } = await api.getOjfUnitApplyById(this.myUnit.id)
      }else {
        var { state, code, message, data } = await api.getMyOjfUnitApply(this.ojf.id)
      }
      if (state) {
        if (data) {
          this.myApplyInfo = OjfUnitApply.fromApi(data)
        }
      } else {
        if (code === '50001') {
          this.myApplyInfo = null
        } else {
          this.$toast(message)
        }
      }
    },
    async showMyApplyInfo() {
      this.$emit('to-apply-detail', { ojf: this.ojf, ojfUnitApplyId: this.myApplyInfo.id, from: 'DETAIL' })
    },
    showOjfUnitApply(ojfUnitApply, index) {
      this.$emit('to-apply-detail', { ojf: this.ojf, ojfUnitApplyId: ojfUnitApply.id, from: 'DETAIL', hideLog: true })
    },
    toApply() {
      this.$emit('to-apply', { myUnit: this.myUnit })
    },
    backToList() {
      let options = {}
      this.$emit('back-to-list', options)
    }
  }
}
</script>
