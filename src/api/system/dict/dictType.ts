import yoiAxios from '@/api/yoiAxios'
import type { DictTypeInfo } from '@/types/system/dict'
import type {
  GetDictTypeListParams,
  AddDictTypeInfoParams,
  UpdateDictTypeInfoParams,
} from './type'
import type { PageInfo } from '@/types/page'

const prefix = '/sys_dict_type'

enum Api {
  list = prefix + '/list',
  add = prefix + '/add',
  update = prefix + '/update',
  delete = prefix + '/delete',
  getInfo = prefix + '/get_info',
  listAll = prefix + '/list_all',
  refresh = prefix + '/refresh',
}

/**
 * 获取字典类型列表
 * @param params 查询参数
 * @returns Promise
 */
export function getDictTypeListApi(params: GetDictTypeListParams) {
  return yoiAxios.get<PageInfo<DictTypeInfo>>(Api.list, params)
}

/**
 * 新增字典类型
 * @param data 字典类型数据
 * @returns Promise
 */
export function addDictTypeApi(data: AddDictTypeInfoParams) {
  return yoiAxios.post(Api.add, data, {
    showCodeMessage: true,
  })
}

/**
 * 修改字典类型
 * @param data 字典类型数据
 * @returns Promise
 */
export function updateDictTypeApi(data: UpdateDictTypeInfoParams) {
  return yoiAxios.put(Api.update, data, {
    showCodeMessage: true,
  })
}

/**
 * 删除字典类型
 * @param dictIds 字典类型id
 * @returns Promise
 */
export function deleteDictTypeApi(dictIds: number[]) {
  return yoiAxios.delete(Api.delete, dictIds, {
    showCodeMessage: true,
  })
}

/**
 * 获取字典类型详情
 * @param dictId 字典类型id
 * @returns Promise
 */
export function getDictTypeInfoApi(dictId: number) {
  return yoiAxios.get(Api.getInfo, { dictId })
}

/**
 * 获取字典类型列表（下拉框）
 * @returns Promise
 */
export function getDictTypeAllApi() {
  return yoiAxios.get<DictTypeInfo[]>(Api.listAll, undefined, {
    cancelRepeatRequest: false,
  })
}

/**
 * 刷新字典缓存
 * @returns Promise
 */
export function refreshDictCacheApi() {
  return yoiAxios.get(Api.refresh, undefined, {
    showCodeMessage: true,
  })
}
