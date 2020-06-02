<template>
  <div class="main-content">
    <div class="tab-content" v-show="page === 'LIST'">
      <el-tabs v-model="activeList">
        <el-tab-pane label="网招会列表" name="ALL">
          <unit-all-ojf-list ref="allOjfList" @to-detail="toDetail"></unit-all-ojf-list>
        </el-tab-pane>
        <el-tab-pane label="我的网招会" name="MINE">
          <unit-my-ojf-list ref="myOjfList"  @to-apply-detail="toApplyDetail"></unit-my-ojf-list>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-if="page === 'DETAIL'">
      <unit-ojf-detail :ojf="ojf" @back-to-list="backToList" @to-apply="toApply" @to-apply-detail="toApplyDetail"></unit-ojf-detail>
    </div>
    <div v-if="page === 'APPLY'">
      <unit-ojf-apply :ojf="ojf" :my-unit="myUnit" @back-to-list="backToDetail" @back-to-my-list="bakcToMyList"></unit-ojf-apply>
    </div>
    <div v-if="page === 'APPLY_DETAIL'">
      <unit-ojf-apply-detail :ojf="ojf" :ojf-unit-apply-id="ojfUnitApplyId" is-unit :from="applyDetailFrom" @back="applyDetailBack" @back-to-my-list="bakcToMyList" :hide-oplog="hideLog"></unit-ojf-apply-detail>
    </div>
  </div>
</template>

<script>
import UnitAllOjfList from './unitAllOjfLst.vue'
import UnitMyOjfList from './unitMyOjfList.vue'
import UnitOjfDetail from './unitOjfDetail.vue'
import UnitOjfApply from './unitOjfApply.vue'
import UnitOjfApplyDetail from './unitOjfApplyDetail.vue'

export default {
  components: {
    UnitOjfDetail,
    UnitOjfApply,
    UnitOjfApplyDetail,
    UnitAllOjfList,
    UnitMyOjfList
  },
  data() {
    return {
      activeList: 'ALL', // ALL MINE
      page: 'LIST',
      ojf: null,
      ojfUnitApply: null,
      ojfUnitApplyId: null,
      myUnit: null,
      applyDetailFrom: null,
      hideLog: false
    }
  },
  watch: {
    activeList(val) {
      const tableName = { ALL: 'allOjfList', MINE: 'myOjfList' }[val]
      this.$refs[tableName].refreshTable()
    }
  },
  methods: {
    toApply({ myUnit }) {
      this.myUnit = myUnit
      this.page = 'APPLY'
    },
    toDetail(ojf) {
      this.ojf = ojf
      this.ojfUnitApply = null
      this.myUnit = null
      this.page = 'DETAIL'
    },
    toApplyDetail({ ojfUnitApplyId, ojf, from, hideLog }) {
      this.ojf = ojf
      this.ojfUnitApplyId = ojfUnitApplyId
      this.page = 'APPLY_DETAIL'
      this.applyDetailFrom = from
      this.hideLog = !!hideLog
    },
    bakcToMyList() {
      this.page = 'LIST'
      this.activeList = 'MINE'
      this.$refs.myOjfList.refreshTable()
    },
    backToDetail() {
      this.page = 'DETAIL'
    },
    backToList() {
      this.page = 'LIST'
    },
    applyDetailBack({ from, refresh }) {
      this.page = from || 'LIST'
      if (refresh) {
        this.$refs.myOjfList.refreshTable()
      }
    }
  }
}
</script>

<style lang="less">
@import url('../../styles/styles.less');
</style>
