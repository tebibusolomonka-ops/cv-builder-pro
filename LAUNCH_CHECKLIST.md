# Netsa CV launch checklist

## Required Vercel settings

- [ ] In **Project → Firewall → Configure**, create a fixed-window rate-limit rule named `Protect PDF export`.
  - Condition: Request Path equals `/api/export`
  - Count by: IP
  - Limit: 3 requests
  - Window: 10 minutes
  - Action: Rate Limit (HTTP 429)
  - Start in **Log** mode for a short production test, then publish the blocking action.
- [ ] In **Usage**, confirm usage notifications are enabled. On Pro, set Spend Management to a budget the owner is comfortable with.
- [ ] In **Observability → Functions**, watch `/api/export` duration, invocation count, and 5xx rate during launch.
- [ ] If the plan includes Alerts, subscribe the owner to usage-anomaly and error-anomaly notifications.

The browser also limits exports, but it is a convenience guard only. The WAF rule is the real shared protection across browsers and devices.

## Production smoke test

Run after deployment:

```powershell
$env:NETSA_CV_URL='https://netsacv.com'
npm run launch:check
```

Then manually verify on one Android phone and one iPhone-sized viewport:

- [ ] Choose a normal template and the Europass template.
- [ ] Complete, remove, and restore fields and sections.
- [ ] Upload a profile photo.
- [ ] Download and restore a JSON backup.
- [ ] Export a one-page and multi-page PDF; confirm selectable text and no clipping.
- [ ] Navigate the editor using only the keyboard and confirm visible focus.
- [ ] Test Chrome, Edge, Firefox, and one private/incognito window.

## External decisions still required

- [ ] Choose a public support email before adding a feedback link.
- [ ] Choose an error-monitoring vendor and approve its privacy impact before adding a client SDK or DSN.
- [ ] If analytics are added, update the privacy page before deployment. It currently promises no analytics.
