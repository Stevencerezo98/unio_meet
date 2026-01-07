'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { JitsiApi, JitsiParticipant } from '@/lib/types';

interface UseJitsiProps {
  roomName: string;
  userName: string;
  parentNode: React.RefObject<HTMLDivElement>;
  domain?: string;
  onMeetingEnd?: () => void;
}

export function useJitsi({
  roomName,
  userName,
  parentNode,
  domain = 'call.unio.my',
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

  useEffect(() => {
    if (typeof window === 'undefined' || !window.JitsiMeetExternalAPI || !parentNode.current || api) {
      return;
    }

    const jitsiApi = new window.JitsiMeetExternalAPI(domain, {
      roomName,
      parentNode: parentNode.current,
      width: '100%',
      height: '100%',
      userInfo: { displayName: userName },
      configOverwrite: {
        startWithAudioMuted: true,
        startWithVideoMuted: true,
        prejoinPageEnabled: false,
        disableDeepLinking: true,
        enableWelcomePage: false,
        transcribingEnabled: false,
        recordingService: { enabled: false },
        liveStreaming: { enabled: false },
        fileRecordingsEnabled: false,
      },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: [],
        SETTINGS_SECTIONS: ['devices', 'language', 'profile', 'moderator'],
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_BRAND_WATERMARK: false,
        SHOW_POWERED_BY_WATERMARK: false,
        SHOW_CHROME_EXTENSION_BANNER: false,
        TILE_VIEW_MAX_COLUMNS: 5,
        TOOLBAR_ALWAYS_VISIBLE: false,
        DISABLE_VIDEO_BACKGROUND: false,
      },
    });

    setApi(jitsiApi);
    
    const updateParticipants = () => {
        const participantMap = new Map<string, JitsiParticipant>();
        const jitsiParticipants = jitsiApi.getParticipantsInfo();
        const localId = jitsiApi.getParticipantsInfo().find(p => p.id === 'local')?.id || 'local';

        participantMap.set(localId, {
            id: localId,
            displayName: userName || 'You',
            avatarURL: jitsiApi.getAvatarURL?.(localId),
            role: 'moderator',
            formattedDisplayName: `${userName || 'You'} (you)`,
        });

        jitsiParticipants.forEach(p => {
            if (p.id !== 'local' && !participantMap.has(p.id)) {
                participantMap.set(p.id, p);
            }
        });
        setParticipants(Array.from(participantMap.values()));
    }

    jitsiApi.on('videoConferenceJoined', () => {
      setIsJoined(true);
      jitsiApi.isAudioMuted().then(setAudioMuted);
      jitsiApi.isVideoMuted().then(setVideoMuted);
      updateParticipants();
    });

    jitsiApi.on('readyToClose', () => {
      onMeetingEndRef.current?.();
    });
    
    const participantEvents = ['participantJoined', 'participantLeft', 'participantKickedOut', 'displayNameChange', 'avatarChanged', 'participantRoleChanged'];
    participantEvents.forEach(event => jitsiApi.on(event, updateParticipants));

    jitsiApi.on('audioMuteStatusChanged', (payload: { muted: boolean }) => setAudioMuted(payload.muted));
    jitsiApi.on('videoMuteStatusChanged', (payload: { muted: boolean }) => setVideoMuted(payload.muted));
    jitsiApi.on('tileViewChanged', (payload: { enabled: boolean }) => setTileView(payload.enabled));
    jitsiApi.on('screenSharingStatusChanged', (payload: { on: boolean }) => setScreenSharing(payload.on));

    return () => {
        jitsiApi.dispose();
    };
  // We want to run this effect only once when the component mounts and the parent node is available.
  // The API and parentNode check at the start of the effect prevents re-runs.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentNode.current]);
  
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
