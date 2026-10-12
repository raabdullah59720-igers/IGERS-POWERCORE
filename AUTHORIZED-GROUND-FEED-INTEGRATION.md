# IGERS-BD-01 — Authorized Ground Traffic Integration

## What this upgrade can and cannot do

- The ZIP supplies the dashboard connector, status UI, documented JSON contract, and a private server-side adapter.
- It does **not** grant access to restricted Bangladesh government/border CCTV, sensor networks, traffic databases or private APIs. That requires the owner agency's written approval and credentials.
- No credentials are hard-coded in frontend assets. `authorized-feed-config.js` contains only a same-origin path, not a key.
- A public GitHub Pages site must not display restricted camera or border-operational data. Deploy that view on an organization-controlled private domain behind SSO/VPN. Keep the public Pages site limited to public imagery and public datasets.
- NASA satellite/aerial map tiles are not real-time video. ADS-B is aircraft position data, not ground traffic. Do not derive vehicle/person counts from map imagery.

## Request to the feed owner

Ask the relevant agency/port/operator to provide, if policy allows:

1. Written authorization, named data owner, approved purpose, permitted sites, users, and operating dates.
2. A read-only HTTPS API with aggregate vehicle count, queue length, open-lane state, online/total camera count, observation timestamp/timezone, source name, and health state.
3. A project-specific token/service account, rotation/revocation process, rate limits, and test/sandbox endpoint.
4. Approved hosting/network route (VPN or private subnet), SSO/MFA requirements, audit rules, retention schedule and incident contact.
5. Data classification and whether even aggregate values can be displayed outside the agency network.

## Deployment sequence

1. Keep `authorized-feed-config.js` blank in the public repository.
2. Obtain owner approval and a test schema.
3. Deploy `authorized-ground-gateway/` on the approved private host, use `.env.example` only as a template, and set real environment variables through the private deployment system.
4. Configure a same-origin reverse proxy at `/api/operations/status` with authentication/authorization enforced before requests reach the gateway.
5. Deploy the dashboard on that same private origin and set `operationsStatusUrl: "/api/operations/status"` there.
6. Validate provider field mapping, observed timestamp, stale-data behavior, network ACLs, access logs, credential rotation, mobile layout, and service-worker refresh. Do not mark it operational before all checks pass.

## Dashboard data schema

```json
{
  "schemaVersion": 1,
  "status": "connected",
  "source": "Owner-authorized ground traffic summary",
  "observedAt": "2026-10-12T01:00:00.000Z",
  "receivedAt": "2026-10-12T01:00:01.000Z",
  "metrics": {
    "vehicles": 0,
    "queueLength": 0,
    "lanesOpen": 0,
    "camerasOnline": 0,
    "camerasTotal": 0
  }
}
```

The sample is a **schema example only**, not real Bangladesh traffic or camera data. Zero is a valid measured value only when reported by the upstream source; missing values must be `null` or omitted.
