<template>
  <div class="main-content">
    <div class="tab-content" v-show="page === 'LIST'">
      <el-tabs v-model="activeList">
        <el-tab-pane label="简历完成情况" name="COMPLETE">
          <resume-stat-complete></resume-stat-complete>
        </el-tab-pane>
        <el-tab-pane label="简历投递情况" name="DELIVER">
          <resume-stat-deliver></resume-stat-deliver>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import ResumeStatComplete from './resumeStatComplete.vue'
import ResumeStatDeliver from './resumeStatDeliver.vue'

export default {
  components: {
    ResumeStatComplete,
    ResumeStatDeliver
  },
  data() {
    return {
      activeList: 'COMPLETE',
      page: 'LIST',
    }
  },
  methods: {
  }
}
</script>
<style lang="less">
@import url('../../styles/styles.less');

</style>
