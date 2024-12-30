<template>
  <div class="h-100%">
    <YoiDark class="header-dark">
      <template #dark>
        <!-- 明亮模式 -->
        <el-tooltip
          content="明亮模式"
          placement="bottom"
          v-if="!globalStore.isDark"
        >
          <YoiGlobalIcon icon="Sunny" size="20" />
        </el-tooltip>
        <!-- 暗黑模式 -->
        <el-tooltip
          content="暗黑模式"
          placement="bottom"
          v-if="globalStore.isDark"
        >
          <YoiGlobalIcon icon="Moon" size="20" />
        </el-tooltip>
      </template>
    </YoiDark>
  </div>
</template>

<script lang="ts" setup>
import YoiDark from '@/components/YoiDark/index.vue'
import YoiGlobalIcon from '@/components/YoiGlobalIcon/index.vue'
import { useGlobalStore } from '@/stores'

const globalStore = useGlobalStore()
</script>

<style lang="scss" scoped>
.header-dark {
  cursor: pointer;
  height: 100%;
  padding: 0 5px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: rgba(0, 0, 0, 0.06);
  }

  .el-icon:hover {
    color: var(--el-color-primary);
  }
}
</style>
