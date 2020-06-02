<template>
  <div id="studentOjfDetails" v-if="page === 'DETAIL'">
    <div class="studentOjfDetails">
      <div class="module-container">
        <el-button
          style="color:#666;"
          type="text"
          icon="el-icon-back"
          @click="back"
        >返回</el-button>
        <module-container loader v-if="!ojf"></module-container>
        <div v-else>
          <base-info v-model="ojf"></base-info>
          <units-info v-model="ojf.units" @show-ojf-unit-apply="showOjfUnitApply"></units-info>
          <module-container actions :loader="loading">
            <el-button type="primary" size="large" v-if="hasApplied" @click="showMyApplyInfo">查看我的参会信息</el-button>
            <el-button type="primary" size="large" v-else-if="isMyUnitDisabled" disabled>单位已被停用</el-button>
            <el-button type="primary" size="large" v-else-if="myApplyInfo" disabled>申请中</el-button>
            <el-button type="info" size="large" disabled v-else-if="!this.ojf.isApplying()">不在报名时间内</el-button>
            <el-button type="primary" size="large" v-else-if="myUnit" @click="toApply">申请</el-button>
          </module-container>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="page === 'UNIT_APPLY_DETAIL'">
    <unit-ojf-apply-detail :ojf="ojf" :ojf-unit-apply-id="ojfUnitApplyId" @back="page = 'DETAIL'" hide-status hide-oplog only-look></unit-ojf-apply-detail>
  </div>
  <div v-else-if="page === 'APPLY'">
    <unit-ojf-apply :ojf="ojf" :my-unit="myUnit" @back-to-list="page = 'DETAIL'" @back-to-my-list="bakcToMyList"></unit-ojf-apply>
  </div>
</template>

<script>
import { MessageBox } from 'element-ui'
import { Ojf, OjfUnitApply } from './types'
import { UnitApplyAuditStatus } from './types/dict'
import ModuleContainer from '../../components/moduleContainer.vue'
import api from '../../api/onlineJobFair'
import { getMyUnit, checkUnitDisabled } from '../../api/api'
import BaseInfo from './components/baseInfo.vue'
import UnitsInfo from './components/unitsInfo.vue'
import UnitOjfApplyDetail from './unitOjfApplyDetail.vue'
import UnitOjfApply from './unitOjfApply.vue'

export default {
  props: {
    id: Number,
    fromList: Boolean,
    props: Object
  },
  components: {
    ModuleContainer,
    BaseInfo,
    UnitsInfo,
    UnitOjfApply,
    UnitOjfApplyDetail
  },
  data() {
    return {
      page: 'DETAIL',
      loading: true,
      ojfUnitApplyId: null,
      ojf: null,
      myUnit: null,
      myApplyInfo: null,
      isMyUnitDisabled: false
    }
  },
  computed: {
    ojfId() {
      if (this.ojf) {
        return this.ojf.id
      }
      return this.id || this.props.id
    },
    hasApplied() {
      if (!this.ojf) {
        return false
      }
      if (this.myApplyInfo && this.myApplyInfo.status === UnitApplyAuditStatus.PASSED) {
        return true
      }
      return false
    },
    canApply() {
      if (!this.ojf) {
        return false
      }
      return !this.hasApplied && this.ojf.isApplying() && !this.isMyUnitDisabled
    },
  },
  watch: {
    'props.id': function(val) {
      if(val) {
        this.ojf = null
        this.initOjf()
      }
    }
  },
  async created() {
    await this.initOjf();
    if(this.$attrs&&this.$attrs.userInfo) {
      if(this.$attrs.userInfo.type == 'COMPANY') {
         this.initMyUnitDisabled()
      }
      if(this.$attrs.content != '/student/onlineJobFair/detail') {
        this.initMyUnit()
      }
    }
    this.initMyApplyInfo()
    this.loading = false
  },
  methods: {
    addBread(item) {
      this.$emit('toSomePage',{path: item.route})
    },
    async initOjf() {
      const { state, message, data } = await api.getPublic(this.ojfId)
      if (state) {
        this.ojf = Ojf.fromApi(data)
      } else {
        this.$toast(message)
      }
    },
    async initMyUnit() {
      const { state, message, data } = await getMyUnit()
      if (state) {
        this.myUnit = data
      } else {
        this.$toast(message)
      }
    },
    async initMyUnitDisabled() {
      const { state, message, data } = await checkUnitDisabled()
      if (state) {
        this.isMyUnitDisabled = !data
      } else {
        if (code !== '41004') {
          this.$toast(message)
        }
      }
    },
    async initMyApplyInfo() {
      const { state, code, message, data } = await api.getPublicOjfUnitApplyById(this.ojfId)
      if (state) {
        if (data) {
          this.myApplyInfo = OjfUnitApply.fromApi(data)
        }
      } else {
        if (code === '50001') {
          this.myApplyInfo = null
        } else {
          if (code !== '41004') {
            this.$toast(message)
          }
        }
      }
    },
    showMyApplyInfo() {
      this.page = 'UNIT_APPLY_DETAIL'
      this.ojfUnitApplyId = this.myApplyInfo.id
    },
    showOjfUnitApply(ojfUnitApply, index) {
      this.page = 'UNIT_APPLY_DETAIL'
      this.ojfUnitApplyId = ojfUnitApply.id
    },
    toApply() {
      this.page = 'APPLY'
    },
    bakcToMyList() {
      this.$router.push({ name:'employment',params: {toPage:'/unit/onlineJobFair/list'}})
    },
    backToHomePage() {
      this.$emit('toSomePage', '/index')
    },
    back() {
      if (this.fromList) {
        this.$emit('back-to-list')
      } else {
        this.backToHomePage()
      }
    }
  }
}
</script>

<style lang="less">
@import url('../../styles/styles.less');
#studentOjfDetails {
  position: relative;
}
</style>
