import yoiAxios from '../yoiAxios'
import type {
  LoginParams,
  LoginRes,
  MenuInfoRes,
  PersonalData,
  UpdatePasswordParams,
  UpdatePersonalDataParams,
  UserInfoRes,
} from './type'

const prefix = '/sys_auth'

enum Api {
  login = prefix + '/login',
  getInfo = prefix + '/get_info',
  getMenu = prefix + '/get_menu',
  logout = prefix + '/logout',
  getPersonalData = prefix + '/get_personal_data',
  updatePersonalData = prefix + '/update_personal_data',
  updatePassword = prefix + '/update_password',
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

/**
 * 获取个人数据
 */
export function getPersonalDataApi() {
  return yoiAxios.get<PersonalData>(Api.getPersonalData)
}

/**
 * 修改个人数据
 */
export function updatePersonalDataApi(data: Partial<UpdatePersonalDataParams>) {
  return yoiAxios.post(Api.updatePersonalData, data, {
    showCodeMessage: true,
  })
}

/**
 * 修改密码
 */
export function updatePasswordApi(data: UpdatePasswordParams) {
  return yoiAxios.post(Api.updatePassword, data, {
    showCodeMessage: true,
  })
}
