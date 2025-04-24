// src/utils/firebase.js
import admin from 'firebase-admin';
import { readFile } from 'fs/promises';

import dotenv from 'dotenv';
dotenv.config();

const serviceAccount = JSON.parse(
    await readFile(new URL('./serviceAccountKey.json', import.meta.url))
);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

const bucket = admin.storage().bucket();
export default bucket;
