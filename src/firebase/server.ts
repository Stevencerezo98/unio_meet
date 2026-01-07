
import { credential } from 'firebase-admin';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { firebaseConfig } from './config';

const apps = getApps();

// In a managed environment like App Hosting, the Admin SDK can be initialized
// without any arguments. It will automatically discover the service account
// credentials from the environment.
const app = apps.length ? apps[0] : initializeApp({
    // No credential needed here, it's auto-discovered.
}, 'server');

export const auth = getAuth(app);
export const db = getFirestore(app);
