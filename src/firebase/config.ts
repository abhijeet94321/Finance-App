
/**
 * Firebase configuration for the Saldo project.
 * 
 * TO FIX THE 'auth/api-key-not-valid' ERROR:
 * 1. Go to your REAL project settings: https://console.firebase.google.com/project/studio-8485961398-7d33e/settings/general
 * 2. Scroll down to 'Your apps'.
 * 3. Copy the 'apiKey' from the 'Config' radio button and paste it below.
 * 
 * TO FIX 'auth/unauthorized-domain':
 * 1. Go to Authentication -> Settings -> Authorized domains.
 * 2. Add the domain of this preview window (e.g., *.googleusercontent.com).
 */
export const firebaseConfig = {
  apiKey: "REPLACE_WITH_YOUR_REAL_API_KEY", 
  authDomain: "studio-8485961398-7d33e.firebaseapp.com",
  projectId: "studio-8485961398-7d33e",
  storageBucket: "studio-8485961398-7d33e.firebasestorage.app",
  messagingSenderId: "8485961398",
  appId: "REPLACE_WITH_YOUR_REAL_APP_ID" 
};
