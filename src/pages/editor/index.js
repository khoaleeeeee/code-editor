import CodeMirror from "@uiw/react-codemirror";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import Selection from "../../components/drop-selection";
import { useState } from "react";
import VerticalSplitIcon from "@mui/icons-material/VerticalSplit";
import BugReportIcon from "@mui/icons-material/BugReport";
import TagIcon from "@mui/icons-material/Tag";
import "./style.css";

const getFixedCode = require("../../axios functions").getFixedCode;
const getExplaination = require("../../axios functions").getExplaination;

function Editor() {
  const pythonInitial = "print('Hello World')";
  const JSInitial = "console.log('Hello World')";
  const [theme, setTheme] = useState("Dark");
  const [size, setSize] = useState("14");
  const [lang, setLangue] = useState("Python");
  const [isSplit, setIsSplit] = useState(false);
  const [getCode, setCode] = useState(
    lang === "JavaScript" ? JSInitial : pythonInitial
  );
  const [response, setResponse] = useState("");

  function formatString(value) {
    //format string value to replace all the \n with /\n/g and replace " with \"
    //return the formatted string
    return value.replace(/\n/g, "\n").replace(/"/g, '\\"');
  }

  function generateFixedCode() {
    setIsSplit(true);
    if (lang !== "Python") {
      setResponse("This feature is only available for Python");
    } else {
      console.log("generating fixed code");
      setResponse("Loading...");
      getFixedCode(getCode).then((data) => {
        setResponse(data);
      });
    }
  }

  function genrateExplaination() {
    setIsSplit(true);
    setResponse("Loading...");
    getExplaination(getCode).then((data) => {
      setResponse(data);
    });
  }

  return (
    <div className="main-editor-container">
      <div className="options">
        <Selection
          label="Theme"
          optionList={["Dark", "Light"]}
          onChange={(selectedTheme) => setTheme(selectedTheme)}
        />

        <Selection
          label="Font Size"
          optionList={Array.from({ length: 17 }, (_, n) => n + 14)}
          onChange={(selectedSize) => setSize(selectedSize)}
        />

        <Selection
          label="Language"
          optionList={["JavaScript", "Python"]}
          onChange={(selectedLang) => setLangue(selectedLang)}
        />

        <button
          className="optionControlBtn"
          onClick={() => {
            setIsSplit(!isSplit);
          }}
        >
          <VerticalSplitIcon style={{ fontSize: "3.5em" }} />
        </button>

        <button className="optionControlBtn">
          <BugReportIcon
            style={{ fontSize: "3.5em" }}
            onClick={generateFixedCode}
          />
        </button>

        <button className="optionControlBtn">
          <TagIcon
            style={{ fontSize: "3.5em" }}
            onClick={genrateExplaination}
          />
        </button>
      </div>
      <div className="editor-wrapper-container">
        <div className="editor-wrapper">
          <CodeMirror
            onChange={(value, viewUpdate) => {
              setCode(value);
            }}
            value={lang === "Python" ? pythonInitial : JSInitial}
            height="70vh"
            theme={theme === "Dark" ? githubDark : githubLight}
            extensions={
              lang === "Python"
                ? [python({ jsx: true })]
                : [javascript({ jsx: true })]
            }
            style={{ fontSize: `${size}px` }}
          />
        </div>

        {isSplit && (
          <div className="editor-wrapper">
            <CodeMirror
              value={response}
              minHeight="500px"
              theme={theme === "Dark" ? githubDark : githubLight}
              style={{ fontSize: `${size}px` }}
              readOnly={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}
export default Editor;
