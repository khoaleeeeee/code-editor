import { React, useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, get } from "firebase/database";
import ChatWindow from "../../components/chat-window";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Selection from "../../components/drop-selection";
import "./style.css";
import firebaseConfig from "../../config";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const languageList = ["Vietnamese", "English"];

const sendMessageFirebase = (user, message, response, time) => {
  push(ref(database, `users/${user}/messages`), {
    message: message,
    response: response,
    time: time,
  })
    .then()
    .catch((error) => {
      console.error("Error pushing data to Firebase Realtime Database:", error);
    });
};

const getMessagesFirebase = (user) => {
  const dbRef = ref(database, `users/${user}/messages/`);
  return get(dbRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (data) {
          const messageList = Object.keys(data).map((key) => ({
            message: data[key].message,
            response: data[key].response,
            time: data[key].time,
          }));
          return messageList;
        }
      } else {
        console.log("No data available");
        return [];
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

function AIAssistant() {
  const [audioResponse, setAudioResponse] = useState(true);
  const [selectedLang, setSelectedLang] = useState("English");
  return (
    <div className="chat-window-container">
      <div className="setting-bar">
        {audioResponse && (
          <Selection
            label={"Language"}
            optionList={languageList}
            onChange={setSelectedLang}
          />
        )}
        <div className="space" style={{ width: "2em" }}></div>
        <FormControlLabel
          control={<Switch defaultChecked />}
          label={<span style={{ color: "white" }}>Voice Response</span>}
          checked={audioResponse}
          onChange={() => {
            setAudioResponse(!audioResponse);
          }}
        />
      </div>
      <div className="chat-window-wrapper">
        <ChatWindow
          sendMessageFirebase={sendMessageFirebase}
          getMessagesFirebase={getMessagesFirebase}
          selectedLang={selectedLang}
          audioResponse={audioResponse}
        />
      </div>
    </div>
  );
}

export default AIAssistant;
