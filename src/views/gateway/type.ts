type LoadBalancerType = "RoundRobin" | "LeastConnection" | "CookieSticky" | "Weighted";

export interface GatewayConfig {
  Id?: string;
  ProjectName: string;
  ProjectCode: string;
  Config: Config;
  IsDeleted?: boolean;
  OperateTime?: Date;
}

export interface Config {
  GlobalConfiguration: GlobalConfig;
  Routes: RouteConfig[];
}

export interface GlobalConfig {
  BaseUrl: string;
  RateLimitOptions: GlobalRateLimitOptions;
  AuthenticationOptions: GlobalAuthenticationOptions;
}

export interface RouteConfig {
  Id: string;
  Active?: boolean;
  Name: string;
  Enabled: boolean;
  DownstreamScheme: string;
  DownstreamPathTemplate: string;
  UpstreamHttpMethod: string[];
  UpstreamPathTemplate: string;
  LoadBalancerOptions: LoadBalancerOptions;
  DownstreamHostAndPorts: RouteDownstreamHostOptions[];
  AuthenticationOptions: RouteAuthenticationOptions;
  RateLimitOptions: RouteRateLimitOptions;
  UpstreamHeaderTemplates: UpstreamHeaderTemplatesOptions;
}

export interface GlobalRateLimitOptions {
  DisableRateLimitHeaders: boolean;
  QuotaExceededMessage: string;
  HttpStatusCode: number;
}

export interface GlobalAuthenticationOptions {
  AuthenticationProviderKey: string;
  AllowedScopes: string[];
}

export interface RouteAuthenticationOptions {
  AuthenticationRequired: boolean;
  AuthenticationProviderKey: string;
  AllowedScopes: string[];
}

export interface RouteRateLimitOptions {
  EnableRateLimiting: boolean;
  ClientWhitelist: string[];
  PermitLimit: number;
  Period: number;
}

export interface LoadBalancerOptions {
  Type: LoadBalancerType;
}

export interface UpstreamHeaderTemplatesOptions {
  [key: string]: string;
}

export interface RouteDownstreamHostOptions {
  Host: string;
  Port: number;
  Weight: number;
  Scheme: string;
  HealthCheckPath: string;
}

export interface PageInput {
  pageIndex: number; // 页数
  pageSize: number; // 页行
}

export interface GatewayConfigFindInput extends PageInput {
  projectName: string; // 项目名称
  projectCode: string; // 项目代码
}

export interface GatewayConfigInput {
  Id: string;
  ProjectName: string; // 项目名称
  ProjectCode: string; // 项目代码
  Config: Config; // Config 对象
}

export interface GatewayConfigDto {
  Id: string;
  ProjectName: string; // 项目名称
  ProjectCode: string; // 项目代码
}
