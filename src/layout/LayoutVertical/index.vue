<template>
  <el-container class="layout-container">
    <el-aside class="layout-aside" :width="!isCollapse ? `${menuWidth}px` : `${asideMenuCollapseWidth}px`">
      <Logo />
      <el-scrollbar class="layout-scrollbar">
        <el-menu :default-active="activeMenu" :collapse="isCollapse" :collapse-transition="false" :router="false">
          <AsideSubMenu :menuList="menuList"></AsideSubMenu>
        </el-menu>
      </el-scrollbar>
    </el-aside>
    <el-container>
      <el-header class="layout-header">
        <Header></Header>
      </el-header>
      <el-main>
        <Main></Main>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import Header from '@/layout/components/Header/index.vue';
import Logo from '@/layout/components/Logo/index.vue';
import AsideSubMenu from '@/layout/components/Menu/AsideSubMenu.vue';
import Main from '@/layout/components/Main/index.vue';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores';

const isCollapse = ref(false);
const menuWidth = 220;
const asideMenuCollapseWidth = 64;
const route = useRoute()
const authStore = useAuthStore()

const menuList = computed(() => authStore.getMenuTreeList)
const activeMenu = computed(() => route.path)

</script>

<style lang="scss" scoped>
.layout-container {
  width: 100vw;
  height: 100vh;

  .layout-aside {
    padding: 0 $aside-menu-padding;
    box-shadow: $aside-menu-box-shadow;
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
