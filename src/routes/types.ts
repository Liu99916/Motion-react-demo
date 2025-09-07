// src/routes/types.ts
import type { ReactNode } from 'react';

// 路由配置项接口
export interface RouteConfig {
  path: string; // 路由路径
  element: ReactNode; // 渲染的组件
  children?: RouteConfig[]; // 子路由
  index?: boolean; // 是否为索引路由
  label?: string; // 路由标签（用于导航显示）
  isProtected?: boolean; // 是否需要权限保护
  bgClass?: string; // 页面背景类名
}

// 路由参数类型（示例，可根据需要扩展）
export type RouteParams = {
  id?: string;
  slug?: string;
};
