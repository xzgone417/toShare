import React, { useEffect, useState } from "react";
import "../styles/question.scss";
import questionJsonFile from "../json/question.json";
import { useParams, useNavigate } from "react-router-dom";
import { getFetch, jsonFetch } from "../utils/fetchRequest";
import { motion } from "framer-motion";
import MyDialog from "../components/MyDialog";
import HorizontalProgressBar from "../components/HorizontalProgressBar";
import Loader from "../components/Loader";
type Props = {};
const questionJson = questionJsonFile as any;
const optionImages = [
  {
    selected: "https://timish.woa.com/assets/select-A.png",
    default: "https://timish.woa.com/assets/btn-A.png",
  },
  {
    selected: "https://timish.woa.com/assets/select-B.png",
    default: "https://timish.woa.com/assets/btn-B.png",
  },
  {
    selected: "https://timish.woa.com/assets/select-C.png",
    default: "https://timish.woa.com/assets/btn-C.png",
  },
];
const Question = (props: Props) => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  // const location = useLocation();
  const [optionList, setOptionList] = useState([] as any[]);
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionTag, setQuestionTag] = useState(0);
  const [initDuration, setInitDuration] = useState(0); // 初始化状态
  const [duration, setDuration] = useState(0); // 初始化状态
  const [selectedOption, setSelectedOption] = useState(0); // 初始化状态
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  const toBegin = async (params: any) => {
    await jsonFetch(
      {
        headers: {},
        url: "/annual/begin",
        signal: params.signal,
      },
      questionTag,
      {
        onError: () => {
          console.log("begin-error");
        },
      }
    );
  };
  const postOption = async (params: any) => {
    setIsLoading(true);
    if (!selectedOption || selectedOption <= 0) {
      setModalOpen(true);
      return;
    }
    await jsonFetch(
      {
        headers: {},
        url: `/annual/choose`,
        signal: params.signal,
      },
      { questionID: questionTag, option: selectedOption },
      {
        onError: () => {},
      }
    );
    setIsLoading(false);
    navigate("/result", { state: { resultParam: 1 } });
  };
  const toSelectOption = async (params: any) => {
    setSelectedOption(params);
  };

  const optionBtnStyle = (index: number) => {
    const idx = index - 1;
    return {
      backgroundImage: `url(${
        selectedOption === index
          ? optionImages[idx].selected
          : optionImages[idx].default
      })`,
      transition: "background-image 0.3s ease-in-out", // 添加过渡效果
      opacity: imageLoaded ? 1 : 0, // 根据图片加载状态设置透明度
    };
  };
  // 预加载所有图片
  useEffect(() => {
    optionImages.forEach((image) => {
      const img1 = new Image();
      img1.src = image.selected;
      const img2 = new Image();
      img2.src = image.default;
    });
    setImageLoaded(true); // 所有图片加载完成
  }, []);
  useEffect(() => {
    for (const keying in questionJson) {
      if (Object.prototype.hasOwnProperty.call(questionJson, keying)) {
        const element = questionJson[keying] as any;
        if (questionId && Number(questionId) === Number(element.id)) {
          setOptionList(element.options);
          setQuestionTitle(element.title);
          setQuestionTag(element.id);
        }
      }
    }
  }, [questionId]);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    let timerId: any = null;
    const getTime = async () => {
      let res = await getFetch(
        {
          headers: {},
          url: "/annual/get/time",
          signal: signal,
        },
        { questionID: questionTag },
        {
          onError: () => {},
        }
      );

      if (res > 0) {
        setDuration(res);
        setInitDuration(res);
        clearInterval(timerId);
        timerId = null;
        await getOption();
      } else {
        setIsLoading(false);
      }
    };
    const getOption = async () => {
      const res = await getFetch(
        {
          headers: {},
          url: "/annual/get/option",
          signal: signal,
        },
        { questionID: questionTag },
        {
          onError: () => {},
        }
      );
      if (res > 0) {
        navigate("/result", { state: { resultParam: 1 } });
      }
      setIsLoading(false);
    };
    if (questionTag > 0) {
      timerId = setInterval(() => {
        getTime();
      }, 1000);
    }

    return () => {
      controller.abort();
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [navigate, questionTag]);

  useEffect(() => {
    if (initDuration > 0) {
      // 使用AbortController来提供一个取消定时器的机制
      const controller = new AbortController();

      const timerId = setTimeout(() => {
        clearInterval(intervalId);
        navigate("/result", { state: { resultParam: 0 } });
      }, initDuration * 1000);

      // 设置一个每秒执行的interval，减少duration
      const intervalId = setInterval(() => {
        setDuration((prevDuration) => {
          if (prevDuration <= 0) {
            // 如果duration已经为0或负数，清除interval并返回0
            clearInterval(intervalId);
            return 0;
          }
          return prevDuration - 1; // 否则，每秒减少1000毫秒
        });
      }, 1000);

      // 组件卸载或duration改变时的清理函数
      return () => {
        clearTimeout(timerId);
        clearInterval(intervalId);
        controller.abort(); // 取消任何正在进行的操作
      };
    }
  }, [navigate, initDuration]);

  return (
    <main className="party-main">
      {initDuration > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="party-bg"
        >
          <div className="countdown-container">
            <HorizontalProgressBar
              totalDuration={initDuration}
            ></HorizontalProgressBar>
          </div>
          <div className="question-body">
            <section className="question-section">
              <div className="question-tag">问题{questionTag}</div>
              <div className="question-title">{questionTitle}</div>
            </section>
            <section className="option-section">
              {optionList.map((item, index) => (
                <div
                  className="option-button"
                  style={optionBtnStyle(index + 1)}
                  key={JSON.stringify(item)}
                  onClick={() => {
                    toSelectOption(index + 1);
                  }}
                >
                  <span className="option-name">{item?.name}</span>
                </div>
              ))}
            </section>
          </div>
          <div className="submit-button-container">
            <button
              className={
                selectedOption > 0 ? "submit-button selected" : "submit-button"
              }
              onClick={postOption}
            ></button>
          </div>
        </motion.div>
      )}
      {initDuration <= 0 && (
        <div className="wait-bg" onClick={toBegin}>
          {/* <div className="party-center" >
            <div >等待作答</div>
          </div>
          <p className="wait-text">请等待扫描下一题</p> */}
        </div>
      )}

      {isModalOpen && (
        <MyDialog
          isOpen={isModalOpen}
          onClose={() => {
            setModalOpen(false);
          }}
          message="请先选择一个选项！"
        />
      )}
      {isLoading && <Loader></Loader>}
    </main>
  );
};

export default Question;
