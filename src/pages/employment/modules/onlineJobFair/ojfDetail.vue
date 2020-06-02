<template>
  <div>
    <div class="back" @click="backToList">
      <i class="el-icon-back"></i>返回
    </div>
    <div class="module-container">
      <base-info ref="baseInfo" v-model="ojf" :edit="isEditingOjf"></base-info>
      <module-container actions v-if="isEditingOjf">
        <el-button size="large" @click="cancelEditOjf">取消</el-button>
        <el-button type="primary" size="large" @click="updateOjf">保存</el-button>
      </module-container>
      <module-container title="参会单位" :loader="loading" loader-text="正在加载参会单位">
        <div class="actions">
          <el-button type="primary" size="small" @click="toReserve">预留展位</el-button>
          <el-button type="primary" size="small" icon="el-icon-download" @click="toExportOjfUnit">导出</el-button>
        </div>
        <el-table :data="ojf.units" style="width: 100%">
          <el-table-column type="index" width="40"></el-table-column>
          <el-table-column prop="name" label="企业名称" width="260"></el-table-column>
          <el-table-column prop="positionCount" label="职位数量" width="260"></el-table-column>
          <el-table-column prop="opt" label="操作" align="right">
            <template slot-scope="scope">
              <el-button type="text" @click="showOjfUnitApply(scope.row, scope.$index)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </module-container>
      <div class="operations-container-action">
        <!-- <el-button type="text" @click="showOpLogs = !showOpLogs">操作日志</el-button> -->
        <el-button type="text" icon="el-icon-edit-outline" @click="toEditOjf" v-if="!isEditingOjf">编辑</el-button>
        <el-button type="text" @click="cancelEditOjf" v-else>取消编辑</el-button>
      </div>
      <div class="operations-container" :class="{ show: showOpLogs }">
        <!-- <oplog :dataUrl="opLogDataUrl"></oplog> -->
      </div>
    </div>

    <el-dialog
      title="选择导出的字段"
      :visible.sync="exportOjfUnitDialog.show"
      width="25%"
      :show-close="false"
      center>
      <el-checkbox
        :indeterminate="exportOjfUnitDialog.selected.length && exportOjfUnitDialog.selected.length < exportOjfUnitDialog.fields.length"
        v-model="allExportOjfUnitFieldsSelected"
        @change="selectAllExportOjfUnitFields">
        全选
      </el-checkbox>
      <el-checkbox-group v-model="exportOjfUnitDialog.selected">
        <div v-for="field in exportOjfUnitDialog.fields"  :key="field.value">
          <el-checkbox :label="field.value">{{field.text}}</el-checkbox>
        </div>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="exportOjfUnitDialog.show = false">取 消</el-button>
        <el-button type="primary" @click="exportOjfUnit">导 出</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { MessageBox } from 'element-ui'
import { Ojf } from './types'
import ModuleContainer from '../../components/moduleContainer.vue'
import api from '../../api/onlineJobFair'
import { ScrollTop } from '../../api/api'
import BaseInfo from './components/baseInfo.vue'
import { setTimeout } from 'timers';

export default {
  props: {
    ojf: Object
  },
  components: {
    ModuleContainer,
    BaseInfo
  },
  data() {
    return {
      hasUpdated: false,
      loading: false,
      isEditingOjf: false,
      ojfTemp: null,
      showOpLogs: false,
      opLogDataUrl: ``,
      exportOjfUnitDialog: {
        show: false,
        selectAll: false,
        fields: [{
          value: '1',
          text: '单位名称'
        }, {
          value: '2',
          text: '单位性质'
        }, {
          value: '3',
          text: '单位联系人'
        }, {
          value: '4',
          text: '单位规模'
        }, {
          value: '5',
          text: '电话'
        }, {
          value: '6',
          text: '邮箱'
        }, {
          value: '7',
          text: '单位地址'
        }, {
          value: '8',
          text: '职位数量'
        }, {
          value: '9',
          text: '职位名称'
        }, {
          value: '10',
          text: '薪资范围'
        }, {
          value: '11',
          text: '招聘人数'
        }, {
          value: '12',
          text: '所属类别'
        }, {
          value: '13',
          text: '专业要求'
        }, {
          value: '14',
          text: '学历要求'
        }, {
          value: '15',
          text: '工作地点'
        }, {
          value: '16',
          text: '岗位职责'
        }, {
          value: '17',
          text: '岗位要求'
        }],
        selected: [],
      },
    }
  },
  computed: {
    allExportOjfUnitFieldsSelected() {
      return this.exportOjfUnitDialog.fields.length === this.exportOjfUnitDialog.selected.length
    }
  },
  async created() {
    const { state, message, data } = await api.get(this.ojf.id)
    if (state) {
      this.ojf.units = Ojf.fromApi(data).units
    } else {
      this.$toast(message)
    }
  },
  methods: {
    async updateOjf() {
      try {
        await this.$refs.baseInfo.validate()
      } catch (err) {
        ScrollTop(0, 200)
        return
      }
      const { state, message, data } = await api.update(this.ojf)
      if (state) {
        this.$toast('保存更改成功')
        this.hasUpdated = true
        this.isEditingOjf = false
        this.ojfTemp = null
      } else {
        this.$toast(message)
      }
    },
    toReserve() {
      this.$emit('to-reserve', { ojf: this.ojf })
    },
    toExportOjfUnit() {
      this.exportOjfUnitDialog.show = true
      this.selectAllExportOjfUnitFields()
    },
    selectAllExportOjfUnitFields(val) {
      this.exportOjfUnitDialog.selected = val ? this.exportOjfUnitDialog.fields.map(field => field.value) : []
    },
    exportOjfUnit() {
      window.open(`/downloads/employment/manage/networkMeeting/excelOut?id=${this.ojf.id}&fields=${this.exportOjfUnitDialog.selected.sort((a, b) => parseInt(a) - parseInt(b)).join(',')}`)
      this.exportOjfUnitDialog.show = false
    },
    showOjfUnitApply(ojfUnitApply, index) {
      this.$emit('to-apply-detail', { ojfUnitApplyId: ojfUnitApply.id, ojf: this.ojf, edit: true, hideStatus: true })
    },
    toEditOjf() {
      this.ojfTemp = Object.assign({}, this.ojf)
      this.isEditingOjf = true
    },
    cancelEditOjf() {
      Object.assign(this.ojf, this.ojfTemp)
      this.isEditingOjf = false
    },
    backToList() {
      let options = {}
      if (this.hasUpdated) {
        options = { refresh: true, tableName: 'manageList' }
      }
      this.$emit('back-to-list', options)
    }
  }
}
</script>

<style lang="less" scoped>
.actions {
  display: flex;
  justify-content: flex-end;
  justify-items: center;
}
</style>

