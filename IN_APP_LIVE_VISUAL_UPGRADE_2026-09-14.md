# IGERS In-App Live Visual Upgrade — 2026-09-14

## Scope
This release keeps the existing IGERS application and its prior live systems while converting the newly added satellite/NASA experience to an in-app visual workflow.

## In-app behavior
- NASA GIBS Earth-observation imagery is rendered directly inside the IGERS page.
- Satellite observation can be expanded in an in-app modal; it does not navigate to NASA Worldview.
- NASA EONET regional event records are rendered inside the application and can be opened in an in-app detail modal.
- NASA Astronomy Picture of the Day is rendered in the application and can be enlarged in-app.
- Satellite/BMD navigation cards scroll to internal IGERS panels instead of opening external pages.
- Source-state indicators remain source-specific and do not claim spacecraft telemetry or uninterrupted live video.

## Regression checks
- Production static build: PASS
- JavaScript syntax checks: PASS
- Duplicate HTML IDs: 0
- Broken local asset references: 0
- Satellite section external navigation: 0
- NASA section external navigation: 0
- Core/legal/runtime HTTP routes: 200
- Existing Air Traffic / Earthquake / Airspace / Bangabandhu-1 markers: present
- ZIP integrity: to be recorded after packaging

## External-feed limitation
The local QA environment cannot guarantee third-party external-feed availability. The application therefore exposes explicit feed freshness/availability states instead of falsely marking unavailable data as LIVE.
