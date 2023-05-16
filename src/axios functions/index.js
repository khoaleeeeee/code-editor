import axios from "axios";

export async function getFixedCode(code) {
  try {
    const response = await axios.post("http://localhost:8080/python-fixer", {
      code: code,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching fixed code:", error);
    return "Error fetching response. Try again later.";
  }
}

export async function getExplaination(code) {
  try {
    const response = await axios.post("http://localhost:8080/explain-code", {
      code: code,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching fixed code:", error);
    return "Error fetching response. Try again later.";
  }
}

export async function getAssistantAnswer(requestList) {
  try {
    const response = await axios.post("http://localhost:8080/assistant", {
      requestList: requestList,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching fixed code:", error);
    return "I'm sorry! I'm unable to answer now. Please try again later.";
  }
}

export async function transcribeAudioViet(audioStream) {
  console.log("transcribe audio");
  try {
    if (!audioStream) {
      console.error("No audio stream available");
      return;
    }
    const audioFormat = "mp3";
    const formData = new FormData();
    formData.append("audio", audioStream, `audio.${audioFormat}`);

    const response = await axios.post(
      "http://localhost:8080/transcribe-vi",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "text",
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function transcribeAudioEng(audioStream) {
  try {
    if (!audioStream) {
      console.error("No audio stream available");
      return;
    }
    const audioFormat = "mp3";
    const formData = new FormData();
    formData.append("audio", audioStream, `audio.${audioFormat}`);

    const response = await axios.post(
      "http://localhost:8080/transcribe-en",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "text",
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
