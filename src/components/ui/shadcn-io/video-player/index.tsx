'use client';

import {
  MediaControlBar,
  MediaController,
  MediaMuteButton,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaTimeDisplay,
  MediaTimeRange,
  MediaVolumeRange,
} from 'media-chrome/react';

import { cn } from '@/lib/utils';

import type { ComponentProps, CSSProperties } from 'react';

export type VideoPlayerProps = ComponentProps<typeof MediaController>;

const variables = {
  '--media-primary-color': '#18181B', // indigo-600
  '--media-secondary-color': '#FFFFFF', // white
  '--media-text-color': '#000000', // slate-900
  '--media-background-color': '#ffffff', // black
  '--media-control-hover-background': '#F4F4F5',
  '--media-font-family': 'var(--font-sans)',
  '--media-live-button-icon-color': '#6b7280', // slate-400
  '--media-live-button-indicator-color': '#ef4444', // red-500
  '--media-range-track-background': '#d1d5db', // gray-200
} as CSSProperties;

export const VideoPlayer = ({ style, ...props }: VideoPlayerProps) => (
  <MediaController
    style={{
      ...variables,
      ...style,
    }}
    {...(props as any)}
  />
);

export type VideoPlayerControlBarProps = ComponentProps<typeof MediaControlBar>;

export const VideoPlayerControlBar = (props: VideoPlayerControlBarProps) => (
  <MediaControlBar {...(props as any)} />
);

export type VideoPlayerTimeRangeProps = ComponentProps<typeof MediaTimeRange>;

export const VideoPlayerTimeRange = ({
  className,
  ...props
}: VideoPlayerTimeRangeProps) => (
  <MediaTimeRange className={cn('p-2.5', className)} {...(props as any)} />
);

export type VideoPlayerTimeDisplayProps = ComponentProps<
  typeof MediaTimeDisplay
>;

export const VideoPlayerTimeDisplay = ({
  className,
  ...props
}: VideoPlayerTimeDisplayProps) => (
  <MediaTimeDisplay className={cn('p-2.5', className)} {...(props as any)} />
);

export type VideoPlayerVolumeRangeProps = ComponentProps<
  typeof MediaVolumeRange
>;

export const VideoPlayerVolumeRange = ({
  className,
  ...props
}: VideoPlayerVolumeRangeProps) => (
  <MediaVolumeRange className={cn('p-2.5', className)} {...(props as any)} />
);

export type VideoPlayerPlayButtonProps = ComponentProps<typeof MediaPlayButton>;

export const VideoPlayerPlayButton = ({
  className,
  ...props
}: VideoPlayerPlayButtonProps) => (
  <MediaPlayButton className={cn('p-2.5', className)} {...(props as any)} />
);

export type VideoPlayerSeekBackwardButtonProps = ComponentProps<
  typeof MediaSeekBackwardButton
>;

export const VideoPlayerSeekBackwardButton = ({
  className,
  ...props
}: VideoPlayerSeekBackwardButtonProps) => (
  <MediaSeekBackwardButton
    className={cn('p-2.5', className)}
    {...(props as any)}
  />
);

export type VideoPlayerSeekForwardButtonProps = ComponentProps<
  typeof MediaSeekForwardButton
>;

export const VideoPlayerSeekForwardButton = ({
  className,
  ...props
}: VideoPlayerSeekForwardButtonProps) => (
  <MediaSeekForwardButton
    className={cn('p-2.5', className)}
    {...(props as any)}
  />
);

export type VideoPlayerMuteButtonProps = ComponentProps<typeof MediaMuteButton>;

export const VideoPlayerMuteButton = ({
  className,
  ...props
}: VideoPlayerMuteButtonProps) => (
  <MediaMuteButton className={cn('p-2.5', className)} {...(props as any)} />
);

export type VideoPlayerContentProps = ComponentProps<'video'>;

export const VideoPlayerContent = ({
  className,
  ...props
}: VideoPlayerContentProps) => (
  <video className={cn('mt-0 mb-0', className)} {...(props as any)} />
);
