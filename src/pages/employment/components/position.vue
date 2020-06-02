/**职位详情&编辑组件  */
<!--
自定义事件
  @closeDialog dialog触发关闭事件
  @positionSubmit 职位表单提交

-->
<template>
  <div id="position" >
    <el-dialog close="changeEmail-dialog" :title="readonly||disabledEditPosition ? positionInfoForm.positionName : '编辑职位'" width="60%" :visible.sync="showDialog" :close-on-click-modal='readonly || false' :before-close='close' center>

      <el-form ref="positionInfoForm" :model="positionInfoForm" class="add-position-form" v-if="readonly">
        <el-form-item label="职位名称" prop="positionName">
          <p>{{positionInfoForm.positionName}}</p>
        </el-form-item>
        <el-form-item label="职位类别" prop="positionType">
          <p>{{positionInfoForm.positionTypeName}}</p>
        </el-form-item>
        <el-form-item label="职位性质" prop="positionProperty">
          <p>{{positionPropertyLabel}}</p>
        </el-form-item>
        <el-form-item label="专业要求" prop="major">
          <p>{{majorLabel}}</p>
        </el-form-item>
        <el-form-item label="培养层次" prop="diploma">
          <p>{{diplomaLabel}}</p>
        </el-form-item>
        <el-form-item label="薪资范围" prop="salary">
          <p>{{salaryLabel}}</p>
        </el-form-item>
        <el-form-item label="招聘人数" prop="recruitNumber">
          <p>{{positionInfoForm.recruitNumber}}</p>
        </el-form-item>
        <el-form-item label="工作地点" prop="selectCity">
          <p>{{selectCityLabel}}</p>
        </el-form-item>
        <el-form-item label="工作职责" prop="positionRemarks">
          <p>{{positionInfoForm.positionRemarks}}</p>
        </el-form-item>
        <el-form-item label="工作要求" prop="positionRequire">
          <p>{{positionInfoForm.positionRequire}}</p>
        </el-form-item>
      </el-form>

      <el-form  ref="positionInfoForm" :rules="addPositionRules" label-width='120px' :model="positionInfoForm" class="add-position-form" :disabled='disabledEditPosition' v-if="!readonly&&!loading">
        <el-form-item label="职位名称" prop="positionName">
          <el-input v-model="positionInfoForm.positionName" placeholder="请输入职位名称" class="custom-el-input"></el-input>
        </el-form-item>
        <el-form-item label="职位类别" prop="positionType">
          <el-select placeholder="请选择职位类别" v-model="positionInfoForm.positionType">
            <el-option v-for="(item,index) in dict_type" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <!-- <el-cascader ref='cascader' style="width: 60%;" :show-all-levels='false' @change="positionTypeChange" :options="dict_type"  v-model='positionInfoForm.positionType'></el-cascader> -->
        </el-form-item>
        <el-form-item label="职位性质" prop="positionProperty">
          <el-radio-group v-model="positionInfoForm.positionProperty">
            <el-radio label="PRACTICE">实习</el-radio>
            <el-radio label="FULL_TIME">全职</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="专业要求" prop="major">
          <el-select v-model="positionInfoForm.majorArr" multiple placeholder="请选择专业要求" @change='filterMajor'>
            <el-option v-for="(item,index) in dict_duty" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="培养层次" prop="diploma">
          <el-select v-model="positionInfoForm.diplomaArr" multiple placeholder="请选择学历要求">
            <el-option v-for="(item,index) in dict_educational" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="薪资范围" prop="salary">
          <el-select v-model="positionInfoForm.salary" placeholder="请选择薪资范围">
            <el-option v-for="(item,index) in dict_moneyRange" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="招聘人数" prop="recruitNumber">
          <!-- <el-input class="custom-el-input" v-model="positionInfoForm.number"></el-input> -->
          <el-input class="custom-el-input" type="number" min="1" v-model="positionInfoForm.recruitNumber"></el-input>
        </el-form-item>
        <el-form-item label="工作地点" prop="selectCity">
          <!-- <linkage v-if='showAddPositionModal' :options='positionInfoForm.workplace' :showArea='true' width='145' @getData='getLocation'></linkage> -->
          <!-- <el-cascader-multi class="selectList" :show-leaf-label='true' :only-last='true' :is-two-dimension-value='false'  v-model="positionInfoForm.selectCity" :data="options" @change="addressChange"></el-cascader-multi> -->
          <el-cascader style="width:100%;" @remove-tag='removePlace' :options="options" :props="{ multiple: true, checkStrictly: true,emitPath: false }" @change="addressChange" v-model="positionInfoForm.selectCity"></el-cascader>
        </el-form-item>
        <el-form-item label="工作职责" prop="positionRemarks">
          <el-input type="textarea" rows="5" placeholder="工作职责" v-model="positionInfoForm.positionRemarks" resize="none"></el-input>
        </el-form-item>
        <el-form-item label="工作要求" prop="positionRequire">
          <el-input type="textarea" rows="5" placeholder="工作要求" v-model="positionInfoForm.positionRequire" resize="none"></el-input>
        </el-form-item>
        <el-form-item v-if="showSave">
          <el-checkbox v-model="checked">是否保存到职业模板库</el-checkbox>
        </el-form-item>
      </el-form>
      
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit" v-if="!readonly">保存</el-button>
        <el-button plain @click="cancle" v-if="!readonly">取消</el-button>
      </div>
      <div class="mask" v-show="loading">
        <img style="width: 100%;" src="/static/image/employment/load.gif" alt="">
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { sAjax } from '../../../assets/utils/utils';
  import { getDict,getLoginType} from '../api/api'
  export default {
    props: ['showDialog', 'disabledEditPosition', 'defaultFormInfo', 'readonly','isEditPosition','saveToJobPool'],
    //showDialog: 控制弹窗的显示隐藏(true/false)   显示隐藏全由父组件控制
    //disabledEditPosition:能否编辑职位信息(true/false)，默认true
    //formInfo: 默认的表单对象，仅详情

    data() {
      return {
        loginType:'',
        checked: false,
        loading: true,
        dialogVisible: false,
        options: [],
        cityOptions: [],//选中的城市代码
        dict_type: [],//行业字典
        dict_duty: [],//专业字典
        dict_moneyRange: [],//薪资范围字典
        dict_educational: [],//学历字典
        positionInfoForm: {
          positionName: "",
          positionType: "",
          positionProperty: "",
          major: "0",
          diploma: "",
          salary: "",
          recruitNumber: "",
          workplace: "",
          positionRemarks: "",
          positionRequire: "",
          selectCity: [],
          positionTypeLabel:'',//中文,
          majorArr: [],
          diplomaArr: []
        },
        addPositionRules: {
          positionName: [{ required: true, message: "请输入职位名称", trigger: "blur" }],
          positionType: [{ required: true, message: "请输入职位类别", trigger: "change" }],
          positionProperty: [
            { required: true, message: "请选择职位性质", trigger: "change" }
          ],
          major: [
            {
              required: true,
              message: "请选择专业要求",
              trigger: "change"
            }
          ],
          diploma: [
            {
              required: true,
              message: "请选择学历要求",
              trigger: "change"
            }
          ],
          salary: [{ required: true, message: "请选择薪资范围", trigger: "change" }],
          recruitNumber: [
            { required: true, message: "招聘人数不能为空" },
          ],
          positionRemarks: [
            { required: true, message: "请填写工作职责", trigger: "blur" }
          ],
          positionRequire: [
            { required: true, message: "请填写工作要求", trigger: "blur" }
          ],
          selectCity: [{ required: true, message: "请选择工作地点", trigger: "change" }]
        },
      }
    },
    computed: {
      showSave() {
        console.log(this.saveToJobPool || true)
        if(this.loginType == 'COMPANY'){
          if(this.saveToJobPool == false)  {
            return false
          }else {
            return true
          }
          console.log(this.saveToJobPool)
        }else {
          let id = window.sessionStorage.getItem('addPosition_unitId')
          return this.saveToJobPool || id
        }
      },
      positionTypeLabel() {
        return (this.dict_type.find(dict => dict.value === this.positionInfoForm.positionType) || {}).label
      },
      positionPropertyLabel() {
        return { PRACTICE: '实习', FULL_TIME: '全职' }[this.positionInfoForm.positionProperty]
      },
      majorLabel() {
        let majorLabel = ""
        let dictDuty = this.dict_duty
        let firstDun = true;
        this.positionInfoForm.majorArr.forEach(function(v,k){
          let majorItem = (dictDuty.find(dict => dict.value === v) || {}) .label
          if(firstDun) {
            if(majorItem) majorLabel = majorItem
          } else {
            if(majorItem) majorLabel += "，" + majorItem
          }
          firstDun = false
        })
        return majorLabel
        // return (this.dict_duty.find(dict => dict.value === this.positionInfoForm.major) || {}).label
      },
      diplomaLabel() {
        let diplomaLabel = ""
        let dictEducational = this.dict_educational
        let firstDun = true;
        this.positionInfoForm.diplomaArr.forEach(function(v,k){
          let diplomaItem = (dictEducational.find(dict => dict.value === v) || {}) .label
          if(firstDun) {
            if(diplomaItem) diplomaLabel = diplomaItem
          } else {
            if(diplomaItem) diplomaLabel += "，" + diplomaItem
          }
          firstDun = false
        })
        return diplomaLabel
        // return (this.dict_educational.find(dict => dict.value === this.positionInfoForm.diploma) || {}).label
      },
      salaryLabel() {
        return (this.dict_moneyRange.find(dict => dict.value === this.positionInfoForm.salary) || {}).label
      },
      selectCityLabel() {
        let placeLabels = []
        let places = (this.positionInfoForm.workplace || '').split(',')
        for (const place of places) {
          for (const province of this.options) {
            if (place === province.value) {
              placeLabels.push(`${province.label}`)
              break
            }
            for (const city of province.children) {
              if (place === city.value) {
                placeLabels.push(`${province.label}${city.label}`)
                break
              }
              for (const area of city.children) {
                if (place === area.value) {
                  placeLabels.push(`${province.label}${city.label}${area.label}`)
                  break
                }
              }
            }
          }
        }
        return placeLabels.join('  ')
      }
    },
    methods: {
      filterMajor(currenVal) {
        //过滤专业不限
        let length = currenVal.length;
        if(length>1 && currenVal[length-1] === "0"){
          this.positionInfoForm.majorArr = ["0"]
        }else if(length === 2 && currenVal[0] === "0" ){
          this.positionInfoForm.majorArr.shift();
        }
      },
      removePlace() {
        // setTimeout(() => {
        //   this.$refs['positionInfoForm'].validateField('selectCity')
        // },100)
      },
      //三级地区
      positionTypeChange() {
        setTimeout(() => {
          if(this.$refs.cascader.inputValue != '') {
            this.positionInfoForm.positionTypeLabel = this.$refs.cascader.inputValue
            this.positionInfoForm.positionTypeName = this.$refs.cascader.inputValue
          }
        },20)
        
      },
      getAddress() {
        let url = '/api/employment/system/getThreeLevelDict?typeName=地区'
        sAjax({
          url: url,
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.options = data.data
                setTimeout(() => {
                  this.loading = false
                },100)
            }
          }
        })
      },
      getPosition() {
        //职位类别' + name
        let url = '/api/employment/system/findLinkDict?typeName=职业'
        sAjax({
          url: url,
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.dict_type = data.data
            }
          }
        })
      },
      getDictList(type, dataName) {  //获取字典列表  dataName:接收字典的字段名
        getDict(type).then(data => {
          if (data.state) {
            this[dataName] = data.data
          } else {
            this[dataName] = []
          }
        })
      },
      getPositionList() {

      },
      addressChange(val) {
        console.log(val)
        this.cityOptions = val
      },
      cancle(cb) { //取消按钮
        if(this.$refs['positionInfoForm']) {
          this.$refs['positionInfoForm'].resetFields()
          this.$refs['positionInfoForm'].clearValidate()
        }
        this.$emit('closeDialog')
        if (typeof cb === "function") {
          cb()
        }

      },
      close(done) {
        this.cancle(done)
      },
      submit() {  //职位表单提交
        this.$refs['positionInfoForm'].validate(valid => {
          if (valid) {
            if(!this.positionInfoForm.selectCity.length) {
              return this.$message.error('请选择工作地点')
            }
            if (this.disabledEditPosition) {  //只能查看不能编辑
              this.$emit('closeDialog')
              return
            }
            let info = this.positionInfoForm
            let positionType = this.positionInfoForm.positionType
            let city = []
            info.workplace = this.cityOptions.join(',')
            // info.positionType = info.positionType[info.positionType.length-1]
            info.major = this.positionInfoForm.majorArr.join(',')
            info.diploma = this.positionInfoForm.diplomaArr.join(',')
            console.log(info)
            // this.dict_type.map((val) => {  //设置传给后台的value值
            //   if (val.value == positionType) {
            //     info.positionTypeName = val.label
            //   }
            // })
                if(this.loginType!= 'COMPANY') {
                  info.companyId = window.sessionStorage.getItem("addPosition_unitId")
                }
                if(this.checked) {
                  let url = '/api/employment/positionTemplate/addPositionTemplate'
                  sAjax({
                    url: url,
                    type: 'post',
                    data: info,
                    success: (res) => {
                      if(res.state) {
                      }else {
                        this.$message.error('添加到职位库失败')
                      }
                    }
                  })
                }
            // if(this.defaultFormInfo) {
              this.$message.success('保存成功')
            // }else {
            //   this.$message.success('添加成功')
            // }
            // ScrollTop(700,20)
            this.$emit('positionSubmit', info)
            this.$emit('closeDialog')


          }
        })
      },
      getLoginType() {
        getLoginType().then(data => {
          if(data.state) {
            this.loginType = data.data.loginType
          }else{
            this.loginType = ''
          }
        })
      },
      defaultForm() {  //判断是否有默认的表单对象
        if (this.defaultFormInfo) {
          this.loading = true
          let info = this.defaultFormInfo
          this.positionInfoForm = {
            positionName: info.positionName,
            positionType: info.positionType,
            positionProperty: info.positionProperty,
            major: info.major,
            diploma: info.diploma,
            salary: info.salary,
            recruitNumber: info.recruitNumber,
            workplace: info.workplace,
            positionRemarks: info.positionRemarks,
            positionRequire: info.positionRequire,
            positionTypeName: info.positionTypeName?info.positionTypeName:info.type
            // selectCity: info.workplace
          }
          let majorList = info.major.split(',')
          if(majorList.length) {
            this.$set(this.positionInfoForm,'majorArr', majorList)
          } else {
            this.$set(this.positionInfoForm,'majorArr', [])
          }
          let diplomaList = info.diploma.split(',')
          if(diplomaList.length) {
            this.$set(this.positionInfoForm,'diplomaArr',diplomaList)
          }else {
            this.$set(this.positionInfoForm,'diplomaArr',[])
          }
          
          
          let workList = this.positionInfoForm.workplace.split(',')
          if(workList.length) {
             this.positionInfoForm.selectCity = workList
             this.cityOptions = workList
          }else {
            this.positionInfoForm.selectCity = []
            this.cityOptions = []
          }
          if (info.id) {  //已有的职位信息
            this.positionInfoForm.id = info.id
          }
          console.log(this.defaultFormInfo)
        }
      },
    },

    created() {
      this.defaultForm()
      // this.getDictList('职业', 'dict_type')
      this.getDictList('专业要求', 'dict_duty')
      this.getDictList('薪资范围', 'dict_moneyRange')
      this.getDictList('学历', 'dict_educational')
      this.getPosition()
      this.getAddress()
      this.getLoginType()
      


    }
  }
</script>
<style lang="less" scoped>
</style>
<style lang="less">
.el-cascader-panel {
  max-height:250px;
}
#position {
  .add-position-form.el-form {
    padding: 0 24px 0 12px;
    .el-select {
      width: 60%;
      .el-input {
        width: 100%;
      }
    }
    .el-input {
      width: 60%;
    }
    .el-cascader {
      .el-input {
        width: 100%;
    }
    }
    .el-form-item .el-form-item__content {
      height: auto;
    }
    .el-form-item__error {
      padding-top: 0;
    }
    .linkage {
      .el-select {
        width: 33%;
      }
    }
  }
  .el-dialog__body {
    min-height:600px;
  }
}
</style>
