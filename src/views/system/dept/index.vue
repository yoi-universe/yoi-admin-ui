<template>
  <div class="yoi-flex">
    <YoiCard>
      <!-- 搜索条件 -->
      <el-form :inline="true" v-show="showSearch">
        <el-form-item label="部门名称" prop="deptName">
          <el-input
            v-model="searchParams.deptName"
            placeholder="请输入部门名称"
            clearable
            style="width: 240px"
          />
        </el-form-item>

        <el-form-item label="部门状态" prop="status">
          <el-select
            placeholder="请选择部门状态"
            v-model.number="searchParams.status"
            clearable
            style="width: 240px"
          >
            <el-option label="正常" :value="0" />
            <el-option label="停用" :value="1" />
          </el-select>
        </el-form-item>

        <el-form-item label="联系电话" prop="phone">
          <el-input
            v-model="searchParams.phone"
            placeholder="请输入联系电话"
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
          <el-button type="primary" icon="Plus" plain @click="handleAdd()"
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
        row-key="deptId"
        :tree-props="{ children: 'children' }"
        empty-text="暂时没有数据"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" width="55" />
        <el-table-column prop="deptName" label="部门名称" width="160" />
        <el-table-column
          prop="leader"
          label="负责人"
          align="center"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="phone"
          label="联系电话"
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
          prop="remark"
          label="备注"
          align="center"
          width="220"
          show-overflow-tooltip
        />
        <el-table-column
          prop="sortNum"
          label="排序"
          align="center"
          width="90"
        />
        <el-table-column label="操作" align="center" width="160" fixed="right">
          <template #default="{ row }">
            <el-tooltip content="新增" placement="top">
              <el-button
                type="primary"
                icon="CirclePlus"
                circle
                plain
                @click="handleAdd(row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="修改" placement="top">
              <el-button
                type="success"
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

    <DeptAdd ref="addRef" @confirm="getData" />
    <DeptUpdate ref="updateRef" @confirm="getData" />
    <DeptBatchUpdate ref="batchUpdateRef" @confirm="getData" />
  </div>
</template>

<script lang="ts" setup name="menuPage">
import { onMounted, ref } from 'vue'
import YoiCard from '@/components/YoiCard/index.vue'
import YoiToolbar from '@/components/YoiToolbar/index.vue'
import DeptAdd from './add/DeptAdd.vue'
import DeptUpdate from './update/DeptUpdate.vue'
import DeptBatchUpdate from './batchUpdate/DeptBatchUpdate.vue'
import { elMsgError, elMsgSuccess, elMsgWarning } from '@/utils/elMsg'
import { elMsgBox } from '@/utils/elMsgBox'
import { useDictStore } from '@/stores'
import YoiTag from '@/components/YoiTag/index.vue'
import type { GetDeptListParams } from '@/api/system/dept/type'
import type { DeptInfo } from '@/types/system/dept'
import { deleteDeptApi, getDeptListApi } from '@/api/system/dept'

const searchParams = ref<GetDeptListParams>({
  deptName: '',
  phone: '',
  status: null,
})
const showSearch = ref(true)
// 数据表格加载页面动画
const loading = ref(false)
const ids = ref<number[]>([])
const multiple = ref(true)
const tableList = ref<DeptInfo[]>([])
const handleSelectionChange = (val: DeptInfo[]) => {
  ids.value = val.map(item => item.deptId)
  multiple.value = !val.length
}

const dictStore = useDictStore()
const normalDisableOptions = ref([])
const getData = async () => {
  loading.value = true
  normalDisableOptions.value = await dictStore.getDictData('sys_normal_disable')
  const menuRes = await getDeptListApi(searchParams.value)
  if (menuRes.code === 200) {
    tableList.value = menuRes.data
  } else {
    elMsgError(menuRes.message)
  }
  loading.value = false
}

const resetSearch = () => {
  searchParams.value = {
    deptName: '',
    phone: '',
    status: null,
  }
  getData()
}

const addRef = ref()
const handleAdd = (row?: DeptInfo) => {
  addRef.value.open(row?.deptId)
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
      await deleteDeptApi(ids.value)
      elMsgSuccess('删除成功')
      getData()
    })
    .catch(e => {
      elMsgError(e.message || '已取消')
    })
}

const updateRef = ref()
const handleUpdate = (row: DeptInfo) => {
  updateRef.value.open(row.deptId)
}
const handleDelete = (row: DeptInfo) => {
  const id = row.deptId
  if (!id) {
    elMsgWarning('请选择要删除的数据')
    return
  }
  elMsgBox(`您确认需要删除菜单名称[${row.deptName}]吗？`)
    .then(async () => {
      await deleteDeptApi([id])
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
