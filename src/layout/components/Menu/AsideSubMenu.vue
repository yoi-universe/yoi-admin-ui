<template>
  <template v-for="item in menuList" :key="item.menuId">
    <!-- 叶子节点 -->
    <el-menu-item v-if="item.menuType === MENU_TYPE_MENU" :index="item.path" @click="handleMenuClick(item)">
      <el-icon>
        <MSIcon :name="item.icon" size="18"></MSIcon>
      </el-icon>
      <template #title>{{ item.menuName }}</template>
    </el-menu-item>
    <!-- 非叶子节点 -->
    <el-sub-menu v-if="item.menuType === MENU_TYPE_DIRECTORY" :index="item.path">
      <template #title>
        <el-icon>
          <MSIcon :name="item.icon" size="18"></MSIcon>
        </el-icon>
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

<style scoped></style>
