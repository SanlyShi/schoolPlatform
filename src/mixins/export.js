import { request } from '../assets/utils/utils'
export default {
    data () {
      return {
          statusUrl: '/api/async/exports/exportStatus/',
          exportCode: ''
      }
    },
    methods: {
        exportFile (url, params, type) {
            return new Promise((resolve, reject) => {
                this.$waiting.show({
                    text: '正在导出...(导出时间跟学生数量相关，请耐心等待)',
                    container: 'body'
                  })
                request(url, params, type).then(o => {
                    if (o.state) {
                        this.exportCode = o.data
                        let _this = this
                        let getExportStatus = function getExportStatus () {
                            request(_this.statusUrl + _this.exportCode).then(p => {
                                _this.$waiting.close()
                                let timeOutStatus = ''
                                if (p.data && p.data.fileName) {
                                    clearTimeout(timeOutStatus)
                                    resolve(p)
                                } else if (!p.data) { //  出现异常
                                    _this.$toast(p.message)
                                    clearTimeout(timeOutStatus)
                                    reject(p)
                                } else {
                                    if (p.data.count) {
                                        _this.$waiting.show({
                                            text: '正在导出...(' + parseInt((p.data.hadSearchCount / p.data.count) * 100) + '%)',
                                            container: 'body'
                                          })
                                    } else {
                                        _this.$waiting.show({
                                            text: '正在导出...(' + parseInt((p.data.hadSearchCount / 100) * 100) + '%)',
                                            container: 'body'
                                          })
                                    }
                                    timeOutStatus = setTimeout(getExportStatus, 2000)
                                }
                            })
                        }
                        getExportStatus()
                    } else {
                        this.$waiting.close()
                    }
                })
            })
        },
    }
 }
