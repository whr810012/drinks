<template>
  <div id="app">
    <!-- 根据路由显示不同的布局 -->
    <template v-if="isAuthRoute">
      <router-view></router-view>
    </template>
    <template v-else>
      <el-container>
        <el-aside width="220px">
          <!-- 侧边栏顶部 Logo -->
          <div class="sidebar-logo">
            <h1>饮料贩卖机</h1>
          </div>
          <el-menu
            :router="true"
            :default-active="$route.path"
            background-color="#304156"
            text-color="#bfcbd9"
            active-text-color="#409EFF"
            unique-opened>
            <el-menu-item index="/users">
              <i class="el-icon-user"></i>
              <span slot="title">用户管理</span>
            </el-menu-item>
            <el-menu-item index="/products">
              <i class="el-icon-goods"></i>
              <span slot="title">商品管理</span>
            </el-menu-item>
            <el-menu-item index="/orders">
              <i class="el-icon-s-order"></i>
              <span slot="title">订单管理</span>
            </el-menu-item>
            <el-menu-item index="/promotions">
              <i class="el-icon-present"></i>
              <span slot="title">促销活动</span>
            </el-menu-item>
            <el-menu-item index="/analytics">
              <i class="el-icon-data-line"></i>
              <span slot="title">数据分析</span>
            </el-menu-item>
            <el-menu-item index="/admins">
              <i class="el-icon-user"></i>
              <span slot="title">管理员管理</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-container class="main-container">
          <el-header height="60px">
            <div class="header-content">
              <div class="header-left">
                <h2>后台管理系统</h2>
              </div>
              <div class="user-info">
                <el-dropdown trigger="click">
                  <span class="user-dropdown-link">
                    <i class="el-icon-user-solid"></i>
                    {{ currentUser.username }}
                    <i class="el-icon-caret-bottom"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <span @click="handleLogout">
                        <i class="el-icon-switch-button"></i>
                        退出登录
                      </span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
          </el-header>
          <el-main>
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapGetters(['currentUser']),
    isAuthRoute() {
      return ['/login', '/register'].includes(this.$route.path)
    }
  },
  methods: {
    ...mapActions(['logout']),
    async handleLogout() {
      await this.logout()
      this.$router.push('/login')
      this.$message.success('已退出登录')
    }
  }
}
</script>

<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
}

.el-container {
  height: 100%;
}

/* 侧边栏样式 */
.el-aside {
  background-color: #304156;
  transition: width 0.3s;
  overflow: hidden;
}

.sidebar-logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  background-color: #2b3649;
}

.sidebar-logo h1 {
  color: #fff;
  font-size: 18px;
  margin: 0;
  font-weight: 600;
}

.el-menu {
  border-right: none;
}

.el-menu-item {
  height: 50px;
  line-height: 50px;
}

.el-menu-item i {
  margin-right: 10px;
  font-size: 18px;
  color: #bfcbd9;
}

.el-menu-item.is-active {
  background-color: #263445 !important;
}

.el-menu-item.is-active i {
  color: #409EFF;
}

/* 主容器样式 */
.main-container {
  background-color: #f0f2f5;
}

/* 顶部导航样式 */
.el-header {
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  padding: 0 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.header-left h2 {
  margin: 0;
  font-size: 18px;
  color: #303133;
  font-weight: 500;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-dropdown-link {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #606266;
  font-size: 14px;
}

.user-dropdown-link i {
  margin: 0 5px;
}

.el-dropdown-menu__item i {
  margin-right: 8px;
}

/* 主内容区域样式 */
.el-main {
  padding: 20px;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 3px;
}

::-webkit-scrollbar-track {
  background: #f0f2f5;
}
</style> 