import React, { useState } from "react";
import { useSpeechSynthesis } from "react-speech-kit";

function Example() {
  const [value, setValue] = useState("");
  const { speak, cancel, speaking, supported, voices } = useSpeechSynthesis();

  return (
    <div>
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <button
        onClick={() => {
          //   for (let i = 0; i < voices.length; i++) {
          //     console.log(i, voices[i].voiceURI);
          //   }
          speak({ text: value, voice: voices[0], rate: 0.9, pitch: 1 });
        }}
      >
        Speak
      </button>
    </div>
  );
}

export default Example;
