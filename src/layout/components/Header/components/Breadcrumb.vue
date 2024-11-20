<template>
  <div>
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item v-for="item in breadcrumbList" :key="item.menuId">
        <div>
          <el-icon size="18">
            <component :is="item.icon"></component>
          </el-icon>
          <span>{{ item.menuName }}</span>
        </div>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/stores';
import { ArrowRight } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router';

const route = useRoute()
const authStore = useAuthStore()
const breadcrumbList = authStore.getBreadcrumb(route.path)

</script>

<style scoped></style>
