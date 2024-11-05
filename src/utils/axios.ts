import type {
  AxiosInstance,
  Canceler,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from 'axios'
import axios from 'axios'
import { ElLoading, ElMessage, type LoadingOptions } from 'element-plus'

// axios 配置
const config: CreateAxiosDefaults = {
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 10000,
}

class Yoi {
  private instance: AxiosInstance
  private pendingMap = new Map<string, Canceler>()
  private options: Options = {}
  private loading: LoadingOptions = {}
  private loadingInstance: LoadingInstance = {
    target: null,
    count: 0,
  }

  constructor(config: CreateAxiosDefaults) {
    this.instance = axios.create(config)
    this.interceptors()
  }

  // 请求拦截器
  private interceptors() {
    // 自定义配置
    this.options = Object.assign(
      {
        cancelRepeatRequest: true, // 是否开启取消重复请求, 默认为 true
        loading: false, // 是否开启loading层效果, 默认为false
        reductDataFormat: true, // 是否开启简洁的数据结构响应, 默认为true
        showErrorMessage: true, // 是否开启接口错误信息展示,默认为true
        showCodeMessage: false, // 是否开启code不为200时的信息提示, 默认为false
      },
      this.options,
    )

    this.instance.interceptors.request.use(
      config => {
        this.removePending(config)
        if (this.options.cancelRepeatRequest) this.addPending(config)

        // 创建loading实例
        if (this.options.loading) {
          this.loadingInstance.count++
          if (this.loadingInstance.count === 1) {
            this.loadingInstance.target = ElLoading.service(this.loading)
          }
        }

        // 获取token
        // const token = getToken()
        // if(token){
        //   config.headers.Authorization = token
        // }
        // 防止重复请求
        return config
      },
      error => {
        return Promise.reject(error)
      },
    )

    this.instance.interceptors.response.use(
      response => {
        this.removePending(response.config)
        if (this.options.loading) this.closeLoading()

        if (
          this.options.showCodeMessage &&
          response.data &&
          response.data.code !== 200
        ) {
          ElMessage({
            message: response.data.message,
            type: 'error',
            plain: true,
          })
          return Promise.reject(response.data) // code不等于200, 页面具体逻辑就不执行了
        }

        return this.options.reductDataFormat ? response.data : response
      },
      error => {
        if (error.config) this.removePending(error.config)
        if (this.options.loading) this.closeLoading()
        if (this.options.showErrorMessage) this.httpErrorStatusHandle(error) // 处理错误状态码
        return Promise.reject(error) // 错误继续返回给到具体页面
      },
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private httpErrorStatusHandle(error: any) {
    // 处理被取消的请求
    if (axios.isCancel(error))
      return console.error('请求的重复请求：' + error.message)
    let message = ''
    if (error && error.response) {
      switch (error.response.status) {
        case 302:
          message = '接口重定向了！'
          break
        case 400:
          message = '参数不正确！'
          break
        case 401:
          message = '您未登录，或者登录已经超时，请先登录！'
          break
        case 403:
          message = '您没有权限操作！'
          break
        case 404:
          message = `请求地址出错: ${error.response.config.url}`
          break
        case 408:
          message = '请求超时！'
          break
        case 409:
          message = '系统已存在相同数据！'
          break
        case 500:
          message = '服务器内部错误！'
          break
        case 501:
          message = '服务未实现！'
          break
        case 502:
          message = '网关错误！'
          break
        case 503:
          message = '服务不可用！'
          break
        case 504:
          message = '服务暂时无法访问，请稍后再试！'
          break
        case 505:
          message = 'HTTP版本不受支持！'
          break
        default:
          message = '异常问题，请联系管理员！'
          break
      }
      if (error.message.includes('timeout')) message = '网络请求超时！'
      if (error.message.includes('Network'))
        message = window.navigator.onLine ? '服务端异常！' : '您断网了！'

      ElMessage({
        message,
        type: 'error',
        plain: true,
      })
    }
  }

  // 关闭Loading层实例
  private closeLoading() {
    if (this.options.loading && this.loadingInstance.count > 0)
      this.loadingInstance.count--
    if (this.loadingInstance.count === 0) {
      this.loadingInstance.target.close()
      this.loadingInstance.target = null
    }
  }

  // 储存每个请求的唯一cancel回调, 以此为标识
  addPending(config: InternalAxiosRequestConfig) {
    const pendingKey = this.getPendingKey(config)
    config.cancelToken =
      config.cancelToken ||
      new axios.CancelToken((cancel: Canceler) => {
        if (!this.pendingMap.get(pendingKey)) {
          this.pendingMap.set(pendingKey, cancel)
        }
      })
  }

  // 删除重复请求
  private removePending(config: InternalAxiosRequestConfig) {
    const pendingKey = this.getPendingKey(config)
    if (this.pendingMap.has(pendingKey)) {
      const cancelToken = this.pendingMap.get(pendingKey) as Canceler
      cancelToken(pendingKey)
      this.pendingMap.delete(pendingKey)
    }
  }

  // 生成唯一的每个请求的唯一key
  private getPendingKey(config: InternalAxiosRequestConfig) {
    const { url, method, params, headers } = config
    let { data } = config
    if (typeof data === 'string') data = JSON.parse(data)
    return [
      url,
      method,
      JSON.stringify(params),
      headers && headers.Authorization ? headers.Authorization : '',
      JSON.stringify(data),
    ].join('&')
  }

  // Get 请求
  get<T = Result>(
    url: string,
    params?: object,
    options?: Options,
    loading?: LoadingOptions,
  ): Promise<T> {
    this.options = options || {}
    this.loading = loading || {}
    return this.instance.get(url, { params })
  }

  // Post 请求
  post<T = Result>(
    url: string,
    data?: object,
    options?: Options,
    loading?: LoadingOptions,
  ): Promise<T> {
    this.options = options || {}
    this.loading = loading || {}
    return this.instance.post(url, data)
  }

  // Put 请求
  put<T = Result>(
    url: string,
    data?: object,
    options?: Options,
    loading?: LoadingOptions,
  ): Promise<T> {
    this.options = options || {}
    this.loading = loading || {}
    return this.instance.put(url, data)
  }

  // Delete 请求
  delete<T = Result>(
    url: string,
    data?: object,
    options?: Options,
    loading?: LoadingOptions,
  ): Promise<T> {
    this.options = options || {}
    this.loading = loading || {}
    return this.instance.delete(url, data)
  }

  // 图片上传
  upload<T = Result>(url: string, data?: object): Promise<T> {
    return this.instance.post(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }
}

export default new Yoi(config)

interface Options {
  // 是否开启取消重复请求, 默认为 true
  cancelRepeatRequest?: boolean
  // 是否开启loading层效果, 默认为false
  loading?: boolean
  // 是否开启简洁的数据结构响应, 默认为true
  reductDataFormat?: boolean
  // 是否开启接口错误信息展示,默认为true
  showErrorMessage?: boolean
  // 是否开启code不为200时的信息提示, 默认为false
  showCodeMessage?: boolean
}

interface LoadingInstance {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  target: any
  count: number
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Result<T = any> {
  code: number
  data: T
  message: string
}
