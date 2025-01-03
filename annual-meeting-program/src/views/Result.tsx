import React, { useEffect } from "react";
import "../styles/result.scss";
import { useLocation } from "react-router-dom";
import useWindowSize from "../hooks/useWindowSize";
type Props = {};

const Result = (props: Props) => {
  const location = useLocation();
  const { resultParam } = location.state || {};
  const windowSize = useWindowSize();

  return (
    <>
      <main className="party-main">
        <div className="result-header"></div>
        <div className="wait-bg">
          {/* <div className="blue-bg"></div> */}
          <div
            className="dialog-bg"
            style={
              resultParam > 0
                ? {
                    backgroundImage: "url(/assets/ok-dialog.png)",
                  }
                : { backgroundImage: "url(/assets/abandon-dialog.png)" }
            }
          ></div>
          <div
            className={
              windowSize?.depthWidthRatio < 1.8
                ? "next-question near"
                : "next-question"
            }
          ></div>
          <div
            className={
              windowSize?.depthWidthRatio < 1.8
                ? "result-footer near"
                : "result-footer"
            }
          >
            <img className="logo" src="/assets/logo-white.png" alt=""></img>
          </div>
        </div>
      </main>
    </>
  );
};

export default Result;
