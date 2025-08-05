<template>
  <div class="p-4px">
    <el-row :gutter="20">
      <el-col :span="8" :xs="24">
        <el-card>
          <div class="text-13px koi-card">
            <div class="flex justify-center flex-col items-center">
              <YoiUploadImage v-model:image-url="baseForm.avatar">
                <template #content>
                  <el-icon><Avatar /></el-icon>
                  <span>请上传头像</span>
                </template>
              </YoiUploadImage>
              <el-button
                class="mt-6px"
                type="primary"
                size="small"
                plain
                @click="handleUploadAvatar"
                >保存头像</el-button
              >
            </div>
            <div class="flex justify-between mt-20px p-y-12px flex-wrap">
              <div class="flex items-center">
                <el-icon size="15"> <UserFilled /> </el-icon>
                <div class="p-l-2px">登录名称</div>
              </div>
              <div v-text="personalData.userName"></div>
            </div>
            <div class="flex justify-between p-y-12px flex-wrap">
              <div class="flex items-center">
                <el-icon size="15"> <User /> </el-icon>
                <div class="p-l-2px">用户名称</div>
              </div>
              <div v-text="personalData.nickName"></div>
            </div>
            <div class="flex justify-between p-y-12px flex-wrap">
              <div class="flex items-center">
                <el-icon size="15"> <Iphone /> </el-icon>
                <div class="p-l-2px">手机号码</div>
              </div>
              <div v-text="personalData.phone"></div>
            </div>
            <div class="flex justify-between p-y-12px flex-wrap">
              <div class="flex items-center">
                <el-icon size="15"> <Message /> </el-icon>
                <div class="p-l-2px">用户邮箱</div>
              </div>
              <div v-text="personalData.email"></div>
            </div>
            <div class="flex justify-between p-y-12px flex-wrap">
              <div class="flex items-center">
                <el-icon size="15"> <Postcard /> </el-icon>
                <div class="p-l-2px">所属部门</div>
              </div>
              <div v-text="personalData.deptName"></div>
            </div>
            <div class="flex justify-between p-y-12px flex-wrap">
              <div class="flex items-center">
                <el-icon size="15"> <Collection /> </el-icon>
                <div class="p-l-2px">所属角色</div>
              </div>
              <div v-text="personalData.roleName"></div>
            </div>
            <div class="flex justify-between p-y-12px flex-wrap">
              <div class="flex items-center">
                <el-icon size="15"> <Calendar /> </el-icon>
                <div class="p-l-2px">创建日期</div>
              </div>
              <div v-text="personalData.createTime"></div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16" :xs="24">
        <el-card :body-style="{ 'padding-top': '6px' }">
          <el-tabs v-model="activeName">
            <el-tab-pane label="基本资料" name="first">
              <el-form
                ref="baseFormRef"
                :rules="baseRules"
                :model="baseForm"
                label-width="80px"
                status-icon
              >
                <el-row>
                  <el-col :xs="{ span: 24 }" :sm="{ span: 24 }">
                    <el-form-item label="用户名称" prop="nickName">
                      <el-input
                        v-model.trim="baseForm.nickName"
                        placeholder="请输入用户名称"
                        clearable
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="{ span: 24 }" :sm="{ span: 24 }">
                    <el-form-item label="手机号码" prop="phone">
                      <el-input
                        v-model.trim="baseForm.phone"
                        placeholder="请输入手机号码"
                        clearable
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="{ span: 24 }" :sm="{ span: 24 }">
                    <el-form-item label="邮箱" prop="email">
                      <el-input
                        v-model.trim="baseForm.email"
                        placeholder="请输入邮箱"
                        clearable
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="{ span: 24 }" :sm="{ span: 24 }">
                    <el-form-item label="性别" prop="sex">
                      <el-radio-group v-model="baseForm.sex">
                        <el-radio :value="0" border>男</el-radio>
                        <el-radio :value="1" border>女</el-radio>
                        <el-radio :value="2" border>未知</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="{ span: 24 }" :sm="{ span: 24 }" class="mt-6px">
                    <el-form-item>
                      <el-button type="primary" plain @click="handleBaseSave"
                        >保存</el-button
                      >
                      <el-button type="danger" plain @click="resetBaseForm"
                        >重置</el-button
                      >
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="second">
              <el-form
                ref="pwdFormRef"
                :rules="pwdRules"
                :model="pwdForm"
                label-width="80px"
                status-icon
              >
                <el-row>
                  <el-col :xs="{ span: 24 }" :sm="{ span: 24 }">
                    <el-form-item label="密码" prop="password">
                      <el-input
                        v-model.trim="pwdForm.password"
                        placeholder="请输入旧密码"
                        show-password
                        clearable
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="{ span: 24 }" :sm="{ span: 24 }">
                    <el-form-item label="新密码" prop="newPassword">
                      <el-input
                        v-model.trim="pwdForm.newPassword"
                        placeholder="请输入新密码"
                        show-password
                        clearable
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="{ span: 24 }" :sm="{ span: 24 }">
                    <el-form-item label="确认密码" prop="confirmPassword">
                      <el-input
                        v-model.trim="pwdForm.confirmPassword"
                        placeholder="请输入确认密码"
                        show-password
                        clearable
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="{ span: 24 }" :sm="{ span: 24 }" class="mt-6px">
                    <el-form-item>
                      <el-button type="primary" plain @click="handlePwdSave"
                        >保存</el-button
                      >
                      <el-button type="danger" plain @click="resetPwdForm"
                        >重置</el-button
                      >
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup name="personagePage">
import { onMounted, reactive, ref } from 'vue'
import YoiUploadImage from '@/components/YoiUpload/Image.vue'
import type {
  PersonalData,
  UpdatePasswordParams,
  UpdatePersonalDataParams,
} from '@/api/auth/type'
import {
  getPersonalDataApi,
  getUserInfoApi,
  updatePasswordApi,
  updatePersonalDataApi,
} from '@/api/auth'
import { elMsgSuccess } from '@/utils/elMsg'
import type { FormInstance } from 'element-plus'
import { md5 } from 'js-md5'
import { useUserStore } from '@/stores'

const personalData = ref<PersonalData>({
  userName: '',
  nickName: '',
  email: '',
  phone: '',
  avatar: '',
  sex: 2,
  deptName: '',
  roleName: '',
  createTime: '',
})
const activeName = ref('first')
const baseFormRef = ref<FormInstance>()
const baseForm = ref<UpdatePersonalDataParams>({
  nickName: '',
  phone: '',
  email: '',
  sex: 2,
  avatar: '',
})
const baseRules = reactive({
  nickName: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { min: 11, max: 11, message: '请输入正确的手机号码', trigger: 'blur' },
  ],
})

const pwdFormRef = ref<FormInstance>()
const pwdForm = ref<UpdatePasswordParams>({
  password: '',
  newPassword: '',
  confirmPassword: '',
})
const pwdRules = reactive({
  password: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: '请输入确认密码', trigger: 'blur' },
  ],
})

const getData = async () => {
  const personalDataRes = await getPersonalDataApi()
  if (personalDataRes.code === 200) {
    personalData.value = personalDataRes.data
    baseForm.value = Object.assign(baseForm.value, personalDataRes.data)
  }
}

const userStore = useUserStore()

const handleUploadAvatar = async () => {
  const res = await updatePersonalDataApi({
    avatar: baseForm.value.avatar,
  })
  if (res.code === 200) {
    elMsgSuccess('修改成功')
    getData()
    userStore.setUserInfo({
      ...userStore.getUserInfo,
      avatar: baseForm.value.avatar!,
    })
  }
}

const handleBaseSave = async () => {
  if (!baseFormRef.value) return
  baseFormRef.value.validate(async valid => {
    if (valid) {
      const res = await updatePersonalDataApi(baseForm.value)
      if (res.code === 200) {
        elMsgSuccess('修改成功')
        getData()
        userStore.setUserInfo({
          ...userStore.getUserInfo,
          nickName: baseForm.value.nickName!,
          phone: baseForm.value.phone!,
          email: baseForm.value.email!,
          sex: baseForm.value.sex!,
        })
      }
    } else {
      console.log('error submit!')
    }
  })
}

const resetBaseForm = () => {
  baseForm.value = {
    nickName: '',
    phone: '',
    email: '',
    sex: 2,
    avatar: personalData.value.avatar,
  }
  if (baseFormRef.value) {
    baseFormRef.value.resetFields()
  }
}

const handlePwdSave = () => {
  if (!pwdFormRef.value) return
  pwdFormRef.value.validate(async valid => {
    if (valid) {
      let params: UpdatePasswordParams = {
        password: md5(pwdForm.value.password).toUpperCase(),
        newPassword: md5(pwdForm.value.newPassword).toUpperCase(),
        confirmPassword: md5(pwdForm.value.confirmPassword).toUpperCase(),
      }
      const res = await updatePasswordApi(params)
      if (res.code === 200) {
        elMsgSuccess('修改成功')
        resetPwdForm()
      }
    } else {
      console.log('error submit!')
    }
  })
}
const resetPwdForm = () => {
  pwdForm.value = {
    password: '',
    newPassword: '',
    confirmPassword: '',
  }
  if (pwdFormRef.value) {
    pwdFormRef.value.resetFields()
  }
}

onMounted(() => {
  getData()
})
</script>

<style scoped></style>
