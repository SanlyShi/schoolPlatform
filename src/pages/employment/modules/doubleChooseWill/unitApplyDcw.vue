<template>
  <div>
    <div class="back" @click="backToList">
      <i class="el-icon-back"></i>返回
    </div>
    <div class="page-title">
      {{ `双选会名称：${dcwName}` }}
    </div>
    <module-loader v-loading="loading" v-if="loading"></module-loader>
    <div class="module-container" v-else>
      <unit-info ref="unitInfo" :dcw="dcw" v-model="unitApplyInfo" edit></unit-info>
      <positions-info :dcw="dcw" v-model="unitApplyInfo.positions" edit></positions-info>
      <recruitment-info :dcw="dcw" v-model="unitApplyInfo.recruitment" edit></recruitment-info>
      <stand-info v-model="dcw.standInfo">
        <template slot="start">
          <el-form>
            <el-form-item label="双选会场地">
              <p>{{ dcw.baseInfo.address }}</p>
            </el-form-item>
          </el-form>
        </template>
      </stand-info>
      <module-container inline>
        <stand-picker :dcw="dcw" v-model="stands"  v-if="dcw.standInfo.chooseType === 'UNIT'" published selectable></stand-picker>
        <el-form v-else>
          <el-form-item label="展位号"><p>由校方分配</p></el-form-item>
        </el-form>
      </module-container>
      <module-container title="备注" v-if="dcw.standInfo.chooseType === 'MANAGER'">
        <el-input
          type="textarea"
          :autosize="{ minRows: 3 }"
          placeholder=""
          v-model="unitApplyInfo.remark">
        </el-input>
      </module-container>
      <module-container actions v-if="!dcw.applied">
        <el-button type="primary" size="large" @click="submit">提交审核</el-button>
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

import ModuleContainer from '../.././components/moduleContainer.vue'
import ModuleLoader from '../.././components/moduleLoader.vue'
import api from '../../api/doubleChooseWill'
import { getMyUnit, ScrollTop } from '../../api/api'
import { Dcw, UnitApplyInfo, Stand } from './types'

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
    StandPicker,
    UnitInfo,
    PositionsInfo,
    RecruitmentInfo
  },
  data() {
    return {
      loading: true,
      dcw: null,
      unitApplyInfo: new UnitApplyInfo(),
      stands: [],
      myUnit: null,
      rules: {
        name: {
          hidden: true
        },
        applyTime: {
          hidden: true
        }
      }
    }
  },
  computed: {
  },
  async created() {
    await this.initDcw()
    await this.initMyUnit()
    await this.initStands()
    this.loading = false
  },
  methods: {
    async initDcw() {
      const { state, message, data } = await api.dcw.get(this.id)
      if (state) {
        this.dcw = Dcw.fromApi(data)
      } else {
        this.$toast(message)
      }
    },
    async initMyUnit() {
      const { state, message, data } = await getMyUnit()
      if (state) {
        this.unitApplyInfo = UnitApplyInfo.fromUnit(data)
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
        }
        return stand
      })
    },
    async submit() {
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
      const { state, message, data } = await api.dcw.apply(this.dcw.id, this.unitApplyInfo)
      if (state) {
        this.$toast('提交成功')
        this.toMyDcw()
      } else {
        this.$toast(message)
      }
    },
    backToList() {
      this.$emit('back-to-list')
    },
    toMyDcw() {
      this.$emit('to-my-dcw')
    }
  }
}
</script>
