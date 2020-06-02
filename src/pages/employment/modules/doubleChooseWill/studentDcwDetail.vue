<template>
  <div id="studentDcwDetails">
    <div v-if="page === 'DETAIL'">
      <div class="module-container">
        <el-button
          style="color:#666;"
          type="text"
          icon="el-icon-back"
          @click="back"
        >返回</el-button>
      </div>
      <div class="page-title">
        {{ `双选会名称：${dcwName || props.name || dcw.baseInfo.name}` }}
      </div>
      <module-loader v-loading="loading" v-if="loading"></module-loader>
      <div class="module-container" v-else>
        <base-info v-model="dcw.baseInfo" :rules="baseInfoRules"></base-info>
        <stand-info v-model="dcw.standInfo" :rules="standInfoRules"></stand-info>
        <module-container inline>
          <div class="stand-units">
            <el-table :data="dcw.standUnits" style="width: 100%">
              <el-table-column prop="stand.name" label="展位号" width="80"></el-table-column>
              <el-table-column prop="name" label="用人单位" width="260"></el-table-column>
              <el-table-column prop="typeName" label="单位性质" width="120"></el-table-column>
              <el-table-column prop="positionsCount" label="职位总数" width="120"></el-table-column>
              <el-table-column prop="opt" label="操作" align="right">
                <template slot-scope="scope">
                  <el-button type="text" @click="showStandUnit(scope.row)">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </module-container>
        <module-container actions v-if="dcw && !dcw.applied && dcw.isApplying() && !isMyUnitDisabled">
          <el-button type="primary" size="large" @click="toApply">申请</el-button>
        </module-container>
      </div>
    </div>
    <div v-else-if="page === 'STAND_UNIT'">
      <stand-unit :dcw="dcw" :standUnitId="standUnitId" @back-to-detail="page = 'DETAIL'" only-look></stand-unit>
    </div>
    <div v-else-if="page === 'APPLY'">
      <unit-apply-dcw :id="dcw.id" :dcw-name="dcw.baseInfo.name" @back-to-list="page = 'DETAIL'" @to-my-dcw="toMyDcw"></unit-apply-dcw>
    </div>
  </div>

</template>

<script>
import BaseInfo from "./components/baseInfo.vue";
import StandInfo from "./components/standInfo.vue";
import StandUnit from "./standUnit.vue";
import UnitApplyDcw from './unitApplyDcw.vue';
import ModuleContainer from "../.././components/moduleContainer.vue";
import ModuleLoader from "../.././components/moduleLoader.vue";
import api from "../../api/doubleChooseWill";
import { getMyUnit, checkUnitDisabled } from '../../api/api'
import { Dcw } from "./types";
export default {
  props: {
    id: Number,
    dcwName: String,
    props: Object,
    fromList: Boolean
  },
  components: {
    ModuleContainer,
    ModuleLoader,
    BaseInfo,
    StandInfo,
    StandUnit,
    UnitApplyDcw
  },
  data() {
    return {
      navList: [{route: '/recruitmentInfoApply',title: "招聘职位"},{route:'/techinList2Index',title: '宣讲会'},{route: '/student/doubleChooseWill/list',title:'双选会'},{route: '/student/onlineJobFair/list',title: '网招会'}],
      curRoute:'/student/doubleChooseWill/list',
      loading: true,
      dcw: null,
      standUnitId: null,
      page: "DETAIL",
      baseInfoRules: {
        name: {
          hidden: true
        },
        applyTime: {
          hidden: true
        }
      },
      standInfoRules: {
        chooseType: {
          hidden: true
        }
      },
      myUnit: null,
      isMyUnitDisabled: true,
    };
  },
  computed: {},
  async created() {
    await this.initDcw();
    this.initMyUnit()
    this.initMyUnitDisabled()
    this.initApplyStatus()
    this.loading = false;
  },
  methods: {
    addBread(item) {
      this.$emit('toSomePage',{path: item.route})
    },
    async initDcw() {
      const { state, message, data } = await api.dcw.getOpenDcw(
        this.id || this.props.id
      );
      if (state) {
        this.dcw = Dcw.fromApi(data);
      } else {
        this.$toast(message);
      }
    },
    async initMyUnit() {
      const { state, message, data, code } = await getMyUnit()
      if (state) {
        this.myUnit = data
      } else {
        if (code !== '41004') {
          this.$toast(message)
        }
      }
    },
    async initMyUnitDisabled() {
      const { state, message, data } = await checkUnitDisabled()
      if (state) {
        this.isMyUnitDisabled = !!data
      } else {
        if (code !== '41004') {
          this.$toast(message)
        }
      }
    },
    async initApplyStatus() {
      this.dcw.applied = this.dcw.standUnits.some(applyInfo => {
        return applyInfo.unitId === this.myUnit.companyId
      })
      if (this.dcw.applied) {
        return
      }
      this.dcw.applied = ['0', '1', '3', '4'].includes(this.dcw.applyStatus + '')
    },
    toApply() {
      this.page = 'APPLY'
    },
    toMyDcw() {
      this.$router.push({ name:'employment',params: {toPage:'/unit/doubleChooseWill/list'}})
    },
    showStandUnit(standUnit) {
      this.standUnitId = standUnit.id
      this.page = "STAND_UNIT"
    },
    backToHomePage() {
      this.$emit("toSomePage", "/index")
    },
    back() {
      if (this.fromList) {
        this.$emit("back-to-list")
      } else {
        this.backToHomePage();
      }
    }
  }
};
</script>

<style lang="less">
@import url("../../styles/styles.less");
.apply-time-tip {
  color: #f56c6c;
}
.stand-units {
  padding: 0 24px 24px;
}
#studentDcwDetails {
  position: relative;
}

</style>
