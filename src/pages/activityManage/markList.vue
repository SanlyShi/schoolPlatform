<template>
  <div class="mark-list-page container-fluid">
    <div class="row">
      <v-table
      ref="secondClass"
      :title="'成绩单列表'"
      url="/table-data/student/manage/secondClass"
      :columns="columns"
      pagesize="10" idField="id"
      :order="true" :search="true">
        <div slot="btn-group" class="btn-group pull-right" role="group">
          <button
            class="btn btn-bgColor-style clearBtnBorder"
            @click="_outputPdf"
          >批量导出</button>
        </div>
      </v-table>
    </div>
    <div v-if="pdfSetting.downloading" id="pdfDom" :class="{ 'exporting-to-pdf': pdfSetting.modalShow }" class="second-export">
    <!-- <div id="pdfDom" class="second-export"> -->
      <iframe width="100%" height="1188px" :src="`/sc/report?userId=${this.pdfSetting.list[this.pdfSetting.index].userId}&isPdf=true`" frameborder="0"></iframe>
      <!-- <iframe width="100%" height="1188px" :src="`/sc/report?userId=353553965901676544&isPdf=true`" frameborder="0"></iframe> -->
    </div>
  </div>
</template>
<script>
  import JSZip from "jszip";
  import FileSaver from "file-saver";
  import { sAjax } from '../../assets/utils/utils';
  export default {
    props: {
      data: {
        default: null
      }
    },
    data: function () {
      return {
        exportingToPdf: false,
        pageOptions: {
          colleges: [],
          grade: [],
          studentType: []
        },
        pdfSetting: {
          index: 0,
          list: [],
          downloading: false,
          zip: new JSZip(),
          timer: null,
          modalShow: false,
          log: false,
          url: "/api/student/manage/secondClass/getList",
        },
        columns: []
      }
    },
    methods: {
      _getPageOptions: function () {
        sAjax({
          url: `/api/student/manage/getSelectOptions?`,
          type: 'get',
          data: {
            type:'school'
          },
          success: (data)=>{
            if(data.state) {
              if(data.data) {
                this.pageOptions = data.data
                this._initColumns()
              }
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _initColumns: function () {
        this.columns = [{
          id: 'studentId',
          title:'学工号',
          width: 120,
          hidden: false,
          className: 'text-left',
          search: {
            type: 'input'
          }
        }, {
          id: 'name',
          title:'姓名',
          width: 100,
          hidden: false,
          className: 'text-left',
          search: {
            type: 'input'
          }
        }, {
          id: 'grade',
          title:'年级',
          width: 100,
          hidden: false,
          className: 'text-left',
          search: {
            type: 'select',
            data: {
              options: this.pageOptions.grade,
              optionsLabel: 'text',
              optionsValue: 'id'
            }
          }
        }, {
          id: 'college',
          title:'学院',
          width: 150,
          hidden: false,
          className: 'text-left',
          search: {
            type: 'select',
            data: {
              options: this.pageOptions.colleges,
              optionsLabel: 'text',
              optionsValue: 'id'
            }
          }
        }, {
          id: 'type',
          title:'学生类别',
          width: 120,
          hidden: false,
          className: 'text-left',
          search: {
            type: 'select',
            data: {
              options: this.pageOptions.studentType,
              optionsLabel: 'text',
              optionsValue: 'id'
            }
          },
          formatter: (record, index)=>{
            return record.studentType
          }
        }, {
          id: 'instructor',
          title:'辅导员',
          width: 150,
          hidden: false,
          hover: false,
          className: 'text-left',
          formatter: (record, index)=>{
            return record.instructor?`<span title="${record.instructorNo}">${record.instructor}</span>`:''
          }
        }, {
          id: 'opt',
          title:'操作',
          width: 60,
          hidden: false,
          className: 'text-left',
          options: [{
            tag: 'a',
            text: '查看',
            callback: (record, index) =>{
              window.open(`/sc/report?userId=${record.userId}`)
            }
          }]
        }]
      },
      _outputPdf: function(evt) {
        this.$waiting.show()
        var data = {}
        data = JSON.parse(
          JSON.stringify(this.$refs.secondClass.tableSearchFields)
        );
        // console.log(data)
        // data.pageSize = 99999 
        sAjax({
          url: this.pdfSetting.url,
          type: "get",
          data: data,
          success: data => {
            // console.log(data)
            this.$waiting.close()
            if (data.state) {
              this.pdfSetting.downloading = true;
              this.pdfSetting.list = data.data
              this._nextTask(this.pdfSetting.list[this.pdfSetting.index]);
            } else {
              this.$toast(data.message);
            }
          }
        });
      },
      _nextTask: function(instanceId) {
        // console.log(instanceId)
        this.pdfSetting.timer = setTimeout(() => {
          if (!instanceId) {
            // 归位导出参数
            clearTimeout(this.pdfSetting.timer);
            this.pdfSetting.downloading = false;
            this.pdfSetting.log = false;
            this.pdfSetting.list = [];
            this.pdfSetting.index = 0;
            this.pdfSetting.modalShow = false;

            this.pdfSetting.zip.generateAsync({ type: "blob" }).then(content => {
              // 生成二进制流
              var d = new Date();
              FileSaver.saveAs(
                content,
                '第二课堂成绩单' +
                  d.getFullYear() +
                  "-" +
                  (d.getMonth() + 1) +
                  "-" +
                  d.getDate()
              ); // 利用file-saver保存文件
              this.$toast("打包成功，开始下载...");
            });
          } else {
            if (!this.pdfSetting.modalShow) {
              // 当表单已经关闭的时候说明已经执行完导出了
              this.pdfSetting.modalShow = true
              this._downloadPdf()
              // this._initPreview({
              //   id: instanceId,
              //   businessId: this.curBusinessId
              // });
            }
          }
        }, 500);
      },
      _downloadPdf: function() {
        
        if (this.pdfSetting.downloading) {
          this.pdfSetting.title = this.pdfSetting.list[this.pdfSetting.index].studentId+ '-'+this.pdfSetting.list[this.pdfSetting.index].name
          this.getPdf(this.pdfSetting.title, data => {
            // this.preview = false;
            this.pdfSetting.modalShow = false;
            if(this.pdfSetting.list.length-1 == this.pdfSetting.index) {
              // console.log(123)
              this.pdfSetting.downloading = false
            }
            this.pdfSetting.index++;
            this.pdfSetting.zip.file(this.pdfSetting.title + ".pdf", data, {
              binary: true
            });
            this._nextTask(this.pdfSetting.list[this.pdfSetting.index]);
            this.$toast(
              `打包中...(${this.pdfSetting.index}/${this.pdfSetting.list.length})\nPDF文件较大，导出速度慢`
            );
          });
        }
      },
    },
    created: function () {
      this._getPageOptions()
    }
  }
</script>
<style lang="less" scoped>
.second-export {
  position: absolute;
  top: 0;
  // opacity: 0;
  z-index: -1;
  width: 840px;
  // height: 1188px;
}
</style>
