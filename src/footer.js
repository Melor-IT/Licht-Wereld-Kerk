import React from "react";

export default function footer() {
  return (
    <footer className="footer">
      <div className="info">
        <div className="clo">
          <h4>Bezoekadres</h4>
          <p>Parkwijklaan 5, 1326AX Almere Nederland</p>
        </div>
        <div className="clo">
          <h4>Correspondentieadres</h4>
          <p>Alseïdenstraat 20-2, 1363SR Almere</p>
        </div>
        <div className="cl0">
          <h4>KVK</h4>
          <p></p>
        </div>
      </div>
      <div className="services">
        <h4>Diensten</h4>
        <p>
          Ieder eerste en derde zondag van de maand vinden de kerk bijeenkomsten
          op locatie plaats.
          <br />
          Op zondagen waarbij er geen fysieke bijeenkomst plaats vindt, zullen
          deze via Zoom gehouden worden.
        </p>
        {/* <span>2024 Copyright:Made by Hamid Ghanbari</span> */}
      </div>
      <div className="contact">
        <h4>Contact</h4>
        <div>
          <span className="icon-phone">
            <a href="" />
          </span>
          <span className="icon-envelop">
            <a href="lichtwereldkerk2022@gmail.com" />
          </span>
          <span className="icon-youtube">
            <a href="https://www.youtube.com/@LichtWereldKerk" />
          </span>
          <span className="icon-instagram">
            <a href="https://www.instagram.com/noorejahan_farsi_church?igsh=MTA1djZzdnByeHJldQ==" />
          </span>
        </div>
      </div>
    </footer>
  );
}
