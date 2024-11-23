import yoiAxios from '../yoiAxios'
import type { LoginParams, LoginRes, MenuInfoRes, UserInfoRes } from './type'

const prefix = '/sys_auth'

enum Api {
  login = prefix + '/login',
  getInfo = prefix + '/get_info',
  getMenu = prefix + '/get_menu',
  logout = prefix + '/logout',
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
export function getUserInfoApi() {
  return yoiAxios.get<UserInfoRes>(Api.getInfo, undefined, {
    loading: true,
    showCodeMessage: true,
    showMessage: false,
  })
}

/**
 * 获取菜单
 */
export function getUserMenuApi() {
  return yoiAxios.get<MenuInfoRes>(Api.getMenu, undefined, {
    loading: true,
    showCodeMessage: true,
    showMessage: false,
  })
}

/**
 * 退出登录
 */
export function logoutApi() {
  return yoiAxios.post(Api.logout)
}
