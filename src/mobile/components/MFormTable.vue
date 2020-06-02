<!--  -->
<template>
  <div class="mTable_wrap">
    <div class="mTable_title">{{title}}</div>
    <div v-for="(row,index) in tableData" :key="index" class="c-list-item">
      <div v-for="(column,i) in columns" :key="i" class="child box_flex box_between align_center">
        <div class="column_title flex_shrink">
          <img v-if="i>0&&row.tableFields[i-1].properties.authority==='required'" class="require" src="../../assets/img/xinghao.png" />
          {{column.title?column.title:'#'}}</div>
        <div
          class="column-content column-opts box_flex box_between align_center"
          :class="column.className"
          v-if="_getColumnOptions(column, row, i)"
        >
          <div>{{column.title?'':index+1}}</div>
          <button
            class="btn btn-xs"
            :class="opt.className"
            v-for="(opt,oi) in _getColumnOptions(column, row, i)"
            :key="oi"
            @click.stop="opt.callback&&opt.callback(row,i)"
            v-html="opt.text"
            v-if="opt.tag=='button'"
          >{{opt.text}}</button>
          <div class="btn-group" v-else-if="opt.tag=='button-group'">
            <button
              class="btn dropdown-toggle"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              :class="opt.className"
              v-html="opt.text"
            >
              {{opt.text}}
              <!-- <span class="caret"></span> -->
            </button>
            <ul class="dropdown-menu">
              <li
                v-for="(o,key) in opt.optList"
                :key="key"
                @click.stop="o.callback&&o.callback(row,index)"
              >
                <a href="javascript:;" v-html="o.text">{{o.text}}</a>
              </li>
            </ul>
          </div>
          <a
            class="opt-btn"
            :class="opt.className"
            :href="opt.href||'javascript:;'"
            @click.stop="opt.callback&&opt.callback(row,index)"
            v-html="opt.text"
            v-else-if="opt.tag=='a'"
          >{{opt.text}}</a>
          <p
            class="table-p"
            :class="opt.className"
            v-html="opt.text"
            v-else-if="opt.tag=='p'"
          >{{opt.text}}</p>
          <img
            :title="opt.text||'img'"
            :class="opt.className"
            :src="opt.src"
            @click.stop="opt.callback&&opt.callback(row,index)"
            v-else-if="opt.tag=='img'"
          />
          <span v-else>{{translate.unsigned}}</span>
        </div>
        <div class="column-content" v-else-if="column.edit">
          <v-select
            class="btn-block info-value row-edit-wigt"
            :options="(column.edit.data&&column.edit.data.options)||[]"
            :value="newVal[row[idField]]&&newVal[row[idField]][column.id]"
            :placeholder="(column.edit.data&&column.edit.data.placeholder)||column.title"
            options-value="id"
            options-label="name"
            search
            close-on-select
            @afterSelected="_afterSelect($event, column, row)"
            v-if="column.edit.type === 'select'"
          ></v-select>
          <v-select
            class="btn-block info-value row-edit-wigt"
            :options="(column.edit.data&&column.edit.data.options)||[]"
            :value="newVal[row[idField]]&&newVal[row[idField]][column.id]"
            :placeholder="(column.edit.data&&column.edit.data.placeholder)||column.title"
            options-value="id"
            options-label="name"
            search
            multiple
            @afterSelected="_afterSelect($event, column, row)"
            v-else-if="column.edit.type === 'multiSelect'"
          ></v-select>
          <v-datepicker
            class="info-value btn-block row-edit-wigt"
            width="100%"
            :placeholder="(column.edit.data&&column.edit.data.placeholder)||column.title"
            :value="newVal[row[idField]]&&newVal[row[idField]][column.id]"
            :showTime="false"
            :format="column.edit.data&&column.edit.data.dateFormat"
            @daySelected="_daySelect($event, column, row)"
            v-else-if="column.edit.type === 'datetime'"
          ></v-datepicker>
          <div
            v-else-if="column.edit.type === 'datetime'"
          >{{newVal[row[idField]]&&newVal[row[idField]][column.id]}}</div>
          <input
            type="number"
            class="row-edit-input"
            min="0"
            :placeholder="(column.edit.data&&column.edit.data.placeholder)||column.title"
            v-model="newVal[row[idField]][column.id]"
            @focus="_edit(column, row)"
            @change="_save(column, row)"
            v-else-if="column.edit.type === 'number'"
          />
          <input
            type="text"
            class="row-edit-input"
            :placeholder="(column.edit.data&&column.edit.data.placeholder)||column.title"
            v-model="newVal[row[idField]][column.id]"
            @focus="_edit(column, row)"
            @change="_save(column, row)"
            v-else
          />
        </div>
        <div
          class="column-content"
          v-html="(column.formatter&&column.formatter(row, i))||row[column.id]"
          v-else-if="!column.edit"
        >{{(column.formatter&&column.formatter(row, i))||row[column.id]}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { request } from "../../assets/utils/utils.js";
export default {
  props: {
    // 唯一标记字段
    idField: {
      required: true
    },
    // 表格名称
    title: {
      default: ""
    },
    // 表头结构
    columns: {
      required: true,
      default: null
    },
    // 行数据
    rows: {
      default: []
    },
    needSaveEdit: {
      //编辑状态的时候 是否需要保存编辑信息
      default: false
    }
  },
  components: {},
  data() {
    return {
      tableData: [],
      hasInitEditValueList: [], //存储已经编辑过的字段的id
      newVal: {} //表单编辑状态下的存储对象
    };
  },
  computed: {},
  watch: {
    rows(newVal) {
      this.tableData = newVal
      this._initEditValue(this.tableData);
    }
  },
  methods: {
    _getColumnOptions: function(column, row, i) {
      if (column.options) {
        return column.options;
      } else if (
        column.formatter &&
        typeof column.formatter(row, i) === "object"
      ) {
        return column.formatter(row, i);
      } else {
        return null;
      }
    },
    _initEditValue: function(pageData) {
      pageData.forEach(row => {
        if (this.hasInitEditValueList.indexOf(row[this.idField]) !== -1) {
          return;
        }
        if (this.needSaveEdit) {
          this.hasInitEditValueList.push(row[this.idField]);
        }
        this.columns.forEach(column => {
          if (column.edit) {
            if (!this.newVal[row[this.idField]]) {
              this.$set(this.newVal, row[this.idField], {});
            }
            this.$set(
              this.newVal[row[this.idField]],
              column.id,
              row[column.id]
            );
          }
        });
      });
    },
    _edit: function(col, row) {
      // this.editing[col.id] = true
      if (this.needSaveEdit) {
        return;
      }
      if (!this.newVal[row[this.idField]]) {
        this.$set(this.newVal, row[this.idField], {});
      }
      this.$set(this.newVal[row[this.idField]], col.id, row[col.id]);
    },
    _save: function(col, row) {
      // this.editing[col.id] = false
      this.$emit("saveEdit", {
        row: row,
        name: col.id,
        value: this.newVal[row[this.idField]][col.id]
      });
      this.$emit("change", {
        row: row,
        name: col.id,
        value: this.newVal[row[this.idField]][col.id]
      });
    },
    _afterSelect: function(obj, column, row) {
      if (!this.newVal[row[this.idField]]) {
        this.$set(this.newVal, row[this.idField], {});
      }
      this.$set(this.newVal[row[this.idField]], column.id, obj.value);
      this._save(column, row);
    },
    _daySelect: function(obj, column, row) {
      if (!this.newVal[row[this.idField]]) {
        this.$set(this.newVal, row[this.idField], {});
      }
      this.$set(this.newVal[row[this.idField]], column.id, obj.value);
      this._save(column, row);
    }
  },
  mounted() {
    this.tableData = this.rows
    this._initEditValue(this.tableData);
  }
};
</script>

<style lang="less" scoped>
.mTable_wrap {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-overflow-scrolling: touch;
  .mTable_title {
    font-size: 0.4267rem;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(48, 49, 51, 1);
    line-height: 1.1733rem;
    height: 1.1733rem;
    letter-spacing: 0.0266rem;
  }
  .c-list-item {
    position: relative;
    background-color: #fff;
    border-radius: 0.2rem;
    padding: 0.2rem 0.2667rem 0.1333rem;
    margin-bottom: 0.32rem;
    box-shadow: 0px 10px 20px 0 rgba(220,223,230,.4);
    border-radius: 0.2133rem;
    .child {
      width: 100%;
      height: 1.3333rem;
      border-bottom: 0.0267rem solid #ececee;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    &:last-child{
       border-bottom: none;
    }
      .column_title {
        width: 2.8rem;
        overflow: hidden;
        text-overflow: ellipsis;
        .require{
          width:.25rem;
          position:relative;
          top:-.03rem;
          margin-right:.05rem;
          vertical-align: unset;
        }
      }
      .column-content {
        width: 5.8667rem;
        .row-edit-input {
          border: none;
          outline: none;
          color: #303133;
          width:100%;
        }
        .info-value {
          border: none;
        }
      }
      &.left {
        text-align: left;
      }
      &.right {
        text-align: right;
      }
      &.isFirst {
        color: #303133;
        font-size: 17px;
      }
      color: #606266;
      font-size: 15px;
    }
    .c-item-row {
      display: flex;
      justify-content: space-between;
      color: #606266;
      font-size: 13px;
      line-height: 24px;
    }
    .c-h6 {
      font-size: 17px;
      color: #303133;
      font-weight: 500;
    }
  }
  .no-data {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    color: #303133;
    height: 100%;
    img {
      width: 250px;
      height: 230px;
    }
  }
  .no-more {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px 0 10px;
    text-align: center;
    font-size: 10px;
    color: #868789;
    .line {
      width: 102px;
      height: 1px;
      background-color: #cbcacf;
      margin: 0 16px;
    }
  }
}
</style>