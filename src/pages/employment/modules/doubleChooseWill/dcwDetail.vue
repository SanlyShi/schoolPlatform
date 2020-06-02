<template>
  <div>
    <div v-if="page === 'DETAIL'">
      <div class="back" @click="backToList">
        <i class="el-icon-back"></i>返回
      </div>
      <module-loader v-loading="loading" v-if="loading"></module-loader>
      <div class="module-container" v-else>
        <base-info v-model="dcw.baseInfo" :edit="isEditingDcw" :rules="rules"></base-info>
        <stand-info v-model="dcw.standInfo" :rules="rules" inline :edit="isEditingDcw"></stand-info>
        <module-container actions v-if="isEditingDcw">
          <el-button size="large" @click="cancelEditDcw">取消</el-button>
          <el-button type="primary" size="large" @click="updateDcw">保存</el-button>
        </module-container>
        <module-container title="展位">
          <div class="stand-manage" v-if="dcw.standInfo.chooseType === 'UNIT'">
            <stand-picker :dcw="dcw" v-model="dcw.standInfo.stands" @to-reserve-dcw="toReserveDcw" can-manage published></stand-picker>
          </div>
          <div class="stand-units">
            <div class="actions">
              <el-button type="primary" size="small" @click="toReserveDcw" v-if="dcw.standInfo.chooseType === 'MANAGER'">预留展位</el-button>
              <el-button type="primary" size="small" @click="toArrangeStand" v-if="dcw.standInfo.chooseType === 'MANAGER'">排展管理</el-button>
              <el-button type="primary" size="small" @click="toExportStand">导出名单</el-button>
            </div>
            <el-table :data="dcw.standUnits" style="width: 100%">
              <el-table-column prop="stand.name" label="展位号" width="80"></el-table-column>
              <el-table-column prop="name" label="用人单位" width="260"></el-table-column>
              <el-table-column prop="typeName" label="单位性质" width="120"></el-table-column>
              <el-table-column prop="positionsCount" label="职位总数" width="120"></el-table-column>
              <el-table-column prop="signInStatus" label="签到状态" width="80">
                <template slot-scope="scope">
                  <span>{{scope.row.signInStatus?'已签到':'未签到'}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="opt" label="操作" align="right">
                <template slot-scope="scope">
                  <el-button type="text" @click="showStandUnit(scope.row)">查看</el-button>
                  <el-button type="text" @click="deleteStandUnit(scope.row, scope.$index)" v-if="true">取消</el-button>
                  <el-button type="text" @click="sign(scope.row.id, scope.row.signInStatus)">{{scope.row.signInStatus?'取消签到':'签到'}}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </module-container>
        <div class="operations-container-action">
          <el-button type="text" @click="showOpLogs = !showOpLogs">操作日志</el-button>
          <el-button type="text" icon="el-icon-edit-outline" @click="toEditDcw" v-if="!isEditingDcw">编辑</el-button>
          <el-button type="text" @click="cancelEditDcw" v-else>取消编辑</el-button>
        </div>
        <div class="operations-container" :class="{ show: showOpLogs }">
          <oplog :dataUrl="opLogDataUrl" v-if="showOpLogs"></oplog>
        </div>
      </div>

      <!-- 导出展位 -->
      <el-dialog
        title="选择导出的字段"
        :visible.sync="exportStandDialog.show"
        width="25%"
        :show-close="false"
        center>
        <el-checkbox
          :indeterminate="exportStandDialog.selected.length && exportStandDialog.selected.length < exportStandDialog.fields.length"
          v-model="allExportStandFieldsSelected"
          @change="selectAllExportStandFields">
          全选
        </el-checkbox>
        <el-checkbox-group v-model="exportStandDialog.selected">
          <div v-for="field in exportStandDialog.fields"  :key="field.value">
            <el-checkbox :label="field.value">{{field.text}}</el-checkbox>
          </div>
        </el-checkbox-group>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="exportStand">导 出</el-button>
        </span>
      </el-dialog>

      <!-- 排展 -->
      <el-dialog
        title="排展管理"
        :visible.sync="arrangeStandDialog.show"
        width="80%">
        <v-import v-bind="arrangeStandDialog.importParams" @backParentPage="arrangeStandDialog.show = false" v-if="arrangeStandDialog.show"></v-import>
        <span slot="footer" class="dialog-footer">
          <el-button @click="arrangeStandDialog.show = false">关闭</el-button>
        </span>
      </el-dialog>
    </div>
    <div v-if="page === 'STAND_UNIT'">
      <stand-unit :dcw="dcw" :standUnitId="standUnitId" @back-to-detail="backToDetail" is-manager></stand-unit>
    </div>
  </div>
</template>

<script>
  import { MessageBox } from 'element-ui'

  import BaseInfo from './components/baseInfo.vue'
  import StandInfo from './components/standInfo.vue'
  import StandPicker from './components/standPicker.vue'
  import ModuleContainer from '../.././components/moduleContainer.vue'
  import ModuleLoader from '../.././components/moduleLoader.vue'
  import StandUnit from './standUnit.vue'
  import Oplog from '../../components/oplog.vue'

  import api from '../../api/doubleChooseWill'
  import { Dcw } from './types'

  export default {
    props: ['id'],
    components: {
      BaseInfo,
      StandInfo,
      StandPicker,
      ModuleContainer,
      ModuleLoader,
      StandUnit,
      Oplog
    },
    data() {
      return {
        dcw: null,
        page: 'DETAIL',
        loading: true,
        showOpLogs: false,
        standUnitId: null,
        exportStandDialog: {
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
            text: '联系人信息'
          }, {
            value: '4',
            text: '单位邮箱'
          }, {
            value: '5',
            text: '单位规模'
          }, {
            value: '6',
            text: '展位信息'
          }, {
            value: '7',
            text: '招聘信息'
          }],
          selected: [],
        },
        arrangeStandDialog: {
          show: false,
          importParams: {
            downloadTemplateUrl: `/employment/manage/doubleChoose/getBoothTemplate?id=${this.id}`,
            downloadErrorTemplateUrl: '/iSignIn/projects/excludeList/excels/error',
            checkTemplateUrl: `/employment/manage/doubleChoose/checkExcel?id=${this.id}`,
            importBtnType: [{
              name: '增量导入',
              url: '/employment/manage/doubleChoose/addByExcel',
              method: 'post',
              isShowBtn: true,
              success: () => {
                this.arrangeStandDialog.show = false
                this.refreshStandUnits()
              }
            }],
            templateName: '排展管理模板下载',
            showBackBtn: false
          }
        },
        isEditingDcw: false,
        dcwTemp: null,
        rules: {
          chooseType: {
            disabled: true
          }
        }
      }
    },
    computed: {
      opLogDataUrl() {
        return `api/employment/manage/doubleChoose/getOperationDetailList?id=${this.id}`
      },
      standUnits() {
        return [{
          standName: '1',
          unitName: 'tenxun',

        }]
      },
      allExportStandFieldsSelected() {
        return this.exportStandDialog.fields.length === this.exportStandDialog.selected.length
      }
    },
    async created() {
      await this.initDcw()
      this.loading = false
    },
    methods: {
      async initDcw() {
        const result = await api.dcw.get(this.id)
        if (result.state) {
          this.dcw = Dcw.fromApi(result.data)
          console.log(this.dcw.standUnits)
        } else {
          this.$toast(result.message)
        }
      },
      async toEditDcw() {
        this.dcwTemp = JSON.parse(JSON.stringify(this.dcw))
        this.isEditingDcw = true
      },
      async updateDcw() {
        const { state, message } = await api.dcw.update(this.dcw)
        if (state) {
          this.$toast('保存成功')
          this.dcwTemp = null
          this.isEditingDcw = false
        } else {
          this.$toast(message)
        }

      },
      async cancelEditDcw() {
        // 恢复之前的数据
        Object.assign(this.dcw.baseInfo, this.dcwTemp.baseInfo)
        this.dcw.standInfo.siteMap = this.dcwTemp.standInfo.siteMap
        this.dcw.standInfo.canSelectMultiStands = this.dcwTemp.standInfo.canSelectMultiStands
        this.dcw.standInfo.limitStandsSelected = this.dcwTemp.standInfo.limitStandsSelected
        this.dcw.standInfo.limitStandsSelected = this.dcwTemp.standInfo.limitStandsSelected
        this.dcw.standInfo.chooseType = this.dcwTemp.standInfo.chooseType

        this.isEditingDcw = false
      },
      toExportStand() {
        this.exportStandDialog.show = true
        this.selectAllExportStandFields()
      },
      toArrangeStand() {
        this.arrangeStandDialog.show = true
      },
      selectAllExportStandFields(val) {
        this.exportStandDialog.selected = val ? this.exportStandDialog.fields.map(field => field.value) : []
      },
      async exportStand() {
        window.open(`/downloads/employment/manage/doubleChoose/getBoothExcel?id=${this.dcw.id}&conditions=${this.exportStandDialog.selected.sort((a, b) => parseInt(a) - parseInt(b)).join(',')}`)
        this.exportStandDialog.show = false
      },
      showStandUnit(apiUnitApplyInfo) {
        this.standUnitId = apiUnitApplyInfo.id
        this.page = 'STAND_UNIT'
      },
      async refreshStandUnits() {
        const { state, message, data } = await api.dcw.get(this.id)
        if (state) {
          this.dcw = Dcw.fromApi(data)
        } else {
          this.$toast(message)
        }
      },
      async deleteStandUnit(apiUnitApplyInfo, index) {
        MessageBox.confirm(`确认要取消${apiUnitApplyInfo.name}的双选会吗？下架后该企业将无法展示在该双选会的列表上`).then(async () => {
          const { state, message } = await api.stand.deleteStandUnit(apiUnitApplyInfo.stand && apiUnitApplyInfo.stand.id, apiUnitApplyInfo.id)
          if (state) {
            this.$toast('取消展位成功')
            this.loading = true
            await this.initDcw()
            this.loading = false
          } else {
            this.$toast(message)
          }
        })
      },
      async sign(id,status) {
        console.log(status)
        let text = status?'取消签到':'签到'
        MessageBox.confirm(`是否${text}`).then(async () => {
          const { state, message } = await api.stand.setSign(id,!status)
          if(state) {
            this.loading = true
            await this.initDcw()
            this.loading = false
          }else {
            this.$toast(message)
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消' + text
          }); 
        })
      },
      toReserveDcw() {
        this.standUnitId = null
        this.page = 'STAND_UNIT'
      },
      async backToDetail({ refresh }) {
        this.page = 'DETAIL'
        if (refresh) {
          this.loading = true
          await this.initDcw()
          this.loading = false
        }
      },
      backToList() {
        this.$emit('back-to-list');
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

.stand-units {
  padding: 0 24px 24px;
}
</style>

