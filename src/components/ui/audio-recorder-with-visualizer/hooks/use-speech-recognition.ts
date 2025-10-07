import { useEffect } from 'react';
import { useSpeechRecognition } from 'react-speech-recognition';

import { useAudioRecorderStore } from '../store/use-audio-recorder-store';

export const useSpeechRecognitionIntegration = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const { setTranscript } = useAudioRecorderStore();

  useEffect(() => {
    if (transcript) {
      setTranscript(transcript);
    }
  }, [transcript, setTranscript]);

  return {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  };
};
