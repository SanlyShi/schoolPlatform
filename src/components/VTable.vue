<!--
  修改记录：
  2019年8月1日17:09:06
  增加 column.search.data.startTimeFieldName column.search.data.endTimeFieldName
  可以指定时间范围搜索时，参数的名称

  最后修改时间：2018-08-16
	//表头格式
	columns: {
		required: true, // 是否为必填
		default: [{    //表头参数
			id: "name",
			title: "姓名",
			width: 200,
			className: "",
      search: {
        type: select|multiSelect|datetime|areaSelect,
        data: {
          url: '',
          optionsLabel: 'label'，
          optionsValue: 'value',
          options: [],
          dateFormat: 'yyyy-mm-dd hh:ii',
          autoFocus: false,
          placeholder: '',
          change: function (obj) {}
        }
      },
      edit: {
        type: select|multiSelect|datetime,
        data: {
          url: '',
          optionsLabel: 'label'，
          optionsValue: 'value',
          options: [],
          dateFormat: 'yyyy-mm-dd hh:ii'
        }
      },
			hidden: false,
      options: [], //抽离了formatter中的操作列定义，可直接在这个属性上添加
			formatter:function(){
			   //返回一个操作数组，数组具体格式如下
			   [{
			     tag:'button|a|img',
			     text:'标签内容',对img标签则为title属性值
			     href:''tag为a时有效
			     src:''tag为img时有效
			     className:'blue' css样式
			     callback:function(row,index){}标签点击事件的回调函数，对所有标签有效
			   }]
			}
		}]
	},
	//唯一标记行数据字段,
	idField: {
		required: true
	},
  //请求方式
	method: {
		default: 'get'
	},
	//开启多选功能,旧参数：multi 已修改
	multiple: {
		default: true
	},
	//开启行标功能
	order: {
		default: false
	},
	//分页大小
	pagesize: {
		default: 3
	},
	//行数据
	rows: {
		default: []
	},
	//开启搜索功能
	search: {
		default: true
	},
	//表格名称
	title: {
		default: ""
	},
	defaultLang:{
	  default:"zh-cn"
	},
	//数据获取地址
	url: {
		default: ""
	},
  //是否显示分页
  paginationShow: {
    default: 'true'
  },
  //是否显示隐藏列:旧名称为hideColShow，已修改
  columnsControl: {
    default: true
  }
	表格返回数据格式{
	  state//数据返回成功标记
	  message//存放错误信息，成功不提示
	  total//数据总条数
    data:[{},{}]当前页数据数组
	}

  函数调用：
  @rowClick
  参数： {record: 行记录, index: 行下标}

  @afterChecked
  参数： {selections: 当前多选选中项, target: 组件对象}
  选项选中时触发

  @saveEdit
  参数： 新的td的对象，{name: 更改的字段, value: 新的值}
-->
<template>
  <div class="container-fluid table-container" :class="{'box_flex':fill,'column':fill}">
    <div class="row grow_1" :class="{'heightAuto':heightAuto,'fill':fill}">
      <!--顶部的一系列导出等按钮 对内部无影响-->
      <table class="table table-hover">
        <tr class="table-header table-title">
          <!--合并一行存放标题  增加了个判断,如果没东西就不要这个了-->
          <th :colspan="columnsLength" class="table-title-container">
            <h3 class="panel-title pull-left" v-if="title">{{title}}</h3>
            <div class="btn-group pull-right" v-if="columnsControl">
              <!--下拉按钮-->
              <button
                class="btn btn-default dropdown-toggle"
                type="button"
                :title="translate.hiddenCol"
                @click="tableState.columnsControlShow = !tableState.columnsControlShow"
              >
                <i class="maticon" v-html="icons('more_vert')">more_vert</i>
              </button>
              <!--下拉菜单-->
              <ul
                class="dropdown-menu hidden-col"
                style="display:block;"
                v-if="tableState.columnsControlShow"
              >
                <!--渲染表格表头行---col为每个columns数组中的对象；k为每个对象的索引；col.id为每个对象的id属性（共3个）；hidden为是否隐藏该列；-->
                <li
                  :class="!column.hidden?'active':''"
                  :title="column.title"
                  v-for="(column,k) in columns"
                  :key="k"
                  :data-id="column.id"
                  @click="_exchangeColumn(column)"
                >
                  <i
                    class="maticon pull-left"
                    v-html="icons('check_box_outline_blank')"
                    v-if="column.hidden"
                  >check_box_outline_blank</i>
                  <i class="maticon pull-left" v-html="icons('check_box')" v-else>check_box</i>
                  {{column.title}}
                </li>
              </ul>
            </div>
            <!--搜索按钮-->
            <button
              type="button"
              class="btn btn-default pull-right search-btn"
              :class="tableState.searching === true ? 'active':''"
              @click="tableState.searching = !tableState.searching;cascaderArr= []"
              v-if="tableState.searching !== null"
            >
              <i class="maticon" v-html="icons('search')">search</i>
            </button>
            <slot name="btn-group"></slot>
          </th>
        </tr>
      </table>

      <!-- 表格外层包裹div -->
      <div class="table-data" style="overflow-x:auto" :id="'sroll'+time">
        <!-- 字段表格 -->
        <table class="table table-hover" :id="'table'+time" :class="{'pa-l':pal?false:true}">
          <!--表头-->
          <thead>
            <tr class="table-head">
              <th class="text-center" width="40" v-if="multiple">
                <label class="check-opt" @click="_changeCheckState()">
                  <i
                    class="maticon"
                    v-html="icons('check_box_outline_blank')"
                    v-if="checkedRecords.length===0"
                  >check_box_outline_blank</i>
                  <i
                    class="maticon"
                    v-html="icons('check_box')"
                    v-else-if="checkedRecords.length===curPageData.length"
                  >check_box</i>
                  <i
                    class="maticon"
                    v-html="icons('indeterminate_check_box')"
                    v-else
                  >indeterminate_check_box</i>
                  <!--全选页-->
                </label>
              </th>
              <th class="text-center" width="30" v-if="order">
                <div class="order-opt">{{translate.colOrder}}</div>
              </th>
              <th
                v-for="(column,k) in columns"
                :key="k"
                :width="column.width"
                :data-id="column.title"
                v-if="!column.hidden"
                :style="{'right':(column.title=='操作')?rightOpt:'auto','background':(column.title=='操作')?bgOpt:'transparent','z-index':(column.title=='操作')?zIndexOpt:'auto'}"
              >
                <div
                  class="column-content box_flex"
                  :class="column.className"
                  :style="'width:'+column.width+'px'"
                >
                  <div class="flex_grow sort-text">{{column.title}}</div>
                  <div
                    class="flex_shrink sort-container"
                    title="排序"
                    :class="{ sorted: !!column.sortType }"
                    @click="sortClick(column)"
                    v-if="column.sorting"
                  >
                    <i
                      class="maticon sort-asc"
                      :class="{ active: column.sortType === 'ASC' }"
                      v-html="icons('arrow_drop_up')"
                    ></i>
                    <i
                      class="maticon sort-desc"
                      :class="{ active: column.sortType === 'DESC' }"
                      v-html="icons('arrow_drop_down')"
                    ></i>
                  </div>
                </div>
                <div
                  class="title-search-div"
                  :style="'width:'+column.width+'px'"
                  v-show="tableState.searching"
                  v-if="column.search&&tableState.searching!==null"
                >
                  <v-select
                    :class="column.className"
                    :url="(column.search.data&&column.search.data.url)||''"
                    :options="(column.search.data&&column.search.data.options)"
                    :options-value="(column.search.data&&column.search.data.optionsValue)||'id'"
                    :options-label="(column.search.data&&column.search.data.optionsLabel)||'name'"
                    :placeholder="_searchWord(column)"
                    :ref="column.id"
                    search
                    close-on-select
                    @afterSelected="_afterSelectSearch($event, column)"
                    v-if="column.search.type==='select'"
                  ></v-select>
                  <!-- 表单表格 地图控件多一列的特殊情况 -->
                  <v-select
                    :class="column.className"
                    :url="(column.search.data&&column.search.data.url)||''"
                    :options="(column.search.data&&column.search.data.options)"
                    :options-value="(column.search.data&&column.search.data.optionsValue)||'id'"
                    :options-label="(column.search.data&&column.search.data.optionsLabel)||'name'"
                    :placeholder="_searchWord(column)"
                    :ref="column.id"
                    search
                    close-on-select
                    @afterSelected="_afterSelectInRange($event, column)"
                    v-else-if="column.search.type==='selectInRange'"
                  ></v-select>
                  <el-cascader
                    class="cascaderTable"
                    :options="optionsArea"
                    :props="propsArea"
                    v-model="cascaderArr"
                    @change="cascaderChange(column)"
                    collapse-tags
                    clearable
                    v-else-if="column.search.type==='areaSelect'"
                  ></el-cascader>
                  <v-select
                    :class="column.className"
                    :url="(column.search.data&&column.search.data.url)||''"
                    :options="(column.search.data&&column.search.data.options)"
                    :options-value="(column.search.data&&column.search.data.optionsValue)||'id'"
                    :options-label="(column.search.data&&column.search.data.optionsLabel)||'name'"
                    :placeholder="_searchWord(column)"
                    :ref="column.id"
                    search
                    multiple
                    @afterSelected="_afterSelectSearch($event, column)"
                    v-else-if="column.search.type==='multiSelect'"
                  ></v-select>
                  <v-datepicker-area
                    :class="column.className"
                    :placeholder="_searchWord(column)"
                    :dateFormat="column.search.data&&column.search.data.dateFormat"
                    @startSelected="_daySelectSearch($event, column, 'start')"
                    @endSelected="_daySelectSearch($event, column, 'end')"
                    v-else-if="column.search.type === 'datetime'"
                  ></v-datepicker-area>
                  <div
                    class="box_flex numberArea flex_between"
                    v-else-if="column.search.type === 'numberArea'"
                  >
                    <input
                      class="form-control"
                      v-model="tableSearchFields['min'+column.id.charAt(0).toUpperCase()+column.id.slice(1)]"
                      type="number"
                    />
                    ~
                    <input
                      class="form-control"
                      v-model="tableSearchFields['max'+column.id.charAt(0).toUpperCase()+column.id.slice(1)]"
                      type="number"
                    />
                  </div>
                  <input
                    class="form-control"
                    :class="column.className"
                    type="text"
                    :placeholder="_searchWord(column)"
                    v-model="tableSearchFields[column.id]"
                    :ref="column.id"
                    @change="_inputSearchChange({value:tableSearchFields[column.id]}, column)"
                    v-focus
                    v-else-if="column.search.type === 'input'&&column.search.data&&column.search.data.autoFocus"
                  />
                  <input
                    class="form-control"
                    :class="column.className"
                    type="text"
                    :placeholder="_searchWord(column)"
                    v-model="tableSearchFields[column.id]"
                    :ref="column.id"
                    @change="_inputSearchChange({value:tableSearchFields[column.id]}, column)"
                    v-else
                  />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <!--curpagedata当前页数据，key为索引-->
            <tr
              :data-zIndex="(tableState.pagesize - i)"
              v-for="(row,i) in curPageData"
              :key="i"
              @click="_rowClick(row, i)"
              class="table-body"
            >
              <!-- 是否开启表格多选 -->
              <td class="check-td check-opt" v-if="multiple" @click.stop="_rowCheck(row)">
                <i
                  class="maticon"
                  v-html="icons('check_box_outline_blank')"
                  v-if="!row.checked"
                >check_box_outline_blank</i>
                <i class="maticon blue" v-html="icons('check_box')" v-else>check_box</i>
              </td>
              <!-- 是否开启行号 -->
              <td class="text-center" v-if="order">
                <div class="order-opt">{{i+1+tableState.currentPageIndex*tableState.pagesize}}</div>
              </td>
              <td
                v-for="(column,c) in columns"
                :key="c"
                :width="column.width"
                v-if="!column.hidden"
                :style="{'right':(column.title=='操作')?rightOpt:'auto','background':(column.title=='操作')?bgOpt:'transparent'}"
              >
                <!-- 优先渲染formatter options 其次非编辑态下的文本  最后编辑态 -->
                <div
                  class="column-content column-opts"
                  :class="column.className"
                  :style="'width:'+column.width+'px'"
                  v-if="_getColumnOptions(column, row, i)"
                >
                  <button
                    class="btn btn-xs"
                    :class="opt.className"
                    v-for="(opt,oi) in _getColumnOptions(column, row, i)"
                    :key="oi"
                    @click.stop="opt.callback&&opt.callback(row,i)"
                    v-html="opt.text"
                    v-if="opt.tag=='button'"
                  >{{opt.text}}</button>
                  <div class="btn-group" v-else-if="opt.tag=='button-group'">
                    <button
                      class="btn dropdown-toggle"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                      :class="opt.className"
                      v-html="opt.text"
                    >
                      {{opt.text}}
                      <!-- <span class="caret"></span> -->
                    </button>
                    <ul class="dropdown-menu">
                      <li
                        v-for="(o,key) in opt.optList"
                        :key="key"
                        @click.stop="o.callback&&o.callback(row,i)"
                      >
                        <a href="javascript:;" v-html="o.text">{{o.text}}</a>
                      </li>
                    </ul>
                  </div>
                  <a
                    class="opt-btn"
                    :class="opt.className"
                    :href="opt.href||'javascript:;'"
                    @click.stop="opt.callback&&opt.callback(row,i)"
                    v-html="opt.text"
                    v-else-if="opt.tag=='a'"
                  >{{opt.text}}</a>
                  <p
                    class="table-p"
                    :class="opt.className"
                    v-html="opt.text"
                    v-else-if="opt.tag=='p'"
                  >{{opt.text}}</p>
                  <img
                    :title="opt.text||'img'"
                    :class="opt.className"
                    :src="opt.src"
                    @click.stop="opt.callback&&opt.callback(row,i)"
                    v-else-if="opt.tag=='img'"
                  />
                  <span v-else>{{translate.unsigned}}</span>
                </div>
                <div
                  class="column-content"
                  :class="column.className"
                  :style="'width:'+column.width+'px'"
                  :title="column.hover===false?'':(column.formatter&&column.formatter(row, i))||row[column.id]"
                  v-html="(column.formatter&&column.formatter(row, i))||row[column.id]"
                  v-else-if="!column.edit"
                >{{(column.formatter&&column.formatter(row, i))||row[column.id]}}</div>
                <div
                  class="column-content"
                  :class="column.className"
                  :style="'width:'+column.width+'px'"
                  v-else-if="column.edit"
                >
                  <v-select
                    class="btn-block info-value row-edit-wigt"
                    :disabled="column.disabled"
                    :options="(column.edit.data&&column.edit.data.options)||[]"
                    :value="newVal[row[idField]]&&newVal[row[idField]][column.id]"
                    :placeholder="(column.edit.data&&column.edit.data.placeholder)||column.title"
                    options-value="id"
                    options-label="name"
                    search
                    close-on-select
                    @afterSelected="_afterSelect($event, column, row)"
                    v-if="column.edit.type === 'select'"
                  ></v-select>
                  <v-select
                    class="btn-block info-value row-edit-wigt"
                    :disabled="column.disabled"
                    :options="(column.edit.data&&column.edit.data.options)||[]"
                    :value="newVal[row[idField]]&&newVal[row[idField]][column.id]"
                    :placeholder="(column.edit.data&&column.edit.data.placeholder)||column.title"
                    options-value="id"
                    options-label="name"
                    search
                    multiple
                    @afterSelected="_afterSelect($event, column, row)"
                    v-else-if="column.edit.type === 'multiSelect'"
                  ></v-select>
                  <v-datepicker
                    class="info-value btn-block row-edit-wigt"
                    :disabled="column.disabled"
                    width="100%"
                    :placeholder="(column.edit.data&&column.edit.data.placeholder)||column.title"
                    :value="newVal[row[idField]]&&newVal[row[idField]][column.id]"
                    :showTime="false"
                    :format="column.edit.data&&column.edit.data.dateFormat"
                    @daySelected="_daySelect($event, column, row)"
                    v-else-if="column.edit.type === 'datetime'"
                  ></v-datepicker>
                  <div
                    v-else-if="column.edit.type === 'datetime'"
                  >{{newVal[row[idField]]&&newVal[row[idField]][column.id]}}</div>
                  <input
                    type="number"
                    class="row-edit-input"
                    :disabled="column.disabled"
                    min="0"
                    :placeholder="(column.edit.data&&column.edit.data.placeholder)||column.title"
                    v-model="newVal[row[idField]][column.id]"
                    @focus="_edit(column, row)"
                    @change="_save(column, row)"
                    v-else-if="column.edit.type === 'number'"
                  />
                  <input
                    type="text"
                    class="row-edit-input"
                    :disabled="column.disabled"
                    :placeholder="(column.edit.data&&column.edit.data.placeholder)||column.title"
                    v-model="newVal[row[idField]][column.id]"
                    @focus="_edit(column, row)"
                    @change="_save(column, row)"
                    v-else
                  />
                </div>
              </td>
            </tr>
            <tr v-if="needTotal" class="table_body">
              <td class="text-center" v-if="order">
                <div class="order-opt"></div>
              </td>
              <td
                v-for="(column,c) in columns"
                :key="c"
                :width="column.width"
                v-if="!column.hidden"
              >
                <div
                  class="column-content"
                  :class="column.className"
                  :style="'width:'+column.width+'px'"
                >
                  <span v-if="c==0">总计:</span>
                  <span v-if="column.needTotal">{{getTotal(column)}}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- 一些loading工具 -->
        <p class="table-tip text-center text-muted" v-if="tableState.loading">{{translate.loading}}</p>
        <p
          class="table-tip text-center text-muted"
          v-else-if="curPageData.length === 0"
        >{{translate.isNullTip}}</p>
        <!-- 表格包裹结束 -->
      </div>
      <!-- 表格外层row结束 -->
    </div>
    <!--表格的下端信息包含分页等-->
    <div class="row flex_shrink" v-if="paginationShow">
      <nav>
        <label class="pull-left pageinfo">
          {{translate.total}}{{ tableState.totalRecords }}{{translate.records}}，{{translate.eachPage}}
          <input
            type="text"
            v-model="tableState.pagesizeModel"
            @keyup="_regx"
            @change="_refresh"
          />
          {{translate.records}}
        </label>
        <ul class="pagination pull-right">
          <li :class="_isDisabled(0)" @click="_prePage">
            <a class="page-control" href="javascript:;" aria-label="Previous">
              <i class="maticon pull-left" v-html="icons('chevron_left')">chevron_left</i>
            </a>
          </li>
          <li
            v-for="i in pagesCount"
            :key="i"
            v-if="_isShow(i-1,5)"
            :class="((i-1) === tableState.currentPageIndex) ? 'active' : ''"
            @click="_gotoPage(i)"
          >
            <a href="javascript:;">{{i}}</a>
          </li>
          <li :class="_isDisabled(1)" @click="_nextPage">
            <a class="page-control" href="javascript:;" aria-label="Next">
              <i class="maticon pull-right" v-html="icons('chevron_right')">chevron_right</i>
            </a>
          </li>
        </ul>
        <div class="input-group pull-right gotopage">
          <span class="input-group-btn">
            <button class="btn" type="button">{{translate.pageGoBtn}}</button>
          </span>
          <input
            type="text"
            class="form-control text-left"
            :placeholder="translate.pageGoPlaceholder"
            v-model="tableState.goPageIndex"
            @change="_gotoPage(tableState.goPageIndex)"
          />
          <span class="input-group-btn">{{translate.page}}</span>
        </div>
      </nav>
    </div>
  </div>
</template>
<script>
import $ from "jquery";
import { sAjax } from "../../src/assets/utils/utils";
import { translation, request } from "../assets/utils/utils.js";
// import { constants } from 'crypto';

export default {
  props: {
    // 唯一标记字段
    idField: {
      required: true
    },
    //是否为预览内部表格
    pal: {
      default: false
    },
    heightAuto: {
      default: false
    },
    fill: {
      //高度铺满容器,与heightAuto不共存
      default: false
    },
    // 搜索开启
    search: {
      default: null
    },
    // 表格名称
    title: {
      default: ""
    },
    // 每页条数
    pagesize: {
      default: 5
    },
    method: {
      default: "get"
    },
    // 开启多选
    multiple: {
      default: null
    },
    // 开启行号
    order: {
      default: null
    },
    defaultLang: {
      default: "zh-cn"
    },
    // 数据获取地址
    url: {
      default: ""
    },
    // 表头结构
    columns: {
      required: true,
      default: null
    },
    // 行数据
    rows: {
      default: []
    },
    //是否需要添加统计行, 需要统计的列也要设列属性 needTotal为true
    needTotal: {
      default: false
    },
    // 是否显示隐藏列+
    columnsControl: {
      default: false
    },
    // 是否显示分页
    paginationShow: {
      default: true
    },
    //  自定义搜索参数补充
    searchParams: {
      default: null
    },
    needSaveEdit: {
      //编辑状态的时候 是否需要保存编辑信息
      default: false
    }
  },
  data: function() {
    return {
      cascaderArr: [],
      provinceList: [],
      propsArea: { multiple: true,checkStrictly: true },
      optionsArea: [
        {
          value: 1,
          label: "东南",
          children: [
            {
              value: 2,
              label: "上海",
              children: [
                { value: 3, label: "普陀" },
                { value: 4, label: "黄埔" },
                { value: 5, label: "徐汇" }
              ]
            },
            {
              value: 7,
              label: "江苏",
              children: [
                { value: 8, label: "南京" },
                { value: 9, label: "苏州" },
                { value: 10, label: "无锡" }
              ]
            },
            {
              value: 12,
              label: "浙江",
              children: [
                { value: 13, label: "杭州" },
                { value: 14, label: "宁波" },
                { value: 15, label: "嘉兴" }
              ]
            }
          ]
        },
        {
          value: 17,
          label: "西北",
          children: [
            {
              value: 18,
              label: "陕西",
              children: [
                { value: 19, label: "西安" },
                { value: 20, label: "延安" }
              ]
            },
            {
              value: 21,
              label: "新疆维吾尔族自治区",
              children: [
                { value: 22, label: "乌鲁木齐" },
                { value: 23, label: "克拉玛依" }
              ]
            }
          ]
        }
      ],
      time: "",
      rightOpt: "",
      bgOpt: "",
      zIndexOpt: "",
      chaWidth: 0,
      hasInitEditValueList: [], //存储已经编辑过的字段的id,避免刷新分页的时候刷新
      tableState: {
        searching: this.search, //搜索状态
        columnsControlShow: false, //隐藏列列表显示状态
        allCheck: false, //全选表状态
        pageCheck: false, //全选页状态
        checkedIds: [], //选中记录
        goPageIndex: 1, //分页跳转框状态
        totalRecords: 0, //表格总记录状态
        currentPageIndex: 0, //当前页状态
        pagesize: this.paginationShow ? this.pagesize : 99999,
        pagesizeModel: this.pagesize,
        pageIndexJson: {}, //数据分页状态对象,
        timer: null, //页面定时器状态,
        loading: false //表格加载状态
      },
      newVal: {}, //表单编辑状态下的存储对象
      tableSearchFields: {}, //表格搜索字段暂存对象
      tableUrl: this.url,
      inRangeOption: {},
      lang: this.defaultLang
    };
  },
  created: function() {
    if (sessionStorage.getItem("provinceList")) {
      this.provinceList = JSON.parse(sessionStorage.getItem("provinceList"));
    } else {
      sAjax({
        url: "/api/forms/settings/getAddress",
        type: "get",
        async: false,
        success: data => {
          if (data.state) {
            sessionStorage.setItem("provinceList", JSON.stringify(data.data));
            this.provinceList = data.data;
          }
        }
      });
    }

    if (this.provinceList != []) {
      this.optionsArea = this.provinceList.map(item => {
        let sheng = {};
        sheng["value"] = item.name;
        sheng["label"] = item.name;

        if (item.cityList.length > 0) {
          sheng["children"] = item.cityList.map(item1 => {
            let shi = {};
            shi["value"] = item1.name;
            shi["label"] = item1.name;
            if (item1.areaList.length > 0) {
              shi["children"] = item1.areaList.map(item2 => {
                let qu = {};
                qu["value"] = item2;
                qu["label"] = item2;
                return qu;
              });
            }
            return shi;
          });
        }
        return sheng;
      });
    }

    var la = localStorage.getItem("lang");
    if (translation(la)) {
      this.lang = la;
    }
    if (this.searchParams) {
      // searchParams 改变tableFields 触发表格初始化
      for (var i in this.searchParams) {
        this.$set(this.tableSearchFields, i, this.searchParams[i]);
      }
    } else {
      this.initTable();
    }
  },
  mounted: function() {
    this.time = new Date().getTime();

    var that = this;
    this.$nextTick(o => {
      setTimeout(function() {
        that.computeWidth();
      }, 800);
      // 监听滚动事件
      $("#sroll" + this.time).scroll(function() {
        let left = $("#sroll" + that.time).scrollLeft();
        that.computeWidth(left);
      });
      $("#sroll" + this.time).scroll();
      // 监听菜单栏伸缩右侧容器大小变化
      let timer = null;
      $(window).resize(() => {
        if (!timer) {
          timer = setTimeout(function() {
            // 通过触发滚动来重新计算table宽度
            let left = $("#sroll" + that.time).scrollLeft();
            $("#sroll" + that.time).scrollLeft(left + 2);
            timer = null;
            // that.computeWidth(left)
          }, 500);
        }
      });
    });
  },
  computed: {
    curPageData: function() {
      return (
        this.tableState.pageIndexJson[this.tableState.currentPageIndex] || []
      );
    },
    columnsLength: function() {
      var length = this.columns.length;
      this.multiple && (length += 1);
      this.order && (length += 1);
      return length;
    },
    pagesCount: function() {
      return parseInt(
        Math.ceil(this.tableState.totalRecords / this.tableState.pagesize)
      );
    },
    checkedRecords: function() {
      var arr = [];
      this.curPageData.forEach(ele => {
        if (ele.checked) {
          arr.push(ele);
        }
      });
      return arr;
    },
    translate: function() {
      return translation(this.lang).table;
    }
  },
  watch: {
    // pageindex: function () {
    //   this.initTable()
    // },
    pagesize: function(val) {
      if (val <= 0) this.pagesize = 1;
      if (this.tableState.currentPageIndex > this.pagesCount) {
        this.tableState.currentPageIndex = 0;
      }
    },
    searchParams: {
      deep: true,
      handler: function() {
        for (var i in this.searchParams) {
          this.$set(this.tableSearchFields, i, this.searchParams[i]);
        }
      }
    },
    tableSearchFields: {
      deep: true,
      handler: function(nv, ov) {
        var count = 0;
        clearTimeout(this.tableState.timer);
        this.tableState.timer = setTimeout(() => {
          this.tableState.currentPageIndex = 0;
          this.tableState.pageIndexJson = {};
          this.tableState.totalRecords = 0;
          this.initTable();
          this.tableState.timer = 0;
        }, 600);
      }
    },
    url: function() {
      if (!this.tableState.timer) {
        this.tableUrl = this.url;
        this.initTable();
      } else {
        clearTimeout(this.tableState.timer);
        this.tableState.timer = setTimeout(() => {
          this.tableUrl = this.url;
          this.initTable();
          this.tableState.timer = 0;
        }, 600);
      }
    },
    // 每一次监听到行数据变化都会将表格初始化
    rows: {
      deep: true,
      handler: function() {
        this.initTable();
      }
    }
    // columns: {
    //   deep: true,
    //   handler: function (columns) {
    //     this.columns = columns
    //     this.initTable()
    //   }
    // },
  },
  methods: {
    cascaderChange(column) {

      let newArr = JSON.parse(JSON.stringify(this.cascaderArr))
      let allProvinceArr = []
      newArr.forEach((item,index)=>{
        if(item.length==1){
          allProvinceArr.push(item[0])
        }
      })
      newArr = newArr.filter((item,index)=>{
        if(allProvinceArr.indexOf(item[0])>-1 && item.length>1){
        }
        else{
          return item
        }
      })


      let newArr1 = JSON.parse(JSON.stringify(newArr))
      let allProvinceArr1 = []
      newArr1.forEach((item,index)=>{
        if(item.length==2){
          allProvinceArr1.push(item[0]+item[1])
        }
      })
      newArr1 = newArr1.filter((item,index)=>{
        if(allProvinceArr1.indexOf(item[0]+item[1])>-1 && item.length>2){
        }
        else{
          return item
        }
      })

      this.cascaderArr = newArr1

      this.$set(this.tableSearchFields, column.id, JSON.stringify(this.cascaderArr));
      if (column.search.data && column.search.data.change) {
        column.search.data.change({
          column: column,
          value: JSON.stringify(this.cascaderArr),
          target: this
        });
      }
    },
    getTotal(column) {
      let total = 0;
      this.curPageData.forEach((row, i) => {
        if ((column.formatter && column.formatter(row, i)) || row[column.id]) {
          total += parseFloat(
            (column.formatter && column.formatter(row, i)) || row[column.id]
          );
        }
      });
      return total;
    },
    minNumberChange(column) {
      // console.log(
      //   this.tableSearchFields["min" + column.id.charAt(0).toUpperCase()]
      // );
    },
    sortClick(column) {
      //只允许排序某一列
      if (column.sortType === "ASC") {
        this.columns.forEach(o => {
          if (o.sortType) {
            o.sortType = "";
          }
        });
        column.sortType = "DESC";
      } else {
        this.columns.forEach(o => {
          if (o.sortType) {
            o.sortType = "";
          }
        });
        column.sortType = "ASC";
      }
      this.tableSearchFields.sortField = column.id;
      this.tableSearchFields.sortType = column.sortType;
      this.tableSearchFields.sort =
        this.tableSearchFields.sortField.replace("f_", "") +
        "-" +
        column.sortType.toLowerCase();
      let ownerField = [
        "userNo",
        "name",
        "account",
        "collegeCode",
        "educationLevel",
        "createTime"
      ];
      if (ownerField.indexOf(this.tableSearchFields.sortField) !== -1) {
        this.tableSearchFields.sort += "-owner";
      }
      this.initTable();
    },
    computeWidth: function(left = 0) {
      // console.log($("#table"+this.time).width(),$("#sroll"+this.time).width())
      let chaWidth =
        $("#table" + this.time).width() -
        $("#sroll" + this.time).width() -
        left;
      if (chaWidth <= 0) {
        this.rightOpt = "auto";
        this.bgOpt = "transparent";
        this.zIndexOpt = "auto";
      } else {
        this.rightOpt = chaWidth + "px";
        this.bgOpt = "#fefeff";
        this.zIndexOpt = "12";
      }
    },
    _exchangeColumn: function(column) {
      column.hidden = !column.hidden;
      this.$emit("columnExchanged", column);
    },
    _rowClick: function(obj, index) {
      this.$emit("rowClick", obj, index);
    },
    _rowCheck: function(obj) {
      this.$set(obj, "checked", !obj.checked);
      setTimeout(() => {
        this.$emit("afterChecked", this.checkedRecords);
      });
    },
    _changeCheckState: function() {
      this.tableState.pageCheck = this.checkedRecords.length === 0;
      this.curPageData.forEach(ele => {
        this.$set(ele, "checked", this.tableState.pageCheck);
      });
      setTimeout(() => {
        this.$emit("afterChecked", this.checkedRecords);
      });
    },
    _searchWord: function(column) {
      // return this.translate.searchPlaceholder + word
      return (
        (column.search.data && column.search.data.placeholder) || column.title
      );
    },
    _isShow: function(i, count) {
      var x = parseInt((count - 1) / 2);
      if (this.tableState.currentPageIndex - x <= 0) {
        if (i >= 0 && i < count) {
          return true;
        } else return false;
      } else if (this.tableState.currentPageIndex + x >= this.pagesCount) {
        if (i >= this.pagesCount - 5 && i < this.pagesCount) return true;
        else return false;
      } else {
        if (
          i <= this.tableState.currentPageIndex + x &&
          i >= this.tableState.currentPageIndex - x
        )
          return true;
        else return false;
      }
    },
    _isDisabled: function(n) {
      if (
        (n === 0 && this.tableState.currentPageIndex === 0) ||
        (n === 1 && this.tableState.currentPageIndex === this.pagesCount - 1)
      ) {
        return "disabled";
      } else {
        return "";
      }
    },
    // 前一页
    _prePage: function() {
      this.tableState.pageCheck = false;
      if (this.tableState.currentPageIndex > 0) {
        this.tableState.currentPageIndex = this.tableState.currentPageIndex - 1;
        this.initTable();
      }
    },
    // 后一页
    _nextPage: function() {
      this.tableState.pageCheck = false;
      if (this.tableState.currentPageIndex < this.pagesCount - 1) {
        this.tableState.currentPageIndex = this.tableState.currentPageIndex + 1;
        this.initTable();
      }
    },
    // 跳转x页
    _gotoPage: function(p) {
      this.tableState.pageCheck = false;
      var gp = 0;
      p = parseInt(p);
      if (isNaN(p)) {
        gp = 0;
      } else {
        p = p - 1;
        if (p < 1) {
          gp = 0;
        } else if (p > this.pagesCount) {
          gp = this.pagesCount - 1;
        } else {
          gp = p;
        }
      }
      if (this.tableState.currentPageIndex !== gp) {
        this.tableState.currentPageIndex = gp;
        this.initTable();
      }
    },
    _edit: function(col, row) {
      // this.editing[col.id] = true
      if (this.needSaveEdit) {
        return;
      }
      if (!this.newVal[row[this.idField]]) {
        this.$set(this.newVal, row[this.idField], {});
      }
      this.$set(this.newVal[row[this.idField]], col.id, row[col.id]);
    },
    _save: function(col, row) {
      // this.editing[col.id] = false
      this.$emit("saveEdit", {
        row: row,
        name: col.id,
        value: this.newVal[row[this.idField]][col.id]
      });
      this.$emit("change", {
        row: row,
        name: col.id,
        value: this.newVal[row[this.idField]][col.id]
      });
    },
    _afterSelect: function(obj, column, row) {
      if (!this.newVal[row[this.idField]]) {
        this.$set(this.newVal, row[this.idField], {});
      }
      this.$set(this.newVal[row[this.idField]], column.id, obj.value);
      this._save(column, row);
    },
    _daySelect: function(obj, column, row) {
      if (!this.newVal[row[this.idField]]) {
        this.$set(this.newVal, row[this.idField], {});
      }
      this.$set(this.newVal[row[this.idField]], column.id, obj.value);
      this._save(column, row);
    },
    _afterSelectInRange(obj, column) {
      //表单地图控件多一列的特殊情况
      this.inRangeOption[column.id] = obj.value;
      this.initTable();
    },
    _afterSelectSearch: function(obj, column) {
      this.$set(this.tableSearchFields, column.id, obj.value);
      if (column.search.data && column.search.data.change) {
        column.search.data.change({
          column: column,
          value: obj.value,
          target: this
        });
      }
    },
    _daySelectSearch: function(obj, column, type) {
      let fieldNameProp = `${type}TimeFieldName`;
      let searchFieldName =
        (column.search &&
          column.search.data &&
          column.search.data[fieldNameProp]) ||
        `${column.id}_${type}`;
      this.$set(this.tableSearchFields, searchFieldName, obj.value);
      if (column.search.data && column.search.data.change) {
        column.search.data.change({
          column: column,
          value: obj.value,
          target: this
        });
      }
    },
    _inputSearchChange: function(obj, column) {
      if (column.search.data && column.search.data.change) {
        column.search.data.change({
          column: column,
          value: obj.value,
          target: this
        });
      }
    },
    // 对外开放接口
    initTable: function() {
      var count = 0;
      var that = this;
      that.tableState.loading = true;
      let inRangeStr = "";
      if (that.tableUrl) {
        let keys = Object.keys(that.inRangeOption);
        if (keys.length) {
          inRangeStr = keys
            .map(key => {
              return key + "-" + that.inRangeOption[key];
            })
            .join(",");
        }
        request(
          that.tableUrl,
          {
            pageIndex: that.tableState.currentPageIndex,
            pageSize: that.tableState.pagesize,
            lang: that.lang,
            inRangeOption: inRangeStr ? inRangeStr : null,
            pageParams: that.tableSearchFields
          },
          that.method
        ).then(pageData => {
          if (pageData.state) {
            if (that.tableState.totalRecords !== pageData.total) {
              // total为共有多少条数据，要与获取到的pagedata保持一致
              that.tableState.totalRecords = pageData.total
                ? pageData.total
                : pageData.data.length;
            }
            that.$set(
              that.tableState.pageIndexJson,
              that.tableState.currentPageIndex,
              pageData.data
            );
            that._initEditValue(
              that.tableState.pageIndexJson[that.tableState.currentPageIndex]
            );
          } else {
            that.$toast(pageData.message);
          }
          that.tableState.loading = false;
        });
        // $.ajax({
        //   type: that.method,
        //   url: that.tableUrl,
        //   data: {
        //     pageIndex: that.tableState.currentPageIndex,
        //     pageSize: that.tableState.pagesize,
        //     lang: that.lang,
        //     inRangeOption:inRangeStr?inRangeStr:null,
        //     pageParams: that.tableSearchFields
        //   },
        //   success: function (pageData) {
        //     if (pageData.state) {
        //       if (that.tableState.totalRecords !== pageData.total) {
        //         // total为共有多少条数据，要与获取到的pagedata保持一致
        //         that.tableState.totalRecords = pageData.total ? pageData.total : pageData.data.length
        //       }
        //       that.$set(that.tableState.pageIndexJson, that.tableState.currentPageIndex, pageData.data)
        //       that._initEditValue(that.tableState.pageIndexJson[that.tableState.currentPageIndex])
        //     } else {
        //       that.$toast(pageData.message)
        //     }
        //     that.tableState.loading = false
        //   }
        // })
      } else {
        this.tableState.pageIndexJson = {};
        this.$set(this.tableState.pageIndexJson, count, []);
        this.tableState.totalRecords = 0;
        for (var i = 0; i < this.rows.length; i++) {
          if (this._searchSatisfied(this.rows[i])) {
            if (
              this.tableState.totalRecords >=
              (count + 1) * this.tableState.pagesize
            ) {
              count++;
              this.$set(this.tableState.pageIndexJson, count, []);
            }
            this.tableState.pageIndexJson[count].push(this.rows[i]);
            this.tableState.totalRecords++;
          }
        }
        that._initEditValue(this.rows);
        that.tableState.loading = false;
      }
    },
    _initEditValue: function(pageData) {
      pageData.forEach(row => {
        if (this.hasInitEditValueList.indexOf(row[this.idField]) !== -1) {
          return;
        }
        if (this.needSaveEdit) {
          this.hasInitEditValueList.push(row[this.idField]);
        }
        this.columns.forEach(column => {
          if (column.edit) {
            if (!this.newVal[row[this.idField]]) {
              this.$set(this.newVal, row[this.idField], {});
            }
            this.$set(
              this.newVal[row[this.idField]],
              column.id,
              row[column.id]
            );
          }
        });
      });
    },
    _searchSatisfied: function(row) {
      for (var i in row) {
        if (
          this.tableSearchFields[i] &&
          row[i].indexOf(this.tableSearchFields[i]) < 0
        ) {
          return false;
        }
      }
      return true;
    },
    _refresh: function() {
      this.tableState.pagesizeModel =
        this.tableState.pagesizeModel <= 0 ? 1 : this.tableState.pagesizeModel;
      this.tableState.pagesize = this.tableState.pagesizeModel;
      this.initTable();
    },
    _regx: function(e) {
      this.tableState.pagesizeModel = this.tableState.pagesizeModel
        .toString()
        .replace(/[^0-9]/gi, "");
    },
    _getColumnOptions: function(column, row, i) {
      if (column.options) {
        return column.options;
      } else if (
        column.formatter &&
        typeof column.formatter(row, i) === "object"
      ) {
        return column.formatter(row, i);
      } else {
        return null;
      }
    },
    getFocus: function(fieldName) {
      this.$refs[fieldName] &&
        this.$refs[fieldName][0] &&
        this.$refs[fieldName][0].focus();
    }
  },
  beforeDestroy: function() {
    this.paginationShow = false;
  }
};
</script>
<style lang="less">
@import url("../assets/common.less");
@tableHeaderColor: @frontColor;
@tableHeaderFontColor: @fontColor;
@tableBackgroundColor: lighten(@frontColor, 10%);
@tableStripedBackgroundColor: #eee;
@tableBorderColor: #eee;
@tableActiveRowColor: darken(@backColor, 10%);
@checkColor: darken(@backColor, 20%);
@paginationFontColor: @fontColor;
@paginationBackgroundColor: @backColor;
.el-popper,
.el-cascader__dropdown {
  height: 300px;
  // overflow: auto;
  .el-scrollbar,
  .el-cascader-menu {
    height: 300px;
    overflow: auto;
  }
}
.table-container {
  background: @tableBackgroundColor;
  margin: 0px auto;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
  border-radius: 2px;
  &.box_flex {
    height: 100%;
    box-shadow: none;
  }
  .heightAuto.row:first-child .table-data {
    height: auto;
    position: relative;
    min-height: 0px;
    max-height: 440px;
    overflow-y: auto;
    overflow-x: auto;
    .pa-l {
      position: unset;
    }
  }
  .fill {
    &.row:first-child .table-data {
      height: auto;
      position: relative;
      min-height: auto;
      max-height: auto;
      overflow-y: auto;
      overflow-x: auto;
    }
    display: flex;
    flex-direction: column;
    & > table.table {
      flex-shrink: 0;
    }
    & > .table-data {
      flex-grow: 1;
    }
  }
  .row:first-child .table-data {
    height: 100%;
    position: relative;
    max-height: 83%;
    min-height: 450px;
    overflow-y: auto;
    overflow-x: auto;
  }
  &.table-bordered {
    border-color: @tableBorderColor;
    tr {
      th,
      td {
        border-color: @tableBorderColor;
      }
    }
  }
  /* 操作列固定右侧 */
  .pa-l {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }
  .table {
    background: #fff;
    margin-bottom: 0;
    thead {
      th {
        .column-content {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          position: relative;
          .sort-text {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
        .box_flex.text-left {
          justify-content: flex-start;
        }
        .box_flex.text-center {
          justify-content: center;
        }
        .box_flex.text-right {
          justify-content: flex-end;
        }
        .sort-container {
          display: inline;
          position: relative;
          user-select: none;
          cursor: pointer;
          .maticon {
            top: 5px;
            font-size: 21px;
          }
          &.sorted {
            color: #ddd;
          }
          .sort-asc,
          .sort-desc {
            display: block;
            &.active {
              color: #298df7;
            }
          }
          .sort-desc {
            margin-top: -14px;
          }
        }
      }
    }
    tbody {
      border-bottom: 1px solid @tableBorderColor;
      tr {
        .column-content {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          .v-datepicker,
          .v-select {
            border: none !important;
          }
          &.column-opts {
            overflow: visible;
            .dropdown-menu {
              left: -116px;
              width: 160px;
            }
            .opt-btn {
              margin-left: 0;
              margin-right: 15px;
            }
            .table-p {
              margin: 0;
              height: 32px;
              line-height: 32px;
              width: 100%;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }

        &.active {
          td {
            background: @backColor;
          }
        }
        .td-opt {
          padding: 12px 10px;
          border: none;
          background: transparent;
          i {
            font-size: 15px;
            color: rgba(0, 0, 0, 0.36);
          }
        }
      }
    }
  }
  &.table-striped {
    thead {
      tr:nth-of-type(odd) {
        background: @tableStripedBackgroundColor;
      }
    }
    tbody {
      tr:nth-of-type(even) {
        background: @tableStripedBackgroundColor;
      }
    }
  }
  .table > thead > tr > th {
    border-bottom: none;
    color: rgba(0, 0, 0, 0.54);
  }
  .table > tbody > tr > td,
  .table > tbody > tr > th,
  .table > tfoot > tr > td,
  .table > tfoot > tr > th,
  .table > thead > tr > td,
  .table > thead > tr > th {
    position: relative;
    padding: 0 5px;
    border-color: @tableBorderColor;
    line-height: 40px;
    vertical-align: middle;
  }
  /*表格标题栏样式*/
  .table-title {
    th.table-title-container {
      border-top: none !important;
      padding: 32px 6px 12px 24px;
    }
  }
  .table-title {
    h3 {
      float: left;
      line-height: 2;
      color: rgba(0, 0, 0, 0.87);
      font-size: 16px;
      font-weight: 500;
    }
  }
  /*表格搜索栏样式*/
  tr.table-search {
    th,
    .container {
      padding: 3px 0 !important;
    }
    input-group {
      padding: 5px;
    }
  }
  .searchbar {
    td {
      border-bottom: none !important;
    }
  }
  .search-btn {
    background: @tableHeaderColor;
    border: none;
    i.active {
      color: darken(@30ThemeColor, 10%);
    }
  }
  .search-btn:focus {
    outline: none;
  }
  .btn-group {
    .btn {
      font-size: 14px;
    }
  }
  /*表格全选栏样式*/
  .table-tool {
    th {
      border-bottom: none !important;
      //取消文本选中
      -moz-user-select: none;
      /*火狐*/
      -webkit-user-select: none;
      /*webkit浏览器*/
      -ms-user-select: none;
      /*IE10*/
      -khtml-user-select: none;
      /*早期浏览器*/
      user-select: none;
    }
  }
  .table-tip {
    line-height: 160px;
  }
  .order-opt {
    width: 30px;
  }
  .check-opt-div {
    display: block;
    float: left;
    overflow: hidden;
  }
  .check-opt {
    position: relative;
    width: 40px;
    margin: 0;
    cursor: pointer;
    user-select: none;
    i {
      top: 3px;
    }
    span {
      display: block;
      float: left;
      width: 15px;
      height: 15px;
      padding: 1px;
      margin: 3px 3px 0 0;
      border: 1px solid #ccc;
      border-radius: 2px;
    }
    &.active {
      span {
        background-color: @checkColor;
        border: none;
      }
    }
    .check-info {
      font-weight: 500;
      font-size: 12px;
      .unchecked-count,
      .checked-count {
        font-weight: 500;
        font-size: 14px;
        padding: 0 2px;
      }
    }
  }
  /*表格复选框样式*/
  .check-td {
    padding: 0;
    text-align: center;
    vertical-align: middle !important;
    user-select: none;
    label {
      width: 15px;
      height: 15px;
      padding: 1px;
      margin-bottom: 0;
      border: 1px solid #ccc;
      border-radius: 3px;
      cursor: pointer;
    }
    i {
      line-height: 40px;
    }
    input[type="checkbox"] {
      visibility: hidden;
    }
  }
  tbody tr.active .check-td label {
    background-color: @checkColor;
    border: none;
  }
  /*表格header样式*/
  .table-header {
    background-color: @tableHeaderColor;
    .dropdown-toggle {
      border: none;
      background: transparent;
      color: @tableHeaderFontColor;
      &:active,
      &:hover,
      &:visited,
      &:focus {
        background-color: transparent;
        outline: none;
        color: @tableHeaderFontColor;
      }
    }
    .dropdown-menu.hidden-col {
      max-height: 300px;
      overflow-x: hidden;
      li {
        padding: 4px 10px;
        color: @checkColor;
        line-height: 24px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        cursor: pointer;
        i {
          margin-right: 8px;
        }
        &.active {
          color: rgba(0, 0, 0, 0.87);
          i {
            color: #298df7;
          }
        }
      }
    }
    th {
      border: none !important;
    }
  }
  .table-head {
    th {
      font-size: 13px;
      color: rgba(0, 0, 0, 0.54);
      border-top: 0;
    }
    .title-search-div {
      .cascaderTable {
      }
      position: absolute;
      width: 100%;
      top: 0;
      left: 5px;
      bottom: 0;
      z-index: 11;
      background: #fff;
      input {
        box-shadow: none;
        border-radius: 0;
        border: none;
        border-bottom: 2px solid #ccc;
        padding: 0;
        margin-top: 3px;
        font-size: 13px;
        &:hover,
        &:focus {
          border-bottom: 2px solid #298df7;
        }
      }
      .v-select {
        display: block;
        border-bottom: 2px solid #ccc;
        .form-control {
          padding-left: 0;
          padding-right: 0;
          margin-top: 3px;
          box-shadow: none;
          border-radius: 0;
          border: none;
        }
        &:hover,
        &:focus {
          border-bottom: 2px solid #298df7;
        }
      }
    }
    .check-opt {
      i {
        top: 7px;
      }
    }
  }
  .row-edit-input {
    height: auto;
    padding: 0;
    border: none;
    border-bottom: none;
    box-shadow: none;
    border-radius: 0;
    outline: none;
    background: transparent;
    line-height: 26px;
    border-bottom: 2px solid #ccc;
    transition: all 0.3s ease-out;
    &:hover,
    &:focus {
      border-bottom: 2px solid #298df7;
    }
  }
  /*分页控件样式*/
  .pageinfo {
    line-height: 34px;
    margin: 20px 24px;
    font-size: 13px;
    color: rgba(0, 0, 0, 0.54);
    color: rgba(0, 0, 0, 0.54);
    input {
      width: 50px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      border: none;
      border-bottom: 1px solid #ccc;
      outline: none;
      color: rgba(0, 0, 0, 0.87);
    }
  }
  .gotopage {
    width: 120px;
    margin: 20px 10px;
    button {
      border: none;
      outline: none;
      box-shadow: none;
      background: @tableHeaderColor;
      font-size: 13px;
      color: rgba(0, 0, 0, 0.54);
      font-weight: 500;
      &:visited,
      &:hover,
      &:active {
        background: @tableHeaderColor;
        outline: none;
        box-shadow: none;
      }
    }
    input {
      border: none;
      box-shadow: none;
      text-align: center;
      padding-left: 0;
    }
    span.input-group-btn {
      font-size: 13px;
      color: rgba(0, 0, 0, 0.54);
      font-weight: 500;
      text-align: center;
      padding-left: 0;
    }
  }
  .pagination {
    li {
      a {
        color: @paginationFontColor;
        // border: 1px solid @paginationBackgroundColor;
        border: none;
        &.page-control {
          padding: 5px;
        }
      }
      span {
        font-size: 13px;
        color: rgba(0, 0, 0, 0.54);
      }
      i.maticon {
        color: rgba(0, 0, 0, 0.54);
        font-weight: 500;
        transform: translateY(-2px);
      }
    }
    & > .active {
      a,
      span,
      i.maticon {
        // color: @paginationFontColor;
        border-radius: 3px;
        background: rgb(41, 141, 247);
        border-color: rgb(41, 141, 247);
        color: #fff;
        &:focus,
        &:hover {
          border-radius: 3px;
          color: #fff;
          background: rgb(41, 141, 247);
          border-color: rgb(41, 141, 247);
        }
      }
    }
  }
}
.numberArea {
  .form-control {
    width: 40%;
    padding-right: 0 !important;
  }
}
</style>


