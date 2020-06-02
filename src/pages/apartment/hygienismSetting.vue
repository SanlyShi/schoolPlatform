<template>
  <div id="hygienismSetting">
    <div class="header">
      <label class="header-title pull-left">卫生检查设置</label>
    </div>
    <div>
      <v-table
        title="卫生检查项"
        idField="id"
        :columns="columns"
        :rows="rows"
        :order="true"
        :columnsControl="false"
        :paginationShow="false"
      >
        <div slot="btn-group" class="btn-group pull-right" role="group">
          <button type="button" @click="addNewCheck" class="btn clearBtnBorder add-btn">新增</button>
        </div>
      </v-table>
    </div>
    <div class="appraising" v-if="configList.length">
      <!-- <ul>
        <li v-for="(item,index) in configList" :key='index'>
          <span>{{item.name + "："}}</span><em>{{item.remark}}</em>
          <el-input v-model="item.score"></el-input> 分
        </li>
      </ul> -->
      <div style="text-align: center;margin: 20px 0;">
       <el-button @click="save" type='primary'>保存</el-button>
       <el-button @click="getConfig">取消</el-button>
      </div>
    </div>
    <div class="addCheck">
      <v-modal :show="showAddModal" effect="fade" width="450">
        <div slot="modal-header" class="modal-header">
          <h5 class="modal-title">新增卫生检查项</h5>
        </div>
        <div slot="modal-body" class="modal-body">
          <el-form :model="checkModel" ref="form" :rules='rules' label-width="80px" class="demo-ruleForm">
            <el-form-item label="检查项：" prop='title'>
              <el-input v-model="checkModel.title"></el-input>
            </el-form-item>
            <el-form-item label="分数：" prop='total'>
              <el-input-number v-model="checkModel.total" :min="0" :max="100" label="描述文字"></el-input-number>
            </el-form-item>
            <el-form-item label="详情：" prop='details'>
              <el-input type="textarea" v-model="checkModel.details" :rows="10" resize="none"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div slot="modal-footer" class="modal-footer">
          <button
            type="button"
            class="btn cancel-btn clearBtnBorder"
            @click="cancleAdd"
          >取消</button>
         
            <button type="button" style="margin-right: 0;" class="btn submit-btn clearBtnBorder" @click="addModel">确认</button>
  
        </div>
      </v-modal>
    </div>
  </div>
</template>
<script>
import { sAjax } from '../../assets/utils/utils';
export default {
  data() {
    return {
      // appraisingTotal: 80,
      // unAppraisingTotal: 60,
      configList:[],
      checkModel: {
        title: "",
        total: 10,
        details: ""
      },
      rules: {
        title: [{required: true,message: '请输入检查项', trigger: 'blur' }],
        total: [{required: true,message: '请输入或选择分数', trigger: 'blur' }],
        details: [{required: true,message: '请输入详情', trigger: 'blur' }],
      },
      showAddModal: false,
      rows: [
      ],
      columns: [
        {
          id: "name",
          title: "项目",
          className: "text-left",
          hidden: false
        },
        {
          id: "maxScore",
          title: "分数",
          className: "text-left",
          hidden: false
        },
        {
          id: "remark",
          title: "详情",
          className: "text-left",
          hidden: false
        },
        {
          id: "opt",
          title: "操作",
          className: "text-centet",
          hidden: false,
          formatter: record => {
            return [
              {
                tag: "a",
                text: "查看",
                callback: (record, index) => {
                  this.showAddModal = true
                  this.checkModel = {
                    title: record.name,
                    total: record.maxScore,
                    details: record.remark,
                    id:record.id
                  };
                }
              },
              {
                tag: "a",
                text: "删除",
                callback: (record, index) => {
                  let url = '/api/apartment/sanitaryInspectionConfigItem/' + record.id
                  sAjax({
                    url: url,
                    type: 'post',
                    success: (data) => {
                      if(data.state) {
                        this.$toast('删除成功')
                        this.getList()
                      }else {
                        this.$toast(data.message)
                      }
                    },
                    error: () => {
                      this.$toast('操作失败,请重试')
                    }
                  })
                }
              }
            ];
          }
        }
      ]
    };
  },
  methods: {
    addNewCheck() {
      this.showAddModal = true;
      this.checkModel = {
        title: "",
        total: 10,
        details: ""
      };
    },
    cancleAdd() {
      this.showAddModal = false;
      this.checkModel = {
        title: "",
        total: 10,
        details: ""
      };
      this.$refs.form.clearValidate()
    },
    addModel() {
        this.$refs.form.validate( vali => {
            if(vali) {
              let obj = {
                name: this.checkModel.title,
                maxScore: this.checkModel.total,
                isDelete: 0,
                remark: this.checkModel.details,
                id: this.checkModel.id
              }
              console.log(this.checkModel)
              sAjax({
                url: '/api/apartment/sanitaryInspectionConfigItem/update',
                type: 'post',
                data: obj,
                success: (data) => {
                  if(data.state) {
                    let txt = this.checkModel.id?'修改成功':'新增成功'
                    this.$toast(txt)
                    this.getList()
                    this.cancleAdd()
                  }else {
                   this.$toast(data.message)
                   this.cancleAdd()
                  }
                },
                error: (err) => {
                  this.$toast('操作失败,请重试')
                }
              })
              
            }
        })
    },
    save() {
      if(!this.configList.length) return
      let list = this.configList
      for(let i = 0;i<list.length;i++) {
        if(list[i].score==''||!list[i].score) {
          return this.$toast(`请填写${list[i].name}分数`)
        }
      }
      let url = '/api/apartment/sanitaryInspectionConfig/update'
      let dataList = this.configList
      sAjax({
        url: url,
        type: 'post',
        data: {sanitaryInspectionConfigPOS: dataList},
        success: (data) => {
          if(data.state) {
            this.$toast('保存成功')
          }else {
            this.$toast(data.message)
          }
        }
      })
    },
    getList() {
      let url  = '/api/apartment/sanitaryInspectionConfigItem/list'
      sAjax({
        url: url,
        type: 'get',
        success: (data) => {
          if(data.state) {
            this.rows = data.data
          }else {
            this.$toast('列表获取失败')
          }
        }
      })
    },
    getConfig() {
      let url = '/api/apartment/sanitaryInspectionConfig/list'
      sAjax({
        url: url,
        type: 'get',
        success: (data) => {
          if(data.state) {
            this.configList = data.data
          }else {
            this.configList = []
          }
         }
      })
    }
  },
  created() {
    this.getList()
    this.getConfig()
  },
};
</script>
<style lang="less">
#hygienismSetting {
  height: 100%;
  background: #fff;
  padding: 0 22px;
  -webkit-box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12),
    0 2px 2px 0 rgba(0, 0, 0, 0.12);
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
  position: relative;
  .header {
    height: 60px;
    padding-top: 13px;
    border-bottom: 1px solid #f0f0f0;
    .header-title {
      font-size: 18px;
      color: #333333;
      margin-top: 3px;
    }
  }
  .table-container .row:first-child .table-data {
    min-height: 200px;
  }
  .appraising { 
      ul {
          padding: 0;
          margin-top: 30px;
      }
      li {
          list-style: none;
          margin-bottom: 20px;
          span {
              display: inline-block;
              width: 120px;
              text-align: right;
          }
          em {
              font-style: normal;
          }
          .el-input {
              display: inline-block;
              width: 60px;
              input {
                  text-align: center;
                  height: 30px;
                  line-height: 30px;
              }
          }
      }
  }
  .el-form-item.is-success .el-input__inner,.el-form-item.is-success .el-textarea__inner{
      border-color: #DCDFE6;
  }
}
</style>