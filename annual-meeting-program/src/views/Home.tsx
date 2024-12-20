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
          <div className="party-center">
            <div>请扫码进行答题</div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
