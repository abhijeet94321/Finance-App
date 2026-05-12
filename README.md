
# Saldo - Smart Financial Tracking

This is a Next.js application built with Firebase and Genkit AI.

## Vercel Deployment

1. Push this code to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Add the following Environment Variable in Vercel:
   - `GOOGLE_GENAI_API_KEY`: Your Google Gemini API Key.
4. **CRITICAL**: After deployment, copy your Vercel URL and add it to **Firebase Console > Authentication > Settings > Authorized domains**.

## Local Development

```bash
npm install
npm run dev
```

The AI features require a `GOOGLE_GENAI_API_KEY` in your local `.env` file.
