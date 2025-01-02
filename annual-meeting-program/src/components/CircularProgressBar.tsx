import React, { useState, useEffect } from "react";
import "../styles/components/circle.scss";

interface CircularProgressBarProps {
  totalDuration: number; // 总时长，单位：秒
  radius: number; // 圆的半径
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  totalDuration,
  radius,
}) => {
  const [progress, setProgress] = useState(0);
  const intervalDuration = 100; // 每0.1秒更新一次
  const strokeWidth = 10; // 线宽

  useEffect(() => {
    let intervalId: NodeJS.Timer | undefined;

    if (progress < totalDuration) {
      intervalId = setInterval(() => {
        setProgress((prevProgress) => prevProgress + intervalDuration / 1000); // 每次增加0.1秒
      }, intervalDuration);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [progress, totalDuration]);

  // 计算当前进度百分比
  const percentage = (progress / totalDuration) * 100;

  // 计算圆环的 strokeDasharray
  const circumference = 2 * Math.PI * radius; // 圆的周长
  const offset = circumference - (percentage / 100) * circumference; // 计算偏移量

  return (
    <div className="circular-progress-container">
      <svg
        className="circular-progress-svg"
        width={radius * 2 + strokeWidth} // 增加线宽
        height={radius * 2 + strokeWidth} // 增加线宽
        viewBox={`0 0 ${radius * 2 + strokeWidth} ${radius * 2 + strokeWidth}`} // 设置视口
      >
        <circle
          cx={radius + strokeWidth / 2} // 圆心位置调整
          cy={radius + strokeWidth / 2} // 圆心位置调整
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          stroke={percentage >= 80 ? "#fb4a3e" : "#ffd843"} // 背景圆环颜色
        />
        <circle
          cx={radius + strokeWidth / 2} // 圆心位置调整
          cy={radius + strokeWidth / 2} // 圆心位置调整
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          stroke={percentage >= 100 ? "#d6e1f5" : "#d6e1f5"} // 进度条颜色
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${radius + strokeWidth / 2} ${
            radius + strokeWidth / 2
          })`} // 旋转圆环
          style={{ transition: "stroke-dashoffset 0.1s linear" }} // 平滑过渡
        />
      </svg>
      <div className="timer">
        <div className="timer-text">倒计时</div>
        <div className="timer-number">
          {Math.ceil(totalDuration - progress)}
        </div>
      </div>
    </div>
  );
};

export default CircularProgressBar;
