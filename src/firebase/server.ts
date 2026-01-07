
import { credential } from 'firebase-admin';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { firebaseConfig } from './config';

const apps = getApps();
const SERVICE_ACCOUNT_KEY_PATH = 'serviceAccountKey.json'

const app = apps.length
  ? apps[0]
  : initializeApp(
      {
        credential: credential.cert(SERVICE_ACCOUNT_KEY_PATH),
      },
      'server'
    );

export const auth = getAuth(app);
export const db = getFirestore(app);
