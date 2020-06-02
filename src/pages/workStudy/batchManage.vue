<template>
  <div class="flow-batch-manage">
    <div class="">
      <v-table  title="批次管理" :url="`${tableUrl}?timeStamp=${timeStamp}`" pagesize="10" idField="id" :columns="columns" :multiple="false" :order="true" :search="false">
        <div slot="btn-group" class="btn-group pull-right" role="group">
          <a class="btn btn-bgColor-style clearBtnBorder " @click="createShow = true">新增</a>
        </div>
      </v-table>
    </div>
    <v-modal :show="createShow" width="300">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
            新增批次
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <v-select 
          v-model="batchYear"
          :required="true"
          :options="yearOptions"
          options-value="id"
          options-label="name"
        ></v-select>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <a type="button" class="btn orangered" @click="createShow = false">取消</a>
        <a type="button" class="btn green" @click="_release('publish')">发布</a>
        <a type="button" class="btn blue" @click="_release('save')">保存</a>
      </div>
    </v-modal>
  </div>
</template>
<script>
  import { sAjax, createTime } from '../../assets/utils/utils';
  export default {
    data: function () {
      return {
        createShow: false,
        batchYear: '',
        tableUrl: `/table-data/pwps/positions/page/schoolYears`,
        yearOptions: [],
        timeStamp: 0,
        columns: [{
          id: 'name',
          title: '学年',
          className: 'text-left',
          width: 150,
          hidden: false,
          search: {
            type: 'input',
            data: {
              placeholer: '',
              autoFocus: true
            }
          }
        }, {
          id: 'operatorName',
          title: '操作人',
          className: 'text-left',
          width: 100,
          hidden: false,
          formatter: (record) => {
            return `<span title="${record.operator.userNo}">${record.operator.name}</span>`
          }
        }, {
          id: 'publishTime',
          title: '发布时间',
          className: 'text-center',
          width: 150,
          hidden: false
        }, {
          id: 'opt',
          title: '操作',
          className: 'text-left',
          width: 100,
          hidden: false,
          formatter: (record) => {
            var opts = []
            if (record['schoolYearStatus'] !== 'PUBLISH') {
              opts.push({
                tag: 'a',
                text: '发布',
                className: 'opt-btn',
                callback: (record, index) => {
                  this._release('publish', record)
                  this._refreshTable()
                }
              })
            }
            opts.push({
              tag: 'a',
              text: '删除',
              className: 'opt-btn',
              callback: (record, index) => {
                this._remove(record, (data) => {
                  this.$toast('删除批次成功')
                  this._refreshTable()
                })
              }
            })
            return opts
          }
        }]
      }
    },
    methods: {
      _refreshTable: function () {
        this.timeStamp = createTime()
      },
      _release: function (type, batchRecord) {
        if ((!this.batchYear) && (!batchRecord)) {
          this.$toast('学年不能为空')
          return
        }
        if (type === 'save') {
          this._save((record) => {
            this.$toast('保存成功')
            this.batchYear = ''
            this.createShow = false
            this._refreshTable()
          })
        } else if (type === 'publish') {
          if (batchRecord) {
            this._publish(batchRecord, (res) => {
              this.$toast('发布成功')
              this.createShow = false
              this._refreshTable()
            })
          } else {
            this._save((record) => {
              this._publish(record, (res) => {
                this.$toast('发布成功')
                this.createShow = false
                this._refreshTable()
              })
            })
          }
        }
      },
      _save: function (cb) {
        // 待对接
        sAjax({
          url: `/api/pwps/positions/schoolYears`,
          type: 'post',
          data: {
            name: this.batchYear,
            schoolYearStatus: 'SAVE'
          },
          success: (data) => {
            if (data.state) {
              cb && cb(data.data)
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _publish: function (record, cb) {
        // 待对接
        sAjax({
          url: `/api/pwps/positions/schoolYears/publish/${record.id}`,
          type: 'post',
          success: (data) => {
            if (data.state) {
              cb && cb(data.data)
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _remove: function (record, cb) {
        // 待对接
        sAjax({
          url: `/api/pwps/positions/schoolYears/${record.id}`,
          type: 'post',
          success: (data) => {
            if (data.state) {
              cb && cb(data.data)
            } else {
              this.$toast(data.message)
            }
          }
        })
      }
    },
    created: function () {
      var year = (new Date()).getFullYear()
      this.yearOptions = []
      for (var i = year - 2; i < year + 8; i++) {
        this.yearOptions.push({
          id: `${i}-${i + 1}学年`,
          name: `${i}-${i + 1}学年`
        })
      }
    }
  }
</script>
<style lang="less">
.flow-batch-manage {
  .btn {
    border: none;
    box-shadow: none;
    outline: none;
    background: transparent;
  }
  .blue {
    // color: #fff;
    // background: #298df7;
  }
  .orangered {
    // color: #fff;
    // background: orangered;
  }
  .green {
    // color: #fff;
    // background: rgb(91, 204, 91);
  }
}
</style>
