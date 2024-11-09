import yoiAxios from '../yoiAxios'
import type { LoginParams, LoginRes, UserInfoRes } from './type'

const prefix = '/sys_auth'

enum Api {
  login = prefix + '/login',
  getInfo = prefix + '/get_info',
}

/**
 * 登录
 */
export function loginApi(data: LoginParams) {
  return yoiAxios.post<LoginRes>(Api.login, data, {
    showCodeMessage: true,
  })
}

/**
 * 获取用户信息
 */
export function getInfoApi() {
  return yoiAxios.get<UserInfoRes>(Api.getInfo, undefined, {
    loading: true,
  })
}
