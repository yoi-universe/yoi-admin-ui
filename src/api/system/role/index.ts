import yoiAxios from '@/api/yoiAxios'
import type {
  GetRoleListParams,
  AddRoleInfoParams,
  UpdateRoleInfoParams,
  AssignRoleDeptParams,
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
  listMenuNormal = prefix + '/list_menu_normal',
  roleMenuList = prefix + '/role_menu_list',
  assignRoleMenu = prefix + '/assign_role_menu',

  listDeptNormal = prefix + '/list_dept_normal',
  deptList = prefix + '/dept_list',
  assignRoleDept = prefix + '/assign_role_dept',
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

/**
 * 获取菜单列表（树形结构）
 * @param params 查询参数
 * @returns Promise
 */
export function getNormalMenuListApi() {
  return yoiAxios.get(Api.listMenuNormal)
}

/**
 * 获取角色菜单列表
 * @param roleId 角色id
 * @returns Promise
 */
export function getRoleMenuListApi(roleId: number) {
  return yoiAxios.get(Api.roleMenuList, { roleId })
}

/**
 * 分配角色菜单
 * @param roleId 角色id
 * @param menuIds 菜单id数组
 * @returns Promise
 */
export function assignRoleMenuApi(roleId: number, menuIds: number[]) {
  const url = `${Api.assignRoleMenu}?roleId=${roleId}`
  return yoiAxios.post(url, menuIds, {
    showCodeMessage: true,
  })
}

/**
 * 获取部门列表（树形结构）
 * @returns Promise
 */
export function getNormalDeptListApi() {
  return yoiAxios.get(Api.listDeptNormal)
}

/**
 * 获取角色部门列表
 * @param roleId 角色id
 * @returns Promise
 */
export function getRoleDeptListApi(roleId: number) {
  return yoiAxios.get(Api.deptList, { roleId })
}

/**
 * 分配角色部门
 * @param roleId 角色id
 * @param deptIds 部门id数组
 * @returns Promise
 */
export function assignRoleDeptApi(data: AssignRoleDeptParams) {
  return yoiAxios.post(Api.assignRoleDept, data, {
    showCodeMessage: true,
  })
}
