# Cartographie Prisma et stratégie Supabase

## État du dépôt (audit)

- **Aucune dépendance Prisma** (`prisma`, `@prisma/client`) et **aucun schéma** `schema.prisma` dans ce projet.
- La couche données est **Supabase** (Postgres + `@supabase/supabase-js` + `@supabase/ssr`) avec des types TypeScript dans `lib/types.ts` et des accès dans `lib/cars.ts`, `lib/supabase.ts`, actions admin, etc.

## Conséquence

Il n’existe **pas de migration Prisma → Supabase** à exécuter dans ce repo : il n’y a pas de régression fonctionnelle liée à Prisma car le stack n’a jamais été intégré ici.

## Si un autre service utilisait encore Prisma

1. **Modèle cible** : reproduire les tables Postgres (colonnes, contraintes, index) dans Supabase (SQL ou migrations).
2. **Données** : export `pg_dump` / CSV depuis l’ancienne base puis import dans Supabase (ou script ETL ponctuel).
3. **Application** : remplacer les appels Prisma par le client Supabase (requêtes équivalentes, RLS à la place de la logique middleware Prisma).
4. **Auth** : Supabase Auth remplace souvent Prisma + NextAuth ; aligner les IDs utilisateurs et les rôles (`app_metadata.role`, etc.).

## Références

- Schéma SQL et politiques RLS : `supabase/migrations/`
- Seed de démo : `supabase/seed.sql`
