// import React, { useState, useEffect } from "react";

// const TextToSpeech = (props: any) => {
//   const [utterance, setUtterance] = useState<any>(null);
//   const { text, handlePlay } = props;

//   useEffect(() => {
//     const synth = window.speechSynthesis;
//     const u = new SpeechSynthesisUtterance(text);

//     setUtterance(u);

//     return () => {
//       synth.cancel();
//     };
//   }, [text]);

//   const handlePlay = () => {
//     const synth = window.speechSynthesis;
//     synth.speak(utterance);
//   };
// };

// export default TextToSpeech;

import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";

interface TextToSpeechProps {
  text: string;
}

export interface TextToSpeechHandle {
  play: () => void;
}
const TextToSpeech = forwardRef<TextToSpeechHandle, TextToSpeechProps>(
  (props, ref) => {
    const [utterance, setUtterance] = useState(null);
    const { text } = props;
    const synth = window.speechSynthesis;

    useEffect(() => {
      const u: any = new SpeechSynthesisUtterance(text);
      setUtterance(u);

      return () => {
        synth.cancel();
      };
    }, [text, synth]);

    const handlePlay = () => {
      if (utterance) {
        synth.speak(utterance);
      }
    };

    useImperativeHandle(ref, () => ({
      play: handlePlay,
    }));

    return null;
  }
);

export default TextToSpeech;
