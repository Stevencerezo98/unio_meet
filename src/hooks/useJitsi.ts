'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { JitsiApi, JitsiParticipant } from '@/lib/types';

interface UseJitsiProps {
  roomName: string;
  parentNode: HTMLDivElement | null;
  domain?: string;
  userInfo?: {
    displayName?: string;
  };
  configOverwrite?: object;
  interfaceConfigOverwrite?: object;
}

export function useJitsi({
  roomName,
  parentNode,
  domain = 'call.unio.my',
  userInfo,
  configOverwrite,
  interfaceConfigOverwrite,
}: UseJitsiProps) {
  const [api, setApi] = useState<JitsiApi | null>(null);
  const [participants, setParticipants] = useState<JitsiParticipant[]>([]);
  const [isAudioMuted, setAudioMuted] = useState(true);
  const [isVideoMuted, setVideoMuted] = useState(true);
  const [isTileView, setTileView] = useState(false);
  const [isScreenSharing, setScreenSharing] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.JitsiMeetExternalAPI || !parentNode) {
      return;
    }

    const jitsiApi = new window.JitsiMeetExternalAPI(domain, {
      roomName,
      parentNode,
      width: '100%',
      height: '100%',
      userInfo,
      configOverwrite,
      interfaceConfigOverwrite,
    });

    setApi(jitsiApi);

    const updateParticipants = () => {
      const currentParticipants = jitsiApi.getParticipantsInfo();
      setParticipants(currentParticipants);
    };

    const handleVideoConferenceJoined = ({ id, displayName }: { id: string; displayName: string; }) => {
      jitsiApi.isAudioMuted().then(setAudioMuted);
      jitsiApi.isVideoMuted().then(setVideoMuted);
      updateParticipants();
    };

    const handleParticipantJoined = (participant: any) => {
      updateParticipants();
    };

    const handleParticipantLeft = (participant: any) => {
      updateParticipants();
    };

    const handleAudioMuteStatusChanged = (payload: { muted: boolean }) => {
      setAudioMuted(payload.muted);
    };

    const handleVideoMuteStatusChanged = (payload: { muted: boolean }) => {
      setVideoMuted(payload.muted);
    };

    const handleTileViewChanged = (payload: { enabled: boolean }) => {
      setTileView(payload.enabled);
    };

    const handleScreenSharingStatusChanged = (payload: { on: boolean }) => {
      setScreenSharing(payload.on);
    };
    
    jitsiApi.on('videoConferenceJoined', handleVideoConferenceJoined);
    jitsiApi.on('participantJoined', handleParticipantJoined);
    jitsiApi.on('participantLeft', handleParticipantLeft);
    jitsiApi.on('audioMuteStatusChanged', handleAudioMuteStatusChanged);
    jitsiApi.on('videoMuteStatusChanged', handleVideoMuteStatusChanged);
    jitsiApi.on('tileViewChanged', handleTileViewChanged);
    jitsiApi.on('screenSharingStatusChanged', handleScreenSharingStatusChanged);

    return () => {
      jitsiApi.dispose();
      setApi(null);
    };
  }, [parentNode, roomName, domain, userInfo, configOverwrite, interfaceConfigOverwrite]);

  const toggleAudio = useCallback(() => api?.executeCommand('toggleAudio'), [api]);
  const toggleVideo = useCallback(() => api?.executeCommand('toggleVideo'), [api]);
  const toggleTileView = useCallback(() => api?.executeCommand('toggleTileView'), [api]);
  const toggleShareScreen = useCallback(() => api?.executeCommand('toggleShareScreen'), [api]);
  const hangup = useCallback(() => api?.executeCommand('hangup'), [api]);

  const controls = useMemo(
    () => ({
      isAudioMuted,
      isVideoMuted,
      isTileView,
      isScreenSharing,
      toggleAudio,
      toggleVideo,
      toggleTileView,
      toggleShareScreen,
      hangup,
    }),
    [
      isAudioMuted,
      isVideoMuted,
      isTileView,
      isScreenSharing,
      toggleAudio,
      toggleVideo,
      toggleTileView,
      toggleShareScreen,
      hangup,
    ]
  );

  return { api, participants, controls };
}
