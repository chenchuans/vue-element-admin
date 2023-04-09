import { login, phoneLogin } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, code, phone, type = 'account' } = userInfo

    return new Promise((resolve, reject) => {
      const req = type === 'phone' ? phoneLogin({ code, phone }) : login({ userName: username.trim(), passWord: password })
      req.then(response => {
        const { data } = response
        const rolePagination = {
          SUPER_ADMIN: {
            page: 1,
            size: 400,
            total: 0,
            sizes: [30, 50, 100, 200, 400, 500, 1000, 2000, 6000]
          },
          COMMON_ADMIN: {
            page: 1,
            size: 200,
            total: 0,
            sizes: [30, 50, 100, 200, 400]
          },
          SUPER_USER: {
            page: 1,
            size: 200,
            total: 0,
            sizes: [30, 50, 100, 200, 400]
          },
          COMMON_USER: {
            page: 1,
            size: 50,
            total: 0,
            sizes: [20, 50, 100]
          }
        }
        data.pagination = rolePagination[data.userRole]
        localStorage.setItem('loginInfo', JSON.stringify(data))
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

