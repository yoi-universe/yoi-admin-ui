import yoiAxios from '@/api/yoiAxios'
import type {
  GetDeptListParams,
  AddDeptInfoParams,
  UpdateDeptInfoParams,
} from './type'
import type { DeptInfo, DeptTree } from '@/types/system/dept'

const prefix = '/sys_dept'

enum Api {
  list = prefix + '/list',
  add = prefix + '/add',
  update = prefix + '/update',
  delete = prefix + '/delete',
  getInfo = prefix + '/get_info',
  selectAll = prefix + '/select_all',
}

/**
 * 获取部门列表
 * @param params 查询参数
 * @returns Promise
 */
export function getDeptListApi(params: GetDeptListParams) {
  return yoiAxios.get<DeptTree[]>(Api.list, params)
}

/**
 * 新增部门
 * @param data 部门信息
 * @returns Promise
 */
export function addDeptApi(data: AddDeptInfoParams) {
  return yoiAxios.post(Api.add, data, {
    showCodeMessage: true,
  })
}

/**
 * 修改部门
 * @param data 部门信息
 * @returns Promise
 */
export function updateDeptApi(data: UpdateDeptInfoParams) {
  return yoiAxios.put(Api.update, data, {
    showCodeMessage: true,
  })
}

/**
 * 删除部门
 * @param deptIds 部门id数组
 * @returns Promise
 */
export function deleteDeptApi(deptIds: number[]) {
  return yoiAxios.delete(Api.delete, deptIds, {
    showCodeMessage: true,
  })
}

/**
 * 获取部门信息
 * @param deptId 部门id
 * @returns Promise
 */
export function getDeptInfoApi(deptId: number) {
  return yoiAxios.get<DeptInfo>(Api.getInfo, { deptId })
}

/**
 * 获取部门下拉列表
 * @returns Promise
 */
export function getDeptSelectListApi() {
  return yoiAxios.get<DeptTree[]>(Api.selectAll)
}
