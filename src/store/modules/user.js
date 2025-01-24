import { login, register, getProfile } from '@/api/auth'

const state = {
  token: localStorage.getItem('token'),
  userInfo: null,
  users: [],
  error: null
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_USERS: (state, users) => {
    state.users = users
  },
  SET_ERROR: (state, error) => {
    state.error = error
  },
  CLEAR_USER: (state) => {
    state.token = null
    state.userInfo = null
    state.error = null
    localStorage.removeItem('token')
  }
}

const actions = {
  // 登录
  async login({ commit }, userInfo) {
    try {
      const response = await login(userInfo)
      const { token, admin } = response.data
      console.log('login response:', response);
      
      commit('SET_TOKEN', token)
      commit('SET_USER_INFO', admin)
      localStorage.setItem('token', token)
      return true
    } catch (error) {
      commit('SET_ERROR', error.message)
      return false
    }
  },

  // 注册
  async register({ commit }, userInfo) {
    try {
      const response = await register(userInfo)
      return true
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || error.message)
      return false
    }
  },

  // 获取用户信息
  async getProfile({ commit }) {
    try {
      const response = await getProfile()
      console.log('getProfile response:', response);
      
      commit('SET_USER_INFO', response.data)
      return true
    } catch (error) {
      commit('SET_ERROR', error.message)
      return false
    }
  },

  // 登出
  logout({ commit }) {
    commit('CLEAR_USER')
  }
}

const getters = {
  token: state => state.token,
  userInfo: state => state.userInfo,
  error: state => state.error,
  isAuthenticated: state => !!state.token
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
} 