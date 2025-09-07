import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { routes } from './routes';
import { PageWrapper as Pa } from './components/PageWrapper';

function App() {
  const location = useLocation();
  const currentRoute = routes.find((r) => r.path === location.pathname);

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* 背景层动画 */}
      <AnimatePresence mode="sync">
        {currentRoute && (
          <motion.div
            key={location.pathname + '-bg'}
            className={currentRoute.bgClass}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: -1,
            }}
          />
        )}
      </AnimatePresence>

      {/* 页面内容动画 */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={<Pa>{route.element}</Pa>} // 内容动画不带背景
              index={route.index}
            />
          ))}
        </Routes>
      </AnimatePresence>
    </main>
  );
}

export default App;
