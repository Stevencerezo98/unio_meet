'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  onMeetingEnd?: () => void;
}

export function useJitsi({
  roomName,
  parentNode,
  domain = 'call.unio.my',
  userInfo,
  configOverwrite,
  interfaceConfigOverwrite,
  onMeetingEnd
}: UseJitsiProps) {
  const [api, setApi] = useState<JitsiApi | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [participants, setParticipants] = useState<JitsiParticipant[]>([]);
  const [isAudioMuted, setAudioMuted] = useState(true);
  const [isVideoMuted, setVideoMuted] = useState(true);
  const [isTileView, setTileView] = useState(false);
  const [isScreenSharing, setScreenSharing] = useState(false);
  const onMeetingEndRef = useRef(onMeetingEnd);

  useEffect(() => {
    onMeetingEndRef.current = onMeetingEnd;
  }, [onMeetingEnd]);

  const memoizedConfig = useMemo(() => JSON.stringify(configOverwrite), [configOverwrite]);
  const memoizedInterfaceConfig = useMemo(() => JSON.stringify(interfaceConfigOverwrite), [interfaceConfigOverwrite]);
  const memoizedUserInfo = useMemo(() => JSON.stringify(userInfo), [userInfo]);

  const updateParticipants = useCallback((jitsiApi: JitsiApi) => {
    if (!jitsiApi) return;
  
    const remoteParticipants = jitsiApi.getParticipantsInfo();
    const localId = 'local';
    const participantMap = new Map<string, JitsiParticipant>();

    const localParticipant = jitsiApi.getParticipantsInfo().find(p => p.id === localId) || {
        id: localId,
        displayName: userInfo?.displayName || 'You',
        avatarURL: jitsiApi.getAvatarURL?.(localId),
        role: 'moderator',
        formattedDisplayName: `${userInfo?.displayName || 'You'} (you)`,
    };
    participantMap.set(localId, localParticipant as JitsiParticipant);
  
    remoteParticipants.forEach(p => {
        if (!participantMap.has(p.id)) {
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
      setIsJoined(true);
      jitsiApi.isAudioMuted().then(setAudioMuted);
      jitsiApi.isVideoMuted().then(setVideoMuted);
      updateParticipants(jitsiApi);
    };

    const handleReadyToClose = () => {
      onMeetingEndRef.current?.();
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
    jitsiApi.on('readyToClose', handleReadyToClose);
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

  return { isJoined, api, participants, controls };
}
