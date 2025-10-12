"use client";

import { useIntl } from "react-intl";
import BackgroundImage from "../../components/BackgroundImage";

export default function ANBIInformationPage({ locale, setLocale }) {
  const { formatMessage } = useIntl();

  return (
    <div className="page ANBI-Information">
      {/* Header */}
      <section>
        <BackgroundImage
          url="/images/ANBI-banner.jpg"
          className="ANBIinformation"
        />
        <div className="page-content">
          <h1>
            {formatMessage({
              id: "beleidsplanTitle",
              defaultMessage:
                'Beleidsplan',
            })}
          </h1>
           <h2>
              {formatMessage({
                id: "introBibleVerse",
                defaultMessage:
                  '"En het licht schijnt in de duisternis en de duisternis heeft het niet gegrepen." (Johannes 1:5)',
              })}
            </h2>
        </div>
      </section>

      {/* Section – Inleiding / مقدمه */}
      <section className="primary">
        <div className="page-content">
          <div className="text-block">
           
            <h4>
              {formatMessage({
                id: "introText",
                defaultMessage:
                  'Christelijke Gemeente "Het Licht van de Wereld" is een jonge, dynamische en eigentijdse kerk met een grote verscheidenheid aan culturen en denominaties. De gemeente bestaat uit verschillende nationaliteiten. Wij willen zoekers helpen een toegewijd volgeling van Jezus Christus te worden en gelovigen ondersteunen om te groeien in gemeenschap en een levende relatie met Jezus Christus.',
              })}
            </h4>
          </div>
        </div>
      </section>

      {/* Section – Doelen */}
      <section className="secondary">
        <div className="page-content">
          <div className="text-block">
            <h2>
              {formatMessage({ id: "goalsTitle", defaultMessage: "Doelen" })}
            </h2>
            <ul>
              <li>
                {formatMessage({
                  id: "goal1",
                  defaultMessage:
                    "Het bevorderen van kennis van en betrokkenheid bij het christelijk geloof voor Farsi-sprekers in Nederland en buitenland.",
                })}
              </li>
              <li>
                {formatMessage({
                  id: "goal2",
                  defaultMessage:
                    "Het ondersteunen van gelovigen om te groeien in hun relatie met Jezus Christus.",
                })}
              </li>
              <li>
                {formatMessage({
                  id: "goal3",
                  defaultMessage:
                    "Het aanbieden van spirituele, educatieve en sociale activiteiten voor kinderen, jongeren en volwassenen.",
                })}
              </li>
              <li>
                {formatMessage({
                  id: "goal4",
                  defaultMessage:
                    "Het helpen van mensen met praktische uitdagingen in het dagelijks leven, inclusief ondersteuning van vluchtelingen.",
                })}
              </li>
              <li>
                {formatMessage({
                  id: "goal5",
                  defaultMessage:
                    "Het verspreiden van het evangelie door evenementen, media en persoonlijke ontmoetingen.",
                })}
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section – Activiteiten */}
      <section className="primary">
        <div className="page-content">
          <h2>
            {formatMessage({
              id: "activitiesTitle",
              defaultMessage: "Activiteiten",
            })}
          </h2>
          <ul>
            <li>
              {formatMessage({
                id: "activity1",
                defaultMessage:
                  "Diensten: Wekelijkse kerkdiensten in Almere en online, met begrijpbare uitleg van de Bijbel en ruimte voor persoonlijke ontmoeting.",
              })}
            </li>
            <li>
              {formatMessage({
                id: "activity2",
                defaultMessage:
                  "Kinderprogramma’s: Kinderen leren volgelingen van Jezus te worden en groeien in hun geloof in een liefdevolle omgeving.",
              })}
            </li>
            <li>
              {formatMessage({
                id: "activity3",
                defaultMessage:
                  "Kerngroepen: Kleine groepsbijeenkomsten door de week om te ontdekken wie Jezus is en Hem te volgen in het dagelijks leven.",
              })}
            </li>
            <li>
              {formatMessage({
                id: "activity4",
                defaultMessage:
                  "Cursussen: Praktische Bijbelcursussen om het Woord van God beter te leren begrijpen.",
              })}
            </li>
            <li>
              {formatMessage({
                id: "activity5",
                defaultMessage:
                  "Ondersteuning vluchtelingen: Betrokkenheid bij Farsi-sprekende vluchtelingen in Nederland, met aandacht voor maatschappelijke participatie zoals naturalisatie en inburgering.",
              })}
            </li>
          </ul>
        </div>
      </section>

      {/* Section – Organisatiestructuur */}
      <section className="secondary">
        <div className="page-content">
          <h2>
            {formatMessage({
              id: "structureTitle",
              defaultMessage: "Organisatiestructuur",
            })}
          </h2>
          <ul>
            <li>Voorganger: K. Dehghani</li>
            <li>Secretariaat: H. Ghanbari</li>
            <li>Penningmeester: F. Tahayori</li>
            <li>Vertegenwoordiger: S. Sasanfar</li>
            <li>
              Vrijwilligers: Ondersteunen alle activiteiten en zorgen voor een
              veilige en ondersteunende omgeving voor leden van de kerk.
            </li>
          </ul>
        </div>
      </section>

      {/* Section – Financieel beleid */}
      <section className="primary">
        <div className="page-content">
          <h2>
            {formatMessage({
              id: "financeTitle",
              defaultMessage: "Financieel beleid",
            })}
          </h2>
          <ul>
            <li>
              {formatMessage({
                id: "finance1",
                defaultMessage:
                  "Inkomsten bestaan uit donaties, giften en andere legale bronnen.",
              })}
            </li>
            <li>
              {formatMessage({
                id: "finance2",
                defaultMessage:
                  "Uitgaven worden uitsluitend gebruikt voor de doelen van de kerk.",
              })}
            </li>
            <li>
              {formatMessage({
                id: "finance3",
                defaultMessage:
                  "Jaarlijks financieel overzicht en transparante boekhouding volgens ANBI-richtlijnen.",
              })}
            </li>
          </ul>
        </div>
      </section>

      {/* Section – Evaluatie en toekomst */}
      <section className="secondary">
        <div className="page-content">
          <h2>
            {formatMessage({
              id: "futureTitle",
              defaultMessage: "Evaluatie en toekomst",
            })}
          </h2>
          <p>
            {formatMessage({
              id: "futureText",
              defaultMessage:
                "Het beleidsplan wordt jaarlijks geëvalueerd en aangepast waar nodig. De gemeente streeft naar duurzame groei in spirituele en maatschappelijke impact en wil Farsi-sprekers laten ervaren hoe het is om God te kennen en te volgen.",
            })}
          </p>
        </div>
      </section>
    </div>
  );
}
