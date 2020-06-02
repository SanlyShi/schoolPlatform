<template>
  <module-container title="备注" :inline="inline">
    <p v-if="!edit">{{ form }}</p>
    <el-input
      type="textarea"
      :autosize="{ minRows: 3 }"
      v-model="form"
      v-else>
    </el-input>
  </module-container>
</template>

<script>
  import FormMixin from '../../../mixins/formMixin'
  import ModuleContainer from '../../../components/moduleContainer.vue'

  export default {
    props: {
      inline: Boolean,
      edit: Boolean,
      rules: {
        type: Object,
        default: Object
      }
    },
    mixins: [FormMixin],
    components: {
      ModuleContainer
    }
  }
</script>
