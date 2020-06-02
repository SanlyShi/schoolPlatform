<template>
  <div id="organizationPersonnelCheck">
    <x-header class="organizationPersonnelCheck-header">
      <i slot="overwrite-left" class="maticon back-icon" v-html="icons('navigate_before')" @click="_back">navigate_before</i>
    </x-header>
    <div class="organizationPersonnelCheck-content">
      <div v-if="applicantList.length > 0">
        <div class="organizationPersonnelCheck-card" v-for="(item, itemIndex) in applicantList" :key="itemIndex">
         <div class="personnel-name">{{item.name}}</div>
         <div class="check-opt">
            <x-button class="refuse-btn" @click.native="_refuse(item)" mini>拒绝</x-button>
            <x-button class="agree-btn" @click.native="_agree(item)" mini>同意</x-button>
         </div>
        </div>
      </div>
      <div class="nodataText" v-else>---暂无申请成员数据---</div>
    </div>
  </div>
</template>
<script>
  import { sAjax } from '../../assets/utils/utils.js'
  export default {
    props: {
      data: {
        default: ''
      }
    },
    data: function () {
      return {
        info: {},
        applicantList: []
      }
    },
    created: function () {
      this.info = this.data.data
      this.applicantList = this.info
    },
    methods: {
      _back: function () {
        this.data.isUpdateLastPage = true
        this.$emit('removeBread', this.data)
      },
      _refuse: function (item) {
        sAjax({
          url: '/api/sc/organizations/apply/' + item.id + '/agree',
          type: 'post',
          success: (data) => {
            var message = ''
            if (data.state) {
              message = '操作成功'
              this.applicantList.forEach((ele, i) => {
                if (ele.id === item.id) {
                  this.applicantList.splice(i, 1)
                }
              })
            } else {
              message = data.message
            }
            this.$vux.toast.show({
              text: message,
              position: 'bottom',
              type: 'text'
            })
          }
        })
      },
      _agree: function (item) {
        sAjax({
          url: '/api/sc/organizations/apply/' + item.id + '/disagree',
          type: 'post',
          success: (data) => {
            var message = ''
            if (data.state) {
              message = '操作成功'
              this.applicantList.forEach((ele, i) => {
                if (ele.id === item.id) {
                  this.applicantList.splice(i, 1)
                }
              })
            } else {
              message = data.message
            }
            this.$vux.toast.show({
              text: message,
              position: 'bottom',
              type: 'text'
            })
          }
        })
      }
    }
  }
</script>
<style lang="less">
#organizationPersonnelCheck {
  .organizationPersonnelCheck-header {
    height: 56px;
    background: #ffffff;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 100;
  }
  .organizationPersonnelCheck-content {
    background: #ffffff;
    padding: 60px 16px 0 16px;
    .organizationPersonnelCheck-card {
      background: #f5f5f5;
      border-radius: 8px;
      height: 48px;
      .personnel-name {
        font-size: 13px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.67);
        display: inline-block;
        margin: 13px 16px 0 16px;
      }
      .check-opt {
        float: right;
        .refuse-btn,
        .agree-btn {
          font-size: 13px;
          font-weight: 500;
          padding: 8px 7px;
          margin-top: 1px;
          background: transparent;
        }
        .refuse-btn {
          color: rgba(0, 0, 0, 0.36);
        }
        .agree-btn {
          color: #448aff;
          margin-right: 10px;
        }
        .refuse-btn:after,
        .agree-btn:after {
          border: 0;
        }
      }
    }
  }
}
</style>
