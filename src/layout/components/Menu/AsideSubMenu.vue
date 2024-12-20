<template>
  <template v-for="item in menuList" :key="item.menuId">
    <!-- 叶子节点 -->
    <el-menu-item v-if="item.menuType === MENU_TYPE_MENU" :index="item.path" @click="handleMenuClick(item)">
      <YoiGlobalIcon :icon="item.icon" size="18" />
      <template #title>
        <span>{{ item.menuName }}</span>
      </template>
    </el-menu-item>
    <!-- 非叶子节点 -->
    <el-sub-menu v-if="item.menuType === MENU_TYPE_DIRECTORY" :index="item.path">
      <template #title>
        <YoiGlobalIcon :icon="item.icon" size="18" />
        <span>{{ item.menuName }}</span>
      </template>
      <AsideSubMenu :menuList="item.children" />
    </el-sub-menu>
  </template>
</template>

<script lang="ts" setup>
import type { MenuTree } from '@/types/system/menu';
import { MENU_TYPE_MENU, MENU_TYPE_DIRECTORY, MENU_LINK_TARGET_BLANK, MENU_NOT_LINK } from '@/constants/system';
import { elMsgWarning } from '@/utils/elMsg';
import { useRouter } from 'vue-router';
import YoiGlobalIcon from '@/components/YoiGlobalIcon/index.vue';

const { menuList } = defineProps<Props>()

const router = useRouter()
const handleMenuClick = (item: MenuTree) => {
  // 外部链接
  if (item.isLink === MENU_NOT_LINK && item.linkType === MENU_LINK_TARGET_BLANK) {
    if (/^https?:\/\//.test(item.linkUrl)) {
      return window.open(item.linkUrl, "_blank");
    } else {
      elMsgWarning("非正确链接地址，禁止跳转");
      return;
    }
  }
  router.push(item.path)
}
</script>
<script lang="ts">
interface Props {
  menuList: MenuTree[]
}
</script>

<style lang="scss" scoped>
.el-menu-item {
  height: $aside-menu-height;
  margin-bottom: $aside-menu-margin-bottom;
  font-weight: $aside-menu-font-weight;
  --el-menu-item-height: $aside-header-height;
  user-select: none; // 设置用户禁止选中
  color: var(--el-menu-text-color);
  border-radius: $aside-menu-border;
  overflow: hidden;

  &::before {
    border-left: $aside-menu-border solid transparent;
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }

  i {
    transform: translate($aside-menu-offset);
  }

  span {
    transform: translate($aside-menu-offset);
  }

  &:hover {
    color: var(--el-color-primary);
    background: var(--el-color-primary-light-9);

    i {
      color: var(--el-color-primary);
    }
  }

  &.is-active {
    color: var(--el-color-primary);
    background: var(--el-color-primary-light-8);

    &::before {
      border-left: $aside-menu-border solid var(--el-color-primary);
    }
  }
}

:deep(.el-sub-menu__title) {
  height: $aside-menu-height;
  padding-right: 0; // 去除collapse缩小多余的边框
  margin-bottom: $aside-menu-margin-bottom;
  font-weight: $aside-menu-font-weight;
  user-select: none; // 设置用户禁止选中
  color: var(--el-menu-text-color);
  border-radius: $aside-menu-border;
  overflow: hidden;

  &::before {
    border-left: $aside-menu-border solid transparent;
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }

  i {
    transform: translate($aside-menu-offset);
  }

  span {
    transform: translate($aside-menu-offset);
  }

  &:hover {
    color: var(--el-color-primary);
    background: var(--el-color-primary-light-9);
  }

  &.is-active {
    color: var(--el-color-primary);
    background: var(--el-color-primary-light-8);

    &::before {
      border-left: $aside-menu-border solid var(--el-color-primary);
    }
  }
}
</style>
<style lang="scss">
/* 子级菜单字体高亮，父级菜单也高亮 */
.el-sub-menu.is-active>.el-sub-menu__title {
  color: var(--el-color-primary);

  /* icon图标也跟着变 */
  i {
    color: var(--el-color-primary);
  }
}
</style>
