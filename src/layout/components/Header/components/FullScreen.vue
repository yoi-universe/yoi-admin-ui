<template>
  <div class="full-screen" @click="handleFullScreen">
    <el-tooltip content="全屏" placement="bottom">
      <el-icon>
        <FullScreen v-if="!isFullscreen" />
        <CloseBold v-else />
      </el-icon>
    </el-tooltip>
  </div>
</template>

<script lang="ts" setup>
import { useGlobalStore } from '@/stores';
import { storeToRefs } from 'pinia';
import { onMounted, onUnmounted, ref } from 'vue';


const globalStore = useGlobalStore()
const { isFullscreen } = storeToRefs(globalStore)
const { setFullscreen } = globalStore

const handleFullScreen = () => {
  if (!document.fullscreenElement) {
    // 进入全屏
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().then(() => (setFullscreen(!!document.fullscreenElement)))
    }
  } else {
    // 退出全屏
    if (document.exitFullscreen) {
      document.exitFullscreen().then(() => (setFullscreen(!!document.fullscreenElement)))
    }
  }
}

// 监听窗口变化
const handleResize = () => {
  // 判断当前是否在全屏
  if (document.fullscreenElement) {
    // 全屏
    setFullscreen(true)
  } else {
    // 退出全屏
    setFullscreen(false)
  }
}

// 监听f11键
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    handleResize()
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<style lang="scss" scoped>
.full-screen {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 5px;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.06);
  }

  .el-icon:hover {
    color: var(--el-color-primary);
  }
}
</style>
