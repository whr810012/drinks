<template>
  <div class="register-container">
    <el-card class="register-card">
      <h2>注册</h2>
      <el-form :model="registerForm" :rules="rules" ref="registerForm">
        <el-form-item prop="username">
          <el-input
            v-model="registerForm.username"
            placeholder="用户名"
            prefix-icon="el-icon-user"
            :disabled="loading"
          ></el-input>
        </el-form-item>
        <el-form-item prop="name">
          <el-input
            v-model="registerForm.name"
            placeholder="姓名"
            prefix-icon="el-icon-user"
            :disabled="loading"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="密码"
            prefix-icon="el-icon-lock"
            show-password
            :disabled="loading"
          ></el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="确认密码"
            prefix-icon="el-icon-lock"
            show-password
            :disabled="loading"
            @keyup.enter.native="handleRegister"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            @click="handleRegister" 
            style="width: 100%"
            :loading="loading"
          >
            {{ loading ? '注册中...' : '注册' }}
          </el-button>
        </el-form-item>
        <div class="login-link">
          已有账号？<router-link to="/login">立即登录</router-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Register',
  data() {
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      registerForm: {
        username: '',
        password: '',
        confirmPassword: '',
        name: ''
      },
      loading: false,
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能小于 6 个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters('user', ['error'])
  },
  methods: {
    ...mapActions('user', ['register']),
    async handleRegister() {
      try {
        const valid = await this.$refs.registerForm.validate()
        if (valid) {
          this.loading = true
          const { username, password, name } = this.registerForm
          const success = await this.register({ username, password, name })
          if (success) {
            this.$message.success('注册成功')
            this.$router.push('/login')
          }
        }
      } catch (error) {
        console.error('注册错误:', error)
      } finally {
        this.loading = false
        if (!this.loading && this.error) {
          this.$message.error(this.error)
        }
      }
    }
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;
}

.register-card {
  width: 400px;
}

.register-card h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #303133;
}

.login-link {
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
}

.login-link a {
  color: #409EFF;
  text-decoration: none;
}
</style> 