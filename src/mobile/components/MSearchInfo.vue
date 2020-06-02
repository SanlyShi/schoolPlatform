<!--  -->
<template>
  <div>
    <div class="c-search-info">
      <div class="c-search-wrap">
        <div class="c-search-box">
          <img class="icon-search" src="../../../mobile_static/image/icon_search.png" alt="">
          <x-input :style="'width:'+ inputW" v-model="searchInfo.keyword" @on-focus="changeInputWidth" @on-change="_confirmSearchInfo" :show-clear="false" :placeholder="placeholder" :min="min" :max="max" :placeholder-align="textAlign">
          </x-input>
        </div>
      </div>
      <div class="c-search-btn" @click="showSearchBox.main = !showSearchBox.main">
        <img src="../../../mobile_static/image/select@2x.png" alt="" />
      </div>
    </div>
    <!-- 主搜索 -->
    <div class="c-search-body" v-if="showSearchBox.main">
      <div class="c-search-mask" @click="showSearchBox.main = !showSearchBox.main"></div>
      <div class="c-search-main">
        <cell title="学院" is-link :border-intent="false" @click.native="showSearchBox.college = !showSearchBox.college" :value="formatCollegeVal(searchInfo.college.value)"></cell>
        <div v-for="(item, index) in searchInfo" v-if="item.type=='cell'" :key="index">
          <cell :title="item.name" :border-intent="false"></cell>
          <div class="c-select">
            <div v-for="(n, i) in item.list" :key="i" class="c-select-item" :class="{'on': n.checked}" @click="_selectItem(item.key, i)">{{n.value}}</div>
          </div>
        </div>
        <cell title="高级搜索" :border-intent="false" @click.native="showSearch">
          <div slot class="c-advanced-add">
            <img src="../../../mobile_static/image/icon_add.png" alt="">
          </div>
        </cell>
        <div class="c-advanced-cnt">
          <div v-for="(item, index) in searchInfo.advancedSearch.value" :key="index" class="c-advanced-item">
            {{advancedSearch.optionKeys[item.key].keyName}}
            <div class="c-advanced-item-delete" @click="deleteAdvancedSearch(index)">
              <img src="../../../mobile_static/image/icon_closed.png" alt="">
            </div>
          </div>
        </div>
  
        <footer>
          <x-button class="c-ft-btn-reset" @click.native="_resetSearchInfo">重置</x-button>
          <x-button class="c-ft-btn-sub" @click.native="_confirmSearchInfo">确定</x-button>
        </footer>
      </div>
    </div>
    <!-- 选择学院 -->
    <div class="c-search-body" v-if="showSearchBox.college">
      <div class="c-search-mask" @click="cancelCollege"></div>
      <div class="c-search-main">
        <div class="c-search-info">
          <div class="c-search-wrap no-line">
            <div class="c-search-box">
              <i class="maticon back-icon" v-html="icons('search')"></i>
              <x-input style="width: 100%;" placeholder="搜索学院" :placeholder-align="textAlign" v-model="collegeKey" :show-clear="false" @on-change="searchCollege">
              </x-input>
            </div>
          </div>
        </div>
        <div class="c-college-list">
          <checklist :options="searchInfo.college.tempList" v-model="searchInfo.college.tempVal" @on-change="change"></checklist>
        </div>
        <footer>
          <x-button class="c-ft-btn-reset" @click.native="resetCollege">重置</x-button>
          <x-button class="c-ft-btn-sub" @click.native="confirmCollege">确定(共{{searchInfo.college.tempVal.length}}个学院)</x-button>
        </footer>
      </div>
    </div>
    <!-- 高级搜索 -->
    <div class="c-search-body" v-if="advancedSearch.show">
      <div class="c-search-mask" @click="cancelAdvancedSearch"></div>
      <div class="c-search-ad">
        <div class="c-search-ad-t">
          <div class="c-search-ad-t-btn" @click="cancelAdvancedSearch">取消</div>
          <div class="c-search-ad-title">高级搜索</div>
          <div class="c-search-ad-t-btn" @click="confirmAdvanced">完成</div>
        </div>
        <div class="c-search-ad-body">
          <div class="c-search-ad-row">
              <v-select
                class="c-ad-box flex2"
                :options="advancedSearch.columns"
                :value="advancedSearch.searchItems[0].key"
                :search="true"
                :data-index="0"
                @afterSelected="advancedSearchKeySelected"
              ></v-select>
              <v-select
                class="c-ad-box flex1"
                :options="advancedSearch.searchItems[0].options.relation"
                :value="advancedSearch.searchItems[0].relation"
                :search="true"
                :data-index="0"
                @afterSelected="advancedSearchRelationSelected"
              ></v-select>
            </div>
            <div class="c-search-ad-row">
              <v-select
                :options="advancedSearch.searchItems[0].options.dictOptions"
                :value="advancedSearch.searchItems[0].value"
                optionsLabel="text"
                optionsValue="id"
                :search="true"
                :multiple="true"
                :data-index="0"
                @afterSelected="advancedSearchValueSelected"
                v-if="advancedSearch.searchItems[0].isDict"
              ></v-select>
              <v-select
                :options="advancedSearch.searchItems[0].options.province"
                :value="advancedSearch.searchItems[0].province"
                optionsLabel="text"
                optionsValue="id"
                :search="true"
                :multiple="true"
                :data-index="0"
                @afterSelected="advancedSearchProvinceSelected"
                v-if="advancedSearch.searchItems[0].isAddress"
              ></v-select>
              <v-select
                :options="advancedSearch.searchItems[0].options.city"
                :value="advancedSearch.searchItems[0].city"
                optionsLabel="text"
                optionsValue="id"
                :search="true"
                :multiple="true"
                :data-index="0"
                @afterSelected="advancedSearchCitySelected"
                v-if="advancedSearch.searchItems[0].isSelectProvince"
              ></v-select>
              <v-select
                :options="advancedSearch.searchItems[0].options.county"
                :value="advancedSearch.searchItems[0].county"
                optionsLabel="text"
                optionsValue="id"
                :search="true"
                :multiple="true"
                :data-index="0"
                @afterSelected="advancedSearchCountySelected"
                v-if="advancedSearch.searchItems[0].isSelectCity"
              ></v-select>
              <v-datepicker
                  ref="datepicker"
                  class="btn-block time-picker value-datepicker"
                  :value="advancedSearch.searchItems[0].value"
                  :clearButton="false"
                  :showTime="false"
                  :data-index="0"
                  @daySelected="advancedSearchDateValue"
                  v-if="advancedSearch.searchItems[0].isDate"
              ></v-datepicker>
                <input  
                    type="text"
                    class="c-ipt-wrap flex1"
                    v-if="advancedSearch.searchItems[0].isInput"
                    v-model="advancedSearch.searchItems[0].value"
                    placeholder="请输入搜索内容"
                />
    
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    sAjax
  } from '../../assets/utils/utils';
  import advancedSearch from "../../mixins/advancedSearch2.js"
  export default {
    mixins: [advancedSearch],
    props: {
      placeholder: {
        default: '输入学号或姓名进行搜索'
      },
      collegeList: {
        default: () => []
      },
      type: {
        default: ''
      }
    },
    data() {
      return {
        showSearchBox: {
          main: false, // 主搜索框
          college: false, // 搜索学院
          advanced: false, // 高级搜索
        },
        inputW: '60%',
        collegeKey: '',
        searchInfo: {
          keyword: '',
          college: {
            type: 'popup-r',
            name: '学院',
            key: 'college',
            tempList: [],
            list: [],
            tempVal: [],
            value: []
          },
          educationLevel: {
            type: 'cell',
            name: '培养层次',
            key: 'educationLevel',
            list: [],
            value: []
          },
          grade: {
            type: 'cell',
            name: '年级',
            key: 'grade',
            list: [],
            value: [],
          },
          advancedSearch: {
            type: 'popup-b',
            name: '高级搜索',
            list: [],
            value: []
          },
        },
      }
    },
    computed: {
      keyword() {
        return this.searchInfo.keyword
      }
    },
    watch: {
      type(val) {
        this.initCollege()
        this._resetSearchInfo()
      }
    },
    created() {
      this.initYear()
      this.initEducationLevel()
      this.initAdvancedSearchTableKeys()
    },
    mounted() {},
    methods: {
      initYear() {
        let now = new Date()
        let currentYear = now.getFullYear()
        let yearArr = []
        for (let i = 0; i < 6; i++) {
          yearArr.push({
            key: currentYear - i,
            value: `${currentYear - i}级`,
            checked: false
          })
        }
        this.searchInfo.grade.list = yearArr
      },
      initEducationLevel() {
        sAjax({
          url: '/api/system/dicts?dictType=培养层次',
          type: 'get',
          success: (data) => {
            if (data.state) {
              data.data.forEach((ele) => {
                ele.key = ele.value
                ele.value = ele.label,
                ele.checked = false
              })
              this.$set(this.searchInfo.educationLevel, 'list', data.data)
            }
          }
        })
      },
      initCollege() {
        sAjax({
          url: `/api/student/manage/getSelectOptions?type=${this.type}`,
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.searchInfo.college.list = []
              data.data.colleges.map(item => {
                this.searchInfo.college.list.push({
                  key: item.id,
                  value: item.text
                })
                this.searchInfo.college.tempList = this.searchInfo.college.list
              })
            } else {
              this._toast(data.message)
            }
          }
        })
      },
      showSearch: function() {
        this.advancedSearch.show = true
        this.addSearchItem()
      },
      _selectItem(key, index) {
        this.searchInfo[key].list[index].checked = !this.searchInfo[key].list[index].checked 
  
      },
      _resetSearchInfo() {
         this.searchInfo.educationLevel.list.forEach(item => {
           item.checked = false
         })
         this.searchInfo.grade.list.forEach(item => {
           item.checked = false
         })
         this.searchInfo.advancedSearch.value = []
         this.searchInfo.college.value = []
         this.resetCollege()
      },
      changeInputWidth() {
        this.inputW = '100%'
      },
      isShowSearchMain() {
        this.showSearchBox.main = !this.showSearchBox.main
      },
      cancelAdvancedSearch() {
        this.advancedSearch.show = false
        this.advancedSearch.searchItems = []
      },
      confirmAdvanced() {
        this.searchInfo.advancedSearch.value.push(this.advancedSearch.searchItems[0])
        this.cancelAdvancedSearch()
      },
      deleteAdvancedSearch(idx) {
        this.searchInfo.advancedSearch.value.splice(idx, 1)
      },
      searchCollege(keyword) {
        if (keyword == '') {
          this.searchInfo.college.tempList = this.searchInfo.college.list
          return;
        }
        this.searchInfo.college.tempList = this.searchInfo.college.list.filter(item => {
          return item.value.indexOf(keyword) > -1
        })
        this.$set(this.searchInfo.college, 'tempList', this.searchInfo.college.tempList)
      },
      cancelCollege() {
        this.showSearchBox.college = false
        this.searchInfo.college.tempVal = this.searchInfo.college.value 
        // this.resetCollege()
      },
      resetCollege() {
        this.searchInfo.college.tempList = this.searchInfo.college.list
        this.searchInfo.college.tempVal = []
        this.collegeKey = ''
      },
      confirmCollege() {
        this.searchInfo.college.value = this.searchInfo.college.tempVal
        this.showSearchBox.college = false
      },
      formatCollegeVal(arr) {
      
        if (arr.length == this.searchInfo.college.list.length) {
          return '全部'
        } else if (arr.length == 1) {
          let obj = this.searchInfo.college.list.find(item => item.key == arr[0])
          return obj.value
        } else if (arr.length > 1) {
          let obj = this.searchInfo.college.list.find(item => item.key == arr[0])
          return `${obj.value}等${arr.length}个学院`
        } else {
          return '请选择'
        }
      },
      _confirmSearchInfo() {
        let e = this.searchInfo
        let info = {}
         info.searchDTOS = e.advancedSearch.value.map(
          searchItem => {
            return {
              key: searchItem.key,
              relation: searchItem.relation,
              value: searchItem.value,
              tableName: this.advancedSearch.optionKeys[searchItem.key].tableName,
              listValues: searchItem.value ? searchItem.value.split(',') : [],
              provinces: searchItem.province
                ? searchItem.province.split(',')
                : [],
              cities: searchItem.city ? searchItem.city.split(',') : [],
              counties: searchItem.county ? searchItem.county.split(',') : []
              // type: searchItem.type
            }
          }
        )
        info.college = this.arrayToString(e.college.value)
        let grade = []
        e.grade.list.map(item => {
          if(item.checked) {
            grade.push(item.key)
          }
        })
        info.grade = this.arrayToString(grade)
        let educationLevel = []
        e.educationLevel.list.map(item => {
          if(item.checked) {
            educationLevel.push(item.key)
          }
        })
        info.educationLevel = this.arrayToString(educationLevel)
        info.keyword = e.keyword
        this.$emit('search', info)
        this.showSearchBox.main = false
      },
      arrayToString(arr) {
        if(arr.length == 0) {
          return ''
        }
        return arr.join(',')
      },
    }
  }
</script>

<style lang="less" scoped>
  .c-search-info {
    background-color: #fff;
    padding: 10px;
    display: flex;
    .c-search-wrap {
      width: 100%;
      height: 30px;
      border-radius: 15px;
      border: 1px solid rgba(192, 196, 204, 1);
      box-sizing: border-box;
      margin: 0 10px;
      padding: 0 10px;
      &.no-line {
        border: none;
        background: #F6F6F6;
      }
      .c-search-box {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .icon-search {
        width: 18px;
        height: 18px;
        margin-right: 4px;
      }
      .weui-cell {
        padding: 5px 0;
      }
    }
    .c-search-btn {
      flex: 0 0 22px;
      margin: 4px 0;
      img {
        width: 22px;
        height: 22px;
      }
    }
  }
  
  .c-search-body {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 101;
    .c-search-mask {
      width: 100%;
      height: 100%;
      background: #000;
      opacity: 0.2;
    }
    .c-search-main {
      position: fixed;
      box-sizing: border-box;
      top: 0;
      right: 0;
      bottom: 0;
      width: 300px;
      height: 100%;
      // padding: 10px 15px;
      padding-bottom: 58px;
      background: #fff;
      z-index: 102;
      .c-select {
        display: flex;
        flex-wrap: wrap;
        margin: 0 0 0 15px;
        .c-select-item {
          width: 80px;
          height: 28px;
          line-height: 28px;
          text-align: center;
          border-radius: 1px;
          border: 1px solid rgba(192, 196, 204, 1);
          font-size: 12px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(144, 147, 153, 1);
          margin: 0 15px 10px 0;
          &.on {
            border: 1px solid rgba(236, 247, 255, 1);
            background: rgba(236, 247, 255, 1);
            color: rgba(41, 141, 247, 1);
          }
        }
      }
      .c-advanced-add {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        text-align: center;
        background: #298df7;
        font-size: 26px;
        color: #fff;
        border-radius: 50%;
        img {
          width: 20px;
          height: 20px;
        }
      }
      .c-advanced-cnt {
        margin: 0 15px;
      }
      .c-advanced-item {
        position: relative;
        text-align: center;
        width: 100%;
        height: 28px;
        line-height: 28px;
        background: rgba(236, 247, 255, 1);
        border-radius: 1px;
        font-weight: 400;
        color: rgba(41, 141, 247, 1);
        font-size: 12px;
        margin-bottom: 10px;
      }
      .c-advanced-item-delete {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 19px;
        height: 19px;
        img {
          width: 19px;
          height: 19px;
          vertical-align: baseline;
        }
      }
      footer {
        position: fixed;
        bottom: 11px;
        right: 18px;
        display: flex;
        .c-ft-btn-reset {
          width: 104px;
          height: 38px;
          line-height: 38px;
          background: rgba(192, 196, 204, 0.34);
          border-radius: 1px;
          font-size: 14px;
          font-weight: 400;
          color: rgba(96, 98, 102, 1);
          margin-right: 16px;
          border: none;
        }
        .c-ft-btn-sub {
          width: 150px;
          height: 38px;
          line-height: 38px;
          background: rgba(41, 141, 247, 1);
          border-radius: 1px;
          font-size: 14px;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          margin-top: 0;
          border: none;
        }
      }
    }
    .c-search-ad {
      position: fixed;
      bottom: 0;
      width: 100%;
      height: 336px;
      background: rgba(255, 255, 255, 1);
      border-radius: 18px 18px 0 0;
      .c-search-ad-t {
        height: 50px;
        border-bottom: 1px solid #CCCCD0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        font-weight: 500;
        box-sizing: border-box;
        padding: 0 15px;
        .c-search-ad-t-title {
          color: rgba(0, 0, 0, 1);
        }
        .c-search-ad-t-btn {
          color: rgba(41, 141, 247, 1);
        }
      }
      .c-search-ad-row {
        display: flex;
        padding: 15px 0 0 15px;
        .c-ad-box {
          // height: 32px;
          background: rgba(255, 255, 255, 1);
          border-radius: 3px;
          // border: 1px solid rgba(217, 217, 217, 1);
          margin-right: 15px;
        }
        .c-ipt-wrap {
          border: 1px solid #ccc;
          padding: 6px 12px;
          border-radius: 8px;
          margin-right: 15px;
          font-size: 14px;
          outline: none;
        }

        .flex1 {
          flex: 1,
        }
        .flex2 {
          flex: 2
        }
        .w230 {
          flex: 0 0 226px;
          width: 226px;
        }
      }
    }
  }
</style>

<style lang="less">
  .c-search-info,
  .c-search-body {
    .vux-cell-primary p,
    .weui-cell__bd p {
      margin: 0;
    }
    .weui-cells_checkbox .weui-check:checked+.vux-checklist-icon-checked:before,
    .weui-cells_checkbox .weui-check:checked+.vux-checklist-icon-checked:before,
    .weui-cells_checkbox .weui-check:checked+.weui-icon-checked:before,
    .weui-cells_checkbox .weui-check:checked+.weui-icon-checked:before {
      color: #298DF7 !important;
    }
    .vux-cell-box:before {
      border-top: none !important;
    }
    .weui-cells,
    .weui-cell {
      &::before {
        border-top: none !important;
      }
      &::after {
        border-bottom: none !important;
      }
    }
    .weui-check_label,
    .vux-radio-label,
    .weui-cell_access,
    .weui-label,
    .vux-label {
      font-size: 14px;
      color: #333;
      letter-spacing: 0;
      text-decoration: none;
    }
    .weui-cell:before {
      border-top: none !important;
    }
    .weui-cell_access .weui-cell__ft:after {
      color: rgba(0, 0, 0, 0.54);
      -webkit-transform: matrix(0.71, 0.71, 0.71, -0.71, 0, 0) !important;
      transform: matrix(0.71, 0.71, 0.71, -0.71, 0, 0) !important;
    }
    .weui-btn:after {
      border-radius: 1px;
    }
  }
</style>
