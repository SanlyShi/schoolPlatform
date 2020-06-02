<template>
  <div class=" box_flex align_center mySelect">
    <v-select class="info-value" :style="{width:width+'px'}" :options="provinceList" :data-attr="attr" data-add-type="province" v-model="address.province" options-value="name" options-label="name" close-on-select @afterSelected="changeValue('address')" v-if="address"></v-select>
    <v-select class="info-value" :style="{width:width+'px'}" :options="_getCityList(address.province)" :data-attr="attr" data-add-type="city" v-model="address.city" options-value="name" options-label="name" close-on-select @afterSelected="changeValue('city')" v-if="address&&address.province"></v-select>
    <v-select class="info-value" :style="{width:width+'px'}" :options="_getAreaList(address.city,address.province)" :data-attr="attr" data-add-type="area" v-model="address.area" options-value="name" options-label="name" close-on-select @afterSelected="changeValue()" v-if="!noArea&&address&&address.city"></v-select>
  </div>
</template>
<script>
export default {
  data() {
    return {
      address: {
        province: '',
        city: '',
        area: '',
      }
    }
  },
  props: {
    value: {
      default: ''
    },
    width: {
      default: 220
    },
    noArea:{
      default:false
    }
  },
  watch: {
    value(newVal) {
      let arr = newVal.split(',')
      this.address = {
        province: arr[0] ? arr[0] : '',
        city: arr[1] ? arr[1] : '',
        area: arr[2] ? arr[2] : ''
      }
    }
  },
  methods: {
    changeValue(type) {
      if (type == 'address') {
        this.address.city = ''
        this.address.area = ''
      } else if (type == 'city') {
        this.address.area = ''
      }
      let str = ''
      str += this.address.province
      if (this.address.city) {
        str += ',' + this.address.city
      }
      if (this.address.area) {
        str += ',' + this.address.area
      }
      this.$emit('input', str);
    },
  }
}
</script>

<style lang="less" scoped>
.input-group {
  .light-black-color {
    color: #4091ff;
  }
  .maticon {
    color: #4091ff;
  }
}
.mySelect {
  // .v-select{
  //     &.form-control{
  //         width:220px;
  //     }
  // }
}
</style>
