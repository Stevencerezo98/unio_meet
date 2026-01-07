
'use server';

import fs from 'fs/promises';
import path from 'path';
import { cookies } from 'next/headers';
import type { LandingContent } from '@/lib/landing-content';
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';

const contentFilePath = path.join(process.cwd(), 'src', 'lib', 'landing-content.json');

// --- Auth Actions ---

export async function login(credentials: { username?: string; password?: string }) {
  // IMPORTANT: This is a basic, insecure check for demonstration purposes.
  // Do not use this in a production environment.
  if (
    credentials.username === 'Steven98' &&
    credentials.password === '06129812'
  ) {
    cookies().set('session', 'admin-logged-in', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    return { success: true };
  }
  return { success: false, error: 'Invalid username or password' };
}

export async function logout() {
  cookies().delete('session');
  return { success: true };
}

// --- Content Actions ---

export async function loadLandingContent(): Promise<LandingContent> {
  try {
    const fileContent = await fs.readFile(contentFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading landing content:', error);
    // Return a default structure in case of error
    return {
      header: { logo: { type: 'text', value: 'Unio'}, navItems: [], ctaPrimary: {text: '', url: ''}, ctaSecondary: {text: '', url: ''}},
      hero: { titlePart1: '', titlePart2: '', subtitle: '', ctaPrimary: '', ctaSecondary: '', cardTitle: '', cardDescription: ''},
      features: { title: '', subtitle: '', items: []},
      footer: { brandName: '', brandDescription: '', socialLinks: [], linkColumns: [], legalLinks: [], copyright: ''},
      thankYou: { title: '', description: '', buttonText: ''}
    };
  }
}

export async function saveLandingContent(
  newContent: LandingContent
): Promise<{ success: boolean; error?: string }> {
  try {
    // Basic validation could go here
    await fs.writeFile(contentFilePath, JSON.stringify(newContent, null, 2), 'utf-8');
    return { success: true };
  } catch (error: any) {
    console.error('Error saving landing content:', error);
    return { success: false, error: error.message || 'Failed to save content.' };
  }
}


// --- Room Name Generator ---
export async function generateRandomRoomName(): Promise<string> {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}
