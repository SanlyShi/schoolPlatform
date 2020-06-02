<template>
  <div v-if="page === 'DETAIL'">
    <div class="back" @click="backToList">
      <i class="el-icon-back"></i>返回
    </div>
    <div class="page-title">
      {{ `双选会名称：${dcwName}` }}
    </div>
    <module-loader v-loading="loading" v-if="loading"></module-loader>
    <div class="module-container" v-else>
      <base-info v-model="dcw.baseInfo" :rules="rules"></base-info>
      <module-container title="申请信息">
        <el-form @submit.native.prevent>
          <el-form-item label="申请时间">
            <p>{{dcw.baseInfo.applyTimeRange.map(time => new Date(time).format('yyyy-MM-dd HH:mm')).join(' ~ ')}}  <span class="apply-time-tip">{{ dcw.isApplying() ? '' : '（不在申请时间内）' }}</span></p>
          </el-form-item>
        </el-form>
      </module-container>
      <stand-info v-model="dcw.standInfo"></stand-info>
      <module-container inline>
        <div class="stand-units">
          <el-table :data="dcw.standUnits" style="width: 100%">
            <el-table-column prop="stand.name" label="展位号" width="80"></el-table-column>
            <el-table-column prop="name" label="用人单位" width="260"></el-table-column>
            <el-table-column prop="typeName" label="单位性质" width="120"></el-table-column>
            <el-table-column prop="positionsCount" label="职位总数" width="120"></el-table-column>
            <el-table-column prop="opt" label="操作" align="right">
              <template slot-scope="scope">
                <el-button type="text" @click="showStandUnit(scope.row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </module-container>
      <module-container actions v-if="!dcw.applied && dcw.isApplying() && !isMyUnitDisabled">
        <el-button type="primary" size="large" @click="toApply">申请</el-button>
      </module-container>
    </div>
  </div>
  <div v-else>
    <stand-unit :dcw="dcw" :standUnitId="standUnitId" @back-to-detail="backToDetail" only-look></stand-unit>
  </div>
</template>

<script>
import BaseInfo from './components/baseInfo.vue'
import StandInfo from './components/standInfo.vue'
import StandUnit from './standUnit.vue'
import ModuleContainer from '../.././components/moduleContainer.vue'
import ModuleLoader from '../.././components/moduleLoader.vue'
import api from '../../api/doubleChooseWill'
import { getMyUnit, checkUnitDisabled } from '../../api/api'
import { Dcw } from './types'
import { UnitApplyAuditStatus } from './types/dict'
export default {
  props: {
    id: Number,
    dcwName: String
  },
  components: {
    ModuleContainer,
    ModuleLoader,
    BaseInfo,
    StandInfo,
    StandUnit
  },
  data() {
    return {
      loading: true,
      dcw: null,
      myUnit: null,
      page: 'DETAIL',
      rules: {
        name: {
          hidden: true
        },
        applyTime: {
          hidden: true
        }
      },
      isMyUnitDisabled: true
    }
  },
  computed: {
  },
  async created() {
    await this.initDcw()
    await this.initMyUnit()
    await this.initMyUnitDisabled()
    await this.initApplyStatus()
    this.loading = false
  },
  methods: {
    async initDcw() {
      const { state, message, data } = await api.dcw.getByUnit(this.id)
      if (state) {
        this.dcw = Dcw.fromApi(data)
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
        this.$toast(message)
      }
    },
    async initApplyStatus() {
      this.dcw.applied = this.dcw.standUnits.some(applyInfo => {
        return applyInfo.unitId === this.myUnit.companyId
      })
      if (this.dcw.applied) {
        return
      }
      this.dcw.applied = ['0', '1', '3', '4'].includes(this.dcw.applyStatus + '')
    },
    showStandUnit(standUnit) {
      this.standUnitId = standUnit.id
      this.page = 'STAND_UNIT'
    },
    backToDetail() {
      this.page = 'DETAIL'
    },
    toApply() {
      this.$emit('to-apply')
    },
    backToList() {
      this.$emit('back-to-list');
    }
  }
}
</script>

<style lang="less" scoped>
.apply-time-tip {
  color: #F56C6C
}
.stand-units {
  padding: 0 24px 24px;
}
</style>
