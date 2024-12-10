import yoiAxios from '@/api/yoiAxios'
import type {
  GetUserListParams,
  AddUserInfoParams,
  UpdateUserInfoParams,
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
  return yoiAxios.get<UserInfo>(Api.getInfo, { userId })
}

/**
 * 获取用户角色列表
 * @param userId 用户id
 * @returns Promise
 */
export function getUserRoleListApi() {
  return yoiAxios.get(Api.listRoleNormal)
}

/**
 * 获取用户部门列表
 * @param userId 用户id
 * @returns Promise
 */
export function getUserDeptListApi() {
  return yoiAxios.get(Api.listDeptNormal)
}

/**
 * 获取用户岗位列表
 * @param userId 用户id
 * @returns Promise
 */
export function getUserPostListApi() {
  return yoiAxios.get(Api.listPostNormal)
}
