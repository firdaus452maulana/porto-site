import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA7sTDTCBkfXT80rZRog3x0juyNBXPmcY0",
  authDomain: "personal-website-bdf06.firebaseapp.com",
  projectId: "personal-website-bdf06",
  storageBucket: "personal-website-bdf06.firebasestorage.app",
  messagingSenderId: "989481202375",
  appId: "1:989481202375:web:473d678acd3b03ca44c4e2"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);