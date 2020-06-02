<template>
  <div>
    <button @click="getSelections">获取下拉选中值</button>
    <v-select ref="select1" :value="value" :options="options" options-value="val" name="animals[]" :limit="limit" multiple search justified required clear-button close-on-select>
    </v-select>
    <v-datepicker ref="datepicker" value="2017-11-23"></v-datepicker>
    <v-list></v-list>
    <u-editor></u-editor>
  </div>
</template>

<script>
  import Vue from 'vue'
  import VSelect from '../components/VCombobox.vue'
  import VDatepicker from '../components/VDatepicker.vue'
  import VList from '../components/VList.vue'
  import UE from '../components/UEditor.vue'
  Vue.component('v-select', VSelect)
  Vue.component('v-datepicker', VDatepicker)
  Vue.component('v-list', VList)
  Vue.component('u-editor', UE)
  export default {
    data: function () {
      return {
        // 限制最多选择3条
        limit: 3,
        value: [0],
        options: [{
          val: 0,
          label: 'Cat'
        },
        {
          val: 1,
          label: 'Cow'
        },
        {
          val: 2,
          label: 'Dog'
        },
        {
          val: 3,
          label: 'Elephant'
        },
        {
          val: 4,
          label: 'Fish'
        },
        {
          val: 5,
          label: 'Lion'
        },
        {
          val: 6,
          label: 'Tiger'
        },
        {
          val: 7,
          label: 'Turtle'
        }]
      }
    },
    methods: {
      getSelections: function () {
        console.log(this.$refs.select1.selectedItems)
        console.log(this.$refs.datepicker.value)

        return this.$refs.select1.selectedValue
      }
    }
  }
</script>

<style>

</style>
