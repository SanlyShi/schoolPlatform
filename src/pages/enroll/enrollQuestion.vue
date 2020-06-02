<template>
  <div id="enrollQuestion-page" class="relationship-page container-fluid">
    <v-table ref="studentTable" v-if="check" :url="url" pagesize="10" idField="id" :columns="columns" :multiple="true" :order="true" :search="false" @afterChecked="_tableChecked">
      <div slot="btn-group" role="group">
        <div class="btn-group pull-right">
          <button type="button" class="btn btn-bgColor-style clearBtnBorder" @click="addItem()">新增</button>
          <button type="button" class="btn btn-bgColor-style clearBtnBorder" @click="batchDel()">批量删除</button>
        </div>
      </div>
    </v-table>
    <div class="box-wrap" v-if="!check">
      <div class="title-div">
        <button type="button" class="btn back-btn clearBtnBorder btnclass" @click="_backList">
          <i class="maticon back-icon-btn" v-html="icons('arrow_back')">arrow_back</i>
          <span class="nav-title">返回</span>
        </button>
      </div>
      <div class="content-form">
        <div class="select-content">
          <div class="select-item">
            <p>属性：</p>
            <v-select class="inputM" :options="attributeArr" :value="editItem.attributeValue" optionsLabel="name" optionsValue="value" @afterSelected="afterSelectAttr"></v-select>
          </div>
          <div class="select-item">
            <p>问题标题：</p>
            <input class="inputM pro-inp" v-model="editItem.title"></input>
          </div>
        </div>
        <div class="text-item">
          <u-editor class="my-edit" v-model="editItem.content"></u-editor>
        </div>
        <div class="sumit-btn">
          <button type="button" class="btn btn-bgColor-style clearBtnBorder mybtn" @click="save()">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { sAjax, request } from "../../assets/utils/utils.js";
import { constants } from 'crypto';
export default {
  data() {
    return {
      tableCheckedList:[],
      check: true,
      isNew: false,
      attributeArr: [],
      tableCheckedList: [],
      url: "/table-data/archives/know/getListKnowLedge",
      columns: [],
      editItem: {
        id: "",
        attributeValue: "",
        title: "",
        content: ""
      }
    }
  },
  created() {
    sAjax({
      url: "/api/archives/demo/getSysDict?name=属性",
      type: "get",
      success: (result) => {
        this.attributeArr = result.data
      }
    })
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
    addItem() {
      this.editItem = {
        id: "",
        attributeValue: "",
        title: "",
        content: ""
      }
      this.check = false
      this.isNew = true
    },
    save() {
      if (this.isNew) {
        let data = {
          attribute: "",
          title: "",
          content: "",
          filePath: ""
        }
        data.attribute = this.editItem.attributeValue
        data.title = this.editItem.title
        data.content = this.editItem.content
        sAjax({
          url: "/api/archives/know/saveOneBase",
          data: data,
          type: "POST",
          success: (result) => {
            if (result.state) {
              this.$toast("新增成功")
              this.url = this.url + '?timestamp=' + new Date().getTime()
              this.check = true
            }
          }
        })

      }
      else {
        let data = {
          // id:"",
          attribute: "",
          title: "",
          content: "",
          filePath: ""
        }
        // data.id = this.editItem.id
        data.attribute = this.editItem.attributeValue
        data.title = this.editItem.title
        data.content = this.editItem.content
        sAjax({
          url: "/api/archives/know/" + this.editItem.id + "/updateOneBase",
          data: data,
          type: 'post',
          success: (result) => {
            if (result.state) {
              this.$toast("保存编辑成功")
              this.url = this.url + '?timestamp=' + new Date().getTime()
              this.check = true
            }
          }
        })
      }
    },
    afterSelectAttr(obj) {
      this.editItem.attributeValue = obj.value
    },
    _backList() {
      this.check = true
    },
    batchDel() {
      if (this.nowArr.length > 0) {
        let url = `/api/archives/know/deleteKnowLedge`
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
    _tableChecked: function (recordArr) {
      this.tableCheckedList = recordArr
    },
    initC() {
      this.columns = [
        {
          id: 'attribute',
          title: "属性",
          className: 'text-left',
          hidden: false,
          width: 120,
          search: {
            type: "select",
            data: {
              url: '/api/archives/demo/getSysDict?name=属性',
              optionsLabel: 'name',
              optionsValue: 'value',
              placeholder: ""
            }
          },
        },
        {
          id: 'title',
          title: "问题标题",
          className: 'text-left',
          hidden: false,
          width: 120,
          search: {
            type: "input",
            placeholder: "问题标题"
          }
        },
        {
          id: 'updateTime',
          title: "修改时间",
          className: 'text-left',
          hidden: false,
          width: 150
        },
        {
          id: 'userName',
          title: "操作人",
          className: 'text-left',
          hidden: false,
          width: 120
        },
        {
          id: 'opt',
          className: 'text-left',
          title: '操作',
          width: 50,
          hidden: false,
          formatter: () => {
            return [{
              tag: 'a',
              text: '编辑',
              className: 'opt-btn',
              callback: (record, index) => {
                this.isNew = false
                this.check = false
                this.editItem = {
                  id: "",
                  attributeValue: "",
                  title: "",
                  content: ""
                }
                this.editItem.id = record.id
                this.attributeArr.forEach((item) => {
                  if (item.name == record.attribute) {
                    this.editItem.attributeValue = item.value
                  }
                })
                this.editItem.content = record.content
                this.editItem.title = record.title
              }
            }]
          }
        }

      ]
    }
  }
}
</script>
<style lang="less">
#enrollQuestion-page {
  .box-wrap {
    .content-form {
      width: 100%;
      .select-content {
        width: 100%;
        .select-item {
          padding: 15px;
          padding-top: 2px;
          display: inline-block;
          .inputM {
            width: 80%;
          }
          p {
            font-weight: 600;
            font-size: 15px;
          }
        }
        .select-item:nth-child(1) {
          width: 49%;
          padding-left: 40px;
        }
        .select-item:nth-child(2) {
          width: 49%;
          .inputM {
            width: 100%;
          }
          .pro-inp {
            height: 32px;
            line-height: 32px;
            border: solid 1px #d9d9d9;
            border-radius: 5px;
            padding-left: 5px;
          }
        }
      }
      .text-item {
        padding-left: 40px;
        width: 98%;
      }
      .sumit-btn {
        width: 100%;
        padding: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        .mybtn {
          width: 200px;
        }
      }
    }
    .title-div {
      padding: 20px 5px;
    }
    width: 100%;
    background-color: #fff;
    height: 800px;
  }
  .back-icon-btn {
    font-size: 20px;
    line-height: 20px;
    cursor: pointer;
    vertical-align: text-bottom;
  }
}
</style>
