import React from "react";
import "../styles/result.scss";
import { useLocation } from "react-router-dom";
type Props = {};

const Result = (props: Props) => {
  const location = useLocation();
  const { resultParam } = location.state || {};
  return (
    <>
      <main className="party-main">
        <div className="wait-bg">
          <div className="party-center">
            <div>{resultParam}</div>
          </div>
          <p className="wait-text">请等待扫描下一题</p>
        </div>
      </main>
    </>
  );
};

export default Result;
