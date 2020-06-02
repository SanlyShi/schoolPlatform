import { request } from './utils'
const schoolIdDefaultUrl = '/system/schoolId'
const reg = /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/g
let schoolId = ''
const getNowSchoolId = (locationString)=>{
  if(reg.test(locationString) || locationString.split('/')[2].split('.').length < 4){
    request(schoolIdDefaultUrl,null,'post').then((data)=>{
        schoolId  = data.data
        return schoolId
    })
  }else if(locationString.split('/')[2].indexOf('xchsedu.com') >-1){
      schoolId = locationString.split('/')[2].split('.')[0]
      return schoolId
  }
}
export { getNowSchoolId }