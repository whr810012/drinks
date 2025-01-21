import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    users: [],
    products: [],
    orders: [],
    promotions: [],
    user: JSON.parse(localStorage.getItem('user')) || null,
    error: null
  },
  mutations: {
    SET_USERS(state, users) {
      state.users = users
    },
    SET_PRODUCTS(state, products) {
      state.products = products
    },
    SET_ORDERS(state, orders) {
      state.orders = orders
    },
    SET_PROMOTIONS(state, promotions) {
      state.promotions = promotions
    },
    SET_USER(state, user) {
      state.user = user
      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
      } else {
        localStorage.removeItem('user')
      }
    },
    SET_ERROR(state, error) {
      state.error = error
    }
  },
  actions: {
    // 用户认证相关的actions
    async login({ commit }, credentials) {
      try {
        commit('SET_ERROR', null)
        // 这里模拟API调用，实际项目中需要替换为真实的API请求
        const response = await new Promise((resolve) => {
          setTimeout(() => {
            if (credentials.username === 'admin' && credentials.password === 'admin123') {
              resolve({
                success: true,
                user: {
                  id: 1,
                  username: credentials.username,
                  role: 'admin'
                }
              })
            } else {
              resolve({
                success: false,
                message: '用户名或密码错误'
              })
            }
          }, 1000)
        })

        if (response.success) {
          commit('SET_USER', response.user)
          return true
        } else {
          commit('SET_ERROR', response.message)
          return false
        }
      } catch (error) {
        commit('SET_ERROR', '登录失败，请稍后重试')
        return false
      }
    },

    async register({ commit }, userData) {
      try {
        commit('SET_ERROR', null)
        // 这里模拟API调用，实际项目中需要替换为真实的API请求
        const response = await new Promise((resolve) => {
          setTimeout(() => {
            if (userData.username === 'admin') {
              resolve({
                success: false,
                message: '用户名已存在'
              })
            } else {
              resolve({
                success: true,
                user: {
                  id: Date.now(),
                  username: userData.username,
                  role: 'user'
                }
              })
            }
          }, 1000)
        })

        if (response.success) {
          commit('SET_USER', response.user)
          return true
        } else {
          commit('SET_ERROR', response.message)
          return false
        }
      } catch (error) {
        commit('SET_ERROR', '注册失败，请稍后重试')
        return false
      }
    },

    logout({ commit }) {
      commit('SET_USER', null)
    },

    // 其他现有的actions
    async fetchUsers({ commit }) {
      // 模拟API调用
      const users = [
        { id: 1, username: 'user1', email: 'user1@example.com', status: 'active' },
        { id: 2, username: 'user2', email: 'user2@example.com', status: 'inactive' }
      ]
      commit('SET_USERS', users)
    },
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
    getUsers: state => state.users,
    getProducts: state => state.products,
    getOrders: state => state.orders,
    getPromotions: state => state.promotions,
    isAuthenticated: state => !!state.user,
    currentUser: state => state.user,
    error: state => state.error
  }
}) 