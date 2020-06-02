<!--
  最后修改时间：2019-06-13

  value 初始值 中文地址, ex:福建,厦门,湖里区
  width 宽度 默认220
  noArea 是否显示 区选择器 默认显示
  @onChange 选择的时候触发, 返回 省市的值  350583,350583,350583   六位数行政区划代码  钟国平的接口的值 
-->
<template>
  <div class="my-elwrap address_select_wrap" :style="{width:width+'px'}">
    <el-cascader v-model="selectValue" ref="cascader" :disabled="disabled" :placeholder="myAddress" popper-class="cascader-panel" separator=',' :options="options" @change="handleChange" :props="props" style="width:100%;height:34px"></el-cascader>
  </div>
</template>

<script>
import { request } from "../assets/utils/utils.js";
import { setTimeout } from 'timers';
export default {
  name: 'New-Address',
  data() {
    let that = this
    return {
      options: [],
      values: '',
      texts: '',
      selectValue: [],
      myAddress: '请选择',
      cityUrl: '/api/archives/permissions/getProvinceSecond',//获取城市的接口
      provenceUrl: '/api/archives/permissions/getProvinceList',//获取省的接口
      props: {//接口返回数据格式
        expandTrigger: 'hover',//可以是click 显示子菜单的事件
        value: 'value',
        label: 'label',
        children: 'city',
        checkStrictly: true,
        lazy: true,
        lazyLoad(node, resolve) {
          if (node.level === 1) {
            that.getCity(node, resolve)
          } else if (node.level === 2 && !that.noArea) {
            that.getArea(node, resolve)
          } else {
            resolve([])
          }
        }
      }
    }
  },
  props: {
    value: {
      default: '请选择'
    },
    width: {
      default: 220
    },
    noArea: {
      default: false
    },
    disabled: {
      default: false
    }
  },
  created() {
    this.myAddress = this.value?this.value:'请选择'
  },
  watch: {
    value(newVal) {
      if (newVal) {
        this.myAddress = newVal
      } else {
        this.myAddress = '请选择'
      }
      this.selectValue = ['', '', '']
    }
  },
  mounted() {
    let page = this;
    page.getCNodes('根', []);
  },
  methods: {
    getCity(parent, resolve) {
      let url = `${this.cityUrl}?value=${parent.value}`
      if (parent.city && parent.city.length) {//已经有数据了 不需要调接口
        parent.city = JSON.parse(JSON.stringify(parent.city))
        return
      }
      request(url).then(o => {
        if (o.state) {
          if (this.noArea) {
            parent.city = o.data.map(a => {
              a.leaf = true
              return a
            })
            resolve(parent.city)
          } else {
            parent.city = o.data.map(a => {
              a.city = []
              return a
            })
            resolve(parent.city)
          }
        }
      })
    },
    getArea(parent) {//预留一下 以便后面扩展
      parent.city = [{ value: 124, label: '我自创的市' }, { value: 1234, label: '哈哈哈哈哈' }]
    },
    getCNodes(parentid, currentIds) {
      let url = this.provenceUrl
      request(url).then(o => {
        if (o.state) {
          this.options = o.data.map(o => {
            o.city = []
            return o
          })
        }
      })
    },
    handleItemChange(val) {

      this.values = val;
      // console.log(val)
      let valSize = val.length;
      let page = this;
      if (valSize === 1) {
        //第2级节点获取
        page.options.forEach(function (r, index) {
          if (r.value === val[0]) {
            // page.getCNodes(r.value, val);
            page.getCity(r)
          }
        });
      } else if (valSize === 2 && !this.noArea) {
        //第3级节点获取
        page.options.forEach(function (r, index) {
          if (r.value === val[0]) {
            r.city.forEach(function (r0, i0) {
              if (r0.value === val[1]) {
                page.getArea(r0);
              }
            });
          }
        });
      }
    },
    handleChange(v, obj) {
      let page = this;
      page.values = this.selectValue[0]
      if (this.selectValue[1]) {
        page.values += ',' + this.selectValue[1]
      }
      this.$nextTick(o => {
        page.texts = this.$refs.cascader.inputValue
        this.$emit('onChange', page.values)
      })

    }
  }
}
</script>
<style lang="less">
.my-elwrap.address_select_wrap {
  .el-input__suffix {
    color: #666;
    right: 2px;
  }
  .el-cascader__label {
  }
  .el-input.is-disabled .el-input__inner {
    background: #f5f5f5;
  }
  .el-input {
    .el-input__inner {
      padding-left: 5px;
      border-color: #d9d9d9;
    }

    input::-webkit-input-placeholder {
      color: #666;
    }
  }
  .el-icon-arrow-down {
    font-weight: bold;
    font-size: 15px;
  }
}
.cascader-panel {
  height: 233px;
  overflow: hidden;
  .el-cascader-panel {
    height: 100%;
    .el-cascader-menu {
      height: 100%;
      overflow-x: hidden;
    }
    .el-cascader-menu__wrap {
      overflow-x: hidden;
    }
  }

  .el-radio__inner {
    top: 3px;
  }
}
.cascader-panel::-webkit-scrollbar {
  width: 4px;
  /*height: 4px;*/
}
.cascader-panel::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.cascader-panel::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
</style>