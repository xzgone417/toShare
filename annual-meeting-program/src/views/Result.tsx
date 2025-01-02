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
        <div
          className="wait-bg"
          style={
            resultParam > 0
              ? {
                  backgroundImage: "url(https://timish.woa.com/assets/ok-bg.jpg)",
                }
              : { backgroundImage: "url(https://timish.woa.com/assets/abandon-bg.jpg)" }
          }
        >
          <div className="next-question"></div>
        </div>
      </main>
    </>
  );
};

export default Result;
