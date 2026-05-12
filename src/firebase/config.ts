
/**
 * Firebase configuration for the Saldo project.
 * 
 * TO FIX 'auth/unauthorized-domain':
 * 1. Go to your Firebase Console: https://console.firebase.google.com/project/studio-8485961398-7d33e/authentication/settings
 * 2. Click on the 'Authorized domains' tab.
 * 3. Click 'Add domain'.
 * 4. Paste the domain of this preview window (it looks like: studio-8485961398-9002.googleusercontent.com).
 * 5. Also ensure 'localhost' is in the list.
 * 
 * TO FIX 'auth/api-key-not-valid':
 * 1. Go to Project Settings: https://console.firebase.google.com/project/studio-8485961398-7d33e/settings/general
 * 2. Scroll to 'Your apps', select your web app, and copy the 'apiKey' from the 'Config' radio button.
 */
export const firebaseConfig = {
  apiKey: "AIzaSyAGNuEhHsUQmLAEK_Fe6Y8JB14fFGRArr0", // REPLACE THIS with your real key from Project Settings
  authDomain: "studio-8485961398-7d33e.firebaseapp.com",
  projectId: "studio-8485961398-7d33e",
  storageBucket: "studio-8485961398-7d33e.firebasestorage.app",
  messagingSenderId: "8485961398",
  appId: "1:8485961398:web:7d33e" // This should also be updated from Project Settings
};
