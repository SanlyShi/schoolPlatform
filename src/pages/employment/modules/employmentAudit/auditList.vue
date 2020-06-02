<template>
  <div id="auditList">
      <div class="auditList">
        <v-table ref="unitsManagerTable" :order='true' :url="tableDataUrl" :columns="columns" pagesize="15" idField="id">
        <div slot="btn-group" class="pull-right">
          <el-button class="custom-btn" type="primary" @click="dialogVisible = true;curStatus = 'add'">新增限制</el-button>
        </div>
      </v-table>
      </div>
      <div class="addAudit">
        <el-dialog
          :visible.sync="dialogVisible"
          :before-close='dialogClose'
          width="50%"
          >
          <div class="auditForm">
            <el-form v-if="dialogVisible" :model="auditForm" ref="auditForm" :rules="auditFormRule" label-width="200px">
              <el-form-item prop="type" label="活动类型：">
                <el-radio-group v-model="auditForm.type">
                  <el-radio v-for="(item,index) in typeList" :key="index" :label="item.value">{{item.name}}</el-radio>
                  
                </el-radio-group>
              </el-form-item>
              <el-form-item prop="date" label="限制时间段：">
                 <el-date-picker
                    v-model="auditForm.date"
                    type="datetimerange"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
              </el-form-item>
              <el-form-item prop="passNum" label="最多可通过的申请数目：">
                <el-input type="number" v-model="auditForm.passNum"></el-input>
              </el-form-item>
              <el-form-item>

              </el-form-item>
            </el-form>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="cancle">取 消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
          </span>
        </el-dialog>
      </div>
  </div>
</template>
<script>
import { sAjax } from '../../../../assets/utils/utils';
export default {
  data() {
    return {  
      tableDataUrl:'/table-data/employment/applyLimit/getApplyLimitList?timeStamp=' + new Date().getTime(),
      dialogVisible:false,
      typeList: [{value:'DOUBLE_CHOOSE',name:'双选会',id:1},{value:'PREACH_MEETING',name:'宣讲会',id:1},{value:'EXAMINATION',name:'笔面试',id:1},{value:'NETWORK_MEETING',name:'网招会',id:1},{value:'RECRUITMENT',name:'招聘信息',id:1}],
      auditForm: {
        type:'',
        date:'',
        passNum:'',
      },
      auditFormRule: {
        type:[{required: true,message: '请选择类型',trigger:'change'}],
        date:[{required: true,message: '请选择日期',trigger:'change'}],
        passNum:[{required: true,message: '请输入最多可通过的申请数目',trigger:'blur'}],
      },
      curStatus: '',//新增或者编辑状态
    }
  },
  methods: {
    dialogClose(done) {
      this.$refs.auditForm.resetFields()
      this.$refs.auditForm.clearValidate()
      done()
    },
    cancle() {
      this.$refs.auditForm.resetFields()
      this.$refs.auditForm.clearValidate()
      this.dialogVisible = false
    },
    submit() {
      this.$refs.auditForm.validate(vali => {
        if(vali) {
          let url 
          let text = this.curStatus=='add'?'添加成功':'修改成功'
          if(this.curStatus == 'add') {  //新增接口
             delete this.auditForm.id
             url = '/api/employment/applyLimit/addApplyLimit'
          }else {  //编辑更新接口
             url = '/api/employment/applyLimit/updateApplyLimit'
          }
         
          let info = this.auditForm 
          info.beginTime = info.date[0]
          info.endTime = info.date[1]
          sAjax({
            url: url,
            type: 'post',
            data: info,
            success: (data) => {
              if(data.state) {
                
                this.$message.success(text)
                this.tableDataUrl = '/table-data/employment/applyLimit/getApplyLimitList?timeStamp=' + new Date().getTime()
                this.cancle()
              }else {
                this.$message.error(data.message)
              }
            }
          })
        }
      })
    }
  },
  computed: {
     columns: function() {
      return [{
              id: "typeValue",
              title: "活动类型",
              className: "text-left",
              width: 150,
              hidden: false,
              search: {
                type: "input",
                data: {
                  placeholer: "",
                  autoFocus: false
                }
              }
            }, {
              id: "companyName",
              title: "限制时间",
              className: "text-left",
              width: 300,
              hidden: false,
              formatter: (record) => {
                return record.beginTime + '至' +record.endTime
              }
            }, {
              id: "passNum",
              title: "可通过数目",
              className: "text-left",
              width: 150,
              hidden: false,
            }, {
              id: "opts",
              title: "操作",
              width: 200,
              hidden: false,
              formatter: (record) => {
                 return [{
                  tag: "a",
                  text: "编辑",
                  callback: (record, index) => {
                    this.dialogVisible = true
                    this.curStatus = 'edit'
                    this.$nextTick( _ => {
                      this.auditForm = {
                        id: record.id,
                        type:record.type,
                        date:[record.beginTime,record.endTime],
                        passNum:record.passNum,
                      }
                    })
                  }
                },{
                   tag: "a",
                  text: "删除",
                  callback: (record, index) => {
                    this.$confirm('是否继续删除该条限制?', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(() => {
                      let url = '/api/employment/applyLimit/deleteApplyLimit?id='+record.id
                      sAjax({
                        url: url,
                        type: 'post',
                        success: (data) => {
                          if(data.state) {
                            this.$message.success('删除成功')
                            this.tableDataUrl = '/table-data/employment/applyLimit/getApplyLimitList?timeStamp=' + new Date().getTime()
                          }else {
                            this.$message.error(data.message)
                          }
                        }
                      })
                    }).catch(() => {
                      this.$message({
                        type: 'info',
                        message: '已取消删除'
                      });          
                    });
                    
                  }
                }]
              }
              
              }]
    }
  },

}
</script>
<style lang="less" scoped>
#auditList {
    width: 100%;
    height: 100%;
    padding: 0 20px;
    font-size: 14px;
    background: #f6f6f8;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin-top: 20px;
}
</style>
<style lang="less">
.auditForm {
  .el-radio-group {
    &>label {
      margin-right: 50px;
    }
      .el-radio__input.is-checked .el-radio__inner {
        background: #fff;
        &:after {
          width: 10px;
          height: 10px;
          background: #3e92fe;
        }
      }
      .el-radio__inner {
        width: 16px;
        height: 16px;
      }
      .el-radio__input.is-checked+.el-radio__label,.el-radio__label  {
        color: #000;
        font-weight: bold;
      }
    }
    .el-date-editor--datetimerange {
      // border: none!important;

      .el-range-separator {
        width: 50px;
        line-height: 40px;
      }
      .el-range__close-icon {
        display: none!important;
      }
      .el-range-input {
        width: 250px;
        border-radius: 4px;
    }
    }
    .el-form-item__label {
      padding-right: 30px;
    }
    
    .el-input__inner {
      width: 400px;
    }
    
}
.addAudit {
  .el-dialog__footer {
      text-align: center;
      display:inline-block;
      width: 100%;
       .el-button {
         width: 140px;
         height: 44px;
         line-height: 44px;
         padding:0;
       }
      .el-button--default:hover {
        background: transparent;
        color: #666;
      }
    }
}
</style>

