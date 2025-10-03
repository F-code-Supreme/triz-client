import { create } from 'zustand';

interface MediaRecorderRefs {
  stream: MediaStream | null;
  analyser: AnalyserNode | null;
  mediaRecorder: MediaRecorder | null;
  audioContext: AudioContext | null;
}

interface AudioRecorderState {
  isRecording: boolean;
  isRecordingFinished: boolean;
  recordedBlob: Blob | null;
  mediaRecorderRefs: MediaRecorderRefs;
  setIsRecording: (isRecording: boolean) => void;
  setIsRecordingFinished: (isFinished: boolean) => void;
  setRecordedBlob: (blob: Blob | null) => void;
  setMediaRecorderRefs: (refs: MediaRecorderRefs) => void;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  resetRecording: () => void;
  reset: () => void;
}

const initialState = {
  isRecording: false,
  isRecordingFinished: false,
  recordedBlob: null,
  mediaRecorderRefs: {
    stream: null,
    analyser: null,
    mediaRecorder: null,
    audioContext: null,
  },
};

let recorder: MediaRecorder;
let recordingChunks: BlobPart[] = [];

export const useAudioRecorderStore = create<AudioRecorderState>((set) => ({
  ...initialState,
  setIsRecording: (isRecording: boolean) => set({ isRecording }),
  setIsRecordingFinished: (isFinished: boolean) =>
    set({ isRecordingFinished: isFinished }),
  setRecordedBlob: (blob: Blob | null) => set({ recordedBlob: blob }),
  setMediaRecorderRefs: (refs: MediaRecorderRefs) =>
    set({ mediaRecorderRefs: refs }),
  startRecording: async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      console.error('getUserMedia not supported');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Set recording state
      set({ isRecording: true });

      // Setup audio analysis
      const AudioContext = window.AudioContext;
      const audioCtx = new AudioContext();
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const mimeType = MediaRecorder.isTypeSupported('audio/mpeg')
        ? 'audio/mpeg'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : 'audio/wav';

      const options = { mimeType };
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorder.start();

      // Store refs
      set({
        mediaRecorderRefs: {
          stream,
          analyser,
          mediaRecorder,
          audioContext: audioCtx,
        },
      });

      // Setup recorder
      recordingChunks = [];
      recorder = new MediaRecorder(stream);
      recorder.start();
      recorder.ondataavailable = (e) => {
        recordingChunks.push(e.data);
      };
    } catch (error) {
      console.error('Error starting recording:', error);
      set({ isRecording: false });
    }
  },
  stopRecording: () => {
    recorder.onstop = () => {
      const recordBlob = new Blob(recordingChunks, {
        type: 'audio/wav',
      });
      set({ recordedBlob: recordBlob });

      // Download the blob
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(recordBlob);
      downloadLink.download = `Audio_${new Date().getMilliseconds()}.mp3`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      recordingChunks = [];
    };

    recorder.stop();
    set({ isRecording: false, isRecordingFinished: true });
  },
  resetRecording: () => {
    const state = useAudioRecorderStore.getState();
    const { mediaRecorder, stream, analyser, audioContext } =
      state.mediaRecorderRefs;

    if (mediaRecorder) {
      mediaRecorder.onstop = () => {
        recordingChunks = [];
      };
      mediaRecorder.stop();
    }

    // Stop the web audio context and the analyser node
    if (analyser) {
      analyser.disconnect();
    }
    if (stream) {
      stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
    }
    if (audioContext) {
      audioContext.close();
    }

    set({
      isRecording: false,
      isRecordingFinished: true,
      mediaRecorderRefs: initialState.mediaRecorderRefs,
    });
  },
  reset: () => set(initialState),
}));
