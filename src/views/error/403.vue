<template>
  <div class="content">
    <div class="not-auth">
      <div class="left">
        <div class="hint">没有菜单权限!</div>
        <div class="title">您没有访问菜单权限!</div>
        <div class="info">
          对不起，您没有访问菜单权限！您可以返回登录页面登录其他账号
        </div>
        <el-button type="primary" round @click="switchAccounts">
          返回登录
        </el-button>
      </div>
      <div class="right">
        <img :src="notAuthImg" alt="" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { LOGIN_URL } from '@/config'
import { useUserStore } from '@/stores'
import { getAssets } from '@/utils'
import { useRouter } from 'vue-router'

const notAuthImg = getAssets('images/error/not-auth.gif')
const userStore = useUserStore()
const router = useRouter()
const switchAccounts = () => {
  userStore.logout()
  router.replace(LOGIN_URL)
}
</script>

<style lang="scss" scoped>
.content {
  height: 100vh;
  position: relative;
  overflow-y: hidden;
}

.not-auth {
  width: 800px;
  margin: 150px auto;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .left {
    width: 400px;

    .hint {
      color: #484848;
      font-weight: 700;
      font-size: 60px;
      margin: 40px 0;
      line-height: 1.1;
    }

    .title {
      font-weight: 500;
      font-size: 20px;
      margin-bottom: 10px;
      line-height: 1.1;
    }

    .info {
      font-weight: 500;
      font-size: 13px;
      margin: 20px 0 30px 0;
      line-height: 21px;
    }
  }
}
</style>
