import { request, sAjax } from '../assets/utils/utils'
export default {
  data () {
    return {
        searchProject: '',
      advancedSearch: {
        show: false,
        initialized: false,
        searchItems: [],
        tables: {},
        tableKeys: {},
        tableOptions: [],
        keys: {},
        typeOptions: [
          { value: 'and', label: '且' },
          { value: 'or', label: '或' }
        ],
        defaultType: 'and',
        optionKeys: {},
        columns: [],
        searchDTOS:[]
      }
    }
  },
  methods: {
    initApplySearchKeys () {
      this.advancedSearch.show = true
      return new Promise((resolve, reject) => {
        if (this.hasInit) {
          resolve()
        }
        this.hasInit = true
      let url = 'api/business/apply/limit/advance/columns'
      request(url).then(result => {
        if (result.state) {
          this.advancedSearch.columns = []
          for (let keyData of result.data) {
            let columnId = keyData.columnId
            this.advancedSearch.optionKeys[columnId] = keyData
            this.advancedSearch.columns.push({
              value: columnId,
              label: keyData.keyName + '(' + keyData.typeTitle + ')'
            })
          }
          resolve()
          // this.advancedSearch.initialized = true;
        } else {
          this.$toast(result.message)
          reject(result)
        }
      })
      })
    },
    initAdvancedSearchTableKeys: function () {
      sAjax({
        url: '/api/student/manage/advance/columns',
        type: 'get',
        success: result => {
          if (result.state) {
            this.advancedSearch.columns = []
            for (let keyData of result.data) {
              let columnId = keyData.columnId
              this.advancedSearch.optionKeys[columnId] = keyData
              this.advancedSearch.columns.push({
                value: columnId,
                label: keyData.keyName + '(' + keyData.typeTitle + ')'
              })
            }
            // this.advancedSearch.initialized = true;
          } else {
            this.$toast(result.message)
          }
        }
      })
    },
    showSearch: function (project) {
      // if (!this.advancedSearch.initialized) {
      //   return this.$toast("高级搜索初始化中, 请稍后再试");
      // }
      this.advancedSearch.show = true
      if (project) {
          this.searchProject = project
      }
    //   if (this.applySearch) {
    //   this.initApplySearchKeys()
    // } else {
      this.initAdvancedSearchTableKeys()
      // }
    },
    addSearchItem: function () {
      let firstRelationOptions = []
      let firstKeyData = this.advancedSearch.columns[0].value
      let firstRelations = this.advancedSearch.optionKeys[firstKeyData].options
      for (let value in firstRelations) {
        firstRelationOptions.push({
          value,
          label: firstRelations[value]
        })
      }
      this.advancedSearch.searchItems.push({
        key: this.advancedSearch.columns[0].value,
        relation: firstRelationOptions[0].value,
        value: null,
        options: {
          relation: firstRelationOptions,
          dictOptions: [],
          province: [],
          city: [],
          county: []
        },
        isDict: false,
        isAddress: false,
        isSelectProvince: false,
        isSelectCity: false,
        isDate: false,
        isInput: false,
        province: null,
        city: null,
        county: null
      })
    },
    deleteSearchItem: function (index) {
      this.advancedSearch.searchItems.splice(index, 1)
    },
    resetSearchItem: function () {
      if(this.curTarget && this.curTarget.properties.basic && this.curTarget.properties.basic.searchDTOS && this.curTarget.properties.basic.searchDTOS.length>0){
        this.advancedSearch.searchItems = this.curTarget.properties.basic.searchDTOS
      }else{
        this.searchItems = []
      }
      
    },
    // advancedSearchTypeSelected: function(selectedObj) {
    //   const index = parseInt(selectedObj.target.$attrs["data-index"]);
    //   const searchItem = this.advancedSearch.searchItems[index];
    //   searchItem.type = selectedObj.val;
    // },
    // advancedSearchTableSelected: function(selectedObj) {
    //   const index = parseInt(selectedObj.target.$attrs["data-index"]);
    //   const searchItem = this.advancedSearch.searchItems[index];
    //   searchItem.table = selectedObj.val;
    //   searchItem.key = null;
    //   if (!searchItem.table) {
    //     searchItem.options.key = [];
    //   }
    //   searchItem.options.key = this.advancedSearch.tableKeys[
    //     searchItem.table
    //   ].map(keyData => {
    //     return {
    //       value: keyData.key,
    //       label: keyData.keyName
    //     };
    //   });
    // },
    advancedSearchKeySelected: function (selectedObj) {

      sAjax({
        url: '/api/student/manage/advance/columns',
        type: 'get',
        success: result => {
          if (result.state) {
            this.advancedSearch.columns = []
            for (let keyData of result.data) {
              let columnId = keyData.columnId
              this.advancedSearch.optionKeys[columnId] = keyData
              this.advancedSearch.columns.push({
                value: columnId,
                label: keyData.keyName + '(' + keyData.typeTitle + ')'
              })
            }
            const index = parseInt(selectedObj.target.$attrs['data-index'])
            const searchItem = this.advancedSearch.searchItems[index]
            searchItem.key = selectedObj.val
            this.$nextTick(() => {
              searchItem.keyInfo = selectedObj.target.selected
            })
            if (!selectedObj.val) {
              searchItem.relation = null
              searchItem.options.relation = []
              // if (searchItem.isDict) {
              //   searchItem.value = null;
              //   searchItem.options.value = [];
              // }
              return
            }
      
            const keyInfo = this.advancedSearch.optionKeys[searchItem.key]
            searchItem.options.relation = []
            for (const value in keyInfo.options) {
              searchItem.options.relation.push({
                value,
                label: keyInfo.options[value]
              })
            }
            searchItem.isSelectProvince = false
            searchItem.isSelectCity = false
            searchItem.isAddress = false
            searchItem.isDict = false
            searchItem.isInput = false
      
            searchItem.isAddress = keyInfo.fieldType === 'Address'
            if (!searchItem.isAddress) {
              searchItem.isDict = keyInfo.select === true
            }
            searchItem.isDate = keyInfo.fieldType === 'Date'
            if (!searchItem.isDict && !searchItem.isAddress && !searchItem.isDate) {
              searchItem.isInput = true
            }
      
            if (searchItem.isAddress || searchItem.isDict) {
              sAjax({
                url: '/api/student/manage/advance/dict/' + searchItem.key,
                type: 'get',
                success: result => {
                  if (result.state) {
                    if (searchItem.isAddress) {
                      searchItem.options.province = result.data
                    } else {
                      searchItem.options.dictOptions = result.data
                    }
                  } else {
                    this.$toast(result.message)
                  }
                }
              })
            }
            
            // this.advancedSearch.initialized = true;
          } else {
            this.$toast(result.message)
          }
        }
      })



    },
    advancedSearchRelationSelected: function (selectedObj) {
      const index = parseInt(selectedObj.target.$attrs['data-index'])
      const searchItem = this.advancedSearch.searchItems[index]
      searchItem.relation = selectedObj.val
      this.$nextTick(() => {
        searchItem.relationInfo = selectedObj.target.selected
      })
    },
    advancedSearchValueSelected: function (selectedObj) {
      const index = parseInt(selectedObj.target.$attrs['data-index'])
      const searchItem = this.advancedSearch.searchItems[index]
      searchItem.value = selectedObj.val
      setTimeout(() => { // 因为还没有赋值完成,selected是空的
        searchItem.valueInfo = selectedObj.target.selected
      }, 300)
    },
    advancedSearchProvinceSelected: function (selectedObj) {
      const index = parseInt(selectedObj.target.$attrs['data-index'])
      const searchItem = this.advancedSearch.searchItems[index]
      searchItem.province = selectedObj.val

      if (!searchItem.province) {
        searchItem.isSelectProvince = false
        return
      }
      searchItem.options.city = []
      searchItem.isSelectProvince = true
      searchItem.options.county = []
      sAjax({
        url:
          '/api/student/manage/advance/city?provinceValues=' + selectedObj.val,
        type: 'get',
        success: result => {
          if (result.state) {
            searchItem.options.city = result.data
          } else {
            this.$toast(result.message)
          }
        }
      })
    },
    advancedSearchCitySelected: function (selectedObj) {
      const index = parseInt(selectedObj.target.$attrs['data-index'])
      const searchItem = this.advancedSearch.searchItems[index]
      searchItem.city = selectedObj.val
      if (!searchItem.city) {
        searchItem.isSelectCity = false
        return
      }
      searchItem.options.county = []
      searchItem.isSelectCity = true
      sAjax({
        url:
          '/api/student/manage/advance/label?provinceValues=' +
          searchItem.province +
          '&cities=' +
          selectedObj.val,
        type: 'get',
        success: result => {
          if (result.state) {
            searchItem.options.county = result.data
          } else {
            this.$toast(result.message)
          }
        }
      })
    },
    advancedSearchCountySelected: function (selectedObj) {
      const index = parseInt(selectedObj.target.$attrs['data-index'])
      const searchItem = this.advancedSearch.searchItems[index]
      searchItem.county = selectedObj.val
    },
    advancedSearchDateValue (d) {
      const index = parseInt(d.target.$attrs['data-index'])
      const searchItem = this.advancedSearch.searchItems[index]
      searchItem.value = d.value ? d.value.split(' ')[0] : d.value
    },
    getAddressOptions (type, name, name2) {
      if (type === 'province') {
          return this.provinceList
        } else if (type === 'city') {
          return this._getCityList(name)
        } else if (type === 'area') {
          return this._getAreaList(name, name2)
        }
    },
    execAdvancedSearch: function (type) {
      if(type == 1){
        this.searchDTOS = this.advancedSearch.searchItems
        if (this.curTarget.properties.basic) {
          this.$set(this.curTarget.properties.basic, "searchDTOS", this.searchDTOS);
        }
        this.advancedSearch.show = false
      }else{
        this.definedSearch = JSON.parse(
          JSON.stringify(this.$refs.studentTable.tableSearchFields)
        )
        this.definedSearch.studentName = this.$refs.studentTable.tableSearchFields.name
        this.definedSearch.searchDTOS = this.advancedSearch.searchItems.map(
          searchItem => {
            return {
              key: searchItem.key,
              relation: searchItem.relation,
              value: searchItem.value,
              tableName: this.advancedSearch.optionKeys[searchItem.key].tableName,
              listValues: searchItem.value ? searchItem.value.split(',') : [],
              provinces: searchItem.province
                ? searchItem.province.split(',')
                : [],
              cities: searchItem.city ? searchItem.city.split(',') : [],
              counties: searchItem.county ? searchItem.county.split(',') : []
              // type: searchItem.type
            }
          }
        )
        this.url = `/table-data/student/manage/advancedSearch`
        this.method = 'post'
        this.definedSearch.isAdvancedSearch = true
        this.definedSearch.inSchool = this.inSchool
        this.advancedSearch.show = false
        this.advancedSearch.type = this.role
      }
    }
  }
}
