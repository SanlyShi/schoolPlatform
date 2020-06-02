<template>
  <module-container title="展位信息" :inline="inline">
    <slot name="start"></slot>
    <el-form ref="form" :model="form" @submit.native.prevent v-if="!edit" size="small">
      <el-form-item label="展位分配方式" v-if="!rules.chooseType || !rules.chooseType.hidden">
        <p>{{ form.chooseType === 'UNIT' ? '单位选择场地' : '管理员分配' }}</p>
      </el-form-item>
      <el-form-item label="允许选择多个展位" v-show="form.chooseType === 'UNIT'" v-if="!rules.chooseType || !rules.chooseType.hidden">
        <span>{{ form.canSelectMultiStands ? '是' : '否' }}</span>
        <div v-if="form.canSelectMultiStands" class="limit-stands-selected">
          <span>{{ `(上限 ${form.limitStandsSelected} 个)` }}</span>
        </div>
      </el-form-item>
      <el-form-item label="展位图" v-if="form.siteMap">
        <div class="avatar-uploader readonly">
          <img :src="siteMapPreview" v-if="form.siteMap" title="查看大图" @click="previewPicture">
          <div class="new" v-else>
            <i class="el-icon-picture">未上传展位图</i>
          </div>
        </div>
      </el-form-item>
    </el-form>

    <el-form ref="form" :model="form" @submit.native.prevent v-else>
      <el-form-item label="展位分配方式" v-if="!rules.chooseType || !rules.chooseType.hidden">
        <el-radio-group v-model="form.chooseType" :disabled="rules.chooseType && rules.chooseType.disabled">
          <el-radio label="UNIT">单位选择场地</el-radio>
          <el-radio label="MANAGER">管理员分配</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="允许选择多个展位" v-show="form.chooseType === 'UNIT'" v-if="!rules.chooseType || !rules.chooseType.hidden">
        <el-radio-group v-model="form.canSelectMultiStands" :disabled="rules.chooseType && rules.chooseType.disabled">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
        <div v-if="form.canSelectMultiStands" class="limit-stands-selected">
          <div class="line">上限</div>
          <el-input type="number" v-model="form.limitStandsSelected" size="small" class="max-stands-choosed" :disabled="rules.chooseType && rules.chooseType.disabled"></el-input>
          <div class="line">个</div>
        </div>
      </el-form-item>

      <el-form-item label="展位图">
        <div class="avatar-uploader" v-loading="uploadingSiteMap">
          <img :src="siteMapPreview" v-if="form.siteMap">
          <div class="new" v-else>
            <i class="el-icon-plus">上传展位图</i>
            <input type="file" @change="uploadPicture($event)"/>
          </div>
          <div class="change" v-if="form.siteMap">
            <i class="el-icon-upload2">重新上传</i>
            <i class="el-icon-close delete" @click="deleteSiteMap"></i>
            <input type="file" @change="uploadPicture($event)"/>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <slot name="end"></slot>
  </module-container>
</template>

<script>
  import FormMixin from '../../../mixins/formMixin'
  import StandPicker from './standPicker.vue'
  import api from '../../../api/doubleChooseWill'
  import ModuleContainer from '../../../components/moduleContainer.vue'

  export default {
    props: {
      inline: Boolean,
      edit: Boolean, // 编辑态
      rules: {
        type: Object,
        default: {}
      }
    },
    mixins: [FormMixin],
    components: {
      StandPicker,
      ModuleContainer,
    },
    data() {
      return {
        uploadingSiteMap: false
      }
    },
    computed: {
      siteMapPreview() {
        return `${this.imageUrlPrefix + this.form.siteMap}`
      }
    },
    methods: {
      async uploadPicture(event) {
        this.uploadingSiteMap = true
        const result = await api.uploadPicture(event.target.files[0])
        if (result.code !== '88888') {
          return this.$toast(result.message)
        }
        const hash = result.data.hash
        this.form.siteMap = hash
        this.uploadingSiteMap = false
      },
      async deleteSiteMap() {
        this.form.siteMap = null
      },
      previewPicture() {
        this.$preview({
          name: '展位图',
          url: '/downloads/storage/files/'+ this.form.siteMap,
          type: 'png'
        })
      }
    }
  }
</script>

<style lang="less" scoped>

  .max-stands-choosed {
    width: 80px !important;
    height: 32px;
  }

  .avatar-uploader {
    margin-top: 10px;
    color: #3e92fe;
    border: 1px dashed #e4e4e4;
    border-radius: 8px;
    height: auto;
    cursor: pointer;
    position: relative;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    background: #f5f9ff;
    &.readonly {
      border: none;
      cursor: default;
      background: #f5f5f5;
      .new {
        color: #aaa
      }
    }
    img {
      cursor: pointer;
      width: 100%;
    }
    .new {
      min-height: 150px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
    }
    .change {
      visibility: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      background: rgba(0,0,0,.5);
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      color: white;
      font-size: 16px;
      .delete {
        width: 20px;
        height: 20px;
        background: #f36d6d;
        border-radius: 50%;
        color: white;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        position: absolute;
        top: -10px;
        right: -10px;
      }
    }
    &:hover {
      .change {
        visibility: visible;
      }
    }
    input[type="file"] {
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
  }
  .limit-stands-selected {
    display: inline-block;
    margin-left: 10px;
  }
</style>
