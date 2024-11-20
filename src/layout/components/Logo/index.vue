<template>
  <div class="logo">
    <img class="border-rd-50%" :src="logo" width="34" height="34">
    <div class="logo-text flex-1 font-size-18px font-bold ml-10px">
      YOI-ADMIN
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getAssets } from '@/utils';

const logo = getAssets('images/logo.svg')
</script>

<style lang="scss" scoped>
.logo {
  height: $aside-header-height;
  display: flex;
  align-items: center;

  .logo-text {
    color: var(--el-color-primary);
  }
}
</style>
