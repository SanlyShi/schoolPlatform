<template>
  <module-loader v-if="loading"></module-loader>
  <div v-else>
    <div class="page-title-status">
      <p><span class="title">网招会名称：</span><span>{{ ojf.name }}</span></p>
    </div>
    <div class="module-container">
      <unit-info v-model="ojfUnitApply"></unit-info>
      <positions-info v-model="ojfUnitApply.positions"></positions-info>
      <recruitment-info v-model="ojfUnitApply.recruitment"></recruitment-info>
      <div class="operations-container" :class="{ show: showOpLogs }">
        <oplog :dataUrl="opLogDataUrl" v-if="showOpLogs"></oplog>
      </div>
    </div>
  </div>
</template>

<script>
  import UnitInfo from '../../components/unitInfo'
  import PositionsInfo from '../../components/positionsInfo.vue'
  import RecruitmentInfo from '../../components/recruitmentInfo.vue'
  import Oplog from '../../components/oplog.vue'
  import ModuleContainer from '../../components/moduleContainer.vue'
  import ModuleLoader from '../../components/moduleLoader.vue'
  import { MessageBox } from 'element-ui'
  import api from '../../api/onlineJobFair'
  import { ScrollTop, getParticipationRecord } from '../../api/api'
  import { Ojf, OjfUnitApply } from '../../modules/onlineJobFair/types';

  export default {
    props: {
      detailsId: Number,
      companyId: Number,
      type: String
    },
    components: {
      UnitInfo,
      PositionsInfo,
      RecruitmentInfo,
      Oplog,
      ModuleLoader,
      ModuleContainer
    },
    data() {
      return {
        loading: true,
        ojf: new Ojf(),
        ojfUnitApplyId: null,
        ojfUnitApply: new OjfUnitApply(),
        opLogDataUrl: `/api/employment/manage/networkMeeting/getOperationDetailList?participantId=${this.ojfUnitApplyId}`
      }
    },
    async created() {
      // ScrollTop(0, 200)
      await this.initOjfUnitApplyId()
      await this.initOjf()
      await this.initUnitApplyInfo()
      this.loading = false
      this.closeLoading()
    },
    methods: {
      async initOjfUnitApplyId() {
        const { state, message, data } = await getParticipationRecord(this.detailsId, this.companyId, this.type)
        if (state) {
          this.ojfUnitApplyId = data.detailsId
        } else {
          this.$toast(message)
        }
      },
      async initUnitApplyInfo() {
        const { state, message, data } = await api.getOjfUnitApplyById(this.ojfUnitApplyId)
        if (state) {
          this.ojfUnitApply = OjfUnitApply.fromApi(data)
          this.ojfUnitApply.ojf = this.ojf
        } else {
          this.$toast(message)
        }
      },
      async initOjf() {
        const { state, message, data } = await api.get(this.detailsId)
        if (state) {
          this.ojf = Ojf.fromApi(data)
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
