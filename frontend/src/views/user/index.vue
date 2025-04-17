<template>
  <div class="user-container">
    <div class="header">
      <h2>用户管理</h2>
      <div class="header-buttons">
        <el-button type="primary" @click="handleAdd">添加用户</el-button>
      </div>
    </div>

    <el-tabs v-model="activeTab" class="user-tabs" @tab-click="handleTabClick">
      <el-tab-pane label="用户列表" name="list">
        <div class="search">
          <el-form :inline="true" :model="searchForm">
            <el-form-item label="用户名">
              <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="searchForm.phone" placeholder="请输入手机号" clearable />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
                <el-option label="正常" :value="1" />
                <el-option label="禁用" :value="0" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">搜索</el-button>
              <el-button @click="resetSearch">重置</el-button>
            </el-form-item>
          </el-form>
        </div>

        <el-table :data="userList" border style="width: 100%">
          <el-table-column prop="username" label="用户名" />
          <el-table-column prop="nickname" label="昵称" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column prop="phone" label="手机号" />
          <el-table-column prop="status" label="状态">
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'danger'">
                {{ row.status === 1 ? '正常' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="{ row }">
              <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
              <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-tab-pane>

      <el-tab-pane label="个人信息" name="profile">
        <profile-view v-if="activeTab === 'profile'" />
      </el-tab-pane>

      <el-tab-pane label="修改密码" name="password">
        <change-password-view v-if="activeTab === 'password'" />
      </el-tab-pane>
    </el-tabs>

    <!-- 添加/编辑用户对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加用户' : '编辑用户'"
      width="500px"
      class="user-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        class="dialog-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" :disabled="dialogType === 'edit'" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="dialogType === 'add'">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="0"
            active-text="正常"
            inactive-text="禁用"
            inline-prompt
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false" class="cancel-btn">取消</el-button>
          <el-button type="primary" @click="handleSubmit" class="submit-btn">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { getUserList, deleteUser, register, updateUserInfo } from '@/api/user'
import type { UserInfo, CreateUserDto, UpdateUserDto } from '@/api/user'
import ProfileView from './profile.vue'
import ChangePasswordView from './change-password.vue'

// 当前激活的标签页
const activeTab = ref('list')

// 标签页切换处理
const handleTabClick = (tab: any) => {
  activeTab.value = tab.props.name
}

// 搜索表单
const searchForm = reactive({
  username: '',
  phone: '',
  status: undefined as number | undefined
})

// 表格数据
const userList = ref<UserInfo[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 对话框
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref<FormInstance>()
const form = reactive<CreateUserDto & { status?: number }>({
  username: '',
  password: '',
  nickname: '',
  email: '',
  phone: '',
  status: 1
})

// 表单验证规则
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }]
}

// 获取用户列表
const fetchUserList = async () => {
  try {
    const res = await getUserList({
      ...searchForm,
      page: currentPage.value,
      pageSize: pageSize.value
    })
    userList.value = res.data.list
    total.value = res.data.total
  } catch (error) {
    console.error('获取用户列表失败:', error)
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchUserList()
}

// 重置搜索
const resetSearch = () => {
  searchForm.username = ''
  searchForm.phone = ''
  searchForm.status = undefined
  handleSearch()
}

// 分页
const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchUserList()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchUserList()
}

// 添加用户
const handleAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
  form.username = ''
  form.password = ''
  form.nickname = ''
  form.email = ''
  form.phone = ''
  form.status = 1
}

// 编辑用户
const handleEdit = (row: UserInfo) => {
  dialogType.value = 'edit'
  dialogVisible.value = true
  form.username = row.username
  form.nickname = row.nickname || ''
  form.email = row.email
  form.phone = row.phone || ''
  form.status = row.status
}

// 删除用户
const handleDelete = (row: UserInfo) => {
  ElMessageBox.confirm('确定要删除该用户吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteUser(row.username)
      ElMessage.success('删除成功')
      fetchUserList()
    } catch (error) {
      console.error('删除用户失败:', error)
    }
  })
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (dialogType.value === 'add') {
          await register(form)
          ElMessage.success('添加成功')
        } else {
          const { password, ...updateData } = form
          await updateUserInfo(form.username, updateData)
          ElMessage.success('更新成功')
        }
        dialogVisible.value = false
        fetchUserList()
      } catch (error) {
        console.error('操作失败:', error)
      }
    }
  })
}

onMounted(() => {
  fetchUserList()
})
</script>

<style scoped>
.user-container {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-buttons {
  display: flex;
  gap: 10px;
}

.search {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.user-tabs {
  margin-top: 20px;
}

:deep(.user-dialog) {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.user-dialog .el-dialog__header) {
  margin: 0;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

:deep(.user-dialog .el-dialog__title) {
  color: white;
  font-size: 18px;
  font-weight: 600;
}

:deep(.user-dialog .el-dialog__headerbtn) {
  top: 20px;
  right: 20px;
}

:deep(.user-dialog .el-dialog__headerbtn .el-dialog__close) {
  color: white;
}

:deep(.user-dialog .el-dialog__body) {
  padding: 30px;
}

:deep(.user-dialog .el-dialog__footer) {
  padding: 20px;
  border-top: 1px solid var(--border-color-light);
}

.dialog-form {
  max-width: 100%;
}

:deep(.dialog-form .el-input__inner) {
  border-radius: 8px;
  transition: all 0.3s ease;
}

:deep(.dialog-form .el-input__inner:focus) {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

:deep(.dialog-form .el-switch) {
  --el-switch-on-color: #667eea;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-btn {
  border-radius: 8px;
  padding: 10px 20px;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background-color: #f5f5f5;
  transform: translateY(-2px);
}

.submit-btn {
  border-radius: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}
</style> 