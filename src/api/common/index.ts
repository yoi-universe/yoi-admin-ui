import yoiAxios from '../yoiAxios'

const prefix = '/common'

enum Api {
  uploadImg = prefix + '/upload_img',
}

/**
 * 上传图片
 * @param file 文件
 * @returns Promise
 */
export function uploadImgApi(file: FormData) {
  return yoiAxios.upload(Api.uploadImg, file, { showCodeMessage: true })
}
