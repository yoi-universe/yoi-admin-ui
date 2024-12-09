<template>
  <el-container class="layout-container">
    <el-aside
      class="layout-aside transition-all"
      :width="!isCollapse ? `${menuWidth}px` : `${asideMenuCollapseWidth}px`"
    >
      <Logo :isCollapse="isCollapse" />
      <el-scrollbar class="layout-scrollbar">
        <el-menu
          :default-active="activeMenu"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="false"
        >
          <AsideSubMenu :menuList="menuList"></AsideSubMenu>
        </el-menu>
      </el-scrollbar>
    </el-aside>
    <el-container>
      <el-header class="layout-header">
        <Header></Header>
      </el-header>
      <Main></Main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import Header from '@/layout/components/Header/index.vue'
import Logo from '@/layout/components/Logo/index.vue'
import AsideSubMenu from '@/layout/components/Menu/AsideSubMenu.vue'
import Main from '@/layout/components/Main/index.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore, useGlobalStore } from '@/stores'
import { storeToRefs } from 'pinia'

const globalStore = useGlobalStore()
const { isCollapse } = storeToRefs(globalStore)
const menuWidth = 220
const asideMenuCollapseWidth = 64
const route = useRoute()
const authStore = useAuthStore()

const menuList = computed(() => authStore.getMenuTreeList)
const activeMenu = computed(() =>
  route.meta.activeMenu ? route.meta.activeMenu : route.path,
)
</script>

<style lang="scss" scoped>
.layout-container {
  width: 100vw;
  height: 100vh;

  .layout-aside {
    padding: 0 $aside-menu-padding;
    box-shadow: $aside-menu-box-shadow;
    border-right: none;
  }

  .layout-header {
    height: $aside-header-height;
  }
}

.el-menu {
  border-right: none;
}

.layout-scrollbar {
  width: 100%;
  height: calc(100vh - $aside-header-height);
}
</style>
<style lang="scss">
/** 菜单悬浮折叠宽度 */
.el-menu--collapse {
  width: v-bind(asideMenuCollapseWidth) !important;
}
</style>
