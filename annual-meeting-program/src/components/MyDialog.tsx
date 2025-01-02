import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "../styles/components/dialog.scss";
const MyDialog = ({ isOpen, onClose, message }: any) => {
  useEffect(() => {
    // 当对话框打开时，禁用页面滚动
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  // 点击背景或确认按钮时关闭对话框
  const handleBackdropClick = () => {
    onClose();
  };

  return ReactDOM.createPortal(
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <p>{message}</p>
          <button onClick={onClose}>确认</button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default MyDialog;
