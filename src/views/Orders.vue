<template>
  <div class="orders-container">
    <!-- 数据统计卡片 -->
    <el-row :gutter="20" class="dashboard-cards">
      <el-col :span="6">
        <el-card class="data-card total-orders" shadow="hover">
          <div class="data-card-content">
            <div class="icon-wrapper">
              <i class="el-icon-s-order"></i>
            </div>
            <div class="data-info">
              <div class="data-title">总订单数</div>
              <div class="data-value">{{ totalOrders }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="data-card pending-orders" shadow="hover">
          <div class="data-card-content">
            <div class="icon-wrapper">
              <i class="el-icon-time"></i>
            </div>
            <div class="data-info">
              <div class="data-title">待处理订单</div>
              <div class="data-value">{{ pendingOrders }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="data-card completed-orders" shadow="hover">
          <div class="data-card-content">
            <div class="icon-wrapper">
              <i class="el-icon-circle-check"></i>
            </div>
            <div class="data-info">
              <div class="data-title">已完成订单</div>
              <div class="data-value">{{ completedOrders }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="data-card today-income" shadow="hover">
          <div class="data-card-content">
            <div class="icon-wrapper">
              <i class="el-icon-money"></i>
            </div>
            <div class="data-info">
              <div class="data-title">今日收入</div>
              <div class="data-value">¥{{ todayIncome }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 订单列表卡片 -->
    <el-card class="orders-table-card">
      <div slot="header" class="clearfix">
        <div class="header-left">
          <span class="table-header">订单列表</span>
          <span class="table-subtitle">共 {{ totalOrders }} 个订单</span>
        </div>
      </div>

      <!-- 工具栏 -->
      <div class="table-toolbar">
        <div class="toolbar-left">
          <el-input
            v-model="searchQuery"
            placeholder="搜索订单号/用户名"
            prefix-icon="el-icon-search"
            class="search-input"
            clearable
          />
          <el-select v-model="statusFilter" placeholder="订单状态" class="filter-select">
            <el-option label="全部" value="" />
            <el-option label="待支付" value="pending" />
            <el-option label="已支付" value="paid" />
            <el-option label="已完成" value="completed" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="date-picker"
          />
        </div>
        <el-button type="primary" icon="el-icon-refresh" @click="refreshOrders">刷新</el-button>
      </div>

      <!-- 订单表格 -->
      <el-table
        :data="filteredOrders"
        style="width: 100%"
        :row-class-name="tableRowClassName"
        v-loading="loading"
      >
        <el-table-column prop="orderId" label="订单号" min-width="180">
          <template slot-scope="scope">
            <div class="order-id-cell">
              <span class="order-id">{{ scope.row.orderId }}</span>
              <el-tag
                size="mini"
                :type="getOrderTypeTag(scope.row.type)"
                effect="plain"
                class="order-type-tag"
              >
                {{ scope.row.type }}
              </el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="商品信息" min-width="280">
          <template slot-scope="scope">
            <div class="order-products">
              <div v-for="(product, index) in scope.row.products" :key="index" class="product-item">
                <el-image
                  :src="product.image"
                  :alt="product.name"
                  class="product-image"
                  fit="cover"
                >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                <div class="product-info">
                  <span class="product-name">{{ product.name }}</span>
                  <span class="product-quantity">x{{ product.quantity }}</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="totalAmount" label="订单金额" width="150">
          <template slot-scope="scope">
            <span class="order-amount">¥{{ scope.row.totalAmount }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="订单状态" width="120">
          <template slot-scope="scope">
            <div class="order-status">
              <el-tag
                :type="getStatusType(scope.row.status)"
                effect="dark"
                class="status-tag"
              >
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="下单时间" width="180">
          <template slot-scope="scope">
            <div class="order-time">
              <i class="el-icon-time"></i>
              <span>{{ formatDate(scope.row.createTime) }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <div class="table-actions">
              <el-button
                class="table-button"
                type="text"
                size="small"
                @click="viewOrderDetails(scope.row)"
              >
                <i class="el-icon-view"></i>
                查看
              </el-button>
              <el-button
                v-if="scope.row.status === 'pending'"
                class="table-button success"
                type="text"
                size="small"
                @click="processOrder(scope.row)"
              >
                <i class="el-icon-check"></i>
                处理
              </el-button>
              <el-button
                v-if="scope.row.status === 'pending'"
                class="table-button danger"
                type="text"
                size="small"
                @click="cancelOrder(scope.row)"
              >
                <i class="el-icon-close"></i>
                取消
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
          :total="totalOrders"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.orders-container {
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
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
  background: linear-gradient(45deg, #303133, #606266);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 卡片主题色 */
.total-orders .icon-wrapper {
  background: linear-gradient(135deg, #409EFF, #53a8ff);
}

.pending-orders .icon-wrapper {
  background: linear-gradient(135deg, #E6A23C, #ebb563);
}

.completed-orders .icon-wrapper {
  background: linear-gradient(135deg, #67C23A, #85ce61);
}

.today-income .icon-wrapper {
  background: linear-gradient(135deg, #F56C6C, #f78989);
}

/* 订单信息样式 */
.order-id-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.order-id {
  font-family: monospace;
  font-weight: 600;
  color: #303133;
}

.order-type-tag {
  font-size: 12px;
  padding: 0 8px;
  height: 20px;
  line-height: 18px;
  border-radius: 10px;
}

.order-products {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 0;
}

.product-image {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.product-item:hover .product-image {
  transform: scale(1.1) rotate(3deg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-name {
  font-size: 13px;
  color: #303133;
}

.product-quantity {
  font-size: 12px;
  color: #909399;
}

.order-amount {
  font-size: 15px;
  font-weight: 600;
  color: #F56C6C;
  background: linear-gradient(45deg, #F56C6C, #ff8e8e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.order-status {
  display: flex;
  align-items: center;
}

.status-tag {
  border: none;
  padding: 2px 0;
  width: 64px;
  text-align: center;
  font-weight: 500;
  font-size: 12px;
  border-radius: 12px;
  position: relative;
  background: transparent;
  transition: all 0.3s ease;
}

.status-tag::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 12px;
  padding: 1px;
  background: linear-gradient(45deg, var(--start-color), var(--end-color));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}

.order-time {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #909399;
  font-size: 13px;
}

.order-time i {
  font-size: 14px;
}

/* 工具栏样式 */
.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f9fb;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.toolbar-left {
  display: flex;
  gap: 12px;
}

.search-input {
  width: 300px;
}

.filter-select {
  width: 150px;
}

.date-picker {
  width: 350px;
}

/* 表格样式继承自 Products.vue */
.orders-table-card {
  border-radius: 8px;
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.05) !important;
}

.table-actions {
  display: flex;
  align-items: center;
}

/* 表格行状态样式 */
.order-row-pending {
  background-color: #fdf6ec !important;
}

.order-row-completed {
  background-color: #f0f9eb !important;
}

.order-row-cancelled {
  background-color: #fef0f0 !important;
}

/* 动画效果 */
.el-table-column--animate {
  transition: all 0.3s ease-in-out;
}

.el-button {
  transition: all 0.3s ease-in-out;
}

.el-tag {
  transition: all 0.3s ease-in-out;
}
</style>

<script>
import { getOrders, getOrderStats, updateOrderStatus, processOrder, cancelOrder } from '@/api/order'

export default {
  name: 'Orders',
  data() {
    return {
      loading: false,
      searchQuery: '',
      statusFilter: '',
      dateRange: [],
      currentPage: 1,
      pageSize: 10,
      totalOrders: 0,
      pendingOrders: 0,
      completedOrders: 0,
      todayIncome: 0,
      orders: []
    }
  },
  computed: {
    filteredOrders() {
      return this.orders.filter(order => {
        const matchQuery = !this.searchQuery || 
          order.orderId.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          order.username.toLowerCase().includes(this.searchQuery.toLowerCase())
        const matchStatus = !this.statusFilter || order.status === this.statusFilter
        
        // 日期范围筛选
        let matchDate = true
        if (this.dateRange && this.dateRange.length === 2) {
          const orderDate = new Date(order.createTime)
          const startDate = new Date(this.dateRange[0])
          const endDate = new Date(this.dateRange[1])
          matchDate = orderDate >= startDate && orderDate <= endDate
        }
        
        return matchQuery && matchStatus && matchDate
      })
    }
  },
  methods: {
    tableRowClassName({ row }) {
      return `order-row-${row.status}`
    },
    getOrderTypeTag(type) {
      const types = {
        'normal': 'info',
        'vip': 'warning',
        'group': 'success'
      }
      return types[type] || 'info'
    },
    getStatusType(status) {
      const types = {
        'pending': 'warning',
        'paid': 'primary',
        'completed': 'success',
        'cancelled': 'info'
      }
      return types[status] || 'info'
    },
    getStatusText(status) {
      const texts = {
        'pending': '待支付',
        'paid': '已支付',
        'completed': '已完成',
        'cancelled': '已取消'
      }
      return texts[status] || status
    },
    formatDate(date) {
      return new Date(date).toLocaleString()
    },
    async refreshOrders() {
      this.loading = true
      try {
        // 获取订单统计数据
        const statsRes = await getOrderStats()
        if (statsRes.success) {
          const { totalOrders, pendingOrders, completedOrders, todayIncome } = statsRes.data
          this.totalOrders = totalOrders
          this.pendingOrders = pendingOrders
          this.completedOrders = completedOrders
          this.todayIncome = todayIncome
        }

        // 获取订单列表
        const params = {
          page: this.currentPage,
          pageSize: this.pageSize,
          status: this.statusFilter,
          search: this.searchQuery,
          startDate: this.dateRange?.[0],
          endDate: this.dateRange?.[1]
        }
        const ordersRes = await getOrders(params)
        if (ordersRes.success) {
          this.orders = ordersRes.data
        }
      } catch (error) {
        console.error('获取订单数据失败:', error)
        this.$message.error('获取订单数据失败')
      }
      this.loading = false
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.refreshOrders()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.refreshOrders()
    },
    viewOrderDetails(order) {
      // 实现查看订单详情的逻辑
      this.$router.push(`/orders/${order.id}`)
    },
    async processOrder(order) {
      try {
        const res = await processOrder(order.id)
        if (res.success) {
          this.$message.success('订单处理成功')
          this.refreshOrders()
        }
      } catch (error) {
        console.error('处理订单失败:', error)
        this.$message.error('处理订单失败')
      }
    },
    async cancelOrder(order) {
      try {
        const res = await cancelOrder(order.id)
        if (res.success) {
          this.$message.success('订单已取消')
          this.refreshOrders()
        }
      } catch (error) {
        console.error('取消订单失败:', error)
        this.$message.error('取消订单失败')
      }
    }
  },
  created() {
    this.refreshOrders()
  }
}
</script> 