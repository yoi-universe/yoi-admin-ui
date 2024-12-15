<template>
  <YoiDialog
    ref="yoiDialogRef"
    title="添加用户"
    :btn-loading="btnLoading"
    @confirm="handleConfirm"
    @cancel="handleCancel"
    :height="500"
  >
    <template #content>
      <el-form ref="formRef" :rules="rules" :model="form" label-width="auto">
        <el-row>
          <el-col :xs="{ span: 24 }" :sm="{ span: 12 }">
            <!-- 登录账号 -->
            <el-form-item label="登录账号" prop="userName">
              <el-input
                v-model="form.userName"
                placeholder="请输入登录账号"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="{ span: 24 }" :sm="{ span: 12 }" class="pl-10px">
            <!-- 归属部门 -->
            <el-form-item label="归属部门" prop="deptId">
              <el-cascader
                placeholder="请选择归属部门"
                v-model="form.deptId"
                :options="deptTreeList"
                :props="{
                  expandTrigger: 'hover',
                  emitPath: false,
                  checkStrictly: true,
                  label: 'deptName',
                  value: 'deptId',
                }"
                filterable
                clearable
                style="width: 100%"
              >
                <template #default="{ node, data }">
                  <span>{{ data.deptName }}</span>
                  <span v-if="!node.isLeaf">
                    ({{ data.children.length }})
                  </span>
                </template>
              </el-cascader>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :xs="{ span: 24 }" :sm="{ span: 12 }">
            <!-- 用户名称 -->
            <el-form-item label="用户名称" prop="nickName">
              <el-input
                v-model="form.nickName"
                placeholder="请输入用户名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="{ span: 24 }" :sm="{ span: 12 }" class="pl-10px">
            <!-- 密码 -->
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="form.password"
                type="password"
                placeholder="请输入密码"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :xs="{ span: 24 }" :sm="{ span: 12 }">
            <!-- 分配岗位 -->
            <el-form-item label="分配岗位" prop="postIds">
              <el-select
                v-model="form.postIds"
                multiple
                placeholder="请选择分配岗位"
                style="width: 240px"
              >
                <el-option
                  v-for="item in postList"
                  :key="item.postId"
                  :label="item.postName"
                  :value="item.postId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="{ span: 24 }" :sm="{ span: 12 }" class="pl-10px">
            <!-- 分配角色 -->
            <el-form-item label="分配角色" prop="roleIds">
              <el-select
                v-model="form.roleIds"
                multiple
                placeholder="请选择分配角色"
                style="width: 240px"
              >
                <el-option
                  v-for="item in roleList"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :xs="{ span: 24 }" :sm="{ span: 12 }">
            <!-- 手机号码 -->
            <el-form-item label="手机号码" prop="phone">
              <el-input
                v-model="form.phone"
                placeholder="请输入手机号码"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="{ span: 24 }" :sm="{ span: 12 }" class="pl-10px">
            <!-- 邮箱 -->
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="form.email"
                placeholder="请输入邮箱"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :xs="{ span: 24 }" :sm="{ span: 24 }">
            <!-- 用户性别 -->
            <el-form-item label="用户性别" prop="sex">
              <el-radio-group v-model="form.sex">
                <el-radio :value="0" border>男</el-radio>
                <el-radio :value="1" border>女</el-radio>
                <el-radio :value="2" border>未知</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :xs="{ span: 24 }" :sm="{ span: 24 }">
            <!-- 用户头像 -->
            <el-form-item label="用户头像" prop="avatar">
              <YoiUploadImage v-model:image-url="form.avatar" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :xs="{ span: 24 }" :sm="{ span: 12 }">
            <!-- 用户状态 -->
            <el-form-item label="用户状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择用户状态">
                <el-option label="正常" :value="0" />
                <el-option label="停用" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="{ span: 24 }" :sm="{ span: 12 }" class="pl-10px">
            <el-form-item label="排序" prop="sortNum">
              <el-input-number v-model="form.sortNum" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :xs="{ span: 24 }" :sm="{ span: 24 }">
            <!-- 用户备注 -->
            <el-form-item label="用户备注" prop="remark">
              <el-input
                v-model="form.remark"
                :rows="5"
                type="textarea"
                placeholder="请输入用户备注"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!--  -->
      </el-form>
    </template>
  </YoiDialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import YoiDialog from '@/components/YoiDialog/index.vue'
import YoiUploadImage from '@/components/YoiUpload/Image.vue'
import type { FormInstance } from 'element-plus'
import type { AddUserInfoParams } from '@/api/system/user/type'
import {
  addUserApi,
  getNormalDeptListApi,
  getNormalPostListApi,
  getNormalRoleListApi,
} from '@/api/system/user'
import type { RoleInfo } from '@/types/system/role'
import type { PostInfo } from '@/types/system/post'
import { md5 } from 'js-md5'

const btnLoading = ref(false)
const formRef = ref<FormInstance>()
const form = ref<AddUserInfoParams>({
  deptId: 0,
  userName: '',
  nickName: '',
  password: '',
  userType: 0,
  postIds: [],
  roleIds: [],
  phone: '',
  email: '',
  sex: 2,
  avatar: '',
  sortNum: 0,
  status: 0,
  remark: '',
})
const rules = reactive({
  deptId: [{ required: true, message: '请选择状态', trigger: 'blur' }],
  userName: [{ required: true, message: '请输入登录账号', trigger: 'blur' }],
  nickName: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
  password: [{ required: true, message: '请输入登录密码', trigger: 'blur' }],
  userType: [{ required: true, message: '请选择用户类型', trigger: 'blur' }],
  roleIds: [
    {
      required: true,
      type: 'array',
      message: '请选择分配角色',
      trigger: 'blur',
    },
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { min: 11, max: 11, message: '请输入正确的手机号码', trigger: 'blur' },
  ],
  sex: [{ required: true, message: '请选择用户性别', trigger: 'blur' }],
  avatar: [{ required: true, message: '请上传用户头像', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
  sortNum: [{ required: true, message: '请输入排序', trigger: 'blur' }],
})
const deptTreeList = ref([])
const roleList = ref<RoleInfo[]>([])
const postList = ref<PostInfo[]>([])

const getData = async () => {
  const normalDeptRes = await getNormalDeptListApi()
  if (normalDeptRes.code === 200) {
    deptTreeList.value = normalDeptRes.data
  }
  const normalPostRes = await getNormalPostListApi()
  if (normalPostRes.code === 200) {
    postList.value = normalPostRes.data
  }
  const normalRoleRes = await getNormalRoleListApi()
  if (normalRoleRes.code === 200) {
    roleList.value = normalRoleRes.data
  }
}

const resetForm = () => {
  form.value = {
    deptId: 0,
    userName: '',
    nickName: '',
    password: '',
    userType: 0,
    postIds: [],
    roleIds: [],
    phone: '',
    email: '',
    sex: 2,
    avatar: '',
    sortNum: 0,
    status: 0,
    remark: '',
  }
  if (formRef.value) {
    formRef.value.resetFields()
  }
}
const yoiDialogRef = ref()
const emit = defineEmits(['confirm'])
const handleConfirm = () => {
  if (!formRef.value) return
  formRef.value.validate(async valid => {
    if (valid) {
      btnLoading.value = true
      console.log('submit!')
      let params: AddUserInfoParams = {
        ...form.value,
        password: md5(form.value.password).toUpperCase(),
      }
      const result = await addUserApi(params).catch(e => e)
      if (result.code === 200) {
        yoiDialogRef.value.confirmClose()
        emit('confirm')
      }
      btnLoading.value = false
    } else {
      console.log('error submit!')
    }
  })
}
const handleCancel = () => {
  yoiDialogRef.value.close()
}
const open = () => {
  yoiDialogRef.value.open()
  resetForm()
  getData()
}

defineExpose({
  open,
})
</script>

<style scoped></style>
