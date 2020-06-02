<template>
  <div>
    <div class="back" @click="backToDetail">
      <i class="el-icon-back"></i>返回
    </div>
    <div class="page-title">
      {{ dcw.baseInfo.name }}
      <div class="operations-container-action" v-if="isManager">
        <el-button type="text" icon="el-icon-edit-outline" @click="toEditStandUnit" v-if="standUnitId && !standUnitEditing">编辑</el-button>
        <el-button type="text" @click="cancelEditStandUnit" v-if="standUnitId && standUnitEditing">取消编辑</el-button>
      </div>
    </div>
    <module-loader v-if="loading"></module-loader>
    <div class="module-container" v-else>
      <unit-info ref="unitInfo" :dcw="dcw" v-model="unitApplyInfo" :units="units" :edit="isManager && !onlyLook && standUnitEditing" :rules="unitInfoRules"></unit-info>
      <positions-info :dcw="dcw" v-model="unitApplyInfo.positions" v-if="unitApplyInfo.unitId" :edit="isManager && !onlyLook && standUnitEditing"></positions-info>
      <recruitment-info v-model="unitApplyInfo.recruitment" v-if="unitApplyInfo.unitId" :edit="isManager && !onlyLook && standUnitEditing"></recruitment-info>
      <stand-info v-model="dcw.standInfo" :rules="(onlyLook || !standUnitEditing) ? standInfoRules : {}"></stand-info>
      <module-container :loader="!standsInitialized" loaderText="正在加载展位信息" inline>
        <stand-picker :dcw="dcw" selectable v-model="stands" v-if="standsInitialized && !onlyLook && standUnitEditing && dcw.standInfo.chooseType === 'UNIT'"></stand-picker>
        <el-form v-if="onlyLook || !standUnitEditing">
          <el-form-item label="展位号">
            <p>{{ unitApplyInfo.stands.map(stand => stand.name).join(' ') }}</p>
          </el-form-item>
        </el-form>
        <el-form v-else-if="dcw.standInfo.chooseType === 'MANAGER'">
          <el-form-item label="展位号"><p>预留展位后在排展管理中分配展位号</p></el-form-item>
        </el-form>
      </module-container>
      <module-container actions v-if="!onlyLook && standUnitEditing">
        <el-button size="large" @click="cancelReserveDcw">取消</el-button>
        <el-button type="primary" size="large" @click="save">保存</el-button>
      </module-container>
    </div>

  </div>
</template>

<script>
  import StandPicker from './components/standPicker.vue'
  import StandInfo from './components/standInfo.vue'
  import UnitInfo from '../../components/unitInfo.vue'
  import PositionsInfo from '../../components/positionsInfo.vue'
  import RecruitmentInfo from '../../components/recruitmentInfo.vue'

  import ModuleContainer from '../.././components/moduleContainer.vue'
  import ModuleLoader from '../.././components/moduleLoader.vue'
  import { UnitApplyInfo, Stand } from './types'
  import { MessageBox } from 'element-ui'
  import api from '../../api/doubleChooseWill'
  import { ScrollTop } from '../../api/api'

  export default {
    props: {
      onlyLook: Boolean,
      isManager: Boolean,
      dcw: Object,
      standUnitId: Number // 查看详情时，传此id
    },
    components: {
      StandInfo,
      UnitInfo,
      PositionsInfo,
      RecruitmentInfo,
      StandPicker,
      ModuleLoader,
      ModuleContainer
    },
    data() {
      return {
        loading: true,
        standsInitialized: false,
        stands: [],
        units: [],
        hasChanged: false,
        standUnitEditing: true,
        unitApplyInfo: new UnitApplyInfo(),
        standInfoRules: {
          chooseType: {
            hidden: true
          },
        },
        unitInfoRules: {
          desc: {
            readonly: true
          }
        }
      }
    },
    async created() {
      // ScrollTop(0, 200)
      if (this.standUnitId) {
        this.standUnitEditing = false
        await this.initUnitApplyInfo()
      } else {
        await this.initUnits()
      }
      this.loading = false
      this.initStands()
    },
    methods: {
      async initUnitApplyInfo() {
        let getUnitApplyInfo = api.stand.getUnitApplyInfo
        if (this.onlyLook) {
          getUnitApplyInfo = api.stand.getOpenUnitApplyInfo
        }
        const { state, message, data } = await getUnitApplyInfo(this.standUnitId)
        if (state) {
          this.unitApplyInfo = UnitApplyInfo.fromApi(data)
        } else {
          this.$toast(message)
        }
      },
      async save() {
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
        if (this.standUnitId) {
          await this.update()
        } else {
          await this.reserve()
        }
      },
      async update() {
        const { state, message, data } = await api.stand.updateStandUnit(this.unitApplyInfo)
        if (state) {
          this.$toast('更新成功')
          this.hasChanged = true
          await this.cancelEditStandUnit()
        } else {
          this.$toast(message)
        }
      },
      async reserve() {
        const { state, message, data } = await api.stand.reserve(this.dcw.id, this.unitApplyInfo)
        if (state) {
          this.$alert('预留成功', '', { center: true, showClose: false }).then(() => {
            this.hasChanged = true
            this.backToDetail()
          })
        } else {
          this.$toast(message)
        }
      },
      async initUnits() {
        const { state, message, data } = await api.stand.getNoApplyUnits(this.dcw.id)
        if (state) {
          this.units = data.map(unit => {
            return {
              id: unit.id,
              name: unit.companyName
            }
          })
        } else {
          this.$toast(message)
        }
      },
      initStands() {
        const selectedStands = this.unitApplyInfo.stands.map(stand => stand.id)
        this.stands = this.dcw.standInfo.stands.map(dcwStand => {
          let stand = new Stand(dcwStand)
          if (selectedStands.includes(dcwStand.id)) {
            stand.selected = true
            stand.occupied = false
          }
          return stand
        })
        this.standsInitialized = true
      },
      toEditStandUnit() {
        this.standUnitEditing = true
      },
      async cancelEditStandUnit() {
        this.loading = true
        ScrollTop(0, 200)
        await this.initUnitApplyInfo()
        this.loading = false
        this.standUnitEditing = false
      },
      async cancelReserveDcw() {
        if (this.standUnitId) {
          await this.cancelEditStandUnit()
        } else {
          this.$emit('back-to-detail', { refresh: false })
        }
      },
      backToDetail() {
        this.$emit('back-to-detail', { refresh: this.hasChanged })
      },
    }
  }
</script>

<style lang="less" scoped>
.operations-container-action {
  top: 0;
}
</style>
