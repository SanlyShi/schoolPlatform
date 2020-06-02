<template>
  <div class="v-datepicker-area">
    <input :title="text"  type="text" class="form-control v-datepicker-area-input text-center" :value="text" :placeholder="placeholder" readonly @click="_toggle">
    <div class="col-sm-12 v-datepicker-area-div" v-show="show">
      <div class="row">
        <div class="col-sm-6 time-area">
          <v-datepicker
            width="100%"
            v-model="startValue"
            :placeholder="placeholder+'开始时间'"
            :format="dateFormat"
            @daySelected="_startSelect">
          </v-datepicker>
        </div>
        <div class="col-sm-6 time-area">
          <v-datepicker
            width="100%"
            v-model="endValue"
            :placeholder="placeholder+'结束时间'"
            :format="dateFormat"
            @daySelected="_endSelect">
          </v-datepicker>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      defaultValue: {
        default: []
      },
      dateFormat: {
        default: 'yyyy-MM-dd'
      },
      placeholder: {
        default: ''
      }
    },
    data: function () {
      return {
        show: false,
        startValue: this.defaultValue[0] || '',
        endValue: this.defaultValue[1] || ''
      }
    },
    computed: {
      startValue: function () {
        if(this.defaultValue.length) {
          return this.defaultValue[0]
        }else {
          return ''
        }
      },
      endValue: function() {
         if(this.defaultValue.length) {
          return this.defaultValue[1]
        }else {
          return ''
        }
      },
      text: function () {
        var startStr = this._stringify((this.startValue ? new Date(this.startValue.replace(/-/g, '/')) : null), this.dateFormat)
        // console.log(startStr)
        var endStr = this._stringify((this.endValue ? new Date(this.endValue.replace(/-/g, '/')) : null), this.dateFormat)
        return startStr + ' ~ ' + endStr
      }
    },
    methods: {
      _toggle: function () {
        this.show = !this.show
      },
      _startSelect: function (e) {
        this.$emit('startSelected', e)
        console.log('show')
        if(this.startValue && this.endValue) {
          console.log('hide')
          this.show = false
        }
      },
      _endSelect: function (e) {
        this.$emit('endSelected', e)
        if(this.startValue && this.endValue) {
          this.show = false
        }
      },
      _stringify: function (date, format) {
        if (!date) return ''
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        const hour = date.getHours()
        const minute = date.getMinutes()
        const second = date.getSeconds()
        var format1 = format || 'yyyy-MM-dd'
        var str = format1
          .replace(/yyyy/g, year)
          .replace(/MM/g, ('0' + month).slice(-2))
          .replace(/dd/g, ('0' + day).slice(-2))
          .replace(/yy/g, year)
          .replace(/M(?!a)/g, ('0' + month).slice(-2))
          .replace(/d/g, ('0' + day).slice(-2))
          .replace(/hh/g, ('0' + hour).slice(-2))
          .replace(/ii/g, ('0' + minute).slice(-2))
          .replace(/ss/g, ('0' + second).slice(-2))
        return str
      }
    }
  }
</script>
<style lang="less">
.v-datepicker-area {
  .v-datepicker-area-input {
    height: 34px;
    background: #fff;
    cursor: pointer;
  }
  .v-datepicker-area-div {
    width: 310px;
    padding: 5px 10px;
    // margin-left: -50%;
    background: #fff;
    box-shadow: 0 0 3px 1px #d9d9d9;
    border-radius: 3px;
    .time-area {
      padding: 0 10px!important;
      text-align: left;
    }
  }
}
</style>
