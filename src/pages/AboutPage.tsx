// src/pages/AboutPage.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Play,
  Pause,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Settings2,
  RefreshCw,
  ArrowLeft,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useDownloadManager } from '../hooks/useDownloadManager';

const About = () => {
  const router = useNavigate();
  const {
    apps,
    concurrency,
    setConcurrency,
    startAll: handleStartAll,
    pauseAll: handlePauseAll,
    toggleStatus: toggleAppStatus,
  } = useDownloadManager();

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Helper functions for formatting
  const formatSize = (mb: number) => {
    if (mb >= 1024) return `${(mb / 1024).toFixed(2)} GB`;
    return `${mb.toFixed(1)} MB`;
  };

  const formatSpeed = (speed: number) => {
    return `${speed.toFixed(1)} MB/s`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 py-10 px-4 md:px-8 overflow-auto">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router(-1)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors backdrop-blur-md"
            >
              <ArrowLeft className="w-6 h-6 text-slate-400" />
            </button>
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                更新管理中心
              </h1>
              <p className="text-slate-400 mt-1 text-sm">管理您的应用下载与更新进度</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4 bg-slate-900/80 p-3 md:p-4 rounded-2xl border border-white/5 backdrop-blur-xl">
            <div className="flex items-center gap-3 px-2">
              <label className="text-sm text-slate-400 font-medium flex items-center gap-2">
                <Settings2 className="w-4 h-4" />
                并发数
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={concurrency}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val)) setConcurrency(val);
                  }}
                  onBlur={() => {
                    if (concurrency < 1) setConcurrency(1);
                    if (concurrency > 10) setConcurrency(10);
                  }}
                  className="w-16 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-center text-sm font-semibold text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>
            <div className="hidden md:block h-8 w-px bg-slate-800"></div>
            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={handleStartAll}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg text-sm font-medium transition-colors border border-indigo-500/20"
              >
                <Play className="w-4 h-4" /> 全部开始
              </button>
              <button
                onClick={handlePauseAll}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-sm font-medium transition-colors border border-rose-500/20"
              >
                <Pause className="w-4 h-4" /> 全部暂停
              </button>
            </div>
          </div>
        </div>

        {/* List Section */}
        <div className="space-y-4">
          <AnimatePresence>
            {apps.map((app) => {
              const progress = Math.min(
                100,
                Math.max(0, (app.downloadedSize / app.totalSize) * 100)
              );
              const isExpanded = expandedIds.has(app.id);

              return (
                <motion.div
                  key={app.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-slate-900/60 backdrop-blur-lg border rounded-2xl p-4 md:p-5 overflow-hidden transition-all duration-300 ${
                    app.status === 'downloading'
                      ? 'shadow-[0_0_30px_-5px_rgba(99,102,241,0.15)] border-indigo-500/30'
                      : 'border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 md:gap-4">
                    {/* Icon & Info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 flex items-center justify-center text-2xl md:text-3xl shadow-inner">
                        {app.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <h3 className="text-base md:text-lg font-bold text-slate-100 truncate">
                            {app.name}
                          </h3>
                          <span className="shrink-0 text-[10px] md:text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                            {app.version}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-1 md:mt-1.5 text-xs md:text-sm">
                          <div className="text-slate-400">
                            {formatSize(app.downloadedSize)} / {formatSize(app.totalSize)}
                          </div>

                          {/* Status Badge & Speed */}
                          <div className="flex items-center gap-2">
                            {app.status === 'downloading' && (
                              <span className="flex items-center gap-1 md:gap-1.5 text-indigo-400 font-medium">
                                <RefreshCw className="w-3 md:w-3.5 h-3 md:h-3.5 animate-spin" />
                                {formatSpeed(app.speed)}
                              </span>
                            )}
                            {app.status === 'pending' && (
                              <span className="text-amber-400 font-medium flex items-center gap-1">
                                <RefreshCw className="w-3 h-3 md:w-3.5 md:h-3.5" /> 等待中
                              </span>
                            )}
                            {app.status === 'paused' && (
                              <span className="text-slate-500 font-medium">已暂停</span>
                            )}
                            {app.status === 'completed' && (
                              <span className="text-emerald-400 font-medium flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 md:w-3.5 md:h-3.5" /> 已完成
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 md:gap-3 shrink-0">
                      <button
                        onClick={() => toggleExpand(app.id)}
                        className="p-1.5 md:p-2 rounded-full hover:bg-slate-800 text-slate-400 transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 md:w-5 md:h-5" />
                        ) : (
                          <ChevronDown className="w-4 h-4 md:w-5 md:h-5" />
                        )}
                      </button>

                      {app.status !== 'completed' && (
                        <button
                          onClick={() => toggleAppStatus(app.id)}
                          className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all ${
                            app.status === 'downloading' || app.status === 'pending'
                              ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                              : 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25'
                          }`}
                        >
                          {app.status === 'downloading' || app.status === 'pending' ? (
                            <Pause className="w-3 h-3 md:w-4 md:h-4 fill-current" />
                          ) : (
                            <Play className="w-3 h-3 md:w-4 md:h-4 fill-current ml-0.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4 md:mt-5 mb-1 md:mb-2 relative h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className={`absolute top-0 left-0 h-full rounded-full ${
                        app.status === 'completed'
                          ? 'bg-emerald-500'
                          : app.status === 'paused'
                            ? 'bg-slate-500'
                            : 'bg-gradient-to-r from-indigo-500 to-cyan-400'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
                    />
                  </div>

                  {/* Expandable Description */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 md:mt-4 p-3 md:p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                          <h4 className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 md:mb-2">
                            更新说明
                          </h4>
                          <div className="text-xs md:text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                            {app.description}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default About;
