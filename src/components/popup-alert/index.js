import React from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

export default function PopupAlert({
  setCannotFind,
  message_1,
  message_2,
  toSignIn,
  success,
}) {
  const navigate = useNavigate();

  const url_1 = "https://cdn-icons-png.flaticon.com/512/845/845646.png";
  const url_2 = "https://cdn-icons-png.flaticon.com/512/595/595067.png";
  return (
    <div className="cannot_find_wrapper">
      <div className="error_page_background"></div>
      <div className="error_box">
        <div className="error_box_content">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1828/1828665.png"
            alt=""
            className="cross_close"
            onClick={() => setCannotFind(false)}
          />
          <img src={success ? url_1 : url_2} alt="" className="error_icon" />
          <span style={{ margin: "0.5rem", marginBottom: "0px" }}>
            {message_1}
          </span>
          <span style={{ margin: "0.5rem" }}>{message_2}</span>
          <button
            className="black_long_btn"
            onClick={() => {
              if (toSignIn) {
                navigate("/signin");
              } else {
                setCannotFind(false);
              }
            }}
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
}
