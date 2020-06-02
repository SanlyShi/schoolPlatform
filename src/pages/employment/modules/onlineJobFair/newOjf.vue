<template>
  <div>
    <div class="back" @click="backToList">
      <i class="el-icon-back"></i>返回
    </div>
    <div class="module-container">
      <base-info v-model="ojf" ref="baseInfo" edit></base-info>
      <module-container actions inline>
        <el-button type="primary" size="large" @click="createOjf">发布</el-button>
      </module-container>
    </div>
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
  components: {
    ModuleContainer,
    BaseInfo
  },
  data() {
    return {
      ojf: new Ojf()
    }
  },
  methods: {
    async createOjf() {
      try {
        await this.$refs.baseInfo.validate()
      } catch (err) {
        ScrollTop(0, 200)
        return
      }
      const { state, message, data } = await api.create(this.ojf)
      if (state) {
        this.$alert('发布成功', '', { center: true, showClose: false }).then(() => {
          this.backToList()
        })
      } else {
        this.$toast(message)
      }
    },
    backToList() {
      this.$emit('back-to-list', { refresh: true, tableName: 'manageList' })
    }
  }
}
</script>
