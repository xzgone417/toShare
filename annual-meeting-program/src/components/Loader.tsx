// src/components/Loader.tsx
import React from "react";
import ReactDOM from "react-dom";
import "../styles/components/loader.scss";

const Loader: React.FC = () => {
  return ReactDOM.createPortal(
    <div className="loader-page">
      <div className="container">
        <div className="ring"></div>
        <div className="ring"></div>
        <div className="ring"></div>
        <div className="ring"></div>
        <div className="h3">Loading</div>
      </div>
    </div>,
    document.body
  );
};

export default Loader;
