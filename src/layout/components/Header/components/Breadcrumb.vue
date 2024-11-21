<template>
  <div class="breadcrumb">
    <el-breadcrumb :separator-icon="ArrowRight">
      <transition-group name="breadcrumb">
        <el-breadcrumb-item v-for="item in breadcrumbList" :key="item.menuId">
          <div class="el-breadcrumb__inner" @click="handleBreadcrumb(item)">
            <el-icon size="18">
              <component :is="item.icon"></component>
            </el-icon>
            <span class="el-breadcrumb__text">{{ item.menuName }}</span>
          </div>
        </el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb>
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/stores';
import type { MenuTree } from '@/types/system/menu';
import { ArrowRight } from '@element-plus/icons-vue'
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const authStore = useAuthStore()
const breadcrumbList = computed(() => {
  return authStore.getBreadcrumb(route.path)
})

const router = useRouter()
const handleBreadcrumb = (item: MenuTree) => {
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
