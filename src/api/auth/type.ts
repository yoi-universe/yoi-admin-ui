export interface LoginParams {
  userName: string
  password: string
  captcha: string
  key: string
}

export interface LoginRes {
  token: string
}
