<template>
  <Tabs />
  <el-main class="layout-main">
    <RouterView v-slot="{ Component, route }">
      <Transition name="fade" mode="out-in" appear>
        <KeepAlive :include="tabsStore.keepAliveList">
          <component
            v-if="isRouterShow"
            :is="Component"
            :key="route.fullPath"
          />
        </KeepAlive>
      </Transition>
    </RouterView>
  </el-main>
</template>

<script lang="ts" setup>
import Tabs from '@/layout/components/Tabs/index.vue'
import { useTabsStore } from '@/stores'
import { provide, ref } from 'vue'

const tabsStore = useTabsStore()

const isRouterShow = ref(true)

const handleRefreshPage = (val: boolean) => {
  isRouterShow.value = val
}

provide('refresh', handleRefreshPage)
</script>

<style lang="scss" scoped>
.layout-main {
  padding: 5px 6px;

  @apply bg-[#f6f9fe] dark:bg-black;
}

/* 默认 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
