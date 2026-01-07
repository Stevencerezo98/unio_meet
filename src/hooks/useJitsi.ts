'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { JitsiApi, JitsiParticipant } from '@/lib/types';

interface UseJitsiProps {
  roomName: string;
  parentNode: React.RefObject<HTMLDivElement>;
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

  const memoizedConfig = useMemo(() => JSON.stringify(configOverwrite), [configOverwrite]);
  const memoizedInterfaceConfig = useMemo(() => JSON.stringify(interfaceConfigOverwrite), [interfaceConfigOverwrite]);
  const memoizedUserInfo = useMemo(() => JSON.stringify(userInfo), [userInfo]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.JitsiMeetExternalAPI || !parentNode.current) {
      return;
    }

    const jitsiApi = new window.JitsiMeetExternalAPI(domain, {
      roomName,
      parentNode: parentNode.current,
      width: '100%',
      height: '100%',
      userInfo: JSON.parse(memoizedUserInfo),
      configOverwrite: JSON.parse(memoizedConfig),
      interfaceConfigOverwrite: JSON.parse(memoizedInterfaceConfig),
    });

    setApi(jitsiApi);

    const updateParticipants = () => {
      if (!jitsiApi) return;
      const remoteParticipants = jitsiApi.getParticipantsInfo();
      const localParticipant = jitsiApi.getAvatarURL && {
        id: 'local',
        displayName: userInfo?.displayName || 'You',
        avatarURL: jitsiApi.getAvatarURL('local'),
        role: 'moderator',
        formattedDisplayName: `${userInfo?.displayName || 'You'} (you)`,
      };
      
      const allParticipants = localParticipant ? [localParticipant, ...remoteParticipants] : remoteParticipants;
      
      const uniqueParticipants = allParticipants.filter(
        (participant, index, self) =>
          index === self.findIndex((p) => p.id === participant.id)
      );

      setParticipants(uniqueParticipants);
    };

    const handleVideoConferenceJoined = () => {
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
    
    const handleParticipantUpdated = () => {
        updateParticipants();
    }

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
    jitsiApi.on('participantKickedOut', handleParticipantLeft);
    jitsiApi.on('displayNameChange', handleParticipantUpdated);
    jitsiApi.on('avatarChanged', handleParticipantUpdated);

    jitsiApi.on('audioMuteStatusChanged', handleAudioMuteStatusChanged);
    jitsiApi.on('videoMuteStatusChanged', handleVideoMuteStatusChanged);
    jitsiApi.on('tileViewChanged', handleTileViewChanged);
    jitsiApi.on('screenSharingStatusChanged', handleScreenSharingStatusChanged);

    return () => {
        if(api) {
            api.dispose();
            setApi(null);
        }
    };
  }, [parentNode, roomName, domain, memoizedUserInfo, memoizedConfig, memoizedInterfaceConfig]);

  const toggleAudio = useCallback(() => {
    api?.executeCommand('toggleAudio');
  }, [api]);
  
  const toggleVideo = useCallback(() => {
    api?.executeCommand('toggleVideo');
  }, [api]);
  
  const toggleTileView = useCallback(() => {
    api?.executeCommand('toggleTileView');
  }, [api]);
  
  const toggleShareScreen = useCallback(() => {
    api?.executeCommand('toggleShareScreen');
  }, [api]);
  
  const hangup = useCallback(() => {
    api?.executeCommand('hangup');
  }, [api]);

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
