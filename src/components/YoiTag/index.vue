<template>
  <div>
    <template v-for="item in tagOptions">
      <el-tag
        v-if="value != null && value.toString() === item.dictValue.toString()"
        :disable-transitions="true"
        :key="item.dictCode"
        :type="item.listClass"
        :size="size"
        :style="item.cssClass"
      >
        {{ item.dictLabel }}
      </el-tag>
    </template>
  </div>
</template>

<script lang="ts" setup>
import type { DictDataInfo } from '@/types/system/dict'

const { tagOptions = [], value = '', size = 'default' } = defineProps<Props>()
</script>
<script lang="ts">
interface Props {
  tagOptions?: DictDataInfo[]
  value?: string | number
  size?: string
}
</script>

<style scoped></style>
