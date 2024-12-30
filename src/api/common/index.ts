import type { FileInfo } from '@/types/fileInfo'
import yoiAxios from '../yoiAxios'

const prefix = '/common'

enum Api {
  uploadImg = prefix + '/upload_img',
  uploadFile = prefix + '/upload_file',
}

/**
 * 上传图片
 * @param file 文件
 * @returns Promise
 */
export function uploadImgApi(file: FormData) {
  return yoiAxios.upload(Api.uploadImg, file, { showCodeMessage: true })
}

/**
 * 上传文件
 * @param file 文件
 * @returns Promise
 */
export function uploadFileApi(file: FormData) {
  return yoiAxios.upload<FileInfo>(Api.uploadFile, file, {
    showCodeMessage: true,
  })
}
