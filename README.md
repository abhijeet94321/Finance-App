# Saldo - Hosting on Vercel

Follow these steps to deploy your penny-perfect financial tracker.

## Step 1: Pushing Code to GitHub

1. **Create a Repository**: Go to [GitHub](https://github.com/new) and create a new repository. Do not initialize it with a README or License.
2. **Initialize Git Locally**: In your project's terminal, run these commands:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <YOUR_GITHUB_REPO_URL_HERE>
   git push -u origin main
   ```

## Step 2: Import to Vercel
1. Go to [Vercel](https://vercel.com) and sign in.
2. Click **Add New** > **Project**.
3. Import your newly created GitHub repository.

## Step 3: Configure Environment Variables
In the **Environment Variables** section during setup, add:
- `GOOGLE_GENAI_API_KEY`: Your Gemini API key from Google AI Studio.
- `NEXT_PUBLIC_FIREBASE_API_KEY`: Your Firebase API Key.

## Step 4: Authorize the Production Domain (CRITICAL)
Once Vercel gives you a deployment URL (e.g., `saldo-tracker.vercel.app`):
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Navigate to **Authentication** > **Settings** > **Authorized domains**.
3. Click **Add domain** and paste your Vercel URL.
*Without this step, users will see an "Unauthorized Domain" error when trying to log in.*

## Step 5: Deploy
Click **Deploy**. Your app will be live in a few minutes!