/**
 * Firebase configuration for the Saldo project.
 * 
 * TROUBLESHOOTING GUIDE:
 * 
 * 1. FIX 'auth/unauthorized-domain':
 *    - Go to: https://console.firebase.google.com/project/studio-8485961398-7d33e/authentication/settings
 *    - Click the 'Authorized domains' tab.
 *    - Click 'Add domain' and add: studio-8485961398-9002.googleusercontent.com
 *    - Also ensure 'localhost' is in the list.
 * 
 * 2. FIX 'auth/api-key-not-valid':
 *    - Go to: https://console.firebase.google.com/project/studio-8485961398-7d33e/settings/general
 *    - Scroll down to 'Your apps'.
 *    - Select the 'Config' radio button.
 *    - Copy the 'apiKey' and replace the value below if it differs.
 * 
 * 3. ENABLE GOOGLE SIGN-IN:
 *    - Go to: https://console.firebase.google.com/project/studio-8485961398-7d33e/authentication/providers
 *    - Click 'Add new provider' -> 'Google' and enable it.
 */
export const firebaseConfig = {
  apiKey: "AIzaSyAGNuEhHsUQmLAEK_Fe6Y8JB14fFGRArr0", 
  authDomain: "studio-8485961398-7d33e.firebaseapp.com",
  projectId: "studio-8485961398-7d33e",
  storageBucket: "studio-8485961398-7d33e.firebasestorage.app",
  messagingSenderId: "8485961398",
  appId: "1:8485961398:web:7d33e"
};
