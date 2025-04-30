import { dayjs } from "element-plus";
import {
  GatewayConfig,
  GlobalAuthenticationOptions,
  GlobalRateLimitOptions,
  LoadBalancerOptions,
  RouteAuthenticationOptions,
  UpstreamHeaderTemplatesOptions,
  RouteConfig,
  RouteDownstreamHostOptions,
  RouteRateLimitOptions,
} from "./type";

export const api = {
  add: "/Gateway/Add",
  delete: "/Gateway/Del",
  batchDel: "/Gateway/BatchDel",
  edit: "/Gateway/Edit",
  list: "/Gateway/List",
  detail: "/Gateway/Details",
  publish: "/Gateway/Publish",
  publishHistory: "/Gateway/PublishHistoryList",
};

export const showConfirm = (
  message: string,
  onConfirm?: () => void,
  title: string = "系统提示",
  onCancel?: () => void
) => {
  ElMessageBox.confirm(message, title, {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      // 用户点击确定后的处理逻辑
      if (onConfirm) {
        onConfirm(); // 执行用户提供的确认回调函数
      }
    })
    .catch(() => {
      if (onCancel) onCancel();
    });
};

export function formatDate(row: any, column: any, cellValue: any) {
  return dayjs(cellValue).format("YYYY-MM-DD HH:mm:ss");
}

export function generateGUID(): string {
  // 定义生成的UUID格式
  function s4(): string {
    // 返回一个四位的十六进制数（即4个字符）
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  // 组合8-4-4-4-12格式的字符串
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

/**
 * 将对象中的 null 值转换为默认值：
 * - 字符串类型：null -> ''
 * - 对象类型：null -> {}
 * - 数组类型：null -> []
 * @param obj - 输入的对象
 * @returns 转换后的对象
 */
export function convertNullToDefaults<T extends Record<string, any>>(obj: T): T {
  // 遍历对象的每个键值对
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      if (value === null) {
        // 根据属性的预期类型设置默认值
        if (typeof obj[key] === "string" || (obj[key] === null && typeof obj[key] === "undefined")) {
          obj[key] = ""; // 字符串类型的默认值
        } else if (Array.isArray(obj[key]) || (obj[key] === null && Array.isArray(obj[key]))) {
          obj[key] = []; // 数组类型的默认值
        } else if (typeof obj[key] === "object") {
          obj[key] = {}; // 对象类型的默认值
        }
      } else if (typeof value === "object" && value !== null) {
        // 如果值是对象或数组，递归调用
        obj[key] = Array.isArray(value)
          ? value.map((item) => (item && typeof item === "object" ? convertNullToDefaults(item) : item))
          : convertNullToDefaults(value);
      }
    }
  }

  return obj;
}

/**
 * 将 B 对象合并到 A 对象中，仅合并 A 中已有的属性（支持多层嵌套和数组）
 * @param {Object} target - 目标对象 A
 * @param {Object} source - 源对象 B
 * @returns {Object} 返回新的 A 对象
 */
export function mergeObjects(target: object, source: object) {
  // 如果目标或源不是对象，则直接返回目标对象
  if (typeof target !== "object" || target === null || typeof source !== "object" || source === null) {
    return target;
  }

  // 创建一个新的对象用于存储结果
  const result = Array.isArray(target) ? [...target] : { ...target };

  // 遍历目标对象的属性
  for (const key in target) {
    if (target.hasOwnProperty(key)) {
      // 如果 source 中也有该属性
      if (source.hasOwnProperty(key)) {
        if (
          typeof target[key] === "object" &&
          target[key] !== null &&
          typeof source[key] === "object" &&
          source[key] !== null
        ) {
          // 如果两者都是数组
          if (Array.isArray(target[key]) && Array.isArray(source[key])) {
            result[key] = source[key]; // 数组直接覆盖
          } else {
            // 如果两者都是对象，则递归合并
            result[key] = mergeObjects(target[key], source[key]);
          }
        } else {
          // 如果不是对象，则直接覆盖
          result[key] = source[key];
        }
      }
    }
  }

  return result;
}

/**
 * 将 JSON 字符串转换为对象，并确保所有属性首字母小写
 * @param jsonString - 输入的 JSON 字符串
 * @returns 转换后的对象
 */
export function jsonToCapitalizedObject(jsonString: string): any {
  // 解析 JSON 字符串为对象
  const parsedData = JSON.parse(jsonString);

  // 辅助函数：将字符串首字母小写
  const capitalizeFirstLetter = (str: string): string => {
    return str.charAt(0).toLowerCase() + str.slice(1);
  };

  // 递归处理对象或数组
  const processObject = (data: any): any => {
    if (Array.isArray(data)) {
      // 如果是数组，递归处理每个元素
      return data.map((item) => processObject(item));
    } else if (typeof data === "object" && data !== null) {
      // 如果是对象，递归处理每个键值对
      const result: Record<string, any> = {};
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const newKey = capitalizeFirstLetter(key); // 首字母大写
          result[newKey] = processObject(data[key]); // 递归处理值
        }
      }
      return result;
    } else {
      // 基本类型直接返回
      return data;
    }
  };

  // 调用递归处理函数
  return processObject(parsedData);
}

export const defaultGlobalRateLimitOptions: GlobalRateLimitOptions = {
  DisableRateLimitHeaders: true,
  QuotaExceededMessage: "",
  HttpStatusCode: 429,
};

export const defaultGlobalAuthenticationOptions: GlobalAuthenticationOptions = {
  AuthenticationProviderKey: "",
  AllowedScopes: [] as Array<string>,
};

export const defaultLoadBalancerOptions: LoadBalancerOptions = {
  Type: "RoundRobin",
};
export const defaultDownstreamHostAndPorts: RouteDownstreamHostOptions[] = [] as Array<{
  Host: string;
  Port: number;
  Weight: number;
  Scheme: string;
  HealthCheckPath: string;
}>;
export const defaultAuthenticationOptions: RouteAuthenticationOptions = {
  AuthenticationRequired: false, // 是否要求认证
  AuthenticationProviderKey: "", // 认证提供者密钥
  AllowedScopes: [], // 允许的范围
};
export const defaultRateLimitOptions: RouteRateLimitOptions = {
  EnableRateLimiting: false, // 是否启用限流
  ClientWhitelist: [], // 客户端白名单
  PermitLimit: 0, // 允许的请求数
  Period: 0, // 限流周期（秒）
};
export const defaultUpstreamHeaderTemplatesOptions: UpstreamHeaderTemplatesOptions = {};

export const defaultRouteConfig: RouteConfig = {
  Id: generateGUID(),
  Name: "",
  Enabled: true,
  DownstreamScheme: "http",
  DownstreamPathTemplate: "",
  DownstreamHostAndPorts: defaultDownstreamHostAndPorts,
  UpstreamHttpMethod: ["GET", "POST", "PUT", "DELETE"],
  UpstreamPathTemplate: "",
  AuthenticationOptions: defaultAuthenticationOptions,
  RateLimitOptions: defaultRateLimitOptions,
  LoadBalancerOptions: defaultLoadBalancerOptions,
  UpstreamHeaderTemplates: defaultUpstreamHeaderTemplatesOptions, // 路由声明要求
};

export const defaultGateway: GatewayConfig = {
  Id: "",
  ProjectName: "",
  ProjectCode: "",
  Config: {
    GlobalConfiguration: {
      BaseUrl: "",
      RateLimitOptions: defaultGlobalRateLimitOptions,
      AuthenticationOptions: defaultGlobalAuthenticationOptions,
    },
    Routes: [defaultRouteConfig],
  },
};
