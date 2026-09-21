# IGERS POWERCORE — GitHub-free Vercel deployment

The project is prepared for Vercel without a GitHub repository.

## Deploy with Vercel CLI

1. Install Node.js LTS.
2. In this project folder run:

```bash
npm install
npx vercel login
npx vercel --prod
```

Vercel will build with `npm run build` and publish `dist/`.

## Custom domain

After deployment, add:

`igersbdr.com`

in Vercel → Project → Settings → Domains.

Use the DNS records Vercel shows for the domain registrar. HTTPS/SSL is then handled by Vercel.

## Important

No GitHub repository is required for this route. The local static build and existing website features remain the source of deployment.
