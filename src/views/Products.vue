<template>
  <div class="products-container">
    <!-- 顶部统计卡片 -->
    <el-row :gutter="20" class="dashboard-cards">
      <el-col :span="8">
        <el-card class="data-card total-products" shadow="hover">
          <div class="data-card-content">
            <div class="icon-wrapper">
              <i class="el-icon-goods"></i>
            </div>
            <div class="data-info">
              <div class="data-title">商品总数</div>
              <div class="data-value">{{ products.length }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="data-card on-sale" shadow="hover">
          <div class="data-card-content">
            <div class="icon-wrapper">
              <i class="el-icon-shopping-cart-full"></i>
            </div>
            <div class="data-info">
              <div class="data-title">在售商品</div>
              <div class="data-value">{{ onSaleCount }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="data-card low-stock" shadow="hover">
          <div class="data-card-content">
            <div class="icon-wrapper">
              <i class="el-icon-warning-outline"></i>
            </div>
            <div class="data-info">
              <div class="data-title">库存预警</div>
              <div class="data-value">{{ lowStockCount }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 商品列表 -->
    <el-card class="products-table-card" shadow="never">
      <div slot="header" class="clearfix">
        <div class="header-left">
          <span class="table-header">商品列表</span>
          <span class="table-subtitle">管理所有饮料商品信息</span>
        </div>
        <div class="header-right">
          <el-button type="primary" size="small" @click="handleAdd" icon="el-icon-plus">
            添加商品
          </el-button>
        </div>
      </div>

      <!-- 搜索和筛选 -->
      <div class="table-toolbar">
        <div class="toolbar-left">
          <el-input
            v-model="searchQuery"
            placeholder="搜索商品名称/编号"
            prefix-icon="el-icon-search"
            clearable
            class="search-input"
          ></el-input>
          <el-select v-model="categoryFilter" placeholder="商品分类" clearable class="filter-select">
            <el-option label="碳酸饮料" value="碳酸饮料"></el-option>
            <el-option label="果汁饮料" value="果汁饮料"></el-option>
            <el-option label="茶饮料" value="茶饮料"></el-option>
            <el-option label="矿泉水" value="矿泉水"></el-option>
            <el-option label="功能饮料" value="功能饮料"></el-option>
            <el-option label="咖啡饮料" value="咖啡饮料"></el-option>
          </el-select>
        </div>
        <div class="toolbar-right">
          <el-radio-group v-model="statusFilter" size="small">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="active">在售</el-radio-button>
            <el-radio-button label="inactive">下架</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <el-table
        :data="filteredProducts"
        style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa' }"
        v-loading="loading">
        <el-table-column prop="name" label="商品名称" min-width="200">
          <template slot-scope="scope">
            <div class="product-info-cell">
              <el-image 
                :src="scope.row.image_url || defaultImage" 
                fit="cover"
                class="product-image">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
              <div class="product-details">
                <span class="product-name">{{ scope.row.name }}</span>
                <div class="product-meta">
                  <el-tag size="mini" type="info" effect="plain" class="product-category">
                    {{ scope.row.category }}
                  </el-tag>
                  <span class="product-id">ID: {{ scope.row.id }}</span>
                </div>
                <span class="product-description">{{ scope.row.description }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" width="180">
          <template slot-scope="scope">
            <div class="price-column">
              <span class="price">¥{{ scope.row.price.toFixed(2) }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="120">
          <template slot-scope="scope">
            <span class="stock-text" :class="getStockStatus(scope.row.stock)">
              {{ scope.row.stock }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.status === 'active' ? 'success' : 'info'"
              size="small"
              effect="dark"
            >
              {{ scope.row.status === 'active' ? '在售' : '下架' }}
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
              <i :class="scope.row.status === 'active' ? 'el-icon-sold-out' : 'el-icon-shopping-cart-full'"></i>
              {{ scope.row.status === 'active' ? '下架' : '上架' }}
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
          :total="filteredProducts.length">
        </el-pagination>
      </div>
    </el-card>

    <!-- 商品编辑对话框 -->
    <el-dialog
      :title="currentProduct && currentProduct.id ? '编辑商品' : '添加商品'"
      :visible.sync="dialogVisible"
      width="50%"
      @close="currentProduct = null">
      <el-form
        v-if="currentProduct"
        :model="currentProduct"
        :rules="formRules"
        ref="productForm"
        label-width="100px"
        class="product-form">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="currentProduct.name" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        
        <el-form-item label="商品类别" prop="category">
          <el-select v-model="currentProduct.category" placeholder="请选择商品类别" style="width: 100%">
            <el-option label="碳酸饮料" value="碳酸饮料"></el-option>
            <el-option label="果汁饮料" value="果汁饮料"></el-option>
            <el-option label="茶饮料" value="茶饮料"></el-option>
            <el-option label="矿泉水" value="矿泉水"></el-option>
            <el-option label="功能饮料" value="功能饮料"></el-option>
            <el-option label="咖啡饮料" value="咖啡饮料"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="商品价格" prop="price">
          <el-input-number 
            v-model="currentProduct.price"
            :precision="2"
            :step="0.1"
            :min="0"
            style="width: 100%"
            placeholder="请输入商品价格">
          </el-input-number>
        </el-form-item>
        
        <el-form-item label="库存数量" prop="stock">
          <el-input-number
            v-model="currentProduct.stock"
            :min="0"
            :step="1"
            style="width: 100%"
            placeholder="请输入库存数量">
          </el-input-number>
        </el-form-item>
        
        <el-form-item label="商品图片" prop="image_url">
          <el-input 
            v-model="currentProduct.image_url" 
            placeholder="请输入商品图片URL">
            <template slot="append">
              <el-popover
                placement="right"
                trigger="hover"
                popper-class="image-preview-popover">
                <el-image 
                  v-if="currentProduct.image_url"
                  :src="currentProduct.image_url"
                  fit="contain"
                  class="image-preview">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                <i class="el-icon-picture-outline-round" slot="reference"></i>
              </el-popover>
            </template>
          </el-input>
        </el-form-item>
        
        <el-form-item label="商品描述">
          <el-input
            type="textarea"
            v-model="currentProduct.description"
            :rows="4"
            placeholder="请输入商品描述">
          </el-input>
        </el-form-item>
      </el-form>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveProduct">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { getProducts, addProduct, updateProduct, updateProductStatus } from '@/api/product'

export default {
  name: 'Products',
  data() {
    return {
      loading: false,
      searchQuery: '',
      categoryFilter: '',
      statusFilter: '',
      currentPage: 1,
      pageSize: 10,
      defaultImage: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
      products: [],
      dialogVisible: false,
      currentProduct: null,
      formRules: {
        name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        category: [{ required: true, message: '请选择商品类别', trigger: 'change' }],
        price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        stock: [{ required: true, message: '请输入库存数量', trigger: 'blur' }],
        image_url: [{ required: false, message: '请输入商品图片URL', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['getProducts']),
    onSaleCount() {
      return this.products.filter(p => p.status === 'active').length
    },
    lowStockCount() {
      return this.products.filter(p => p.stock <= 10).length
    },
    filteredProducts() {
      return this.products.filter(product => {
        const matchQuery = !this.searchQuery || 
          product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        const matchCategory = !this.categoryFilter || product.category === this.categoryFilter
        const matchStatus = !this.statusFilter || product.status === this.statusFilter
        return matchQuery && matchCategory && matchStatus
      })
    }
  },
  methods: {
    ...mapActions(['fetchProducts']),
    // 获取商品列表
    async fetchProducts() {
      try {
        this.loading = true
        const productsRes = await getProducts()
        
        if (productsRes.success) {
          this.products = productsRes.data
        }
      } catch (error) {
        this.$message.error('获取数据失败')
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    // 添加商品
    handleAdd() {
      this.currentProduct = {
        name: '',
        category: '',
        price: '',
        stock: '',
        description: '',
        image_url: ''
      }
      this.dialogVisible = true
    },

    // 编辑商品
    handleEdit(row) {
      this.currentProduct = { ...row }
      this.dialogVisible = true
    },

    // 保存商品（添加或更新）
    async saveProduct() {
      try {
        this.$refs.productForm.validate(async valid => {
          if (!valid) {
            return false
          }

          const isEdit = !!this.currentProduct.id
          const response = isEdit 
            ? await updateProduct(this.currentProduct.id, this.currentProduct)
            : await addProduct(this.currentProduct)

          if (response.success) {
            this.$message.success(isEdit ? '商品更新成功' : '商品添加成功')
            this.dialogVisible = false
            this.fetchProducts()
          }
        })
      } catch (error) {
        this.$message.error(error.message || '操作失败')
      }
    },

    // 切换商品状态
    async handleToggleStatus(row) {
      try {
        const newStatus = row.status === 'active' ? 'inactive' : 'active'
        const response = await updateProductStatus(row.id, newStatus)

        if (response.success) {
          this.$message.success(response.message)
          this.fetchProducts()
        }
      } catch (error) {
        this.$message.error(error.message || '操作失败')
      }
    },

    handleSizeChange(val) {
      this.pageSize = val
    },
    
    handleCurrentChange(val) {
      this.currentPage = val
    },
    
    getStockStatus(stock) {
      if (stock <= 10) return 'exception'
      if (stock <= 30) return 'warning'
      return 'success'
    },
  },
  async created() {
    await this.fetchProducts()
  }
}
</script>

<style scoped>
.products-container {
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
  background: linear-gradient(45deg, #303133, #606266);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 卡片主题色 */
.total-products .icon-wrapper {
  background: linear-gradient(135deg, #409EFF, #53a8ff);
}

.on-sale .icon-wrapper {
  background: linear-gradient(135deg, #67C23A, #85ce61);
}

.low-stock .icon-wrapper {
  background: linear-gradient(135deg, #E6A23C, #ebb563);
}

/* 商品信息样式 */
.product-info-cell {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 0;
}

.product-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  background-color: #fff;
  object-fit: cover;
}

.product-info-cell:hover .product-image {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.product-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-name {
  font-weight: 600;
  color: #303133;
  font-size: 15px;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-category {
  font-size: 12px;
  padding: 0 8px;
  height: 20px;
  line-height: 18px;
  border-radius: 10px;
  background-color: #f0f2f5;
  color: #606266;
}

.product-id {
  font-size: 12px;
  color: #909399;
}

.product-description {
  font-size: 12px;
  color: #606266;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
}

/* 价格样式 */
.price {
  color: #F56C6C;
  font-weight: 600;
  font-size: 15px;
  background: linear-gradient(45deg, #F56C6C, #ff8e8e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 库存列样式优化 */
.stock-text {
  font-size: 13px;
  font-weight: 500;
  padding: 4px 12px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s ease;
}

.stock-text.success {
  color: #67C23A;
  background: rgba(103, 194, 58, 0.1);
}

.stock-text.warning {
  color: #E6A23C;
  background: rgba(230, 162, 60, 0.1);
}

.stock-text.exception {
  color: #F56C6C;
  background: rgba(245, 108, 108, 0.1);
}

/* 状态列样式优化 */
.el-tag {
  border: none;
  padding: 2px 0;
  width: 58px;
  text-align: center;
  font-weight: 500;
  font-size: 12px;
  border-radius: 12px;
  position: relative;
  background: transparent;
  transition: all 0.3s ease;
}

.el-tag::before {
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

.el-tag--success {
  color: #67C23A;
  --start-color: #67C23A;
  --end-color: #95de64;
}

.el-tag--info {
  color: #909399;
  --start-color: #909399;
  --end-color: #c0c4cc;
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

/* 按钮和表格样式继承自 Users.vue */
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

.table-header {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.table-subtitle {
  font-size: 13px;
  color: #909399;
}

.products-table-card {
  border-radius: 8px;
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.05) !important;
}

.el-card__header {
  padding: 16px 20px;
  border-bottom: 1px solid #ebeef5;
}

/* 图片占位符样式 */
.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
}

.image-slot i {
  font-size: 20px;
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

/* 表格按钮样式 */
.table-button {
  position: relative;
  padding: 8px 16px;
  margin: 0 4px;
  border-radius: 6px;
  transition: all 0.3s;
  font-weight: 500;
}

.table-button i {
  margin-right: 6px;
  font-size: 14px;
}

.table-button:hover {
  background-color: #f5f7fa;
  transform: translateY(-1px);
}

.table-button.danger:hover {
  color: #F56C6C;
  background-color: #fef0f0;
}

.table-button.success:hover {
  color: #67C23A;
  background-color: #f0f9eb;
}

/* 分页样式 */
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
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

/* 表格整体样式 */
.el-table {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  border: none !important;
}

/* 表头样式 */
.el-table th {
  background-color: #f5f7fa !important;
  font-weight: 600;
  color: #303133;
  padding: 16px 0;
  border-bottom: 1px solid #ebeef5;
}

.el-table th.is-leaf {
  border-bottom: none;
}

/* 表格内容样式 */
.el-table td {
  padding: 16px 0;
  border: none;
}

/* 表格行样式 */
.el-table__row {
  transition: all 0.3s ease;
}

.el-table__row:hover {
  background-color: #f5f7fa !important;
  transform: translateY(-1px);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

/* 表格单元格样式 */
.el-table .cell {
  padding: 0 16px;
  line-height: 1.5;
}

/* 表格加载状态样式 */
.el-table__empty-block {
  min-height: 200px;
}

.el-table__empty-text {
  color: #909399;
  font-size: 14px;
}

/* 表格斑马纹样式 */
.el-table--striped .el-table__body tr.el-table__row--striped td {
  background-color: #fafafa;
}

/* 表格边框样式 */
.el-table--border::after,
.el-table--group::after,
.el-table::before {
  display: none;
}

/* 表格固定列样式 */
.el-table__fixed-right {
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.05);
  background-color: #fff;
}

.el-table__fixed-right-patch {
  background-color: #f5f7fa;
}

/* 商品表单样式 */
.product-form {
  padding: 20px;
}

.product-image-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image-uploader:hover {
  border-color: #409EFF;
}

.product-image-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.product-image {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: cover;
}

/* 对话框样式 */
.el-dialog {
  border-radius: 8px;
}

.el-dialog__header {
  padding: 20px;
  border-bottom: 1px solid #ebeef5;
}

.el-dialog__body {
  padding: 30px 20px;
}

.el-dialog__footer {
  padding: 20px;
  border-top: 1px solid #ebeef5;
}

.image-preview {
  width: 200px;
  height: 200px;
  border-radius: 4px;
}

.image-preview-popover {
  padding: 10px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.el-icon-picture-outline-round {
  cursor: pointer;
  font-size: 16px;
  color: #909399;
}

.el-icon-picture-outline-round:hover {
  color: #409EFF;
}

.price-column {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style> 