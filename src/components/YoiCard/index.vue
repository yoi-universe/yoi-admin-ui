<template>
  <div class="yoi-card">
    <div class="pb-8px">
      <slot name="header"></slot>
    </div>
    <slot></slot>
    <div class="pt-8px">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.yoi-card {
  border-radius: 4px;
  border: 1px solid var(--el-border-color-light);
  background-color: var(--el-bg-color);
  overflow: hidden;
  padding: 10px 20px 0;
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>
