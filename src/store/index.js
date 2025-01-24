import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user
  },
  state: {
    products: [],
    orders: [],
    promotions: []
  },
  mutations: {
    SET_PRODUCTS(state, products) {
      state.products = products
    },
    SET_ORDERS(state, orders) {
      state.orders = orders
    },
    SET_PROMOTIONS(state, promotions) {
      state.promotions = promotions
    }
  },
  actions: {
    async fetchProducts({ commit }) {
      // 模拟API调用
      const products = [
        { id: 1, name: '可乐', price: 3.50, stock: 100, status: 'active' },
        { id: 2, name: '雪碧', price: 3.00, stock: 80, status: 'active' }
      ]
      commit('SET_PRODUCTS', products)
    },
    async fetchOrders({ commit }) {
      // 模拟API调用
      const orders = [
        { id: 1, productName: '可乐', quantity: 2, status: 'pending' },
        { id: 2, productName: '雪碧', quantity: 1, status: 'completed' }
      ]
      commit('SET_ORDERS', orders)
    },
    async fetchPromotions({ commit }) {
      // 模拟API调用
      const promotions = [
        { id: 1, name: '新年特惠', type: 'discount', value: 0.8 },
        { id: 2, name: '满30减5', type: 'reduction', value: 5 }
      ]
      commit('SET_PROMOTIONS', promotions)
    }
  },
  getters: {
    getProducts: state => state.products,
    getOrders: state => state.orders,
    getPromotions: state => state.promotions
  }
}) 