# Lichtwereld contact form on Vercel

Delivery: browser → Vercel POST /api/contact → Google Apps Script → lichtwereldkerk2022@gmail.com.
The contact form uses Google Apps Script only.

## Vercel Production environment variables

Set these in the Vercel project for lichtwereld.com, under Settings → Environment Variables:

| Name | Value |
| --- | --- |
| NEXT_PUBLIC_SITE_URL | https://lichtwereld.com |
| CONTACT_APPS_SCRIPT_URL | The /exec URL from .env.example or your latest Google deployment |
| CONTACT_APPS_SCRIPT_SECRET | The existing private value in .env.local |

The secret must match Google Apps Script → Project Settings → Script properties → CONTACT_APPS_SCRIPT_SECRET.
Keep it out of NEXT_PUBLIC_ variables, source code and chat.
These variables belong to the Vercel project, not the domain DNS settings.

## Google deployment

Use Code.gs and appsscript.json from this directory.
The recipient is fixed to lichtwereldkerk2022@gmail.com.
Deploy with Execute as: Me and access: Anyone.
After code changes, publish a new version through Manage deployments.
The GET response "method-not-allowed" is expected: this script receives form submissions through POST.

## Verify and publish

Run npm run check:contact locally. It checks the secret with all email fields omitted and never sends email.
"invalid" confirms authentication passed and the script rejected the intentionally missing fields.
"forbidden" means keys differ; "unavailable" means the Google configuration needs attention.

Redeploy the Vercel project after changing environment variables.
Open https://lichtwereld.com/nl/contact (or /en/contact or /fa/contact), send a real test message, and check the church inbox and Spam.
The Google request has a 20-second deadline; Vercel allows 30 seconds; the browser allows 35 seconds.
Google's response redirect is followed only as GET to script.googleusercontent.com/macros/echo without the secret or form body.
Uncertain deliveries are not automatically retried.

The separately disabled event-registration endpoint has independent mail settings.

Official references:
- https://vercel.com/docs/environment-variables
- https://vercel.com/docs/functions/configuring-functions/duration
- https://developers.google.com/apps-script/guides/web
- https://developers.google.com/apps-script/guides/content
