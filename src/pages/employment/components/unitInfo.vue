<template>
  <module-container title="单位信息" :inline="inline" small :edit="edit">
    <el-form :model="form" v-if="!edit">
      <el-row>
        <el-col :span="12">
          <el-form-item label="单位">
            <p>{{ form.name }}</p>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位性质">
            <p>{{ form.typeName }}</p>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="单位联系人">
            <p>{{ form.contactPeople }}</p>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位规模">
            <p>{{ form.scale }}</p>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="电话">
            <p>{{ form.contactPhone }}</p>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱">
            <p>{{ form.email }}</p>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="单位地址">
        <p>{{ form.address }}</p>
      </el-form-item>
      <el-form-item label="简介">
        <p v-html="form.desc"></p>
      </el-form-item>
    </el-form>
    <el-form :model="form" ref="form" :rules="formRules" v-else>
      <el-row>
        <el-col :span="12">
          <el-form-item label="单位" prop="name">
            <el-select v-model="form.unitId" placeholder="请选择单位" v-if="!isMyUnit" @change="selectUnit" filterable>
              <el-option v-for="unit in units" :key="'unit-' + unit.id" :label="unit.name" :value="unit.id">
              </el-option>
            </el-select>
            <p v-else>
              {{ form.name }}
            </p>
          </el-form-item>
        </el-col>
        <el-col :span="12"  v-if="hasSelectedUnit">
          <el-form-item label="单位性质">
            <p>{{ form.typeName }}</p>
          </el-form-item>
        </el-col>
      </el-row>
      <div v-if="hasSelectedUnit">
        <el-row>
          <el-col :span="12">
            <el-form-item label="单位联系人" prop="contactPeople">
              <el-input v-model="form.contactPeople" placeholder="请输入单位联系人"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位规模">
              <p>{{ form.scale }}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="电话" prop="contactPhone">
              <el-input v-model="form.contactPhone" placeholder="请输入电话"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="单位地址">
          <p>{{ form.address }}</p>
        </el-form-item>

        <el-form-item label="简介">
          <p v-html="form.desc"></p>
        </el-form-item>
      </div>
    </el-form>
  </module-container>
</template>

<script>
  import FormMixin from '../mixins/formMixin'
  import ModuleContainer from '../components/moduleContainer.vue'
  import { getUnitById } from '../api/api'
  export default {
    props: {
      inline: Boolean,
      edit: Boolean,
      rules: {
        type: Object,
        default: {}
      },
      units: Array
    },
    mixins: [FormMixin],
    components: {
      ModuleContainer,
    },
    data() {
      return {
        formRules: {
          name: [{ required: true, message: '请选择单位', trigger: 'blur' }],
          contactPeople: [{ required: true, message: '请填写单位联系人', trigger: 'blur' }],
          contactPhone: [{ required: true, message: '请填写电话', trigger: 'blur' }],
          email: [
            { required: true, message: '请填写邮箱', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ],
        },
        isMyUnit: false,
      }
    },
    computed: {
      hasSelectedUnit() {
        return this.form.unitId || this.form.id
      }
    },
    async created() {
      this.isMyUnit = !!this.form.unitId || !!this.form.id

    },
    methods: {
      async selectUnit(unitId) {
        if (!unitId) {
          return
        }
        window.sessionStorage.setItem('addPosition_unitId',unitId)
        const { state, message, data } = await getUnitById(unitId)
        if (state) {
          const { companyMessage: unit } = data
          this.form.unitId = unit.companyId || unit.id
          this.form.name = unit.companyName
          this.form.typeName = unit.propertyName
          this.form.scale = unit.scaleName
          this.form.email = unit.mailAddress
          this.form.address = unit.addressDetail
          this.form.desc = unit.summary
          this.form.contactPeople = unit.contactPeople
          this.form.contactPhone = unit.contactPhone
        } else {
          this.$toast(message)
          this.form.unitId = null
        }
      },
      async validate() {
        return this.$refs.form.validate()
      }
    }
  }
</script>
