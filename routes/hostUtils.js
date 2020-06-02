const schoolUtil = require('../utils/schoolUtil')
const reg = /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/g
let selectSchoolId = (host,callback) => {
    let schoolId = ''
    if ( host.indexOf('xchsedu.com') > -1 && host.split(".").length >= 4) {
        schoolId = host.split(".")[0]
        callback(schoolId)
    }
     else {
        let schoolId = null
         schoolUtil.getSchoolLoginConfig(schoolId, (err, loginConfig, config) => {
            
            schoolId = config.schoolUid
            callback(schoolId)
        })
        
    }
}
exports.selectSchoolId = selectSchoolId