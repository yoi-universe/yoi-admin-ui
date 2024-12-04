import yoiAxios from '@/api/yoiAxios'
import type {
  AddMenuInfoParams,
  GetMenuListParams,
  UpdateMenuInfoParams,
} from './type'
import type { MenuTree } from '@/types/system/menu'

const prefix = '/sys_menu'

enum Api {
  list = prefix + '/list',
  add = prefix + '/add',
  update = prefix + '/update',
  delete = prefix + '/delete',
  getInfo = prefix + '/get_info',
}

/**
 * 获取菜单列表
 * @param params 查询参数
 * @returns Promise
 */
export function getMenuListApi(params: GetMenuListParams) {
  return yoiAxios.get<MenuTree[]>(Api.list, params)
}

/**
 * 添加菜单
 * @param data 菜单数据
 * @returns Promise
 */
export function addMenuApi(data: AddMenuInfoParams) {
  return yoiAxios.post(Api.add, data, {
    showCodeMessage: true,
  })
}

/**
 * 修改菜单
 * @param data 菜单数据
 * @returns Promise
 */
export function updateMenuApi(data: UpdateMenuInfoParams) {
  return yoiAxios.put(Api.update, data, {
    showCodeMessage: true,
  })
}

/**
 * 删除菜单
 * @param menuId 菜单ID
 * @returns Promise
 */
export function deleteMenuApi(menuIds: number[]) {
  return yoiAxios.delete(Api.delete, menuIds, {
    showCodeMessage: true,
  })
}

/**
 * 获取菜单详情
 * @param menuId 菜单ID
 * @returns Promise
 */
export function getMenuInfoApi(menuId: number) {
  return yoiAxios.get<MenuTree>(Api.getInfo, { menuId })
}
