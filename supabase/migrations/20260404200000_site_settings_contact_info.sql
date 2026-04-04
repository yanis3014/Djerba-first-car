-- Coordonnées et horaires (fiche Google / lieu réel).

update public.site_settings
set
  address = 'VV4Q+GH2, Houmt Souk, Tunisie',
  phone_display = '+216 53 145 000',
  hours_weekday = '9h00–18h30',
  hours_sunday = 'Fermé',
  updated_at = now()
where id = 1;
