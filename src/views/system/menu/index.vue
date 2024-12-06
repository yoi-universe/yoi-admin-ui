<template>
  <div class="yoi-flex">
    <YoiCard>
      <!-- 搜索条件 -->
      <el-form :inline="true" v-show="showSearch">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input
            v-model="searchParams.menuName"
            placeholder="请输入菜单名称"
            clearable
            style="width: 240px"
          />
        </el-form-item>

        <el-form-item label="菜单状态" prop="status">
          <el-select
            placeholder="请选择菜单状态"
            v-model.number="searchParams.status"
            clearable
            style="width: 240px"
          >
            <el-option label="启用" :value="0" />
            <el-option label="停用" :value="1" />
          </el-select>
        </el-form-item>

        <el-form-item label="权限标识" prop="perms">
          <el-input
            v-model="searchParams.perms"
            placeholder="请输入权限标识"
            clearable
            style="width: 240px"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="Search" plain v-throttle="getData"
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
        <el-table-column prop="menuName" label="菜单名称" width="160" />
        <el-table-column
          prop="menuType"
          label="菜单类型"
          align="center"
          width="100"
        >
          <template #default="{ row }">
            <el-tag type="primary" v-if="row.menuType === MENU_TYPE_DIRECTORY"
              >目录</el-tag
            >
            <el-tag type="warning" v-if="row.menuType === MENU_TYPE_MENU"
              >菜单</el-tag
            >
            <el-tag type="success" v-if="row.menuType === MENU_TYPE_BUTTON"
              >按钮</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="icon" label="图标" align="center" width="80">
          <template #default="{ row }">
            <YoiGlobalIcon :icon="row.icon" size="20" />
          </template>
        </el-table-column>
        <el-table-column
          prop="perms"
          label="权限标识"
          align="center"
          width="220"
        />
        <el-table-column
          prop="component"
          label="组件路径"
          align="center"
          width="220"
          show-overflow-tooltip
        />
        <el-table-column
          prop="status"
          label="菜单状态"
          align="center"
          width="100"
        >
          <template #default="{ row }">
            <el-tag type="success" v-if="row.status === MENU_STATUS_ENABLE"
              >启用</el-tag
            >
            <el-tag type="danger" v-if="row.status === MENU_STATUS_DISABLE"
              >停用</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="visible"
          label="是否可见"
          align="center"
          width="100"
        >
          <template #default="{ row }">
            <el-tag type="success" v-if="row.visible === MENU_SHOW_YES"
              >显示</el-tag
            >
            <el-tag type="danger" v-if="row.visible === MENU_SHOW_NO"
              >隐藏</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="path"
          label="路由地址"
          align="center"
          width="180"
        />
        <el-table-column
          prop="sortNum"
          label="排序"
          align="center"
          width="90"
        />
        <el-table-column label="操作" align="center" width="120" fixed="right">
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
          </template>
        </el-table-column>
      </el-table>
    </YoiCard>

    <MenuAdd ref="addRef" @confirm="getData" />
    <MenuUpdate ref="updateRef" @confirm="getData" />
    <MenuBatchUpdate ref="batchUpdateRef" @confirm="getData" />
  </div>
</template>

<script lang="ts" setup name="menuPage">
import { onMounted, ref } from 'vue'
import YoiCard from '@/components/YoiCard/index.vue'
import YoiToolbar from '@/components/YoiToolbar/index.vue'
import YoiGlobalIcon from '@/components/YoiGlobalIcon/index.vue'
import type { GetMenuListParams } from '@/api/system/menu/type'
import { deleteMenuApi, getMenuListApi } from '@/api/system/menu'
import type { MenuTree } from '@/types/system/menu'
import MenuAdd from './add/MenuAdd.vue'
import MenuUpdate from './update/MenuUpdate.vue'
import MenuBatchUpdate from './batchUpdate/MenuBatchUpdate.vue'
import { elMsgError, elMsgSuccess, elMsgWarning } from '@/utils/elMsg'
import { elMsgBox } from '@/utils/elMsgBox'
import {
  MENU_TYPE_DIRECTORY,
  MENU_TYPE_MENU,
  MENU_TYPE_BUTTON,
  MENU_STATUS_ENABLE,
  MENU_STATUS_DISABLE,
  MENU_SHOW_YES,
  MENU_SHOW_NO,
} from '@/constants/system'

const searchParams = ref<GetMenuListParams>({
  menuName: '',
  status: null,
  perms: '',
})
const showSearch = ref(true)
// 数据表格加载页面动画
const loading = ref(false)
const ids = ref<number[]>([])
const multiple = ref(true)
const tableList = ref<MenuTree[]>([])
const handleSelectionChange = (val: MenuTree[]) => {
  ids.value = val.map(item => item.menuId)
  multiple.value = !val.length
}

const getData = async () => {
  loading.value = true
  const menuRes = await getMenuListApi(searchParams.value)
  if (menuRes.code === 200) {
    tableList.value = menuRes.data
  } else {
    elMsgError(menuRes.message)
  }
  loading.value = false
}

const resetSearch = () => {
  searchParams.value = {
    menuName: '',
    status: null,
    perms: '',
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
      await deleteMenuApi(ids.value)
      elMsgSuccess('删除成功')
      getData()
    })
    .catch(() => {
      elMsgError('已取消')
    })
}

const updateRef = ref()
const handleUpdate = (row: MenuTree) => {
  updateRef.value.open(row.menuId)
}
const handleDelete = (row: MenuTree) => {
  const id = row.menuId
  if (!id) {
    elMsgWarning('请选择要删除的数据')
    return
  }
  elMsgBox(`您确认需要删除菜单名称[${row.menuName}]吗？`)
    .then(async () => {
      await deleteMenuApi([id])
      elMsgSuccess('删除成功')
      getData()
    })
    .catch(() => {
      elMsgError('已取消')
    })
}

onMounted(() => {
  getData()
})
</script>

<style scoped></style>
