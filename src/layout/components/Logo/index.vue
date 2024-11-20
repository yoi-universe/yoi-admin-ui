<template>
  <div class="logo">
    <img class="rounded-50% ml-9px" :src="logo" width="34" height="34" alt="avatar">
    <div class="logo-text flex-1 font-size-18px font-bold ml-10px truncate" v-show="!isCollapse">
      YOI-ADMIN
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getAssets } from '@/utils';

const logo = getAssets('images/logo.svg')
const { isCollapse } = defineProps<Props>()

</script>
<script lang="ts">
interface Props {
  isCollapse: boolean
}
</script>

<style lang="scss" scoped>
.logo {
  height: $aside-header-height;
  display: flex;
  align-items: center;
  position: relative;

  .logo-text {
    color: var(--el-color-primary);
  }
}
</style>
