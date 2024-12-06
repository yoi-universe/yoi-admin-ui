import yoiAxios from '@/api/yoiAxios'
import type {
  GetRoleListParams,
  AddRoleInfoParams,
  UpdateRoleInfoParams,
} from './type'
import type { RoleInfo } from '@/types/system/role'
import type { PageInfo } from '@/types/page'

const prefix = '/sys_role'

enum Api {
  list = prefix + '/list',
  add = prefix + '/add',
  update = prefix + '/update',
  delete = prefix + '/delete',
  getInfo = prefix + '/get_info',
}

/**
 * 获取角色列表
 * @param params 查询参数
 * @returns Promise
 */
export function getRoleListApi(params: GetRoleListParams) {
  return yoiAxios.get<PageInfo<RoleInfo>>(Api.list, params)
}

/**
 * 新增角色
 * @param data 角色信息
 * @returns Promise
 */
export function addRoleApi(data: AddRoleInfoParams) {
  return yoiAxios.post(Api.add, data, {
    showCodeMessage: true,
  })
}

/**
 * 修改角色
 * @param data 角色信息
 * @returns Promise
 */
export function updateRoleApi(data: UpdateRoleInfoParams) {
  return yoiAxios.put(Api.update, data, {
    showCodeMessage: true,
  })
}

/**
 * 删除角色
 * @param roleIds 角色id数组
 * @returns Promise
 */
export function deleteRoleApi(roleIds: number[]) {
  return yoiAxios.delete(Api.delete, roleIds, {
    showCodeMessage: true,
  })
}

/**
 * 获取角色信息
 * @param roleId 角色id
 * @returns Promise
 */
export function getRoleInfoApi(roleId: number) {
  return yoiAxios.get<RoleInfo>(Api.getInfo, { roleId })
}
