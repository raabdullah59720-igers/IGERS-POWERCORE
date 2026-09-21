# IGERS POWERCORE — Direct Deployment Package

Version: 1.1.0-designer  
Project: IGERS-BD-01 — Integrated Gradient-Based Energy Recovery & Storage System  
Organization concept: IGERS POWERCORE TECHNOLOGIES LTD.  
Author / Inventor: Abdullah Al Rafi [BD]

## What is included
This package keeps the latest verified IGERS interface as the functional base and adds a non-destructive designer layer. Existing monitoring and information modules are retained, including:

- energy recovery concept architecture and deployment views
- live time and weather panels
- environmental / earthquake indicators
- live air-traffic panel
- Bangladesh Airspace Anomaly Monitor
- satellite connection/orbital public-data monitor
- NASA GIBS near-real-time imagery panel
- NASA POWER atmospheric panel
- satellite/disaster/navigation information layer
- comments & customer-care demo interface
- copyright, privacy and terms/disclaimer pages
- Bangladesh flag visual treatment and responsive mobile navigation

## Local run

```bash
npm run build
npm run serve
```

Then open `http://127.0.0.1:4173/`.

## Static hosting
The production output is written to `dist/`. Upload the **contents of `dist/`** to a static hosting service. No GitHub repository is required for the static files themselves.

Connect the custom domain `igersbdr.com` at the hosting provider using that provider's DNS instructions.

## Important data note
The dashboard uses public external data services. A live indicator means the browser reached the relevant public feed; it is not a guarantee that every upstream service is continuously available.

The NASA Worldview panel is represented through the public NASA GIBS data layer and official source links. The site does not claim restricted spacecraft telemetry or military system access.

The visitor comments interface in this static package is local browser demo storage; it does not send messages to a remote inbox.
