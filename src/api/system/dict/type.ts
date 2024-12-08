import type { PageParams } from '@/types/page'
import type { DictDataInfo, DictTypeInfo } from '@/types/system/dict'

type OmitParams = 'createBy' | 'createTime' | 'updateBy' | 'updateTime'
// ********** 字典类型 **********
export interface GetDictTypeListParams extends PageParams {
  dictName?: string
  dictType?: string
  status?: number | null
}

export interface AddDictTypeInfoParams
  extends Omit<DictTypeInfo, OmitParams | 'dictId'> {}

export interface UpdateDictTypeInfoParams
  extends Omit<DictTypeInfo, OmitParams> {}

// ********** 字典数据 **********
export interface GetDictDataListParams extends PageParams {
  dictType?: string
  dictLabel?: string
  status?: number | null
}

export interface AddDictDataInfoParams
  extends Omit<DictDataInfo, OmitParams | 'dictCode'> {}

export interface UpdateDictDataInfoParams
  extends Omit<DictDataInfo, OmitParams> {}
