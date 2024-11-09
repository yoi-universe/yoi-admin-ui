import type {
  AxiosInstance,
  AxiosResponse,
  Canceler,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from 'axios'
import axios from 'axios'

export default abstract class AbsAxios {
  private config: CreateAxiosDefaults = {
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 10000,
  }
  private instance: AxiosInstance
  private pendingMap = new Map<string, Canceler>()
  protected options: Options = {}

  /**
   * 消息提示
   * 使用策略模式，创建消息处理策略
   */
  private messageHandler: MessageHandler

  constructor(config?: CreateAxiosDefaults, messageHandler?: MessageHandler) {
    this.instance = axios.create(config || this.config)
    this.messageHandler = messageHandler || {
      showMessage: (msg, type) => console.error(`默认消息: ${msg} [${type}]`),
    }
    this.interceptors()
  }

  /**
   * 请求拦截器成功
   * @param config 请求配置
   * @returns 请求配置
   */
  public onRequestFulfilled(config: InternalAxiosRequestConfig) {
    // 防止重复请求
    this.removePending(config)
    if (this.options.cancelRepeatRequest) this.addPending(config)
    return config
  }

  /**
   * 请求拦截器失败
   * @param error 请求错误
   * @returns Promise
   */
  public onRequestRejected(error: InternalAxiosRequestConfig) {
    return Promise.reject(error)
  }

  /**
   * 响应拦截器成功
   * @param response Axios响应
   * @returns Promise
   */
  public onResponseFulfilled(response: AxiosResponse) {
    this.removePending(response.config)
    if (
      this.options.showCodeMessage &&
      response.data &&
      response.data.code !== 200
    ) {
      this.messageHandler.showMessage(response.data.message, 'error')
      return Promise.reject(response.data) // code不等于200, 页面具体逻辑就不执行了
    }
    return this.options.reductDataFormat ? response.data : response
  }

  /**
   * 响应拦截器失败
   * @param error Axios响应
   * @returns Promise
   */
  public onResponseRejected(error: AxiosResponse) {
    if (error.config) this.removePending(error.config)
    if (this.options.showErrorMessage) this.httpErrorStatusHandle(error) // 处理错误状态码
    return Promise.reject(error) // 错误继续返回给到具体页面
  }

  private interceptors() {
    // 自定义配置
    this.configureOptions()

    this.instance.interceptors.request.use(
      config => this.onRequestFulfilled(config),
      error => this.onRequestRejected(error),
    )

    this.instance.interceptors.response.use(
      response => this.onResponseFulfilled(response),
      error => this.onResponseRejected(error),
    )
  }

  private configureOptions(options?: Options) {
    // 自定义配置
    this.options = Object.assign(
      {
        cancelRepeatRequest: true, // 是否开启取消重复请求, 默认为 true
        reductDataFormat: true, // 是否开启简洁的数据结构响应, 默认为true
        showErrorMessage: true, // 是否开启接口错误信息展示,默认为true
        showCodeMessage: false, // 是否开启code不为200时的信息提示, 默认为false
      },
      options,
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private httpErrorStatusHandle(error: any) {
    // 处理被取消的请求
    if (axios.isCancel(error))
      return console.error('请求的重复请求：' + error.message)
    let message = ''
    if (error && error.response) {
      const statusMap = new Map<number, string>([
        [302, '接口重定向了！'],
        [400, '参数不正确！'],
        [401, '您未登录，或者登录已经超时，请先登录！'],
        [403, '您没有权限操作！'],
        [404, `请求地址出错: ${error.response.config.url}`],
        [408, '请求超时！'],
        [409, '系统已存在相同数据！'],
        [500, '服务器内部错误！'],
        [501, '服务未实现！'],
        [502, '网关错误！'],
        [503, '服务不可用！'],
        [504, '服务暂时无法访问，请稍后再试！'],
        [505, 'HTTP版本不受支持！'],
      ])
      if (statusMap.has(error.response.status)) {
        message = statusMap.get(error.response.status)!
      } else {
        message = '异常问题，请联系管理员！'
      }
      if (error.message.includes('timeout')) message = '网络请求超时！'
      if (error.message.includes('Network'))
        message = window.navigator.onLine ? '服务端异常！' : '您断网了！'
      this.messageHandler.showMessage(message, 'error')
    }
  }

  /**
   * 储存每个请求的唯一cancel回调, 以此为标识
   * @param config axios请求配置对象
   */
  private addPending(config: InternalAxiosRequestConfig) {
    const pendingKey = this.getPendingKey(config)
    config.cancelToken =
      config.cancelToken ||
      new axios.CancelToken((cancel: Canceler) => {
        if (!this.pendingMap.get(pendingKey)) {
          this.pendingMap.set(pendingKey, cancel)
        }
      })
  }

  /**
   * 删除重复请求
   * @param config axios请求配置对象
   */
  private removePending(config: InternalAxiosRequestConfig) {
    const pendingKey = this.getPendingKey(config)
    if (this.pendingMap.has(pendingKey)) {
      const cancelToken = this.pendingMap.get(pendingKey) as Canceler
      cancelToken(pendingKey)
      this.pendingMap.delete(pendingKey)
    }
  }

  /**
   * 生成唯一的每个请求的唯一key
   * @param config axios请求配置对象
   * @returns string
   */
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

  /**
   * Get 请求
   * @param url 接口地址
   * @param params 请求参数
   * @param options 配置参数
   * @param loading 加载loading参数
   * @returns Promise
   */
  public get<T = any>(
    url: string,
    params?: object,
    options?: Options,
  ): Promise<Result<T>> {
    this.configureOptions(options)
    return this.instance.get(url, { params })
  }

  /**
   * Post 请求
   * @param url 接口地址
   * @param data 请求参数
   * @param options 配置参数
   * @param loading 加载loading参数
   * @returns Promise
   */
  public post<T = any>(
    url: string,
    data?: object,
    options?: Options,
  ): Promise<Result<T>> {
    this.configureOptions(options)
    return this.instance.post(url, data)
  }

  /**
   * Put 请求
   * @param url 接口地址
   * @param data 请求参数
   * @param options 配置参数
   * @param loading 加载loading参数
   * @returns Promise
   */
  public put<T = any>(
    url: string,
    data?: object,
    options?: Options,
  ): Promise<Result<T>> {
    this.configureOptions(options)
    return this.instance.put(url, data)
  }

  /**
   * Delete 请求
   * @param url 接口地址
   * @param data 请求参数
   * @param options 配置参数
   * @param loading 加载loading参数
   * @returns Promise
   */
  public delete<T = any>(
    url: string,
    data?: object,
    options?: Options,
  ): Promise<Result<T>> {
    this.configureOptions(options)
    return this.instance.delete(url, data)
  }

  /**
   * 上传文件
   * @param url 接口地址
   * @param data 请求参数
   * @param options 配置参数
   * @returns Promise
   */
  public upload<T = any>(
    url: string,
    data?: object,
    options?: Options,
  ): Promise<Result<T>> {
    this.configureOptions(options)
    return this.instance.post(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }
}

/**
 * 消息处理类
 */
export interface MessageHandler {
  showMessage(message: string, type: string): void
}

/**
 * 请求配置参数
 */
export interface Options {
  // 是否开启取消重复请求, 默认为 true
  cancelRepeatRequest?: boolean
  // 是否开启简洁的数据结构响应, 默认为true
  reductDataFormat?: boolean
  // 是否开启接口错误信息展示,默认为true
  showErrorMessage?: boolean
  // 是否开启code不为200时的信息提示, 默认为false
  showCodeMessage?: boolean
}

/**
 * 接口返回数据结构
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Result<T = any> {
  code: number
  data: T
  message: string
}
