import { Download, Mic, Trash } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import { useAudioRecorderStore } from './store/use-audio-recorder-store';
import { useTheme } from '../../theme/theme-provider';

type Props = {
  className?: string;
  timerClassName?: string;
};

let timerTimeout: NodeJS.Timeout;

// Utility function to pad a number with leading zeros
const padWithLeadingZeros = (num: number, length: number): string => {
  return String(num).padStart(length, '0');
};

export const AudioRecorderWithVisualizer = ({
  className,
  timerClassName,
}: Props) => {
  const { theme } = useTheme();

  const {
    isRecording,
    mediaRecorderRefs,
    startRecording,
    stopRecording,
    resetRecording,
  } = useAudioRecorderStore();

  const [timer, setTimer] = useState<number>(0);
  // Calculate the hours, minutes, and seconds from the timer
  const hours = Math.floor(timer / 3600);
  const minutes = Math.floor((timer % 3600) / 60);
  const seconds = timer % 60;

  // Split the hours, minutes, and seconds into individual digits
  const [hourLeft, hourRight] = useMemo(
    () => padWithLeadingZeros(hours, 2).split(''),
    [hours],
  );
  const [minuteLeft, minuteRight] = useMemo(
    () => padWithLeadingZeros(minutes, 2).split(''),
    [minutes],
  );
  const [secondLeft, secondRight] = useMemo(
    () => padWithLeadingZeros(seconds, 2).split(''),
    [seconds],
  );
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<any>(null);

  const handleStopRecording = () => {
    stopRecording();
    setTimer(0);
    clearTimeout(timerTimeout);
  };

  const handleResetRecording = () => {
    resetRecording();
    setTimer(0);
    clearTimeout(timerTimeout);

    // Clear the animation frame and canvas
    cancelAnimationFrame(animationRef.current || 0);
    const canvas = canvasRef.current;
    if (canvas) {
      const canvasCtx = canvas.getContext('2d');
      if (canvasCtx) {
        const WIDTH = canvas.width;
        const HEIGHT = canvas.height;
        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
      }
    }
  };

  // Effect to update the timer every second
  useEffect(() => {
    if (isRecording) {
      timerTimeout = setTimeout(() => {
        setTimer(timer + 1);
      }, 1000);
    }
    return () => clearTimeout(timerTimeout);
  }, [isRecording, timer]);

  // Visualizer
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    const drawWaveform = (dataArray: Uint8Array) => {
      if (!canvasCtx) return;
      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
      canvasCtx.fillStyle = '#939393';

      const barWidth = 1;
      const spacing = 1;
      const maxBarHeight = HEIGHT / 2.5;
      const numBars = Math.floor(WIDTH / (barWidth + spacing));

      for (let i = 0; i < numBars; i++) {
        const barHeight = Math.pow(dataArray[i] / 128.0, 8) * maxBarHeight;
        const x = (barWidth + spacing) * i;
        const y = HEIGHT / 2 - barHeight / 2;
        canvasCtx.fillRect(x, y, barWidth, barHeight);
      }
    };

    const visualizeVolume = () => {
      if (
        !mediaRecorderRefs?.stream?.getAudioTracks()[0]?.getSettings()
          .sampleRate
      )
        return;
      const bufferLength =
        (mediaRecorderRefs?.stream?.getAudioTracks()[0]?.getSettings()
          .sampleRate as number) / 100;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        if (!isRecording) {
          cancelAnimationFrame(animationRef.current || 0);
          return;
        }
        animationRef.current = requestAnimationFrame(draw);
        mediaRecorderRefs?.analyser?.getByteTimeDomainData(dataArray);
        drawWaveform(dataArray);
      };

      draw();
    };

    if (isRecording) {
      visualizeVolume();
    } else {
      if (canvasCtx) {
        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
      }
      cancelAnimationFrame(animationRef.current || 0);
    }

    return () => {
      cancelAnimationFrame(animationRef.current || 0);
    };
  }, [isRecording, theme, mediaRecorderRefs]);

  return (
    <div
      className={cn(
        'flex h-16 rounded-md relative w-full items-center justify-center gap-2 max-w-5xl',
        {
          'border p-1': isRecording,
          'border-none p-0': !isRecording,
        },
        className,
      )}
    >
      {isRecording ? (
        <Timer
          hourLeft={hourLeft}
          hourRight={hourRight}
          minuteLeft={minuteLeft}
          minuteRight={minuteRight}
          secondLeft={secondLeft}
          secondRight={secondRight}
          timerClassName={timerClassName}
        />
      ) : null}
      <canvas
        ref={canvasRef}
        className={`h-full w-full bg-background ${
          !isRecording ? 'hidden' : 'flex'
        }`}
      />
      <div className="flex gap-2">
        <TooltipProvider>
          {/* ========== Delete recording button ========== */}
          {isRecording ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleResetRecording}
                  size={'icon'}
                  variant={'destructive'}
                >
                  <Trash size={15} />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="m-2">
                <span>Reset recording</span>
              </TooltipContent>
            </Tooltip>
          ) : null}

          {/* ========== Start and send recording button ========== */}
          <Tooltip>
            <TooltipTrigger asChild>
              {!isRecording ? (
                <Button onClick={() => startRecording()} size={'icon'}>
                  <Mic size={15} />
                </Button>
              ) : (
                <Button onClick={handleStopRecording} size={'icon'}>
                  <Download size={15} />
                </Button>
              )}
            </TooltipTrigger>
            <TooltipContent className="m-2">
              <span>
                {!isRecording ? 'Start recording' : 'Download recording'}
              </span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

const Timer = React.memo(
  ({
    hourLeft,
    hourRight,
    minuteLeft,
    minuteRight,
    secondLeft,
    secondRight,
    timerClassName,
  }: {
    hourLeft: string;
    hourRight: string;
    minuteLeft: string;
    minuteRight: string;
    secondLeft: string;
    secondRight: string;
    timerClassName?: string;
  }) => {
    return (
      <div
        className={cn(
          'items-center -top-12 left-0 absolute justify-center gap-0.5 border p-1.5 rounded-md font-mono font-medium text-foreground flex',
          timerClassName,
        )}
      >
        <span className="rounded-md bg-background p-0.5 text-foreground">
          {hourLeft}
        </span>
        <span className="rounded-md bg-background p-0.5 text-foreground">
          {hourRight}
        </span>
        <span>:</span>
        <span className="rounded-md bg-background p-0.5 text-foreground">
          {minuteLeft}
        </span>
        <span className="rounded-md bg-background p-0.5 text-foreground">
          {minuteRight}
        </span>
        <span>:</span>
        <span className="rounded-md bg-background p-0.5 text-foreground">
          {secondLeft}
        </span>
        <span className="rounded-md bg-background p-0.5 text-foreground ">
          {secondRight}
        </span>
      </div>
    );
  },
);
Timer.displayName = 'Timer';
