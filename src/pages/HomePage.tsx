// src/pages/Home/index.tsx
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="page-container text-white">
      <h1>欢迎来到首页</h1>
      <p>这是使用 TypeScript 和 React Router 构建的现代化 React 应用。</p>
      <Link to="/about" className="nav-link text-4xl">
        了解更多 --
      </Link>
      <Link to="/login" className="nav-link text-4xl">
        -- 登录
      </Link>
    </div>
  );
};

export default Home;
