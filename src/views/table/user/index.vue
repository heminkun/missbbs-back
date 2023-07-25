<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { getTableDataApi, getUserSoloApi } from "@/api/table"
import { type GetTableData } from "@/api/table/types/table"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import dayjs from "dayjs"

defineOptions({
  // 命名当前组件
  name: "ElementPlus"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

const user = reactive({
  info: {},
  loading: true
})

//#region 增
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  username: "",
  password: ""
})
const formRules: FormRules = reactive({
  username: [{ required: true, trigger: "blur", message: "请输入用户名" }],
  password: [{ required: true, trigger: "blur", message: "请输入密码" }]
})

const resetForm = () => {
  user.info = {}
}

//#region 改
const currentUpdateId = ref<undefined | string>(undefined)
const handleUpdate = (row: GetTableData) => {
  currentUpdateId.value = row.id
  formData.username = row.name
  dialogVisible.value = true
}
//#endregion
//#region 查
const tableData = ref<GetTableData[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  name: "",
  tel: ""
})
const handleInfo = (id) => {
  dialogVisible.value = true
  user.loading = true
  getUserSoloApi({ id: id }).then((res) => {
    user.info = res.data
    user.loading = false
  })
}
const getTableData = () => {
  loading.value = true
  getTableDataApi({
    page: paginationData.currentPage,
    limit: paginationData.pageSize,
    name: searchData.name,
    tel: searchData.tel
  })
    .then((res) => {
      paginationData.total = res.data.count
      tableData.value = res.data.list
    })
    .catch(() => {
      tableData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
const handleSearch = () => {
  paginationData.currentPage === 1 ? getTableData() : (paginationData.currentPage = 1)
}
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  handleSearch()
}
//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="username" label="用户名">
          <el-input v-model="searchData.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
          <el-input v-model="searchData.tel" placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div />
        <div>
          <el-tooltip content="刷新当前页">
            <el-button type="primary" :icon="RefreshRight" circle @click="getTableData" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column prop="name" label="用户名" align="center" />
          <el-table-column prop="role" label="角色" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.role === '管理员'" effect="plain">管理员</el-tag>
              <el-tag v-else type="warning" effect="plain">{{ scope.row.role }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="tel" label="手机号" align="center">
            <template #default="scope">
              <el-tag effect="plain" v-if="scope.row.tel !== ''">{{ scope.row.tel }}</el-tag>
              <el-tag v-else type="danger" effect="plain">未绑定手机号码</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="email" label="邮箱" align="center" />
          <el-table-column prop="type" label="注册方式" align="center">
            <template #default="scope">
              <el-tag type="success" effect="plain">{{ scope.row.type }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="创建时间" align="center">
            <template #default="scope">
              {{ dayjs(scope.row.created_at).format("YYYY-MM-DD HH:mm:ss") }}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-button type="info" text bg size="small" @click="handleInfo(scope.row.id)">查看</el-button>
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">修改</el-button>
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
    <!-- 新增/修改 -->
    <el-dialog v-model="dialogVisible" title="用户详细" @close="resetForm" width="40%">
      <el-descriptions v-loading="user.loading" column="3">
        <el-descriptions-item label="用户id">{{ user.info.id }}</el-descriptions-item>
        <el-descriptions-item label="用户名称">{{ user.info.name }}</el-descriptions-item>
        <el-descriptions-item label="邮箱"
          ><el-tag type="danger" effect="plain" v-if="user.info.email === ''">未绑定邮箱</el-tag>
          <el-tag effect="plain" v-else>{{ user.info.email }}</el-tag></el-descriptions-item
        >
        <el-descriptions-item label="手机"
          ><el-tag type="danger" effect="plain" v-if="user.info.tel === ''">未绑定手机号码</el-tag>
          <el-tag effect="plain" v-else>{{ user.info.tel }}</el-tag></el-descriptions-item
        >
        <el-descriptions-item label="注册方式">
          <el-tag effect="plain">{{ user.info.type }}</el-tag></el-descriptions-item
        >
        <el-descriptions-item label="角色">
          <el-tag effect="plain">{{ user.info.role }}</el-tag></el-descriptions-item
        >
        <el-descriptions-item label="创建时间">{{
          dayjs(user.info.created_at).format("YYYY-MM-DD HH:mm:ss")
        }}</el-descriptions-item>
        <el-descriptions-item label="ip地址">{{ user.info.ip }}</el-descriptions-item>
        <el-descriptions-item label="粉丝数量"> {{ user.info.fansNum }}人</el-descriptions-item>
        <el-descriptions-item label="关注数量"> {{ user.info.followNum }}人</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <!--        <el-button type="primary">确认</el-button>-->
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
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
