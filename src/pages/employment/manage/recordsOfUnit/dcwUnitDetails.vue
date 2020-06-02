<template>
  <div>
    <div class="page-title">
      {{ dcw.baseInfo.name }}
    </div>
    <module-loader v-if="loading"></module-loader>
    <div class="module-container" v-else>
      <unit-info ref="unitInfo" :dcw="dcw" v-model="unitApplyInfo"></unit-info>
      <positions-info :dcw="dcw" v-model="unitApplyInfo.positions"></positions-info>
      <recruitment-info v-model="unitApplyInfo.recruitment"></recruitment-info>
      <stand-info v-model="dcw.standInfo"></stand-info>
      <module-container inline>
        <el-form v-if="dcw.standInfo.chooseType === 'UNIT'">
          <el-form-item label="展位号">
            <p>{{ unitApplyInfo.stands.map(stand => stand.name).join(' ') }}</p>
          </el-form-item>
        </el-form>
        <el-form v-else-if="dcw.standInfo.chooseType === 'MANAGER'">
          <el-form-item label="展位号"><p>{{unitApplyInfo.stand && unitApplyInfo.stand.name}}</p></el-form-item>
        </el-form>
      </module-container>
    </div>
  </div>
</template>

<script>
  import UnitInfo from '../../components/unitInfo'
  import PositionsInfo from '../../components/positionsInfo.vue'
  import RecruitmentInfo from '../../components/recruitmentInfo.vue'
  import StandInfo from '../../modules/doubleChooseWill/components/standInfo.vue'

  import ModuleContainer from '../../components/moduleContainer.vue'
  import ModuleLoader from '../../components/moduleLoader.vue'
  import { Dcw, UnitApplyInfo, Stand } from '../../modules/doubleChooseWill/types'
  import { MessageBox } from 'element-ui'
  import api from '../../api/doubleChooseWill'
  import { ScrollTop, getParticipationRecord } from '../../api/api'

  export default {
    props: {
      detailsId: Number,
      companyId: Number,
      type: String
    },
    components: {
      StandInfo,
      UnitInfo,
      PositionsInfo,
      RecruitmentInfo,
      ModuleLoader,
      ModuleContainer
    },
    data() {
      return {
        loading: true,
        standUnitId: null,
        standsInitialized: false,
        dcw: new Dcw(),
        stands: [],
        unitApplyInfo: new UnitApplyInfo(),
      }
    },
    async created() {
      // ScrollTop(0, 200)
      await this.initStandUnitId()
      await this.initUnitApplyInfo()
      await this.initDcw()
      this.loading = false
      this.closeLoading()
    },
    methods: {
      async initStandUnitId() {
        const { state, message, data } = await getParticipationRecord(this.detailsId, this.companyId, this.type)
        if (state) {
          this.standUnitId = data.detailsId
        } else {
          this.$toast(message)
        }
      },
      async initUnitApplyInfo() {
        const { state, message, data } = await api.stand.getUnitApplyInfo(this.standUnitId)
        if (state) {
          this.unitApplyInfo = UnitApplyInfo.fromApi(data)
        } else {
          this.$toast(message)
        }
      },
      async initDcw() {
        const { state, message, data } = await api.dcw.get(this.detailsId)
        if (state) {
          this.dcw = Dcw.fromApi(data)
        } else {
          this.$toast(message)
        }
      },
      closeLoading() {
        this.$emit('closeLoading')
      }
    }
  }
</script>

<style lang="less">
@import url('../../styles/styles.less');
.operations-container-action {
  top: 0;
}
</style>
