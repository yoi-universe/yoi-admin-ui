<template>
  <div class="w-36px h-36px rounded-5px hover:bg-[rgba(0,0,0,0.06)] group flex flex-justify-center flex-items-center"
    @click="handleCollapse">
    <YoiGlobalIcon class="group-hover:color-[--el-color-primary]" :icon="isCollapse ? 'Expand' : 'Fold'" size="20" />
  </div>
</template>

<script lang="ts" setup>
import { useGlobalStore } from '@/stores';
import { storeToRefs } from 'pinia';
import YoiGlobalIcon from '@/components/YoiGlobalIcon/index.vue';

const globalStore = useGlobalStore()
const { isCollapse } = storeToRefs(globalStore)
const { setCollapse } = globalStore

const handleCollapse = () => {
  setCollapse(!isCollapse.value)
}
</script>

<style scoped></style>
