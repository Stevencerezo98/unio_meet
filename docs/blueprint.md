# **App Name**: Unio Premium

## Core Features:

- MeetingRoom Component: Initializes Jitsi Meet IFrame API within a custom component, occupying 100% of the screen, with rounded borders. Renders the video stream.
- useJitsi Hook: Encapsulates Jitsi API commands (toggleAudio, toggleVideo, toggleShareScreen, toggleTileView, hangup) and event listeners (participantJoined, participantLeft) into a custom hook.
- Participant Sidebar: Displays a real-time list of participants using data from the Jitsi API events within a glassmorphism-styled sidebar.
- Custom Floating Toolbar: Creates a custom toolbar with controls for audio, video, screen sharing, and more, using Lucide Icons. Configures `interfaceConfigOverwrite` and `configOverwrite` to hide native Jitsi controls.
- Real-time Participant Updates: Dynamically updates the participant list in the sidebar in real-time based on `participantJoined` and `participantLeft` events triggered by Jitsi.
- Error Handling and SSR Compatibility: Handles window object correctly to avoid SSR errors in Next.js, ensuring smooth server-side and client-side rendering.

## Style Guidelines:

- Primary color: A subdued, desaturated blue (#5F9EA0) to create a professional and calming atmosphere.
- Background color: Deep dark gray (#0a0a0a) to create a high-end and immersive dark mode experience.
- Accent color: Soft Lavender (#E6E6FA) for subtle highlights and interactive elements, providing a gentle contrast against the dark background.
- Font: 'Inter' sans-serif for a modern and clean look. Note: currently only Google Fonts are supported.
- Lucide-react icons for a consistent and modern aesthetic across all interactive elements.
- Glassmorphism effect (backdrop-blur-md, bg-white/10) for the sidebar to provide a frosted glass appearance, enhancing visual depth and separation.
- Smooth transitions for opening and closing the sidebar to improve the user experience.