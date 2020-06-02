<template>
  <div class="stands-container">
    <div class="actions" v-if="!!stands.length">
      <div class="stand-stat" v-if="selectable || (canManage && published)">
        <span>{{ occupiedStandCount + selectedStandCount  }} / {{ stands.length }}</span>
      </div>
      <div class="stand-status-tip">
        <span class="empty" :class="{ 'is-active': standFilterStatus === 'empty' }" @click="filterStatus('empty')"><i></i>可用</span>
        <span class="occupied" :class="{ 'is-active': standFilterStatus === 'occupied' }" @click="filterStatus('occupied')"><i></i>已占用</span>
        <span class="applied" :class="{ 'is-active': standFilterStatus === 'applied' }" @click="filterStatus('applied')"><i></i>有人申请</span>
        <span class="selected" :class="{ 'is-active': standFilterStatus === 'selected' }" @click="filterStatus('selected')" v-if="selectable"><i></i>已选择</span>
      </div>
      <el-button type="primary" size="small" @click="addStand" v-if="canManage">新增展位</el-button>
      <el-button type="primary" size="small" @click="reserveStand" v-if="canManage && published">预留展位</el-button>
    </div>
    <ul class="stands">
      <transition name="el-zoom-in-top"
        v-for="(stand, index) in filteredStands"
        :key="'stand-' + index">
        <li
          :class="{
            selected: stand.selected,
            occupied: stand.occupied,
            applied: stand.applied
          }"
          class="stand"
          @dblclick="toEditStand(stand)"
          @click="selectStand(stand)"
        >
          <input
            type="text"
            v-model="stand.name"
            v-if="stand.editing"
            @blur="changeStand(stand)"
            @keyup.enter="changeStand(stand)"
            v-focus>
          <span v-else>{{ stand.name }}</span>
          <span
            class="delete"
            @click="deleteStand(stand, index)"
            v-if="canManage && !stand.applied && !stand.occupied">
            <i class="el-icon-close"></i>
          </span>
        </li>
      </transition>
    </ul>
    <div class="empty-stands" v-if="canManage && !stands.length">
      <span>未设置任何展位 <el-button type="primary" size="mini" @click="addStand">新增展位</el-button></span>
    </div>
  </div>

</template>

<script>
import { MessageBox } from 'element-ui'
import { Stand } from '../types'
import api from '../../../api/doubleChooseWill'

export default {
  props: {
    dcw: Object,
    canManage: Boolean,
    published: Boolean,
    selectable: Boolean,
    value: Array
  },
  data() {
    return {
      stands: JSON.parse(JSON.stringify(this.value)),
      initLength: this.dcw.standInfo.stands.length,
      standFilterStatus: null
    }
  },
  computed: {
    filteredStands() {
      return this.stands.filter(stand => {
        if (this.standFilterStatus === 'empty') {
          return !stand.occupied && !stand.applied
        }
        if (this.standFilterStatus === 'occupied') {
          return stand.occupied
        }
        if (this.standFilterStatus === 'applied') {
          return stand.applied
        }
        if (this.standFilterStatus === 'selected') {
          return stand.selected
        }
        return true
      })
    },
    occupiedStandCount() {
      let count = 0
      this.stands.forEach(stand => {
        if (stand.occupied || stand.applied) {
          ++count
        }
      })
      return count
    },
    selectedStandCount() {
      let count = 0
      this.stands.forEach(stand => {
        if (stand.selected) {
          ++count
        }
      })
      return count
    },
    maxSortOfStand() {
      let maxSort = -1
      this.stands.forEach(stand => {
        if (stand.sort > -1) {
          maxSort = stand.sort
        }
      })
      return maxSort
    }
  },
  watch: {
    stands: {
      deep: true,
      handler (val) {
        this.$emit('input', val)
        this.$emit('change', val)
      }
    }
  },
  methods: {
    async addStand() {
      MessageBox.prompt('请输入要新增的展位数量', { inputType: 'number' }).then(async ({ value }) => {
        if (!value) {
          return
        }
        const size = parseInt(value)
        const length = this.stands.length
        if (size === 0) {
          return
        }
        if (this.published) { // 已发布的需要变更到数据库
          if (size < 0 ) {
            this.$toast('展位已发布，请单个删除')
            return
          }
          const newStands = []
          for (let i = 0; i < size; ++i) {
            newStands.push(new Stand({ name: (this.initLength + i + 1) + '', sort: (this.maxSortOfStand + 1 + i) }))
          }
          this.renameStandIfDuplicated(newStands)
          const { state, message, data: insertedStands } = await api.stand.addStands(this.dcw.id, newStands)
          if (state) {
            if (insertedStands.length !== size) {
              console.warn('inserted size is no equal to the size it should be', insertedStands.length, size)
            }
            for (const insertedStand of insertedStands) {
              this.stands.push(Stand.fromApi(insertedStand))
            }
            this.initLength += insertedStands.length
          } else {
            this.$toast(message)
          }
        } else {
          this.renderStand(size)
        }
      })
    },
    renderStand(size) {
      const length = this.stands.length
      if (size === 0) {
        return
      }
      if (size > 0) {
        const newStands = []
        for (let i = 0; i < size; ++i) {
          newStands.push(new Stand({ id: +new Date() + '' + i, name: (this.initLength + i + 1) + '' }))
        }
        this.renameStandIfDuplicated(newStands)
        this.stands.push(...newStands)
      } else {
        this.stands.splice(length + size , -size)
      }
      this.initLength += size
    },
    async reserveStand() {
      this.$emit('to-reserve-dcw')
    },
    async deleteStand(stand, index) {
      if (stand.addedToServer) {
        await this.deletePublishedStand(stand, index)
      } else {
        await this.deleteNewStand(stand, index)
      }
    },
    async deletePublishedStand(stand, index) {
      MessageBox.confirm(`是否删除展位${stand.name}?`).then(async () => {
        const { state, message, data: deletable } = await api.stand.isStandDeletable(stand.id)
        if (state) {
          if (deletable) {
            const { state, message } = await api.stand.deleteStand(stand.id)
            if (state) {
              this.$toast('删除成功')
              this.stands.splice(index, 1)
            } else {
              this.$toast(message)
            }
          } else {
            this.$toast('该展位已被占用，无法删除，请刷新页面查看最新数据')
          }
        } else {
          this.$toast(message)
        }
      })
    },
    async deleteNewStand(stand, index) {
      this.stands.splice(index, 1)
      const h = this.$createElement;
      const message = this.$message({
        type: 'warning',
        duration: 6000,
        message: h('p', null, [
          h('span', null, `展位 ${stand.name} 已删除`),
          h('a', {
            style: 'position: absolute; right: 16px; top: 16px',
            on: {
              click: () => {
                this.stands.splice(index, 0, stand)
                message.close()
              }
            }
          }, '撤销')
        ])
      });
    },
    filterStatus(status) {
      if (this.standFilterStatus === status) {
        this.standFilterStatus = null
      } else {
        this.standFilterStatus = status
      }
    },
    toEditStand(stand) {
      if (!this.canManage) {
        return
      }
      stand.editing = true
    },
    async changeStand(stand) {
      stand.editing = false
      this.renameStandIfDuplicated([stand])
      if (this.published) {
        const { state, message } = await api.stand.update(stand)
        if (state) {
          this.$toast('更新成功')
        } else {
          this.$toast(message)
        }
      }
    },
    selectStand(stand) {
      if (!this.selectable) {
        return
      }
      if (stand.occupied) {
        return
      }
      if (stand.applied) {
        return
      }
      if (stand.selected) {
        stand.selected = false
        return
      }

      const limitSelected = this.dcw.standInfo.canSelectMultiStands ? this.dcw.standInfo.limitStandsSelected : 1

      if (this.selectedStandCount === limitSelected) {
        if (limitSelected === 1) {
          this.cancelSelectStand()
          stand.selected = true
        } else {
          this.$toast(`最多可选择${limitSelected}个展位`)
        }
      } else {
        stand.selected = true
      }
      this.$emit('select-stands', this.stands.filter(stand => stand.selected))
    },
    cancelSelectStand() {
      this.stands.forEach(stand => {
        stand.selected = false
      })
    },
    renameStandIfDuplicated(stands = []) {
      for (let stand of stands) {
        let sameNameStand = this.findSameNameStand(stand)

        while (sameNameStand) {
          this.renameStand(stand, sameNameStand)
          sameNameStand = this.findSameNameStand(stand)
        }
      }
    },
    findSameNameStand(stand) {
      return this.stands.find(currentStand => currentStand.id !== stand.id && currentStand.name === stand.name)
    },
    renameStand(stand, sameNameStand) {
      let serialNo = 0
      if (this.isEndWithSerialNo(sameNameStand.name)) {
        const serialNoStr = this.getSerialNoStrOfName(sameNameStand.name)
        if (serialNoStr) {
          serialNo = parseInt(serialNoStr.substring(1, serialNoStr.length - 1))
          stand.name = stand.name.substring(0, stand.name.length - serialNoStr.length)
        }
      }
      stand.name = `${stand.name}（${serialNo + 1}）`
    },
    isEndWithSerialNo(name) {
      return /\（\d+\）$/.test(name)
    },
    getSerialNoStrOfName(name) {
      return name.match(/\（\d+\）$/)[0]
    }
  }
}
</script>


<style lang="less" scoped>

.stands-container {
  padding: 24px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  justify-items: center;
  margin-bottom: 12px;
  line-height: 32px;
  .stand-stat {
    margin-right: 36px;
    font-size: 15px;
    color: #999;
  }
  .stand-status-tip {
    flex: 1;
    color: #999;
    font-size: 14px;
    i {
      margin-right: 8px;
      transform: translateY(-2px);
    }
    & > span {
      cursor: pointer;
      padding: 7px 10px;
      border-radius: 2px;
      margin-right: 15px;
      i {
        width: 18px;
        height: 18px;
        border-radius: 50%;
      }

      &.is-active {
        color: #666;
        background: rgba(62, 146, 254, 0.1);
      }
    }
    .empty {
      i {
        background: white;
        border: 1px solid #979797;
      }
      &.is-active {
        i {
          border-color: #666;
        }
      }
    }
    .occupied {
      i {
        background: #f5f5f5;
        border: 1px solid #ccc;
      }
      &.is-active {
        i {
          border-color: #aaa;
          background: #efefef;
        }
      }
    }
    .applied {
      i {
        background: rgba(255, 193, 7, 0.14);
        border: 1px solid #f7cf56;
      }
    }
    .selected {
      i {
        background: rgba(62,146,254,0.20);
        border: 1px solid #3e92fe;
      }
      &.is-active {
        i {
          background: rgba(62, 146, 254, 0.3);
        }
      }
    }
  }
}
.stands {
  display: flex;
  justify-content: flex-start;
  justify-items: flex-start;
  flex-wrap: wrap;
  margin-top: 24px;
  margin-left: -10px;
  margin-right: -10px;
  padding: 0;
  .stand {
    border:1px solid #979797;
    border-radius:4px;
    width:58px;
    height:72px;
    margin-left: 15px;
    margin-right: 15px;
    margin-bottom: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.1s;
    position: relative;
    cursor: pointer;
    &.selected {
      background: rgba(62,146,254,0.20);
      border: 1px solid #3e92fe;
      color: #3e92fe;
    }

    &.applied {
      background: rgba(255, 193, 7, 0.14);
      border: 1px solid #f7cf56;
      color: #f7cf56;
    }

    &.occupied {
      background: #f5f5f5;
      border: 1px solid #ccc;
      color: #bbb;
      cursor: not-allowed;
    }

    .delete {
      display: none;
      width: 20px;
      height: 20px;
      background: #f36d6d;
      border-radius: 50%;
      color: white;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      position: absolute;
      top: -10px;
      right: -10px;
    }
    &:hover {
      .delete {
        display: flex;
      }
    }

    input {
      border-top: none;
      border-left: none;
      border-right: none;
      border-bottom: 1px solid #979797;
      width: 80%;
      margin: 0 10%;
      text-align: center;
      &:focus {
        border-top: none;
        border-left: none;
        border-right: none;
        border-bottom: 1px solid #409EFF;
      }
    }
  }
}
.empty-stands {
  border: 1px dashed #aaa;
  display: flex;
  justify-content: center;
  justify-items: center;
  flex-wrap: wrap;
  height: 100px;
  font-size: 14px;
  color: #979797;
  border-radius: 6px;
  font-size: 14px;
  color: #979797;
  span {
    display: flex;
    justify-content: center;
    align-items: center;
    button {
      margin-left: 12px;
    }
  }
}

.stand-units {
  margin-top: 20px;
}

.el-table td {
  padding: 5px 0;
}
</style>

