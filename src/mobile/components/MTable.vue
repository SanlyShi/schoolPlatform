<!--  -->
<template>
  <div class="mTable_wrap">
    <div v-for="(row,index) in tableData" :key="index" @click="clickRow(row,index)" class="c-list-item">
      <div v-for="(column,i) in columns" :key="i" class="child" :title="column.formatter?column.formatter(row):row[column.id]" :class="{left:i%2===0,right:i%2!==0,isFirst:i===0}">
        {{column.formatter?column.formatter(row):row[column.id]}}
      </div>
    </div>
    <div v-if="showEmpty" class="no-data">
      <img src="../../../mobile_static/image/empty_table.png" alt="">
      <span>暂无数据</span>
    </div>
    <div v-else-if="alreadyLoadAll" class="no-more">
      <span class="line"></span>
      <span>暂无更多数据</span>
      <span class="line"></span>
    </div>
    <!-- <img src="../../../mobile_static/image/empty_table.png" style="width:100%;" v-if="tableData.length===0" alt=""> -->
  </div>
</template>

<script>
import { request } from '../../assets/utils/utils.js'
export default {
  props: {
    url: '',
    pageParams: {},
    columns: {
      default: () => { return [] }
    }
  },
  components: {},
  data() {
    return {
      tableData: [],
      total: 0,
      pageSize: 10,
      pageIndex: 0,
      alreadyLoadAll: false,
      showEmpty: true,
      advancedSearchParams: '',
    };
  },
  computed: {},
  watch: {
    url(newVal) {
      this.getTableData()
    },
    pageParams(newVal) {
      this.advancedSearchParams = this.pageParams.advancedSearchParams
      this.getTableData()
    }
  },
  methods: {
    clickRow(row, index) {
      this.$emit('clickRow', { row, index })
    },
    getTableData() {//第一次获取数据,以覆盖的形式
      let url = this.url
      this.alreadyLoadAll = false
      if (url.indexOf('?') !== -1) {
        url += '&'
      } else {
        url += '?'
      }
      this.pageIndex = 0;
      url += 'pageIndex=' + this.pageIndex
      url += '&pageSize=' + this.pageSize
      url += this.advancedSearchParams
      let params = { pageParams: this.pageParams }
      if (this.pageParams.advancedSearchParams) {
        delete params.pageParams.advancedSearchParams
      }
      request(url, params, 'get').then(o => {
        if (o.state) {
          this.tableData = o.data
          this.total = o.total
          this.$emit('onLoad', o)
          if (this.tableData.length >= this.total) {
            this.alreadyLoadAll = true
          }
          if (this.tableData.length === 0) {
            this.showEmpty = true
          } else {
            this.showEmpty = false
          }
        }
      })
    },
    loadMore() {//下拉加载
      this.pageIndex++
      let url = this.url
      if (url.indexOf('?') !== -1) {
        url += '&'
      } else {
        url += '?'
      }
      url += 'pageIndex=' + this.pageIndex
      url += '&pageSize=' + this.pageSize
      url += this.advancedSearchParams
      let params = { pageParams: this.pageParams }
      if (this.pageParams.advancedSearchParams) {
        delete params.pageParams.advancedSearchParams
      }
      request(url, params, 'get').then(o => {
        this.$emit('onLoad', o)
        if (o.state) {
          o.data.forEach(element => {
            this.tableData.push(element)
          });
          this.total = o.total
          if (this.tableData.length >= this.total) {
            this.alreadyLoadAll = true
          }
        }
      })
    }
  },
  created() {

  },
  mounted() {
    this.getTableData()
    this.$pullUpToLoad({
      container: '.mTable_wrap',
      down: {
        height: 200,
        callback: () => {
          this.getTableData()
        }
      },
      up: {
        callback: () => {
          if (!this.alreadyLoadAll) {
            this.loadMore()
          }
        }
      }
    })
  }
};
</script>

<style lang="less" scoped>
.mTable_wrap {
  overflow: auto;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-overflow-scrolling: touch;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding-bottom: 30px;
  .c-list-item {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    margin: 5px 10px;
    background-color: #fff;
    padding: 15px 20px 10px;
    box-shadow: 0px 4px 11px 0px rgba(144, 147, 153, 0.26);
    border-radius: 5px;
    min-height: 74px;
    .child {
      width: 50%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      &.left {
        text-align: left;
      }
      &.right {
        text-align: right;
      }
      &.isFirst {
        color: #303133;
        font-size: 17px;
      }
      color: #606266;
      font-size: 15px;
    }
    &::before {
      position: absolute;
      content: "";
      top: 50%;
      margin-top: -15px;
      width: 5px;
      height: 30px;
      background: #298df7;
      box-shadow: 1px 1px 5px 0px rgba(41, 141, 247, 0.35);
      margin-left: -20px;
    }
    .c-item-row {
      display: flex;
      justify-content: space-between;
      color: #606266;
      font-size: 13px;
      line-height: 24px;
    }
    .c-h6 {
      font-size: 17px;
      color: #303133;
      font-weight: 500;
    }
  }
  .no-data {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    color: #303133;
    img {
      width: 250px;
      height: 230px;
      margin-top: 80px;
    }
  }
  .no-more {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px 0 10px;
    text-align: center;
    font-size: 10px;
    color: #868789;
    .line {
      width: 102px;
      height: 1px;
      background-color: #cbcacf;
      margin: 0 16px;
    }
  }
}
</style>
