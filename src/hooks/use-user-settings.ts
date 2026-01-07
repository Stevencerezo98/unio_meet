
'use client';

import { useState, useEffect, useCallback } from 'react';

type UserSettings = {
  name: string;
  avatar: string;
};

const SETTINGS_KEY = 'unio-user-settings';

export function useUserSettings(): [UserSettings, (newSettings: Partial<UserSettings>) => void] {
  const [settings, setSettings] = useState<UserSettings>({ name: '', avatar: '' });

  useEffect(() => {
    // This effect runs only on the client
    try {
      const savedSettings = localStorage.getItem(SETTINGS_KEY);
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Failed to load user settings from localStorage', error);
    }
  }, []);

  const saveSettings = useCallback((newSettings: Partial<UserSettings>) => {
    try {
      setSettings(prevSettings => {
        const updatedSettings = { ...prevSettings, ...newSettings };
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(updatedSettings));
        return updatedSettings;
      });
    } catch (error) {
      console.error('Failed to save user settings to localStorage', error);
    }
  }, []);

  return [settings, saveSettings];
}
