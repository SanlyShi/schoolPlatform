import { request ,sAjax} from '../assets/utils/utils'
export default {
  data() {
    return {
      showSearchModel: false,
      oldUrl: false,
      advancedSearchParams: '',
      advancedSearch: {
        show: false,
        initialized: false,
        searchItems: [],
        tables: {},
        tableKeys: {},
        tableOptions: [],
        keys: {},
        andOr: [{ value: 'a', label: '且' }, { value: 'o', label: '或' }]
      }
    }
  },
  methods: {
    addSearchItem() {
      this.advancedSearch.searchItems.push({
        value: null,
        andOr: 'a',
        advancedSearchParams: '',
        conditionVal: '',
        condition: [],
        province: null,
        tableChild: '',
        city: null,
        area: null
      })
    },
    getTableChildList(table) {
      console.log('table', table)
      for (var i in this.advancedSearch.tableOptions) {
        if (this.advancedSearch.tableOptions[i].name === table) {
          return this.advancedSearch.tableOptions[i].childFields
        }
      }
    },
    deleteSearchItem(index) {
      this.advancedSearch.searchItems.splice(index, 1)
      if (this.needAdvance) {
        this.advanceSelected()
      }
    },
    execAdvancedSearch() {
      this.computedResult()
      this.showSearchModel = false
    },
    computedResult() {
      this.advancedSearchParams = ''
      this.advancedSearch.searchItems.forEach(element => {
        let paramsStr = ''
        let hasAnd = false
        if (element.values && element.values.indexOf('&') !== -1) {
          hasAnd = true
          element.values = element.values.replace('&', '%26')// 转义一下,避免后端误以为是拆分
        }
        if (element.table.indexOf('table') !== -1 || element.table.indexOf('nameCard') !== -1) { // 如果是表格或者名片
          if (element.tableChild) {
            paramsStr = `fs_${element.andOr}_${element.table}-${element.tableChild}_${element.childConditionVal}=${element.values ? element.values : true}`
          } else {
            paramsStr = `fs_${element.andOr}_${element.table}_${element.conditionVal}=${element.values ? element.values : true}`
          }
        } else if (element.table.indexOf('address') !== -1) { // 如果是省市地
          paramsStr = `fs_${element.andOr}_${element.table}_${element.conditionVal}=${element.province ? element.province : true}`
          if (element.city) {
            paramsStr += ',' + element.city
            if (element.area) {
              paramsStr += ',' + element.area
            }
          }
        } else {
          paramsStr = `fs_${element.andOr}_${element.table}_${element.conditionVal}=${element.values ? element.values : true}`
        }
        this.advancedSearchParams = this.advancedSearchParams + '&' + paramsStr
        if (hasAnd) {
          element.values = element.values.replace('%26', '&') // 转回去,
        }
      })
    },
    getAddressOptions(type, name, name2) {
      if (type === 'province') {
        return this.provinceList
      } else if (type === 'city') {
        return this._getCityList(name)
      } else if (type === 'area') {
        return this._getAreaList(name, name2)
      }
    },
    _showSearch() {
      if (!this.curCountNodeId && !this.playerId) {
        this.showSearchModel = true
        return
      }
      let url = `/api/formEngine/business/${
        this.curBusinessId
        }/search/fields?nodeId=${this.curCountNodeId ? this.curCountNodeId : this.playerId}`
      request(url).then(o => {
        if (o.state) {
          this.advancedSearch.tableOptions = o.data
          this.showSearchModel = true
        }
      })
    },
    getInOptions(table, tableChild) {
      for (var i in this.advancedSearch.tableOptions) {
        if (this.advancedSearch.tableOptions[i].name === table) {
          if (tableChild) {
            for (var j in this.advancedSearch.tableOptions[i].childFields) {
              if (this.advancedSearch.tableOptions[i].childFields[j].name === tableChild) {
                return this.advancedSearch.tableOptions[i].childFields[j].options.map(o => {
                  return { label: o, value: o }
                })
              }
            }
          } else {
            return this.advancedSearch.tableOptions[i].options.map(o => {
              return { label: o, value: o }
            })
          }
        }
      }
    },
    getChildInOptions(table) {
      for (var i in this.advancedSearch.tableOptions) {
        if (this.advancedSearch.tableOptions[i].name === table) {
          return this.advancedSearch.tableOptions[i].options.map(o => {
            return { label: o, value: o }
          })
        }
      }
    },
    advanceSelected(type, item) { // 控件下拉框事件 item.table 是指控件的名字 input_12345566 我命名不规范,但是不敢改
      if (type === 'table') {
        if (item.table.indexOf('input') !== -1) {
          item.condition = [
            { value: 'eq', label: '等于' },
            { value: 'ne', label: '不等于' },
            { value: 'include', label: '包含' },
            { value: 'exclude', label: '不包含' },
            { value: 'filled', label: '已填' },
            { value: 'empty', label: '未填' }
          ]
        } else if (item.table.indexOf('select') !== -1 || item.table.indexOf('radio') !== -1) {
          item.condition = [
            { value: 'eq', label: '等于' },
            { value: 'ne', label: '不等于' },
            { value: 'in', label: '在列表中' },
            { value: 'nin', label: '不在列表中' },
            { value: 'filled', label: '已填' },
            { value: 'empty', label: '未填' }
          ]
        } else if (item.table.indexOf('checkbox') !== -1) {
          item.condition = [
            { value: 'eq', label: '等于' },
            { value: 'ne', label: '不等于' },
            { value: 'include', label: '包含' },
            { value: 'exclude', label: '不包含' },
            { value: 'in', label: '在列表中' },
            { value: 'nin', label: '不在列表中' },
            { value: 'filled', label: '已填' },
            { value: 'empty', label: '未填' }
          ]
        } else if (item.table.indexOf('number') !== -1) {
          item.condition = [
            { value: 'eq', label: '等于' },
            { value: 'ne', label: '不等于' },
            { value: 'gt', label: '大于' },
            { value: 'lt', label: '小于' },
            { value: 'filled', label: '已填' },
            { value: 'empty', label: '未填' }
          ]
        } else if (item.table.indexOf('address') !== -1) {
          item.condition = [
            { value: 'eq', label: '等于' },
            { value: 'ne', label: '不等于' },
            { value: 'filled', label: '已填' },
            { value: 'empty', label: '未填' }
          ]
        } else if (item.table.indexOf('label') !== -1 || item.table.indexOf('splitLine') !== -1) {
          item.condition = []
        } else {
          item.condition = [
            { value: 'filled', label: '已填' },
            { value: 'empty', label: '未填' }
          ]
        }
      } else if (type === 'tableChild') {
        if (item.tableChild.indexOf('input') !== -1) {
          item.childCondition = [
            { value: 'eq', label: '等于' },
            { value: 'ne', label: '不等于' },
            { value: 'include', label: '包含' },
            { value: 'exclude', label: '不包含' },
            { value: 'filled', label: '已填' },
            { value: 'empty', label: '未填' }
          ]
        } else if (item.tableChild.indexOf('select') !== -1 || item.tableChild.indexOf('radio') !== -1) {
          item.childCondition = [
            { value: 'eq', label: '等于' },
            { value: 'ne', label: '不等于' },
            { value: 'in', label: '在列表中' },
            { value: 'nin', label: '不在列表中' },
            { value: 'filled', label: '已填' },
            { value: 'empty', label: '未填' }
          ]
        } else if (item.tableChild.indexOf('checkbox') !== -1) {
          item.childCondition = [
            { value: 'eq', label: '等于' },
            { value: 'ne', label: '不等于' },
            { value: 'include', label: '包含' },
            { value: 'exclude', label: '不包含' },
            { value: 'in', label: '在列表中' },
            { value: 'nin', label: '不在列表中' },
            { value: 'filled', label: '已填' },
            { value: 'empty', label: '未填' }
          ]
        } else if (item.tableChild.indexOf('number') !== -1) {
          item.childCondition = [
            { value: 'eq', label: '等于' },
            { value: 'ne', label: '不等于' },
            { value: 'gt', label: '大于' },
            { value: 'lt', label: '小于' },
            { value: 'filled', label: '已填' },
            { value: 'empty', label: '未填' }
          ]
        } else if (item.tableChild.indexOf('address') !== -1) {
          item.childCondition = [
            { value: 'eq', label: '等于' },
            { value: 'ne', label: '不等于' },
            { value: 'filled', label: '已填' },
            { value: 'empty', label: '未填' }
          ]
        } else if (item.tableChild.indexOf('label') !== -1 || item.tableChild.indexOf('splitLine') !== -1) {
          item.childCondition = []
        } else {
          item.childCondition = [
            { value: 'filled', label: '已填' },
            { value: 'empty', label: '未填' }
          ]
        }
        console.log('childCondition', item.childCondition)
      }
      if (this.editCom) {
        // 报表设置 将字段转化为后端要的字段
        this.editCom.appReportCountConditionVO = this.advancedSearch.searchItems.map(o => {
          let a = {
            tableChildName: o.table,
            type: o.conditionVal.toUpperCase(),
            value: o.values ? o.values : '',
            relation: 'AND'
          }
          return a
        })
      }
      if (this.needAdvance) { // 应用表单批量导入优化
        this.computedResult()
        let url = this.$parent.url.replace('table-data', 'api') + this.advancedSearchParams + '&pageSize=1'
        request(url).then(o => {
          if (o.state) {
            this.searchTotal = o.data.totalElements
          }
        })
      }
    }
  }
}
