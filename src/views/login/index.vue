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
        <div>
          <div>Yoi后台管理</div>
        </div>
        <el-form ref="formRef" class="w-60%" :model="ruleForm" status-icon :rules="rules">
          <el-form-item prop="pass">
            <el-input v-model="ruleForm.pass" type="password" autocomplete="off" />
          </el-form-item>
          <el-form-item prop="checkPass">
            <el-input v-model="ruleForm.checkPass" type="password" autocomplete="off" />
          </el-form-item>
          <el-form-item prop="age">
            <el-input v-model.number="ruleForm.age" />
          </el-form-item>
          <el-form-item>
            <el-button class="w-100%" round type="primary" @click="submitForm(formRef)">
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
import type { FormInstance, FormRules } from 'element-plus';
import { getAssets } from '@/utils/index';

const loginBg = getAssets('images/login/login-bg.png')

const formRef = ref<FormInstance>()

const checkAge = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('Please input the age'))
  }
  setTimeout(() => {
    if (!Number.isInteger(value)) {
      callback(new Error('Please input digits'))
    } else {
      if (value < 18) {
        callback(new Error('Age must be greater than 18'))
      } else {
        callback()
      }
    }
  }, 1000)
}

const ruleForm = reactive({
  pass: '',
  checkPass: '',
  age: '',
})

const rules = reactive<FormRules<typeof ruleForm>>({
  // pass: [{ validator: validatePass, trigger: 'blur' }],
  // checkPass: [{ validator: validatePass2, trigger: 'blur' }],
  age: [{ validator: checkAge, trigger: 'blur' }],
})

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!')
    }
  })
}

const getCaptchaImage = () => {
  getCaptchaImageApi().then(res => {
    console.log(res)
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
