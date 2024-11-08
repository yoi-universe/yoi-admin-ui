import yoiAxios from '../yoiAxios'
import type { CaptchaImageRes } from './type'

enum Api {
  captchaImage = '/captchaImage',
}

/**
 * 获取图片验证码
 */
export function getCaptchaImageApi() {
  return yoiAxios.get<CaptchaImageRes>(Api.captchaImage)
}
