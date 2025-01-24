<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2>登录</h2>
      <el-form :model="loginForm" :rules="rules" ref="loginForm">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="用户名"
            prefix-icon="el-icon-user"
            :disabled="loading"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            prefix-icon="el-icon-lock"
            show-password
            :disabled="loading"
            @keyup.enter.native="handleLogin"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            @click="handleLogin" 
            style="width: 100%"
            :loading="loading"
          >
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
        <div class="register-link">
          还没有账号？<router-link to="/register">立即注册</router-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loading: false,
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters('user', ['error'])
  },
  methods: {
    ...mapActions('user', ['login', 'setUserInfo']),
    async handleLogin() {
      if (this.loading) return // 防止重复提交
      
      try {
        console.log('开始登录流程')
        const valid = await this.$refs.loginForm.validate()
        console.log('表单验证结果:', valid)
        if (valid) {
          this.loading = true
          console.log('准备调用登录接口，参数:', this.loginForm)
          const loginResult = await this.login(this.loginForm)
          console.log('登录接口原始返回:', loginResult)
          
          // 如果返回true说明登录成功，但数据在store中
          if (loginResult === true) {
            this.$message.success('登录成功')
            this.$router.replace('/users')
            return
          }
          
          // 处理返回完整响应对象的情况
          if (loginResult && loginResult.success) {
            const userInfo = loginResult.data
            console.log('用户信息:', userInfo)
            
            // 存储用户信息和token
            await this.setUserInfo(userInfo)
            
            this.$message.success(loginResult.message)
            this.$router.replace('/users')
          } else {
            throw new Error(loginResult?.message || '登录失败')
          }
        }
      } catch (error) {
        console.error('登录过程出错:', error)
        this.$message.error(error.message || '登录失败，请稍后重试')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;
}

.login-card {
  width: 400px;
}

.login-card h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #303133;
}

.register-link {
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
}

.register-link a {
  color: #409EFF;
  text-decoration: none;
}
</style> 