<template>
  <div class="input-group ditection">
    <input class="form-control" type="text" :placeholder="placeholder" v-model="searchVal" @input="_search">
    <ul class="dropdown-menu" v-if="show">
      <li class="res-item" v-for="(option, oindex) in options" :key="oindex" @click="_afterSelect(option)">
        <div class="option-content">
          <p><span>{{option.name}}</span> <span class="user-no" v-if="option.userNo">({{option.userNo}})</span></p>
          <p><span>{{option.organizationName || ''}}</span></p>
          <p><span>{{option.unitName || ''}}</span></p>
        </div>
      </li>
      <li>
        <div class="option-content">
          <p>搜索到{{options.length}}条结果<i class="maticon pull-right close" v-html="icons('close')" @click="_close"></i></p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import { sAjax } from '../../../assets/utils/utils'
export default {
  props: {
    url: {
      default: ''
    },
    placeholder: {
      default: '请输入学工号或者姓名'
    },
    type: {
      default: 'param'
    },
    searchVal: {
      default: ''
    },
    keyword:{
      default:'keyword'
    }
  },
  data: function () {
    return {
      timer: null,
      show: false,
      options: []
    }
  },
  methods: {
    _close: function () {
      this._reset()
    },
    _search: function () {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.show = true
        this._getOptions()
      }, 600);
    },
    _getOptions: function () {
      if (this.show && this.url) {
        var url = this.url
        if (this.type === 'query') {
          url = this.url + `/${this.searchVal}`
        }
        let params = {}
        params[this.keyword] = this.searchVal
        sAjax({
          url: url,
          type: 'get',
          data: params,
          success: (data) => {
            if (data.state) {
              this.options = data.data || []
            } else {
              this.$toast(data.message)
            }
          }
        })
      }
    },
    _afterSelect: function (option) {
      this.$emit('afterSelected', option)
      this._reset()
      if (option.userNo) {
        this.searchVal = `${option.name}(${option.userNo})`
      }
      else if (option.roleId) {
        this.searchVal = `${option.name}`
      }
      else if (option.unitName) {
        this.searchVal = `${option.unitName}`
      }
    },
    _reset: function () {
      this.show = false
      this.options = []
      this.searchVal = ''
    }
  }
}
</script>
<style lang="less">
.ditection {
  .dropdown-menu {
    display: block;
    width: 100%;
    max-height: 200px;
    padding: 0;
    overflow: auto;
    .res-item {
      cursor: pointer;
      &:hover {
        background: #f0f0f0;
      }
    }
    .option-content {
      padding: 5px 10px;
      border-bottom: 1px solid #e0e0e0;
      p {
        margin: 0;
      }
      .user-no {
        font-size: 12px;
        color: #999;
      }
      .user-org {
        font-size: 13px;
        color: #666;
      }

      .close {
      }
    }
  }
}
</style>
