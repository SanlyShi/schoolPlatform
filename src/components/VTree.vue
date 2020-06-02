<!--
	操作文档
	最后修改时间：2017-12-04
	传参列表：
	activeId:{		默认激活选项id
		default:undefined
	},
  idField:{ id映射字段
    default:'id'
  },
  titleField:{ title映射字段
    default:'title'
  },
	collapsed: {	默认展开
		default: true
	},
	cascade:{		默认不可级联操作
		default:false
	},
	editable: {		默认不可编辑
		default: false
	},
	checkable:{		默认不可勾选
		default:false
	},
  search: {  是否需要搜索树
    default: false
  },
	title: {		树名,当title与editable都为空或者false的时候 则默认为不显示头部
		default: ""
	},
	footer:{
	 default:function(){
	   return {
	     title:'树尾巴名'，
	     show:false 是否展示
	   }
	 }
	},
	items: {		树形结构数组
		default: function() {
			return [{
				id: 1,
				title: "首页",
				edit:false,
				add:false,
				delete:false,
				disabled:false,//false情况下级联无效
				checked:false,//初始选中
				iconClass:'',//图标icon类
				children: [{
					id: 5,
					title: "子目录",
					route: "/hello",
				}, {
					id: 6,
					title: "子目录"
				}, {
					id: 7,
					title: "子目录",
				}]
			}, {
				id: 2,
				title: "目录"
			}, {
				id: 3,
				title: "目录",
			}, {
				id: 4,
				title: "目录",
			}];
		}
	},
	url:{
	  default:''
	},
	params:{
	  default:null
	},
	beforeAdd: {		默认添加元素前执行，必须为函数
		default: null
	},
	beforeDelete:{		默认删除元素前执行，必须为函数
		default:null
	}
	beforeEdit:{   默认编辑元素前执行，必须为函数
    default:null
  }
  itemClick{
    default:null
  }
	方法：
	beforeDelete
	 删除节点前先通知数据库删除节点信息，成功与否由返回值决定
	 参数：(父节点对象，要删除的节点)
	 返回值：boolean，
		true：后台删除成功，同步节点，默认值
		false：后台删除失败，无法同步节点
	beforeAdd
	 新增节点前的操作，主要先获取节点的id从而实现节点可控
	 参数：(父节点对象，新增节点)
	 返回值:boolean,
		true：添加成功，默认值
		false:添加失败
	beforeEdit
	编辑节点前的操作
	参数：(父节点对象,编辑的节点对象)
	返回值：bolean
	  true:允许编辑
	  false:不允许编辑
	itemClick
	节点点击事件
	参数：(父节点，子节点)，注意：最外层节点的父节点只有title与children属性
	返回值：无
	getData
	 获取节点所有数据
	 参数：无
	 返回值：array
	setChecked
	设置选中项
	参数：id数组
	返回值：无
	getChecked
	获取选中节点集合
	参数：无
	返回值：json数组
-->

<template>
  <div class="v-tree">
    <div class="input-group" v-if="search">
      <input type="text" class="form-control" :placeholder="translate.searchPlaceholder" aria-describedby="basic-addon2" v-model="searchValue">
      <span class="input-group-addon" id="basic-addon2"><i class=" glyphicon glyphicon-search" :title="translate.searchIconTitle"></i></span>
    </div>
    <div class="panel-heading" role="tab" v-if="title||editable">
      <h4 class="panel-title">
		          <label class="collapsed btn-block" role="button" data-toggle="collapse" :href="'#'+id"
		          	v-if="!editing" >
		            {{title}}
		             <span class="pull-right" v-if="editable">
						<i class="glyphicon glyphicon-edit" @click.prevent.stop="_changeEditing" :title="translate.editIconTitle"></i>
						<i class="glyphicon glyphicon-plus" @click.prevent.stop="_addItem" :title="translate.addIconTitle"></i>
					</span>
		          </label>
		          <div class="input-group" v-else>
						<input type="text" class="form-control" @blur="_changeEditing" v-model="title" autofocus="" />
						<span class="input-group-addon" @click.prevent.stop="_changeEditing">
							<i class=" glyphicon glyphicon-check" :title="translate.saveIconTitle"></i>
						</span>
					</div>
		       </h4>
    </div>
    <div :id="id" class="panel-body panel-collapse collapse in" role="tabpanel">
      <ul class="list-group">
        <v-treeitem :treeId="id" v-for="(item,index) in result" :idField="idField" :titleField="titleField" :item="item" :pItem="treeObj" :editable="editable" :activeId="aId" :index="index" :key="item[idField]" :cascade="cascade" :checkable="checkable" :beforeAdd="beforeAdd" :beforeDelete="beforeDelete" :beforeEdit="beforeEdit" :itemClick="itemClick" @clickChild="clickChild" @clickitem="_ckeckItem(index,item.id)" :collapsed="collapsed" :lang="lang" @_changeItem="_changeItem" @_deleteItem="_deleteItem" v-show="!item.hidden"></v-treeitem>
      </ul>
    </div>
    <div class="panel-footer" v-if="footer.show">
      Footer
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import $ from 'jquery'
  import { translation } from '../assets/utils/utils.js'
  import VTreeitem from './VTreeitem.vue'
  Vue.component('v-treeitem', VTreeitem)
  export default {
    props: {
      id: {
        required: true,
        default: 'v-tree'
      },
      activeId: {
        default: undefined
      },
      idField: {
        default: 'id'
      },
      titleField: {
        default: 'title'
      },
      collapsed: {
        default: true
      },
      cascade: {
        default: false
      },
      editable: {
        default: false
      },
      checkable: {
        default: false
      },
      title: {
        default: ''
      },
      footer: {
        default: function () {
          return {
            title: 'footer',
            show: false
          }
        }
      },
      search: {
        default: false
      },
      defaultLang: {
        default: 'zh-cn'
      },
      items: {
        default: function () {
          return [{
            id: 1,
            title: '首页',
            edit: true,
            children: [{
              id: 5,
              title: '子目录',
              disabled: true
            }, {
              id: 6,
              title: '子目录'
            }, {
              id: 7,
              title: '子目录'
            }]
          }, {
            id: 2,
            title: '目录',
            delete: true
          }, {
            id: 3,
            title: '目录'
          }, {
            id: 4,
            title: '目录'
          }]
        }
      },
      url: {
        default: ''
      },
      params: {
        default: function () {
          return {}
        }
      },
      beforeAdd: {
        default: null
      },
      beforeDelete: {
        default: null
      },
      beforeEdit: {
        default: null
      },
      itemClick: {
        default: function () {
          return function (pn, cn) { }
        }
      }
    },
    components: {
      VTreeitem
    },
    created: function () {
      var that = this
      var la = localStorage.getItem('lang')
      if (translation(la)) {
        that.lang = la
      }
      if (that.url) {
        that._initTreeWithUrl()
      } else {
        that._initTreeWithItems()
      }
    },
    data: function () {
      return {
        editing: false,
        searchValue: '',
        aId: this.activeId,
        treeItems: [],
        lang: this.defaultLang
      }
    },
    computed: {
      result: function () {
        if (this.search) {
          this._searchFromTree('title', this.searchValue)
        }
        // console.log(JSON.stringify(this.treeItems))
        return this.treeItems
      },
      treeJson: function () {
        var j = {}
        var that = this
        addToJson(that.treeItems)

        function addToJson (arr) {
          arr.forEach(function (ele) {
            j[ele[that.idField]] = ele
            if (ele.children && ele.children.length > 0) {
              addToJson(ele.children)
            }
          })
        }
        return j
      },
      treeObj: function () {
        return {
          title: this.title,
          children: this.treeItems
        }
      },
      translate: function () {
        return translation(this.lang).tree
      }
    },
    watch: {
      url: function () {
        this._initTreeWithUrl()
        this.searchValue = ''
      },
      items: {
        deep: true,
        handler: function () {
          this.treeItems = JSON.parse(JSON.stringify(this.items))
          this.searchValue = ''
        }
      }
    },
    methods: {
      clickChild(obj){
        this.$emit("clickChild",obj)
      },
      _ckeckItem(index,id) {
        this.$emit("itemClick",index,id)
      },
      _initTreeWithUrl: function () {
        var that = this
        that.params.lang = this.lang
        $.ajax({
          url: that.url,
          type: 'get',
          data: that.params,
          success: function (data) {
            if (data.state) {
              that.treeItems = data.data
            } else {
              that.$toast(data.message)
            }
          }
        })
      },
      _initTreeWithItems: function () {
        this.treeItems = JSON.parse(JSON.stringify(this.items))
      },
      _changeEditing: function () {
        this.editing = !this.editing
      },
      _addItem: function () {
        var ni = {}
        var time = (new Date()).getTime()
        ni[this.idFiled] = time
        ni[this.titleField] = this.translate.newNodeTitle
        ni['edit'] = true
        ni['delete'] = true
        ni['add'] = true

        if (this.beforeAdd && this.beforeAdd(this.treeObj, ni) === false) {
          // 失败则返回
          return
        }
        if (!this.treeItems) {
          this.treeItems = []
        }
        this.treeItems.push(ni)
      },

      /* 收到树枝的通知 */
      // 更换激活枝id
      _changeItem: function (id) {
        this.aId = id
      },
      // 删除子数据
      _deleteItem: function (i) {
        if (this.beforeDelete && this.beforeDelete(this.treeObj, this.treeItems[i]) === false) {
          return
        }
        this.treeItems.splice(i, 1)
      },
      _searchFromTree: function (name, val) {
        searchArr(this.treeItems)

        function searchArr (arr) {
          var hasChildSatisfied = false
          arr.forEach(function (ele) {
            var hidden = false
            if (ele[name].indexOf(val) < 0) {
              hidden = true
            } else {
              hidden = false
              hasChildSatisfied = true
            }
            if (ele.children && ele.children.length > 0) {
              if (searchArr(ele.children)) {
                hidden = false
              }
            }
            Vue.set(ele, 'hidden', hidden)
          })
          return hasChildSatisfied
        }
      },

      /* 供外部调用的接口 */
      getData: function () {
        return this.treeItems
      },
      setChecked: function (idArr) {
        var that = this
        searchArr(this.treeItems)

        function searchArr (arr) {
          arr.forEach(function (ele) {
            if (idArr.indexOf(ele[that.idField]) >= 0) {
              Vue.set(ele, 'checked', true)
            }
            if (ele.children && ele.children.length > 0) {
              searchArr(ele.children)
            }
          })
        }
      },
      setAllChecked: function () {
        var that = this
        this.treeItems.forEach(ele => {
          Vue.set(ele, 'checked', true)
          if (ele.children && ele.children.length > 0) {
              ele.children.forEach(o => {
                Vue.set(o, 'checked', true)
              })
            }
        }) 
      },
      setAllUnchecked: function () {
        var that = this
        this.treeItems.forEach(ele => {
          Vue.set(ele, 'checked', false)
          if (ele.children && ele.children.length > 0) {
              ele.children.forEach(o => {
                Vue.set(o, 'checked', false)
              })
            }
        }) 
      },
      getChecked: function () {
        var checkedArr = []
        searchArr(this.treeItems)

        function searchArr (arr) {
          arr.forEach(function (ele) {
            if (ele.checked) {
              checkedArr.push(ele)
            }
            if (ele.children && ele.children.length > 0) {
              searchArr(ele.children)
            }
          })
        }
        return checkedArr
      },
      getItemById: function (id) {
        return this.treeJson[id]
      }
    }
  }
</script>

<style lang="less">

</style>
