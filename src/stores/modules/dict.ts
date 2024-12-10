import { getDictDataListByTypeApi } from '@/api/system/dict/dictData'
import type { DictDataInfo } from '@/types/system/dict'
import { defineStore } from 'pinia'

export const useDictStore = defineStore('dict', {
  state: (): State => ({
    dictDataMap: new Map(),
  }),
  actions: {
    async getDictData(dictType: string) {
      if (this.dictDataMap.has(dictType)) {
        return this.dictDataMap.get(dictType)
      }
      const result = await getDictDataListByTypeApi(dictType)
      if (result.code === 200 && result.data !== null && result.data.length) {
        this.dictDataMap.set(dictType, result.data)
        return result.data
      }
      return []
    },
  },
})

interface State {
  dictDataMap: Map<string, DictDataInfo[]>
}
