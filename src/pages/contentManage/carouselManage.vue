<template>
  <div v-if="!showAddView" class="carousel-page">
    <div class="carousel-wrap">
      <div class="content text-center">
        <v-table title="轮播图列表" :url="url+systemId+timestamp" :pagesize="10" :columns="columns" :multiple="false" :order="true" :search="false">
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
      <el-form-item label="标题" class="long_form_item" required>
        <el-input type="input" placeholder="标题" v-model="addParams.title" resize="none"></el-input>
      </el-form-item>
      <!-- <el-form-item label="图片来源" class="form_item" required>
        <el-select v-model="addParams.source" placeholder="请选择">
          <el-option v-for="item in selectOptions.source" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="跳转链接" class="long_form_item icon_wrap" required>
        <el-input type="input" placeholder="请输入链接地址或选择关联内容" v-model="addParams.url" :disabled="urlReadOnly" resize="none"></el-input>
        <div @click="editType()" class="add-icon">
          <img src="../../assets/img/icon_content_add.png" alt="">
        </div>
      </el-form-item>
      <el-form-item label="图片说明" class="long_form_item">
        <el-input type="textarea" rows="4" placeholder="请输入轮播图作用，便于部门其他人员查看、操作！" v-model="addParams.imageExplain" resize="none"></el-input>
      </el-form-item>
      <el-form-item label="上传图片" class="long_form_item">
        <div v-if="!addParams.image" @click="selectImage()" class="img_wrap box_flex column flex_center">
          <div class="add-icon">
            <img src="../../assets/img/icon_content_add.png" alt="">
          </div>
          <p>点击添加图片</p>
          <!-- <p class="gray">支持jpg/gif/png格式</p> -->
          <p class="gray">每次只可上传一张</p>
        </div>
        <div v-else @click="selectImage()" class="img_wrap box_flex column flex_center">
          <img :src="'/downloads/storage/images/'+addParams.image" style="width:100%;" alt="">
        </div>
      </el-form-item>
    </el-form>
    <v-modal :show="showTypeModal" effect="fade" width="446" class="activityType-modal">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          关联系统内容
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <el-form ref="positionInfoForm" :model="addParams" label-width="120px">
          <el-form-item label="关联类型">
            <el-select v-model="addParams.type" @change="onSelectType" placeholder="请选择">
              <el-option v-for="item in selectOptions.typeList" :key="item.id" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="addParams.type !== 'MODULE_CONTENT'"  label="关联的内容">
            <el-select v-model="addParams.listPageUrl" @change="onSelectConstant" placeholder="请选择">
              <el-option v-for="item in selectOptions.sonConstantList" :key="item.id" :label="item.name" :value="item.listPageUrl">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-else label="关联的内容">
            <el-select v-model="addParams.moduleUrl" @change="onSelectModule" placeholder="请选择">
              <el-option v-for="item in selectOptions.moduleList" :key="item.id" :label="item.name" :value="item.listPageUrl">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="addParams.type !== 'MODULE_CONTENT'" label="详细">
            <el-select v-model="addParams.chooseName" filterable=true @change="onSelectDetail" placeholder="请选择">
              <el-option v-for="item in selectOptions.detailList" :key="item.id" :label="item[searchField]" :value="item[searchField]">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="cancelSaveType()">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="confirmSaveType">确定</button>
      </div>
    </v-modal>
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
  props: {

  },
  created: function () {
    this.systemId = sessionStorage.getItem('_SYSTEM_ID')
    this.initTable()
  },
  data: function () {
    return {
      systemId: '',
      url: '/table-data/cms/rotary/getRotaryImageList?systemId=',
      modalType: 'add',
      showAddView: false,
      addParams: {
        title: '',
        chooseName: '',
        image:'',
        listPageUrl:'',
        moduleUrl: '',
        newWindow: 1,
      },
      timestamp: '',
      requireField: [{ text: '标题', value: 'title' }, { text: '跳转链接', value: 'url' }, { text: '图片', value: 'image' }],
      selectOptions: {
        source: [{ value: 'NETWORK_IMAGE', label: '网络图片链接' }, { value: 'LOCAL_IMAGE', label: '本地图片' }],
        typeList: [],
        sonConstantList: [],
        detailList: [],
      },
      selectImageBase64: '',
      showTypeModal: false,
      urlReadOnly: false,
      searchField: 'name',
      oldParams: {}
    }
  },
  mounted: function () {
    this.getDirectionary()
  },
  methods: {
    save() {
      console.log('addParams', this.addParams)
      for (var i in this.requireField) {
        if (!this.addParams[this.requireField[i].value]) {
          this.$toast(this.requireField[i].text + '不能为空!')
          return;
        }
      }
      let params = JSON.parse(JSON.stringify(this.addParams));
      params.systemId = this.systemId
      params.url = params.url 

      // + '&listPageUrl=' + params.listPageUrl
      // if(params.source==='NETWORK_IMAGE') {
      //   params.newWindow = 1
      //   params.image = params.url
      // }
      let url = this.modalType == 'add' ?'api/cms/rotary/addRotaryImage':'api/cms/rotary/updateRotaryImage'
      let method = 'post'
      request(url, params, method).then(o => {
        if (o.state) {
          this.$toast('操作成功!');
          this.timestamp = `&timestamp=${new Date()}`
          this.back()
        }
      })
    },
    onSelectType(o) {
      this.addParams.url = ''
      this.addParams.listPageUrl = ''
      this.addParams.chooseName = ''
      let obj = this.selectOptions.typeList.find(item => item.value == o) 
      this.addParams.newWindow = obj.newWindow
    },
    onSelectModule(o) {
      this.addParams.url = o
    },
    onSelectConstant(o) {
      this.addParams.chooseName = ''
      this.addParams.url = o
      let obj = this.selectOptions.sonConstantList.filter(a => {
          return a.listPageUrl === o
        })[0]
      if(this.addParams.type!=='MODULE_CONTENT') {
        
        this.searchField = obj.searchField
        this.addParams.detailPageUrl = obj.detailPageUrl || ''
        let url = `api${obj.datalistUrl}`
        request(url).then(o => {
          this.selectOptions.detailList = o.data.content
        })
      }
    },
    onSelectDetail(o) {
      
      let obj = this.selectOptions.detailList.filter(a => {
        return a[this.searchField] === o
      })[0]
      this.addParams.url = `${this.addParams.detailPageUrl},${obj.id}`
    },
    getDirectionary() {
      let type = 'ROTARY_IMAGE_CONTENT'//ROTARY_IMAGE_CONTENT：轮播图内容类型
      let url = `api/cms/system/getConstantByType?type=${type}&systemId=${this.systemId}`
      request(url).then(o => {
        if (o.state) {
          this.selectOptions.typeList = o.data
          this.selectOptions.sonConstantList = this.selectOptions.typeList[0].sonConstantList
          this.getModuleList()
        } else {
          this.$toast(o.message)
        }
      })
    },
    getModuleList() {
        let url = 'api'+this.selectOptions.typeList[1].datalistUrl+this.systemId
        request(url).then(o => {
          
          this.selectOptions.moduleList = o.data.content.map(item => {
            item.name = item.title
            item.listPageUrl = `/contentManageIndex,${item.id}`
            return item
          });
        })
    },
    editType() {
      this.showTypeModal = true;
      this.oldParams = JSON.parse(JSON.stringify(this.addParams));//降参数先存起来,按取消按钮的时候回退
    },
    cancelSaveType() {
      this.showTypeModal = false;
      this.addParams = JSON.parse(JSON.stringify(this.oldParams))
    },
    confirmSaveType() {
      this.showTypeModal = false
      this.urlReadOnly = true
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
                if (that.addParams.image) {//删掉服务器里面的旧图片 节约内存
                  let hash = that.addParams.image;
                  let url = `api/storage/files/${hash}`;
                  request(url, {}, "post").then(o => { });
                }
                request(url, { data: base64 }).then(o => {
                  let hash = o.data.hash //哈希码 用来上传
                  that.addParams.image = hash
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
      let that = this
      this.columns = [{
        id: 'title',
        title: '标题',
        width: 200,
        className: 'text-left',
        hidden: false,
        search: {
          type: 'input',
          data: {
            placeholder: ''
          }
        }
      }, {
        id: 'imageExplain',
        title: '图片',
        width: 200,
        className: 'text-left',
        hidden: false
      }, {
        id: 'url',
        title: '跳转链接',
        width: 300,
        className: 'text-left',
        hidden: false,
        search: {
          type: 'input',
          data: {
            placeholder: ''
          }
        }
      }, {
        id: 'updateTime',
        title: '更新时间',
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
            text: '编辑',
            className: 'opt-btn',
            callback: (record, index) => {
              that.addParams = record
              console.log(record)
              if(record.type == 'MODULE_CONTENT') {
                that.addParams.moduleUrl = record.url
              } else if(that.addParams.url.indexOf(',')>-1) {
                let urlArr = that.addParams.url.split(',')
                let obj = this.selectOptions.sonConstantList.find(o => o.detailPageUrl == urlArr[0])
                that.addParams.listPageUrl = obj.listPageUrl
              }
              this.urlReadOnly = that.addParams.newWindow == 0? true: false

              that.addOrEditCarousel('edit')
            }
          }, {
            tag: 'a',
            text: '删除',
            className: 'opt-btn',
            callback: (record, index) => {
              if(confirm('确认要删除该轮播图吗?')) {
                request(`/api/cms/rotary/${record.id}`,{},'post').then(data => {
                  if (data.state) {
                    this.$toast("删除成功");
                    this.timestamp = `&timestamp=${new Date()}`
                  } else {
                    this.$toast(data.message);
                  }
                })
              }
            }
          }]
        }
      }]
    },
    addOrEditCarousel(type) {
      this.modalType = type
      this.showAddView = true
      if(type == 'add') {
        this.addParams =  {
          title: '',
          chooseName: '',
          image:'',
          listPageUrl:'',
          moduleUrl: '',
          newWindow: 1,
        }
      }

    },
    back() {
      this.urlReadOnly = false
      this.showAddView = false
    }
  }
}
</script>
<style lang="less" scoped>
.carousel-view {
  background: white;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
  // width: 950px;
  // min-width: 950px;
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
  .el-input__prefix, .el-input__suffix .el-select__caret.el-icon-arrow-up:before {
    color: rgba(0, 0, 0, 0.54) !important;
    font-size: 16px;
    font-weight: 600;
  }
}
</style>
