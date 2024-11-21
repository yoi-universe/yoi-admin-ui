<template>
  <div class="h-100%" @click="handleSwitchDark">
    <YoiDark class="header-dark">
      <template #dark>
        <!-- 明亮模式 -->
        <el-tooltip content="明亮模式" placement="bottom" v-if="!isDark">
          <el-icon size="20">
            <Sunny />
          </el-icon>
        </el-tooltip>
        <!-- 暗黑模式 -->
        <el-tooltip content="暗黑模式" placement="bottom" v-if="isDark">
          <el-icon size="20">
            <Moon />
          </el-icon>
        </el-tooltip>
      </template>
    </YoiDark>
  </div>
</template>

<script lang="ts" setup>
import YoiDark from '@/components/YoiDark/index.vue';
import { useGlobalStore } from '@/stores';
import { storeToRefs } from 'pinia';

const globalStore = useGlobalStore()
const { isDark } = storeToRefs(globalStore)
const { setDark } = globalStore

const handleSwitchDark = () => {
  setDark(!isDark.value)
}
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
