<script setup lang="ts">
import { CirclePlus, Refresh, RefreshRight, Search } from "@element-plus/icons-vue"
import dayjs from "dayjs"
import { usePagination } from "@/hooks/usePagination"
import { reactive, ref, watch } from "vue"
import { getCategoryDataApi } from "@/api/table/category"
import { GetCategoryData } from "@/api/table/category/types"

const addCategory = ref(false)

const form = reactive({})

const CategoryData = ref<GetCategoryData>()
const getCategoryData = () => {
  getCategoryDataApi({ page: paginationData.currentPage, limit: paginationData.pageSize }).then((res) => {
    paginationData.total = res.data.count
    console.log(res.data)
    CategoryData.value = res.data.list
  })
}

const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
watch([() => paginationData.currentPage, () => paginationData.pageSize], getCategoryData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <!-- 表格 -->
    <el-card shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true">
        <el-form-item prop="username" label="用户名">
          <el-input placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
          <el-input placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search">查询</el-button>
          <el-button :icon="Refresh">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button @click="addCategory = true" type="primary" :icon="CirclePlus">新增模块</el-button>
        </div>
        <div>
          <el-tooltip content="刷新当前页">
            <el-button type="primary" :icon="RefreshRight" circle />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="CategoryData">
          <el-table-column prop="id" label="编号" />
          <el-table-column label="模块名称" prop="categoryName" />
          <el-table-column prop="created_at" label="创建时间" align="center">
            <template #default="scope">
              {{ dayjs(scope.row.created_at).format("YYYY-MM-DD HH:mm:ss") }}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small">修改</el-button>
              <el-button type="danger" text bg size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          background
          :layout="paginationData.layout"
          :page-sizes="paginationData.pageSizes"
          :total="paginationData.total"
          :page-size="paginationData.pageSize"
          :currentPage="paginationData.currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <el-dialog width="30%" v-model="addCategory">
      <el-form label-width="100px" label-position="right">
        <el-form-item label="模块名称:"><el-input v-model="form.name" /></el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.search-wrapper {
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
