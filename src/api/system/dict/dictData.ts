import yoiAxios from '@/api/yoiAxios'
import type { DictDataInfo } from '@/types/system/dict'
import type {
  GetDictDataListParams,
  AddDictDataInfoParams,
  UpdateDictDataInfoParams,
} from './type'
import type { PageInfo } from '@/types/page'

const prefix = '/sys_dict_data'

enum Api {
  list = prefix + '/list',
  add = prefix + '/add',
  update = prefix + '/update',
  delete = prefix + '/delete',
  getInfo = prefix + '/get_info',
  listByType = prefix + '/list_by_type',
}

/**
 * 获取字典数据列表
 * @param params 查询参数
 * @returns Promise
 */
export function getDictDataListApi(params: GetDictDataListParams) {
  return yoiAxios.get<PageInfo<DictDataInfo>>(Api.list, params)
}

/**
 * 新增字典数据
 * @param data 字典数据参数
 * @returns Promise
 */
export function addDictDataApi(data: AddDictDataInfoParams) {
  return yoiAxios.post(Api.add, data, {
    showCodeMessage: true,
  })
}

/**
 * 更新字典数据
 * @param data 字典数据参数
 * @returns Promise
 */
export function updateDictDataApi(data: UpdateDictDataInfoParams) {
  return yoiAxios.put(Api.update, data, {
    showCodeMessage: true,
  })
}

/**
 * 删除字典数据
 * @param dictIds 字典数据id
 * @returns Promise
 */
export function deleteDictDataApi(dictCodes: number[]) {
  return yoiAxios.delete(Api.delete, dictCodes, {
    showCodeMessage: true,
  })
}

/**
 * 获取字典数据信息
 * @param dictId 字典数据id
 * @returns Promise
 */
export function getDictDataInfoApi(dictCode: number) {
  return yoiAxios.get(Api.getInfo, { dictCode })
}

/**
 * 根据字典类型获取字典数据列表
 * @param dictType 字典类型
 * @returns Promise
 */
export function getDictDataListByTypeApi(dictType: string) {
  return yoiAxios.get(Api.listByType + '/' + dictType)
}
