import React from "react";

export default function footer() {
  return (
    <footer className="bg-body-tertiary text-center">
      {/* <!-- Grid container --> */}
      <div className="container p-4 pb-0">
        {/* <!-- Section: Social media --> */}
        <section class="mb-4">
          {/* <!-- Facebook --> */}
          <a
            data-mdb-ripple-init
            className="btn text-white btn-floating m-1"
            styles="background-color: #3b5998;"
            href="#!"
            role="button">
            <i className="fab fa-facebook-f"></i>
          </a>

          {/* <!-- Twitter --> */}
          <a
            data-mdb-ripple-init
            className="btn text-white btn-floating m-1"
            styles="background-color: #55acee;"
            href="#!"
            role="button">
            <i className="fab fa-twitter"></i>
          </a>

          {/* <!-- Google --> */}
          <a
            data-mdb-ripple-init
            className="btn text-white btn-floating m-1"
            styles="background-color: #dd4b39;"
            href="#!"
            role="button">
            <i className="fab fa-google"></i>
          </a>

          {/* <!-- Instagram --> */}
          <a
            data-mdb-ripple-init
            className="btn text-white btn-floating m-1"
            styles="background-color: #ac2bac;"
            href="#!"
            role="button">
            <i className="fab fa-instagram"></i>
          </a>

          {/* <!-- Linkedin --> */}
          <a
            data-mdb-ripple-init
            className="btn text-white btn-floating m-1"
            styles="background-color: #0082ca;"
            href="#!"
            role="button">
            <i className="fab fa-linkedin-in"></i>
          </a>

          <a
            data-mdb-ripple-init
            className="btn text-white btn-floating m-1"
            styles="background-color: #333333;"
            href="#!"
            role="button">
            <i className="fab fa-github"></i>
          </a>
        </section>
        {/* <!-- Section: Social media --> */}
      </div>
      {/* <!-- Grid container --> */}

      <div
        className="text-center p-3"
        styles="background-color: rgba(0, 0, 0, 0.05);">
        © 2024 Copyright:
        <a className="text-body" href="https://github.com/hghanbari/">
          Made by Hamid Ghanbari
        </a>
      </div>
    </footer>
  );
}
