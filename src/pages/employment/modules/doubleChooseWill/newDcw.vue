<template>
  <div>
    <div class="back" @click="backToList">
      <i class="el-icon-back"></i>返回
    </div>
    <div class="module-container">
      <base-info ref="baseInfo" v-model="dcw.baseInfo" edit></base-info>
      <stand-info v-model="dcw.standInfo" edit></stand-info>
      <module-container inline v-show="dcw.standInfo.chooseType === 'UNIT'">
        <stand-picker :dcw="dcw" v-model="dcw.standInfo.stands" canManage></stand-picker>
      </module-container>
      <module-container actions>
        <el-button type="primary" size="large" @click="create">保存并发布</el-button>
      </module-container>
    </div>
  </div>
</template>

<script>
  import BaseInfo from './components/baseInfo.vue'
  import StandInfo from './components/standInfo.vue'
  import StandPicker from './components/standPicker.vue'
  import ModuleContainer from '../.././components/moduleContainer.vue'
  import api from '../../api/doubleChooseWill'
  import { Dcw } from './types'
  import { ScrollTop } from '../../api/api'
  export default {
    props: ['id', 'collegeCode'],
    components: {
      BaseInfo,
      StandInfo,
      StandPicker,
      ModuleContainer
    },
    data() {
      return {
        dcw: new Dcw(),
      }
    },
    computed: {
    },
    methods: {
      async create() {
        try {
          await this.$refs.baseInfo.validate()
        } catch (err) {
          ScrollTop(0, 200)
          return
        }
        this.dcw.collegeCode = this.collegeCode
        const result = await api.dcw.add(this.dcw)
        this.$toast('添加成功')
        this.$emit('back-to-list', { created: true })
      },
      backToList() {
        this.$emit('back-to-list');
      }
    }
  }
</script>

