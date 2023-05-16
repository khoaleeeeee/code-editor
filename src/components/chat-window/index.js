import React, { useState, useRef, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { useSpeechSynthesis } from "react-speech-kit";
import TextField from "@mui/material/TextField";
import SendIcon from "@mui/icons-material/Send";
import PersonIcon from "@mui/icons-material/Person";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { getAssistantAnswer } from "../../axios functions";
import SyncLoader from "react-spinners/SyncLoader";
import AudioRecorder from "../../audio recorder/audio-recorder";
import CodeBlock from "../codeblock";

import "./style.css";

const MyTextField = styled(TextField)({
  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
    borderColor: "#3a3f4d",
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#363b45",
  },
  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#363b45",
  },
});

let date = new Date();

function ChatWindow({
  sendMessageFirebase,
  getMessagesFirebase,
  audioResponse,
  selectedLang,
}) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState([]);
  const [disable, setDisable] = useState(false);
  // requests array to be sent to the server
  const [requests, setRequests] = useState([]);
  const messageFeedRef = useRef(null);
  const { speak, cancel, speaking, supported, voices } = useSpeechSynthesis();

  const fetchMessages = () => {
    getMessagesFirebase("Khoa").then((data) => {
      const messages = [];
      const responses = [];
      const requests = [];

      data.forEach(({ message, response, time }) => {
        messages.push({ text: message, sender: "Khoa", time: time });
        responses.push({ response });

        if (requests.length < 9) {
          requests.push({ role: "user", content: message });
          requests.push({ role: "assistant", content: response });
        }
      });
      setMessages(messages);
      setResponses(responses);
      setRequests(requests);
    });
  };

  useEffect(() => {
    messageFeedRef.current.scrollTop = messageFeedRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const onChangeInput = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    let formattedTime = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    console.log(formattedTime);

    if (message !== "") {
      setMessages([
        ...messages,
        { text: message, sender: "Khoa", time: formattedTime },
      ]);

      const newRequest = [...requests];
      newRequest.push({ role: "user", content: message });

      if (requests.length > 9) {
        newRequest.splice(0, 2);
      }

      setRequests(newRequest);
      setMessage("");
      setDisable(true);

      getAssistantAnswer(newRequest).then((response) => {
        setResponses([...responses, { response: response }]);
        // add the request to the requests array
        setRequests([...requests, { role: "assistant", content: response }]);
        setDisable(false);
        if (audioResponse) {
          switch (selectedLang) {
            case "English":
              speak({ text: response, voice: voices[0], rate: 0.9, pitch: 1 });
              break;
            case "Vietnamese":
              speak({ text: response, voice: voices[74], rate: 1, pitch: 1 });
              break;
            default:
              break;
          }
        }
        sendMessageFirebase("Khoa", message, response, formattedTime);
      });
    }
  };

  const handleOnEnterKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSendMessage(e);
    } else if (e.key === "Enter" && e.shiftKey) {
      e.target.value += "";
    }
  };

  return (
    <div className="chat-window">
      <div className="message-feed" ref={messageFeedRef}>
        {messages.length === 0 && (
          <div className="empty-message">
            <h3>Start your conversation now!</h3>
          </div>
        )}

        {messages.map((message, index) => (
          <div className="message-response-container" key={index}>
            <div className="message-container">
              <div className="icon-text">
                <PersonIcon />
                <div className={`message me`}>
                  <p className="time-send">{message.time}</p>
                  <p>
                    <CodeBlock text={message.text} />
                  </p>
                </div>
              </div>
            </div>

            {responses[index]?.response ? (
              <div className="response-container">
                <div className={`message sender`}>
                  <p>
                    <CodeBlock text={responses[index].response} />
                  </p>
                </div>
                <SmartToyIcon />
              </div>
            ) : (
              <div className="response-container">
                <div className={`message sender`}>
                  <SyncLoader
                    color="#657288"
                    size={10}
                    margin={2}
                    speedMultiplier={0.7}
                  />
                </div>
                <SmartToyIcon />
              </div>
            )}
          </div>
        ))}
      </div>
      <form className="message-input">
        <MyTextField
          id="filled-chat"
          fullWidth={true}
          value={message}
          multiline
          disabled={disable}
          onChange={onChangeInput}
          onKeyDown={handleOnEnterKey}
          InputProps={{
            style: { color: "white", padding: "0.5em", whiteSpace: "pre-wrap" },
          }}
        />
        <AudioRecorder
          setMessage={setMessage}
          disable={disable}
          setDisable={setDisable}
          selectedLang={selectedLang}
        />

        <button type="send-btn" disable={disable}>
          <SendIcon onClick={handleSendMessage} />
        </button>
      </form>
    </div>
  );
}

export default ChatWindow;
