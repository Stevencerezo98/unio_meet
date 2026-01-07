
'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { JitsiApi, JitsiParticipant } from '@/lib/types';

interface UseJitsiProps {
  roomName: string;
  parentNode: React.RefObject<HTMLDivElement>;
  domain?: string;
  onMeetingEnd?: () => void;
  displayName?: string;
  startWithAudioMuted?: boolean;
  startWithVideoMuted?: boolean;
}

export function useJitsi({
  roomName,
  parentNode,
  domain = 'call.unio.my',
  onMeetingEnd,
  displayName,
  startWithAudioMuted = true,
  startWithVideoMuted = true,
}: UseJitsiProps) {
  const [api, setApi] = useState<JitsiApi | null>(null);
  const [isApiReady, setApiReady] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [participants, setParticipants] = useState<JitsiParticipant[]>([]);
  const [isAudioMuted, setAudioMuted] = useState(startWithAudioMuted);
  const [isVideoMuted, setVideoMuted] = useState(startWithVideoMuted);
  const [isTileView, setTileView] = useState(false);
  const [isScreenSharing, setScreenSharing] = useState(false);
  
  const onMeetingEndRef = useRef(onMeetingEnd);
  useEffect(() => {
    onMeetingEndRef.current = onMeetingEnd;
  }, [onMeetingEnd]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.JitsiMeetExternalAPI || !parentNode.current) {
      return;
    }
    
    const decodedRoomName = decodeURIComponent(roomName);

    const jitsiApi = new window.JitsiMeetExternalAPI(domain, {
      roomName: decodedRoomName,
      parentNode: parentNode.current,
      width: '100%',
      height: '100%',
      configOverwrite: {
        startWithAudioMuted: startWithAudioMuted,
        startWithVideoMuted: startWithVideoMuted,
        prejoinPageEnabled: false,
        prejoinConfig: {
           enabled: false,
        },
        disableDeepLinking: true,
        enableWelcomePage: false,
        transcribingEnabled: false,
        recordingService: { enabled: false },
        liveStreaming: { enabled: false },
        fileRecordingsEnabled: false,
      },
      interfaceConfigOverwrite: {
        BRAND_WATERMARK_LINK: 'https://iglesia.unio.my',
        DEFAULT_REMOTE_DISPLAY_NAME: 'Fellow Unio User',
        JITSI_WATERMARK_LINK: 'https://iglesia.unio.my',
        TOOLBAR_BUTTONS: ['reactions'],
        SETTINGS_SECTIONS: ['devices', 'language', 'profile', 'moderator'],
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_BRAND_WATERMARK: false,
        SHOW_POWERED_BY_WATERMARK: false,
        SHOW_CHROME_EXTENSION_BANNER: false,
        TILE_VIEW_MAX_COLUMNS: 5,
        TOOLBAR_ALWAYS_VISIBLE: false,
        DISABLE_VIDEO_BACKGROUND: false,
        css: `
          .reactions-menu-container { display: none !important; }
        `
      },
      onload: () => {
        setApiReady(true);
      }
    });

    setApi(jitsiApi);
    
    const updateParticipants = () => {
        if (!jitsiApi) return;
        
        const newParticipantsMap = new Map<string, JitsiParticipant>();
        
        const localParticipantInfo = jitsiApi.getParticipantsInfo().find(p => p.local);
        if (localParticipantInfo) {
             const localId = localParticipantInfo.id;
             const localParticipant = {
                ...localParticipantInfo,
                displayName: jitsiApi.getDisplayName(localId) || 'Me',
             };
             newParticipantsMap.set(localId, localParticipant);
        }

        const allParticipants = jitsiApi.getParticipantsInfo();
        allParticipants.forEach(p => {
            if (!p.local && !newParticipantsMap.has(p.id)) {
                 newParticipantsMap.set(p.id, {
                    ...p,
                    displayName: p.displayName || 'Guest'
                });
            }
        });
        
        setParticipants(Array.from(newParticipantsMap.values()));
    };


    jitsiApi.on('videoConferenceJoined', () => {
      setIsJoined(true);
      jitsiApi.isAudioMuted().then(setAudioMuted);
      jitsiApi.isVideoMuted().then(setVideoMuted);
       if (displayName) {
        jitsiApi.executeCommand('displayName', displayName);
      }
      updateParticipants();
    });

    jitsiApi.on('readyToClose', () => {
      onMeetingEndRef.current?.();
    });
    
    jitsiApi.on('participantJoined', () => {
        if (navigator.vibrate) {
            navigator.vibrate(100);
        }
        updateParticipants();
    });

    const participantEvents = ['participantLeft', 'participantKickedOut', 'displayNameChange', 'avatarChanged', 'participantRoleChanged'];
    participantEvents.forEach(event => jitsiApi.on(event, updateParticipants));

    jitsiApi.on('audioMuteStatusChanged', (payload: { muted: boolean }) => setAudioMuted(payload.muted));
    jitsiApi.on('videoMuteStatusChanged', (payload: { muted: boolean }) => setVideoMuted(payload.muted));
    jitsiApi.on('tileViewChanged', (payload: { enabled: boolean }) => setTileView(payload.enabled));
    jitsiApi.on('screenSharingStatusChanged', (payload: { on: boolean }) => setScreenSharing(payload.on));

    return () => {
      if(jitsiApi) {
        jitsiApi.dispose();
      }
    };
  }, [roomName, domain, parentNode, startWithAudioMuted, startWithVideoMuted, displayName]);
  
  const toggleAudio = useCallback(() => api?.executeCommand('toggleAudio'), [api]);
  const toggleVideo = useCallback(() => api?.executeCommand('toggleVideo'), [api]);
  const toggleTileView = useCallback(() => api?.executeCommand('toggleTileView'), [api]);
  const toggleShareScreen = useCallback(() => api?.executeCommand('toggleShareScreen'), [api]);
  const hangup = useCallback(() => api?.executeCommand('hangup'), [api]);
  const sendReaction = useCallback((reaction: string) => {
    api?.executeCommand('toggle-reaction', reaction);
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
      sendReaction,
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
      sendReaction
    ]
  );

  return { isApiReady, isJoined, api, participants, controls };
}
