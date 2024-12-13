<template>
  <div class="yoi-flex">
    <YoiCard>
      <!-- 搜索条件 -->
      <el-form :inline="true" v-show="showSearch">
        <el-form-item label="登录账号" prop="userName">
          <el-input
            v-model="searchParams.userName"
            placeholder="请输入登录账号"
            clearable
            style="width: 240px"
          />
        </el-form-item>

        <el-form-item label="用户名称" prop="nickName">
          <el-input
            v-model="searchParams.nickName"
            placeholder="请输入用户名称"
            clearable
            style="width: 240px"
          />
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="searchParams.phone"
            placeholder="请输入手机号"
            clearable
            style="width: 240px"
          />
        </el-form-item>

        <el-form-item label="部门" prop="status">
          <el-cascader
            placeholder="请选择归属部门"
            v-model="searchParams.deptId"
            :options="deptOptions"
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
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            icon="Search"
            plain
            v-throttle="handleSearch"
            >搜索</el-button
          >
          <el-button type="danger" icon="refresh" plain v-debounce="resetSearch"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
      <!-- 表格头部按钮 -->
      <el-row :gutter="10">
        <el-col :span="1.5" v-auth="['system:user:add']">
          <el-button type="primary" icon="Plus" plain @click="handleAdd"
            >新增</el-button
          >
        </el-col>
        <el-col :span="1.5" v-auth="['system:user:update']">
          <el-button
            type="success"
            icon="Edit"
            plain
            :disabled="multiple"
            @click="handleBatchUpdate"
            >修改</el-button
          >
        </el-col>
        <el-col :span="1.5" v-auth="['system:user:delete']">
          <el-button
            type="danger"
            icon="Delete"
            plain
            :disabled="multiple"
            @click="handleBatchDelete"
            >删除</el-button
          >
        </el-col>
        <YoiToolbar v-model:show-search="showSearch" @refresh-table="getData" />
      </el-row>
      <br />
      <!-- 数据表格 -->
      <el-table
        v-loading="loading"
        :data="tableList"
        border
        empty-text="暂时没有数据"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" width="55" />
        <el-table-column
          prop="userName"
          label="登录账号"
          align="center"
          width="160"
        />
        <el-table-column
          prop="nickName"
          label="用户名称"
          align="center"
          width="160"
        />
        <el-table-column
          prop="deptName"
          label="部门名称"
          align="center"
          width="160"
        />
        <el-table-column prop="avatar" label="头像" align="center" width="80">
          <template #default="{ row }">
            <div class="flex justify-center">
              <el-image
                class="rounded-full w-36px h-36px"
                :preview-teleported="true"
                :preview-src-list="[
                  row.avatar != null && row.avatar != ''
                    ? prefix + row.avatar
                    : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
                ]"
                :src="
                  row.avatar != null && row.avatar != ''
                    ? prefix + row.avatar
                    : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
                "
              >
                <template #error>
                  <el-icon class="c-[--el-color-primary]" :size="36">
                    <CircleCloseFilled />
                  </el-icon>
                </template>
              </el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号"
          align="center"
          width="120"
        />
        <el-table-column
          prop="email"
          label="邮箱"
          align="center"
          width="180"
          show-overflow-tooltip
        />
        <el-table-column
          prop="userType"
          label="用户类型"
          align="center"
          width="100"
        >
          <template #default="{ row }">
            <YoiTag :tag-options="userTypeOptions" :value="row.userType" />
          </template>
        </el-table-column>
        <el-table-column prop="sex" label="用户性别" align="center" width="100">
          <template #default="{ row }">
            <YoiTag :tag-options="userSexOptions" :value="row.status" />
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="菜单状态"
          align="center"
          width="100"
        >
          <template #default="{ row }">
            <YoiTag :tag-options="normalDisableOptions" :value="row.status" />
          </template>
        </el-table-column>
        <el-table-column
          prop="sortNum"
          label="排序"
          align="center"
          width="90"
        />
        <el-table-column
          prop="loginDate"
          label="登录时间"
          align="center"
          width="180"
        />
        <el-table-column
          label="操作"
          align="center"
          width="120"
          fixed="right"
          v-auth="['system:user:update', 'system:user:delete']"
        >
          <template #default="{ row }">
            <el-tooltip content="修改" placement="top">
              <el-button
                type="primary"
                icon="Edit"
                circle
                plain
                @click="handleUpdate(row)"
                v-auth="['system:user:update']"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                type="danger"
                icon="Delete"
                circle
                plain
                @click="handleDelete(row)"
                v-auth="['system:user:delete']"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <br />
      <!-- 分页 -->
      <el-pagination
        background
        v-model:current-page="searchParams.pageNum"
        v-model:page-size="searchParams.pageSize"
        v-show="total > 0"
        :page-sizes="[10, 20, 50, 100, 200]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="getData"
        @current-change="getData"
      />
    </YoiCard>

    <UserAdd ref="addRef" @confirm="getData" />
    <UserUpdate ref="updateRef" @confirm="getData" />
    <UserBatchUpdate ref="batchUpdateRef" @confirm="getData" />
  </div>
</template>

<script lang="ts" setup name="userPage">
import { onMounted, ref } from 'vue'
import YoiCard from '@/components/YoiCard/index.vue'
import YoiToolbar from '@/components/YoiToolbar/index.vue'
import UserAdd from './add/UserAdd.vue'
import UserUpdate from './update/UserUpdate.vue'
import UserBatchUpdate from './batchUpdate/UserBatchUpdate.vue'
import { elMsgError, elMsgSuccess, elMsgWarning } from '@/utils/elMsg'
import { elMsgBox } from '@/utils/elMsgBox'
import { useDictStore } from '@/stores'
import YoiTag from '@/components/YoiTag/index.vue'
import type { GetUserListParams } from '@/api/system/user/type'
import type { UserInfo } from '@/types/system/user'
import {
  deleteUserApi,
  getNormalDeptListApi,
  getUserListApi,
} from '@/api/system/user'
import type { DeptInfo } from '@/types/system/dept'

const prefix = import.meta.env.VITE_FILE_URL + '/get_img/'

const searchParams = ref<GetUserListParams>({
  userName: '',
  nickName: '',
  phone: '',
  deptId: null,
  pageNum: 1,
  pageSize: 10,
})
const total = ref(0)
const showSearch = ref(true)
// 数据表格加载页面动画
const loading = ref(false)
const ids = ref<number[]>([])
const multiple = ref(true)
const tableList = ref<UserInfo[]>([])
const handleSelectionChange = (val: UserInfo[]) => {
  ids.value = val.map(item => item.userId)
  multiple.value = !val.length
}

const dictStore = useDictStore()
const userTypeOptions = ref([])
const userSexOptions = ref([])
const deptOptions = ref<DeptInfo[]>([])
const normalDisableOptions = ref([])
const getData = async () => {
  loading.value = true
  userTypeOptions.value = await dictStore.getDictData('sys_user_type')
  userSexOptions.value = await dictStore.getDictData('sys_user_sex')
  normalDisableOptions.value = await dictStore.getDictData('sys_normal_disable')
  const normalDeptRes = await getNormalDeptListApi()
  if (normalDeptRes.code === 200) {
    deptOptions.value = normalDeptRes.data
  }
  const userRes = await getUserListApi(searchParams.value)
  if (userRes.code === 200) {
    tableList.value = userRes.data.list
    total.value = userRes.data.total
  } else {
    elMsgError(userRes.message)
  }
  loading.value = false
}

const handleSearch = () => {
  searchParams.value.pageNum = 1
  getData()
}

const resetSearch = () => {
  searchParams.value = {
    userName: '',
    nickName: '',
    phone: '',
    deptId: null,
    pageNum: 1,
    pageSize: 10,
  }
  getData()
}

const addRef = ref()
const handleAdd = () => {
  addRef.value.open()
}

const batchUpdateRef = ref()
const handleBatchUpdate = () => {
  batchUpdateRef.value.open(ids.value)
}

const handleBatchDelete = () => {
  if (ids.value.length === 0) {
    elMsgWarning('请选择要删除的数据')
    return
  }
  elMsgBox('您确认进行删除么？')
    .then(async () => {
      await deleteUserApi(ids.value)
      elMsgSuccess('删除成功')
      getData()
    })
    .catch(e => {
      elMsgError(e.message || '已取消')
    })
}

const updateRef = ref()
const handleUpdate = (row: UserInfo) => {
  updateRef.value.open(row.userId)
}
const handleDelete = (row: UserInfo) => {
  const id = row.userId
  if (!id) {
    elMsgWarning('请选择要删除的数据')
    return
  }
  elMsgBox(`您确认需要删除菜单名称[${row.userName}]吗？`)
    .then(async () => {
      await deleteUserApi([id])
      elMsgSuccess('删除成功')
      getData()
    })
    .catch(e => {
      elMsgError(e.message || '已取消')
    })
}

onMounted(() => {
  getData()
})
</script>

<style scoped></style>
