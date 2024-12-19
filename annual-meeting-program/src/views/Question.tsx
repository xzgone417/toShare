import React, { useEffect, useState } from "react";
import "../styles/question.scss";
import questionJsonFile from "../json/question.json";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getFetch, jsonFetch } from "../utils/fetchRequest";
import CircularProgressBar from "../components/CircularProgressBar";
import { motion } from "framer-motion";
import MyDialog from "../components/MyDialog";
type Props = {};
const questionJson = questionJsonFile as any;
const Question = (props: Props) => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [optionList, setOptionList] = useState([] as any[]);
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionTag, setQuestionTag] = useState(0);
  const [initDuration, setInitDuration] = useState(0); // 初始化状态
  const [duration, setDuration] = useState(0); // 初始化状态
  const [selectedOption, setSelectedOption] = useState(0); // 初始化状态
  const [isModalOpen, setModalOpen] = useState(false);
  const [headerJsonMap, setHeaderJsonMap] = useState("");
  const toBegin = async (params: any) => {
    const res = await jsonFetch(
      {
        headers: { headerJsonMap: headerJsonMap },
        url: "/begin",
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
    if (!selectedOption || selectedOption <= 0) {
      setModalOpen(true);
      return;
    }
    const queryParams = new URLSearchParams(location.search);
    const userNameFromQuery = queryParams.get("userName") || "1"; // 获取名为 'myParam' 的查询参数
    const res = await jsonFetch(
      {
        headers: { headerJsonMap: headerJsonMap },
        url: `/choose?userName=${userNameFromQuery}`,
        signal: params.signal,
      },
      { questionID: questionTag, option: selectedOption },
      {
        onError: () => {},
      }
    );
    console.log("🚀XZG ~ postOption ~ res:", res);
    navigate("/result", { state: { resultParam: "答题完成！" } });
    // if (res.code === 0) {

    // }
  };
  const toSelectOption = async (params: any) => {
    setSelectedOption(params);
  };

  useEffect(() => {
    for (const keying in questionJson) {
      if (Object.prototype.hasOwnProperty.call(questionJson, keying)) {
        const element = questionJson[keying] as any;
        if (questionId?.includes(element.id)) {
          setOptionList(element.options);
          setQuestionTitle(element.title);
          setQuestionTag(element.id);
        }
      }
    }
  }, [questionId]);
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    let codeFromQuery = queryParams.get("code") || ""; // 获取名为 'myParam' 的查询参数
    if (!codeFromQuery || codeFromQuery === "") {
      codeFromQuery = localStorage.getItem(codeFromQuery) + "";
    }
    setHeaderJsonMap(codeFromQuery);
    if (codeFromQuery) {
      localStorage.setItem("codeFromQuery", codeFromQuery);
    }
  }, [location.search]);
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    let timerId: any = null;
    const getTime = async () => {
      const res = await getFetch(
        {
          headers: { headerJsonMap: headerJsonMap },
          url: "/get/time",
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
      }
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
  }, [headerJsonMap, questionTag]);

  useEffect(() => {
    if (initDuration > 0) {
      // 使用AbortController来提供一个取消定时器的机制
      const controller = new AbortController();

      const timerId = setTimeout(() => {
        clearInterval(intervalId);
        navigate("/result", { state: { resultParam: "您已放弃作答！" } });
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
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    const getOption = async () => {
      const queryParams = new URLSearchParams(location.search);
      const userNameFromQuery = queryParams.get("userName") || "";
      const res = await getFetch(
        {
          headers: { headerJsonMap: headerJsonMap },
          url: "/get/option",
          signal: signal,
        },
        { questionID: questionTag, userName: userNameFromQuery },
        {
          onError: () => {},
        }
      );
      if (res > 0) {
        setSelectedOption(res);
      }
    };
    if (questionTag > 0 && initDuration > 0) {
      getOption();
    }
  }, [headerJsonMap, initDuration, location.search, questionTag]);
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
          <div className="top-bg"></div>
          <div className="question-body">
            <div className="countdown-container">
              <CircularProgressBar
                totalDuration={initDuration}
                radius={50}
              ></CircularProgressBar>
            </div>

            <section className="question-section">
              <p className="question-tag">问题{questionTag}</p>
              <p className="question-title">{questionTitle}</p>
            </section>
            <section className="option-section">
              {optionList.map((item, index) => (
                <div
                  className={
                    selectedOption === index + 1
                      ? "option-button selected"
                      : "option-button"
                  }
                  key={JSON.stringify(item)}
                  onClick={() => {
                    toSelectOption(index + 1);
                  }}
                >
                  <div className="option-idx">{item?.idx}</div>
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
            >
              提交
            </button>
          </div>
        </motion.div>
      )}
      {initDuration <= 0 && (
        <div className="wait-bg">
          <div className="party-center">
            <div onClick={toBegin}>等待作答</div>
          </div>
          <p className="wait-text">请等待扫描下一题</p>
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
    </main>
  );
};

export default Question;
