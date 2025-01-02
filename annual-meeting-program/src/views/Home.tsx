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
        <div className="wait-bg">
          {/* <div className="party-center">
            <div>{resultParam}</div>
          </div>
          <p className="wait-text">请等待扫描下一题</p> */}
        </div>
      </main>
    </>
  );
};

export default Home;
