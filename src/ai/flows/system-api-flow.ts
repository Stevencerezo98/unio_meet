'use server';
/**
 * @fileOverview A secure API endpoint for providing system-level data to trusted native applications.
 *
 * - getSystemData - A function that returns system information.
 * - SystemDataInput - The input type (currently empty, but prepared for a token).
 * - SystemDataOutput - The return type for the system data.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getFirestore } from 'firebase-admin/firestore';
import { auth as adminAuth, db } from '@/firebase/server';

// Define the input schema. In the future, this would include the service account token.
const SystemDataInputSchema = z.object({
  // In a real implementation, you'd have a service token here.
  // serviceToken: z.string().describe('A secret token for authenticating the service.')
});
export type SystemDataInput = z.infer<typeof SystemDataInputSchema>;

// Define the output schema for the system data.
const SystemDataOutputSchema = z.object({
  systemInfo: z.object({
    videoEngine: z.string().describe('The core engine used for video calls.'),
    videoDomain: z.string().describe('The domain where the video engine is hosted.'),
  }),
  stats: z.object({
    totalUsers: z.number().describe('Total number of registered user profiles.'),
    totalMeetings: z.number().describe('A placeholder for total meeting count.'), // This would require more complex logic
  }),
  // In a real scenario, you might not want to expose all user data directly.
  // This is for demonstration.
  users: z.array(z.object({
      uid: z.string(),
      email: z.string().optional(),
      displayName: z.string().optional(),
  })).optional(),
});
export type SystemDataOutput = z.infer<typeof SystemDataOutputSchema>;


/**
 * Main wrapper function to be called from the native app's backend.
 * It will execute the flow to get system data.
 */
export async function getSystemData(input: SystemDataInput): Promise<SystemDataOutput> {
  // Here you would add logic to validate the service token from the input.
  // For now, we'll proceed directly to calling the flow.
  return systemDataFlow(input);
}


// The main Genkit flow that acts as the API endpoint.
const systemDataFlow = ai.defineFlow(
  {
    name: 'systemDataFlow',
    inputSchema: SystemDataInputSchema,
    outputSchema: SystemDataOutputSchema,
  },
  async () => {
    // This code runs on the server with admin privileges.
    
    // 1. Get total number of users from Firebase Auth
    // NOTE: Listing all users is a powerful operation.
    const listUsersResult = await adminAuth.listUsers(1000); // Lists up to 1000 users
    const users = listUsersResult.users.map(userRecord => ({
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
    }));
    const totalUsers = users.length; // In a paginated query, this would be a total count.

    // 2. Get meeting stats (placeholder logic)
    // A real implementation would involve querying meeting logs or collections.
    const meetingRoomsSnapshot = await db.collection('meetingRooms').get();
    const totalMeetings = meetingRoomsSnapshot.size;
    
    // 3. Construct the response
    return {
      systemInfo: {
        videoEngine: 'jitsi',
        videoDomain: 'call.unio.my',
      },
      stats: {
        totalUsers: totalUsers,
        totalMeetings: totalMeetings,
      },
      users: users.slice(0, 10), // Return a sample of users for demonstration
    };
  }
);
