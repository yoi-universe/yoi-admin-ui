<template>
  <div class="content">
    <div class="not-found">
      <div class="left">
        <img :src="notFoundImg" alt="" />
      </div>
      <div class="right">
        <div class="hint">404错误!</div>
        <div class="title">找不到页面!</div>
        <div class="info">
          对不起，您正在寻找的页面不存在。尝试检查URL的错误，然后按浏览器上的刷新按钮或尝试在我们的应用程序中找到其他内容。
        </div>
        <el-button type="primary" round @click="goBack"> 返回首页 </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getAssets } from '@/utils'
import { useRouter } from 'vue-router'

const notFoundImg = getAssets('images/error/404.png')

const router = useRouter()
const goBack = () => {
  router.replace('/')
}
</script>

<style lang="scss" scoped>
.content {
  height: 100vh;
  position: relative;
  overflow-y: hidden;
}

.not-found {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 1200px;
  display: flex;
  justify-content: center;
  align-items: center;

  .left {
    width: 600px;

    img {
      width: 100%;
    }
  }

  .right {
    width: 300px;

    .hint {
      color: var(--el-color-primary);
      font-weight: 700;
      font-size: 32px;
      margin-bottom: 20px;
      line-height: 40px;
    }

    .title {
      color: #222;
      font-weight: 700;
      font-size: 20px;
      margin-bottom: 10px;
      line-height: 24px;
    }

    .info {
      color: grey;
      font-size: 13px;
      margin-bottom: 30px;
      line-height: 21px;
    }
  }
}
</style>
