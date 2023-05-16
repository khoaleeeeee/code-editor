import React from "react";
import "./style.css";
import { PulseLoader } from "react-spinners";

export default function LoadingWindow(loading) {
  return (
    <div>
      <div className="error_page_background">
        <div className="loading_spinner_center">
          <PulseLoader color={"white"} loading={loading} size={25} />
        </div>
      </div>
    </div>
  );
}
