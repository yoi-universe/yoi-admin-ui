import AbsAxios, {
  type MessageHandler,
  type Options,
  type Result,
} from '@/utils/axios'
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { ElLoading, ElMessage, type LoadingOptions } from 'element-plus'

class YoiAxios extends AbsAxios {
  public options: IOptions = {}
  private loading: LoadingOptions = {}
  private loadingInstance: LoadingInstance = {
    target: null,
    count: 0,
  }

  constructor() {
    super(undefined, {
      showMessage(
        message: string,
        type: 'error' | 'success' | 'info' | 'warning',
      ) {
        ElMessage({
          message,
          type,
          plain: true,
        })
      },
    })
  }

  public override onRequestFulfilled(config: InternalAxiosRequestConfig) {
    super.onRequestFulfilled(config)
    // 创建loading实例
    if (this.options.loading) {
      this.loadingInstance.count++
      if (this.loadingInstance.count === 1) {
        this.loadingInstance.target = ElLoading.service(this.loading)
      }
    }
    return config
  }

  public override onResponseFulfilled(response: AxiosResponse) {
    if (this.options.loading) this.closeLoading()
    return super.onResponseFulfilled(response)
  }

  public override onResponseRejected(error: AxiosResponse) {
    if (this.options.loading) this.closeLoading()
    return super.onResponseRejected(error)
  }

  /**
   * 关闭Loading层实例
   */
  private closeLoading() {
    if (this.options.loading && this.loadingInstance.count > 0)
      this.loadingInstance.count--
    if (this.loadingInstance.count === 0) {
      this.loadingInstance.target.close()
      this.loadingInstance.target = null
    }
  }

  /**
   * Get 请求
   * @param url 请求地址
   * @param params 请求参数
   * @param options 配置项
   * @param loading 配置项
   * @returns Promise<T>
   */
  public override get<T = Result>(
    url: string,
    params?: object,
    options?: IOptions,
    loading?: LoadingOptions,
  ): Promise<T> {
    this.options = options || {}
    this.loading = loading || {}
    return super.get(url, params, options)
  }

  /**
   * Post 请求
   * @param url 请求地址
   * @param data 请求参数
   * @param options 配置项
   * @param loading 配置项
   * @returns Promise<T>
   */
  public override post<T = Result>(
    url: string,
    data?: object,
    options?: IOptions,
    loading?: LoadingOptions,
  ): Promise<T> {
    this.options = options || {}
    this.loading = loading || {}
    return super.post(url, data, options)
  }

  /**
   * Put 请求
   * @param url 请求地址
   * @param data 请求参数
   * @param options 配置项
   * @param loading 配置项
   * @returns Promise<T>
   */
  public override put<T = Result>(
    url: string,
    data?: object,
    options?: IOptions,
    loading?: LoadingOptions,
  ): Promise<T> {
    this.options = options || {}
    this.loading = loading || {}
    return super.put(url, data, options)
  }

  /**
   * Delete 请求
   * @param url 请求地址
   * @param data 请求参数
   * @param options 配置项
   * @param loading 配置项
   * @returns Promise<T>
   */
  public override delete<T = Result>(
    url: string,
    data?: object,
    options?: IOptions,
    loading?: LoadingOptions,
  ): Promise<T> {
    this.options = options || {}
    this.loading = loading || {}
    return super.delete(url, data, options)
  }

  /**
   * 上传文件
   * @param url 接口地址
   * @param data 请求参数
   * @param options 配置参数
   * @param loading 加载loading参数
   * @returns Promise<T>
   */
  public override upload<T = Result>(
    url: string,
    data?: object,
    options?: IOptions,
    loading?: LoadingOptions,
  ): Promise<T> {
    this.options = options || {}
    this.loading = loading || {}
    return super.upload(url, data)
  }
}

export default new YoiAxios()

class ElMessageHandler implements MessageHandler {
  showMessage(message: string, type: 'error' | 'success' | 'info' | 'warning') {
    ElMessage({
      message,
      type,
      plain: true,
    })
  }
}

interface LoadingInstance {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  target: any
  count: number
}

interface IOptions extends Options {
  loading?: boolean
}
