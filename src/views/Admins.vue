<template>
  <div class="admins-container">
    <!-- 顶部统计卡片 -->
    <el-row :gutter="20" class="dashboard-cards">
      <el-col :span="6">
        <el-card class="data-card total-admins" shadow="hover">
          <div class="data-card-content">
            <div class="icon-wrapper">
              <i class="el-icon-user"></i>
            </div>
            <div class="data-info">
              <div class="data-title">管理员总数</div>
              <div class="data-value">{{ totalAdmins }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="data-card active-admins" shadow="hover">
          <div class="data-card-content">
            <div class="icon-wrapper">
              <i class="el-icon-user-solid"></i>
            </div>
            <div class="data-info">
              <div class="data-title">在线管理员</div>
              <div class="data-value">{{ activeAdmins }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="data-card disabled-admins" shadow="hover">
          <div class="data-card-content">
            <div class="icon-wrapper">
              <i class="el-icon-warning"></i>
            </div>
            <div class="data-info">
              <div class="data-title">已禁用管理员</div>
              <div class="data-value">{{ disabledAdmins }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="data-card super-admins" shadow="hover">
          <div class="data-card-content">
            <div class="icon-wrapper">
              <i class="el-icon-s-custom"></i>
            </div>
            <div class="data-info">
              <div class="data-title">超级管理员</div>
              <div class="data-value">{{ superAdmins }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 管理员列表 -->
    <el-card class="admins-table-card">
      <div slot="header" class="clearfix">
        <div class="header-left">
          <span class="table-header">管理员列表</span>
          <span class="table-subtitle">共 {{ totalAdmins }} 个管理员</span>
        </div>
        <div class="header-right">
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd">
            新增管理员
          </el-button>
        </div>
      </div>

      <!-- 搜索工具栏 -->
      <div class="table-toolbar">
        <div class="toolbar-left">
          <el-input
            v-model="searchQuery"
            placeholder="搜索管理员姓名/账号"
            prefix-icon="el-icon-search"
            class="search-input"
            clearable
          />
          <el-select v-model="roleFilter" placeholder="角色" class="filter-select">
            <el-option label="全部" value="" />
            <el-option label="超级管理员" value="super" />
            <el-option label="普通管理员" value="normal" />
          </el-select>
          <el-select v-model="statusFilter" placeholder="状态" class="filter-select">
            <el-option label="全部" value="" />
            <el-option label="正常" value="active" />
            <el-option label="已禁用" value="disabled" />
          </el-select>
        </div>
        <el-button type="primary" icon="el-icon-refresh" @click="refreshAdmins">刷新</el-button>
      </div>

      <!-- 管理员表格 -->
      <el-table
        :data="filteredAdmins"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column type="index" width="50" align="center" />
        
        <el-table-column label="管理员信息" min-width="200">
          <template slot-scope="scope">
            <div class="admin-info">
              <el-avatar
                :size="40"
                :src="scope.row.avatar"
                class="admin-avatar"
              >
                {{ scope.row.name.charAt(0).toUpperCase() }}
              </el-avatar>
              <div class="admin-details">
                <span class="admin-name">{{ scope.row.name }}</span>
                <span class="admin-account">{{ scope.row.account }}</span>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="角色" width="120">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.role === 'super' ? 'danger' : 'primary'"
              effect="plain"
              size="small"
            >
              {{ scope.row.role === 'super' ? '超级管理员' : '普通管理员' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="phone" label="联系电话" width="150" />
        
        <el-table-column prop="email" label="邮箱" min-width="200" />

        <el-table-column label="最后登录" width="180">
          <template slot-scope="scope">
            <div class="login-info">
              <i class="el-icon-time"></i>
              <span>{{ formatDate(scope.row.lastLogin) }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="'active'"
              :inactive-value="'disabled'"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :disabled="scope.row.role === 'super'"
              @change="(val) => handleStatusChange(scope.row, val)"
            />
          </template>
        </el-table-column>

        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <div class="table-actions">
              <el-button
                class="table-button"
                type="text"
                size="small"
                @click="handleEdit(scope.row)"
              >
                <i class="el-icon-edit"></i>
                编辑
              </el-button>
              <el-button
                v-if="scope.row.role !== 'super'"
                class="table-button danger"
                type="text"
                size="small"
                @click="handleDelete(scope.row)"
              >
                <i class="el-icon-delete"></i>
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalAdmins"
        >
        </el-pagination>
      </div>
    </el-card>

    <!-- 新增/编辑管理员对话框 -->
    <el-dialog
      :title="dialogType === 'add' ? '新增管理员' : '编辑管理员'"
      :visible.sync="dialogVisible"
      width="500px"
      @close="resetForm"
    >
      <el-form
        ref="adminForm"
        :model="adminForm"
        :rules="adminRules"
        label-width="100px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="adminForm.name" placeholder="请输入管理员姓名" />
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input v-model="adminForm.account" placeholder="请输入登录账号" :disabled="dialogType === 'edit'" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="dialogType === 'add'">
          <el-input v-model="adminForm.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword" v-if="dialogType === 'add'">
          <el-input v-model="adminForm.confirmPassword" type="password" placeholder="请确认密码" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="adminForm.role" placeholder="请选择角色">
            <el-option label="超级管理员" value="super" />
            <el-option label="普通管理员" value="normal" />
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="adminForm.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="adminForm.email" placeholder="请输入邮箱地址" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitting">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.admins-container {
  animation: fade-in 0.3s ease-in-out;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 数据卡片样式 */
.dashboard-cards {
  margin-bottom: 20px;
}

.data-card {
  transition: all 0.3s;
  border-radius: 12px;
  border: none;
  overflow: hidden;
}

.data-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.data-card-content {
  display: flex;
  align-items: center;
  padding: 20px;
}

.icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.data-card:hover .icon-wrapper {
  transform: scale(1.1) rotate(5deg);
}

.icon-wrapper i {
  font-size: 24px;
  color: #fff;
}

.data-info {
  flex: 1;
}

.data-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.data-value {
  font-size: 28px;
  font-weight: bold;
  background: linear-gradient(45deg, #303133, #606266);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 卡片主题色 */
.total-admins .icon-wrapper {
  background: linear-gradient(135deg, #409EFF, #53a8ff);
}

.active-admins .icon-wrapper {
  background: linear-gradient(135deg, #67C23A, #85ce61);
}

.disabled-admins .icon-wrapper {
  background: linear-gradient(135deg, #F56C6C, #f78989);
}

.super-admins .icon-wrapper {
  background: linear-gradient(135deg, #E6A23C, #ebb563);
}

/* 表格卡片样式 */
.admins-table-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.05);
}

.clearfix {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f2f5;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.table-header {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.table-subtitle {
  font-size: 13px;
  color: #909399;
}

/* 工具栏样式 */
.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f9fb;
  padding: 15px 20px;
  border-radius: 8px;
  margin: 20px 0;
}

.toolbar-left {
  display: flex;
  gap: 12px;
}

.search-input {
  width: 250px;
}

.filter-select {
  width: 120px;
}

/* 管理员信息样式 */
.admin-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.admin-avatar {
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.admin-info:hover .admin-avatar {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.admin-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.admin-name {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.admin-account {
  font-size: 12px;
  color: #909399;
}

/* 登录信息样式 */
.login-info {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #909399;
  font-size: 13px;
}

.login-info i {
  font-size: 14px;
}

/* 表格操作按钮样式 */
.table-actions {
  display: flex;
  align-items: center;
}

.table-button {
  padding: 4px 8px;
  transition: all 0.3s;
}

.table-button i {
  margin-right: 4px;
}

.table-button:hover {
  background-color: #f5f7fa;
  border-radius: 4px;
}

.table-button.danger:hover {
  color: #F56C6C;
  background-color: #fef0f0;
}

/* 分页样式 */
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  padding: 0 20px 20px;
}

/* Element UI 组件样式覆盖 */
.el-table {
  border-radius: 8px;
  overflow: hidden;
}

.el-table::before {
  display: none;
}

.el-table th {
  background-color: #f5f7fa !important;
}

.el-table td {
  padding: 12px 0;
}

.el-table .el-table__row {
  transition: all 0.3s ease;
}

.el-table .el-table__row:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.el-dialog {
  border-radius: 12px;
}

.el-dialog__header {
  padding: 20px;
  border-bottom: 1px solid #f0f2f5;
}

.el-dialog__body {
  padding: 30px 20px;
}

.el-dialog__footer {
  padding: 20px;
  border-top: 1px solid #f0f2f5;
}
</style>

<script>
import { getAdminList, createAdmin, updateAdmin, deleteAdmin, updateAdminStatus } from '@/api/admin'

export default {
  name: 'Admins',
  data() {
    // 密码验证规则
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码长度不能小于6位'))
      } else {
        if (this.adminForm.confirmPassword !== '') {
          this.$refs.adminForm.validateField('confirmPassword')
        }
        callback()
      }
    }
    // 确认密码验证规则
    const validateConfirmPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.adminForm.password) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }

    return {
      // 加载状态
      loading: false,
      submitting: false,

      // 分页参数
      currentPage: 1,
      pageSize: 10,

      // 筛选参数
      searchQuery: '',
      roleFilter: '',
      statusFilter: '',

      // 对话框控制
      dialogVisible: false,
      dialogType: 'add', // add 或 edit

      // 表单数据
      adminForm: {
        name: '',
        account: '',
        password: '',
        confirmPassword: '',
        role: 'normal',
        phone: '',
        email: '',
        status: 'active'
      },

      // 表单验证规则
      adminRules: {
        name: [
          { required: true, message: '请输入管理员姓名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        account: [
          { required: true, message: '请输入登录账号', trigger: 'blur' },
          { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePassword, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, validator: validateConfirmPassword, trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ],
        phone: [
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ]
      },

      // 管理员列表
      admins: []
    }
  },
  computed: {
    // 统计数据
    totalAdmins() {
      return this.admins.length
    },
    activeAdmins() {
      return this.admins.filter(admin => admin.status === 'active').length
    },
    disabledAdmins() {
      return this.admins.filter(admin => admin.status === 'disabled').length
    },
    superAdmins() {
      return this.admins.filter(admin => admin.role === 'super').length
    },
    // 过滤后的管理员列表
    filteredAdmins() {
      return this.admins.filter(admin => {
        const matchQuery = !this.searchQuery || 
          admin.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          admin.account.toLowerCase().includes(this.searchQuery.toLowerCase())
        const matchRole = !this.roleFilter || admin.role === this.roleFilter
        const matchStatus = !this.statusFilter || admin.status === this.statusFilter
        return matchQuery && matchRole && matchStatus
      })
    }
  },
  methods: {
    // 刷新列表
    async refreshAdmins() {
      this.loading = true
      try {
        const response = await getAdminList()
        if (response.data.success) {
          this.admins = response.data.data.map(admin => ({
            ...admin,
            account: admin.username,
            role: admin.role === 'super_admin' ? 'super' : 'normal'
          }))
        } else {
          throw new Error(response.data.message)
        }
      } catch (error) {
        console.error('获取管理员列表失败:', error)
        this.$message.error('获取管理员列表失败')
      }
      this.loading = false
    },

    // 分页处理
    handleSizeChange(val) {
      this.pageSize = val
      this.refreshAdmins()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.refreshAdmins()
    },

    // 新增管理员
    handleAdd() {
      this.dialogType = 'add'
      this.dialogVisible = true
      this.resetForm()
    },

    // 编辑管理员
    handleEdit(row) {
      this.dialogType = 'edit'
      this.adminForm = { ...row }
      this.dialogVisible = true
    },

    // 删除管理员
    handleDelete(row) {
      this.$confirm('确认删除该管理员吗？', '提示', {
        type: 'warning'
      }).then(async () => {
        try {
          const response = await deleteAdmin(row.id)
          if (!response.data.success) {
            throw new Error(response.data.message)
          }
          this.$message.success('删除成功')
          this.refreshAdmins()
        } catch (error) {
          console.error('删除管理员失败:', error)
          this.$message.error(error.message || '删除管理员失败')
        }
      }).catch(() => {})
    },

    // 更改管理员状态
    async handleStatusChange(row, status) {
      try {
        const response = await updateAdminStatus(row.id, status)
        if (!response.data.success) {
          throw new Error(response.data.message)
        }
        this.$message.success('状态更新成功')
      } catch (error) {
        console.error('更新状态失败:', error)
        this.$message.error(error.message || '更新状态失败')
        row.status = status === 'active' ? 'disabled' : 'active' // 恢复状态
      }
    },

    // 提交表单
    submitForm() {
      this.$refs.adminForm.validate(async (valid) => {
        if (valid) {
          this.submitting = true
          try {
            const adminData = {
              username: this.adminForm.account,
              name: this.adminForm.name,
              role: this.adminForm.role === 'super' ? 'super_admin' : 'normal_admin',
              phone: this.adminForm.phone,
              email: this.adminForm.email
            }

            if (this.dialogType === 'add') {
              adminData.password = this.adminForm.password
              const response = await createAdmin(adminData)
              if (!response.data.success) {
                throw new Error(response.data.message)
              }
              this.$message.success('新增成功')
            } else {
              const response = await updateAdmin(this.adminForm.id, adminData)
              if (!response.data.success) {
                throw new Error(response.data.message)
              }
              this.$message.success('更新成功')
            }
            this.dialogVisible = false
            this.refreshAdmins()
          } catch (error) {
            console.error('保存管理员失败:', error)
            this.$message.error(error.message || '保存失败')
          } finally {
            this.submitting = false
          }
        }
      })
    },

    // 重置表单
    resetForm() {
      this.$refs.adminForm?.resetFields()
      this.adminForm = {
        name: '',
        account: '',
        password: '',
        confirmPassword: '',
        role: 'normal',
        phone: '',
        email: '',
        status: 'active'
      }
    },

    // 格式化日期
    formatDate(date) {
      return new Date(date).toLocaleString()
    }
  },
  created() {
    this.refreshAdmins()
  }
}
</script> 