<template>
  <div class="count-bar-container" :style="`height:${height}px`">
    <template v-if="statistics.details">
      <div class="bar-container" 
        :style="'width:'+bar.percent" 
        v-for="(bar,bIndex) in statistics.details" :key="bIndex">
        <el-popover
          :style="'width:'+bar.percent"
          placement="top-start"
          trigger="hover"
        >
          <div class="pop-cnt">
            <h5><span class="dot" :style="{background: getColor(bIndex)}"></span>{{bar.name}}</h5>
            <div><span class="count-num">{{bar.count}}</span> 人({{bar.percent}})</div>
          </div>
          <p class="count-bar" 
            slot="reference"
            :style="{background: getColor(bIndex)}"
          ></p>
        </el-popover>
        <p class="count-bar-text" 
          :style="'width:calc('+bar.percent+' - 20px)'"  
          :title="bar.name +' '+ bar.count+'人'">{{bar.name}}: <span class="count-num">{{bar.count}}</span>人</p>
      </div>
    </template>
    <div class="bar-container bg-gray" 
      v-else
      :style="'width:'+statistics.percent" >
        <el-popover
          :style="'width:'+statistics.percent"
          placement="top-start"
          trigger="hover"
        >
          <div class="pop-cnt">
            <h5><span class="dot" style="background: #FFCB44"></span>{{statistics.name}}</h5>
            <div><span class="count-num">{{statistics.count}}</span> 人({{statistics.percent}})</div>
          </div>
          <p class="count-bar" 
            slot="reference"
            :style="'background: #FFCB44; height: '+height+'px;'"
          ></p>
        </el-popover>
      <p class="count-bar-text" 
        :title="statistics.count+'人'"><span class="count-num">{{statistics.count}}</span>人</p>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    statistics: {
      type: Object,
      default: () => {
        return null;
      }
    },
    height: {
      default: 24
    }
  },
  data () {
    return { 
      barCircleWidth: 8,
      newBarLength: 800,
      colorList: [
        '#30BA9F',
        '#25C6DA',
        '#FF8BAB',
        '#FFB748',
        '#FFEE5A',
      ]
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { 
  },
  methods: { 
    getColor(idx) {
      if(this.statistics.details[idx].name === '未填写' || this.statistics.details[idx].name === '未上传') {
        return '#F8F9FB'
      } else {
        return this.colorList[idx % 5]
      }
    }
  }
}
</script>

<style lang="less" scoped>
    .count-bar-container {
      display: flex;
      height: 36px;
      border-radius: 4px;
      overflow: hidden;
      background: #F8F9FB;
      width: 100%;
    }
    .bar-container {
      width: 100%;
      display: inline-block;
    }
    .count-bar {
      height: 24px;
      margin: 0;
      // background: #298df7;
      background: #F8F9FB;
    }
    .bg-gray {
      background: #F8F9FB;
    }
    .bg-blue {
      background: #419DFF;
    }
    .count-bar-text {
      font-size: 12px;
      line-height: 18px;
      color: #606266;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      position: absolute;
      margin: 0;
    }
    .count-num {
      color: #303133;
    }

    .count-bar-title {
      padding-left: 24px;
      padding-right: 5px;
      font-size: 13px;
      color: rgba(0, 0, 0, 0.67);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 36px;
    }
    .pop-cnt {
      font-size: 13px;
      color: #606266;
      padding: 0 14px ;
      h5 {
        position: relative;
        .dot {
          content: '';
          position: absolute;
          left: -8px;
          top: 6px;
          width: 4px;
          height: 4px;
          border-radius: 50%;
        }
      }
    }
</style>
