<template>
  <div class="promotions-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>促销活动管理</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="handleAdd">添加活动</el-button>
      </div>

      <el-table :data="promotions" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="name" label="活动名称" width="150"></el-table-column>
        <el-table-column prop="type" label="活动类型" width="120">
          <template slot-scope="scope">
            <el-tag :type="getPromotionTypeTag(scope.row.type)">
              {{ getPromotionTypeText(scope.row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="discount" label="优惠" width="120">
          <template slot-scope="scope">
            {{ formatDiscount(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column label="开始时间" width="180">
          <template slot-scope="scope">
            {{ formatDateTime(scope.row.start_time) }}
          </template>
        </el-table-column>
        <el-table-column label="结束时间" width="180">
          <template slot-scope="scope">
            {{ formatDateTime(scope.row.end_time) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'info'">
              {{ scope.row.status === 'active' ? '进行中' : '已结束' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑促销活动对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible">
      <el-form :model="promotionForm" :rules="rules" ref="promotionForm" label-width="100px">
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="promotionForm.name"></el-input>
        </el-form-item>
        <el-form-item label="活动类型" prop="type">
          <el-select v-model="promotionForm.type" placeholder="请选择活动类型">
            <el-option label="折扣" value="discount"></el-option>
            <el-option label="满减" value="reduction"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item 
          :label="promotionForm.type === 'discount' ? '折扣率' : '优惠金额'" 
          prop="discountValue"
          v-if="promotionForm.type === 'discount' || promotionForm.type === 'reduction'">
          <el-input-number 
            v-model="promotionForm.discountValue"
            :min="promotionForm.type === 'discount' ? 0.1 : 0"
            :max="promotionForm.type === 'discount' ? 0.99 : 1000"
            :step="promotionForm.type === 'discount' ? 0.1 : 1"
            :precision="promotionForm.type === 'discount' ? 2 : 0">
          </el-input-number>
          <span v-if="promotionForm.type === 'discount'">折</span>
          <span v-else>元</span>
        </el-form-item>
        <el-form-item label="起始金额" prop="minAmount" v-if="promotionForm.type === 'reduction'">
          <el-input-number v-model="promotionForm.minAmount" :min="0" :step="1"></el-input-number>
        </el-form-item>
        <el-form-item label="活动时间" prop="timeRange">
          <el-date-picker
            v-model="promotionForm.timeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPromotions, addPromotion, updatePromotion, deletePromotion } from '@/api/promotion';

export default {
  name: 'PromotionManagement',
  data() {
    return {
      promotions: [],
      loading: false,
      dialogVisible: false,
      dialogTitle: '添加活动',
      promotionForm: {
        name: '',
        type: 'discount',
        discountValue: 0,
        minAmount: 0,
        timeRange: [],
        status: 'active'
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择活动类型', trigger: 'change' }
        ],
        discountValue: [
          { required: true, message: '请输入优惠值', trigger: 'blur' }
        ],
        timeRange: [
          { required: true, message: '请选择活动时间', trigger: 'change' }
        ]
      }
    };
  },
  created() {
    this.fetchPromotions();
  },
  methods: {
    formatDateTime(dateStr) {
      if (!dateStr) return '-';
      const date = new Date(dateStr);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    },
    async fetchPromotions() {
      try {
        this.loading = true;
        const response = await getPromotions();
        if (response.success) {
          this.promotions = response.data;
        } else {
          this.$message.error(response.message || '获取促销活动列表失败');
        }
      } catch (error) {
        console.error('获取促销活动列表错误:', error);
        this.$message.error('获取促销活动列表失败');
      } finally {
        this.loading = false;
      }
    },
    getPromotionTypeTag(type) {
      const tags = {
        discount: 'primary',
        reduction: 'success',
        gift: 'warning'
      };
      return tags[type] || 'info';
    },
    getPromotionTypeText(type) {
      const texts = {
        discount: '折扣',
        reduction: '满减',
      };
      return texts[type];
    },
    formatDiscount(promotion) {
      if (promotion.type === 'discount') {
        return `${(promotion.discount_value * 10).toFixed(1)}折`;
      } else if (promotion.type === 'reduction') {
        return `满${promotion.min_amount}减${promotion.discount_value}`;
      }
      return '-';
    },
    handleAdd() {
      this.dialogTitle = '添加活动';
      this.promotionForm = {
        name: '',
        type: 'discount',
        discountValue: 0,
        minAmount: 0,
        timeRange: [],
        status: 'active'
      };
      this.dialogVisible = true;
    },
    handleEdit(row) {
      this.dialogTitle = '编辑活动';
      this.promotionForm = {
        id: row.id,
        name: row.name,
        type: row.type,
        discountValue: row.type === 'discount' ? row.discount_value : row.discount_value,
        minAmount: row.min_amount,
        timeRange: [new Date(row.start_time), new Date(row.end_time)],
        status: row.status
      };
      this.dialogVisible = true;
    },
    async handleDelete(row) {
      try {
        await this.$confirm('确认删除该活动?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });

        const response = await deletePromotion(row.id);
        if (response.success) {
          this.$message.success('删除成功');
          this.fetchPromotions();
        } else {
          this.$message.error(response.message || '删除失败');
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除促销活动错误:', error);
          this.$message.error('删除失败');
        }
      }
    },
    async submitForm() {
      this.$refs.promotionForm.validate(async (valid) => {
        if (valid) {
          try {
            const formData = {
              name: this.promotionForm.name,
              type: this.promotionForm.type,
              start_time: this.promotionForm.timeRange[0],
              end_time: this.promotionForm.timeRange[1],
              status: this.promotionForm.status,
              discount_value: this.promotionForm.type === 'discount' || this.promotionForm.type === 'reduction' 
                ? this.promotionForm.discountValue 
                : null,
              min_amount: this.promotionForm.type === 'reduction' ? this.promotionForm.minAmount : null,
              points_value: null
            };

            let response;
            if (this.promotionForm.id) {
              response = await updatePromotion(this.promotionForm.id, formData);
            } else {
              response = await addPromotion(formData);
            }

            if (response.success) {
              this.$message.success(this.promotionForm.id ? '编辑成功' : '添加成功');
              this.dialogVisible = false;
              this.fetchPromotions();
            } else {
              this.$message.error(response.message || '操作失败');
            }
          } catch (error) {
            console.error('保存促销活动错误:', error);
            this.$message.error('操作失败');
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.promotions-container {
  padding: 20px;
}
</style> 