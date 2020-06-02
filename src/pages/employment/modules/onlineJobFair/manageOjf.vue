<template>
  <div class="main-content">
    <div class="tab-content" v-show="page === 'LIST'">
      <el-tabs v-model="activeList">
        <el-tab-pane label="网招会列表" name="ALL">
          <manage-ojf-list ref="manageList" @to-create-ojf="toCreateOjf" @to-detail="toDetail"></manage-ojf-list>
        </el-tab-pane>
        <el-tab-pane label="网招会审核" name="AUDIT">
          <manage-ojf-audit-list ref="auditList" @to-apply-detail="toApplyDetail"></manage-ojf-audit-list>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-if="page === 'NEW'">
      <new-ojf @back-to-list="backToList"></new-ojf>
    </div>
    <div v-if="page === 'DETAIL'">
      <ojf-detail :ojf="ojf" @back-to-list="backToList" @to-apply-detail="toApplyDetail" @to-reserve="toReserve"></ojf-detail>
    </div>
    <div v-if="page === 'APPLY'">
      <unit-ojf-apply :ojf="ojf" is-manager @back-to-list="backToDetail"></unit-ojf-apply>
    </div>
    <div v-if="page === 'APPLY_DETAIL'">
      <unit-ojf-apply-detail :ojf="ojf" :ojf-unit-apply-id="ojfUnitApplyId" :from="applyDetailFrom" :hide-status="hideStatus" :show-oplog="showOplog" :edit="edit" is-manager @back="applyDetailBack"></unit-ojf-apply-detail>
    </div>
  </div>
</template>

<script>

import ManageOjfList from './manageOjfList.vue'
import ManageOjfAuditList from './manageOjfAuditList.vue'
import NewOjf from './newOjf.vue'
import OjfDetail from './ojfDetail.vue'
import UnitOjfApply from './unitOjfApply.vue'
import UnitOjfApplyDetail from './unitOjfApplyDetail.vue'

export default {
  components: {
    ManageOjfList,
    ManageOjfAuditList,
    NewOjf,
    OjfDetail,
    UnitOjfApply,
    UnitOjfApplyDetail,
  },
  data() {
    return {
      activeList: 'ALL',
      page: 'LIST',
      ojf: null,
      ojfUnitApplyId: null,
      showOplog: false,
      edit: false,
      applyDetailFrom: null,
      hideStatus: false
    }
  },
  watch: {
    activeList(val) {
      const tableName = { ALL: 'manageList', AUDIT: 'auditList' }[val]
      this.$refs[tableName].refreshTable()
    }
  },
  methods: {
    toCreateOjf() {
      this.page = 'NEW'
    },
    toDetail(ojf) {
      this.page = 'DETAIL'
      this.ojf = ojf
    },
    toApplyDetail({ ojf, ojfUnitApplyId, showOplog, edit, from, hideStatus }) {
      this.ojf = ojf
      this.ojfUnitApplyId = ojfUnitApplyId
      this.showOplog = showOplog || false
      this.edit = edit || false
      this.applyDetailFrom = from
      this.hideStatus = hideStatus
      this.page = 'APPLY_DETAIL'
    },
    toReserve({ ojf }) {
      this.ojf = ojf
      this.page = 'APPLY'
    },
    backToList({ refresh, tableName, from } = {}) {
      this.page = from || 'LIST'
      if (refresh) {
        this.$refs[tableName].refreshTable()
      }
    },
    backToDetail() {
      this.page = 'DETAIL'
    },
    applyDetailBack({ from, refresh, tableName }) {
      this.page = from || 'DETAIL'
      if (refresh) {
        this.$refs[tableName].refreshTable()
      }
    }
  }
}
</script>
<style lang="less">
@import url('../../styles/styles.less');

</style>
