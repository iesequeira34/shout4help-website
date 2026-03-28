# Shout4Help Website

This project contains the marketing site and the tester signup flow for `Shout4Help`.

## Local development

1. Copy `.env.example` to `.env`.
2. Fill in the Google Workspace and Play testing values in `.env`.
3. Install dependencies with `npm install`.
4. Run both the frontend and backend with `npm run dev`.

The Vite frontend runs on `http://localhost:5173`.
The signup API runs on `http://localhost:8787`.

## Required environment variables

- `GOOGLE_GROUP_EMAIL`
  Use your Google Workspace-managed tester group email.
- `GOOGLE_IMPERSONATED_ADMIN_EMAIL`
  This must be a Workspace admin or delegated admin account allowed to manage group members.
- `GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL`
  The client email of the service account created in Google Cloud.
- `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`
  The private key from the service account JSON key.
- `VITE_PLAY_TEST_URL`
  The Google Play testing opt-in link shown after a successful add-to-group response.
- `PORT`
  Optional backend port. Defaults to `8787`.
- `VITE_API_BASE_URL`
  Optional frontend override for the backend base URL. Leave empty in local development.

## Google Workspace setup

To let the signup API add members automatically:

1. Create or choose a Google Workspace-managed group for testers.
2. Make sure your group is `internal-testers@shout4help.com` or update `GOOGLE_GROUP_EMAIL`.
3. Enable the Admin SDK API in your Google Cloud project.
4. Create a service account and download its JSON key.
5. Enable domain-wide delegation for that service account.
6. In Google Workspace Admin, grant domain-wide delegation for:
   - `https://www.googleapis.com/auth/admin.directory.group.member`
7. Use `ian.sequeira@shout4help.com` as `GOOGLE_IMPERSONATED_ADMIN_EMAIL`.
8. Copy the `client_email` and `private_key` values from the JSON key into `.env`.
9. Put your Play internal testing opt-in URL into `VITE_PLAY_TEST_URL`.

## Signup behavior

The frontend sends the entered Gmail address to `POST /api/testers`.
The backend validates the Gmail address and then calls the Google Admin SDK Directory API to add that address to the configured Workspace group as a `MEMBER`.

If the address is already present, the signup flow still succeeds and the Play test link is unlocked immediately.
