import yoiAxios from '@/api/yoiAxios'
import type {
  GetUserListParams,
  AddUserInfoParams,
  UpdateUserInfoParams,
  UserInfoRes,
} from './type'
import type { PageInfo } from '@/types/page'
import type { UserInfo } from '@/types/system/user'

const prefix = '/sys_user'

enum Api {
  list = prefix + '/list',
  add = prefix + '/add',
  update = prefix + '/update',
  delete = prefix + '/delete',
  getInfo = prefix + '/get_info',
  listRoleNormal = prefix + '/list_role_normal',
  listDeptNormal = prefix + '/list_dept_normal',
  listPostNormal = prefix + '/list_post_normal',
}

/**
 * 获取用户列表
 * @param params 查询参数
 * @returns Promise
 */
export function getUserListApi(params: GetUserListParams) {
  return yoiAxios.get<PageInfo<UserInfo>>(Api.list, params)
}

/**
 * 新增用户
 * @param data 用户信息
 * @returns Promise
 */
export function addUserApi(data: AddUserInfoParams) {
  return yoiAxios.post(Api.add, data, {
    showCodeMessage: true,
  })
}

/**
 * 更新用户
 * @param data 用户信息
 * @returns Promise
 */
export function updateUserApi(data: UpdateUserInfoParams) {
  return yoiAxios.put(Api.update, data, {
    showCodeMessage: true,
  })
}

/**
 * 删除用户
 * @param userIds 用户id
 * @returns Promise
 */
export function deleteUserApi(userIds: number[]) {
  return yoiAxios.delete(Api.delete, userIds, {
    showCodeMessage: true,
  })
}

/**
 * 获取用户信息
 * @param userId 用户id
 * @returns Promise
 */
export function getUserInfoApi(userId: number) {
  return yoiAxios.get<UserInfoRes>(Api.getInfo, { userId })
}

/**
 * 获取正常角色列表
 * @returns Promise
 */
export function getNormalRoleListApi() {
  return yoiAxios.get(Api.listRoleNormal, undefined, {
    cancelRepeatRequest: false,
  })
}

/**
 * 获取正常部门列表
 * @returns Promise
 */
export function getNormalDeptListApi() {
  return yoiAxios.get(Api.listDeptNormal, undefined, {
    cancelRepeatRequest: false,
  })
}

/**
 * 获取正常岗位列表
 * @returns Promise
 */
export function getNormalPostListApi() {
  return yoiAxios.get(Api.listPostNormal, undefined, {
    cancelRepeatRequest: false,
  })
}
