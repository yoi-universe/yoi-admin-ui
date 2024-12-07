<template>
  <YoiDialog
    ref="yoiDialogRef"
    title="修改菜单"
    :loading="loading"
    :btn-loading="btnLoading"
    @confirm="handleConfirm"
    @cancel="handleCancel"
    :height="500"
  >
    <template #content>
      <el-form ref="formRef" :rules="rules" :model="form" label-width="auto">
        <el-row>
          <el-col :xs="{ span: 24 }" :sm="{ span: 24 }">
            <!-- 菜单级联选择框 -->
            <el-form-item label="上级菜单" prop="parentId">
              <el-cascader
                placeholder="请选择上级菜单"
                v-model="form.parentId"
                :options="menuTreeList"
                :props="{
                  expandTrigger: 'hover',
                  emitPath: false,
                  checkStrictly: true,
                  label: 'menuName',
                  value: 'menuId',
                }"
                filterable
                clearable
                style="width: 100%"
              >
                <template #default="{ node, data }">
                  <span>{{ data.menuName }}</span>
                  <span v-if="!node.isLeaf">
                    ({{ data.children.length }})
                  </span>
                </template>
              </el-cascader>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :xs="{ span: 24 }" :sm="{ span: 24 }">
            <!-- 菜单类型 -->
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="form.menuType">
                <el-radio :value="0" border>目录</el-radio>
                <el-radio :value="1" border>菜单</el-radio>
                <el-radio :value="2" border>按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col
            :xs="{ span: 24 }"
            :sm="{ span: 24 }"
            v-if="form.menuType < MENU_TYPE_BUTTON"
          >
            <el-form-item label="菜单图标" prop="icon">
              <YoiSelectIcon v-model:model-value="form.icon" width="300" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :xs="{ span: 24 }" :sm="{ span: 12 }">
            <!-- 菜单名称 -->
            <el-form-item label="菜单名称" prop="menuName">
              <el-input
                v-model="form.menuName"
                placeholder="请输入菜单名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="{ span: 24 }" :sm="{ span: 12 }" class="pl-10px">
            <el-form-item label="排序" prop="sortNum">
              <el-input-number v-model="form.sortNum" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col
            :xs="{ span: 24 }"
            :sm="{ span: 12 }"
            v-if="form.menuType < MENU_TYPE_BUTTON"
          >
            <!-- 路由名称 -->
            <el-form-item label="路由名称" prop="routeName">
              <el-input
                v-model="form.routeName"
                placeholder="例如：userPage[唯一]"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col
            :xs="{ span: 24 }"
            :sm="{ span: 12 }"
            v-if="form.menuType < MENU_TYPE_BUTTON"
            class="pl-10px"
          >
            <!-- 路由地址 -->
            <el-form-item label="路由地址" prop="path">
              <el-input
                v-model="form.path"
                placeholder="例如：/user[唯一]"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :xs="{ span: 24 }" :sm="{ span: 12 }">
            <!-- 是否可见 -->
            <el-form-item label="是否可见" prop="visible">
              <el-radio-group v-model="form.visible">
                <el-radio :value="0">是</el-radio>
                <el-radio :value="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="{ span: 24 }" :sm="{ span: 12 }" class="pl-10px">
            <!-- 权限标识 -->
            <el-form-item label="权限标识" prop="perms">
              <el-input
                v-model="form.perms"
                placeholder="例如：system:user:list"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col
            :xs="{ span: 24 }"
            :sm="{ span: 12 }"
            v-if="form.menuType == MENU_TYPE_MENU"
          >
            <!-- 路由参数 -->
            <el-form-item label="路由参数" prop="query">
              <el-input
                v-model="form.query"
                placeholder="例如：{'id':1}"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col
            :xs="{ span: 24 }"
            :sm="{ span: 12 }"
            v-if="form.menuType == MENU_TYPE_MENU"
            class="pl-10px"
          >
            <!-- 组件路径 -->
            <el-form-item label="组件路径" prop="component">
              <el-input
                v-model="form.component"
                placeholder="例如：views/system/user/index"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col
            :xs="{ span: 24 }"
            :sm="{ span: 12 }"
            v-if="form.menuType == MENU_TYPE_MENU"
          >
            <!-- 是否缓存 -->
            <el-form-item label="是否缓存" prop="isCache">
              <el-radio-group v-model="form.isCache">
                <el-radio :value="0">是</el-radio>
                <el-radio :value="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="{ span: 24 }" :sm="{ span: 12 }" class="pl-10px">
            <!-- 菜单状态 -->
            <el-form-item label="菜单状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio :value="0">正常</el-radio>
                <el-radio :value="1">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col
            :xs="{ span: 24 }"
            :sm="{ span: 12 }"
            v-if="form.menuType < MENU_TYPE_BUTTON"
          >
            <!-- 是否外链 -->
            <el-form-item label="是否外链" prop="isLink">
              <el-radio-group v-model="form.isLink">
                <el-radio :value="0">否</el-radio>
                <el-radio :value="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col
            :xs="{ span: 24 }"
            :sm="{ span: 12 }"
            v-if="form.isLink == MENU_IS_LINK"
            class="pl-10px"
          >
            <!-- 链接类型 -->
            <el-form-item label="链接类型" prop="linkType">
              <el-radio-group v-model="form.linkType">
                <el-radio :value="0">内部</el-radio>
                <el-radio :value="1">外部</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col
            :xs="{ span: 24 }"
            :sm="{ span: 24 }"
            v-if="form.isLink == MENU_IS_LINK"
          >
            <!-- 外链地址 -->
            <el-form-item label="外链地址" prop="linkUrl">
              <el-input
                v-model="form.linkUrl"
                placeholder="例如：http://www.baidu.com"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!--  -->
      </el-form>
    </template>
  </YoiDialog>
</template>

<script lang="ts" setup>
import { nextTick, reactive, ref } from 'vue'
import YoiDialog from '@/components/YoiDialog/index.vue'
import type { UpdateMenuInfoParams } from '@/api/system/menu/type'
import type { FormInstance } from 'element-plus'
import {
  getMenuInfoApi,
  getMenuTreeListApi,
  updateMenuApi,
} from '@/api/system/menu'
import type { MenuTree } from '@/types/system/menu'
import YoiSelectIcon from '@/components/YoiSelectIcon/index.vue'
import {
  MENU_TYPE_MENU,
  MENU_TYPE_BUTTON,
  MENU_IS_LINK,
} from '@/constants/system'

const loading = ref(false)
const btnLoading = ref(false)
const formRef = ref<FormInstance>()
const form = ref<UpdateMenuInfoParams>({
  menuId: 0,
  parentId: 0,
  menuName: '',
  path: '',
  routeName: '',
  component: '',
  query: '',
  isLink: 0,
  linkType: 0,
  linkUrl: '',
  isCache: 0,
  menuType: 0,
  perms: '',
  icon: '',
  visible: 0,
  status: 0,
  sortNum: 0,
})
const rules = reactive({
  parentId: [{ required: true, message: '请选择上级菜单', trigger: 'blur' }],
  menuType: [{ required: true, message: '请选择菜单类型', trigger: 'blur' }],
  menuName: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  perms: [{ required: true, message: '请输入权限标识', trigger: 'blur' }],
  sortNum: [{ required: true, message: '请输入菜单排序', trigger: 'blur' }],
})
const menuTreeList = ref<Partial<MenuTree>[]>([])

const getData = async () => {
  loading.value = true
  const menuTreeListRes = await getMenuTreeListApi().catch(e => e)
  if (menuTreeListRes.code === 200) {
    menuTreeList.value = menuTreeListRes.data
    menuTreeList.value.unshift({
      menuId: 0,
      menuName: '顶级菜单',
      children: [],
    })
  }
  const menuInfoRes = await getMenuInfoApi(form.value.menuId).catch(e => e)
  if (menuInfoRes.code === 200) {
    form.value = menuInfoRes.data
  }
  loading.value = false
}

const resetForm = () => {
  // 等待 Dom 更新完毕
  nextTick(() => {
    if (formRef.value) {
      formRef.value.resetFields()
    }
  })
  form.value = {
    menuId: 0,
    parentId: 0,
    menuName: '',
    path: '',
    routeName: '',
    component: '',
    query: '',
    isLink: 0,
    linkType: 0,
    linkUrl: '',
    isCache: 0,
    menuType: 0,
    perms: '',
    icon: '',
    visible: 0,
    status: 0,
    sortNum: 0,
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
      const result = await updateMenuApi(form.value).catch(e => e)
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
const open = (id: number) => {
  yoiDialogRef.value.open()
  resetForm()
  form.value.menuId = id
  getData()
}

defineExpose({
  open,
})
</script>

<style scoped></style>
