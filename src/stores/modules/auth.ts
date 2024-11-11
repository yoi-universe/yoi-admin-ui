import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: (): State => ({
    roles: [],
    permissions: [],
  }),
  actions: {
    setRoles(roles: string[]) {
      this.roles = roles
    },
    setPermissions(permissions: string[]) {
      this.permissions = permissions
    },
  },
})

interface State {
  roles: string[]
  permissions: string[]
}
