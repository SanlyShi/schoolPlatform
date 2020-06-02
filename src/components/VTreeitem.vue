<template>
  <li class="list-group-item tree-item" style="border: none;padding-right: 0;" :class="active">
    <a class="btn-block" :class="expended?'':'collapsed'" role="button" :aria-expanded="expended" @click="_idChange" v-if="!editing">
      <span class="span-check pull-left" :class="checked?'active':''" @click.stop="_checkChange" v-if="checkable">
        <i class="maticon" v-html="icons('check_box_outline_blank')" v-if="!checked">check_box_outline_blank</i>
        <i class="maticon" v-html="icons('check_box')" v-else>check_box</i>
      </span>
      
      <span class="pull-right" @click.stop="expended=!expended" v-if="children&&children.length>0">
        <i class="maticon" v-html="icons('expand_less')" v-if="expended">expand_less</i>
        <i class="maticon" v-html="icons('expand_more')" v-else>expand_more</i>
      </span> {{title}}
      <span class="pull-right" style="padding-right: 15px;" v-if="editable">
				<i class="glyphicon glyphicon-pencil"
					:title="translate.editIconTitle"
					@click.prevent.stop="_changeEditing"
					v-if="treeItem.edit">
				</i>
				<i class="glyphicon glyphicon-plus"
					:title="translate.addIconTitle"
					@click.prevent.stop="_addItem"
					v-if="treeItem.add">
				</i>
				<i class="glyphicon glyphicon-remove"
					:title="translate.deleteIconTitle"
					@click.prevent.stop="_deleteEmit"
					v-if="treeItem.delete">
				</i>
			</span>
    </a>
    <div class="input-group" v-else>
      <input type="text" class="form-control" autofocus="" @blur="_changeEditing" v-model="treeItem[titleField]" />
      <span class="input-group-addon" @click.stop="_changeEditing">
				<i class=" glyphicon glyphicon-ok" :title="translate.saveIconTitle"></i>
			</span>
    </div>
    <ul class="panel-collapse collapse list-group" :class="this.expended?'in':''" role="tabpanel" v-if="children&&children.length>0">
      <v-treeitem :treeId='treeId' v-for="(it,i) in children" @clickitem ="childClick(index,it,children)" :idField="idField" :titleField="titleField" :editable="editable" :item="it" :pItem="item" :activeId="activeId" :index="i" :checkable="checkable" :key="it[idField]" :cascade="cascade" :collapsed="collapsed" :isCheck="checked" :beforeAdd="beforeAdd" :beforeDelete="beforeDelete" :beforeEdit="beforeEdit" :itemClick="itemClick" :lang="lang" @_changeItem="_changeItem" @_deleteItem="_deleteItem" v-show="!it.hidden"></v-treeitem>
    </ul>
  </li>
</template>

<script>
  import Vue from 'vue'
  import { translation } from '../assets/utils/utils.js'
  export default {
    props: {
      treeId: {
        default: 'v-tree'
      },
      activeId: {
        default: 0
      },
      idField: {
        default: 'id'
      },
      titleField: {
        default: 'title'
      },
      editable: {
        default: false
      },
      checkable: {
        default: false
      },
      cascade: {
        default: false
      },
      collapsed: {
        default: false
      },
      index: {
        default: 0
      },
      item: {
        default: null
      },
      pItem: {
        default: null
      },
      isCheck: {
        default: false
      },
      lang: {
        default: 'zh-cn'
      },
      beforeAdd: {
        default: function () {
          return true
        }
      },
      beforeDelete: {
        default: function () {
          return true
        }
      },
      beforeEdit: {
        default: function () {
          return true
        }
      },
      itemClick: {
        default: function (pn, cn) {
          return function (pn, cn) {
            console.log('pn',pn)
          }
        }
      }
    },
    data: function () {
      var ti = this.item
      return {
        editing: false,
        checked: this.item.checked,
        treeItem: ti,
        expended: this.collapsed
      }
    },
    created:function(){
      // console.log(JSON.stringify(this.item))
    },
    computed: {
      id: function () {
        return this.treeItem[this.idField]
      },
      title: function () {
        return this.treeItem[this.titleField]
      },
      children: function () {
        return this.treeItem.children
      },
      active: function () {
        return (this.id === this.activeId) && (!this.children) ? 'active' : ''
      },
      disabled: function () {
        return this.treeItem.disabled
      },
      //    hrefId: function () {
      //      if (this.children && this.children.length > 0) {
      //        return '#Group' + this.treeItem[this.idField]
      //      } else {
      //        return '#Group'
      //      }
      //    },
      ulId: function () {
        return 'Group' + this.treeItem[this.idField]
      }
    },
    watch: {
      isCheck: function () {
        if (!this.cascade || this.cascade === 'false' || this.disabled || this.disabled === 'true') return
        this.checked = this.isCheck
        // console.log("ischeck"+this.checked)
        this.treeItem.checked = this.checked
      },
      item: {
        deep: true,
        handler: function () {
          this.treeItem = this.item
          this.checked = this.item.checked
          //  console.log("itemHandle"+this.checked)
        }
      }
    },
    methods: {
      /* 发送数据，由当前组件触发且数据传递的起始站为当前操作组件 */
      // 修改选中状态
      childClick(index,item,result){
        // console.log('index',index);
        this.$emit("clickChild",{index,item,result})
      },
      _checkChange: function () {
        this.$emit("clickitem",this.index)
        if (!this.treeItem.disabled) {
          this.checked = !this.checked
          this.treeItem.checked = this.checked
        }
      },
      // 删除子数据元素
      _deleteItem: function (i) {
        if (this.beforeDelete && this.beforeDelete(this.treeItem, this.treeItem.children[i]) === false) {
          return
        }
        this.treeItem.children.splice(i, 1)
      //等于
      },
      
      // 给父组件发送要删除的子元素的位置，由父组件删除子数据元素
      _deleteEmit: function () {
        this.$emit('_deleteItem', this.index)
      },
      // 新增分支
      _addItem: function () {
        var ni = {}
        var time = (new Date()).getTime()
        ni[this.idField] = time
        ni[this.titleField] = this.translate.newNodeTitle
        ni['edit'] = true
        ni['delete'] = true
        ni['add'] = true

        if (this.beforeAdd && this.beforeAdd(this.treeItem, ni) === false) {
          return
          // 失败则返回
        }
        if (!this.children) {
          Vue.set(this.treeItem, 'children', [])
        }
        this.treeItem.children.push(ni)
      },
      // 激活该组件
      _idChange: function () {
        if (this.treeItem.route) {
          this.$router.push({
            path: this.treeItem.route
          })
        }
        this.itemClick(this.pItem, this.item)
        this.$emit('_changeItem', this.id)
      },

      /* 转发数据，当前组件只是作为数据中转站，不做任何处理 */
      // 更改激活枝id
      _changeItem: function (id) {
        this.$emit('_changeItem', id)
      },

      _changeEditing: function () {
        if (this.beforeEdit && this.beforeEdit(this.pItem, this.treeItem) === false) {
          return
        }
        this.editing = !this.editing
      },

      translate: function () {
        return translation(this.lang).tree
      }

    }
  }
</script>

<style lang="less">
@import url("../assets/common.less");
@checkedColor: #298df7;
@disabledCheckedColor: @complementThemeColor;
/*树元素选中样式*/

.active-style {
  background: @checkedColor;
  color: #fff;
}

.tree-item {
  padding: 0;
  background: transparent;
  .list-group {
    margin-bottom: 0;
    padding-left: 15px;
  }
  & > a {
    padding: 6px 10px;
    color: rgba(0,0,0,0.67);
    text-decoration: none;
    line-height: 28px;
    cursor: pointer;
    &:hover {
      .active-style;
      .span-check.active{
        color: #fff;
      }
    }
  }
  &.active {
    & > a {
      .active-style;
    }
  }
}

.span-check {
  margin-right: 16px;
  &.active {
    color: @checkedColor;
  }
  &.disabled {
    background: @disabledCheckedColor;
    border: 1px solid @disabledCheckedColor;
  }
}

</style>
