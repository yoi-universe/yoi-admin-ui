import { PINIA_PREFIX_KEY } from '@/config'
import type { UserInfo } from '@/types/system/user'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { useTabsStore } from './tabs'
import { useDictStore } from './dict'
import { resetRouter } from '@/router'

export const useUserStore = defineStore('user', {
  state: (): State => ({
    token: '',
    userInfo: {
      userId: 0,
      deptId: 0,
      userName: '',
      nickName: '',
      userType: 0,
      phone: '',
      email: '',
      sex: 2,
      avatar: '',
      status: 0,
      delFlag: 0,
      loginIp: '',
      loginDate: '',
      sortNum: 0,
      createBy: '',
      createTime: '',
      updateBy: '',
      updateTime: '',
      remark: '',
    },
  }),
  getters: {
    getToken: state => state.token,
    getUserInfo: state => state.userInfo,
  },
  actions: {
    setToken(token: string) {
      this.token = token
    },
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo
    },
    logout() {
      resetRouter() // 重置路由
      useUserStore().$reset()
      useAuthStore().$reset()
      useTabsStore().$reset()
      useDictStore().$reset()
    },
  },
  persist: {
    key: PINIA_PREFIX_KEY + 'user',
    storage: localStorage,
  },
})

interface State {
  token: string
  userInfo: UserInfo
}
