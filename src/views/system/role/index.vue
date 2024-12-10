<template>
  <div class="yoi-flex">
    <YoiCard>
      <!-- 搜索条件 -->
      <el-form :inline="true" v-show="showSearch">
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="searchParams.roleName"
            placeholder="请输入角色名称"
            clearable
            style="width: 240px"
          />
        </el-form-item>

        <el-form-item label="角色编号" prop="roleKey">
          <el-input
            v-model="searchParams.roleKey"
            placeholder="请输入角色编号"
            clearable
            style="width: 240px"
          />
        </el-form-item>

        <el-form-item label="角色状态" prop="status">
          <el-select
            placeholder="请选择角色状态"
            v-model.number="searchParams.status"
            clearable
            style="width: 240px"
          >
            <el-option label="启用" :value="0" />
            <el-option label="停用" :value="1" />
          </el-select>
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
        <el-col :span="1.5">
          <el-button type="primary" icon="Plus" plain @click="handleAdd"
            >新增</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            icon="Edit"
            plain
            :disabled="multiple"
            @click="handleBatchUpdate"
            >修改</el-button
          >
        </el-col>
        <el-col :span="1.5">
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
        row-key="menuId"
        :tree-props="{ children: 'children' }"
        empty-text="暂时没有数据"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" width="55" />
        <el-table-column
          prop="roleName"
          label="角色名称"
          align="center"
          width="160"
        />
        <el-table-column
          prop="roleKey"
          label="角色编号"
          align="center"
          width="160"
        />
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
          prop="remark"
          label="角色备注"
          align="center"
          width="220"
          show-overflow-tooltip
        />
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
          width="180"
        />
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-tooltip content="修改" placement="top">
              <el-button
                type="primary"
                icon="Edit"
                circle
                plain
                @click="handleUpdate(row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                type="danger"
                icon="Delete"
                circle
                plain
                @click="handleDelete(row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="分配菜单" placement="top">
              <el-button
                type="info"
                icon="Postcard"
                circle
                plain
                @click="handleAssignMenu(row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="数据权限" placement="top">
              <el-button
                type="success"
                icon="FolderOpened"
                circle
                plain
                @click="handleAssignDept(row)"
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

    <RoleAdd ref="addRef" @confirm="getData" />
    <RoleUpdate ref="updateRef" @confirm="getData" />
    <RoleBatchUpdate ref="batchUpdateRef" @confirm="getData" />
    <RoleAssignMenu ref="roleAssignMenuRef" @confirm="getData" />
    <RoleAssignDept ref="roleAssignDeptRef" @confirm="getData" />
  </div>
</template>

<script lang="ts" setup name="rolePage">
import { onMounted, ref } from 'vue'
import YoiCard from '@/components/YoiCard/index.vue'
import YoiToolbar from '@/components/YoiToolbar/index.vue'
import RoleAdd from './add/RoleAdd.vue'
import RoleUpdate from './update/RoleUpdate.vue'
import RoleBatchUpdate from './batchUpdate/RoleBatchUpdate.vue'
import RoleAssignMenu from './assignMenu/RoleAssignMenu.vue'
import RoleAssignDept from './assignDept/RoleAssignDept.vue'
import { elMsgError, elMsgSuccess, elMsgWarning } from '@/utils/elMsg'
import { elMsgBox } from '@/utils/elMsgBox'
import type { GetRoleListParams } from '@/api/system/role/type'
import type { RoleInfo } from '@/types/system/role'
import { deleteRoleApi, getRoleListApi } from '@/api/system/role'
import { useDictStore } from '@/stores'
import YoiTag from '@/components/YoiTag/index.vue'

const searchParams = ref<GetRoleListParams>({
  roleName: '',
  roleKey: '',
  status: null,
  pageNum: 1,
  pageSize: 10,
})
const total = ref(0)
const showSearch = ref(true)
// 数据表格加载页面动画
const loading = ref(false)
const ids = ref<number[]>([])
const multiple = ref(true)
const tableList = ref<RoleInfo[]>([])
const handleSelectionChange = (val: RoleInfo[]) => {
  ids.value = val.map(item => item.roleId)
  multiple.value = !val.length
}

const dictStore = useDictStore()
const normalDisableOptions = ref([])
const getData = async () => {
  loading.value = true
  normalDisableOptions.value = await dictStore.getDictData('sys_normal_disable')
  const roleRes = await getRoleListApi(searchParams.value)
  if (roleRes.code === 200) {
    tableList.value = roleRes.data.list
    total.value = roleRes.data.total
  } else {
    elMsgError(roleRes.message)
  }
  loading.value = false
}

const handleSearch = () => {
  searchParams.value.pageNum = 1
  getData()
}

const resetSearch = () => {
  searchParams.value = {
    roleName: '',
    roleKey: '',
    status: null,
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
      await deleteRoleApi(ids.value)
      elMsgSuccess('删除成功')
      getData()
    })
    .catch(e => {
      elMsgError(e.message || '已取消')
    })
}

const updateRef = ref()
const handleUpdate = (row: RoleInfo) => {
  updateRef.value.open(row.roleId)
}
const handleDelete = (row: RoleInfo) => {
  const id = row.roleId
  if (!id) {
    elMsgWarning('请选择要删除的数据')
    return
  }
  elMsgBox(`您确认需要删除菜单名称[${row.roleName}]吗？`)
    .then(async () => {
      await deleteRoleApi([id])
      elMsgSuccess('删除成功')
      getData()
    })
    .catch(e => {
      elMsgError(e.message || '已取消')
    })
}

const roleAssignMenuRef = ref()
const handleAssignMenu = (row: RoleInfo) => {
  roleAssignMenuRef.value.open(row.roleId)
}

const roleAssignDeptRef = ref()
const handleAssignDept = (row: RoleInfo) => {
  roleAssignDeptRef.value.open(row.roleId)
}

onMounted(() => {
  getData()
})
</script>

<style scoped></style>
