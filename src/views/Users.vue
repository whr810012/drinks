<template>
  <div class="users-container">
    <!-- 顶部统计卡片 -->
    <el-row :gutter="20" class="dashboard-cards">
      <el-col :span="6">
        <el-card class="data-card total-users" shadow="hover">
          <div class="data-card-content">
            <div class="icon-wrapper">
              <i class="el-icon-user"></i>
            </div>
            <div class="data-info">
              <div class="data-title">总用户数</div>
              <div class="data-value">{{ totalUsers }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="data-card active-users" shadow="hover">
          <div class="data-card-content">
            <div class="icon-wrapper">
              <i class="el-icon-user-solid"></i>
            </div>
            <div class="data-info">
              <div class="data-title">活跃用户</div>
              <div class="data-value">{{ activeUsers }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="data-card new-users" shadow="hover">
          <div class="data-card-content">
            <div class="icon-wrapper">
              <i class="el-icon-plus"></i>
            </div>
            <div class="data-info">
              <div class="data-title">本月新增</div>
              <div class="data-value">{{ newUsers }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="data-card vip-users" shadow="hover">
          <div class="data-card-content">
            <div class="icon-wrapper">
              <i class="el-icon-star-on"></i>
            </div>
            <div class="data-info">
              <div class="data-title">VIP用户</div>
              <div class="data-value">{{ vipUsers }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 用户列表 -->
    <el-card class="users-table-card" shadow="never">
      <div slot="header" class="clearfix">
        <div class="header-left">
          <span class="table-header">用户列表</span>
          <span class="table-subtitle">管理系统的所有用户信息</span>
        </div>
        <div class="header-right">
          <el-button type="primary" size="small" @click="handleAdd" icon="el-icon-plus">
            添加用户
          </el-button>
        </div>
      </div>

      <!-- 搜索和筛选 -->
      <div class="table-toolbar">
        <el-input
          v-model="searchQuery"
          placeholder="搜索用户名/邮箱"
          prefix-icon="el-icon-search"
          clearable
          class="search-input"
        ></el-input>
        <div class="filter-group">
          <el-select v-model="statusFilter" placeholder="状态" clearable>
            <el-option label="活跃" value="active"></el-option>
            <el-option label="禁用" value="inactive"></el-option>
          </el-select>
        </div>
      </div>

      <el-table
        :data="filteredUsers"
        style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa' }"
        v-loading="loading">
        <el-table-column prop="username" label="用户名">
          <template slot-scope="scope">
            <div class="user-info-cell">
              <el-avatar :size="32" :src="scope.row.avatar || defaultAvatar">
                {{ scope.row.username.charAt(0).toUpperCase() }}
              </el-avatar>
              <span class="username">{{ scope.row.username }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="phone" label="手机号"></el-table-column>
        <el-table-column prop="balance" label="余额">
          <template slot-scope="scope">
            ¥{{ scope.row.balance || '0.00' }}
          </template>
        </el-table-column>
        <el-table-column prop="points" label="积分">
          <template slot-scope="scope">
            {{ scope.row.points || 0 }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.status === 'active' ? 'success' : 'info'"
              size="small"
              effect="dark"
            >
              {{ scope.row.status === 'active' ? '活跃' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="handleEdit(scope.row)"
              class="table-button"
            >
              <i class="el-icon-edit"></i> 编辑
            </el-button>
            <el-button
              type="text"
              size="small"
              :class="['table-button', scope.row.status === 'active' ? 'danger' : 'success']"
              @click="handleToggleStatus(scope.row)"
            >
              <i :class="scope.row.status === 'active' ? 'el-icon-lock' : 'el-icon-unlock'"></i>
              {{ scope.row.status === 'active' ? '禁用' : '启用' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalUsers">
        </el-pagination>
      </div>
    </el-card>

    <!-- 添加/编辑用户对话框 -->
    <el-dialog
      :title="dialogType === 'add' ? '添加用户' : '编辑用户'"
      :visible.sync="dialogVisible"
      width="500px"
      @close="resetForm">
      <el-form
        :model="userForm"
        :rules="userFormRules"
        ref="userForm"
        label-width="80px"
        class="user-form">
        <el-form-item label="用户名" prop="username" v-if="dialogType === 'add'">
          <el-input v-model="userForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="dialogType === 'add'">
          <el-input
            v-model="userForm.password"
            type="password"
            placeholder="请输入密码"
            show-password>
          </el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitLoading">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getUsers, addUser, updateUser, updateUserStatus } from '@/api/user'
import { Message } from 'element-ui'

export default {
  name: 'Users',
  data() {
    return {
      loading: false,
      searchQuery: '',
      statusFilter: '',
      currentPage: 1,
      pageSize: 10,
      defaultAvatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      activeUsers: 0,
      newUsers: 0,
      vipUsers: 0,
      dialogVisible: false,
      dialogType: 'add', // 'add' 或 'edit'
      submitLoading: false,
      userForm: {
        username: '',
        password: '',
        email: '',
        phone: ''
      },
      userFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        phone: [
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    users() {
      return this.$store.state.user.users || []
    },
    filteredUsers() {
      const users = this.users.filter(user => {
        const matchQuery = !this.searchQuery || 
          user.username.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          (user.email && user.email.toLowerCase().includes(this.searchQuery.toLowerCase()))
        const matchStatus = !this.statusFilter || user.status === this.statusFilter
        return matchQuery && matchStatus
      })
      
      // 分页处理
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return users.slice(start, end)
    },
    totalUsers() {
      return this.users.filter(user => {
        const matchQuery = !this.searchQuery || 
          user.username.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          (user.email && user.email.toLowerCase().includes(this.searchQuery.toLowerCase()))
        const matchStatus = !this.statusFilter || user.status === this.statusFilter
        return matchQuery && matchStatus
      }).length
    }
  },
  methods: {
    async fetchUsers() {
      try {
        this.loading = true
        const response = await getUsers()
        if (response.data.success) {
          this.$store.commit('user/SET_USERS', response.data.data)
          this.calculateStatistics()
        }
      } catch (error) {
        console.error('获取用户列表失败:', error)
        Message.error('获取用户列表失败')
      } finally {
        this.loading = false
      }
    },
    calculateStatistics() {
      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      
      this.activeUsers = this.users.filter(user => user.status === 'active').length
      this.newUsers = this.users.filter(user => new Date(user.created_at) >= monthStart).length
      this.vipUsers = this.users.filter(user => user.points >= 1000).length
    },
    handleAdd() {
      this.dialogType = 'add'
      this.dialogVisible = true
    },
    handleEdit(row) {
      this.dialogType = 'edit'
      this.userForm = {
        id: row.id,
        email: row.email,
        phone: row.phone
      }
      this.dialogVisible = true
    },
    async handleToggleStatus(row) {
      try {
        const newStatus = row.status === 'active' ? 'inactive' : 'active'
        const response = await updateUserStatus(row.id, newStatus)
        
        if (response.data.success) {
          Message.success(response.data.message)
          await this.fetchUsers()
        }
      } catch (error) {
        console.error('更新用户状态失败:', error)
        Message.error(error.response?.data?.message || '更新用户状态失败')
      }
    },
    async submitForm() {
      this.$refs.userForm.validate(async valid => {
        if (valid) {
          try {
            this.submitLoading = true
            const isAdd = this.dialogType === 'add'
            const response = isAdd 
              ? await addUser(this.userForm)
              : await updateUser(this.userForm.id, {
                  email: this.userForm.email,
                  phone: this.userForm.phone
                })
            
            if (response.data.success) {
              Message.success(response.data.message)
              this.dialogVisible = false
              await this.fetchUsers()
            }
          } catch (error) {
            console.error('提交用户信息失败:', error)
            Message.error(error.response?.data?.message || '提交失败')
          } finally {
            this.submitLoading = false
          }
        }
      })
    },
    resetForm() {
      this.$refs.userForm?.resetFields()
      this.userForm = {
        username: '',
        password: '',
        email: '',
        phone: ''
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
    },
    handleCurrentChange(val) {
      this.currentPage = val
    }
  },
  async created() {
    await this.fetchUsers()
  }
}
</script>

<style scoped>
.users-container {
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
  border-radius: 8px;
  border: none;
}

.data-card:hover {
  transform: translateY(-5px);
}

.data-card-content {
  display: flex;
  align-items: center;
  padding: 15px;
}

.icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
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
  margin-bottom: 5px;
}

.data-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  background: linear-gradient(45deg, #303133, #606266);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 卡片主题色 */
.total-users .icon-wrapper {
  background-color: #409EFF;
}

.active-users .icon-wrapper {
  background-color: #67C23A;
}

.new-users .icon-wrapper {
  background-color: #E6A23C;
}

.vip-users .icon-wrapper {
  background-color: #F56C6C;
}

/* 表格卡片样式 */
.users-table-card {
  border-radius: 8px;
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.05) !important;
}

.table-header {
  font-size: 16px;
  font-weight: 500;
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  background-color: #f8f9fb;
  padding: 15px 20px;
  border-radius: 8px;
}

.search-input {
  width: 300px;
}

.filter-group {
  display: flex;
  gap: 10px;
}

/* 表格内容样式 */
.user-info-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.username {
  color: #303133;
  font-weight: 500;
}

.table-button {
  position: relative;
  padding: 6px 12px;
  margin: 0 4px;
  border-radius: 4px;
  transition: all 0.3s;
}

.table-button:hover {
  background-color: #f5f7fa;
  transform: translateY(-1px);
}

.table-button.danger:hover {
  background-color: #fef0f0;
}

.table-button.success:hover {
  background-color: #f0f9eb;
}

.table-button i {
  margin-right: 4px;
}

/* 分页容器 */
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* 更新 clearfix 和相关样式 */
.clearfix {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.header-right {
  display: flex;
  align-items: center;
  margin-left: auto;
  padding-left: 20px;
}

.el-card__header {
  padding: 16px 20px;
  border-bottom: 1px solid #ebeef5;
}

.table-header {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  position: relative;
}

.table-subtitle {
  font-size: 13px;
  color: #909399;
  font-weight: normal;
}

/* 动画效果 */
.el-table-column--animate {
  transition: all 0.3s ease-in-out;
}

.el-button {
  transition: all 0.3s ease-in-out;
}

.el-button:hover {
  transform: translateY(-2px);
}

.el-tag {
  transition: all 0.3s ease-in-out;
  border-radius: 12px;
  padding: 0 12px;
  height: 24px;
  line-height: 24px;
  font-weight: 500;
}

/* 按钮样式优化 */
.el-button--primary {
  background: linear-gradient(45deg, #409EFF, #53a8ff);
  border: none;
  padding: 10px 20px;
  height: auto;
  box-shadow: 0 2px 12px 0 rgba(64, 158, 255, 0.2);
}

.el-button--primary:hover {
  background: linear-gradient(45deg, #53a8ff, #66b1ff);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px 0 rgba(64, 158, 255, 0.3);
}

.el-button--primary:active {
  transform: translateY(0);
}

/* 搜索框样式优化 */
.search-input .el-input__inner {
  border-radius: 20px;
  padding-left: 40px;
  height: 36px;
  transition: all 0.3s;
  border: 1px solid #dcdfe6;
}

.search-input .el-input__inner:focus {
  border-color: #409EFF;
  box-shadow: 0 0 8px rgba(64, 158, 255, 0.2);
}

.search-input .el-input__prefix {
  left: 12px;
}

/* 下拉选择框样式优化 */
.el-select .el-input__inner {
  border-radius: 18px;
  height: 36px;
}

/* 头像样式优化 */
.el-avatar {
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.user-info-cell:hover .el-avatar {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 分页样式优化 */
.el-pagination.is-background .el-pager li:not(.disabled).active {
  background: linear-gradient(45deg, #409EFF, #53a8ff);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

.el-pagination.is-background .el-pager li {
  border-radius: 4px;
  margin: 0 3px;
  transition: all 0.3s;
}

/* 表格样式优化 */
.el-table {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.el-table th {
  background-color: #f5f7fa !important;
  font-weight: 600;
  color: #303133;
  padding: 12px 0;
}

.el-table td {
  padding: 12px 0;
}

/* 加载动画优化 */
.el-loading-spinner .path {
  stroke: #409EFF;
  stroke-width: 2;
}

/* 滚动条样式优化 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #909399;
}

::-webkit-scrollbar-track {
  background: #f5f7fa;
  border-radius: 4px;
}
</style> 