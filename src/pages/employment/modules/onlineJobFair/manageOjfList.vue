<template>
  <div>
    <v-table ref="manageListTable" :url="tableUrl" :columns="table.columns" pagesize="20" idField="id" :multiple="false" :order="true" :search="false">
      <div slot="btn-group" class="pull-right">
        <el-button type="primary" @click="toCreateOjf">新增网招会</el-button>
      </div>
    </v-table>
  </div>
</template>

<script>
  import { MessageBox } from 'element-ui'
  import { Ojf } from './types'
  import NewOjf from './newOjf.vue'
  import api from '../../api/onlineJobFair'

  export default {
    components: {
      NewOjf,
    },
    data() {
      return {
        ojf: new Ojf(),
        table: {
          url: '/table-data/employment/manage/networkMeeting/getNetworkMeetingList?ts=',
          search: {
            ts: +new Date(),
            beginTime: '',
            endTime: ''
          },
          columns: [
            {
              id: 'name',
              title: "网招会名称",
              className: "text-left",
              width: 150,
              hidden: false,
              search: {
                type: '',
                data: {
                  placeholer: '网招会名称',
                  autoFocus: false
                }
              },
              formatter: (record) => {
                const ojf = Ojf.fromApi(record)
                return ojf.getNameHtmlWithStatus()
              }
            }, {
              id: 'time',
              title: '网招会时间',
              className: 'text-left line-height-normal',
              width: 145,
              hover: false,
              hidden: false,
              search: {
                type: 'datetime',
                data: {
                  placeholder: '网招会',
                  dateFormat: 'yyyy-MM-dd',
                  change: ({ value, target }) => {
                    let beginTime = this.$refs.manageListTable.tableSearchFields['time_start']
                    let endTime = this.$refs.manageListTable.tableSearchFields['time_end']
                    this.table.search.beginTime = beginTime ? beginTime.split(' ')[0] + ' 00:00:00' : ''
                    this.table.search.endTime = endTime ? endTime.split(' ')[0] + ' 23:59:59' : ''
                  }
                }
              },
              formatter: (record) => {
                return new Date(record.beginTime).format('yyyy-MM-dd HH:mm') + '~<br/>' + new Date(record.endTime).format('yyyy-MM-dd HH:mm')
              }
            }, {
              id: 'applyTime',
              title: '网招会申请时间',
              className: 'text-left line-height-normal',
              width: 140,
              hidden: false,
              hover: false,
              formatter: (record) => {
                return new Date(record.applyBeginTime).format('yyyy-MM-dd HH:mm') + '~<br/>' + new Date(record.applyEndTime).format('yyyy-MM-dd HH:mm')
              }
            }, {
              id: 'opt',
              title: "操作",
              width: 120,
              hidden: false,
              formatter: (record) => {
                const ojf = Ojf.fromApi(record)
                const opts = {
                  show: {
                    tag: 'a',
                    text: '查看',
                    callback: (record, index) => {
                      this.showOjf(ojf)
                    }
                  },
                  publish: {
                    tag: 'a',
                    text: '发布',
                    callback: (record, index) => {
                      this.publish(ojf)
                    }
                  },
                  setTop: {
                    tag: 'a',
                    text: '置顶',
                    callback: (record, index) => {
                      this.changeTop(ojf, true)
                    }
                  },
                  downTop: {
                    tag: 'a',
                    text: '取消置顶',
                    callback: (record, index) => {
                      this.changeTop(ojf, false)
                    }
                  },
                  unShelve: {
                    tag: 'a',
                    text: '下架',
                    callback: (record, index) => {
                      this.unShelve(ojf)
                    }
                  },
                  shelve: {
                    tag: 'a',
                    text: '上架',
                    callback: (record, index) => {
                      this.shelve(ojf)
                    }
                  }
                }
                const validOpts = [ opts.show ]
                if (!ojf.published) {
                  validOpts.push(opts.publish)
                } else {
                  if (ojf.unShelved) {
                    validOpts.push(opts.shelve)
                  } else {
                    validOpts.push(opts.unShelve)
                  }
                }
                if (ojf.top) {
                  validOpts.push(opts.downTop)
                } else {
                  validOpts.push(opts.setTop)
                }

                return validOpts
              }
            }
          ]
        }
      }
    },
    computed: {
      tableUrl() {
        return `${this.table.url}&beginTime=${this.table.search.beginTime || ''}&endTime=${this.table.search.endTime || ''}&ts=${this.table.search.ts}`;
      }
    },
    methods: {
      toCreateOjf() {
        this.$emit('to-create-ojf')
      },
      async showOjf(ojf) {
        this.$emit('to-detail', ojf)
      },
      async unShelve(ojf) {
        MessageBox.confirm(`确认下架${ojf.name}?`).then(async () => {
          const { state, message, data } = await api.unShelve(ojf.id)
          if (state) {
            this.$toast('下架成功')
            this.refreshTable()
          } else {
            this.$toast(message)
          }
        })
      },
      async shelve(ojf) {
        MessageBox.confirm(`确认上架${ojf.name}?`).then(async () => {
          const { state, message, data } = await api.shelve(ojf.id)
          if (state) {
            this.$toast('上架成功')
            this.refreshTable()
          } else {
            this.$toast(message)
          }
        })
      },
      async publish(ojf) {
        MessageBox.confirm(`确认发布${ojf.name}?`).then(async () => {
          const { state, message, data } = await api.publish(ojf.id)
          if (state) {
            this.$toast('发布成功')
            this.refreshTable()
          } else {
            this.$toast(message)
          }
        })
      },
      async changeTop(ojf, isTop) {
        const { state, message, data } = await api.changeTop(ojf.id, isTop)
        if (state) {
          this.$toast('置顶成功')
          this.refreshTable()
        } else {
          this.$toast(message)
        }
      },
      refreshTable() {
        this.table.search.ts = +new Date()
      },
    }
  }
</script>
