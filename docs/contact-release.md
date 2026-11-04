# Contact gateway release

The browser calls only its own `/api/v1/contact` and `/api/v1/contact/challenge`.
The Nuxt server forwards to the portfolio's dedicated API origin over HTTPS using
the server-only `NUXT_CONTACT_GATEWAY_TOKEN`. The API uses the same value as
`CONTACT_GATEWAY_TOKEN` and refuses direct unauthenticated contact requests in
production. Keep this value outside Git and public Nuxt runtime configuration.

The gateway accepts JSON within the contact body cap, checks same-origin POSTs,
constructs its own upstream headers, disables redirects/retries and bounds its
upstream timeout and response size. It forwards the original trusted Cloudflare
visitor address with the credential so the API retains per-visitor rate limits.
Untrusted forwarding headers and cookies are not passed through. Production
requires the Cloudflare runtime context; use the `cloudflare_pages` preset.

Before release, provision one app-specific random URL-safe secret of 32–128
characters in the API environment and the Cloudflare Pages server runtime. Do
not reuse an SMTP password, another app's credential or the Cloudflare DNS token.
Deploy the reviewed API and frontend together in a controlled release; the old
EmailJS form keeps working until the frontend switch. Keep EmailJS accounts and
other dependants intact. Do not remove the live site's EmailJS access first.

The frontend branch includes the previously unpublished `ea5c16c` contact change.
Review/test/commit/push the exact release before any deployment, and obtain the
owner's explicit production confirmation. Afterwards verify that browser calls
stay same-origin, the public API rejects missing credentials, and the owner can
receive a controlled contact message. This branch does not send test emails.
