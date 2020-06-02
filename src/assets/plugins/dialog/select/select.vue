<template>
  <div class="v-select-cover"
    :class="[{
      'mobile-select-cover': phoneStyle
    }, dropdownClass]"
    @click="_close"
    v-if="show">
    <div class="top-cover"></div>
    <ul class="dropdown-menu"
      :style="this.isPhone?'':{
        left: `${rect.left}px`,
        top: `${top}px`,
        width: `${this.rect.width}px`,
        height:`${this.dropdownHeight}px`
      }" @click.stop="">
      <div v-if="canSearch" class="searchbox">
        <input type="text" ref="search" :placeholder="searchText" class="form-control" v-model="searchValue" @keyup.esc="show = false" />
        <span v-show="searchValue" class="close" @click.stop="searchValue = ''">&times;</span>
      </div>
      <GeminiScrollbar :scrollX="false" class="items-group" :class="{top:canSearch}">
        <li class="dropdown-items"
          :class="{
            active: _isSelected(option)>=0
          }"
          v-for="(option,k) in options"
          :key="k"
          @click="selectItem(option)"
          v-if="option[optionsLabel].indexOf(searchValue)>=0">
          <label class="btn-block" :title="option[optionsLabel]||option[optionsValue]">
            <span class="maticon pull-right check-mark" v-show="_isSelected(option)>=0" v-html="icons('done')" v-if="!phoneStyle"></span>
            <span class="pull-left" v-else>
              <i class="maticon" v-html="icons(multiple?'check_box':'radio_button_checked')" v-if="_isSelected(option)>=0"></i>
              <i class="maticon" v-html="icons(multiple?'check_box_outline_blank':'radio_button_unchecked')" v-else></i>
            </span>
            <span v-html="option[optionsLabel]||option[optionsValue]"></span>
          </label>
        </li>
      </GeminiScrollbar>
    </ul>
    <div class="bottom-cover"
      :style="{
        left: `${rect.left}px`,
        top: `${top + 2}px`,
        bottom: '0px',
        width: `100%`
      }"></div>
  </div>
</template>
<script>
  export default {
    data: function () {
      return {
        show: true,
        searchValue: '',
        isPhone: false,
        hasChange: false,
        rect: {},
        maxHeight: 200,
        lang: this.defaultLang
      }
    },
    computed: {
      dropdownHeight: function () {
        var scrollH = this.options.length * 27 + 2 + (this.canSearch ? 34 : 0)
        return scrollH > this.maxHeight ? this.maxHeight : scrollH
      },
      top: function () {
        var top = 0
        if (window.innerHeight - this.rect.bottom < this.dropdownHeight) {
          top = this.rect.top - this.dropdownHeight
          top = top < 0 ? 0 : top
        } else {
          top = this.rect.bottom
        }
        return top
      },
      phoneStyle: function () {
        return this.isPhone && !this.dropdownClass
      },
      canSearch: function () {
        return this.options.length >= this.minSearch
      }
    },
    methods: {
      clearSearch: function () {
        this.searchValue = ''
        this.$refs.search.focus()
      },
      selectItem: function (option) {

        this.hasChange = true
        var index = this._isSelected(option)

        if (index >= 0) {// 已选
          if (this.required && this.selectedItems.length === 1) {
            this.$toast('该项必填，不可置空')
            return
          } else {
            this.selectedItems.splice(index, 1)
          }
        } else {// 未选
          if (!this.multiple) {
            this.selectedItems = []
          }
          if (this.multiple && this.limit <= this.selectedItems.length) {
            this.$toast(`选项数最多选择${this.limit}项`)
            return
          }
          this.selectedItems.push(option)
        }
        if (!this.multiple || (this.multiple && this.closeOnSelect)) {
          this._close()
        } else {
          this._optionResult(this.selectedItems)
        }
        this._optionClick(option)
      },
      _isSelected: function (option) {
        var index = -1
        this.selectedItems.forEach((item, i) => {
          if (item[this.optionsValue] === option[this.optionsValue]) {
            index = i
          }
        })
        return index
      },
      _close: function () {
        this.show = false
        if (this.hasChange) {
          this._optionResult(this.selectedItems)
        }
        this._optionClose()
        window.onresize = ''
      }
    },
    mounted: function () {
      var that = this
      if (window.innerWidth < 768) {
        this.isPhone = true
      } else {
        this.isPhone = false
      }
      this.rect = this.el.getBoundingClientRect()
      window.onresize = function () {
        if (window.innerWidth < 768) {
          this.isPhone = true
        } else {
          this.isPhone = false
        }
        that.rect = that.el.getBoundingClientRect()
      }
    }
  }
</script>

<style lang="less">
@searchboxHeight: 40px;
@maxHeight: 200px;
.v-select-cover {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: rgba(255, 255, 255, 0);
  .dropdown-menu {
    display: block;
    overflow-y: auto;
    border:none;
    // min-width: auto;
    max-height: @maxHeight;
    -webkit-overflow-scrolling: touch;
    li.dropdown-items {
      padding: 5px 10px;
      cursor: pointer;
      label {
        margin-bottom: 0;
        line-height: 1.2;
        // white-space: nowrap;
        overflow: hidden;
        // text-overflow: ellipsis;
        // display: flex;
      }
      span {
        cursor: pointer;
      }
      .check-mark {
        font-size: 16px;
        margin-left: 5px;
      }
      &:hover {
        background: #e6f6fd;
      }
    }
  }
  .items-group {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: auto;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    &.top {
      top: @searchboxHeight;
    }
  }
  .searchbox {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    padding: 0;
    height: @searchboxHeight;
    input {
      height: auto;
      padding: 10px 12px;
      border: none;
      box-shadow: none;
      outline: none;
      &:focus {
        outline: 0;
        border-color: #66afe9 !important;
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
          0 0 8px rgba(102, 175, 233, 0.6);
      }
    }
    .close {
      position: absolute;
      top: 0;
      right: 0;
      z-index: 2;
      display: block;
      width: 34px;
      height: 34px;
      margin-left: 5px;
      line-height: @searchboxHeight;
      text-align: center;
    }
  }

  &.mobile-select-cover {
    background: rgba(0, 0, 0, 0.54);
    .dropdown-menu {
      position: absolute;
      left: 50px;
      right: 50px;
      top: 60px;
      bottom: 40px;
      min-height: 30%;
      max-height: 80%;
      overflow: scroll;
      -webkit-overflow-scrolling: touch;
      li.searchbox {
        position: absolute;
      }
      li.dropdown-items {
        padding: 10px 10px;
        cursor: pointer;
        label {
          line-height: 24px;
        }
        span {
          margin-right: 8px;
        }
        &:hover {
          background: #e6f6fd;
        }
      }
    }
  }
  .bottom-cover{
    position: absolute;
  }
}
</style>
