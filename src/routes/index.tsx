// src/routes/index.tsx
import { lazy } from 'react';
import type { RouteConfig } from './types';

// 使用懒加载提升性能
const Home = lazy(() => import('../pages/HomePage'));
const About = lazy(() => import('../pages/AboutPage'));
const Login = lazy(() => import('../pages/LoginPage'));

// 路由配置数组
export const routes: RouteConfig[] = [
  {
    path: '/',
    element: <Home />,
    label: '首页',
    index: true,
    bgClass: 'bg-[#000]',
  },
  {
    path: '/about',
    element: <About />,
    label: '关于我们',
    bgClass: 'bg-[#a9e602]',
  },
  {
    path: '/login',
    element: <Login />,
    label: '登录',
    bgClass: 'bg-gradient-to-br from-purple-800 to-cyan-400',
  },
];

// 导出路由路径常量，避免硬编码
export const ROUTE_PATHS = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
} as const;
