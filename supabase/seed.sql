-- Données de démo (à lancer après init_schema + RLS).
-- Les UUID sont générés ; adaptez les slugs si collision.

insert into public.cars (
  slug, brand, model, year, price, mileage, fuel_type, transmission,
  color, engine, power, doors, condition, status, description,
  features, images, cover_image, is_featured, views
) values
(
  'demo-bmw-serie-3-2021',
  'BMW',
  'Serie 3',
  2021,
  115000,
  48000,
  'Diesel',
  'Automatique',
  'Noir',
  '2.0',
  190,
  4,
  'used',
  'available',
  'Berline premium, première main, entretien suivi.',
  '["GPS","Bluetooth","Caméra de recul","ABS"]'::jsonb,
  '["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&auto=format&fit=crop"]'::jsonb,
  'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&auto=format&fit=crop',
  true,
  42
),
(
  'demo-mercedes-classe-c-2020',
  'Mercedes',
  'Classe C',
  2020,
  102000,
  62000,
  'Essence',
  'Automatique',
  'Gris',
  '1.8',
  156,
  4,
  'used',
  'available',
  'Confort et élégance, idéal quotidien.',
  '["Apple CarPlay","Airbags","ESP"]'::jsonb,
  '["https://images.unsplash.com/photo-1617814076668-8df173af8658?w=1200&auto=format&fit=crop"]'::jsonb,
  'https://images.unsplash.com/photo-1617814076668-8df173af8658?w=1200&auto=format&fit=crop',
  true,
  28
)
on conflict (slug) do nothing;
