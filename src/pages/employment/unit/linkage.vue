<template>
  <div class="linkage" id="linkage">
    <el-select v-model="sheng" @change="choseProvince" placeholder="省级地区" :style="'width:'+width+'px'" filterable>
      <el-option autocomplete='off' v-for="item in province" :key="item.id" :label="item.value" :value="item.id"></el-option>
    </el-select>
    <el-select filterable v-model="shi" v-show="showCity" @change="choseCity" placeholder="市级地区" :style="'width:'+width+'px'">
      <el-option autocomplete='off' v-for="item in shi1" :key="item.id" :label="item.value" :value="item.id"></el-option>
    </el-select>
    <el-select filterable v-if="showArea" v-model="qu" @change="choseBlock" placeholder="区级地区" :style="'width:'+width+'px'">
      <el-option autocomplete='off' v-for="item in qu1" :key="item.id" :label="item.value" :value="item.id"></el-option>
    </el-select>
  </div>
</template>

<script>
import axios from "axios";
import { sAjax } from "../../../assets/utils/utils.js";
import { setTimeout } from 'timers';
export default {
  props: ["showArea", "width", "options"],
  data() {
    return {
      // mapJson: "../../../../static/json/map.json",
      province: "",
      sheng: "",
      shi: "",
      shi1: [],
      qu: "",
      qu1: [],
      city: "",
      block: "",
      _sheng: "",
      _shi: "",
      _qu: "",
      showCity: true,
    };
  },
  watch: {
    "options": {
      handler: function (val) {
        setTimeout(() => {
          if (val) {
            let _options = val.split(",");
            if (_options[0]) {
              this.sheng = _options[0];
              this.choseProvince(_options[0]);
            }
            if (_options[1]) {
              this.shi = _options[1];
              this.choseCity(_options[1]);
            }
            if (_options[2]) {
              this.qu = _options[2];
              this.choseBlock(_options[2]);
            }
          } else {
            this.sheng = "";
            this.shi = "";
            this.qu = "";
          }
        }, 500)
      }, immediate: true
    },
  },
  methods: {
    // 加载china地点数据，三级
    getCityData: function () {
      var that = this;
      // sAjax({
        // url: this.mapJson,
        // type: "get",
        // success: data => {
          var data = this.mapJson;
          that.province = [];
          that.city = [];
          that.block = [];
          // 省市区数据分类
          for (var item in data) {
            if (item.match(/0000$/)) {
              
              //省
              that.province.push({
                id: item,
                value: data[item],
                children: []
              });
            } else if (item.match(/00$/)) {
              //市
              that.city.push({ id: item, value: data[item], children: [] });
            } else {
              //区
              that.block.push({ id: item, value: data[item] });
            }
          }
          // 分类市级
          for (var index in that.province) {
            for (var index1 in that.city) {
              if (
                that.province[index].id.slice(0, 2) ===
                that.city[index1].id.slice(0, 2)
              ) {
                
                that.province[index].children.push(that.city[index1]);
              }else {
                
              }
            }
          }
          // 分类区级
          for (var item1 in that.city) {
            for (var item2 in that.block) {
              if (
                that.block[item2].id.slice(0, 4) ===
                that.city[item1].id.slice(0, 4)
              ) {
                that.city[item1].children.push(that.block[item2]);
              }
            }
          }
        // }
      // });
      // axios
      //   .get(this.mapJson)
      //   .then(function(response) {
      //     if (response.status == 200) {
      //       var data = response.data;
      //       that.province = [];
      //       that.city = [];
      //       that.block = [];
      //       // 省市区数据分类
      //       for (var item in data) {
      //         if (item.match(/0000$/)) {
      //           //省
      //           that.province.push({
      //             id: item,
      //             value: data[item],
      //             children: []
      //           });
      //         } else if (item.match(/00$/)) {
      //           //市
      //           that.city.push({ id: item, value: data[item], children: [] });
      //         } else {
      //           //区
      //           that.block.push({ id: item, value: data[item] });
      //         }
      //       }
      //       // 分类市级
      //       for (var index in that.province) {
      //         for (var index1 in that.city) {
      //           if (
      //             that.province[index].id.slice(0, 2) ===
      //             that.city[index1].id.slice(0, 2)
      //           ) {
      //             that.province[index].children.push(that.city[index1]);
      //           }
      //         }
      //       }
      //       // 分类区级
      //       for (var item1 in that.city) {
      //         for (var item2 in that.block) {
      //           if (
      //             that.block[item2].id.slice(0, 4) ===
      //             that.city[item1].id.slice(0, 4)
      //           ) {
      //             that.city[item1].children.push(that.block[item2]);
      //           }
      //         }
      //       }
      //     } else {
      //       console.log(response.status);
      //     }
      //   })
      //   .catch(function(error) {
      //     console.log(typeof +error);
      //   });
    },
    setIdVaule(value) {
      let obj = {};
      obj.id = value.id;
      obj.value = value.value;
      return obj;
    },
    // 选省
    choseProvince: function (e) {
       this.showCity = true;
       this.showArea = true;
      for (var index2 in this.province) {
        if (e === this.province[index2].id) {
          this.shi1 = this.province[index2].children;
          if(this.shi1.length){
            this.shi = this.province[index2].children[0].id;
            this.qu1 = this.province[index2].children[0].children;
            this.qu = this.province[index2].children[0].children[0].id;

            this._sheng = this.setIdVaule(this.province[index2]);
            this._shi = this.setIdVaule(this.province[index2].children[0]);
            this._qu = this.setIdVaule(this.qu1[0]);
          }else {
            this.showCity = false;
            this.showArea = false;
          }
          // this.shi = this.province[index2].children[0].id;
          
          // this.E = this.qu1[0].id;
        }
      }
      this.$emit("getData", {
        province: this._sheng,
        city: this._shi,
        area: this._qu
      });
    },
    // 选市
    choseCity: function (e) {
      for (var index3 in this.city) {
        if (e === this.city[index3].id) {
          this.qu1 = this.city[index3].children;
          this.qu = this.city[index3].children[0].id;
          this.E = this.qu1[0].id;

          this._shi = this.setIdVaule(this.city[index3]);
          this._qu = this.setIdVaule(this.qu1[0]);
          // console.log(this.E)
        }
      }
      this.$emit("getData", {
        province: this._sheng,
        city: this._shi,
        area: this._qu
      });
    },
    // 选区
    choseBlock: function (e) {
      for (var index4 in this.qu1) {
        if (e === this.qu1[index4].id) {
          this._qu = this.setIdVaule(this.qu1[index4]);
          // console.log(this.E)
        }
      }
      this.$emit("getData", {
        province: this._sheng,
        city: this._shi,
        area: this._qu
      });
    }
  },
  created: function () {
    this.getCityData();
  }
};
</script>

<style scoped>
</style>