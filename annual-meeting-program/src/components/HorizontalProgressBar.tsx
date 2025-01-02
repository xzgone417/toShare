import React, { useState, useEffect } from "react";
import "../styles/components/progress.scss"; // 假设样式文件已更改

interface HorizontalProgressBarProps {
  totalDuration: number; // 总时长，单位：秒
}

const HorizontalProgressBar: React.FC<HorizontalProgressBarProps> = ({
  totalDuration,
}) => {
  const [progress, setProgress] = useState(0);
  const intervalDuration = 100; // 每0.1秒更新一次

  useEffect(() => {
    const intervalId = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + intervalDuration / 1000;
        if (newProgress >= totalDuration) {
          clearInterval(intervalId);
        }
        return newProgress;
      });
    }, intervalDuration);

    return () => clearInterval(intervalId);
  }, [totalDuration]);

  // 计算当前进度百分比
  const percentage = (progress / totalDuration) * 100;

  // 底层进度条样式
  const progressFillStyle = {
    width: "100%",
    height: "100%",
    backgroundColor: "#2bf794", // 始终保持黄色
    position: "relative" as "relative", // 确保子元素绝对定位相对于此元素
  };

  // 白色覆盖层的样式，初始时覆盖整个进度条，随着进度减少覆盖区域
  const whiteOverlayStyle = {
    width: `${percentage}%`, // 根据进度百分比设置覆盖层宽度
    height: "100%",
    backgroundColor: "#868686",
    position: "absolute" as "absolute",
    top: 0,
    right: 0, // 从右向左减少
  };
  // 进度条的颜色变化逻辑
  const progressColor = percentage >= 90 ? "#fb4a3e" : "#2bf794"; // 90% 之后变为红色

  return (
    <div className="horizontal-progress-container">
      <div
        className="progress-fill"
        style={{ ...progressFillStyle, backgroundColor: progressColor }}
      >
        <div className="white-overlay" style={whiteOverlayStyle} />
      </div>
    </div>
  );
};

export default HorizontalProgressBar;
