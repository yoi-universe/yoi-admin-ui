<template>
  <div class="login">
    <el-row class="h-100%">
      <div class="header-options">
        <YoiDark>
          <template #btn>
            <el-button type="primary" circle />
          </template>
        </YoiDark>
      </div>
      <el-col :span="16" class="flex! items-center justify-center">
        <div class="login-background w-85% h-100%"></div>
        <div class="absolute text-center">
          <img :src="loginBg" width="400" height="360" alt="">
        </div>
      </el-col>
      <el-col :span="8" class="dark:bg-#161616 bg-gray-100 flex! flex-col items-center justify-center">
        <div class="text-center">
          <div class="mb-18px font-bold font-size-24px">Yoi管理平台</div>
          <div class="mb-18px color-gray flex justify-center items-center">
            <div class="w-40px h-1px bg-gray-3 mx-10px"></div>
            <div>
              账号密码登录
            </div>
            <div class="w-40px h-1px bg-gray-3 mx-10px"></div>
          </div>
        </div>
        <el-form ref="formRef" class="w-60%" :model="formData" hide-required-asterisk :rules="rules">
          <el-form-item prop="userName">
            <el-input v-model="formData.userName" type="text" placeholder="请输入用户名" autocomplete="off">
              <template #prefix>
                <el-icon>
                  <User />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input v-model="formData.password" type="password" placeholder="请输入密码" autocomplete="off">
              <template #prefix>
                <el-icon>
                  <Lock />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="captcha">
            <el-input v-model="formData.captcha" type="text" placeholder="请输入验证码" autocomplete="off"
              @keyup.enter="submitForm">
              <template #prefix>
                <el-icon>
                  <Key />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-image style="width: 100px; height: 30px" :src="captchaImage" @click="getCaptchaImage" />
            <el-button class="ml-2 group" type="info" size="small" text @click="getCaptchaImage">
              <span class=" font-size-12px group-hover:color-[--el-color-primary]">
                看不起，换一张
              </span>
            </el-button>
          </el-form-item>

          <el-form-item>
            <el-button class="w-100%" round type="primary" :loading="loading" v-throttle:3000="submitForm">
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { getCaptchaImageApi } from '@/api/captcha';
import { onMounted, reactive, ref } from 'vue';
import YoiDark from '@/components/YoiDark/index.vue';
import { type FormInstance, type FormRules } from 'element-plus';
import { getAssets } from '@/utils/index';
import type { LoginParams } from '@/api/auth/type';
import { md5 } from 'js-md5';
import { loginApi } from '@/api/auth';
import { elMsgError, elMsgSuccess } from '@/utils/elMsg';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores';

const loginBg = getAssets('images/login/login-bg.png')
const captchaImage = ref('')
const loading = ref(false)
const formRef = ref<FormInstance>()
const formData = reactive<LoginParams>({
  userName: 'youzi',
  password: '123',
  captcha: '',
  key: '',
})


const rules = reactive<FormRules<typeof formData>>({
  userName: [{ required: true, message: '用户名不能为空', trigger: 'blur' },],
  password: [{ required: true, message: '密码不能为空', trigger: 'blur' },],
  captcha: [{ required: true, message: '验证码不能为空', trigger: 'blur' },],
})

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const submitForm = () => {
  // 判断是否已经提交
  if (loading.value) return
  if (!formRef.value) return
  formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        console.log('submit!')
        let params: LoginParams = {
          ...formData,
          password: md5(formData.password).toUpperCase()
        }
        const res = await loginApi(params)
        if (res.code === 200) {
          const data = res.data
          userStore.setToken(data.token)
          elMsgSuccess('登录成功')
          const redirect = route.query.redirect as string
          if (redirect) {
            const redirectUrl = decodeURIComponent(redirect)
            router.push(redirectUrl)
          } else {
            router.push('/')
          }
        }
      } catch (e: any) {
        elMsgError(e.message)
        // 等待1秒后关闭loading
        setTimeout(() => {
          loading.value = false
        }, 1000)
      }
    } else {
      console.log('error submit!')
      elMsgError('请填写完整')
    }
  })
}

const getCaptchaImage = () => {
  getCaptchaImageApi().then(res => {
    const data = res.data
    captchaImage.value = data.imageBase64
    formData.key = data.key
  })
}

onMounted(() => {
  getCaptchaImage()
})

</script>

<style lang="scss" scoped>
.login {
  height: 100vh;

  .header-options {
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 9;
  }


  .login-background {
    background: linear-gradient(155deg, #07070915 12%, var(--el-color-primary) 36%, #07070915 76%);
    filter: blur(100px);
  }
}
</style>
