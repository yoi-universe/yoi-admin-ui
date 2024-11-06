import Yoi from '@/utils/axios'
import type { InternalAxiosRequestConfig } from 'axios'

class YoiAxios extends Yoi {
  public override onRequestFulfilled(config: InternalAxiosRequestConfig) {
    super.onRequestFulfilled(config)

    return config
  }
}
