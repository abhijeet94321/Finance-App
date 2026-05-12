# Saldo - Hosting on Vercel

Follow these steps to deploy your penny-perfect financial tracker.

### Step 1: Prepare your Code
Ensure your code is pushed to a Git provider (GitHub, GitLab, or Bitbucket).

### Step 2: Import to Vercel
1. Go to [Vercel](https://vercel.com) and sign in.
2. Click **Add New** > **Project**.
3. Import your repository.

### Step 3: Configure Environment Variables
In the **Environment Variables** section during setup, add:
- `GOOGLE_GENAI_API_KEY`: Your Gemini API key from Google AI Studio.
- `NEXT_PUBLIC_FIREBASE_API_KEY`: (Optional but recommended) Your Firebase API Key.

### Step 4: Authorize the Production Domain (CRITICAL)
Once Vercel gives you a deployment URL (e.g., `saldo-tracker.vercel.app`):
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Navigate to **Authentication** > **Settings** > **Authorized domains**.
3. Click **Add domain** and paste your Vercel URL.
*Without this step, users will see an "Unauthorized Domain" error when trying to log in.*

### Step 5: Deploy
Click **Deploy**. Your app will be live in a few minutes!