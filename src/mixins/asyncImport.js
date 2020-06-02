import { request } from '../assets/utils/utils'
import {sAjax} from '../assets/utils/utils'
export default {
    data() {
        return {
            importSyncStatusUrl:'/api/async/imports/importStatus/',
            importCode:''
        }
    },
    methods: {
        importFile(url, formData) {
            return new Promise((resolve, reject) => {
                this.$waiting.show({
                    text: '正在导入...(导入时间跟学生数量相关，请耐心等待)',
                    container: 'body'
                  })
                  let _this = this
                  sAjax({
                    url: url, 
                    dataType: 'json',
                    async:false,
                    data: formData, 
                    processData: false,
                    contentType: false, 
                    type: 'post',
                    success: function (data) {
                        if(data.code == '88888'){
                            _this.importCode = data.data
                            let getImportStatus = function getImportStatus () {
                                request(_this.importSyncStatusUrl+_this.importCode).then(p=>{
                                    _this.$waiting.close()
                                    let timeOutStatusI = ''
                                    if(p.state){
                                        if(p.data.status == 'CHECK_COMPLETE'){
                                            clearTimeout(timeOutStatusI)
                                            resolve(p)
                                        }
                                        else if(p.data.status == 'IMPORT_ERROR'){
                                            _this.$toast(p.data.message)
                                            clearTimeout(timeOutStatusI)
                                            reject(p)
                                        }
                                        else{
                                            _this.$waiting.show({
                                                text: '正在导入...(导入时间跟学生数量相关，请耐心等待)',
                                                container: 'body'
                                              })
                                            timeOutStatusI = setTimeout(getImportStatus, 2000)
                                        }
                                    }
                                })
                            }
                            getImportStatus()
                        }
                        else{
                            this.$waiting.close()
                        }
                    }
            })
        })
    }
}
}
