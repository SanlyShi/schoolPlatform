<template>
  <div class="main-content">
    <div class="tab-content" v-show="page === 'LIST'">
      <el-tabs v-model="activeList">
        <el-tab-pane label="双选会列表" name="ALL">
          <unit-all-dcw-list ref="allDcwList" @to-detail="toDetail"></unit-all-dcw-list>
        </el-tab-pane>
        <el-tab-pane label="我的双选会" name="MINE">
          <unit-my-dcw-list ref="auditList" @to-detail="toDetail" @to-apply="toApply" @to-apply-detail="toApplyDetail"></unit-my-dcw-list>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-if="page === 'DETAIL'">
      <unit-dcw-detail :id="currentDcw.id" :dcw-name="currentDcw.baseInfo.name" @back-to-list="backToList" @to-apply="toApply"></unit-dcw-detail>
    </div>
    <div v-if="page === 'APPLY'">
      <unit-apply-dcw :id="currentDcw.id" :dcw-name="currentDcw.baseInfo.name" @back-to-list="applyBack" @to-my-dcw="toMyDcw"></unit-apply-dcw>
    </div>
    <div v-if="page === 'APPLY_DETAIL'">
      <unit-apply-detail :id="currentDcw.id" :dcw-name="currentDcw.baseInfo.name" :unit-apply-info-id="unitApplyInfoId" :audit-status="auditStatus" @back-to-list="backToList" is-unit></unit-apply-detail>
    </div>
  </div>
</template>

<script>
import UnitAllDcwList from './unitAllDcwList.vue'
import UnitMyDcwList from './unitMyDcwList.vue'
import UnitDcwDetail from './unitDcwDetail.vue'
import UnitApplyDcw from './unitApplyDcw.vue'
import UnitApplyDetail from './unitApplyDetail.vue'

export default {
  components: {
    UnitAllDcwList,
    UnitMyDcwList,
    UnitDcwDetail,
    UnitApplyDcw,
    UnitApplyDetail
  },
  data() {
    return {
      activeList: 'ALL', // ALL MINE
      page: 'LIST',
      currentDcw: null,
      unitApplyInfoId: null,
      auditStatus: null
    }
  },
  watch: {
    activeList(val) {
      if (!val) {
        return
      }
      const tableName = { ALL: 'allDcwList', MINE: 'auditList' }[val]
      this.$refs[tableName].refreshTable && this.$refs[tableName].refreshTable()
    }
  },
  methods: {
    toDetail(dcw) {
      this.currentDcw = dcw
      this.page = 'DETAIL'
    },
    toApply(dcw) {
      this.page = 'APPLY'
    },
    toApplyDetail({ unitApplyInfoId, dcw, auditStatus }) {
      this.currentDcw = dcw
      this.unitApplyInfoId = unitApplyInfoId
      this.auditStatus = auditStatus
      this.page = 'APPLY_DETAIL'
    },
    backToList({ refresh, tableName } = {}) {
      this.page = 'LIST'
      if (refresh) {
        this.$refs[tableName].refreshTable()
      }
    },
    applyBack() {
      this.page = 'LIST'
    },
    toMyDcw() {
      this.page = 'LIST'
      this.activeList = 'MINE'
    },
    refreshTable() {
      this.table.search.ts = +new Date()
    },
  }
}
</script>

<style lang="less">
@import url('../../styles/styles.less');
</style>
