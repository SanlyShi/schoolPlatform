<template>
  <div class="module-page">
    <div v-if="!showChildModule&&!showContentManage" class="p-module-wrap">
      <div class="content text-center">
        <v-table title="模块管理列表" :url="url+systemId+timestamp+0" :pagesize="10" :columns="columns" :multiple="false" :order="true" :search="false">
          <div slot="btn-group" role="group">
            <div class="btn-group pull-right ">
              <button type="button" @click="addOrEditModule('add')" class="btn batch-add-btn btn-bgColor-style clearBtnBorder">新增模块</button>
            </div>
          </div>
        </v-table>
      </div>
      <v-modal :show="showAddView" effect="fade" width="440">
        <div slot="modal-header" class="modal-header">
          <h5 class="modal-title">{{modalType=='add'?'新增':'编辑'}}模块</h5>
        </div>
        <div slot="modal-body" class="modal-body">
          <el-form ref="positionInfoForm" :model="addParams[0]" label-width="120px">
            <el-form-item label="标题" required>
              <el-input class="w240" v-model="addParams[0].title"></el-input>
            </el-form-item>
            <el-form-item label="模块类型" required>
              <el-select class="w240" :disabled="modalType=='edit'" v-model="addParams[0].type" @change="onSelectConstant" placeholder="请选择">
                <el-option v-for="item in selectOptions.type" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发布到首页" required>
              <el-select class="w240" v-model="addParams[0].isShow" filterable=true placeholder="请选择">
                <el-option v-for="item in selectOptions.isShow" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div slot="modal-footer" class="modal-footer">
          <button type="button" class="btn cancel-btn clearBtnBorder" @click="showAddView = false">取消</button>
          <button type="button" class="btn submit-btn clearBtnBorder" @click="save">确认</button>
        </div>
      </v-modal>
    </div>
    <div v-else-if="showChildModule&&!showContentManage" class="c-module-wrap">
      <div class="back-btn">
        <i class="maticon pull-left" @click="back()" v-html="icons('arrow_back')">arrow_back</i>
        <span @click="back()">返回</span>
      </div>
      <div class="content text-center">
        <v-table title="子模块列表" ref="table" :url="url+systemId+timestamp+parentId" :columns="columns" :multiple="false" :order="true" :search="false">
          <div slot="btn-group" role="group">
            <div class="btn-group pull-right ">
              <button type="button" @click="addOrEditModule('add')" class="btn batch-add-btn btn-bgColor-style clearBtnBorder">新增子模块</button>
            </div>
          </div>
        </v-table>
      </div>
      <v-modal :show="showAddView" effect="fade" @onHide="showAddView=false" width="400">
        <div slot="modal-header" class="modal-header">
          <h5 class="modal-title">{{modalType=='add'?'新增':'编辑'}}子模块</h5>
        </div>
        <div slot="modal-body" class="modal-body">
          <div class="input-group addClass-input-group">
            <label class="addClass-text">子模块名称:</label>
            <input maxlength="4" v-model="addParams[1].title" class="form-control search-input" type="text">
          </div>
          <div class="modal-tips">提示：最多只能输入4个字符</div>
        </div>
        <div slot="modal-footer" class="modal-footer">
          <button type="button" class="btn cancel-btn clearBtnBorder" @click="showAddView = false">取消</button>
          <button type="button" class="btn submit-btn clearBtnBorder" @click="save">确认</button>
        </div>
      </v-modal>
    </div>
    <div v-else-if="showContentManage">
      <content-manage  :subParentId="subParentId" :systemId="systemId" @back="showContentModal"></content-manage>
    </div>
  </div>
</template>

<script>
import { request } from '../../assets/utils/utils.js'
import contentManage from './contentManage'
export default {
  components: { contentManage },
  created: function () {
    this.systemId = sessionStorage.getItem('_SYSTEM_ID')
    this.initTable()
  },
  data: function () {
    return {
      systemId: '',
      url: '/table-data/cms/module/getModuleList?systemId=',
      timestamp: '&timestamp=&parentId=',
      showAddView: false,
      showChildModule: false,
      showContentManage: false,
      parentId: 0,
      subParentId:0,
      modalType: 'add',
      addParams: [{
        title: '',
        type: 'CLASSIFY_MODULE',
        parentId: 0,
        isShow: 0,
      },{
        title: '',
        parentId: this.parentId,
      }],
      requireField: [{ text: '标题', value: 'title' }],
      selectOptions: {
        type: [
          {label: "分类模块", value: "CLASSIFY_MODULE"},
          {label: "内容模块", value: "CONTENT_MODULE"},
        ],
        isShow: [
          {label: "否", value: 0},
          {label: "是", value: 1},
        ]
      },
      selectImageBase64: '',
      showTypeModal: false,
      searchField: 'name',
      oldParams: {}
    }
  },
  methods: {
    save() {
      for (var i in this.requireField) {
        if (!this.addParams[this.showChildModule?1:0][this.requireField[i].value]) {
          this.$toast(this.requireField[i].text + '不能为空!')
          return;
        }
      }
      let params = JSON.parse(JSON.stringify(this.addParams[this.showChildModule?1:0]));
      params.systemId = this.systemId
      let url = this.modalType == 'add' ?'api/cms/module/addModule':'api/cms/module/updateModule'
      let method = 'post'

      request(url, params, method).then(o => {
        if (o.state) {
          this.$toast('操作成功!');
          this.timestamp = `&timestamp=${new Date()}&parentId=`
          this.showAddView = false
        } else {
          this.$toast(o.message)
        }
      })
    },
    initTable() {
      
      let that = this
      let commonColumns = [{
        id: 'updateTime',
        title: '更新时间',
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
          let hasChild = record.type ===  'CLASSIFY_MODULE' ? true : false
          return [{
              tag: 'a',
              text: '编辑',
              className: 'opt-btn',
              callback: (record, index) => {
                that.addParams[this.showChildModule?1:0].id = record.id
                that.addParams[this.showChildModule?1:0].title = record.title
                that.addParams[this.showChildModule?1:0].type = record.type
                that.addParams[this.showChildModule?1:0].isShow = record.isShow
                that.addParams[this.showChildModule?1:0].parentId = record.parentId
                that.addOrEditModule('edit')
              }
            }, {
              tag: 'a',
              text: `${hasChild?'子模块管理':'内容管理'}`,
              className: 'opt-btn',
              callback: (record, index) => {
                if(hasChild) {
                  this.parentId = record.id
                  this.back()
                } else {
                  this.subParentId = record.id
                  this.showContentManage = true
                }
                
              }
            }, {
              tag: 'a',
              text: '删除',
              className: 'opt-btn',
              callback: (record, index) => {
                this.delModule(record)
              }
            }]
        }
      }]
      let columns = [[{
        id: 'title',
        title: '模块',
        className: 'text-left',
        hidden: false,
        search: {
          type: 'input',
          data: {
            placeholder: ''
          }
        }
      }, {
        id: 'type',
        title: '模块类型',
        className: 'text-left',
        hidden: false,
        formatter: (record, index) => {
          let obj = this.selectOptions.type.find(item => item.value === record.type)
          return obj.label
        }
      }],
      [{
        id: 'title',
        title: '子模块名称',
        className: 'text-left',
        hidden: false,
        search: {
          type: 'input',
          data: {
            placeholder: ''
          }
        }
      }]
      ]
      this.columns = columns[this.showChildModule?1:0].concat(commonColumns)
    },
    back() {
      this.showChildModule = !this.showChildModule
      this.timestamp = `&timestamp=${new Date()}&parentId=`
      this.initTable()
    },
    addOrEditModule(type) {
      this.modalType = type
      if(type == 'add') {
        this.addParams = [{
          title: '',
          type: 'CLASSIFY_MODULE',
          parentId: 0,
          isShow: 0,
        },{
          title: '',
          parentId: this.parentId,
          type: 'CONTENT_MODULE',
        }]
        if(this.showChildModule&&this.$refs.table.tableState.totalRecords>=4) {
          this.$toast('最多只能创建4个子模块')
          return;
        }
      }

      this.showAddView = true;
    },
    delModule(record) {
      if(confirm('确认要删除吗？删除后该模块和内容将无法恢复!')) {
        request(`/api/cms/module/${record.id}`,{},'post').then(data => {
          if (data.state) {
            this.$toast("删除成功");
            this.timestamp = `&timestamp=${new Date()}&parentId=`
          } else {
            this.$toast(data.message);
          }
        })
      }
    },
    showContentModal() {
      this.showContentManage = !this.showContentManage
    },
  } 
}
</script>
<style lang="less" scoped>
.module-page {
  .c-module-wrap {
    position: relative;
    .back-btn {
      position: absolute;
      left: 10px;
      top: 6px;
      display: flex;
      align-items: center;
      color: #666;
      z-index: 1;
      cursor: default;
      .maticon {
        font-size: 20px;
      }
    }
  }
  .w240 {
    width: 240px;
  }
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
  }
  
  .addClass-text {
    width: 90px;
    padding-top: 6px;
    text-align: right;
  }
  .modal-tips {
    margin-left: 108px;
    margin-top: -12px;
    font-size: 12px;
    color: red;
  }
  .el-form-item__content {
    margin-left: 0;
  }
}
 
</style>


