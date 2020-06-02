<template>
  <div>
    <div class="carousel-page">
    <div class="carousel-wrap">
      <div class="content text-center">
        <v-table title="系统直通车管理" :url="url" :pagesize="10" :columns="columns" :multiple="false" :order="true" :search="null">
          <div slot="btn-group" role="group">
            <div class="btn-group pull-right ">
              <button type="button" @click="addOrEditSystem('add')" class="btn batch-add-btn btn-bgColor-style clearBtnBorder">新增</button>
            </div>
          </div>
        </v-table>
      </div>
    </div>
  </div>
  <v-modal :show="showAddView" effect="fade" width="600">
    <div slot="modal-header" class="modal-header">
      <h5 class="modal-title">
        {{modalType=='add'?'新增':'修改'}}
      </h5>
    </div>
    <div slot="modal-body" class="modal-body">
      
      <!-- <div class="carousel-view"> -->
    
        <el-form ref="positionInfoForm" :model="addParams" label-width="80px" class="box_flex column flex_wrap form_wrap">
          <el-form-item label="系统名称" class="long_form_item" required>
            <el-input type="input" :maxlength="15" placeholder="请输入15字内的系统名称" v-model="addParams.name"></el-input>
          </el-form-item>
          <el-form-item label="系统链接" class="long_form_item icon_wrap" required>
            <el-input type="input" placeholder="请输入" v-model="addParams.url"></el-input>
          </el-form-item>
          <el-form-item label="选择图标" class="long_form_item icon_wrap" required>
            <el-input v-show="false" type="input" placeholder="请输入" v-model="addParams.imgPath"></el-input>
          </el-form-item>
          <div v-if="showAddView" class="long_form_item icon_wrap">
            <select-icon :imgPath="addParams.imgPath" :imgType="addParams.imgType" :background="addParams.background" @changeIcon="changeIcon"></select-icon>
          </div>
          <!-- <el-form-item label="上传图片" class="long_form_item" required>
            <div v-if="!addParams.image" @click="selectImage()" class="img_wrap box_flex column flex_center">
              <div class="add-icon">
                <img src="../../assets/img/icon_content_add.png" alt="">
              </div>
              <p>点击添加图片</p>
              <p class="gray">每次只可上传一张，支持jpg、jpeg、gif、png、bmp的图片</p>
            </div>
            <div v-else @click="selectImage()" class="img_wrap box_flex column flex_center">
              <img :src="'/downloads/storage/images/'+addParams.image" style="width:100%;" alt="">

            </div>
          </el-form-item> -->
        </el-form>
        <input id="carouselImgInput" @change="onSelectImage()" type="file" style="display:none;" />
      <!-- </div> -->
    </div>
    <div slot="modal-footer" class="modal-footer">
      <button type="button" class="btn cancel-btn clearBtnBorder" @click="back">取消</button>
      <button type="button" @click="save()" class="btn submit-btn">确定</button>
    </div>
  </v-modal>
  <v-modal :show="showSortView" effect="fade" width="600">
    <div slot="modal-header" class="modal-header">
      <h5 class="modal-title">
        修改排序
      </h5>
    </div>
    <div slot="modal-body" class="modal-body">
        <el-form ref="positionInfoForm" :model="addParams" label-width="180px" class="box_flex flex_wrap form_wrap">
          <el-form-item label="排序" class="long_form_item" required>
            <el-input type="input" placeholder="请输入" v-model="addParams.sort"></el-input>
          </el-form-item>
        </el-form>
    </div>
    <div slot="modal-footer" class="modal-footer">
      <button type="button" class="btn cancel-btn clearBtnBorder" @click="showSortView=false">取消</button>
      <button type="button" @click="save()" class="btn submit-btn">确认</button>
    </div>
  </v-modal>
  </div>
</template>

<script>
import { request } from '../../assets/utils/utils.js'
import SelectIcon from './components/selectIcon.vue'
export default {
  components: {
    SelectIcon
  },
  created: function () {
    this.initTable()
  },
  data: function () {
    return {
      showSortView: false,
      opType: '',
      highestRak: '',
      url: '/table-data/siteNavigation',
      modalType: 'add',
      showAddView: false,
      addParams: {
        fixed: true,
        imgPath: 'school',
        imgType: '1',
        background: null,
        icon: "",
        id: 0,
        name: "",
        sort: 0,
        url: ""
      },
      timestamp: '',
      selectImageBase64: '',
      showTypeModal: false,
      searchField: 'name',
      oldParams: {}
    }
  },
  mounted: function () {
  },
  methods: {
    save() {
      if(!this.addParams.name) {
        this.$toast('系统名称必填')
        return;
      }
      if(!this.addParams.url) {
        this.$toast('系统链接必填')
        return;
      }
      if(!this.addParams.imgPath) {
        this.$toast('请选择系统图标')
        return;
      }
      let url = `/api/siteNavigation`
      if(this.modalType !== 'add') {
        url = `/api/siteNavigation/update`
      }
      request(url, this.addParams, 'post').then(o => {
        if (o.state) {
          this.$toast(`${this.modalType == 'add'?'新增': this.modalType == 'edit'?'编辑':'排序'}成功！`);
          this.url = `${this.url}?timestamp=${new Date()}`
          this.back()
        }
        else{
          this.$toast(o.message);
        }
      })
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
            that.$croppa({
              file: filex,
              width: 585,
              height: 223,
              scale: "",
              sure: function (base64) {
                let url = "/api/storage/base64Images";
                // console.log("旧的哈希是" + that.addParams.image)
                if (that.addParams.image) {//删掉服务器里面的旧图片 节约内存
                  let hash = that.addParams.image;
                  let url = `api/storage/files/${hash}`;
                  request(url, {}, "post").then(o => { });
                }
                request(url, { data: base64 }).then(o => {
                  let hash = o.data.hash //哈希码 用来上传
                  that.addParams.image = hash
                  that.$nextTick(() => {
                    that.addParams.image = hash
                  })
                  that.selectImageBase64 = base64
                });
              }
            });
          };
        };
        reader.readAsDataURL(filex);
      }
    },
    selectImage() {
      $("#carouselImgInput").click();
    },
    initTable() {
      var that = this
      this.columns = [
        {
          id: 'icon',
          title: '系统图标',
          width: 200,
          className: 'text-center',
          hidden: false,
          hover: false,
          formatter: function (record) {
            let html = ''
            if(record.imgType == 3) {
              html = `
              <div class="flex_center" style="padding:10px;">
                  <svg class="icon choiceness-icon" style="font-size:60px;width:1em;height:1em" aria-hidden="true">
                    <use xlink:href="#${record.imgPath}"></use>
                  </svg>
              </div>`
            } else if (record.imgType == 4) {
               html = `
              <div class="flex_center" style="padding:10px;">
                  <img style="width:58px;height:58px;border-radius:16px;" src="/downloads/storage/images/${record.imgPath}" alt="">
              </div>`
            } else if (record.imgType == 1){
              html = `
              <div class="flex_center" style="padding:10px;">
                  <div
                    class="maticon_wrap flex_center"
                    style="width:58px;height:58px;border-radius:16px;background-image:${record.background?record.background:'linear-gradient(45deg, #3F87E7 0%, #377EEB 100%)'}"
                  >
                    <i
                      class="maticon"
                      :title="${record.imgPath}"
                      v-html="icons(${record.imgPath})"
                      style="color:#fff;font-size:38px;"
                    >${record.imgPath}</i>
                  </div>
              </div>`
            }else if (record.imgType == 2){
              html = `
              <div class="flex_center" style="padding:10px;">
                  <div
                    class="maticon_wrap"
                    style="display:flex;align-items:center;justify-content:center;width:58px;height:58px;border-radius:16px;background-image:${record.background?record.background:'linear-gradient(45deg, #3F87E7 0%, #377EEB 100%)'}"
                  >
                    <i
                      class="maticon app-icon-style theme-icon-application"
                      style="color:#fff;font-size:38px;"
                    >
                      <span class="saasicon-44px saasicon-44px-${record.imgPath}"></span>
                    </i>
                  </div>
              </div>`
            }
            return html
          }
        },
        {
          id: 'name',
          title: '系统名称',
          width: 300,
          className: 'text-left',
          hidden: false
        },
        {
          id: 'url',
          title: '系统链接',
          width: 300,
          className: 'text-left',
          hidden: false
        },
        {
          id: 'sort',
          title: '排序位置',
          className: 'text-left',
          hidden: false,
        }, {
          id: 'opt',
          title: '操作',
          className: 'text-center',
          width: '210px',
          hidden: false,
          formatter: (record, index) => {
          
            return [{
              tag: 'a',
              text: '排序',
              className: 'opt-btn',
              callback: (record, index) => {
                // that.addParams = record
                that.modalType = 'sort'
                that.addParams.url = record.url
                that.addParams.name = record.name
                that.addParams.sort = record.sort
                that.addParams.background = record.background
                that.addParams.imgPath = record.imgPath
                that.addParams.imgType = record.imgType
                that.addParams.id = record.id
                that.showSortView = true
              }
            },{
              tag: 'a',
              text: '编辑',
              className: 'opt-btn',
              callback: (record, index) => {
                // that.addParams = record
                that.addParams.url = record.url
                that.addParams.name = record.name
                that.addParams.sort = record.sort
                that.addParams.background = record.background
                that.addParams.imgPath = record.imgPath
                that.addParams.imgType = record.imgType
                that.addParams.id = record.id
                that.addOrEditSystem('edit')
              }
            },{
              tag: 'a',
              text: '删除',
              className: 'opt-btn',
              callback: (record, index) => {
                if(confirm('您确定要删除这个系统吗？')) {
                  request(`/api/siteNavigation/${record.id}/delete`, {}, 'post').then(o => {
                    if (o.state) {
                      this.url = `${this.url}?timestamp=${new Date()}`
                      this.$toast('删除成功！')
                    } else {
                      this.$toast(o.message)
                    }
                  })
                }
              }
            },]
          }
        }]
    },
    addOrEditSystem(type) {
      this.modalType = type
      if (type == 'add') {
        this.addParams = {
          fixed: true,
          imgPath: 'school',
          imgType: '1',
          background: null,
          icon: "",
          id: 0,
          name: "",
          sort: 0,
          url: ""
        }
      }
      this.showAddView = true
    },
    changeIcon(val) {
      console.log(val)
      this.addParams.imgPath = val.imgPath
      this.addParams.imgType = val.imgType
      this.addParams.background = val.background
    },
    back() {
      this.showAddView = false
      this.showSortView = false
    }
  }
}
</script>
<style lang="less">
.carousel-view {
  .maticon_wrap {
    border-radius: 6px;
    width: 57px;
    height: 57px;
    .maticon {
      font-size: 38px;
      color: white;
    }
  }
}
</style>

<style lang="less" scoped>
.maticon_wrap {
    border-radius: 6px;
    width: 57px;
    height: 57px;
    .maticon {
      font-size: 38px;
      color: white;
    }
  }
  .choiceness-icon {
    font-size: 50px;
    padding: 10px;
    display: inline-block;
    width: 1em; 
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
.carousel-view {
  background: white;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
  padding: 20px;
  border-radius: 2px;
  .back-btn {
    display: flex;
    align-items: center;
    color: #666;
    padding: 10px 20px;
    cursor: default;
    .maticon {
      font-size: 20px;
    }
  }
  .form_wrap {
    width: 800px;
    padding-right: 100px;
    margin: 0 auto;
  }
  .long_form_item {
    width: 100%;
  }
  .img_wrap {
    cursor: pointer;
    p {
      margin: 0;
      text-align: center;
      font-size: 14px;
      line-height: 17px;
      &.gray {
        font-size: 12px;
        color: #999;
      }
    }
    .add-icon {
      margin-bottom: 12px;
      img {
        width: 38px;
        height: 38px;
        border-radius: 50%;
      }
    }
  }

  .icon_wrap {
    position: relative;
    .add-icon {
      position: absolute;
      right: -52px;
      top: 0;
      img {
        width: 38px;
        height: 38px;
      }
    }
  }
  .img_wrap {
    width: 100%;
    min-height: 172px;
    background: #ecf7ff;
    position: relative;
  }
  .form_item {
    width: 50%;
  }
}
</style>
<style lang="less">
.carousel-view {
  .el-form-item__label {
    color: #333333;
  }
  .el-input__prefix,
  .el-input__suffix .el-select__caret.el-icon-arrow-up:before {
    color: rgba(0, 0, 0, 0.54) !important;
    font-size: 16px;
    font-weight: 600;
  }
}
</style>
