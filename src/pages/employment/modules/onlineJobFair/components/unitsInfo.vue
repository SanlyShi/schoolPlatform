<template>
  <module-container title="参会单位" :inline="inline">
    <el-table :data="form" style="width: 100%">
      <el-table-column type="index" width="40"></el-table-column>
      <el-table-column prop="name" label="企业名称" width="260"></el-table-column>
      <el-table-column prop="positionCount" label="职位数量" width="260"></el-table-column>
      <el-table-column prop="opt" label="操作" align="right">
        <template slot-scope="scope">
          <el-button type="text" @click="showOjfUnitApply(scope.row, scope.$index)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
  </module-container>
</template>

<script>
  import FormMixin from '../../../mixins/formMixin'
  import ModuleContainer from '../../../components/moduleContainer.vue'
  export default {
    props: {
      inline: Boolean,
    },
    mixins: [FormMixin],
    components: {
      ModuleContainer,
    },
    methods: {
      showOjfUnitApply(unitOjfApply, index) {
        this.$emit('show-ojf-unit-apply', unitOjfApply)
      }
    }
  }
</script>
