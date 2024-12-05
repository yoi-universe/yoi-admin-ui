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

        <el-form-item label="菜单状态" prop="menuStatus">
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
          <el-button type="success" icon="Edit" plain :disabled="multiple"
            >修改</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger" icon="Delete" plain :disabled="multiple"
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
        <el-table-column type="selection" width="55" />
        <el-table-column prop="menuName" label="菜单名称" width="160" />
        <el-table-column
          prop="menuType"
          label="菜单类型"
          align="center"
          width="100"
        />
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
        />
        <el-table-column
          prop="visible"
          label="是否可见"
          align="center"
          width="100"
        />
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

    <MenuAdd ref="menuAddRef" />
  </div>
</template>

<script lang="ts" setup name="menuPage">
import { onMounted, ref } from 'vue'
import YoiCard from '@/components/YoiCard/index.vue'
import YoiToolbar from '@/components/YoiToolbar/index.vue'
import YoiGlobalIcon from '@/components/YoiGlobalIcon/index.vue'
import type { GetMenuListParams } from '@/api/system/menu/type'
import { getMenuListApi } from '@/api/system/menu'
import type { MenuTree } from '@/types/system/menu'
import MenuAdd from './add/MenuAdd.vue'

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
  const menuRes = await getMenuListApi(searchParams.value).catch(e => e)
  if (menuRes.code === 200) {
    tableList.value = menuRes.data
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

const menuAddRef = ref()
const handleAdd = () => {
  menuAddRef.value.open()
}

const handleUpdate = (row: MenuTree) => {
  console.log(row)
}
const handleDelete = (row: MenuTree) => {
  console.log(row)
}

onMounted(() => {
  getData()
})
</script>

<style scoped></style>
