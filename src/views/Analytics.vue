<template>
  <div class="analytics-container">
    <!-- 数据概览卡片 -->
    <el-row :gutter="20" class="dashboard-cards">
      <el-col :span="6" v-for="(card, index) in overviewCards" :key="index">
        <el-card class="data-card" :class="card.class" shadow="hover">
          <div class="data-card-content">
            <div class="icon-wrapper">
              <i :class="card.icon"></i>
            </div>
            <div class="data-info">
              <div class="data-title">{{ card.title }}</div>
              <div class="data-value">
                {{ card.prefix }}{{ card.value }}{{ card.suffix }}
              </div>
              <div class="data-trend" :class="{ 'up': card.trend > 0, 'down': card.trend < 0 }">
                <i :class="card.trend > 0 ? 'el-icon-top-right' : 'el-icon-bottom-right'"></i>
                {{ Math.abs(card.trend) }}% 较上周
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-container">
      <el-col :span="16">
        <el-card class="chart-card" shadow="hover">
          <div slot="header" class="chart-header">
            <span class="chart-title">销售趋势</span>
            <div class="chart-actions">
              <el-radio-group v-model="timeRange" size="small">
                <el-radio-button label="week">本周</el-radio-button>
                <el-radio-button label="month">本月</el-radio-button>
                <el-radio-button label="year">全年</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div class="chart-content">
            <div ref="salesChart" class="chart"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card" shadow="hover">
          <div slot="header" class="chart-header">
            <span class="chart-title">商品分类占比</span>
            <el-tooltip content="展示各类商品销售占比" placement="top">
              <i class="el-icon-info"></i>
            </el-tooltip>
          </div>
          <div class="chart-content">
            <div ref="categoryChart" class="chart"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 热销商品排行 -->
    <el-card class="ranking-card" shadow="hover">
      <div slot="header" class="ranking-header">
        <span class="ranking-title">热销商品排行</span>
        <el-select v-model="rankingPeriod" size="small" class="ranking-select">
          <el-option label="今日" value="today"></el-option>
          <el-option label="本周" value="week"></el-option>
          <el-option label="本月" value="month"></el-option>
        </el-select>
      </div>
      <el-table :data="hotProducts" style="width: 100%" :show-header="false">
        <el-table-column width="80">
          <template slot-scope="scope">
            <div class="ranking-number" :class="'top-' + (scope.$index + 1)">
              {{ scope.$index + 1 }}
            </div>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <div class="product-info">
              <el-image
                :src="scope.row.image"
                class="product-image"
                fit="cover"
              >
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
              <div class="product-details">
                <span class="product-name">{{ scope.row.name }}</span>
                <div class="product-stats">
                  <span class="sales-count">销量 {{ scope.row.sales }}</span>
                  <span class="sales-amount">¥{{ scope.row.amount }}</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="200">
          <template slot-scope="scope">
            <div class="sales-progress">
              <el-progress
                :percentage="scope.row.percentage"
                :color="getProgressColor(scope.row.percentage)"
                :show-text="false"
              ></el-progress>
              <span class="progress-value">{{ scope.row.percentage }}%</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style scoped>
.analytics-container {
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
  width: 64px;
  height: 64px;
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
  font-size: 28px;
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
  margin-bottom: 8px;
  background: linear-gradient(45deg, #303133, #606266);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.data-trend {
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.data-trend.up {
  color: #67C23A;
}

.data-trend.down {
  color: #F56C6C;
}

/* 卡片主题色 */
.total-sales .icon-wrapper {
  background: linear-gradient(135deg, #409EFF, #53a8ff);
}

.total-orders .icon-wrapper {
  background: linear-gradient(135deg, #67C23A, #85ce61);
}

.avg-price .icon-wrapper {
  background: linear-gradient(135deg, #E6A23C, #ebb563);
}

.conversion-rate .icon-wrapper {
  background: linear-gradient(135deg, #F56C6C, #f78989);
}

/* 图表区域样式 */
.chart-container {
  margin-bottom: 20px;
}

.chart-card {
  border-radius: 12px;
  border: none;
  overflow: hidden;
  transition: all 0.3s;
}

.chart-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f2f5;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.chart-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chart-content {
  padding: 20px;
  height: 400px;
}

.chart {
  width: 100%;
  height: 100%;
}

/* 排行榜样式 */
.ranking-card {
  border-radius: 12px;
  border: none;
  overflow: hidden;
}

.ranking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f2f5;
}

.ranking-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.ranking-select {
  width: 120px;
}

.ranking-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
  color: #fff;
  background: #909399;
}

.ranking-number.top-1 {
  background: linear-gradient(135deg, #f5c518, #ffd700);
}

.ranking-number.top-2 {
  background: linear-gradient(135deg, #c0c0c0, #e0e0e0);
}

.ranking-number.top-3 {
  background: linear-gradient(135deg, #cd7f32, #dea47e);
}

.product-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-image {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.product-info:hover .product-image {
  transform: scale(1.1) rotate(3deg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.product-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-name {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.product-stats {
  display: flex;
  gap: 12px;
  font-size: 13px;
  color: #909399;
}

.sales-amount {
  color: #F56C6C;
  font-weight: 500;
}

.sales-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-value {
  font-size: 13px;
  color: #909399;
  min-width: 45px;
}

/* Element UI 组件样式覆盖 */
.el-progress-bar__outer {
  border-radius: 4px;
  background-color: #f5f7fa;
}

.el-progress-bar__inner {
  border-radius: 4px;
  transition: all 0.3s ease;
}

.el-radio-button__inner {
  padding: 8px 15px;
}

.el-table {
  background: transparent;
}

.el-table::before {
  display: none;
}

.el-table td {
  border: none;
}

.el-table .el-table__row {
  transition: all 0.3s ease;
}

.el-table .el-table__row:hover {
  transform: translateX(5px);
  background-color: #f5f7fa !important;
}
</style>

<script>
import * as echarts from 'echarts/core'
import { BarChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  PieChart,
  CanvasRenderer
])

export default {
  name: 'Analytics',
  data() {
    return {
      timeRange: 'week',
      rankingPeriod: 'today',
      overviewCards: [
        {
          title: '总销售额',
          value: '8,846',
          prefix: '¥',
          suffix: '',
          trend: 12.5,
          icon: 'el-icon-money',
          class: 'total-sales'
        },
        {
          title: '订单总量',
          value: '1,286',
          prefix: '',
          suffix: '',
          trend: 8.2,
          icon: 'el-icon-s-order',
          class: 'total-orders'
        },
        {
          title: '平均客单价',
          value: '6.88',
          prefix: '¥',
          suffix: '',
          trend: -2.5,
          icon: 'el-icon-price-tag',
          class: 'avg-price'
        },
        {
          title: '转化率',
          value: '28.5',
          prefix: '',
          suffix: '%',
          trend: 5.2,
          icon: 'el-icon-data-analysis',
          class: 'conversion-rate'
        }
      ],
      hotProducts: [
        {
          name: '可口可乐',
          image: '/images/cola.jpg',
          sales: 286,
          amount: 858.00,
          percentage: 85
        },
        {
          name: '百事可乐',
          image: '/images/pepsi.jpg',
          sales: 245,
          amount: 735.00,
          percentage: 72
        },
        {
          name: '芬达',
          image: '/images/fanta.jpg',
          sales: 212,
          amount: 636.00,
          percentage: 65
        },
        {
          name: '雪碧',
          image: '/images/sprite.jpg',
          sales: 198,
          amount: 594.00,
          percentage: 58
        },
        {
          name: '美年达',
          image: '/images/mirinda.jpg',
          sales: 176,
          amount: 528.00,
          percentage: 52
        }
      ],
      salesChart: null,
      categoryChart: null
    }
  },
  mounted() {
    this.initSalesChart()
    this.initCategoryChart()
    
    // 响应式调整
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    if (this.salesChart) {
      this.salesChart.dispose()
    }
    if (this.categoryChart) {
      this.categoryChart.dispose()
    }
  },
  methods: {
    initSalesChart() {
      this.salesChart = echarts.init(this.$refs.salesChart)
      
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          axisLine: {
            lineStyle: {
              color: '#909399'
            }
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: '#f0f2f5'
            }
          }
        },
        series: [
          {
            name: '销售额',
            type: 'bar',
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            itemStyle: {
              borderRadius: [4, 4, 0, 0],
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#409EFF' },
                { offset: 1, color: '#53a8ff' }
              ])
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#53a8ff' },
                  { offset: 1, color: '#66b1ff' }
                ])
              }
            }
          }
        ]
      }
      
      this.salesChart.setOption(option)
    },
    initCategoryChart() {
      this.categoryChart = echarts.init(this.$refs.categoryChart)
      
      const option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center'
        },
        series: [
          {
            name: '商品分类',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['40%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '14',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 1048, name: '碳酸饮料' },
              { value: 735, name: '果汁' },
              { value: 580, name: '矿泉水' },
              { value: 484, name: '功能饮料' },
              { value: 300, name: '其他' }
            ]
          }
        ]
      }
      
      this.categoryChart.setOption(option)
    },
    handleResize() {
      if (this.salesChart) {
        this.salesChart.resize()
      }
      if (this.categoryChart) {
        this.categoryChart.resize()
      }
    },
    getProgressColor(percentage) {
      if (percentage >= 80) {
        return '#67C23A'
      } else if (percentage >= 60) {
        return '#E6A23C'
      } else {
        return '#F56C6C'
      }
    }
  },
  watch: {
    timeRange() {
      // 根据时间范围更新销售趋势图表数据
      // 这里可以调用API获取新数据
    },
    rankingPeriod() {
      // 根据时间周期更新热销商品排行数据
      // 这里可以调用API获取新数据
    }
  }
}
</script> 