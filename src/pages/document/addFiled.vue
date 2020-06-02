<template>
    <div id="addFiled">
        <div class="list">
            <v-table title="自定义字段" :url="url" pagesize="10" :order="true" idField="id" :columns="columns" >
                <div slot="btn-group" class="btn-group pull-right" role="group">
                    <el-button type="primary" class="btn blue" @click="addFiled">新增字段</el-button>
                    <el-button type="primary" class="btn blue" @click="addExtend">新增拓展表</el-button>
                <!-- <button type="button" class="btn blue" @click="quickAddRecord">批量新增</button> -->
                </div>
            </v-table>
        </div>
        <v-modal :show="showFiledModal" effect="fade" width="446">
             <div slot="modal-header" class="modal-header">
                <h5 class="modal-title">新增字段</h5>
            </div>
            <div slot="modal-body" class="modal-body">
                <el-form v-if="showFiledModal" :model="filedModel" :rules="filedRules" label-width="120px" ref='filedForm'>
                    <el-form-item label="所属拓展表：" prop="typeId">
                        <el-select v-model="filedModel.typeId" filterable >
                             <el-option
                                v-for="item in extendList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="字段名称：" prop='title'>
                        <el-input v-model="filedModel.title"></el-input>
                    </el-form-item>
                    <el-form-item label="英文名称：" prop='columnName'>
                        <el-input v-model="filedModel.columnName"></el-input>
                    </el-form-item>
                    <el-form-item label="字段类型：" prop="dataType">
                        <el-select v-model="filedModel.dataType" filterable>
                             <el-option
                                v-for="item in filedTypeList"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="filedModel.dataType=='Dict'" label="字典名称" prop='columnOptionsBytext'>
                        <el-select v-model="filedModel.columnOptionsBytext" filterable >
                            <el-option
                                v-for="item in dictTypeList"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="filedModel.dataType=='Date'" label="字段限制" prop='columnOptionsBySelect'>
                        <el-select v-model="filedModel.columnOptionsBySelect" filterable >
                            <el-option
                                v-for="item in dataTypeList"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
             <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn cancel-btn clearBtnBorder" @click="cancel('filedForm','showFiledModal')">取消</button>
                <button type="button" class="btn submit-btn clearBtnBorder" @click="submit('filedForm','showFiledModal')">保存</button>
            </div>
        </v-modal>
        <v-modal :show="showExtendModal" effect="fade" width="446">
            <div slot="modal-header" class="modal-header">
                <h5 class="modal-title">新增拓展表</h5>
            </div>
            <div slot="modal-body" class="modal-body">
                <el-form :model="extendModel" v-if="showExtendModal" ref="extendForm" :rules='extendRules' label-width="140px">
                    <el-form-item  prop="type" label="所属对象：">
                        <el-select v-model="extendModel.type" filterable>
                            <el-option
                                v-for="item in columnObject"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="title" label="表名称：">
                        <el-input v-model="extendModel.title"></el-input>
                    </el-form-item>
                    <el-form-item prop="name" label="英文简称：">
                        <el-input v-model="extendModel.name"></el-input>
                    </el-form-item>
                    <el-form-item prop="multiple" label="是否有多条数据：">
                        <el-radio-group v-model="extendModel.multiple">
                            <el-radio label="true">是</el-radio>
                            <el-radio label="false">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </div>
             <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn cancel-btn clearBtnBorder" @click="cancel('extendForm','showExtendModal')">取消</button>
                <button type="button" class="btn submit-btn clearBtnBorder" @click="submit('extendForm','showExtendModal')">保存</button>
            </div>
        </v-modal>
    </div>
</template>
<script>
import { sAjax } from '../../assets/utils/utils'
export default {
    data() {
        return {
            url: '/table-data/data/column/columnTypeTableList',
            columns: [],
            showFiledModal: false,
            showExtendModal: false,
            filedModel: {
                columnName: '',//字段英文名
                columnOptions: '',//数据类型对应的注释，当数据类型是时间跟字典的时候，必传
                dataType: '',//数据类型，来源下拉框值
                title: '',//字段名称
                typeId: '',//所属拓展表id，来源下拉框值,
                columnOptionsBytext:'',
                columnOptionsBySelect:'',
            },
            filedRules: {
                typeId: [{required: true,message: '请选择所属拓展表：', trigger: 'change' }],
                title: [{required: true,message: '请输入字段名称',trigger: 'blur'}],
                columnName: [{required: true,message: '请输入英文名称',trigger: 'blur'}],
                dataType: [{required: true,message: '请选择字段类型：', trigger: 'change' }],
                columnOptionsBytext: [{required: true,message: '请选择字典名称',trigger: 'change'}],
                columnOptionsBySelect: [{required: true,message: '请选择字段限制',trigger: 'change'}]
            },
            extendModel: {
                multiple: '',
                name: '',//表英文名,
                title: '',//表名称
                type: '',//所属对象,来源下拉框值           
            },
            extendRules: {
                multiple: [{required: true,message: '请选择是否有多条数据：', trigger: 'change' }],
                name: [{required: true,message: '请输入英文简称',trigger: 'blur'}],
                title: [{required: true,message: '请输入表名称',trigger: 'blur'}],
                type: [{required: true,message: '请选择所属：', trigger: 'change' }],
               
            },
            extendList: [],//拓展表下拉框
            filedTypeList: [],
            dataTypeList: [],
            dictTypeList: [],
            columnObject: [],

        }
    },
    methods: {
        addFiled() {
            this.showFiledModal = true
        },
        addExtend() {
            this.showExtendModal = true
        },
        cancel(formName = 'filedForm',modalName ='showFiledModal') {
            this.$nextTick(() => {
                if(formName == 'filedForm') {
                     this.filedModel = {
                        columnName: '',//字段英文名
                        columnOptions: '',//数据类型对应的注释，当数据类型是时间跟字典的时候，必传
                        dataType: '',//数据类型，来源下拉框值
                        title: '',//字段名称
                        typeId: '',//所属拓展表id，来源下拉框值,
                        columnOptionsBytext:'',
                        columnOptionsBySelect:'',
                    }
                }else {
                    this.extendModel = {
                        multiple: '',
                        name: '',//表英文名,
                        title: '',//表名称
                        type: '',//所属对象,来源下拉框值           
                    }
                }
               this[modalName] = false
            })
            
            
        },
        submit(formName,modalName) {
            this.$refs[formName].validate((valid) => {
                if(valid) {
                    let url 
                    if(formName == 'filedForm') { //新增字段
                        let Vo = this.filedModel 
                        url = '/api/data/column/field'
                        if(Vo.dataType == 'Dict') {
                            Vo.columnOptions = Vo.columnOptionsBytext
                        }
                        if(Vo.dataType == 'Date') {
                            Vo.columnOptions = Vo.columnOptionsBySelect
                        }
                        sAjax({
                            url: url,
                            type: 'post',
                            data: Vo,
                            success: (data) => {
                                if(data.state) {
                                  this.$toast('添加成功')
                                  this.cancel()
                                  this.url = '/table-data/data/column/columnTypeTableList?timesamp=' + new Date().getTime()
                                }else {
                                  this.$toast(data.message)
                                }
                                console.log(data.data)
                            }  
                        })
                    }else {  //新增拓展表
                        let url = '/api/data/column/columnType'
                        let definitionType  = this.extendModel
                        sAjax({
                            url: url,
                            type: 'post',
                            data: definitionType,
                            success: (data) => {
                                if(data.state) {
                                  this.$toast('添加成功')
                                  this.cancel('extendForm','showExtendModal')
                                   this.url = '/table-data/data/column/columnTypeTableList?timesamp=' + new Date().getTime()
                                }else {
                                  this.$toast(data.message)
                                }
                            }  
                        })

                    }
                }
            })
        },
        getColumnOptions() {
            let url = '/api/data/column/columnTypeOptions'
            sAjax({
              url: url,
              type: 'get',
              success: (data) => {
                  if(data.state) {
                      this.extendList = data.data.columnTable
                      this.filedTypeList = data.data.columnDataType
                      this.dataTypeList = data.data.dateType
                      this.dictTypeList = data.data.dictType
                      this.columnObject = data.data.columnObject
                  }
                  console.log(data.data)
              }  
            })
        }
    },
    created() {
        this.getColumnOptions()
        this.columns = [
            {
            id: "title",
            title: "字段名称",
            width: 200,
            className: "text-left",
            hidden: false
          },{
            id: "columnName",
            title: "英文名称",
            width: 100,
            className: "text-left",
            hidden: false
          },{
            id: "type",
            title: "字段类型",
            width: 100,
            className: "text-left",
            hidden: false,
            formatter: (record) => {
                for(let i = 0;i<this.filedTypeList.length;i++) {
                    if(this.filedTypeList[i].value == record.dataType) {
                        return this.filedTypeList[i].name
                    }
                }
                
            }
          },
          {
            id: "typeTitle",
            title: "所属扩展表",
            width: 150,
            className: "text-left",
            hidden: false
          },
          {
            id: "Source",
            title: "所属对象",
            width: 150,
            className: "text-left",
            hidden: false,
            formatter: (record) => {
                for(let i = 0;i<this.columnObject.length;i++) {
                    if(this.columnObject[i].value == record.typeSource) {
                        return this.columnObject[i].name
                    }
                }
                
            }
          },
        ]
    }
}
</script>
<style lang="less">
#addFiled {
    .modal {
        overflow-y: hidden;
    }
    .modal-dialog {
        margin-top: 70px;
    }
    .el-form-item.is-success .el-input__inner, .el-form-item.is-success .el-input__inner:focus, .el-form-item.is-success .el-textarea__inner, .el-form-item.is-success .el-textarea__inner:focus {
        border-color: #DCDFE6;
    }
}
    
</style>