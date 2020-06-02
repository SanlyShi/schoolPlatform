<template>
  <div class="link-page">
    <div class="link-wrap">
      <div class="content text-center">
        <v-table ref="table" title="链接列表" :url="url+systemId+timestamp" :pagesize="10" :columns="columns" :multiple="false" :order="true" @change="_changeTable">
          <div slot="btn-group" role="group">
            <div class="btn-group pull-right ">
              <button type="button" @click="addOrEditLink('add')" class="btn batch-add-btn btn-bgColor-style clearBtnBorder" :class="{'disabled': disabled}">新增链接</button>
            </div>
          </div>
        </v-table>
      </div>
    </div>
    <v-modal :show="showAddView" effect="fade" @onHide="showAddView=false" width="400">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">{{modalType=='add'?'新增':'编辑'}}链接</h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="input-group addClass-input-group">
          <span class="require">*</span>
          <label class="addClass-text">链接标题:</label>
          <input v-model="addParams.title" class="form-control search-input" type="text">
        </div>
        <div class="input-group addClass-input-group">
          <span class="require">*</span>
          <label class="addClass-text">链接地址:</label>
          <input v-model="addParams.url" class="form-control search-input" type="text">
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showAddView = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="save">确认</button>
      </div>
    </v-modal>
  </div>
</template>

<script>
import { request } from '../../assets/utils/utils.js'
export default {
  created: function () {
    this.systemId = sessionStorage.getItem('_SYSTEM_ID')
    this.initTable()
  },
  data: function () {
    return {
      systemId: '',
      url: '/table-data/cms/bottom/getBottomList?systemId=',
      showAddView: false,
      modalType: 'add',
      addParams: {
        title: '',
        url: ''
      },
      timestamp: '',
      requireField: [{ text: '链接标题', value: 'title' }, { text: '链接地址', value: 'url' }],
      showTypeModal: false,
      searchField: 'name',
      oldParams: {},
      disabled: false,
      rowNum: 0
    }
  },
  methods: {
    save() {
      for (var i in this.requireField) {
        if (!this.addParams[this.requireField[i].value]) {
          this.$toast(this.requireField[i].text + '不能为空!')
          return;
        }
      }
      let params = JSON.parse(JSON.stringify(this.addParams));
      params.systemId = this.systemId
      let url = this.modalType == 'add' ?'api/cms/bottom/addBottom':'api/cms/bottom/updateBottom'
      let method = 'post'

      request(url, params, method).then(o => {
        if (o.state) {
          this.$toast('操作成功!');
          this.timestamp = `&timestamp=${new Date()}`
          this.showAddView = false
        } else {
          this.$toast(o.message)
        }
      })
    },
    initTable() {
      let that = this
      this.columns = [{
        id: 'title',
        title: '链接名称',
        width: 250,
        className: 'text-left',
        hidden: false,
      }, {
        id: 'url',
        title: '链接地址',
        width: 400,
        className: 'text-left',
        hidden: false
      }, {
        id: 'operatorName',
        title: '操作人',
        className: 'text-left',
        hidden: false,
      }, {
        id: 'opt',
        title: '操作',
        className: 'text-center',
        width: '210px',
        hidden: false,
        formatter: (record, index) => {
          return [{
            tag: 'a',
            text: '编辑',
            className: 'opt-btn',
            callback: (record, index) => {
              // that.addParams = Object.assign({},record)
              that.addParams.id = record.id
              that.addParams.url = record.url
              that.addParams.title = record.title
              
              that.addOrEditLink('edit')
            }
          }, {
            tag: 'a',
            text: '删除',
            className: 'opt-btn',
            callback: (record, index) => {
              if(confirm('确认要删除该链接吗?')) {
                request(`/api/cms/bottom/${record.id}`,{},'post').then(data => {
                  if (data.state) {
                    this.$toast("删除成功");
                    this.timestamp = `&timestamp=${new Date()}`
                  } else {
                    this.$toast(data.message);
                  }
                })
              }
            }
          }]
        }
      }]
      
    },
    addOrEditLink(type) {
      if(type == 'add') {
        this.addParams = {
          title: '',
          url: ''
        }
      }
      if(type == 'add'&&this.$refs.table.tableState.totalRecords==6) {
        this.$toast('最多只能添加6个链接！')
        return;
      }
      this.modalType = type
      this.showAddView = true;
    },
    _changeTable: function (obj) {
        
        console.log(obj)
      },
  }
}
</script>
<style lang="less" scoped>
 .addClass-input-group {
    display: inline-flex;
    width: 100%;
    margin-bottom: 18px;
    .search-select {
      width: 212px;
      margin: 0 19px;
    }
    .search-input {
      margin: 0 16px;
      width: 212px;
      float: initial;
    }
    .require {
      margin: 10px 5px 0;
      color: red;
    }
  }
  
  .addClass-text {
    // width: 90px;
    padding-top: 6px;
    text-align: right;
  }
  .disable {
    background: #ccc;
    color: #666;
  }
</style>
