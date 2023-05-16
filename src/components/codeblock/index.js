import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = ({ text }) => {
  const codeBlock = text.match(/```(.*?)```/s);

  if (codeBlock) {
    return (
      <>
        {text.split(/```(.*?)```/s)[0]}
        <SyntaxHighlighter language="javascript" style={materialDark}>
          {codeBlock[1]}
        </SyntaxHighlighter>
        {text.split(/```(.*?)```/s)[2]}
      </>
    );
  }

  return text;
};

export default CodeBlock;
