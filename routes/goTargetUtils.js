let goTargetUtils = (req,res,schoolId,schoolConfig, type,next) => {
    if (req.path == '/') {
      if (schoolId) {
        let m = 0
        if (schoolConfig.empower != undefined && schoolConfig.empower.system != undefined && schoolConfig.empower.system.length > 0) {
          schoolConfig.empower.system.forEach((item) => {
            if (item.name == 'servicecenter') {
              m++
            }
          })
        }
        else {
          m = 0
        }
        if (m > 0) {
          const reg = /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/g
          if (reg.test(req.hostname)) {
            return res.redirect(`http://${req.hostname}:9000/servicecenter`)
          } else {
            return res.redirect(`http://${req.hostname}/servicecenter/home`)
          }
        }
        else {
          if (type == 0) {
            next()
          } else {
            return res.redirect(`/login`)
          }
        }
      }
    }
    else {
      if (type == 0) {
        next()
      } else {
        return res.redirect(`/login`)
      }
    }
  }
  module.exports = {goTargetUtils:goTargetUtils}