/**职位编辑 */
<template>
  <div id="positionEdit">
    <div class="title clearfix">
      <h1>
        <span>
          <em></em>
          <i>职位信息</i>
        </span>
      </h1>
    </div>
    <div class="table">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column width="100" type="index" label="#">
        </el-table-column>
        <el-table-column prop="positionName" label="职位名称"></el-table-column>
        <el-table-column prop="positionProperty" label="职位性质">
          <template slot-scope="scope">
            <span>{{scope.row.positionProperty=='PRACTICE'?'实习':'全职'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
         >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="edit(scope.row,scope.$index)">编辑</el-button>
            <el-button type="text" size="small" @click="Delete(scope.row,scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="add-position-warp">
        <el-button @click="addPosition" class="add-position" icon="el-icon-plus" plain>添加</el-button>
      </div>
    </div>
    <el-dialog
      title="选择要新增的职位"
      :visible.sync="showAddDialog"
      width="30%"
      >
      <div class="addContent">
        <el-select style="width: 70%;" v-model="positionModel" placeholder="请选择职位模板" @change="selectModel">
          <el-option v-for="(item,index) in positionModelList" :key="index" :label='item.positionName' :value='index'></el-option>
        </el-select>
        <el-button @click="newAdd"  style="height: 40px;" type="primary" icon="el-icon-circle-plus-outline">新建</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddDialog = false;positionModel =''">取 消</el-button>
        <el-button type="primary" @click="setPosition">确 定</el-button>
      </span>
    </el-dialog>
    <position v-if="showDialog" :isEditPosition='isEditPosition' :showDialog='showDialog'  @closeDialog='closeDialog' :defaultFormInfo='defaultFormInfo'  @positionSubmit='positionSubmit'></position>
  </div>
</template>
<script>
import position from '../../../components/position'
import {deleteRecruitment, getPoistionList,getLoginType} from '../../../api/api'
  export default { 
    components: {
      position,
    },
    props:['defaultInfo'],//父组件给的宣讲会信息
    data() {
      return {
        showDialog:false,
        tableData:[],
        defaultFormInfo:null,//当前编辑的职位对象
        isEditPosition: true,//通知组件当前是编辑职位状态还是新增职位状态，默认是新增状态(在删除职位需要用到)
        //canEditPosition: true,//通知职位组件是否能编辑职业信息 默认是
        // curPositionRow:{},//当前编辑的职位对象
        curPositionIndex:'',//当前编辑的职位索引
        disabledEditPosition: true,//是否允许职位组件编辑 默认true 无法编辑
        showAddDialog: false,
        positionModelList: [],
        positionModel: '',
        loginType:"",
      }
    },
    methods: {
      setPosition() {
        if(this.positionModel === '') return this.$message.error('请先选择职位模板或新建职位模板')
        setTimeout(() => {
          this.showAddDialog = false
          this.showDialog = true
          this.isEditPosition = true
          this.curPositionIndex = -1
          this.isEditPosition = true
        },0)
      },
      newAdd() {
        setTimeout(() => {
          this.showAddDialog = false
          this.showDialog = true
          this.defaultFormInfo = null
          this.isEditPosition = true
          this.disabledEditPosition = false
        },0)
      },
      selectModel(val) {
        this.positionModel = val
        this.defaultFormInfo = this.positionModelList[val]
      },
      addPosition() {  //新增职位
       if(this.loginType != 'COMPANY') {
         let unitId = window.sessionStorage.getItem('addPosition_unitId')
         if(!unitId){
            this.positionModelList = []
            this.showAddDialog = true
            return
         }
         getPoistionList(unitId).then(data => {
           if(data.state) {
             this.positionModelList = data.data
             this.showAddDialog = true
           }
         })
       }else {
         getPoistionList().then(data => {
           if(data.state) {
             this.positionModelList = data.data
             this.showAddDialog = true
           }
         })
       }
        
      
        // setTimeout(() => {
        //   this.showDialog = true
        //   this.defaultFormInfo = null
        //   this.isEditPosition = true
        //   this.disabledEditPosition = false
        // },0)
      },
      closeDialog() {
        this.showDialog = false
      },
      Delete(row,index) {
        if(!row.id) {  //新增的职位，直接删除
          this.tableData.splice(index,1)
        }else {
          deleteRecruitment(row.id).then(data => {
            if(data.state) {
              this.$message.success('删除成功')
              this.tableData.splice(index,1)
            }else {
              this.$message.error(data.message)
            }
          })
        }
      },
      edit(row,index) { //职位编辑
        // ScrollTop(0,50)
        setTimeout(() => {
          this.showDialog = true
          this.isEditPosition = false,//
          this.defaultFormInfo = row
          this.curPositionIndex = index
        },0)
        // if(this.)
      },
      positionSubmit(info) {  //职位组件提交事件
        setTimeout(() => {
          if(!this.isEditPosition || (this.defaultFormInfo&&this.defaultFormInfo.id)) {  //新增的职位,先删除在提交
            if(this.curPositionIndex>=0) {
              this.tableData.splice(this.curPositionIndex,1)
            }
          }
          console.log(this.defaultFormInfo) 
          this.tableData.push(info)
        }, 20);
        
      }
    },
    created() {
      getLoginType().then((data) => {
        if(data.state) {
          this.loginType = data.data.loginType
          if(this.defaultInfo) {
            if(this.loginType != 'COMPANY') {
              window.sessionStorage.setItem('addPosition_unitId',this.defaultInfo.companyId)
            }else {
              window.sessionStorage.removeItem('addPosition_unitId')
            }
            if(this.defaultInfo.recruitmentPositionTableDTOList.length) {
              this.tableData = this.defaultInfo.recruitmentPositionTableDTOList
            }
          }else {
            window.sessionStorage.removeItem('addPosition_unitId')
          }
        }
      })
      
    }
  }
</script>
<style lang="less" scoped>
#positionEdit {
  padding: 30px;
  border-top: 1px solid #e7e7e7;
  .table {
    margin-top: 20px;
  }
}
</style>
<style lang="less">
#positionEdit {
  .el-table td, .el-table th.is-leaf  {
    tex-align: center;
  }
  .add-position-warp {
    text-align: center;
    margin-top: 25px;
    .add-position {
      width:30%;
    }
  }
  
}
.addContent {
  height: 60px;
  text-align: center;
}
</style>

