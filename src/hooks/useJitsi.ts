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

  const updateParticipants = useCallback((jitsiApi: JitsiApi) => {
    if (!jitsiApi) return;
  
    const remoteParticipants = jitsiApi.getParticipantsInfo();
    
    // The local participant object from the API might be incomplete initially
    const localId = jitsiApi.getDisplayName('local') ? 'local' : (remoteParticipants.find(p => p.formattedDisplayName.endsWith('(me)'))?.id || 'local');

    const localParticipant = {
      id: localId,
      displayName: userInfo?.displayName || 'You',
      avatarURL: jitsiApi.getAvatarURL?.(localId),
      role: 'moderator',
      formattedDisplayName: `${userInfo?.displayName || 'You'} (you)`,
    };
  
    const participantMap = new Map<string, JitsiParticipant>();

    // Add local participant first to ensure it's in the list
    if(localId) {
        participantMap.set(localId, localParticipant);
    }
  
    // Add remote participants, overwriting any incomplete local participant info
    // that might have come from the remote list.
    remoteParticipants.forEach(p => {
        // Exclude the placeholder for the local user that Jitsi sometimes provides
        if (!p.formattedDisplayName.endsWith('(me)')) {
            participantMap.set(p.id, p);
        }
    });

    setParticipants(Array.from(participantMap.values()));
  }, [userInfo?.displayName]);


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

    const handleVideoConferenceJoined = () => {
      jitsiApi.isAudioMuted().then(setAudioMuted);
      jitsiApi.isVideoMuted().then(setVideoMuted);
      updateParticipants(jitsiApi);
    };

    const handleParticipantEvent = () => {
        updateParticipants(jitsiApi);
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
    jitsiApi.on('participantJoined', handleParticipantEvent);
    jitsiApi.on('participantLeft', handleParticipantEvent);
    jitsiApi.on('participantKickedOut', handleParticipantEvent);
    jitsiApi.on('displayNameChange', handleParticipantEvent);
    jitsiApi.on('avatarChanged', handleParticipantEvent);
    jitsiApi.on('participantRoleChanged', handleParticipantEvent);

    jitsiApi.on('audioMuteStatusChanged', handleAudioMuteStatusChanged);
    jitsiApi.on('videoMuteStatusChanged', handleVideoMuteStatusChanged);
    jitsiApi.on('tileViewChanged', handleTileViewChanged);
    jitsiApi.on('screenSharingStatusChanged', handleScreenSharingStatusChanged);

    return () => {
        jitsiApi.dispose();
        setApi(null);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentNode, roomName, domain, memoizedUserInfo, memoizedConfig, memoizedInterfaceConfig, updateParticipants]);

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
