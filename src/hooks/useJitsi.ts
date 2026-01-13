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
        // --- Solución para Móviles ---
        // Evita que en móvil muestre la pantalla para descargar la app nativa.
        disableDeepLinking: true,
        // Desactiva la antesala que causa conflictos en algunas versiones con disableDeepLinking.
        prejoinConfig: {
          enabled: false
        },
      },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_BRAND_WATERMARK: false,
        APP_NAME: 'Unio Meet',
        NATIVE_APP_NAME: 'Unio Meet',
        // Oculta la promoción de la app en la interfaz.
        MOBILE_APP_PROMO: false,
        SETTINGS_SECTIONS: ['devices', 'language', 'moderator', 'profile', 'sounds'],
      },
    };

    const jitsiApi = new window.JitsiMeetExternalAPI(domain, options);
    
    jitsiApi.on('videoConferenceJoined', () => {
        if(avatarUrl) {
            jitsiApi.executeCommand('avatarUrl', avatarUrl);
        }

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
