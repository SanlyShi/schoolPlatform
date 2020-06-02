<template>
    <div id="lifeStyle">
        <div class="header">
            <label class="header-title pull-left">生活习惯</label>
        </div>
       <div class="content">
           <div class="box">
               <div class="selectBox">
                   <label class="input-label modal-label">作息时间：</label>
                   <v-select class="btn-block form-select-style" v-model="style.timeTable" :options="timeDict" optionsLabel="label" optionsValue="id"></v-select>
               </div>
               <div class="selectBox">
                   <label class="input-label modal-label">兴趣爱好：</label>
                  <input type="text" name="" id="" v-model="style.hobbiesAndInterests">
               </div>
               <div class="selectBox">
                   <label class="input-label modal-label">空调温度：</label>
                   <v-select  class="btn-block form-select-style" v-model="style.airConditioningTemperature" :options="temperatureDict" optionsLabel="label" optionsValue="id"></v-select>
               </div>
               <div class="selectBox">
                   <label class="input-label modal-label">备注：</label>
                   <input type="text" name="" id="" v-model="style.remark">
               </div>
               <!-- <div class="note">
                   <p>备注：</p>
                   <el-input  type="textarea" :rows="3" resize='none' placeholder="请输入内容"></el-input>
               </div> -->
           </div>

           <div class="btnGroup">
               <el-button  plain>取消</el-button>
               <el-button type="primary" @click="addStyle">确认</el-button>
           </div>
       </div>
    </div>
</template>
<script>
import { sAjax } from '../../assets/utils/utils';
export default {
    data() {
        return {
            style: {
                timeTable: '',
                hobbiesAndInterests: '',
                airConditioningTemperature: '',
                remark: ''
            },
            timeDict: [],
            temperatureDict: []
        }
    },
    methods: {
        getStyle() {
            let url = '/api/apartment/usersHabits/getUserHabit'
            sAjax({
                url: url,
                type: 'get',
                success: (data) => {
                    if(data.state) {
                        if(data.data) {
                            this.style = {
                                timeTable: data.data.timeTable,
                                hobbiesAndInterests: data.data.hobbiesAndInterests,
                                airConditioningTemperature: data.data.airConditioningTemperature,
                                remark: data.data.remark,
                                id: data.data.id
                            }
                        }
                        
                    }else {
                        this.$toast(data.message)
                    }
                }
            })
        },
        getDict(type,dataName) {
            let url = '/api/apartment/dicts?typeName='+ type
            sAjax({
                url: url,
                type: 'get',
                success: (data) => {
                    if(data.state) {
                        this[dataName] = data.data
                    }else {
                        this[dataName] = []
                    }
                }
            })
        },
        addStyle() {
            if(this.style.timeTable == '') {
                return this.$toast('请选择作息时间')
            }
            if(this.style.airConditioningTemperature == '') {
                return this.$toast('空调温度')
            }
           let url = '/api/apartment/usersHabits/updateUserHabitsByUserId'
           sAjax({
               url: url,
               type: 'post',
               data: this.style,
               success: (data) => {
                   if(data.state) {
                       this.$toast('编辑成功')
                   }else {
                       this.$toast(data.message)
                   }
               }
           })

        },
        cancale() {

        }
        
    },
    created() {
        this.getStyle()
        this.getDict('作息时间','timeDict')
        this.getDict('空调温度','temperatureDict')
    },
}
</script>
<style lang="less" scoped>
#lifeStyle {
    height: 100%;
    background: #fff;
    padding: 0 22px;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
    position: relative;
    .header {
        height: 60px;
        padding-top: 13px;
        border-bottom: 1px solid #f0f0f0;
        .header-title {
            font-size: 18px;
            color: #333333;
            margin-top: 3px;
        }
    }
   .content {
       margin-top: 20px;
       .btnGroup {
           text-align: center;
           margin-top: 50px;
       }
       .selectBox {
           display: inline-block;
           width: 45%;
           margin-bottom: 20px;
           text-align: center;
           label {
                  width: 75px;
                  text-align: right;
              }
            input {
                border: 1px solid #d9d9d9;
                font-size: 14px;
                border-radius: 5px;
                height: 32px;
                line-height: 32px;
                width: 60%;
                padding-left: 5px;
            }
            input:focus {
                outline: none;
            }
          & /deep/ .v-select {
              width: 60%;
              text-align: left;
          }
       }
   }
}
</style>
