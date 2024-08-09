import React from "react";
import PageHeader from "./../images/pageHeader.jpeg";
import Beliefs from "./../images/Beliefs.jpg";
import Services from "./../images/Services.jpg";
import HetLicht from "./../images/HetLicht.jpeg";
import Vision from "./../images/Vision.jpg";
import Activities from "./../images/Activities.jpg";

export default function home() {
  return (
    <div className="home">
      <img src={PageHeader} alt="Person holding a cat" />
      <h1 className="text">Welkom bij kerk licht van de wereld </h1>'
      <div className="container">
        <div className="clo 1">
          <img src={Vision} alt="Person holding a cat" />
          <div className="box">
            <h3>Onze visie</h3>
            <p>
              Onze visie is om Farsi sprekende in Nederland naar redding,
              genezing, vrijheid en een zegevierend leven te leiden om Jeremia
              49 te vervullen. Onze Missie: Wij zijn een gemeente die levend wil
              houden wat zich hier in Nederland als Evangelische kerk heeft
              ontwikkeld. De manier van vieren, waarbij muziek en zang en de
              wisselwerking tussen voorganger en gemeente, een grote rol speelt.
              Wij denken ook aan het gaan staan bij de lezing van het evangelie.
              Onze gemeente zal daarbij ook stil staan bij Farsi sprekende
              gelovigen om hier in Nederland met vrijheid de woord van God te
              bedienen. Onze waarden: Onze waarden beschrijven de kern
              kwaliteiten die wij willen vormgeven bij het uitvoeren van onze
              visie en missie. Aandacht voor persoonlijke bekering en
              geloofsbeleving, sociale betrokkenheid, Aandacht voor positie van
              gezinsleden. Maleachi 4:6 Onze overtuigingen: Onze
              geloofsverklaringen zijn niet allesomvattend voor alle aspecten
              van het leven en geloof, maar zijn een samenvatting van onze
              overtuigingen als een gemeenschap van volgelingen van Christus.
              <br />
              Op 10 mei 2023 zijn de onderstaande bestuursleden gestart met het
              oprichten van de kerk Het Licht van de wereld te Almere.
            </p>
          </div>
        </div>
        <div className="clo 2">
          <img src={Beliefs} alt="Person holding a cat" />
          <div className="box">
            <h3>Onze overtuigingen</h3>
            <p>
              Onze geloofsverklaringen zijn niet allesomvattend voor alle
              aspecten van het leven en geloof, maar zijn een samenvatting van
              onze overtuigingen als een gemeenschap van volgelingen van
              Christus.
              <br />
              Het Evangelie Wij geloven dat het evangelie van grote waarde is,
              niet alleen voor kerkmensen, maar voor iedereen. Onze Kerk is een
              interkerkelijke commissie die actief wil zijn om deze waarde aan
              iedereen te laten zien en daarom het evangelie wil communiceren.
              <br />
              We willen het goede nieuws van Jezus presenteren bij diverse
              evenementen in Almere en omgeving .We zetten ons ook in voor de
              verspreiding media.
            </p>
          </div>
        </div>
        <div className="clo 3">
          <img src={HetLicht} alt="Person holding a cat" />
          <div className="box">
            <h3>Wie is Het Licht van de wereld kerk?</h3>
            <p>
              Christelijke gemeente “Het licht van de wereld” is een jonge
              dynamische en eigentijdse Christelijke kerk met een grote
              verscheidenheid aan culturen en denominaties. De gemeente bestaat
              inmiddels uit verschillende nationaliteiten. Het licht van de
              wereld kerk wil zoekers helpen om een toegewijd volgeling van
              Jezus Christus te worden en gelovigen helpen om te groeien in
              gemeenschap en een levende relatie met Jezus Christus. De gemeente
              biedt diverse activiteiten en cursussen aan die Farsi sprekers in
              Nederland en buitenland. Het licht van de wereld kerk wil Farsi
              sprekers laten kennis maken met het christelijk geloof en hen wil
              laten ervaren hoe het is om God te kennen en te volgen. De
              gemeente doet haar activiteiten vanuit de belofte die aan het
              begin in Almere is gegeven: Handelingen 18: “Wees niet bevreesd,
              spreek en zwijg niet, want Ik ben met u niemand zal de hand aan u
              slaan om u kwaad te dien, want Ik heb veel volk in deze stad”. De
              Kerk is actief op een locatie in Almere en heeft een aanbod voor
              kinderen, jongeren, volwassenen. Ook willen we als kerk mensen
              helpen met de praktische uitdagingen die het leven soms te bieden
              heeft.
            </p>
          </div>
        </div>
        <div className="clo 4">
          <img src={Services} alt="Person holding a cat" />
          <div className="box 4">
            <h3>Diensten</h3>
            <p>
              Elke zondag vinden er diensten plaats in Almere maar ook via
              andere media. In de diensten wordt in begrijpbare taal uitleg
              gegeven vanuit de Bijbel. Na de dienst is er ruimte voor
              persoonlijke ontmoeting. Kinderen zijn van harte welkom bij de
              kinderprogramma’s tijdens de diensten! Kinderen leren de
              volgelingen van de Heere Jezus te worden en de kinderen die Hem al
              volgen helpen we te groeien in hun relatie met Jezus Christus. In
              een liefdevolle omgeving geven medewerkers de Bijbelverhalen en
              lessen door uit de Bijbel, Gods Woord en beleven ze samen met de
              kinderen de steun van geloven en bidden.
            </p>
          </div>
        </div>
        <div className="clo 5">
          <img src={Activities} alt="Person holding a cat" />
          <div className="box 5">
            <h3>Kerngroepen Activiteiten</h3>
            <p>
              Ontdekken wie Jezus is en Hem volgen in het dagelijks leven kunnen
              we niet alleen. Daarom komen we doordeweeks samen in kleine
              groepen. Cursussen De cursus in de Bijbel helpt om praktisch de
              Bijbel te leren lezen. Hulpen Vluchtelingen Zowel ons visie als
              missie is om voor Farsi sprekende vluchtelingen in Nederland
              centraal te staan. In eerste instantie om de vluchtelingen te
              betrekken met de omgeving. Daarnaast om aandacht te geven voor
              participatie maatschappij zoals ondersteunen bij naturalisatie en
              inburgering.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
