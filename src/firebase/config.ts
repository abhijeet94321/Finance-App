
/**
 * Firebase configuration for the Saldo project.
 * 
 * TO FIX THE 'auth/unauthorized-domain' ERROR:
 * 1. Go to your Firebase Console: https://console.firebase.google.com/u/0/project/studio-8485961398-7d33e/authentication/settings
 * 2. Click on 'Authorized domains' in the left menu of the settings page.
 * 3. Click 'Add domain'.
 * 4. Paste your current app URL (the one in your browser's address bar, e.g., '*.googleusercontent.com').
 * 
 * STEP-BY-STEP SETUP:
 * 1. In your Firebase Console, click the Gear Icon -> Project settings.
 * 2. Scroll down to 'Your apps'.
 * 3. Copy the 'apiKey' and 'appId' from the 'Config' radio button and replace the placeholders below.
 */
export const firebaseConfig = {
  apiKey: "REPLACE_WITH_YOUR_REAL_API_KEY", // Get this from Firebase Console -> Project Settings
  authDomain: "studio-8485961398-7d33e.firebaseapp.com",
  projectId: "studio-8485961398-7d33e",
  storageBucket: "studio-8485961398-7d33e.firebasestorage.app",
  messagingSenderId: "8485961398",
  appId: "REPLACE_WITH_YOUR_REAL_APP_ID" // Get this from Firebase Console -> Project Settings
};
