<template>
  <div class="page-1">
    <!--表格组件用法-->
    <v-table title="这是一张asdfasdf a" pagesize="10" idField="idNum" :rows="data" :columns="columns" :rowClick="rowClick" order="true" :search="true" :searchParams="definedSearch">
      
    </v-table>

    <!--弹出层组件用法-->
    <v-modal :show="showCustomModal" effect="fade" width="400">
      <div slot="modal-header" class="modal-header">
        <h4 class="modal-title">
        <i>Custom</i> <code>Modal</code>Title
      </h4>
      </div>
      <div slot="modal-body" class="modal-body">这是一个弹出层</div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn btn-default" @click="showCustomModal = false">Exit</button>
        <button type="button" class="btn btn-success" @click="showCustomModal = false">Custom Save</button>
      </div>
    </v-modal>
    <button class="btn btn-primary" @click="showCustomModal=true">点击查看弹窗</button>
  </div>

</template>

<script>
  import Vue from 'vue'
  import VTable from '../components/VTable2.vue'
  import VModal from '../components/VModal.vue'
  Vue.component('v-table', VTable)
  Vue.component('v-modal', VModal)
  export default {
    components: {
      VTable
    },
    data() {
      return {
        definedSearch: {
          name: {
            type: 'input'
          },
          birthday: {
            type: 'datetime'
          }
        },
        showCustomModal: false,
        // table 数据
        columns: [{
          id: 'field.name',
          title: '姓名',
          width: 200,
          className: '',
          // canSearch: true,
          hidden: false
        }, {
          id: 'field.sex',
          title: '性别',
          className: 'style',
          // canSearch: true,
          hidden: false
        }, {
          id: 'field.grade',
          title: '年级',
          className: 'style',
          // canSearch: true,
          hidden: false
        }, {
          id: 'field.birthday',
          title: '出生年月',
          className: '',
          // hidden: true
        }, {
          id: 'opt',
          title: '操作',
          className: '',
          hidden: false,
          formatter: function () {
            // record 行数据，index 行号  第index行
            return [{
              tag: 'button',
              text: '按钮1',
              callback: function (record, index) {
                alert('点击按钮1')
              }
            }, {
              tag: 'a',
              text: '链接1',
              href: '',
              callback: function (record, index) {
                alert('点击连接1')
              }
            }, {
              tag: 'img',
              text: '图片',
              src: 'src/media/image/logo.png',
              callback: function (record, index) {
                alert('点击图片1')
              }
            }]
          }
        }],
        data: [{
          field: {
            name: '张三',
            sex: '男',
            grade: '2012',
            birthday: '2012-09-20'
          }
        }],

        options: [{
          text: '操作1',
          func: function () {
            alert('点击操作1')
          }
        }, {
          text: '操作2',
          func: function () {
            alert('点击操作2')
          }
        }],
        selections: null

      }
    },
    methods: {
      // table
      rowClick: function (rowData, index) {
        alert('点击了行' + index)
      },
      click1: function () {
        alert(1)
      },
      click2: function () {
        alert(2)
      }
    }
  }
</script>

<style lang="less">
  .page-1{
    margin-top: 20px;
  }
</style>
