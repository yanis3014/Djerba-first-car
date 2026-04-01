# Djerba-first-car

Site vitrine premium pour Djerba First Car (vente, achat et echange de voitures a Djerba).

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Supabase
- Cloudinary

## Lancement local

```bash
npm install
npm run dev
```

Ouvrir `http://localhost:3000`.

## Variables d'environnement

Copier `.env.example` vers `.env.local` puis renseigner les cles:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `RESEND_API_KEY`

## Scripts

- `npm run dev` : developpement
- `npm run build` : build production
- `npm run start` : lancement production
- `npm run lint` : verification lint
