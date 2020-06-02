
<template>
  <div id="freshmanStatus">
    <view-box>
      <x-header class="freshmanStatus-header" :title="account.userName">
        <i slot="overwrite-left" class="maticon account-circle-icon" v-html="icons('account_circle')">account_circle</i>
      </x-header>
      <div class="freshmanStatus-content">
        <div v-for="(val, i) in thingsList" @click="getAppDetail(val.linkAppId)" :key="i">
          <group class="freshmanStatus-group" :class="val.isRight==='1'?'active':'default'" >
            <cell class="freshmanStatus-cell" :title="val.affairName">
              <i slot="icon" class="maticon affariList-icon" v-html="icons('done')" v-if="val.isRight==='1'">done</i>
              <i slot="icon" class="maticon affariList-icon" v-html="icons('more_horiz')" v-else></i>
            </cell>
          </group>
        </div>
      </div>
      <div class="apply-btn">
        <x-button class="button" text="注销登录" @click.native="_showConfirm" type="default"></x-button>
      </div>
    </view-box>
    <div v-transfer-dom>
      <confirm v-model="showConfirm" :close-on-confirm="false" title="注销登录" @on-confirm="logout">
        <p style="text-align:center;">确定注销登录吗？</p>
      </confirm>
    </div>
  </div>
</template>
<script>
import { sAjax,request , translation } from '../../assets/utils/utils.js'
export default {
  props: {
    account: {
      userId: '',
      userName: '',
      type: ''
    }
  },
  data: function () {
    return {
      statusJson: {
        tuitionFeeInfoStatus: '未完成',
        accommodationPaymentInfoStatus: '未完成',
        studentAppearanceConsistency: '未完成',
        admissionsInformationConsistency: '未完成',
        baseInformationConsistency: '未完成',
        studentsArrivingAtSchool: '未完成',
        greenChannelApplicationStatus: null,
        reservationsOnTheStatusOfApplicationForAdmissionStatus: null,
      },
      statusData: {
        tuitionFeeInfoStatus: '学费缴费',
        accommodationPaymentInfoStatus: '住宿缴费',
        studentAppearanceConsistency: '学生相貌一致性',
        admissionsInformationConsistency: '录取信息一致性',
        baseInformationConsistency: '基本信息一致性',
        studentsArrivingAtSchool: '学生到校指标',
        greenChannelApplicationStatus: '绿色通道申请',
        reservationsOnTheStatusOfApplicationForAdmissionStatus: '保留入学资格申请',
      },
      thingsList:[],
      showConfirm: false,
      passArray: ['已完成', '完成', '已通过', '通过', '通过复查', '已缴费', '已到校'],
      noNeedDataArray: ['greenChannelApplicationStatus', 'reservationsOnTheStatusOfApplicationForAdmissionStatus'],
    }
  },
  created: function () {
    var that = this
    let url = '/api/freshman?pageIndex=0&pageSize=100000'
    request(url).then(o => {
      this.thingsList = o.data.content
    })
    // sAjax({
    //   url: '/api/users/me/freshmanBusinessStatus',
    //   type: 'get',
    //   success: function (data) {
    //     if (data.state) {
    //       if (data.data) {
    //         for (var i in data.data) {
    //           that.statusJson[i] = data.data[i]
    //         }
    //       }
    //     } else {
    //       that.$vux.toast.show({
    //         text: data.message,
    //         position: 'bottom',
    //         type: 'text'
    //       })
    //     }
    //   }
    // })
  },
  methods: {
    _showConfirm: function () {
      this.showConfirm = true
    },
    logout: function () {
      this.$emit('logout')
      this.showConfirm = false
    },
    getAppDetail(appId){
      let url = 'api/app/'+appId
      request(url).then(o=>{
        this._checkDetail(o.data)
      })
    },
    _checkDetail: function (obj, typeName, childName) {
      var that = this;
      sAjax({
        url: "/api/app/" + obj.id + "/business/now?getDetail=false",
        type: "get",
        success: function (data) {
          if (data.state) {
            if (data.data.length > 0) {
              if (obj.setting.type === "FORM") {
                that.$emit("addBread", {
                  route: "/form/MFormLayout?appId=" + obj.id,
                  title: "",
                  curBusiness: data.data[0],
                  businessList: data.data.map(o => {
                    o.value = o.business.name
                    o.key = o.business.id
                    return o;
                  }),
                  type: {
                    typeTitle: typeName,
                    childName: childName
                  }
                });
              } else {
                that.$emit("addBread", {
                  route:
                    "/form/MFlowDetail?appId=" +
                    obj.id +
                    "&businessId=" +
                    data.data[0].business.id,
                  title: obj.name,
                  businessList: data.data.map(o => {
                    o.value = o.business.name
                    o.key = o.business.id
                    return o;
                  }),
                  curBusiness: data.data[0]
                });
              }
            } else {
              that._toast("暂无业务");
            }
          } else {
            that._toast(data.message);
          }
        }
      });
    },
  }
}
</script>
<style lang="less">
#freshmanStatus {
  .freshmanStatus-header {
    height: 56px;
    background: #ffffff;
    z-index: 100;
    padding: 0;
    .vux-header-title {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.67);
      font-weight: 500;
      height: 56px;
      margin: 0 52px;
      text-align: left;
      span {
        padding-top: 8px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.73);
      }
    }
    .account-circle-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.73);
      margin-top: 1px;
    }
  }
  .freshmanStatus-content {
    position: absolute;
    top: 60px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    background: #ffffff;
    .freshmanStatus-group {
      margin-bottom: 8px;
      &.active {
        .weui-cells {
          color: #fff;
          background: #4caf50;
        }
      }
      &.unpass {
        .weui-cells {
          color: #9e9e9e;
          background: #eeeeee;
        }
      }
      &.default {
        .weui-cells {
          color: #78909c;
          background: #eceff1;
        }
      }
      .weui-cells {
        color: #78909c;
        background: #eceff1;
        border-radius: 8px;
        margin: 0 16px 10px 16px;
        height: 48px;
        &:before {
          border-top: 0px solid #ffffff;
        }
        &:after {
          border-bottom: 0px solid #ffffff;
        }
        .freshmanStatus-cell {
          .weui-cell__hd {
            margin: -4px 13px 0 -3px;
          }
          p {
            font-size: 13px;
            margin-top: 6px;
          }
          &:before {
            border-bottom: 0px solid #ffffff;
          }
        }
      }
    }
  }
  .apply-btn {
    height: 56px;
    position: fixed;
    bottom: 65px;
    left: 0;
    width: 100%;
    padding: 0 8px;
    background: #ffffff;
    .button {
      background: #298df7;
      border-radius: 4px;
      height: 48px;
      font-size: 16px;
      color: #ffffff;
    }
  }
}
</style>
