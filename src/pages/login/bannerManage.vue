<template>
  <div v-if="!showAddView" class="carousel-page">
    <div class="carousel-wrap">
      <div class="content text-center">
        <v-table title="首页轮播图列表" :url="url" :paginationShow="false" :pagesize="10" :columns="columns" :multiple="false" :order="true" :search="null">
          <div slot="btn-group" role="group">
            <div class="btn-group pull-right ">
              <button type="button" @click="addOrEditCarousel('add')" class="btn batch-add-btn btn-bgColor-style clearBtnBorder">新增</button>
            </div>
          </div>
        </v-table>
      </div>
    </div>
  </div>
  <div v-else class="carousel-view">
    <div class="back-btn">
      <i class="maticon pull-left" @click="back" v-html="icons('arrow_back')">arrow_back</i>
      <span @click="back">返回</span>
    </div>
    <el-form ref="positionInfoForm" :model="addParams" label-width="180px" class="box_flex flex_wrap form_wrap">
      <el-form-item label="跳转链接" class="long_form_item icon_wrap">
        <el-input type="input" placeholder="请输入链接地址(选填)" v-model="addParams.url"></el-input>
      </el-form-item>
      <!-- <input type="text" v-if="modalType == 'edit'" v-model="addParams.sort"> -->
      <el-form-item v-if="modalType == 'edit'" label="排序权重" class="long_form_item" required>
        <el-input v-if="modalType == 'edit'" type="input" placeholder="权重越高，播放位置越靠前(必填)" v-model="addParams.sort"></el-input>
      </el-form-item>
      <el-form-item v-if="modalType == 'add'" label="排序权重" class="long_form_item" required>
        <el-input type="input" placeholder="权重越高，播放位置越靠前(必填)" v-model="addParams.highestRak"></el-input>
      </el-form-item>
      <el-form-item label="上传图片" class="long_form_item" required>
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
      </el-form-item>
    </el-form>
    <input id="carouselImgInput" @change="onSelectImage()" type="file" style="display:none;" />
    <div class="box_flex flex_center">
      <button class="btn cancel-btn" @click="back" style="margin-right:106px">取消</button>
      <button @click="save()" class="btn submit-btn">保存</button>
    </div>
  </div>
</template>

<script>
import { request } from '../../assets/utils/utils.js'
export default {
  created: function () {
    this.initTable()
  },
  data: function () {
    return {
      opType: '',
      highestRak: '',
      url: '/table-data/firstPage/getPictureList',
      modalType: 'add',
      showAddView: false,
      addParams: {
        title: '',
        chooseName: '',
        image: '',
        sort:0,
        listPageUrl: '',
        moduleUrl: '',
        newWindow: 1,
        highestRak: '',
        url: '',
        hash: ''
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
      let params = {
        url: this.addParams.url,
        bannerStrength: this.addParams.highestRak,
        hash: this.addParams.image
      }
      if (this.modalType == 'add') {
        let url = `api/firstPage/addPicture?url=${params.url}&bannerStrength=${params.bannerStrength}&hash=${params.hash}`
        let method = "post"
        if(!params.bannerStrength || !params.hash){
          this.$toast("权重和图片必填！")
          return
        }
        request(url, params, method).then(o => {
          if (o.state) {
            this.$toast('新增成功!');
            this.url = `${this.url}?timestamp=${new Date()}`
            this.back()
          }
          else{
            this.$toast(o.message);
          }
        })
      }
      else if (this.modalType == 'edit') {
        let params = {
          url: this.addParams.url,
          sort: this.addParams.sort,
          picture_hash: this.addParams.image,
          id: this.addParams.id,
        }
        if(!params.sort || !params.picture_hash){
          this.$toast("权重和图片必填！")
          return
        }
        let url = `api/firstPage/updateBanner`
        let method = "post"
        request(url, params, method).then(o => {
          if (o.state) {
            this.$toast('编辑成功!');
            this.url = `${this.url}?timestamp=${new Date()}`
            this.back()
          }
          else{
            this.$toast(o.message);
          }
        })
      }
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
              width: 960,
              height: 250,
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
          id: 'picture_hash',
          title: '图片',
          hover: false,
          width: 200,
          className: 'text-center',
          hidden: false,
          formatter: function (record) {
            return `<img src="/downloads/storage/images/${record.picture_hash}" style="width:80%;padding:5px 5px" alt="">`
          }
        },
        {
          id: 'url',
          title: '跳转网站链接',
          width: 300,
          className: 'text-left',
          hidden: false
        },
        {
          id: 'sort',
          title: '排序权重',
          className: 'text-left',
          hidden: false,
        }, {
          id: 'opt',
          title: '操作',
          className: 'text-center',
          width: '210px',
          hidden: false,
          formatter: (record, index) => {
            let edit = {
              tag: 'a',
              text: '编辑',
              className: 'opt-btn',
              callback: (record, index) => {
                // that.addParams = record
                that.addParams.url = record.url
                that.addParams.sort = record.sort
                that.addParams.image = record.picture_hash
                that.addParams.id = record.id
                that.addOrEditCarousel('edit')
              }
            }
            let jin = {
              tag: 'a',
              text: '禁用',
              className: 'opt-btn',
              callback: (record, index) => {
                if (confirm('确定禁用该轮播图?')) {
                  request(`/api/firstPage/closeAndOpen?openButton=1&hash=${record.picture_hash}&id=${record.id}`, {}, 'post').then(data => {
                    if (data.state) {
                      this.$toast("禁用成功");
                      this.url = `${this.url}?timestamp=${new Date()}`
                    } else {
                      this.$toast(data.message);
                    }
                  })
                }
              }
            }
            let qi = {
              tag: 'a',
              text: '启用',
              className: 'opt-btn',
              callback: (record, index) => {
                // if (confirm('确定禁用该轮播图?')) {
                  request(`/api/firstPage/closeAndOpen?openButton=0&hash=${record.picture_hash}&id=${record.id}`, {}, 'post').then(data => {
                    if (data.state) {
                      this.$toast("启用成功");
                      this.url = `${this.url}?timestamp=${new Date()}`
                    } else {
                      this.$toast(data.message);
                    }
                  })
                // }
              }
            }
            let arr = []
            arr.push(edit)
            if (record.is_enable == 0) {
              arr.push(jin)
            }
            else if(record.is_enable == 1){
              arr.push(qi)
            }
            return arr
          }
        }]
    },
    addOrEditCarousel(type) {
      request("/api/firstPage/getPictureList?timestamp=" + new Date()).then(o => {
        if (o.state) {
          let m = 0
          if(o.data.content.length>0){
            o.data.content.forEach((item)=>{
              if(item.is_enable == 0){
                m++
              }
            })
          }
          if (m < 5 || type == 'edit') {
            let url = `api/firstPage/getBannerStrength`
            request(url).then(o => {
              if (o.state) {
                this.addParams.highestRak = o.data
              } else {
                this.$toast(o.message)
              }
            })
            this.modalType = type
            this.showAddView = true
          }
          else {
            this.$toast("已开启的轮播数量超过5张，无法新增")
          }
        } else {
          this.$toast(o.message)
        }
      })
      if (type == 'add') {
        this.addParams.url = ''
        this.addParams.image = ''
      }
    },
    back() {
      this.showAddView = false
    }
  }
}
</script>
<style lang="less" scoped>
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
