<template>
  <div class="user">
    <el-avatar :size="34" :src="prefix + userInfo.avatar" />
    <el-dropdown class="ml-10px" @command="handleCommand">
      <div
        class="flex align-center cursor-pointer select-none color-[--el-color-primary]"
      >
        {{ userInfo.nickName }}
        <el-icon class="ml-5px">
          <arrow-down />
        </el-icon>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <div>
            <el-dropdown-item :command="USER_DROP_DOWN_MENU_PROFILE">
              个人中心
            </el-dropdown-item>
          </div>
          <div>
            <el-dropdown-item :command="USER_DROP_DOWN_MENU_LOGOUT"
              >退出登录</el-dropdown-item
            >
          </div>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts" setup>
import { logoutApi } from '@/api/auth'
import { LOGIN_URL } from '@/config'
import {
  USER_DROP_DOWN_MENU_LOGOUT,
  USER_DROP_DOWN_MENU_PROFILE,
} from '@/constants/system'
import { useUserStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const prefix = import.meta.env.VITE_IMAGE_URL + '/'
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

const router = useRouter()

// 退出登录
const logout = async () => {
  await logoutApi()
  userStore.logout()
  router.replace(LOGIN_URL)
}

const handleCommand = (command: string) => {
  switch (command) {
    case USER_DROP_DOWN_MENU_PROFILE:
      router.push('/personage')
      break
    case USER_DROP_DOWN_MENU_LOGOUT:
      logout()
      break
  }
}
</script>

<style lang="scss" scoped>
.user {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;

  // 解决el-dropdown获取到焦点或点击出现黑边情况
  :deep(.el-tooltip__trigger:focus-visible) {
    outline: unset;
  }
}
</style>
