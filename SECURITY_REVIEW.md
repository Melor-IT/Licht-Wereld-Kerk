# Technische en beveiligingscontrole — 19 oktober 2026

## Uitgevoerde correcties

- Registratie vereist beide feature flags, overeenkomstig de bestaande documentatie.
- De API controleert de echte omvang tijdens het lezen en stopt boven 15.000 bytes, ook zonder betrouwbare `Content-Length`.
- Ongeldige JSON en ongeldige UTF-8 geven 400; te grote aanvragen geven 413; een verkeerd mediatype geeft 415.
- De limiet van vijf pogingen per vijftien minuten bewaart vaste tellers voor maximaal 5.000 clients. Geblokkeerde pogingen laten geen steeds grotere lijsten achter. IP-sleutels hebben een maximale lengte.
- Een ingestelde `NEXT_PUBLIC_SITE_URL` is de enige toegestane oorsprong; de host van de aanvraag voegt dan geen extra oorsprong toe.
- E-mailadressen met adreslijsten en onjuiste gegevenstypen in velden worden geweigerd.
- Het formulier gebruikt browservalidatie voor verplichte velden, e-mail en aantallen. Ontbrekende Nederlandse en Farsi-teksten voor versturen en verzendfouten zijn aangevuld.
- `.env.*`, waaronder `.env.local`, wordt uitgesloten van Git; `.env.example` blijft toegestaan.
- `npm test` voert de bestaande agendatests en nieuwe API- en beveiligingstests uit. ESLint controleert ook `.mjs`-bestanden.

## Validatie

- `npm run lint`: geslaagd.
- `npm test`: 27 tests geslaagd. De e-mailtransportlaag is vervangen door een teststub; er zijn geen echte e-mails verzonden.
- `npm run build`: productiebuild geslaagd.
- HTTP-controle met `next start`: alle 18 pagina's in Nederlands, Farsi en Engels gaven 200, evenals 23 gebruikte lokale assets en 20 interne links. Taalaanduiding, tekstrichting, tien agendakaarten per taal, beveiligingsheaders, rootredirect, sitemap, robots en pictogrammen zijn gecontroleerd. Onbekende routes, `.env`, `.git/config` en de uitgeschakelde registratie-API gaven 404.
- `npm audit --omit=dev`: nul gemelde kwetsbaarheden in productieafhankelijkheden.
- Geen omgevingsbestanden of bestanden met sleutel-/credentialnamen aangetroffen in de bijgehouden bestandsnamen. Dit is geen volledige scan van Git-geschiedenis.

## Openstaande bevinding en grenzen

`npm audit` meldt vier hoge waarschuwingen in dezelfde ontwikkelketen: `@next/eslint-plugin-next` → `fast-glob` → `micromatch` → `braces@3.0.3`. De onderliggende melding is [GHSA-vfj7-8cjw-p6xm / CVE-2026-93687](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm): diep geneste patronen kunnen de stack uitputten. Op de controledatum noemt het advies geen gepatchte versie; de npm-registry geeft 3.0.3 als nieuwste `braces`. Ook de nieuwste Next ESLint-plugin gebruikt deze keten. De versies zijn daarom niet blind vervangen en de waarschuwing is niet onderdrukt. In dit project gebruikt de linter vaste patronen uit de repository; bezoekersinvoer gaat niet naar deze ontwikkeltool. Controleer het advies opnieuw wanneer een oplossing beschikbaar is.

De registratielimiet werkt per proces en vertrouwt proxyheaders. Zorg bij activering voor overschrijving van deze headers door de vertrouwde proxy en voor een gedeelde limiet bij meerdere instanties. Origin-validatie is geen bescherming tegen scripts buiten browsers. Registratie blijft standaard uitgeschakeld.

De bestaande CSP staat inline scripts en stijlen toe voor de statische Next.js-pagina's; bescherming tegen inline-scriptinjectie is daardoor beperkt. Externe scripts, framing en objecten zijn wel beperkt. De gecontroleerde JSON-LD ontsnapt `<` en registratie-e-mails ontsnappen HTML.

De controle betreft de lokale broncode en een lokale productiebuild, uitgevoerd met Node 25.8.1; het project vraagt Node 22.x. Er is geen browserautomatisering, echte SMTP-verzending of controle van de gepubliceerde server, TLS-inrichting en hostingconfiguratie uitgevoerd. Het resultaat is geen garantie dat alle kwetsbaarheden zijn gevonden.
