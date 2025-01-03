import React from "react";
import "../styles/home.scss";
type Props = {};

const Home = (props: Props) => {
  // const navigate = useNavigate();
  // const toBegin = () => {
  //   navigate("/result", { state: { resultParam: "请扫码答下一题！" } });
  // };

  return (
    <>
      <main className="party-main">
        <div className="result-header"></div>
        <div className="wait-bg">
          <div className="blue-bg"></div>
          <div
            className="dialog-bg"
            // style={
            //   resultParam > 0
            //     ? {
            //         backgroundImage: "url(../../public/assets/ok-bg.jpg)",
            //       }
            //     : { backgroundImage: "url(../../public/assets/abandon-bg.jpg)" }
            // }
          ></div>
          <div className="next-question"></div>
          <div className="result-footer">
            <img className="logo" src="/assets/logo-white.png" alt=""></img>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
