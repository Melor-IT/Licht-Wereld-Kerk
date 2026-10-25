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
                        EventSchedule, BackgroundImage en EventRegistrationForm
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

De `page.jsx`-bestanden onder `app/[locale]` bepalen de sectievolgorde. `Hero` verzorgt de paginabanner, `ContentSection` de tekst- en lijstsecties, en de andere sectiecomponenten verzorgen diensten, introducties, registraties en de interactieve prekenbibliotheek. `data/page-sections.js` bevat hun inhoud en vertaalreferenties; de bestaande taalprovider vertaalt deze tijdens het renderen. De API, paginametadata en de prekenfeed blijven in de route- en lib-bestanden.

De kerkintroductie is verdeeld over drie pagina’s: `about-us` (introductie, geschiedenis, visie, missie, waarden, geloof en welkom), `about-us/ministries` (activiteiten en maatschappelijke betrokkenheid) en `about-us/leadership` (het team). De inhoud van de voormalige visiepagina is samengevoegd met `about-us`; overlappende passages zijn ingekort. De oude URL `/{locale}/our-vision` verwijst permanent naar `/{locale}/about-us` en staat niet meer in menu’s of de sitemap. `data/about-sections.js` verdeelt de inhoud; `ChurchNavigation` verbindt de pagina’s in alle drie de talen. Deze pagina’s gebruiken dezelfde `Hero`, `ContentSection`, `TeamIntro` en basisstijlen als de rest van de site. Nieuwe routes krijgen via `lib/site.js` metadata, taalalternatieven en een plaats in de sitemap.

## Contactformulier

De contactpagina staat op `/fa/contact`, `/nl/contact` en `/en/contact` en is bereikbaar via het hoofdmenu, de footer en de knop op de over-ons-pagina. Het formulier verstuurt naam, e-mailadres, onderwerp en bericht via `/api/contact` naar Google Apps Script. `MailApp` verstuurt het bericht als platte tekst naar de vaste ontvanger `lichtwereldkerk2022@gmail.com`; antwoorden gaan via `Reply-To` naar de bezoeker. Het adres staat in `google-apps-script/Code.gs` en voor de openbare e-maillink in `src/data/contact.js`.

Publiceer `google-apps-script/Code.gs` als Web app die als de eigenaar wordt uitgevoerd en zonder Google-login bereikbaar is. Stel `CONTACT_APPS_SCRIPT_SECRET` in als Script property en zet dezelfde sleutel (32–256 tekens) op de server. `CONTACT_APPS_SCRIPT_URL` bevat de gepubliceerde HTTPS-URL `https://script.google.com/macros/s/DEPLOYMENT_ID/exec`. Zie [de volledige Perzische installatiehandleiding](google-apps-script/README.fa.md) en `.env.example`. De URL en sleutel blijven uitsluitend op de server. De API volgt de Content Service-redirect van Google, wacht maximaal 20 seconden en meldt alleen succes bij JSON met `success: true`. Zonder configuratie retourneert de API `503`; de directe e-maillink blijft bruikbaar. SMTP-inloggegevens en registratie-featureflags zijn niet nodig voor het contactformulier. De afzonderlijke registratie-API behoudt haar bestaande SMTP-instellingen.

Het contactformulier gebruikt dezelfde begrensde JSON-lezer en verzoeklimiet als de registratie-API: maximaal 15.000 bytes per verzoek en vijf pogingen per IP-adres per vijftien minuten, per serverproces. De productieproxy moet IP-headers zelf overschrijven. `NEXT_PUBLIC_SITE_URL`, indien ingesteld, bepaalt de toegestane oorsprong; anders wordt de oorsprong van het verzoek gebruikt. Tests simuleren de Google-diensten en sturen geen echte e-mails.

## Giften

De knop Geven in de header en footer opent de gedeelde donatiedialoog, met vertalingen voor Nederlands, Farsi en Engels. De rekeninghouder, het IBAN, KVK en RSIN staan in `src/data/donation.js`; ook de footer gebruikt deze gegevens. De dialoog ondersteunt het kopiëren van het IBAN en toont een melding als dit niet lukt.

Er is nog geen betaallink of QR-code ingesteld. `DonationProvider` accepteert optioneel een `qrDataUrl`; de QR-sectie verschijnt alleen als die beschikbaar is. Een directe betaallink wordt alleen getoond wanneer ook `paymentUrl` in de donatiegegevens is ingevuld.

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
npm test
npm run build
npm start
```

Stel `NEXT_PUBLIC_SITE_URL` in wanneer de productiedomeinnaam afwijkt van `https://lichtwereld.com`.

## Preken

De prekenpagina staat op `/nl/sermons`, `/fa/sermons` en `/en/sermons` en is bereikbaar via het menu. De pagina toont uitsluitend video's uit de [gekozen prekenplaylist](https://www.youtube.com/playlist?list=PLxVsOcclP97dZv5HZM9qopGXU2Uw-mVrC), met een videospeler, zoeken op titel en zes opnames per pagina. De playlist-ID en URL staan in `src/lib/sermon-source.js`; ook de speler en YouTube-links gebruiken deze playlist.

De server haalt de YouTube Atom-feed van de playlist op zonder API-sleutel en vernieuwt deze elk uur. De feed levert maximaal 15 openbare video's; de volledige verzameling blijft bereikbaar via de link naar de playlist. `src/data/sermons.json` bevat een geverifieerde kopie van uitsluitend deze playlist als reserve wanneer YouTube niet bereikbaar is. Vervang bij een wijziging van de playlist ook deze reservekopie. Bij een geslaagde verversing is de feed leidend, zodat verwijderde video's niet via de reservekopie terugkomen. De datum bij een video is de publicatiedatum op YouTube.

`excludedVideoIds` in `src/lib/sermons.js` verbergt geselecteerde opnames bij zowel verversing als gebruik van de reservekopie. De opname 'Garment Of Praise' (`UpaxJ4YOg-M`) is op verzoek uitgesloten. De speler opent alleen de geselecteerde video, zodat de YouTube-playlist geen uitgesloten opname als volgende video afspeelt.

## Agenda: preken en online vrijdaglessen

De openbare agenda staat op `/nl/event`, `/fa/event` en `/en/event` en is altijd bereikbaar via het menu en de sitemap. De pagina toont preken en online vrijdaglessen apart. De keuze voor afgelopen bijeenkomsten is tijdelijk uitgecommentarieerd in `EventSchedule.jsx`; bezoekers zien alleen komende bijeenkomsten. De archieflogica en ingevoerde gegevens blijven bewaard. Datums worden op volgorde getoond; vanaf de volgende kalenderdag verhuizen bijeenkomsten naar het archief. Dit gebruikt de tijdzone `Europe/Amsterdam`, onafhankelijk van de tijdzone van de server of bezoeker. De Farsi-weergave toont datums volgens de Perzische kalender.

Het vaste weekprogramma staat in `src/data/weekly-events.json`: iedere zondag om 15:00 in de kerk (Hildo Kropstraat 8, Almere) en iedere vrijdag om 20:00 online, in Nederlandse lokale tijd. De agenda toont precies vier zondagen: de eerstvolgende zondag (vandaag inbegrepen) en de drie daaropvolgende zondagen. Pas maandag om 00:00 in `Europe/Amsterdam` verdwijnt de afgelopen zondag en wordt een nieuwe zondag toegevoegd. Vrijdaglessen behouden hun zes komende datums. Zomer- en wintertijd worden automatisch verwerkt, zonder cronjob. De pagina blijft dynamisch; een geopende of uit de routercache herstelde pagina werkt ook lokaal bij vanaf de eerstvolgende Amsterdamse middernacht en bij terugkeer naar het tabblad. De eerste clientrender gebruikt de serverdatum om hydrationverschillen te voorkomen. Alleen expliciet ingevoerde bijeenkomsten worden in het archief bewaard. Voeg een openbare leslink eventueel toe als `url` aan het vrijdagprogramma.

De drie vaste sprekers staan centraal in `src/data/preacher-rotation.json`, in de volgorde Hamid, Kazem, Shahram. `startDate` is de vaste zondag waarop de eerste spreker begint (18 oktober 2026); verander deze datum niet bij het doorschuiven van de agenda. `preachers` bevat hun stabiele `id` en vertaalde `name`; eventuele aanvullende openbare informatie kan aan hetzelfde object worden toegevoegd en blijft beschikbaar als `event.preacher`. Het aantal kalenderweken sinds de startdatum bepaalt de spreker, onafhankelijk van de vier zichtbare bijeenkomsten en de zomertijd.

Een uitzondering verwijst onder `overrides` naar de spreker-ID, bijvoorbeeld `"overrides": { "2026-11-01": "hamid" }`. Verwijder die datum om de oorspronkelijke spreker terug te krijgen. Dit wijzigt geen enkele volgende week. De bestaande `speaker` bij een losse bijeenkomst blijft beschikbaar voor bijvoorbeeld een gastspreker; een expliciete uitzondering in `preacher-rotation.json` heeft voorrang. De oorspronkelijke vaste sprekernamen staan in de centrale configuratie. Op 25 oktober 2026 is zuster Sima eenmalig ingesteld via `speaker` in `events.json`; dit verandert de vaste rotatie niet. Bewaar wijzigingen aan deze JSON-bestanden in de repository en neem ze mee in deployments; ze zijn niet afhankelijk van browseropslag of een schrijfbaar serverbestandssysteem. Er is geen beheerpaneel of database in dit project. Controleer de agendalogica met `node --test tests/events.test.mjs`.

Beheer losse bijeenkomsten en afwijkingen in `src/data/events.json` en publiceer de website opnieuw na wijzigingen. Een gedateerde bijeenkomst vervangt het vaste programma van dezelfde categorie op die datum. Er is geen beheerformulier op de website. Het bestand bevat een JSON-array. Voeg bijvoorbeeld een record toe (alleen een invoervoorbeeld, geen aangekondigde bijeenkomst):

```json
[
  {
    "id": "friday-class-2027-01-08",
    "type": "friday-class",
    "date": "2027-01-08",
    "time": "20:00",
    "title": {
      "fa": "درس کلام خدا",
      "nl": "Bijbelles",
      "en": "Bible study"
    },
    "speaker": "Naam van de spreker",
    "description": {
      "fa": "موضوع جلسه",
      "nl": "Onderwerp van de bijeenkomst",
      "en": "Meeting topic"
    },
    "url": "https://example.com/meeting"
  }
]
```

- `id`: een unieke naam per bijeenkomst.
- `type`: `sermon` voor een preek, `friday-class` voor een online vrijdagles. Vrijdaglessen moeten op een vrijdag vallen.
- `date`: de datum in de Gregoriaanse kalender als `YYYY-MM-DD`.
- `time`: optioneel, in 24-uursnotatie `HH:mm`, in Nederlandse lokale tijd; zomer- of wintertijd volgt uit de datum. Zonder tijd verschijnt een melding dat de tijd nog wordt aangekondigd.
- `title`, `description`, `speaker` en `location`: optioneel, als tekst of een object met `fa`, `nl` en `en`. Een ontbrekende titel gebruikt de naam van de categorie.
- `url`: optioneel, een volledige HTTP(S)-link naar de online les of informatie over de bijeenkomst. Deel hier alleen links die openbaar mogen zijn. Links naar bijeenkomsten worden alleen bij komende programma's getoond.
- `poster`: optioneel, het pad naar de originele poster in `public/images`, bijvoorbeeld `/images/events/2026-10-18-hamid.jpg`. Posters verschijnen uitsluitend onder Afgelopen (Past), zonder bijsnijden, en kunnen op volledige grootte worden geopend. Bij een lege archiefcategorie wordt een beschikbare poster uit dezelfde categorie getoond, met de aanduiding of deze bij een komende of afgelopen bijeenkomst hoort.

Ongeldige datums, tijden, dubbele IDs en vrijdaglessen op een andere weekdag worden geweigerd. De bestaande registratie-API blijft onafhankelijk van de openbare agenda uitgeschakeld.

## Evenementregistratie opnieuw activeren

De registratiepagina en API staan standaard veilig uit. Stel deze variabelen in en voer daarna opnieuw een build/deployment uit:

- `NEXT_PUBLIC_EVENT_REGISTRATION_ENABLED=true`
- `EVENT_REGISTRATION_ENABLED=true`
- `EMAIL_USER`
- `EMAIL_PASS`
- `THIRD_PERSON_EMAIL`

Zonder beide feature flags retourneert de API een `404`. Het registratieformulier verschijnt alleen met `NEXT_PUBLIC_EVENT_REGISTRATION_ENABLED=true`; de openbare agenda blijft altijd zichtbaar in menu en sitemap.

De API accepteert maximaal 15.000 bytes JSON en vijf pogingen per IP-adres per vijftien minuten, per serverproces. De proxy moet `X-Forwarded-For` en `X-Real-IP` zelf overschrijven; vertrouw hiervoor geen bezoekersheaders. Gebruik bij meerdere instanties een gedeelde limiet bij de proxy of in een centrale opslag. Stel `NEXT_PUBLIC_SITE_URL` in op de openbare oorsprong zonder pad, bijvoorbeeld `https://lichtwereld.com`; wanneer ingesteld is dit de enige toegestane oorsprong voor registratieverzoeken.

Zie `SECURITY_REVIEW.md` voor de technische en beveiligingscontrole van 19 oktober 2026, inclusief de nog openstaande waarschuwing in een ontwikkelafhankelijkheid.


## Contactformulier op Vercel

Het contactformulier gebruikt uitsluitend Google Apps Script. Volg [de Vercel-handleiding](google-apps-script/VERCEL.md) voor de productievariabelen, de Google Script Property en de nieuwe deployment. Met npm run check:contact controleer je de verbinding zonder e-mail te versturen.
