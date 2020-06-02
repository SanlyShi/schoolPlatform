<template>
  <div>
    <div class="back" @click="back">
      <i class="el-icon-back"></i>返回
    </div>
    <div class="page-title">
      {{ `网招会名称：${ojf.name}` }}
    </div>
    <module-loader v-if="loading"></module-loader>
    <div class="module-container" v-else>
      <unit-info v-model="ojfUnitApply" ref="unitInfo" :units="units" edit></unit-info>
      <positions-info v-model="ojfUnitApply.positions" edit></positions-info>
      <recruitment-info v-model="ojfUnitApply.recruitment" edit></recruitment-info>
      <module-container actions>
        <el-button type="primary" size="large" @click="submit" v-loading="submiting">{{ isManager ? '预留' : '提交审核' }}</el-button>
      </module-container>
    </div>
  </div>
</template>

<script>
import { MessageBox } from 'element-ui'
import UnitInfo from '../../components/unitInfo.vue'
import PositionsInfo from '../../components/positionsInfo.vue'
import RecruitmentInfo from '../../components/recruitmentInfo.vue'
import ModuleContainer from '../.././components/moduleContainer.vue'
import ModuleLoader from '../.././components/moduleLoader.vue'
import api from '../../api/onlineJobFair'
import { getMyUnit, ScrollTop } from '../../api/api'
import { Ojf, OjfUnitApply } from './types'

export default {
  props: {
    ojf: Object,
    myUnit: Object,
    isManager: Boolean
  },
  components: {
    ModuleContainer,
    ModuleLoader,
    UnitInfo,
    PositionsInfo,
    RecruitmentInfo
  },
  data() {
    return {
      loading: true,
      myUnit: null,
      units: [],
      ojfUnitApply: new OjfUnitApply(),
      submiting: false
    }
  },
  computed: {
  },
  async created() {
    if (this.myUnit) {
      this.ojfUnitApply = OjfUnitApply.fromUnit(this.myUnit)
    }
    if (this.isManager) { // 获取所有未参展单位
      await this.initNoJoinedUnits()
    }
    this.ojfUnitApply.ojf = this.ojf
    this.loading = false
  },
  methods: {
    async initNoJoinedUnits() {
      const { state, message, data: units } = await api.getNoJoinedUnits(this.ojf.id)
      if (state) {
        this.units = units.map(unit => {
          return {
            id: unit.id,
            name: unit.companyName
          }
        })
      } else {
        this.$toast(message)
      }
    },
    async submit() {
      try {
        await this.$refs.unitInfo.validate()
      } catch(err) {
        ScrollTop(0, 200)
        return
      }
      if (this.isManager) {
        return this.submitByManager()
      }
      const { state, message } = await api.apply(this.ojfUnitApply)
      this.submiting = false
      if (state) {
        this.$alert('提交申请成功', '', { center: true, showClose: false }).then(() => {
          this.backToMyOjfList()
        })
      } else {
        this.$toast(message)
      }
    },
    async submitByManager() {
      const { state, message } = await api.applyByManager(this.ojfUnitApply)
      this.submiting = false
      if (state) {
        this.$alert('预留成功', '', { center: true, showClose: false }).then(() => {
          this.back()
        })
      } else {
        this.$toast(message)
      }
    },
    backToMyOjfList() {
      this.$emit('back-to-my-list', { refresh: true })
    },
    back() {
      this.$emit('back-to-list')
    },
  }
}
</script>
