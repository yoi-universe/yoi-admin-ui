<template>
  <div
    class="tab-card"
    v-show="show"
    :style="{ left: position.x + 'px', top: position.y + 'px' }"
  >
    <div class="tab-menu-item" @click="handleRefresh">
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
import YoiGlobalIcon from '@/components/YoiGlobalIcon/index.vue'
// import { HOME_URL } from '@/config'
import { MENU_CACHE_YES } from '@/constants/system'
import { useTabsStore } from '@/stores'
import { inject, nextTick, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const tabsStore = useTabsStore()

const show = ref(false)
const choosePath = ref('')
const position = reactive({
  x: 0,
  y: 0,
})

const refreshPage: Function = inject('refresh')!

// 刷新页面
const handleRefresh = () => {
  // 刷新页面不为当前页面时跳转至刷新页面
  if (route.fullPath !== choosePath.value) router.push(choosePath.value)
  setTimeout(() => {
    route.meta.isCache === MENU_CACHE_YES &&
      tabsStore.removeKeepAliveList(route.name as string)
    refreshPage(false)
    nextTick(() => {
      route.meta.isCache === MENU_CACHE_YES &&
        tabsStore.addKeepAliveList(route.name as string)
      refreshPage(true)
    })
  }, 0)
}

// 关闭当前标签
const handleCloseCurrent = () => {
  tabsStore.delTabs(choosePath.value, route.fullPath === choosePath.value)
}

// 关闭其他标签
const handleCloseOther = () => {
  tabsStore.delManyTabs(choosePath.value)
  if (route.fullPath !== choosePath.value) router.push(choosePath.value)
}

// 关闭所有标签
const handleCloseAll = () => {
  tabsStore.delManyTabs()
  // router.push(HOME_URL)
  router.push('/')
}

const handleHideMenu = () => {
  if (show.value) {
    show.value = false
  }
  window.removeEventListener('click', handleHideMenu)
}

const handleShowMenu = (path: string, x: number, y: number) => {
  show.value = true
  choosePath.value = path
  position.x = x
  position.y = y
  window.addEventListener('click', handleHideMenu)
}

defineExpose({
  handleShowMenu,
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
  }
}
</style>
