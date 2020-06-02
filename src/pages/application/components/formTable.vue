<template>
  <div id="formTable">
    <el-table
    ref="formTableBox"
    :data="newTableData"
    stripe
    style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table
            :data="props.row.children"
            :show-header="false"
            class="inner-table"
            style="width: 100%; margin-left: 64px;">
            <el-table-column
              prop="name"
              label="字段名称"
              header-align="left"
              align="left"
              width="180">
            </el-table-column>
            <el-table-column
              prop="text"
              label="已填写"
              header-align="center"
              align="center">
            </el-table-column>
            <el-table-column
              prop=""
              header-align="center"
              align="center"
              label="未填写">
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        type="index"
        label="#"
        header-align="left"
        align="left"
        width="64">
        <template slot-scope="scope">
          
          <div sytle="postions: relative;">
            <img 
              v-if="scope.row.children&&scope.row.children.length>0" 
              class="icon-fold" :src="require(`../../../assets/img/btn_${scope.row.expansion?'unfold':'fold'}@2x.png`)" 
              alt=""
              @click="expend(scope.row)"
            />
            <span>{{ scope.$index+1 }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-for="(column,index) in columns"
        :key="index"
        :prop="column.value"
        :label="column.label"
        :header-align="column.align"
        :align="column.align"
        :width="column.width">
      </el-table-column>
      <!-- <el-table-column
        prop="doneText"
        label="已填写"
        header-align="center"
        align="center">
      </el-table-column>
      <el-table-column
        prop="notDoneText"
        header-align="center"
        align="center"
        label="未填写"> 
      </el-table-column> -->
    </el-table>
  </div>
</template>

<script>
export default {
  components: {},
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
          value: "doneText",
          label: "已填写",
          align: "center",
          width: '',
        },
        {
          value: "notDoneText",
          label: "未填写",
          align: "center",
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
      let $table = this.$refs.formTableBox
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
#formTable {
  .icon-fold {
    position: absolute; 
    left: -14px; 
    top: 50%;
    margin-top: -7px;
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
  .el-table--striped .el-table__body tr.el-table__row--striped:hover>td {
    background: #EFF2F9 !important;
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
