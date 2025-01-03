import { useState, useEffect } from 'react';

function useWindowSize() {
  // 初始化state
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    depthWidthRatio: window.innerHeight / window.innerWidth
  });

  useEffect(() => {
    // 定义处理窗口大小变化的函数
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
        depthWidthRatio: window.innerHeight / window.innerWidth
      });
    }

    // 添加事件监听器
    window.addEventListener('resize', handleResize);

    // 清除事件监听器
    return () => window.removeEventListener('resize', handleResize);
  }, []); // 空依赖数组表示这个effect只在组件挂载时运行一次

  return windowSize;
}

export default useWindowSize;
