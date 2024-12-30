<template>
  <el-tabs
    v-model="activeTab"
    type="card"
    class="tabs"
    @tab-click="handleTabClick"
    @tab-remove="handleTabRemove"
    @contextmenu.prevent.stop="handleContextMenu"
  >
    <el-tab-pane
      v-for="item in tabList"
      :key="item.path"
      :label="item.title"
      :name="item.path"
      :closable="tabList.length > 1"
    >
      <template #label>
        <div
          class="flex flex-justify-center flex-items-center select-none"
          @contextmenu.prevent.stop="handleTabsMenuChildren(item.path, $event)"
        >
          <YoiGlobalIcon
            class="m-r-5px"
            v-show="item.icon"
            :icon="item.icon"
            size="16"
          />
          <div class="p-t-1px">
            <div>{{ item.title }}</div>
          </div>
        </div>
      </template>
    </el-tab-pane>
  </el-tabs>
  <TabMenu ref="tabMenuRef" />
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import YoiGlobalIcon from '@/components/YoiGlobalIcon/index.vue'
import TabMenu from './components/TabMenu.vue'
import type { TabInfo } from '@/types/tabs'
import { useTabsStore } from '@/stores'
import type { TabsPaneContext } from 'element-plus'

const route = useRoute()
const router = useRouter()
const tabsStore = useTabsStore()

// 获取tabs列表
const tabList = computed(() => {
  return tabsStore.tabList
})

// 设置当前激活的选项卡
const activeTab = ref(route.fullPath)
const setActiveTab = () => {
  activeTab.value = route.fullPath
}

// 添加选项卡
const addTab = () => {
  const { meta, fullPath } = route
  const tab: TabInfo = {
    title: meta.title as string,
    name: route.name as string,
    path: fullPath,
    icon: meta.icon as string,
    isCache: meta.isCache as number,
  }
  tabsStore.addTabs(tab)
}

// 选项卡点击事件
const handleTabClick = (pane: TabsPaneContext) => {
  const { props } = pane
  router.push(props.name as string)
}

// 移除选项卡
const handleTabRemove = (path: string) => {
  tabsStore.delTabs(path, route.fullPath === path)
}

const tabMenuRef = ref()
// 右键菜单
const handleContextMenu = (e: PointerEvent) => {
  const elm = e.target as HTMLDivElement
  if (!elm.id) return
  const choosePath = elm.id.split('-')[1]
  let x = e.pageX
  const y = e.pageY
  // 获取页面显示区域的大小
  const { innerWidth } = window
  if (x + 120 > innerWidth) {
    x -= 120
  }
  tabMenuRef.value.handleShowMenu(choosePath, x, y)
}

const handleTabsMenuChildren = (path: string, e: MouseEvent) => {
  let x = e.pageX
  const y = e.pageY
  // 获取页面显示区域的大小
  const { innerWidth } = window
  if (x + 120 > innerWidth) {
    x -= 120
  }

  tabMenuRef.value.handleShowMenu(path, x, y)
}

watch(route, () => {
  setActiveTab()
  addTab()
})

onMounted(() => {
  setActiveTab()
  addTab()
})
</script>

<style lang="scss" scoped>
.tabs {
  border-bottom: 1px solid var(--el-border-color-light);
  @apply dark:border-[--el-border-color-light];
}

:deep(.el-tabs__item:first-child) {
  margin-left: 8px;
}

:deep(.el-tabs__item:nth-child(n)) {
  // 选中/未选中边框
  border: 1px solid var(--el-border-color-light) !important;
}

:deep(.el-tabs__item:not(:active)) {
  // 设置未选中的边框
  border: 1px solid var(--el-border-color-light);
}

:deep(.el-tabs__item) {
  height: 28px;
  margin-left: 6px;
  font-size: 14px;
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--el-border-radius-base);

  .is-top {
    border-bottom: none !important;
  }

  // 设置鼠标悬停时的样式
  &:hover {
    background: var(--el-color-primary-light-9);
    border: none;
  }

  // 设置鼠标选中的样式[可用来定制不同配色的主题]
  &.is-active {
    color: var(--el-color-primary);
    background: var(--el-color-primary-light-8);

    // 边框选中颜色
    border: 1px solid var(--el-color-primary) !important;
  }
}

:deep(.el-tabs__header) {
  border-top: 1px solid var(--el-color-info-light-7); // 选项卡边框实线
  border-bottom: 1px solid var(--el-color-info-light-7); // 选项卡边框实线
  margin: 0px;
}

:deep(.el-tabs__nav.is-top) {
  height: 32px; // 高度越高，可以调整tab卡距离底部的高度
  border: none; //  去除左侧tabs边框
  border-radius: var(--el-border-radius-base);
}

// 覆盖多余边框
:deep(.el-tabs__nav) {
  border: none !important;
}

:deep(.el-tabs__nav-prev) {
  // 标签页多了左侧图标
  line-height: 35px;
}

:deep(.el-tabs__nav-next) {
  // 标签页多了右侧图标
  line-height: 35px;
}
</style>
