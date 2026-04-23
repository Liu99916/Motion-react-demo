// src/hooks/useDownloadManager.ts
import { useState, useEffect } from 'react';

export type AppStatus = 'pending' | 'downloading' | 'paused' | 'completed';

export interface AppItem {
  id: string;
  name: string;
  version: string;
  totalSize: number; // MB
  downloadedSize: number; // MB
  speed: number; // MB/s
  status: AppStatus;
  description: string;
  icon: string;
}

// 模拟的初始数据
export const INITIAL_APPS: AppItem[] = [
  {
    id: 'app1',
    name: 'WeChat',
    version: 'v8.0.45',
    totalSize: 245.5,
    downloadedSize: 0,
    speed: 0,
    status: 'paused',
    description: '1. 修复了一些已知问题。\n2. 优化了部分体验。\n3. 新增了朋友圈置顶功能。',
    icon: '💬',
  },
  {
    id: 'app2',
    name: 'Alipay',
    version: 'v10.5.10',
    totalSize: 180.2,
    downloadedSize: 0,
    speed: 0,
    status: 'paused',
    description: '优化了支付流程的性能和稳定性。修复了部分设备上启动慢的问题。',
    icon: '💳',
  },
  {
    id: 'app3',
    name: 'TikTok',
    version: 'v32.1.0',
    totalSize: 310.8,
    downloadedSize: 0,
    speed: 0,
    status: 'paused',
    description: '全新特效上线，快来体验！修复了已知bug，提升了观看体验。',
    icon: '🎵',
  },
  {
    id: 'app4',
    name: 'Genshin Impact',
    version: 'v4.5.0',
    totalSize: 4500.0,
    downloadedSize: 0,
    speed: 0,
    status: 'paused',
    description: '1. 新角色上线\n2. 新地图区域开放\n3. 修复了部分显示问题',
    icon: '⚔️',
  },
  {
    id: 'app5',
    name: 'Bilibili',
    version: 'v7.50.0',
    totalSize: 156.4,
    downloadedSize: 0,
    speed: 0,
    status: 'paused',
    description: '弹幕体验优化，播放器性能提升。',
    icon: '📺',
  },
];

export const useDownloadManager = (initialApps: AppItem[] = INITIAL_APPS) => {
  const [apps, setApps] = useState<AppItem[]>(initialApps);
  const [concurrency, setConcurrency] = useState<number>(2);

  // ==========================================
  // 模拟下载进度的核心逻辑 (后续可替换为真实 API 或 WebSocket)
  // ==========================================
  useEffect(() => {
    const interval = setInterval(() => {
      setApps((currentApps) => {
        let currentActive = currentApps.filter(a => a.status === 'downloading').length;
        const nextApps = [...currentApps];
        
        for (let i = 0; i < nextApps.length; i++) {
          const app = { ...nextApps[i] };
          
          if (app.status === 'pending' && currentActive < concurrency) {
            app.status = 'downloading';
            currentActive++;
          }
          
          if (app.status === 'downloading') {
            // 模拟随机下载速度 (5 ~ 25 MB/s)
            const currentSpeed = Math.random() * 20 + 5; 
            // 定时器是 500ms 触发一次，所以每次增加大小为 速度 / 2
            const increment = currentSpeed / 2; 
            app.downloadedSize += increment;
            app.speed = currentSpeed;
             
            if (app.downloadedSize >= app.totalSize) {
              app.downloadedSize = app.totalSize;
              app.speed = 0;
              app.status = 'completed';
              currentActive--;
            }
          } else {
            app.speed = 0;
          }
          
          nextApps[i] = app;
        }
        return nextApps;
      });
    }, 500);
    
    return () => clearInterval(interval);
  }, [concurrency]);

  // ==========================================
  // 外部暴露的控制方法
  // ==========================================
  const startAll = () => {
    setApps(apps.map(app => 
      app.status === 'paused' ? { ...app, status: 'pending' } : app
    ));
  };

  const pauseAll = () => {
    setApps(apps.map(app => 
      (app.status === 'pending' || app.status === 'downloading') 
        ? { ...app, status: 'paused' } 
        : app
    ));
  };

  const toggleStatus = (id: string) => {
    setApps(apps.map(app => {
      if (app.id !== id) return app;
      if (app.status === 'completed') return app;
      
      if (app.status === 'paused') {
        return { ...app, status: 'pending' };
      } else {
        return { ...app, status: 'paused' };
      }
    }));
  };

  return {
    apps,
    concurrency,
    setConcurrency,
    startAll,
    pauseAll,
    toggleStatus
  };
};
