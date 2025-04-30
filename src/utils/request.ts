import axios, {
  InternalAxiosRequestConfig,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { ElMessage } from "element-plus";
import AuthHelper from "chaint-edpnext-auth";

// 定义接口返回数据格式（根据后端约定调整）
interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

// 创建实例
const service: AxiosInstance = axios.create({
  baseURL: window.CHAINT_EDPNEXT_GATEWAY_URL ?? import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = AuthHelper.getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = token;
    }
    config.baseURL = window.CHAINT_EDPNEXT_GATEWAY_URL ?? import.meta.env.VITE_API_BASE_URL;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    const res = response.data;
    // console.log("网络请求结果", res);
    // 根据业务状态码处理（示例）
    if (res.code === "200") {
      return res; // 返回实际需要的数据
    } else {
      // 处理错误（示例）
      ElMessage.error(res.exceptions || res.msg || "Error");
      return Promise.reject(new Error(res.message || "Error"));
    }
  },
  (error) => {
    // 处理 HTTP 网络错误
    let message = "";
    const status = error.response?.status;
    switch (status) {
      case 401:
        message = "认证失败，请重新登录";
        // 跳转登录页
        break;
      case 404:
        message = "请求资源不存在";
        break;
      case 500:
        message = "服务器错误";
        break;
      default:
        message = "网络连接错误";
    }
    ElMessage.error(message);
    return Promise.reject(error);
  }
);

// 封装通用请求方法
const http = {
  get<T = any>(url: string, params?: object, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, { params, ...config });
  },

  post<T = any>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return service.post(url, data, config);
  },

  put<T = any>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return service.put(url, data, config);
  },

  delete<T = any>(url: string, params?: object, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, { params, ...config });
  },
};

export default http;
