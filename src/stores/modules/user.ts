import { PINIA_PREFIX_KEY } from '@/config'
import type { UserInfo } from '@/types/system/user'
import { defineStore } from 'pinia'

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
      sex: 0,
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
  actions: {
    setToken(token: string) {
      this.token = token
    },
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo
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
