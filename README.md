# Licht van de Wereld

Website van de Iraanse christelijke gemeente Licht van de Wereld in Almere. De site gebruikt Next.js App Router, React, Sass en `react-intl`.

## Lokaal starten

```bash
npm install
npm run dev
```

Open daarna [http://localhost:3000](http://localhost:3000). De root verwijst naar de Nederlandse site op `/nl`; Engels en Farsi staan op `/en` en `/fa`.

## Productie

```bash
npm run lint
npm run build
npm start
```

Stel `NEXT_PUBLIC_SITE_URL` in wanneer de productiedomeinnaam afwijkt van `https://lichtwereld.com`.

## Evenementregistratie opnieuw activeren

De registratiepagina en API staan standaard veilig uit. Stel deze variabelen in en voer daarna opnieuw een build/deployment uit:

- `NEXT_PUBLIC_EVENT_REGISTRATION_ENABLED=true`
- `EVENT_REGISTRATION_ENABLED=true`
- `EMAIL_USER`
- `EMAIL_PASS`
- `THIRD_PERSON_EMAIL`

Zonder beide feature flags retourneert de API een `404` en staat de evenementpagina niet in menu of sitemap.
