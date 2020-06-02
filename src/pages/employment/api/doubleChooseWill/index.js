import { pAjax } from '@/assets/utils/utils'
import dcw from './dcw'
import stand from './stand'
import unit from './unit'

export default {
  dcw,
  stand,
  unit,
  async uploadPicture (file) {
    const data = new FormData()
    data.append('file', file)
    return pAjax({
      url: '/upload/storage/files',
      type: 'post',
      data: data,
      contentType: false,
      processData: false
    })
  }
}
