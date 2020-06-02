<!--  -->
<template>
  <div id="formStatistics">
    <a type="button" @click="_back()" class="box_flex align_center back_wrap">
      <i class="maticon back-icon-btn" v-html="icons('arrow_back')">arrow_back</i><span class="nav-title">返回</span>
    </a>
    <div class="body">
      <div class="tab-wrap">
        <div class="tab-item" :class="{on: tabIndex=='statistics'}" @click="tabIndex='statistics'">统计</div>
        <div class="tab-item" :class="{on: tabIndex=='dimensionality'}" @click="tabIndex='dimensionality'">多维统计</div>
      </div>
      <div class="content">
        <div class="left-body">
          <h1>数据源</h1>
          <div class="form-title">{{curBusiness.appName}}</div>
          <div class="tree">
            <h1>字段</h1>
            <el-tree
              ref="formTree"
              v-show="tabIndex == 'statistics'"
              :data="treeData"
              show-checkbox
              node-key="name"
              :default-expand-all="true"
              :default-checked-keys="treeChecked"
              @check="handleTreeCheck"
              :props="defaultProps">
            </el-tree>
            <div v-show="tabIndex == 'dimensionality'" class="my-tree">
              <div v-for="(item,index) in treeData[0].children" :key="index" class="box_flex my-tree-wrap">
                <i class="my-tree-line"></i>
                <span class="my-tree-item">{{item.title}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="right-body">
          <div v-if="tabIndex == 'statistics'">
            <div class="statistic-select box_flex flex_between">
              <div class="radio-group">
                <div 
                  class="radio-button" 
                  :class="{on: selectIndex[tabIndex] == 'chart'}"  
                  @click="selectIndex[tabIndex]='chart'"
                >图表</div>
                <div 
                  class="radio-button" 
                  :class="{on: selectIndex[tabIndex] == 'word'}"  
                  @click="selectIndex[tabIndex]='word'"
                >文字</div>
              </div>
              <button class="btn batch-add-btn btn-bgColor-style" @click="exportStatistics">
                <i class="el-icon-download"></i> 导出
              </button>
            </div>

            <div v-if="isLoading.statistics" class="form-loading">
              <img :src="require('../../../assets/img/loading.gif')" alt="">
              <p class="loading-txt">加载中...</p>
            </div>
            <form-chart v-show="!isLoading.statistics&&selectIndex[tabIndex]=='chart'" :tableData="tableData.newStatistics"></form-chart>
            <form-table v-show="!isLoading.statistics&&selectIndex[tabIndex]=='word'" :tableData="tableData.newStatistics"></form-table>
          </div>
          <div v-else>
            <div class="dimensionality-select">
              <div class="select-box mb-16">
                <label>维度</label>
                <el-tag
                  :key="index"
                  v-for="(tag,index) in dimensionFields"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(index, 'dimensionFields')">
                  {{tag.length>4? tag.substring(0,4)+'...':tag}}
                </el-tag>
                <el-select 
                  class="input-new-tag"
                  size="small"
                  ref="dimensionFieldsInput"
                  v-if="inputVisible.dimensionFields"
                  v-model="inputValue.dimensionFields"
                  @change="handleSelect($event, 'dimensionFields')"
                  @blur="handleInputConfirm('dimensionFields')"
                  filterable 
                  placeholder="请选择">
                  <el-option
                    v-for="item in filterData"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-button 
                  v-else-if="dimensionFields.length<5" 
                  class="button-new-tag" 
                  size="small" 
                  @click="showInput('dimensionFields')"
                >+ 添加</el-button>

              </div>
              <div class="box_flex align_center flex_between flex_wrap">
                <div class="box_flex align_center mb-16">
                  <div class="select-box">
                    <label>指标</label>
                    <el-tag
                      :key="index"
                      v-for="(tag,index) in targetFields"
                      closable
                      :disable-transitions="false"
                      @close="handleClose(index, 'targetFields')">
                      {{tag}}
                    </el-tag>
                    <el-select 
                      class="input-new-tag"
                      size="small"
                      ref="targetFieldsInput"
                      v-if="inputVisible.targetFields"
                      v-model="inputValue.targetFields"
                      @change="handleSelect($event, 'targetFields')"
                      @blur="handleInputConfirm('targetFields')"
                      filterable 
                      placeholder="请选择">
                      <el-option
                        v-for="item in treeData[0].children"
                        :key="item.value"
                        :label="item.value"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <el-button 
                      v-else-if="targetFields.length==0" 
                      class="button-new-tag" 
                      size="small" 
                      @click="showInput('targetFields')"
                    >+ 添加</el-button>
                  </div>
                  <button class="btn batch-add-btn btn-bgColor-style" @click="getDimensionData">
                    统计
                  </button>
                  <button class="btn batch-add-btn btn-bgColor-style" @click="exportDimension">
                    <i class="el-icon-download"></i> 导出
                  </button>
                </div>
                <div class="radio-group mb-16">
                  <div 
                    class="radio-button" 
                    :class="{on: selectIndex[tabIndex] == 'chart'}"  
                    @click="selectIndex[tabIndex]='chart'"
                  >图表</div>
                  <div 
                    class="radio-button" 
                    :class="{on: selectIndex[tabIndex] == 'word'}"  
                    @click="selectIndex[tabIndex]='word'"
                  >文字</div>
                </div>
              </div>

              <template v-if="showTable">
                <div v-if="isLoading.dimensionality" class="form-loading">
                  <img :src="require('../../../assets/img/loading.gif')" alt="">
                  <p class="loading-txt">加载中...</p>
                </div>
                <form-chart v-show="!isLoading.dimensionality&&selectIndex[tabIndex]=='chart'" :columns="columns.chart" :tableData="tableData.dimensionality"></form-chart>
                <form-table v-show="!isLoading.dimensionality&&selectIndex[tabIndex]=='word'" :columns="columns.word" :tableData="tableData.dimensionality"></form-table>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import formTable from "./formTable.vue";
  import formChart from "./formChart.vue";
  import { sAjax, request, translation, createTime } from "../../../assets/utils/utils.js";
  export default {
    components: {
      formTable,
      formChart,
    },
    props: {
      curBusiness: {
        default: null
      },
      playerId: {
        default: null
      },
      searchParams: {
        default: null
      },
    },
    data() {
      return {
        allChecked: true,
        showTable: false,
        dimensionFields: [],
        targetFields: [],
        inputVisible: {
          dimensionFields: false,
          targetFields: false
        },
        inputValue: {
          dimensionFields: '',
          targetFields: ''
        },
        columns: {
          word: [],
          chart: [],
        },
        tabIndex: "statistics",
        selectIndex: {
          statistics: "word",
          dimensionality: "word",
        },
        treeData: [{
          name: "0",
          title: '全选',
          children: []
        }],
        filterData: [],
        treeChecked: [],
        defaultProps: {
          children: 'children',
          label: 'title'
        },
        isLoading: {
          statistics: true,
          dimensionality: true,
        },
        tableData: {
          statistics: [],
          newStatistics: [],
          dimensionality: [],
        },
      }
    },
    computed: {
    },
    watch: {
    },
    created() {},
    mounted() {
      this.$nextTick(()=>{
        this.getFields()
        this.getStatisticsData()
      })
    },
    methods: {
      getFields() {
        request(`/api/statistics/formEngine/business/${this.curBusiness.id}/statistics/components?playerId=${this.playerId}`).then(res => {
          if (res.state) {
            this.treeData[0].children = res.data
            this.$set(this.treeData[0], 'children',res.data)
            let treeChecked = res.data.map((item,index) => {
              item.value = item.title
              if(item.joinStatistics) {
                this.filterData.push(item)
              }
              return item.name
            })
            this.$set(this, 'treeChecked', treeChecked)

            this.$nextTick(() => {
                this.$refs.formTree.setCheckedKeys(this.treeChecked);//获取已经设置的资源后渲染
            });
            this.$forceUpdate()
          } else {
            this.$toast(res.message)
          }
        })
      },
      // 普通统计
      getStatisticsData() {
        request(`/api/statistics/formEngine/business/${this.curBusiness.id}/statistics?playerId=${this.playerId}${this.searchParams}`, {}, "post").then(res => {
          if (res.state) {
            this.tableData.statistics = res.data
            this.tableData.statistics.forEach((item, i) => {
              item.isChecked = true
              this.computeCount(item)
              if (this.hasShowMoreData(item.name)) {
                item.children = []
                item.details.map(e => {
                  if (e.name !== '未填写' || e.name !== '未上传') {
                    item.children.push(e)
                  }
                })
              }
            });
            this.tableData.newStatistics = this.tableData.statistics
            this.isLoading.statistics = false
          } else {
            this.$toast(res.message)
          }
        })
      },
      // 多维统计
      getDimensionData() {
        let params = this.getDimensionParams()
        if(!params) {
          return;
        }
        this.showTable = true
        let url = `/api/statistics/formEngine/business/${this.curBusiness.id}/statistics/dimension?playerId=${this.playerId}${this.searchParams}`
        request(url, params, "post").then(res => {
          if (res.state) {
            this.tableData.dimensionality = res.data
            this.tableData.dimensionality.forEach(item => {
              
              for(let key in item.dimension) {
                item[key] = item.dimension[key]
              }

              this.computeCount(item)
              if(this.hasShowMoreData(params.targetFields)) {
                item.details.map(e => {
                  item[e.name] = e.text
                })
                let columns = []
                item.s
              }
            })
            if(this.hasShowMoreData(params.targetFields)) {
              let columns = []
              this.tableData.dimensionality[0].details.map(item => {
                columns.push({
                  value: item.name,
                  label: item.name,
                  align: "left",
                  width:  140,
                })
              })
              this.columns.word = [...this.columns.word, ...columns]
            }
            this.isLoading.dimensionality = false
          } else {
            this.$toast(res.message)
          }
        })
      },
      computeCount(item) {
        var oldData = [];
        var length = item.details.length;
        let doneCount = 0;
        var allCount = item.details.reduce((total, currentValue) => {
          return total + currentValue.count
        }, 0)
        item.details.forEach(ele => {
          ele.count = ele.count || 0;
          // allCount += ele.count;
          if (ele.name !== '未填写' && ele.name !== '未上传') {
            doneCount += ele.count
          }

          let prent = this.computePercent(allCount, ele.count)
          this.$set(ele, "percent", prent);
          this.$set(ele, "text", `${ele.count}(${prent})`);
        });

        let notDoneCount = Number(allCount-doneCount)
        this.$set(item, "doneText", `${doneCount}(${this.computePercent(allCount, doneCount)})`);
        this.$set(item, "notDoneText", `${notDoneCount}(${this.computePercent(allCount, notDoneCount)})`);

      },
      computePercent(allCount, count) {
        
        let num = 0;
        if (allCount > 0) {
          num = count / allCount;
        }
        let prent = Number(num * 100).toFixed(2) + "%";
        return prent;
      },
      exportStatistics() {
        let name = `${this.curBusiness.appName}统计${this.getCurrentDate()}`
        let params = `?playerId=${this.playerId}&fileName=${name}${this.searchParams}`
        window.location.href = `/downloads/statistics/formEngine/business/${this.curBusiness.id}/statistics/excel${params}`
      },
      exportDimension() {
        let dimensionParams = this.getDimensionParams()
        if(!dimensionParams) {
          return;
        }

        let name = `${this.curBusiness.appName}多维统计${this.getCurrentDate()}`
        let params = `?playerId=${this.playerId}&fileName=${name}&dimensionFields=${dimensionParams.dimensionFields}&targetFields=${dimensionParams.targetFields}${this.searchParams}`
        window.location.href = `/downloads/statistics/formEngine/business/${this.curBusiness.id}/statistics/dimension/excel${params}`
      },
      getCurrentDate() {
        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        if (month < 10) month = "0" + month;
        if (day < 10) day = "0" + day;
        return `${year}${month}${day}`
      },
      getDimensionParams() {
        let arr = []
        if(this.dimensionFields.length==0) {
          this.$toast('维度不能为空')
          return false;
        }
        if(this.targetFields.length==0) {
          this.$toast('指标不能为空')
          return false;
        }
        let columns = []
        this.dimensionFields.map(item => {
          let o = this.filterData.find(t => t.value === item)
          columns.push({
            value: o.name,
            label: item,
            width: 160,
          })
          arr.push(o.name)
        })
        let params = {
          dimensionFields: arr,
          targetFields: this.treeData[0].children.find(t => t.value === this.targetFields[0]).name
        }
        let wordColumns = [
          {
            value: "doneText",
            label: `${this.targetFields[0]}(已填写)`,
            align: "center",
            width: columns.length > 2 ? 180 : '',
          },
          {
            value: "notDoneText",
            label: `${this.targetFields[0]}(未填写)`,
            align: "center",
            width: columns.length > 2 ? 180 : '',
          },
        ]
        if(this.hasShowMoreData(params.targetFields)) {
          wordColumns = []
        }
        let chartColums = [
          {
            value: "chart",
            label: this.targetFields[0],
            width: columns.length > 2 ? 400 : '',
          }
        ]
        this.columns.word = [...columns, ...wordColumns]
        this.columns.chart = [...columns, ...chartColums]
        return params
      },
      hasShowMoreData(data) {
        if(
          data.indexOf('radio') > -1 ||
          data.indexOf('checkbox') > -1 ||
          data.indexOf('address') > -1 ||
          data.indexOf('datetime') > -1 ||
          data.indexOf('select') > -1 
        ) {
          return true
        }
        return false
      },
      _back: function () {
        this.$emit('back')
      },
      handleClose(index, key) {
        this.showTable = false
        this.isLoading.dimensionality = true
        this[key].splice(index, 1);
      },

      showInput(key) {
        this.inputVisible[key] = true;
        this.$nextTick(_ => {
          this.$refs[`${key}Input`].focus();
        })
      },
      handleSelect(item, key) {
        this.handleInputConfirm(key)
      },
      handleInputConfirm(key) {
        this.showTable = false
        this.isLoading.dimensionality = true
        setTimeout(() => {
          let inputValue = this.inputValue[key];
          if(this[key].findIndex(o => o === inputValue) > -1) {
            this.$toast('您已选择了该字段')
          } else if (inputValue) {
            this[key].push(inputValue);
          }
          this.inputVisible[key] = false;
          this.inputValue[key] = '';
        }, 100);
      },
      handleTreeCheck(val) {
        if(val.name === "0") {
          let allChecked = true
          this.tableData.newStatistics.length === this.tableData.statistics.length && (allChecked = !this.allChecked)
          this.allChecked = allChecked
          this.tableData.statistics.forEach(element => {
            this.$set(element, 'isChecked', allChecked)
          });
          this.tableData.newStatistics = this.allChecked ? this.tableData.statistics : []
        } else {
          let obj = this.tableData.statistics.find(o => o.name == val.name)
          this.$set(obj, 'isChecked', !obj.isChecked)
          this.tableData.newStatistics = this.tableData.statistics.filter(o => o.isChecked)
        }
      }
    }
  }
</script>

<style lang="less" scoped>
#formStatistics {
  width: 100%;
  height: 100%;
  a.back_wrap {
    top: 0;
    left: 10px;
    margin-bottom: 10px;
    display: inline-flex;
  }
  .body {
    background: #fff;
    .tab-wrap {
      display: flex;
      width: 100%;
      height: 56px;
      line-height: 56px;
      border-bottom: 1px solid #DCDFE6;
      .tab-item {
        padding: 0 15px;
        color: #303133;
        font-size: 14px;
        font-weight:500;
        cursor: pointer;
        &.on {
          color: #298DF7;
          border-bottom: 2px solid #298DF7;
        }
      }
    }
    .content {
      display: flex;
      min-height: 450px;
      max-height: 580px;
      .left-body, .right-body {
        display: inline-block;
        overflow-y: auto; 
      }
      .left-body {
        width: 329px;
        padding: 24px;
        h1 {
          color: #303133;
          font-size: 14px;
          font-weight:500;
          line-height: 20px;
        }
        .form-title {
          color: #303133;
          font-size: 14px;
          line-height:20px;
          width:266px;
          border-bottom: 2px solid #DCDFE6;
          padding-bottom: 4px;
          margin-top: 17px;
        }
        .tree {
          margin-top: 43px;
          h1 {
            margin-bottom: 24px;
          }
        }
        .my-tree {
          .my-tree-wrap {
            align-items: center;
            padding-left: 20px;
            margin-bottom: 20px;
          }
          .my-tree-line {
            width:6px;
            height:1px;
            background:rgba(77,121,246,1);
          }
          .my-tree-item {
            color: #606266;
            font-size: 14px;
            margin-left: 14px;
            line-height: 14px;
          }
        }
      }
      .right-body {
        width: calc( 100% - 334px);
        border-left: 1px solid #DCDFE6;
        padding: 24px;
        .btn {
          // width: 90px;
          height: 40px;
        }
        .mb-16 {
          margin-bottom: 16px;
        }
        .radio-group {
          height: 40px;
          display: flex;
        }
        .radio-button {
          width: 70px;
          border: 1px solid #DCDFE6;
          border-right: none;
          height: 40px;
          line-height: 40px;
          text-align: center;
          font-size: 14px;
          color: #606266;
          cursor: pointer;
          &:last-child {
            border-radius: 0 4px 4px 0;
            border-left: none;
            border-right: 1px solid #DCDFE6;
          }
          &:first-child {
            border-radius: 4px 0 0 4px;
          }
          &.on {
            background: #409EFF;
            border: 1px solid #409EFF;
            color: #fff;
          }
        }
        .statistic-select {
          margin-bottom: 44px;
        }
        .select-box {
          display: flex;
          align-items: center;
          min-width: 617px;
          max-width: 650px;
          height: 48px;
          line-height: 48px;
          border-radius: 4px;
          border: 1px solid rgba(220,223,230,1);
          color: #606266;
          font-size: 14px;
          padding-left: 24px;
          margin-right: 30px;
          label {
            flex: 0 0 30px;
            margin-right: 10px;
            margin-bottom: 0;
          }
          .el-tag {
            margin-left: 10px;
            background: rgba(249,250,255,0.6);
            border-color: #298DF7;
            color: #298DF7;
            font-size: 13px;
          }
          .button-new-tag {
            margin-left: 10px;
            height: 32px;
            line-height: 30px;
            padding-top: 0;
            padding-bottom: 0;
            font-size: 13px;
            color: #606266;
            &:hover {
              color:#298DF7;
            }
            .el-icon-arrow-up {
              line-height: 30px;
            }
          }
          .input-new-tag {
            width: 90px;
            height: 32px;
            line-height: 30px;
            margin-left: 10px;
            vertical-align: bottom;
          }
        }
      }
    }
    .form-loading {
      width: 100%;
      display: flex;
      position: relative;
      justify-content: center;
      align-items: center;
      color: #C2C5CD;
      font-size: 14px;
      img {
        width: 384px;
        height: 314px;
      }
      .loading-txt {
        position: absolute;
        bottom: 60px;
      }
    }
  }
}
</style>
<style lang="less">
#formStatistics {
  .el-tree-node__content {
    height: 32px;
  }
  .el-tree-node__label {
    color: #606266;
  }
  .el-table__row {
    height: 64px;
    // pointer-events: none; 
    .cell {
      color: #303133;
    }
  }
  .inner-table {
    border-left: 4px solid rgba(239,242,249,0.8);
    .el-table__row {
      height: 50px;
      .cell {
        color: #606266;
        font-size: 13px;
      }
    }
  }
  .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
}
</style>

