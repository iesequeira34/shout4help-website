# Shout4Help Website

This project contains the marketing site and the tester onboarding flow for `Shout4Help`.

## Local development

1. Copy `.env.example` to `.env`.
2. Fill in the Google Group and Play testing values in `.env`.
3. Install dependencies with `npm install`.
4. Run the frontend with `npm run dev`.

The Vite frontend runs on `http://localhost:5173`.

## Required environment variables

- `VITE_GOOGLE_GROUP_JOIN_URL`
  The Google Group join page you want testers to open first.
- `VITE_PLAY_TEST_URL`
  The Google Play testing opt-in link you want to unlock after the tester joins the group.
- `VITE_GROUP_JOIN_DELAY_MS`
  Optional delay before the confirmation button becomes available. Defaults to `12000`.

## Google Group setup

To use the current onboarding flow:

1. Create or choose a Google Group for your testers.
2. Add that Google Group as a tester list in Google Play Console.
3. Copy the public or joinable Google Group URL into `VITE_GOOGLE_GROUP_JOIN_URL`.
4. Copy the Play testing opt-in URL into `VITE_PLAY_TEST_URL`.
5. Adjust `VITE_GROUP_JOIN_DELAY_MS` if you want a longer or shorter delay before the test link can be unlocked.

## Tester onboarding behavior

The landing page now guides testers through a two-step flow:

1. Open the Google Group join page.
2. Confirm that they joined successfully after a short delay.
3. Unlock and open the Play testing link.

The website does not verify Google Group membership automatically. The unlock step is a guided UX gate so the Play link is only enabled after the tester has had a chance to join the group first.
