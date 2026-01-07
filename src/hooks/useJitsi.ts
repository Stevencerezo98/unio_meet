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

  const updateParticipants = useCallback((jitsiApi: JitsiApi) => {
    if (!jitsiApi) return;
    
    const participantMap = new Map<string, JitsiParticipant>();
    const jitsiParticipants = jitsiApi.getParticipantsInfo();
  
    // Add local participant
    const localId = 'local';
    participantMap.set(localId, {
        id: localId,
        displayName: userInfo?.displayName || 'You',
        avatarURL: jitsiApi.getAvatarURL?.(localId),
        role: jitsiApi.getParticipantsInfo().find(p => p.id === localId)?.role || 'moderator',
        formattedDisplayName: `${userInfo?.displayName || 'You'} (you)`,
    });
  
    // Add remote participants
    jitsiParticipants.forEach(p => {
        if (p.id !== 'local' && !participantMap.has(p.id)) {
            participantMap.set(p.id, p);
        }
    });

    setParticipants(Array.from(participantMap.values()));
  }, [userInfo?.displayName]);


  useEffect(() => {
    if (typeof window === 'undefined' || !window.JitsiMeetExternalAPI || !parentNode.current || api) {
      return;
    }

    const jitsiApi = new window.JitsiMeetExternalAPI(domain, {
      roomName,
      parentNode: parentNode.current,
      width: '100%',
      height: '100%',
      userInfo,
      configOverwrite,
      interfaceConfigOverwrite,
    });

    setApi(jitsiApi);
    
    jitsiApi.on('videoConferenceJoined', () => {
      setIsJoined(true);
      jitsiApi.isAudioMuted().then(setAudioMuted);
      jitsiApi.isVideoMuted().then(setVideoMuted);
      updateParticipants(jitsiApi);
    });

    jitsiApi.on('readyToClose', () => {
      onMeetingEndRef.current?.();
    });
    
    const participantEvents = ['participantJoined', 'participantLeft', 'participantKickedOut', 'displayNameChange', 'avatarChanged', 'participantRoleChanged'];
    participantEvents.forEach(event => {
      jitsiApi.on(event, () => updateParticipants(jitsiApi));
    });

    jitsiApi.on('audioMuteStatusChanged', (payload: { muted: boolean }) => setAudioMuted(payload.muted));
    jitsiApi.on('videoMuteStatusChanged', (payload: { muted: boolean }) => setVideoMuted(payload.muted));
    jitsiApi.on('tileViewChanged', (payload: { enabled: boolean }) => setTileView(payload.enabled));
    jitsiApi.on('screenSharingStatusChanged', (payload: { on: boolean }) => setScreenSharing(payload.on));

    return () => {
        jitsiApi.dispose();
    };
  }, [parentNode, roomName, domain, userInfo, configOverwrite, interfaceConfigOverwrite, updateParticipants, api]);
  
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

  return { isJoined, api, participants, controls };
}
