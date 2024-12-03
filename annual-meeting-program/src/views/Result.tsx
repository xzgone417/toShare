import React from "react";
import "../styles/result.scss";
type Props = {};

const Result = (props: Props) => {
  return (
    <>
      <main className="party-main">
        <div className="party-bg">
          <div className="top-bg"></div>
          <div className="question-body">
            <div className="countdown-container"></div>
            答题结束
          </div>
        </div>

        <div className="submit-button-container"></div>
      </main>
    </>
  );
};

export default Result;
