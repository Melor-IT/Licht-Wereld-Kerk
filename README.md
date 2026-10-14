# Licht van de Wereld

Website van de Iraanse christelijke gemeente Licht van de Wereld in Almere. De site gebruikt Next.js App Router, React, CSS en `react-intl`.

## Projectstructuur

De indeling volgt het patroon van `mantleofpraise`: vaste onderdelen in `fixed`, gedeelde bouwstenen in `system` en componentstijlen onder `style/component`. Elke locale-route stelt zijn pagina rechtstreeks samen uit sectiecomponenten; er zijn geen volledige paginaweergaven in `components/pages`.

```text
src/
  app/                  Next.js-routes, layouts, metadata en API
  components/
    fixed/              Header en Footer
    system/             Hero, ContentSection, ServicesSection, AboutSection,
                        TeamIntro, SermonsLibrary, EventRegistrationSection,
                        BackgroundImage en EventRegistrationForm
    SiteShell.jsx       Gedeelde site-indeling en taalprovider
  style/
    component/          CSS per gedeelde component en sectie
    globals.css         Thema, typografie en basisstijlen
    fonts.css           Lokale fontdefinities
    main.css            Centrale imports van alle componentstijlen
  data/                 Sectie-inhoud, vertaalreferenties en prekenarchief
  lib/                  Siteconfiguratie, metadata en prekenlogica
messages/               Vertalingen voor Nederlands, Farsi en Engels
public/
  images/               Afbeeldingen
  fonts/                Fontbestanden, licenties en bronvermelding
```

De locale-layout laadt `style/globals.css` en `style/main.css` één keer. Voeg de CSS van nieuwe componenten toe aan `style/main.css`; importeer component-CSS niet afzonderlijk vanuit JSX-bestanden.

De zes `page.jsx`-bestanden onder `app/[locale]` bepalen de sectievolgorde. `Hero` verzorgt de paginabanner, `ContentSection` de tekst- en lijstsecties, en de andere sectiecomponenten verzorgen diensten, introducties, registraties en de interactieve prekenbibliotheek. `data/page-sections.js` bevat hun inhoud en vertaalreferenties; de bestaande taalprovider vertaalt deze tijdens het renderen. De API, paginametadata en de prekenfeed blijven in de route- en lib-bestanden.

## Typografie

Vazirmatn voor Farsi en Nunito Sans voor Nederlands en Engels worden lokaal geladen uit `public/fonts`. De variabele WOFF2-bestanden en hun licenties staan in die map. Er zijn geen externe Google Fonts-verzoeken nodig. Zie `public/fonts/README.md` voor bronnen en licenties.

`src/style/globals.css` bevat de gedeelde tekstgroottes, gewichten en regelhoogtes. Componentstijlen gebruiken deze variabelen; de Farsi-regelhoogtes worden via de paginataal ingesteld. De kopgroottes schalen mee met het scherm.

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

## Preken

De prekenpagina staat op `/nl/sermons`, `/fa/sermons` en `/en/sermons` en is bereikbaar via het menu. De pagina toont uitsluitend video's uit de [gekozen prekenplaylist](https://www.youtube.com/playlist?list=PLxVsOcclP97dZv5HZM9qopGXU2Uw-mVrC), met een videospeler, zoeken op titel en zes opnames per pagina. De playlist-ID en URL staan in `src/lib/sermon-source.js`; ook de speler en YouTube-links gebruiken deze playlist.

De server haalt de YouTube Atom-feed van de playlist op zonder API-sleutel en vernieuwt deze elk uur. De feed levert maximaal 15 openbare video's; de volledige verzameling blijft bereikbaar via de link naar de playlist. `src/data/sermons.json` bevat een geverifieerde kopie van uitsluitend deze playlist als reserve wanneer YouTube niet bereikbaar is. Vervang bij een wijziging van de playlist ook deze reservekopie. Bij een geslaagde verversing is de feed leidend, zodat verwijderde video's niet via de reservekopie terugkomen. De datum bij een video is de publicatiedatum op YouTube.

`excludedVideoIds` in `src/lib/sermons.js` verbergt geselecteerde opnames bij zowel verversing als gebruik van de reservekopie. De opname 'Garment Of Praise' (`UpaxJ4YOg-M`) is op verzoek uitgesloten. De speler opent alleen de geselecteerde video, zodat de YouTube-playlist geen uitgesloten opname als volgende video afspeelt.

## Evenementregistratie opnieuw activeren

De registratiepagina en API staan standaard veilig uit. Stel deze variabelen in en voer daarna opnieuw een build/deployment uit:

- `NEXT_PUBLIC_EVENT_REGISTRATION_ENABLED=true`
- `EVENT_REGISTRATION_ENABLED=true`
- `EMAIL_USER`
- `EMAIL_PASS`
- `THIRD_PERSON_EMAIL`

Zonder beide feature flags retourneert de API een `404` en staat de evenementpagina niet in menu of sitemap.
