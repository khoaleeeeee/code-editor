import React, { useState, useRef } from "react";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import MicIcon from "@mui/icons-material/Mic";
import { transcribeAudioViet, transcribeAudioEng } from "../axios functions";

const AudioRecorder = ({ setMessage, selectedLang, disable, setDisable }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioStream, setAudioStream] = useState(null);
  const recorderRef = useRef(null);

  const startRecording = async (e) => {
    e.preventDefault();
    setMessage("");
    console.log("start recording...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
      const mediaRecorder = new MediaRecorder(stream);
      recorderRef.current = mediaRecorder;
      const chunks = [];

      mediaRecorder.addEventListener("dataavailable", (event) => {
        chunks.push(event.data);
      });

      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(chunks, { type: "audio/mp3" });
        setAudioStream(null);
        setIsRecording(false);
        try {
          setDisable(true);
          switch (selectedLang) {
            case "Vietnamese":
              transcribeAudioViet(audioBlob).then((data) => {
                setMessage(data.replace(/"/g, ""));
                setDisable(false);
              });
              break;
            case "English":
              transcribeAudioEng(audioBlob).then((data) => {
                setMessage(data.replace(/"/g, ""));
                setDisable(false);
              });
              break;
            default:
              break;
          }
        } catch (error) {
          console.error(error);
        }
      });

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error(error);
    }
  };

  const stopRecording = async (e) => {
    e.preventDefault();

    if (isRecording) {
      const mediaRecorder = recorderRef.current;
      if (mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
        console.log("stop recording...");
      }
      if (!audioStream) {
        console.log("no audio stream");
      }
    }
  };

  return (
    <div>
      {isRecording ? (
        <button onClick={stopRecording}>
          <RadioButtonCheckedIcon style={{ color: "red" }} />
        </button>
      ) : (
        <button onClick={startRecording} disabled={disable}>
          <MicIcon />
        </button>
      )}
    </div>
  );
};

export default AudioRecorder;
