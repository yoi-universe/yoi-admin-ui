<template>
  <div class="tab-card" v-show="show" :style="{ left: position.x + 'px', top: position.y + 'px' }">
    <div class="tab-menu-item" :class="{ 'is-disabled': route.path !== currentPath }" @click="handleRefresh">
      <YoiGlobalIcon icon="Refresh" class="mr-5px" />重新刷新
    </div>
    <div class="tab-menu-item" @click="handleCloseCurrent">
      <YoiGlobalIcon icon="Close" class="mr-5px" />关闭当前
    </div>
    <div class="tab-menu-item" @click="handleCloseOther">
      <YoiGlobalIcon icon="SemiSelect" class="mr-5px" />关闭其他
    </div>
    <div class="tab-menu-item" @click="handleCloseAll">
      <YoiGlobalIcon icon="Delete" class="mr-5px" />关闭所有
    </div>
  </div>
</template>

<script lang="ts" setup>
import YoiGlobalIcon from '@/components/YoiGlobalIcon/index.vue';
import { MENU_CACHE_YES } from '@/constants/system';
import { useTabsStore } from '@/stores';
import { inject, nextTick, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const tabsStore = useTabsStore()

const show = ref(false);
const currentPath = ref('');
const position = reactive({
  x: 0,
  y: 0
});

const refreshPage: Function = inject('refresh')!

const handleRefresh = () => {
  setTimeout(() => {
    route.meta.isCache === MENU_CACHE_YES && tabsStore.removeKeepAliveList(route.name as string)
    refreshPage(false)
    nextTick(() => {
      route.meta.isCache === MENU_CACHE_YES && tabsStore.addKeepAliveList(route.name as string)
      refreshPage(true)
    })
  }, 0)
}
const handleCloseCurrent = () => { }
const handleCloseOther = () => { }
const handleCloseAll = () => { }

const handleHideMenu = () => {
  if (show.value) {
    show.value = false;
  }
  window.removeEventListener('click', handleHideMenu);
}

const handleShowMenu = (path: string, x: number, y: number) => {
  show.value = true;
  currentPath.value = path;
  position.x = x;
  position.y = y;
  window.addEventListener('click', handleHideMenu);
}

defineExpose({
  handleShowMenu
})
</script>

<style lang="scss" scoped>
.tab-card {
  position: absolute;
  z-index: 9;
  background-color: var(--el-bg-color);
  border-radius: var(--el-border-radius-base);
  cursor: pointer;

  .tab-menu-item {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px 15px;
    font-size: var(--el-font-size-base);
    border-radius: var(--el-border-radius-base);
    user-select: none;
    margin-top: 1px;
    border: 1px dashed var(--el-color-primary);
    overflow: hidden;

    &:hover {
      color: var(--el-color-primary);
      background-color: var(--el-color-primary-light-9);
    }

    &:first-child {
      margin-top: 0;
    }

    &.is-disabled {
      color: var(--el-button-disabled-text-color);
      cursor: not-allowed;
      background-image: none;
      background-color: var(--el-button-disabled-bg-color);
      border-color: var(--el-button-disabled-border-color);
    }
  }
}
</style>
