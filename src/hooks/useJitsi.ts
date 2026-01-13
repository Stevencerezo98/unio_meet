'use client';

import { useEffect, useRef } from 'react';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, serverTimestamp } from 'firebase/firestore';
import { useFirebase } from '@/firebase';

interface UseJitsiProps {
  roomName: string;
  parentNode: React.RefObject<HTMLDivElement>;
  domain?: string;
  onMeetingEnd?: () => void;
  displayName?: string;
  avatarUrl?: string;
  isRegisteredUser?: boolean;
}

export function useJitsi({
  roomName,
  parentNode,
  domain = 'call.unio.my',
  onMeetingEnd,
  displayName,
  avatarUrl,
  isRegisteredUser,
}: UseJitsiProps) {
  const onMeetingEndRef = useRef(onMeetingEnd);
  const { firestore, user } = useFirebase();

  useEffect(() => {
    onMeetingEndRef.current = onMeetingEnd;
  }, [onMeetingEnd]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.JitsiMeetExternalAPI || !parentNode.current) {
      console.warn("Jitsi API script not loaded or parentNode not available");
      return;
    }
    
    parentNode.current.innerHTML = '';
    
    const decodedRoomName = decodeURIComponent(roomName);

    const options = {
      roomName: decodedRoomName,
      parentNode: parentNode.current,
      width: '100%',
      height: '100%',
      lang: 'es',
      userInfo: {
        displayName: displayName,
      },
      configOverwrite: {
        prejoinPageEnabled: true,
        // The following parameter will make Jitsi to use the invite link format
        // of the main app domain instead of the Jitsi instance domain.
        inviteAppName: 'Unio',
      },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_BRAND_WATERMARK: false,
        APP_NAME: 'Unio',
        NATIVE_APP_NAME: 'Unio',
        // Hide the Deep Linking section in settings to avoid user confusion
        SETTINGS_SECTIONS: ['devices', 'language', 'moderator', 'profile', 'sounds'],
        MOBILE_APP_PROMO: false, // Disables mobile app promotion
      },
    };

    const jitsiApi = new window.JitsiMeetExternalAPI(domain, options);
    
    // Set avatar once the participant joins
    jitsiApi.on('videoConferenceJoined', () => {
        if(avatarUrl) {
            jitsiApi.executeCommand('avatarUrl', avatarUrl);
        }

        // Add to meeting history if it's a registered user
        if (isRegisteredUser && firestore && user) {
            const historyRef = collection(firestore, 'users', user.uid, 'meetingHistory');
            addDocumentNonBlocking(historyRef, {
                roomName: decodedRoomName,
                joinedAt: serverTimestamp(),
            });
        }
    });

    jitsiApi.on('readyToClose', () => {
      onMeetingEndRef.current?.();
    });
    
    return () => {
      if(jitsiApi) {
        jitsiApi.dispose();
      }
    };
  }, [roomName, domain, parentNode, displayName, avatarUrl, isRegisteredUser, firestore, user]);
  
  return {};
}
