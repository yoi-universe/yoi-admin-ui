<template>
  <div class="toolbar">
    <!-- 明亮/黑暗模式图标 -->
    <Dark />
    <!-- 中英翻译 -->
    <Language />
    <!-- 全屏配置 -->
    <FullScreen />
    <!-- 头像和下拉 -->
    <User />
  </div>
</template>

<script lang="ts" setup>
import Dark from './Dark.vue';
import Language from './Language.vue';
import FullScreen from './FullScreen.vue';
import User from './User.vue';
</script>

<style lang="scss" scoped>
.toolbar {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
