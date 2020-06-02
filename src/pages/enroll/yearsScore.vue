<template>
  <div class="score">
    <div class="tab-div">
      <div class="tab" :class="!hadCheck ? 'active' : ''" title="专业录取情况" @click="selectTab(false)">专业录取情况</div>
      <div class="tab" :class="hadCheck ? 'active' : ''" title="录取情况汇总" @click="selectTab(true)">录取情况汇总</div>
    </div>
    <div class="content text-center">
      <v-table ref="scoreTable" title="历年分数" :url="scoreUrl+timestamp" pagesize="10" idField="id" :columns="scoreColumns" multiple="true" @afterChecked="afterChecked" :order="true" :search="false">
        <div v-if="hadCheck" slot="btn-group" class="btn-group pull-right" role="group">
          <button type="button" class="btn batch-add-btn btn-bgColor-style clearBtnBorder" @click="quickAddRecord">导入</button>
          <button type="button" class="btn batch-add-btn btn-bgColor-style clearBtnBorder" @click="importList">导出</button>
        </div>
      </v-table>
    </div>
    <div class="importPageClass" v-show="curRoute === 'importPage'">
      <v-import v-bind="importParams" @backParentPage="curRoute = 'allStaff'"></v-import>
    </div>
  </div>
</template>
<script>
import { sAjax, request, translation } from "../../assets/utils/utils.js";
import importTable from "../../mixins/import.js";
import exportTable from "../../mixins/export.js";
export default {
  mixins: [importTable, exportTable],
  data() {
    return {
      testObj: { a: 1, b: 2 },
      showSign: false,
      showImgDetailStatus: false,
      deleteImgWidth: 1,
      imgDetailSrc: '',
      scoreUrl: `/table-data/archives/yearScore/majorEnroll`,
      scoreColumns: [],
      showDetailStatus: false,
      imgList: [],
      timestamp: "?timestamp=",
      scoreUserNo: "",
      scoreAddColumns: [],
      scoreAddList: [],
      lang: "zh-cn",
      checkRows: [],
      hadCheck: false,
      isEdit: true
    };
  },
  props: {
    selectItem: {
      default: () => {}
    },
    orgM: {
      default: false
    }
  },
  created() {
    var la = localStorage.getItem("lang");
    var that = this;

    if (translation(la)) {
      this.lang = la;
    }
    this.scoreColumns = [
      {
        id: "year",
        title: '年份',
        className: "text-left",
        hidden: false,
        search: {
          type: "select",
          data: {
            optionsLabel: 'label',
            optionsValue: 'value',
            url: '/api/archives/enroll/getListYear'
          }
        }
      },
      {
        id: "enrollmentModels",
        title: "录取方式",
        className: "text-left",
        hidden: false,
        search: {
          type: "input",
          data: {
            placeholder: ""
          }
        }
      },
      {
        id: "division",
        title: "科类",
        className: "text-left",
        hidden: false,
        search: {
          type: "input",
          data: {
            placeholder: ""
          }
        }
      },
      {
        id: "province",
        title: '省份',
        className: "text-left",
        hidden: false,
        search: {
          type: "select",
          data: {
            optionsLabel: 'label',
            optionsValue: 'label',
            url: `/api/archives/permissions/getProvinceList`
          }
        }
      },
      {
        id: "majorName",
        title: '招生专业',
        className: "text-left",
        hidden: false,
        search: {
          type: "input",
          data: {
            placeholder: ""
          }
        }
      },
      {
        id: "educationLevel",
        title: "层次",
        className: "text-left",
        hidden: false,
        search: {
          type: "select",
          data: {
            optionsLabel: 'name',
            optionsValue: 'name',
            url: `/api/archives/demo/getSysDict?name=培养层次`
          }
        }
      },
      {
        id: "maxScore",
        title: "最高分",
        className: "text-left",
        hidden: false
      }, {
        id: "avgScore",
        title: "平均分",
        className: "text-left",
        hidden: false,
      }, {
        id: "minScore",
        title: "最低分",
        className: "text-left",
        hidden: false,
      }, {
        id: "maxScoreRanking",
        title: "最高分排名",
        className: "text-left",
        hidden: false,
      }, {
        id: "avgScoreRanking",
        title: "平均分排名",
        className: "text-left",
        hidden: false,
      }, {
        id: "minScoreRanking",
        title: "最低分排名",
        className: "text-left",
        hidden: false,
      },
      {
        id: "provincialControlLine",
        title: '省控线',
        className: "text-center",
        width: "230px",
        hidden: true,
      },
      {
        id: "enrollNumber",
        title: '录取人数',
        className: "text-center",
        width: "230px",
        hidden: false,
      }
    ]
    this.importParams = {
      parentPageTitle: "",
      downloadTemplateUrl: ``,
      downloadErrorTemplateUrl: `/archives/yearScore/getErrorExcel`,
      checkTemplateUrl: '/archives/yearScore/importEnrollExcel',
      templateName: "批量导入模板",
      importBtnType: [
        {
          url: `/archives/yearScore/insertExcelData`,
          method: 'post',
          isShowBtn: true,
          name: "覆盖导入",
          success: data => {
            this.timestamp = "?timestamp=" + new Date().getTime();
            this.curRoute = "allStaff";
          }
        }
      ]
    };
    // if (window.addEventListener){
    //   window.addEventListener('DOMMouseScroll', this.scrollImg, false);
    // }

  },
  methods: {
    importList() {//导出
      if (this.checkRows.length) {
        let url = 'api/archives/yearScore/createEnrollExcel'
        request(url, this.checkRows).then(o => {
          if (o.state) {
            let url = '/downloads/archives/yearScore/getAllEnrollExcel?key=' + o.data.key
            window.location.href = url
          }
        })
      } else {
        this.$toast('请选择导出内容!')
      }
    },
    selectTab(type) {
      if(this.hadCheck === type){
        return
      }
      this.hadCheck = type
      if (type) {
        this.scoreUrl = '/table-data/archives/yearScore/allEnroll'
      } else {
        this.scoreUrl = `/table-data/archives/yearScore/majorEnroll`
      }
      let changeIndex = [4, 9, 10, 11, 12]
      changeIndex.forEach(o => {
        this.scoreColumns[o].hidden = !this.scoreColumns[o].hidden
      })
    },
    showImgDetail(src) {
      this.showImgDetailStatus = true;
      this.imgDetailSrc = src;
      window.onmousewheel = document.onmousewheel = this.scrollImg;//W3C
    },
    scrollImg(e) {
      if (this.showImgDetailStatus) {
        if (e.deltaY > 0) {
          if (this.deleteImgWidth < 2) {
            this.deleteImgWidth += 0.1
          }
        } else {
          if (this.deleteImgWidth > 0.2) {
            this.deleteImgWidth -= 0.1
          }
        }
      }
    },
    save() {
      let url = 'api/archives/score/updateEms'
      let params = {
        id: this.addParams.id,
        emsNo: this.addParams.emsNo,
        registerTime: this.addParams.registerTime,
        registerLocation: this.addParams.registerLocation,
      }
      request(url, params, 'post').then(o => {
        if (o.state) {
          this.$toast('编辑成功!')
          this.timestamp = "?timestamp=" + new Date().getTime();
          this.showDetailStatus = false
        }
      })
    },
    batchChange(type) {
      if (this.checkRows.length) {
        let str = 'id='
        let idList = this.checkRows.map(o => {//不确定后台要什么样的数据,所以一般准备双份
          str += o.id + ','
          return o.id
        })
        str = str.substr(0, str.length - 1)//不确定后台要什么样的数据,所以一般准备双份
        let url = ''
        if (type === 'delete') {//
          if (confirm("确定删除该批次吗？删除后数据将无法恢复")) {
            url = '/api/archives/scorement/delete?' + str
            request(url, { a: 1 }, 'post').then(o => {
              if (o.state) {
                this.$toast('操作成功!')
                this.timestamp = "?timestamp=" + new Date().getTime();
              }
            })
          }
        } else {
          url = '/api/archives/scorement/status?' + str
          request(url, idList, 'post').then(o => {
            if (o.state) {
              this.$toast('操作成功!')
              this.timestamp = "?timestamp=" + new Date().getTime();
            }
          })
        }
        // this.exportFile(url).then(o=>{
        //   console.log('o',o)
        // })
      } else {
        this.$toast('请选择批次!')
      }
    },
    afterChecked(rows) {
      this.checkRows = rows;
    },
    showDetail(record) {//查看详情
      this.addParams = record;
      this.showDetailStatus = true;
      let url = '/downloads/archives/query/getImageDate?fileName='
      this.imgList = record.examinationRankingDataList.map(o => {
        return url + o
      })
    },
    getSelectOptions(value) {
      if (value === 'province') {
        return this.provinceList
      }
      return [{ id: 1, text: 'hh' }, { id: 2, text: 'haha' }]
    },
    deleteImg(index) {
      this.imgList.splice(index, 1);
    },
    onSelectImage(imgType) {
      var filex = event.target.files[0];
      var that = this;
      if (filex) {
        event.target.value = "";
        var reader = new FileReader();
        reader.onloadend = function (evt) {
          var img = new Image();
          // 用图片对象加载读入的base64
          img.src = evt.target.result;
          img.onload = function () {
            that.imgList.push(img.src);
          };
        };
        reader.readAsDataURL(filex);
      }
    },
    selectImage() {
      $("#imageInput").click();
    },
  },
  computed: {
    translate: function () {
      return translation(this.lang).enrollManage;
    }
  }
};
</script>
<style lang="less" scoped>
.sign_wrap {
  width: 100%;
  height: 164px;
  position: relative;
}
.detail_wrap {
  width: 100%;
  min-height: 500px;
  background-color: white;
  .back {
    cursor: pointer;
  }
}
.img-div {
  background-color: #eee;
  background-position: center;
  background-size: contain;
  text-align: center;
  margin-top: 6px;
  width: 220px;
  min-height: 130px;
  border-radius: 5px;
  margin-left: 50px;
  border: 1px solid #d8d9da;
  .add {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #298df7;
    color: white;
    font-size: 24px;
    position: relative;
    line-height: 40px;
    top: 30px;
  }
  .img {
    position: relative;
    width: 163px;
    margin: 0 auto;
    text-align: center;
    &.mobile-img {
      height: 160px;
      i {
        top: 43%;
      }
    }
    i {
      top: 45%;
      cursor: pointer;
    }
    img {
      position: absolute;
      display: none;
      top: 0;
      left: 0;
      width: 100%;
      // height: 100%;
      // z-index: 11;
    }
    input[type="file"] {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      // z-index: 12;
      opacity: 0;
      cursor: pointer;
    }
    div.close-img {
      position: absolute;
      top: -12px;
      right: -12px;
      // z-index: 13;
      width: 24px;
      height: 24px;
      cursor: default;
      // transform: scale(0);
      transition: all 0.1s ease-out;
      i {
        top: 0;
        color: rgba(0, 0, 0, 1);
        cursor: pointer;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.12),
          0 8px 8px 0 rgba(0, 0, 0, 0.12);
        border-radius: 100px;
      }
    }
    &.active {
      // &:hover {
      //   div.close-img {
      //     // transform: scale(1);
      //   }
      // }
      img {
        display: block;
      }
    }
  }
}
.img_wrap {
  min-height: 240px;
  width: 100%;
  .img_child {
    width: 220px;
  }
}
.form-wrap {
  width: 100%;
  flex-wrap: wrap;
  .form-group {
    margin-right: 20px;
    .label {
      width: 180px;
      font-size: 14px;
      color: #666;
      text-align: right;
      padding-left: 12px;
      padding-right: 12px;
    }
    .v-select,
    .form-control,
    .v-datepicker,
    .ditection {
      width: 200px;
    }
  }
}
.tab-div {
  position: relative;
  height: 40px;
  margin: 10px 0px 0;
  background: white;
  white-space: nowrap;
  border-bottom: 1px solid #f0f0f0;
  .apply-container {
    position: absolute;
    right: 0;
  }
  .tab-list {
    position: relative;
    .gm-scroll-view {
      padding-right: 200px;
    }
  }
  .tab {
    display: inline-block;
    // max-width: 200px;
    width: 150px;
    padding: 0 20px;
    font-size: 13px;
    color: rgba(0, 0, 0, 0.54);
    line-height: 40px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    transition: all 0.2s ease-out;
    vertical-align: top;
    &.tab-node {
      line-height: 20px;
      p {
        margin: 0;
        text-align: left;
      }
    }
    &:hover,
    &.active {
      color: #298df7;
      border-bottom: 2px solid #298df7;

      height: 40px;
    }
    margin-right: -4px;
  }
}
</style>
<style lang="less">
.img_modal {
  .modal-content {
    border: none;
    box-shadow: none;
    background: none;
  }
}
</style>
