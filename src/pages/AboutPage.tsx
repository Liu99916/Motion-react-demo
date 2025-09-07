// src/pages/AboutPage.tsx

import { useNavigate } from 'react-router-dom';

const About = () => {
  const router = useNavigate();

  return (
    <div className="overflow-auto">
      <h1>欢迎来到about</h1>
      <p className="">这是使用 TypeScript 和 React Router 构建的现代化 React 应用。</p>
      <button className="cursor-pointer block text-[30px]" onClick={() => router(-1)}>
        返回首页
      </button>
    </div>
  );
};

export default About;
