<template>
  <div id="schoolStandard-page" class="relationship-page container-fluid" v-if="isParentPage">
    <v-table ref="studentTable" :url="url" pagesize="10" idField="id" :columns="columns" :multiple="true" :order="true" :search="false" @afterChecked="_tableChecked">
      <div slot="btn-group" role="group">
        <div class="btn-group pull-right">
          <button type="button" class="btn btn-bgColor-style clearBtnBorder" @click="batchDel()">批量删除</button>
          <button type="button" class="btn btn-bgColor-style clearBtnBorder" @click="batchSet()">批量导入</button>
          <button type="button" class="btn btn-bgColor-style clearBtnBorder" @click="exportTable()">导出</button>
        </div>
      </div>
    </v-table>
  </div>
  <v-import v-bind="importParams" :checkTemplateUrl="checkTemplateUrl" @backParentPage="backParentPage" v-else></v-import>
</template>
<script>
import { sAjax, request } from "../../assets/utils/utils.js";
import { constants } from 'crypto';
export default {
  data() {
    return {
      provinceSecondArr: [],
      tableCheckedList: [],
      url: "/table-data/archives/middle/getListMiddle",
      columns: [],
      isParentPage: true,
      checkTemplateUrl: "/archives/middle/excel",
      importParams: {
        parentPageTitle: '中学标准库',
        downloadTemplateUrl: '/archives/middle/template',
        downloadErrorTemplateUrl: '/archives/middle/errorFile',
        templateName: '中学标准库导入模板.xlsx',
        importBtnType: [{
          name: "中学标准库导入.xlsx",
          url: '/archives/middle',
          method: 'post',
          isShowBtn: true,
          success: (data) => {
            if (data.state) {
              this.url = this.url + '?timestamp=' + new Date().getTime()
            }
          }
        }]
      }
    }
  },
  created() {
    this.initC()
  },
  computed: {
    nowArr() {
      let array = [];
      if (this.tableCheckedList.length == 0) {
        array = []
      }
      else {
        this.tableCheckedList.forEach((item) => {
          array.push(item.id)
        })
      }
      return array
    },
  },
  methods: {
    batchDel() {
      if (this.nowArr.length > 0) {
        let url = `/api/archives/middle/deleteMiddle`
        request(`${url}?id=${this.nowArr}`, {}, 'post').then(o => {
          if (o.state) {
            this.url = this.url + '?timestamp=' + new Date().getTime()
          }
        })
      }
      else {
        this.$toast("请勾选需要操作的行")
      }
    },
    exportTable() {
      if (this.nowArr.length > 0) {
        window.location.href = `/downloads/archives/getMiddleExcel?middleId=${this.nowArr}`
      }
      else {
        this.$toast("请勾选需要操作的行")
      }
    },
    _tableChecked: function (recordArr) {
      this.tableCheckedList = recordArr
    },
    backParentPage() {
      this.isParentPage = true
      this.url = this.url + '?timestamp=' + new Date().getTime()
    },
    batchSet() {
      this.isParentPage = false
    },
    initC() {
      this.columns = [
        {
          id: 'province',
          title: "省份",
          className: 'text-left',
          hidden: false,
          width: 120,
          search: {
            type: "select",
            data: {
              url: '/api/archives/permissions/getProvinceList',
              optionsLabel: 'label',
              optionsValue: 'value',
              placeholder: "",
              change:  (obj)=> {
                sAjax({
                  url: "/api/archives/permissions/getProvinceSecond?value="+obj.value,
                  type: 'get',
                  success: (result) => {
                    this.provinceSecondArr = result.data
                    this.initC()
                  }
                })
              }
            }
          },
        },
        {
          id: 'provinceSecond',
          title: "地区",
          className: 'text-left',
          hidden: false,
          width: 120,
          search: {
            type: "select",
            data: {
              options: this.provinceSecondArr,
              optionsLabel: 'label',
              optionsValue: 'value',
              placeholder: "",
            }
          }
        },
        {
          id: 'middleSchoolName',
          title: "中学名称",
          className: 'text-left',
          hidden: false,
          width: 120,
          search: {
            type: 'input',
            data: {
              autoFocus: true,
              placeholder: "中学名称"
            }
          }
        }

      ]
    }
  }
}
</script>
<style lang="less">
#schoolStandard-page {
}
</style>
