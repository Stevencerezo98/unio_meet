export interface JitsiParticipant {
  id: string;
  displayName: string;
  avatarURL?: string;
  role?: string;
  formattedDisplayName: string;
  local?: boolean;
}

export interface JitsiApi {
  executeCommand: (command: string, ...args: any[]) => void;
  on: (event: string, handler: (...args: any[]) => void) => void;
  off: (event: string, handler: (...args: any[]) => void) => void;
  getParticipantsInfo: () => JitsiParticipant[];
  dispose: () => void;
  isAudioMuted: () => Promise<boolean>;
  isVideoMuted: () => Promise<boolean>;
  getAvatarURL: (participantId: string) => string;
  getDisplayName: (participantId: string) => string;
  getNumberOfParticipants: () => number;
}

declare global {
  interface Window {
    JitsiMeetExternalAPI?: new (domain: string, options: any) => JitsiApi;
  }
}
