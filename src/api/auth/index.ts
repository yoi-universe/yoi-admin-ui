import yoiAxios from '../yoiAxios'
import type { LoginParams, LoginRes } from './type'

const prefix = '/sys_auth'

enum Api {
  login = prefix + '/login',
}

/**
 * 登录
 */
export function loginApi(data: LoginParams) {
  return yoiAxios.post<LoginRes>(Api.login, data)
}
