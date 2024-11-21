<template>
  <div class="header">
    <!-- 左侧 -->
    <div class="header-left">
      <Collapse />
      <Breadcrumb />
    </div>
    <!-- 右侧 -->
    <Toolbar />
  </div>
</template>

<script lang="ts" setup>
import Collapse from './components/Collapse.vue';
import Breadcrumb from './components/Breadcrumb.vue';
import Toolbar from './components/Toolbar.vue';
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: $aside-header-height;

  .header-left {
    display: flex;
    align-items: center;
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>
