<template>
  <module-container v-if="loading" :loader="true" title="职位信息" :inline="inline"></module-container>
  <module-container title="职位信息" :inline="inline" v-else>
    <el-table :data="form" style="width: 100%">
      <el-table-column type="index" width="40"></el-table-column>
      <el-table-column prop="positionName" label="职位名称" width="260"></el-table-column>
      <el-table-column prop="positionPropertyName" label="职位性质" width="260"></el-table-column>
      <el-table-column prop="opt" label="操作" align="right">
        <template slot-scope="scope">
          <el-button type="text" @click="editPosition(scope.row, scope.$index)" v-if="edit">编辑</el-button>
          <el-button slot="reference" type="text" @click="deletePosition(scope.row, scope.$index)" v-if="edit">删除</el-button>
          <el-button type="text" @click="showPosition(scope.row, scope.$index)" v-if="!edit">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="position-actions" v-if="edit">
      <el-button icon="el-icon-plus" @click="toAddPosition">添加</el-button>
    </div>
    <position :disabledEditPosition="disabledEditPosition" :showDialog="showPositionDialog" :defaultFormInfo="position" :readonly="!edit" @closeDialog="showPositionDialog = false" @positionSubmit="submitPosition" v-if="showPositionDialog"></position>
  
    <el-dialog
      title="选择要新增的职位"
      :visible.sync="showAddDialog"
      width="30%"
      >
      <div class="addContent">
        <el-select style="width: 70%" v-model="positionModel" placeholder="请选择职位模板" @change="selectModel">
          <el-option v-for="(item,index) in positionModelList" :key="index" :label='item.positionName' :value='index'></el-option>
        </el-select>
        <el-button @click="newAdd"  style="height: 40px;" type="primary" icon="el-icon-circle-plus-outline">新建</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddDialog = false;positionModel =''">取 消</el-button>
        <el-button type="primary" @click="setPosition">确 定</el-button>
      </span>
    </el-dialog>
  </module-container>
</template>

<script>
import { MessageBox } from 'element-ui'
import { getPoistionList,getLoginType } from '../api/api.js'
  import FormMixin from '../mixins/formMixin'
  import api from '../api/doubleChooseWill'
  import ModuleContainer from '../components/moduleContainer.vue'
  import Position from './position.vue'
  const PositionPropertyLabel = {
    FULL_TIME: '全职',
    PRACTICE: '实习'
  }

  export default {
    props: {
      inline: Boolean,
      edit: Boolean,
      rules: {
        type: Object,
        default: {}
      }
    },
    mixins: [FormMixin],
    components: {
      ModuleContainer,
      Position
    },
    data() {
      return {
        showPositionDialog: false,
        position: null,
        disabledEditPosition: false,
        loading: false,
        showAddDialog: false,
        positionModel: '',
        positionModelList: [],
        isNewPosition: false,//新增或者编辑
        loginType: '',
      }
    },
    async created() {
      getLoginType().then((data) => {
        if(data.state) {
          this.loginType = data.data.loginType
          if(this.position) {
            if(this.loginType != 'COMPANY') {
              window.sessionStorage.setItem('addPosition_unitId',this.position.companyId)
            }else {
              window.sessionStorage.removeItem('addPosition_unitId')
            }
          }
        }
      })
      this.form.forEach(position =>{
        position.positionPropertyName = PositionPropertyLabel[position.positionProperty]
      })
    },
    methods: {
       selectModel(val) {
        this.positionModel = val
        this.position = this.positionModelList[val]
      },
       newAdd() {
        setTimeout(() => {
          this.showAddDialog = false
          this.showPositionDialog = true
          this.isNewPosition = true
          this.position = null
          this.disabledEditPosition = false
        },0)
      },
      setPosition() {
        if(this.positionModel === '') return this.$message.error('请先选择职位模板或新建职位模板')
        setTimeout(() => {
          this.showAddDialog = false
          this.showPositionDialog = true
        },0)
      },
      toAddPosition() {
        this.isNewPosition = true
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
        //   this.position = null
        //   this.disabledEditPosition = false
        //   this.showPositionDialog = true
        // },200)

      },
      editPosition(position, index) {
        setTimeout(() => {
          this.position = position
          this.isNewPosition = false
          this.disabledEditPosition = false
          this.showPositionDialog = true
        },200)

      },
      showPosition(position, index) {
        this.position = position
        this.disabledEditPosition = true
        this.showPositionDialog = true
      },
      deletePosition(position, index) {
        MessageBox.confirm(`确认删除${position.positionName}?`).then(() => {
          this.position = null
          this.form.splice(index, 1)
        })
      },
      submitPosition(position) {
        this.loading = true
        position.positionPropertyName = PositionPropertyLabel[position.positionProperty]
        if (this.position&&!this.isNewPosition) {
          Object.assign(this.position, position)
        } else {
          this.form.push(position)
          this.position = null
        }
        setTimeout(() => {
          this.loading = false
        }, 100)
      }
    }
  }
</script>

<style lang="less" scoped>
.position-actions {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }
.addContent {
  height: 60px;
  text-align: center;
}
</style>
