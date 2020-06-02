<template>
  <div class="container-fluid payhall-records-page">
    <div class="row">
      <v-table
        :url="url"
        pagesize="9999"
        idField="id"
        :columns="columns"
        :order="true"
        :paginationShow="false"
        search
      ></v-table>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      data: {
        default: null
      }
    },
    data: function () {
      return {
        url: '/table-data/payment/getpayrecord',
        columns: [],
        statusStr: {
          NOT_PAID: '未缴费',
          PAID_ONLINE: '在线缴费',
          PAID_OFFLINE: '线下缴费'
        },
        pageOptions: {
          statusOptions: [{
          //   id: 'NOT_PAID',
          //   label: '未缴费'
          // }, {
            id: 'PAID_ONLINE',
            label: '在线缴费'
          }, {
            id: 'PAID_OFFLINE',
            label: '线下缴费'
          }],
          yearOptions: []
        }
      }
    },
    methods: {
      _initColumns: function () {
        this.columns = [{
          id: 'orderNum',
          title: '订单号',
          width: 120,
          className: 'text-center',
          hidden: false,
          formatter: (record, index) => {
            return record.orderNum || '-'
          }
        }, {
          id: 'year',
          title: '学年',
          width: 100,
          hidden: false,
          search: {
            type: 'select',
            data: {
              options: this.pageOptions.yearOptions,
              optionsLabel: 'label',
              optionsValue: 'id'
            }
          },
          formatter: (record, index) => {
            return `${record.year}-${parseInt(record.year) + 1}学年`
          }
        }, {
          id: 'name',
          title: '缴费项目',
          width: 100,
          hidden: false,
          search: {
            type: 'input'
          }
        }, {
          id: 'amount',
          title: '应缴金额',
          width: 60,
          hidden: false,
          className: 'text-right'
        }, {
          id: 'amountPaid',
          title: '实缴金额',
          width: 60,
          hidden: false,
          className: 'text-right'
        }, {
          id: 'status',
          title: '缴费状态',
          width: 80,
          hidden: false,
          search: {
            type: 'select',
            data: {
              options: this.pageOptions.statusOptions,
              optionsLabel: 'label',
              optionsValue: 'id'
            }
          },
          formatter: (record, index) => {
            return this.statusStr[record.status]
          }
        }, {
          id: 'payTime',
          title: '缴费时间',
          width: 180,
          hidden: false,
          className: 'text-center',
          search: {
            type: 'datetime',
            data: {
              dateFormat: 'yyyy-MM-dd hh:ii:ss'
            }
          }
        }, {
          id: 'orderDetails',
          title: '缴费明细',
          width: 180,
          hidden: false
        }, {
          id: 'opts',
          title: '操作',
          width: 96,
          hidden: false,
          className: 'text-left',
          options: [{
            tag: 'a',
            text: '查看',
            callback: (record, index) => {
              this.$emit('addBread', {
                route: '/payHall/payHallApplication?recordId=' + record.projectId,
                title: record.name,
                data: record
              })
            }
          },{
            tag: 'a',
            text: '打印发票',
            callback: (record, index) => {
              this.$toast('暂未开放')
            }
          }]
        }]
      },
      _initOptions: function () {
        this.pageOptions.yearOptions = []
        var year = (new Date()).getFullYear()
        for (var i = year - 6; i < year + 8; i++) {
          this.pageOptions.yearOptions.push({
            id: i + '',
            label: `${i}-${i+1}学年`
          })
        }
      }
    },
    created: function () {
      this._initOptions()
      this._initColumns()
    }
  }
</script>
<style lang="less">
</style>
