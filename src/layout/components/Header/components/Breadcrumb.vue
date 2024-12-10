<template>
  <div class="breadcrumb">
    <el-breadcrumb :separator-icon="ArrowRight">
      <transition-group name="breadcrumb">
        <el-breadcrumb-item v-for="item in breadcrumbList" :key="item.path">
          <div class="el-breadcrumb__inner" @click="handleBreadcrumb(item)">
            <YoiGlobalIcon :icon="item.icon" size="18" />
            <span class="el-breadcrumb__text">{{ item.menuName }}</span>
          </div>
        </el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb>
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/stores'
import type { MenuTree } from '@/types/system/menu'
import { ArrowRight } from '@element-plus/icons-vue'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import YoiGlobalIcon from '@/components/YoiGlobalIcon/index.vue'

const route = useRoute()
const authStore = useAuthStore()
const breadcrumbList = computed(() => {
  let breadcrumbData = authStore.getBreadcrumb(route.path)

  // 存在activeMenu
  if (route.meta.activeMenu) {
    breadcrumbData = authStore.getBreadcrumb(route.meta.activeMenu as string)
    breadcrumbData[breadcrumbData.length - 1] = {
      parentId: route.meta.parentId as number,
      menuName: route.meta.title as string,
      path: route.path,
      routeName: route.name as string,
      activeMenu: route.meta.activeMenu as string,
      isCache: route.meta.isCache as number,
      icon: route.meta.icon as string,
    }
  }

  return breadcrumbData
})

const router = useRouter()
const handleBreadcrumb = (item: Partial<MenuTree>) => {
  if (item.children && item.children.length) {
    const firstRouter = item.children[0]
    router.push(firstRouter.path)
  }
}
</script>

<style lang="scss" scoped>
// 进入动画的生效状态
.breadcrumb-enter-active {
  transition: all 0.3s;
}

// 进入动画的起始状态和离开动画的生效状态
.breadcrumb-enter-from,
.breadcrumb-leave-active {
  opacity: 0;
  transform: translateX(10px);
}

.breadcrumb {
  padding: 0 50px 0 0;
  margin-left: 10px;
  overflow: hidden;
  user-select: none;

  .el-breadcrumb {
    &__item {
      &:last-child {
        .el-breadcrumb__inner:hover {
          color: var(--el-text-color-regular);
        }
      }
    }

    &__inner {
      display: flex;
      align-items: center;
      cursor: pointer;

      &:hover {
        color: var(--el-color-primary);
      }
    }
  }
}
</style>
