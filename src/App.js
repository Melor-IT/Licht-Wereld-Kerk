import React from "react";
import "./style/main.css";
import Footer from "./footer";
import Header from "./header";
import Home from "./pages/home";
import Contact from "./pages/contact";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <main className="app">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/" element={<Contact />} />
        </Routes>
        <Footer />
      </main>
    </BrowserRouter>
  );
}

export default App;
