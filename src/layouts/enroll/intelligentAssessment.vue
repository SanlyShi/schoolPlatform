<template>
  <div class="intelligentAst">
    <div class="container-fluid intelligentAst-page ">
      <div class="t-row title">
        <span>智能评估</span>
        <span>本平台查询的成绩仅供参考，请以实际情况为准。</span>
      </div>
      <el-tabs v-model="currentTab" @tab-click="switchTab">
        <el-tab-pane v-for="(item, index) in tabs" :key="index" :label="item.label" :name="item.name"></el-tab-pane>
      </el-tabs>
      <el-form class="mt30" ref="searchInfo" :inline="true" :rules="rules" :model="searchInfo[currentTab]">
        <el-row>
          <el-col :span="4">
            <el-form-item label="省份:" prop="province">
              <el-select class="select" v-model="searchInfo[currentTab].province">
                <el-option v-for="(item,index) in areaArr" :key="index" :label="item.label" :value="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="层次:" prop="level">
              <el-select class="select" v-model="searchInfo[currentTab].level">
                <el-option v-for="(item,index) in levelArr" :key="index" :label="item.name" :value="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="录取方式:" prop="enrollWay">
              <el-select class="select" v-model="searchInfo[currentTab].enrollWay">
                <el-option v-for="(item,index) in enrollWayArr" :key="index" :label="item.name" :value="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="科类:" prop="subject">
              <el-select class="select" v-model="searchInfo[currentTab].subject">
                <el-option v-for="item in subjectArr" :key="item.type" :label="item.label" :value="item.type"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="currentTab == 'score'" :span="5">
            <el-form-item label="高考成绩:" prop="score">
              <el-input class="input" maxlength="3" v-model.number="searchInfo[currentTab].score" placeholder="请输入高考成绩"></el-input>
            </el-form-item>
          </el-col>
          <el-col v-if="currentTab == 'rank'" :span="5">
            <el-form-item label="高考排名:" prop="rank">
              <el-input class="input" v-model.number="searchInfo[currentTab].rank" placeholder="请输入高考排名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="search">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
      <div class="result" v-show="scoreData[this.currentTab].length > 0 || majorData[this.currentTab].length > 0">
        <div class="t-row title">
          <span>评估结果</span>
        </div>
        <el-row>
          <el-col :span="16" class="result-tip">你的分数所属省份往年在我校的录取情况如下</el-col>
          <el-col :span="8">
            <el-row>
              <el-col :span="12">
                <div class="circle blue"></div>
                <span class="result-tip">为可以录取年份</span>
              </el-col>
              <el-col :span="12">
                <div class="circle red"></div>
                <span class="result-tip">为不能录取年份</span>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <!-- 往年分数表格 -->
        <el-table :data="scoreData[this.currentTab]" style="width: 100%" class="mt30" :cell-class-name="selectClassName">
          <el-table-column v-if="currentTab == 'score'" v-for="(item, index) in scoreTable" :key="index" :prop="item.label" :label="item.name" align="center">
          </el-table-column>
          <el-table-column v-if="currentTab == 'rank'" v-for="(item, index) in majorTable" :key="index" :prop="item.label" :label="item.name" align="center">
          </el-table-column>
        </el-table>
        <!-- 专业及分数表格 -->
        <el-table :data="majorData[this.currentTab]" class="mt30" style="width: 100%" :cell-class-name="selectClassName1">
          <el-table-column prop="majorName" label="招生专业名称" width="460">
          </el-table-column>
          <el-table-column v-if="currentTab == 'score'" v-for="(item, index) in yearArr" :key="index" :prop="'score'+item.label" :label="item.label + '年计划招生数'" align="center">
          </el-table-column>
          <el-table-column v-if="currentTab == 'rank'" v-for="(item, index) in yearArr" :key="index" :prop="'rank'+item.label" :label="item.label+ '年最低分排名'" align="center">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import {
  sAjax
} from "../../assets/utils/utils.js";
import { setTimeout } from 'timers';
export default {
  data() {
    var validateEmpty = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error('必选'));
      } else {
        callback();
      }
    };
    var validateEmptyIpt = (rule, value, callback) => {
      // console.log(rule)
      if (this.currentTab === rule.field && value === '') {
        callback(new Error('必填'));
      } else {
        callback();
      }
    }
    const validateAcquaintance = (rule, value, callback) => {
      value = Number(value)
      if (typeof value === 'number' && !isNaN(value)) {
        if (value < 1) {
          callback(new Error('排名不能小于1'))
        } else {
          callback()
        }
      } else {
        callback(new Error('必须输入数字'))
      }
    }
    return {
      currentTab: 'score',
      tabs: [
        { label: '按分数', name: 'score' },
        { label: '按排名', name: 'rank' },
      ],
      yearArr: [],
      searchInfo:{
        score:  {
          province: null,
          level: null,
          enrollWay: null,
          subject: null,
          score: '',
          rank: '',
        },
        rank:  {
          province: null,
          level: null,
          enrollWay: null,
          subject: null,
          score: '',
          rank: '',
        },
      }, 
      subjectArr: [{
        type: 0,
        label: '理工'
      }, {
        type: 1,
        label: '文史'
      }, {
        type: 2,
        label: '综合改革'
      },
      ],
      areaArr: [],
      enrollWayArr: [
      ],
      levelArr: [
      ],
      rules: {
        province: [
          { validator: validateEmpty},
        ],
        enrollWay: [
          { validator: validateEmpty},
        ],
        level: [
          { validator: validateEmpty},
        ],
        subject: [
          { validator: validateEmpty},
        ],
        score: [
          { validator: validateEmptyIpt, trigger: ['blur', 'change'] },
          { type: 'number', message: '高考成绩必须填数字' },
        ],
        rank: [
          { validator: validateEmptyIpt, trigger: ['blur', 'change'] },
          // { validator: validateAcquaintance, trigger: ['blur', 'change'] },
          { type: 'number', message: '高考排名必须填数字' },
        ],
      },
      // 成绩表格表头
      scoreTable: [{
        label: 'year',
        name: '年份'
      }, {
        label: 'division',
        name: '科类'
      }, {
        label: 'maxScore',
        name: '最高分'
      }, {
        label: 'avgScore',
        name: '平均分'
      }, {
        label: 'minScore',
        name: '最低分'
      }, {
        label: 'provincialControlLine',
        name: '省控线'
      },
      ],
      // 专业表格表头
      majorTable: [{
        label: 'year',
        name: '年份'
      }, {
        label: 'division',
        name: '科类'
      }, {
        label: 'maxScoreRanking',
        name: '最高分排名'
      }, {
        label: 'avgScoreRanking',
        name: '平均分排名'
      }, {
        label: 'minScoreRanking',
        name: '最低分排名'
      }
      ],
      scoreData: {
        score: [],
        rank: []
      },
      majorData: {
        score: [],
        rank: []
      },
    }
  },
  created() {
    this.initArea()
    this.initEnrollWay()
    this.initLevel()
    this.initYear()
  },
  methods: {
    switchTab() {
      this.clearValidate()
      
      // this.scoreData = []
      // this.majorData = []
    },
    clearValidate() {
      // 移除校验
      this.$nextTick(() => {this.$refs.searchInfo.clearValidate();})
      
    },
    initArea() {
      this.areaArr = []
      this.provinceList.forEach((item, index) => {
        if (item.name == "台湾省" || item.name == "香港特别行政区" || item.name == "澳门特别行政区") { }
        else {
          let newArea = {};

          if (item.name.length == 3) {
            newArea["label"] = item.name.substring(0, 2)
          }
          else if (item.name.length == 4) {
            newArea["label"] = item.name.substring(0, 3)
          }
          else if (item.name.length == 5 || item.name.length == 6 || item.name.length == 7 || item.name.length == 8) {
            if (item.name.indexOf("内蒙") > -1) {
              newArea["label"] = item.name.substring(0, 3)
            }
            else {
              newArea["label"] = item.name.substring(0, 2)
            }
          }
          newArea["type"] = index
          this.areaArr.push(newArea)
        }

      });
    },
    initLevel() {
      sAjax({
        url: "/api/archives/demo/getPcSysDict?name=培养层次&labelName=智能评估",
        dataType: "json",
        type: "GET",
        async: false,
        success: (result) => {
          if (result.state) {
            this.levelArr = result.data
          }
          else {
            this.$toast("培养层次获取失败")
          }

        }
      })
    },
    initEnrollWay() {
      sAjax({
        url: "/api/archives/demo/getPcSysDict?name=录取方式&labelName=智能评估",
        dataType: "json",
        async: false,
        type: "GET",
        success: (result) => {
          if (result.state) {
            this.enrollWayArr = result.data
          }
          else {
            this.$toast("录取方式获取失败")
          }

        }
      })

    },
    initYear() {
      this.yearArr = []
      let date = parseInt(new Date().getFullYear())
      for (var i = date - 1; i > date - 4; i--) {
        let year = {}
        year['label'] = i
        year['type'] = i
        this.yearArr.push(year)
      }
    },
    // 为往年分数表格单格加背景样式
    selectClassName({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0 && row.isEnroll === 'OK') {
        return 'hightlight-b'
      } else if (columnIndex == 0 && row.isEnroll === 'NO') {
        return 'hightlight-r'
      }
    },
    // 为专业往年分数表格单格加背景样式
    selectClassName1({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 1 && row[`isEnroll${this.yearArr[0].label}`] == 'OK') {
        return 'hightlight-b'
      } else if (columnIndex == 2 && row[`isEnroll${this.yearArr[1].label}`] == 'OK') {
        return 'hightlight-b'
      } else if (columnIndex == 3 && row[`isEnroll${this.yearArr[2].label}`] == 'OK') {
        return 'hightlight-b'
      } else if (columnIndex == 1 && row[`isEnroll${this.yearArr[0].label}`] == 'NO') {
        return 'hightlight-r'
      } else if (columnIndex == 2 && row[`isEnroll${this.yearArr[1].label}`] == 'NO') {
        return 'hightlight-r'
      } else if (columnIndex == 3 && row[`isEnroll${this.yearArr[2].label}`] == 'NO') {
        return 'hightlight-r'
      }
    },
    search() {

      this.$refs['searchInfo'].validate((valid) => {
        if (valid) {
          // this.clearValidate()
          if (this.currentTab == 'score' && !this.searchInfo[this.currentTab].score) {
            this.$toast('请输入高考成绩')
            return;
          }
          if (this.currentTab == 'rank' && !this.searchInfo[this.currentTab].rank) {
            this.$toast('请输入高考排名')
            return;
          }
          let evaluationScore = this.searchInfo[this.currentTab].score,
            evaluationRanking = this.searchInfo[this.currentTab].rank,
            province = this.areaArr[this.searchInfo[this.currentTab].province].label,
            division = this.subjectArr[this.searchInfo[this.currentTab].subject].label,
            enrollmentModels = this.enrollWayArr[this.searchInfo[this.currentTab].enrollWay].value,
            educationLevel = this.levelArr[this.searchInfo[this.currentTab].level].value,
            pathKey = this.currentTab == 'score' ? 'score' : 'scoreRank',
            pathKey1 = this.currentTab == 'score' ? 'scoreMajor' : 'scoreMajorRank',
            param = this.currentTab == 'score' ? `evaluationScore=${evaluationScore}` : `evaluationRanking=${evaluationRanking}`

          // 往年分数
          sAjax({
            url: `/api/archives/evaluation/${pathKey}?page=0&size=99999&${param}&province=${province}&division=${division}&enrollmentModels=${enrollmentModels}&educationLevel=${educationLevel}`,
            dataType: "json",
            type: "GET",
            success: (result) => {
              // console.log(result)
              this.scoreData[this.currentTab] = []
              // this.scoreData.rank = []
              if (result.state) {
                this.scoreData[this.currentTab] = result.data.content
              } else {
                this.$toast(result.message)
              }
            }
          })
          // 专业及往年分数
          sAjax({
            url: `/api/archives/evaluation/${pathKey1}?page=0&size=99999&${param}&province=${province}&division=${division}&enrollmentModels=${enrollmentModels}&educationLevel=${educationLevel}`,
            dataType: "json",
            type: "GET",
            success: (result) => {
              // console.log(result)
              // this.majorData.score = []
              // this.majorData.rank = []
              this.majorData[this.currentTab] = []
              let year = this.yearArr
              if (result.state) {
                let list = result.data.content
                list[0].evaluationYear.map((item, index) => {
                  let obj = {}
                  obj['majorName'] = item.majorName
                  obj[`isEnroll${year[0].label}`] = list[0].evaluationYear[index].isEnroll
                  obj[`isEnroll${year[1].label}`] = list[1].evaluationYear[index].isEnroll
                  obj[`isEnroll${year[2].label}`] = list[2].evaluationYear[index].isEnroll
                  obj[`score${year[0].label}`] = list[0].evaluationYear[index].enrollNumber || '-'
                  obj[`score${year[1].label}`] = list[1].evaluationYear[index].enrollNumber || '-'
                  obj[`score${year[2].label}`] = list[2].evaluationYear[index].enrollNumber || '-'
                  obj[`rank${year[0].label}`] = list[0].evaluationYear[index].minScoreRanking || '-'
                  obj[`rank${year[1].label}`] = list[1].evaluationYear[index].minScoreRanking || '-'
                  obj[`rank${year[2].label}`] = list[2].evaluationYear[index].minScoreRanking || '-'
                  // console.log(obj)
                  this.majorData[this.currentTab].push(obj)
                })
                console.log(this.majorData)
              } else {
                this.$toast(result.message)
              }

            }
          })
        }
      })

    },
  }
}
</script>

<style lang="less">
.intelligentAst {
  position: absolute;
  overflow: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.intelligentAst-page {
  min-height: 100%;
  background: #fff !important;
  overflow: auto;
  min-width: 1300px;
  padding: 50px 120px;
  .title {
    margin-bottom: 20px;
  }
  .title span {
    display: inline-block;
    &:first-child {
      font-weight: bold;
      font-size: 18px;
      color: #222222;
      border-bottom: solid 3px rgb(148, 198, 251);
    }
    &:nth-child(2) {
      font-size: 12px;
      color: #999;
      margin-left: 10px;
    }
  }
  .t-row .title {
    display: inline-block;
    width: 70px;
    text-align: right;
    font-size: 14px;
    color: #353637;
    letter-spacing: -0.33px;
    margin-left: 10px;
  }

  .el-tabs__item {
    width: 80px;
    text-align: center;
  }

  .el-tabs__active-bar {
    border-bottom-width: 3px;
    border-radius: 2px;
  }
  .search-item {
    display: inline-block;
  }
  .result-tip {
    font-size: 14px;
    color: #999999;
    letter-spacing: 0;
    text-align: left;
  }
  .circle {
    display: inline-block;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    margin-right: 10px;
    vertical-align: middle;
    &.blue {
      background: #2a8ef8;
    }
    &.red {
      background: #f36d6d;
    }
  }
  .hightlight-b {
    background: rgba(42, 142, 248, 0.15);
    font-size: 14px;
    color: #298df8;
    border-left: 4px solid #3e92fe;
  }
  .hightlight-r {
    background: rgba(243, 109, 109, 0.15);
    font-size: 14px;
    color: #f36d6d;
    border-left: 4px solid #f36d6d;
  }
  .mt30 {
    margin-top: 30px;
  }
  .select {
    width: 110px;
  }
  .input {
    width: 130px;
  }
}
</style>

