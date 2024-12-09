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
      const res = await getDictDataListByTypeApi(dictType)
      this.dictDataMap.set(dictType, res.data)
      return res.data
    },
  },
})

interface State {
  dictDataMap: Map<string, DictDataInfo[]>
}
