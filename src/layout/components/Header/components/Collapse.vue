<template>
  <div class="w-36px h-36px rounded-5px hover:bg-[rgba(0,0,0,0.06)] group flex flex-justify-center flex-items-center"
    @click="handleCollapse">
    <el-icon size="20" class="group-hover:color-[--el-color-primary]">
      <Expand v-if="isCollapse" />
      <Fold v-else />
    </el-icon>
  </div>
</template>

<script lang="ts" setup>
import { useGlobalStore } from '@/stores';
import { storeToRefs } from 'pinia';

const globalStore = useGlobalStore()
const { isCollapse } = storeToRefs(globalStore)
const { setCollapse } = globalStore

const handleCollapse = () => {
  setCollapse(!isCollapse.value)
}
</script>

<style scoped></style>
