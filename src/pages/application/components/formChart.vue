<template>
  <div id="formChart">
    <el-table
    ref="formChartBox"
    :data="newTableData"
    style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table
            :data="props.row.children"
            :show-header="false"
            class="inner-table"
            style="width: 100%; margin-left: 35px;">
            <el-table-column
              prop="name"
              label="字段"
              header-align="left"
              align="left"
              width="180">
            </el-table-column>
            <el-table-column
              prop=""
              label="图表"
              header-align="left"
              align="left">
              <template slot-scope="scope">
                <bar-chart :statistics="scope.row" :height="16"></bar-chart>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        type="index"
        label=""
        header-align="right"
        align="right"
        width="36">
        <template slot-scope="scope">
          <img 
            v-if="scope.row.children&&scope.row.children.length>0" 
            class="icon-fold" :src="require(`../../../assets/img/btn_${scope.row.expansion?'unfold':'fold'}@2x.png`)" 
            alt=""
            @click="expend(scope.row)"
          >
        </template>
      </el-table-column>
      <el-table-column
        v-for="(column,index) in columns"
        :key="index"
        :prop="column.value"
        :label="column.label"
        header-align="left"
        align="left"
        :width="column.width">
        <template slot-scope="scope">
          <bar-chart v-if="column.value=='chart'" :statistics="scope.row"></bar-chart>
          <span v-else>{{scope.row[column.value]}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import barChart from "./barChart.vue";
export default {
  components: {
    barChart,
  },
  props: {
    tableData: {
      default: null
    },
    columns: {
      default: [
        {
          value: "title",
          label: "字段名称",
          align: "left",
          width: 160,
        },
        {
          value: "chart",
          label: "图表",
          align: "left",
          width: '',
        },
      ]
    }
  },
  data () {
    return { 
    }
  },
  computed: {
    newTableData() {
      return JSON.parse(JSON.stringify(this.tableData))
    }
  },
  watch: {
  },
  created () { },
  mounted () { },
  methods: { 
    expend (row) {
      let $table = this.$refs.formChartBox
      this.newTableData.map((item) => {
          if (row.name !== item.name) {
              $table.toggleRowExpansion(item, false)
              item.expansion = false
          } else {
              item.expansion = !item.expansion
          }
      })
      $table.toggleRowExpansion(row)
    }
  }
}
</script>

<style lang="less">
#formChart {
  .icon-fold {
    width: 14px;
    height: 14px;
    cursor: pointer;
  }
  .el-table thead tr th {
    color: #50649C;
    background: #EFF2F9;
  }
  .el-table--striped .el-table__body tr.el-table__row--striped td {
    background: #EFF2F9;
  }
  .el-table--enable-row-hover .el-table__body .el-table__row:hover>td {
    background: none !important;
  }
  .inner-table td, .inner-table th.is-leaf {
    border: none;
  }
  .inner-table::before {
    background: transparent;
  }
  .el-table__expand-column {
    width: 0;
    padding: 0;
  }
  .el-table__expand-column .cell {
    display: none;
  }
}
</style>
