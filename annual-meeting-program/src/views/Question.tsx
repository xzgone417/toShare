import React, { useEffect, useState } from "react";
import "../styles/question.scss";
import questionJsonFile from "../json/question.json";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getFetch, jsonFetch } from "../utils/fetchRequest";

type Props = {};
const questionJson = questionJsonFile as any;
const Question = (props: Props) => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [optionList, setOptionList] = useState(["鸭和鹅", "天鹅", "鸡"]);
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionTag, setQuestionTag] = useState(0);
  const [initDuration, setInitDuration] = useState(0); // 初始化状态
  const [duration, setDuration] = useState(0); // 初始化状态
  const [option, setOption] = useState(0); // 初始化状态

  const toBegin = async (params: any) => {
    const res = await jsonFetch(
      {
        headers: {},
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
    console.log("🚀XZG ~ toBegin ~ res:", res);
  };
  const postOption = async (params: any) => {
    if (!option || option <= 0) {
      console.log("请选一项");
      return;
    }
    const queryParams = new URLSearchParams(location.search);
    const userNameFromQuery = queryParams.get("userName") || "test"; // 获取名为 'myParam' 的查询参数
    const res = await jsonFetch(
      {
        headers: {},
        url: `/choose?userName=${userNameFromQuery}`,
        signal: params.signal,
      },
      { questionID: questionTag, option: option },
      {
        onError: () => {},
      }
    );
    console.log("🚀XZG ~ postOption ~ res:", res);
    // if (res.code === 0) {

    // }
  };
  const selectOption = async (params: any) => {
    setOption(params);
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
    const controller = new AbortController();
    const { signal } = controller;
    let timerId: any = null;
    const getTime = async () => {
      const res = await getFetch(
        {
          headers: {},
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
  }, [questionTag]);

  useEffect(() => {
    if (initDuration > 0) {
      // 使用AbortController来提供一个取消定时器的机制
      const controller = new AbortController();

      const timerId = setTimeout(() => {
        clearInterval(intervalId);
        navigate("/result", { replace: true });
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
      const userNameFromQuery = queryParams.get("userName") || "test";
      const res = await getFetch(
        {
          headers: {},
          url: "/get/option",
          signal: signal,
        },
        { questionID: questionTag, userName: userNameFromQuery },
        {
          onError: () => {},
        }
      );
      if (res > 0) {
        setOption(res);
      }
    };
    if (questionTag > 0 && initDuration > 0) {
      getOption();
    }
  }, [initDuration, location.search, questionTag]);
  return (
    <main className="party-main">
      <div className="party-bg">
        <div className="top-bg"></div>
        <div className="question-body">
          <div className="countdown-container" onClick={toBegin}>
            <div className="countdown-title">倒计时</div>
            <div className="countdown-circle">{duration}</div>
          </div>
          <section className="question-section">
            <p className="question-tag">问题{questionTag}</p>
            <p className="question-title">{questionTitle}</p>
          </section>
          <section className="option-section">
            {optionList.map((item, index) => (
              <button
                className={
                  option === index + 1
                    ? "option-button selected"
                    : "option-button"
                }
                key={JSON.stringify(item)}
                onClick={() => {
                  selectOption(index + 1);
                }}
              >
                {item}
              </button>
            ))}
          </section>
        </div>
      </div>

      <div className="submit-button-container">
        <button className="submit-button" onClick={postOption}>
          提交
        </button>
      </div>
    </main>
  );
};

export default Question;
