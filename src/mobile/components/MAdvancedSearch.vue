<!--  -->
<template>
  <div>
    <div class="c-search-info">
      <div class="c-search-wrap">
        <div class="c-search-box">
          <img class="icon-search" src="../../../mobile_static/image/icon_search.png" alt="">
          <x-input :style="'width:'+ inputW" v-model="searchInfo.keyword" :show-clear="false" @on-focus="changeInputWidth" @on-change="_confirmSearchInfo" :placeholder="placeholder" :min="min" :max="max" :placeholder-align="textAlign">
          </x-input>
        </div>
      </div>
      <div class="c-search-btn" @click="_showSearch">
        <img src="../../../mobile_static/image/select@2x.png" alt="" />
      </div>
    </div>
    <!-- 主搜索 -->
    <div class="c-search-body" v-if="showSearchModel">
      <div class="c-search-mask" @click="showSearchModel = !showSearchModel"></div>
      <div class="c-search-main">
        <cell title="学院" is-link :border-intent="false" @click.native="showSearchBox.college = !showSearchBox.college" :value="formatCollegeVal(this.selectColege.label)"></cell>
        <div v-for="(item, index) in searchInfo" v-if="item.type=='cell'" :key="index">
          <cell :title="item.name" :border-intent="false"></cell>
          <div class="c-select">
            <div v-for="(n, i) in item.list" :key="i" class="c-select-item" :class="{'on': n.checked}" @click="_selectItem(item.key, i)">{{n.value}}</div>
          </div>
        </div>
        <cell v-if="curCountNodeId" title="高级搜索" :border-intent="false" @click.native="addAdvancedSearch">
          <div slot class="c-advanced-add">
            <img src="../../../mobile_static/image/icon_add.png" alt="">
          </div>
        </cell>
        <div v-if="curCountNodeId" class="c-advanced-cnt">
          <div v-for="(item, index) in advancedSearch.searchItems" @click="editAdvancedSearch(index)" :key="index" class="c-advanced-item">
            {{item.title}}
            <div class="c-advanced-item-delete" @click.stop="deleteAdvancedSearch(index)">
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
              <x-input style="width: 100%;" placeholder="搜索学院" :show-clear="false" :placeholder-align="textAlign" v-model="collegeKey" @on-change="searchCollege">
              </x-input>
            </div>
          </div>
        </div>
        <div class="c-college-list">
          <checklist :options="searchInfo.college.tempList"  v-model="searchInfo.college.tempVal" @on-change="changeCollege"></checklist>
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
        <div class="c-search-ad-body" v-for="(searchItem, index) in advancedSearch.searchItems.filter((o,i)=>{return i === editIndex})" :key="'search-item-' + index">
          <div class="c-search-ad-row">
            <v-select class="c-ad-box flex2" :options="advancedSearch.tableOptions" v-model="searchItem.table" :options-value="'name'" :options-label="'title'" :search="true" @afterSelected="advanceSelected('table',searchItem)"></v-select>
            <v-select class="c-ad-box flex1" v-if="!searchItem.tableChild" :options="searchItem.condition" v-model="searchItem.conditionVal" :search="true" @afterSelected="advanceSelected"></v-select>
          </div>
          <!-- 如果是已填和未填,后面就不需要值了 -->
          <div class="c-search-ad-row" v-if="searchItem.conditionVal!=='empty' && searchItem.conditionVal !== 'filled' ">
            <!-- 名片和表格这种有子节点的特殊处理 -->
            <v-select v-if="searchItem.table && searchItem.table.indexOf('table') !== -1" :options="getTableChildList(searchItem.table)" :search="true" :options-value="'name'" :options-label="'title'" :data-index="index" v-model="searchItem.tableChild" @afterSelected="advanceSelected('tableChild',searchItem)"></v-select>
            <v-select v-if="searchItem.table && searchItem.table.indexOf('nameCard') !== -1" :options="getTableChildList(searchItem.table)" :search="true" :options-value="'name'" :options-label="'title'" :data-index="index" v-model="searchItem.tableChild" @afterSelected="advanceSelected('tableChild',searchItem)"></v-select>
            <v-select v-if="searchItem.tableChild" :options="searchItem.childCondition" v-model="searchItem.childConditionVal" :search="true" @afterSelected="advanceSelected"></v-select>
            <div class="box_flex align_center" v-if="searchItem.childConditionVal!=='empty' && searchItem.childConditionVal !== 'filled' ">
              <v-select v-if="searchItem.table && searchItem.table.indexOf('address') !== -1" :options="getAddressOptions('province')" :search="true" :options-value="'name'" :options-label="'name'" :data-index="index" v-model="searchItem.province" @afterSelected="advanceSelected"></v-select>
              <v-select v-if="searchItem.province && searchItem.table &&searchItem.table.indexOf('address') !== -1" :options="getAddressOptions('city',searchItem.province)" :search="true" :options-value="'name'" :options-label="'name'" v-model="searchItem.city" @afterSelected="advanceSelected"></v-select>
              <v-select v-if="searchItem.city && searchItem.table.indexOf('address') !== -1" :options="getAddressOptions('area',searchItem.city,searchItem.province)" :search="true" :options-value="'name'" :options-label="'name'" v-model="searchItem.area" @afterSelected="advanceSelected"></v-select>
              <v-select v-if="(searchItem.table &&searchItem.table.indexOf('select') !== -1||searchItem.table &&searchItem.table.indexOf('radio') !== -1)&&( searchItem.conditionVal === 'eq'|| searchItem.conditionVal === 'ne')" :options="getInOptions(searchItem.table)" v-model="searchItem.values" :search="true" @afterSelected="advanceSelected"></v-select>
              <v-select v-else-if="searchItem.conditionVal==='in' || searchItem.conditionVal === 'nin' || searchItem.table &&searchItem.table.indexOf('checkbox') !== -1&&( searchItem.conditionVal === 'eq'|| searchItem.conditionVal === 'ne')" :options="getInOptions(searchItem.table)" v-model="searchItem.values" :search="true" multiple=true @afterSelected="advanceSelected"></v-select>
              <v-select v-else-if="searchItem.tableChild.indexOf('checkbox') !== -1&&( searchItem.childConditionVal === 'eq'|| searchItem.childConditionVal === 'ne')" :options="getInOptions(searchItem.table,searchItem.tableChild)" v-model="searchItem.values" :search="true" @afterSelected="advanceSelected"></v-select>
              <v-select v-else-if="searchItem.childConditionVal==='in' || searchItem.childConditionVal === 'nin'|| (searchItem.tableChild.indexOf('select') !== -1||searchItem.tableChild.indexOf('radio') !== -1)&&( searchItem.childConditionVal === 'eq'|| searchItem.childConditionVal === 'ne')" :options="getInOptions(searchItem.table,searchItem.tableChild)" v-model="searchItem.values" :search="true" multiple=true @afterSelected="advanceSelected"></v-select>
              <input class="c-ipt-wrap flex1" type="text" v-else-if="searchItem.table && searchItem.table.indexOf('address') === -1" v-model="searchItem.values">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  sAjax, request
} from '../../assets/utils/utils';
import advancedSearch from "../../mixins/advancedSearch.js"
export default {
  mixins: [advancedSearch], //高级搜索所有方法都在里面
  props: {
    placeholder: {
      default: '输入学号或姓名进行搜索'
    },
    curBusinessId: {
      default: ''
    },
    curCountNodeId: {
      default: ''
    },
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
          value: [],
          newVal: {}
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
        editIndex: 0,
      },
      selectColege: {
        value: [],
        label: [],
      }
    }
  },
  watch: {
    curBusinessId(newVal) {
      this._resetSearchInfo()
    },
    // curCountNodeId(newVal) {
    //   this.getCollege()
    // },
    showSearchModel(newVal){
      if(newVal){
        this.getCollege()
      }
    }
  },
  created() {
    this.initYear()
    this.initEducationLevel()
  },
  mounted() { },
  methods: {
    changeCollege(value, label) {
      this.searchInfo.college.newVal = { value: value, label: label }
    },
    getCollege() {
      let url = `/api/colleges`
      if (this.curCountNodeId) {//是否是节点
        url = `/api/processEngine/business/${this.curBusinessId}/managedColleges?nodeId=${this.curCountNodeId}`
        if (this.curCountNodeId.indexOf('player') != -1) {
          console.log('hhhhh')
          url = `/api/formEngine/business/${this.curBusinessId}/managedColleges?playerId=${this.curCountNodeId}`
        }
      }
      request(url).then(o => {
        this.searchInfo.college.tempList = this.searchInfo.college.list = o.data.map(a => {
          return {
            value: a.name,
            key:a.code
          }
        })
      })
    },
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
    saveOldSearchItems() {//缓存旧数据,取消的时候返回
      if (this.advancedSearch.searchItems.length) {
        this.oldSearchItems = JSON.parse(JSON.stringify(this.advancedSearch.searchItems))
      } else {
        this.oldSearchItems = []
      }
    },
    addAdvancedSearch: function () {
      this.advancedSearch.show = true
      this.editIndex = this.advancedSearch.searchItems.length
      this.saveOldSearchItems()
      this.addSearchItem()
    },
    editAdvancedSearch(index) {
      this.advancedSearch.show = true
      this.saveOldSearchItems()
      this.editIndex = index
    },
    cancelAdvancedSearch() {
      this.advancedSearch.show = false
      this.advancedSearch.searchItems = this.oldSearchItems//回退数据
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
      this.advancedSearch.searchItems = []
      this.selectColege = {
        value: [],
        label: [],
      }
    },
    changeInputWidth() {
      this.inputW = '100%'
    },
    isShowSearchMain() {
      this.showSearchModel = !this.showSearchModel
    },
    confirmAdvanced() {
      console.log('o', this.advancedSearch.searchItems)
      this.advancedSearch.tableOptions.forEach(o => {
        if (o.name === this.advancedSearch.searchItems[this.editIndex].table) {//赋值名字 用于展示
          this.advancedSearch.searchItems[this.editIndex].title = o.title
        }
      })
      this.advancedSearch.show = false
    },
    deleteAdvancedSearch(idx) {
      this.advancedSearch.searchItems.splice(idx, 1)
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
      this.searchInfo.college.newVal = {}
      this.collegeKey = ''
    },
    confirmCollege() {
      this.selectColege = this.searchInfo.college.newVal
      this.searchInfo.college.value = this.searchInfo.college.tempVal
      this.showSearchBox.college = false
    },
    formatCollegeVal(arr) {
      if (arr.length == this.searchInfo.college.list.length) {
        return '全部'
      } else if (arr.length == 1) {
        return arr[0]
      } else if (arr.length > 1) {
        return arr[0] + '等'
      } else {
        return '请选择'
      }
    },
    _confirmSearchInfo() {
      this.computedResult();//计算高级搜索结果
      let e = this.searchInfo
      let info = {}
      let grade = []
      e.grade.list.map(item => {
        if (item.checked) {
          grade.push(item.key)
        }
      })
      info.grade = this.arrayToString(grade)
      let educationLevel = []
      e.educationLevel.list.map(item => {
        if (item.checked) {
          educationLevel.push(item.key)
        }
      })
      info.educationLevel = this.arrayToString(educationLevel)
      info.keyword = e.keyword
      info.college = this.selectColege.value.join(',')
      info.collegeCode = this.selectColege.value.join(',')
      info.advancedSearchParams = this.advancedSearchParams
      // let searchStr = ''
      // for (var i in info) {
      //   searchStr += i + '=' + info[i] + '&'
      // }
      // searchStr=searchStr.substring(0,searchStr.length-1)
      // searchStr+=this.advancedSearchParams
      this.$emit('search', info)
      this.showSearchModel = false
    },
    arrayToString(arr) {
      if (arr.length == 0) {
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
      background: #f6f6f6;
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
      border-bottom: 1px solid #ccccd0;
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
        flex: 1;
      }
      .flex2 {
        flex: 2;
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
  .weui-cells_checkbox .weui-check:checked + .vux-checklist-icon-checked:before,
  .weui-cells_checkbox .weui-check:checked + .vux-checklist-icon-checked:before,
  .weui-cells_checkbox .weui-check:checked + .weui-icon-checked:before,
  .weui-cells_checkbox .weui-check:checked + .weui-icon-checked:before {
    color: #298df7 !important;
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
  .c-college-list{
    height: 90%;
    overflow: auto;
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
