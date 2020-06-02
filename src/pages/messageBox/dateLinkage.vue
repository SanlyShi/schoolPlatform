<template>
  <div class="date-pickers">
    <v-select
      class="select select-years"
      v-model="currentDate.year"
      :options="years"
      optionsLabel="id"
      optionsValue="name"
      placeholder="年"
    ></v-select>年
    <v-select
      class="select"
      v-model="currentDate.month"
      :options="months"
      optionsLabel="id"
      optionsValue="name"
      placeholder="月"
    ></v-select>月
    <v-select
      class="select"
      v-model="currentDate.day"
      :options="days"
      optionsLabel="id"
      optionsValue="name"
      placeholder="日"
    ></v-select>日
    <v-select
      class="select"
      v-model="currentDate.hour"
      :options="hours"
      optionsLabel="id"
      optionsValue="name"
      placeholder="时"
    ></v-select>时
    <v-select
      class="select"
      v-model="currentDate.minute"
      :options="minutes"
      optionsLabel="id"
      optionsValue="name"
      placeholder="分"
    ></v-select>分
  </div>
</template>
<script>
export default {
  props: {
    sourceDateProp: {
      type: [String, Number]
    },
    minYear: {
      type: Number,
      default: new Date().getFullYear()
    },
    maxYear: {
      type: Number,
      default: new Date().getFullYear() + 2
    }
  },
  name: "date-pickers",
  data() {
    return {
      sourceDate: this.sourceDateProp,
      currentDate: {
        year: "",
        month: "",
        day: "",
        hour: "",
        minute: ""
      },
      years: [],
      months: [],
      normalMaxDays: 31,
      days: [],
      hours: [],
      minutes: [],
      hasError: false
    };
  },
  watch: {
    sourceDate: {
      immediate: true,
      handler(newValue, oldValue) {
        this.currentDate = this.timestampToTime(newValue);
      },
      deep: true
    },
    normalMaxDays() {
      this.getFullDays();
      if (this.currentDate.year && this.currentDate.day > this.normalMaxDays) {
        this.currentDate.day = "";
      }
    },
    currentDate: {
      immediate: true,
      handler(newValue, oldValue) {
        this.judgeDay();
        if (
          newValue.year &&
          newValue.month &&
          newValue.day &&
          newValue.hour &&
          newValue.minute
        ) {
          this.hasError = false;
        } else {
          this.hasError = true;
        }
        this.emitDate();
      },
      deep: true
    }
  },
  created() {
    this.getFullYears();
    this.getFullMonths();
    this.getFullDays();
    this.getFullHours();
    this.getFullMinute();
  },
  methods: {
    emitDate() {
      let timestamp; //暂默认传给父组件时间戳形式
      let dateStr; //暂默认传给父组件时间
      if (
        this.currentDate.year &&
        this.currentDate.month &&
        this.currentDate.day &&
        this.currentDate.hour &&
        this.currentDate.minute
      ) {
        let month =
          this.currentDate.month < 10
            ? "0" + this.currentDate.month
            : this.currentDate.month;
        let day =
          this.currentDate.day < 10
            ? "0" + this.currentDate.day
            : this.currentDate.day;
        let hours =
          this.currentDate.hour < 10
            ? "0" + this.currentDate.hour
            : this.currentDate.hour;
        let minute =
          this.currentDate.minute < 10
            ? "0" + this.currentDate.minute
            : this.currentDate.minute;
        dateStr =
          this.currentDate.year +
          "-" +
          month +
          "-" +
          day +
          " " +
          hours +
          ":" +
          minute;
        timestamp = new Date(dateStr).getTime();
      } else {
        timestamp = "";
        dateStr = "";
      }
      this.$emit("dateSelected", timestamp, dateStr);
    },
    timestampToTime(timestamp) {
      let dateObject = {};
      if (typeof timestamp == "number") {
        dateObject.year = new Date(timestamp).getFullYear();
        dateObject.month = new Date(timestamp).getMonth() + 1;
        dateObject.day = new Date(timestamp).getDate();
        dateObject.hour = new Date(timestamp).getHours();
        dateObject.minute = new Date(timestamp).getMinutes();
        return dateObject;
      }
    },
    setArray(start, end) {
      let obj;
      let arr = [];
      for (let i = start; i <= end; i++) {
        obj = {};
        obj.name = i.toString();
        obj.id = i.toString();
        arr.push(obj);
      }
      return arr;
    },
    getFullYears() {
      this.years = this.setArray(this.minYear, this.maxYear);
    },
    getFullMonths() {
      this.months = this.setArray(1, 12);
    },
    getFullDays() {
      this.days = this.setArray(1, this.normalMaxDays);
    },
    getFullHours() {
      this.hours = this.setArray(1, 24);
    },
    getFullMinute() {
      this.minutes = this.setArray(0, 59);
    },
    judgeDay() {
      if ([4, 6, 9, 11].indexOf(this.currentDate.month) !== -1) {
        this.normalMaxDays = 30; //小月30天
        if (this.currentDate.day && this.currentDate.day == 31) {
          this.currentDate.day = "";
        }
      } else if (this.currentDate.month == 2) {
        if (this.currentDate.year) {
          if (
            (this.currentDate.year % 4 == 0 &&
              this.currentDate.year % 100 != 0) ||
            this.currentDate.year % 400 == 0
          ) {
            this.normalMaxDays = 29; //闰年2月29天
          } else {
            this.normalMaxDays = 28; //闰年平年28天
          }
        } else {
          this.normalMaxDays = 28; //闰年平年28天
        }
      } else {
        this.normalMaxDays = 31; //大月31天
      }
    }
  }
};
</script>
<style lang="less">
.select {
  width: 60px;
  margin: 0 5px;
  text-align: center;
}
.select-years {
  width: 80px;
}
</style>